import React, { createContext, useContext, useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { storage } from '../utils/storage';
import { hydrateLocalCache } from '../services/appStateSync';

// Tracks which account the locally-cached app data belongs to. When a
// different user signs in, the previous owner's cache is wiped so no one
// inherits another account's onboarding/plans/preferences on this device.
const DATA_OWNER_KEY = 'dataOwnerId';

async function reconcileLocalData(userId: string | null): Promise<void> {
  if (!userId) return; // sign-out is handled separately
  const owner = await storage.getItem(DATA_OWNER_KEY);
  if (owner && owner !== userId) {
    await storage.clearAppData();
  }
  if (owner !== userId) {
    await storage.setItem(DATA_OWNER_KEY, userId);
  }
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: string | null }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const userId = session?.user?.id ?? null;
      // Cold-start path runs outside the auth-change lock, so restoring from
      // the cloud mirror here is safe to await — the UI shows the right data
      // immediately rather than flashing the fallback first.
      await reconcileLocalData(userId);
      if (userId) await hydrateLocalCache(userId);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // NOTE: do not call Supabase methods (auth OR data queries) directly inside
    // this callback — it holds the auth lock and they deadlock. AsyncStorage is
    // safe; the cloud hydrate is deferred to the next tick to clear the lock.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const userId = session?.user?.id ?? null;
      (async () => {
        if (event === 'SIGNED_OUT') {
          await storage.clearAppData();
        } else {
          await reconcileLocalData(userId);
        }
        setSession(session);
        setUser(session?.user ?? null);
      })();
      if (event !== 'SIGNED_OUT' && userId) {
        setTimeout(() => {
          void hydrateLocalCache(userId);
        }, 0);
      }
    });

    // Handle email confirmation deep link — habitquest://#access_token=...
    const handleDeepLink = async (url: string) => {
      if (!url.includes('access_token')) return;
      const fragment = url.includes('#')
        ? url.split('#')[1]
        : url.split('?')[1];
      if (!fragment) return;
      const params = new URLSearchParams(fragment);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (accessToken && refreshToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      }
    };

    // App opened via deep link while running
    const linkSub = Linking.addEventListener('url', ({ url }) =>
      handleDeepLink(url),
    );

    // App opened cold from a deep link
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink(url);
    });

    return () => {
      subscription.unsubscribe();
      linkSub.remove();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // Clear this account's cached data so the next user starts clean.
    // (The SIGNED_OUT event also triggers this, but do it eagerly here so
    // the UI never momentarily reads the prior user's local data.)
    await storage.clearAppData();
  };

  // Permanently delete the account + all its data (Google Play requirement).
  // The edge function deletes the auth user server-side, which cascades every
  // table; then we sign out + wipe local cache on this device.
  const deleteAccount = async () => {
    const { data, error } = await supabase.functions.invoke('delete-account', {
      body: {},
    });
    if (error || !data?.success) {
      return {
        error:
          error?.message ?? 'Could not delete your account. Please try again.',
      };
    }
    await supabase.auth.signOut();
    await storage.clearAppData();
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signUp,
        signIn,
        signOut,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
