import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CoursesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Courses</Text>
      <Text style={styles.text}>Courses will be displayed here</Text>
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
    fontSize: 16,
    fontFamily: 'SpaceGrotesk',
    color: '#888',
    textAlign: 'center',
  },
});
