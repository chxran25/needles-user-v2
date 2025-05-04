import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import ImageViewing from 'react-native-image-viewing';

const placeholderImage = require('@/assets/images/gallery-banner.jpg');

export default function BoutiqueDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [visible, setVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 🧠 Trick: Slightly modify the same URI so each is unique
    const resolvedUri = Image.resolveAssetSource(placeholderImage).uri;
    const galleryImages = [
        { uri: `${resolvedUri}?v=1` },
        { uri: `${resolvedUri}?v=2` },
        { uri: `${resolvedUri}?v=3` },
    ];

    return (
        <ScrollView className="flex-1 bg-[#FFF2D7] px-4 pt-12">
            {/* Image Modal */}
            <ImageViewing
                images={galleryImages}
                imageIndex={currentIndex}
                visible={visible}
                onRequestClose={() => setVisible(false)}
            />

            {/* Main Banner */}
            <TouchableOpacity onPress={() => { setCurrentIndex(0); setVisible(true); }}>
                <Image
                    source={placeholderImage}
                    className="w-full h-48 rounded-xl mb-4"
                    resizeMode="cover"
                />
            </TouchableOpacity>

            {/* Boutique Info */}
            <View className="space-y-2 mb-4">
                <Text className="text-2xl font-bold text-gray-800">Tattva Fashions</Text>
                <Text className="text-base text-gray-600">📍 Miyapur, Hyderabad</Text>
                <Text className="text-sm text-gray-700">
                    Specializing in handcrafted blouses, lehengas, and wedding attire.
                </Text>
            </View>

            {/* Tags */}
            <View className="flex-row flex-wrap gap-2 mb-4">
                {['Lehengas', 'Blouses', 'Sarees'].map((tag, i) => (
                    <Text
                        key={`tag-${i}`}
                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                    >
                        {tag}
                    </Text>
                ))}
            </View>

            {/* Gallery */}
            <Text className="text-lg font-semibold mb-2">Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                {galleryImages.map((img, index) => (
                    <TouchableOpacity key={`gallery-${index}`} onPress={() => { setCurrentIndex(index); setVisible(true); }}>
                        <Image
                            source={placeholderImage}
                            className="w-40 h-28 mr-3 rounded-lg"
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* CTA */}
            <TouchableOpacity
                className="bg-blue-600 py-4 rounded-xl mb-10"
                onPress={() => router.push('/boutique/order-form')}
            >
                <Text className="text-white text-center font-semibold text-base">Place Order</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
