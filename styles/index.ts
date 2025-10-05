// Main export file for all styles
export { theme, type Theme } from './theme';
export { globalStyles } from './globalStyles';
export { 
  chatStyles, 
  containerStyles, 
  headerStyles, 
  messageStyles, 
  inputStyles
} from './chatStyles';
export { dashboardStyles } from './dashboardStyles';
export { homeStyles } from './homeStyles';
export { loginStyles } from './loginStyles';
export { loadingStyles } from './loadingStyles';
export { ideaGeneratorStyles } from './ideaGeneratorStyles';
export { textToolsStyles } from './textToolsStyles';

import { theme } from './theme';

// Gradient configurations commonly used across the app
export const gradientConfigs = {
  primary: [theme.colors.gradientStart, theme.colors.gradientEnd],
  secondary: ['#667eea', '#764ba2'],
  disabled: ['#ccc', '#999'],
  success: ['#4CAF50', '#45a049'],
  error: ['#f44336', '#d32f2f'],
  warning: ['#ff9800', '#f57c00'],
};

// Common animation configurations
export const animationConfigs = {
  fadeIn: {
    toValue: 1,
    duration: 500,
    useNativeDriver: true,
  },
  fadeOut: {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  },
  slideIn: {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  },
};

// Common dimensions
export const dimensions = {
  headerHeight: 60,
  inputMinHeight: 44,
  buttonMinHeight: 48,
  avatarSize: 32,
  iconSize: 24,
  smallIconSize: 16,
  largeIconSize: 32,
};

// Platform specific configurations
export const platformConfig = {
  inputPadding: {
    ios: 34,
    android: 15,
  },
  keyboardBehavior: {
    ios: 'padding' as const,
    android: 'height' as const,
  },
  keyboardOffset: {
    ios: 100,
    android: 0,
  },
};