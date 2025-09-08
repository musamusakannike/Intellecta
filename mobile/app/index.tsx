import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../src/contexts/AuthContext';
import { router } from 'expo-router';

const ONBOARDING_KEY = 'hasSeenOnboarding';

export default function Index() {
  const { isAuthenticated, isLoading, user, pendingVerification } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (!initializing && hasSeenOnboarding !== null) {
      handleNavigation();
    }
  }, [initializing, hasSeenOnboarding, isAuthenticated, isLoading, pendingVerification]);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingStatus = await AsyncStorage.getItem(ONBOARDING_KEY);
      setHasSeenOnboarding(onboardingStatus === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setHasSeenOnboarding(false);
    } finally {
      setInitializing(false);
    }
  };

  const handleNavigation = () => {
    if (isLoading || initializing) return;

    if (!hasSeenOnboarding) {
      // First time user - show onboarding
      router.replace('/onboarding');
    } else if (pendingVerification) {
      // User needs to verify email
      router.replace({
        pathname: '/auth/email-verification',
        params: {
          email: pendingVerification.email,
          name: pendingVerification.name,
        },
      });
    } else if (isAuthenticated && user) {
      // Authenticated user - go to main app
      router.replace('/(tabs)');
    } else {
      // Not authenticated - show login
      router.replace('/auth/welcome');
    }
  };

  // Show loading screen while determining navigation
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#100A1F'
    }}>
      <ActivityIndicator size="large" color="#8B5FBF" />
    </View>
  );
}
