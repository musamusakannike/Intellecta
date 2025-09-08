import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  interpolate,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

// Custom hook to create a progress bar animated style
const useProgressStyle = (progress: SharedValue<number>, color: string) => {
  return useAnimatedStyle(() => ({
    width: `${interpolate(progress.value, [0, 1], [0, 100])}%`,
    backgroundColor: color,
  }));
};

const AnimatedTerminal = () => {
  // Shared values for animations
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const progress1 = useSharedValue(0);
  const progress2 = useSharedValue(0);
  const progress3 = useSharedValue(0);
  const progress4 = useSharedValue(0);
  const cursorBlink = useSharedValue(1);

  useEffect(() => {
    // Initial container animation
    scale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, { duration: 600 });

    // Staggered progress bar animations
    progress1.value = withDelay(300, withTiming(0.6, { duration: 1200 }));
    progress2.value = withDelay(600, withTiming(0.85, { duration: 1400 }));
    progress3.value = withDelay(900, withTiming(0.7, { duration: 1000 }));
    progress4.value = withDelay(1200, withTiming(0.9, { duration: 1600 }));

    // Cursor blinking animation
    cursorBlink.value = withDelay(
      2000,
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 0 }),
        // Repeat blinking
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 }),
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 }),
      )
    );
  }, [cursorBlink, opacity, progress1, progress2, progress3, progress4, scale]);

  // Container animation style
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // Progress bar animation styles
  // Use custom hook for animated styles with proper typings
  const progress1Style = useProgressStyle(progress1, '#FF6B9D');
  const progress2Style = useProgressStyle(progress2, '#8B5FBF');
  const progress3Style = useProgressStyle(progress3, '#FF6B9D');
  const progress4Style = useProgressStyle(progress4, '#8B5FBF');

  // Cursor animation style
  const cursorStyle = useAnimatedStyle(() => ({
    opacity: cursorBlink.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.terminal, containerStyle]}>
        {/* Terminal Header */}
        <View style={styles.header}>
          <View style={[styles.dot, styles.redDot]} />
          <View style={[styles.dot, styles.yellowDot]} />
          <View style={[styles.dot, styles.greenDot]} />
        </View>

        {/* Progress Bars */}
        <View style={styles.content}>
          {/* First progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressBar, progress1Style]} />
            </View>
          </View>

          {/* Second progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressBar, progress2Style]} />
            </View>
          </View>

          {/* Third progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressBar, progress3Style]} />
            </View>
          </View>

          {/* Fourth progress bar with cursor */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressBar, progress4Style]} />
              <Animated.View style={[styles.cursor, cursorStyle]} />
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  terminal: {
    width: screenWidth * 0.85,
    maxWidth: 400,
    backgroundColor: '#2d2d3a',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8B5FBF',
    shadowColor: '#8B5FBF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  redDot: {
    backgroundColor: '#FF5F57',
  },
  yellowDot: {
    backgroundColor: '#FFBD2E',
  },
  greenDot: {
    backgroundColor: '#28CA42',
  },
  content: {
    padding: 20,
    paddingTop: 10,
    gap: 16,
  },
  progressContainer: {
    position: 'relative',
  },
  progressTrack: {
    height: 12,
    backgroundColor: '#404040',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  cursor: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 4,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});

export default AnimatedTerminal;