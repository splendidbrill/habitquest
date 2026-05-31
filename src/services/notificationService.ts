import notifee, {
  AuthorizationStatus,
  AndroidImportance,
  AndroidVisibility,
  TriggerType,
  TimestampTrigger,
  RepeatFrequency,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

// ─── Channel IDs ──────────────────────────────────────────────────────────────
const CHANNEL_DAILY    = 'habitquest-daily';
const CHANNEL_STREAKS  = 'habitquest-streaks';
const CHANNEL_FAMILY   = 'habitquest-family';
const CHANNEL_REWARDS  = 'habitquest-rewards';

// ─── Notification type identifiers ───────────────────────────────────────────
export const NOTIF_TYPES = {
  MORNING_NUDGE:     'morning_nudge',
  AFTER_SCHOOL:      'after_school',
  EVENING_CHECK:     'evening_check',
  STREAK_AT_RISK:    'streak_at_risk',
  MISSION_COMPLETE:  'mission_complete',
  PARENT_REACTION:   'parent_reaction',
  BONUS_CHALLENGE:   'bonus_challenge',
  STREAK_MILESTONE:  'streak_milestone',
} as const;

// ─── Setup: create Android channels ──────────────────────────────────────────
export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await notifee.createChannel({
    id: CHANNEL_DAILY,
    name: 'Daily Nudges',
    importance: AndroidImportance.DEFAULT,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'default',
  });

  await notifee.createChannel({
    id: CHANNEL_STREAKS,
    name: 'Streak Alerts',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'default',
  });

  await notifee.createChannel({
    id: CHANNEL_FAMILY,
    name: 'Family Activity',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'default',
  });

  await notifee.createChannel({
    id: CHANNEL_REWARDS,
    name: 'Rewards & Milestones',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'default',
  });
}

// ─── Request permissions ──────────────────────────────────────────────────────
export async function requestNotificationPermissions(): Promise<boolean> {
  const settings = await notifee.requestPermission();

  if (
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
  ) {
    return true;
  }
  return false;
}

// ─── Register FCM token + save to Supabase ────────────────────────────────────
export async function registerPushToken(): Promise<void> {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) return;

    const token = await messaging().getToken();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !token) return;

    await supabase.from('push_tokens').upsert(
      {
        user_id:  user.id,
        token,
        platform: Platform.OS as 'ios' | 'android',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,platform' },
    );
  } catch {
    // Firebase not configured — skip silently
  }
}

// ─── Register child device token (links token to child profile) ───────────────
export async function registerChildPushToken(childId: string): Promise<void> {
  try {
    const token = await messaging().getToken();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !token) return;

    await supabase.from('push_tokens').upsert(
      {
        user_id:   user.id,
        token,
        platform:  Platform.OS as 'ios' | 'android',
        child_id:  childId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,platform' },
    );
  } catch {
    // Firebase not configured — skip silently
  }
}

// ─── Schedule daily ritual notifications ─────────────────────────────────────
// Called once after sign-in. Notifee handles repeat automatically.
export async function scheduleDailyNotifications(childName: string): Promise<void> {
  // Cancel any existing daily notifications first
  await cancelDailyNotifications();

  const now = new Date();

  // Morning: 8:00 AM
  const morning = triggerAtHour(8, 0);
  await notifee.createTriggerNotification(
    {
      id:    NOTIF_TYPES.MORNING_NUDGE,
      title: `Good morning, ${childName}! ☀️`,
      body:  "Today's mission is waiting for you. Let's go! 🎯",
      android: { channelId: CHANNEL_DAILY, smallIcon: 'ic_launcher', pressAction: { id: 'default' } },
    },
    { type: TriggerType.TIMESTAMP, timestamp: morning, repeatFrequency: RepeatFrequency.DAILY },
  );

  // After school: 4:00 PM
  const afterSchool = triggerAtHour(16, 0);
  await notifee.createTriggerNotification(
    {
      id:    NOTIF_TYPES.AFTER_SCHOOL,
      title: `Hey ${childName}! ⚡`,
      body:  "Quick challenge waiting for you — just 2 minutes!",
      android: { channelId: CHANNEL_DAILY, smallIcon: 'ic_launcher', pressAction: { id: 'default' } },
    },
    { type: TriggerType.TIMESTAMP, timestamp: afterSchool, repeatFrequency: RepeatFrequency.DAILY },
  );

  // Evening: 8:00 PM
  const evening = triggerAtHour(20, 0);
  await notifee.createTriggerNotification(
    {
      id:    NOTIF_TYPES.EVENING_CHECK,
      title: `Evening check-in, ${childName} 🌙`,
      body:  "Lock in your streak before bed. You've got this! 🔥",
      android: { channelId: CHANNEL_DAILY, smallIcon: 'ic_launcher', pressAction: { id: 'default' } },
    },
    { type: TriggerType.TIMESTAMP, timestamp: evening, repeatFrequency: RepeatFrequency.DAILY },
  );
}

// ─── Streak at-risk: schedule for 7:30 PM, cancel if mission done ─────────────
export async function scheduleStreakAtRiskWarning(
  childName: string,
  streakDays: number,
): Promise<void> {
  if (streakDays < 2) return; // Don't warn for new streaks

  const trigger730pm = triggerAtHour(19, 30);
  await notifee.createTriggerNotification(
    {
      id:    NOTIF_TYPES.STREAK_AT_RISK,
      title: `⚠️ Streak at risk, ${childName}!`,
      body:  `You have a ${streakDays}-day streak — complete a mission before midnight to keep it!`,
      android: { channelId: CHANNEL_STREAKS, smallIcon: 'ic_launcher', importance: AndroidImportance.HIGH, pressAction: { id: 'default' } },
    },
    { type: TriggerType.TIMESTAMP, timestamp: trigger730pm },
  );
}

export async function cancelStreakAtRiskWarning(): Promise<void> {
  await notifee.cancelNotification(NOTIF_TYPES.STREAK_AT_RISK);
}

// ─── Streak milestone local notification ─────────────────────────────────────
export async function showStreakMilestoneNotification(
  childName: string,
  days: number,
  reward: string,
): Promise<void> {
  await notifee.displayNotification({
    title: `🏆 ${days}-Day Streak, ${childName}!`,
    body:  `You just unlocked: ${reward}`,
    android: { channelId: CHANNEL_REWARDS, smallIcon: 'ic_launcher', importance: AndroidImportance.HIGH, pressAction: { id: 'default' } },
  });
}

// ─── Cancel all daily notifications ──────────────────────────────────────────
export async function cancelDailyNotifications(): Promise<void> {
  await Promise.all([
    notifee.cancelNotification(NOTIF_TYPES.MORNING_NUDGE),
    notifee.cancelNotification(NOTIF_TYPES.AFTER_SCHOOL),
    notifee.cancelNotification(NOTIF_TYPES.EVENING_CHECK),
  ]);
}

// ─── Remote: notify parent via Edge Function ─────────────────────────────────
// Called when a child completes a mission
export async function notifyParentMissionComplete(
  parentUserId: string,
  childName: string,
  missionTitle: string,
): Promise<void> {
  try {
    await supabase.functions.invoke('send-notification', {
      body: {
        recipientUserId: parentUserId,
        type:            NOTIF_TYPES.MISSION_COMPLETE,
        title:           `⭐ ${childName} completed a mission!`,
        body:            `"${missionTitle}" — tap to see their progress`,
      },
    });
  } catch {
    // Edge function not deployed yet — skip silently
  }
}

// ─── Remote: notify child of parent reaction ─────────────────────────────────
export async function notifyChildParentReaction(
  childUserId: string,
  parentName: string,
  reaction: string,
): Promise<void> {
  const reactionEmoji: Record<string, string> = {
    fire: '🔥', star: '⭐', highfive: '🙌', bonus_xp: '⚡',
  };

  try {
    await supabase.functions.invoke('send-notification', {
      body: {
        recipientUserId: childUserId,
        type:            NOTIF_TYPES.PARENT_REACTION,
        title:           `${reactionEmoji[reaction] ?? '❤️'} ${parentName} reacted!`,
        body:            `Your parent sent you a ${reaction} — they're proud of you!`,
      },
    });
  } catch {
    // Edge function not deployed yet — skip silently
  }
}

// ─── Remote: bonus challenge drop ─────────────────────────────────────────────
export async function notifyBonusChallengeAvailable(
  childUserId: string,
  childName: string,
): Promise<void> {
  try {
    await supabase.functions.invoke('send-notification', {
      body: {
        recipientUserId: childUserId,
        type:            NOTIF_TYPES.BONUS_CHALLENGE,
        title:           `⚡ Bonus challenge just dropped, ${childName}!`,
        body:            'A special challenge is available for the next 2 hours — open the app now!',
      },
    });
  } catch {
    // Edge function not deployed yet — skip silently
  }
}

// ─── Handle incoming FCM messages (foreground) ───────────────────────────────
export function setupForegroundMessageHandler(): () => void {
  try {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const { title, body } = remoteMessage.notification ?? {};
      if (!title) return;

      await notifee.displayNotification({
        title,
        body:    body ?? '',
        android: { channelId: CHANNEL_FAMILY, smallIcon: 'ic_launcher', importance: AndroidImportance.HIGH, pressAction: { id: 'default' } },
      });
    });
    return unsubscribe;
  } catch {
    return () => {};
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function triggerAtHour(hour: number, minute: number): number {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  // If that time has already passed today, schedule for tomorrow
  if (d.getTime() <= Date.now()) {
    d.setDate(d.getDate() + 1);
  }
  return d.getTime();
}
