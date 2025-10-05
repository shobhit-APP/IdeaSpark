import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { cerebrasAPI, Message } from '../services/cerebrasAPI';
import { 
  chatStyles, 
  gradientConfigs, 
  platformConfig,
  theme 
} from '../styles';

interface ChatMessage extends Message {
  id: string;
  timestamp: Date;
}

interface AIChatScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export default function AIChatScreen({ navigation }: AIChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Hello! I\'m your AI assistant powered by Cerebras. Ask me anything!',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
        setTimeout(() => scrollToBottom(), 100);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, [fadeAnim]);

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    scrollToBottom();

    try {
      const conversationHistory: Message[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await cerebrasAPI.askQuestion(inputText.trim(), conversationHistory);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      scrollToBottom();
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      scrollToBottom();
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    
    return (
      <Animated.View
        style={[
          chatStyles.messageContainer,
          isUser ? chatStyles.userMessageContainer : chatStyles.aiMessageContainer,
          { opacity: fadeAnim }
        ]}
      >
        {!isUser && (
          <View style={chatStyles.aiAvatar}>
            <Ionicons name="sparkles" size={16} color="#fff" />
          </View>
        )}
        <View style={[
          chatStyles.messageBubble,
          isUser ? chatStyles.userBubble : chatStyles.aiBubble
        ]}>
          <Text style={[
            chatStyles.messageText,
            isUser ? chatStyles.userText : chatStyles.aiText
          ]}>
            {item.content}
          </Text>
          <Text style={chatStyles.timestamp}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit' as const, minute: '2-digit' as const })}
          </Text>
        </View>
        {isUser && (
          <View style={chatStyles.userAvatar}>
            <Ionicons name="person" size={16} color="#fff" />
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={chatStyles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <LinearGradient
        colors={gradientConfigs.primary as [string, string]}
        style={chatStyles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={chatStyles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={chatStyles.headerContent}>
          <Ionicons name="sparkles" size={24} color="#fff" />
          <Text style={chatStyles.headerTitle}>AI Chat</Text>
        </View>
        <View style={chatStyles.placeholder} />
      </LinearGradient>

      {/* Main Content Area */}
      <KeyboardAvoidingView 
        style={chatStyles.mainContainer}
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 88}
      >
        {/* Messages Area */}
        <View style={chatStyles.messagesArea}>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item: ChatMessage) => item.id}
            contentContainerStyle={chatStyles.messagesContainer}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollToBottom()}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
            windowSize={10}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            initialNumToRender={10}
            ref={flatListRef as any}
          />
          
          {isLoading && (
            <View style={chatStyles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={chatStyles.loadingText}>AI is thinking...</Text>
            </View>
          )}
        </View>

        {/* Input Area */}
        <View style={chatStyles.inputContainer}>
          <TextInput
            style={chatStyles.input}
            placeholder="Ask me anything..."
            placeholderTextColor={theme.colors.textLight}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            textAlignVertical="top"
            blurOnSubmit={false}
            returnKeyType="default"
            underlineColorAndroid="transparent"
          />

          <TouchableOpacity
            style={[chatStyles.sendButton, (!inputText.trim() || isLoading) && chatStyles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <LinearGradient
              colors={(!inputText.trim() || isLoading ? gradientConfigs.disabled : gradientConfigs.primary) as [string, string]}
              style={chatStyles.sendGradient}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
