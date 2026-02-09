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
  List,
  User,
  Sun,
  Moon,
  Clock,
  LayoutGrid
} from "lucide-react-native";

export default function ScheduleScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [view, setView] = useState("list"); // list or calendar

  const toggleTheme = () => setDarkMode(!darkMode);

  const containerClass = darkMode
    ? "flex-1 bg-slate-950"
    : "flex-1 bg-gray-50";

  const cardClass = darkMode
    ? "bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-4 shadow-lg"
    : "bg-white border border-gray-200 rounded-3xl p-5 mb-4 shadow-sm";

  const textMain = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-400" : "text-gray-600";

  const jobs = [
    { title: "Front Lawn", location: "123 Main St", time: "09:00 AM", status: "Upcoming" },
    { title: "Backyard Cleanup", location: "456 Oak Ave", time: "01:30 PM", status: "In Progress" },
  ];

  return (
    <SafeAreaView className={containerClass}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <View>
          <Text className={`text-2xl font-bold ${textMain}`}>My Schedule</Text>
          <Text className="text-emerald-500 font-medium">Lawn Tamers Pro</Text>
        </View>
        <TouchableOpacity onPress={toggleTheme} className="p-2 rounded-full bg-emerald-500/10">
          {darkMode ? <Sun size={24} color="#fbbf24" /> : <Moon size={24} color="#334155" />}
        </TouchableOpacity>
      </View>

      {/* View Toggler */}
      <View className="flex-row px-6 mb-6 gap-3">
        <TouchableOpacity 
          onPress={() => setView("list")}
          className={`flex-1 flex-row items-center justify-center py-3 rounded-2xl gap-2 ${view === 'list' ? 'bg-emerald-600' : 'bg-slate-800'}`}
        >
          <List size={18} color="white" />
          <Text className="text-white font-bold">List</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setView("calendar")}
          className={`flex-1 flex-row items-center justify-center py-3 rounded-2xl gap-2 ${view === 'calendar' ? 'bg-emerald-600' : 'bg-slate-800'}`}
        >
          <CalendarDays size={18} color="white" />
          <Text className="text-white font-bold">Calendar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        {view === "list" ? (
          jobs.map((job, i) => (
            <View key={i} className={cardClass}>
              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <Text className={`text-lg font-bold ${textMain}`}>{job.title}</Text>
                  <Text className={`text-sm ${textSecondary}`}>{job.location}</Text>
                </View>
                <View className="bg-emerald-500/10 px-3 py-1 rounded-full">
                  <Text className="text-emerald-500 text-xs font-bold">{job.status}</Text>
                </View>
              </View>
              
              <View className="flex-row items-center gap-2 pt-3 border-t border-slate-800/50">
                <Clock size={16} color="#10b981" />
                <Text className={textSecondary}>{job.time}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className="items-center justify-center py-20">
            <LayoutGrid size={64} color="#10b981" strokeWidth={1} />
            <Text className={`mt-4 text-lg font-medium ${textSecondary}`}>
              Calendar view coming soon...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer Navigation */}
      <View className={`absolute bottom-0 w-full flex-row justify-around py-4 border-t ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"}`}>
        {[
          { icon: Home, label: "Home" },
          { icon: DollarSign, label: "Earnings" },
          { icon: CalendarDays, label: "Jobs", active: true },
          { icon: User, label: "Profile" },
        ].map(({ icon: Icon, label, active }, i) => (
          <TouchableOpacity key={i} className="items-center">
            <Icon size={24} color={active ? "#10b981" : "#64748b"} />
            <Text className={`text-[10px] mt-1 ${active ? "text-emerald-500 font-bold" : "text-gray-500"}`}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}