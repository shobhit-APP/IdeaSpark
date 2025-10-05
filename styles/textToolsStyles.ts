import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const textToolsStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    minHeight: 60,
  },
  
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  
  headerTitle: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: 'bold',
    color: theme.colors.textWhite,
  },
  
  placeholder: {
    width: 40,
  },
  
  // Content Styles
  scrollContainer: {
    flex: 1,
  },
  
  contentContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  
  // Tools Grid
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  
  toolCard: {
    width: '48%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  
  toolIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  
  toolTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  
  toolDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  
  // Input Section
  inputSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.small,
  },
  
  inputTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  
  textInput: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.lg,
    color: theme.colors.textPrimary,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: theme.spacing.lg,
  },
  
  textInputFocused: {
    borderColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  
  // Action Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    minHeight: 48,
  },
  
  secondaryActionButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  
  actionButtonDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  
  actionButtonText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  },
  
  secondaryActionButtonText: {
    color: theme.colors.primary,
  },
  
  // Results Section
  resultsSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    ...theme.shadows.small,
  },
  
  resultsTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  
  resultText: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  
  // Stats Section
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statNumber: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  // Copy Button
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  
  copyButtonText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  },
  
  // Loading Styles
  loadingContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xxxl,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  
  loadingText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },

  // Hero Section Styles
  heroSection: {
    alignItems: 'center',
    padding: 30,
  },
  
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...theme.shadows.medium,
  },
  
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  
  heroSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },

  // Content Section
  content: {
    flex: 1,
  },

  // Label
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },

  // Tools Row
  toolsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 15,
  },
  
  toolButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  toolGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  
  toolButtonText: {
    color: theme.colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  buttonDisabled: {
    opacity: 0.6,
  },

  // Clear Button
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    gap: 6,
  },
  
  clearButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },

  // Loading Section
  loadingSection: {
    padding: 20,
    alignItems: 'center',
  },

  // Output Section
  outputSection: {
    padding: 20,
  },
  
  outputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  outputLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  
  outputBox: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    ...theme.shadows.small,
  },
  
  outputText: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },

  // Features Info Section
  featuresInfo: {
    padding: 20,
    paddingTop: 10,
  },
  
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 15,
  },
  
  infoItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    ...theme.shadows.small,
  },
  
  infoBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  
  infoContent: {
    flex: 1,
  },
  
  infoItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  
  infoItemDesc: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});