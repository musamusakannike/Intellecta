import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/welcome');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Intellecta</Text>
      <Text style={styles.subtitle}>Hello, {user?.name}!</Text>
      
      <View style={styles.content}>
        <Text style={styles.text}>
          🎉 Authentication system is working!{'\n\n'}
          You&apos;re now logged in and can start building the main app features.
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100A1F',
    padding: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#8B5FBF',
    textAlign: 'center',
    marginBottom: 40,
  },
  content: {
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.2)',
    marginBottom: 40,
  },
  text: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
  },
});
