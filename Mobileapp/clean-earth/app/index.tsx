import { View, Text, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import EcoButton from '../components/EcoButton';
import { Leaf } from 'lucide-react-native';

export default function Onboarding() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-accent">
      <View className="flex-1 items-center justify-center p-6">
        {/* Placeholder for Illustration */}
        <View className="w-64 h-64 bg-secondary/30 rounded-full items-center justify-center mb-10">
           <Leaf size={100} color="#2E7D32" />
        </View>

        <Text className="text-3xl font-bold text-dark text-center mb-4">
          Clean World,{"\n"}Green Future.
        </Text>
        <Text className="text-gray-500 text-center text-lg mb-10 px-4">
          Book pickups, track your waste, and boost your recycling impact with EcoCollect.
        </Text>

        <View className="w-full space-y-4">
          <EcoButton title="Get Started" onPress={() => router.push('/(tabs)/home')} />
          <EcoButton 
            title="Log In" 
            variant="outline" 
            onPress={() => router.push('/(tabs)/home')} // Skipping auth for demo
          />
        </View>
      </View>
    </SafeAreaView>
  );
}