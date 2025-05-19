import { View, Text, FlatList, Pressable } from "react-native";
import { useEffect, useState } from "react";
import OrderCard from "@/components/OrderCard";
import { OrderStatus } from "@/types/order";
import { sampleOrders } from "@/lib/data";
import SkeletonCard from "@/components/SkeletonCard"; // ✅ Custom skeleton component

const TABS: OrderStatus[] = ["Pending", "Shipped", "Delivered", "Cancelled"];

export default function OrdersScreen() {
    const [activeTab, setActiveTab] = useState<OrderStatus>("Pending");
    const [isLoading, setIsLoading] = useState(true);

    const filteredOrders = sampleOrders.filter((order) => order.status === activeTab);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200); // Simulate data load
        return () => clearTimeout(timer);
    }, [activeTab]);

    return (
        <View className="flex-1 bg-white pt-6">
            {/* Heading */}
            <Text className="text-3xl font-bold px-4">My Orders</Text>

            {/* Scrollable Tabs */}
            <FlatList
                horizontal
                data={TABS}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 18,
                    paddingBottom: 12,
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
                                className={`text-sm font-medium ${
                                    activeTab === tab ? "text-white" : "text-gray-500"
                                }`}
                            >
                                {tab}
                            </Text>
                        </View>
                    </Pressable>
                )}
            />

            {/* Skeleton or Order List */}
            {isLoading ? (
                <View className="px-4 pt-2">
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
                        paddingTop: 0,
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
