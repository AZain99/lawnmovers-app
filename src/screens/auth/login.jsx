import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  SafeAreaView, 
  StatusBar 
} from "react-native";
// Use lucide-react-native for mobile
import { Upload, Sun, Moon } from "lucide-react-native";

export default function AuthScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState("customer");

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleAuth = () => setIsLogin(!isLogin);

  // Layout Styles
  const containerClass = darkMode
    ? "flex-1 bg-slate-900"
    : "flex-1 bg-gray-50";

  const cardClass = darkMode
    ? "bg-slate-800/90 p-8 rounded-3xl border border-slate-700 shadow-2xl"
    : "bg-white p-8 rounded-3xl shadow-xl border border-gray-100";

  const inputClass = darkMode
    ? "w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-700 mb-3"
    : "w-full p-4 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 mb-3";

  return (
    <SafeAreaView className={containerClass}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      
      {/* Theme Toggle Header */}
      <View className="flex-row justify-end px-6 py-2">
        <TouchableOpacity
          onPress={toggleTheme}
          className={`p-3 rounded-full ${darkMode ? "bg-slate-800" : "bg-gray-200"}`}
        >
          {darkMode ? (
            <Sun size={20} color="#fbbf24" />
          ) : (
            <Moon size={20} color="#374151" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View className={cardClass}>
          {/* Logo & Header */}
          <View className="items-center mb-8">
            <Image
              source={{ uri: "https://your-logo-url-here.png" }} // Replace with local require if needed
              className="h-24 w-24 mb-4"
              resizeMode="contain"
            />
            <Text className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {isLogin ? "Welcome Back" : "Create Account"}
            </Text>
            <Text className="text-sm text-gray-500 mt-1 text-center">
              {isLogin ? "Login to continue to Lawn Tamers" : "Join the Lawn Tamers community"}
            </Text>
          </View>

          {isLogin ? (
            /* LOGIN SECTION */
            <View>
              <TextInput placeholder="Email Address" placeholderTextColor="#94a3b8" className={inputClass} />
              <TextInput placeholder="Password" secureTextEntry placeholderTextColor="#94a3b8" className={inputClass} />

              <TouchableOpacity className="items-end mb-6">
                <Text className="text-emerald-600 text-sm font-medium">Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity className="w-full bg-emerald-600 py-4 rounded-xl shadow-lg active:bg-emerald-700">
                <Text className="text-white text-center font-bold text-lg">Login</Text>
              </TouchableOpacity>

              {/* Social Login */}
              <View className="flex-row items-center justify-center space-x-2 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                <Image source={{ uri: "https://www.svgrepo.com/show/475656/google-color.svg" }} className="h-5 w-5" />
                <Text className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Login with Google</Text>
              </View>

              <TouchableOpacity onPress={toggleAuth} className="mt-8">
                <Text className="text-center text-sm text-gray-500">
                  Not registered yet? <Text className="text-emerald-600 font-bold">Create Account</Text>
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* SIGNUP SECTION */
            <View>
              <View className="flex-row justify-center space-x-6 mb-6">
                <TouchableOpacity onPress={() => setUserType("customer")} className="flex-row items-center">
                   <View className={`h-4 w-4 rounded-full border-2 border-emerald-600 mr-2 ${userType === "customer" ? "bg-emerald-600" : ""}`} />
                   <Text className={darkMode ? "text-white" : "text-gray-900"}>Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setUserType("serviceProvider")} className="flex-row items-center">
                   <View className={`h-4 w-4 rounded-full border-2 border-emerald-600 mr-2 ${userType === "serviceProvider" ? "bg-emerald-600" : ""}`} />
                   <Text className={darkMode ? "text-white" : "text-gray-900"}>Provider</Text>
                </TouchableOpacity>
              </View>

              <TextInput placeholder="Name" placeholderTextColor="#94a3b8" className={inputClass} />
              {userType === "serviceProvider" && (
                <TextInput placeholder="Permanent Address" placeholderTextColor="#94a3b8" className={inputClass} />
              )}
              <TextInput placeholder="Email" placeholderTextColor="#94a3b8" className={inputClass} />
              <TextInput placeholder="Password" secureTextEntry placeholderTextColor="#94a3b8" className={inputClass} />
              <TextInput placeholder="Phone Number" keyboardType="phone-pad" placeholderTextColor="#94a3b8" className={inputClass} />

              {userType === "serviceProvider" && (
                <View className="space-y-4 my-2">
                  <TouchableOpacity className="flex-row justify-between items-center bg-slate-100 dark:bg-slate-900 p-3 rounded-lg">
                    <Text className="text-xs text-gray-500">Upload Experience Certificate</Text>
                    <Upload size={18} color="#10b981" />
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row justify-between items-center bg-slate-100 dark:bg-slate-900 p-3 rounded-lg">
                    <Text className="text-xs text-gray-500">Upload Profile Photo</Text>
                    <Upload size={18} color="#10b981" />
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity className="w-full bg-emerald-600 py-4 rounded-xl mt-4 shadow-lg">
                <Text className="text-white text-center font-bold text-lg">Sign Up</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleAuth} className="mt-6">
                <Text className="text-center text-sm text-gray-500">
                  Already have an account? <Text className="text-emerald-600 font-bold">Back to Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}