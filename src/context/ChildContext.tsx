import React, { createContext, useContext, useState, useCallback } from 'react';
import { loadChildSnapshot } from '../services/syncService';
import {
  scheduleDailyNotifications,
  registerChildPushToken,
} from '../services/notificationService';
import { flushSwipeSignals } from '../services/preferenceEngine';

export type ChildProfile = {
  id: string;
  name: string;
  age_group: '6-8' | '8-10' | '10-12';
  avatar: string | null;
  sport: string | null;
  xp: number;
  level: string;
  streak: number;
  streak_freezes: number;
  last_active_date: string | null;
};

export type EarnedBadge = {
  badge_id: string;
  badge_name: string;
  earned_at: string;
};

type ChildContextType = {
  activeChild: ChildProfile | null;
  earnedBadges: EarnedBadge[];
  setActiveChild: (child: ChildProfile | null) => void;
  refreshChild: () => Promise<void>;
};

const ChildContext = createContext<ChildContextType>({
  activeChild: null,
  earnedBadges: [],
  setActiveChild: () => {},
  refreshChild: async () => {},
});

export function ChildProvider({ children }: { children: React.ReactNode }) {
  const [activeChild, setActiveChildState] = useState<ChildProfile | null>(
    null,
  );
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);

  // When a child profile is selected, pull the latest snapshot from Supabase
  const setActiveChild = useCallback(async (child: ChildProfile | null) => {
    if (!child) {
      setActiveChildState(null);
      setEarnedBadges([]);
      return;
    }

    // Set immediately with what we have (fast)
    setActiveChildState(child);

    // Then hydrate with fresh data from Supabase (accurate)
    try {
      const snapshot = await loadChildSnapshot(child.id);
      if (snapshot.child) setActiveChildState(snapshot.child as ChildProfile);
      if (snapshot.badges) setEarnedBadges(snapshot.badges as EarnedBadge[]);
    } catch {
      // Network unavailable — keep local data
    }

    // Schedule daily notifications for this child and register their push token
    scheduleDailyNotifications(child.name).catch(() => {});
    registerChildPushToken(child.id).catch(() => {});

    // Mirror this device's onboarding food/activity swipes into preference_signals
    // now that a child row exists. Idempotent per-child (swipeSignalsFlushed flag),
    // best-effort — retries on the next selection if offline.
    flushSwipeSignals(child.id).catch(() => {});
  }, []);

  const refreshChild = useCallback(async () => {
    if (!activeChild) return;
    try {
      const snapshot = await loadChildSnapshot(activeChild.id);
      if (snapshot.child) setActiveChildState(snapshot.child as ChildProfile);
      if (snapshot.badges) setEarnedBadges(snapshot.badges as EarnedBadge[]);
    } catch {}
  }, [activeChild]);

  return (
    <ChildContext.Provider
      value={{ activeChild, earnedBadges, setActiveChild, refreshChild }}
    >
      {children}
    </ChildContext.Provider>
  );
}

export const useChild = () => useContext(ChildContext);
