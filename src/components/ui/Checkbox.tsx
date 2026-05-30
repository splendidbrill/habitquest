import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors, radius } from '../../theme';

interface CheckboxProps {
  checked: boolean;
  onPress?: () => void;
  size?: number;
}

export function Checkbox({ checked, onPress, size = 20 }: CheckboxProps) {
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <View
        style={[
          styles.box,
          { width: size, height: size, borderRadius: size * 0.2 },
          checked && styles.checked,
        ]}
      >
        {checked && <Check size={size * 0.65} color={colors.primaryForeground} strokeWidth={3} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  checked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
