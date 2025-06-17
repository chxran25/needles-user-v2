import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { useToast } from "react-native-toast-notifications";
import { SafeAreaView } from "react-native-safe-area-context";
import { placeOrder, fetchBoutiqueDetails } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

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
                setDressType(types[0] || "");
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

        if (!referralImage) {
            toast.show("Referral image is required", { type: "danger" });
            return;
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
                voiceNotes: [], // to be added later
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
        <SafeAreaView className="flex-1 bg-[#F4F1E9] px-6">
            {screen === "design" ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text className="text-3xl font-bold text-center mb-6 mt-4">Design</Text>

                    <Text className="font-semibold mb-2 text-base">Dress Type</Text>
                    <View className="bg-white rounded-xl mb-6 overflow-hidden">
                        <Picker
                            selectedValue={dressType}
                            onValueChange={(itemValue) => setDressType(itemValue)}
                        >
                            {dressTypes.map((type) => (
                                <Picker.Item label={type} value={type} key={type} />
                            ))}
                        </Picker>
                    </View>

                    <Text className="font-semibold mb-2 text-base">Upload a Reference Image</Text>
                    <TouchableOpacity onPress={handleImagePick} className="mb-6">
                        {referralImage ? (
                            <Image
                                source={{ uri: referralImage.uri }}
                                className="w-full aspect-[3/2] rounded-xl"
                            />
                        ) : (
                            <View className="border border-dashed border-gray-400 h-32 rounded-xl justify-center items-center">
                                <Text className="text-gray-500">Tap to upload image</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <Text className="font-semibold text-base mb-2">Give Instructions</Text>
                    <Text className="text-xs text-gray-600 mb-1">
                        Type or speak the instructions you would like to give to the designer
                    </Text>
                    <TextInput
                        multiline
                        placeholder="Type here"
                        value={instructions}
                        onChangeText={setInstructions}
                        className="bg-white px-4 py-3 rounded-xl text-gray-800 mb-4"
                    />

                    <TouchableOpacity
                        className="w-14 h-14 bg-white rounded-full shadow-md items-center justify-center mx-auto mb-6"
                        onPress={() => toast.show("Voice note not implemented yet", { type: "warning" })}
                    >
                        <Ionicons name="mic" size={26} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setScreen("measurements")}
                        className="bg-black py-4 rounded-full items-center"
                    >
                        <Text className="text-white font-bold text-base">Next</Text>
                    </TouchableOpacity>
                </ScrollView>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text className="text-3xl font-bold text-center mb-6 mt-4">Measurements</Text>

                    {!pickUp && (
                        <>
                            <Text className="text-sm font-medium text-gray-700 mb-2">Type your measurements</Text>
                            {["Chest", "Waist", "Length"].map((key) => (
                                <TextInput
                                    key={key}
                                    placeholder={`${key} (in inches)`}
                                    className="border border-gray-300 rounded-lg px-3 py-2 mb-3 text-gray-900 bg-white"
                                    value={measurements[key] || ""}
                                    onChangeText={(val) =>
                                        setMeasurements((prev) => ({ ...prev, [key]: val }))
                                    }
                                />
                            ))}
                        </>
                    )}

                    <View className="my-6">
                        <Text className="text-center font-bold mb-2">OR</Text>
                        <Text className="text-sm text-gray-700 text-center mb-4">
                            We’ll pick up a reference dress from your address to take your measurements.
                            The ordered product and the reference will be returned on delivery.
                        </Text>

                        <TouchableOpacity
                            onPress={() => setPickUp(true)}
                            className="bg-gray-800 py-3 rounded-full items-center"
                        >
                            <Text className="text-white font-semibold">Pick Up</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={handlePlaceOrder}
                        disabled={loading}
                        className="bg-black py-4 rounded-full items-center mb-4"
                    >
                        <Text className="text-white font-bold text-base">
                            {loading ? "Placing Order..." : "Place Order"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} className="items-center">
                        <Text className="text-gray-500 underline">Cancel</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
