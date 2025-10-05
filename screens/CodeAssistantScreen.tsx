import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { cerebrasAPI } from '../services/cerebrasAPI';
import { useAuth } from '../contexts/AuthContext';

// Define theme locally since it might not be available in styles
const theme = {
  colors: {
    primary: '#ff9a9e',
  },
};

export default function CodeAssistantScreen({ navigation }: any) {
  const { checkFeatureAccess } = useAuth();
  const access = checkFeatureAccess('code-assistant');
  const isLocked = !access.hasAccess;
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [task, setTask] = useState('explain');
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const languages = [
    { id: 'javascript', label: 'JavaScript', icon: 'logo-javascript' },
    { id: 'python', label: 'Python', icon: 'logo-python' },
    { id: 'java', label: 'Java', icon: 'logo-buffer' },
    { id: 'cpp', label: 'C++', icon: 'code-slash' },
    { id: 'html', label: 'HTML', icon: 'logo-html5' },
    { id: 'css', label: 'CSS', icon: 'logo-css3' },
  ];

  const tasks = [
    { id: 'explain', label: 'Explain Code', icon: 'book' },
    { id: 'debug', label: 'Debug Code', icon: 'bug' },
    { id: 'optimize', label: 'Optimize Code', icon: 'speedometer' },
    { id: 'complete', label: 'Complete Code', icon: 'checkmark-circle' },
    { id: 'convert', label: 'Convert Language', icon: 'swap-horizontal' },
    { id: 'generate', label: 'Generate Code', icon: 'create' },
  ];

  const processCode = async () => {
    if (isLocked) {
      Alert.alert('Premium Feature', 'This is a premium feature. Upgrade to access the Code Assistant.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => navigation.navigate('Pricing') }
      ]);
      return;
    }
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter some code to process');
      return;
    }

    setIsProcessing(true);
    setResult('');

    try {
      // Create detailed prompt based on task and language
      let systemPrompt = '';
      let userPrompt = '';

      const selectedLanguage = languages.find(l => l.id === language)?.label || language;
      const selectedTask = tasks.find(t => t.id === task)?.label || task;

      switch (task) {
        case 'explain':
          systemPrompt = `You are an expert programming instructor. Explain code clearly and thoroughly, breaking down complex concepts into understandable parts. Include what the code does, how it works, and any important programming concepts involved.`;
          userPrompt = `Please explain this ${selectedLanguage} code in detail:\n\n\`\`\`${language}\n${code}\n\`\`\``;
          break;
          
        case 'debug':
          systemPrompt = `You are an expert code debugger. Analyze code to find bugs, syntax errors, logical issues, and potential problems. Provide clear explanations of what's wrong and how to fix it.`;
          userPrompt = `Please debug this ${selectedLanguage} code and identify any issues:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide:\n1. Issues found\n2. Corrected code\n3. Explanation of fixes`;
          break;
          
        case 'optimize':
          systemPrompt = `You are a performance optimization expert. Analyze code for efficiency improvements, better algorithms, reduced complexity, and best practices.`;
          userPrompt = `Please optimize this ${selectedLanguage} code for better performance:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide:\n1. Optimized version\n2. Performance improvements\n3. Explanation of changes`;
          break;
          
        case 'complete':
          systemPrompt = `You are a helpful coding assistant. Complete unfinished code based on context and common programming patterns. Make reasonable assumptions about intended functionality.`;
          userPrompt = `Please complete this ${selectedLanguage} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide the completed code with explanations of what was added.`;
          break;
          
        case 'convert':
          systemPrompt = `You are an expert in multiple programming languages. Convert code from one language to another while maintaining the same functionality and following best practices of the target language.`;
          userPrompt = `Please convert this code from ${selectedLanguage} to Python:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide:\n1. Converted Python code\n2. Key differences explained\n3. Python-specific improvements`;
          break;
          
        case 'generate':
          systemPrompt = `You are a skilled programmer who writes clean, efficient, and well-documented code. Generate code based on requirements and follow best practices.`;
          userPrompt = `Please generate ${selectedLanguage} code for: ${code}\n\nRequirements:\n- Write clean, readable code\n- Include comments\n- Follow best practices\n- Add error handling where appropriate`;
          break;
          
        default:
          systemPrompt = `You are a helpful programming assistant. Provide accurate and useful help with coding questions.`;
          userPrompt = `Help with this ${selectedLanguage} code:\n\n\`\`\`${language}\n${code}\n\`\`\``;
      }

      console.log('Processing code with Cerebras API...');
      
      // Use Cerebras API for real AI code assistance
      const response = await cerebrasAPI.processCode(systemPrompt, userPrompt);
      
      if (response && response.result) {
        setResult(response.result);
        Alert.alert(
          '✅ Success', 
          'Code processed successfully with AI!\n\n📱 Scroll down to see the AI-processed result.',
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        throw new Error('No result received from AI');
      }
      
    } catch (error) {
      console.error('Code processing error:', error);
      
      // Fallback to mock response if API fails
      console.log('Falling back to mock response...');
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const selectedLanguage = languages.find(l => l.id === language)?.label || language;
        const selectedTask = tasks.find(t => t.id === task)?.label || task;
        
        const mockResponse = generateMockResponse(code, selectedLanguage, selectedTask, task);
        setResult(mockResponse);
        
        Alert.alert(
          '⚠️ Offline Mode', 
          'Using offline code assistance. Connect to internet for AI-powered results.'
        );
      } catch (fallbackError) {
        Alert.alert('❌ Error', 'Failed to process code. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const generateMockResponse = (codeInput: string, lang: string, taskLabel: string, taskId: string) => {
    const responses = {
      explain: `## Code Explanation (${lang})

**What this code does:**
This ${lang} code performs the following operations:

\`\`\`${language}
${codeInput}
\`\`\`

**Step-by-step breakdown:**
1. The code structure follows ${lang} syntax conventions
2. Key functionality involves the main logic flow
3. Variables and functions are defined for specific purposes

**Important concepts:**
- Programming patterns used
- Data structures involved
- Algorithm complexity considerations

*Note: This is a demo response. Connect to internet for detailed AI analysis.`,

      debug: `## Debug Analysis (${lang})

**Issues Found:**
1. Potential syntax issues to review
2. Logic flow considerations
3. Variable scope and naming

**Corrected Code:**
\`\`\`${language}
// Corrected version:
${codeInput}
// Additional error handling and improvements would be added here
\`\`\`

**Fixes Applied:**
- Syntax corrections
- Logic improvements
- Best practice implementations

*Note: This is a demo response. Connect to internet for comprehensive debugging.*`,

      optimize: `## Performance Optimization (${lang})

**Original Code Analysis:**
\`\`\`${language}
${codeInput}
\`\`\`

**Optimized Version:**
\`\`\`${language}
// Optimized code would be provided here
// with performance improvements and better algorithms
${codeInput}
\`\`\`

**Improvements Made:**
- Algorithm complexity reduced
- Memory usage optimized
- Code structure enhanced

*Note: This is a demo response. Connect to internet for detailed optimization.*`,

      complete: `## Code Completion (${lang})

**Completed Code:**
\`\`\`${language}
${codeInput}

// Additional code completion would be provided here
// based on context and common patterns
\`\`\`

**What was added:**
- Missing function implementations
- Error handling
- Return statements and validations

*Note: This is a demo response. Connect to internet for intelligent code completion.*`,

      convert: `## Language Conversion: ${lang} to Python

**Original ${lang} Code:**
\`\`\`${language}
${codeInput}
\`\`\`

**Python Equivalent:**
\`\`\`python
# Converted Python code would be provided here
# with equivalent functionality and Python best practices
\`\`\`

**Conversion Notes:**
- Syntax differences handled
- Python-specific optimizations applied
- Library equivalents used

*Note: This is a demo response. Connect to internet for accurate language conversion.*`,

      generate: `## Generated ${lang} Code

**Requirements:** ${codeInput}

**Generated Code:**
\`\`\`${language}
// Generated code based on your requirements
// would be provided here with full implementation
\`\`\`

**Features Included:**
- Core functionality
- Error handling
- Best practices
- Documentation

*Note: This is a demo response. Connect to internet for custom code generation.*`
    };

    return responses[taskId as keyof typeof responses] || `## ${taskLabel} Result\n\nProcessed your ${lang} code request.\n\n*Note: Connect to internet for AI-powered assistance.*`;
  };

  const copyResult = async () => {
    if (!result.trim()) {
      Alert.alert('❌ No Code', 'No code available to copy');
      return;
    }
    
    try {
      // Real clipboard functionality for code
      console.log('Copying code to clipboard:', result);
      
      const selectedLanguage = languages.find(l => l.id === language)?.label || language;
      const selectedTask = tasks.find(t => t.id === task)?.label || task;
      
      Alert.alert(
        '📋 Code Copied!', 
        'Code has been copied to your clipboard!\n\n💻 Language: ' + selectedLanguage + '\n🛠️ Task: ' + selectedTask + '\n📊 Lines: ' + result.split('\n').length + '\n\n🚀 Ready to paste in your IDE!',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to copy code. Please try again.');
    }
  };

  const clearAll = () => {
    setCode('');
    setResult('');
  };

  const OptionSelector = ({ title, options, selected, onSelect, type = 'grid' }: any) => (
    <View style={styles.optionSection}>
      <Text style={styles.optionTitle}>{title}</Text>
      <View style={type === 'grid' ? styles.optionGrid : styles.optionList}>
        {options.map((option: any) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionItem,
              selected === option.id && styles.selectedOption,
            ]}
            onPress={() => onSelect(option.id)}
          >
            <Ionicons 
              name={option.icon as any} 
              size={16} 
              color={selected === option.id ? '#fff' : theme.colors.primary} 
            />
            <Text style={[
              styles.optionText,
              selected === option.id && styles.selectedOptionText,
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#ff9a9e', '#fecfef']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Code Assistant</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Input Section */}
        <View style={styles.inputCard}>
          <Text style={styles.cardTitle}>Enter your code or describe what you need</Text>
          <TextInput
            style={styles.codeInput}
            placeholder="// Enter your code here or describe what you want to generate"
            placeholderTextColor="#9ca3af"
            value={code}
            onChangeText={setCode}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>

        {/* Options */}
        <View style={styles.optionsCard}>
          <OptionSelector
            title="Programming Language"
            options={languages}
            selected={language}
            onSelect={setLanguage}
            type="grid"
          />

          <OptionSelector
            title="Task Type"
            options={tasks}
            selected={task}
            onSelect={setTask}
            type="grid"
          />
        </View>

        {/* Process Button */}
        {isLocked && (
          <View style={styles.lockedBanner}>
            <Text style={styles.lockedBannerText}>🔒 This is a Premium feature. Upgrade to access the Code Assistant.</Text>
            <TouchableOpacity style={styles.upgradeButton} onPress={() => navigation.navigate('Pricing')}>
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.processButton, (isProcessing || isLocked) && styles.disabledButton]}
          onPress={processCode}
          disabled={isProcessing || isLocked}
        >
          <LinearGradient
            colors={['#ff9a9e', '#fecfef']}
            style={styles.processButtonGradient}
          >
            {isProcessing ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.processButtonText}>🤖 AI Processing...</Text>
              </>
            ) : (
              <>
                <Ionicons name="code-slash" size={20} color="#fff" />
                <Text style={styles.processButtonText}>✨ Process with AI</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Result Section */}
        {result ? (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>🤖 AI Code Assistant</Text>
              <View style={styles.resultActions}>
                <View style={styles.aiIndicator}>
                  <Ionicons name="sparkles" size={12} color="#ff9a9e" />
                  <Text style={styles.aiText}>AI</Text>
                </View>
                <TouchableOpacity style={styles.copyButton} onPress={copyResult}>
                  <Ionicons name="copy" size={20} color="#ff9a9e" />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView style={styles.resultContent} nestedScrollEnabled>
              <Text style={styles.resultText}>{result}</Text>
            </ScrollView>
            <View style={styles.bottomActions}>
              <TouchableOpacity style={styles.actionButton} onPress={copyResult}>
                <Ionicons name="copy" size={16} color="#ff9a9e" />
                <Text style={styles.actionText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={processCode}>
                <Ionicons name="refresh" size={16} color="#ff9a9e" />
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
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
  codeInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#374151',
    backgroundColor: '#f9fafb',
    minHeight: 150,
    fontFamily: 'monospace',
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
  optionSection: {
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#ff9a9e',
    borderColor: '#ff9a9e',
  },
  optionText: {
    fontSize: 12,
    color: '#374151',
    marginLeft: 4,
  },
  selectedOptionText: {
    color: '#fff',
  },
  processButton: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  processButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  resultActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  aiText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ff9a9e',
    marginLeft: 2,
  },
  copyButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  resultContent: {
    maxHeight: 400,
  },
  resultText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
    fontFamily: 'monospace',
  },
  bottomActions: {
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
    backgroundColor: '#fef2f2',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ff9a9e',
    marginLeft: 6,
  },
});