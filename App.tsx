import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation';
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
      await setupNotificationChannels();
      const granted = await requestNotificationPermissions();
      if (granted) await registerPushToken();
    })();

    // Handle notifications received while app is in foreground
    const unsubscribe = setupForegroundMessageHandler();
    return () => unsubscribe();
  }, []);

  return null;
}

function App() {
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
