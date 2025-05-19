import { View, Text, FlatList, Pressable } from "react-native";
import { useState } from "react";
import OrderCard from "@/components/OrderCard";
import { Order, OrderStatus } from "@/types/order";
import { sampleOrders } from "@/lib/data";


const TABS: OrderStatus[] = ["Pending", "Shipped", "Delivered", "Cancelled"];

const orders: Order[] = [
    {
        id: "32598",
        boutiqueId: "tattva-fashions", // <-- matches ID from lib/data.ts
        type: "Lehenga",
        description: "Sleeveless, side zip, extra flare",
        ordered: "May 14, 2025",
        price: "₹12,499",
        status: "Pending",
        statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
        id: "32581",
        boutiqueId: "kurti-couture",
        type: "Casual Kurti",
        description: "Printed, breathable cotton",
        ordered: "May 10, 2025",
        price: "₹1,499",
        status: "Shipped",
        statusColor: "bg-blue-100 text-blue-800",
    },
    {
        id: "32580",
        boutiqueId: "lehenga-leaf",
        type: "Bridal Lehenga",
        description: "Full embroidery, 3-layer flare",
        ordered: "May 02, 2025",
        price: "₹24,999",
        status: "Delivered",
        statusColor: "bg-green-100 text-green-800",
    },
];


export default function OrdersScreen() {
    const [activeTab, setActiveTab] = useState<OrderStatus>("Pending");

    const filteredOrders = orders.filter((order) => order.status === activeTab);

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
                    paddingTop: 16,
                    paddingBottom: 8, // ⬅ more balanced than putting `mt-2` outside
                    gap: 24,
                }}
                renderItem={({ item: tab }) => (
                    <Pressable onPress={() => setActiveTab(tab)} className="items-center">
                        <Text
                            className={`text-lg font-semibold ${
                                activeTab === tab ? "text-black" : "text-gray-400"
                            }`}
                        >
                            {tab}
                        </Text>
                        {activeTab === tab && (
                            <View className="h-1 w-3/4 bg-black mt-1 rounded-full" />
                        )}
                    </Pressable>
                )}
            />

            {/* Orders List */}
            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <OrderCard order={item} />}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 8, // ⬅ reduced spacing before first card
                    paddingBottom: 100,
                }}
                ListEmptyComponent={
                    <Text className="text-center text-gray-400 mt-10">
                        No orders found in this category.
                    </Text>
                }
            />
        </View>
    );
}
