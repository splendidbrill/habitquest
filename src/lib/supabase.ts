import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// `.env` is gitignored, so a release built on a machine that does not have it
// compiles these values as undefined. createClient then throws while this
// module is being imported — before any component renders — and React Native
// turns that into a fatal error, so the app dies on launch with no message on
// screen and no JS error in the crash report.
//
// Keep importing this module side-effect free instead: build the client with
// harmless placeholders when configuration is missing, and let the UI say what
// is wrong. Any request made against the placeholder simply fails.
export const isSupabaseConfigured =
  typeof SUPABASE_URL === 'string' &&
  SUPABASE_URL.length > 0 &&
  typeof SUPABASE_ANON_KEY === 'string' &&
  SUPABASE_ANON_KEY.length > 0;

export const supabase = createClient(
  isSupabaseConfigured ? SUPABASE_URL : 'https://unconfigured.invalid',
  isSupabaseConfigured ? SUPABASE_ANON_KEY : 'unconfigured',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
