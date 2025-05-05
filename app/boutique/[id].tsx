import { View, Text, Image, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import ImageViewing from 'react-native-image-viewing';
import { boutiqueData } from '@/lib/boutiqueData';

const placeholderImage = require('@/assets/images/gallery-banner.jpg');

export default function BoutiqueDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const boutique = boutiqueData.find((b) => b.id === id) || boutiqueData[0];
    const galleryImages =
        (boutique.gallery && boutique.gallery.length > 0
                ? boutique.gallery
                : [
                    Image.resolveAssetSource(placeholderImage).uri,
                    Image.resolveAssetSource(placeholderImage).uri,
                    Image.resolveAssetSource(placeholderImage).uri,
                ]
        ).map((uri) => ({ uri }));

    return (
        <ScrollView className="flex-1 bg-[#FFF2D7]">
            {/* Fullscreen Preview */}
            <ImageViewing
                images={galleryImages}
                imageIndex={currentIndex}
                visible={visible}
                onRequestClose={() => setVisible(false)}
            />

            {/* Header Banner as Background */}
            <View className="relative">
                <TouchableOpacity onPress={() => { setCurrentIndex(0); setVisible(true); }}>
                    <ImageBackground
                        source={placeholderImage}
                        className="w-full h-72 justify-end pb-6"
                        imageStyle={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="absolute top-10 left-4 bg-white/80 p-2 rounded-full"
                >
                    <Ionicons name="arrow-back" size={22} color="black" />
                </TouchableOpacity>
            </View>

            {/* Boutique Details */}
            <View className="px-4 pt-6">
                {/* Name and Rating */}
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-2xl font-bold text-gray-900">{boutique.name}</Text>
                    <View className="flex-row">
                        {Array.from({ length: boutique.rating }).map((_, i) => (
                            <Ionicons key={i} name="star" size={18} color="#facc15" />
                        ))}
                        {Array.from({ length: 5 - boutique.rating }).map((_, i) => (
                            <Ionicons key={`empty-${i}`} name="star-outline" size={18} color="#d1d5db" />
                        ))}
                    </View>
                </View>

                {/* Description */}
                <Text className="text-sm font-semibold text-gray-700 mb-1">— Description</Text>
                <View className="bg-green-100 px-4 py-3 rounded-2xl mb-4">
                    <Text className="italic text-gray-800 text-center text-sm">{boutique.description}</Text>
                </View>

                {/* Tags */}
                <View className="flex-row flex-wrap gap-2 mb-4 justify-center">
                    {boutique.tags.map((tag, i) => (
                        <Text
                            key={i}
                            className="bg-blue-100 text-blue-600 px-3 py-1 text-sm rounded-full font-semibold"
                        >
                            {tag}
                        </Text>
                    ))}
                </View>

                {/* Our Work Section */}
                <View className="flex-row items-center mb-3">
                    <Text className="text-sm font-semibold text-gray-700 mr-2">— Our Work</Text>
                    <View className="flex-1 h-px bg-gray-400" />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
                    {galleryImages.map((img, index) => (
                        <TouchableOpacity key={index} onPress={() => { setCurrentIndex(index); setVisible(true); }}>
                            <Image
                                source={{ uri: img.uri }}
                                className="w-32 h-40 mr-4 rounded-3xl"
                                style={{ backgroundColor: '#f3f4f6' }}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* CTA Button */}
                <View className="bg-white rounded-t-3xl shadow-lg mt-2 px-4">
                    <TouchableOpacity
                        className="py-5"
                        onPress={() => router.push('/boutique/order-form')}
                    >
                        <Text className="text-center text-lg font-semibold text-gray-700">Place Your Order</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
