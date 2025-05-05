import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

type Props = {
    id: string;
    name: string;
    tags: string[];
    location: string;
    image: string;
    rating: number;
};

export default function BoutiqueCard({ id, name, tags, location, image, rating }: Props) {
    return (
        <Link href={{ pathname: "/boutique/[id]", params: { id } }} asChild>
            <TouchableOpacity className="bg-white rounded-2xl px-5 py-4 shadow-md space-y-3">
                {/* Static Banner */}
                <Image
                    source={require('@/assets/images/gallery-banner.jpg')}
                    style={{ width: '100%', height: 80, borderRadius: 12 }}
                    className="mb-2"
                    resizeMode="cover"
                />

                {/* Boutique Image */}
                <Image
                    source={{ uri: image }}
                    className="w-full h-40 rounded-xl"
                    resizeMode="cover"
                />

                {/* Name */}
                <Text className="text-lg font-bold text-gray-900">{name}</Text>

                {/* ⭐ Rating */}
                <View className="flex-row">
                    {Array.from({ length: rating }).map((_, i) => (
                        <Text key={i}>⭐</Text>
                    ))}
                </View>

                {/* Tags */}
                <View className="space-y-1">
                    <Text className="text-sm text-gray-600 font-medium">Known for:</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <Text
                                key={index}
                                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                            >
                                {tag}
                            </Text>
                        ))}
                    </View>
                </View>

                {/* Location */}
                <View className="pt-2">
                    <Text className="text-sm text-gray-500">📍 {location}</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
}
