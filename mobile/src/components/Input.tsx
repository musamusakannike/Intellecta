import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Eye, EyeOff, LucideIcon } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography } from '../constants';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon: Icon,
  containerStyle,
  secureTextEntry,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const borderColor = useSharedValue(colors.border.main);

  const handleFocus = () => {
    setIsFocused(true);
    borderColor.value = withTiming(colors.primary[500], { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderColor.value = withTiming(
      error ? colors.error.main : colors.border.main,
      { duration: 200 }
    );
  };

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  const toggleSecure = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <Animated.View style={[styles.inputContainer, animatedBorderStyle, error && styles.errorBorder]}>
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon 
              size={20} 
              color={isFocused ? colors.primary[500] : colors.text.tertiary} 
              strokeWidth={2}
            />
          </View>
        )}
        
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.text.disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isSecure}
          {...textInputProps}
        />
        
        {secureTextEntry && (
          <TouchableOpacity onPress={toggleSecure} style={styles.iconContainer}>
            {isSecure ? (
              <EyeOff size={20} color={colors.text.tertiary} strokeWidth={2} />
            ) : (
              <Eye size={20} color={colors.text.tertiary} strokeWidth={2} />
            )}
          </TouchableOpacity>
        )}
      </Animated.View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.base,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border.main,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    color: colors.text.primary,
    paddingVertical: spacing.sm,
  },
  errorBorder: {
    borderColor: colors.error.main,
  },
  errorText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.error.main,
    marginTop: spacing.xs,
  },
});
