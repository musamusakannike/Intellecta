import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { offlineStorage } from '../services/offlineStorage';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
  isWifi: boolean;
  isCellular: boolean;
}

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: 'unknown',
    isWifi: false,
    isCellular: false,
  });

  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      const status: NetworkStatus = {
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        type: state.type,
        isWifi: state.type === 'wifi',
        isCellular: state.type === 'cellular',
      };
      
      setNetworkStatus(status);
      
      // Update offline storage sync status
      offlineStorage.updateSyncStatus({
        isOnline: status.isConnected && status.isInternetReachable,
      });
    });

    // Get initial network state
    NetInfo.fetch().then(state => {
      const status: NetworkStatus = {
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        type: state.type,
        isWifi: state.type === 'wifi',
        isCellular: state.type === 'cellular',
      };
      
      setNetworkStatus(status);
    });

    return unsubscribe;
  }, []);

  const toggleOfflineMode = async () => {
    const newOfflineMode = !isOfflineMode;
    setIsOfflineMode(newOfflineMode);
    
    await offlineStorage.updateSyncStatus({
      isOnline: !newOfflineMode && networkStatus.isConnected,
    });
  };

  const isOnline = networkStatus.isConnected && 
                   networkStatus.isInternetReachable && 
                   !isOfflineMode;

  return {
    networkStatus,
    isOnline,
    isOfflineMode,
    toggleOfflineMode,
  };
};
