import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
    Animated,
    TouchableOpacity,
    View,
    Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavBarAutoHide } from "@/hooks/useNavBarAutoHide";
import { useEffect, useRef } from "react";

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="search" options={{ title: "Search" }} />
            <Tabs.Screen name="orders" options={{ title: "Orders" }} />
            <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </Tabs>
    );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
    const insets = useSafeAreaInsets();
    const translateY = useNavBarAutoHide(); // Custom scroll hook

    return (
        <Animated.View
            style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: "rgba(225, 203, 174, 0.95)",
                position: "absolute",
                bottom: insets.bottom ? insets.bottom : 12,
                left: 12,
                right: 12,
                height: 60,
                borderRadius: 30,
                paddingHorizontal: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.15,
                shadowRadius: 5,
                elevation: 5,
                transform: [{ translateY }],
                zIndex: 999,
                backdropFilter: Platform.OS === "web" ? "blur(10px)" : undefined,
            }}
        >
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
                    index: "home-outline",
                    search: "search-outline",
                    orders: "receipt-outline",
                    profile: "person-outline",
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            flex: 1,
                            height: "100%",
                        }}
                    >
                        {isFocused && (
                            <Animated.View
                                style={{
                                    position: "absolute",
                                    top: 12,
                                    width: 48,
                                    height: 39,
                                    borderRadius: 18,
                                    backgroundColor: "#1959AD66",
                                    transform: [{ scale: 1.1 }], // optional scale on highlight
                                }}
                            />
                        )}

                        <AnimatedIcon
                            name={iconMap[route.name]}
                            isFocused={isFocused}
                        />
                    </TouchableOpacity>
                );
            })}
        </Animated.View>
    );
}

// ✅ AnimatedIcon Component
const AnimatedIcon = ({
                          name,
                          isFocused,
                      }: {
    name: keyof typeof Ionicons.glyphMap;
    isFocused: boolean;
}) => {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scale, {
            toValue: isFocused ? 1.2 : 1,
            useNativeDriver: true,
            friction: 4,
        }).start();
    }, [isFocused]);

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Ionicons name={name} size={22} color={isFocused ? "#000" : "#333"} />
        </Animated.View>
    );
};
