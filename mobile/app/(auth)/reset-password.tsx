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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, ArrowLeft, Hash } from 'lucide-react-native';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { toast } from '../../src/components/Toast';
import { authService } from '../../src/services/auth.service';
import { colors, spacing, typography } from '../../src/constants';
import * as Haptics from 'expo-haptics';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    code?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!code) {
      newErrors.code = 'Reset code is required';
    } else if (code.length !== 6) {
      newErrors.code = 'Code must be 6 digits';
    }
    
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword(email, code, newPassword);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.success('Password Reset!', 'You can now sign in with your new password');
      router.replace('/(auth)/login');
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const message = error.response?.data?.message || 'Failed to reset password';
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
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to {email} and create a new password
            </Text>

            <View style={styles.form}>
              <Input
                label="Reset Code"
                placeholder="Enter 6-digit code"
                value={code}
                onChangeText={(text) => {
                  setCode(text.replace(/[^0-9]/g, ''));
                  setErrors({ ...errors, code: undefined });
                }}
                error={errors.code}
                icon={Hash}
                keyboardType="number-pad"
                maxLength={6}
              />

              <Input
                label="New Password"
                placeholder="Create a new password"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setErrors({ ...errors, newPassword: undefined });
                }}
                error={errors.newPassword}
                icon={Lock}
                secureTextEntry
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors({ ...errors, confirmPassword: undefined });
                }}
                error={errors.confirmPassword}
                icon={Lock}
                secureTextEntry
              />

              <Button
                title="Reset Password"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                variant="primary"
                size="lg"
                fullWidth
              />
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
    gap: spacing.md,
  },
});
