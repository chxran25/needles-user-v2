import { View, Text, Pressable, Dimensions, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import { BlurView } from "expo-blur";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolate,
    withTiming,
    runOnJS,
} from "react-native-reanimated";
import OrderCard from "@/components/OrderCard";
import SkeletonCard from "@/components/SkeletonCard";
import { OrderStatus } from "@/types/order";
import { sampleOrders } from "@/lib/data";
import { FlatList as GestureFlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TABS: OrderStatus[] = ["Pending", "Shipped", "Delivered", "Cancelled"];

export default function OrdersScreen() {
    const [activeTab, setActiveTab] = useState<OrderStatus>("Pending");
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const router = useRouter();

    const scrollY = useSharedValue(0);
    const fadeOpacity = useSharedValue(1);

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

    const fadeOutStyle = useAnimatedStyle(() => ({
        opacity: fadeOpacity.value,
    }));

    const filteredOrders = sampleOrders.filter((order) => order.status === activeTab);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1200);
    };

    // Simplest navigation function
    const handleStartShopping = () => {
        router.push("/");
    };

    return (
        <View className="flex-1 bg-black">
            <Animated.View style={[{ flex: 1 }, fadeOutStyle]}>
                <Animated.FlatList
                    data={isLoading ? [] : filteredOrders}
                    keyExtractor={(item) => item.id}
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
                    ListHeaderComponent={
                        <Animated.View style={[headerAnimatedStyle, { width: SCREEN_WIDTH }]}>
                            <BlurView
                                intensity={40}
                                tint="dark"
                                style={{
                                    width: SCREEN_WIDTH,
                                    borderBottomLeftRadius: 24,
                                    borderBottomRightRadius: 27,
                                    overflow: "hidden",
                                }}
                            >
                                <View className="bg-black/70 px-4 pb-6 pt-12">
                                    <SafeAreaView edges={['top']} className="bg-transparent">
                                        {/* Title */}
                                        <Text className="text-3xl font-bold text-white tracking-tight mb-1">
                                            My Orders
                                        </Text>

                                        {/* Subtitle */}
                                        <Text className="text-sm text-white/80 mb-4">
                                            Track your pending, shipped, or delivered orders
                                        </Text>

                                        {/* Status Tabs */}
                                        <GestureFlatList
                                            horizontal
                                            data={TABS}
                                            keyExtractor={(item) => item}
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ gap: 12 }}
                                            renderItem={({ item: tab }) => (
                                                <Pressable onPress={() => setActiveTab(tab)}>
                                                    <View
                                                        className={`min-h-[30px] px-3 py-1 justify-center rounded-full ${
                                                            activeTab === tab ? "bg-white" : "bg-black/30"
                                                        }`}
                                                    >
                                                        <Text
                                                            className={`text-xs font-medium leading-[18px] ${
                                                                activeTab === tab
                                                                    ? "text-black"
                                                                    : "text-white/80"
                                                            }`}
                                                        >
                                                            {tab}
                                                        </Text>
                                                    </View>
                                                </Pressable>
                                            )}
                                        />
                                    </SafeAreaView>
                                </View>
                            </BlurView>
                        </Animated.View>
                    }
                    ListEmptyComponent={
                        isLoading ? (
                            <View className="px-4 mt-4 space-y-4 bg-white">
                                {[...Array(3)].map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </View>
                        ) : (
                            <View className="flex-1 items-center justify-center py-16 px-6 bg-white">
                                <Text className="text-6xl mb-4">🧵</Text>
                                <Text className="text-lg text-gray-600 mb-2 text-center font-semibold">
                                    No {activeTab.toLowerCase()} orders
                                </Text>
                                <Text className="text-sm text-gray-400 mb-6 text-center text-wrap">
                                    {activeTab === "Pending"
                                        ? "You're all caught up — no pending orders."
                                        : activeTab === "Shipped"
                                            ? "No orders are currently in transit."
                                            : activeTab === "Delivered"
                                                ? "You haven't received any orders yet."
                                                : "You have no cancelled orders."}
                                </Text>
                                <Pressable
                                    onPress={handleStartShopping}
                                    className="bg-red-500 px-4 py-2 rounded-full"
                                >
                                    <Text className="text-white font-semibold text-sm">Start Shopping</Text>
                                </Pressable>
                            </View>
                        )
                    }
                    contentContainerStyle={{
                        paddingTop: 0,
                        paddingBottom: 120,
                        backgroundColor: "white",
                        flexGrow: 1,
                    }}
                    ListFooterComponent={<View className="px-4" />}
                    className="bg-white"
                />
            </Animated.View>
        </View>
    );
}