import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { toast } from '../../src/components/Toast';
import { authService } from '../../src/services/auth.service';
import { colors, spacing, typography } from '../../src/constants';
import * as Haptics from 'expo-haptics';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setLoading(true);
      await authService.forgotPassword(email.trim().toLowerCase());
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.success('Email Sent!', 'Check your inbox for reset instructions');
      router.push({
        pathname: '/(auth)/reset-password',
        params: { email: email.trim().toLowerCase() },
      });
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text.primary} strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you instructions to reset your password
            </Text>

            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError('');
                }}
                error={error}
                icon={Mail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <Button
                title="Send Reset Link"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                variant="primary"
                size="lg"
                fullWidth
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Remember your password? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
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
  },
  title: {
    fontSize: typography.sizes['4xl'],
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: typography.sizes.base * typography.lineHeights.relaxed,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
  },
  footerLink: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.semiBold,
    color: colors.primary[400],
  },
});
