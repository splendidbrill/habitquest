import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useChild } from '../context/ChildContext';
import { rollMysteryReward, applyMysteryReward, type MysteryReward } from '../services/rewardService';

type RouteParams = RouteProp<RootStackParamList, 'MysteryBox'>;

const TIER_BG: Record<string, [string, string, string]> = {
  common:     ['#f0fdf4', '#dcfce7', '#f0fdf4'],
  uncommon:   ['#eff6ff', '#dbeafe', '#eff6ff'],
  rare:       ['#faf5ff', '#ede9fe', '#faf5ff'],
  legendary:  ['#fffbeb', '#fef3c7', '#fffbeb'],
};

const CONFETTI = ['⭐', '✨', '💫', '🎉', '🌟', '⚡', '🎊', '🏆'];

export function MysteryBox() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const { returnScreen } = route.params;
  const { activeChild, refreshChild } = useChild();

  const [opened, setOpened] = useState(false);
  const [reward, setReward] = useState<MysteryReward | null>(null);
  const [applying, setApplying] = useState(false);

  // Animations
  const boxScale    = useRef(new Animated.Value(1)).current;
  const boxShake    = useRef(new Animated.Value(0)).current;
  const rewardScale = useRef(new Animated.Value(0)).current;
  const rewardOpacity = useRef(new Animated.Value(0)).current;
  const confettiOpacity = useRef(new Animated.Value(0)).current;

  const shakeBox = () => {
    Animated.sequence([
      Animated.timing(boxShake, { toValue: 12,  duration: 60, useNativeDriver: true }),
      Animated.timing(boxShake, { toValue: -12, duration: 60, useNativeDriver: true }),
      Animated.timing(boxShake, { toValue: 8,   duration: 60, useNativeDriver: true }),
      Animated.timing(boxShake, { toValue: -8,  duration: 60, useNativeDriver: true }),
      Animated.timing(boxShake, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start(() => openBox());
  };

  const openBox = async () => {
    const rolled = rollMysteryReward();
    setReward(rolled);
    setOpened(true);

    if (activeChild?.id) {
      setApplying(true);
      await applyMysteryReward(activeChild.id, rolled);
      await refreshChild();
      setApplying(false);
    }

    // Animate reward reveal
    Animated.parallel([
      Animated.spring(rewardScale, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.timing(rewardOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(confettiOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  const handleTap = () => {
    if (opened) return;
    Animated.sequence([
      Animated.spring(boxScale, { toValue: 0.9, useNativeDriver: true }),
      Animated.spring(boxScale, { toValue: 1,   useNativeDriver: true }),
    ]).start(() => shakeBox());
  };

  const handleClaim = () => {
    navigation.navigate(returnScreen as any);
  };

  const bgColors = reward ? TIER_BG[reward.tier] : ['#f9fafb', '#f3f4f6', '#f9fafb'];

  return (
    <LinearGradient colors={bgColors} style={s.container}>
      <SafeAreaView style={s.safe}>
        <View style={s.content}>

          {/* Floating confetti */}
          {opened && (
            <Animated.View style={[s.confettiLayer, { opacity: confettiOpacity }]} pointerEvents="none">
              {CONFETTI.map((e, i) => (
                <Text
                  key={i}
                  style={[s.confettiEmoji, {
                    left: `${8 + i * 11}%`,
                    top:  `${4 + (i % 4) * 10}%`,
                    fontSize: 16 + (i % 3) * 6,
                  }]}
                >
                  {e}
                </Text>
              ))}
            </Animated.View>
          )}

          {!opened ? (
            <>
              <Text style={s.tapPrompt}>Tap the box to open!</Text>

              <Animated.View style={{ transform: [{ scale: boxScale }, { translateX: boxShake }] }}>
                <TouchableOpacity onPress={handleTap} activeOpacity={0.9} style={s.boxWrapper}>
                  <Text style={s.boxEmoji}>🎁</Text>
                  <View style={s.boxGlow} />
                </TouchableOpacity>
              </Animated.View>

              <Text style={s.tapHint}>Something is waiting inside...</Text>
            </>
          ) : reward ? (
            <Animated.View style={[s.rewardContainer, { transform: [{ scale: rewardScale }], opacity: rewardOpacity }]}>

              {/* Tier badge */}
              <View style={[s.tierBadge, { backgroundColor: reward.colors[0] }]}>
                <Text style={s.tierText}>{reward.tier.toUpperCase()}</Text>
              </View>

              {/* Reward emoji */}
              <LinearGradient colors={reward.colors} style={s.rewardCircle}>
                <Text style={s.rewardEmoji}>{reward.emoji}</Text>
              </LinearGradient>

              <Text style={s.rewardHeadline}>{reward.headline}</Text>
              <Text style={s.rewardDesc}>{reward.description}</Text>

              {/* What you got */}
              <View style={s.rewardItems}>
                {reward.xpBonus > 0 && (
                  <LinearGradient colors={reward.colors} style={s.rewardItem}>
                    <Text style={s.rewardItemText}>+{reward.xpBonus} XP ⚡</Text>
                  </LinearGradient>
                )}
                {reward.grantFreeze && (
                  <View style={[s.rewardItem, s.rewardItemFreeze]}>
                    <Text style={s.rewardItemText}>🧊 Streak Freeze</Text>
                  </View>
                )}
                {reward.badgeName && (
                  <View style={[s.rewardItem, s.rewardItemBadge]}>
                    <Text style={s.rewardItemText}>🏅 {reward.badgeName}</Text>
                  </View>
                )}
              </View>

              {/* Claim button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleClaim}
                disabled={applying}
                style={s.claimBtnWrapper}
              >
                <LinearGradient
                  colors={reward.colors}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={s.claimBtn}
                >
                  <Text style={s.claimBtnText}>
                    {applying ? 'Saving...' : 'Claim reward! 🎉'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

            </Animated.View>
          ) : null}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },

  confettiLayer: { ...StyleSheet.absoluteFillObject },
  confettiEmoji: { position: 'absolute' },

  tapPrompt: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 40, textAlign: 'center' },
  boxWrapper: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  boxEmoji: { fontSize: 120 },
  boxGlow: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(249,115,22,0.12)',
  },
  tapHint: { fontSize: 16, color: '#6b7280', marginTop: 24, textAlign: 'center' },

  rewardContainer: { alignItems: 'center', width: '100%' },
  tierBadge: {
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 20,
  },
  tierText: { fontSize: 12, fontWeight: '900', color: '#fff', letterSpacing: 2 },

  rewardCircle: {
    width: 130, height: 130, borderRadius: 65,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 16, elevation: 12,
  },
  rewardEmoji: { fontSize: 72 },

  rewardHeadline: { fontSize: 30, fontWeight: '900', color: '#111827', marginBottom: 8, textAlign: 'center' },
  rewardDesc: { fontSize: 16, color: '#4b5563', textAlign: 'center', lineHeight: 24, marginBottom: 24, paddingHorizontal: 8 },

  rewardItems: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 32 },
  rewardItem: { borderRadius: 50, paddingHorizontal: 18, paddingVertical: 10 },
  rewardItemFreeze: { backgroundColor: '#0891b2' },
  rewardItemBadge: { backgroundColor: '#7c3aed' },
  rewardItemText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  claimBtnWrapper: { width: '100%' },
  claimBtn: { borderRadius: 50, paddingVertical: 18, alignItems: 'center' },
  claimBtnText: { fontSize: 18, fontWeight: '800', color: '#fff' },
});
