import React from 'react';
import {
  Pressable,
  Text,
  ViewStyle,
  TextStyle,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
} from 'react-native';
import { colors, radius } from '../../theme';

type Variant = 'default' | 'outline' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  loading?: boolean;
}

export function Button({
  onPress,
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  style,
  textStyle,
  loading = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[size],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'default' || variant === 'destructive' ? colors.primaryForeground : colors.primary}
        />
      ) : typeof children === 'string' ? (
        <Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`], textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius,
    gap: 8,
  },
  default: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: colors.destructive,
  },
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  md: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  lg: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontWeight: '500',
  },
  text_default: {
    color: colors.primaryForeground,
  },
  text_outline: {
    color: colors.foreground,
  },
  text_ghost: {
    color: colors.foreground,
  },
  text_destructive: {
    color: colors.destructiveForeground,
  },
  textSize_sm: {
    fontSize: 14,
  },
  textSize_md: {
    fontSize: 16,
  },
  textSize_lg: {
    fontSize: 16,
  },
});
