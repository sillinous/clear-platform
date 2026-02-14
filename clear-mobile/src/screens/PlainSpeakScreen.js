import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as DocumentPicker from 'expo-document-picker';
import useSettingsStore from '../store/settingsStore';

const readingLevels = [
  { id: 'simple', label: '5th Grade', icon: 'book' },
  { id: 'general', label: 'General', icon: 'people' },
  { id: 'professional', label: 'Professional', icon: 'briefcase' },
];

const sampleTexts = [
  {
    title: 'Privacy Policy',
    text: 'Notwithstanding any provisions herein to the contrary, the Company reserves the right to collect, process, and disseminate any information for purposes including targeted advertising and third-party data sharing.',
  },
  {
    title: 'Lease Clause',
    text: 'The Lessee shall indemnify, defend, and hold harmless the Lessor from any and all claims, damages, and expenses arising from any occurrence on the Premises.',
  },
];

export default function PlainSpeakScreen() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [readingLevel, setReadingLevel] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [riskScore, setRiskScore] = useState(null);
  const { apiKey } = useSettingsStore();

  const translateText = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some text to translate');
      return;
    }

    setIsLoading(true);
    setOutputText('');
    setRiskScore(null);

    try {
      if (apiKey) {
        // Use real API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            messages: [{
              role: 'user',
              content: `Translate this legal text into plain language for ${readingLevel === 'simple' ? 'a 5th grader' : readingLevel === 'general' ? 'the general public' : 'business professionals'}. Be concise. Also rate the risk level 1-10.

Text: ${inputText}

Format:
TRANSLATION: [your translation]
RISK: [1-10]`,
            }],
          }),
        });

        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        const content = data.content[0].text;
        
        const translationMatch = content.match(/TRANSLATION:\s*([\s\S]*?)(?=RISK:|$)/i);
        const riskMatch = content.match(/RISK:\s*(\d+)/i);
        
        setOutputText(translationMatch ? translationMatch[1].trim() : content);
        setRiskScore(riskMatch ? parseInt(riskMatch[1]) : null);
      } else {
        // Demo mode
        await new Promise(r => setTimeout(r, 1000));
        
        const lowerText = inputText.toLowerCase();
        let translation = '';
        let risk = 5;
        
        if (lowerText.includes('privacy') || lowerText.includes('data')) {
          translation = readingLevel === 'simple'
            ? 'They can collect and share your personal information with other companies.'
            : 'This grants broad rights to collect and share your data with third parties.';
          risk = 7;
        } else if (lowerText.includes('indemnify') || lowerText.includes('liability')) {
          translation = readingLevel === 'simple'
            ? 'If something bad happens, you have to pay for it and protect them from lawsuits.'
            : 'You assume financial responsibility for claims and must defend against legal actions.';
          risk = 8;
        } else {
          translation = readingLevel === 'simple'
            ? 'This legal text has important rules you need to follow. Read it carefully.'
            : 'This establishes contractual obligations. Review key terms before agreeing.';
        }
        
        setOutputText(translation);
        setRiskScore(risk);
      }
    } catch (error) {
      Alert.alert('Error', 'Translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (outputText) {
      await Clipboard.setStringAsync(outputText);
      Alert.alert('Copied', 'Translation copied to clipboard');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', 'application/pdf'],
      });
      
      if (!result.canceled && result.assets[0]) {
        Alert.alert('Document Selected', `Selected: ${result.assets[0].name}\n\nNote: Full document parsing requires the web app.`);
      }
    } catch (error) {
      console.log('Document picker error:', error);
    }
  };

  const getRiskColor = (score) => {
    if (score <= 3) return '#22c55e';
    if (score <= 5) return '#eab308';
    if (score <= 7) return '#f97316';
    return '#ef4444';
  };

  const getRiskLabel = (score) => {
    if (score <= 3) return 'Low Risk';
    if (score <= 5) return 'Moderate';
    if (score <= 7) return 'High Risk';
    return 'Critical';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Reading Level Selector */}
      <View style={styles.section}>
        <Text style={styles.label}>Reading Level</Text>
        <View style={styles.levelContainer}>
          {readingLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelButton,
                readingLevel === level.id && styles.levelButtonActive,
              ]}
              onPress={() => setReadingLevel(level.id)}
            >
              <Ionicons
                name={level.icon}
                size={18}
                color={readingLevel === level.id ? '#3b82f6' : '#64748b'}
              />
              <Text
                style={[
                  styles.levelText,
                  readingLevel === level.id && styles.levelTextActive,
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Input Section */}
      <View style={styles.section}>
        <View style={styles.inputHeader}>
          <Text style={styles.label}>Legal Text</Text>
          <TouchableOpacity onPress={pickDocument} style={styles.uploadButton}>
            <Ionicons name="document-attach" size={18} color="#3b82f6" />
            <Text style={styles.uploadText}>Upload</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Paste legal text here..."
          placeholderTextColor="#64748b"
          value={inputText}
          onChangeText={setInputText}
          textAlignVertical="top"
        />
      </View>

      {/* Sample Texts */}
      <View style={styles.sampleContainer}>
        <Text style={styles.sampleLabel}>Try a sample:</Text>
        <View style={styles.sampleButtons}>
          {sampleTexts.map((sample, index) => (
            <TouchableOpacity
              key={index}
              style={styles.sampleButton}
              onPress={() => setInputText(sample.text)}
            >
              <Text style={styles.sampleButtonText}>{sample.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Translate Button */}
      <TouchableOpacity
        style={[styles.translateButton, isLoading && styles.translateButtonDisabled]}
        onPress={translateText}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Ionicons name="sparkles" size={20} color="white" />
            <Text style={styles.translateButtonText}>Translate</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Output Section */}
      {(outputText || isLoading) && (
        <View style={styles.section}>
          <View style={styles.outputHeader}>
            <Text style={styles.label}>Plain Language</Text>
            {outputText && (
              <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                <Ionicons name="copy" size={18} color="#3b82f6" />
                <Text style={styles.copyText}>Copy</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {riskScore && (
            <View style={[styles.riskBadge, { backgroundColor: getRiskColor(riskScore) + '20' }]}>
              <Ionicons name="shield" size={16} color={getRiskColor(riskScore)} />
              <Text style={[styles.riskText, { color: getRiskColor(riskScore) }]}>
                {riskScore}/10 - {getRiskLabel(riskScore)}
              </Text>
            </View>
          )}
          
          <View style={styles.outputBox}>
            <Text style={styles.outputText}>
              {outputText || 'Translating...'}
            </Text>
          </View>
        </View>
      )}

      {/* API Status */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: apiKey ? '#22c55e' : '#64748b' }]} />
        <Text style={styles.statusText}>
          {apiKey ? 'AI Connected' : 'Demo Mode'}
        </Text>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  section: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 12,
  },
  levelContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  levelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  levelButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3b82f6',
  },
  levelText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  levelTextActive: {
    color: '#3b82f6',
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  uploadText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  textInput: {
    height: 150,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 22,
  },
  sampleContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sampleLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  sampleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sampleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1e293b',
    borderRadius: 8,
  },
  sampleButtonText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  translateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
  },
  translateButtonDisabled: {
    backgroundColor: '#334155',
  },
  translateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  outputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copyText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  riskText: {
    fontSize: 13,
    fontWeight: '600',
  },
  outputBox: {
    padding: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  outputText: {
    fontSize: 15,
    color: '#e2e8f0',
    lineHeight: 24,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    color: '#64748b',
  },
  spacer: {
    height: 40,
  },
});
