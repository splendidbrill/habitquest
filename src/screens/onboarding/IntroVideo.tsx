// ============================================================
// IntroVideo (Phase 9) — onboarding intro + personalised end-card.
//
// No `react-native-video` dependency is installed (guardrail: don't add one
// without approval), so the "video" is an animated slideshow fallback — the
// doc explicitly endorses a cheap illustrated explainer.
//
// Two modes via the `mode` route param:
//   - 'intro'   (default): Welcome → [Watch / Skip] → Onboarding
//   - 'endcard'          : shown after onboarding, personalised from the
//                          FamilyProfile, then → MainApp
//
// Analytics (AsyncStorage, table later): videoWatched / videoPercentWatched /
// videoSkipped — for retention correlation.
// ============================================================

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight, SkipForward } from 'lucide-react-native';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import {
  loadFamilyProfile,
  type FamilyProfile,
} from '../../data/familyProfile';
import { flushVideoAnalytics } from '../../services/videoAnalytics';
import { colors } from '../../theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'IntroVideo'>;
type Rt = RouteProp<RootStackParamList, 'IntroVideo'>;

type Slide = {
  emoji: string;
  title: string;
  body: string;
  colors: [string, string];
};

// Follows the doc's 6-scene "trailer" arc: Problem → Solution → Four Pillars
// → Getting to know you → Gets smarter → Lasting change. Still a slideshow
// (no video dep), but now mirrors the intended narrative beats.
const SLIDES: Slide[] = [
  {
    emoji: '🤹',
    title: 'Family life is busy',
    body: 'Routines change, children lose interest, and healthy advice can feel overwhelming. Building good habits is hard.',
    colors: ['#f97316', '#ea580c'],
  },
  {
    emoji: '💡',
    title: 'HabitQuest makes it simple',
    body: 'We help your whole family build small healthy habits that actually fit into daily life — enjoyable and achievable.',
    colors: ['#f59e0b', '#d97706'],
  },
  {
    emoji: '🧭',
    title: 'Built around four pillars',
    body: '🥕 Nutrition   ⚽ Activity   😴 Sleep   🧠 Confidence\n\nEvery meal, quest and challenge supports healthy growth.',
    colors: ['#22c55e', '#16a34a'],
  },
  {
    emoji: '📝',
    title: 'We get to know your family',
    body: 'Family size, the foods you love, your budget, what your child enjoys — your plans are shaped around your real life.',
    colors: ['#0ea5e9', '#0284c7'],
  },
  {
    emoji: '📈',
    title: 'It gets smarter every week',
    body: 'Your family coach learns what works and what doesn’t. Week 1 helpful, week 4 personal, week 12 built around you.',
    colors: ['#8b5cf6', '#7c3aed'],
  },
  {
    emoji: '💚',
    title: 'Small habits, lasting change',
    body: 'No calorie counting. No judgement. Just small daily wins.\n\nHealthy habits, happy families — one quest at a time.',
    colors: ['#ec4899', '#db2777'],
  },
];

const SLIDE_MS = 4000;

export function IntroVideo() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const mode = route.params?.mode ?? 'intro';

  if (mode === 'endcard') return <EndCard />;
  return <IntroSlides navigation={navigation} />;
}

// ─── Intro slideshow ──────────────────────────────────────────────────────────
function IntroSlides({ navigation }: { navigation: Nav }) {
  const [index, setIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLast = index === SLIDES.length - 1;
  const percent = Math.round(((index + 1) / SLIDES.length) * 100);

  const goTo = (next: number) => {
    Animated.timing(fade, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setIndex(next);
      Animated.timing(fade, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }).start();
    });
  };

  // Auto-advance through the slides.
  useEffect(() => {
    if (isLast) return;
    timer.current = setTimeout(() => goTo(index + 1), SLIDE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [index, isLast]);

  const finish = async (watched: boolean) => {
    if (timer.current) clearTimeout(timer.current);
    await storage.setItem('videoWatched', watched ? 'true' : 'false');
    await storage.setItem('videoSkipped', watched ? 'false' : 'true');
    await storage.setItem(
      'videoPercentWatched',
      String(watched ? 100 : percent),
    );
    navigation.replace('Onboarding');
  };

  const slide = SLIDES[index];

  return (
    <LinearGradient colors={slide.colors} style={s.fill}>
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => finish(false)} style={s.skipBtn}>
          <Text style={s.skipText}>Skip</Text>
          <SkipForward size={15} color="rgba(255,255,255,0.85)" />
        </TouchableOpacity>
      </View>

      <Animated.View style={[s.slideBody, { opacity: fade }]}>
        <Text style={s.emoji}>{slide.emoji}</Text>
        <Text style={s.title}>{slide.title}</Text>
        <Text style={s.body}>{slide.body}</Text>
      </Animated.View>

      <View style={s.footer}>
        <View style={s.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[s.dot, i === index && s.dotActive]} />
          ))}
        </View>
        <TouchableOpacity
          style={s.cta}
          activeOpacity={0.9}
          onPress={() => (isLast ? finish(true) : goTo(index + 1))}
        >
          <Text style={[s.ctaText, { color: slide.colors[1] }]}>
            {isLast ? "Let's set up" : 'Next'}
          </Text>
          <ChevronRight size={18} color={slide.colors[1]} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

// ─── Personalised end-card ─────────────────────────────────────────────────────
function EndCard() {
  const navigation = useNavigation<Nav>();
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // The parent is authenticated by the end-card → flush the intro's
    // AsyncStorage analytics into the DB (best-effort, idempotent).
    flushVideoAnalytics();
    loadFamilyProfile()
      .then(p => {
        setProfile(p);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const topGoal =
    profile?.threeMonthGoal || profile?.goals?.[0] || 'your family goals';
  const prep = profile?.prepTime ? profile.prepTime.toLowerCase() : 'quick';
  const interest = profile?.childInterests?.[0];

  if (!loaded) {
    return (
      <View style={[s.fill, s.centered]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#f97316', '#ea580c']} style={s.fill}>
      <View style={s.slideBody}>
        <Text style={s.emoji}>🎉</Text>
        <Text style={s.title}>You're all set!</Text>
        <Text style={s.body}>
          We'll help your family around{' '}
          <Text style={s.bodyBold}>{topGoal}</Text>, with{' '}
          <Text style={s.bodyBold}>{prep}</Text> meals
          {interest ? (
            <>
              {' '}
              and quests built around <Text style={s.bodyBold}>{interest}</Text>
            </>
          ) : null}
          .
        </Text>
        <Text style={s.bodySub}>
          Your first personalised week is ready inside.
        </Text>
      </View>

      <View style={s.footer}>
        <TouchableOpacity
          style={s.cta}
          activeOpacity={0.9}
          onPress={() => navigation.replace('MainApp')}
        >
          <Text style={[s.ctaText, { color: '#ea580c' }]}>Let's go</Text>
          <ChevronRight size={18} color="#ea580c" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  fill: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 56,
    paddingHorizontal: 20,
  },
  skipBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 6 },
  skipText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '600',
  },

  slideBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emoji: { fontSize: 84, marginBottom: 24 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    lineHeight: 24,
  },
  bodyBold: { fontWeight: '800', color: '#fff' },
  bodySub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 16,
  },

  footer: { paddingHorizontal: 24, paddingBottom: 48, gap: 20 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: { backgroundColor: '#fff', width: 22 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingVertical: 16,
  },
  ctaText: { fontSize: 16, fontWeight: '800' },
});

// Reference colors import so theme stays the single source if restyled later.
void colors;
