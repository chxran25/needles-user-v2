import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';

type DressType = {
    type: string;
    images?: (string | { url: string })[];
};

type Boutique = {
    _id: string;
    name: string;
    area: string;
    averageRating: number;
    dressTypes: DressType[];
};

type Props = {
    boutique: Boutique;
    query: string;
};

const SearchedBoutiqueCard: React.FC<Props> = ({ boutique, query }) => {
    const router = useRouter();
    const [scaleAnim] = useState(new Animated.Value(1));

    // Filter matched dress types
    const matchedDressTypes = (boutique.dressTypes ?? []).filter(dt =>
        dt.type.toLowerCase().includes(query.toLowerCase())
    );

    console.log("✅ MatchedDressTypes for", query, ":", matchedDressTypes);

    // Fallback to first matched name or query
    const matchedTypeName =
        matchedDressTypes.length > 0 ? matchedDressTypes[0].type : query;

    console.log("✅ matchedTypeName:", matchedTypeName);

    // Normalize images
    const matchedImages = matchedDressTypes.flatMap(dt =>
        (dt.images ?? []).map(img => {
            if (typeof img === 'string') {
                return img;
            }
            if (typeof img === 'object' && img !== null && 'url' in img && typeof img.url === 'string') {
                return img.url;
            }
            return '';
        })
    ).filter(img => img.trim() !== '');

    console.log("✅ matchedImages after normalization", matchedImages);

    // Other dress types
    const otherDressTypes = boutique.dressTypes.filter(
        dt => !dt.type.toLowerCase().includes(query.toLowerCase())
    );

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
            tension: 300,
            friction: 8,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 300,
            friction: 8,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                onPress={() => router.push(`/boutique/${boutique._id}`)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                className="mb-6"
                activeOpacity={1}
            >
                <View className="bg-white rounded-3xl shadow-xl shadow-indigo-500/20 overflow-hidden border border-purple-100/50">

                    {/* Images Section - Top Priority */}
                    {matchedImages.length > 0 ? (
                        <View className="relative">
                            {/* Gradient Overlay Header */}
                            <View className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-transparent p-4">
                                <View className="flex-row items-center justify-between">
                                    <View className="bg-white/20 backdrop-blur rounded-2xl px-4 py-2 border border-white/30">
                                        <Text className="text-white font-bold text-lg capitalize">
                                            {matchedTypeName} Collection
                                        </Text>
                                    </View>
                                    <View className="bg-gradient-to-r from-pink-500 to-violet-600 rounded-full px-3 py-1.5 shadow-lg">
                                        <Text className="text-white text-sm font-bold">
                                            {matchedImages.length} styles
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                className="bg-gradient-to-br from-purple-50 to-pink-50"
                                contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
                            >
                                {matchedImages.map((img, idx) => (
                                    <View key={`matched-${idx}`} className="mr-3">
                                        <View className="relative">
                                            <View className="bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 rounded-2xl p-1 shadow-lg">
                                                <Image
                                                    source={{ uri: img }}
                                                    className="w-40 h-52 rounded-xl"
                                                    resizeMode="cover"
                                                />
                                            </View>
                                            {/* Floating Index Badge */}
                                            <View className="absolute bottom-2 right-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full w-8 h-8 items-center justify-center shadow-lg">
                                                <Text className="text-white font-bold text-xs">
                                                    {idx + 1}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>

                            {/* Decorative Bottom Wave */}
                            <View className="h-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-b-2xl" />
                        </View>
                    ) : (
                        <View className="bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 rounded-t-3xl p-8 items-center justify-center border-b-4 border-purple-200">
                            <View className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full items-center justify-center mb-4 shadow-lg">
                                <Text className="text-3xl">✨</Text>
                            </View>
                            <Text className="text-purple-700 text-center mb-2 font-bold text-lg">
                                "{matchedTypeName}" Collection
                            </Text>
                            <Text className="text-purple-500 text-center text-sm">
                                Images coming soon • Tap to explore
                            </Text>
                        </View>
                    )}

                    {/* Boutique Details Section */}
                    <View className="bg-gradient-to-br from-white to-gray-50 p-6">
                        {/* Boutique Name & Location */}
                        <View className="mb-4">
                            <View className="flex-row items-center justify-between mb-3">
                                <Text className="text-2xl font-bold text-gray-800 flex-1">{boutique.name}</Text>

                                {/* Premium Rating Badge */}
                                <View className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl px-4 py-2 shadow-lg border-2 border-white">
                                    <View className="flex-row items-center">
                                        <Text className="text-white text-lg mr-1">⭐</Text>
                                        <Text className="text-white font-bold text-sm">
                                            {boutique.averageRating.toFixed(1)}/5
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row items-center">
                                <View className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-3" />
                                <Text className="text-gray-600 font-medium text-base">{boutique.area}</Text>
                            </View>
                        </View>

                        {/* Other Collections */}
                        {otherDressTypes.length > 0 && (
                            <View className="border-t border-purple-100 pt-4 mt-2">
                                <View className="flex-row items-center mb-3">
                                    <View className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mr-2" />
                                    <Text className="text-base font-bold text-gray-700 flex-1">
                                        More Collections
                                    </Text>
                                    <View className="bg-gradient-to-r from-teal-400 to-cyan-500 px-2 py-1 rounded-full shadow-md">
                                        <Text className="text-white text-xs font-bold">
                                            +{otherDressTypes.length}
                                        </Text>
                                    </View>
                                </View>

                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingRight: 16 }}
                                >
                                    {otherDressTypes.map((dressType, idx) => {
                                        const firstImage = (dressType.images ?? []).find(img =>
                                            typeof img === 'string'
                                                ? img.trim() !== ''
                                                : (typeof img === 'object' && img !== null && 'url' in img && typeof img.url === 'string')
                                                    ? img.url.trim() !== ''
                                                    : false
                                        );

                                        let firstImageUrl = '';
                                        if (typeof firstImage === 'string') {
                                            firstImageUrl = firstImage;
                                        } else if (typeof firstImage === 'object' && firstImage !== null && 'url' in firstImage) {
                                            firstImageUrl = firstImage.url;
                                        }

                                        if (!firstImageUrl) {
                                            return null;
                                        }

                                        // Dynamic gradient colors for each item
                                        const gradientColors = [
                                            ['from-rose-400', 'to-pink-600'],
                                            ['from-violet-400', 'to-purple-600'],
                                            ['from-cyan-400', 'to-blue-600'],
                                            ['from-emerald-400', 'to-teal-600'],
                                            ['from-orange-400', 'to-red-600'],
                                        ];
                                        const [fromColor, toColor] = gradientColors[idx % gradientColors.length];

                                        return (
                                            <View key={`other-${idx}`} className="mr-3 items-center">
                                                <View className={`bg-gradient-to-br ${fromColor} ${toColor} rounded-xl p-1 shadow-md`}>
                                                    <Image
                                                        source={{ uri: firstImageUrl }}
                                                        className="w-20 h-28 rounded-lg"
                                                        resizeMode="cover"
                                                    />
                                                </View>
                                                <View className="mt-2 bg-white rounded-full px-2 py-1 shadow-sm border border-gray-100">
                                                    <Text className="text-xs text-gray-700 font-medium capitalize">
                                                        {dressType.type}
                                                    </Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    {/* Bottom Accent */}
                    <View className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 via-red-500 to-orange-500" />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default SearchedBoutiqueCard;