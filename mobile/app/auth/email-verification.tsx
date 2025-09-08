import React, { useState, useEffect, useRef } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
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

// OTP Input Component
const OTPInput = ({ 
  value, 
  onChangeText, 
  error 
}: { 
  value: string; 
  onChangeText: (text: string) => void; 
  error?: string;
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<TextInput[]>([]);
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(600, withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    }));
    opacity.value = withDelay(600, withTiming(1, { duration: 400 }));
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleTextChange = (text: string, index: number) => {
    const newValue = value.split('');
    newValue[index] = text;
    
    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    onChangeText(newValue.join(''));
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Animated.View style={[styles.otpContainer, animatedStyle]}>
      <View style={styles.otpInputsRow}>
        {Array.from({ length: 6 }, (_, index) => (
          <BlurView key={index} intensity={20} style={styles.otpInputBlur}>
            <TextInput
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                focusedIndex === index && styles.otpInputFocused,
                error && styles.otpInputError,
              ]}
              value={value[index] || ''}
              onChangeText={(text) => handleTextChange(text, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              textAlign="center"
            />
          </BlurView>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </Animated.View>
  );
};

// Floating Orb Component (reused from register screen)
const FloatingOrb = ({ size, color, top, left, delay }: {
  size: number;
  color: string;
  top: any;
  left: any;
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

export default function EmailVerificationScreen() {
  const { verifyEmail, resendVerificationCode, isLoading, pendingVerification } = useAuth();
  const params = useLocalSearchParams<{ email?: string; name?: string }>();
  
  // Get email and name from either params or auth state
  const email = params.email || pendingVerification?.email || '';
  // const name = params.name || pendingVerification?.name || '';
  
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Animations
  const titleOpacity = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.9);

  useEffect(() => {
    titleOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    formOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    buttonScale.value = withDelay(800, withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    }));
  }, [buttonScale, formOpacity, titleOpacity]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Redirect if no email is provided
  useEffect(() => {
    if (!email) {
      Alert.alert('Error', 'No email address found. Please register again.', [
        { text: 'OK', onPress: () => router.replace('/auth/register') }
      ]);
    }
  }, [email]);

  const validateCode = () => {
    if (!code.trim()) {
      setCodeError('Verification code is required');
      return false;
    }
    if (code.trim().length !== 6) {
      setCodeError('Please enter the complete 6-digit code');
      return false;
    }
    if (!/^\d{6}$/.test(code.trim())) {
      setCodeError('Verification code must contain only numbers');
      return false;
    }
    setCodeError('');
    return true;
  };

  const handleVerifyEmail = async () => {
    if (!validateCode()) return;

    try {
      await verifyEmail(email, code.trim());
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(
        'Verification Failed',
        error.message || 'Invalid verification code. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleResendCode = async () => {
    try {
      setResendLoading(true);
      await resendVerificationCode(email);
      
      // Start countdown
      setCountdown(60);
      setResendDisabled(true);
      
      Alert.alert(
        'Code Sent',
        'A new verification code has been sent to your email.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to resend verification code.',
        [{ text: 'OK' }]
      );
    } finally {
      setResendLoading(false);
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

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#100A1F" />
      
      {/* Floating Background Orbs */}
      <FloatingOrb size={80} color="#FF6B9D" top="8%" left="85%" delay={300} />
      <FloatingOrb size={60} color="#8B5FBF" top="15%" left="10%" delay={600} />
      <FloatingOrb size={100} color="#FF6B9D" top="75%" left="80%" delay={900} />
      
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
            <View style={styles.iconContainer}>
              <BlurView intensity={20} style={styles.iconBlur}>
                <Ionicons name="mail" size={40} color="#8B5FBF" />
              </BlurView>
            </View>
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.subtitle}>
              We&apos;ve sent a 6-digit verification code to{'\n'}
              <Text style={styles.emailText}>{maskedEmail}</Text>
            </Text>
          </View>
        </Animated.View>

        {/* Form */}
        <Animated.View style={[styles.formContainer, formStyle]}>
          <OTPInput
            value={code}
            onChangeText={setCode}
            error={codeError}
          />

          {/* Verify Button */}
          <Animated.View style={[styles.buttonContainer, buttonStyle]}>
            <TouchableOpacity 
              style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]}
              onPress={handleVerifyEmail}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#8B5FBF', '#7B4FAF']}
                style={styles.verifyButtonGradient}
              >
                {isLoading ? (
                  <Text style={styles.verifyButtonText}>Verifying...</Text>
                ) : (
                  <Text style={styles.verifyButtonText}>Verify Email</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Resend Code */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn&apos;t receive the code? </Text>
            <TouchableOpacity 
              onPress={handleResendCode}
              disabled={resendDisabled || resendLoading}
              style={[
                styles.resendButton,
                (resendDisabled || resendLoading) && styles.resendButtonDisabled
              ]}
            >
              <Text style={[
                styles.resendLink,
                (resendDisabled || resendLoading) && styles.resendLinkDisabled
              ]}>
                {resendLoading ? 'Sending...' : resendDisabled ? `Resend in ${countdown}s` : 'Resend'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Change Email */}
          <View style={styles.changeEmailContainer}>
            <Text style={styles.changeEmailText}>Wrong email? </Text>
            <TouchableOpacity onPress={() => router.replace('/auth/register')}>
              <Text style={styles.changeEmailLink}>Change Email</Text>
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
    marginBottom: 40,
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    alignSelf: 'flex-start',
  },
  titleContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconBlur: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
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
  emailText: {
    color: '#8B5FBF',
    fontFamily: 'SpaceGrotesk-Medium',
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
  },
  otpContainer: {
    marginBottom: 30,
  },
  otpInputsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  otpInputBlur: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.2)',
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: 'rgba(139, 95, 191, 0.08)',
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'SpaceGrotesk-Bold',
    textAlign: 'center',
  },
  otpInputFocused: {
    borderColor: '#8B5FBF',
    backgroundColor: 'rgba(139, 95, 191, 0.15)',
  },
  otpInputError: {
    borderColor: '#FF6B6B',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontFamily: 'SpaceGrotesk',
    textAlign: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    marginBottom: 30,
    width: '100%',
  },
  verifyButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  verifyButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resendText: {
    color: '#888',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk',
  },
  resendButton: {
    padding: 4,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendLink: {
    color: '#8B5FBF',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  resendLinkDisabled: {
    color: '#666',
  },
  changeEmailContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeEmailText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'SpaceGrotesk',
  },
  changeEmailLink: {
    color: '#8B5FBF',
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
  },
});
