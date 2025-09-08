import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.text}>Welcome, {user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100A1F',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#8B5FBF',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk',
    color: '#888',
  },
});
