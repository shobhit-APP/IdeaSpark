import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

// Define theme locally since it might not be available in styles
const theme = {
  colors: {
    primary: '#ffd89b',
  },
};

export default function PricingScreen({ navigation }: any) {
  const { user, updatePremiumStatus, checkFeatureAccess } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user to premium
      await updatePremiumStatus(true);
      
      Alert.alert(
        '🎉 Welcome to Premium!',
        'Congratulations! You now have unlimited access to all features.',
        [
          {
            text: 'Start Using Premium',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('❌ Error', 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isPremiumUser = user?.role === 'PREMIUM' || user?.role === 'DEMO';

  const features = [
    {
      icon: 'chatbubble-ellipses',
      title: 'AI Chat',
      description: 'Unlimited AI conversations for everyone',
      free: 'Unlimited',
      premium: 'Unlimited',
    },
    {
      icon: 'newspaper',
      title: 'AI News Detector',
      description: 'Advanced fake news detection',
      free: '10/day',
      premium: 'Unlimited',
    },
    {
      icon: 'image',
      title: 'AI Image Generator',
      description: 'Create stunning AI-generated images',
      free: '5/day',
      premium: 'Unlimited',
    },
    {
      icon: 'text',
      title: 'Text Tools',
      description: 'Advanced text processing tools',
      free: '15/day',
      premium: 'Unlimited',
    },
    {
      icon: 'mic',
      title: 'Voice Tools',
      description: 'Speech-to-text and voice processing',
      free: '8/day',
      premium: 'Unlimited',
    },
    {
      icon: 'bulb',
      title: 'AI Writer',
      description: 'Advanced content generation',
      free: false,
      premium: true,
    },
    {
      icon: 'code',
      title: 'Code Assistant',
      description: 'AI-powered coding help',
      free: false,
      premium: true,
    },
    {
      icon: 'sparkles',
      title: 'Idea Generator',
      description: 'Creative idea generation',
      free: false,
      premium: true,
    },
    {
      icon: 'images',
      title: 'AI Image Generator',
      description: 'Create stunning AI-generated images',
      free: false,
      premium: true,
    },
    {
      icon: 'code-slash',
      title: 'Code Assistant',
      description: 'AI-powered coding help and debugging',
      free: false,
      premium: true,
    },
    {
      icon: 'mic',
      title: 'Voice Tools',
      description: 'Speech-to-text and voice features',
      free: false,
      premium: true,
    },
    {
      icon: 'cloud-download',
      title: 'Export & Download',
      description: 'Download all generated content',
      free: false,
      premium: true,
    },
    {
      icon: 'time',
      title: 'Priority Support',
      description: '24/7 customer support',
      free: false,
      premium: true,
    },
  ];

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await updatePremiumStatus(true);
      Alert.alert(
        'Payment Successful! 🎉',
        'Welcome to IdeaSpark Premium! You now have access to all features.',
        [
          {
            text: 'Start Using',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Payment Failed', 'Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDemoAccess = () => {
    Alert.alert(
      'Demo Access',
      'You can try premium features in demo mode. For full access and unlimited usage, please upgrade to Premium.',
      [
        {
          text: 'Continue Demo',
          onPress: () => navigation.navigate('Home'),
        },
        {
          text: 'Upgrade Now',
          onPress: handlePurchase,
        },
      ]
    );
  };

  const FeatureItem = ({ feature }: any) => (
    <View style={styles.featureItem}>
      <View style={styles.featureLeft}>
        <View style={styles.featureIcon}>
          <Ionicons name={feature.icon as any} size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.featureText}>
          <Text style={styles.featureTitle}>{feature.title}</Text>
          <Text style={styles.featureDescription}>{feature.description}</Text>
        </View>
      </View>
      <View style={styles.featureRight}>
        {feature.free === true ? (
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
        ) : feature.free === false ? (
          <Ionicons name="close-circle" size={20} color="#ef4444" />
        ) : (
          <Text style={styles.limitText}>{feature.free}</Text>
        )}
      </View>
    </View>
  );

  if (isPremiumUser) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#10b981', '#34d399']}
          style={styles.successHeader}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Premium Active</Text>
          <View style={styles.placeholder} />
        </LinearGradient>

        <View style={styles.successContainer}>
          <LinearGradient
            colors={['#10b981', '#34d399']}
            style={styles.successCard}
          >
            <Ionicons name="diamond" size={64} color="#fff" />
            <Text style={styles.successTitle}>Welcome to Premium! 🎉</Text>
            <Text style={styles.successMessage}>
              You now have unlimited access to all AI tools and features.
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate('Home')}
            >
              <View style={styles.startButtonContent}>
                <Text style={styles.startButtonText}>Start Creating</Text>
                <Ionicons name="arrow-forward" size={20} color="#10b981" />
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#ffd89b', '#19547b']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Premium Features</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <LinearGradient
            colors={['#ffd89b', '#19547b']}
            style={styles.pricingGradient}
          >
            <View style={styles.pricingContent}>
              <Ionicons name="diamond" size={48} color="#fff" />
              <Text style={styles.pricingTitle}>IdeaSpark Premium</Text>
              <Text style={styles.pricingPrice}>₹100</Text>
              <Text style={styles.pricingPeriod}>One-time payment</Text>
              <Text style={styles.pricingDescription}>
                Unlock all AI tools and unlimited usage
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Demo Access */}
        <View style={styles.demoCard}>
          <View style={styles.demoContent}>
            <Ionicons name="play-circle" size={32} color={theme.colors.primary} />
            <Text style={styles.demoTitle}>Try Demo Mode</Text>
            <Text style={styles.demoDescription}>
              Experience all features with limited usage before purchasing
            </Text>
            <TouchableOpacity style={styles.demoButton} onPress={handleDemoAccess}>
              <Text style={styles.demoButtonText}>Access Demo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Comparison */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>What You Get with Premium</Text>
          <View style={styles.featuresList}>
            {features.map((feature, index) => (
              <FeatureItem key={index} feature={feature} />
            ))}
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentCard}>
          <Text style={styles.paymentTitle}>Secure Payment Methods</Text>
          <View style={styles.paymentMethods}>
            <View style={styles.paymentMethod}>
              <Ionicons name="card" size={24} color={theme.colors.primary} />
              <Text style={styles.paymentText}>Credit/Debit Cards</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Ionicons name="wallet" size={24} color={theme.colors.primary} />
              <Text style={styles.paymentText}>Digital Wallets</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Ionicons name="phone-portrait" size={24} color={theme.colors.primary} />
              <Text style={styles.paymentText}>UPI Payments</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Ionicons name="card-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.paymentText}>Net Banking</Text>
            </View>
          </View>
        </View>

        {/* Purchase Button */}
        <TouchableOpacity
          style={[styles.purchaseButton, isProcessing && styles.disabledButton]}
          onPress={handlePurchase}
          disabled={isProcessing}
        >
          <LinearGradient
            colors={['#ffd89b', '#19547b']}
            style={styles.purchaseButtonGradient}
          >
            {isProcessing ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.purchaseButtonText}>Processing Payment...</Text>
              </>
            ) : (
              <>
                <Ionicons name="diamond" size={20} color="#fff" />
                <Text style={styles.purchaseButtonText}>Upgrade to Premium - ₹100</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Why Choose Premium?</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="flash" size={20} color="#f59e0b" />
              <Text style={styles.benefitText}>Unlimited AI generations</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="shield-checkmark" size={20} color="#10b981" />
              <Text style={styles.benefitText}>Advanced AI models</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="download" size={20} color="#3b82f6" />
              <Text style={styles.benefitText}>Download all content</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="headset" size={20} color="#8b5cf6" />
              <Text style={styles.benefitText}>Priority support</Text>
            </View>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsCard}>
          <Text style={styles.termsText}>
            By purchasing, you agree to our Terms of Service and Privacy Policy. 
            Payment is processed securely through our payment partners.
          </Text>
        </View>
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
  successHeader: {
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
  pricingCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  pricingGradient: {
    padding: 32,
    alignItems: 'center',
  },
  pricingContent: {
    alignItems: 'center',
  },
  pricingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  pricingPrice: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  pricingPeriod: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  pricingDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  demoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  demoContent: {
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 8,
  },
  demoDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  demoButton: {
    backgroundColor: '#ffd89b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  demoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  featuresList: {
    // gap replaced with individual marginBottom
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  featureDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  featureRight: {
    marginLeft: 12,
  },
  limitText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  paymentCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  paymentMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 12,
  },
  paymentText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  purchaseButton: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  purchaseButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  benefitsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  benefitsList: {
    // gap replaced with individual marginBottom
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  termsCard: {
    backgroundColor: '#f9fafb',
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    padding: 16,
  },
  termsText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  successCard: {
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    width: '100%',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  startButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
    marginRight: 8,
  },
});