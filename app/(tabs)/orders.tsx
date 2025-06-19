import { View, Text, Pressable, RefreshControl, Dimensions, StatusBar } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolate,
    withSpring,
    runOnJS,
} from "react-native-reanimated";
import { FlatList } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";

import {
    fetchActualPendingOrders,
    fetchNotPaidOrders,
    fetchPaidOrders,
    fetchCompletedOrders,
} from "@/services/api";
import { Order } from "@/types/order";

import OrderCard from "@/components/OrderCard";
import SkeletonCard from "@/components/SkeletonCard";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const TABS = ["Pending", "Paid", "Not Paid", "Completed"];
const HEADER_HEIGHT = 200;
const TAB_HEIGHT = 50;

export default function OrdersScreen() {
    const [activeTab, setActiveTab] = useState("Pending");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(true);
    const toast = useToast();

    const scrollY = useSharedValue(0);
    const tabIndicatorPosition = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
            const shouldShowHeader = event.contentOffset.y < 50;
            if (shouldShowHeader !== headerVisible) {
                runOnJS(setHeaderVisible)(shouldShowHeader);
            }
        },
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        const translateY = interpolate(scrollY.value, [0, HEADER_HEIGHT], [0, -HEADER_HEIGHT / 2], Extrapolate.CLAMP);
        const opacity = interpolate(scrollY.value, [0, HEADER_HEIGHT / 2], [1, 0], Extrapolate.CLAMP);
        const scale = interpolate(scrollY.value, [0, HEADER_HEIGHT], [1, 0.9], Extrapolate.CLAMP);
        return { transform: [{ translateY }, { scale }], opacity };
    });

    const stickyTabsStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [HEADER_HEIGHT - TAB_HEIGHT, HEADER_HEIGHT],
            [0, -TAB_HEIGHT],
            Extrapolate.CLAMP
        );
        return { transform: [{ translateY }] };
    });

    const tabIndicatorStyle = useAnimatedStyle(() => {
        return { transform: [{ translateX: tabIndicatorPosition.value }] };
    });

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            let data: Order[] = [];
            switch (activeTab) {
                case "Pending":
                    data = await fetchActualPendingOrders();
                    break;
                case "Paid":
                    data = await fetchPaidOrders();
                    break;
                case "Not Paid":
                    data = await fetchNotPaidOrders();
                    break;
                case "Completed":
                    data = await fetchCompletedOrders();
                    break;
                default:
                    throw new Error("Invalid tab selected");
            }
            setOrders(data);
        } catch (error) {
            console.error("❌ Failed to load orders:", error);
            setOrders([]);
            toast.show("Failed to load orders. Please try again.", { type: "danger", duration: 4000 });
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, toast]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await fetchOrders();
        setIsRefreshing(false);
    }, [fetchOrders]);

    const handleTabPress = useCallback((tab: string, index: number) => {
        setActiveTab(tab);
        const tabWidth = SCREEN_WIDTH / TABS.length;
        tabIndicatorPosition.value = withSpring(index * tabWidth);
    }, []);

    const renderOrderItem = useCallback(
        ({ item, index }: { item: Order; index: number }) => (
            <OrderCard order={item} type={activeTab.toLowerCase()} index={index} />
        ),
        [activeTab]
    );

    const renderEmptyComponent = useCallback(() => {
        if (isLoading) {
            return (
                <View className="px-4 mt-4 space-y-4 bg-white">
                    {Array.from({ length: 3 }, (_, i) => (
                        <SkeletonCard key={`skeleton-${i}`} />
                    ))}
                </View>
            );
        }

        return (
            <View className="flex-1 items-center justify-center py-16 px-6 bg-white min-h-[400px]">
                <Text className="text-6xl mb-4">🧵</Text>
                <Text className="text-lg text-gray-800 mb-2 font-semibold text-center">
                    No {activeTab.toLowerCase()} orders
                </Text>
                <Text className="text-sm text-gray-500 text-center leading-5">
                    {activeTab === "Pending"
                        ? "All your orders are up to date!"
                        : `You don't have any ${activeTab.toLowerCase()} orders at the moment.`}
                </Text>
                <Pressable onPress={fetchOrders} className="mt-6 bg-orange-500 px-6 py-3 rounded-full">
                    <Text className="text-white font-semibold">Refresh</Text>
                </Pressable>
            </View>
        );
    }, [isLoading, activeTab]);

    const keyExtractor = useCallback((item: Order, index: number): string => item.id?.toString() ?? `order-${index}`, []);

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="light-content" backgroundColor="#F97316" />

            <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }, headerAnimatedStyle]}>
                <LinearGradient
                    colors={["#F97316", "#FB923C", "#FFFFFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                        height: HEADER_HEIGHT + 50,
                        borderBottomLeftRadius: 24,
                        borderBottomRightRadius: 24,
                    }}
                >
                    <SafeAreaView edges={["top"]} className="flex-1 px-4 pt-4">
                        <View className="flex-1 justify-center">
                            <Text className="text-3xl font-bold text-white tracking-tight mb-2">My Orders</Text>
                            <Text className="text-base text-white/90 mb-6 leading-6">
                                Track and manage all your orders in one place
                            </Text>
                        </View>
                    </SafeAreaView>
                </LinearGradient>
            </Animated.View>

            <Animated.View
                style={[
                    {
                        position: "absolute",
                        top: HEADER_HEIGHT,
                        left: 0,
                        right: 0,
                        zIndex: 20,
                        backgroundColor: "white",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 5,
                    },
                    stickyTabsStyle,
                ]}
            >
                <View className="relative">
                    <Animated.View
                        style={[
                            {
                                position: "absolute",
                                bottom: 0,
                                height: 3,
                                width: SCREEN_WIDTH / TABS.length,
                                backgroundColor: "#F97316",
                                borderRadius: 2,
                            },
                            tabIndicatorStyle,
                        ]}
                    />
                    <View className="flex-row">
                        {TABS.map((tab, index) => (
                            <Pressable key={tab} onPress={() => handleTabPress(tab, index)} className="flex-1">
                                <View className="py-4 px-1 items-center justify-center">
                                    <Text
                                        className={`text-base font-semibold ${
                                            activeTab === tab ? "text-orange-500" : "text-gray-600"
                                        }`}
                                    >
                                        {tab}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </Animated.View>

            <Animated.FlatList
                data={orders}
                keyExtractor={keyExtractor}
                renderItem={renderOrderItem}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor="#F97316"
                        colors={["#F97316"]}
                        progressBackgroundColor="#FFFFFF"
                    />
                }
                ListEmptyComponent={renderEmptyComponent}
                contentContainerStyle={{
                    paddingTop: HEADER_HEIGHT + TAB_HEIGHT + 20,
                    paddingBottom: 100,
                    paddingHorizontal: 16,
                    flexGrow: 1,
                }}
                ItemSeparatorComponent={() => <View className="h-3" />}
                className="bg-white"
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
                initialNumToRender={8}
                getItemLayout={(data, index) => ({
                    length: 120,
                    offset: 120 * index,
                    index,
                })}
            />
        </View>
    );
}
