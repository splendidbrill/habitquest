import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors, radius } from '../../theme';

interface ProgressBarProps {
  value: number;
  total: number;
  color?: string;
  height?: number;
}

export function ProgressBar({
  value,
  total,
  color = colors.primary,
  height = 8,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animWidth, {
      toValue: percentage,
      useNativeDriver: false,
      tension: 80,
      friction: 8,
    }).start();
  }, [percentage]);

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            borderRadius: height / 2,
            backgroundColor: color,
            width: animWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.muted,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {},
});
