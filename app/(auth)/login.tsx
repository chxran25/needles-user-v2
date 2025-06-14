import { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
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
            console.log("❌ Login error:", error); // Enhanced visibility

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
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 justify-center">
                <View className="mt-10">
                    <Text className="text-4xl font-bold text-black mb-4">Needles</Text>
                    <Text className="text-lg text-black mb-8">
                        Another <Text className="text-yellow-700 font-semibold">stitch</Text> just a login away!
                    </Text>

                    <TextInput
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Enter your Phone Number"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                        className="bg-white px-4 py-3 rounded-xl mb-4 shadow border border-gray-300"
                    />

                    <Pressable
                        onPress={handleLogin}
                        disabled={loading}
                        className="bg-black py-4 rounded-xl"
                    >
                        <Text className="text-white text-center font-semibold text-lg">
                            {loading ? "Sending OTP..." : "Login"}
                        </Text>
                    </Pressable>

                    <Text className="text-center text-gray-500 mt-6">Or login with</Text>

                    <View className="flex-row justify-center space-x-6 mt-4">
                        <Ionicons name="logo-facebook" size={28} color="#3b5998" />
                        <Ionicons name="logo-google" size={28} color="#DB4437" />
                        <Ionicons name="logo-apple" size={28} color="#000" />
                    </View>

                    <Pressable onPress={() => router.push("/register")} className="mt-6">
                        <Text className="text-center text-black">
                            Don’t have an account? <Text className="text-yellow-700 font-medium">Register Now</Text>
                        </Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
