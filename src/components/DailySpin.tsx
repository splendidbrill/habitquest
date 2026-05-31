import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Modal, Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useChild } from '../context/ChildContext';
import { rollDailySpinReward, applyDailySpinReward } from '../services/rewardService';
import { storage } from '../utils/storage';

const SPIN_ITEMS = ['⭐', '💫', '🎁', '⚡', '🔥', '🧊', '🌟', '💎'];

type Props = { visible: boolean; onClose: () => void };

export function DailySpin({ visible, onClose }: Props) {
  const { activeChild, refreshChild } = useChild();
  const [spinning, setSpinning] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [reward, setReward] = useState<ReturnType<typeof rollDailySpinReward> | null>(null);

  const spinAnim  = useRef(new Animated.Value(0)).current;
  const revealScale = useRef(new Animated.Value(0)).current;

  const handleSpin = async () => {
    if (spinning || revealed) return;
    setSpinning(true);

    // Spin animation
    Animated.sequence([
      Animated.timing(spinAnim, { toValue: 6, duration: 800, useNativeDriver: true }),
      Animated.timing(spinAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(async () => {
      const rolled = rollDailySpinReward();
      setReward(rolled);
      setRevealed(true);
      setSpinning(false);

      // Apply reward
      if (activeChild?.id) {
        await applyDailySpinReward(activeChild.id, rolled);
        await refreshChild();
      }

      // Reveal animation
      Animated.spring(revealScale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    });
  };

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 6],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <LinearGradient colors={['#1e3a5f', '#3b82f6']} style={s.card}>

          <Text style={s.title}>Daily Reward! ✨</Text>
          <Text style={s.subtitle}>Spin once a day for a free reward</Text>

          {/* Spin wheel preview */}
          <View style={s.spinWheel}>
            <Animated.Text
              style={[s.spinEmoji, { transform: [{ rotate: spinInterpolate }] }]}
            >
              {spinning ? '🎰' : revealed ? (reward?.emoji ?? '🎁') : '🎁'}
            </Animated.Text>
          </View>

          {!revealed ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSpin}
              disabled={spinning}
            >
              <LinearGradient
                colors={['#f97316', '#fbbf24']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.spinBtn}
              >
                <Text style={s.spinBtnText}>
                  {spinning ? 'Spinning...' : 'Spin!'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : reward ? (
            <Animated.View style={[s.revealBox, { transform: [{ scale: revealScale }] }]}>
              <View style={[s.rewardCircle, { backgroundColor: reward.color }]}>
                <Text style={s.rewardEmoji}>{reward.emoji}</Text>
              </View>
              <Text style={s.rewardHeadline}>{reward.headline}</Text>
              {reward.xpBonus > 0 && (
                <Text style={s.rewardDetail}>+{reward.xpBonus} XP added to your total</Text>
              )}
              {reward.grantFreeze && (
                <Text style={s.rewardDetail}>🧊 Streak freeze added!</Text>
              )}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onClose}
                style={s.claimBtn}
              >
                <Text style={s.claimBtnText}>Claim & continue 🎉</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : null}

          {!revealed && !spinning && (
            <TouchableOpacity onPress={onClose} style={s.skipBtn}>
              <Text style={s.skipText}>Skip for now</Text>
            </TouchableOpacity>
          )}

        </LinearGradient>
      </View>
    </Modal>
  );
}

// ─── Hook to check if daily spin should be shown ──────────────────────────────
export function useDailySpin(): { showSpin: boolean; dismissSpin: () => void } {
  const [showSpin, setShowSpin] = useState(false);
  const { activeChild } = useChild();

  useEffect(() => {
    if (!activeChild?.id) return;

    const key = `kids_daily_spin_${activeChild.id}`;
    storage.getItem(key).then(lastShown => {
      const today = new Date().toISOString().split('T')[0];
      if (lastShown !== today) {
        setShowSpin(true);
      }
    });
  }, [activeChild?.id]);

  const dismissSpin = () => {
    setShowSpin(false);
    if (activeChild?.id) {
      const key = `kids_daily_spin_${activeChild.id}`;
      const today = new Date().toISOString().split('T')[0];
      storage.setItem(key, today);
    }
  };

  return { showSpin, dismissSpin };
}

const s = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  card: { borderRadius: 28, padding: 28, width: '100%', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 28 },

  spinWheel: {
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  spinEmoji: { fontSize: 72 },

  spinBtn: { borderRadius: 50, paddingVertical: 16, paddingHorizontal: 48 },
  spinBtnText: { fontSize: 20, fontWeight: '900', color: '#fff' },

  revealBox: { alignItems: 'center', width: '100%' },
  rewardCircle: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  rewardEmoji: { fontSize: 48 },
  rewardHeadline: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 6 },
  rewardDetail: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },

  claimBtn: {
    marginTop: 20, backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50, paddingVertical: 14, paddingHorizontal: 32,
  },
  claimBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  skipBtn: { marginTop: 16 },
  skipText: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
});
