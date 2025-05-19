import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Order } from "@/types/order";
import { data as boutiques } from "@/lib/data";

export default function OrderCard({ order }: { order: Order }) {
    // Get boutique info from central data using boutiqueId
    const boutique = boutiques.find((b) => b.id === order.boutiqueId);

    if (!boutique) return null;

    // Prefer order.image > boutique.gallery[0] > boutique.image
    const displayImage =
        order.image ||
        (boutique.gallery?.length ? boutique.gallery[0] : undefined) ||
        boutique.image;

    return (
        <Animated.View
            entering={FadeInUp.duration(400).springify()}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-4"
        >
            {/* Header */}
            <View className="flex-row justify-between items-start mb-3">
                <View>
                    <Text className="text-[20px] font-semibold">{boutique.name}</Text>
                    <Text className="text-xs text-gray-500 mt-0.5">{boutique.location}</Text>
                    <Text className="text-xs text-gray-500 mt-1">#{order.id}</Text>
                </View>
                <View className={`px-2 py-1 rounded-full ${order.statusColor}`}>
                    <Text className="text-xs font-medium">{order.status}</Text>
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

                <View className="flex-1 justify-between px-4 py-2">
                    <View>
                        <Text className="text-[18px] font-bold">{order.type}</Text>
                        <Text
                            className="text-base text-gray-600 mt-1"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {order.description}
                        </Text>

                        <View className="flex-row items-center mt-2 space-x-2">
                            <Ionicons name="calendar-outline" size={18} color="gray" />
                            <Text className="text-sm text-gray-500 px-1">
                                Ordered: {order.ordered}
                            </Text>
                        </View>
                    </View>

                    <Text className="text-lg font-bold mt-2">{order.price}</Text>
                </View>
            </View>

            {/* Footer Actions */}
            <View className="flex-row justify-between mt-4 border-t border-gray-200 pt-3">
                {order.status === "Pending" || order.status === "Shipped" ? (
                    <Pressable>
                        <Text className="text-sm text-red-600 font-semibold">Cancel</Text>
                    </Pressable>
                ) : (
                    <View />
                )}

                {order.status === "Shipped" && (
                    <Pressable>
                        <Text className="text-sm text-gray-700">Track Order</Text>
                    </Pressable>
                )}

                {order.status === "Delivered" && (
                    <Pressable>
                        <Text className="text-sm text-green-600 font-semibold">Rate</Text>
                    </Pressable>
                )}

                <Link href={`/orders/${order.id}`} asChild>
                    <Pressable>
                        <Text className="text-sm text-indigo-600 font-semibold">
                            View Details →
                        </Text>
                    </Pressable>
                </Link>
            </View>
        </Animated.View>
    );
}
