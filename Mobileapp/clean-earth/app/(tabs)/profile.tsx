import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { User, CreditCard, Bell, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';

export default function Profile() {
  const menuItems = [
    { icon: <CreditCard size={20} color="#374151" />, label: "Payment Methods" },
    { icon: <Bell size={20} color="#374151" />, label: "Notifications" },
    { icon: <HelpCircle size={20} color="#374151" />, label: "Help Center" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-grey">
      <View className="p-5 items-center mb-6">
        <View className="w-24 h-24 bg-gray-300 rounded-full mb-4 items-center justify-center">
            <User size={40} color="#fff" />
        </View>
        <Text className="text-2xl font-bold text-dark">Alex Johnson</Text>
        <Text className="text-gray-500">alex@example.com</Text>
      </View>

      <View className="px-5">
        <View className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} className="flex-row items-center p-4 border-b border-gray-100">
              <View className="mr-4">{item.icon}</View>
              <Text className="flex-1 text-dark font-medium">{item.label}</Text>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-2xl shadow-sm">
            <LogOut size={20} color="#EF4444" className="mr-4" />
            <Text className="text-red-500 font-bold">Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}