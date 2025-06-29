import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width: screenWidth } = Dimensions.get('window');

type DressType = {
    type: string;
    images?: (string | { url: string })[];
};

type Boutique = {
    _id?: string;
    boutiqueId?: string;
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

    const matchedDressTypes = (boutique.dressTypes ?? []).filter(dt =>
        dt.type.toLowerCase().includes(query.toLowerCase())
    );

    const matchedTypeName =
        matchedDressTypes.length > 0 ? matchedDressTypes[0].type : query;

    const matchedImages = matchedDressTypes.flatMap(dt =>
        (dt.images ?? []).map(img =>
            typeof img === 'string'
                ? img
                : img && typeof img === 'object' && 'url' in img
                    ? img.url
                    : ''
        )
    ).filter(img => img.trim() !== '');

    const otherDressTypes = boutique.dressTypes.filter(
        dt => !dt.type.toLowerCase().includes(query.toLowerCase())
    );

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const renderStarRating = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        for (let i = 0; i < fullStars; i++) {
            stars.push('⭐');
        }
        if (fullStars < 5) {
            const emptyStars = 5 - fullStars;
            for (let i = 0; i < emptyStars; i++) {
                stars.push('☆');
            }
        }
        return stars.join('');
    };

    return (
        <Animated.View
            style={{
                transform: [{ scale: scaleAnim }],
                marginHorizontal: 16,
                marginBottom: 20,
            }}
        >
            <TouchableOpacity
                onPress={() =>
                    router.push(`/boutique/${boutique._id || boutique.boutiqueId}`)
                }
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.95}
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 5,
                }}
            >
                <View className="bg-white rounded-2xl overflow-hidden">

                    {/* Matched Images */}
                    {matchedImages.length > 0 ? (
                        <View>
                            <View className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3">
                                <View className="flex-row items-center justify-between">
                                    <Text className="text-white font-semibold capitalize flex-1" numberOfLines={1}>
                                        {matchedTypeName}
                                    </Text>
                                    <Text className="text-white text-xs font-semibold ml-2">
                                        {matchedImages.length} {matchedImages.length === 1 ? 'style' : 'styles'}
                                    </Text>
                                </View>
                            </View>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                decelerationRate="fast"
                                snapToAlignment="center"
                                contentContainerStyle={{
                                    paddingVertical: 16,
                                    paddingHorizontal: 16,
                                }}
                            >
                                {matchedImages.map((img, idx) => (
                                    <View
                                        key={`matched-${idx}`}
                                        style={{ width: 140, marginRight: 12 }}
                                    >
                                        <View className="rounded-xl overflow-hidden bg-gray-100 shadow">
                                            <Image
                                                source={{ uri: img }}
                                                style={{ width: 140, height: 180 }}
                                                resizeMode="cover"
                                            />
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    ) : (
                        <View className="bg-gradient-to-br from-violet-100 to-pink-100 p-6 items-center justify-center">
                            <Text className="text-purple-700 font-bold text-lg mb-2">
                                {matchedTypeName}
                            </Text>
                            <Text className="text-purple-500 text-xs">
                                Collection images coming soon
                            </Text>
                        </View>
                    )}

                    {/* Details */}
                    <View className="p-5 bg-white">
                        <View className="flex-row items-start justify-between mb-3">
                            <View className="flex-1 mr-3">
                                <Text
                                    className="text-xl font-bold text-gray-900 mb-1"
                                    numberOfLines={2}
                                >
                                    {boutique.name}
                                </Text>
                                <View className="flex-row items-center">
                                    <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                    <Text className="text-gray-600 text-sm">{boutique.area}</Text>
                                </View>
                            </View>
                            <View className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl px-3 py-1 items-center">
                                <Text className="text-white text-xs font-bold">
                                    {renderStarRating(boutique.averageRating || 0)}
                                </Text>
                                <Text className="text-white text-xs font-semibold">
                                    {(boutique.averageRating || 0).toFixed(1)}/5
                                </Text>
                            </View>
                        </View>

                        {/* Other Collections */}
                        {otherDressTypes.length > 0 && (
                            <View className="border-t border-gray-100 pt-4 mt-2">
                                <Text className="text-sm font-semibold text-gray-800 mb-3">
                                    Other Collections ({otherDressTypes.length})
                                </Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingRight: 16 }}
                                >
                                    {otherDressTypes.slice(0, 6).map((dressType, idx) => {
                                        const firstImage = (dressType.images ?? []).find(img =>
                                            typeof img === 'string'
                                                ? img.trim() !== ''
                                                : typeof img === 'object' && 'url' in img
                                                    ? img.url.trim() !== ''
                                                    : false
                                        );
                                        let firstImageUrl = '';
                                        if (typeof firstImage === 'string') {
                                            firstImageUrl = firstImage;
                                        } else if (
                                            typeof firstImage === 'object' &&
                                            firstImage !== null &&
                                            'url' in firstImage
                                        ) {
                                            firstImageUrl = firstImage.url;
                                        }

                                        return (
                                            <View
                                                key={`other-${idx}`}
                                                style={{ width: 70, marginRight: 8 }}
                                                className="items-center"
                                            >
                                                <View className="bg-gray-200 rounded-lg overflow-hidden mb-2 shadow">
                                                    {firstImageUrl ? (
                                                        <Image
                                                            source={{ uri: firstImageUrl }}
                                                            className="w-16 h-20"
                                                            resizeMode="cover"
                                                        />
                                                    ) : (
                                                        <View className="w-16 h-20 items-center justify-center">
                                                            <Text className="text-gray-400 text-xl">👗</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text
                                                    className="text-xs text-gray-600 text-center capitalize"
                                                    numberOfLines={2}
                                                >
                                                    {dressType.type}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                    {otherDressTypes.length > 6 && (
                                        <View className="items-center justify-center ml-2" style={{ width: 50 }}>
                                            <View className="w-12 h-16 bg-purple-100 rounded-lg items-center justify-center mb-1">
                                                <Text className="text-purple-600 font-bold text-xs">
                                                    +{otherDressTypes.length - 6}
                                                </Text>
                                            </View>
                                            <Text className="text-xs text-gray-500 text-center">more</Text>
                                        </View>
                                    )}
                                </ScrollView>
                            </View>
                        )}
                    </View>
                    <View className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default SearchedBoutiqueCard;
