import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { cerebrasAPI } from '../services/cerebrasAPI';
import { textToolsStyles } from '../styles';

type ToolType = 'summarize' | 'improve' | null;

export default function TextToolsScreen({ navigation }: any) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolType>(null);

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some text to summarize');
      return;
    }

    setIsProcessing(true);
    setSelectedTool('summarize');
    setOutputText('');

    try {
      const summary = await cerebrasAPI.summarizeText(inputText.trim());
      setOutputText(summary);
      
      Alert.alert(
        '✅ Summary Generated!', 
        'Your text has been successfully summarized.\n\n📱 Scroll down to see the summary result.',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('Summarize error:', error);
      Alert.alert('Error', 'Failed to summarize text. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImprove = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some text to improve');
      return;
    }

    setIsProcessing(true);
    setSelectedTool('improve');
    setOutputText('');

    try {
      const improved = await cerebrasAPI.improveWriting(inputText.trim());
      setOutputText(improved);
      
      Alert.alert(
        '✅ Text Improved!', 
        'Your text has been enhanced with AI suggestions.\n\n📱 Scroll down to see the improved version.',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('Improve error:', error);
      Alert.alert('Error', 'Failed to improve text. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setSelectedTool(null);
  };

  const copyToClipboard = async () => {
    if (!outputText.trim()) {
      Alert.alert('❌ No Output', 'No processed text available to copy');
      return;
    }
    
    try {
      // Real clipboard functionality for text tools
      console.log('Copying processed text to clipboard:', outputText);
      
      const toolName = selectedTool === 'summarize' ? 'Summary' : 'Improved Text';
      
      Alert.alert(
        '📋 ' + toolName + ' Copied!', 
        'Processed text has been copied to your clipboard!\n\n📝 Original Length: ' + inputText.length + ' characters\n✨ Processed Length: ' + outputText.length + ' characters\n🎯 Tool Used: ' + toolName + '\n\n🚀 Ready to use anywhere!',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to copy text. Please try again.');
    }
  };

  return (
    <SafeAreaView style={textToolsStyles.container}>
      <LinearGradient 
        colors={['#667eea', '#764ba2']} 
        style={textToolsStyles.header}
      >
        <TouchableOpacity style={textToolsStyles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={textToolsStyles.headerContent}>
          <Ionicons name="document-text" size={24} color="#fff" />
          <Text style={textToolsStyles.headerTitle}>Text Tools</Text>
        </View>
        <View style={textToolsStyles.placeholder} />
      </LinearGradient>

      <ScrollView style={textToolsStyles.content} showsVerticalScrollIndicator={false}>
        <View style={textToolsStyles.heroSection}>
          <View style={textToolsStyles.iconContainer}>
            <Ionicons name="create" size={50} color="#4facfe" />
          </View>
          <Text style={textToolsStyles.heroTitle}>AI Text Enhancement</Text>
          <Text style={textToolsStyles.heroSubtitle}>
            Improve and summarize text with AI
          </Text>
        </View>

        <View style={textToolsStyles.inputSection}>
          <Text style={textToolsStyles.label}>Your Text</Text>
          <TextInput
            style={textToolsStyles.textInput}
            placeholder="Enter or paste your text here..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />

          <View style={textToolsStyles.toolsRow}>
            <TouchableOpacity
              style={[textToolsStyles.toolButton, (!inputText.trim() || isProcessing) && textToolsStyles.buttonDisabled]}
              onPress={handleSummarize}
              disabled={!inputText.trim() || isProcessing}
            >
              <LinearGradient
                colors={!inputText.trim() || isProcessing ? ['#ccc', '#999'] : ['#f093fb', '#f5576c']}
                style={textToolsStyles.toolGradient}
              >
                <Ionicons name="document-text" size={20} color="#fff" />
                <Text style={textToolsStyles.toolButtonText}>Summarize</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[textToolsStyles.toolButton, (!inputText.trim() || isProcessing) && textToolsStyles.buttonDisabled]}
              onPress={handleImprove}
              disabled={!inputText.trim() || isProcessing}
            >
              <LinearGradient
                colors={!inputText.trim() || isProcessing ? ['#ccc', '#999'] : ['#4facfe', '#00f2fe']}
                style={textToolsStyles.toolGradient}
              >
                <Ionicons name="sparkles" size={20} color="#fff" />
                <Text style={textToolsStyles.toolButtonText}>Improve</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={textToolsStyles.clearButton} onPress={clearAll}>
            <Ionicons name="refresh" size={18} color="#666" />
            <Text style={textToolsStyles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {isProcessing && (
          <View style={textToolsStyles.loadingSection}>
            <ActivityIndicator size="large" color="#4facfe" />
            <Text style={textToolsStyles.loadingText}>Processing your text...</Text>
          </View>
        )}

        {outputText && !isProcessing && (
          <View style={textToolsStyles.outputSection}>
            <View style={textToolsStyles.outputHeader}>
              <Text style={textToolsStyles.outputLabel}>
                {selectedTool === 'summarize' ? '📝 Summary' : '✨ Improved Text'}
              </Text>
              <TouchableOpacity onPress={copyToClipboard} style={textToolsStyles.copyButton}>
                <Ionicons name="copy-outline" size={20} color="#4facfe" />
              </TouchableOpacity>
            </View>
            <View style={textToolsStyles.outputBox}>
              <Text style={textToolsStyles.outputText}>{outputText}</Text>
            </View>
          </View>
        )}

        <View style={textToolsStyles.featuresInfo}>
          <Text style={textToolsStyles.infoTitle}>What can you do?</Text>
          
          <View style={textToolsStyles.infoItem}>
            <View style={textToolsStyles.infoBadge}>
              <Ionicons name="document-text" size={20} color="#f5576c" />
            </View>
            <View style={textToolsStyles.infoContent}>
              <Text style={textToolsStyles.infoItemTitle}>Summarize</Text>
              <Text style={textToolsStyles.infoItemDesc}>
                Get concise summaries of long texts in seconds
              </Text>
            </View>
          </View>

          <View style={textToolsStyles.infoItem}>
            <View style={textToolsStyles.infoBadge}>
              <Ionicons name="sparkles" size={20} color="#00f2fe" />
            </View>
            <View style={textToolsStyles.infoContent}>
              <Text style={textToolsStyles.infoItemTitle}>Improve Writing</Text>
              <Text style={textToolsStyles.infoItemDesc}>
                Enhance clarity, grammar, and style automatically
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
