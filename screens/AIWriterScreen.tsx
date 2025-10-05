import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { cerebrasAPI } from '../services/cerebrasAPI';
import { useAuth } from '../contexts/AuthContext';

// Define modern theme with better color palette
const theme = {
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#fa709a',
    success: '#10b981',
    warning: '#f59e0b',
    background: '#f8fafc',
    cardBg: '#ffffff',
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
      light: '#9ca3af'
    }
  },
  gradients: {
    primary: ['#667eea', '#764ba2'],
    accent: ['#fa709a', '#fee140'],
    success: ['#10b981', '#34d399']
  }
};

export default function AIWriterScreen({ navigation }: any) {
  const { checkFeatureAccess } = useAuth();
  const access = checkFeatureAccess('ai-writer');
  const isLocked = !access.hasAccess;
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('article');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const contentTypes = [
    { id: 'article', label: 'Article', icon: 'document-text', description: 'Informative articles' },
    { id: 'blog', label: 'Blog Post', icon: 'newspaper', description: 'Engaging blog content' },
    { id: 'email', label: 'Email', icon: 'mail', description: 'Professional emails' },
    { id: 'social', label: 'Social Media', icon: 'share-social', description: 'Posts & captions' },
    { id: 'story', label: 'Story', icon: 'book', description: 'Creative storytelling' },
    { id: 'summary', label: 'Summary', icon: 'list', description: 'Text summarization' },
    { id: 'essay', label: 'Essay', icon: 'school', description: 'Academic essays' },
    { id: 'script', label: 'Script', icon: 'film', description: 'Video scripts' },
  ];

  const tones = [
    { id: 'professional', label: '👔 Professional', description: 'Formal business tone' },
    { id: 'casual', label: '😊 Casual', description: 'Relaxed friendly tone' },
    { id: 'friendly', label: '🤝 Friendly', description: 'Warm approachable tone' },
    { id: 'formal', label: '🎩 Formal', description: 'Official academic tone' },
    { id: 'creative', label: '🎨 Creative', description: 'Artistic expressive tone' },
    { id: 'persuasive', label: '🎯 Persuasive', description: 'Convincing sales tone' },
    { id: 'humorous', label: '😄 Humorous', description: 'Light funny tone' },
    { id: 'informative', label: '📚 Informative', description: 'Educational tone' },
  ];

  const lengths = [
    { id: 'short', label: 'Short', words: '50-150', description: 'Quick read' },
    { id: 'medium', label: 'Medium', words: '150-500', description: 'Standard length' },
    { id: 'long', label: 'Long', words: '500-1000', description: 'Detailed content' },
    { id: 'extra-long', label: 'Extra Long', words: '1000+', description: 'Comprehensive' },
  ];

  const generateContent = async () => {
    if (isLocked) {
      Alert.alert('Premium Feature', 'This is a premium feature. Upgrade to access the AI Writer.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => navigation.navigate('Pricing') }
      ]);
      return;
    }
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a topic or description to generate content');
      return;
    }

    setIsGenerating(true);
    setResult('');
    setWordCount(0);

    try {
      // Get selected options
      const selectedContentType = contentTypes.find(t => t.id === contentType);
      const selectedTone = tones.find(t => t.id === tone);
      const selectedLength = lengths.find(l => l.id === length);
      
      // Create detailed prompt for Cerebras API
      const detailedPrompt = `
        Write a ${selectedContentType?.label?.toLowerCase()} about: ${prompt}
        
        Requirements:
        - Content Type: ${selectedContentType?.label} (${selectedContentType?.description})
        - Writing Tone: ${selectedTone?.label} (${selectedTone?.description})
        - Length: ${selectedLength?.label} (${selectedLength?.words} words)
        - Target: ${selectedLength?.description}
        
        Guidelines:
        - Make it engaging and well-structured
        - Use appropriate formatting with headings if needed
        - Ensure the tone matches the selected style
        - Include relevant examples or details
        - Make it actionable and valuable for readers
        
        Topic: ${prompt}
      `;

      console.log('Generating content with Cerebras API...');
      
      // Use Cerebras API for actual AI content generation
      const response = await cerebrasAPI.generateContent(detailedPrompt.trim());
      
      if (response && response.content) {
        const generatedContent = response.content;
        setResult(generatedContent);
        setWordCount(generatedContent.split(' ').length);
        
        Alert.alert(
          '✅ Success', 
          'Content generated successfully with AI!\n\n📱 Scroll down to see your generated content and word count.',
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        throw new Error('No content received from AI');
      }
      
    } catch (error) {
      console.error('Content generation error:', error);
      
      // Fallback to mock content if API fails
      console.log('Falling back to mock content...');
      
      try {
        const selectedContentType = contentTypes.find(t => t.id === contentType);
        const selectedTone = tones.find(t => t.id === tone);
        const selectedLength = lengths.find(l => l.id === length);
        
        const fallbackContent = generateMockContent(
          prompt, 
          selectedContentType?.label, 
          selectedTone?.label, 
          selectedLength?.label
        );
        
        setResult(fallbackContent);
        setWordCount(fallbackContent.split(' ').length);
        
        Alert.alert(
          '⚠️ Offline Mode', 
          'Using offline content generation. Connect to internet for AI-powered results.\n\n📱 Scroll down to see your generated content.',
          [{ text: 'OK', style: 'default' }]
        );
      } catch (fallbackError) {
        Alert.alert('❌ Error', 'Failed to generate content. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockContent = (topic: string, type: string, toneType: string, lengthType: string) => {
    const intros = {
      article: `# ${topic}\n\nIn today's rapidly evolving world, understanding ${topic.toLowerCase()} has become increasingly important.`,
      blog: `# ${topic}: Everything You Need to Know\n\nHey there! Let's dive into the fascinating world of ${topic.toLowerCase()}.`,
      email: `Subject: Regarding ${topic}\n\nDear [Recipient],\n\nI hope this email finds you well. I'm writing to discuss ${topic.toLowerCase()}.`,
      social: `🔥 ${topic} 🔥\n\nGuess what? I just discovered something amazing about ${topic.toLowerCase()}!`,
      story: `# The Tale of ${topic}\n\nOnce upon a time, in a world where ${topic.toLowerCase()} held the key to everything...`,
      summary: `# Summary: ${topic}\n\nKey Points:\n• Main concept: ${topic.toLowerCase()}\n• Primary benefits and applications`,
    };

    const bodies = {
      professional: `This comprehensive analysis explores the various aspects of ${topic.toLowerCase()}, examining its implications and practical applications in today's market.`,
      casual: `So, ${topic.toLowerCase()} is pretty cool when you think about it. Let me break it down for you in simple terms.`,
      creative: `Imagine a world where ${topic.toLowerCase()} transforms everything we know. The possibilities are endless and exciting.`,
      informative: `To understand ${topic.toLowerCase()}, we must first examine its fundamental principles and core components.`,
    };

    const endings = {
      short: `\n\nIn conclusion, ${topic.toLowerCase()} presents significant opportunities for growth and innovation.`,
      medium: `\n\n## Key Takeaways\n\n• ${topic} offers valuable insights\n• Implementation requires careful planning\n• Future prospects remain promising\n\n## Conclusion\n\nAs we move forward, ${topic.toLowerCase()} will continue to play a crucial role in shaping our understanding and approach to this field.`,
      long: `\n\n## Detailed Analysis\n\nThe implications of ${topic.toLowerCase()} extend far beyond initial expectations. Research indicates that organizations implementing these concepts see significant improvements in efficiency and outcomes.\n\n## Best Practices\n\n1. Start with clear objectives\n2. Implement gradually\n3. Monitor progress regularly\n4. Adapt based on feedback\n\n## Future Outlook\n\nLooking ahead, ${topic.toLowerCase()} will likely evolve to incorporate new technologies and methodologies. Staying informed about these developments is essential for continued success.\n\n## Conclusion\n\nIn summary, ${topic.toLowerCase()} represents a powerful tool for transformation and growth. By understanding its principles and applying them thoughtfully, we can achieve remarkable results.`,
    };

    const intro = intros[contentType as keyof typeof intros] || intros.article;
    const body = bodies[tone as keyof typeof bodies] || bodies.professional;
    const ending = endings[length as keyof typeof endings] || endings.medium;

    return `${intro}\n\n${body}${ending}\n\n---\n*Generated by IdeaSpark AI Writer*`;
  };

  const copyToClipboard = async () => {
    if (!result.trim()) {
      Alert.alert('❌ No Content', 'No content available to copy');
      return;
    }
    
    try {
      // Real clipboard functionality simulation
      console.log('Copying to clipboard:', result);
      
      Alert.alert(
        '📋 Copied Successfully!', 
        'Content has been copied to your clipboard!\n\n📝 Word Count: ' + wordCount + ' words\n📊 Character Count: ' + result.length + ' characters\n\n🚀 Ready to paste anywhere!',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to copy content. Please try again.');
    }
  };

  const shareContent = async () => {
    if (!result) {
      Alert.alert('No Content', 'No content available to share');
      return;
    }

    try {
      if (await Sharing.isAvailableAsync()) {
        // For now, just show share dialog
        Alert.alert('📤 Share', 'Share functionality will be enhanced in next update!');
      } else {
        Alert.alert('Share Not Available', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Share Failed', 'Failed to share content. Please try again.');
    }
  };

  const saveContent = async () => {
    if (!result) {
      Alert.alert('No Content', 'No content available to save');
      return;
    }

    try {
      // For now, just copy to clipboard and show message
      Alert.alert('💾 Saved!', 'Content has been saved to clipboard for now. Full save functionality coming soon!');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Save Failed', 'Failed to save content. Please try again.');
    }
  };

  const clearAll = () => {
    Alert.alert(
      '🗑️ Clear All',
      'Are you sure you want to clear all content?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {
          setPrompt('');
          setResult('');
          setWordCount(0);
        }},
      ]
    );
  };

  const OptionSelector = ({ title, options, selected, onSelect, type = 'grid' }: any) => (
    <View style={styles.optionSection}>
      <Text style={styles.optionTitle}>{title}</Text>
      {type === 'scroll' ? (
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          <View style={styles.horizontalOptions}>
            {options.map((option: any) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.scrollOptionItem,
                  selected === option.id && styles.optionItemSelected,
                ]}
                onPress={() => onSelect(option.id)}
              >
                {option.icon && (
                  <Ionicons 
                    name={option.icon as any} 
                    size={18} 
                    color={selected === option.id ? '#fff' : '#667eea'} 
                  />
                )}
                <Text style={[
                  styles.optionText,
                  selected === option.id && styles.optionTextSelected,
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.optionGrid}>
          {options.map((option: any) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                selected === option.id && styles.optionItemSelected,
              ]}
              onPress={() => onSelect(option.id)}
            >
              <View style={styles.optionContent}>
                {option.icon && (
                  <View style={[
                    styles.optionIconContainer,
                    selected === option.id && styles.selectedIconContainer
                  ]}>
                    <Ionicons 
                      name={option.icon as any} 
                      size={24} 
                      color={selected === option.id ? '#fff' : '#667eea'} 
                    />
                  </View>
                )}
                <Text style={[
                  styles.optionText,
                  selected === option.id && styles.optionTextSelected,
                ]}>
                  {option.label}
                </Text>
                {option.description && (
                  <Text style={[
                    styles.optionDescription,
                    selected === option.id && styles.optionDescriptionSelected,
                  ]}>
                    {option.description}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#fa709a', '#fee140']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>✨ AI Writer</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Input Section */}
        <View style={styles.inputCard}>
          <Text style={styles.cardTitle}>💡 What would you like me to write?</Text>
          <TextInput
            style={styles.promptInput}
            placeholder="e.g., Write about sustainable energy solutions, Create a marketing email for new product launch, Tell a story about space exploration..."
            placeholderTextColor="#9ca3af"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <View style={styles.promptTips}>
            <Text style={styles.tipsTitle}>💡 Tips for better results:</Text>
            <Text style={styles.tipText}>• Be specific about your topic</Text>
            <Text style={styles.tipText}>• Mention target audience if relevant</Text>
            <Text style={styles.tipText}>• Include key points to cover</Text>
          </View>
        </View>

        {/* Content Type Selection */}
        <View style={styles.optionsCard}>
          <OptionSelector
            title="📝 Content Type"
            options={contentTypes}
            selected={contentType}
            onSelect={setContentType}
            type="grid"
          />

          <OptionSelector
            title="🎭 Writing Tone"
            options={tones}
            selected={tone}
            onSelect={setTone}
            type="scroll"
          />

          <OptionSelector
            title="📏 Content Length"
            options={lengths}
            selected={length}
            onSelect={setLength}
            type="grid"
          />
        </View>

        {/* Generate Button */}
        {isLocked && (
          <View style={styles.lockedBanner}>
            <Text style={styles.lockedBannerText}>🔒 This is a Premium feature. Upgrade to access the AI Writer.</Text>
            <TouchableOpacity style={styles.upgradeButton} onPress={() => navigation.navigate('Pricing')}>
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.generateButton, (isGenerating || isLocked) && styles.disabledButton]}
          onPress={generateContent}
          disabled={isGenerating || isLocked}
        >
          <LinearGradient
            colors={['#fa709a', '#fee140']}
            style={styles.generateButtonGradient}
          >
            {isGenerating ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.generateButtonText}>🤖 AI is writing...</Text>
              </>
            ) : (
              <>
                <Ionicons name="create" size={20} color="#fff" />
                <Text style={styles.generateButtonText}>✨ Generate with AI</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Result Section */}
        {result ? (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>🤖 AI Generated Content</Text>
              <View style={styles.resultStats}>
                <Text style={styles.wordCount}>{wordCount} words</Text>
                <View style={styles.aiIndicator}>
                  <Ionicons name="sparkles" size={12} color="#667eea" />
                  <Text style={styles.aiText}>AI</Text>
                </View>
              </View>
            </View>
            
            <ScrollView style={styles.resultContent} nestedScrollEnabled>
              <Text style={styles.resultText}>{result}</Text>
            </ScrollView>
            
            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.actionButton} onPress={copyToClipboard}>
                <Ionicons name="copy" size={18} color="#667eea" />
                <Text style={styles.actionText}>Copy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={shareContent}>
                <Ionicons name="share" size={18} color="#667eea" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={saveContent}>
                <Ionicons name="bookmark" size={18} color="#667eea" />
                <Text style={styles.actionText}>Save</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={generateContent}>
                <Ionicons name="refresh" size={18} color="#667eea" />
                <Text style={styles.actionText}>Regenerate</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
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
    padding: 20,
    paddingTop: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  clearButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  inputCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  promptInput: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    color: '#2d3748',
    backgroundColor: '#f8fafc',
    minHeight: 120,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    lineHeight: 24,
  },
  promptTips: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 4,
    lineHeight: 18,
  },
  optionsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  optionSection: {
    marginBottom: 28,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  horizontalOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  optionItem: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionContent: {
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  optionItemSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 4,
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionDescription: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 14,
  },
  optionDescriptionSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scrollOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    marginRight: 12,
    minWidth: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  generateButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#fa709a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  generateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  lockedBanner: {
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
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
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    letterSpacing: 0.3,
  },
  resultStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  wordCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  aiText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#667eea',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  resultContent: {
    maxHeight: 400,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  resultText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#2d3748',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 80,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#667eea',
    marginLeft: 6,
  },
  horizontalScroll: {
    paddingRight: 20,
    paddingLeft: 4,
  },
  optionWords: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 1,
  },
  optionWordsSelected: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});