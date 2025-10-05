import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { loadingStyles } from '../styles';

export default function LoadingScreen() {
  return (
    <SafeAreaView style={loadingStyles.container} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={loadingStyles.gradient}
      >
        <View style={loadingStyles.content}>
          {/* Logo */}
          <View style={loadingStyles.logoContainerEnhanced}>
            <Ionicons name="shield-checkmark" size={80} color="#fff" />
          </View>
          
          {/* App Name */}
          <Text style={loadingStyles.appName}>IdeaSpark</Text>
          <Text style={loadingStyles.tagline}>AI News Detector</Text>
          
          {/* Loading Indicator */}
          <View style={loadingStyles.loadingContainerEnhanced}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={loadingStyles.loadingTextEnhanced}>Loading your experience...</Text>
          </View>
          
          {/* Version */}
          <Text style={loadingStyles.version}>v1.0.0</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}