// File: app/one-day-delivery/[category].tsx

import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OneDayCategoryScreen() {
    const { category } = useLocalSearchParams();
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-light-100">
            {/* Header */}
            <View className="flex-row items-center py-4 px-5 bg-light-200 rounded-b-2xl shadow-sm">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-dark-100 capitalize">
                    {category} Designs
                </Text>
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={{ padding: 20 }} className="space-y-4">
                <Text className="text-base text-dark-200 font-medium">
                    You selected <Text className="font-bold capitalize">{category}</Text>. Browse available one-day delivery designs below.
                </Text>

                {/* Example card - can be repeated dynamically later */}
                <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <Text className="text-lg font-semibold text-dark-100 mb-2">Example Design</Text>
                    <Text className="text-sm text-gray-600">Fast-stitched and ready for delivery tomorrow.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
