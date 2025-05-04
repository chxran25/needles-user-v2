import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#FFF2D7] justify-center px-6">
            <Pressable onPress={() => router.back()} className="absolute top-10 left-4">
                <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>

            <View className="mt-10">
                <Text className="text-4xl font-bold text-black mb-4">Needles</Text>
                <Text className="text-lg text-black mb-8">
                    Another <Text className="text-yellow-700 font-semibold">stitch</Text> just a Login away!
                </Text>

                <TextInput
                    placeholder="Enter your Phone Number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    className="bg-white px-4 py-3 rounded-xl mb-4 shadow border border-gray-300"
                />

                <Pressable className="bg-black py-4 rounded-xl">
                    <Text className="text-white text-center font-semibold">Login</Text>
                </Pressable>

                <Text className="text-center text-gray-500 mt-6">Or Login with</Text>

                <View className="flex-row justify-center space-x-6 mt-4">
                    <Ionicons name="logo-facebook" size={28} color="#3b5998" />
                    <Ionicons name="logo-google" size={28} color="#DB4437" />
                    <Ionicons name="logo-apple" size={28} color="#000" />
                </View>

                <Pressable onPress={() => router.push("/(auth)/register")} className="mt-6">
                    <Text className="text-center text-black">
                        Don’t have an account? <Text className="text-yellow-700 font-medium">Register Now</Text>
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
