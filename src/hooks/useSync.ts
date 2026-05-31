import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useChild } from '../context/ChildContext';
import {
  syncMissionComplete,
  syncBadgeEarned,
  syncFoodLog,
  syncMoodLog,
  syncGameScore,
  useStreakFreeze,
  Pillar,
} from '../services/syncService';
import { writeWeeklyPillarSnapshot } from '../services/pillarScore';

export function useSync() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { activeChild, setActiveChild } = useChild();
  const childId = activeChild?.id ?? null;

  const completeMission = useCallback(
    async (
      missionId: string,
      missionTitle: string,
      pillar: Pillar,
      xpEarned: number = 10,
    ) => {
      if (!childId) return;

      const milestone = await syncMissionComplete(childId, missionId, missionTitle, pillar, xpEarned);

      // Refresh XP in context immediately
      if (activeChild && setActiveChild) {
        setActiveChild({
          ...activeChild,
          xp: activeChild.xp + xpEarned,
          streak: activeChild.streak + 1,
        });
      }

      // Write pillar snapshot (idempotent upsert)
      writeWeeklyPillarSnapshot(childId).catch(() => {});

      // Navigate to milestone celebration if one was just hit
      if (milestone) {
        navigation.navigate('StreakMilestone', { milestone: milestone.days });
      }
    },
    [childId, activeChild, setActiveChild, navigation],
  );

  const earnBadge = useCallback(
    async (badgeId: string, badgeName: string) => {
      if (!childId) return;
      await syncBadgeEarned(childId, badgeId, badgeName);
    },
    [childId],
  );

  const logFood = useCallback(
    async (foodItem: string, action: 'tried' | 'liked' | 'skipped' | 'repeated') => {
      if (!childId) return;
      await syncFoodLog(childId, foodItem, action);
    },
    [childId],
  );

  const logMood = useCallback(
    async (moodLevel: number, energyLevel: number) => {
      if (!childId) return;
      await syncMoodLog(childId, moodLevel, energyLevel);
    },
    [childId],
  );

  const logGameScore = useCallback(
    async (gameId: string, score: number) => {
      if (!childId) return;
      await syncGameScore(childId, gameId, score);
    },
    [childId],
  );

  const applyStreakFreeze = useCallback(async (): Promise<boolean> => {
    if (!childId) return false;
    return useStreakFreeze(childId);
  }, [childId]);

  return {
    completeMission,
    earnBadge,
    logFood,
    logMood,
    logGameScore,
    applyStreakFreeze,
    childId,
    activeChild,
  };
}
