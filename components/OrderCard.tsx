// components/OrderCard.tsx
import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import Animated, { FadeInUp } from 'react-native-reanimated';


type OrderCardProps = {
    order: {
        id: string;
        boutique: string;
        type: string;
        description: string;
        ordered: string;
        price: string;
        status: string;
        statusColor: string;
        image?: string;
    };
};

export default function OrderCard({ order }: { order: OrderCardProps["order"] }) {
    return (
        <Animated.View
            entering={FadeInUp.duration(400).springify()}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-4"
        >

        {/* Header */}
            <View className="flex-row justify-between items-start mb-3">
                <View>
                    <Text className="text-[20px] font-semibold">{order.boutique}</Text>
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
                        order.image
                            ? { uri: order.image }
                            : require("@/assets/images/popular/pop-dress.jpg")
                    }
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
                <Pressable>
                    <Text className="text-sm text-gray-700">Track Order</Text>
                </Pressable>
                <Pressable>
                    <Text className="text-sm text-gray-700">Contact Seller</Text>
                </Pressable>
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
