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

            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                className="px-4 pt-4"
                contentContainerStyle={{ paddingBottom: 80, flexGrow: 1 }}
            >
                {/* Logo with Sidebar Icon */}
                <View className="flex-row items-center justify-between mb-3 px-1">
                    <TouchableOpacity onPress={() => toggleSidebar(true)}>
                        <Ionicons name="menu" size={27} color="black" />
                    </TouchableOpacity>
                    <Image
                        source={require('@/assets/images/needles-logo.png')}
                        style={{ width: 225, height: 85}}
                        resizeMode="contain"
                    />
                    <View className="w-[26px]" />
                    {/* Placeholder for spacing */}
                </View>

                {/* Deliver To */}
                <View className="mb-3 px-1">
                    <Text className="text-sm text-gray-400 tracking-wider">Deliver to</Text>
                    <TouchableOpacity className="flex-row items-center">
                        <Text className="text-xl font-semibold text-black font-serif mr-1">
                            Flat xyz, Miyapur
                        </Text>
                        <Ionicons name="chevron-down" size={16} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className="bg-background rounded-3xl px-0.5 pb-4 pt-3 mb-4">
                    <View className="flex-row items-center">
                        <View className="flex-1 ml-1">
                            <TouchableOpacity
                                onPress={() => router.push('/search')}
                                activeOpacity={1}
                                className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm w-full"
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
                    </View>
                </View>


                {/* One Day Delivery */}
                <Text className="text-2xl font-bold text-textDark mb-2">One Day Delivery</Text>
                <TouchableOpacity
                    className="mb-6 rounded-2xl overflow-hidden shadow-lg"
                    onPress={() => router.push('./one-day-delivery')}
                >
                    <Image
                        source={require('@/assets/images/one-day-delivery.png')}
                        className="w-full h-56"
                        resizeMode="cover"
                    />
                </TouchableOpacity>

                {/* Recommended */}
                <Text className="text-2xl font-bold text-textDark mb-3">Recommended</Text>
                <View className="gap-6 pb-10">
                    {boutiqueData.map((boutique) => (
                        <BoutiqueCard key={boutique.id} {...boutique} />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
