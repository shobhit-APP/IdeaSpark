import { StyleSheet, Dimensions } from 'react-native';
import { theme } from './theme';

const { width: screenWidth } = Dimensions.get('window');

export const homeStyles = StyleSheet.create({
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
  
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  
  headerTitle: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: 'bold',
    color: theme.colors.textWhite,
  },
  
  logoutButton: {
    padding: theme.spacing.sm,
  },
  
  // Content Styles
  scrollContainer: {
    flex: 1,
  },
  
  contentContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  
  // Welcome Section
  welcomeSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.medium,
  },
  
  welcomeTitle: {
    fontSize: theme.fontSize.title,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  
  welcomeSubtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  
  // Features Grid
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  
  featureCard: {
    width: '47%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    backgroundColor: '#f0f4ff',
  },
  
  featureTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  
  featureDesc: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  
  // Stats Section
  statsSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.small,
  },
  
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  
  statCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    alignItems: 'center',
    flex: 1,
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
  },
  
  // Tips Section
  tipsSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.small,
  },
  
  tipCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  
  tipText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.md,
    lineHeight: 20,
  },

  // Hero Section
  heroSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.medium,
  },

  heroIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    marginBottom: theme.spacing.lg,
  },

  heroTitle: {
    fontSize: theme.fontSize.title,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },

  heroSubtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Main Action Button
  mainActionButton: {
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.xl,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },

  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },

  actionButtonText: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.textWhite,
  },

  // Features Section
  featuresSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.small,
  },

  // New HomeScreen Styles
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  greetingText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textWhite,
    opacity: 0.9,
  },

  userNameText: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.textWhite,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  welcomeCard: {
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },

  welcomeCardGradient: {
    padding: theme.spacing.xl,
  },

  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  welcomeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },

  welcomeTextContainer: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: theme.spacing.xxxl,
  },

  featureCardGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.large,
  },

  featureCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },

  featureTextContainer: {
    flex: 1,
  },

  featureArrow: {
    marginLeft: theme.spacing.sm,
  },

  statsContainer: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
});