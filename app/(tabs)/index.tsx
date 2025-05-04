// File: app/(tabs)/index.tsx

import { ScrollView, View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import BoutiqueCard from '@/components/boutique/BoutiqueCard';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const [search, setSearch] = useState('');
    const router = useRouter();

    const boutiques = [
        {
            id: 'tattva-fashions',
            name: 'Tattva Fashions',
            tags: ['Lehengas', 'Blouses', 'Dresses'],
            location: 'Miyapur, Hyderabad',
            image: 'https://via.placeholder.com/300x160?text=Boutique',
        },
        {
            id: 'miyapur-store',
            name: 'Miyapur Store',
            tags: ['Sarees', 'Kurtis', 'Kidswear'],
            location: 'Miyapur, Hyderabad',
            image: 'https://via.placeholder.com/300x160?text=Fashion+Store',
        },
        {
            id: 'blouse-haven',
            name: 'Blouse Haven',
            tags: ['Blouses', 'Custom Fit'],
            location: 'Kukatpally, Hyderabad',
            image: 'https://via.placeholder.com/300x160?text=Blouse+Haven',
        },
        {
            id: 'lehenga-leaf',
            name: 'Lehenga Leaf',
            tags: ['Lehengas', 'Bridal'],
            location: 'Ameerpet, Hyderabad',
            image: 'https://via.placeholder.com/300x160?text=Lehenga+Leaf',
        },
        {
            id: 'saree-studio',
            name: 'Saree Studio',
            tags: ['Sarees', 'Traditional'],
            location: 'Banjara Hills, Hyderabad',
            image: 'https://via.placeholder.com/300x160?text=Saree+Studio',
        },
    ];

    return (
        <ScrollView className="flex-1 bg-[#FFF2D7] px-4 pt-12">
            {/* Search Bar */}
            <TouchableOpacity
                onPress={() => router.push('/search')}
                className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm mb-4"
                activeOpacity={0.9}
            >
                <Ionicons name="search" size={20} color="gray" />
                <Text className="flex-1 ml-2 text-sm text-gray-400">
                    Search for a Design or Boutique
                </Text>
                <Ionicons name="mic-outline" size={20} color="gray" />
            </TouchableOpacity>

            {/* Banner */}
            <View className="mb-6">
                <Image
                    source={{ uri: 'https://via.placeholder.com/300x140?text=Antarctica+Expedition' }}
                    className="w-full h-36 rounded-xl"
                    resizeMode="cover"
                />
            </View>

            {/* Recommended Section */}
            <Text className="text-lg font-semibold mb-2">Recommended</Text>

            <View className="gap-4 mb-10">
                {boutiques.map((boutique) => (
                    <BoutiqueCard key={boutique.id} {...boutique} />
                ))}
            </View>
        </ScrollView>
    );
}
