import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions 
} from "react-native";
// Using lucide-react-native for mobile
import {
  Home,
  DollarSign,
  CalendarDays,
  User,
  Sun,
  Moon,
  Scissors,
  Leaf,
  Flower2,
  ChevronRight
} from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function ServiceBooking() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedService, setSelectedService] = useState("Lawn Mowing");
  const [propertySize, setPropertySize] = useState(100);

  const toggleTheme = () => setDarkMode(!darkMode);

  const containerClass = darkMode
    ? "flex-1 bg-slate-950"
    : "flex-1 bg-gray-50";

  const cardClass = darkMode
    ? "bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-4 shadow-lg"
    : "bg-white border border-gray-200 rounded-3xl p-5 mb-4 shadow-sm";

  const services = [
    { name: "Lawn Mowing", icon: Scissors, color: "text-emerald-500" },
    { name: "Trimming", icon: Leaf, color: "text-blue-500" },
    { name: "Landscaping", icon: Flower2, color: "text-purple-500" },
  ];

  return (
    <SafeAreaView className={containerClass}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 py-4">
          <View>
            <Text className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Book Service
            </Text>
            <Text className="text-emerald-500 font-medium">Lawn Tamers Specialist</Text>
          </View>
          <TouchableOpacity onPress={toggleTheme} className="p-2 rounded-full bg-emerald-500/10">
            {darkMode ? <Sun size={24} color="#fbbf24" /> : <Moon size={24} color="#334155" />}
          </TouchableOpacity>
        </View>

        <View className="px-6">
          {/* Service Selection */}
          <Text className={`text-lg font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            Select Category
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {services.map((service) => (
              <TouchableOpacity
                key={service.name}
                onPress={() => setSelectedService(service.name)}
                style={{ width: width * 0.43 }}
                className={`p-4 rounded-3xl border-2 mb-4 items-center ${
                  selectedService === service.name
                    ? "border-emerald-500 bg-emerald-500/10"
                    : darkMode ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white"
                }`}
              >
                <service.icon size={28} color={selectedService === service.name ? "#10b981" : "#64748b"} />
                <Text className={`mt-2 font-bold ${selectedService === service.name ? "text-emerald-500" : "text-gray-500"}`}>
                  {service.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Property Size Simulator */}
          <View className={cardClass}>
            <Text className={`text-base font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Property Size
            </Text>
            <Text className="text-emerald-500 text-2xl font-bold">{propertySize} sq yards</Text>
            <View className="flex-row gap-4 mt-4">
              <TouchableOpacity 
                onPress={() => setPropertySize(Math.max(50, propertySize - 50))}
                className="flex-1 bg-slate-800 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">- 50</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setPropertySize(propertySize + 50)}
                className="flex-1 bg-emerald-600 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">+ 50</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Price Summary */}
          <View className={cardClass}>
            <Text className={`text-base font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Price Details
            </Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500">Service Base Fee</Text>
              <Text className={darkMode ? "text-white" : "text-gray-900"}>$45.00</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500">Size Multiplier</Text>
              <Text className={darkMode ? "text-white" : "text-gray-900"}>x 1.2</Text>
            </View>
            <View className="flex-row justify-between pt-4 border-t border-slate-800">
              <Text className="text-emerald-500 font-bold text-lg">Total Amount</Text>
              <Text className="text-emerald-500 font-bold text-lg">$54.00</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity className="w-full bg-emerald-600 py-4 rounded-2xl items-center mb-4 shadow-lg shadow-emerald-500/30">
            <Text className="text-white font-bold text-lg">Book Now</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-full bg-slate-800 py-4 rounded-2xl items-center mb-10">
            <Text className="text-gray-300 font-bold">Schedule for Later</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Navigation Bar */}
      <View className={`absolute bottom-0 w-full flex-row justify-around py-4 border-t ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"}`}>
        <Home color="#10b981" size={24} />
        <DollarSign color="#64748b" size={24} />
        <CalendarDays color="#64748b" size={24} />
        <User color="#64748b" size={24} />
      </View>
    </SafeAreaView>
  );
}