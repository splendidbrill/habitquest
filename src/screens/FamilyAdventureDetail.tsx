import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Check, Users, Zap } from 'lucide-react-native';
import { useNavigation, useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useAuth } from '../context/AuthContext';
import { useChild } from '../context/ChildContext';
import { useTTS } from '../hooks/useTTS';
import { TTSInstallPrompt } from '../components/TTSInstallPrompt';
import {
  getActiveAdventure, contributeToStage, tryAdvanceStage,
  getChildrenForParent, type ActiveAdventure,
} from '../services/familyAdventureService';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type RouteParams = RouteProp<RootStackParamList, 'FamilyAdventureDetail'>;

const PILLAR_COLORS: Record<string, [string, string]> = {
  nutrition:  ['#22c55e', '#16a34a'],
  movement:   ['#f97316', '#ea580c'],
  sleep:      ['#8b5cf6', '#7c3aed'],
  confidence: ['#ec4899', '#db2777'],
};

export function FamilyAdventureDetail() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteParams>();
  const { adventureDbId, stageIndex, parentId } = route.params;
  const { user } = useAuth();
  const { activeChild } = useChild();

  const isParentView = !activeChild;
  const { read, showPrompt, setShowPrompt } = useTTS();

  const [active, setActive] = useState<ActiveAdventure | null>(null);
  const [children, setChildren] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [contributing, setContributing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [adv, kids] = await Promise.all([
      getActiveAdventure(parentId),
      getChildrenForParent(parentId),
    ]);
    setActive(adv);
    setChildren(kids);
    setLoading(false);

    // Auto-read stage description when data loads
    if (adv) {
      const stage = adv.adventure.stages[stageIndex];
      if (stage) {
        read(`${stage.title}. ${stage.description}. ${isParentView ? 'Your task: ' + stage.parentTask : 'Your mission: ' + stage.childTask}`);
      }
    }
  }, [parentId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading || !active) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  const stage = active.adventure.stages[stageIndex];
  if (!stage) return null;

  const stageContribs = active.contributions.filter(c => c.stageIndex === stageIndex);
  const parentContrib = stageContribs.find(c => c.contributorType === 'parent');
  const iHaveContributed = isParentView
    ? !!parentContrib
    : stageContribs.some(c => c.contributorId === activeChild?.id);

  const pillarColors = PILLAR_COLORS[stage.pillar] ?? ['#f97316', '#ea580c'];

  const handleContribute = async () => {
    if (iHaveContributed || contributing) return;
    setContributing(true);

    const id   = isParentView ? (user?.id ?? '') : (activeChild?.id ?? '');
    const name = isParentView ? 'Parent' : (activeChild?.name ?? 'Child');
    const type: 'parent' | 'child' = isParentView ? 'parent' : 'child';

    await contributeToStage(adventureDbId, stageIndex, id, type, name);

    // Reload to get updated contributions, then try advancing
    const refreshed = await getActiveAdventure(parentId);
    if (refreshed) {
      const childIds = children.map(c => c.id);
      const result = await tryAdvanceStage(refreshed, childIds);
      if (result === 'complete') {
        Alert.alert('Adventure Complete! 🏆', `Your family finished ${active.adventure.title}! You've all earned the ${active.adventure.completionBadgeName} badge.`);
      } else if (result === 'advanced') {
        Alert.alert('Stage Complete! 🎉', `The whole family did it! Moving to the next stage.`);
      }
    }

    await load();
    setContributing(false);
  };

  return (
    <SafeAreaView style={s.safe}>
      <TTSInstallPrompt visible={showPrompt} onClose={() => setShowPrompt(false)} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <ArrowLeft size={22} color="#374151" />
          </TouchableOpacity>
          <View style={s.headerText}>
            <Text style={s.headerAdventure}>{active.adventure.title}</Text>
            <Text style={s.headerStage}>Stage {stageIndex + 1} of {active.adventure.stages.length}</Text>
          </View>
        </View>

        {/* Stage hero */}
        <LinearGradient colors={pillarColors} style={s.hero}>
          <Text style={s.heroEmoji}>{stage.emoji}</Text>
          <Text style={s.heroTitle}>{stage.title}</Text>
          <Text style={s.heroDesc}>{stage.description}</Text>
          <View style={s.xpBadge}>
            <Zap size={14} color="#fff" />
            <Text style={s.xpBadgeText}>+{stage.xpPerPerson} XP each</Text>
          </View>
        </LinearGradient>

        {/* Parent task */}
        <View style={[s.taskCard, !!parentContrib && s.taskCardDone]}>
          <View style={s.taskHeader}>
            <Text style={s.taskRole}>Parent's mission</Text>
            {parentContrib && <Check size={18} color="#16a34a" />}
          </View>
          <Text style={s.taskText}>{stage.parentTask}</Text>
          {parentContrib && (
            <Text style={s.taskDoneNote}>✓ Done by {parentContrib.contributorName}</Text>
          )}
        </View>

        {/* Children tasks */}
        <View style={s.childrenSection}>
          <View style={s.childrenHeader}>
            <Users size={16} color="#6b7280" />
            <Text style={s.childrenTitle}>Kids' mission</Text>
          </View>
          <Text style={s.childTaskText}>{stage.childTask}</Text>

          <View style={s.childList}>
            {children.map(child => {
              const done = stageContribs.some(c => c.contributorId === child.id);
              return (
                <View key={child.id} style={[s.childRow, done && s.childRowDone]}>
                  <View style={[s.childAvatar, done && s.childAvatarDone]}>
                    <Text style={s.childAvatarText}>{child.name[0]}</Text>
                  </View>
                  <Text style={s.childName}>{child.name}</Text>
                  {done
                    ? <Check size={18} color="#16a34a" />
                    : <Text style={s.childPending}>waiting...</Text>
                  }
                </View>
              );
            })}
          </View>
        </View>

        {/* Contribute button */}
        {stageIndex === active.currentStage && active.status === 'active' && (
          iHaveContributed ? (
            <View style={s.doneBox}>
              <Check size={22} color="#16a34a" />
              <Text style={s.doneText}>You've done your part — waiting for everyone else!</Text>
            </View>
          ) : (
            <TouchableOpacity activeOpacity={0.85} onPress={handleContribute} disabled={contributing}>
              <LinearGradient
                colors={pillarColors}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.contributeBtn}
              >
                {contributing
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={s.contributeBtnText}>
                      {isParentView ? "I've done my part! 🔥" : "I did it! 🙌"}
                    </Text>
                }
              </LinearGradient>
            </TouchableOpacity>
          )
        )}

        {stageIndex < active.currentStage && (
          <View style={s.doneBox}>
            <Check size={22} color="#16a34a" />
            <Text style={s.doneText}>This stage is complete — your family nailed it!</Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20, paddingTop: 12, paddingBottom: 40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' },

  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  headerText: { flex: 1 },
  headerAdventure: { fontSize: 13, color: '#6b7280', fontWeight: '600' },
  headerStage: { fontSize: 20, fontWeight: '800', color: '#111827' },

  hero: { borderRadius: 24, padding: 28, alignItems: 'center', marginBottom: 20 },
  heroEmoji: { fontSize: 64, marginBottom: 12 },
  heroTitle: { fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 8, textAlign: 'center' },
  heroDesc: { fontSize: 15, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  xpBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  xpBadgeText: { fontSize: 14, fontWeight: '800', color: '#fff' },

  taskCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  taskCardDone: { borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  taskRole: { fontSize: 11, fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8 },
  taskText: { fontSize: 16, fontWeight: '700', color: '#111827', lineHeight: 24 },
  taskDoneNote: { fontSize: 12, color: '#16a34a', marginTop: 8, fontWeight: '600' },

  childrenSection: {
    backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  childrenHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  childrenTitle: { fontSize: 11, fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8 },
  childTaskText: { fontSize: 16, fontWeight: '700', color: '#111827', lineHeight: 24, marginBottom: 16 },
  childList: { gap: 10 },
  childRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#f9fafb', borderRadius: 14, padding: 12,
  },
  childRowDone: { backgroundColor: '#f0fdf4' },
  childAvatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center',
  },
  childAvatarDone: { backgroundColor: '#bbf7d0' },
  childAvatarText: { fontSize: 15, fontWeight: '800', color: '#1d4ed8' },
  childName: { flex: 1, fontSize: 15, fontWeight: '700', color: '#111827' },
  childPending: { fontSize: 12, color: '#9ca3af' },

  doneBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#f0fdf4', borderRadius: 18, padding: 20,
    borderWidth: 1.5, borderColor: '#bbf7d0',
  },
  doneText: { flex: 1, fontSize: 15, fontWeight: '700', color: '#16a34a', lineHeight: 22 },

  contributeBtn: { borderRadius: 50, paddingVertical: 20, alignItems: 'center' },
  contributeBtnText: { fontSize: 18, fontWeight: '800', color: '#fff' },
});
