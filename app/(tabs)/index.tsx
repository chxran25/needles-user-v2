// File: app/(tabs)/index.tsx

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
import { boutiqueData } from '@/lib/boutiqueData';
import BoutiqueCard from '@/components/boutique/BoutiqueCard';
import { useScrollContext } from '@/context/ScrollContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function HomeScreen() {
    const [search, setSearch] = useState('');
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const sidebarAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.75)).current;
    const router = useRouter();

    const { setScrollY } = useScrollContext();

    const toggleSidebar = (show: boolean) => {
        Animated.timing(sidebarAnim, {
            toValue: show ? 0 : -SCREEN_WIDTH * 0.75,
            duration: 300,
            useNativeDriver: false,
        }).start(() => setSidebarVisible(show));
    };

    useEffect(() => {
        if (!sidebarVisible) {
            sidebarAnim.setValue(-SCREEN_WIDTH * 0.75);
        }
    }, [sidebarVisible]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        setScrollY(currentOffset);
    };

    return (
        <SafeAreaView className="flex-1 bg-light-100">
            {/* Sidebar Overlay */}
            {sidebarVisible && (
                <Pressable
                    className="absolute top-0 right-0 bottom-0 left-0 z-40 bg-black/50"
                    onPress={() => toggleSidebar(false)}
                />
            )}

            {/* Sidebar */}
            <Animated.View
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: SCREEN_WIDTH * 0.75,
                    backgroundColor: '#fff',
                    padding: 24,
                    zIndex: 50,
                    transform: [{ translateX: sidebarAnim }],
                }}
            >
                <Text className="text-xl font-bold mb-4">Menu</Text>
                <Text className="text-base mb-4">Profile</Text>
                <Text className="text-base mb-4">My Orders</Text>
                <Text className="text-base mb-4">Favorites</Text>
                <Text className="text-base mb-4">Support</Text>
                <Text className="text-base mb-4">Logout</Text>
            </Animated.View>

            {/* Header */}
            <View className="px-4 pt-4">
                <View className="bg-[#FFE082] rounded-3xl px-4 pb-4 pt-4">
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={() => toggleSidebar(true)}>
                            <Ionicons name="menu" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-1 ml-2"
                            onPress={() => router.push('/search')}
                            activeOpacity={1}
                        >
                            <View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm">
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
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Content */}
            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                className="px-4 pt-6"
            >
                {/* One Day Delivery Section */}
                <Text className="text-2xl font-semibold mb-2">One Day Delivery</Text>
                <TouchableOpacity
                    className="mb-6 rounded-2xl overflow-hidden shadow-lg"
                    onPress={() => router.push('./one-day-delivery')}
                >
                    <Image
                        source={require('@/assets/images/one-day-delivery.png')}
                        className="w-full h-55"
                        resizeMode="cover"
                    />
                </TouchableOpacity>

                {/* Recommended */}
                <Text className="text-2xl font-semibold mb-3">Recommended</Text>
                <View className="gap-6 pb-10">
                    {boutiqueData.map((boutique) => (
                        <BoutiqueCard key={boutique.id} {...boutique} />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
