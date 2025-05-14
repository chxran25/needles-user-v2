import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function OrderDetailsScreen() {
    const { orderId } = useLocalSearchParams();

    return (
        <ScrollView className="bg-white flex-1 px-4 pt-6">
            <Text className="text-3xl font-bold mb-4">Order Details</Text>

            <View className="rounded-2xl border border-gray-200 p-4 mb-6">
                <View className="flex-row items-center space-x-4">
                    <Image
                        source={require("@/assets/images/popular/pop-dress.jpg")}
                        className="w-16 h-20 rounded-md"
                    />
                    <View>
                        <Text className="font-semibold text-lg">Tattva Fashions</Text>
                        <Text className="text-gray-500">Lehenga</Text>
                        <Text className="text-gray-500">May 14, 2025</Text>
                    </View>
                </View>

                <View className="mt-4">
                    <Text className="font-semibold text-base mb-1">Instructions</Text>
                    <Text className="text-gray-700">Sleeveless, side zip, extra flare</Text>
                </View>

                <View className="mt-4">
                    <Text className="font-semibold text-base mb-1">Reference Image</Text>
                    <Image
                        source={require("@/assets/images/popular/pop-dress.jpg")}
                        className="w-full h-60 rounded-md mt-2"
                        resizeMode="cover"
                    />
                </View>

                <View className="mt-4">
                    <Text className="font-semibold text-base mb-2">Measurements</Text>
                    <View className="flex-row justify-between">
                        <View>
                            <Text>Chest: 34 in</Text>
                            <Text>Waist: 28 in</Text>
                        </View>
                        <View>
                            <Text>Hips: 38 in</Text>
                            <Text>Length: 44 in</Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row justify-between mt-6">
                    <Pressable className="flex-1 border border-black rounded-xl p-3 mr-2">
                        <Text className="text-center font-medium">Provide Feedback</Text>
                    </Pressable>
                    <Pressable className="flex-1 border border-black rounded-xl p-3 ml-2">
                        <Text className="text-center font-medium">Rate Boutique</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}
