import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { MotiView, useAnimationState } from 'moti';
import { Leaf } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AppSplashScreen({ onFinish }) {
  // Animation state for the exit transition
  const transitionState = useAnimationState({
    visible: {
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: 1.1,
    },
  });

  // Optional: Auto-trigger exit if you aren't controlling it from App.js
  useEffect(() => {
    if (onFinish) {
      const timer = setTimeout(() => {
        transitionState.transitionTo('exit');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-950 items-center justify-center">
      <StatusBar barStyle="light-content" />
      
      <MotiView state={transitionState} transition={{ type: 'timing', duration: 800 }}>
        
        {/* Animated Brand Icon */}
        <MotiView
          from={{ opacity: 0, scale: 0.3, rotate: '-10deg' }}
          animate={{ opacity: 1, scale: 1, rotate: '0deg' }}
          transition={{ 
            type: 'spring', 
            damping: 15, 
            mass: 1,
            stiffness: 100 
          }}
          className="self-center w-28 h-28 bg-emerald-500 rounded-[35px] items-center justify-center shadow-2xl shadow-emerald-500/60"
        >
          <Leaf size={52} color="white" fill="white" />
        </MotiView>

        {/* Brand Text with Staggered Fade-in */}
        <View className="mt-8 items-center">
          <MotiView
            from={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 400, type: 'timing', duration: 600 }}
          >
            <Text className="text-white text-4xl font-extrabold tracking-tighter">
              Lawn<Text className="text-emerald-500">Tamers</Text>
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 800, duration: 800 }}
          >
            <Text className="text-slate-500 uppercase tracking-[6px] text-[11px] mt-2 font-bold ml-1">
              Professional Edition
            </Text>
          </MotiView>
        </View>

      </MotiView>

      {/* Modern Loading Indicator (Subtle Pulse) */}
      <View className="absolute bottom-24 items-center">
        <View className="w-48 h-[3px] bg-slate-900 rounded-full overflow-hidden">
          <MotiView
            from={{ translateX: -192 }}
            animate={{ translateX: 192 }}
            transition={{ 
              loop: true, 
              duration: 1500, 
              type: 'timing',
              easing: (t) => t * (2 - t) // Ease out effect
            }}
            className="h-full w-full bg-emerald-500"
          />
        </View>
        <MotiView
          from={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{ loop: true, type: 'timing', duration: 1000 }}
        >
          <Text className="text-slate-600 text-[10px] mt-4 font-medium uppercase tracking-widest">
            Initializing System
          </Text>
        </MotiView>
      </View>
    </SafeAreaView>
  );
}