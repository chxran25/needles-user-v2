import {
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    NativeSyntheticEvent,
    NativeScrollEvent,
    ScrollView as RNScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useScrollContext } from '@/context/ScrollContext';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import {
    fetchRecommendedBoutiques,
    fetchRecommendedDressTypes,
    fetchTopRatedBoutiques,
} from '@/services/api';

import BoutiqueCard from '@/components/boutique/BoutiqueCard';
import RippleCircleOverlay from '@/components/RippleCircleOverlay';
import type { Boutique, RecommendedDressType } from '@/types';

export default function HomeScreen() {
    const [search, setSearch] = useState('');
    const [recommendedBoutiques, setRecommendedBoutiques] = useState<Boutique[]>([]);
    const [recommendedTypes, setRecommendedTypes] = useState<RecommendedDressType[]>([]);
    const [topRatedBoutiques, setTopRatedBoutiques] = useState<Boutique[]>([]);
    const [ripple, setRipple] = useState<{ x: number; y: number; label: string } | null>(null);

    const router = useRouter();
    const { setScrollY } = useScrollContext();

    const scrollRef = useRef<RNScrollView>(null);
    const [scrollX, setScrollX] = useState(0);
    const [isScrolling, setIsScrolling] = useState(true);
    const scrollSpeed = 0.5; // Pixels per frame - adjust for speed
    const cardWidth = 250;
    const cardGap = 16;
    const itemWidth = cardWidth + cardGap;

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
                const [boutiques, types, topRated] = await Promise.all([
                    fetchRecommendedBoutiques(),
                    fetchRecommendedDressTypes(),
                    fetchTopRatedBoutiques(),
                ]);

                setRecommendedBoutiques(boutiques || []);
                setRecommendedTypes(types || []);
                setTopRatedBoutiques(topRated || []);
            } catch (err: any) {
                console.error(
                    'Error fetching home data:',
                    err.response?.status,
                    err.response?.data || err.message
                );
            }
        };

        loadRecommendedData();
    }, []);

    // Smooth infinite auto-scroll for top rated boutiques
    useEffect(() => {
        if (topRatedBoutiques.length === 0 || !isScrolling) return;

        let animationId: number;
        let currentScrollX = scrollX;
        let lastTimestamp = 0;

        const animate = (timestamp: number) => {
            if (!scrollRef.current) return;

            // Calculate delta time for consistent speed across different frame rates
            const deltaTime = timestamp - lastTimestamp;
            lastTimestamp = timestamp;

            // Skip first frame to avoid large delta
            if (deltaTime > 0 && deltaTime < 100) {
                currentScrollX += (scrollSpeed * deltaTime) / 16.67; // Normalize to 60fps

                const maxScroll = topRatedBoutiques.length * itemWidth;

                // Reset position when we reach the end of original items
                if (currentScrollX >= maxScroll) {
                    currentScrollX = 0;
                    scrollRef.current.scrollTo({ x: 0, animated: false });
                } else {
                    scrollRef.current.scrollTo({ x: currentScrollX, animated: false });
                }
            }

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [topRatedBoutiques, isScrolling, itemWidth, scrollSpeed]);

    // Create duplicated array for seamless loop
    const duplicatedTopRated = topRatedBoutiques.length > 0
        ? [...topRatedBoutiques, ...topRatedBoutiques, ...topRatedBoutiques]
        : [];

    const handleScrollBegin = () => {
        setIsScrolling(false);
    };

    const handleScrollEnd = () => {
        // Resume auto-scroll after user interaction
        setTimeout(() => setIsScrolling(true), 2000);
    };

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
                    <TouchableOpacity onPress={() => router.push('/map')}>
                        <Image
                            source={require('@/assets/images/update-location.png')}
                            style={{ width: 28, height: 28 }}
                            resizeMode="contain"
                        />
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

                {/* 🏆 Top Rated in City */}
                {topRatedBoutiques.length > 0 && (
                    <>
                        {renderSectionHeader('Top Rated in City')}
                        <RNScrollView
                            ref={scrollRef}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                gap: cardGap,
                                paddingRight: cardGap,
                                paddingLeft: cardGap
                            }}
                            scrollEventThrottle={1}
                            decelerationRate="normal"
                            snapToAlignment="start"
                            onScrollBeginDrag={handleScrollBegin}
                            onScrollEndDrag={handleScrollEnd}
                            onMomentumScrollEnd={handleScrollEnd}
                        >
                            {duplicatedTopRated.map((item, index) => {
                                const rawImage = Array.isArray(item.headerImage)
                                    ? item.headerImage[0]
                                    : item.headerImage;

                                const finalImage = rawImage?.startsWith('http')
                                    ? rawImage
                                    : `https://needles-v1.onrender.com${rawImage}`;

                                return (
                                    <View key={`${item._id}-${index}`} style={{ width: cardWidth }}>
                                        <BoutiqueCard
                                            id={item._id}
                                            name={item.name}
                                            location={item.area}
                                            image={finalImage}
                                            tags={item.dressTypes?.map((d) => d.type) || []}
                                            rating={item.averageRating}
                                        />
                                    </View>
                                );
                            })}
                        </RNScrollView>
                    </>
                )}

                {/* Popular Categories */}
                {renderSectionHeader('Popular Categories')}
                <View className="flex-row flex-wrap gap-4">
                    {recommendedTypes.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            className="w-[30%] items-center"
                            onPress={(e) => {
                                const { pageX, pageY } = e.nativeEvent;
                                setRipple({ x: pageX, y: pageY, label: item.label });
                            }}
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
                            <Text className="mt-2 text-sm text-center text-gray-700">{item.label}</Text>
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
                                    tags={boutique.dressTypes?.map((dt) => dt.type) ?? []}
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

            {/* Ripple Animation Overlay */}
            {ripple && (
                <RippleCircleOverlay
                    x={ripple.x}
                    y={ripple.y}
                    onFinish={() => {
                        router.replace({
                            pathname: '/top-boutique/[dressType]',
                            params: { dressType: ripple.label },
                        });
                        setTimeout(() => setRipple(null), 100);
                    }}
                />
            )}
        </SafeAreaView>
    );
}