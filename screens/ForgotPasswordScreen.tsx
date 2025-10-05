import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const { sendOTP } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleForgotPassword = async () => {
    if (method === 'email') {
      if (!email || !email.includes('@')) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }
    } else {
      if (!phone || phone.length < 8) {
        Alert.alert('Error', 'Please enter a valid phone number');
        return;
      }
    }
    setIsLoading(true);
    try {
      const identifier = method === 'email' ? email : phone;
      const result = await sendOTP(identifier, 'PASSWORD_RESET');
      if (result.success) {
        Alert.alert('Success', `Password reset instructions sent to your ${method}.`);
        navigation.goBack();
      } else {
        Alert.alert('Error', result.error || `Failed to send password reset to your ${method}.`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to send password reset to your ${method}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>🔐</Text>
          </View>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Don't worry! It happens. Please enter the details to reset your password.
          </Text>
        </View>

        <View style={styles.formCard}>
          {/* Method Selection */}
          <View style={styles.methodContainer}>
            <TouchableOpacity
              style={[
                styles.methodButton,
                method === 'email' && styles.methodButtonActive
              ]}
              onPress={() => setMethod('email')}
              disabled={isLoading}
            >
              <Text style={styles.methodIcon}>📧</Text>
              <Text style={[
                styles.methodText,
                method === 'email' && styles.methodTextActive
              ]}>
                Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodButton,
                method === 'phone' && styles.methodButtonActive
              ]}
              onPress={() => setMethod('phone')}
              disabled={isLoading}
            >
              <Text style={styles.methodIcon}>📱</Text>
              <Text style={[
                styles.methodText,
                method === 'phone' && styles.methodTextActive
              ]}>
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {method === 'email' ? 'Email Address' : 'Phone Number'}
            </Text>
            <View style={[
              styles.inputWrapper,
              focusedInput === method && styles.inputWrapperFocused
            ]}>
              <Text style={styles.inputIcon}>
                {method === 'email' ? '✉️' : '📞'}
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder={method === 'email' ? 'your.email@example.com' : '+1 (555) 000-0000'}
                placeholderTextColor="#9CA3AF"
                value={method === 'email' ? email : phone}
                onChangeText={method === 'email' ? setEmail : setPhone}
                autoCapitalize="none"
                keyboardType={method === 'email' ? 'email-address' : 'phone-pad'}
                onFocus={() => setFocusedInput(method)}
                onBlur={() => setFocusedInput(null)}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled
            ]} 
            onPress={handleForgotPassword} 
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.submitButtonText}>Sending...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Text style={[
              styles.cancelButtonText,
              isLoading && styles.cancelButtonTextDisabled
            ]}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            💡 You'll receive a link to reset your password
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  methodContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  methodButtonActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  methodIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  methodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  methodTextActive: {
    color: '#4F46E5',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  inputWrapperFocused: {
    borderColor: '#4F46E5',
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonTextDisabled: {
    color: '#9CA3AF',
  },
  helpContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});