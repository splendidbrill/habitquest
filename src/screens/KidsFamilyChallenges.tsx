import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  SafeAreaView, ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Check, Zap, Users, Trophy, Map } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useChild } from '../context/ChildContext';
import {
  loadChallengesForChild, childCompleteChallenge,
  loadFamilyLeaderboard, getFamilyXP,
  FamilyChallenge, FamilyLeaderboardEntry,
} from '../services/familyChallengeService';
import { getChildParentId } from '../services/familyAdventureService';
import type { Pillar } from '../services/syncService';

const PILLAR_CONFIG: Record<Pillar, { emoji: string; label: string; colors: [string, string] }> = {
  nutrition:  { emoji: '🥕', label: 'Nutrition',  colors: ['#22c55e', '#16a34a'] },
  movement:   { emoji: '⚽', label: 'Movement',   colors: ['#f97316', '#ea580c'] },
  sleep:      { emoji: '😴', label: 'Sleep',      colors: ['#8b5cf6', '#7c3aed'] },
  confidence: { emoji: '🧠', label: 'Confidence', colors: ['#ec4899', '#db2777'] },
};

// Age-specific theme
const AGE_THEME: Record<string, { bg: [string, string]; isDark: boolean }> = {
  '6-8':   { bg: ['#bae6fd', '#fed7aa'], isDark: false },
  '8-10':  { bg: ['#0f172a', '#1e3a8a'], isDark: true  },
  '10-12': { bg: ['#0a0a0f', '#1a0a2e'], isDark: true  },
};

export function KidsFamilyChallenges() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { activeChild } = useChild();
  const ageGroup = activeChild?.age_group ?? '6-8';
  const theme = AGE_THEME[ageGroup] ?? AGE_THEME['6-8'];
  const isDark = theme.isDark;
  const textColor = isDark ? '#fff' : '#111827';
  const subColor = isDark ? 'rgba(255,255,255,0.6)' : '#6b7280';

  const [challenges, setChallenges] = useState<FamilyChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<FamilyLeaderboardEntry[]>([]);
  const [familyXP, setFamilyXP] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);
  const [justDone, setJustDone] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!activeChild?.id) return;
    setLoading(true);
    const [c, xp] = await Promise.all([
      loadChallengesForChild(activeChild.id),
      getFamilyXP(activeChild.id),
    ]);
    setChallenges(c);
    setFamilyXP(xp);

    // Load leaderboard via parent_id lookup
    const { data: childRow } = await import('../lib/supabase').then(m =>
      m.supabase.from('children').select('parent_id').eq('id', activeChild.id).single()
    );
    if (childRow?.parent_id) {
      const lb = await loadFamilyLeaderboard(childRow.parent_id);
      setLeaderboard(lb);
    }
    setLoading(false);
  }, [activeChild?.id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleComplete = async (challengeId: string) => {
    if (!activeChild?.id || completing) return;
    setCompleting(challengeId);
    await childCompleteChallenge(challengeId, activeChild.id);
    setJustDone(challengeId);
    setCompleting(null);
    load();
  };

  const hasCompleted = (challenge: FamilyChallenge) =>
    challenge.completions.some(c => c.child_id === activeChild?.id);

  if (loading) {
    return (
      <LinearGradient colors={theme.bg} style={s.centered}>
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#f97316'} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={theme.bg} style={s.container}>
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[s.backBtn, isDark && s.backBtnDark]}>
              <ArrowLeft size={22} color={isDark ? '#fff' : '#374151'} />
            </TouchableOpacity>
            <View>
              <Text style={[s.title, { color: textColor }]}>Family Challenges</Text>
              <Text style={[s.subtitle, { color: subColor }]}>Do them together, earn XP together</Text>
            </View>
          </View>

          {/* Adventure entry */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={async () => {
              const pid = activeChild?.id ? await getChildParentId(activeChild.id) : null;
              if (pid) navigation.navigate('FamilyAdventureMap', { parentId: pid });
            }}
          >
            <LinearGradient colors={['#7c3aed', '#db2777']} style={s.adventureBtn}>
              <Text style={s.adventureBtnEmoji}>🗺️</Text>
              <View style={s.adventureBtnText}>
                <Text style={[s.adventureBtnTitle, { color: '#fff' }]}>Family Adventures</Text>
                <Text style={s.adventureBtnSub}>See your family's quest</Text>
              </View>
              <Map size={18} color="rgba(255,255,255,0.7)" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Family XP */}
          <View style={[s.xpCard, isDark && s.xpCardDark]}>
            <Users size={20} color={isDark ? 'rgba(255,255,255,0.7)' : '#6b7280'} />
            <View style={s.xpCardText}>
              <Text style={[s.xpCardLabel, { color: subColor }]}>Family XP Pool</Text>
              <Text style={[s.xpCardValue, { color: textColor }]}>{familyXP} XP</Text>
            </View>
            <Text style={s.xpCardEmoji}>⚡</Text>
          </View>

          {/* Challenges */}
          {challenges.length === 0 ? (
            <View style={[s.emptyBox, isDark && s.emptyBoxDark]}>
              <Text style={s.emptyEmoji}>🌟</Text>
              <Text style={[s.emptyTitle, { color: textColor }]}>No challenges yet</Text>
              <Text style={[s.emptySub, { color: subColor }]}>
                Ask a parent to set a family challenge!
              </Text>
            </View>
          ) : (
            challenges.map(challenge => {
              const done = hasCompleted(challenge);
              const pillarCfg = challenge.pillar ? PILLAR_CONFIG[challenge.pillar] : null;
              const isCompleting = completing === challenge.id;
              const wasDone = justDone === challenge.id;

              return (
                <View key={challenge.id} style={[s.challengeCard, isDark && s.challengeCardDark, done && s.challengeCardDone]}>
                  {pillarCfg && (
                    <LinearGradient colors={pillarCfg.colors} style={s.pillarTag}>
                      <Text style={s.pillarTagText}>{pillarCfg.emoji} {pillarCfg.label}</Text>
                    </LinearGradient>
                  )}

                  <Text style={[s.challengeTitle, { color: textColor }]}>{challenge.title}</Text>
                  {challenge.description ? (
                    <Text style={[s.challengeDesc, { color: subColor }]}>{challenge.description}</Text>
                  ) : null}

                  {/* XP reward info */}
                  <View style={s.rewardRow}>
                    <View style={s.rewardChip}>
                      <Zap size={12} color="#f97316" />
                      <Text style={s.rewardText}>+50 Family XP</Text>
                    </View>
                    {challenge.parent_supported_at && (
                      <View style={[s.rewardChip, s.rewardChipGreen]}>
                        <Check size={12} color="#16a34a" />
                        <Text style={[s.rewardText, { color: '#16a34a' }]}>Parent supported!</Text>
                      </View>
                    )}
                  </View>

                  {/* Complete button */}
                  {done ? (
                    <View style={s.doneBox}>
                      <Check size={18} color="#16a34a" />
                      <Text style={s.doneText}>
                        {wasDone ? 'Amazing! You did it! 🎉' : 'You completed this! ✓'}
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => handleComplete(challenge.id)}
                      disabled={!!completing}
                    >
                      <LinearGradient
                        colors={pillarCfg?.colors ?? ['#f97316', '#fbbf24']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={s.completeBtn}
                      >
                        {isCompleting
                          ? <ActivityIndicator color="#fff" size="small" />
                          : <Text style={s.completeBtnText}>I did it! 🙌</Text>
                        }
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}

          {/* Family leaderboard */}
          {leaderboard.length > 1 && (
            <View style={[s.lbCard, isDark && s.lbCardDark]}>
              <View style={s.lbTitleRow}>
                <Trophy size={16} color="#f59e0b" />
                <Text style={[s.lbTitle, { color: textColor }]}>Family Leaderboard</Text>
              </View>
              {leaderboard.map((member, i) => {
                const isMe = member.id === activeChild?.id;
                return (
                  <View key={member.id} style={[s.lbRow, isMe && s.lbRowMe]}>
                    <Text style={[s.lbRank, { color: subColor }]}>#{i + 1}</Text>
                    <View style={[s.lbAvatar, isMe && s.lbAvatarMe]}>
                      <Text style={s.lbAvatarText}>{member.name[0]}</Text>
                    </View>
                    <View style={s.lbInfo}>
                      <Text style={[s.lbName, { color: textColor }]}>
                        {member.name}{isMe ? ' (you)' : ''}
                      </Text>
                      <Text style={[s.lbMeta, { color: subColor }]}>
                        {member.level} · {member.streak} day streak 🔥
                      </Text>
                    </View>
                    <Text style={s.lbXP}>{member.xp} XP</Text>
                  </View>
                );
              })}
            </View>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, paddingTop: 12, paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  backBtnDark: { backgroundColor: 'rgba(255,255,255,0.1)', shadowOpacity: 0 },
  title: { fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 1 },

  xpCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  xpCardDark: { backgroundColor: 'rgba(255,255,255,0.08)' },
  xpCardText: { flex: 1 },
  xpCardLabel: { fontSize: 12, fontWeight: '600' },
  xpCardValue: { fontSize: 24, fontWeight: '900', marginTop: 1 },
  xpCardEmoji: { fontSize: 32 },

  emptyBox: {
    backgroundColor: '#fff', borderRadius: 20, padding: 28, alignItems: 'center', marginBottom: 16,
  },
  emptyBoxDark: { backgroundColor: 'rgba(255,255,255,0.07)' },
  emptyEmoji: { fontSize: 48, marginBottom: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  emptySub: { fontSize: 14, textAlign: 'center', lineHeight: 20 },

  challengeCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  challengeCardDark: { backgroundColor: 'rgba(255,255,255,0.08)' },
  challengeCardDone: { opacity: 0.85 },
  pillarTag: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 10 },
  pillarTagText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  challengeTitle: { fontSize: 17, fontWeight: '800', marginBottom: 4 },
  challengeDesc: { fontSize: 14, marginBottom: 10, lineHeight: 20 },

  rewardRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  rewardChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#fff7ed', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  rewardChipGreen: { backgroundColor: '#f0fdf4' },
  rewardText: { fontSize: 12, fontWeight: '600', color: '#ea580c' },

  doneBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#f0fdf4', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#bbf7d0',
  },
  doneText: { fontSize: 15, fontWeight: '700', color: '#16a34a' },

  completeBtn: { borderRadius: 50, paddingVertical: 16, alignItems: 'center' },
  completeBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  lbCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  adventureBtn: { borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  adventureBtnEmoji: { fontSize: 28 },
  adventureBtnText: { flex: 1 },
  adventureBtnTitle: { fontSize: 15, fontWeight: '800' },
  adventureBtnSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 1 },

  lbCardDark: { backgroundColor: 'rgba(255,255,255,0.08)' },
  lbTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  lbTitle: { fontSize: 16, fontWeight: '800' },
  lbRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  lbRowMe: { backgroundColor: 'rgba(249,115,22,0.06)', borderRadius: 10, paddingHorizontal: 8 },
  lbRank: { fontSize: 14, fontWeight: '700', width: 24 },
  lbAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' },
  lbAvatarMe: { backgroundColor: '#fed7aa' },
  lbAvatarText: { fontSize: 15, fontWeight: '800', color: '#1d4ed8' },
  lbInfo: { flex: 1 },
  lbName: { fontSize: 14, fontWeight: '700' },
  lbMeta: { fontSize: 12, marginTop: 1 },
  lbXP: { fontSize: 15, fontWeight: '800', color: '#f97316' },
});
