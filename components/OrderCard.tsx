import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Order } from "@/types/order";
import { data as boutiques } from "@/lib/data";
import { Linking, Alert } from "react-native";


export default function OrderCard({ order }: { order: Order }) {
    const boutique = boutiques.find((b) => b.id === order.boutiqueId);
    if (!boutique) return null;

    const displayImage =
        order.image ||
        (boutique.gallery?.length ? boutique.gallery[0] : undefined) ||
        boutique.image;

    return (
        <Animated.View
            entering={FadeInUp.duration(400).springify()}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-5"
        >
            {/* Header */}
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                    <Text className="text-lg font-semibold">{boutique.name}</Text>
                    <Text className="text-xs text-gray-500">{boutique.location}</Text>
                    <Text className="text-xs text-gray-400 mt-0.5">Order ID: #{order.id}</Text>
                </View>
                <View className={`px-2 py-0.5 rounded-full ${order.statusColor} shadow-sm`}>
                    <Text className="text-xs font-medium capitalize">{order.status}</Text>
                </View>
            </View>

            {/* Body */}
            <View className="flex-row space-x-4">
                <Image
                    source={
                        typeof displayImage === "string"
                            ? { uri: displayImage }
                            : displayImage
                    }
                    resizeMode="cover"
                    className="w-24 h-32 rounded-lg"
                />

                <View className="flex-1 justify-between">
                    <View>
                        <Text className="text-base font-semibold">{order.type}</Text>
                        <Text
                            className="text-sm text-gray-600 mt-0.5"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {order.description}
                        </Text>

                        <View className="flex-row items-center mt-2">
                            <Ionicons name="calendar-outline" size={16} color="gray" />
                            <Text className="text-sm text-gray-500 ml-1">
                                {order.ordered}
                            </Text>
                        </View>
                    </View>

                    <Text className="text-base font-bold text-black mt-2">{order.price}</Text>
                </View>
            </View>

            {/* Footer Actions */}
            <View className="flex-row justify-between items-center mt-4 border-t border-gray-100 pt-3">
                <Pressable
                    onPress={() => {
                        if (boutique.phone) {
                            const message = `Hi, I have a question about my order #${order.id}.`;
                            const whatsappURL = `https://wa.me/${boutique.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`;
                            Linking.openURL(whatsappURL).catch(() =>
                                Alert.alert("Error", "Unable to open WhatsApp")
                            );
                        } else {
                            Alert.alert("Contact Info", "Boutique contact not available.");
                        }
                    }}
                >
                    <Text className="text-sm text-gray-700 font-semibold">Contact</Text>
                </Pressable>


                <View className="flex-row space-x-4">
                    {order.status === "Pending" && (
                        <Pressable>
                            <Text className="text-sm text-red-600 font-semibold">Cancel</Text>
                        </Pressable>
                    )}
                    {order.status === "Shipped" && (
                        <Pressable>
                            <Text className="text-sm text-blue-600 font-semibold">Track</Text>
                        </Pressable>
                    )}
                    {order.status === "Delivered" && (
                        <Pressable>
                            <Text className="text-sm text-green-600 font-semibold">Rate</Text>
                        </Pressable>
                    )}
                </View>

                <Link href={`/orders/${order.id}`} asChild>
                    <Pressable>
                        <Text className="text-sm text-indigo-600 font-semibold">
                            View →
                        </Text>
                    </Pressable>
                </Link>
            </View>
        </Animated.View>
    );
}
