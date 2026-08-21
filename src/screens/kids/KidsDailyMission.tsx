import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import {
  movementQuests,
  selectDailyMovementQuest,
} from '../../data/movementQuests';

// Fixed hero gradient — the mission content now comes from the shared Movement
// Quest (the SAME one the home card shows), so it no longer carries its own
// per-mission colours.
const CARD_COLORS: [string, string] = ['#fb923c', '#ef4444'];

export function KidsDailyMission() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'KidsDailyMission'>>();
  // Show exactly the quest the home card was showing (passed by id). Falls back
  // to the deterministic daily pick if opened without one.
  const questId = route.params?.questId;
  const quest =
    (questId ? movementQuests.find(q => q.id === questId) : undefined) ??
    selectDailyMovementQuest('6-8', null);
  const [missionStarted, setMissionStarted] = useState(false);

  const handleComplete = async () => {
    // Store the completion DATE (not a sticky boolean) so the home screen only
    // shows "come back tomorrow" for the rest of today and offers a fresh
    // mission tomorrow — fixes the day-2+ dead end (§3.3.4).
    await storage.setItem(
      'kidsMissionCompletedDate',
      new Date().toDateString(),
    );
    const adventures = parseInt(
      (await storage.getItem('kidsAdventuresCompleted')) ?? '0',
    );
    await storage.setItem('kidsAdventuresCompleted', String(adventures + 1));
    navigation.navigate('KidsSuccessCelebration', {
      missionId: quest.id,
      missionTitle: quest.title,
      tags: quest.tags,
    });
  };

  return (
    <LinearGradient
      colors={['#bae6fd', '#ede9fe', '#fce7f3']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerEmoji}>🐯</Text>
          </View>

          {!missionStarted ? (
            <>
              <Text style={styles.title}>Today's Mission! 🎯</Text>

              <LinearGradient colors={CARD_COLORS} style={styles.missionCard}>
                <Text style={styles.missionEmoji}>{quest.emoji}</Text>
                <Text style={styles.missionTitle}>{quest.title}</Text>
                <Text style={styles.missionDesc}>{quest.challenge}</Text>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>
                    ⏰ {quest.durationMin} minutes
                  </Text>
                </View>
              </LinearGradient>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setMissionStarted(true)}
              >
                <LinearGradient
                  colors={['#4ade80', '#10b981', '#0d9488']}
                  style={styles.actionBtn}
                >
                  <Text style={styles.actionBtnText}>Start Mission! 🚀</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.inProgress}>
              <Text style={styles.buddyEmoji}>🐯</Text>
              <Text style={styles.missionEmoji2}>{quest.emoji}</Text>
              <Text style={styles.inProgressTitle}>You're Doing Great! 🌟</Text>
              <Text style={styles.inProgressDesc}>
                Have fun! When you're done, tap below!
              </Text>

              <TouchableOpacity activeOpacity={0.85} onPress={handleComplete}>
                <LinearGradient
                  colors={['#c084fc', '#ec4899', '#fb7185']}
                  style={styles.actionBtn}
                >
                  <Text style={styles.actionBtnText}>I'm Done! 🎉</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 20,
  },
  backBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerEmoji: { fontSize: 52 },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  missionCard: {
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  missionEmoji: { fontSize: 80, marginBottom: 16, textAlign: 'center' },
  missionEmoji2: { fontSize: 80, marginBottom: 20, textAlign: 'center' },
  missionTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  missionDesc: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 28,
  },
  durationBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  durationText: { fontSize: 18, color: '#fff', fontWeight: '700' },
  actionBtn: {
    borderRadius: 50,
    paddingVertical: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 20,
  },
  actionBtnText: { fontSize: 28, fontWeight: '800', color: '#fff' },
  inProgress: { alignItems: 'center', paddingTop: 20 },
  buddyEmoji: { fontSize: 96, marginBottom: 16, textAlign: 'center' },
  inProgressTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  inProgressDesc: {
    fontSize: 22,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 32,
  },
});
