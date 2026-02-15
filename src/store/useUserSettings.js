import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getBrowserLanguage } from '../utils/i18n';

// User Settings Store - manages API keys and preferences
// Keys are stored in localStorage (client-side only, never sent to server logs)

const useUserSettings = create(
  persist(
    (set, get) => ({
      // API Keys
      anthropicApiKey: '',
      apiKeyLastValidated: null,
      apiKeyStatus: 'none', // 'none' | 'valid' | 'invalid' | 'checking'
      
      // Preferences
      preferredReadingLevel: 'general',
      autoSaveProgress: true,
      theme: 'dark',
      language: getBrowserLanguage(),
      
      // Usage tracking (local only)
      translationsCount: 0,
      lastTranslationAt: null,
      
      // Actions
      setAnthropicApiKey: (key) => set({ 
        anthropicApiKey: key,
        apiKeyStatus: key ? 'unchecked' : 'none',
        apiKeyLastValidated: null
      }),
      
      setApiKeyStatus: (status) => set({ 
        apiKeyStatus: status,
        apiKeyLastValidated: status === 'valid' ? new Date().toISOString() : null
      }),
      
      clearApiKey: () => set({
        anthropicApiKey: '',
        apiKeyStatus: 'none',
        apiKeyLastValidated: null
      }),
      
      setPreferredReadingLevel: (level) => set({ preferredReadingLevel: level }),
      
      setAutoSaveProgress: (enabled) => set({ autoSaveProgress: enabled }),
      
      setLanguage: (lang) => set({ language: lang }),
      
      incrementTranslations: () => set((state) => ({
        translationsCount: state.translationsCount + 1,
        lastTranslationAt: new Date().toISOString()
      })),
      
      // Validate API key by making a minimal API call
      validateApiKey: async (key) => {
        if (!key || !key.startsWith('sk-ant-')) {
          set({ apiKeyStatus: 'invalid' });
          return false;
        }
        
        set({ apiKeyStatus: 'checking' });
        
        try {
          const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': key
            },
            body: JSON.stringify({
              text: 'Test validation.',
              level: 'simple'
            })
          });
          
          if (response.ok) {
            set({ 
              apiKeyStatus: 'valid',
              apiKeyLastValidated: new Date().toISOString()
            });
            return true;
          } else {
            const data = await response.json();
            // Check if it's a billing issue vs invalid key
            if (data.message?.includes('credit balance')) {
              set({ apiKeyStatus: 'no_credits' });
            } else {
              set({ apiKeyStatus: 'invalid' });
            }
            return false;
          }
        } catch (error) {
          set({ apiKeyStatus: 'error' });
          return false;
        }
      },
      
      // Check if user has a working API key
      hasValidApiKey: () => {
        const state = get();
        return state.anthropicApiKey && state.apiKeyStatus === 'valid';
      },
      
      // Get the API key to use (user's key or fallback to server)
      getActiveApiKey: () => {
        const state = get();
        return state.anthropicApiKey || null;
      }
    }),
    {
      name: 'clear-user-settings',
      partialize: (state) => ({
        anthropicApiKey: state.anthropicApiKey,
        apiKeyLastValidated: state.apiKeyLastValidated,
        apiKeyStatus: state.apiKeyStatus,
        preferredReadingLevel: state.preferredReadingLevel,
        autoSaveProgress: state.autoSaveProgress,
        translationsCount: state.translationsCount,
        lastTranslationAt: state.lastTranslationAt
      })
    }
  )
);

export default useUserSettings;
