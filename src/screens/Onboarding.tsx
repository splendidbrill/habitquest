import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart, ArrowRight } from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { storage } from '../utils/storage';
import { mapAnswersToProfile, syncFamilyProfile } from '../data/familyProfile';
import { colors, typography, radius, withOpacity } from '../theme';
import type { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface SliderConfig {
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
}

interface Question {
  id: number;
  section?: string;
  question: string;
  subtitle: string;
  options?: string[];
  multiSelect?: boolean;
  inputType?: 'text' | 'textarea' | 'slider';
  // Layer 1 = the ~10-screen 60-second core shown during initial onboarding.
  // Layer 2 = deeper questions surfaced later via progressive profiling (Phase 6/8).
  // Defaults to 1 when omitted.
  layer?: 1 | 2;
  slider?: SliderConfig;
}

// Questions are stored in a single array but split into two layers:
//   Layer 1 — the ~60-second core, shown during initial onboarding.
//   Layer 2 — deeper questions defined here but surfaced later by
//             progressive profiling (Phase 6/8); filtered out of the
//             initial flow by layer1Questions below.
// IDs are intentionally NON-CONTIGUOUS and must stay stable — the
// canonical mapping lives in src/data/familyProfile.ts (ONBOARDING_IDS).
const questions: Question[] = [
  // ── Layer 1 (60-second core) ──────────────────────────────
  {
    id: 0,
    section: "Let's understand your family",
    question: 'Welcome!',
    subtitle:
      'The more we know about your family, the more personalised and helpful your experience will be. This should take about a minute.',
    options: ["Let's begin"],
  },
  {
    id: 1,
    section: 'About your child',
    question: 'How old is your child?',
    subtitle: 'This helps us give age-appropriate suggestions',
    options: [
      '6 years old',
      '7 years old',
      '8 years old',
      '9 years old',
      '10 years old',
      '11 years old',
      '12 years old',
    ],
  },
  {
    id: 2,
    question: 'What are your main goals?',
    subtitle:
      "Select everything that applies — we'll focus on what matters most to you",
    options: [
      'Support my child to be more active',
      'Help my child feel happier and more confident',
      'Create more balanced family meals',
      'Encourage my child to eat more variety',
      'Build a better family routine',
      'Support my own health journey too',
    ],
    multiSelect: true,
  },
  {
    id: 12,
    section: 'About your family',
    question: "Who's usually part of mealtimes and activities?",
    subtitle: 'This helps us pitch suggestions at the right level',
    options: [
      'Just me and my child',
      'Two parents/carers',
      'Extended family at home',
      'Single parent with some support',
      'It varies week to week',
    ],
  },
  {
    id: 17,
    question: 'How busy are your weekdays?',
    subtitle: 'Slide to match your real schedule — we’ll keep things realistic',
    inputType: 'slider',
    slider: { min: 1, max: 5, minLabel: 'Very relaxed', maxLabel: 'Hectic' },
  },
  {
    id: 5,
    section: 'Food & meals',
    question: 'How much time do you usually have for preparing meals?',
    subtitle: "We'll match suggestions to your schedule",
    options: [
      'Under 15 minutes',
      '15-30 minutes',
      '30-45 minutes',
      '45+ minutes when possible',
    ],
  },
  {
    id: 11,
    question: "What's your rough weekly food budget?",
    subtitle: "We'll keep meal suggestions realistic for your family",
    options: [
      'Under £50',
      '£50–80',
      '£80–120',
      '£120–160',
      '£160+',
      "I'd rather not say",
    ],
  },
  {
    id: 3,
    question: "What does your family's cultural background include?",
    subtitle:
      "We'll suggest foods and recipes that fit your family (select all that apply)",
    options: [
      'British/Irish',
      'South Asian (Indian, Pakistani, Bangladeshi)',
      'East Asian (Chinese, Japanese, Korean)',
      'African/Caribbean',
      'Middle Eastern',
      'European',
      'Latin American',
      'Other/Mixed',
    ],
    multiSelect: true,
  },
  {
    id: 13,
    question: 'Are there foods that are a struggle right now?',
    subtitle: "We'll work around these gently (select all that apply)",
    options: [
      'Vegetables',
      'Anything new or unfamiliar',
      'Fruit',
      'Protein (meat, fish, eggs)',
      'Textures they dislike',
      'Honestly, most things',
      'No real struggles',
    ],
    multiSelect: true,
  },
  {
    id: 6,
    question: 'Any food allergies or dietary requirements?',
    subtitle: "We'll make sure all suggestions are safe and suitable",
    options: [
      'No allergies or restrictions',
      'Dairy allergy/intolerance',
      'Nut allergy',
      'Egg allergy',
      'Gluten intolerance/coeliac',
      'Vegetarian',
      'Halal',
      'Other',
    ],
    multiSelect: true,
  },
  {
    id: 14,
    section: 'Activity & play',
    question: 'What does your child love?',
    subtitle:
      "We'll build activities around their interests (select all that apply)",
    options: [
      'Football',
      'Other sports',
      'Dancing',
      'Art & crafts',
      'Animals',
      'Building & making',
      'Music',
      'Gaming',
      'Being outdoors',
      'Stories & reading',
    ],
    multiSelect: true,
  },
  {
    id: 8,
    question: 'What space do you have for physical activity?',
    subtitle:
      "We'll suggest activities that fit your home (select all that apply)",
    options: [
      'Garden or outdoor space',
      'Living room or indoor space',
      'Local park nearby',
      'Community sports facilities',
      'Limited space only',
    ],
    multiSelect: true,
  },
  {
    id: 15,
    question: 'What usually gets in the way?',
    subtitle: 'Knowing the blockers helps us help (select all that apply)',
    options: [
      'Not enough time',
      'Tiredness after work/school',
      'Cost',
      'Fussy eating',
      'Screens & devices',
      'Lack of ideas',
      'Weather or space',
      'Nothing major right now',
    ],
    multiSelect: true,
  },
  {
    id: 16,
    section: 'Your goals',
    question:
      'If things went really well, what would be different in 3 months?',
    subtitle:
      'There are no wrong answers — this helps us focus on what matters to you',
    inputType: 'textarea',
  },
  // ── Layer 2 (progressive profiling — surfaced later, Phase 6/8) ──
  {
    id: 18,
    section: 'Your family style',
    question: 'How would you describe family life day-to-day?',
    subtitle: 'No judgement — this just helps us pitch the tone',
    options: ['Pretty organised', 'Flexible and relaxed', 'Joyfully chaotic'],
    layer: 2,
  },
  {
    id: 19,
    question: 'What works better for your child?',
    subtitle: 'This shapes how we structure suggestions',
    options: [
      'Clear structure and routine',
      'Plenty of variety',
      'A mix of both',
    ],
    layer: 2,
  },
  {
    id: 20,
    question: 'When do rewards land best?',
    subtitle: 'We’ll time encouragement to suit your child',
    options: [
      'Straight away',
      'At the end of the day',
      'A bigger weekly reward',
    ],
    layer: 2,
  },
  {
    id: 4,
    section: 'A bit more about food',
    question: 'Which food groups does your family regularly eat?',
    subtitle:
      "This helps us suggest recipes you'll actually make (select all that apply)",
    options: [
      'Rice and grains',
      'Pasta and noodles',
      'Potatoes',
      'Chicken',
      'Fish',
      'Lentils and beans',
      'Fresh vegetables',
      'Fresh fruit',
      'Dairy (milk, cheese, yogurt)',
      'Eggs',
    ],
    multiSelect: true,
    layer: 2,
  },
  {
    id: 7,
    section: 'A bit more about activity',
    question: 'How active is your child currently?',
    subtitle: 'This helps us set realistic, achievable goals',
    options: [
      'Very active - plays sports or very energetic most days',
      'Moderately active - plays outside sometimes',
      'Quite still - prefers screen time or quiet play',
      'It varies a lot day to day',
    ],
    layer: 2,
  },
  {
    id: 9,
    question: 'What equipment or items do you have at home?',
    subtitle:
      "We'll tailor movement ideas to what you have (select all that apply)",
    options: [
      'Bike or scooter',
      'Ball (football, basketball, etc.)',
      'Skipping rope',
      'Sports equipment (bat, rackets, etc.)',
      'None - just body movement is fine',
    ],
    multiSelect: true,
    layer: 2,
  },
  {
    id: 10,
    question: 'What would make this easier for you?',
    subtitle:
      "We're here to support you, not add pressure (select all that apply)",
    options: [
      'Quick, simple meal ideas',
      'One-click grocery lists',
      'Ideas using ingredients I already have',
      'Fun activity suggestions',
      'Support for difficult moments',
      'Budget-friendly options',
    ],
    multiSelect: true,
    layer: 2,
  },
];

// Only the Layer-1 core is shown during initial onboarding.
const layer1Questions = questions.filter(q => (q.layer ?? 1) === 1);

export function Onboarding() {
  const navigation = useNavigation<Nav>();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});

  const q = layer1Questions[currentStep];
  const isLast = currentStep === layer1Questions.length - 1;

  const handleNext = async () => {
    if (isLast) {
      await storage.setItem('onboardingComplete', 'true');
      await storage.setItem('onboardingAnswers', JSON.stringify(answers));
      // Mirror the canonical profile to the synced family_profiles row
      // (offline-first: AsyncStorage above is the source of truth).
      await syncFamilyProfile(mapAnswersToProfile(answers));
      // Layer-1 questions done → food/activity swipe discovery (Phase 3),
      // which finishes into MainApp.
      navigation.replace('FoodSwipe');
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const handleSingle = (value: string) => {
    setAnswers({ ...answers, [q.id]: value });
    if (!q.multiSelect) {
      setTimeout(() => handleNext(), 300);
    }
  };

  const handleMulti = (option: string) => {
    const cur = (answers[q.id] as string[]) || [];
    const next = cur.includes(option)
      ? cur.filter(a => a !== option)
      : [...cur, option];
    setAnswers({ ...answers, [q.id]: next });
  };

  const canProceed = q.multiSelect
    ? ((answers[q.id] as string[])?.length ?? 0) > 0
    : q.inputType === 'slider' || q.inputType === 'textarea'
    ? true // optional free-form / scale steps
    : answers[q.id] !== undefined;

  const isNewSection =
    currentStep === 0 ||
    (q.section && q.section !== layer1Questions[currentStep - 1]?.section);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <Heart size={20} color={colors.secondaryForeground} />
          </View>
          <Text style={styles.logoText}>HabitQuest</Text>
        </View>
      </View>

      {/* Section title */}
      {isNewSection && q.section && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{q.section}</Text>
        </View>
      )}

      {/* Progress dots */}
      <View style={styles.progressRow}>
        {layer1Questions.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i <= currentStep
                ? styles.progressActive
                : styles.progressInactive,
            ]}
          />
        ))}
      </View>

      {/* Question card */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Card style={styles.card}>
          <Text style={styles.question}>{q.question}</Text>
          <Text style={styles.qSubtitle}>{q.subtitle}</Text>

          {q.multiSelect && q.options && (
            <View style={styles.options}>
              {q.options.map((opt, i) => {
                const checked = ((answers[q.id] as string[]) || []).includes(
                  opt,
                );
                return (
                  <Pressable
                    key={i}
                    style={[styles.optionRow, checked && styles.optionChecked]}
                    onPress={() => handleMulti(opt)}
                  >
                    <Checkbox checked={checked} />
                    <Text style={styles.optionText}>{opt}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {!q.multiSelect && !q.inputType && q.options && (
            <View style={styles.options}>
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === opt;
                return (
                  <Pressable
                    key={i}
                    style={[
                      styles.optionRow,
                      selected && styles.optionSelected,
                    ]}
                    onPress={() => handleSingle(opt)}
                  >
                    <View
                      style={[styles.radio, selected && styles.radioSelected]}
                    >
                      {selected && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.optionText}>{opt}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {q.inputType === 'slider' && q.slider && (
            <View style={styles.sliderWrap}>
              <View style={styles.sliderTrack}>
                {Array.from(
                  { length: q.slider.max - q.slider.min + 1 },
                  (_, i) => {
                    const val = q.slider!.min + i;
                    const current =
                      answers[q.id] !== undefined
                        ? parseInt(answers[q.id] as string, 10)
                        : -1;
                    const active = current === val;
                    return (
                      <Pressable
                        key={val}
                        style={[
                          styles.sliderDot,
                          active && styles.sliderDotActive,
                        ]}
                        onPress={() =>
                          setAnswers({ ...answers, [q.id]: String(val) })
                        }
                      >
                        <Text
                          style={[
                            styles.sliderDotText,
                            active && styles.sliderDotTextActive,
                          ]}
                        >
                          {val}
                        </Text>
                      </Pressable>
                    );
                  },
                )}
              </View>
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>{q.slider.minLabel}</Text>
                <Text style={styles.sliderLabel}>{q.slider.maxLabel}</Text>
              </View>
            </View>
          )}

          {q.inputType === 'textarea' && (
            <TextInput
              style={styles.textarea}
              value={(answers[q.id] as string) || ''}
              onChangeText={t => setAnswers({ ...answers, [q.id]: t })}
              placeholder="Type your answer (optional)…"
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}

          {(q.multiSelect || q.inputType) && (
            <View style={styles.actions}>
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onPress={() => setCurrentStep(s => s - 1)}
                >
                  <Text style={styles.backText}>Back</Text>
                </Button>
              )}
              <Button
                onPress={handleNext}
                disabled={!canProceed}
                style={styles.continueBtn}
              >
                <Text style={styles.continueText}>
                  {isLast ? 'Complete' : 'Continue'}
                </Text>
                <ArrowRight size={18} color={colors.primaryForeground} />
              </Button>
            </View>
          )}
        </Card>

        <Text style={styles.stepIndicator}>
          Question {currentStep + 1} of {layer1Questions.length}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 48,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.foreground,
  },
  sectionHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.h2,
    textAlign: 'center',
    color: colors.primary,
  },
  progressRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 3,
    marginBottom: 16,
  },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressActive: {
    backgroundColor: colors.primary,
  },
  progressInactive: {
    backgroundColor: colors.border,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    padding: 24,
  },
  question: {
    ...typography.h1,
    marginBottom: 8,
  },
  qSubtitle: {
    ...typography.sm,
    color: colors.mutedForeground,
    marginBottom: 24,
    lineHeight: 20,
  },
  options: {
    gap: 10,
  },
  sliderWrap: {
    gap: 10,
    marginTop: 4,
  },
  sliderTrack: {
    flexDirection: 'row',
    gap: 8,
  },
  sliderDot: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderDotActive: {
    borderColor: colors.primary,
    backgroundColor: withOpacity(colors.primary, 0.12),
  },
  sliderDotText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  sliderDotTextActive: {
    color: colors.primary,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  textarea: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    backgroundColor: colors.card,
    padding: 14,
    fontSize: 15,
    color: colors.foreground,
    lineHeight: 22,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  optionChecked: {
    borderColor: colors.primary,
    backgroundColor: withOpacity(colors.primary, 0.04),
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: withOpacity(colors.primary, 0.04),
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: colors.foreground,
    lineHeight: 22,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  backText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.foreground,
  },
  continueBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  continueText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  stepIndicator: {
    textAlign: 'center',
    color: colors.mutedForeground,
    fontSize: 13,
    marginTop: 16,
  },
});
