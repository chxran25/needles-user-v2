    import {
        View,
        Text,
        Image,
        ScrollView,
        TouchableOpacity,
        ImageBackground,
        TextInput,
    } from 'react-native';
    import { useLocalSearchParams, useRouter } from 'expo-router';
    import { useState, useRef, useMemo, useCallback } from 'react';
    import { Ionicons } from '@expo/vector-icons';
    import ImageViewing from 'react-native-image-viewing';
    import { BottomSheetModal } from '@gorhom/bottom-sheet';
    import { boutiqueData } from '@/lib/boutiqueData';

    const placeholderImage = require('@/assets/images/gallery-banner.jpg');

    export default function BoutiqueDetails() {
        const { id } = useLocalSearchParams();
        const router = useRouter();
        const [visible, setVisible] = useState(false);
        const [currentIndex, setCurrentIndex] = useState(0);

        const boutique = boutiqueData.find((b) => b.id === id) || boutiqueData[0];
        const galleryImages =
            boutique.gallery?.length > 0
                ? boutique.gallery.map((uri) => ({ uri }))
                : [
                    { uri: Image.resolveAssetSource(placeholderImage).uri },
                    { uri: Image.resolveAssetSource(placeholderImage).uri },
                    { uri: Image.resolveAssetSource(placeholderImage).uri },
                ];

        const bottomSheetRef = useRef<BottomSheetModal>(null);
        const snapPoints = useMemo(() => ['65%'], []);
        const openSheet = useCallback(() => bottomSheetRef.current?.present(), []);

        return (
            <View className="flex-1 bg-[#FFF2D7]">
                <ImageViewing
                    images={galleryImages}
                    imageIndex={currentIndex}
                    visible={visible}
                    onRequestClose={() => setVisible(false)}
                />

                <ScrollView className="flex-1">
                    {/* Header Banner */}
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

                    {/* Details */}
                    <View className="px-4 pt-6 pb-28">
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
                            <Text className="italic text-gray-800 text-center text-sm">
                                {boutique.description}
                            </Text>
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

                        {/* Gallery */}
                        <View className="flex-row items-center mb-3">
                            <Text className="text-sm font-semibold text-gray-700 mr-2">— Our Work</Text>
                            <View className="flex-1 h-px bg-gray-400" />
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
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
                    </View>
                </ScrollView>

                {/* Slide Up CTA */}
                <TouchableOpacity
                    className="absolute bottom-6 left-4 right-4 bg-black py-4 rounded-2xl shadow-xl"
                    onPress={openSheet}
                >
                    <View className="flex-row justify-center items-center">
                        <Ionicons name="chevron-up" size={20} color="white" />
                        <Text className="ml-1 text-white font-semibold text-base">Place Your Order</Text>
                    </View>
                </TouchableOpacity>

                {/* Bottom Sheet for Order Form */}
                <BottomSheetModal ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
                    <View className="px-4 pt-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">Place Your Order</Text>
                        <View className="space-y-4">
                            <TextInput
                                placeholder="Your Name"
                                className="bg-gray-100 px-4 py-3 rounded-xl text-gray-800"
                            />
                            <TextInput
                                placeholder="Phone Number"
                                keyboardType="phone-pad"
                                className="bg-gray-100 px-4 py-3 rounded-xl text-gray-800"
                            />
                            <TextInput
                                placeholder="Dress Type or Custom Request"
                                multiline
                                className="bg-gray-100 px-4 py-3 rounded-xl text-gray-800 h-24 text-start"
                            />
                            <TouchableOpacity className="bg-black py-3 rounded-xl">
                                <Text className="text-white text-center font-semibold">Submit Order</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheetModal>
            </View>
        );
    }
