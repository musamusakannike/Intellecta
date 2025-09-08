import React, { ReactNode, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient, persister, focusManager, onlineManager } from '../services/queryClient';
import { AuthProvider } from './AuthContext';
import { SettingsProvider } from './SettingsContext';
import { AppState, AppStateStatus } from 'react-native';

interface AppProvidersProps {
  children: ReactNode;
}

// App state handler component for React Query focus management
const AppStateHandler: React.FC = () => {
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      focusManager.setFocused(nextAppState === 'active');
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, []);

  return null;
};

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        buster: 'v1', // Increment this to invalidate all persisted data
        hydrateOptions: {
          // Don't hydrate mutations or infinite queries
          shouldDehydrateQuery: (query) => {
            return query.queryKey[0] !== 'infinite' && !query.queryKey.includes('mutation');
          },
        },
      }}
    >
      <SettingsProvider>
        <AuthProvider>
          <AppStateHandler />
          {children}
        </AuthProvider>
      </SettingsProvider>
    </PersistQueryClientProvider>
  );
};
