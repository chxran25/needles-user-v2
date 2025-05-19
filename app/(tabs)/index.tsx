// Cleaned and fixed index.tsx with working animations and removed unused code

import {
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated as RNAnimated,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { data, popularDressTypes } from '@/lib/data';
import BoutiqueCard from '@/components/boutique/BoutiqueCard';
import { useScrollContext } from '@/context/ScrollContext';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function HomeScreen() {
    const [search, setSearch] = useState('');
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
                {renderSectionHeader("One Day Delivery")}
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

                {/* Popular Dresses Grid */}
                {renderSectionHeader("Popular Categories")}
                <View className="flex-row flex-wrap gap-4">
                    {popularDressTypes.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            className="w-[30%] items-center"
                            onPress={() => router.push(`/search?query=${item.name.toLowerCase()}`)}
                        >
                            <Image
                                source={item.image}
                                style={{ width: 100, height: 100, borderRadius: 12 }}
                                resizeMode="cover"
                            />
                            <Text className="mt-2 text-sm text-center text-gray-700">{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recommended Boutiques */}
                {renderSectionHeader("Recommended")}
                <View className="gap-6">
                    {data.slice(0, 3).map((boutique, i) => (
                        <Animated.View key={boutique.id} entering={FadeInUp.delay(i * 100).duration(600)}>
                            <BoutiqueCard {...boutique} />
                        </Animated.View>
                    ))}
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
