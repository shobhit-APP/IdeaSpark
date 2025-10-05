import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { cerebrasAPI } from '../services/cerebrasAPI';
import { theme } from '../styles';

interface NewsAnalysis {
  credibilityScore: number;
  verdict: 'Real' | 'Fake' | 'Misleading' | 'Uncertain';
  confidence: number;
  keyPoints: string[];
  redFlags: string[];
  sources: string[];
  recommendation: string;
}

interface NewsDetectorScreenProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string) => void;
  };
}

export default function NewsDetectorScreen({ navigation }: NewsDetectorScreenProps) {
  const { checkFeatureAccess, user } = useAuth();
  const [newsText, setNewsText] = useState('');
  const [newsUrl, setNewsUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<NewsAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<NewsAnalysis[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Check access; if user is not allowed, we'll show a locked UI and disable analysis
  const access = checkFeatureAccess('news-detector');
  const isLocked = !access.hasAccess;

  const analyzeNews = async () => {
    if (!newsText.trim() && !newsUrl.trim()) {
      Alert.alert('Error', 'Please enter news text or URL to analyze');
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const prompt = `
Analyze the following news content for authenticity and credibility. Provide a detailed fake news detection analysis:

${newsText.trim() || `News URL: ${newsUrl.trim()}`}

Please provide:
1. Credibility Score (0-100)
2. Verdict (Real/Fake/Misleading/Uncertain)
3. Confidence Level (0-100)
4. Key Supporting Points
5. Red Flags or Warning Signs
6. Source Analysis
7. Recommendation for readers

Format your response as a structured analysis with clear sections.
`;

      const response = await cerebrasAPI.analyzeNews(newsText.trim() || newsUrl.trim());
      
      // Parse the structured analysis response from the existing API
      const parsedAnalysis: NewsAnalysis = {
        credibilityScore: response.confidence * 100,
        verdict: response.prediction === 'REAL' ? 'Real' : 'Fake',
        confidence: response.confidence * 100,
        keyPoints: response.sources || [],
        redFlags: response.reasoning ? [response.reasoning] : [],
        sources: response.sources || [],
        recommendation: `Based on analysis: ${response.reasoning}`
      };
      
      setAnalysis(parsedAnalysis);
      setAnalysisHistory(prev => [parsedAnalysis, ...prev.slice(0, 4)]); // Keep last 5 analyses

      // Animate the results
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

    } catch (error) {
      console.error('News analysis error:', error);
      Alert.alert('Error', 'Failed to analyze news. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseAnalysisResponse = (response: string): NewsAnalysis => {
    // Simple parsing logic - in production, you'd want more robust parsing
    const credibilityMatch = response.match(/credibility score:?\s*(\d+)/i);
    const confidenceMatch = response.match(/confidence:?\s*(\d+)/i);
    const verdictMatch = response.match(/verdict:?\s*(real|fake|misleading|uncertain)/i);
    
    return {
      credibilityScore: credibilityMatch ? parseInt(credibilityMatch[1]) : 50,
      verdict: (verdictMatch?.[1]?.toLowerCase() as any) || 'Uncertain',
      confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 70,
      keyPoints: extractBulletPoints(response, 'key points|supporting points'),
      redFlags: extractBulletPoints(response, 'red flags|warning signs'),
      sources: extractBulletPoints(response, 'sources|source analysis'),
      recommendation: extractSection(response, 'recommendation') || 'Exercise caution when sharing this content.'
    };
  };

  const extractBulletPoints = (text: string, section: string): string[] => {
    const regex = new RegExp(`${section}:?([\\s\\S]*?)(?=\\n\\n|$)`, 'i');
    const match = text.match(regex);
    if (!match) return [];
    
    return match[1]
      .split(/[-•*]\s+/)
      .filter(point => point.trim().length > 0)
      .map(point => point.trim())
      .slice(0, 5); // Limit to 5 points
  };

  const extractSection = (text: string, section: string): string => {
    const regex = new RegExp(`${section}:?\\s*([\\s\\S]*?)(?=\\n\\n|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  const shareAnalysis = async () => {
    if (!analysis) return;
    
    const shareText = `
🔍 AI News Analysis Results:

📊 Credibility Score: ${analysis.credibilityScore}/100
🎯 Verdict: ${analysis.verdict}
📈 Confidence: ${analysis.confidence}%

🔗 Analyzed with IdeaSpark AI News Detector
`;

    try {
      await Share.share({
        message: shareText,
        title: 'News Analysis Results'
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const clearAnalysis = () => {
    setNewsText('');
    setNewsUrl('');
    setAnalysis(null);
    fadeAnim.setValue(0);
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case 'real': return '#10B981';
      case 'fake': return '#EF4444';
      case 'misleading': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case 'real': return 'checkmark-circle';
      case 'fake': return 'close-circle';
      case 'misleading': return 'warning';
      default: return 'help-circle';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <LinearGradient
        colors={['#DC2626', '#B91C1C', '#991B1B']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="shield-checkmark" size={24} color="#fff" />
          <Text style={styles.headerTitle}>News Detector</Text>
        </View>
        <TouchableOpacity onPress={shareAnalysis} style={styles.shareButton}>
          <Ionicons name="share" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Premium Badge */}
        <View style={styles.premiumBadge}>
          <Ionicons name="star" size={16} color="#F59E0B" />
          <Text style={styles.premiumText}>Premium Feature</Text>
          <Text style={styles.premiumSubtext}>AI-Powered News Analysis</Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>📰 Enter News Content</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>News Text or Article</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Paste news article text here..."
              placeholderTextColor="#9CA3AF"
              value={newsText}
              onChangeText={setNewsText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.orDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>News URL</Text>
            <TextInput
              style={styles.urlInput}
              placeholder="https://example.com/news-article"
              placeholderTextColor="#9CA3AF"
              value={newsUrl}
              onChangeText={setNewsUrl}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          {isLocked && (
            <View style={styles.lockedBanner}>
              <Text style={styles.lockedBannerText}>🔒 This is a Premium feature. Upgrade to access the AI News Detector.</Text>
              <TouchableOpacity style={styles.upgradeButton} onPress={() => navigation.navigate('Pricing')}>
                <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.analyzeButton, (isAnalyzing || isLocked) && styles.analyzeButtonDisabled]}
            onPress={analyzeNews}
            disabled={isAnalyzing || isLocked}
          >
            <LinearGradient
              colors={isAnalyzing ? ['#9CA3AF', '#6B7280'] : ['#DC2626', '#B91C1C']}
              style={styles.buttonGradient}
            >
              {isAnalyzing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="search" size={20} color="#fff" />
              )}
              <Text style={styles.analyzeButtonText}>
                {isAnalyzing ? 'Analyzing...' : 'Analyze News'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Analysis Results */}
        {analysis && (
          <Animated.View style={[styles.resultsSection, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>🔍 Analysis Results</Text>

            {/* Verdict Card */}
            <View style={[styles.verdictCard, { borderColor: getVerdictColor(analysis.verdict) }]}>
              <View style={styles.verdictHeader}>
                <Ionicons 
                  name={getVerdictIcon(analysis.verdict)} 
                  size={24} 
                  color={getVerdictColor(analysis.verdict)} 
                />
                <Text style={[styles.verdictText, { color: getVerdictColor(analysis.verdict) }]}>
                  {analysis.verdict.toUpperCase()}
                </Text>
              </View>
              
              <View style={styles.scoresContainer}>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>Credibility</Text>
                  <Text style={styles.scoreValue}>{analysis.credibilityScore}/100</Text>
                </View>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>Confidence</Text>
                  <Text style={styles.scoreValue}>{analysis.confidence}%</Text>
                </View>
              </View>
            </View>

            {/* Key Points */}
            {analysis.keyPoints.length > 0 && (
              <View style={styles.analysisCard}>
                <Text style={styles.cardTitle}>✅ Key Supporting Points</Text>
                {analysis.keyPoints.map((point, index) => (
                  <View key={index} style={styles.pointItem}>
                    <Ionicons name="checkmark" size={16} color="#10B981" />
                    <Text style={styles.pointText}>{point}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Red Flags */}
            {analysis.redFlags.length > 0 && (
              <View style={styles.analysisCard}>
                <Text style={styles.cardTitle}>⚠️ Warning Signs</Text>
                {analysis.redFlags.map((flag, index) => (
                  <View key={index} style={styles.pointItem}>
                    <Ionicons name="warning" size={16} color="#F59E0B" />
                    <Text style={styles.pointText}>{flag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Recommendation */}
            <View style={styles.recommendationCard}>
              <Text style={styles.cardTitle}>💡 Recommendation</Text>
              <Text style={styles.recommendationText}>{analysis.recommendation}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.clearButton} onPress={clearAnalysis}>
                <Ionicons name="refresh" size={20} color="#6B7280" />
                <Text style={styles.clearButtonText}>New Analysis</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.shareResultButton} onPress={shareAnalysis}>
                <Ionicons name="share" size={20} color="#fff" />
                <Text style={styles.shareResultButtonText}>Share Results</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>💡 News Verification Tips</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.tipText}>Check multiple reliable sources</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="calendar" size={20} color="#6366F1" />
            <Text style={styles.tipText}>Verify publication date and timeline</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="person" size={20} color="#8B5CF6" />
            <Text style={styles.tipText}>Research the author's credibility</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="link" size={20} color="#06B6D4" />
            <Text style={styles.tipText}>Look for credible external sources</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  premiumBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  premiumText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#92400E',
  },
  premiumSubtext: {
    fontSize: 14,
    color: '#A16207',
    marginLeft: 'auto' as const,
  },
  inputSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#1F2937',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 120,
    textAlignVertical: 'top' as const,
  },
  urlInput: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 56,
  },
  orDivider: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  analyzeButton: {
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  analyzeButtonDisabled: {
    shadowOpacity: 0.1,
  },
  buttonGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  resultsSection: {
    marginBottom: 24,
  },
  verdictCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  verdictHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    marginBottom: 16,
  },
  verdictText: {
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
  scoresContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
  },
  scoreItem: {
    alignItems: 'center' as const,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#1F2937',
  },
  analysisCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#1F2937',
    marginBottom: 12,
  },
  pointItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: 8,
    marginBottom: 8,
  },
  pointText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  recommendationCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  recommendationText: {
    fontSize: 14,
    color: '#0C4A6E',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row' as const,
    gap: 12,
    marginBottom: 16,
  },
  clearButton: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  shareResultButton: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  shareResultButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#fff',
  },
  tipsSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  lockedBanner: {
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ffd89b',
    alignItems: 'center',
  },
  lockedBannerText: {
    color: '#92400e',
    marginBottom: 8,
    textAlign: 'center',
  },
  upgradeButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#fff',
    fontWeight: '600' as const,
  },
};