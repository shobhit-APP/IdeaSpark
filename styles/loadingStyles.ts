import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const loadingStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Content Styles
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  
  // Logo Section
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.large,
  },
  
  appTitle: {
    fontSize: theme.fontSize.title + 4,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  
  appSubtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Loading Section
  loadingSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  
  loadingIndicator: {
    marginBottom: theme.spacing.lg,
  },
  
  loadingText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  // Progress Section
  progressContainer: {
    width: '80%',
    alignItems: 'center',
  },
  
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: theme.colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  
  progressText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  
  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: theme.spacing.xl,
  },
  
  versionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },

  // Gradient styles
  gradient: {
    flex: 1,
  },

  // Enhanced logo container
  logoContainerEnhanced: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // App name styles
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },

  // Tagline styles
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 50,
    textAlign: 'center',
  },

  // Enhanced loading container
  loadingContainerEnhanced: {
    alignItems: 'center',
    marginBottom: 80,
  },

  // Enhanced loading text
  loadingTextEnhanced: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },

  // Version text positioned
  version: {
    position: 'absolute',
    bottom: 40,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
});