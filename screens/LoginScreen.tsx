<View style={loginStyles.divider} />
import * as React from 'react';
import { useState } from 'react';
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
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { loginStyles } from '../styles';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [usePhone, setUsePhone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const { login, sendOTP } = useAuth();

  const handleSubmit = async () => {
    const identifier = usePhone ? phone : email;
    if (!identifier || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
  const result = await login({ identifier, password });
      if (result.success) {
        Alert.alert('🎉 Success!', 'Welcome to IdeaSpark! Login successful.', [
          {
            text: 'Continue',
            style: 'default',
          }
        ]);
      } else {
        Alert.alert('❌ Login Failed', result.error || 'Invalid email or password. Please check your credentials and try again.', [
          {
            text: 'Try Again',
            style: 'default',
          }
        ]);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('❌ Login Failed', 'Invalid email or password. Please check your credentials and try again.', [
        {
          text: 'Try Again',
          style: 'default',
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail || !forgotEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    try {
      const result = await sendOTP(forgotEmail, 'PASSWORD_RESET');
      if (result.success) {
        Alert.alert('Success', 'Password reset instructions sent to your email.');
        setShowForgotModal(false);
        setForgotEmail('');
      } else {
        Alert.alert('Error', result.error || 'Failed to send password reset email.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send password reset email.');
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@ideaspark.com');
    setPassword('admin123');
  };

  const fillUserCredentials = () => {
    setEmail('user@ideaspark.com');
    setPassword('user123');
  };

  return (
    <SafeAreaView style={loginStyles.container} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={['#4F46E5', '#7C3AED', '#EC4899']}
        style={loginStyles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={loginStyles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={loginStyles.mainScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
            
            {/* Logo Section */}
            <View style={loginStyles.mainLogoSection}>
              <View style={loginStyles.mainLogoContainer}>
                <Ionicons name="bulb" size={60} color="#FFFFFF" />
              </View>
              <Text style={loginStyles.mainAppName}>IdeaSpark</Text>
              <Text style={loginStyles.appTagline}>Your AI-Powered Creative Assistant</Text>
            </View>

            {/* Welcome Card */}
            <View style={loginStyles.welcomeCard}>
              <Text style={loginStyles.welcomeTitle}>Welcome Back! �</Text>
              <Text style={loginStyles.welcomeSubtitle}>Sign in to unlock your creative potential</Text>
            </View>

            {/* Demo Credentials removed per request */}

            {/* Login Form */}
            <View style={loginStyles.formCard}>
              <View style={loginStyles.mainInputGroup}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={loginStyles.mainInputLabel}>{usePhone ? 'Phone Number' : 'Email Address'}</Text>
                  <TouchableOpacity onPress={() => setUsePhone(!usePhone)}>
                    <Text style={{ color: '#4F46E5', fontWeight: '600' }}>{usePhone ? 'Use Email' : 'Use Phone'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={loginStyles.inputWrapper}>
                  <Ionicons name={usePhone ? "call" : "mail"} size={20} color="#6B7280" style={loginStyles.mainInputIcon} />
                  <TextInput
                    style={loginStyles.textInput}
                    value={usePhone ? phone : email}
                    onChangeText={usePhone ? setPhone : setEmail}
                    placeholder={usePhone ? "Enter your phone" : "Enter your email"}
                    placeholderTextColor="#9CA3AF"
                    keyboardType={usePhone ? "phone-pad" : "email-address"}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={loginStyles.mainInputGroup}>
                <Text style={loginStyles.mainInputLabel}>Password</Text>
                <View style={loginStyles.inputWrapper}>
                  <Ionicons name="lock-closed" size={20} color="#6B7280" style={loginStyles.mainInputIcon} />
                  <TextInput
                    style={loginStyles.textInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={loginStyles.eyeButton}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={[loginStyles.signInButton, isLoading && loginStyles.signInButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={isLoading ? ['#9CA3AF', '#6B7280'] : ['#4F46E5', '#7C3AED']}
                  style={loginStyles.mainButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  )}
                  <Text style={loginStyles.signInButtonText}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
<TouchableOpacity
  style={loginStyles.forgotPassword}
  onPress={() => {
    console.log('Navigating to ForgotPassword');
    navigation.navigate('ForgotPassword');
  }}
>
  <Text style={loginStyles.mainForgotPasswordText}>Forgot Password?</Text>
</TouchableOpacity>

              {/* Register Link/Button */}
              <TouchableOpacity
                style={loginStyles.registerButton}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={loginStyles.registerButtonText}>
                  Don't have an account? Register
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={loginStyles.mainFooterSection}>
              <Text style={loginStyles.footerBrand}>IdeaSpark AI Platform</Text>
              <Text style={loginStyles.footerVersion}>Version 1.0.0 • Powered by AI</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = loginStyles;
