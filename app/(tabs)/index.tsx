// Updated index.tsx for a cleaner, minimal home screen

import {
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Pressable,
    Dimensions,
    Animated,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { boutiqueData, popularDressTypes } from '@/lib/boutiqueData';
import BoutiqueCard from '@/components/boutique/BoutiqueCard';
import { useScrollContext } from '@/context/ScrollContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function HomeScreen() {
    const [search, setSearch] = useState('');
    const sidebarAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.75)).current;
    const router = useRouter();
    const { setScrollY } = useScrollContext();

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        setScrollY(currentOffset);
    };

    return (
        <SafeAreaView className="flex-1 bg-light-100">
            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                className="px-4 pt-4"
                contentContainerStyle={{ paddingBottom: 80, flexGrow: 1 }}
            >
                {/* Header */}
                <View className="flex-row items-center justify-between mb-4 px-1">
                    <TouchableOpacity>
                        <Ionicons name="menu" size={27} color="black" />
                    </TouchableOpacity>
                    <Image
                        source={require('@/assets/images/needles-logo.png')}
                        style={{ width: 225, height: 85 }}
                        resizeMode="contain"
                    />
                    <View className="w-[26px]" />
                </View>

                {/* Search Bar */}
                <View className="mb-6">
                    <TouchableOpacity
                        onPress={() => router.push('/search')}
                        className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm"
                    >
                        <Ionicons name="search" size={20} color="gray" />
                        <TextInput
                            className="flex-1 ml-2 text-sm"
                            placeholder="Search for a Design or Boutique"
                            value={search}
                            onChangeText={setSearch}
                            editable={false}
                            pointerEvents="none"
                        />
                        <Ionicons name="mic-outline" size={20} color="gray" />
                    </TouchableOpacity>
                </View>

                {/* Hero Banner */}
                <TouchableOpacity
                    className="mb-6 rounded-2xl overflow-hidden shadow-lg"
                    onPress={() => router.push('./one-day-delivery')}
                >
                    <Image
                        source={require('@/assets/images/one-day-delivery.png')}
                        className="w-full h-48"
                        resizeMode="cover"
                    />
                </TouchableOpacity>

                {/* Popular Dresses Grid */}
                <Text className="text-xl font-semibold text-textDark mb-3">Popular Categories</Text>
                <View className="flex-row flex-wrap gap-4 mb-8">
                    {popularDressTypes.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            className="w-[30%] items-center"
                            onPress={() => router.push(`/search?query=${item.name.toLowerCase()}`)}
                        >
                            <Image
                                source={item.image}
                                style={{ width: 72, height: 72, borderRadius: 12 }}
                                resizeMode="cover"
                            />
                            <Text className="mt-2 text-sm text-center text-gray-700">{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recommended Boutiques */}
                <Text className="text-xl font-semibold text-textDark mb-3">Recommended</Text>
                <View className="gap-6">
                    {boutiqueData.slice(0, 3).map((boutique) => (
                        <BoutiqueCard key={boutique.id} {...boutique} />
                    ))}
                </View>
                <TouchableOpacity
                    onPress={() => router.push('/search')}
                    className="mt-6 items-center"
                >
                    <Text className="text-primary font-medium">View More Boutiques →</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
