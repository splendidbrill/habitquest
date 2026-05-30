import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Lock, Heart } from 'lucide-react-native';

const colorMoods = [
  { id: 'yellow', color: '#fef08a', label: 'Bright' },
  { id: 'blue', color: '#bfdbfe', label: 'Calm' },
  { id: 'grey', color: '#d1d5db', label: 'Neutral' },
  { id: 'pink', color: '#fbcfe8', label: 'Soft' },
  { id: 'green', color: '#bbf7d0', label: 'Growing' },
  { id: 'purple', color: '#e9d5ff', label: 'Creative' },
  { id: 'red', color: '#fecaca', label: 'Intense' },
  { id: 'orange', color: '#fed7aa', label: 'Energetic' },
];

export function Kids12Reflection() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [thanksPerson, setThanksPerson] = useState('');
  const [saved, setSaved] = useState(false);

  const hasContent = !!(selectedColor || note.trim() || gratitude1.trim() || gratitude2.trim() || gratitude3.trim() || thanksPerson.trim());

  const handleSave = async () => {
    if (hasContent) {
      const raw = await storage.getItem('kids12Reflections');
      const reflections = raw ? JSON.parse(raw) : [];
      reflections.push({
        date: new Date().toISOString(),
        color: selectedColor,
        note: note.trim(),
        gratitude: [gratitude1.trim(), gratitude2.trim(), gratitude3.trim()].filter(Boolean),
        thanksPerson: thanksPerson.trim(),
      });
      await storage.setItem('kids12Reflections', JSON.stringify(reflections));
      setSaved(true);
    }
  };

  if (saved) {
    return (
      <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.centerContent}>
            <Lock size={56} color="#9ca3af" />
            <Text style={styles.savedTitle}>Saved privately.</Text>
            <Text style={styles.savedSub}>Only you can see this.</Text>

            {thanksPerson.trim() ? (
              <View style={styles.thanksCard}>
                <Heart size={24} color="#ec4899" style={{ marginBottom: 8 }} />
                <Text style={styles.thanksText}>
                  You wanted to thank <Text style={{ fontWeight: '700' }}>{thanksPerson}</Text>
                </Text>
                <Text style={styles.thanksHint}>Maybe tell them? It might make their day.</Text>
              </View>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Kids12Today')}
              style={styles.btnWrap}
            >
              <LinearGradient
                colors={['#a855f7', '#22d3ee']}
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
    <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
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
              onPress={() => navigation.navigate('Kids12Today')}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Your private space</Text>
          <Text style={styles.subtitle}>No one else will see this.</Text>
          <Text style={styles.subtitleSmall}>Not your parents, not your friends. Just you.</Text>

          {/* Color mood selector */}
          <Text style={styles.label}>Pick a colour for today (optional)</Text>
          <View style={styles.colorGrid}>
            {colorMoods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                activeOpacity={0.85}
                onPress={() => setSelectedColor(mood.id)}
                style={[
                  styles.colorBtn,
                  { backgroundColor: mood.color },
                  selectedColor === mood.id && styles.colorBtnSelected,
                ]}
              >
                <Text style={styles.colorLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Gratitude */}
          <Text style={styles.label}>3 things you're grateful for today (optional)</Text>
          <TextInput
            value={gratitude1}
            onChangeText={setGratitude1}
            placeholder="1. Something small counts..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            style={styles.input}
          />
          <TextInput
            value={gratitude2}
            onChangeText={setGratitude2}
            placeholder="2. Or something big..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            style={styles.input}
          />
          <TextInput
            value={gratitude3}
            onChangeText={setGratitude3}
            placeholder="3. Whatever feels true..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            style={styles.input}
          />

          {/* Thank someone */}
          <Text style={styles.label}>Someone you'd like to thank today (optional)</Text>
          <TextInput
            value={thanksPerson}
            onChangeText={setThanksPerson}
            placeholder="Maybe tell them later..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            style={styles.input}
          />
          <Text style={styles.hint}>Saying thanks (even small ones) can feel good for both of you.</Text>

          {/* Note */}
          <Text style={styles.label}>Write something if you want (optional)</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="How you're feeling, what's on your mind, or nothing at all..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            style={[styles.input, styles.textarea]}
          />

          {/* Save */}
          <TouchableOpacity
            activeOpacity={hasContent ? 0.85 : 1}
            onPress={hasContent ? handleSave : undefined}
            style={styles.btnWrap}
          >
            <LinearGradient
              colors={hasContent ? ['#a855f7', '#22d3ee'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btn}
            >
              <Text style={[styles.btnText, !hasContent && { color: 'rgba(255,255,255,0.3)' }]}>
                Save privately
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.privacyRow}>
            <Lock size={12} color="#6b7280" />
            <Text style={styles.privacyText}>Private to you only</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  skipText: { fontSize: 14, color: '#9ca3af' },
  title: { fontSize: 24, fontWeight: '800', color: '#ffffff', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#9ca3af', marginBottom: 2 },
  subtitleSmall: { fontSize: 12, color: '#6b7280', marginBottom: 28 },
  label: { fontSize: 13, color: '#9ca3af', marginBottom: 10 },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  colorBtn: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorBtnSelected: { borderWidth: 2, borderColor: '#a855f7' },
  colorLabel: { fontSize: 10, color: '#374151', fontWeight: '600' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    color: '#fff',
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 10,
  },
  textarea: { height: 120, textAlignVertical: 'top', marginBottom: 24 },
  hint: { fontSize: 11, color: '#6b7280', marginBottom: 20, marginTop: -4 },
  btnWrap: { width: '100%', marginBottom: 16 },
  btn: { borderRadius: 16, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 17, fontWeight: '700', color: '#ffffff' },
  privacyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  privacyText: { fontSize: 11, color: '#6b7280' },
  savedTitle: { fontSize: 24, fontWeight: '800', color: '#ffffff', marginBottom: 8, textAlign: 'center', marginTop: 20 },
  savedSub: { fontSize: 15, color: '#9ca3af', marginBottom: 24, textAlign: 'center' },
  thanksCard: {
    backgroundColor: 'rgba(236,72,153,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(236,72,153,0.2)',
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    width: '100%',
  },
  thanksText: { fontSize: 13, color: '#9ca3af', textAlign: 'center', marginBottom: 6 },
  thanksHint: { fontSize: 11, color: '#6b7280', textAlign: 'center' },
});
