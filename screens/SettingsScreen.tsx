import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

// Define theme locally since it might not be available in styles
const theme = {
  colors: {
    primary: '#667eea',
    textSecondary: '#6b7280',
  },
};

export default function SettingsScreen({ navigation }: any) {
  const { logout } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoAnalyze: true,
    soundEffects: true,
    dataUsage: false,
    analytics: true,
    hapticFeedback: true,
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const SettingsItem = ({ 
    icon, 
    title, 
    description, 
    value, 
    onToggle, 
    type = 'switch' 
  }: any) => (
    <View style={styles.settingsItem}>
      <View style={styles.settingsItemLeft}>
        <View style={styles.settingsIcon}>
          <Ionicons name={icon as any} size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.settingsText}>
          <Text style={styles.settingsTitle}>{title}</Text>
          {description && <Text style={styles.settingsDescription}>{description}</Text>}
        </View>
      </View>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#d1d5db', true: '#667eea' }}
          thumbColor={value ? '#fff' : '#f4f3f4'}
        />
      )}
      {type === 'arrow' && (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      )}
    </View>
  );

  const SettingsSection = ({ title, children }: any) => (
    <View style={styles.settingsSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings({
              notifications: true,
              darkMode: false,
              autoAnalyze: true,
              soundEffects: true,
              dataUsage: false,
              analytics: true,
              hapticFeedback: true,
            });
            Alert.alert('Success', 'Settings have been reset to default');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data and temporary files.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* App Settings */}
        <SettingsSection title="App Settings">
          <SettingsItem
            icon="notifications-outline"
            title="Push Notifications"
            description="Receive alerts and updates"
            value={settings.notifications}
            onToggle={() => toggleSetting('notifications')}
          />
          <SettingsItem
            icon="moon-outline"
            title="Dark Mode"
            description="Switch to dark theme"
            value={settings.darkMode}
            onToggle={() => toggleSetting('darkMode')}
          />
          <SettingsItem
            icon="flash-outline"
            title="Auto Analyze"
            description="Automatically analyze pasted text"
            value={settings.autoAnalyze}
            onToggle={() => toggleSetting('autoAnalyze')}
          />
          <SettingsItem
            icon="volume-high-outline"
            title="Sound Effects"
            description="Play sounds for interactions"
            value={settings.soundEffects}
            onToggle={() => toggleSetting('soundEffects')}
          />
          <SettingsItem
            icon="phone-portrait-outline"
            title="Haptic Feedback"
            description="Vibrate on touch interactions"
            value={settings.hapticFeedback}
            onToggle={() => toggleSetting('hapticFeedback')}
          />
        </SettingsSection>

        {/* Privacy & Data */}
        <SettingsSection title="Privacy & Data">
          <SettingsItem
            icon="cellular-outline"
            title="Use Mobile Data"
            description="Allow app to use mobile data"
            value={settings.dataUsage}
            onToggle={() => toggleSetting('dataUsage')}
          />
          <SettingsItem
            icon="analytics-outline"
            title="Usage Analytics"
            description="Help improve the app with usage data"
            value={settings.analytics}
            onToggle={() => toggleSetting('analytics')}
          />
        </SettingsSection>

        {/* Account */}
        <SettingsSection title="Account">
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={styles.settingsIcon}>
                <Ionicons name="person-outline" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.settingsText}>
                <Text style={styles.settingsTitle}>Edit Profile</Text>
                <Text style={styles.settingsDescription}>Update your personal information</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={styles.settingsIcon}>
                <Ionicons name="key-outline" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.settingsText}>
                <Text style={styles.settingsTitle}>Change Password</Text>
                <Text style={styles.settingsDescription}>Update your account password</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </SettingsSection>

        {/* Support */}
        <SettingsSection title="Support">
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={styles.settingsIcon}>
                <Ionicons name="help-circle-outline" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.settingsText}>
                <Text style={styles.settingsTitle}>Help Center</Text>
                <Text style={styles.settingsDescription}>Get help and support</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={styles.settingsIcon}>
                <Ionicons name="chatbubble-outline" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.settingsText}>
                <Text style={styles.settingsTitle}>Contact Us</Text>
                <Text style={styles.settingsDescription}>Send feedback or report issues</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={styles.settingsIcon}>
                <Ionicons name="star-outline" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.settingsText}>
                <Text style={styles.settingsTitle}>Rate App</Text>
                <Text style={styles.settingsDescription}>Rate us on the app store</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </SettingsSection>

        {/* Advanced */}
        <SettingsSection title="Advanced">
          <TouchableOpacity style={styles.settingsItem} onPress={handleClearCache}>
            <View style={styles.settingsItemLeft}>
              <View style={styles.settingsIcon}>
                <Ionicons name="trash-outline" size={20} color="#f59e0b" />
              </View>
              <View style={styles.settingsText}>
                <Text style={styles.settingsTitle}>Clear Cache</Text>
                <Text style={styles.settingsDescription}>Clear app cache and temporary files</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem} onPress={handleResetSettings}>
            <View style={styles.settingsItemLeft}>
              <View style={styles.settingsIcon}>
                <Ionicons name="refresh-outline" size={20} color="#f59e0b" />
              </View>
              <View style={styles.settingsText}>
                <Text style={styles.settingsTitle}>Reset Settings</Text>
                <Text style={styles.settingsDescription}>Reset all settings to default</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </SettingsSection>

        {/* About */}
        <SettingsSection title="About">
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={styles.settingsIcon}>
                <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.settingsText}>
                <Text style={styles.settingsTitle}>Version</Text>
                <Text style={styles.settingsDescription}>1.0.0</Text>
              </View>
            </View>
          </View>

          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={styles.settingsIcon}>
                <Ionicons name="document-text-outline" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.settingsText}>
                <Text style={styles.settingsTitle}>Terms of Service</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </View>

          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={styles.settingsIcon}>
                <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.settingsText}>
                <Text style={styles.settingsTitle}>Privacy Policy</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </View>
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginHorizontal: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingsText: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  settingsDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});