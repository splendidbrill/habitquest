import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import {
  ShoppingCart,
  Camera,
  Lightbulb,
  TrendingUp,
  BookOpen,
  Award,
  ChevronRight,
  Heart,
  Users,
  Sparkles,
  Volume2,
  Dna,
  Flame,
  Activity,
} from 'lucide-react-native';
import { useTTS } from '../hooks/useTTS';
import { TTSInstallPrompt } from '../components/TTSInstallPrompt';
import { getParentDigest, type ParentDigest } from '../services/aiAgentService';
import type { AgeGroup } from '../data/missionCatalog';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useParentData, ChildSummary } from '../hooks/useParentData';
import { MicroQuestionCard } from '../components/MicroQuestionCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  computePreferenceModel,
  type PreferenceModel,
} from '../services/preferenceEngine';
import { buildCoachLine } from '../services/familyCoach';
import type { Pillar } from '../services/syncService';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PILLAR_CONFIG: Record<
  Pillar,
  { emoji: string; label: string; color: string; bg: string }
> = {
  nutrition: {
    emoji: '🥕',
    label: 'Nutrition',
    color: '#16a34a',
    bg: '#f0fdf4',
  },
  movement: { emoji: '⚽', label: 'Movement', color: '#ea580c', bg: '#fff7ed' },
  sleep: { emoji: '😴', label: 'Sleep', color: '#7c3aed', bg: '#faf5ff' },
  confidence: {
    emoji: '🧠',
    label: 'Confidence',
    color: '#db2777',
    bg: '#fdf2f8',
  },
};

function scoreColor(score: number): string {
  if (score >= 70) return '#16a34a';
  if (score >= 40) return '#d97706';
  return '#dc2626';
}

function scoreLabel(score: number): string {
  if (score >= 70) return 'Strong';
  if (score >= 40) return 'Building';
  return 'Needs focus';
}

// Pretty-print a model label like "team_sport" / "indian" → "Team Sport".
function titleCase(s: string): string {
  return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Distinct palettes so cuisine vs activity bars read as different "DNA strands".
const CUISINE_COLORS = ['#f97316', '#ea580c', '#d97706', '#ca8a04', '#b45309'];
const ACTIVITY_COLORS = ['#3b82f6', '#2563eb', '#7c3aed', '#0891b2', '#0d9488'];

// ─── Activity Arena (qualitative progress, never raw minutes) ──────────────────
type ArenaStats = {
  streak: number;
  activeDays: number;
  movers: { pillar: Pillar; delta: number }[];
};

function buildArenaStats(child: ChildSummary): ArenaStats {
  // Active days this week — distinct completion dates within the last 7 days.
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const days = new Set<string>();
  for (const m of child.recentMissions) {
    if (!m.completed_at) continue;
    if (new Date(m.completed_at).getTime() >= weekAgo) {
      days.add(m.completed_at.split('T')[0]);
    }
  }

  // Pillar momentum — this week vs last week from pillarHistory (index 0 = now).
  const movers: { pillar: Pillar; delta: number }[] = [];
  const hist = child.pillarHistory;
  if (hist.length > 1 && hist[0] && hist[1]) {
    const pillars: Pillar[] = ['nutrition', 'movement', 'sleep', 'confidence'];
    for (const p of pillars) {
      const key = `${p}_score`;
      const delta = Number(hist[0][key] ?? 0) - Number(hist[1][key] ?? 0);
      if (delta > 0) movers.push({ pillar: p, delta });
    }
    movers.sort((a, b) => b.delta - a.delta);
  }

  return { streak: child.streak, activeDays: Math.min(days.size, 7), movers };
}

// ─── Pillar detail bar ────────────────────────────────────────────────────────
function PillarBar({
  pillar,
  score,
  isFocus,
}: {
  pillar: Pillar;
  score: number;
  isFocus: boolean;
}) {
  const cfg = PILLAR_CONFIG[pillar];
  const color = scoreColor(score);
  return (
    <View
      style={[
        d.pillarBar,
        isFocus && { borderColor: '#f97316', borderWidth: 1.5 },
        { backgroundColor: cfg.bg },
      ]}
    >
      <View style={d.pillarBarLeft}>
        <Text style={d.pillarBarEmoji}>{cfg.emoji}</Text>
        <View>
          <Text style={d.pillarBarName}>{cfg.label}</Text>
          {isFocus && <Text style={d.focusTag}>THIS WEEK'S FOCUS</Text>}
        </View>
      </View>
      <View style={d.pillarBarRight}>
        <Text style={[d.pillarBarScore, { color }]}>{score}</Text>
        <Text style={[d.pillarBarLabel, { color }]}>{scoreLabel(score)}</Text>
      </View>
      <View style={d.pillarBarTrack}>
        <View
          style={[
            d.pillarBarFill,
            { width: `${score}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

const TOOLS = [
  {
    label: 'AI Chef',
    desc: 'Personalised family meals',
    Icon: Sparkles,
    route: 'AIChef',
    color: '#fff7ed',
    iconColor: '#f97316',
  },
  {
    label: 'Grocery List',
    desc: 'Weekly meal ingredients',
    Icon: ShoppingCart,
    route: 'GroceryList',
    color: '#eff6ff',
    iconColor: '#3b82f6',
  },
  {
    label: 'Healthy Swaps',
    desc: 'Cheap, simple alternatives',
    Icon: TrendingUp,
    route: 'HealthySwaps',
    color: '#f0fdf4',
    iconColor: '#16a34a',
  },
  {
    label: 'Quick Meals',
    desc: 'Under 15 min & £5',
    Icon: Lightbulb,
    route: 'QuickMealMode',
    color: '#fefce8',
    iconColor: '#ca8a04',
  },
  {
    label: 'Photo Rewards',
    desc: 'Upload & earn vouchers',
    Icon: Camera,
    route: 'PhotoRewards',
    color: '#fff7ed',
    iconColor: '#ea580c',
  },
  {
    label: 'Budget Tracker',
    desc: 'See money saved',
    Icon: TrendingUp,
    route: 'BudgetTracker',
    color: '#f5f3ff',
    iconColor: '#7c3aed',
  },
  {
    label: 'Weekly Report',
    desc: 'Family progress report',
    Icon: BookOpen,
    route: 'WeeklyReport',
    color: '#fdf2f8',
    iconColor: '#db2777',
  },
  {
    label: 'Behaviour Tips',
    desc: 'Quick advice cards',
    Icon: Lightbulb,
    route: 'FoodBehaviourTips',
    color: '#eff6ff',
    iconColor: '#3b82f6',
  },
  {
    label: 'Barrier Solver',
    desc: "What stopped today's quest?",
    Icon: Lightbulb,
    route: 'BarrierSolver',
    color: '#f0fdf4',
    iconColor: '#16a34a',
  },
  {
    label: 'Your Rewards',
    desc: 'Points & prizes',
    Icon: Award,
    route: 'ParentRewards',
    color: '#fefce8',
    iconColor: '#ca8a04',
  },
];

// ─── Main component ───────────────────────────────────────────────────────────
export function ParentDashboard() {
  const navigation = useNavigation<Nav>();
  const { children, journey, loading, reload } = useParentData();
  const { read, showPrompt, setShowPrompt } = useTTS();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [digest, setDigest] = useState<ParentDigest | null>(null);
  const [digestLoading, setDigestLoading] = useState(false);
  const [dna, setDna] = useState<PreferenceModel | null>(null);
  const [dnaLoading, setDnaLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const child: ChildSummary | undefined = selectedChildId
    ? children.find(c => c.id === selectedChildId)
    : children[0];

  useEffect(() => {
    if (!child?.id) return;
    setDigest(null);
    setDigestLoading(true);
    getParentDigest(child.id, child.name, child.age_group as AgeGroup)
      .then(d => {
        setDigest(d);
        setDigestLoading(false);
      })
      .catch(() => setDigestLoading(false));
  }, [child?.id]);

  // Family "Health DNA" — best-effort, deterministic, no AI call.
  useEffect(() => {
    if (!child?.id) return;
    let cancelled = false;
    setDna(null);
    setDnaLoading(true);
    computePreferenceModel(child.id)
      .then(model => {
        if (!cancelled) {
          setDna(model);
          setDnaLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setDnaLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [child?.id]);

  const focusPillar = journey?.focusPillar ?? 'nutrition';
  const pillars: Pillar[] = ['nutrition', 'movement', 'sleep', 'confidence'];

  if (loading) {
    return (
      <View style={d.centered}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <SafeAreaView style={d.safe}>
      <TTSInstallPrompt
        visible={showPrompt}
        onClose={() => setShowPrompt(false)}
      />
      <ScrollView
        style={d.screen}
        contentContainerStyle={d.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={d.header}>
          <Text style={d.title}>Family Dashboard</Text>
          <Text style={d.subtitle}>Detailed progress & parent tools</Text>
        </View>

        {/* Child selector */}
        {children.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={d.tabsScroll}
          >
            <View style={d.tabs}>
              {children.map(c => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => setSelectedChildId(c.id)}
                  style={[
                    d.tab,
                    (selectedChildId ?? children[0].id) === c.id && d.tabActive,
                  ]}
                >
                  <Text
                    style={[
                      d.tabText,
                      (selectedChildId ?? children[0].id) === c.id &&
                        d.tabTextActive,
                    ]}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {child && (
          <>
            {/* Progressive profiling — at most one micro-question every few days */}
            <MicroQuestionCard childId={child.id} />

            {/* Pillar bars */}
            <View style={d.sectionCard}>
              <Text style={d.sectionTitle}>Pillar Scores — {child.name}</Text>
              {pillars.map(p => (
                <PillarBar
                  key={p}
                  pillar={p}
                  score={child.pillarScores[p]}
                  isFocus={p === focusPillar}
                />
              ))}
            </View>

            {/* Family Preference — "Health DNA" */}
            <View style={d.sectionCard}>
              <View style={d.dnaHeader}>
                <Dna size={16} color="#7c3aed" />
                <Text style={[d.sectionTitle, { marginBottom: 0 }]}>
                  Family Health DNA
                </Text>
              </View>
              {!dnaLoading && dna && (
                <Text style={d.coachLine}>{buildCoachLine(dna)}</Text>
              )}
              {dnaLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#7c3aed"
                  style={{ marginTop: 14 }}
                />
              ) : dna?.hasSignal ? (
                <>
                  {dna.topCuisines.length > 0 && (
                    <View style={d.dnaGroup}>
                      <Text style={d.dnaGroupLabel}>Food we lean towards</Text>
                      {dna.topCuisines.map((c, i) => (
                        <View key={c.label} style={d.dnaRow}>
                          <Text style={d.dnaRowLabel}>
                            {titleCase(c.label)}
                          </Text>
                          <View style={d.dnaRowBar}>
                            <ProgressBar
                              value={c.pct}
                              total={100}
                              color={CUISINE_COLORS[i % CUISINE_COLORS.length]}
                            />
                          </View>
                          <Text style={d.dnaRowPct}>{c.pct}%</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {dna.topActivities.length > 0 && (
                    <View style={d.dnaGroup}>
                      <Text style={d.dnaGroupLabel}>How we like to move</Text>
                      {dna.topActivities.map((a, i) => (
                        <View key={a.label} style={d.dnaRow}>
                          <Text style={d.dnaRowLabel}>
                            {titleCase(a.label)}
                          </Text>
                          <View style={d.dnaRowBar}>
                            <ProgressBar
                              value={a.pct}
                              total={100}
                              color={
                                ACTIVITY_COLORS[i % ACTIVITY_COLORS.length]
                              }
                            />
                          </View>
                          <Text style={d.dnaRowPct}>{a.pct}%</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <Text style={d.dnaNote}>
                    Built from your swipes, choices and what {child.name}{' '}
                    actually enjoys — it sharpens as you go.
                  </Text>
                </>
              ) : (
                <View style={d.dnaEmpty}>
                  <Text style={d.dnaEmptyEmoji}>🧬</Text>
                  <Text style={d.dnaEmptyText}>
                    We're still learning your family. As you swipe meals, pick
                    activities and complete quests, {child.name}'s Health DNA
                    will appear here.
                  </Text>
                </View>
              )}
            </View>

            {/* Activity Arena Progress — qualitative, never raw minutes */}
            {(() => {
              const arena = buildArenaStats(child);
              return (
                <View style={d.sectionCard}>
                  <View style={d.dnaHeader}>
                    <Activity size={16} color="#ea580c" />
                    <Text style={[d.sectionTitle, { marginBottom: 0 }]}>
                      Activity Arena Progress
                    </Text>
                  </View>
                  <View style={d.arenaStatsRow}>
                    <View style={d.arenaStat}>
                      <Flame size={18} color="#f97316" />
                      <Text style={d.arenaStatValue}>{arena.streak}</Text>
                      <Text style={d.arenaStatLabel}>day streak</Text>
                    </View>
                    <View style={d.arenaStat}>
                      <Text style={d.arenaStatEmoji}>⚡</Text>
                      <Text style={d.arenaStatValue}>{arena.activeDays}/7</Text>
                      <Text style={d.arenaStatLabel}>active days</Text>
                    </View>
                  </View>
                  {arena.movers.length > 0 ? (
                    <View style={d.arenaMovers}>
                      {arena.movers.map(m => (
                        <View key={m.pillar} style={d.arenaMoverRow}>
                          <Text style={d.arenaMoverEmoji}>
                            {PILLAR_CONFIG[m.pillar].emoji}
                          </Text>
                          <Text style={d.arenaMoverText}>
                            {PILLAR_CONFIG[m.pillar].label} skills
                          </Text>
                          <View style={d.arenaMoverBadge}>
                            <TrendingUp size={12} color="#16a34a" />
                            <Text style={d.arenaMoverDelta}>+{m.delta}%</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={d.arenaNote}>
                      Complete a few quests this week to see {child.name}'s
                      skills climb.
                    </Text>
                  )}
                </View>
              );
            })()}

            {/* Weekly AI Insight */}
            {(digestLoading || digest) && (
              <View style={d.sectionCard}>
                <View style={d.insightHeader}>
                  <Sparkles size={15} color="#7c3aed" />
                  <Text style={[d.sectionTitle, { marginBottom: 0 }]}>
                    Weekly Insight
                  </Text>
                  <Text style={d.insightPowered}>AI coach</Text>
                  {digest && (
                    <TouchableOpacity
                      onPress={() =>
                        read(
                          `${digest.summary} ${digest.patterns.join('. ')} ${
                            digest.suggestion
                              ? 'Suggestion: ' + digest.suggestion
                              : ''
                          }`,
                        )
                      }
                      style={{ padding: 4, marginLeft: 4 }}
                    >
                      <Volume2 size={16} color="#7c3aed" />
                    </TouchableOpacity>
                  )}
                </View>
                {digestLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="#7c3aed"
                    style={{ marginTop: 14 }}
                  />
                ) : digest ? (
                  <>
                    <Text style={d.insightSummary}>{digest.summary}</Text>
                    {digest.patterns.length > 0 && (
                      <View style={d.insightPatterns}>
                        {digest.patterns.map((p, i) => (
                          <View key={i} style={d.insightPattern}>
                            <Text style={d.insightBullet}>•</Text>
                            <Text style={d.insightPatternText}>{p}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    {digest.suggestion ? (
                      <View style={d.insightSuggestion}>
                        <Text style={d.insightSuggestionLabel}>
                          Try this week
                        </Text>
                        <Text style={d.insightSuggestionText}>
                          {digest.suggestion}
                        </Text>
                      </View>
                    ) : null}
                    {digest.alerts.filter(Boolean).map((a, i) => (
                      <View key={i} style={d.insightAlert}>
                        <Text style={d.insightAlertText}>⚠️ {a}</Text>
                      </View>
                    ))}
                  </>
                ) : null}
              </View>
            )}

            {/* Score history */}
            {child.pillarHistory.length > 1 && (
              <View style={d.sectionCard}>
                <Text style={d.sectionTitle}>Progress Over Time</Text>
                {child.pillarHistory.slice(0, 4).map((week, i) => (
                  <View key={i} style={d.historyRow}>
                    <Text style={d.historyWeek}>
                      {i === 0
                        ? 'This week'
                        : `${i} week${i > 1 ? 's' : ''} ago`}
                    </Text>
                    <View style={d.historyScores}>
                      {pillars.map(p => {
                        const key = `${p}_score` as keyof typeof week;
                        const val = (week[key] as number) ?? 0;
                        return (
                          <View
                            key={p}
                            style={[
                              d.historyDot,
                              { backgroundColor: scoreColor(val) },
                            ]}
                          >
                            <Text style={d.historyDotText}>{val}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                ))}
                <View style={d.historyLegend}>
                  {pillars.map(p => (
                    <View key={p} style={d.legendItem}>
                      <Text style={d.legendEmoji}>
                        {PILLAR_CONFIG[p].emoji}
                      </Text>
                      <Text style={d.legendText}>
                        {PILLAR_CONFIG[p].label.slice(0, 3)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Family Journey */}
            {journey && (
              <View style={d.sectionCard}>
                <Text style={d.sectionTitle}>Family Journey</Text>
                <LinearGradient
                  colors={['#1e3a5f', '#3b82f6']}
                  style={d.journeyBanner}
                >
                  <Text style={d.journeyPhase}>
                    Phase {journey.phase} — {journey.phaseLabel}
                  </Text>
                  <Text style={d.journeyWeek}>Week {journey.weekNumber}</Text>
                </LinearGradient>

                {([1, 2, 3] as const).map(phase => (
                  <View
                    key={phase}
                    style={[
                      d.phaseRow,
                      journey.phase === phase && d.phaseRowActive,
                    ]}
                  >
                    <View
                      style={[
                        d.phaseNumCircle,
                        journey.phase > phase && d.phaseNumDone,
                        journey.phase === phase && d.phaseNumCurrent,
                      ]}
                    >
                      {journey.phase > phase ? (
                        <Text style={d.phaseNumText}>✓</Text>
                      ) : (
                        <Text style={d.phaseNumText}>{phase}</Text>
                      )}
                    </View>
                    <View style={d.phaseText}>
                      <Text
                        style={[
                          d.phaseName,
                          journey.phase === phase && {
                            color: '#1e3a5f',
                            fontWeight: '800',
                          },
                        ]}
                      >
                        Phase {phase}: {PHASE_NAMES[phase]}
                      </Text>
                      <Text style={d.phaseDesc}>{PHASE_DESCS[phase]}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Mood summary (10-12 only — from trend, not raw) */}
            {child.age_group === '10-12' && (
              <View style={d.sectionCard}>
                <View style={d.moodHeader}>
                  <Text style={d.sectionTitle}>Wellbeing Trend</Text>
                  <Text style={d.moodPrivacyNote}>
                    🔒 Trend only — not raw entries
                  </Text>
                </View>
                <View style={d.moodBars}>
                  {pillars
                    .filter(p => p === 'confidence' || p === 'sleep')
                    .map(p => {
                      const score = child.pillarScores[p];
                      return (
                        <View key={p} style={d.moodBarRow}>
                          <Text style={d.moodBarLabel}>
                            {PILLAR_CONFIG[p].label}
                          </Text>
                          <View style={d.moodBarTrack}>
                            <View
                              style={[
                                d.moodBarFill,
                                {
                                  width: `${score}%`,
                                  backgroundColor: scoreColor(score),
                                },
                              ]}
                            />
                          </View>
                          <Text
                            style={[
                              d.moodBarScore,
                              { color: scoreColor(score) },
                            ]}
                          >
                            {score}%
                          </Text>
                        </View>
                      );
                    })}
                </View>
                <Text style={d.moodNote}>
                  Scores derived from completed missions and weekly check-ins —
                  not from journal entries.
                </Text>
              </View>
            )}
          </>
        )}

        {/* Parent tools grid */}
        <Text style={d.toolsTitle}>Parent Tools</Text>
        <View style={d.grid}>
          {TOOLS.map((tool, i) => (
            <Pressable
              key={i}
              style={d.gridItem}
              onPress={() => {
                if (tool.route === 'BarrierSolver') {
                  const c = child ?? children[0];
                  if (c)
                    navigation.navigate('BarrierSolver', {
                      childName: c.name,
                      pillar: focusPillar,
                    });
                } else {
                  navigation.navigate(tool.route as any);
                }
              }}
            >
              <View style={[d.toolCard, { backgroundColor: tool.color }]}>
                <tool.Icon size={22} color={tool.iconColor} />
                <Text style={d.toolLabel}>{tool.label}</Text>
                <Text style={d.toolDesc}>{tool.desc}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Support */}
        <View style={d.sectionCard}>
          <View style={d.supportHeader}>
            <Heart size={16} color="#ec4899" />
            <Text style={d.sectionTitle}>Support & Guidance</Text>
          </View>
          {[
            {
              label: 'Handling resistance to new foods',
              screen: 'HandlingResistance',
            },
            {
              label: 'Supportive responses guide',
              screen: 'SupportiveResponses',
            },
            { label: 'Difficult behaviour tips', screen: 'DifficultBehaviors' },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={d.supportBtn}
              onPress={() => navigation.navigate(item.screen as any)}
            >
              <Text style={d.supportBtnText}>{item.label}</Text>
              <ChevronRight size={16} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PHASE_NAMES: Record<1 | 2 | 3, string> = {
  1: 'Build Foundations',
  2: 'Build Confidence',
  3: 'Master Habits',
};
const PHASE_DESCS: Record<1 | 2 | 3, string> = {
  1: 'Establish breakfast, water and activity habits',
  2: 'Introduce new foods, family movement, independent choices',
  3: 'Consistency, resilience and long-term mastery',
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const d = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  screen: { flex: 1 },
  content: { padding: 20, paddingTop: 16, paddingBottom: 40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 2 },

  tabsScroll: { marginBottom: 16 },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tabActive: { backgroundColor: '#1e3a5f', borderColor: '#1e3a5f' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  tabTextActive: { color: '#fff' },

  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
  },

  pillarBar: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  pillarBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  pillarBarEmoji: { fontSize: 26 },
  pillarBarName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  focusTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f97316',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  pillarBarRight: {
    position: 'absolute',
    top: 14,
    right: 14,
    alignItems: 'flex-end',
  },
  pillarBarScore: { fontSize: 22, fontWeight: '900' },
  pillarBarLabel: { fontSize: 11, fontWeight: '600' },
  pillarBarTrack: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  pillarBarFill: { height: '100%', borderRadius: 3 },

  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  historyWeek: { fontSize: 13, color: '#6b7280', width: 90 },
  historyScores: { flexDirection: 'row', gap: 6 },
  historyDot: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyDotText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  historyLegend: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 4,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendEmoji: { fontSize: 14 },
  legendText: { fontSize: 11, color: '#9ca3af' },

  journeyBanner: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  journeyPhase: { fontSize: 16, fontWeight: '800', color: '#fff' },
  journeyWeek: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
  },
  phaseRowActive: { backgroundColor: '#eff6ff' },
  phaseNumCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseNumCurrent: { backgroundColor: '#1e3a5f' },
  phaseNumDone: { backgroundColor: '#22c55e' },
  phaseNumText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  phaseText: { flex: 1 },
  phaseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 2,
  },
  phaseDesc: { fontSize: 12, color: '#9ca3af', lineHeight: 17 },

  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  moodPrivacyNote: { fontSize: 11, color: '#6b7280' },
  moodBars: { gap: 12 },
  moodBarRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  moodBarLabel: {
    width: 80,
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  moodBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  moodBarFill: { height: '100%', borderRadius: 4 },
  moodBarScore: {
    width: 36,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
  moodNote: { fontSize: 12, color: '#9ca3af', marginTop: 12, lineHeight: 17 },

  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  insightPowered: {
    fontSize: 11,
    color: '#7c3aed',
    fontWeight: '600',
    marginLeft: 'auto' as any,
  },
  insightSummary: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 12,
  },
  insightPatterns: { gap: 6, marginBottom: 12 },
  insightPattern: { flexDirection: 'row', gap: 6 },
  insightBullet: { fontSize: 14, color: '#7c3aed', lineHeight: 22 },
  insightPatternText: {
    fontSize: 13,
    color: '#4b5563',
    flex: 1,
    lineHeight: 20,
  },
  insightSuggestion: {
    backgroundColor: '#f5f3ff',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#7c3aed',
    marginBottom: 10,
  },
  insightSuggestionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7c3aed',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  insightSuggestionText: { fontSize: 14, color: '#374151', lineHeight: 20 },
  insightAlert: {
    backgroundColor: '#fefce8',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fde047',
    marginTop: 6,
  },
  insightAlertText: { fontSize: 13, color: '#713f12' },

  dnaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  coachLine: {
    fontSize: 14,
    lineHeight: 21,
    color: '#4b5563',
    marginBottom: 16,
  },
  dnaGroup: { marginBottom: 16 },
  dnaGroupLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  dnaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  dnaRowLabel: { width: 90, fontSize: 13, color: '#374151', fontWeight: '600' },
  dnaRowBar: { flex: 1 },
  dnaRowPct: {
    width: 38,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'right',
  },
  dnaNote: { fontSize: 12, color: '#9ca3af', lineHeight: 17 },
  dnaEmpty: { alignItems: 'center', paddingVertical: 8 },
  dnaEmptyEmoji: { fontSize: 32, marginBottom: 8 },
  dnaEmptyText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
    textAlign: 'center',
  },

  arenaStatsRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  arenaStat: {
    flex: 1,
    backgroundColor: '#fff7ed',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 2,
  },
  arenaStatEmoji: { fontSize: 18 },
  arenaStatValue: { fontSize: 22, fontWeight: '900', color: '#111827' },
  arenaStatLabel: { fontSize: 11, color: '#6b7280', fontWeight: '600' },
  arenaMovers: { gap: 8 },
  arenaMoverRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  arenaMoverEmoji: { fontSize: 18 },
  arenaMoverText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  arenaMoverBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  arenaMoverDelta: { fontSize: 13, fontWeight: '800', color: '#16a34a' },
  arenaNote: { fontSize: 12, color: '#9ca3af', lineHeight: 17 },

  toolsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 14 },
  gridItem: { width: '47%' },
  toolCard: { borderRadius: 16, padding: 16, gap: 8 },
  toolLabel: { fontSize: 14, fontWeight: '700', color: '#111827' },
  toolDesc: { fontSize: 12, color: '#6b7280', lineHeight: 16 },

  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  supportBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  supportBtnText: { flex: 1, fontSize: 14, color: '#374151' },
});
