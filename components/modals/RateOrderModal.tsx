// components/modals/RateOrderModal.tsx
import { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Pressable,
    Animated,
    Dimensions,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { submitOrderRating } from "@/services/api";
import { X } from "lucide-react-native";

interface RateOrderModalProps {
    boutiqueId: string;
    orderId: string; // ✅ Add this line
    visible: boolean;
    onClose: () => void;
}


const { width } = Dimensions.get('window');

export default function RateOrderModal({ boutiqueId, orderId, visible, onClose }: RateOrderModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.3));
    const [starAnimations] = useState([...Array(5)].map(() => new Animated.Value(1)));
    const toast = useToast();

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.3,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const animateStar = (index: number) => {
        // Animate the selected star and all previous stars
        for (let i = 0; i <= index; i++) {
            Animated.sequence([
                Animated.timing(starAnimations[i], {
                    toValue: 1.2,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.spring(starAnimations[i], {
                    toValue: 1,
                    tension: 300,
                    friction: 5,
                    useNativeDriver: true,
                }),
            ]).start();
        }

        // Reset unselected stars
        for (let i = index + 1; i < 5; i++) {
            Animated.spring(starAnimations[i], {
                toValue: 1,
                tension: 200,
                friction: 8,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleStarPress = (star: number) => {
        setRating(star);
        animateStar(star - 1);
    };

    const handleSubmit = async () => {
        if (rating < 1 || rating > 5) {
            toast.show("Please select a rating between 1 and 5.", { type: "warning" });
            return;
        }

        try {
            setLoading(true);
            await submitOrderRating({ boutiqueId, rating, comment, orderId });
            toast.show("Rating submitted successfully!", { type: "success" });
            onClose();
        } catch (err: any) {
            console.error("❌ Rating error:", err);
            toast.show(err?.response?.data?.message || "Failed to submit rating", { type: "danger" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="none" transparent>
            <Animated.View
                style={{ opacity: fadeAnim }}
                className="flex-1 justify-center items-center px-6"
            >
                {/* Backdrop with blur effect */}
                <View className="absolute inset-0 bg-black/60" />

                <Animated.View
                    style={{
                        transform: [{ scale: scaleAnim }],
                        width: Math.min(width - 48, 400)
                    }}
                    className="bg-white rounded-2xl overflow-hidden"
                >
                    {/* Header with gradient accent */}
                    <View className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-5 border-b border-gray-100">
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-xl font-bold text-gray-900">Rate Your Experience</Text>
                                <Text className="text-sm text-gray-600 mt-1">Help others discover great boutiques</Text>
                            </View>
                            <Pressable
                                onPress={onClose}
                                className="w-8 h-8 rounded-full bg-white/80 items-center justify-center shadow-sm"
                                style={{ elevation: 2 }}
                            >
                                <X size={18} color="#6B7280" />
                            </Pressable>
                        </View>
                    </View>

                    {/* Content */}
                    <View className="px-6 py-6">
                        {/* Rating Stars */}
                        <View className="items-center mb-6">
                            <Text className="text-base font-medium text-gray-700 mb-4">How was your experience?</Text>
                            <View className="flex-row justify-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity
                                        key={star}
                                        onPress={() => handleStarPress(star)}
                                        className="p-3"
                                        activeOpacity={0.6}
                                    >
                                        <Animated.View
                                            style={{
                                                transform: [{ scale: starAnimations[star - 1] }]
                                            }}
                                        >
                                            <Text
                                                className={`text-4xl ${
                                                    star <= rating
                                                        ? "text-orange-400"
                                                        : "text-gray-200"
                                                }`}
                                                style={{
                                                    textShadowColor: star <= rating ? 'rgba(251, 146, 60, 0.5)' : 'transparent',
                                                    textShadowOffset: { width: 0, height: 2 },
                                                    textShadowRadius: 6,
                                                }}
                                            >
                                                ★
                                            </Text>
                                        </Animated.View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {rating > 0 && (
                                <Text className="text-sm text-gray-500 mt-2">
                                    {rating === 1 && "Poor"}
                                    {rating === 2 && "Fair"}
                                    {rating === 3 && "Good"}
                                    {rating === 4 && "Very Good"}
                                    {rating === 5 && "Excellent"}
                                </Text>
                            )}
                        </View>

                        {/* Comment Input */}
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-700 mb-3">
                                Share your thoughts (optional)
                            </Text>
                            <View className="relative">
                                <TextInput
                                    placeholder="Tell us about your experience..."
                                    value={comment}
                                    onChangeText={setComment}
                                    multiline
                                    numberOfLines={4}
                                    className="border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 bg-gray-50"
                                    style={{
                                        textAlignVertical: 'top',
                                        minHeight: 80,
                                        fontSize: 16,
                                        lineHeight: 22,
                                    }}
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading}
                            className="py-4 rounded-xl items-center shadow-lg"
                            style={{
                                backgroundColor: loading
                                    ? '#D1D5DB'
                                    : '#F97316',
                                backgroundImage: loading
                                    ? undefined
                                    : 'linear-gradient(135deg, #F97316 0%, #FB923C 50%, #FBBF24 100%)',
                                elevation: loading ? 0 : 6,
                                shadowColor: loading ? 'transparent' : '#F97316',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: loading ? 0 : 0.4,
                                shadowRadius: 12,
                            }}
                            activeOpacity={0.85}
                        >
                            <Text className="text-white font-bold text-lg">
                                {loading ? "Submitting..." : "Submit Rating"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}