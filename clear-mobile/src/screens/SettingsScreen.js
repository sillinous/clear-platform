import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useSettingsStore from '../store/settingsStore';

export default function SettingsScreen() {
  const { apiKey, setApiKey, clearApiKey } = useSettingsStore();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Preferences
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleSaveKey = async () => {
    if (!inputKey.trim()) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }
    
    if (!inputKey.startsWith('sk-ant-')) {
      Alert.alert('Invalid Key', 'API keys should start with "sk-ant-"');
      return;
    }
    
    setIsSaving(true);
    
    // Simulate API validation
    setTimeout(() => {
      setApiKey(inputKey);
      setIsSaving(false);
      Alert.alert('Success', 'API key saved successfully');
    }, 1000);
  };

  const handleClearKey = () => {
    Alert.alert(
      'Clear API Key',
      'Remove your API key and switch to demo mode?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {
          clearApiKey();
          setInputKey('');
        }},
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* API Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Configuration</Text>
        <View style={styles.card}>
          {/* Status */}
          <View style={styles.statusRow}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusBadge}>
              <View style={[styles.statusDot, { backgroundColor: apiKey ? '#22c55e' : '#64748b' }]} />
              <Text style={[styles.statusText, { color: apiKey ? '#22c55e' : '#64748b' }]}>
                {apiKey ? 'Connected' : 'Demo Mode'}
              </Text>
            </View>
          </View>

          {/* API Key Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Anthropic API Key</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="sk-ant-..."
                placeholderTextColor="#64748b"
                value={inputKey}
                onChangeText={setInputKey}
                secureTextEntry={!showKey}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowKey(!showKey)}
              >
                <Ionicons 
                  name={showKey ? 'eye-off' : 'eye'} 
                  size={20} 
                  color="#64748b" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.saveButton, isSaving && styles.buttonDisabled]}
              onPress={handleSaveKey}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save Key'}
              </Text>
            </TouchableOpacity>
            {apiKey && (
              <TouchableOpacity style={styles.clearButton} onPress={handleClearKey}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Help */}
          <View style={styles.helpBox}>
            <Ionicons name="information-circle" size={18} color="#3b82f6" />
            <Text style={styles.helpText}>
              Get your API key from console.anthropic.com
            </Text>
          </View>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={20} color="#94a3b8" />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#334155', true: '#3b82f6' }}
              thumbColor="#ffffff"
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="save" size={20} color="#94a3b8" />
              <Text style={styles.settingLabel}>Auto-save Translations</Text>
            </View>
            <Switch
              value={autoSave}
              onValueChange={setAutoSave}
              trackColor={{ false: '#334155', true: '#3b82f6' }}
              thumbColor="#ffffff"
            />
          </View>
          
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={20} color="#94a3b8" />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#334155', true: '#3b82f6' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </View>

      {/* Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="cloud-download" size={20} color="#94a3b8" />
              <Text style={styles.settingLabel}>Export My Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="trash" size={20} color="#f87171" />
              <Text style={[styles.settingLabel, { color: '#f87171' }]}>Clear All Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Build</Text>
            <Text style={styles.aboutValue}>2024.02.14</Text>
          </View>
          <View style={[styles.aboutRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.aboutLabel}>Platform</Text>
            <Text style={styles.aboutValue}>CLEAR Coalition</Text>
          </View>
        </View>
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
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  label: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  input: {
    flex: 1,
    padding: 14,
    color: '#e2e8f0',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  eyeButton: {
    padding: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  saveButton: {
    flex: 1,
    padding: 14,
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#334155',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
  clearButton: {
    padding: 14,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  clearButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f87171',
  },
  helpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  helpText: {
    fontSize: 13,
    color: '#94a3b8',
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  settingLabel: {
    fontSize: 15,
    color: '#e2e8f0',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  aboutLabel: {
    fontSize: 15,
    color: '#94a3b8',
  },
  aboutValue: {
    fontSize: 15,
    color: '#e2e8f0',
  },
  spacer: {
    height: 40,
  },
});
