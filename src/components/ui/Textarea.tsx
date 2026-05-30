import React from 'react';
import { TextInput, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius } from '../../theme';

interface TextareaProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  minHeight?: number;
}

export function Textarea({
  value,
  onChangeText,
  placeholder,
  style,
  minHeight = 96,
}: TextareaProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.mutedForeground}
      multiline
      textAlignVertical="top"
      style={[styles.textarea, { minHeight }, style]}
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    padding: 12,
    fontSize: 16,
    color: colors.foreground,
    backgroundColor: colors.background,
  },
});
