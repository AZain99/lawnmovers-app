import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from "react-native";
import { MotiView } from "moti"; // Native alternative to framer-motion
import { 
  Sun, 
  Moon, 
  Home, 
  CreditCard, 
  CalendarDays, 
  User, 
  RefreshCw 
} from "lucide-react-native";

export default function JobTracking() {
  const [darkMode, setDarkMode] = useState(false);
  const [jobs] = useState([
    { title: "Lawn Mowing - Johnson Residence", status: "Requested", time: "Last updated: 2 mins ago" },
    { title: "Hedge Trimming - Park Avenue", status: "Accepted", time: "Last updated: 10 mins ago" },
    { title: "Leaf Blowing - Hill Street", status: "In Progress", time: "Last updated: 30 mins ago" },
    { title: "Edging - Suburbia Blvd", status: "Completed", time: "Last updated: Yesterday" },
  ]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const getStatusStyle = (status) => {
    const base = "text-[10px] font-bold px-3 py-1 rounded-full border";
    if (darkMode) {
      switch (status) {
        case "Requested": return `${base} bg-yellow-900/30 text-yellow-400 border-yellow-700`;
        case "Accepted": return `${base} bg-blue-900/30 text-blue-400 border-blue-700`;
        case "In Progress": return `${base} bg-emerald-900/30 text-emerald-400 border-emerald-700`;
        case "Completed": return `${base} bg-slate-800 text-slate-400 border-slate-700`;
        default: return base;
      }
    } else {
      switch (status) {
        case "Requested": return `${base} bg-yellow-50 text-yellow-700 border-yellow-200`;
        case "Accepted": return `${base} bg-blue-50 text-blue-700 border-blue-200`;
        case "In Progress": return `${base} bg-emerald-50 text-emerald-700 border-emerald-200`;
        case "Completed": return `${base} bg-gray-50 text-gray-600 border-gray-200`;
        default: return base;
      }
    }
  };

  const containerClass = darkMode ? "flex-1 bg-slate-950" : "flex-1 bg-gray-50";
  const cardClass = darkMode 
    ? "bg-slate-900 border border-slate-800 p-5 rounded-3xl mb-4" 
    : "bg-white border border-gray-200 p-5 rounded-3xl mb-4 shadow-sm";

  return (
    <SafeAreaView className={containerClass}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <View className="flex-row items-center gap-2">
          <RefreshCw size={20} color="#10b981" />
          <Text className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Live Tracking
          </Text>
        </View>
        <TouchableOpacity onPress={toggleTheme} className="p-2 rounded-full bg-emerald-500/10">
          {darkMode ? <Sun size={22} color="#fbbf24" /> : <Moon size={22} color="#334155" />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        {jobs.map((job, i) => (
          <MotiView
            key={i}
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 500, delay: i * 100 }}
            className={cardClass}
          >
            <View className="flex-row justify-between items-start">
              <Text 
                className={`flex-1 text-base font-bold mr-4 ${darkMode ? "text-white" : "text-gray-900"}`}
                numberOfLines={2}
              >
                {job.title}
              </Text>
              <View className={getStatusStyle(job.status)}>
                <Text className="uppercase text-[10px] font-bold tracking-tighter">
                  {job.status}
                </Text>
              </View>
            </View>
            
            <Text className="mt-3 text-xs text-gray-500">{job.time}</Text>
            
            {job.status === "Completed" && (
              <View className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                <Text className="text-emerald-500 font-medium text-xs">
                  ✓ Completed Successfully
                </Text>
              </View>
            )}
          </MotiView>
        ))}
      </ScrollView>

      {/* Footer Navigation */}
      <View className={`absolute bottom-0 w-full flex-row justify-around py-4 border-t ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"}`}>
        {[
          { icon: Home, label: "Home" },
          { icon: CreditCard, label: "Payments" },
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