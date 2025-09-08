import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import { useAuth } from '../../src/contexts/AuthContext';
import { isValidEmail } from '../../src/utils';

// Glassmorphism Input Component
const GlassmorphismInput = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  delay = 0,
}: {
  icon: any;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  error?: string;
  delay?: number;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
  }, [delay, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.inputContainer, animatedStyle]}>
      <BlurView intensity={20} style={styles.inputBlur}>
        <View style={[
          styles.inputInner,
          isFocused && styles.inputFocused,
          error && styles.inputError
        ]}>
          <Ionicons name={icon} size={20} color={isFocused ? '#8B5FBF' : '#888'} />
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor="#888"
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            secureTextEntry={secureTextEntry && !showPassword}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
          />
          {secureTextEntry && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={20} 
                color="#888" 
              />
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </Animated.View>
  );
};

// Floating Orb Component (reused from welcome)
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
    opacity.value = withDelay(delay, withTiming(0.4, { duration: 800 }));
    
    const animateFloat = () => {
      translateY.value = withSequence(
        withTiming(-15, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(15, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      );
    };

    setTimeout(() => {
      animateFloat();
      setInterval(animateFloat, 9000);
    }, delay);
  }, [delay, opacity, translateY]);

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

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Animations
  const titleOpacity = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.9);

  useEffect(() => {
    titleOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    formOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    buttonScale.value = withDelay(600, withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    }));
  }, [buttonScale, formOpacity, titleOpacity]);

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(
        'Login Failed', 
        error.message || 'Invalid email or password. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const formStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#100A1F" />
      
      {/* Floating Background Orbs */}
      <FloatingOrb size={100} color="#8B5FBF" top="8%" left="85%" delay={300} />
      <FloatingOrb size={60} color="#FF6B9D" top="15%" left="5%" delay={600} />
      <FloatingOrb size={80} color="#8B5FBF" top="75%" left="80%" delay={900} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View style={[styles.header, titleStyle]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your learning journey</Text>
          </View>
        </Animated.View>

        {/* Form */}
        <Animated.View style={[styles.formContainer, formStyle]}>
          <GlassmorphismInput
            icon="mail-outline"
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
            delay={800}
          />

          <GlassmorphismInput
            icon="lock-closed-outline"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={passwordError}
            delay={900}
          />

          {/* Forgot Password */}
          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => router.push('/auth/forgot-password')}
          >
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Animated.View style={[styles.buttonContainer, buttonStyle]}>
            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#8B5FBF', '#7B4FAF']}
                style={styles.loginButtonGradient}
              >
                {isLoading ? (
                  <Text style={styles.loginButtonText}>Signing In...</Text>
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100A1F',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30,
  },
  floatingOrb: {
    position: 'absolute',
    borderRadius: 1000,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  header: {
    marginBottom: 50,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk',
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
    gap: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.2)',
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: 'rgba(139, 95, 191, 0.08)',
    gap: 12,
  },
  inputFocused: {
    borderColor: '#8B5FBF',
    backgroundColor: 'rgba(139, 95, 191, 0.15)',
  },
  inputError: {
    borderColor: '#FF6B6B',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'SpaceGrotesk',
    color: '#FFFFFF',
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontFamily: 'SpaceGrotesk',
    marginTop: 8,
    marginLeft: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
  },
  forgotPasswordText: {
    color: '#8B5FBF',
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  buttonContainer: {
    marginTop: 20,
  },
  loginButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  signUpText: {
    color: '#888',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk',
  },
  signUpLink: {
    color: '#8B5FBF',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
  },
});
