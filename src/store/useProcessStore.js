// ProcessMap State Store
// Manages user progress, preferences, and UI state
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProcessStore = create(
  persist(
    (set, get) => ({
      // User progress tracking
      progress: {},
      // Format: { processId: { completedSteps: ['step1', 'step2'], currentStep: 'step3', startedAt: Date, notes: {} } }
      
      // UI state
      selectedProcess: null,
      selectedStep: null,
      viewMode: 'flowchart', // 'flowchart' | 'list' | 'checklist'
      
      // Location preference
      userLocation: {
        state: null,
        county: null,
        city: null
      },
      
      // Actions
      setSelectedProcess: (processId) => set({ selectedProcess: processId, selectedStep: null }),
      
      setSelectedStep: (stepId) => set({ selectedStep: stepId }),
      
      setViewMode: (mode) => set({ viewMode: mode }),
      
      setUserLocation: (location) => set({ userLocation: { ...get().userLocation, ...location } }),
      
      // Progress actions
      startProcess: (processId) => set((state) => ({
        progress: {
          ...state.progress,
          [processId]: {
            completedSteps: [],
            currentStep: null,
            startedAt: new Date().toISOString(),
            notes: {}
          }
        }
      })),
      
      completeStep: (processId, stepId) => set((state) => {
        const processProgress = state.progress[processId] || {
          completedSteps: [],
          currentStep: null,
          startedAt: new Date().toISOString(),
          notes: {}
        };
        
        const completedSteps = processProgress.completedSteps.includes(stepId)
          ? processProgress.completedSteps
          : [...processProgress.completedSteps, stepId];
        
        return {
          progress: {
            ...state.progress,
            [processId]: {
              ...processProgress,
              completedSteps
            }
          }
        };
      }),
      
      uncompleteStep: (processId, stepId) => set((state) => {
        const processProgress = state.progress[processId];
        if (!processProgress) return state;
        
        return {
          progress: {
            ...state.progress,
            [processId]: {
              ...processProgress,
              completedSteps: processProgress.completedSteps.filter(id => id !== stepId)
            }
          }
        };
      }),
      
      setCurrentStep: (processId, stepId) => set((state) => {
        const processProgress = state.progress[processId] || {
          completedSteps: [],
          currentStep: null,
          startedAt: new Date().toISOString(),
          notes: {}
        };
        
        return {
          progress: {
            ...state.progress,
            [processId]: {
              ...processProgress,
              currentStep: stepId
            }
          }
        };
      }),
      
      addNote: (processId, stepId, note) => set((state) => {
        const processProgress = state.progress[processId];
        if (!processProgress) return state;
        
        return {
          progress: {
            ...state.progress,
            [processId]: {
              ...processProgress,
              notes: {
                ...processProgress.notes,
                [stepId]: note
              }
            }
          }
        };
      }),
      
      resetProcess: (processId) => set((state) => {
        const { [processId]: removed, ...rest } = state.progress;
        return { progress: rest };
      }),
      
      resetAllProgress: () => set({ progress: {} }),
      
      // Computed getters
      getProcessProgress: (processId) => {
        const state = get();
        return state.progress[processId] || null;
      },
      
      isStepCompleted: (processId, stepId) => {
        const state = get();
        const progress = state.progress[processId];
        return progress?.completedSteps?.includes(stepId) || false;
      },
      
      getCompletionPercentage: (processId, totalSteps) => {
        const state = get();
        const progress = state.progress[processId];
        if (!progress || !totalSteps) return 0;
        return Math.round((progress.completedSteps.length / totalSteps) * 100);
      }
    }),
    {
      name: 'processmap-storage',
      partialize: (state) => ({
        progress: state.progress,
        userLocation: state.userLocation,
        viewMode: state.viewMode
      })
    }
  )
);

export default useProcessStore;
