import { StyleSheet, Platform, Dimensions } from 'react-native';
import { theme } from './theme';

const { width: screenWidth } = Dimensions.get('window');

export const chatStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  mainContainer: {
    flex: 1,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    minHeight: 60,
  },
  
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  
  headerTitle: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: 'bold',
    color: theme.colors.textWhite,
  },
  
  placeholder: {
    width: 40,
  },
  
  // Messages Area Styles
  messagesArea: {
    flex: 1,
  },
  
  chatContainer: {
    flex: 1,
  },
  
  messagesContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  
  // Message Styles
  messageContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    alignItems: 'flex-end',
  },
  
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  
  messageBubble: {
    maxWidth: '75%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
  },
  
  userBubble: {
    backgroundColor: theme.colors.userMessage,
    borderBottomRightRadius: 4,
  },
  
  aiBubble: {
    backgroundColor: theme.colors.aiMessage,
    borderBottomLeftRadius: 4,
    ...theme.shadows.small,
  },
  
  messageText: {
    fontSize: theme.fontSize.lg,
    lineHeight: 20,
  },
  
  userText: {
    color: theme.colors.userText,
  },
  
  aiText: {
    color: theme.colors.aiText,
  },
  
  timestamp: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
    alignSelf: 'flex-end',
  },
  
  // Avatar Styles
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.large,
    backgroundColor: theme.colors.aiAvatar,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.large,
    backgroundColor: theme.colors.userAvatar,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  
  // Loading Styles
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  
  loadingText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
  },
  
  // Input Styles
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'flex-end',
    minHeight: 74,
  },
  
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xlarge,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.lg,
    maxHeight: 120,
    minHeight: 44,
    marginRight: theme.spacing.md,
    lineHeight: 20,
  },
  
  // Button Styles
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  
  sendButtonDisabled: {
    opacity: 0.5,
  },
  
  sendGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Keyboard Avoiding View
  keyboardAvoidingView: {
    flex: 1,
  },
  
  inputKeyboardView: {
    backgroundColor: theme.colors.white,
  },
});

// Export individual style groups for easier imports
export const containerStyles = {
  container: chatStyles.container,
  mainContainer: chatStyles.mainContainer,
  messagesArea: chatStyles.messagesArea,
  chatContainer: chatStyles.chatContainer,
};

export const headerStyles = {
  header: chatStyles.header,
  backButton: chatStyles.backButton,
  headerContent: chatStyles.headerContent,
  headerTitle: chatStyles.headerTitle,
  placeholder: chatStyles.placeholder,
};

export const messageStyles = {
  messagesContainer: chatStyles.messagesContainer,
  messageContainer: chatStyles.messageContainer,
  userMessageContainer: chatStyles.userMessageContainer,
  aiMessageContainer: chatStyles.aiMessageContainer,
  messageBubble: chatStyles.messageBubble,
  userBubble: chatStyles.userBubble,
  aiBubble: chatStyles.aiBubble,
  messageText: chatStyles.messageText,
  userText: chatStyles.userText,
  aiText: chatStyles.aiText,
  timestamp: chatStyles.timestamp,
  aiAvatar: chatStyles.aiAvatar,
  userAvatar: chatStyles.userAvatar,
};

export const inputStyles = {
  inputContainer: chatStyles.inputContainer,
  input: chatStyles.input,
  sendButton: chatStyles.sendButton,
  sendButtonDisabled: chatStyles.sendButtonDisabled,
  sendGradient: chatStyles.sendGradient,
};

export const loadingStyles = {
  loadingContainer: chatStyles.loadingContainer,
  loadingText: chatStyles.loadingText,
};