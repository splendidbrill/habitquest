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
import { ArrowLeft } from 'lucide-react-native';
import {
  loadFamilyProfile,
  type FamilyProfile,
} from '../../data/familyProfile';
import {
  selectDailyMovementQuest,
  type MovementQuest,
} from '../../data/movementQuests';
import { kids8Theme as T, KIDS8_GRADIENTS } from './kids8Theme';

export function Kids8DailyMission() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [started, setStarted] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  useEffect(() => {
    loadFamilyProfile().then(setProfile);
    // Mission counts as done only if completed TODAY, so it re-opens tomorrow.
    storage.getItem('kids8MissionCompletedDate').then(v => {
      setAlreadyDone(v === new Date().toDateString());
    });
  }, []);

  // The SAME daily Movement Quest the home hub shows for this age band, so the
  // "Today's Adventure" card and this screen always agree (C.2).
  const quest: MovementQuest = selectDailyMovementQuest('8-10', profile);

  const handleComplete = async () => {
    if (alreadyDone) return;
    const completed = await storage.getItem('kids8CompletedMissions');
    await storage.setItem(
      'kids8CompletedMissions',
      String(parseInt(completed || '0') + 1),
    );
    await storage.setItem('kids8LastUnlock', `${quest.title} complete`);
    // Mark done for today so the card + this screen lock until tomorrow.
    await storage.setItem('kids8MissionCompletedDate', new Date().toDateString());
    setAlreadyDone(true);
    // Kids8SuccessCelebration updates the streak + parent Progress (Phase A.3).
    navigation.navigate('Kids8SuccessCelebration');
  };

  return (
    <LinearGradient colors={KIDS8_GRADIENTS.buddy} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Kids8TrainingDashboard')}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topSection}>
            <Text style={styles.missionEmoji}>{quest.emoji}</Text>
            <Text style={styles.missionLabel}>Today's Adventure</Text>
          </View>

          <View style={styles.missionCard}>
            <Text style={styles.missionTitle}>{quest.title}</Text>
            <View style={styles.themeRow}>
              <Text style={styles.themePill}>🎬 {quest.theme}</Text>
              <Text style={styles.timeBadge}>⏱️ {quest.durationMin} min</Text>
              <Text style={styles.xpBadge}>+{quest.xp} XP</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>The Challenge</Text>
              <Text style={styles.infoText}>{quest.challenge}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>🎒 Kit: </Text>
              <Text style={styles.metaValue}>{quest.equipment}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>💪 Builds: </Text>
              <Text style={styles.metaValue}>{quest.skills.join(', ')}</Text>
            </View>

            {quest.upgrade ? (
              <View style={styles.upgradeBox}>
                <Text style={styles.upgradeText}>
                  ⤴ Level up: {quest.upgrade}
                </Text>
              </View>
            ) : null}

            <View style={styles.tipBox}>
              <Text style={{ fontSize: 18 }}>💡</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.tipLabel}>Why it matters</Text>
                <Text style={styles.tipText}>{quest.whyMatters}</Text>
              </View>
            </View>

            {alreadyDone ? (
              <View style={[styles.actionBtn, styles.doneBtn]}>
                <Text style={styles.actionBtnText}>✅ Done for the day!</Text>
              </View>
            ) : !started ? (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setStarted(true)}
              >
                <LinearGradient
                  colors={KIDS8_GRADIENTS.cta}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionBtn}
                >
                  <Text style={styles.actionBtnText}>Start Adventure! 🚀</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity activeOpacity={0.85} onPress={handleComplete}>
                <LinearGradient
                  colors={[T.nutrition, '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionBtn}
                >
                  <Text style={styles.actionBtnText}>I Did It! ✅</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.encouragement}>
            {alreadyDone
              ? 'You already smashed today’s adventure — see you tomorrow! 🌟'
              : started
              ? 'Amazing effort — you’re getting stronger! 🔥'
              : 'Every adventure makes you stronger! 💪'}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingTop: 80, paddingHorizontal: 24, paddingBottom: 40 },
  topSection: { alignItems: 'center', marginBottom: 20 },
  missionEmoji: { fontSize: 64, marginBottom: 8 },
  missionLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.95)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  missionCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  missionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: T.purple900,
    textAlign: 'center',
    marginBottom: 12,
  },
  themeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  themePill: {
    fontSize: 12,
    fontWeight: '700',
    color: T.purple700,
    backgroundColor: T.muted,
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 5,
    overflow: 'hidden',
  },
  timeBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: T.activity,
    backgroundColor: '#DBEAFE',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 5,
    overflow: 'hidden',
  },
  xpBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    backgroundColor: T.accent,
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 5,
    overflow: 'hidden',
  },
  infoBox: {
    backgroundColor: T.muted,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: T.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  infoText: { fontSize: 14, color: T.foreground, lineHeight: 20 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  metaLabel: { fontSize: 13, fontWeight: '700', color: T.purple700 },
  metaValue: { fontSize: 13, color: T.foreground, flex: 1 },
  upgradeBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  upgradeText: { fontSize: 13, color: '#92400E', lineHeight: 18 },
  tipBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  tipLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: T.nutrition,
    marginBottom: 2,
  },
  tipText: { fontSize: 13, color: '#065F46', lineHeight: 18 },
  actionBtn: {
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  doneBtn: { backgroundColor: '#9CA3AF' },
  encouragement: {
    textAlign: 'center',
    fontSize: 15,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '600',
  },
});
