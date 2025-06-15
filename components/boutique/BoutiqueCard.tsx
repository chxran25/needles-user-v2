import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import CategoryTags from './CategoryTags';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    id: string;
    name: string;
    tags: string[];
    location: string;
    image: string | number | null; // string URL or require() or null
    rating: number;
};

export default function BoutiqueCard({
                                         id,
                                         name,
                                         tags,
                                         location,
                                         image,
                                         rating,
                                     }: Props) {
    const isRemoteImage = typeof image === 'string' && image.trim() !== '';

    return (
        <Link href={{ pathname: '/boutique/[id]', params: { id } }} asChild>
            <TouchableOpacity
                className="bg-white rounded-xl px-4 py-1 shadow-md border border-gray-100"
                activeOpacity={0.9}
            >
                {/* Boutique Image */}
                <Image
                    source={
                        isRemoteImage
                            ? { uri: image }
                            : require('@/assets/images/fallback-image.png') // 👈 fallback
                    }
                    className="w-full h-40 rounded-lg"
                    resizeMode="cover"
                />

                {/* Name & Rating */}
                <View className="flex-row justify-between items-center mt-3">
                    <Text
                        className="text-[22px] font-bold text-gray-900 flex-1"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {name}
                    </Text>
                    <View className="flex-row ml-2">
                        {Array.from({ length: Math.floor(rating) }).map((_, i) => (
                            <Ionicons
                                key={i}
                                name="star"
                                size={16}
                                color="#FFD700"
                                style={{ marginRight: 2 }}
                            />
                        ))}
                    </View>
                </View>

                {/* Tags */}
                <View className="mt-5">
                    <Text className="text-l text-gray-600 font-medium mb-1">
                        Known for:
                    </Text>
                    <CategoryTags categories={tags} />
                </View>

                {/* Location */}
                <View className="pt-3">
                    <Text className="text-m text-gray-500">{'📍'} {location}</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
}
