import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import storage from '../services/storage.js';
import { apiClient } from '../services/apiClient';

interface User {
  id: string;
  email: string;
  username?: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  subscriptionType: 'FREE' | 'PREMIUM';
  isPremium?: boolean; // Legacy support for existing code
  profileImage?: string;
  phoneNumber?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasPremiumAccess: () => boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  googleLogin: (googleIdToken: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
  sendOTP: (identifier: string, type?: string) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (identifier: string, otp: string, type?: string) => Promise<{ success: boolean; error?: string }>;
  checkFeatureAccess: (feature: string) => { hasAccess: boolean; isLimited?: boolean };
}

interface LoginCredentials {
  identifier: string; // email, username, or phone
  password: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fallback credentials for demo/development
const DEMO_CREDENTIALS = {
  admin: { email: 'admin@ideaspark.com', password: 'admin123' }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
  const token = await storage.getItem('authToken');
  const userData = await storage.getItem('userData');
      
      if (token && userData) {
        await apiClient.setToken(token);
        const parsedUser = JSON.parse(userData);
        // Normalize premium flag from subscriptionType for legacy support
        parsedUser.isPremium = parsedUser.isPremium ?? (parsedUser.subscriptionType === 'PREMIUM');
        setUser(parsedUser);
        
        // Try to refresh user data from server
        try {
          await refreshUser();
        } catch (error) {
          console.warn('Failed to refresh user data, using cached data:', error);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      
      // Only try backend login
      try {
        // Support MultiLoginRequest: send loginIdentifier + password (+ optional loginType)
        const loginIdentifier = (credentials as any).identifier || (credentials as any).email || (credentials as any).username || (credentials as any).phone;
        const loginType = (credentials as any).loginType || undefined;
        const response = await apiClient.multiLogin(loginIdentifier, credentials.password, loginType);

        // Normalize a few possible response shapes from backend
        let token: any = null;
        let refreshToken: any = null;
        let userData: any = null;

        if (response) {
          if (response.data) {
            token = response.data.token || response.data?.accessToken || null;
            refreshToken = response.data.refreshToken || response.data?.refresh || null;
            userData = response.data.user || response.data;
          } else {
            // Response may already be the payload
            token = response.token || response?.accessToken || null;
            refreshToken = response.refreshToken || response?.refresh || null;
            userData = response.user || response;
          }
        }

        if (!token) {
          console.error('Login failed — missing token in response', { response });
          return { success: false, error: (response && (response.message || (response.data && response.data.message))) || 'Login failed: invalid response from server' };
        }

        await apiClient.setToken(token);
        if (refreshToken) await storage.setItem('refreshToken', refreshToken);

        // Normalize premium flag
        try {
          userData = userData || {};
          userData.isPremium = userData.isPremium ?? (userData.subscriptionType === 'PREMIUM');
          await storage.setItem('userData', JSON.stringify(userData));
          setUser(userData);
        } catch (e) {
          console.warn('Failed to persist user data after login', e);
        }

        return { success: true };
      } catch (backendError) {
        console.error('Backend login failed:', backendError);
        return { success: false, error: backendError.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      const response = await apiClient.register(userData);
      
      const { token, user: newUser } = response.data;
      
  await apiClient.setToken(token);
  newUser.isPremium = newUser.isPremium ?? (newUser.subscriptionType === 'PREMIUM');
  await storage.setItem('userData', JSON.stringify(newUser));
  setUser(newUser);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (googleIdToken: string) => {
    try {
      setLoading(true);
      const response = await apiClient.googleLogin(googleIdToken);
      
  const { token, refreshToken, user: userData } = response.data;
      
    await apiClient.setToken(token);
    await storage.setItem('refreshToken', refreshToken);
    userData.isPremium = userData.isPremium ?? (userData.subscriptionType === 'PREMIUM');
    await storage.setItem('userData', JSON.stringify(userData));
      
    setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: error.message || 'Google login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (profileData: any) => {
    try {
      const response = await apiClient.updateProfile(profileData);
      const updatedUser = { ...user, ...response.data };
      
  setUser(updatedUser);
  await storage.setItem('userData', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message || 'Profile update failed' };
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.getProfile();
      const userData = response.data;
      userData.isPremium = userData.isPremium ?? (userData.subscriptionType === 'PREMIUM');
      setUser(userData);
      await storage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Refresh user error:', error);
      throw error;
    }
  };

  const sendOTP = async (identifier: string, type: string = 'EMAIL_VERIFICATION') => {
    try {
      await apiClient.sendOTP(identifier, type);
      return { success: true };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, error: error.message || 'Failed to send OTP' };
    }
  };

  const verifyOTP = async (identifier: string, otp: string, type: string = 'EMAIL_VERIFICATION') => {
    try {
      await apiClient.verifyOTP(identifier, otp, type);
      return { success: true };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, error: error.message || 'OTP verification failed' };
    }
  };

  const checkFeatureAccess = (feature: string): { hasAccess: boolean; isLimited?: boolean } => {
    if (!user) return { hasAccess: false };

    // Admin has access to all features
    if (user.role === 'ADMIN') return { hasAccess: true };

    // Premium features (we'll normalize keys so callers can use different naming styles)
    const premiumFeatures = ['newsDetector', 'imageGenerator', 'codeAssistant', 'voiceTools', 'exportData'];
    const normalize = (s: string) => s.replace(/[^a-z0-9]/gi, '').toLowerCase();
    const normalizedFeature = normalize(feature);
    const premiumNormalized = premiumFeatures.map(f => normalize(f));

    if (premiumNormalized.includes(normalizedFeature)) {
      const hasAccess = user.isPremium === true || user.subscriptionType === 'PREMIUM';
      // For free users, optionally implement usage limits per day. For now, we mark isLimited=false.
      return { hasAccess, isLimited: false };
    }

    // Free features available to all authenticated users
    return { hasAccess: true };
  };

  const hasPremiumAccess = (): boolean => {
    if (!user) return false;
    return user.isPremium === true || user.subscriptionType === 'PREMIUM' || user.role === 'ADMIN';
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    hasPremiumAccess,
    login,
    register,
    googleLogin,
    logout,
    updateProfile,
    refreshUser,
    sendOTP,
    verifyOTP,
    checkFeatureAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};