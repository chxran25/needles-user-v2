import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
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

            await saveToken("accessToken", response.accessToken);
            await saveToken("refreshToken", response.refreshToken);

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
        <SafeAreaView className="flex-1 bg-[#FFF2D7] justify-center px-6">
            <Text className="text-3xl font-bold text-black mb-4 text-center">Enter OTP</Text>
            <Text className="text-lg text-gray-700 text-center mb-6">
                We sent a 6-digit code to{" "}
                <Text className="font-semibold text-black">{phone}</Text>
            </Text>

            <TextInput
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="Enter OTP"
                placeholderTextColor="#999"
                className="bg-white px-4 py-3 rounded-xl mb-4 shadow border border-gray-300 text-center text-lg tracking-widest"
            />

            <Pressable
                onPress={handleVerify}
                disabled={loading}
                className="bg-black py-4 rounded-xl mt-2"
            >
                <Text className="text-white text-center font-semibold text-lg">
                    {loading ? "Verifying..." : "Verify OTP"}
                </Text>
            </Pressable>
        </SafeAreaView>
    );
}