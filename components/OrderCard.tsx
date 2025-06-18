import { View, Text, Image } from "react-native";
import { Order } from "@/types/order";

interface OrderCardProps {
    order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
    return (
        <View className="bg-white rounded-xl shadow-md mb-4 overflow-hidden mx-4">
            <Image
                source={{ uri: order.imageUrl }}
                className="w-full h-40"
                resizeMode="cover"
            />
            <View className="p-4 space-y-1">
                <Text className="text-base font-bold text-gray-900">
                    {order.dressType}
                </Text>
                <Text className="text-sm text-gray-500">{order.boutiqueName}</Text>
                <Text className="text-sm text-gray-600">
                    Status: <Text className="font-medium">{order.status}</Text>
                </Text>
                <Text className="text-sm text-gray-600">
                    Delivery by: {order.deliveryDate}
                </Text>
                <Text className="text-sm text-gray-800 font-semibold">
                    ₹{order.price}
                </Text>
            </View>
        </View>
    );
}
