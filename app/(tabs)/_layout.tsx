import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
    Animated,
    TouchableOpacity,
    View,
    Platform,
    StyleSheet,
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
            style={[
                styles.tabBarContainer,
                {
                    paddingBottom: insets.bottom ? insets.bottom : 12,
                    transform: [{ translateY }],
                },
            ]}
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
                    orders: "bag-outline",
                    profile: "person-outline",
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={styles.tabButton}
                    >
                        <View style={styles.iconWrapper}>
                            <View
                                style={[
                                    styles.focusedCircleBase,
                                    isFocused && styles.focusedCircleActive,
                                ]}
                            />
                            <AnimatedIcon name={iconMap[route.name]} isFocused={isFocused} />
                        </View>
                    </TouchableOpacity>
                );
            })}
        </Animated.View>
    );
}

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
            toValue: isFocused ? 1.5 : 1,
            useNativeDriver: true,
            friction: 4,
        }).start();
    }, [isFocused]);

    return (
        <Animated.View style={{ transform: [{ scale }], zIndex: 2 }}>
            <Ionicons
                name={name}
                size={24}
                color={isFocused ? "#FFFFFF" : "#777777"}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "rgba(28, 27, 31, 0.8)", // 85% opacity
        position: "absolute",
        bottom: 15,
        left: 10,
        right: 10,
        height: 64,
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 999,
        overflow: "hidden", // prevents any overflow
    },
    tabButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
    },
    iconWrapper: {
        alignItems: "center",
        justifyContent: "center",
        width: 64,
        height: 64,
        borderRadius: 32,
        position: "relative",
        overflow: "hidden",
    },
    focusedCircleBase: {
        position: "absolute",
        width: 65,
        height: 55,
        borderRadius: 50,
        backgroundColor: "transparent",
        zIndex: 1,
    },
    focusedCircleActive: {
        backgroundColor: "#FF5A5F",
    },
});
