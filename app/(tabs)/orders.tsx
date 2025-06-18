import { View, Text, Pressable, RefreshControl, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { BlurView } from "expo-blur";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolate,
} from "react-native-reanimated";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";

import {
    fetchActualPendingOrders,
    fetchNotPaidOrders,
    fetchPaidOrders,
} from "@/services/api";
import { Order } from "@/types/order";

import OrderCard from "@/components/OrderCard";
import SkeletonCard from "@/components/SkeletonCard";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TABS = ["Pending", "Paid", "Not Paid"];

export default function OrdersScreen() {
    const [activeTab, setActiveTab] = useState("Pending");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const toast = useToast();

    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        const translateY = interpolate(scrollY.value, [0, 100], [0, -10], Extrapolate.CLAMP);
        const opacity = interpolate(scrollY.value, [0, 100], [1, 0], Extrapolate.CLAMP);
        return { transform: [{ translateY }], opacity };
    });

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            let data: Order[] = [];

            if (activeTab === "Pending") {
                data = await fetchActualPendingOrders();
            } else if (activeTab === "Paid") {
                data = await fetchPaidOrders();
            } else if (activeTab === "Not Paid") {
                data = await fetchNotPaidOrders();
            }

            if (!Array.isArray(data)) throw new Error("Invalid orders response");
            setOrders(data);
        } catch (error) {
            console.error("❌ Failed to load orders:", error);
            setOrders([]);
            toast.show("Failed to load orders", { type: "danger" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [activeTab]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchOrders();
        setIsRefreshing(false);
    };

    return (
        <View className="flex-1 bg-black">
            {/* 🔒 Sticky Header Outside FlatList */}
            <Animated.View
                style={[
                    headerAnimatedStyle,
                    {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 10,
                    },
                ]}
            >
                <BlurView
                    intensity={40}
                    tint="dark"
                    style={{
                        width: SCREEN_WIDTH,
                        borderBottomLeftRadius: 24,
                        borderBottomRightRadius: 24,
                        overflow: "hidden",
                    }}
                >
                    <View className="bg-black/70 px-4 pb-6 pt-12">
                        <SafeAreaView edges={["top"]} className="bg-transparent">
                            <Text className="text-3xl font-bold text-white tracking-tight mb-1">
                                My Orders
                            </Text>
                            <Text className="text-sm text-white/80 mb-4">
                                Track your pending, paid, or not paid orders
                            </Text>
                            <View className="flex-row gap-x-3">
                                {TABS.map((tab) => (
                                    <Pressable key={tab} onPress={() => setActiveTab(tab)}>
                                        <View
                                            className={`min-h-[30px] px-4 py-1 justify-center rounded-full ${
                                                activeTab === tab ? "bg-white" : "bg-black/30"
                                            }`}
                                        >
                                            <Text
                                                className={`text-sm font-semibold ${
                                                    activeTab === tab
                                                        ? "text-black"
                                                        : "text-white/80"
                                                }`}
                                            >
                                                {tab}
                                            </Text>
                                        </View>
                                    </Pressable>
                                ))}
                            </View>
                        </SafeAreaView>
                    </View>
                </BlurView>
            </Animated.View>

            {/* 🔄 Order List */}
            <Animated.FlatList
                data={isLoading ? [] : orders}
                keyExtractor={(item, index) => item.id?.toString() ?? `order-${index}`}
                renderItem={({ item }) => <OrderCard order={item} />}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor="#000"
                    />
                }
                ListEmptyComponent={
                    isLoading ? (
                        <View className="px-4 mt-4 space-y-4 bg-white">
                            {[...Array(3)].map((_, i) => (
                                <SkeletonCard key={`skeleton-${i}`} />
                            ))}
                        </View>
                    ) : (
                        <View className="flex-1 items-center justify-center py-16 px-6 bg-white">
                            <Text className="text-6xl mb-4">🧵</Text>
                            <Text className="text-lg text-gray-600 mb-2 font-semibold">
                                No {activeTab.toLowerCase()} orders
                            </Text>
                            <Text className="text-sm text-gray-400 text-center">
                                You're all caught up for now.
                            </Text>
                        </View>
                    )
                }
                contentContainerStyle={{
                    paddingTop: 240, // ⬅️ Space for header height
                    paddingBottom: 120,
                    backgroundColor: "white",
                    flexGrow: 1,
                }}
                ListFooterComponent={<View className="px-4" />}
                className="bg-white"
            />
        </View>
    );
}
