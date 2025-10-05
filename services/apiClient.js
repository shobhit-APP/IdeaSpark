// services/apiClient.js
import { Alert, Platform } from 'react-native';
import Constants from 'expo-constants';
import storage from './storage.js';

// Resolve a dev host that's reachable from device/emulator:
// - If running in Expo, Constants.manifest.debuggerHost contains '<host>:<port>' (packager host).
// - Use that host for backend calls on dev machines. For Android emulators falling back to 10.0.2.2 if needed.
let devHost = 'localhost';
try {
  // Try multiple locations where the packager/host may be exposed across Expo SDK versions
  const dbg = Constants?.manifest?.debuggerHost
    || Constants?.debuggerHost
    || Constants?.expoConfig?.hostUri
    || (Constants?.manifest2 && Constants.manifest2.debuggerHost);

  if (dbg) {
    devHost = dbg.split(':')[0];
  }
} catch (e) {
  // ignore
}

// Only map to emulator host when we can confidently detect an emulator (isDevice === false).
// If Constants.isDevice is undefined, prefer leaving devHost as detected above (packager host or localhost).
if (Platform.OS === 'android') {
  const isDeviceKnown = typeof Constants.isDevice === 'boolean';
  const isEmulator = isDeviceKnown ? !Constants.isDevice : false;
  if (isEmulator) {
    // Android emulators may need 10.0.2.2 to reach host machine.
    if (!devHost || devHost === 'localhost' || devHost === '127.0.0.1') {
      devHost = '10.0.2.2';
    }
  }
}

// The backend is mounted under the '/api' context path (Tomcat shows context '/api'). Include it in dev URL.
const API_BASE_URL = __DEV__
  ? `http://${devHost}:8080/api`
  : 'https://api.ideaspark.com';

// Debug: print the resolved API base URL in development so Metro logs show what the app is calling.
if (__DEV__) {
  try {
    // eslint-disable-next-line no-console
  console.log('[apiClient] Using API_BASE_URL =', API_BASE_URL);
  console.log('[apiClient] Constants.isDevice =', Constants.isDevice);
  console.log('[apiClient] Constants.manifest.debuggerHost =', Constants?.manifest?.debuggerHost);
  console.log('[apiClient] Constants.debuggerHost =', Constants?.debuggerHost);
  console.log('[apiClient] devHost detected =', devHost);
  console.log('[apiClient] Platform.OS =', Platform.OS);
  } catch (e) {}
}

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  async setToken(token) {
    this.token = token;
    await storage.setItem('authToken', token);
  }

  async getToken() {
    if (!this.token) {
      this.token = await storage.getItem('authToken');
    }
    return this.token;
  }

  async clearToken() {
    this.token = null;
    await storage.deleteItem('authToken');
    await storage.deleteItem('refreshToken');
    await storage.deleteItem('userData');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = await this.getToken();

    // Build headers but don't force JSON content-type when a FormData body is used.
    const headers = {
      ...(options.headers || {}),
    };

    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

    if (!isFormData && !headers['Content-Type'] && !headers['content-type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (token && !options.skipAuth) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      if (__DEV__) {
        try {
          // eslint-disable-next-line no-console
          console.log('[apiClient] Request:', { url, method: options.method || 'GET', skipAuth: !!options.skipAuth });
        } catch (e) {}
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const status = response.status;

      // Handle token expiration early
      if (status === 401 && !options.skipAuth) {
        await this.handleTokenExpiration();
        const err = new Error('Session expired. Please login again.');
        err.status = status;
        throw err;
      }

      // Parse response text safely
      const text = await response.text();
      let parsed = null;
      try {
        parsed = text ? JSON.parse(text) : null;
      } catch (e) {
        // Keep raw text for non-JSON responses
        parsed = text;
      }

      if (__DEV__) {
        try {
          // eslint-disable-next-line no-console
          console.log('[apiClient] Response:', { url, status, parsed: typeof parsed === 'string' ? parsed.substring(0, 200) : parsed });
        } catch (e) {}
      }

      if (!response.ok) {
        const message = parsed && (parsed.message || parsed.error || parsed.msg) ? (parsed.message || parsed.error || parsed.msg) : `HTTP ${status}`;
        const err = new Error(message);
        err.status = status;
        err.response = parsed;
        err.url = url;
        // eslint-disable-next-line no-console
        if (__DEV__) console.error('[apiClient] HTTP error', { url, status, parsed });
        throw err;
      }

      // Return parsed body for callers (preserve existing shape)
      return parsed;
    } catch (error) {
      // Include URL and options (without body) to aid debugging network failures
      try {
        // eslint-disable-next-line no-console
        console.error('API Error:', { url, options: { ...options, body: options && options.body ? '[body omitted]' : undefined }, error });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('API Error:', error);
      }
      throw error;
    }
  }

  async handleTokenExpiration() {
    try {
      const refreshToken = await storage.getItem('refreshToken');
      if (refreshToken) {
        // Backend expects the refresh token in the Authorization header as Bearer <refreshToken>
        const res = await fetch(`${this.baseURL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${refreshToken}`,
            'Content-Type': 'application/json'
          }
        });

        const json = await res.json().catch(() => null);
        if (res.ok && json && json.data && json.data.token) {
          await this.setToken(json.data.token);
          if (json.data.refreshToken) {
            await storage.setItem('refreshToken', json.data.refreshToken);
          }
          return;
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    
    await this.clearToken();
  }

  // Authentication APIs
  async register(userData) {
    // If a profile image URI is provided, send multipart/form-data using the exact field names the backend expects.
    if (userData && (userData.profileImage || userData.imageUri)) {
      const imageUri = userData.profileImage || userData.imageUri;
      const formData = new FormData();
      // Required fields
      if (userData.email) formData.append('email', userData.email);
      if (userData.password) formData.append('password', userData.password);
      if (userData.fullName) formData.append('fullName', userData.fullName);
      if (userData.role) formData.append('role', userData.role);

      // Append profileImage file (backend expects key 'profileImage')
      formData.append('profileImage', {
        uri: imageUri,
        name: 'profile.jpg',
        type: 'image/jpeg'
      });

      return this.request('/auth/register', {
        method: 'POST',
        body: formData,
        // Let request() detect FormData and avoid forcing Content-Type
        skipAuth: true
      });
    }

    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      skipAuth: true
    });
  }

  async login(credentials) {
    // Backend login endpoint expects { email, password } but we allow flexible credentials
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        ...credentials,
        deviceInfo: 'React Native App v1.0'
      }),
      skipAuth: true
    });
  }

  // Multi-login: accepts a single identifier (username/email/phone) + password
  async multiLogin(loginIdentifier, password, loginType) {
    return this.request('/auth/multi-login', {
      method: 'POST',
      body: JSON.stringify({ loginIdentifier, password, loginType, deviceInfo: 'React Native App v1.0' }),
      skipAuth: true
    });
  }

  async googleLogin(googleIdToken) {
    return this.request('/auth/google-login', {
      method: 'POST',
      body: JSON.stringify({
        googleIdToken,
        deviceInfo: 'React Native App v1.0'
      }),
      skipAuth: true
    });
  }

  async sendOTP(identifier, type = 'EMAIL_VERIFICATION') {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier, type }),
      skipAuth: true
    });
  }

  // Verify email endpoint (expects { userId, otp })
  async verifyEmail(userId, otp) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ userId, otp })
    });
  }

  async verifyOTP(identifier, otp, type = 'EMAIL_VERIFICATION') {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier, otp, type }),
      skipAuth: true
    });
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.clearToken();
    }
  }

  // User Management APIs
  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async uploadProfileImage(imageUri) {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg'
    });

    return this.request('/users/profile-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    });
  }

  async changePassword(passwordData) {
    return this.request('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData)
    });
  }

  // Subscription APIs
  async getSubscriptionStatus() {
    return this.request('/subscription/status');
  }

  async upgradeSubscription(planData) {
    return this.request('/subscription/subscribe', {
      method: 'POST',
      body: JSON.stringify(planData)
    });
  }

  async getSubscriptionPlans() {
    return this.request('/subscription/plans', { skipAuth: true });
  }

  // Export APIs
  async exportIdeasPDF(exportOptions) {
    const response = await fetch(`${this.baseURL}/export/ideas/pdf`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await this.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(exportOptions)
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }

  async getExportStats() {
    return this.request('/export/stats');
  }

  async previewExport(previewData) {
    return this.request('/export/preview', {
      method: 'POST',
      body: JSON.stringify(previewData)
    });
  }
}

export const apiClient = new ApiClient();