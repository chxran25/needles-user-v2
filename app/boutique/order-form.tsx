import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { useToast } from "react-native-toast-notifications";
import { SafeAreaView } from "react-native-safe-area-context";
import { placeOrder, fetchBoutiqueDetails } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";

interface OrderFormProps {
    boutiqueId: string;
    userAddress: string;
    onClose: () => void;
}

export default function OrderForm({ boutiqueId, userAddress, onClose }: OrderFormProps) {
    const toast = useToast();

    const [userId, setUserId] = useState("");
    const [screen, setScreen] = useState<"design" | "measurements">("design");
    const [dressTypes, setDressTypes] = useState<string[]>([]);
    const [dressType, setDressType] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const [referralImage, setReferralImage] = useState<any>(null);
    const [instructions, setInstructions] = useState("");

    const [pickUp, setPickUp] = useState(false);
    const [measurements, setMeasurements] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const storedId = await SecureStore.getItemAsync("userId");
            if (storedId) setUserId(storedId);
            else toast.show("User not found", { type: "danger" });

            try {
                const boutique = await fetchBoutiqueDetails(boutiqueId);
                const types = boutique.dressTypes?.map((d: { type: string }) => d.type) || [];
                setDressTypes(types);
            } catch (err) {
                toast.show("Failed to load boutique details", { type: "danger" });
            }
        };
        fetchData();
    }, []);

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        if (!result.canceled && result.assets.length > 0) {
            setReferralImage(result.assets[0]);
        }
    };

    const handlePlaceOrder = async () => {
        if (!userId) {
            toast.show("User not identified. Please log in again.", { type: "danger" });
            return;
        }

        if (!dressType) {
            toast.show("Please select a dress type", { type: "danger" });
            return;
        }

        if (!referralImage) {
            toast.show("Referral image is required", { type: "danger" });
            return;
        }

        if (!pickUp) {
            const required = ["Chest", "Waist", "Length"];
            for (let field of required) {
                if (!measurements[field]) {
                    toast.show(`Please enter ${field} measurement`, { type: "danger" });
                    return;
                }
            }
        }

        try {
            setLoading(true);
            const response = await placeOrder({
                userId,
                boutiqueId,
                dressType,
                pickUp,
                location: userAddress,
                measurements: pickUp ? undefined : measurements,
                referralImage,
                voiceNotes: [],
            });
            toast.show(response.message, { type: "success" });
            onClose();
        } catch (error: any) {
            console.error("❌ Order Placement Error:", error?.response || error);
            toast.show(
                error?.response?.data?.message || "Order failed",
                { type: "danger" }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F4F1E9] px-8">
            {screen === "design" ? (
                <ScrollView showsVerticalScrollIndicator={false} className="pb-10">
                    <Text className="text-5xl font-extrabold text-center mb-10 mt-6">Design</Text>

                    <Text className="text-2xl font-semibold mb-2">Dress Type</Text>
                    <Text className="text-base text-gray-600 mb-4">
                        Select the type of outfit you want to order from the available options.
                    </Text>
                    <TouchableOpacity
                        onPress={() => setShowDropdown(true)}
                        className="bg-white border border-gray-300 rounded-xl px-5 py-4 flex-row justify-between items-center mb-8"
                    >
                        <Text className={`text-lg ${dressType ? "text-gray-900" : "text-gray-400"}`}>
                            {dressType || "Choose dress type"}
                        </Text>
                        <Ionicons name="chevron-down" size={24} color="#666" />
                    </TouchableOpacity>

                    <Modal visible={showDropdown} transparent animationType="fade">
                        <TouchableOpacity
                            onPress={() => setShowDropdown(false)}
                            className="flex-1 bg-black/30 justify-center items-center"
                            activeOpacity={1}
                        >
                            <View className="bg-white rounded-3xl w-80 max-h-[60%] py-6 px-4 shadow-xl">
                                <Text className="text-xl font-bold text-center mb-4">Select Dress Type</Text>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {dressTypes.map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            onPress={() => {
                                                setDressType(type);
                                                setShowDropdown(false);
                                            }}
                                            className="px-6 py-4 border-b border-gray-100"
                                        >
                                            <Text className="text-lg text-gray-800">{type}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </TouchableOpacity>
                    </Modal>

                    <Text className="text-2xl font-semibold mb-2">Upload a Reference Image</Text>
                    <Text className="text-base text-gray-600 mb-4">
                        Upload a design or photo to guide the boutique in crafting your custom outfit.
                    </Text>
                    <TouchableOpacity onPress={handleImagePick} className="mb-8">
                        {referralImage ? (
                            <Image source={{ uri: referralImage.uri }} className="w-full aspect-[3/2] rounded-xl" />
                        ) : (
                            <View className="border border-dashed border-gray-400 h-40 rounded-xl justify-center items-center">
                                <Text className="text-gray-500 text-lg">Tap to upload image</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <Text className="text-2xl font-semibold mb-2">Voice Notes</Text>
                    <Text className="text-base text-gray-600 mb-6">
                        Speak your design preferences for more clarity.
                    </Text>
                    <TouchableOpacity
                        className="w-16 h-16 bg-white rounded-full shadow-md items-center justify-center mx-auto mb-10"
                        onPress={() => toast.show("Voice note not implemented yet", { type: "warning" })}
                    >
                        <Ionicons name="mic" size={28} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setScreen("measurements")}
                        className="bg-black py-5 rounded-full items-center"
                        disabled={!dressType}
                    >
                        <Text className="text-white font-bold text-lg">Next</Text>
                    </TouchableOpacity>
                </ScrollView>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} className="pb-10">
                    <Text className="text-5xl font-extrabold text-center mb-10 mt-6">Measurements</Text>

                    {!pickUp && (
                        <>
                            <Text className="text-2xl font-semibold mb-2">Enter Your Measurements</Text>
                            <Text className="text-base text-gray-600 mb-4">
                                Please enter the size measurements in inches to ensure a perfect fit.
                            </Text>
                            {["Chest", "Waist", "Length"].map((key) => (
                                <TextInput
                                    key={key}
                                    placeholder={`${key} (in inches)`}
                                    className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900 bg-white text-base"
                                    value={measurements[key] || ""}
                                    onChangeText={(val) => setMeasurements((prev) => ({ ...prev, [key]: val }))}
                                />
                            ))}
                        </>
                    )}

                    <View className="my-8">
                        <Text className="text-center font-bold mb-4 text-xl">OR</Text>
                        <Text className="text-base text-gray-700 text-center mb-6 px-2">
                            We’ll pick up a reference dress from your address to take your measurements.
                            The ordered product and the reference will be returned upon delivery.
                        </Text>
                        <TouchableOpacity
                            onPress={() => setPickUp(true)}
                            className="bg-gray-800 py-4 rounded-full items-center"
                        >
                            <Text className="text-white font-semibold text-base">Pick Up</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={handlePlaceOrder}
                        disabled={loading}
                        className="bg-black py-5 rounded-full items-center mb-6"
                    >
                        <Text className="text-white font-bold text-lg">
                            {loading ? "Placing Order..." : "Place Order"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} className="items-center">
                        <Text className="text-gray-500 underline text-base">Cancel</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
