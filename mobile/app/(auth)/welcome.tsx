import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Code2, Sparkles, Rocket } from 'lucide-react-native';
import { Button } from '../../src/components/Button';
import { colors, spacing, typography, borderRadius } from '../../src/constants';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  
  // Animation values
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(30);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(30);

  useEffect(() => {
    // Animate logo
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    logoRotate.value = withSequence(
      withTiming(360, { duration: 800 }),
      withTiming(0, { duration: 0 })
    );

    // Animate title
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(300, withSpring(0, { damping: 15 }));

    // Animate subtitle
    subtitleOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    subtitleTranslateY.value = withDelay(500, withSpring(0, { damping: 15 }));

    // Animate buttons
    buttonsOpacity.value = withDelay(700, withTiming(1, { duration: 600 }));
    buttonsTranslateY.value = withDelay(700, withSpring(0, { damping: 15 }));
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Cosmic Background */}
      <View style={styles.backgroundContainer}>
        <View style={[styles.cosmicOrb, styles.orb1]} />
        <View style={[styles.cosmicOrb, styles.orb2]} />
        <View style={[styles.cosmicOrb, styles.orb3]} />
      </View>

      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <View style={styles.logoBackground}>
              <Code2 size={64} color={colors.primary[400]} strokeWidth={2} />
            </View>
          </Animated.View>

          <Animated.View style={titleAnimatedStyle}>
            <Text style={styles.title}>Kodr</Text>
          </Animated.View>

          <Animated.View style={subtitleAnimatedStyle}>
            <Text style={styles.subtitle}>
              Master coding through interactive lessons, challenges, and real-world projects
            </Text>
          </Animated.View>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Sparkles size={24} color={colors.primary[400]} strokeWidth={2} />
            </View>
            <Text style={styles.featureText}>Interactive Lessons</Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Code2 size={24} color={colors.secondary[400]} strokeWidth={2} />
            </View>
            <Text style={styles.featureText}>Hands-on Practice</Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Rocket size={24} color={colors.primary[400]} strokeWidth={2} />
            </View>
            <Text style={styles.featureText}>Build Real Projects</Text>
          </View>
        </View>

        {/* Buttons */}
        <Animated.View style={[styles.buttonContainer, buttonsAnimatedStyle]}>
          <Button
            title="Get Started"
            onPress={() => router.push('/(auth)/register')}
            variant="primary"
            size="lg"
            fullWidth
          />
          
          <Button
            title="Sign In"
            onPress={() => router.push('/(auth)/login')}
            variant="outline"
            size="lg"
            fullWidth
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  cosmicOrb: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.15,
  },
  orb1: {
    width: 300,
    height: 300,
    backgroundColor: colors.primary[600],
    top: -100,
    right: -100,
  },
  orb2: {
    width: 250,
    height: 250,
    backgroundColor: colors.secondary[600],
    bottom: -50,
    left: -80,
  },
  orb3: {
    width: 200,
    height: 200,
    backgroundColor: colors.primary[500],
    top: height * 0.4,
    right: -50,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
  logoContainer: {
    marginBottom: spacing.lg,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: colors.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  title: {
    fontSize: typography.sizes['5xl'],
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.sizes.lg * typography.lineHeights.relaxed,
    paddingHorizontal: spacing.md,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
  },
  feature: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  featureText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: spacing.md,
  },
});
