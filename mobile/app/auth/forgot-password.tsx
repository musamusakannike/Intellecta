import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { isValidEmail } from '../../src/utils';
import apiService from '../../src/services/api';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Glassmorphism Input Component
const GlassmorphismInput = ({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  delay = 0,
}: {
  icon: any;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: any;
  autoCapitalize?: any;
  error?: string;
  delay?: number;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const scale = useSharedValue(0.95);
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
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
          />
        </View>
      </BlurView>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </Animated.View>
  );
};

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

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
  }, []);

  const validateForm = () => {
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await apiService.post('/auth/forgot-password', { email: email.trim() });
      setIsEmailSent(true);
    } catch (error: any) {
      Alert.alert(
        'Reset Failed', 
        error.message || 'Failed to send reset email. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
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

  if (isEmailSent) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#100A1F" />
        
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="mail-outline" size={60} color="#8B5FBF" />
          </View>
          
          <Text style={styles.successTitle}>Check Your Email</Text>
          <Text style={styles.successText}>
            We've sent a password reset link to{'\n'}
            <Text style={styles.emailText}>{email}</Text>
          </Text>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/auth/login')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#8B5FBF', '#7B4FAF']}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>Back to Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resendButton}
            onPress={() => setIsEmailSent(false)}
          >
            <Text style={styles.resendButtonText}>Didn't receive the email?</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#100A1F" />
      
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
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password
            </Text>
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

          {/* Reset Button */}
          <Animated.View style={[styles.buttonContainer, buttonStyle]}>
            <TouchableOpacity 
              style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
              onPress={handleResetPassword}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#8B5FBF', '#7B4FAF']}
                style={styles.resetButtonGradient}
              >
                {isLoading ? (
                  <Text style={styles.resetButtonText}>Sending...</Text>
                ) : (
                  <Text style={styles.resetButtonText}>Send Reset Link</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Back to Login */}
          <View style={styles.backToLoginContainer}>
            <Text style={styles.backToLoginText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.backToLoginLink}>Sign In</Text>
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
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk',
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
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
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontFamily: 'SpaceGrotesk',
    marginTop: 8,
    marginLeft: 4,
  },
  buttonContainer: {
    marginTop: 20,
  },
  resetButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  resetButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  backToLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  backToLoginText: {
    color: '#888',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk',
  },
  backToLoginLink: {
    color: '#8B5FBF',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  // Success screen styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'rgba(139, 95, 191, 0.3)',
  },
  successTitle: {
    fontSize: 28,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk',
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  emailText: {
    color: '#8B5FBF',
    fontFamily: 'SpaceGrotesk-Medium',
  },
  primaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
    width: '100%',
    marginBottom: 20,
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
  resendButton: {
    paddingVertical: 12,
  },
  resendButtonText: {
    color: '#8B5FBF',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    textAlign: 'center',
  },
});
