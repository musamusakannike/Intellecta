import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

const OrbitalSystem = () => {
  // Animation values
  const containerOpacity = useSharedValue(0);
  const containerScale = useSharedValue(0.5);
  const centerPulse = useSharedValue(0.8);
  const orbit1Rotation = useSharedValue(0);
  const orbit2Rotation = useSharedValue(0);
  const orbit3Rotation = useSharedValue(0);
  const dashedOrbitOpacity = useSharedValue(0);

  useEffect(() => {
    // Initial container animation
    containerOpacity.value = withTiming(1, { duration: 800 });
    containerScale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });

    // Dashed orbit fade in
    dashedOrbitOpacity.value = withTiming(0.6, { 
      duration: 1200,
      easing: Easing.out(Easing.quad),
    });

    // Center planet pulsing
    centerPulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.9, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Orbital rotations with different speeds
    orbit1Rotation.value = withRepeat(
      withTiming(360, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1
    );

    orbit2Rotation.value = withRepeat(
      withTiming(360, {
        duration: 12000,
        easing: Easing.linear,
      }),
      -1
    );

    orbit3Rotation.value = withRepeat(
      withTiming(360, {
        duration: 15000,
        easing: Easing.linear,
      }),
      -1
    );
  }, [
    centerPulse,
    containerOpacity,
    containerScale,
    dashedOrbitOpacity,
    orbit1Rotation,
    orbit2Rotation,
    orbit3Rotation,
  ]);

  // Container animation
  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  // Center planet pulsing animation
  const centerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: centerPulse.value }],
  }));

  // Dashed orbit animation
  const dashedOrbitStyle = useAnimatedStyle(() => ({
    opacity: dashedOrbitOpacity.value,
  }));

  // Orbital rotation animations
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
    <View style={styles.container}>
      <Animated.View style={[styles.orbitalSystem, containerStyle]}>
        
        {/* Dashed outer orbit */}
        <Animated.View style={[styles.dashedOrbit, dashedOrbitStyle]} />
        
        {/* Static orbit rings */}
        <View style={[styles.orbit, styles.orbit1]} />
        <View style={[styles.orbit, styles.orbit2]} />
        
        {/* Center planet with glow */}
        <Animated.View style={[styles.centerContainer, centerStyle]}>
          <View style={styles.centerGlow} />
          <View style={styles.centerPlanet} />
        </Animated.View>

        {/* Rotating orbit 1 with pink planet */}
        <Animated.View style={[styles.rotatingOrbit, orbit1Style]}>
          <View style={styles.orbitPath1}>
            <View style={[styles.planet, styles.pinkPlanet]}>
              <View style={styles.pinkGlow} />
            </View>
          </View>
        </Animated.View>

        {/* Rotating orbit 2 with another pink planet */}
        <Animated.View style={[styles.rotatingOrbit, orbit2Style]}>
          <View style={styles.orbitPath2}>
            <View style={[styles.planet, styles.pinkPlanet]}>
              <View style={styles.pinkGlow} />
            </View>
          </View>
        </Animated.View>

        {/* Rotating orbit 3 with white planet */}
        <Animated.View style={[styles.rotatingOrbit, orbit3Style]}>
          <View style={styles.orbitPath3}>
            <View style={[styles.planet, styles.whitePlanet]}>
              <View style={styles.whiteGlow} />
            </View>
          </View>
        </Animated.View>

      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#100A1F',
    padding: 20,
  },
  orbitalSystem: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    maxWidth: 350,
    maxHeight: 350,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Dashed outer orbit
  dashedOrbit: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    borderWidth: 3,
    borderColor: '#8B5FBF',
    borderStyle: 'dashed',
  },
  
  // Static orbit rings
  orbit: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 2,
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
  
  // Center planet
  centerContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B5FBF',
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 10,
  },
  centerPlanet: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B5FBF',
  },
  
  // Rotating orbits
  rotatingOrbit: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  
  // Orbit paths for planets
  orbitPath1: {
    position: 'absolute',
    top: '12.5%',
    left: '50%',
    marginLeft: -8,
  },
  orbitPath2: {
    position: 'absolute',
    top: '25%',
    right: '12.5%',
    marginTop: -8,
  },
  orbitPath3: {
    position: 'absolute',
    bottom: '12.5%',
    right: '25%',
    marginBottom: -10,
  },
  
  // Planets
  planet: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  
  pinkPlanet: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF6B9D',
  },
  
  whitePlanet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  
  // Planet glows
  pinkGlow: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B9D',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  
  whiteGlow: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 8,
  },
});

export default OrbitalSystem;