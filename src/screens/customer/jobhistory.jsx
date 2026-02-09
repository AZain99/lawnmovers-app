import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  StatusBar 
} from "react-native";
// Using lucide-react-native and Moti (for motion/animations in React Native)
import { 
  Sun, 
  Moon, 
  Star, 
  Home, 
  Briefcase, 
  CreditCard, 
  User,
  Calendar,
  FileText
} from "lucide-react-native";

export default function JobHistory() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  const jobs = [
    {
      title: "Lawn Mowing - Johnson Residence",
      status: "Completed",
      date: "5 Nov, 2025",
      jobId: "JOB-001",
      invoiceId: "INV-001",
      total: "$84.00",
      review: { rating: 5, text: "Excellent Service!" },
    },
    {
      title: "Hedge Trimming - Park Avenue",
      status: "Scheduled",
      date: "6 Nov, 2025",
      jobId: "JOB-002",
      invoiceId: "INV-002",
      total: "$134.00",
    },
  ];

  const bgClass = darkMode
    ? "flex-1 bg-slate-950"
    : "flex-1 bg-gray-50";

  const cardClass = darkMode
    ? "bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-4 shadow-lg"
    : "bg-white border border-gray-200 rounded-3xl p-5 mb-4 shadow-sm";

  return (
    <SafeAreaView className={bgClass}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Text className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Job History
        </Text>
        <TouchableOpacity
          onPress={toggleTheme}
          className="p-2 rounded-full bg-emerald-500/10"
        >
          {darkMode ? <Sun size={24} color="#fbbf24" /> : <Moon size={24} color="#334155" />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        {jobs.map((job, index) => (
          <View key={index} className={cardClass}>
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1 mr-2">
                <Text className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {job.title}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Calendar size={14} color="#10b981" />
                  <Text className="text-gray-500 text-sm ml-1">{job.date}</Text>
                </View>
              </View>
              <View className={`px-3 py-1 rounded-full ${job.status === 'Completed' ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}>
                <Text className={`text-xs font-bold ${job.status === 'Completed' ? 'text-emerald-500' : 'text-blue-500'}`}>
                  {job.status}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center py-3 border-t border-b border-gray-100 dark:border-slate-800 my-2">
              <View>
                <Text className="text-gray-500 text-xs">Job ID</Text>
                <Text className={`font-mono ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{job.jobId}</Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-500 text-xs">Total Amount</Text>
                <Text className="text-emerald-500 font-bold text-lg">{job.total}</Text>
              </View>
            </View>

            {job.review && (
              <View className="bg-emerald-500/5 p-3 rounded-xl mt-2">
                <View className="flex-row mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < job.review.rating ? "#10b981" : "none"} color="#10b981" />
                  ))}
                </View>
                <Text className={`text-sm italic ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  "{job.review.text}"
                </Text>
              </View>
            )}

            <TouchableOpacity className="mt-4 flex-row items-center justify-center bg-emerald-600 py-3 rounded-xl">
              <FileText size={18} color="white" />
              <Text className="text-white font-bold ml-2">View Invoice</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Rating Badge */}
        <View className="items-center mt-4">
          <View className="bg-emerald-500/10 px-6 py-2 rounded-full border border-emerald-500/20">
            <Text className="text-emerald-500 font-bold">Average Rating: 5.0</Text>
          </View>
        </View>
      </ScrollView>

      {/* Navigation Bar */}
      <View className={`absolute bottom-0 w-full flex-row justify-around py-4 border-t ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"}`}>
        {[
          { icon: Home, label: "Home" },
          { icon: CreditCard, label: "Payments" },
          { icon: Briefcase, label: "Jobs", active: true },
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