import { View, Text, SafeAreaView, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Calendar, CreditCard } from 'lucide-react-native';
import EcoButton from '../components/EcoButton';
import { useState } from 'react';

export default function Booking() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('General');

  const types = ['General', 'Plastic', 'Metal', 'E-waste'];

  return (
    <SafeAreaView className="flex-1 bg-grey">
      <View className="px-5 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft color="#374151" size={24} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-dark">Schedule Pickup</Text>
      </View>

      <ScrollView className="flex-1 px-5">
        
        {/* Step 1: Waste Type */}
        <Text className="text-sm font-bold text-gray-500 uppercase mb-3 mt-4">1. Select Waste Type</Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          {types.map((type) => (
            <TouchableOpacity 
              key={type}
              onPress={() => setSelectedType(type)}
              className={`px-6 py-3 rounded-xl border ${selectedType === type ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
            >
              <Text className={selectedType === type ? 'text-white font-bold' : 'text-gray-600'}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Step 2: Details */}
        <Text className="text-sm font-bold text-gray-500 uppercase mb-3">2. Details & Photo</Text>
        <TouchableOpacity className="bg-white border-dashed border-2 border-gray-300 rounded-2xl h-32 items-center justify-center mb-4">
            <Camera color="#9CA3AF" size={30} />
            <Text className="text-gray-400 mt-2">Tap to upload photo</Text>
        </TouchableOpacity>
        
        <TextInput 
            placeholder="Add specific instructions (e.g. Gate code)"
            className="bg-white p-4 rounded-xl text-dark shadow-sm mb-6"
            multiline
        />

        {/* Step 3: Date & Payment */}
        <Text className="text-sm font-bold text-gray-500 uppercase mb-3">3. Date & Payment</Text>
        
        <View className="bg-white p-4 rounded-xl shadow-sm mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
                <Calendar color="#2E7D32" size={20} className="mr-3"/>
                <Text className="text-dark font-medium">Tomorrow, 10:00 AM</Text>
            </View>
            <Text className="text-primary font-bold">Edit</Text>
        </View>

        <View className="bg-white p-4 rounded-xl shadow-sm mb-8 flex-row items-center justify-between">
            <View className="flex-row items-center">
                <CreditCard color="#2E7D32" size={20} className="mr-3"/>
                <Text className="text-dark font-medium">•••• 4242</Text>
            </View>
            <Text className="text-dark font-bold">$15.00</Text>
        </View>

      </ScrollView>

      <View className="p-5 bg-white shadow-lg rounded-t-3xl">
          <EcoButton title="Confirm Booking" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}