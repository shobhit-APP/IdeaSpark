import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext'; 
import { apiClient } from '../services/apiClient'; 

interface RegisterScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

interface FormData {
  name: string;
  email: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
  image?: string; // base64 or uri
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    image: undefined,
  });
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, refreshUser } = useAuth();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setFormData(prev => ({ ...prev, image: asset.base64 }));
      setImagePreview(asset.uri);
    }
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;
    
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Build payload; if imagePreview exists include it so apiClient.register will send multipart/form-data
      const registerPayload: any = {
        email: formData.email,
        username: formData.email ? formData.email.split('@')[0] : formData.name.replace(/\s+/g, '').toLowerCase(),
        password: formData.password,
        fullName: formData.name,
        phoneNumber: formData.phoneNumber,
      };

      if (imagePreview) {
        registerPayload.profileImage = imagePreview;
      }

      // Call apiClient.register directly to get created user's id for verification
      const response = await apiClient.register(registerPayload);
      const createdUser = (response && response.data && (response.data.user || response.data)) || null;
      const userId = createdUser && (createdUser.id || createdUser._id || createdUser.userId);

      if (userId) {
        Alert.alert('Success', 'Registration successful! Please verify your email.');
        navigation.navigate('VerifyEmail', { userId });
      } else {
        // Fallback: if backend auto-logs in and returns token, call existing register flow to preserve behavior
        const fallback = await register(registerPayload);
        if (fallback.success) {
          Alert.alert('Success', 'Registration successful! Welcome to IdeaSpark!');
          navigation.navigate('Home');
        } else {
          Alert.alert('Registration Failed', fallback.error || 'Something went wrong. Please check your email to verify your account.');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registration Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.contentContainer}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Ionicons name="bulb" size={40} color="#667eea" />
                </View>
                <Text style={styles.appName}>IdeaSpark</Text>
                <Text style={styles.tagline}>Create Your Account</Text>
              </View>

              <View style={styles.formContainer}>
                {/* Image Upload */}
                <View style={styles.inputContainer}>
                  <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
                    <Ionicons name="image-outline" size={24} color="#667eea" />
                    <Text style={styles.imagePickerText}>Upload Profile Image</Text>
                  </TouchableOpacity>
                  {imagePreview && (
                    <Image source={{ uri: imagePreview }} style={styles.imagePreview} />
                  )}
                </View>
                {/* Name Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color="#8e8e93" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Full Name"
                      placeholderTextColor="#8e8e93"
                      value={formData.name}
                      onChangeText={(text) => handleInputChange('name', text)}
                      autoCapitalize="words"
                      autoComplete="name"
                    />
                  </View>
                </View>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#8e8e93" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Email Address"
                      placeholderTextColor="#8e8e93"
                      value={formData.email}
                      onChangeText={(text) => handleInputChange('email', text)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </View>
                </View>

                {/* Phone Number Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="call-outline" size={20} color="#8e8e93" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Phone Number (optional)"
                      placeholderTextColor="#8e8e93"
                      value={formData.phoneNumber}
                      onChangeText={(text) => handleInputChange('phoneNumber', text)}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#8e8e93" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Password"
                      placeholderTextColor="#8e8e93"
                      value={formData.password}
                      onChangeText={(text) => handleInputChange('password', text)}
                      secureTextEntry={!showPassword}
                      autoComplete="password-new"
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#8e8e93"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#8e8e93" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Confirm Password"
                      placeholderTextColor="#8e8e93"
                      value={formData.confirmPassword}
                      onChangeText={(text) => handleInputChange('confirmPassword', text)}
                      secureTextEntry={!showConfirmPassword}
                      autoComplete="password-new"
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#8e8e93"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Register Button */}
                <TouchableOpacity
                  style={[styles.loginButton, isLoading && styles.disabledButton]}
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.buttonGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.loginButtonText}>Create Account</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Login Link */}
                <View style={styles.linkContainer}>
                  <Text style={styles.linkText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.linkButton}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  gradient: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formContainer: {
    // gap: 16, // Remove this line as gap is not supported in older React Native versions
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#374151',
  },
  eyeButton: {
    padding: 4,
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  linkButton: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    marginTop: 8,
  },
  imagePickerText: {
    color: '#667eea',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
});