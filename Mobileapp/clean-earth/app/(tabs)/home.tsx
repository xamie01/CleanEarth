import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Truck, Recycle, Leaf, Battery, Zap, Package } from 'lucide-react-native';

export default function Home() {
  const router = useRouter();

  const categories = [
    { name: 'General', icon: <Package color="#4B5563" /> },
    { name: 'Plastic', icon: <Recycle color="#2E7D32" /> },
    { name: 'Metal', icon: <Zap color="#F59E0B" /> },
    { name: 'Organic', icon: <Leaf color="#8D6E63" /> },
    { name: 'E-Waste', icon: <Battery color="#3B82F6" /> },
  ];

  return (
    <SafeAreaView className="flex-1 bg-grey">
      <ScrollView className="p-5" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-gray-500 text-lg">Good Morning,</Text>
            <Text className="text-2xl font-bold text-dark">Alex Johnson</Text>
          </View>
          <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center">
             <Leaf size={20} color="#2E7D32" />
          </View>
        </View>

        {/* Hero Actions */}
        <View className="flex-row gap-4 mb-8">
          <TouchableOpacity 
            onPress={() => router.push('/booking')}
            className="flex-1 bg-primary p-5 rounded-3xl shadow-lg h-40 justify-between"
          >
            <View className="bg-white/20 w-10 h-10 rounded-full items-center justify-center">
              <Truck color="white" size={20} />
            </View>
            <View>
               <Text className="text-white font-bold text-xl">Book Waste{"\n"}Pickup</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 bg-[#FDFBF7] p-5 rounded-3xl shadow-sm h-40 justify-between">
             <View className="bg-secondary/20 w-10 h-10 rounded-full items-center justify-center">
              <Recycle color="#2E7D32" size={20} />
            </View>
            <View>
               <Text className="text-dark font-bold text-xl">Recycling{"\n"}Guide</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <Text className="text-lg font-bold text-dark mb-4">Waste Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
          {categories.map((cat, index) => (
            <View key={index} className="mr-4 items-center">
              <View className="w-16 h-16 bg-white rounded-2xl items-center justify-center shadow-sm mb-2">
                {cat.icon}
              </View>
              <Text className="text-xs font-medium text-gray-600">{cat.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Impact Card */}
        <Text className="text-lg font-bold text-dark mb-4">My Impact</Text>
        <View className="bg-white p-5 rounded-2xl shadow-sm flex-row justify-between items-center mb-10">
            <View>
                <Text className="text-gray-400 text-sm">CO₂ Saved</Text>
                <Text className="text-2xl font-bold text-primary">14.5 kg</Text>
            </View>
            <View className="h-10 w-[1px] bg-gray-200" />
            <View>
                <Text className="text-gray-400 text-sm">Recycled</Text>
                <Text className="text-2xl font-bold text-primary">120 kg</Text>
            </View>
             <View className="bg-accent p-2 rounded-full">
                <Leaf color="#2E7D32" size={24} />
             </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}