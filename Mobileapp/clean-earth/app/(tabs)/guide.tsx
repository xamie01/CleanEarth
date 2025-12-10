import { View, Text, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { Search, Info } from 'lucide-react-native';

export default function Guide() {
  const guides = [
    { title: "Plastic Types 1 & 2", desc: "Rinse and squash bottles." },
    { title: "Paper & Cardboard", desc: "Remove tape, keep dry." },
    { title: "Glass Jars", desc: "Remove lids, rinse thoroughly." },
    { title: "Batteries", desc: "Do not bin. Use special bags." },
  ];

  return (
    <SafeAreaView className="flex-1 bg-grey">
      <ScrollView className="p-5">
        <Text className="text-2xl font-bold text-dark mb-4">Recycling Guide</Text>
        
        {/* Search Bar */}
        <View className="bg-white p-3 rounded-xl flex-row items-center shadow-sm mb-6">
          <Search size={20} color="#9CA3AF" className="mr-3" />
          <TextInput placeholder="Search materials (e.g. Pizza box)..." className="flex-1 text-dark" />
        </View>

        {/* Hero Tip */}
        <View className="bg-primary p-5 rounded-3xl mb-6 flex-row items-center">
          <View className="flex-1">
             <Text className="text-white font-bold text-lg mb-1">Sorting 101</Text>
             <Text className="text-green-100">Rinse your recyclables. Food residue contaminates the whole batch!</Text>
          </View>
          <Info color="white" size={32} />
        </View>

        {/* List */}
        <Text className="text-lg font-bold text-dark mb-3">Materials</Text>
        {guides.map((item, index) => (
          <View key={index} className="bg-white p-4 rounded-xl mb-3 shadow-sm">
            <Text className="font-bold text-dark text-base">{item.title}</Text>
            <Text className="text-gray-500">{item.desc}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}