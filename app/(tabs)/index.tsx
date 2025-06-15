import {
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useScrollContext } from '@/context/ScrollContext';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { fetchRecommendedBoutiques, fetchRecommendedDressTypes } from '@/services/api';
import BoutiqueCard from '@/components/boutique/BoutiqueCard';

type Boutique = {
    _id: string;
    name: string;
    dressTypes: { type: string; images?: string[]; _id: string }[];
    area: string;
    headerImage?: string;
    averageRating: number;
};

type DressType = {
    label: string;
    imageUrl?: string;
    count?: number;
    relevance?: number;
};

export default function HomeScreen() {
    const [search, setSearch] = useState('');
    const [recommendedBoutiques, setRecommendedBoutiques] = useState<Boutique[]>([]);
    const [recommendedTypes, setRecommendedTypes] = useState<DressType[]>([]);
    const router = useRouter();
    const { setScrollY } = useScrollContext();

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        setScrollY(currentOffset);
    };

    const renderSectionHeader = (title: string) => (
        <Animated.View
            entering={FadeInDown.duration(500)}
            className="flex-row items-center mb-4 mt-6"
        >
            <Text className="text-2xl font-bold text-textDark mr-2">{title}</Text>
            <View className="flex-1 h-px bg-gray-300" />
        </Animated.View>
    );

    useEffect(() => {
        const loadRecommendedData = async () => {
            try {
                const boutiques = await fetchRecommendedBoutiques();
                setRecommendedBoutiques(boutiques);

                const types = await fetchRecommendedDressTypes();
                setRecommendedTypes(types);
            } catch (err: any) {
                console.error(
                    'Error fetching recommended data:',
                    err.response?.status,
                    err.response?.data || err.message
                );
            }
        };

        loadRecommendedData();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-light-100">
            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                className="px-4 pt-4"
                contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
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

                {/* One Day Delivery */}
                {renderSectionHeader('One Day Delivery')}
                <TouchableOpacity
                    className="rounded-2xl overflow-hidden shadow-lg"
                    onPress={() => router.push('./one-day-delivery')}
                >
                    <Image
                        source={require('@/assets/images/one-day-delivery.png')}
                        className="w-full h-56"
                        resizeMode="cover"
                    />
                </TouchableOpacity>

                {/* Popular Categories (now dynamic) */}
                {renderSectionHeader('Popular Categories')}
                <View className="flex-row flex-wrap gap-4">
                    {recommendedTypes.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            className="w-[30%] items-center"
                            onPress={() => router.push(`/search?query=${item.label.toLowerCase()}`)}
                        >
                            {item.imageUrl ? (
                                <Image
                                    source={{ uri: item.imageUrl }}
                                    style={{ width: 100, height: 100, borderRadius: 12 }}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="w-[100px] h-[100px] bg-gray-100 rounded-2xl items-center justify-center">
                                    <Ionicons name="shirt-outline" size={40} color="gray" />
                                </View>
                            )}
                            <Text className="mt-2 text-sm text-center text-gray-700">
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recommended Boutiques */}
                {renderSectionHeader('Recommended')}
                <View className="gap-6">
                    {recommendedBoutiques.map((boutique, i) => {
                        const rawImage = Array.isArray(boutique.headerImage)
                            ? boutique.headerImage[0]
                            : boutique.headerImage;

                        const finalImage = rawImage?.startsWith('http')
                            ? rawImage
                            : `https://needles-v1.onrender.com${rawImage}`;

                        return (
                            <Animated.View
                                key={boutique._id}
                                entering={FadeInUp.delay(i * 100).duration(600)}
                            >
                                <BoutiqueCard
                                    id={boutique._id}
                                    name={boutique.name}
                                    tags={boutique.dressTypes.map(dt => dt.type)}
                                    location={boutique.area}
                                    image={finalImage}
                                    rating={boutique.averageRating}
                                />
                            </Animated.View>
                        );
                    })}
                </View>

                <TouchableOpacity
                    onPress={() => router.push('/search')}
                    className="mt-8 items-center"
                >
                    <Text className="text-primary font-medium">View More Boutiques →</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
