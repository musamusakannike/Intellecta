import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

// OrbitalSystem Component
const OrbitalSystem = ({ isVisible = true }) => {
  const containerOpacity = useSharedValue(0);
  const containerScale = useSharedValue(0.5);
  const centerPulse = useSharedValue(0.8);
  const orbit1Rotation = useSharedValue(0);
  const orbit2Rotation = useSharedValue(0);
  const orbit3Rotation = useSharedValue(0);
  const dashedOrbitOpacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      containerOpacity.value = withTiming(1, { duration: 800 });
      containerScale.value = withTiming(1, {
        duration: 1000,
        easing: Easing.out(Easing.cubic),
      });

      dashedOrbitOpacity.value = withTiming(0.6, { 
        duration: 1200,
        easing: Easing.out(Easing.quad),
      });

      centerPulse.value = withSequence(
        withDelay(500, withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.sin) })),
        withTiming(0.9, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      );

      orbit1Rotation.value = withDelay(300, withTiming(360, {
        duration: 8000,
        easing: Easing.linear,
      }));

      orbit2Rotation.value = withDelay(600, withTiming(360, {
        duration: 12000,
        easing: Easing.linear,
      }));

      orbit3Rotation.value = withDelay(900, withTiming(360, {
        duration: 15000,
        easing: Easing.linear,
      }));
    }
  }, [isVisible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  const centerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: centerPulse.value }],
  }));

  const dashedOrbitStyle = useAnimatedStyle(() => ({
    opacity: dashedOrbitOpacity.value,
  }));

  const orbit1Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${orbit1Rotation.value}deg` }],
  }));

  const orbit2Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${orbit2Rotation.value}deg` }],
  }));

  const orbit3Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${orbit3Rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.orbitalSystem, containerStyle]}>
      <Animated.View style={[styles.dashedOrbit, dashedOrbitStyle]} />
      <View style={[styles.orbit, styles.orbit1]} />
      <View style={[styles.orbit, styles.orbit2]} />
      
      <Animated.View style={[styles.centerContainer, centerStyle]}>
        <View style={styles.centerGlow} />
        <View style={styles.centerPlanet} />
      </Animated.View>

      <Animated.View style={[styles.rotatingOrbit, orbit1Style]}>
        <View style={styles.orbitPath1}>
          <View style={[styles.planet, styles.pinkPlanet]}>
            <View style={styles.pinkGlow} />
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.rotatingOrbit, orbit2Style]}>
        <View style={styles.orbitPath2}>
          <View style={[styles.planet, styles.pinkPlanet]}>
            <View style={styles.pinkGlow} />
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.rotatingOrbit, orbit3Style]}>
        <View style={styles.orbitPath3}>
          <View style={[styles.planet, styles.whitePlanet]}>
            <View style={styles.whiteGlow} />
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

// AnimatedTerminal Component
const AnimatedTerminal = ({ isVisible = true }) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const progress1 = useSharedValue(0);
  const progress2 = useSharedValue(0);
  const progress3 = useSharedValue(0);
  const progress4 = useSharedValue(0);
  const cursorBlink = useSharedValue(1);

  useEffect(() => {
    if (isVisible) {
      scale.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(1, { duration: 600 });

      progress1.value = withDelay(300, withTiming(0.6, { duration: 1200 }));
      progress2.value = withDelay(600, withTiming(0.85, { duration: 1400 }));
      progress3.value = withDelay(900, withTiming(0.7, { duration: 1000 }));
      progress4.value = withDelay(1200, withTiming(0.9, { duration: 1600 }));

      cursorBlink.value = withDelay(
        2000,
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(1, { duration: 0 }),
          withTiming(0, { duration: 500 }),
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 500 }),
          withTiming(1, { duration: 500 }),
        )
      );
    }
  }, [isVisible]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const useProgressStyle = (progress: SharedValue<number>, color: string) => {
    return useAnimatedStyle(() => ({
      width: `${interpolate(progress.value, [0, 1], [0, 100])}%`,
      backgroundColor: color,
    }));
  };

  const progress1Style = useProgressStyle(progress1, '#FF6B9D');
  const progress2Style = useProgressStyle(progress2, '#8B5FBF');
  const progress3Style = useProgressStyle(progress3, '#FF6B9D');
  const progress4Style = useProgressStyle(progress4, '#8B5FBF');

  const cursorStyle = useAnimatedStyle(() => ({
    opacity: cursorBlink.value,
  }));

  return (
    <Animated.View style={[styles.terminal, containerStyle]}>
      <View style={styles.header}>
        <View style={[styles.dot, styles.redDot]} />
        <View style={[styles.dot, styles.yellowDot]} />
        <View style={[styles.dot, styles.greenDot]} />
      </View>

      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressBar, progress1Style]} />
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressBar, progress2Style]} />
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressBar, progress3Style]} />
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressBar, progress4Style]} />
            <Animated.View style={[styles.cursor, cursorStyle]} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

// Main Onboarding Component
const OnboardingScreen = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const translateX = useSharedValue(0);
  const textOpacity = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  const screens = [
    {
      title: 'Code. Create.\nConquer.',
      subtitle: 'Start your journey into the world of\nprogramming.',
      component: <Ionicons name="code-slash" size={120} color="#8B5FBF" />,
      buttonText: 'Get Started',
    },
    {
      title: 'Unlock Your\nPotential.',
      subtitle: 'Master the art of development with\ninteractive lessons and projects.',
      component: <AnimatedTerminal isVisible={currentScreen === 1} />,
      buttonText: 'Continue',
    },
    {
      title: 'Journey to\nMastery.',
      subtitle: 'Build real projects and join a community\nof passionate developers.',
      component: <OrbitalSystem isVisible={currentScreen === 2} />,
      buttonText: 'Continue',
    },
  ];

  const nextScreen = () => {
    if (currentScreen < screens.length - 1) {
      // Animate out current content
      textOpacity.value = withTiming(0, { duration: 300 });
      translateX.value = withTiming(-screenWidth, { duration: 400 });
      
      setTimeout(() => {
        setCurrentScreen(currentScreen + 1);
        translateX.value = screenWidth;
        
        // Animate in new content
        setTimeout(() => {
          translateX.value = withTiming(0, { duration: 400 });
          textOpacity.value = withTiming(1, { duration: 300 });
        }, 50);
      }, 300);
    } else {
      // Handle final action (navigate to main app)
      console.log('Onboarding completed!');
    }
  };

  const onButtonPress = () => {
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    setTimeout(nextScreen, 200);
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const currentScreenData = screens[currentScreen];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#100A1F" />
      
      <Animated.View style={[styles.screenContainer, containerStyle]}>
        {/* Component Area */}
        <View style={styles.componentArea}>
          {currentScreenData.component}
        </View>

        {/* Text Content */}
        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text style={styles.title}>{currentScreenData.title}</Text>
          <Text style={styles.subtitle}>{currentScreenData.subtitle}</Text>
        </Animated.View>

        {/* Page Indicators */}
        <View style={styles.indicatorsContainer}>
          {screens.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentScreen && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        {/* Continue Button */}
        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <TouchableOpacity
            style={styles.button}
            onPress={onButtonPress}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{currentScreenData.buttonText}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100A1F',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  componentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 60,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: "SpaceGrotesk-Bold",
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "SpaceGrotesk",
    color: '#B8B8B8',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#404040',
  },
  activeIndicator: {
    backgroundColor: '#8B5FBF',
    width: 24,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#8B5FBF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#8B5FBF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: "SpaceGrotesk-Bold",
  },

  // OrbitalSystem styles
  orbitalSystem: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    maxWidth: 250,
    maxHeight: 250,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashedOrbit: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    borderWidth: 2,
    borderColor: '#8B5FBF',
    borderStyle: 'dashed',
  },
  orbit: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 1.5,
    borderColor: '#8B5FBF',
  },
  orbit1: {
    width: '75%',
    height: '75%',
  },
  orbit2: {
    width: '50%',
    height: '50%',
  },
  centerContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B5FBF',
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 10,
  },
  centerPlanet: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#8B5FBF',
  },
  rotatingOrbit: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  orbitPath1: {
    position: 'absolute',
    top: '12.5%',
    left: '50%',
    marginLeft: -6,
  },
  orbitPath2: {
    position: 'absolute',
    top: '25%',
    right: '12.5%',
    marginTop: -6,
  },
  orbitPath3: {
    position: 'absolute',
    bottom: '12.5%',
    right: '25%',
    marginBottom: -8,
  },
  planet: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pinkPlanet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B9D',
  },
  whitePlanet: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  pinkGlow: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF6B9D',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  whiteGlow: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 8,
  },

  // Terminal styles
  terminal: {
    width: screenWidth * 0.75,
    maxWidth: 300,
    backgroundColor: '#2d2d3a',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8B5FBF',
    shadowColor: '#8B5FBF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
    padding: 16,
    paddingTop: 8,
    gap: 12,
  },
  progressContainer: {
    position: 'relative',
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#404040',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  cursor: {
    position: 'absolute',
    right: -2,
    top: -1,
    width: 3,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
  },
});

export default OnboardingScreen;