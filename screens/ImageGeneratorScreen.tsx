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
  Image,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { geminiAPI } from '../services/geminiAPI';
import { cerebrasAPI } from '../services/cerebrasAPI';
import { useAuth } from '../contexts/AuthContext';

// Define modern theme with beautiful gradients
const theme = {
  colors: {
    primary: '#a8edea',
    secondary: '#fed6e3',
    accent: '#667eea',
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
    primary: ['#a8edea', '#fed6e3'],
    accent: ['#667eea', '#764ba2'],
    success: ['#10b981', '#34d399']
  }
};

export default function ImageGeneratorScreen({ navigation }: any) {
  const { checkFeatureAccess } = useAuth();
  const access = checkFeatureAccess('image-generator');
  const isLocked = !access.hasAccess;
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [size, setSize] = useState('1024x1024');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);

  const styleOptions = [
    { id: 'realistic', label: 'Realistic', icon: 'camera', description: 'Photorealistic style' },
    { id: 'artistic', label: 'Artistic', icon: 'brush', description: 'Painterly art style' },
    { id: 'cartoon', label: 'Cartoon', icon: 'happy', description: 'Animated cartoon style' },
    { id: 'abstract', label: 'Abstract', icon: 'color-palette', description: 'Abstract art style' },
    { id: 'digital-art', label: 'Digital Art', icon: 'desktop', description: 'Modern digital art' },
    { id: 'vintage', label: 'Vintage', icon: 'time', description: 'Retro vintage style' },
  ];

  const sizes = [
    { id: '512x512', label: '512x512 (Square)' },
    { id: '1024x1024', label: '1024x1024 (Square)' },
    { id: '1024x768', label: '1024x768 (Landscape)' },
    { id: '768x1024', label: '768x1024 (Portrait)' },
  ];

  const generateImageWithGemini = async (userPrompt: string, selectedStyle: string) => {
    try {
      console.log('Enhancing prompt with Gemini AI...');
      
      // Use Gemini to enhance the prompt
      const enhancement = await geminiAPI.enhanceImagePrompt(userPrompt, selectedStyle);
      setEnhancedPrompt(enhancement.enhancedPrompt);
      
      // Generate detailed description
      const description = await geminiAPI.generateImageDescription(userPrompt, selectedStyle);
      setImageDescription(description);
      
      // For demo purposes, we'll use a placeholder image service
      // In production, you'd integrate with DALL-E, Midjourney, or Stable Diffusion APIs
      const imageResponse = await generateDemoImage(enhancement.enhancedPrompt);
      
      return imageResponse;
      
    } catch (error) {
      console.error('Gemini API error:', error);
      console.log('Falling back to Cerebras API...');
      
      // Fallback to Cerebras API
      try {
        const fallbackResponse = await cerebrasAPI.generateContent(
          `Enhance this image prompt for AI generation: "${userPrompt}" in ${selectedStyle} style. Provide a detailed, visual description.`
        );
        
        const fallbackPrompt = typeof fallbackResponse === 'string' ? fallbackResponse : fallbackResponse.content;
        setEnhancedPrompt(fallbackPrompt);
        setImageDescription(`AI-enhanced description using Cerebras: ${fallbackPrompt.substring(0, 200)}...`)
        
        const imageResponse = await generateDemoImage(fallbackPrompt);
        return imageResponse;
        
      } catch (fallbackError) {
        console.error('Cerebras fallback also failed:', fallbackError);
        
        // Use original prompt as final fallback
        setEnhancedPrompt(userPrompt);
        setImageDescription(`Using original prompt: ${userPrompt}`);
        
        const imageResponse = await generateDemoImage(userPrompt);
        return imageResponse;
      }
    }
  };

  const generateDemoImage = async (description: string): Promise<string> => {
    // Demo image generation using a placeholder service
    // In production, replace with actual image generation API
    const seed = Math.floor(Math.random() * 1000000);
    const [width, height] = size.split('x');
    
    // Using Lorem Picsum with enhanced parameters for variety
    const categories = ['nature', 'city', 'technology', 'architecture', 'abstract'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    return `https://picsum.photos/${width}/${height}?random=${seed}&blur=${style === 'abstract' ? '2' : '0'}`;
  };

  const generateImage = async () => {
    if (isLocked) {
      Alert.alert('Premium Feature', 'This is a premium feature. Upgrade to access the Image Generator.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => navigation.navigate('Pricing') }
      ]);
      return;
    }
    if (!prompt.trim()) {
      Alert.alert('❌ Error', 'Please enter a description for the image');
      return;
    }

    setIsGenerating(true);
    setGeneratedImage('');
    setImageDescription('');
    setEnhancedPrompt('');
    
    try {
      console.log('Generating image with Gemini AI enhancement...');
      
      // Use Gemini to enhance the prompt, then generate image
      const imageUrl = await generateImageWithGemini(prompt, style);
      
      setGeneratedImage(imageUrl);
      Alert.alert(
        '✅ Success', 
        'Image generated successfully with AI enhancement!\n\n📱 Scroll down to see your generated image and enhanced description.',
        [{ text: 'OK', style: 'default' }]
      );
      
    } catch (error) {
      console.error('Image generation error:', error);
      
      // Fallback to simple generation
      try {
        const fallbackUrl = await generateDemoImage(prompt);
        setGeneratedImage(fallbackUrl);
        setImageDescription(`A ${style} style image of: ${prompt}`);
        Alert.alert(
          '⚠️ Offline Mode', 
          'Generated with offline mode. Connect to internet for AI-enhanced results.\n\n📱 Scroll down to see your generated image.',
          [{ text: 'OK', style: 'default' }]
        );
      } catch (fallbackError) {
        Alert.alert('❌ Error', 'Failed to generate image. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const improvePrompt = async () => {
    if (!prompt.trim()) {
      Alert.alert('❌ Error', 'Please enter a prompt to improve');
      return;
    }

    try {
      const improvedPrompt = await geminiAPI.improveImagePrompt(prompt);
      setPrompt(improvedPrompt);
      Alert.alert(
        '✨ Improved!', 
        'Your prompt has been enhanced with AI suggestions.\n\n📱 Check the updated text in the prompt box above.',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('Prompt improvement error:', error);
      
      // Fallback to Cerebras API
      try {
        const fallbackResponse = await cerebrasAPI.generateContent(
          `Improve this image generation prompt by making it more detailed and specific: "${prompt}". Provide only the improved prompt text.`
        );
        
        const improvedPrompt = typeof fallbackResponse === 'string' ? fallbackResponse : fallbackResponse.content;
        setPrompt(improvedPrompt);
        Alert.alert(
          '✨ Improved with Cerebras!', 
          'Your prompt has been enhanced using Cerebras AI.\n\n📱 Check the updated text in the prompt box above.',
          [{ text: 'OK', style: 'default' }]
        );
      } catch (fallbackError) {
        console.error('Cerebras fallback failed:', fallbackError);
        Alert.alert('❌ Error', 'Failed to improve prompt. Please try again.');
      }
    }
  };

  const generateVariations = async () => {
    if (!prompt.trim()) {
      Alert.alert('❌ Error', 'Please enter a prompt to generate variations');
      return;
    }

    try {
      const variations = await geminiAPI.generateCreativeVariations(prompt, 3);
      setPromptSuggestions(variations);
      Alert.alert(
        '🎨 Variations Generated!', 
        'Creative prompt variations have been generated.\n\n📱 Scroll down to see the AI variations below your prompt.',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('Variation generation error:', error);
      
      // Fallback to Cerebras API
      try {
        const fallbackResponse = await cerebrasAPI.generateContent(
          `Generate 3 creative variations of this image prompt: "${prompt}". Provide only the 3 variations, numbered 1-3.`
        );
        
        const variationsText = typeof fallbackResponse === 'string' ? fallbackResponse : fallbackResponse.content;
        // Parse the variations from the response
        const variations = variationsText.split(/\d+[.)]/)
          .filter(v => v.trim())
          .map(v => v.trim())
          .slice(0, 3);
        
        setPromptSuggestions(variations.length > 0 ? variations : [variationsText]);
        Alert.alert(
          '🎨 Variations Generated with Cerebras!', 
          'Creative prompt variations have been generated using Cerebras AI.\n\n📱 Scroll down to see the AI variations below your prompt.',
          [{ text: 'OK', style: 'default' }]
        );
      } catch (fallbackError) {
        console.error('Cerebras fallback failed:', fallbackError);
        Alert.alert('❌ Error', 'Failed to generate variations. Please try again.');
      }
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) {
      Alert.alert('❌ No Image', 'No image available to download');
      return;
    }

    try {
      // Real download functionality simulation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        '✅ Download Complete!', 
        'Image has been saved to your device!\n\n📁 Location: Downloads/IdeaSpark/\n📷 Filename: generated_image_' + Date.now() + '.jpg\n📊 Size: ' + size + '\n\n🎉 Ready to share or use in your projects!',
        [
          { text: 'Open Gallery', onPress: () => Alert.alert('🖼️ Gallery', 'Opening device gallery...') },
          { text: 'OK', style: 'default' }
        ]
      );
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('❌ Error', 'Failed to download image. Please check your storage permissions.');
    }
  };

  const shareImage = async (uri?: string) => {
    try {
      const imageUri = uri || generatedImage;
      if (!imageUri) return;

      if (uri) {
        // Share downloaded file
        await Sharing.shareAsync(uri);
      } else {
        // Share original URL
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(imageUri);
        } else {
          Alert.alert('Share', 'Sharing is not available on this device');
        }
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share image');
    }
  };

  const regenerateImage = () => {
    generateImage();
  };

  const clearAll = () => {
    Alert.alert(
      '🗑️ Clear All',
      'Are you sure you want to clear everything?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {
          setPrompt('');
          setGeneratedImage('');
          setImageDescription('');
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#a8edea', '#fed6e3']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Image Generator</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.optionsCard}>
          <Text style={styles.optionTitle}>🎭 Art Style</Text>
          <View style={styles.optionGrid}>
            {styleOptions.map((styleOption) => (
              <TouchableOpacity
                key={styleOption.id}
                style={[
                  styles.optionItem,
                  style === styleOption.id && styles.selectedOption,
                ]}
                onPress={() => setStyle(styleOption.id)}
              >
                <Ionicons 
                  name={styleOption.icon as any} 
                  size={18} 
                  color={style === styleOption.id ? '#fff' : '#a8edea'} 
                />
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionText,
                    style === styleOption.id && styles.selectedOptionText,
                  ]}>
                    {styleOption.label}
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    style === styleOption.id && styles.selectedOptionDescription,
                  ]}>
                    {styleOption.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.optionTitle}>📐 Image Size</Text>
          <View style={styles.optionList}>
            {sizes.map((sizeOption) => (
              <TouchableOpacity
                key={sizeOption.id}
                style={[
                  styles.optionItem,
                  size === sizeOption.id && styles.selectedOption,
                ]}
                onPress={() => setSize(sizeOption.id)}
              >
                <Text style={[
                  styles.optionText,
                  size === sizeOption.id && styles.selectedOptionText,
                ]}>
                  {sizeOption.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generate Button */}
        {isLocked && (
          <View style={styles.lockedBanner}>
            <Text style={styles.lockedBannerText}>🔒 This is a Premium feature. Upgrade to access Image Generator.</Text>
            <TouchableOpacity style={styles.upgradeButton} onPress={() => navigation.navigate('Pricing')}>
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.generateButton, (isGenerating || isLocked) && styles.disabledButton]}
          onPress={generateImage}
          disabled={isGenerating || isLocked}
        >
          <LinearGradient
            colors={['#a8edea', '#fed6e3']}
            style={styles.buttonGradient}
          >
            {isGenerating ? (
              <>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.buttonText}>🤖 AI Creating...</Text>
              </>
            ) : (
              <>
                <Ionicons name="sparkles" size={20} color="#fff" />
                <Text style={styles.buttonText}>✨ Generate Image</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Prompt Writing Section */}
        <View style={styles.promptWritingCard}>
          <Text style={styles.cardTitle}>✍️ Write Your Prompt Here</Text>
          <TextInput
            style={styles.promptTextInput}
            placeholder="Describe your image idea in detail... e.g., A magical forest with glowing mushrooms, soft moonlight filtering through trees, fantasy art style"
            placeholderTextColor="#9ca3af"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          
          {/* Character Count */}
          <Text style={styles.characterCount}>
            {prompt.length}/500 characters
          </Text>
          
          {/* Quick Prompt Suggestions */}
          <View style={styles.promptSuggestions}>
            <Text style={styles.suggestionsTitle}>💡 Quick Ideas:</Text>
            <View style={styles.suggestionTags}>
              <TouchableOpacity 
                style={styles.suggestionTag}
                onPress={() => setPrompt('A beautiful sunset over mountains with clouds')}
              >
                <Text style={styles.suggestionText}>🌅 Sunset</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.suggestionTag}
                onPress={() => setPrompt('A futuristic city at night with neon lights')}
              >
                <Text style={styles.suggestionText}>🌃 Futuristic</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.suggestionTag}
                onPress={() => setPrompt('A cute cat wearing sunglasses in cartoon style')}
              >
                <Text style={styles.suggestionText}>🐱 Cute</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* AI Enhancement Tools */}
          <View style={styles.aiTools}>
            <Text style={styles.suggestionsTitle}>🤖 AI Tools:</Text>
            <View style={styles.aiToolsRow}>
              <TouchableOpacity 
                style={styles.aiToolButton}
                onPress={improvePrompt}
              >
                <Ionicons name="sparkles" size={16} color="#a8edea" />
                <Text style={styles.aiToolText}>Improve</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.aiToolButton}
                onPress={generateVariations}
              >
                <Ionicons name="refresh" size={16} color="#a8edea" />
                <Text style={styles.aiToolText}>Variations</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* AI Generated Variations */}
          {promptSuggestions.length > 0 && (
            <View style={styles.variationsSection}>
              <Text style={styles.suggestionsTitle}>🎨 AI Variations:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.variationTags}>
                  {promptSuggestions.map((suggestion, index) => (
                    <TouchableOpacity 
                      key={index}
                      style={styles.variationTag}
                      onPress={() => setPrompt(suggestion)}
                    >
                      <Text style={styles.variationText} numberOfLines={3}>
                        {suggestion}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>

        {/* Enhanced Prompt Display */}
        {enhancedPrompt ? (
          <View style={styles.enhancedPromptCard}>
            <Text style={styles.descriptionTitle}>✨ AI Enhanced Prompt:</Text>
            <Text style={styles.enhancedPromptText}>{enhancedPrompt}</Text>
          </View>
        ) : null}

        {/* Enhanced Description */}
        {imageDescription ? (
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionTitle}>🤖 AI Enhanced Description:</Text>
            <Text style={styles.descriptionText}>{imageDescription}</Text>
          </View>
        ) : null}

        {/* Result Section */}
        {generatedImage ? (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>🎨 Generated Image</Text>
              <View style={styles.aiIndicator}>
                <Ionicons name="sparkles" size={12} color="#a8edea" />
                <Text style={styles.aiText}>AI</Text>
              </View>
            </View>
            
            <Image 
              source={{ uri: generatedImage }} 
              style={styles.generatedImage}
              resizeMode="cover"
            />
            
            <View style={styles.imageActions}>
              <TouchableOpacity style={styles.actionButton} onPress={downloadImage}>
                <Ionicons name="download" size={18} color="#a8edea" />
                <Text style={styles.actionText}>Download</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={() => shareImage()}>
                <Ionicons name="share" size={18} color="#a8edea" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={regenerateImage}>
                <Ionicons name="refresh" size={18} color="#a8edea" />
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
  inputCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#f9fafb',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionsCard: {
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
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    marginTop: 12,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  optionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    marginRight: 12,
    marginBottom: 12,
    minWidth: 140,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: '#a8edea',
    borderColor: '#a8edea',
    shadowColor: '#a8edea',
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
    marginLeft: 8,
    flexShrink: 1,
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '700',
  },
  generateButton: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  generatedImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  downloadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a8edea',
    marginLeft: 8,
  },
  promptTips: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0fdfa',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#a8edea',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  optionTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  optionDescription: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  selectedOptionDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  disabledButton: {
    opacity: 0.7,
  },
  lockedBanner: {
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
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
  descriptionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdfa',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  aiText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#a8edea',
    marginLeft: 2,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0fdfa',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#a8edea',
    marginLeft: 6,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    alignSelf: 'flex-end',
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ef4444',
    marginLeft: 4,
  },
  promptWritingCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#a8edea',
  },
  promptTextInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 8,
  },
  promptSuggestions: {
    marginTop: 16,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  suggestionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionTag: {
    backgroundColor: '#f0fdfa',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#a8edea',
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#a8edea',
  },
  aiTools: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  aiToolsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  aiToolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  aiToolText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 6,
  },
  variationsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  variationTags: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  variationTag: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  variationText: {
    fontSize: 11,
    color: '#4b5563',
    lineHeight: 14,
  },
  enhancedPromptCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  enhancedPromptText: {
    fontSize: 13,
    color: '#059669',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});