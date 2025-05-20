import { View, Text, FlatList, Pressable } from "react-native";
import { useEffect, useState } from "react";
import OrderCard from "@/components/OrderCard";
import { OrderStatus } from "@/types/order";
import { sampleOrders } from "@/lib/data";
import SkeletonCard from "@/components/SkeletonCard"; // Custom skeleton component

const TABS: OrderStatus[] = ["Pending", "Shipped", "Delivered", "Cancelled"];

export default function OrdersScreen() {
    const [activeTab, setActiveTab] = useState<OrderStatus>("Pending");
    const [isLoading, setIsLoading] = useState(true);

    const filteredOrders = sampleOrders.filter((order) => order.status === activeTab);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200); // Simulate initial data load
        return () => clearTimeout(timer);
    }, []); // Load only on initial mount

    return (
        <View className="flex-1 bg-white pt-6">
            {/* Elegant Header */}
            <View className="px-4 pt-2 pb-4">
                <Text className="text-4xl font-bold text-gray-900 tracking-tight mb-2">
                    My Orders
                </Text>
                <Text className="text-0.5xl text-gray-500 mb-4">
                    Track your pending, shipped, or delivered orders
                </Text>
            </View>

            {/* Status Tabs */}
            <FlatList
                horizontal
                data={TABS}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 0,
                    paddingBottom: 20, // increased from 12 for more breathing room
                    gap: 20,
                }}
                renderItem={({ item: tab }) => (
                    <Pressable onPress={() => setActiveTab(tab)}>
                        <View
                            className={`px-4 py-1 rounded-full ${
                                activeTab === tab ? "bg-black" : "bg-gray-100"
                            }`}
                        >
                            <Text
                                className={`text-m font-medium ${
                                    activeTab === tab ? "text-white" : "text-gray-500"
                                }`}
                            >
                                {tab}
                            </Text>
                        </View>
                    </Pressable>
                )}
            />


            {/* Orders List or Skeleton Loader */}
            {isLoading ? (
                <View className="px-4 mt-2 space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </View>
            ) : (
                <FlatList
                    data={filteredOrders}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <OrderCard order={item} />}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingTop: 12, // Clean gap between tabs and first card
                        paddingBottom: 120,
                    }}
                    ListEmptyComponent={
                        <Text className="text-center text-gray-400 mt-10">
                            No orders found in this category.
                        </Text>
                    }
                />
            )}
        </View>
    );
}
