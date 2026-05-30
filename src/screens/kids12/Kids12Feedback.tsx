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
import { ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react-native';

const features = [
  'Daily check-in',
  'Movement choices',
  'Private journal',
  'Wellbeing tracking',
  'Weekly planner',
  'Support resources',
  'Food guidance',
  'Motivational quotes',
];

export function Kids12Feedback() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [likes, setLikes] = useState<string[]>([]);
  const [dislikes, setDislikes] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleLike = (feature: string) => {
    if (likes.includes(feature)) {
      setLikes(likes.filter(f => f !== feature));
    } else {
      setLikes([...likes, feature]);
      setDislikes(dislikes.filter(f => f !== feature));
    }
  };

  const toggleDislike = (feature: string) => {
    if (dislikes.includes(feature)) {
      setDislikes(dislikes.filter(f => f !== feature));
    } else {
      setDislikes([...dislikes, feature]);
      setLikes(likes.filter(f => f !== feature));
    }
  };

  const hasContent = likes.length > 0 || dislikes.length > 0 || suggestions.trim().length > 0;

  const handleSubmit = async () => {
    const feedback = {
      date: new Date().toISOString(),
      likes,
      dislikes,
      suggestions: suggestions.trim(),
    };
    const raw = await storage.getItem('kids12UserFeedback');
    const allFeedback = raw ? JSON.parse(raw) : [];
    allFeedback.push(feedback);
    await storage.setItem('kids12UserFeedback', JSON.stringify(allFeedback));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.centerContent}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.submittedTitle}>Thank you</Text>
            <Text style={styles.submittedSub}>Your feedback helps make this better for everyone.</Text>
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
          <View style={styles.topHeader}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Kids12Today')}
              style={styles.backBtn}
            >
              <ArrowLeft size={22} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>What do you think?</Text>
          <Text style={styles.subtitle}>Tell us what's working and what isn't. Be honest.</Text>

          <Text style={styles.sectionLabel}>Features you've tried</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.featureName}>{feature}</Text>
              <View style={styles.thumbsRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => toggleLike(feature)}
                  style={[styles.thumbBtn, likes.includes(feature) && styles.thumbBtnLiked]}
                >
                  <ThumbsUp size={16} color={likes.includes(feature) ? '#22c55e' : '#9ca3af'} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => toggleDislike(feature)}
                  style={[styles.thumbBtn, dislikes.includes(feature) && styles.thumbBtnDisliked]}
                >
                  <ThumbsDown size={16} color={dislikes.includes(feature) ? '#ef4444' : '#9ca3af'} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <Text style={styles.sectionLabel}>What would make this better? (optional)</Text>
          <TextInput
            value={suggestions}
            onChangeText={setSuggestions}
            placeholder="Be as specific or vague as you want..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={styles.textarea}
          />

          <TouchableOpacity
            activeOpacity={hasContent ? 0.85 : 1}
            onPress={hasContent ? handleSubmit : undefined}
            style={styles.btnWrap}
          >
            <LinearGradient
              colors={hasContent ? ['#a855f7', '#22d3ee'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btn}
            >
              <Text style={[styles.btnText, !hasContent && { color: 'rgba(255,255,255,0.3)' }]}>
                Send feedback
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.anonNote}>Your feedback is anonymous</Text>
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
  topHeader: { marginBottom: 24 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  title: { fontSize: 24, fontWeight: '800', color: '#ffffff', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#9ca3af', marginBottom: 24 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: '#9ca3af', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  featureRow: {
    backgroundColor: '#1a1a24',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  featureName: { fontSize: 13, color: '#9ca3af', flex: 1 },
  thumbsRow: { flexDirection: 'row', gap: 8 },
  thumbBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  thumbBtnLiked: { backgroundColor: 'rgba(34,197,94,0.15)' },
  thumbBtnDisliked: { backgroundColor: 'rgba(239,68,68,0.15)' },
  textarea: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    color: '#fff',
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    textAlignVertical: 'top',
    height: 120,
    marginBottom: 20,
    marginTop: 4,
  },
  btnWrap: { width: '100%', marginBottom: 12 },
  btn: { borderRadius: 16, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 17, fontWeight: '700', color: '#ffffff' },
  anonNote: { fontSize: 11, color: '#6b7280', textAlign: 'center' },
  checkmark: { fontSize: 56, marginBottom: 16, color: '#a855f7' },
  submittedTitle: { fontSize: 24, fontWeight: '800', color: '#ffffff', marginBottom: 8, textAlign: 'center' },
  submittedSub: { fontSize: 15, color: '#9ca3af', marginBottom: 32, textAlign: 'center' },
});
