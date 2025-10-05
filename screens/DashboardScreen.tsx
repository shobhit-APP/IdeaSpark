import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

interface NavigationProps {
  navigate: (screen: string) => void;
  goBack: () => void;
}

// User type definition
export interface User {
  id: string;
  email: string;
  username?: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  subscriptionType: 'FREE' | 'PREMIUM';
  profileImage?: string;
  phoneNumber?: string;
  bio?: string;
  // Legacy support for backward compatibility
  isPremium?: boolean;
  name?: string;
}

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProps>();
  const { checkFeatureAccess, user } = useAuth();

  const allFeatures = [
    { 
      title: 'AI Chat', 
      subtitle: 'Smart conversations', 
      screen: 'AIChat', 
      icon: '💬',
      color: '#667eea',
      isPremium: false 
    },
    { 
      title: 'Idea Generator', 
      subtitle: 'Creative brainstorming', 
      screen: 'IdeaGenerator', 
      icon: '💡',
      color: '#f093fb',
      isPremium: false 
    },
    { 
      title: 'AI Writer', 
      subtitle: 'Content creation', 
      screen: 'AIWriter', 
      icon: '✍️',
      color: '#4facfe',
      isPremium: true 
    },
    { 
      title: 'Image Generator', 
      subtitle: 'AI-powered visuals', 
      screen: 'ImageGenerator', 
      icon: '🎨',
      color: '#43e97b',
      isPremium: true 
    },
    { 
      title: 'Text Tools', 
      subtitle: 'Text processing', 
      screen: 'TextTools', 
      icon: '📝',
      color: '#fdcb6e',
      isPremium: false 
    },
    { 
      title: 'Code Assistant', 
      subtitle: 'Programming helper', 
      screen: 'CodeAssistant', 
      icon: '💻',
      color: '#a29bfe',
      isPremium: true 
    },
    { 
      title: 'Voice Tools', 
      subtitle: 'Speech processing', 
      screen: 'VoiceTools', 
      icon: '🎤',
      color: '#fd79a8',
      isPremium: true 
    },
    { 
      title: 'News Detector', 
      subtitle: 'Fake news analysis', 
      screen: 'NewsDetector', 
      icon: '🔍',
      color: '#e17055',
      isPremium: true 
    },
    { 
      title: 'Pricing', 
      subtitle: 'Subscription plans', 
      screen: 'Pricing', 
      icon: '💎',
      color: '#fdcb6e',
      isPremium: false 
    },
  ];

  const handleFeaturePress = (feature: any) => {
    const featureKey = feature.screen.toLowerCase().replace(/([A-Z])/g, '$1').toLowerCase();
    const access = checkFeatureAccess(featureKey);
    if (feature.isPremium && !access.hasAccess) {
      (navigation as any).navigate('Pricing');
      return;
    }
    (navigation as any).navigate(feature.screen);
  };

  // Helper function to check if user is premium
  const isUserPremium = () => {
    if (!user) return false;
    // Check new structure first
    if (user.subscriptionType === 'PREMIUM' || user.role === 'ADMIN') return true;
    // Fallback to legacy structure
    if (user.isPremium) return true;
    return false;
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'Guest User';
    return user.fullName || user.email || 'User';
  };

  // Get user status
  const getUserStatus = () => {
    if (!user) return { title: '🔒 Not Logged In', desc: 'Please log in to access features' };
    
    if (user.role === 'ADMIN') {
      return { title: '👑 Admin User', desc: 'Full access to all features' };
    }
    
    if (isUserPremium()) {
      return { title: '⭐ Premium User', desc: 'Full access to premium features' };
    }
    
    return { title: '🆓 Free Plan', desc: 'Limited access to basic features' };
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2d3436" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>All Features 🚀</Text>
          <Text style={styles.subtitle}>Choose your perfect tool</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statusCard}>
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              {getUserStatus().title}
            </Text>
            <Text style={styles.statusDesc}>
              {getUserStatus().desc}
            </Text>
            {user && (
              <Text style={styles.userInfo}>
                Welcome, {getUserDisplayName()}!
              </Text>
            )}
          </View>
        </View>

        <Text style={styles.sectionTitle}>🚀 All Features</Text>
        
        <View style={styles.featuresGrid}>
          {allFeatures.map((feature, index) => {
              const featureKey = feature.screen.toLowerCase().replace(/([A-Z])/g, '$1').toLowerCase();
              const access = checkFeatureAccess(featureKey);
              const hasAccess = (access && access.hasAccess) || isUserPremium();
              const isLocked = feature.isPremium && !hasAccess;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.featureCard,
                  isLocked && styles.lockedCard
                ]}
                onPress={() => handleFeaturePress(feature)}
              >
                <View style={[
                  styles.iconContainer, 
                  { backgroundColor: isLocked ? '#f1f2f6' : feature.color + '20' }
                ]}>
                  <Text style={[styles.featureIcon, isLocked && styles.lockedIcon]}>
                    {isLocked ? '🔒' : feature.icon}
                  </Text>
                </View>
                
                {feature.isPremium && (
                  <View style={styles.premiumBadge}>
                    <Text style={styles.premiumBadgeText}>
                      {isLocked ? '🔒 LOCKED' : '⭐ PRO'}
                    </Text>
                  </View>
                )}
                
                <Text style={[styles.featureTitle, isLocked && styles.lockedText]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureSubtitle, isLocked && styles.lockedText]}>
                  {feature.subtitle}
                </Text>
                
                <View style={isLocked ? styles.lockedButton : styles.useButton}>
                  <Text style={isLocked ? styles.lockedButtonText : styles.useButtonText}>
                    {isLocked ? '🔓 Unlock' : 'Use Now'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fc',
  },
  header: {
    backgroundColor: '#2d3436',
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  backIcon: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#ddd',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    backgroundColor: '#fff',
    padding: 22,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderLeftWidth: 5,
    borderLeftColor: '#6c5ce7',
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 6,
  },
  statusDesc: {
    fontSize: 14,
    color: '#636e72',
  },
  userInfo: {
    fontSize: 12,
    color: '#6c5ce7',
    marginTop: 4,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 55) / 2,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  lockedCard: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 28,
  },
  lockedIcon: {
    opacity: 0.5,
  },
  premiumBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fdcb6e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 6,
    textAlign: 'center',
  },
  featureSubtitle: {
    fontSize: 13,
    color: '#636e72',
    textAlign: 'center',
    marginBottom: 15,
  },
  lockedText: {
    color: '#b2bec3',
  },
  useButton: {
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  useButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lockedButton: {
    backgroundColor: '#fab1a0',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  lockedButtonText: {
    color: '#2d3436',
    fontSize: 12,
    fontWeight: 'bold',
  },
});