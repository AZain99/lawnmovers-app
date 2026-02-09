import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Internal Component Imports
import AppSplashScreen from './AppSplashScreen'; 
import JobDashboard from './jobdashboard'; 

// Keep the native splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // --- INITIALIZATION TASKS ---
        // Load fonts, icons, or cache images from Figma here.
        // For now, we use a synthetic delay to simulate the loading process.
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn("Initialization Error:", e);
      } finally {
        // Tell the app the heavy lifting is done
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  /**
   * This is triggered the moment the root view layouts.
   * It ensures the native splash hides only when the custom splash is ready to render.
   */
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Logic to transition from animated splash to the actual app
  const handleSplashFinish = () => {
    setShowAnimatedSplash(false);
  };

  // While assets are loading, we stay on the native splash (null allows native to stay)
  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      {showAnimatedSplash ? (
        // Pass the onFinish callback to your AppSplashScreen component
        <AppSplashScreen onFinish={handleSplashFinish} />
      ) : (
        <JobDashboard />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', // Match your Slate-950 splash background
  },
});