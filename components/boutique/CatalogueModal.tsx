import { View, Text, TouchableOpacity, ScrollView, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useRef } from "react";

export type CatalogueItem = {
    itemName: string;
    price: number;
};

type CatalogueModalProps = {
    visible: boolean;
    onClose: () => void;
    catalogueItems: CatalogueItem[];
};

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function CatalogueModal({ visible, onClose, catalogueItems }: CatalogueModalProps) {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <View className="absolute inset-0 justify-center items-center z-50">
            {/* ✅ Blur Background */}
            <>
                <BlurView intensity={90} tint="dark" className="absolute inset-0" />
                <View className="absolute inset-0 bg-black/50" />
            </>

            {/* ✅ Floating Catalogue Box */}
            <Animated.View
                style={{ opacity }}
                className="w-[90%] max-h-[60%] bg-black rounded-2xl p-5"
            >
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-white text-lg font-bold uppercase">CATALOGUE</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    {catalogueItems.length === 0 ? (
                        <Text className="text-white text-center mt-6 uppercase">No items available.</Text>
                    ) : (
                        catalogueItems.map((item, index) => (
                            <View
                                key={index}
                                className="flex-row justify-between py-3 border-b border-white/10"
                            >
                                <Text className="text-white uppercase">{item.itemName}</Text>
                                <Text className="text-white font-semibold uppercase">₹{item.price}</Text>
                            </View>
                        ))
                    )}
                </ScrollView>
            </Animated.View>
        </View>
    );
}
