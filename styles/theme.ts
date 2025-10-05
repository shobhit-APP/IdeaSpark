// Global Theme Configuration
export const theme = {
  colors: {
    // Primary Colors
    primary: '#667eea',
    primaryDark: '#764ba2',
    
    // Gradient Colors
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    
    // Background Colors
    background: '#f5f5f5',
    white: '#fff',
    cardBackground: '#fff',
    
    // Text Colors
    textPrimary: '#333',
    textSecondary: '#666',
    textLight: '#999',
    textWhite: '#fff',
    
    // Message Colors
    userMessage: '#667eea',
    aiMessage: '#fff',
    userText: '#fff',
    aiText: '#333',
    
    // Border Colors
    border: '#eee',
    borderLight: '#f0f0f0',
    
    // Status Colors
    success: '#4CAF50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196F3',
    
    // Disabled States
    disabled: '#ccc',
    disabledDark: '#999',
    
    // Avatar Colors
    aiAvatar: '#667eea',
    userAvatar: '#764ba2',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 20,
    full: 50,
  },
  
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 15,
    xl: 16,
    xxl: 18,
    xxxl: 20,
    title: 24,
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 8,
    },
  },
  
  zIndex: {
    modal: 1000,
    overlay: 999,
    dropdown: 998,
    header: 997,
    fab: 996,
  },
};

export type Theme = typeof theme;