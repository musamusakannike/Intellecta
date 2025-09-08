import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../types';

// Action types
type SettingsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_SETTINGS'; payload: AppSettings }
  | { type: 'UPDATE_SETTING'; payload: { key: keyof AppSettings; value: any } }
  | { type: 'UPDATE_NOTIFICATION_SETTING'; payload: { key: keyof AppSettings['notifications']; value: boolean } }
  | { type: 'RESET_SETTINGS' };

// Settings context type
interface SettingsContextType {
  settings: AppSettings;
  isLoading: boolean;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
  updateNotificationSetting: (key: keyof AppSettings['notifications'], value: boolean) => Promise<void>;
  resetSettings: () => Promise<void>;
}

// Default settings
const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'en',
  autoDownload: true,
  videoQuality: 'auto',
  offlineOnly: false,
  notifications: {
    courseUpdates: true,
    reminders: true,
    promotions: false,
  },
};

// Initial state
interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
}

const initialState: SettingsState = {
  settings: defaultSettings,
  isLoading: true,
};

// Settings reducer
const settingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'LOAD_SETTINGS':
      return {
        ...state,
        settings: action.payload,
        isLoading: false,
      };
    
    case 'UPDATE_SETTING':
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.payload.key]: action.payload.value,
        },
      };
    
    case 'UPDATE_NOTIFICATION_SETTING':
      return {
        ...state,
        settings: {
          ...state.settings,
          notifications: {
            ...state.settings.notifications,
            [action.payload.key]: action.payload.value,
          },
        },
      };
    
    case 'RESET_SETTINGS':
      return {
        ...state,
        settings: defaultSettings,
      };
    
    default:
      return state;
  }
};

// Create context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Storage key
const SETTINGS_KEY = 'app_settings';

// Settings provider component
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // Load settings on app start
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const settingsData = await AsyncStorage.getItem(SETTINGS_KEY);
      
      if (settingsData) {
        const parsedSettings: AppSettings = JSON.parse(settingsData);
        // Merge with default settings to handle new settings added in updates
        const mergedSettings = { ...defaultSettings, ...parsedSettings };
        dispatch({ type: 'LOAD_SETTINGS', payload: mergedSettings });
      } else {
        // First time user - save default settings
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
        dispatch({ type: 'LOAD_SETTINGS', payload: defaultSettings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      dispatch({ type: 'LOAD_SETTINGS', payload: defaultSettings });
    }
  };

  const updateSetting = async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): Promise<void> => {
    try {
      dispatch({ type: 'UPDATE_SETTING', payload: { key, value } });
      
      const updatedSettings = { ...state.settings, [key]: value };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  };

  const updateNotificationSetting = async (
    key: keyof AppSettings['notifications'],
    value: boolean
  ): Promise<void> => {
    try {
      dispatch({ type: 'UPDATE_NOTIFICATION_SETTING', payload: { key, value } });
      
      const updatedSettings = {
        ...state.settings,
        notifications: {
          ...state.settings.notifications,
          [key]: value,
        },
      };
      
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error updating notification setting:', error);
      throw error;
    }
  };

  const resetSettings = async (): Promise<void> => {
    try {
      dispatch({ type: 'RESET_SETTINGS' });
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  };

  const contextValue: SettingsContextType = {
    settings: state.settings,
    isLoading: state.isLoading,
    updateSetting,
    updateNotificationSetting,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

// Hook to use settings context
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
