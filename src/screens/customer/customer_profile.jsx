import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  StatusBar 
} from "react-native";
// Using lucide-react-native for mobile
import {
  Home,
  CreditCard,
  CalendarDays,
  User,
  Sun,
  Moon,
  MapPin,
  Mail,
  Phone,
} from "lucide-react-native";

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  // Dynamic Styles based on Theme
  const containerClass = darkMode
    ? "flex-1 bg-slate-950"
    : "flex-1 bg-gray-50";

  const cardClass = darkMode
    ? "bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-4 shadow-lg"
    : "bg-white border border-gray-200 rounded-3xl p-5 mb-4 shadow-sm";

  const navClass = darkMode
    ? "absolute bottom-0 w-full bg-slate-900/95 border-t border-slate-800 py-3"
    : "absolute bottom-0 w-full bg-white/95 border-t border-gray-200 py-3";

  const textMain = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-700";
  const textTertiary = darkMode ? "text-gray-500" : "text-gray-400";

  return (
    <SafeAreaView className={containerClass}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      
      {/* Header Replacement */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800">
        <Text className={`text-xl font-bold tracking-wide ${textMain}`}>Profile</Text>
        <TouchableOpacity
          onPress={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-slate-800"
        >
          {darkMode ? (
            <Sun size={20} color="#fbbf24" />
          ) : (
            <Moon size={20} color="#374151" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24, paddingBottom: 100 }}>
        
        {/* Profile Info Section */}
        <View className={cardClass}>
          <View className="flex-row items-center gap-4 mb-5">
            <View className="h-16 w-16 rounded-full bg-emerald-600 items-center justify-center shadow-md">
              <Text className="text-white font-bold text-2xl">JG</Text>
            </View>
            <View>
              <Text className={`text-lg font-bold ${textMain}`}>John Green</Text>
              <Text className={`text-sm ${textSecondary}`}>Lawn Care Specialist</Text>
              <View className="flex-row items-center gap-1 mt-1">
                <MapPin size={14} color="#10b981" />
                <Text className={`text-sm ${textTertiary}`}>Suburbia, CA</Text>
              </View>
            </View>
          </View>

          <View className="space-y-3">
            <View className="flex-row items-center gap-3">
              <Mail size={16} color="#10b981" />
              <Text className={textSecondary}>john.green@example.com</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Phone size={16} color="#10b981" />
              <Text className={textSecondary}>+1 555 0123 456</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <MapPin size={16} color="#10b981" />
              <Text className={textSecondary}>123 Suburbia Street, CA</Text>
            </View>
          </View>
        </View>

        {/* Saved Addresses Section */}
        <View className={cardClass}>
          <View className="flex-row justify-between items-center mb-3">
            <Text className={`font-bold text-base ${textMain}`}>Saved Addresses</Text>
            <TouchableOpacity><Text className="text-emerald-500 font-bold">+ Add</Text></TouchableOpacity>
          </View>
          <View className="space-y-1">
            <Text className={textSecondary}>123 Suburbia Street, CA</Text>
            <Text className={textSecondary}>456 Park Avenue, CA</Text>
          </View>
        </View>

        {/* Payment Methods Section */}
        <View className={cardClass}>
          <View className="flex-row justify-between items-center mb-3">
            <Text className={`font-bold text-base ${textMain}`}>Payment Methods</Text>
            <TouchableOpacity><Text className="text-emerald-500 font-bold">+ Add</Text></TouchableOpacity>
          </View>
          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className={textSecondary}>Visa •••• 4242 (Verified)</Text>
              <TouchableOpacity><Text className="text-red-500 text-sm">Remove</Text></TouchableOpacity>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className={textSecondary}>PayPal (Connected)</Text>
              <TouchableOpacity><Text className="text-red-500 text-sm">Remove</Text></TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity className="w-full bg-emerald-600 py-4 rounded-2xl shadow-lg shadow-emerald-500/30 items-center">
          <Text className="text-white font-bold text-lg">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer Navigation Replacement */}
      <View className={navClass}>
        <View className="flex-row justify-around items-center">
          {[
            { icon: Home, label: "Home" },
            { icon: CreditCard, label: "Payments" },
            { icon: CalendarDays, label: "Jobs" },
            { icon: User, label: "Profile" },
          ].map(({ icon: Icon, label }, i) => (
            <TouchableOpacity key={i} className="items-center gap-1">
              <Icon size={24} color={label === "Profile" ? "#10b981" : (darkMode ? "#94a3b8" : "#64748b")} />
              <Text className={`text-[10px] ${label === "Profile" ? "text-emerald-500 font-bold" : (darkMode ? "text-slate-400" : "text-gray-500")}`}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}