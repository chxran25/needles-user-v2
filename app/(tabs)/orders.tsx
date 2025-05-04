// File: app/(tabs)/orders.tsx

import { View, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import OrderCard from '@/components/order/OrderCard';

// Define the order type
export type Order = {
    id: string;
    boutiqueName: string;
    status: string;
    date: string;
    totalAmount: string;
};

// Mock orders (can be empty to test empty state)
const mockOrders = [
    {
        id: "1",
        boutiqueName: "Tattva Fashions",
        dressType: "Lehenga",
        status: "Processing",
        totalAmount: "₹3200",
        datePlaced: "01 May 2025",
    },
    {
        id: "2",
        boutiqueName: "Miyapur Store",
        dressType: "Saree",
        status: "Shipped",
        totalAmount: "₹1450",
        datePlaced: "28 Apr 2025",
    },
    {
        id: "3",
        boutiqueName: "Ethnic Elegance",
        dressType: "Blouse",
        status: "Delivered",
        totalAmount: "₹850",
        datePlaced: "20 Apr 2025",
    },
];

export default function OrdersScreen() {
    return (
        <ScrollView className="flex-1 bg-[#FFF2D7] px-4 pt-12">
            <Text className="text-2xl font-semibold mb-6 text-center">My Orders</Text>

            {mockOrders.length === 0 ? (
                <View className="flex-1 justify-center items-center mt-32">
                    <Text className="text-xl font-semibold text-gray-600 text-center">
                        You haven't placed any orders yet.
                    </Text>
                    <Text className="text-base text-gray-500 mt-2 text-center px-6">
                        Looks like your order list is empty. Once you place an order,
                        you’ll see it right here!
                    </Text>
                </View>
            ) : (
                mockOrders.map((order) => (
                    <OrderCard key={order.id} {...order} />
                ))
            )}
        </ScrollView>
    );
}
