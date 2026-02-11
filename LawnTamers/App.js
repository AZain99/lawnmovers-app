import React, { useState, useEffect, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AppSplashScreen from './src/components/AppSplashScreen'; // Your splash component
import AuthScreen from './src/screens/login'; // Your login/signup component

// Prevent the native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Perform any necessary initialization here (e.g., loading fonts, checking auth tokens)
        // For now, we'll just simulate a small delay
        await new Promise(resolve => setTimeout(resolve, 1000)); 
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        // Hide the native splash screen to show your custom AppSplashScreen.jsx
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const onSplashFinish = useCallback(() => {
    // This is triggered by the 3000ms timer in your AppSplashScreen.jsx
    setShowCustomSplash(false);
  }, []);

  // 1. Keep native splash visible while app initializes
  if (!appIsReady) {
    return null;
  }

  // 2. Show your custom animated splash screen
  if (showCustomSplash) {
    return <AppSplashScreen onFinish={onSplashFinish} />;
  }

  // 3. Route to your AuthScreen (Login/Signup) after splash is done
  return (
    <AuthScreen />
  );
}