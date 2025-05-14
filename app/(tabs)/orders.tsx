import { View, Text, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import OrderCard from "@/components/OrderCard";

const TABS = ["Active", "Completed", "Cancelled"];

const orders = [
    {
        id: "32598",
        boutique: "Tattva Fashions",
        type: "Lehenga",
        description: "Sleeveless, side zip, extra flare",
        ordered: "May 14, 2025",
        delivery: "May 22, 2025",
        price: "₹12,499",
        status: "Pending",
        statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
        id: "32581",
        boutique: "Ethnic Elegance",
        type: "Silk Saree",
        description: "Blue Kanchipuram, golden border",
        ordered: "May 10, 2025",
        delivery: "May 18, 2025",
        price: "₹8,999",
        status: "Shipped",
        statusColor: "bg-blue-100 text-blue-800",
    },
];

export default function OrdersScreen() {
    const [activeTab, setActiveTab] = useState("Active");

    return (
        <View className="flex-1 bg-white px-4 pt-6">
            <Text className="text-3xl font-bold mb-4">My Orders</Text>

            {/* Tabs */}
            <View className="flex-row justify-between mb-4">
                {TABS.map((tab) => (
                    <Pressable key={tab} onPress={() => setActiveTab(tab)} className="flex-1 items-center">
                        <Text className={`text-base font-semibold ${activeTab === tab ? "text-black" : "text-gray-400"}`}>
                            {tab}
                        </Text>
                        {activeTab === tab && <View className="h-1 w-3/5 bg-black mt-1 rounded-full" />}
                    </Pressable>
                ))}
            </View>

            <ScrollView className="space-y-4">
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </ScrollView>
        </View>
    );
}
