import { View, Text, Pressable, Dimensions, StatusBar } from "react-native";
import { useEffect, useState } from "react";
import { BlurView } from "expo-blur";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolate,
} from "react-native-reanimated";
import OrderCard from "@/components/OrderCard";
import SkeletonCard from "@/components/SkeletonCard";
import { OrderStatus } from "@/types/order";
import { sampleOrders } from "@/lib/data";
import { FlatList as GestureFlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TABS: OrderStatus[] = ["Pending", "Shipped", "Delivered", "Cancelled"];

export default function OrdersScreen() {
    const [activeTab, setActiveTab] = useState<OrderStatus>("Pending");
    const [isLoading, setIsLoading] = useState(true);

    const filteredOrders = sampleOrders.filter((order) => order.status === activeTab);

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

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View className="flex-1 bg-black">
            {/*<StatusBar barStyle="light-content" backgroundColor="transparent" translucent />*/}
            <Animated.FlatList
                data={isLoading ? [] : filteredOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <OrderCard order={item} />}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
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
                                                            activeTab === tab ? "text-black" : "text-white/80"
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
                        <View className="bg-white flex-1">
                            <Text className="text-center text-gray-400 mt-10">
                                No orders found in this category.
                            </Text>
                        </View>
                    )
                }
                contentContainerStyle={{
                    paddingTop: 0,  // Removed padding here
                    paddingBottom: 120,
                    backgroundColor: "white",
                    flexGrow: 1
                }}
                ListFooterComponent={<View className="px-4" />}
                className="bg-white"
            />
        </View>
    );
}