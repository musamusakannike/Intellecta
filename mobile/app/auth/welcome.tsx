import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Social Login Button Component
const SocialLoginButton = ({ 
  icon, 
  color, 
  onPress, 
  delay = 0 
}: { 
  icon: any; 
  color: string; 
  onPress: () => void; 
  delay?: number; 
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const onButtonPress = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    setTimeout(onPress, 200);
  };

  return (
    <Animated.View style={[styles.socialButton, animatedStyle]}>
      <TouchableOpacity onPress={onButtonPress} activeOpacity={0.8}>
        <View style={styles.socialButtonInner}>
          <View style={[styles.socialGlow, { backgroundColor: color }]} />
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.socialGradient}
          >
            <Ionicons name={icon} size={28} color={color} />
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Floating Orb Component
const FloatingOrb = ({ size, color, top, left, delay }: {
  size: number;
  color: string;
  top: string | number;
  left: string | number;
  delay: number;
}) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 800 }));
    
    const animateFloat = () => {
      translateY.value = withSequence(
        withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(10, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      );
    };

    setTimeout(() => {
      animateFloat();
      setInterval(animateFloat, 6000);
    }, delay);
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[
        styles.floatingOrb, 
        { 
          width: size, 
          height: size, 
          top, 
          left,
          backgroundColor: color,
          shadowColor: color,
        },
        animatedStyle
      ]} 
    />
  );
};

export default function WelcomeScreen() {
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);
  const buttonOpacity = useSharedValue(0);
  const socialContainerOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate title
    titleOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    
    // Animate subtitle
    subtitleOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    
    // Animate buttons
    buttonScale.value = withDelay(1000, withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    }));
    buttonOpacity.value = withDelay(1000, withTiming(1, { duration: 400 }));
    
    // Animate social container
    socialContainerOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: buttonOpacity.value,
  }));

  const socialStyle = useAnimatedStyle(() => ({
    opacity: socialContainerOpacity.value,
  }));

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // TODO: Implement social login logic
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#100A1F" />
      
      {/* Floating Background Orbs */}
      <FloatingOrb size={120} color="#8B5FBF" top="10%" left="80%" delay={300} />
      <FloatingOrb size={80} color="#FF6B9D" top="20%" left="5%" delay={600} />
      <FloatingOrb size={60} color="#8B5FBF" top="70%" left="85%" delay={900} />
      <FloatingOrb size={100} color="#FF6B9D" top="75%" left="10%" delay={1200} />
      
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Animated.View style={titleStyle}>
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.titleBrand}>Intellecta</Text>
          </Animated.View>
          
          <Animated.View style={subtitleStyle}>
            <Text style={styles.subtitle}>
              Master programming skills with{'\n'}
              interactive lessons and real projects
            </Text>
          </Animated.View>
        </View>

        {/* Auth Buttons */}
        <Animated.View style={[styles.buttonSection, buttonStyle]}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/auth/login')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#8B5FBF', '#7B4FAF']}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/auth/register')}
            activeOpacity={0.8}
          >
            <BlurView intensity={20} style={styles.secondaryButtonBlur}>
              <View style={styles.secondaryButtonInner}>
                <Text style={styles.secondaryButtonText}>Create Account</Text>
              </View>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Social Login Section */}
        <Animated.View style={[styles.socialSection, socialStyle]}>
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtons}>
            <SocialLoginButton
              icon="logo-google"
              color="#FF6B6B"
              onPress={() => handleSocialLogin('Google')}
              delay={1400}
            />
            <SocialLoginButton
              icon="logo-apple"
              color="#FFFFFF"
              onPress={() => handleSocialLogin('Apple')}
              delay={1500}
            />
            <SocialLoginButton
              icon="logo-github"
              color="#6366F1"
              onPress={() => handleSocialLogin('GitHub')}
              delay={1600}
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100A1F',
  },
  floatingOrb: {
    position: 'absolute',
    borderRadius: 1000,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: screenHeight * 0.15,
    paddingBottom: 50,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: screenHeight * 0.1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#B8B8B8',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleBrand: {
    fontSize: 42,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk',
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonSection: {
    gap: 16,
    marginBottom: 50,
  },
  primaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  primaryButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  secondaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.3)',
  },
  secondaryButtonBlur: {
    flex: 1,
  },
  secondaryButtonInner: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  socialSection: {
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'SpaceGrotesk',
    marginHorizontal: 20,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  socialButton: {
    width: 60,
    height: 60,
  },
  socialButtonInner: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 30,
    overflow: 'hidden',
  },
  socialGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },
  socialGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});
