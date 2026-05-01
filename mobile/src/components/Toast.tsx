import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info,
  X,
} from 'lucide-react-native';
import { colors, spacing, borderRadius, typography } from '../constants';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
  onDismiss?: () => void;
  visible: boolean;
}

const TOAST_CONFIG = {
  success: {
    icon: CheckCircle,
    color: colors.success.main,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  error: {
    icon: XCircle,
    color: colors.error.main,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  warning: {
    icon: AlertCircle,
    color: colors.warning.main,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  info: {
    icon: Info,
    color: colors.info.main,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
};

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  description,
  duration = 3000,
  onDismiss,
  visible,
}) => {
  const translateY = useSharedValue(-200);
  const opacity = useSharedValue(0);
  const config = TOAST_CONFIG[type];
  const Icon = config.icon;

  useEffect(() => {
    if (visible) {
      // Haptic feedback
      if (type === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (type === 'error') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }

      // Animate in
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
      opacity.value = withTiming(1, { duration: 200 });

      // Auto dismiss
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      translateY.value = withTiming(-200, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const handleDismiss = () => {
    translateY.value = withTiming(-200, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 }, () => {
      if (onDismiss) {
        runOnJS(onDismiss)();
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        <View style={[styles.content, { backgroundColor: config.backgroundColor }]}>
          <View style={styles.iconContainer}>
            <Icon size={24} color={config.color} strokeWidth={2.5} />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.message}>{message}</Text>
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
          </View>

          <View style={styles.closeButton}>
            <X 
              size={20} 
              color={colors.text.secondary} 
              strokeWidth={2}
              onPress={handleDismiss}
            />
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: spacing.md,
    right: spacing.md,
    zIndex: 9999,
  },
  blurContainer: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  message: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
  },
  description: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
  closeButton: {
    padding: spacing.xs,
  },
});

// Toast Manager
class ToastManager {
  private listeners: Array<(toast: ToastProps) => void> = [];

  subscribe(listener: (toast: ToastProps) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  show(toast: Omit<ToastProps, 'visible'>) {
    this.listeners.forEach((listener) => listener({ ...toast, visible: true }));
  }

  success(message: string, description?: string) {
    this.show({ type: 'success', message, description });
  }

  error(message: string, description?: string) {
    this.show({ type: 'error', message, description });
  }

  warning(message: string, description?: string) {
    this.show({ type: 'warning', message, description });
  }

  info(message: string, description?: string) {
    this.show({ type: 'info', message, description });
  }
}

export const toast = new ToastManager();
