import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, View } from 'react-native';
import { AppNavigator } from './src/navigation';
import { isSupabaseConfigured } from './src/lib/supabase';
import { AuthProvider } from './src/context/AuthContext';
import { ChildProvider } from './src/context/ChildContext';
import { colors } from './src/theme';
import {
  setupNotificationChannels,
  requestNotificationPermissions,
  registerPushToken,
  setupForegroundMessageHandler,
} from './src/services/notificationService';

function NotificationBootstrap() {
  useEffect(() => {
    // Set up channels, request permissions, register FCM token
    (async () => {
      // Notifications are optional. Never let a failure here — missing Firebase
      // config on iOS, a denied permission, an offline device — escape as an
      // unhandled rejection and take the app down on launch.
      try {
        await setupNotificationChannels();
        const granted = await requestNotificationPermissions();
        if (granted) await registerPushToken();
      } catch (error) {
        console.warn('Notification setup skipped:', error);
      }
    })();

    // Handle notifications received while app is in foreground
    const unsubscribe = setupForegroundMessageHandler();
    return () => unsubscribe();
  }, []);

  return null;
}

// Shown when a build was produced without `.env`, which otherwise looks to the
// user like the app crashing on launch for no reason.
function ConfigurationError() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 32, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
        Configuration missing
      </Text>
      <Text style={{ fontSize: 15, lineHeight: 22 }}>
        This build was created without its Supabase settings, so it cannot reach
        the server. Rebuild with SUPABASE_URL and SUPABASE_ANON_KEY present.
      </Text>
    </View>
  );
}

function App() {
  if (!isSupabaseConfigured) {
    return (
      <SafeAreaProvider>
        <ConfigurationError />
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <AuthProvider>
          <ChildProvider>
            <NavigationContainer>
              <NotificationBootstrap />
              <AppNavigator />
            </NavigationContainer>
          </ChildProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
