import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import DashboardScreen from './screens/DashboardScreen';
import AIChatScreen from './screens/AIChatScreen';
import IdeaGeneratorScreen from './screens/IdeaGeneratorScreen';
import TextToolsScreen from './screens/TextToolsScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import AIWriterScreen from './screens/AIWriterScreen';
import ImageGeneratorScreen from './screens/ImageGeneratorScreen';
import CodeAssistantScreen from './screens/CodeAssistantScreen';
import VoiceToolsScreen from './screens/VoiceToolsScreen';
import PricingScreen from './screens/PricingScreen';
import NewsDetectorScreen from './screens/NewsDetectorScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import VerificationScreen from './screens/VerificationScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="AIChat" component={AIChatScreen} />
            <Stack.Screen name="IdeaGenerator" component={IdeaGeneratorScreen} />
            <Stack.Screen name="TextTools" component={TextToolsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="AIWriter" component={AIWriterScreen} />
            <Stack.Screen name="ImageGenerator" component={ImageGeneratorScreen} />
            <Stack.Screen name="CodeAssistant" component={CodeAssistantScreen} />
            <Stack.Screen name="VoiceTools" component={VoiceToolsScreen} />
            <Stack.Screen name="NewsDetector" component={NewsDetectorScreen} />
            <Stack.Screen name="Pricing" component={PricingScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="VerifyEmail" component={VerificationScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
