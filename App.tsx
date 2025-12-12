import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider } from './src/contexts/AuthContext';
import { UserDataProvider } from './src/contexts/UserDataContext';
import { PremiumProvider } from './src/contexts/PremiumContext';
import RootNavigator from './src/navigation/RootNavigator';
import { initializeNotifications } from './src/services/notifications';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize notifications
        await initializeNotifications();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <UserDataProvider>
          <PremiumProvider>
            <NavigationContainer>
              <RootNavigator />
              <StatusBar style="light" />
            </NavigationContainer>
          </PremiumProvider>
        </UserDataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
