import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Image 
} from "react-native";
// Import from lucide-react-native
import { Upload, UserPlus, Moon, Sun } from "lucide-react-native";

export default function SignupScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [userType, setUserType] = useState("customer");

  const toggleTheme = () => setDarkMode(!darkMode);

  const containerClass = darkMode
    ? "flex-1 bg-slate-900"
    : "flex-1 bg-gray-50";

  const cardClass = darkMode
    ? "bg-slate-800/90 p-6 rounded-3xl border border-slate-700 shadow-xl"
    : "bg-white p-6 rounded-3xl shadow-xl border border-gray-100";

  const inputClass = darkMode
    ? "w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-700 mb-3"
    : "w-full p-4 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 mb-3";

  return (
    <SafeAreaView className={containerClass}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        
        {/* Theme Toggle */}
        <View className="flex-row justify-end mb-4">
          <TouchableOpacity onPress={toggleTheme} className="p-2 rounded-full bg-emerald-500/10">
            {darkMode ? <Sun size={24} color="#fbbf24" /> : <Moon size={24} color="#334155" />}
          </TouchableOpacity>
        </View>

        <View className={cardClass}>
          <View className="items-center mb-6">
            <View className="bg-emerald-500/20 p-4 rounded-full mb-3">
              <UserPlus size={32} color="#10b981" />
            </View>
            <Text className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Join Us
            </Text>
          </View>

          {/* User Type Switcher */}
          <View className="flex-row bg-slate-950/50 p-1 rounded-2xl mb-6">
            <TouchableOpacity 
              onPress={() => setUserType("customer")}
              className={`flex-1 py-3 rounded-xl ${userType === "customer" ? "bg-emerald-600" : ""}`}
            >
              <Text className={`text-center font-bold ${userType === "customer" ? "text-white" : "text-gray-500"}`}>
                Customer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setUserType("provider")}
              className={`flex-1 py-3 rounded-xl ${userType === "provider" ? "bg-emerald-600" : ""}`}
            >
              <Text className={`text-center font-bold ${userType === "provider" ? "text-white" : "text-gray-500"}`}>
                Provider
              </Text>
            </TouchableOpacity>
          </View>

          {/* Registration Form */}
          <View>
            <TextInput placeholder="Full Name" placeholderTextColor="#64748b" className={inputClass} />
            <TextInput placeholder="Email" placeholderTextColor="#64748b" keyboardType="email-address" className={inputClass} />
            <TextInput placeholder="Password" placeholderTextColor="#64748b" secureTextEntry className={inputClass} />
            <TextInput placeholder="Phone Number" placeholderTextColor="#64748b" keyboardType="phone-pad" className={inputClass} />

            {userType === "provider" && (
              <View className="space-y-3 mb-4">
                <TouchableOpacity className="flex-row justify-between items-center p-4 rounded-xl border border-dashed border-gray-500">
                  <Text className="text-gray-400 text-sm">Experience Certificate</Text>
                  <Upload size={20} color="#10b981" />
                </TouchableOpacity>
                <TouchableOpacity className="flex-row justify-between items-center p-4 rounded-xl border border-dashed border-gray-500">
                  <Text className="text-gray-400 text-sm">Profile Photo</Text>
                  <Upload size={20} color="#10b981" />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity className="w-full bg-emerald-600 py-4 rounded-xl shadow-lg shadow-emerald-500/40">
              <Text className="text-white text-center font-bold text-lg">Create Account</Text>
            </TouchableOpacity>

            {/* Google Sign Up */}
            <TouchableOpacity className="w-full flex-row justify-center items-center py-4 rounded-xl border border-gray-400 mt-4">
              <Image 
                source={{ uri: "https://www.svgrepo.com/show/475656/google-color.svg" }} 
                className="h-5 w-5 mr-3" 
              />
              <Text className={darkMode ? "text-white" : "text-gray-700"}>Sign up with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity className="mt-6">
              <Text className="text-center text-sm text-gray-500">
                Already have an account? <Text className="text-emerald-500 font-bold">Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}