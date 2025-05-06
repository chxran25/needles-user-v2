// File: app/(tabs)/search.tsx

import { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import BoutiqueCard from '@/components/boutique/BoutiqueCard';
import CategoryTags from '@/components/boutique/CategoryTags';


const sampleResults = [
    {
        id: 'blouse-haven',
        name: 'Blouse Haven',
        tags: ['Blouses', 'Custom Fit'],
        location: 'Kukatpally, Hyderabad',
        image: 'https://via.placeholder.com/300x160?text=Blouse+Haven',
        rating: 4,
    },
    {
        id: 'lehenga-leaf',
        name: 'Lehenga Leaf',
        tags: ['Lehengas', 'Bridal'],
        location: 'Ameerpet, Hyderabad',
        image: 'https://via.placeholder.com/300x160?text=Lehenga+Leaf',
        rating: 5,
    },
    {
        id: 'saree-studio',
        name: 'Saree Studio',
        tags: ['Sarees', 'Traditional'],
        location: 'Banjara Hills, Hyderabad',
        image: 'https://via.placeholder.com/300x160?text=Saree+Studio',
        rating: 3,
    },
    {
        id: 'kurti-couture',
        name: 'Kurti Couture',
        tags: ['Kurtis', 'Casual'],
        location: 'Dilsukhnagar, Hyderabad',
        image: 'https://via.placeholder.com/300x160?text=Kurti+Couture',
        rating: 4,
    },
    {
        id: 'ethnic-threads',
        name: 'Ethnic Threads',
        tags: ['Sarees', 'Blouses', 'Lehengas'],
        location: 'Madhapur, Hyderabad',
        image: 'https://via.placeholder.com/300x160?text=Ethnic+Threads',
        rating: 5,
    },
];

export default function SearchScreen() {
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const inputRef = useRef<TextInput>(null);
    const { autoFocus } = useLocalSearchParams();

    useEffect(() => {
        if (autoFocus === 'true') {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [autoFocus]);

    const filteredResults = sampleResults.filter(
        (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) &&
            (!selectedTag || item.tags.includes(selectedTag))
    );

    return (
        <SafeAreaView className="flex-1 bg-[#FFF2D7]">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1 px-4 pt-10"
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Search Bar */}
                    <View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm mb-4">
                        <Ionicons name="search" size={20} color="gray" />
                        <TextInput
                            ref={inputRef}
                            className="flex-1 ml-2 text-sm"
                            placeholder="Search for a Boutique or Style"
                            value={search}
                            onChangeText={setSearch}
                            returnKeyType="search"
                        />
                        <Ionicons name="mic-outline" size={20} color="gray" />
                    </View>

                    {/* Tag Filters */}
                    <View className="flex-row flex-wrap gap-2 mb-6">
                        {["Lehengas", "Blouses", "Sarees", "Kurtis", "Bridal"].map((tag) => (
                            <TouchableOpacity
                                key={tag}
                                onPress={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                                className={`px-3 py-1 rounded-full ${
                                    selectedTag === tag ? 'bg-blue-600' : 'bg-blue-100'
                                }`}
                            >
                                <Text
                                    className={`text-xs font-medium ${
                                        selectedTag === tag ? 'text-white' : 'text-blue-600'
                                    }`}
                                >
                                    {tag}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Search Results */}
                    {filteredResults.length > 0 ? (
                        <View className="gap-4 mb-10">
                            {filteredResults.map((boutique) => (
                                <BoutiqueCard key={boutique.id} {...boutique} />
                            ))}
                        </View>
                    ) : (
                        <Text className="text-center text-gray-500 mt-20">No boutiques found.</Text>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
