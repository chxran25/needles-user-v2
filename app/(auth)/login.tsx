import { useState } from "react";
import { View, Text, TextInput, Pressable, Image, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "react-native-toast-notifications";
import { userLogin } from "@/services/api";

export default function LoginScreen() {
    const router = useRouter();
    const toast = useToast();

    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!phone || phone.length < 10) {
            toast.show("Please enter a valid phone number", { type: "danger" });
            return;
        }

        try {
            setLoading(true);
            let formattedPhone = phone.trim();
            if (!formattedPhone.startsWith("+91")) {
                formattedPhone = "+91" + formattedPhone;
            }

            console.log("📞 Attempting login with phone:", formattedPhone);
            const response = await userLogin({ phone: formattedPhone });

            console.log("✅ Login response:", response);
            toast.show("OTP sent to your phone!", { type: "success" });

            router.push({
                pathname: "/otp",
                params: { phone: formattedPhone },
            });
        } catch (error: any) {
            console.log("❌ Login error:", error);

            const message =
                error?.response?.data?.message ||
                error?.data?.message ||
                "Login failed. Try again.";

            toast.show(message, { type: "danger" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FFF2D7] px-6">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                className="flex-1 justify-center"
            >
                {/* 🧵 Logo */}
                <View className="items-center mb-10">
                    <Image
                        source={require("../../assets/images/needles-logo.png")}
                        resizeMode="contain"
                        className="h-28 w-64" // ⬅️ Bigger: height 112px, width 256px
                    />

                    <Text className="text-base text-gray-700 mt-2 tracking-wide">
                        Another <Text className="text-yellow-700 font-semibold">stitch</Text> just a login away!
                    </Text>
                </View>


                {/* 🪡 Form Card */}
                <View className="bg-white rounded-3xl p-6 shadow-lg">
                    <Text className="text-gray-700 font-medium mb-2">Phone Number</Text>
                    <TextInput
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholder="e.g. 9876543210"
                        placeholderTextColor="#aaa"
                        className="bg-gray-100 rounded-xl px-5 py-3 text-lg text-gray-800"
                    />

                    <Pressable
                        onPress={handleLogin}
                        disabled={loading}
                        className="mt-5 bg-black rounded-xl py-4 shadow-md"
                    >
                        <Text className="text-white text-center font-semibold text-lg tracking-wide">
                            {loading ? "Sending OTP..." : "Login"}
                        </Text>
                    </Pressable>
                </View>

                {/* Divider */}
                <View className="flex-row items-center my-8">
                    <View className="flex-1 h-px bg-gray-300" />
                    <Text className="mx-3 text-gray-400">Or login with</Text>
                    <View className="flex-1 h-px bg-gray-300" />
                </View>

                {/* 🎯 Social Login */}
                <View className="flex-row justify-center space-x-6">
                    <Pressable className="bg-white p-3 rounded-full shadow">
                        <Ionicons name="logo-facebook" size={26} color="#1877F2" />
                    </Pressable>
                    <Pressable className="bg-white p-3 rounded-full shadow">
                        <Ionicons name="logo-google" size={26} color="#DB4437" />
                    </Pressable>
                    <Pressable className="bg-white p-3 rounded-full shadow">
                        <Ionicons name="logo-apple" size={26} color="#000" />
                    </Pressable>
                </View>

                {/* 🔗 Register Link */}
                <Pressable onPress={() => router.push("/register")} className="mt-10">
                    <Text className="text-center text-gray-800 text-base">
                        Don’t have an account?{" "}
                        <Text className="text-amber-600 font-semibold underline">Register Now</Text>
                    </Text>
                </Pressable>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
