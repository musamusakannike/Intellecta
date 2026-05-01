import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { Button } from '../../src/components/Button';
import { toast } from '../../src/components/Toast';
import { authService } from '../../src/services/auth.service';
import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing, typography, borderRadius } from '../../src/constants';
import * as Haptics from 'expo-haptics';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length > 1) {
      // Handle paste
      const digits = numericText.slice(0, 6).split('');
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);
      
      // Focus last filled input or next empty
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      // Single digit input
      const newCode = [...code];
      newCode[index] = numericText;
      setCode(newCode);
      
      // Auto-focus next input
      if (numericText && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      toast.error('Invalid Code', 'Please enter all 6 digits');
      return;
    }

    try {
      setLoading(true);
      await authService.verifyEmail(user?.email || '', verificationCode);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.success('Email Verified!', 'Your account is now active');
      router.replace('/(tabs)');
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const message = error.response?.data?.message || 'Verification failed';
      toast.error('Error', message);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await authService.resendCode(user?.email || '');
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.success('Code Sent!', 'Check your email for a new verification code');
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const message = error.response?.data?.message || 'Failed to resend code';
      toast.error('Error', message);
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <ArrowLeft size={24} color={colors.text.primary} strokeWidth={2} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Mail size={48} color={colors.primary[400]} strokeWidth={2} />
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to{'\n'}
          <Text style={styles.email}>{user?.email}</Text>
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.codeInput,
                digit && styles.codeInputFilled,
              ]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <Button
          title="Verify Email"
          onPress={handleVerify}
          loading={loading}
          disabled={loading || code.join('').length !== 6}
          variant="primary"
          size="lg"
          fullWidth
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={resending}>
            <Text style={[styles.resendLink, resending && styles.resendLinkDisabled]}>
              Resend
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xxxl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: colors.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  title: {
    fontSize: typography.sizes['4xl'],
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.sizes.base * typography.lineHeights.relaxed,
    marginBottom: spacing.xl,
  },
  email: {
    fontFamily: typography.fonts.semiBold,
    color: colors.primary[400],
  },
  codeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  codeInput: {
    width: 48,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface.base,
    borderWidth: 2,
    borderColor: colors.border.main,
    fontSize: typography.sizes['2xl'],
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  codeInputFilled: {
    borderColor: colors.primary[500],
    backgroundColor: colors.surface.elevated,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  resendText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
  },
  resendLink: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.semiBold,
    color: colors.primary[400],
  },
  resendLinkDisabled: {
    opacity: 0.5,
  },
});
