import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useChild } from '../../context/ChildContext';
import { recordMissionComplete } from '../../services/streakService';
import {
  loadFamilyProfile,
  type FamilyProfile,
} from '../../data/familyProfile';
import {
  selectDailyMovementQuest,
  type MovementQuest,
} from '../../data/movementQuests';
import { kids12Theme as T } from './kids12Theme';

// ============================================================
// Kids12Challenge — the actual "Today's Challenge" for 10–12.
//
// The Today screen's challenge card now opens THIS screen (previously it went
// to the generic movement picker with no way to complete the specific quest).
// Shows the real daily Movement Quest, lets the child complete it once per day,
// and records it (streak + XP + parent Progress via recordMissionComplete).
// ============================================================

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function Kids12Challenge() {
  const navigation = useNavigation<Nav>();
  const { activeChild, refreshChild } = useChild();
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    loadFamilyProfile().then(setProfile);
    storage.getItem('kids12ChallengeCompletedDate').then(v => {
      setAlreadyDone(v === new Date().toDateString());
    });
  }, []);

  const quest: MovementQuest = selectDailyMovementQuest('10-12', profile);

  const handleComplete = async () => {
    if (alreadyDone) return;
    const today = new Date().toDateString();
    await storage.setItem('kids12ChallengeCompletedDate', today);
    setAlreadyDone(true);
    setJustCompleted(true);
    // Persist so the streak AND the parent Progress tab update (Phase A.3).
    if (activeChild?.id) {
      await recordMissionComplete(
        activeChild.id,
        'movement',
        quest.xp,
        `${quest.title} complete`,
      );
      await refreshChild();
    }
  };

  // Completion state.
  if (justCompleted || alreadyDone) {
    return (
      <LinearGradient
        colors={['#0B0B14', '#1A1430', '#0B0B14']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safe}>
          <View style={styles.centerContent}>
            <View style={styles.checkOrb}>
              <Check size={56} color={T.accent} />
            </View>
            <Text style={styles.doneTitle}>Challenge complete.</Text>
            <Text style={styles.doneSub}>
              {justCompleted
                ? `+${quest.xp} XP banked. You showed up for yourself today.`
                : 'You already crushed today’s challenge. Back tomorrow for the next one.'}
            </Text>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Kids12Today')}
              style={{ width: '100%' }}
            >
              <LinearGradient
                colors={['#7C3AED', '#22D3EE']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btn}
              >
                <Text style={styles.btnText}>Back to today</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0B0B14', '#1A1430', '#0B0B14']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <ArrowLeft size={22} color={T.muted} />
          </TouchableOpacity>

          <Text style={styles.kicker}>TODAY’S CHALLENGE</Text>
          <View style={styles.heroRow}>
            <Text style={styles.questEmoji}>{quest.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.questTitle}>{quest.title}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaPill}>⏱ {quest.durationMin} min</Text>
                <Text style={styles.metaPillGold}>+{quest.xp} XP</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>THE CHALLENGE</Text>
            <Text style={styles.cardText}>{quest.challenge}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>KIT</Text>
            <Text style={styles.cardText}>{quest.equipment}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>BUILDS</Text>
            <Text style={styles.cardText}>{quest.skills.join(', ')}</Text>
          </View>

          {quest.upgrade ? (
            <View style={styles.upgradeCard}>
              <Text style={styles.upgradeText}>
                ⤴ Level up: {quest.upgrade}
              </Text>
            </View>
          ) : null}

          <View style={styles.whyCard}>
            <Text style={styles.whyLabel}>WHY IT MATTERS</Text>
            <Text style={styles.whyText}>{quest.whyMatters}</Text>
          </View>

          <TouchableOpacity activeOpacity={0.9} onPress={handleComplete}>
            <LinearGradient
              colors={['#7C3AED', '#22D3EE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.completeBtn}
            >
              <Check size={20} color="#fff" />
              <Text style={styles.completeText}>Mark as complete</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.note}>You’re in control. Do it your way.</Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 4,
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 20,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '800',
    color: T.primary,
    letterSpacing: 2,
    marginBottom: 10,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  questEmoji: { fontSize: 56 },
  questTitle: { fontSize: 24, fontWeight: '900', color: '#fff' },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  metaPill: {
    fontSize: 12,
    fontWeight: '700',
    color: T.accent,
    backgroundColor: 'rgba(34,211,238,0.12)',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 5,
    overflow: 'hidden',
  },
  metaPillGold: {
    fontSize: 12,
    fontWeight: '800',
    color: T.gold,
    backgroundColor: 'rgba(252,211,77,0.12)',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 5,
    overflow: 'hidden',
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: T.primary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  cardText: { fontSize: 15, color: '#E5E7EB', lineHeight: 21 },

  upgradeCard: {
    backgroundColor: 'rgba(252,211,77,0.1)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.3)',
  },
  upgradeText: { fontSize: 14, color: T.gold, lineHeight: 20 },

  whyCard: {
    backgroundColor: 'rgba(34,211,238,0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.25)',
  },
  whyLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: T.accent,
    letterSpacing: 1,
    marginBottom: 6,
  },
  whyText: { fontSize: 14, color: '#CFFAFE', lineHeight: 20 },

  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 50,
    paddingVertical: 18,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  completeText: { fontSize: 17, fontWeight: '800', color: '#fff' },
  note: { fontSize: 12, color: T.mutedDim, textAlign: 'center', marginTop: 14 },

  checkOrb: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(34,211,238,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(34,211,238,0.4)',
    marginBottom: 24,
  },
  doneTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
  },
  doneSub: {
    fontSize: 15,
    color: T.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 28,
  },
  btn: { borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  btnText: { fontSize: 17, fontWeight: '800', color: '#fff' },
});
