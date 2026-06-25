import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Check, Flame, Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import type { Pillar } from '../services/syncService';
import { useParentData } from '../hooks/useParentData';
import {
  activitiesForPillar,
  RealWorldActivity,
} from '../data/realWorldActivities';
import { logRealWorldActivity } from '../services/realWorldLog';
import type { StreakMilestone } from '../services/streakService';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CUSTOM_XP = 8;

const PILLARS: {
  key: Pillar;
  emoji: string;
  label: string;
  color: [string, string];
}[] = [
  {
    key: 'nutrition',
    emoji: '🥕',
    label: 'Nutrition',
    color: ['#22c55e', '#16a34a'],
  },
  {
    key: 'movement',
    emoji: '⚽',
    label: 'Movement',
    color: ['#f97316', '#ea580c'],
  },
  { key: 'sleep', emoji: '😴', label: 'Sleep', color: ['#8b5cf6', '#7c3aed'] },
  {
    key: 'confidence',
    emoji: '🧠',
    label: 'Confidence',
    color: ['#ec4899', '#db2777'],
  },
];

export function RealWorldLog() {
  const navigation = useNavigation<Nav>();
  const { children, loading, reload } = useParentData();

  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [pillar, setPillar] = useState<Pillar>('movement');
  const [selected, setSelected] = useState<RealWorldActivity | null>(null);
  const [custom, setCustom] = useState('');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{
    childName: string;
    label: string;
    xp: number;
    newStreak: number;
    milestone: StreakMilestone | null;
  } | null>(null);

  if (loading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!children.length) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.centered}>
          <Text style={s.emptyEmoji}>🌟</Text>
          <Text style={s.emptyTitle}>No children yet</Text>
          <Text style={s.emptySub}>
            Add a child profile before logging real-world wins.
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={s.emptyBack}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const child = selectedChildId
    ? children.find(c => c.id === selectedChildId) ?? children[0]
    : children[0];

  const activities = activitiesForPillar(pillar);
  const customTrimmed = custom.trim();
  const canLog = !!selected || customTrimmed.length > 0;
  const xpPreview = selected ? selected.xp : CUSTOM_XP;
  const pillarCfg = PILLARS.find(p => p.key === pillar)!;

  const handleLog = async () => {
    if (!child || !canLog) return;
    setSaving(true);
    const label = selected ? selected.label : customTrimmed;
    const xp = selected ? selected.xp : CUSTOM_XP;

    const res = await logRealWorldActivity(child.id, pillar, label, xp);

    setSaving(false);
    setResult({
      childName: child.name,
      label,
      xp,
      newStreak: res.newStreak,
      milestone: res.milestone,
    });
    // Reset selection so a second log starts clean
    setSelected(null);
    setCustom('');
    reload();
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={s.backBtn}
          >
            <ArrowLeft size={22} color="#374151" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Log a Real-World Win</Text>
          <View style={{ width: 44 }} />
        </View>

        <Text style={s.intro}>
          Did {child.name} do something great away from the app? Log it here —
          it counts towards their streak, XP and pillar scores.
        </Text>

        {/* Child selector */}
        {children.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={s.childScroll}
          >
            <View style={s.childRow}>
              {children.map(c => {
                const active = c.id === child.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setSelectedChildId(c.id)}
                    style={[s.childPill, active && s.childPillActive]}
                  >
                    <Text
                      style={[s.childPillText, active && s.childPillTextActive]}
                    >
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )}

        {/* Pillar selector */}
        <Text style={s.sectionLabel}>Which pillar?</Text>
        <View style={s.pillarRow}>
          {PILLARS.map(p => {
            const active = p.key === pillar;
            return (
              <TouchableOpacity
                key={p.key}
                onPress={() => {
                  setPillar(p.key);
                  setSelected(null);
                }}
                style={s.pillarTab}
              >
                {active ? (
                  <LinearGradient colors={p.color} style={s.pillarTabInner}>
                    <Text style={s.pillarEmoji}>{p.emoji}</Text>
                    <Text style={s.pillarLabelActive}>{p.label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[s.pillarTabInner, s.pillarTabInactive]}>
                    <Text style={s.pillarEmoji}>{p.emoji}</Text>
                    <Text style={s.pillarLabel}>{p.label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Activity chips */}
        <Text style={s.sectionLabel}>What did they do?</Text>
        <View style={s.chips}>
          {activities.map(a => {
            const active = selected?.id === a.id;
            return (
              <TouchableOpacity
                key={a.id}
                onPress={() => {
                  setSelected(active ? null : a);
                  setCustom('');
                }}
                style={[s.chip, active && s.chipActive]}
              >
                <Text style={s.chipEmoji}>{a.emoji}</Text>
                <Text style={[s.chipText, active && s.chipTextActive]}>
                  {a.label}
                </Text>
                <Text style={[s.chipXp, active && s.chipXpActive]}>
                  +{a.xp}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom */}
        <Text style={s.sectionLabel}>…or something else</Text>
        <TextInput
          value={custom}
          onChangeText={t => {
            setCustom(t);
            if (t) setSelected(null);
          }}
          placeholder="Type what they did…"
          placeholderTextColor="#9ca3af"
          style={s.input}
          maxLength={80}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky log button */}
      <View style={s.footer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleLog}
          disabled={!canLog || saving}
        >
          <LinearGradient
            colors={canLog ? pillarCfg.color : ['#d1d5db', '#9ca3af']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.logBtn}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Check size={20} color="#fff" />
                <Text style={s.logBtnText}>
                  Log it{canLog ? `  ·  +${xpPreview} XP` : ''}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Success overlay */}
      <Modal
        visible={!!result}
        transparent
        animationType="fade"
        onRequestClose={() => setResult(null)}
      >
        <View style={s.overlay}>
          <View style={s.successCard}>
            <Text style={s.successEmoji}>
              {result?.milestone ? result.milestone.emoji : '🌟'}
            </Text>
            <Text style={s.successTitle}>
              {result?.milestone
                ? `${result.milestone.days}-day streak!`
                : 'Logged!'}
            </Text>
            <Text style={s.successSub}>
              {result?.label} —{' '}
              <Text style={s.successStrong}>+{result?.xp} XP</Text> for{' '}
              {result?.childName}
            </Text>

            <View style={s.successStreak}>
              <Flame size={16} color="#f97316" />
              <Text style={s.successStreakText}>
                {result?.newStreak} day streak
              </Text>
            </View>

            {result?.milestone && (
              <View style={s.milestoneReward}>
                <Sparkles size={14} color="#d97706" />
                <Text style={s.milestoneRewardText}>
                  {result.milestone.reward}
                </Text>
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setResult(null)}
              style={s.successBtnWrap}
            >
              <LinearGradient
                colors={['#f97316', '#fbbf24']}
                style={s.successBtn}
              >
                <Text style={s.successBtnText}>Log another</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={s.successDone}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20, paddingTop: 12 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#111827' },
  intro: { fontSize: 14, color: '#6b7280', lineHeight: 21, marginBottom: 20 },

  childScroll: { marginBottom: 16 },
  childRow: { flexDirection: 'row', gap: 8 },
  childPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  childPillActive: { backgroundColor: '#1e3a5f', borderColor: '#1e3a5f' },
  childPillText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  childPillTextActive: { color: '#fff' },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
    marginTop: 6,
  },

  pillarRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  pillarTab: { flex: 1 },
  pillarTabInner: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  pillarTabInactive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  pillarEmoji: { fontSize: 22 },
  pillarLabel: { fontSize: 11, fontWeight: '700', color: '#6b7280' },
  pillarLabelActive: { fontSize: 11, fontWeight: '700', color: '#fff' },

  chips: { gap: 10, marginBottom: 16 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#f3f4f6',
  },
  chipActive: { borderColor: '#f97316', backgroundColor: '#fff7ed' },
  chipEmoji: { fontSize: 22 },
  chipText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#374151' },
  chipTextActive: { color: '#9a3412' },
  chipXp: { fontSize: 13, fontWeight: '800', color: '#9ca3af' },
  chipXpActive: { color: '#f97316' },

  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logBtn: {
    borderRadius: 50,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logBtnText: { fontSize: 17, fontWeight: '800', color: '#fff' },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    width: '100%',
  },
  successEmoji: { fontSize: 64, marginBottom: 8 },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  successSub: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  successStrong: { fontWeight: '800', color: '#f97316' },
  successStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff7ed',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  successStreakText: { fontSize: 14, fontWeight: '700', color: '#c2410c' },
  milestoneReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 12,
  },
  milestoneRewardText: {
    fontSize: 13,
    color: '#92400e',
    textAlign: 'center',
    flexShrink: 1,
  },
  successBtnWrap: { marginTop: 24, width: '100%' },
  successBtn: { borderRadius: 50, paddingVertical: 16, alignItems: 'center' },
  successBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  successDone: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },

  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyBack: { fontSize: 16, fontWeight: '700', color: '#f97316' },
});
