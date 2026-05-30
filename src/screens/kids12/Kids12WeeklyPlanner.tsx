import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Calendar, Check } from 'lucide-react-native';

const activitySuggestions = {
  starter: [
    { id: 'stretch-5', name: '5-min stretch', duration: '5 min' },
    { id: 'walk-10', name: '10-min walk', duration: '10 min' },
    { id: 'dance-song', name: 'Dance to 1 song', duration: '3 min' },
  ],
  building: [
    { id: 'walk-20', name: '20-min walk', duration: '20 min' },
    { id: 'yoga-15', name: '15-min yoga', duration: '15 min' },
    { id: 'dance-15', name: 'Dance session', duration: '15 min' },
  ],
  confident: [
    { id: 'walk-30', name: '30-min walk', duration: '30 min' },
    { id: 'jog-15', name: 'Light jog', duration: '15 min' },
    { id: 'workout-20', name: 'Home workout', duration: '20 min' },
  ],
};

const motivationalQuotes = [
  'Small steps still move you forward.',
  'You\'re doing better than you think.',
  'Progress isn\'t always visible.',
  'Being consistent matters more than being perfect.',
  'You showed up. That\'s what counts.',
  'Rest is part of progress.',
];

type Level = 'starter' | 'building' | 'confident';

export function Kids12WeeklyPlanner() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [level, setLevel] = useState<Level | null>(null);
  const [weekPlan, setWeekPlan] = useState<any[]>([]);
  const [showQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  useEffect(() => {
    storage.getItem('kids12WeeklyPlan').then(saved => {
      if (saved) {
        const plan = JSON.parse(saved);
        setWeekPlan(plan);
      }
    });
    storage.getItem('kids12CurrentLevel').then(v => {
      if (v) setLevel(v as Level);
    });
  }, []);

  const handleLevelSelect = async (selectedLevel: Level) => {
    setLevel(selectedLevel);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const activities = activitySuggestions[selectedLevel];
    const plan = days.map((day, index) => ({
      day,
      activity: activities[index % activities.length],
      completed: false,
      skipped: false,
    }));
    setWeekPlan(plan);
    await storage.setItem('kids12WeeklyPlan', JSON.stringify(plan));
    await storage.setItem('kids12CurrentLevel', selectedLevel);
  };

  const handleToggleComplete = async (index: number) => {
    const updated = [...weekPlan];
    updated[index].completed = !updated[index].completed;
    if (updated[index].completed) updated[index].skipped = false;
    setWeekPlan(updated);
    await storage.setItem('kids12WeeklyPlan', JSON.stringify(updated));
  };

  const handleReschedule = async (index: number) => {
    const updated = [...weekPlan];
    const activity = updated[index].activity;
    for (let i = index + 1; i < updated.length; i++) {
      if (!updated[i].completed) {
        updated[i].activity = activity;
        updated[index].skipped = true;
        break;
      }
    }
    setWeekPlan(updated);
    await storage.setItem('kids12WeeklyPlan', JSON.stringify(updated));
  };

  if (!level || weekPlan.length === 0) {
    return (
      <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.topHeader}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Kids12Today')}
                style={styles.backBtn}
              >
                <ArrowLeft size={22} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Plan your week</Text>
            <Text style={styles.subtitle}>Start small and build up. You can always adjust.</Text>

            <View style={styles.quoteCard}>
              <Text style={styles.quoteText}>"{showQuote}"</Text>
            </View>

            {(['starter', 'building', 'confident'] as Level[]).map((lvl, i) => {
              const levelData = {
                starter: { title: 'Starting out', desc: 'Short, gentle activities (5-10 minutes)' },
                building: { title: 'Building confidence', desc: 'Medium activities (15-20 minutes)' },
                confident: { title: 'Feeling confident', desc: 'Longer activities (20-30 minutes)' },
              }[lvl];
              return (
                <TouchableOpacity
                  key={lvl}
                  activeOpacity={0.85}
                  onPress={() => handleLevelSelect(lvl)}
                  style={styles.levelCard}
                >
                  <Text style={styles.levelTitle}>{levelData.title}</Text>
                  <Text style={styles.levelDesc}>{levelData.desc}</Text>
                  <View style={styles.tagsRow}>
                    {activitySuggestions[lvl].map((activity) => (
                      <View key={activity.id} style={styles.tag}>
                        <Text style={styles.tagText}>{activity.name}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.topHeader}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Kids12Today')}
              style={styles.backBtn}
            >
              <ArrowLeft size={22} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => { setLevel(null); setWeekPlan([]); }}
            >
              <Text style={styles.skipText}>Change plan</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Your week</Text>
          <Text style={styles.subtitle}>You can reschedule anything that doesn't feel right.</Text>

          {weekPlan.map((dayPlan, index) => (
            <View
              key={index}
              style={[
                styles.dayCard,
                dayPlan.completed && styles.dayCardDone,
                dayPlan.skipped && styles.dayCardSkipped,
              ]}
            >
              <View style={styles.dayCardHeader}>
                <View style={styles.dayCardLeft}>
                  <Calendar size={16} color="#9ca3af" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.dayName}>{dayPlan.day}</Text>
                    {!dayPlan.skipped ? (
                      <Text style={styles.dayActivity}>
                        {dayPlan.activity.name} • {dayPlan.activity.duration}
                      </Text>
                    ) : (
                      <Text style={styles.dayRescheduled}>Rescheduled</Text>
                    )}
                  </View>
                </View>
                {dayPlan.completed && <Check size={20} color="#22c55e" />}
              </View>

              {!dayPlan.completed && !dayPlan.skipped && (
                <View style={styles.dayActions}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handleToggleComplete(index)}
                    style={styles.doneBtn}
                  >
                    <LinearGradient
                      colors={['#a855f7', '#22d3ee']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.doneBtnGrad}
                    >
                      <Text style={styles.doneBtnText}>Done</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handleReschedule(index)}
                    style={styles.rescheduleBtn}
                  >
                    <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}

          <Text style={styles.bottomNote}>Life happens. Rescheduling isn't failing.</Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  skipText: { fontSize: 14, color: '#9ca3af' },
  title: { fontSize: 24, fontWeight: '800', color: '#ffffff', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#9ca3af', marginBottom: 20 },
  quoteCard: {
    backgroundColor: 'rgba(168,85,247,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.2)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  quoteText: { fontSize: 14, color: '#9ca3af', fontStyle: 'italic', lineHeight: 22 },
  levelCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  levelTitle: { fontSize: 17, fontWeight: '700', color: '#ffffff', marginBottom: 4 },
  levelDesc: { fontSize: 13, color: '#9ca3af', marginBottom: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: { fontSize: 11, color: '#9ca3af' },
  dayCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dayCardDone: { borderColor: 'rgba(34,197,94,0.3)', backgroundColor: 'rgba(34,197,94,0.05)' },
  dayCardSkipped: { opacity: 0.5 },
  dayCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  dayCardLeft: { flexDirection: 'row', alignItems: 'flex-start' },
  dayName: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
  dayActivity: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  dayRescheduled: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  dayActions: { flexDirection: 'row', gap: 10 },
  doneBtn: { flex: 1 },
  doneBtnGrad: { borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  doneBtnText: { fontSize: 13, fontWeight: '700', color: '#ffffff' },
  rescheduleBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  rescheduleBtnText: { fontSize: 13, fontWeight: '600', color: '#9ca3af' },
  bottomNote: { fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 12 },
});
