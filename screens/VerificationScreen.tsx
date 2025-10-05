import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../services/apiClient.js';

export default function VerificationScreen({ navigation, route }: any) {
  const initialUserId = route?.params?.userId || '';
  const initialEmail = route?.params?.email || '';
  const [userId, setUserId] = useState(initialUserId);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { sendOTP } = useAuth();

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    setResendDisabled(countdown > 0);
  }, [countdown]);

  const startCooldown = (secs = 30) => {
    setCountdown(secs);
    setResendDisabled(true);
  };

  const handleResend = async () => {
    // Try to resend to email if available, otherwise use userId
    const identifier = email || userId;
    if (!identifier) {
      Alert.alert('Info', 'No email or user id available to resend OTP.');
      return;
    }
    try {
      setIsLoading(true);
      const res = await sendOTP(identifier, 'EMAIL_VERIFICATION');
      if (res && res.success) {
        Alert.alert('OTP Sent', 'A new OTP has been sent to your email.');
        startCooldown(30);
      } else {
        Alert.alert('Error', res.error || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error', error);
      Alert.alert('Error', 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!userId && !email) {
      Alert.alert('Error', 'Please provide your User ID or Email');
      return;
    }
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      // Prefer verifyEmail endpoint (userId + otp). If userId missing but email present, try verifyOTP flow.
      let res: any = null;
      if (userId) {
        res = await apiClient.verifyEmail(userId, otp);
      } else {
        // fallback to verifyOTP using identifier=email
        res = await apiClient.verifyOTP(email, otp, 'EMAIL_VERIFICATION');
      }

      // Normalize success check across response shapes
      const success = !!(res && (res.success || (res.data && (res.data.success || res.data === true))));
      if (success) {
        Alert.alert('Verified', 'Your email has been verified. You can now sign in.', [
          { text: 'OK', onPress: () => navigation.replace('Login') }
        ]);
      } else {
        const msg = (res && (res.message || (res.data && res.data.message))) || 'Verification failed. Please check the OTP.';
        Alert.alert('Verification failed', msg);
      }
    } catch (error) {
      console.error('Verify error', error);
      Alert.alert('Error', error && error.message ? error.message : 'Failed to verify email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.card}>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>Enter the 4-6 digit code sent to your email to activate your account.</Text>

        {email ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>
        ) : null}

        {!initialUserId && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>User ID or Email</Text>
            <TextInput
              value={userId || email}
              onChangeText={text => { setUserId(text); setEmail(text); }}
              style={styles.input}
              placeholder="Enter user id or email"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>OTP</Text>
          <TextInput
            value={otp}
            onChangeText={setOtp}
            style={styles.input}
            placeholder="Enter OTP"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={8}
          />
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Verify Email</Text>}
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity onPress={handleResend} disabled={resendDisabled || isLoading}>
            <Text style={[styles.linkText, resendDisabled ? styles.linkDisabled : null]}>
              {resendDisabled ? `Resend available in ${countdown}s` : 'Resend code'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={styles.linkText}>Back to Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 20 },
  card: {
    marginTop: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
  infoRow: { marginBottom: 12 },
  infoLabel: { fontSize: 12, color: '#9ca3af' },
  infoValue: { fontSize: 14, color: '#111827', fontWeight: '600' },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 13, color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#111827'
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  primaryButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  buttonDisabled: { opacity: 0.7 },
  row: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' },
  linkText: { color: '#4F46E5', fontWeight: '600' },
  linkDisabled: { color: '#9CA3AF' }
});
