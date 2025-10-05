import { StyleSheet, Dimensions } from 'react-native';
import { theme } from './theme';

const { width: screenWidth } = Dimensions.get('window');

export const dashboardStyles = StyleSheet.create({
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
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  
  welcomeText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textWhite,
  },
  
  userName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.textWhite,
  },
  
  userNameText: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.textWhite,
  },
  
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Content Styles
  contentContainer: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  
  // Quick Actions Section
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  
  quickActionCard: {
    width: '48%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  
  quickActionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  
  quickActionDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  
  // Stats Section
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.small,
  },
  
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.small,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  
  statNumber: {
    fontSize: theme.fontSize.title,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  // Recent Activity Section
  recentActivityCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.small,
  },
  
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  
  activityItemLast: {
    borderBottomWidth: 0,
  },
  
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  
  activityContent: {
    flex: 1,
  },
  
  activityTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  
  activityTime: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  
  // Welcome Card
  welcomeCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.small,
  },
  
  welcomeCardTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  
  welcomeCardDescription: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  
  welcomeCardButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignSelf: 'flex-start',
  },
  
  welcomeCardButtonText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  },

  // News Analysis Styles
  inputLabel: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },

  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    fontSize: theme.fontSize.md,
    backgroundColor: theme.colors.background,
    minHeight: 120,
    marginBottom: theme.spacing.lg,
    textAlignVertical: 'top',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },

  analyzeButton: {
    flex: 1,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
  },

  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
  },

  disabledButton: {
    opacity: 0.7,
  },

  buttonText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },

  clearButton: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    fontWeight: '500',
  },

  // Result Card Styles
  resultCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    marginTop: theme.spacing.lg,
    borderLeftWidth: 4,
    ...theme.shadows.medium,
  },

  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },

  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },

  resultInfo: {
    flex: 1,
  },

  resultTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },

  confidenceText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },

  confidenceBar: {
    height: 6,
    backgroundColor: theme.colors.background,
    borderRadius: 3,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },

  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },

  resultDescription: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  sectionSubtitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },

  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.small,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },

  sourceText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },

  // Features Grid
  featuresSection: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.small,
  },

  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.xs,
  },

  featureCard: {
    width: '48%',
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
    ...theme.shadows.small,
  },

  featureGradient: {
    padding: theme.spacing.md,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },

  featureTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.textWhite,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },

  featureDesc: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },

  // Stats Card
  statsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxxl,
    ...theme.shadows.small,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },

  statItem: {
    alignItems: 'center',
  },

  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.borderLight,
  },
});