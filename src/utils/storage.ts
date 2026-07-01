import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys owned by Supabase's auth layer must survive a local-data wipe,
// otherwise clearing app data would destroy the active session token.
// supabase-js stores its session under keys prefixed "sb-" (v2) and the
// legacy "supabase.auth.*" (v1). Preserve both to be safe.
function isPreservedKey(key: string): boolean {
  return key.startsWith('sb-') || key.includes('supabase');
}

export const storage = {
  setItem: async (key: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value);
  },
  getItem: async (key: string): Promise<string | null> => {
    return AsyncStorage.getItem(key);
  },
  removeItem: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },
  /**
   * Wipe all app-local cached data (onboarding answers, weekly plans,
   * swipe preferences, avatar flags, active child, etc.) while keeping the
   * Supabase auth session keys intact. Called on sign-out and when a
   * different user signs in, so one account never inherits another
   * account's data on the same device.
   */
  clearAppData: async (): Promise<void> => {
    const keys = await AsyncStorage.getAllKeys();
    const toRemove = keys.filter(k => !isPreservedKey(k));
    if (toRemove.length) await AsyncStorage.multiRemove(toRemove);
  },
};
