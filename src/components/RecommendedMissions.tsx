import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ChevronRight, Sparkles, Volume2, Info } from 'lucide-react-native';
import { useTTS } from '../hooks/useTTS';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useChild } from '../context/ChildContext';
import {
  getRecommendedMissions,
  type Recommendation,
} from '../services/recommendationService';
import { getAIRecommendations } from '../services/aiAgentService';
import type { AgeGroup } from '../data/missionCatalog';

const PILLAR_COLORS: Record<string, [string, string]> = {
  nutrition: ['#22c55e', '#16a34a'],
  movement: ['#f97316', '#ea580c'],
  sleep: ['#8b5cf6', '#7c3aed'],
  confidence: ['#ec4899', '#db2777'],
};

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: '5 min',
  medium: '15 min',
  hard: '30 min',
};

type Props = {
  isDark?: boolean;
};

export function RecommendedMissions({ isDark = false }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { activeChild } = useChild();
  const { read } = useTTS();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAI, setIsAI] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);

  useEffect(() => {
    if (!activeChild?.id) {
      setLoading(false);
      return;
    }

    const startDate =
      activeChild.last_active_date ?? new Date().toISOString().split('T')[0];
    const ageGroup = activeChild.age_group as AgeGroup;

    (async () => {
      // Try AI recommendations first
      {
        const aiRecs = await getAIRecommendations(activeChild.id, ageGroup);
        if (aiRecs) {
          setRecommendations(aiRecs);
          setIsAI(true);
          setLoading(false);
          return;
        }
      }
      // Fall back to rule-based
      const recs = await getRecommendedMissions(
        activeChild.id,
        ageGroup,
        startDate,
      );
      setRecommendations(recs);
      setLoading(false);
    })().catch(() => setLoading(false));
  }, [activeChild?.id]);

  if (loading) {
    return (
      <View style={[s.container, isDark && s.containerDark]}>
        <ActivityIndicator size="small" color={isDark ? '#fff' : '#f97316'} />
      </View>
    );
  }

  if (!recommendations.length) return null;

  const textColor = isDark ? '#fff' : '#111827';
  const subColor = isDark ? 'rgba(255,255,255,0.55)' : '#6b7280';

  return (
    <View style={[s.container, isDark && s.containerDark]}>
      {/* Header */}
      <View style={s.header}>
        <Sparkles size={16} color="#f97316" />
        <Text style={[s.headerTitle, { color: textColor }]}>
          Recommended for you
        </Text>
        <Text style={[s.headerSub, { color: subColor }]}>
          {isAI ? 'Personalised for you today ✨' : 'Based on your history'}
        </Text>
      </View>

      {/* Top recommendation — large card */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate(recommendations[0].screen as any)}
      >
        <LinearGradient
          colors={
            PILLAR_COLORS[recommendations[0].pillar] ?? ['#f97316', '#ea580c']
          }
          style={s.primaryCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={s.primaryCardContent}>
            <Text style={s.primaryEmoji}>{recommendations[0].emoji}</Text>
            <View style={s.primaryText}>
              <Text style={s.primaryTitle}>{recommendations[0].title}</Text>
              <Text style={s.primarySubtitle}>
                {recommendations[0].subtitle}
              </Text>
              <View style={s.primaryMeta}>
                <View style={s.metaChip}>
                  <Text style={s.metaChipText}>
                    {DIFFICULTY_LABEL[recommendations[0].difficulty]}
                  </Text>
                </View>
                <Text style={s.reasonText}>✨ {recommendations[0].reason}</Text>
                <TouchableOpacity
                  onPress={() =>
                    read(
                      `${recommendations[0].title}. ${recommendations[0].reason}`,
                    )
                  }
                  style={{ padding: 4 }}
                >
                  <Volume2 size={14} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setWhyOpen(o => !o)}
                  style={{ padding: 4 }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Info size={14} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
              </View>
              {whyOpen && (
                <View style={s.whyPanel}>
                  <Text style={s.whyTitle}>Why am I seeing this?</Text>
                  <Text style={s.whyText}>{recommendations[0].reason}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={s.startRow}>
            <Text style={s.startText}>Start now</Text>
            <ChevronRight size={16} color="#fff" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Secondary recommendations — small row */}
      {recommendations.length > 1 && (
        <View style={s.secondaryRow}>
          {recommendations.slice(1).map(rec => (
            <TouchableOpacity
              key={rec.id}
              activeOpacity={0.85}
              style={[s.secondaryCard, isDark && s.secondaryCardDark]}
              onPress={() => navigation.navigate(rec.screen as any)}
            >
              <Text style={s.secondaryEmoji}>{rec.emoji}</Text>
              <Text
                style={[s.secondaryTitle, { color: textColor }]}
                numberOfLines={2}
              >
                {rec.title}
              </Text>
              <View
                style={[
                  s.pillarDot,
                  { backgroundColor: PILLAR_COLORS[rec.pillar]?.[0] },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  containerDark: { backgroundColor: 'rgba(255,255,255,0.07)' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  headerTitle: { fontSize: 15, fontWeight: '800', flex: 1 },
  headerSub: { fontSize: 12 },

  primaryCard: { borderRadius: 16, padding: 18, marginBottom: 10 },
  primaryCardContent: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  primaryEmoji: { fontSize: 44 },
  primaryText: { flex: 1 },
  primaryTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 3,
  },
  primarySubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 8,
  },
  primaryMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaChip: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  metaChipText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  reasonText: { fontSize: 11, color: 'rgba(255,255,255,0.8)', flex: 1 },
  whyPanel: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 10,
    padding: 10,
  },
  whyTitle: { fontSize: 11, fontWeight: '800', color: '#fff', marginBottom: 3 },
  whyText: { fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 17 },
  startRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    paddingVertical: 10,
  },
  startText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  secondaryRow: { flexDirection: 'row', gap: 10 },
  secondaryCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 14,
    alignItems: 'flex-start',
    gap: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryCardDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  secondaryEmoji: { fontSize: 28 },
  secondaryTitle: { fontSize: 13, fontWeight: '700', lineHeight: 18 },
  pillarDot: { width: 8, height: 8, borderRadius: 4, marginTop: 2 },
});
