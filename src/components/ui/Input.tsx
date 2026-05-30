import React from 'react';
import { TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, radius } from '../../theme';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  style,
  inputStyle,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  editable = true,
}: InputProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.mutedForeground}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      editable={editable}
      style={[styles.input, style, inputStyle]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.foreground,
    backgroundColor: colors.background,
  },
});
