import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, ChevronRight, Check, Lightbulb, Calendar, Star } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import {
  BARRIERS, resolveBarrier,
  type Barrier, type BarrierResponse,
} from '../data/barrierSolverData';
import type { Pillar } from '../services/syncService';

type RouteParams = RouteProp<RootStackParamList, 'BarrierSolver'>;

const PILLAR_CONFIG: Record<Pillar, { emoji: string; label: string; colors: [string, string] }> = {
  nutrition:  { emoji: '🥕', label: 'Nutrition',  colors: ['#22c55e', '#16a34a'] },
  movement:   { emoji: '⚽', label: 'Movement',   colors: ['#f97316', '#ea580c'] },
  sleep:      { emoji: '😴', label: 'Sleep',      colors: ['#8b5cf6', '#7c3aed'] },
  confidence: { emoji: '🧠', label: 'Confidence', colors: ['#ec4899', '#db2777'] },
};

export function BarrierSolver() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const { childName, pillar } = route.params;

  const [selectedBarrier, setSelectedBarrier] = useState<Barrier | null>(null);
  const [response, setResponse] = useState<BarrierResponse | null>(null);

  const pillarCfg = PILLAR_CONFIG[pillar];

  const handleSelectBarrier = (barrier: Barrier) => {
    setSelectedBarrier(barrier);
    setResponse(resolveBarrier(barrier, pillar));
  };

  const handleReset = () => {
    setSelectedBarrier(null);
    setResponse(null);
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.screen} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <ArrowLeft size={22} color="#374151" />
          </TouchableOpacity>
          <View style={s.headerText}>
            <Text style={s.title}>Barrier Solver</Text>
            <Text style={s.subtitle}>Let's find a way forward</Text>
          </View>
        </View>

        {/* Context card */}
        <LinearGradient colors={pillarCfg.colors} style={s.contextCard}>
          <Text style={s.contextEmoji}>{pillarCfg.emoji}</Text>
          <View style={s.contextText}>
            <Text style={s.contextTitle}>{childName} missed today's mission</Text>
            <Text style={s.contextSub}>{pillarCfg.label} · What got in the way?</Text>
          </View>
        </LinearGradient>

        {!response ? (
          <>
            <Text style={s.questionLabel}>What stopped today's quest?</Text>
            <View style={s.barrierList}>
              {BARRIERS.map(barrier => (
                <TouchableOpacity
                  key={barrier.id}
                  style={[
                    s.barrierBtn,
                    selectedBarrier === barrier.id && s.barrierBtnActive,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleSelectBarrier(barrier.id)}
                >
                  <Text style={s.barrierEmoji}>{barrier.emoji}</Text>
                  <Text style={[
                    s.barrierLabel,
                    selectedBarrier === barrier.id && s.barrierLabelActive,
                  ]}>
                    {barrier.label}
                  </Text>
                  <ChevronRight size={16} color={selectedBarrier === barrier.id ? '#fff' : '#9ca3af'} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            {/* Selected barrier chip */}
            <View style={s.selectedChip}>
              <Text style={s.selectedChipText}>
                {BARRIERS.find(b => b.id === selectedBarrier)?.emoji}{' '}
                {BARRIERS.find(b => b.id === selectedBarrier)?.label}
              </Text>
              <TouchableOpacity onPress={handleReset}>
                <Text style={s.changeText}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* Empathy */}
            <View style={s.empathyCard}>
              <Text style={s.empathyText}>{response.empathy}</Text>
            </View>

            {/* Alternative — right now */}
            <View style={s.responseCard}>
              <View style={s.responseHeader}>
                <View style={[s.responseIcon, { backgroundColor: '#fff7ed' }]}>
                  <Lightbulb size={18} color="#f97316" />
                </View>
                <Text style={s.responseTitle}>Right now</Text>
              </View>
              <Text style={s.responseBody}>{response.alternative}</Text>
            </View>

            {/* Tomorrow strategy */}
            <View style={s.responseCard}>
              <View style={s.responseHeader}>
                <View style={[s.responseIcon, { backgroundColor: '#eff6ff' }]}>
                  <Calendar size={18} color="#3b82f6" />
                </View>
                <Text style={s.responseTitle}>Tomorrow's strategy</Text>
              </View>
              <Text style={s.responseBody}>{response.tomorrowStrategy}</Text>
            </View>

            {/* Parent tip */}
            <View style={s.responseCard}>
              <View style={s.responseHeader}>
                <View style={[s.responseIcon, { backgroundColor: '#fdf4ff' }]}>
                  <Star size={18} color="#a855f7" />
                </View>
                <Text style={s.responseTitle}>Parent tip</Text>
              </View>
              <Text style={s.responseBody}>{response.parentTip}</Text>
            </View>

            {/* Done button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.goBack()}
            >
              <LinearGradient
                colors={['#1e3a5f', '#3b82f6']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.doneBtn}
              >
                <Check size={18} color="#fff" />
                <Text style={s.doneBtnText}>Got it — thanks</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Try another */}
            <TouchableOpacity style={s.tryAnotherBtn} onPress={handleReset}>
              <Text style={s.tryAnotherText}>Try a different reason</Text>
            </TouchableOpacity>
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

  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  headerText: { flex: 1 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 1 },

  contextCard: {
    borderRadius: 20, padding: 18, flexDirection: 'row',
    alignItems: 'center', gap: 14, marginBottom: 24,
  },
  contextEmoji: { fontSize: 40 },
  contextText: { flex: 1 },
  contextTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  contextSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  questionLabel: {
    fontSize: 17, fontWeight: '800', color: '#111827', marginBottom: 14,
  },

  barrierList: { gap: 10 },
  barrierBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderRadius: 16, padding: 18,
    borderWidth: 1.5, borderColor: '#e5e7eb',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  barrierBtnActive: { backgroundColor: '#1e3a5f', borderColor: '#1e3a5f' },
  barrierEmoji: { fontSize: 26 },
  barrierLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: '#374151' },
  barrierLabelActive: { color: '#fff' },

  selectedChip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#f3f4f6', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16,
  },
  selectedChipText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  changeText: { fontSize: 13, fontWeight: '600', color: '#3b82f6' },

  empathyCard: {
    backgroundColor: '#f0fdf4', borderRadius: 16, padding: 18,
    borderLeftWidth: 4, borderLeftColor: '#22c55e', marginBottom: 12,
  },
  empathyText: { fontSize: 15, color: '#166534', lineHeight: 22, fontWeight: '500' },

  responseCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  responseHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  responseIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  responseTitle: { fontSize: 14, fontWeight: '800', color: '#111827' },
  responseBody: { fontSize: 14, color: '#374151', lineHeight: 22 },

  doneBtn: {
    borderRadius: 50, paddingVertical: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8,
  },
  doneBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  tryAnotherBtn: { alignItems: 'center', paddingVertical: 16 },
  tryAnotherText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
});
