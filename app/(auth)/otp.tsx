import { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import { verifyOtp } from "@/services/api";
import { saveToken } from "@/utils/secureStore";

export default function OtpScreen() {
    const router = useRouter();
    const toast = useToast();
    const { phone } = useLocalSearchParams();

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        const phoneNumber = typeof phone === "string" ? phone : "";

        if (!phoneNumber) {
            toast.show("Phone number is missing. Please retry login.", { type: "danger" });
            router.replace("/login");
            return;
        }

        if (!otp || otp.length !== 6) {
            toast.show("Please enter a valid 6-digit OTP", { type: "danger" });
            return;
        }

        try {
            setLoading(true);
            console.log("📨 Verifying OTP", { phone: phoneNumber, otp });

            const response = await verifyOtp({ phone: phoneNumber, otp });

            console.log("✅ OTP Verified!");
            console.log("🔐 Access Token:", response.accessToken);
            console.log("🔁 Refresh Token:", response.refreshToken);

            toast.show("Verification successful!", { type: "success" });

            // ✅ Save both tokens securely
            await saveToken("accessToken", response.accessToken);
            await saveToken("refreshToken", response.refreshToken);

            // ✅ Navigate to Home screen
            router.replace("/");
        } catch (error: any) {
            console.log("❌ OTP Verification Error:", error);

            const message =
                error?.response?.data?.message ||
                error?.data?.message ||
                "OTP verification failed";

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
                <View className="items-center mb-6">
                    <Text className="text-4xl font-extrabold text-black mb-2">Enter OTP</Text>
                    <Text className="text-base text-gray-600 text-center">
                        We sent a 6-digit code to{" "}
                        <Text className="font-semibold text-gray-900">{phone}</Text>
                    </Text>
                </View>

                <View className="bg-white p-6 rounded-3xl shadow-lg">
                    <Text className="text-sm text-gray-700 font-medium mb-2">OTP Code</Text>
                    <TextInput
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                        maxLength={6}
                        placeholder="Enter OTP"
                        placeholderTextColor="#999"
                        className="bg-gray-100 px-5 py-3 rounded-xl text-center text-xl tracking-widest text-gray-800"
                    />

                    <Pressable
                        onPress={handleVerify}
                        disabled={loading}
                        className="mt-5 bg-black py-4 rounded-xl shadow-md active:opacity-90"
                    >
                        <Text className="text-white text-center font-semibold text-lg">
                            {loading ? "Verifying..." : "Verify OTP"}
                        </Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
