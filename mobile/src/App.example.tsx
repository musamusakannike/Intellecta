import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { AppProviders } from './src/contexts/AppProviders';
import { useAuth } from './src/contexts/AuthContext';
import { useSettings } from './src/contexts/SettingsContext';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';
import { useOfflineData } from './src/hooks/useOfflineData';

// Example component using all the setup features
const ExampleHomeScreen: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { settings, isLoading: settingsLoading } = useSettings();
  const { networkStatus, isOnline, isOfflineMode } = useNetworkStatus();
  const { 
    offlineData, 
    syncStatus, 
    isLoadingOfflineData,
    isSyncing 
  } = useOfflineData();

  if (authLoading || settingsLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle={settings.theme === 'dark' ? 'light-content' : 'dark-content'} 
      />
      
      <Text style={styles.title}>Intellecta Mobile App</Text>
      
      {/* Auth Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication</Text>
        <Text>Status: {isAuthenticated ? 'Logged In' : 'Not Logged In'}</Text>
        {user && <Text>User: {user.name} ({user.email})</Text>}
      </View>

      {/* Network Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network Status</Text>
        <Text>Online: {isOnline ? 'Yes' : 'No'}</Text>
        <Text>Connection: {networkStatus.type}</Text>
        <Text>Offline Mode: {isOfflineMode ? 'Enabled' : 'Disabled'}</Text>
      </View>

      {/* Offline Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offline Data</Text>
        {isLoadingOfflineData ? (
          <Text>Loading offline data...</Text>
        ) : (
          <>
            <Text>Offline Courses: {offlineData?.courses.length || 0}</Text>
            <Text>Offline Lessons: {offlineData?.lessons.length || 0}</Text>
            <Text>Last Sync: {syncStatus.lastSyncAt || 'Never'}</Text>
            <Text>Syncing: {isSyncing ? 'Yes' : 'No'}</Text>
          </>
        )}
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <Text>Theme: {settings.theme}</Text>
        <Text>Language: {settings.language}</Text>
        <Text>Auto Download: {settings.autoDownload ? 'On' : 'Off'}</Text>
        <Text>Video Quality: {settings.videoQuality}</Text>
      </View>
    </View>
  );
};

// Main App component with providers
const App: React.FC = () => {
  return (
    <AppProviders>
      <ExampleHomeScreen />
    </AppProviders>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default App;
