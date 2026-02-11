import React, { useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, StatusBar } from 'react-native';
import { MotiView, useAnimationState } from 'moti';

export default function AppSplashScreen({ onFinish }) {
  const transitionState = useAnimationState({
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      transitionState.transitionTo('exit');
      if (onFinish) setTimeout(onFinish, 800);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground 
        source={require('./assets/splash-logo.png')} 
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <MotiView state={transitionState}>
             <Text className="text-white text-5xl font-black">
               Lawn<Text className="text-emerald-500">Tamers</Text>
             </Text>
          </MotiView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});