import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const ideaGeneratorStyles = StyleSheet.create({
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
  
  textArea: {
    backgroundColor: theme.colors.background,
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
  
  inputFocused: {
    borderColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  
  // Button Styles
  generateButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    minHeight: 50,
  },
  
  generateButtonDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  
  generateButtonText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
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
    textAlign: 'center',
  },
  
  resultCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  
  resultTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  
  resultDescription: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  
  resultTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  
  resultTag: {
    backgroundColor: theme.colors.primary + '20',
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  
  resultTagText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '500',
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
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing.xxxl,
  },
  
  emptyStateIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  emptyStateTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  
  emptyStateDescription: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Hero Section
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

  // Input Section
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    ...theme.shadows.small,
  },
  
  inputIcon: {
    marginRight: 10,
  },
  
  textInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },

  // Button Styles Extended
  buttonDisabled: {
    opacity: 0.5,
  },
  
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  
  buttonText: {
    color: theme.colors.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },

  // Quick Topics Section
  quickTopicsSection: {
    padding: 20,
    paddingTop: 10,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 15,
  },
  
  quickTopicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  
  quickTopicCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '30%',
    ...theme.shadows.small,
  },
  
  quickTopicIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  
  quickTopicText: {
    fontSize: 12,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },

  // Ideas Results
  ideaCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    ...theme.shadows.small,
  },
  
  ideaCardSelected: {
    borderWidth: 2,
    borderColor: '#667eea',
  },
  
  ideaHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  ideaNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  ideaNumberText: {
    color: theme.colors.textWhite,
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  ideaText: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  
  ideaActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  
  actionButton: {
    padding: 5,
  },

  // Content
  content: {
    flex: 1,
  },
});