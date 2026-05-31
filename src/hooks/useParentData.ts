import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { loadPillarHistory, getCurrentFocusPillar, getCurrentPhase } from '../services/pillarScore';
import type { Pillar } from '../services/syncService';

export type ChildSummary = {
  id: string;
  name: string;
  age_group: string;
  xp: number;
  level: string;
  streak: number;
  streak_freezes: number;
  last_active_date: string | null;
  created_at: string;
  pillarScores: Record<Pillar, number>;
  badges: { badge_id: string; badge_name: string; earned_at: string }[];
  recentMissions: {
    mission_id: string;
    mission_title: string;
    pillar: Pillar;
    xp_earned: number;
    completed_at: string;
  }[];
  pillarHistory: any[];
  checkinDoneThisWeek: boolean;
};

export type FamilyJourney = {
  phase: 1 | 2 | 3;
  phaseLabel: string;
  focusPillar: Pillar;
  weekNumber: number;
  familyStartDate: string;
};

const PHASE_LABELS: Record<number, string> = {
  1: 'Build Foundations',
  2: 'Build Confidence',
  3: 'Master Habits',
};

const PILLAR_LABELS: Record<Pillar, string> = {
  nutrition:  '🥕 Nutrition Week',
  movement:   '⚽ Movement Week',
  sleep:      '😴 Sleep Week',
  confidence: '🧠 Confidence Week',
};

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(new Date().setDate(diff)).toISOString().split('T')[0];
}

export function useParentData() {
  const { user } = useAuth();
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [journey, setJourney] = useState<FamilyJourney | null>(null);
  const [parentName, setParentName] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // 1. Load parent profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, family_code, created_at')
      .eq('id', user.id)
      .single();

    if (profile?.full_name) setParentName(profile.full_name);
    if (profile?.family_code) setFamilyCode(profile.family_code);

    const familyStartDate = profile?.created_at
      ? profile.created_at.split('T')[0]
      : new Date().toISOString().split('T')[0];

    // 2. Load all children
    const { data: rawChildren } = await supabase
      .from('children')
      .select('*')
      .eq('parent_id', user.id)
      .order('created_at');

    if (!rawChildren?.length) {
      setLoading(false);
      return;
    }

    const weekStart = getWeekStart();

    // 3. Load data for each child in parallel
    const summaries = await Promise.all(
      rawChildren.map(async (child): Promise<ChildSummary> => {
        const [latestScore, badgesRes, missionsRes, historyRes, checkinRes] = await Promise.all([
          supabase
            .from('pillar_scores')
            .select('nutrition_score, movement_score, sleep_score, confidence_score')
            .eq('child_id', child.id)
            .order('week_start', { ascending: false })
            .limit(1)
            .single(),
          supabase
            .from('badges')
            .select('badge_id, badge_name, earned_at')
            .eq('child_id', child.id)
            .order('earned_at', { ascending: false })
            .limit(10),
          supabase
            .from('mission_completions')
            .select('mission_id, mission_title, pillar, xp_earned, completed_at')
            .eq('child_id', child.id)
            .order('completed_at', { ascending: false })
            .limit(5),
          loadPillarHistory(child.id),
          supabase
            .from('pillar_checkins')
            .select('id')
            .eq('child_id', child.id)
            .eq('week_start', weekStart)
            .single(),
        ]);

        const scores = latestScore.data ?? { nutrition_score: 0, movement_score: 0, sleep_score: 0, confidence_score: 0 };

        return {
          ...child,
          pillarScores: {
            nutrition:  scores.nutrition_score,
            movement:   scores.movement_score,
            sleep:      scores.sleep_score,
            confidence: scores.confidence_score,
          },
          badges:          badgesRes.data ?? [],
          recentMissions:  missionsRes.data ?? [],
          pillarHistory:   historyRes,
          checkinDoneThisWeek: !!checkinRes.data,
        };
      }),
    );

    setChildren(summaries);

    // 4. Family journey
    const phase = getCurrentPhase(familyStartDate);
    const focusPillar = getCurrentFocusPillar(familyStartDate);
    const weekNumber = Math.floor(
      (new Date().getTime() - new Date(familyStartDate).getTime()) /
      (7 * 24 * 60 * 60 * 1000),
    ) + 1;

    setJourney({
      phase,
      phaseLabel: PHASE_LABELS[phase],
      focusPillar,
      weekNumber,
      familyStartDate,
    });

    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  // Derive alerts
  const alerts: { childName: string; message: string; type: 'warning' | 'info' }[] = [];
  children.forEach(child => {
    const today = new Date().toISOString().split('T')[0];
    if (child.last_active_date && child.last_active_date !== today && child.streak > 2) {
      alerts.push({ childName: child.name, message: `${child.name}'s streak is at risk — no activity today`, type: 'warning' });
    }
    if (!child.checkinDoneThisWeek) {
      alerts.push({ childName: child.name, message: `Weekly check-in not done for ${child.name}`, type: 'info' });
    }
    const lowestPillar = Object.entries(child.pillarScores).sort(([, a], [, b]) => a - b)[0];
    if (lowestPillar && lowestPillar[1] < 25) {
      const labels: Record<string, string> = { nutrition: 'Nutrition', movement: 'Movement', sleep: 'Sleep', confidence: 'Confidence' };
      alerts.push({ childName: child.name, message: `${child.name}'s ${labels[lowestPillar[0]]} score is low — needs more focus`, type: 'info' });
    }
  });

  return { children, journey, parentName, familyCode, loading, alerts, reload: load };
}
