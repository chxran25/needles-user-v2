import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getCurrentCoordinates } from "@/utils/locationUtils";
import { useToast } from "react-native-toast-notifications";
import { useRouter } from "expo-router";
import api from "@/services/api";
import BackButton from "@/components/common/BackButton";

export default function UpdateLocation() {
    const toast = useToast();
    const router = useRouter();

    const [flatNumber, setFlatNumber] = useState("");
    const [block, setBlock] = useState("");
    const [street, setStreet] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const { latitude, longitude } = await getCurrentCoordinates();
            await api.put("/User/location", {
                lat: latitude,
                lng: longitude,
                flatNumber,
                block,
                street,
            });
            toast.show("📍 Location updated successfully!", { type: "success" });
            router.back();
        } catch (error: any) {
            toast.show(
                error?.response?.data?.error || "❌ Failed to update location",
                { type: "danger" }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Gradient Header */}
            <LinearGradient
                colors={["#fefefe", "#f4f4f5"]}
                className="absolute top-0 left-0 right-0 h-48 rounded-b-3xl z-0"
            />

            {/* Content Wrapper */}
            <View className="flex-1 pt-24 px-6 z-10">
                {/* Header Row: Back + Text */}
                <View className="mb-10 mt-1 px-1 flex-row items-start">
                    {/* Back Button */}
                    <BackButton
                        previousScreenLabel=""
                        className="mt-1 mr-2 px-2 py-2 rounded-full bg-white/90 shadow"
                        iconSize={22}
                        iconColor="black"
                    />

                    {/* Title and Subtitle */}
                    <View className="flex-1 px-3">
                        <Text className=" text-[28px] font-extrabold text-gray-900 mb-2" numberOfLines={1}>
                            Update Your Address
                        </Text>
                        <Text className="text-xl text-gray-600 leading-tight">
                            Enter your address details below
                        </Text>
                    </View>
                </View>

                {/* Form Fields */}
                <View className="space-y-6 mb-3">
                    {[
                        { label: "Flat Number", value: flatNumber, setValue: setFlatNumber },
                        { label: "Block", value: block, setValue: setBlock },
                        { label: "Street / Apt", value: street, setValue: setStreet },
                    ].map(({ label, value, setValue }, idx) => (
                        <View key={idx}>
                            <Text className="text-base font-medium text-gray-700 mt-5 mb-1">
                                {label}
                            </Text>
                            <TextInput
                                placeholder={`Enter ${label.toLowerCase()}`}
                                value={value}
                                onChangeText={setValue}
                                placeholderTextColor="#9CA3AF"
                                className="bg-white px-4 py-4 rounded-xl border border-gray-200 text-lg shadow-sm"
                            />
                        </View>
                    ))}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleUpdate}
                    disabled={loading}
                    className="bg-black py-5 rounded-xl active:scale-95 transition-transform"
                    style={{
                        ...Platform.select({
                            ios: {
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 6,
                            },
                            android: {
                                elevation: 8,
                            },
                        }),
                    }}
                >
                    {loading ? (
                        <View className="flex-row items-center justify-center">
                            <ActivityIndicator color="white" size="small" />
                            <Text className="text-white text-lg font-semibold ml-2">
                                Updating...
                            </Text>
                        </View>
                    ) : (
                        <Text className="text-white text-lg font-semibold text-center">
                            Update Location
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
