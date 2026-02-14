import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

// Keys for secure storage
const STORAGE_KEYS = {
  API_KEY: 'clear_api_key',
  USER_PREFERENCES: 'clear_preferences',
};

// Settings store
const useSettingsStore = create((set, get) => ({
  // State
  apiKey: null,
  isLoading: true,
  preferences: {
    notifications: true,
    autoSave: true,
    darkMode: true,
    defaultReadingLevel: 'general',
  },
  
  // Initialize - load from secure storage
  initialize: async () => {
    try {
      const apiKey = await SecureStore.getItemAsync(STORAGE_KEYS.API_KEY);
      const prefsJson = await SecureStore.getItemAsync(STORAGE_KEYS.USER_PREFERENCES);
      const preferences = prefsJson ? JSON.parse(prefsJson) : get().preferences;
      
      set({ apiKey, preferences, isLoading: false });
    } catch (error) {
      console.error('Failed to load settings:', error);
      set({ isLoading: false });
    }
  },
  
  // Set API key
  setApiKey: async (key) => {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.API_KEY, key);
      set({ apiKey: key });
    } catch (error) {
      console.error('Failed to save API key:', error);
      throw error;
    }
  },
  
  // Clear API key
  clearApiKey: async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.API_KEY);
      set({ apiKey: null });
    } catch (error) {
      console.error('Failed to clear API key:', error);
    }
  },
  
  // Update preferences
  updatePreferences: async (updates) => {
    try {
      const newPrefs = { ...get().preferences, ...updates };
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(newPrefs));
      set({ preferences: newPrefs });
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  },
  
  // Reset all settings
  resetSettings: async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.API_KEY);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_PREFERENCES);
      set({
        apiKey: null,
        preferences: {
          notifications: true,
          autoSave: true,
          darkMode: true,
          defaultReadingLevel: 'general',
        },
      });
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  },
}));

export default useSettingsStore;
