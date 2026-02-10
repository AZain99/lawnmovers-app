import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from "react-native";
// Using lucide-react-native for mobile
import {
  Home,
  DollarSign,
  CalendarDays,
  User,
  Sun,
  Moon,
  MapPin,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react-native";

export default function JobDashboard() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode(!darkMode);

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
  const textSecondary = darkMode ? "text-gray-400" : "text-gray-600";

  const activeJobs = [
    { title: "Lawn Mowing", location: "123 Suburbia St", time: "10:30 AM", earnings: "$45.00" }
  ];

  const scheduledJobs = [
    { title: "Hedge Trimming", location: "456 Park Ave", time: "02:00 PM" },
    { title: "Leaf Blowing", location: "Hill Street", time: "Tomorrow" }
  ];

  return (
    <SafeAreaView className={containerClass}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <View>
          <Text className={`text-2xl font-bold ${textMain}`}>Dashboard</Text>
          <Text className="text-emerald-500 font-medium">Lawn Tamers Pro</Text>
        </View>
        <TouchableOpacity onPress={toggleTheme} className="p-2 rounded-full bg-emerald-500/10">
          {darkMode ? <Sun size={24} color="#fbbf24" /> : <Moon size={24} color="#334155" />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        
        {/* Active Jobs Section */}
        <Text className={`text-lg font-bold mb-4 mt-2 ${textMain}`}>Current Request</Text>
        {activeJobs.map((job, i) => (
          <View key={i} className={cardClass}>
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <Text className={`text-lg font-bold ${textMain}`}>{job.title}</Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <MapPin size={14} color="#10b981" />
                  <Text className={textSecondary}>{job.location}</Text>
                </View>
              </View>
              <Text className="text-emerald-500 font-bold text-lg">{job.earnings}</Text>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 bg-emerald-600 flex-row items-center justify-center py-3 rounded-2xl gap-2">
                <CheckCircle size={18} color="white" />
                <Text className="text-white font-bold">Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-slate-800 flex-row items-center justify-center py-3 rounded-2xl gap-2">
                <XCircle size={18} color="#ef4444" />
                <Text className="text-white font-bold">Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Scheduled Jobs Section */}
        <View className="flex-row items-center gap-2 mb-4 mt-6">
          <View className="w-1 h-6 bg-yellow-500 rounded-full" />
          <Text className={`text-lg font-bold ${textMain}`}>Scheduled Jobs</Text>
        </View>
        
        {scheduledJobs.map((job, i) => (
          <View key={i} className={cardClass}>
            <View className="flex-row items-center gap-3">
              <View className="bg-yellow-500/10 p-3 rounded-2xl">
                <CalendarDays size={20} color="#eab308" />
              </View>
              <View>
                <Text className={`font-bold ${textMain}`}>{job.title}</Text>
                <Text className={`text-xs ${textSecondary}`}>{job.location}</Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <Clock size={12} color="#94a3b8" />
                  <Text className="text-slate-500 text-[10px]">{job.time}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer Navigation */}
      <View className={navClass}>
        <View className="flex-row justify-around items-center">
          {[
            { icon: Home, label: "Home", active: true },
            { icon: DollarSign, label: "Earnings" },
            { icon: CalendarDays, label: "Jobs" },
            { icon: User, label: "Profile" },
          ].map(({ icon: Icon, label, active }, i) => (
            <TouchableOpacity key={i} className="items-center gap-1">
              <Icon size={24} color={active ? "#10b981" : "#64748b"} />
              <Text className={`text-[10px] ${active ? "text-emerald-500 font-bold" : "text-gray-500"}`}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}