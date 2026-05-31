import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  SafeAreaView, ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Lock, CheckCircle, Play, Trophy } from 'lucide-react-native';
import { useNavigation, useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useAuth } from '../context/AuthContext';
import { useChild } from '../context/ChildContext';
import {
  getActiveAdventure, startAdventure, getChildParentId,
  getChildrenForParent, type ActiveAdventure,
} from '../services/familyAdventureService';
import catalog from '../data/adventureCatalog';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type RouteParams = RouteProp<RootStackParamList, 'FamilyAdventureMap'>;

export function FamilyAdventureMap() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteParams>();
  const { user } = useAuth();
  const { activeChild } = useChild();

  const [parentId, setParentId] = useState<string | null>(route.params?.parentId ?? null);
  const [active, setActive] = useState<ActiveAdventure | null>(null);
  const [children, setChildren] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);

  const isParentView = !activeChild;

  const load = useCallback(async () => {
    setLoading(true);
    let pid = parentId;

    if (!pid) {
      if (isParentView && user?.id) {
        pid = user.id;
      } else if (activeChild?.id) {
        pid = await getChildParentId(activeChild.id);
      }
      if (pid) setParentId(pid);
    }

    if (!pid) { setLoading(false); return; }

    const [adv, kids] = await Promise.all([
      getActiveAdventure(pid),
      getChildrenForParent(pid),
    ]);
    setActive(adv);
    setChildren(kids);
    setLoading(false);
  }, [parentId, isParentView, user?.id, activeChild?.id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleStart = async (adventureId: string) => {
    if (!parentId) return;
    setStarting(adventureId);
    await startAdventure(parentId, adventureId);
    await load();
    setStarting(null);
  };

  const handleStagePress = (stageIndex: number) => {
    if (!active || !parentId) return;
    if (stageIndex > active.currentStage) return;
    navigation.navigate('FamilyAdventureDetail', {
      adventureDbId: active.dbId,
      stageIndex,
      parentId,
    });
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
          <View style={s.headerText}>
            <Text style={s.title}>Family Adventures</Text>
            <Text style={s.subtitle}>
              {active ? active.adventure.title : 'Choose your next quest'}
            </Text>
          </View>
        </View>

        {active ? (
          <>
            {/* Adventure banner */}
            <LinearGradient colors={active.adventure.colors} style={s.banner}>
              <Text style={s.bannerEmoji}>{active.adventure.emoji}</Text>
              <View style={s.bannerText}>
                <Text style={s.bannerTitle}>{active.adventure.title}</Text>
                <Text style={s.bannerSub}>{active.adventure.tagline}</Text>
              </View>
              <View style={s.bannerProgress}>
                <Text style={s.bannerProgressText}>
                  {active.status === 'complete'
                    ? '✓ Complete!'
                    : `Stage ${active.currentStage + 1} of ${active.adventure.stages.length}`}
                </Text>
              </View>
            </LinearGradient>

            {/* Stage path */}
            <View style={s.path}>
              {active.adventure.stages.map((stage, i) => {
                const isComplete = i < active.currentStage || active.status === 'complete';
                const isCurrent = i === active.currentStage && active.status === 'active';
                const isLocked  = i > active.currentStage && active.status === 'active';

                const stageContribs = active.contributions.filter(c => c.stageIndex === i);
                const parentDone = stageContribs.some(c => c.contributorType === 'parent');
                const myChildDone = activeChild
                  ? stageContribs.some(c => c.contributorId === activeChild.id)
                  : false;

                return (
                  <View key={i} style={s.stageRow}>
                    {/* Connector line */}
                    {i < active.adventure.stages.length - 1 && (
                      <View style={[s.connector, isComplete && s.connectorDone]} />
                    )}

                    {/* Node */}
                    <TouchableOpacity
                      activeOpacity={isLocked ? 1 : 0.85}
                      onPress={() => handleStagePress(i)}
                      style={[
                        s.stageCard,
                        isCurrent && s.stageCardCurrent,
                        isComplete && s.stageCardDone,
                        isLocked && s.stageCardLocked,
                      ]}
                    >
                      <View style={[s.stageIcon, isCurrent && s.stageIconCurrent, isComplete && s.stageIconDone]}>
                        {isComplete
                          ? <CheckCircle size={22} color="#fff" />
                          : isLocked
                          ? <Lock size={18} color="#d1d5db" />
                          : <Text style={s.stageEmojiText}>{stage.emoji}</Text>
                        }
                      </View>

                      <View style={s.stageInfo}>
                        <Text style={[s.stageName, isLocked && s.stageNameLocked]}>{stage.title}</Text>
                        <Text style={[s.stageDesc, isLocked && s.stageDescLocked]} numberOfLines={1}>
                          {isLocked ? 'Complete previous stages first' : stage.description}
                        </Text>
                        {!isLocked && !isComplete && (
                          <View style={s.stageProgress}>
                            {isParentView
                              ? <Text style={s.stageProgressText}>{parentDone ? '✓ You contributed' : '→ Your turn'}</Text>
                              : <Text style={s.stageProgressText}>{myChildDone ? '✓ You contributed' : '→ Your turn'}</Text>
                            }
                            <Text style={s.stageXP}>+{stage.xpPerPerson} XP each</Text>
                          </View>
                        )}
                        {isComplete && (
                          <Text style={s.stageDoneText}>✓ Stage complete — {stage.xpPerPerson} XP earned</Text>
                        )}
                      </View>

                      {isCurrent && (
                        <Play size={18} color="#f97316" />
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>

            {/* Completion reward */}
            {active.status === 'complete' && (
              <View style={s.completionCard}>
                <Trophy size={36} color="#f59e0b" />
                <Text style={s.completionTitle}>Adventure Complete! 🎉</Text>
                <Text style={s.completionSub}>
                  Your family earned the {active.adventure.completionBadgeName} badge together.
                </Text>
              </View>
            )}

            {/* Change adventure (parent only) */}
            {isParentView && (
              <TouchableOpacity style={s.changeBtn} onPress={() => setActive(null)}>
                <Text style={s.changeBtnText}>Start a different adventure</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            {/* Adventure picker */}
            <Text style={s.pickLabel}>Choose your family's next adventure</Text>
            {catalog.map(adv => (
              <TouchableOpacity
                key={adv.id}
                activeOpacity={0.85}
                onPress={() => isParentView && handleStart(adv.id)}
                style={s.adventureCard}
              >
                <LinearGradient colors={adv.colors} style={s.adventureCardGrad}>
                  <Text style={s.adventureEmoji}>{adv.emoji}</Text>
                  <View style={s.adventureInfo}>
                    <Text style={s.adventureName}>{adv.title}</Text>
                    <Text style={s.adventureTagline}>{adv.tagline}</Text>
                    <View style={s.adventureMeta}>
                      <Text style={s.adventureMetaText}>{adv.stages.length} stages</Text>
                      <Text style={s.adventureMetaText}>·</Text>
                      <Text style={s.adventureMetaText}>~{adv.durationDays} days</Text>
                      <Text style={s.adventureMetaText}>·</Text>
                      <Text style={s.adventureMetaText}>
                        {adv.stages.reduce((s, st) => s + st.xpPerPerson, 0)} XP total
                      </Text>
                    </View>
                  </View>
                  {starting === adv.id
                    ? <ActivityIndicator color="#fff" />
                    : isParentView
                    ? <Play size={22} color="rgba(255,255,255,0.8)" />
                    : null
                  }
                </LinearGradient>
              </TouchableOpacity>
            ))}

            {!isParentView && (
              <Text style={s.waitNote}>Ask a parent to start your family's adventure!</Text>
            )}
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  screen: { flex: 1 },
  content: { padding: 20, paddingTop: 12, paddingBottom: 40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' },

  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  headerText: { flex: 1 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 2 },

  banner: {
    borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center',
    gap: 14, marginBottom: 24,
  },
  bannerEmoji: { fontSize: 44 },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  bannerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  bannerProgress: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  bannerProgressText: { fontSize: 12, fontWeight: '700', color: '#fff' },

  path: { gap: 0 },
  stageRow: { position: 'relative' },
  connector: {
    position: 'absolute', left: 22, top: 80, width: 2, height: 24,
    backgroundColor: '#e5e7eb', zIndex: 0,
  },
  connectorDone: { backgroundColor: '#22c55e' },

  stageCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  stageCardCurrent: { borderColor: '#f97316', backgroundColor: '#fffbf5' },
  stageCardDone:    { borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' },
  stageCardLocked:  { opacity: 0.55 },

  stageIcon: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center',
  },
  stageIconCurrent: { backgroundColor: '#fff7ed' },
  stageIconDone:    { backgroundColor: '#22c55e' },
  stageEmojiText: { fontSize: 24 },

  stageInfo: { flex: 1 },
  stageName: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 2 },
  stageNameLocked: { color: '#9ca3af' },
  stageDesc: { fontSize: 12, color: '#6b7280', lineHeight: 17, marginBottom: 6 },
  stageDescLocked: { color: '#d1d5db' },
  stageProgress: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stageProgressText: { fontSize: 12, fontWeight: '600', color: '#f97316' },
  stageXP: { fontSize: 12, fontWeight: '700', color: '#6b7280' },
  stageDoneText: { fontSize: 12, color: '#16a34a', fontWeight: '600' },

  completionCard: {
    backgroundColor: '#fffbeb', borderRadius: 20, padding: 24,
    alignItems: 'center', marginTop: 8, marginBottom: 16,
    borderWidth: 1.5, borderColor: '#fde68a',
  },
  completionTitle: { fontSize: 22, fontWeight: '900', color: '#92400e', marginTop: 12, marginBottom: 6 },
  completionSub: { fontSize: 14, color: '#b45309', textAlign: 'center', lineHeight: 20 },

  changeBtn: { alignItems: 'center', paddingVertical: 16 },
  changeBtnText: { fontSize: 14, color: '#9ca3af', fontWeight: '600' },

  pickLabel: { fontSize: 14, fontWeight: '700', color: '#6b7280', marginBottom: 14, letterSpacing: 0.3 },
  adventureCard: { marginBottom: 14, borderRadius: 20, overflow: 'hidden' },
  adventureCardGrad: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20 },
  adventureEmoji: { fontSize: 44 },
  adventureInfo: { flex: 1 },
  adventureName: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 3 },
  adventureTagline: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  adventureMeta: { flexDirection: 'row', gap: 6 },
  adventureMetaText: { fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: '600' },

  waitNote: { textAlign: 'center', fontSize: 14, color: '#9ca3af', marginTop: 8 },
});
