import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart, ArrowRight } from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { storage } from '../utils/storage';
import { colors, typography, radius, withOpacity } from '../theme';
import type { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface Question {
  id: number;
  section?: string;
  question: string;
  subtitle: string;
  options?: string[];
  multiSelect?: boolean;
  inputType?: 'text' | 'textarea';
}

const questions: Question[] = [
  {
    id: 0,
    section: "Let's understand your family",
    question: 'Welcome!',
    subtitle: "The more we know about your family, the more personalised and helpful your experience will be. This should take about 2 minutes.",
    options: ["Let's begin"],
  },
  {
    id: 1,
    section: 'About your child',
    question: 'How old is your child?',
    subtitle: 'This helps us give age-appropriate suggestions',
    options: ['7 years old', '8 years old', '9 years old', '10 years old', '11 years old'],
  },
  {
    id: 2,
    question: 'What are your main goals? Select up to 3',
    subtitle: "We'll focus on what matters most to you",
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
    id: 3,
    section: 'Diet & Culture',
    question: "What does your family's cultural background include?",
    subtitle: "We'll suggest foods and recipes that fit your family (select all that apply)",
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
    id: 4,
    question: 'Which food groups does your family regularly eat?',
    subtitle: "This helps us suggest recipes you'll actually make (select all that apply)",
    options: [
      'Rice and grains', 'Pasta and noodles', 'Potatoes', 'Chicken', 'Fish',
      'Lentils and beans', 'Fresh vegetables', 'Fresh fruit', 'Dairy (milk, cheese, yogurt)', 'Eggs',
    ],
    multiSelect: true,
  },
  {
    id: 5,
    question: 'How much time do you usually have for preparing meals?',
    subtitle: "We'll match suggestions to your schedule",
    options: ['Under 15 minutes', '15-30 minutes', '30-45 minutes', '45+ minutes when possible'],
  },
  {
    id: 6,
    question: 'Any food allergies or dietary requirements?',
    subtitle: "We'll make sure all suggestions are safe and suitable",
    options: [
      'No allergies or restrictions', 'Dairy allergy/intolerance', 'Nut allergy',
      'Egg allergy', 'Gluten intolerance/coeliac', 'Vegetarian', 'Halal', 'Other',
    ],
    multiSelect: true,
  },
  {
    id: 7,
    section: 'Activity',
    question: 'How active is your child currently?',
    subtitle: 'This helps us set realistic, achievable goals',
    options: [
      'Very active - plays sports or very energetic most days',
      'Moderately active - plays outside sometimes',
      'Quite still - prefers screen time or quiet play',
      'It varies a lot day to day',
    ],
  },
  {
    id: 8,
    question: 'What space do you have for physical activity?',
    subtitle: "We'll suggest activities that fit your home (select all that apply)",
    options: [
      'Garden or outdoor space', 'Living room or indoor space',
      'Local park nearby', 'Community sports facilities', 'Limited space only',
    ],
    multiSelect: true,
  },
  {
    id: 9,
    question: 'What equipment or items do you have at home?',
    subtitle: "We'll tailor movement ideas to what you have (select all that apply)",
    options: [
      'Bike or scooter', 'Ball (football, basketball, etc.)',
      'Skipping rope', 'Sports equipment (bat, rackets, etc.)', 'None - just body movement is fine',
    ],
    multiSelect: true,
  },
  {
    id: 10,
    section: 'Final step',
    question: 'What would make this easier for you?',
    subtitle: "We're here to support you, not add pressure (select all that apply)",
    options: [
      'Quick, simple meal ideas', 'One-click grocery lists',
      'Ideas using ingredients I already have', 'Fun activity suggestions',
      'Support for difficult moments', 'Budget-friendly options',
    ],
    multiSelect: true,
  },
];

export function Onboarding() {
  const navigation = useNavigation<Nav>();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});

  const q = questions[currentStep];
  const isLast = currentStep === questions.length - 1;

  const handleNext = async () => {
    if (isLast) {
      await storage.setItem('onboardingComplete', 'true');
      await storage.setItem('onboardingAnswers', JSON.stringify(answers));
      navigation.replace('MainApp');
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
    const next = cur.includes(option) ? cur.filter(a => a !== option) : [...cur, option];
    setAnswers({ ...answers, [q.id]: next });
  };

  const canProceed = q.multiSelect
    ? ((answers[q.id] as string[])?.length ?? 0) > 0
    : answers[q.id] !== undefined;

  const isNewSection = currentStep === 0 || (q.section && q.section !== questions[currentStep - 1]?.section);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <Heart size={20} color={colors.secondaryForeground} />
          </View>
          <Text style={styles.logoText}>HealthySteps</Text>
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
        {questions.map((_, i) => (
          <View
            key={i}
            style={[styles.progressDot, i <= currentStep ? styles.progressActive : styles.progressInactive]}
          />
        ))}
      </View>

      {/* Question card */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Text style={styles.question}>{q.question}</Text>
          <Text style={styles.qSubtitle}>{q.subtitle}</Text>

          {q.multiSelect && q.options && (
            <View style={styles.options}>
              {q.options.map((opt, i) => {
                const checked = ((answers[q.id] as string[]) || []).includes(opt);
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
                    style={[styles.optionRow, selected && styles.optionSelected]}
                    onPress={() => handleSingle(opt)}
                  >
                    <View style={[styles.radio, selected && styles.radioSelected]}>
                      {selected && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.optionText}>{opt}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {(q.multiSelect || q.inputType) && (
            <View style={styles.actions}>
              {currentStep > 0 && (
                <Button variant="outline" onPress={() => setCurrentStep(s => s - 1)}>
                  <Text style={styles.backText}>Back</Text>
                </Button>
              )}
              <Button
                onPress={handleNext}
                disabled={!canProceed}
                style={styles.continueBtn}
              >
                <Text style={styles.continueText}>{isLast ? 'Complete' : 'Continue'}</Text>
                <ArrowRight size={18} color={colors.primaryForeground} />
              </Button>
            </View>
          )}
        </Card>

        <Text style={styles.stepIndicator}>
          Question {currentStep + 1} of {questions.length}
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
