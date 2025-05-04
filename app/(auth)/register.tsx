// File: app/(auth)/register.tsx

import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#FFF2D7] justify-center px-6">
            <Pressable onPress={() => router.back()} className="absolute top-10 left-4">
                <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>

            <View className="mt-10">
                <Text className="text-4xl font-bold text-black mb-4">Register</Text>
                <Text className="text-lg text-black mb-8">Create an account to get started</Text>

                <TextInput
                    placeholder="Full Name"
                    placeholderTextColor="#999"
                    className="bg-white px-4 py-3 rounded-xl mb-4 shadow border border-gray-300"
                />

                <TextInput
                    placeholder="Phone Number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    className="bg-white px-4 py-3 rounded-xl mb-4 shadow border border-gray-300"
                />

                <TextInput
                    placeholder="Create Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    className="bg-white px-4 py-3 rounded-xl mb-4 shadow border border-gray-300"
                />

                <Pressable className="bg-black py-4 rounded-xl">
                    <Text className="text-white text-center font-semibold">Register</Text>
                </Pressable>

                <Pressable onPress={() => router.push("/(auth)/login")} className="mt-6">
                    <Text className="text-center text-black">
                        Already have an account? <Text className="text-yellow-700 font-medium">Login</Text>
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
