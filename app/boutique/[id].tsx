import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Animated,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import ImageViewing from "react-native-image-viewing";
import { boutiqueData } from "@/lib/boutiqueData";
import CategoryTags from "@/components/boutique/CategoryTags";

const placeholderImage = require("@/assets/images/gallery-banner.jpg");
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function BoutiqueDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Animation related states and refs
    const slideAnim = useRef(new Animated.Value(0)).current;
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

    const boutique = boutiqueData.find((b) => b.id === id) || boutiqueData[0];
    const galleryImages =
        boutique.gallery?.length > 0
            ? boutique.gallery.map((uri) => ({ uri }))
            : [
                { uri: Image.resolveAssetSource(placeholderImage).uri },
                { uri: Image.resolveAssetSource(placeholderImage).uri },
                { uri: Image.resolveAssetSource(placeholderImage).uri },
            ];

    // Function to toggle the order form
    const toggleOrderForm = () => {
        // If closed, open it
        if (!isOrderFormOpen) {
            setIsOrderFormOpen(true);
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
        // If open, close it
        else {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setIsOrderFormOpen(false);
            });
        }
    };

    // Calculate the translateY value based on the animation
    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [SCREEN_HEIGHT, 0],
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
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
                    <View className="px-4 pt-6 pb-32">
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
                        <CategoryTags categories={boutique.tags} />

                        {/* Gallery */}
                        <View className="flex-row items-center mt-6 mb-3">
                            <Text className="text-sm font-semibold text-gray-700 mr-2">— Our Work</Text>
                            <View className="flex-1 h-px bg-gray-400" />
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                            {galleryImages.map((img, index) => (
                                <TouchableOpacity key={index} onPress={() => { setCurrentIndex(index); setVisible(true); }}>
                                    <Image
                                        source={{ uri: img.uri }}
                                        className="w-32 h-40 mr-4 rounded-3xl bg-gray-100"
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>

                {/* Fixed Bottom CTA Button */}
                <TouchableOpacity
                    className={`absolute bottom-6 left-4 right-4 bg-black py-4 rounded-2xl shadow-xl z-10 ${isOrderFormOpen ? "opacity-0" : ""}`}
                    onPress={toggleOrderForm}
                    style={{ opacity: isOrderFormOpen ? 0 : 1 }}
                >
                    <View className="flex-row justify-center items-center">
                        <Ionicons name="chevron-up" size={20} color="white" />
                        <Text className="ml-1 text-white font-semibold text-base">Place Your Order</Text>
                    </View>
                </TouchableOpacity>

                {/* Animated Order Form */}
                {isOrderFormOpen && (
                    <Animated.View
                        className="absolute left-0 right-0 bg-white z-20 rounded-t-3xl shadow-xl"
                        style={{
                            transform: [{ translateY }],
                            height: SCREEN_HEIGHT,
                        }}
                    >
                        <View className="flex-1 p-6">
                            {/* Handle for pulling down */}
                            <View className="items-center mb-4">
                                <TouchableOpacity onPress={toggleOrderForm} className="w-full items-center">
                                    <View className="w-16 h-1 bg-gray-300 rounded-full mb-2" />
                                    <Text className="text-gray-500 font-medium">Close</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Order Form Header */}
                            <Text className="text-2xl font-bold text-center mb-6">Place Your Order</Text>

                            {/* Order Form */}
                            <View className="space-y-4">
                                <View>
                                    <Text className="text-gray-700 font-medium mb-1">Your Name</Text>
                                    <TextInput
                                        className="bg-gray-100 p-3 rounded-xl"
                                        placeholder="Enter your full name"
                                    />
                                </View>

                                <View>
                                    <Text className="text-gray-700 font-medium mb-1">Phone Number</Text>
                                    <TextInput
                                        className="bg-gray-100 p-3 rounded-xl"
                                        placeholder="Enter your phone number"
                                        keyboardType="phone-pad"
                                    />
                                </View>

                                <View>
                                    <Text className="text-gray-700 font-medium mb-1">Service Type</Text>
                                    <View className="bg-gray-100 p-3 rounded-xl">
                                        <Text className="text-gray-500">{boutique.name} Service</Text>
                                    </View>
                                </View>

                                <View>
                                    <Text className="text-gray-700 font-medium mb-1">Appointment Date</Text>
                                    <TextInput
                                        className="bg-gray-100 p-3 rounded-xl"
                                        placeholder="Select date"
                                    />
                                </View>

                                <View>
                                    <Text className="text-gray-700 font-medium mb-1">Special Requests</Text>
                                    <TextInput
                                        className="bg-gray-100 p-3 rounded-xl"
                                        placeholder="Any special requests or notes"
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                    />
                                </View>

                                {/* Submit Button */}
                                <TouchableOpacity className="bg-black py-4 rounded-xl mt-6">
                                    <Text className="text-white font-semibold text-center text-base">Submit Order</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}
