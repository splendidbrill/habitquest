import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { STREAK_MILESTONES } from '../services/streakService';

type RouteParams = RouteProp<RootStackParamList, 'StreakMilestone'>;

const CONFETTI_EMOJIS = ['🔥', '⭐', '✨', '🎉', '💫', '🏆', '⚡'];

export function StreakMilestone() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const { milestone: milestoneDays } = route.params;

  const milestone = STREAK_MILESTONES.find(m => m.days === milestoneDays)
    ?? STREAK_MILESTONES[0];

  // Animations
  const badgeScale  = useRef(new Animated.Value(0)).current;
  const badgeRotate = useRef(new Animated.Value(0)).current;
  const cardSlide   = useRef(new Animated.Value(80)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const btnScale    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(badgeScale, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(cardSlide,   { toValue: 0,  duration: 350, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1,  duration: 350, useNativeDriver: true }),
      ]),
      Animated.spring(btnScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();

    // Subtle wobble on badge after entrance
    Animated.loop(
      Animated.sequence([
        Animated.timing(badgeRotate, { toValue: 1,  duration: 150, useNativeDriver: true }),
        Animated.timing(badgeRotate, { toValue: -1, duration: 150, useNativeDriver: true }),
        Animated.timing(badgeRotate, { toValue: 0,  duration: 150, useNativeDriver: true }),
        Animated.delay(2000),
      ]),
    ).start();
  }, []);

  const rotateInterpolate = badgeRotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-8deg', '0deg', '8deg'],
  });

  const bgColors: [string, string, string] = ['#0f172a', '#1e1035', '#0f172a'];

  return (
    <LinearGradient colors={bgColors} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>

          {/* Floating confetti */}
          <View style={styles.confettiLayer} pointerEvents="none">
            {CONFETTI_EMOJIS.map((e, i) => (
              <Text
                key={i}
                style={[
                  styles.confettiEmoji,
                  {
                    left: `${10 + i * 13}%`,
                    top: `${5 + (i % 3) * 12}%`,
                    fontSize: 18 + (i % 3) * 6,
                    opacity: 0.25 + (i % 3) * 0.15,
                  },
                ]}
              >
                {e}
              </Text>
            ))}
          </View>

          {/* Badge */}
          <Animated.View style={[
            styles.badgeWrapper,
            { transform: [{ scale: badgeScale }, { rotate: rotateInterpolate }] },
          ]}>
            <LinearGradient colors={milestone.color} style={styles.badge}>
              <Text style={styles.badgeEmoji}>{milestone.emoji}</Text>
            </LinearGradient>
          </Animated.View>

          <Text style={styles.streakNumber}>{milestoneDays}</Text>
          <Text style={styles.streakLabel}>Day Streak!</Text>
          <Text style={styles.headline}>You absolute legend.</Text>

          {/* Reward card */}
          <Animated.View style={[
            styles.rewardCard,
            { transform: [{ translateY: cardSlide }], opacity: cardOpacity },
          ]}>
            <Text style={styles.rewardTitle}>🎁 Reward Unlocked</Text>
            <LinearGradient colors={milestone.color} style={styles.rewardBadgeRow}>
              <Text style={styles.rewardEmoji}>{milestone.emoji}</Text>
              <View style={styles.rewardText}>
                <Text style={styles.rewardBadgeName}>{milestone.badgeName}</Text>
                <Text style={styles.rewardDesc}>{milestone.reward}</Text>
              </View>
            </LinearGradient>

            <View style={styles.infoRow}>
              <Text style={styles.infoEmoji}>🔒</Text>
              <Text style={styles.infoText}>
                This reward is exclusive — it can only be earned through your streak.
                It can never be bought or given.
              </Text>
            </View>
          </Animated.View>

          {/* CTA */}
          <Animated.View style={[styles.btnWrapper, { transform: [{ scale: btnScale }] }]}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.goBack()}>
              <LinearGradient
                colors={milestone.color}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btn}
              >
                <Text style={styles.btnText}>Keep the streak going! 🔥</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 24, paddingVertical: 32,
  },
  confettiLayer: { ...StyleSheet.absoluteFillObject },
  confettiEmoji: { position: 'absolute' },

  badgeWrapper: { marginBottom: 16 },
  badge: {
    width: 120, height: 120, borderRadius: 60,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#f97316', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6, shadowRadius: 20, elevation: 16,
  },
  badgeEmoji: { fontSize: 64 },

  streakNumber: {
    fontSize: 72, fontWeight: '900', color: '#fff',
    lineHeight: 80, marginTop: 4,
  },
  streakLabel: {
    fontSize: 22, fontWeight: '700', color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  headline: {
    fontSize: 24, fontWeight: '800', color: '#fff',
    marginBottom: 28, textAlign: 'center',
  },

  rewardCard: {
    width: '100%', backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 24, padding: 20, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)', marginBottom: 28,
    gap: 14,
  },
  rewardTitle: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5 },
  rewardBadgeRow: {
    borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  rewardEmoji: { fontSize: 40 },
  rewardText: { flex: 1 },
  rewardBadgeName: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 3 },
  rewardDesc: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 18 },

  infoRow: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
  },
  infoEmoji: { fontSize: 16 },
  infoText: {
    flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 18,
  },

  btnWrapper: { width: '100%' },
  btn: {
    borderRadius: 50, paddingVertical: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  btnText: { fontSize: 17, fontWeight: '800', color: '#fff' },
});
