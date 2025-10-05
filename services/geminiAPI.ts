// Google Gemini AI API Service
import Constants from 'expo-constants';

const GEMINI_API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY || process.env.GEMINI_API_KEY || 'your_api_key_here';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
const GEMINI_VISION_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent';

export interface GeminiMessage {
  role?: 'user' | 'model';
  parts: Array<{
    text?: string;
    inlineData?: {
      mimeType: string;
      data: string;
    };
  }>;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
      role: string;
    };
    finishReason: string;
    index: number;
    safetyRatings: Array<any>;
  }>;
  promptFeedback?: {
    safetyRatings: Array<any>;
  };
}

export interface ImagePromptEnhancement {
  enhancedPrompt: string;
  visualElements: string[];
  artStyle: string;
  composition: string;
  lighting: string;
  colorPalette: string[];
}

export class GeminiAPI {
  private apiKey: string;
  private apiUrl: string;
  private visionUrl: string;

  constructor() {
    this.apiKey = GEMINI_API_KEY;
    this.apiUrl = GEMINI_API_URL;
    this.visionUrl = GEMINI_VISION_URL;
  }

  private async makeRequest(url: string, messages: GeminiMessage[], temperature: number = 0.7): Promise<string> {
    try {
      console.log('Making Gemini API request to:', url);
      
      const response = await fetch(`${url}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: temperature,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  async enhanceImagePrompt(originalPrompt: string, style: string = 'realistic'): Promise<ImagePromptEnhancement> {
    const enhancementPrompt = `
As an expert AI image prompt engineer, enhance this image description for optimal AI image generation:

Original Prompt: "${originalPrompt}"
Desired Style: ${style}

Please provide a detailed enhancement including:
1. Enhanced prompt (detailed visual description)
2. Visual elements (specific objects, subjects)
3. Art style details
4. Composition guidelines
5. Lighting description
6. Color palette suggestions

Format your response as JSON:
{
  "enhancedPrompt": "detailed visual description",
  "visualElements": ["element1", "element2", "element3"],
  "artStyle": "style description",
  "composition": "composition details",
  "lighting": "lighting description",
  "colorPalette": ["color1", "color2", "color3"]
}
    `;

    try {
      const messages: GeminiMessage[] = [{
        parts: [{ text: enhancementPrompt }]
      }];

      const response = await this.makeRequest(this.apiUrl, messages, 0.8);
      
      // Try to parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const enhancement = JSON.parse(jsonMatch[0]);
        return {
          enhancedPrompt: enhancement.enhancedPrompt || originalPrompt,
          visualElements: enhancement.visualElements || [],
          artStyle: enhancement.artStyle || style,
          composition: enhancement.composition || 'balanced composition',
          lighting: enhancement.lighting || 'natural lighting',
          colorPalette: enhancement.colorPalette || []
        };
      }

      // Fallback if JSON parsing fails
      return {
        enhancedPrompt: `${originalPrompt}, ${style} style, high quality, detailed, professional composition`,
        visualElements: originalPrompt.split(' ').slice(0, 3),
        artStyle: style,
        composition: 'centered composition',
        lighting: 'natural lighting',
        colorPalette: ['vibrant', 'balanced', 'harmonious']
      };

    } catch (error) {
      console.error('Prompt enhancement error:', error);
      // Return enhanced fallback
      return {
        enhancedPrompt: `${originalPrompt}, ${style} style, high quality, detailed artwork, professional composition, excellent lighting`,
        visualElements: [originalPrompt],
        artStyle: style,
        composition: 'balanced composition',
        lighting: 'natural lighting',
        colorPalette: ['vibrant', 'harmonious']
      };
    }
  }

  async generateImageDescription(prompt: string, style: string): Promise<string> {
    const descriptionPrompt = `
Create a vivid, detailed visual description for an AI image generator based on this prompt:

Prompt: "${prompt}"
Style: ${style}

Provide a rich, descriptive paragraph (100-150 words) that includes:
- Detailed visual elements
- Artistic style specifications
- Lighting and atmosphere
- Color schemes and mood
- Composition details

Make it highly descriptive and optimized for AI image generation.
    `;

    try {
      const messages: GeminiMessage[] = [{
        parts: [{ text: descriptionPrompt }]
      }];

      return await this.makeRequest(this.apiUrl, messages, 0.7);
    } catch (error) {
      console.error('Image description generation error:', error);
      throw error;
    }
  }

  async analyzeImagePrompt(prompt: string): Promise<{
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    suggestions: string[];
    missingElements: string[];
    score: number;
  }> {
    const analysisPrompt = `
Analyze this image generation prompt and provide feedback:

Prompt: "${prompt}"

Evaluate based on:
1. Descriptive detail level
2. Visual specificity
3. Artistic direction
4. Technical clarity

Provide response as JSON:
{
  "quality": "excellent|good|fair|poor",
  "suggestions": ["suggestion1", "suggestion2"],
  "missingElements": ["element1", "element2"],
  "score": 0-100
}
    `;

    try {
      const messages: GeminiMessage[] = [{
        parts: [{ text: analysisPrompt }]
      }];

      const response = await this.makeRequest(this.apiUrl, messages, 0.3);
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback analysis
      return {
        quality: 'good',
        suggestions: ['Add more visual details', 'Specify lighting conditions'],
        missingElements: ['color palette', 'composition style'],
        score: 75
      };

    } catch (error) {
      console.error('Prompt analysis error:', error);
      return {
        quality: 'fair',
        suggestions: ['Unable to analyze prompt'],
        missingElements: [],
        score: 60
      };
    }
  }

  async generateCreativeVariations(prompt: string, count: number = 3): Promise<string[]> {
    const variationPrompt = `
Generate ${count} creative variations of this image prompt, each with a different artistic approach:

Original: "${prompt}"

Return only a JSON array of variations:
["variation1", "variation2", "variation3"]

Make each variation unique in style, mood, or perspective while maintaining the core concept.
    `;

    try {
      const messages: GeminiMessage[] = [{
        parts: [{ text: variationPrompt }]
      }];

      const response = await this.makeRequest(this.apiUrl, messages, 0.9);
      
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback variations
      return [
        `${prompt}, artistic interpretation`,
        `${prompt}, cinematic style`,
        `${prompt}, abstract approach`
      ];

    } catch (error) {
      console.error('Variation generation error:', error);
      return [prompt];
    }
  }

  async improveImagePrompt(prompt: string): Promise<string> {
    const improvementPrompt = `
Improve this image generation prompt to be more detailed and effective:

Original: "${prompt}"

Enhanced version should include:
- More specific visual details
- Better artistic direction
- Improved composition guidance
- Enhanced lighting/mood description

Return only the improved prompt, no explanation needed.
    `;

    try {
      const messages: GeminiMessage[] = [{
        parts: [{ text: improvementPrompt }]
      }];

      return await this.makeRequest(this.apiUrl, messages, 0.6);
    } catch (error) {
      console.error('Prompt improvement error:', error);
      return `${prompt}, high quality, detailed, professional artwork`;
    }
  }

  async generateStyleSuggestions(prompt: string): Promise<string[]> {
    const stylePrompt = `
Based on this image prompt, suggest 6 different artistic styles that would work well:

Prompt: "${prompt}"

Return only a JSON array of style names:
["style1", "style2", "style3", "style4", "style5", "style6"]

Focus on diverse artistic approaches.
    `;

    try {
      const messages: GeminiMessage[] = [{
        parts: [{ text: stylePrompt }]
      }];

      const response = await this.makeRequest(this.apiUrl, messages, 0.7);
      
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback styles
      return ['Realistic', 'Artistic', 'Digital Art', 'Abstract', 'Vintage', 'Cartoon'];

    } catch (error) {
      console.error('Style suggestion error:', error);
      return ['Realistic', 'Artistic', 'Digital Art'];
    }
  }
}

export const geminiAPI = new GeminiAPI();