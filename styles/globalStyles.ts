import { StyleSheet, Platform } from 'react-native';
import { theme } from './theme';

// Common/Global Styles that can be used across the app
export const globalStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  safeAreaContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Header Styless
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    minHeight: 60,
  },
  
  headerTitle: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: 'bold',
    color: theme.colors.textWhite,
  },
  
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Card Styles
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
    ...theme.shadows.small,
  },
  
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  
  cardTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  
  cardContent: {
    flex: 1,
  },
  
  // Button Styles
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  
  primaryButtonText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
  },
  
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
  },
  
  disabledButton: {
    backgroundColor: theme.colors.disabled,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  
  disabledButtonText: {
    color: theme.colors.textLight,
    fontSize: theme.fontSize.lg,
  },
  
  // Input Styles
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  
  inputLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  
  textInput: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.lg,
    color: theme.colors.textPrimary,
    minHeight: 48,
  },
  
  textInputFocused: {
    borderColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  
  textInputError: {
    borderColor: theme.colors.error,
  },
  
  multilineInput: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.lg,
    color: theme.colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  
  // Text Styles
  headingLarge: {
    fontSize: theme.fontSize.title,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  
  headingMedium: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  
  headingSmall: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  
  bodyText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  
  bodyTextSecondary: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  
  captionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    lineHeight: 16,
  },
  
  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
  },
  
  // Error Styles
  errorContainer: {
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    margin: theme.spacing.md,
  },
  
  errorText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.md,
    textAlign: 'center',
  },
  
  // Success Styles
  successContainer: {
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    margin: theme.spacing.md,
  },
  
  successText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.md,
    textAlign: 'center',
  },
  
  // Utility Styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Margin and Padding Utilities
  mt_xs: { marginTop: theme.spacing.xs },
  mt_sm: { marginTop: theme.spacing.sm },
  mt_md: { marginTop: theme.spacing.md },
  mt_lg: { marginTop: theme.spacing.lg },
  mt_xl: { marginTop: theme.spacing.xl },
  
  mb_xs: { marginBottom: theme.spacing.xs },
  mb_sm: { marginBottom: theme.spacing.sm },
  mb_md: { marginBottom: theme.spacing.md },
  mb_lg: { marginBottom: theme.spacing.lg },
  mb_xl: { marginBottom: theme.spacing.xl },
  
  ml_xs: { marginLeft: theme.spacing.xs },
  ml_sm: { marginLeft: theme.spacing.sm },
  ml_md: { marginLeft: theme.spacing.md },
  ml_lg: { marginLeft: theme.spacing.lg },
  ml_xl: { marginLeft: theme.spacing.xl },
  
  mr_xs: { marginRight: theme.spacing.xs },
  mr_sm: { marginRight: theme.spacing.sm },
  mr_md: { marginRight: theme.spacing.md },
  mr_lg: { marginRight: theme.spacing.lg },
  mr_xl: { marginRight: theme.spacing.xl },
  
  pt_xs: { paddingTop: theme.spacing.xs },
  pt_sm: { paddingTop: theme.spacing.sm },
  pt_md: { paddingTop: theme.spacing.md },
  pt_lg: { paddingTop: theme.spacing.lg },
  pt_xl: { paddingTop: theme.spacing.xl },
  
  pb_xs: { paddingBottom: theme.spacing.xs },
  pb_sm: { paddingBottom: theme.spacing.sm },
  pb_md: { paddingBottom: theme.spacing.md },
  pb_lg: { paddingBottom: theme.spacing.lg },
  pb_xl: { paddingBottom: theme.spacing.xl },
  
  px_xs: { paddingHorizontal: theme.spacing.xs },
  px_sm: { paddingHorizontal: theme.spacing.sm },
  px_md: { paddingHorizontal: theme.spacing.md },
  px_lg: { paddingHorizontal: theme.spacing.lg },
  px_xl: { paddingHorizontal: theme.spacing.xl },
  
  py_xs: { paddingVertical: theme.spacing.xs },
  py_sm: { paddingVertical: theme.spacing.sm },
  py_md: { paddingVertical: theme.spacing.md },
  py_lg: { paddingVertical: theme.spacing.lg },
  py_xl: { paddingVertical: theme.spacing.xl },
});