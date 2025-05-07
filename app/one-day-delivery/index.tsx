// File: app/one-day-delivery/index.tsx

import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const categories = ['Blouse', 'Chudidhar', 'Saree'];

export default function OneDayDeliveryScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-light-100 px-5">
            {/* Header */}
            <View className="flex-row items-center py-4 bg-light-200 rounded-b-2xl px-3">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-dark-100">Needles One-Day</Text>
            </View>

            {/* Category Buttons */}
            <View className="flex-1 justify-center items-center space-y-6">
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        className="bg-secondary w-3/4 py-4 rounded-2xl shadow-md"
                        onPress={() =>
                            router.push({ pathname: "/one-day-delivery/[category]", params: { category: category.toLowerCase() } })
                        }
                    >
                        <Text className="text-center text-lg font-bold text-white">{category}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}
