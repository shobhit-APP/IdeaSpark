import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { cerebrasAPI } from '../services/cerebrasAPI';
import { ideaGeneratorStyles } from '../styles';

export default function IdeaGeneratorScreen({ navigation }: any) {
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<number | null>(null);

  const generateIdeas = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setIdeas([]);
    setSelectedIdea(null);

    try {
      const generatedIdeas = await cerebrasAPI.generateIdeas(topic.trim(), 7);
      setIdeas(generatedIdeas);
      
      // Show success alert with scroll instruction
      Alert.alert(
        '💡 Ideas Generated!', 
        `Generated ${generatedIdeas.length} creative ideas for "${topic}".\n\n📱 Scroll down to see all your generated ideas.`,
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('Error generating ideas:', error);
      setIdeas(['Failed to generate ideas. Please try again.']);
    } finally {
      setIsGenerating(false);
    }
  };

  const quickTopics = [
    { icon: '💡', text: 'Tech Startup' },
    { icon: '🎨', text: 'Creative Project' },
    { icon: '📱', text: 'Mobile App' },
    { icon: '🌍', text: 'Social Impact' },
    { icon: '🎮', text: 'Gaming' },
    { icon: '🍔', text: 'Food Business' },
  ];

  return (
    <SafeAreaView style={ideaGeneratorStyles.container} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={ideaGeneratorStyles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={ideaGeneratorStyles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={ideaGeneratorStyles.headerContent}>
          <Ionicons name="bulb" size={24} color="#fff" />
          <Text style={ideaGeneratorStyles.headerTitle}>Idea Generator</Text>
        </View>
        <View style={ideaGeneratorStyles.placeholder} />
      </LinearGradient>

      <ScrollView style={ideaGeneratorStyles.content} showsVerticalScrollIndicator={false}>
        <View style={ideaGeneratorStyles.heroSection}>
          <View style={ideaGeneratorStyles.iconContainer}>
            <Ionicons name="bulb" size={50} color="#667eea" />
          </View>
          <Text style={ideaGeneratorStyles.heroTitle}>Generate Creative Ideas</Text>
          <Text style={ideaGeneratorStyles.heroSubtitle}>
            Powered by AI to spark your imagination
          </Text>
        </View>

        <View style={ideaGeneratorStyles.inputSection}>
          <Text style={ideaGeneratorStyles.label}>What's your topic?</Text>
          <View style={ideaGeneratorStyles.inputContainer}>
            <Ionicons name="search" size={20} color="#999" style={ideaGeneratorStyles.inputIcon} />
            <TextInput
              style={ideaGeneratorStyles.textInput}
              placeholder="e.g., Mobile App Ideas, Business Concepts..."
              placeholderTextColor="#999"
              value={topic}
              onChangeText={setTopic}
              multiline
            />
          </View>

          <TouchableOpacity
            style={[ideaGeneratorStyles.generateButton, (!topic.trim() || isGenerating) && ideaGeneratorStyles.buttonDisabled]}
            onPress={generateIdeas}
            disabled={!topic.trim() || isGenerating}
          >
            <LinearGradient
              colors={!topic.trim() || isGenerating ? ['#ccc', '#999'] : ['#667eea', '#764ba2']}
              style={ideaGeneratorStyles.buttonGradient}
            >
              {isGenerating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={20} color="#fff" />
                  <Text style={ideaGeneratorStyles.buttonText}>Generate Ideas</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={ideaGeneratorStyles.quickTopicsSection}>
          <Text style={ideaGeneratorStyles.sectionTitle}>Quick Topics</Text>
          <View style={ideaGeneratorStyles.quickTopicsGrid}>
            {quickTopics.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={ideaGeneratorStyles.quickTopicCard}
                onPress={() => setTopic(item.text)}
              >
                <Text style={ideaGeneratorStyles.quickTopicIcon}>{item.icon}</Text>
                <Text style={ideaGeneratorStyles.quickTopicText}>{item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {ideas.length > 0 && (
          <View style={ideaGeneratorStyles.resultsSection}>
            <Text style={ideaGeneratorStyles.sectionTitle}>💡 Generated Ideas</Text>
            {ideas.map((idea, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  ideaGeneratorStyles.ideaCard,
                  selectedIdea === index && ideaGeneratorStyles.ideaCardSelected
                ]}
                onPress={() => setSelectedIdea(selectedIdea === index ? null : index)}
              >
                <View style={ideaGeneratorStyles.ideaHeader}>
                  <View style={ideaGeneratorStyles.ideaNumber}>
                    <Text style={ideaGeneratorStyles.ideaNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={ideaGeneratorStyles.ideaText}>{idea}</Text>
                </View>
                <View style={ideaGeneratorStyles.ideaActions}>
                  <TouchableOpacity style={ideaGeneratorStyles.actionButton}>
                    <Ionicons name="heart-outline" size={20} color="#667eea" />
                  </TouchableOpacity>
                  <TouchableOpacity style={ideaGeneratorStyles.actionButton}>
                    <Ionicons name="share-social-outline" size={20} color="#667eea" />
                  </TouchableOpacity>
                  <TouchableOpacity style={ideaGeneratorStyles.actionButton}>
                    <Ionicons name="bookmark-outline" size={20} color="#667eea" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}