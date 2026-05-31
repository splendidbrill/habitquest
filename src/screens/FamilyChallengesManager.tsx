import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  SafeAreaView, TextInput, ActivityIndicator, Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Plus, Check, Trophy, Flame, Users, Zap, X, Map } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useAuth } from '../context/AuthContext';
import {
  loadFamilyChallenges, createChallenge, parentSupportChallenge,
  archiveChallenge, loadFamilyLeaderboard, getFamilyXP,
  FamilyChallenge, FamilyLeaderboardEntry,
} from '../services/familyChallengeService';
import {
  getReactionTargets, sendReaction, REACTION_EMOJIS, type ReactionTarget,
} from '../services/reactionService';
import type { Pillar } from '../services/syncService';

const PILLAR_CONFIG: Record<Pillar, { emoji: string; label: string; colors: [string, string] }> = {
  nutrition:  { emoji: '🥕', label: 'Nutrition',  colors: ['#22c55e', '#16a34a'] },
  movement:   { emoji: '⚽', label: 'Movement',   colors: ['#f97316', '#ea580c'] },
  sleep:      { emoji: '😴', label: 'Sleep',      colors: ['#8b5cf6', '#7c3aed'] },
  confidence: { emoji: '🧠', label: 'Confidence', colors: ['#ec4899', '#db2777'] },
};

const SUGGESTED_CHALLENGES = [
  { title: 'Everyone drinks water with dinner', pillar: 'nutrition'  as Pillar },
  { title: 'Walk together for 10 minutes',      pillar: 'movement'   as Pillar },
  { title: 'Try one new vegetable this week',   pillar: 'nutrition'  as Pillar },
  { title: 'Family screen-free hour tonight',   pillar: 'confidence' as Pillar },
  { title: 'Go to bed at the same time tonight',pillar: 'sleep'      as Pillar },
  { title: 'Cook dinner together',              pillar: 'nutrition'  as Pillar },
];

export function FamilyChallengesManager() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const [challenges, setChallenges] = useState<FamilyChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<FamilyLeaderboardEntry[]>([]);
  const [familyXP, setFamilyXP] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [reactionTargets, setReactionTargets] = useState<ReactionTarget[]>([]);

  // Create form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPillar, setNewPillar] = useState<Pillar | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [c, lb, targets] = await Promise.all([
      loadFamilyChallenges(user.id),
      loadFamilyLeaderboard(user.id),
      getReactionTargets(user.id),
    ]);
    setChallenges(c);
    setLeaderboard(lb);
    setReactionTargets(targets);

    // Get family XP from first child if any
    if (lb.length > 0) {
      const xp = await getFamilyXP(lb[0].id);
      setFamilyXP(xp);
    }
    setLoading(false);
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleCreate = async () => {
    if (!newTitle.trim() || !user) return;
    setCreating(true);
    await createChallenge(user.id, newTitle.trim(), newDesc.trim(), newPillar);
    setNewTitle(''); setNewDesc(''); setNewPillar(null);
    setShowCreate(false);
    setCreating(false);
    load();
  };

  const handleSupport = async (challenge: FamilyChallenge) => {
    if (!leaderboard.length) return;
    await parentSupportChallenge(challenge.id, leaderboard[0].id);
    load();
  };

  const handleArchive = async (challengeId: string) => {
    await archiveChallenge(challengeId);
    load();
  };

  if (loading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.screen} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <ArrowLeft size={22} color="#374151" />
          </TouchableOpacity>
          <View style={s.headerCenter}>
            <Text style={s.title}>Family Challenges</Text>
            <Text style={s.subtitle}>Do them together, earn XP together</Text>
          </View>
          <TouchableOpacity style={s.addBtn} onPress={() => setShowCreate(true)}>
            <Plus size={22} color="#f97316" />
          </TouchableOpacity>
        </View>

        {/* Family Adventure entry */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => user && navigation.navigate('FamilyAdventureMap', { parentId: user.id })}
        >
          <LinearGradient colors={['#7c3aed', '#db2777']} style={s.adventureBanner}>
            <Text style={s.adventureBannerEmoji}>🗺️</Text>
            <View style={s.adventureBannerText}>
              <Text style={s.adventureBannerTitle}>Family Adventure Mode</Text>
              <Text style={s.adventureBannerSub}>Multi-stage quests for the whole family</Text>
            </View>
            <Map size={20} color="rgba(255,255,255,0.8)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Family XP banner */}
        <LinearGradient colors={['#1e3a5f', '#3b82f6']} style={s.xpBanner}>
          <View style={s.xpBannerLeft}>
            <Users size={20} color="rgba(255,255,255,0.7)" />
            <Text style={s.xpBannerLabel}>Family XP</Text>
          </View>
          <Text style={s.xpBannerValue}>{familyXP} XP</Text>
        </LinearGradient>

        {/* Family leaderboard */}
        {leaderboard.length > 1 && (
          <View style={s.card}>
            <View style={s.cardTitleRow}>
              <Trophy size={16} color="#f59e0b" />
              <Text style={s.cardTitle}>Family Leaderboard</Text>
            </View>
            {leaderboard.map((member, i) => (
              <View key={member.id} style={s.lbRow}>
                <Text style={s.lbRank}>#{i + 1}</Text>
                <View style={s.lbAvatar}>
                  <Text style={s.lbAvatarText}>{member.name[0]}</Text>
                </View>
                <View style={s.lbInfo}>
                  <Text style={s.lbName}>{member.name}</Text>
                  <Text style={s.lbMeta}>{member.level} · {member.streak} 🔥</Text>
                </View>
                <Text style={s.lbXP}>{member.xp} XP</Text>
              </View>
            ))}
          </View>
        )}

        {/* Active challenges */}
        <Text style={s.sectionLabel}>
          Active Challenges {challenges.length > 0 ? `(${challenges.length})` : ''}
        </Text>

        {challenges.length === 0 ? (
          <View style={s.emptyBox}>
            <Text style={s.emptyEmoji}>🌟</Text>
            <Text style={s.emptyTitle}>No active challenges yet</Text>
            <Text style={s.emptySub}>Create your first family challenge below</Text>
          </View>
        ) : (
          challenges.map(challenge => {
            const pillarCfg = challenge.pillar ? PILLAR_CONFIG[challenge.pillar] : null;
            const supported = !!challenge.parent_supported_at;
            return (
              <View key={challenge.id} style={s.challengeCard}>
                {pillarCfg && (
                  <LinearGradient colors={pillarCfg.colors} style={s.pillarTag}>
                    <Text style={s.pillarTagText}>{pillarCfg.emoji} {pillarCfg.label}</Text>
                  </LinearGradient>
                )}

                <Text style={s.challengeTitle}>{challenge.title}</Text>
                {challenge.description ? (
                  <Text style={s.challengeDesc}>{challenge.description}</Text>
                ) : null}

                {/* Completion status */}
                {challenge.completions.length > 0 && (
                  <View style={s.completionsBox}>
                    {challenge.completions.map((c, i) => (
                      <View key={i} style={s.completionChip}>
                        <Check size={12} color="#16a34a" />
                        <Text style={s.completionChipText}>{c.child_name} ✓</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* XP awards */}
                <View style={s.xpRow}>
                  <View style={s.xpChip}>
                    <Zap size={12} color="#f97316" />
                    <Text style={s.xpChipText}>Child: +50 XP</Text>
                  </View>
                  <View style={s.xpChip}>
                    <Zap size={12} color="#3b82f6" />
                    <Text style={s.xpChipText}>Your support: +20 XP</Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={s.challengeActions}>
                  <TouchableOpacity
                    style={[s.supportBtn, supported && s.supportBtnDone]}
                    onPress={() => !supported && handleSupport(challenge)}
                    disabled={supported}
                  >
                    {supported
                      ? <Check size={14} color="#16a34a" />
                      : <Flame size={14} color="#f97316" />
                    }
                    <Text style={[s.supportBtnText, supported && s.supportBtnTextDone]}>
                      {supported ? 'Supported!' : 'I supported 🔥'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={s.archiveBtn}
                    onPress={() => handleArchive(challenge.id)}
                  >
                    <Text style={s.archiveBtnText}>Archive</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

        {/* React to missions */}
        {reactionTargets.length > 0 && (
          <>
            <Text style={s.sectionLabel}>React to today's missions</Text>
            {reactionTargets.map((target, i) => (
              <View key={i} style={s.reactionCard}>
                <View style={s.reactionInfo}>
                  <Text style={s.reactionChild}>{target.childName}</Text>
                  <Text style={s.reactionMission} numberOfLines={1}>{target.missionTitle}</Text>
                </View>
                {target.alreadyReacted ? (
                  <View style={s.reactionDone}>
                    <Text style={s.reactionDoneText}>Reacted ✓</Text>
                  </View>
                ) : (
                  <View style={s.reactionEmojis}>
                    {REACTION_EMOJIS.map(emoji => (
                      <TouchableOpacity
                        key={emoji}
                        style={s.reactionEmojiBtn}
                        onPress={async () => {
                          if (!user) return;
                          await sendReaction(user.id, target.childId, target.missionTitle, emoji);
                          load();
                        }}
                      >
                        <Text style={s.reactionEmoji}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        {/* Suggested challenges */}
        <Text style={s.sectionLabel}>Suggestions</Text>
        <View style={s.suggestions}>
          {SUGGESTED_CHALLENGES.map((sug, i) => {
            const cfg = PILLAR_CONFIG[sug.pillar];
            return (
              <TouchableOpacity
                key={i}
                style={s.sugCard}
                activeOpacity={0.85}
                onPress={() => {
                  setNewTitle(sug.title);
                  setNewPillar(sug.pillar);
                  setShowCreate(true);
                }}
              >
                <Text style={s.sugEmoji}>{cfg.emoji}</Text>
                <Text style={s.sugTitle}>{sug.title}</Text>
                <Plus size={16} color="#9ca3af" />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Create Challenge Modal */}
      <Modal visible={showCreate} transparent animationType="slide" onRequestClose={() => setShowCreate(false)}>
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setShowCreate(false)}>
          <TouchableOpacity activeOpacity={1} style={s.modalSheet}>
            <View style={s.modalHandle} />
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>New Family Challenge</Text>
              <TouchableOpacity onPress={() => setShowCreate(false)}>
                <X size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text style={s.inputLabel}>Challenge title</Text>
            <TextInput
              style={s.input}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="e.g. Everyone drinks water with dinner"
              placeholderTextColor="#9ca3af"
              autoFocus
            />

            <Text style={s.inputLabel}>Description (optional)</Text>
            <TextInput
              style={[s.input, s.inputMulti]}
              value={newDesc}
              onChangeText={setNewDesc}
              placeholder="Any extra details..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={2}
            />

            <Text style={s.inputLabel}>Health pillar</Text>
            <View style={s.pillarGrid}>
              {(Object.keys(PILLAR_CONFIG) as Pillar[]).map(p => {
                const cfg = PILLAR_CONFIG[p];
                return (
                  <TouchableOpacity
                    key={p}
                    style={[s.pillarOption, newPillar === p && s.pillarOptionActive]}
                    onPress={() => setNewPillar(newPillar === p ? null : p)}
                  >
                    <Text style={s.pillarOptionEmoji}>{cfg.emoji}</Text>
                    <Text style={[s.pillarOptionLabel, newPillar === p && { color: '#fff' }]}>
                      {cfg.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleCreate}
              disabled={!newTitle.trim() || creating}
            >
              <LinearGradient
                colors={['#f97316', '#fbbf24']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[s.createBtn, (!newTitle.trim()) && s.createBtnDisabled]}
              >
                {creating
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={s.createBtnText}>Create Challenge 🎯</Text>
                }
              </LinearGradient>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  screen: { flex: 1 },
  content: { padding: 20, paddingTop: 12, paddingBottom: 40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  headerCenter: { flex: 1 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 1 },
  addBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff7ed',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#fed7aa',
  },

  adventureBanner: {
    borderRadius: 18, padding: 18, flexDirection: 'row',
    alignItems: 'center', gap: 12, marginBottom: 12,
  },
  adventureBannerEmoji: { fontSize: 32 },
  adventureBannerText: { flex: 1 },
  adventureBannerTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  adventureBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },

  reactionCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  reactionInfo: { flex: 1 },
  reactionChild: { fontSize: 13, fontWeight: '800', color: '#111827' },
  reactionMission: { fontSize: 12, color: '#6b7280', marginTop: 1 },
  reactionEmojis: { flexDirection: 'row', gap: 4 },
  reactionEmojiBtn: { padding: 4 },
  reactionEmoji: { fontSize: 22 },
  reactionDone: { backgroundColor: '#f0fdf4', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  reactionDoneText: { fontSize: 12, fontWeight: '700', color: '#16a34a' },

  xpBanner: {
    borderRadius: 18, padding: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
  },
  xpBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  xpBannerLabel: { fontSize: 15, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  xpBannerValue: { fontSize: 26, fontWeight: '900', color: '#fff' },

  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },

  lbRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  lbRank: { fontSize: 15, fontWeight: '800', color: '#9ca3af', width: 24 },
  lbAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' },
  lbAvatarText: { fontSize: 16, fontWeight: '800', color: '#1d4ed8' },
  lbInfo: { flex: 1 },
  lbName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  lbMeta: { fontSize: 12, color: '#6b7280', marginTop: 1 },
  lbXP: { fontSize: 16, fontWeight: '800', color: '#f97316' },

  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#6b7280', marginBottom: 10, letterSpacing: 0.3 },

  emptyBox: { backgroundColor: '#fff', borderRadius: 20, padding: 28, alignItems: 'center', marginBottom: 16 },
  emptyEmoji: { fontSize: 48, marginBottom: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#374151', marginBottom: 4 },
  emptySub: { fontSize: 14, color: '#9ca3af', textAlign: 'center' },

  challengeCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  pillarTag: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 10 },
  pillarTagText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  challengeTitle: { fontSize: 17, fontWeight: '800', color: '#111827', marginBottom: 4 },
  challengeDesc: { fontSize: 14, color: '#6b7280', marginBottom: 10, lineHeight: 20 },

  completionsBox: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  completionChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#f0fdf4', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: '#bbf7d0',
  },
  completionChipText: { fontSize: 12, fontWeight: '600', color: '#16a34a' },

  xpRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  xpChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#f9fafb', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  xpChipText: { fontSize: 12, fontWeight: '600', color: '#374151' },

  challengeActions: { flexDirection: 'row', gap: 10 },
  supportBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#fff7ed', borderRadius: 14, paddingVertical: 12,
    borderWidth: 1.5, borderColor: '#fed7aa',
  },
  supportBtnDone: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  supportBtnText: { fontSize: 14, fontWeight: '700', color: '#ea580c' },
  supportBtnTextDone: { color: '#16a34a' },
  archiveBtn: {
    paddingHorizontal: 18, paddingVertical: 12, backgroundColor: '#f3f4f6', borderRadius: 14,
  },
  archiveBtnText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },

  suggestions: { gap: 10, marginBottom: 16 },
  sugCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  sugEmoji: { fontSize: 24 },
  sugTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: '#374151' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#e5e7eb', alignSelf: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: '#f9fafb', borderWidth: 1.5, borderColor: '#e5e7eb',
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 15, color: '#111827', marginBottom: 16,
  },
  inputMulti: { height: 72, textAlignVertical: 'top' },
  pillarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  pillarOption: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 9,
    backgroundColor: '#f3f4f6', borderRadius: 20, borderWidth: 1.5, borderColor: '#e5e7eb',
  },
  pillarOptionActive: { backgroundColor: '#1e3a5f', borderColor: '#1e3a5f' },
  pillarOptionEmoji: { fontSize: 16 },
  pillarOptionLabel: { fontSize: 13, fontWeight: '600', color: '#374151' },
  createBtn: { borderRadius: 50, paddingVertical: 16, alignItems: 'center' },
  createBtnDisabled: { opacity: 0.5 },
  createBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
