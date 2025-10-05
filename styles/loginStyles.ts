import { StyleSheet, Dimensions } from 'react-native';
import { theme } from './theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const loginStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  keyboardAvoidingView: {
    flex: 1,
  },
  
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
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
  
  // Form Section
  formContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    ...theme.shadows.medium,
  },
  
  formTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  
  inputLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.lg,
    color: theme.colors.textPrimary,
    minHeight: 48,
  },
  
  inputFocused: {
    borderColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  
  inputError: {
    borderColor: theme.colors.error,
  },
  
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
  
  // Button Section
  buttonContainer: {
    marginTop: theme.spacing.xl,
  },
  
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    minHeight: 50,
    marginBottom: theme.spacing.md,
  },
  
  loginButtonDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  
  loginButtonText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
  },
  
  forgotPasswordButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
  },
  
  registerButton: {
    marginTop: 16,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  
  registerButtonText: {
  color: theme.colors.primary,
  fontSize: theme.fontSize.md,
  textDecorationLine: 'underline',
  fontWeight: 'bold',
  textAlign: 'center',
  },
  
  // Footer Section
  footerSection: {
    alignItems: 'center',
    marginTop: theme.spacing.xxxl,
  },
  
  signupPrompt: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  
  signupButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  
  signupButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  },
  
  // Loading Styles
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: theme.zIndex.overlay,
  },
  
  loadingContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.lg,
    color: theme.colors.textPrimary,
  },

  // Additional styles from LoginScreen
  gradient: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  logoSection: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },

  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },

  appSubtitleEnhanced: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  formContainerEnhanced: {
    flex: 0.6,
    paddingHorizontal: 20,
  },

  cardEnhanced: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },

  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },

  signInText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },

  inputContainerEnhanced: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },

  inputIcon: {
    marginRight: 12,
  },

  inputEnhanced: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },

  eyeIcon: {
    padding: 4,
  },

  loginButtonEnhanced: {
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },

  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledButton: {
    opacity: 0.7,
  },

  loginButtonTextEnhanced: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  demoNote: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },

  demoText: {
    color: '#1976d2',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Link Styles
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },

  linkText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },

  linkButton: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: '600',
  },

  // Demo note styles
  demoSubtext: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },

  premiumNote: {
    color: '#f59e0b',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },

  // Admin Card Styles
  adminCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  adminTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },

  adminEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 4,
  },

  adminPassword: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 12,
  },

  autoFillButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  autoFillText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Form Styles
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },

  inputContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },

  // Footer Styles
  footer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },

  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 4,
  },

  versionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },

  // Enhanced UI Styles - New unique styles
  mainLogoSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },

  mainLogoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  mainAppName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },

  appTagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },

  welcomeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },

  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },

  demoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  demoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },

  credentialsRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },

  credLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    width: 80,
  },

  credValue: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'monospace',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flex: 1,
  },

  quickFillButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  quickFillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },

  mainInputGroup: {
    marginBottom: 20,
  },

  mainInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 56,
  },

  mainInputIcon: {
    marginRight: 12,
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 0,
  },

  eyeButton: {
    padding: 8,
  },

  signInButton: {
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  signInButtonDisabled: {
    shadowOpacity: 0.1,
  },

  mainButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },

  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  forgotPassword: {
    alignItems: 'center',
    paddingVertical: 8,
  },

  mainForgotPasswordText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },

  mainFooterSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
  },

  footerBrand: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },

  footerVersion: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },

  mainScrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  // New styles for dual account display
  accountSection: {
    marginBottom: 12,
  },

  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  accountType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
});