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
  DollarSign,
  CalendarDays,
  User,
  Sun,
  Moon,
  Clock,
  TrendingUp,
  ChevronRight
} from "lucide-react-native";

export default function EarningsScreen() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  // Dynamic Styles
  const containerClass = darkMode
    ? "flex-1 bg-slate-950"
    : "flex-1 bg-gray-50";

  const cardClass = darkMode
    ? "bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-4 shadow-lg"
    : "bg-white border border-gray-200 rounded-3xl p-5 mb-4 shadow-sm";

  const textMain = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-400" : "text-gray-600";

  const transactions = [
    {
      title: "Lawn Mowing - Johnson Residence",
      address: "123 Suburbia Street, CA",
      amount: "+$84.00",
      color: "text-emerald-500",
      time: "Today, 10:30 AM",
    },
    {
      title: "Hedge Trimming - Park Avenue",
      address: "456 Park Avenue, CA",
      amount: "+$134.00",
      color: "text-emerald-500",
      time: "Yesterday, 03:45 PM",
    },
  ];

  return (
    <SafeAreaView className={containerClass}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Text className={`text-2xl font-bold ${textMain}`}>Earnings</Text>
        <TouchableOpacity
          onPress={toggleTheme}
          className="p-2 rounded-full bg-emerald-500/10"
        >
          {darkMode ? (
            <Sun size={24} color="#fbbf24" />
          ) : (
            <Moon size={24} color="#334155" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        
        {/* Total Earnings Card */}
        <View className="bg-emerald-600 rounded-3xl p-6 mb-6 shadow-xl shadow-emerald-500/20">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-emerald-100 font-medium">Total Balance</Text>
            <TrendingUp size={20} color="#ecfdf5" />
          </View>
          <Text className="text-white text-4xl font-bold">$2,450.50</Text>
          <View className="flex-row mt-4 pt-4 border-t border-emerald-500/30 justify-between">
            <View>
              <Text className="text-emerald-100 text-xs">This Month</Text>
              <Text className="text-white font-bold">$840.00</Text>
            </View>
            <View className="items-end">
              <Text className="text-emerald-100 text-xs">Pending</Text>
              <Text className="text-white font-bold">$120.00</Text>
            </View>
          </View>
        </View>

        {/* Transaction History Section */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className={`text-lg font-bold ${textMain}`}>Recent Activity</Text>
          <TouchableOpacity>
            <Text className="text-emerald-500 font-bold">See All</Text>
          </TouchableOpacity>
        </View>

        {transactions.map((job, i) => (
          <TouchableOpacity key={i} className={cardClass}>
            <View className="flex-row justify-between items-start">
              <View className="flex-1 mr-2">
                <Text className={`font-bold text-base ${textMain}`} numberOfLines={1}>
                  {job.title}
                </Text>
                <Text className={`text-xs mt-1 ${textSecondary}`}>{job.address}</Text>
              </View>
              <Text className={`font-bold text-lg ${job.color}`}>{job.amount}</Text>
            </View>
            
            <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-slate-800">
              <View className="flex-row items-center gap-1">
                <Clock size={14} color="#10b981" />
                <Text className={`text-xs ${textSecondary}`}>{job.time}</Text>
              </View>
              <ChevronRight size={16} color="#94a3b8" />
            </View>
          </TouchableOpacity>
        ))}

        {/* Withdrawal Button */}
        <TouchableOpacity className="w-full bg-slate-900 dark:bg-emerald-600 py-4 rounded-2xl items-center mt-4 shadow-lg">
          <Text className="text-white font-bold text-lg">Withdraw Funds</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Navigation Bar */}
      <View className={`absolute bottom-0 w-full flex-row justify-around py-4 border-t ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"}`}>
        {[
          { icon: Home, label: "Home" },
          { icon: DollarSign, label: "Earnings", active: true },
          { icon: CalendarDays, label: "Jobs" },
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