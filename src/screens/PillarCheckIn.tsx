import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useChild } from '../context/ChildContext';
import { supabase } from '../lib/supabase';
import { writeWeeklyPillarSnapshot } from '../services/pillarScore';

// ─── Types ────────────────────────────────────────────────────────────────────
type AgeGroup = '6-8' | '8-10' | '10-12';

type CheckInData = {
  // Nutrition
  fruit_days: number;
  veg_days: number;
  sugary_drinks_avoided: number;
  family_meals: number;
  // Movement
  active_days: number;
  sport_sessions: number;
  outdoor_minutes: number;
  // Sleep
  consistent_bedtime: number;
  sleep_hours_avg: number;
  morning_energy: number;
  // Confidence
  mood_avg: number;
  self_confidence: number;
  participation_days: number;
};

const DEFAULT_DATA: CheckInData = {
  fruit_days: 3, veg_days: 3, sugary_drinks_avoided: 4, family_meals: 3,
  active_days: 3, sport_sessions: 2, outdoor_minutes: 60,
  consistent_bedtime: 4, sleep_hours_avg: 8, morning_energy: 3,
  mood_avg: 3, self_confidence: 3, participation_days: 3,
};

// ─── Age-specific question copy ───────────────────────────────────────────────
type Questions = {
  nutrition: { label: string; q: string }[];
  movement:  { label: string; q: string }[];
  sleep:     { label: string; q: string }[];
  confidence:{ label: string; q: string }[];
};

const QUESTIONS: Record<AgeGroup, Questions> = {
  '6-8': {
    nutrition: [
      { label: 'fruit_days',            q: 'How many days did your child eat fruit? 🍎' },
      { label: 'veg_days',              q: 'How many days did they eat vegetables? 🥦' },
      { label: 'sugary_drinks_avoided', q: 'How many days did they avoid sugary drinks? 💧' },
      { label: 'family_meals',          q: 'How many family meals did you eat together? 👨‍👩‍👧' },
    ],
    movement: [
      { label: 'active_days',    q: 'How many days was your child active? 🏃' },
      { label: 'sport_sessions', q: 'How many times did they play sport? ⚽' },
      { label: 'outdoor_minutes', q: 'Roughly how many minutes outside this week? 🌳' },
    ],
    sleep: [
      { label: 'consistent_bedtime', q: 'How many nights was bedtime consistent? 😴' },
      { label: 'sleep_hours_avg',    q: 'About how many hours sleep per night? 🌙' },
      { label: 'morning_energy',     q: 'Morning energy this week (1–5)? ☀️' },
    ],
    confidence: [
      { label: 'mood_avg',            q: 'Overall mood this week (1–5)? 😊' },
      { label: 'self_confidence',     q: 'How confident did they seem (1–5)? 💪' },
      { label: 'participation_days',  q: 'Days they joined in with activities? 🎯' },
    ],
  },
  '8-10': {
    nutrition: [
      { label: 'fruit_days',            q: 'Days you ate fruit this week? 🍎' },
      { label: 'veg_days',              q: 'Days you ate vegetables? 🥦' },
      { label: 'sugary_drinks_avoided', q: 'Days you chose water over sugary drinks? 💧' },
      { label: 'family_meals',          q: 'Family meals this week? 👨‍👩‍👧' },
    ],
    movement: [
      { label: 'active_days',    q: 'How many days did you move or exercise? 🏃' },
      { label: 'sport_sessions', q: 'How many sport sessions this week? ⚽' },
      { label: 'outdoor_minutes', q: 'Minutes spent outside this week? 🌳' },
    ],
    sleep: [
      { label: 'consistent_bedtime', q: 'Nights you went to bed at the same time? 😴' },
      { label: 'sleep_hours_avg',    q: 'Average hours of sleep per night? 🌙' },
      { label: 'morning_energy',     q: 'How energised were your mornings (1–5)? ☀️' },
    ],
    confidence: [
      { label: 'mood_avg',            q: 'Overall mood this week (1–5)? 😊' },
      { label: 'self_confidence',     q: 'How confident did you feel (1–5)? 💪' },
      { label: 'participation_days',  q: 'Days you joined in and gave it a go? 🎯' },
    ],
  },
  '10-12': {
    nutrition: [
      { label: 'fruit_days',            q: 'Days with fruit this week? 🍎' },
      { label: 'veg_days',              q: 'Days with vegetables? 🥦' },
      { label: 'sugary_drinks_avoided', q: 'Days you skipped sugary drinks? 💧' },
      { label: 'family_meals',          q: 'Meals eaten with family? 👨‍👩‍👧' },
    ],
    movement: [
      { label: 'active_days',    q: 'Days you were physically active? 🏃' },
      { label: 'sport_sessions', q: 'Sport or workout sessions? ⚽' },
      { label: 'outdoor_minutes', q: 'Total minutes outside? 🌳' },
    ],
    sleep: [
      { label: 'consistent_bedtime', q: 'Nights with a consistent bedtime? 😴' },
      { label: 'sleep_hours_avg',    q: 'Average hours sleep? 🌙' },
      { label: 'morning_energy',     q: 'Morning energy levels (1–5)? ☀️' },
    ],
    confidence: [
      { label: 'mood_avg',            q: 'Your overall mood this week (1–5)?' },
      { label: 'self_confidence',     q: 'How confident did you feel (1–5)?' },
      { label: 'participation_days',  q: 'Days you pushed yourself or tried something new?' },
    ],
  },
};

const STEPS = [
  { key: 'nutrition',  emoji: '🥕', title: 'Nutrition',  color: ['#22c55e', '#16a34a'] as [string, string] },
  { key: 'movement',   emoji: '⚽', title: 'Movement',   color: ['#f97316', '#ea580c'] as [string, string] },
  { key: 'sleep',      emoji: '😴', title: 'Sleep',      color: ['#8b5cf6', '#7c3aed'] as [string, string] },
  { key: 'confidence', emoji: '🧠', title: 'Confidence', color: ['#ec4899', '#db2777'] as [string, string] },
];

// ─── Stepper component ────────────────────────────────────────────────────────
function Stepper({
  value, min, max, step = 1, onChange, isDark,
}: {
  value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; isDark: boolean;
}) {
  return (
    <View style={s.stepper}>
      <TouchableOpacity
        onPress={() => onChange(Math.max(min, value - step))}
        style={[s.stepBtn, isDark && s.stepBtnDark]}
      >
        <Text style={[s.stepBtnText, isDark && s.stepBtnTextDark]}>−</Text>
      </TouchableOpacity>
      <Text style={[s.stepValue, isDark && s.stepValueDark]}>{value}</Text>
      <TouchableOpacity
        onPress={() => onChange(Math.min(max, value + step))}
        style={[s.stepBtn, isDark && s.stepBtnDark]}
      >
        <Text style={[s.stepBtnText, isDark && s.stepBtnTextDark]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Emoji rating row ─────────────────────────────────────────────────────────
function EmojiRating({
  value, onChange,
}: { value: number; onChange: (v: number) => void }) {
  const emojis = ['😔', '😐', '🙂', '😊', '🤩'];
  return (
    <View style={s.emojiRow}>
      {emojis.map((e, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => onChange(i + 1)}
          style={[s.emojiBtn, value === i + 1 && s.emojiBtnActive]}
        >
          <Text style={s.emojiChar}>{e}</Text>
          {value === i + 1 && <Text style={s.emojiLabel}>{i + 1}</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function PillarCheckIn() {
  const navigation = useNavigation();
  const { activeChild } = useChild();
  const ageGroup = (activeChild?.age_group ?? '6-8') as AgeGroup;
  const isDark = ageGroup === '10-12';

  const [step, setStep] = useState(0);
  const [data, setData] = useState<CheckInData>({ ...DEFAULT_DATA });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const current = STEPS[step];
  const questions = QUESTIONS[ageGroup][current?.key as keyof Questions] ?? [];

  const set = (key: keyof CheckInData, val: number) =>
    setData(prev => ({ ...prev, [key]: val }));

  const isRatingField = (label: string) =>
    ['morning_energy', 'mood_avg', 'self_confidence'].includes(label);

  const isMinutesField = (label: string) => label === 'outdoor_minutes';
  const isHoursField = (label: string) => label === 'sleep_hours_avg';

  const handleSave = async () => {
    if (!activeChild?.id) return;
    setSaving(true);

    const weekStart = getWeekStart();

    await supabase
      .from('pillar_checkins')
      .upsert({ child_id: activeChild.id, week_start: weekStart, ...data },
        { onConflict: 'child_id,week_start' });

    // Recalculate pillar scores with new check-in data
    await writeWeeklyPillarSnapshot(activeChild.id);

    setSaving(false);
    setDone(true);
  };

  const bgColors: [string, string] =
    isDark ? ['#0a0a0f', '#1a0a2e'] : ['#f0fdf4', '#fef9c3'];
  const textColor = isDark ? '#fff' : '#1e3a5f';
  const subColor = isDark ? 'rgba(255,255,255,0.55)' : '#6b7280';

  // ── Done screen ──
  if (done) {
    return (
      <LinearGradient colors={bgColors} style={s.container}>
        <SafeAreaView style={s.safe}>
          <View style={s.doneContent}>
            <Text style={s.doneEmoji}>🎉</Text>
            <Text style={[s.doneTitle, { color: textColor }]}>Check-in complete!</Text>
            <Text style={[s.doneSub, { color: subColor }]}>
              Your World Map has been updated with this week's progress.
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.85}>
              <LinearGradient colors={['#f97316', '#fbbf24']} style={s.doneBtn}>
                <Text style={s.doneBtnText}>See my World Map</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={bgColors} style={s.container}>
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity
              onPress={() => step === 0 ? navigation.goBack() : setStep(step - 1)}
              style={[s.backBtn, isDark && s.backBtnDark]}
            >
              <ArrowLeft size={22} color={isDark ? '#fff' : '#374151'} />
            </TouchableOpacity>
            <Text style={[s.headerTitle, { color: textColor }]}>Weekly Check-in</Text>
            <Text style={[s.headerStep, { color: subColor }]}>{step + 1}/4</Text>
          </View>

          {/* Progress dots */}
          <View style={s.dots}>
            {STEPS.map((st, i) => (
              <View
                key={st.key}
                style={[s.dot, i <= step && s.dotActive]}
              />
            ))}
          </View>

          {/* Step card */}
          <LinearGradient colors={current.color} style={s.stepCard}>
            <Text style={s.stepEmoji}>{current.emoji}</Text>
            <Text style={s.stepTitle}>{current.title}</Text>
          </LinearGradient>

          {/* Questions */}
          <View style={s.questions}>
            {questions.map(({ label, q }) => (
              <View
                key={label}
                style={[s.questionCard, isDark && s.questionCardDark]}
              >
                <Text style={[s.questionText, { color: textColor }]}>{q}</Text>

                {isRatingField(label) ? (
                  <EmojiRating
                    value={data[label as keyof CheckInData] as number}
                    onChange={v => set(label as keyof CheckInData, v)}
                  />
                ) : (
                  <Stepper
                    value={data[label as keyof CheckInData] as number}
                    min={0}
                    max={isMinutesField(label) ? 600 : isHoursField(label) ? 12 : 7}
                    step={isMinutesField(label) ? 15 : isHoursField(label) ? 0.5 : 1}
                    onChange={v => set(label as keyof CheckInData, v)}
                    isDark={isDark}
                  />
                )}
              </View>
            ))}
          </View>

          {/* Next / Save button */}
          {step < 3 ? (
            <TouchableOpacity activeOpacity={0.85} onPress={() => setStep(step + 1)}>
              <LinearGradient
                colors={current.color}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.nextBtn}
              >
                <Text style={s.nextBtnText}>Next</Text>
                <ChevronRight size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity activeOpacity={0.85} onPress={handleSave} disabled={saving}>
              <LinearGradient
                colors={['#22c55e', '#16a34a']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.nextBtn}
              >
                {saving
                  ? <ActivityIndicator color="#fff" />
                  : <>
                      <Check size={20} color="#fff" />
                      <Text style={s.nextBtnText}>Save Check-in</Text>
                    </>
                }
              </LinearGradient>
            </TouchableOpacity>
          )}

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 48 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 20,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  backBtnDark: { backgroundColor: 'rgba(255,255,255,0.1)', shadowOpacity: 0 },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  headerStep: { fontSize: 15, fontWeight: '600' },

  dots: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 20 },
  dot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.15)',
  },
  dotActive: { width: 24, backgroundColor: '#f97316' },

  stepCard: {
    borderRadius: 22, padding: 24, alignItems: 'center',
    marginBottom: 24, flexDirection: 'row', gap: 16,
  },
  stepEmoji: { fontSize: 48 },
  stepTitle: { fontSize: 26, fontWeight: '800', color: '#fff' },

  questions: { gap: 16, marginBottom: 28 },
  questionCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  questionCardDark: { backgroundColor: 'rgba(255,255,255,0.07)' },
  questionText: { fontSize: 15, fontWeight: '600', marginBottom: 16, lineHeight: 22 },

  // Stepper
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  stepBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#f3f4f6',
    alignItems: 'center', justifyContent: 'center',
  },
  stepBtnDark: { backgroundColor: 'rgba(255,255,255,0.15)' },
  stepBtnText: { fontSize: 24, fontWeight: '700', color: '#374151', lineHeight: 28 },
  stepBtnTextDark: { color: '#fff' },
  stepValue: { fontSize: 32, fontWeight: '800', color: '#111827', minWidth: 56, textAlign: 'center' },
  stepValueDark: { color: '#fff' },

  // Emoji rating
  emojiRow: { flexDirection: 'row', justifyContent: 'space-between' },
  emojiBtn: { alignItems: 'center', padding: 8, borderRadius: 12 },
  emojiBtnActive: { backgroundColor: 'rgba(249,115,22,0.15)' },
  emojiChar: { fontSize: 32 },
  emojiLabel: { fontSize: 11, fontWeight: '700', color: '#f97316', marginTop: 2 },

  // Buttons
  nextBtn: {
    borderRadius: 50, paddingVertical: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  nextBtnText: { fontSize: 17, fontWeight: '800', color: '#fff' },

  // Done
  doneContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  doneEmoji: { fontSize: 80, marginBottom: 16 },
  doneTitle: { fontSize: 28, fontWeight: '800', marginBottom: 10, textAlign: 'center' },
  doneSub: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 36 },
  doneBtn: {
    borderRadius: 50, paddingVertical: 18, paddingHorizontal: 40,
    alignItems: 'center',
  },
  doneBtnText: { fontSize: 17, fontWeight: '800', color: '#fff' },
});
