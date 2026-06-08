import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  SafeAreaView, ActivityIndicator, TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, ChefHat, RefreshCw, Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { storage } from '../utils/storage';
import { useTTS } from '../hooks/useTTS';
import { TTSInstallPrompt } from '../components/TTSInstallPrompt';

type Meal = {
  name: string;
  description: string;
  time: string;
  ingredients: string[];
  steps: string[];
  whyItsGreat: string;
  adaptations?: string;
};

const FALLBACK_MEALS: Meal[] = [
  {
    name: 'Speedy Veggie Pasta',
    description: 'A quick, colourful pasta the whole family will enjoy.',
    time: '15 minutes',
    ingredients: ['Pasta', 'Tinned tomatoes', 'Courgette', 'Garlic', 'Olive oil', 'Cheese to serve'],
    steps: ['Boil pasta as per packet.', 'Fry garlic in olive oil, add courgette for 3 mins.', 'Add tomatoes, simmer 5 mins. Mix with pasta.'],
    whyItsGreat: 'Quick, budget-friendly, and gets a vegetable in without a fuss.',
  },
  {
    name: 'Chicken & Rice One-Pot',
    description: 'A comforting, protein-rich meal ready in 30 minutes.',
    time: '30 minutes',
    ingredients: ['Chicken thighs', 'Rice', 'Onion', 'Garlic', 'Chicken stock', 'Frozen peas', 'Mild spices'],
    steps: ['Brown chicken pieces, set aside.', 'Fry onion and garlic, add rice and stock.', 'Return chicken, cover and cook 20 mins. Stir in peas.'],
    whyItsGreat: 'One pot means less washing up. High protein keeps kids full.',
  },
];

export function AIChef() {
  const navigation = useNavigation();
  const { read, showPrompt, setShowPrompt } = useTTS();
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [adaptation, setAdaptation] = useState('');
  const [adapting, setAdapting] = useState<number | null>(null);
  const [adaptedMeal, setAdaptedMeal] = useState<{ index: number; meal: Meal } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => { generateMeals(); }, []);

  const buildContext = async (): Promise<string> => {
    const raw = await storage.getItem('onboardingAnswers');
    if (!raw) return '';
    const answers = JSON.parse(raw) as Record<number, string | string[]>;
    const parts: string[] = [];
    if (answers[3]) parts.push(`Cultural background: ${[answers[3]].flat().join(', ')}`);
    if (answers[4]) parts.push(`Food groups they eat: ${[answers[4]].flat().join(', ')}`);
    if (answers[5]) parts.push(`Meal prep time: ${answers[5]}`);
    if (answers[6]) parts.push(`Dietary requirements: ${[answers[6]].flat().join(', ')}`);
    if (answers[1]) parts.push(`Child age: ${answers[1]}`);
    return parts.join('. ');
  };

  const callAI = async (prompt: string): Promise<string | null> => {
    const { data, error } = await supabase.functions.invoke('ai-proxy', {
      body: { type: 'recommendations', prompt, maxTokens: 800 },
    });
    if (error || !data?.text) return null;
    return data.text as string;
  };

  const parseJSON = (text: string): any => {
    try {
      const match = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      return match ? JSON.parse(match[0]) : null;
    } catch { return null; }
  };

  const generateMeals = async () => {
    setLoading(true);
    setError('');
    setAdaptedMeal(null);

    const context = await buildContext();

    const prompt = context
      ? `You are a family nutrition chef. Generate 3 personalised meal ideas for a family with this profile: ${context}.

Each meal should be practical, child-friendly, and culturally appropriate. Vary between breakfast, lunch, and dinner.

Respond ONLY with valid JSON array:
[{"name":"...","description":"...","time":"X minutes","ingredients":["..."],"steps":["..."],"whyItsGreat":"...","adaptations":"Optional: how to introduce a new ingredient or adapt for a picky eater"}]`
      : `You are a family nutrition chef. Generate 3 quick, healthy, child-friendly meal ideas for a busy family.

Respond ONLY with valid JSON array:
[{"name":"...","description":"...","time":"X minutes","ingredients":["..."],"steps":["..."],"whyItsGreat":"..."}]`;

    const text = await callAI(prompt);
    const parsed = text ? parseJSON(text) : null;

    if (parsed && Array.isArray(parsed) && parsed.length > 0) {
      setMeals(parsed);
    } else {
      setMeals(FALLBACK_MEALS);
      if (!context) setError('Add your family profile in onboarding for personalised suggestions.');
    }
    setLoading(false);
  };

  const adaptMeal = async (index: number) => {
    if (!adaptation.trim()) return;
    setAdapting(index);
    const meal = meals[index];
    const context = await buildContext();

    const prompt = `A family wants to adapt this meal: "${meal.name}".
Original ingredients: ${meal.ingredients.join(', ')}.
${context ? `Family profile: ${context}.` : ''}
Their request: "${adaptation}".

Adapt the meal based on their request. Keep it practical and child-friendly.

Respond ONLY with valid JSON:
{"name":"...","description":"...","time":"X minutes","ingredients":["..."],"steps":["..."],"whyItsGreat":"...","adaptations":"What was changed and why"}`;

    const text = await callAI(prompt);
    const parsed = text ? parseJSON(text) : null;

    if (parsed && parsed.name) {
      setAdaptedMeal({ index, meal: parsed });
    }
    setAdaptation('');
    setAdapting(null);
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
            <Text style={s.title}>AI Chef 👨‍🍳</Text>
            <Text style={s.subtitle}>Personalised meals for your family</Text>
          </View>
          <TouchableOpacity onPress={generateMeals} style={s.refreshBtn} disabled={loading}>
            <RefreshCw size={20} color="#f97316" />
          </TouchableOpacity>
        </View>

        {/* Personalised banner */}
        <LinearGradient colors={['#f97316', '#fbbf24']} style={s.banner}>
          <Sparkles size={20} color="#fff" />
          <Text style={s.bannerText}>
            Meals tailored to your family's background, time, and dietary needs. Tap refresh for new ideas.
          </Text>
        </LinearGradient>

        {error ? <Text style={s.errorText}>{error}</Text> : null}

        {loading ? (
          <View style={s.loadingBox}>
            <ActivityIndicator size="large" color="#f97316" />
            <Text style={s.loadingText}>Cooking up personalised ideas...</Text>
          </View>
        ) : (
          meals.map((meal, i) => {
            const displayMeal = adaptedMeal?.index === i ? adaptedMeal.meal : meal;
            const isExpanded = expanded === i;

            return (
              <View key={i} style={s.mealCard}>
                <TouchableOpacity activeOpacity={0.85} onPress={() => {
                  const next = isExpanded ? null : i;
                  setExpanded(next);
                  if (next !== null) read(`${displayMeal.name}. ${displayMeal.description}. ${displayMeal.whyItsGreat}`);
                }}>
                  <View style={s.mealHeader}>
                    <ChefHat size={22} color="#f97316" />
                    <View style={s.mealHeaderText}>
                      <Text style={s.mealName}>{displayMeal.name}</Text>
                      <Text style={s.mealMeta}>⏱ {displayMeal.time}</Text>
                    </View>
                    <Text style={s.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
                  </View>
                  <Text style={s.mealDesc}>{displayMeal.description}</Text>
                </TouchableOpacity>

                {isExpanded && (
                  <>
                    <View style={s.divider} />

                    <Text style={s.sectionLabel}>Ingredients</Text>
                    {displayMeal.ingredients.map((ing, j) => (
                      <Text key={j} style={s.listItem}>• {ing}</Text>
                    ))}

                    <Text style={s.sectionLabel}>Method</Text>
                    {displayMeal.steps.map((step, j) => (
                      <Text key={j} style={s.stepItem}>{j + 1}. {step}</Text>
                    ))}

                    <View style={s.whyBox}>
                      <Text style={s.whyLabel}>Why it's great</Text>
                      <Text style={s.whyText}>{displayMeal.whyItsGreat}</Text>
                    </View>

                    {displayMeal.adaptations ? (
                      <View style={s.adaptationBox}>
                        <Text style={s.adaptationLabel}>💡 Adaptation note</Text>
                        <Text style={s.adaptationText}>{displayMeal.adaptations}</Text>
                      </View>
                    ) : null}

                    {/* Request a change */}
                    <View style={s.changeBox}>
                      <Text style={s.changeLabel}>Want to make a change?</Text>
                      <Text style={s.changeSub}>e.g. "make it vegetarian", "my child hates courgette", "add more protein"</Text>
                      <TextInput
                        style={s.changeInput}
                        value={adaptation}
                        onChangeText={setAdaptation}
                        placeholder="Describe your change..."
                        placeholderTextColor="#9ca3af"
                        multiline
                      />
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => adaptMeal(i)}
                        disabled={!adaptation.trim() || adapting === i}
                        style={[s.changeBtn, (!adaptation.trim()) && s.changeBtnDisabled]}
                      >
                        {adapting === i
                          ? <ActivityIndicator color="#fff" size="small" />
                          : <Text style={s.changeBtnText}>Adapt this meal ✨</Text>
                        }
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            );
          })
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20, paddingTop: 12, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  headerText: { flex: 1 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 1 },
  refreshBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff7ed', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#fed7aa' },
  banner: { borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  bannerText: { flex: 1, fontSize: 13, color: '#fff', lineHeight: 19 },
  errorText: { fontSize: 13, color: '#f97316', textAlign: 'center', marginBottom: 12 },
  loadingBox: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  loadingText: { fontSize: 15, color: '#6b7280' },
  mealCard: { backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  mealHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  mealHeaderText: { flex: 1 },
  mealName: { fontSize: 17, fontWeight: '800', color: '#111827' },
  mealMeta: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  expandIcon: { fontSize: 12, color: '#9ca3af' },
  mealDesc: { fontSize: 13, color: '#4b5563', lineHeight: 20 },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 14 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#f97316', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginTop: 4 },
  listItem: { fontSize: 14, color: '#374151', lineHeight: 22 },
  stepItem: { fontSize: 14, color: '#374151', lineHeight: 22, marginBottom: 4 },
  whyBox: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 14, marginTop: 12 },
  whyLabel: { fontSize: 12, fontWeight: '700', color: '#16a34a', marginBottom: 4 },
  whyText: { fontSize: 13, color: '#166534', lineHeight: 20 },
  adaptationBox: { backgroundColor: '#fff7ed', borderRadius: 12, padding: 14, marginTop: 8 },
  adaptationLabel: { fontSize: 12, fontWeight: '700', color: '#d97706', marginBottom: 4 },
  adaptationText: { fontSize: 13, color: '#92400e', lineHeight: 20 },
  changeBox: { backgroundColor: '#f9fafb', borderRadius: 14, padding: 14, marginTop: 12 },
  changeLabel: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  changeSub: { fontSize: 12, color: '#6b7280', marginBottom: 10, lineHeight: 18 },
  changeInput: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, fontSize: 14, color: '#111827', marginBottom: 10, minHeight: 60, textAlignVertical: 'top' },
  changeBtn: { backgroundColor: '#f97316', borderRadius: 50, paddingVertical: 12, alignItems: 'center' },
  changeBtnDisabled: { opacity: 0.5 },
  changeBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },
});
