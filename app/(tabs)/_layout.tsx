import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
    View,
    Text,
    TouchableWithoutFeedback,
    Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useRef } from "react";

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

    const iconNameMap: Record<string, keyof typeof Ionicons.glyphMap> = {
        index: "home-outline",
        search: "search-outline",
        orders: "receipt-outline",
        profile: "person-outline",
    };

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: "#E1CBAE",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                marginHorizontal: 12,
                marginBottom: insets.bottom > 0 ? insets.bottom : 6,
                paddingTop: 10,
                paddingBottom: 12,
                elevation: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
            }}
        >
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel ?? options.title ?? route.name;
                const isFocused = state.index === index;

                return (
                    <TouchableWithoutFeedback
                        key={route.key}
                        onPress={() => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true,
                            });
                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        }}
                    >
                        <View style={{ flex: 1, alignItems: "center" }}>
                            <Ionicons
                                name={iconNameMap[route.name]}
                                size={22}
                                color={isFocused ? "#000" : "#444"}
                            />
                            <Text
                                style={{
                                    fontSize: 12,
                                    marginTop: 2,
                                    color: isFocused ? "#000" : "#444",
                                    fontWeight: isFocused ? "600" : "400",
                                }}
                            >
                                {label}
                            </Text>

                            {/* Highlight Dot */}
                            {isFocused && (
                                <View
                                    style={{
                                        marginTop: 4,
                                        width: 6,
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: "#000", // dot color
                                    }}
                                />
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                );
            })}
        </View>
    );
}

