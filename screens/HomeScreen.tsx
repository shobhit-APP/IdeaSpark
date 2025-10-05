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

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (!user) return 'Demo User';
    return user.fullName || user.email || 'User';
  };

  const mainFeatures = [
    { 
      title: 'AI Chat', 
      subtitle: 'Smart conversations', 
      icon: '💬',
      gradient: ['#667eea', '#764ba2']
    },
    { 
      title: 'Idea Generator', 
      subtitle: 'Creative inspiration', 
      icon: '💡',
      gradient: ['#f093fb', '#f5576c']
    },
    { 
      title: 'AI Writer', 
      subtitle: 'Content creation', 
      icon: '✍️',
      gradient: ['#4facfe', '#00f2fe']
    },
    { 
      title: 'News Detector', 
      subtitle: 'Fake news analysis', 
      icon: '🔍',
      gradient: ['#e17055', '#d63031']
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6c5ce7" />
      
      {/* Header with gradient */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back! 👋</Text>
            <Text style={styles.userName}>{getUserDisplayName()}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Ideas Created</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Tools Used</Text>
          </View>
        </View>

        {/* Main Features */}
        <Text style={styles.sectionTitle}>Featured Tools</Text>
        <View style={styles.featuresGrid}>
          {mainFeatures.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.featureCard}
              onPress={() => {
                // Just show preview, don't navigate
                console.log(`${feature.title} preview`);
              }}
            >
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
              <View style={styles.previewBadge}>
                <Text style={styles.previewText}>Preview</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Explore Button */}
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.exploreIcon}>🚀</Text>
          <View>
            <Text style={styles.exploreButtonText}>Explore All Features</Text>
            <Text style={styles.exploreSubtext}>Unlock premium tools</Text>
          </View>
          <Text style={styles.exploreArrow}>→</Text>
        </TouchableOpacity>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>🎯 Getting Started</Text>
          <Text style={styles.activityDesc}>Explore IdeaSpark features</Text>
          <Text style={styles.activityTime}>Just now</Text>
        </View>
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
    backgroundColor: '#6c5ce7',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#ddd6fe',
    marginBottom: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6c5ce7',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  featureCard: {
    width: (width - 55) / 2,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
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
    marginBottom: 10,
  },
  previewBadge: {
    backgroundColor: '#fdcb6e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  previewText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2d3436',
  },
  exploreButton: {
    backgroundColor: '#6c5ce7',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  exploreIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  exploreButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  exploreSubtext: {
    fontSize: 14,
    color: '#ddd6fe',
  },
  exploreArrow: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 'auto',
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#00b894',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 5,
  },
  activityDesc: {
    fontSize: 14,
    color: '#636e72',
    marginBottom: 8,
  },
  activityTime: {
    fontSize: 12,
    color: '#b2bec3',
  },
});