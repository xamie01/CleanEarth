import { View, Text, SafeAreaView, Dimensions } from 'react-native';
// Note: In a real app, import MapView, { Marker } from 'react-native-maps';
// For this prototype, we'll visualize the layout
import { Phone, MessageSquare } from 'lucide-react-native';

export default function Tracking() {
  return (
    <View className="flex-1 bg-gray-200">
      {/* Mock Map Background */}
      <View className="flex-1 items-center justify-center bg-blue-100">
        <Text className="text-blue-300 font-bold text-4xl -rotate-12">MAP VIEW</Text>
      </View>

      {/* Driver Card Overlay */}
      <View className="absolute bottom-10 left-5 right-5 bg-white p-5 rounded-3xl shadow-xl">
        <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-gray-300 rounded-full mr-4 overflow-hidden">
                {/* Avatar Image Placeholder */}
            </View>
            <View className="flex-1">
                <Text className="text-lg font-bold text-dark">Mike D.</Text>
                <Text className="text-gray-500 text-sm">Electric Van • Plate 892</Text>
            </View>
            <View className="bg-accent px-3 py-1 rounded-full">
                <Text className="text-primary font-bold text-xs">4.9 ★</Text>
            </View>
        </View>

        <View className="h-[1px] bg-gray-100 mb-4" />

        <View className="flex-row justify-between items-center mb-6">
            <View>
                <Text className="text-gray-400 text-xs uppercase">ETA</Text>
                <Text className="text-2xl font-bold text-dark">4 mins</Text>
            </View>
            <View>
                <Text className="text-gray-400 text-xs uppercase text-right">Status</Text>
                <Text className="text-lg font-bold text-primary text-right">Arriving</Text>
            </View>
        </View>

        <View className="flex-row gap-3">
            <View className="flex-1 bg-green-50 py-3 rounded-xl items-center justify-center flex-row">
                <Phone size={18} color="#2E7D32" />
                <Text className="ml-2 text-primary font-bold">Call</Text>
            </View>
            <View className="flex-1 bg-gray-50 py-3 rounded-xl items-center justify-center flex-row">
                <MessageSquare size={18} color="#374151" />
                <Text className="ml-2 text-dark font-bold">Message</Text>
            </View>
        </View>
      </View>
    </View>
  );
}