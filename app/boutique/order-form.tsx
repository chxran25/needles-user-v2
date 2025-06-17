// ✅ OrderForm.tsx
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
import VoiceRecorder from "@/components/common/VoiceRecorder";
import { LinearGradient } from "expo-linear-gradient"; // ✅ New import

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
    const [measurements, setMeasurements] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [pickUp, setPickUp] = useState(false);
    const [voiceNotes, setVoiceNotes] = useState<string[]>([]);

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
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
        if (!result.canceled && result.assets.length > 0) {
            setReferralImage(result.assets[0]);
        }
    };

    const handlePlaceOrder = async () => {
        if (!userId || !dressType || !referralImage) {
            toast.show("Please fill all required fields", { type: "danger" });
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("boutiqueId", boutiqueId);
            formData.append("dressType", dressType);
            formData.append("pickUp", String(pickUp));
            formData.append("location", userAddress);

            if (!pickUp) {
                const normalized = {
                    chest: measurements["Chest"],
                    waist: measurements["Waist"],
                    length: measurements["Length"],
                };
                formData.append("measurements", JSON.stringify(normalized));
            }

            formData.append("referralImage", {
                uri: referralImage.uri,
                name: "referral.jpg",
                type: "image/jpeg",
            } as any);

            voiceNotes.forEach((uri, index) => {
                formData.append("voiceNotes", {
                    uri,
                    name: `voice-note-${index + 1}.m4a`,
                    type: "audio/m4a",
                } as any);
            });

            const response = await placeOrder(formData);
            toast.show(response.message, { type: "success" });
            onClose();
        } catch (error: any) {
            toast.show(error?.response?.data?.message || "Order failed", { type: "danger" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={["#FF8C42", "#FFF5E1", "#FFFFFF"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="flex-1"
        >
            <SafeAreaView className="flex-1 px-6">
                {screen === "design" ? (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text className="text-3xl font-bold text-center mb-6 mt-4">Design</Text>

                        <Text className="text-xl font-bold mb-1">Dress Type</Text>
                        <Text className="text-sm text-gray-600 mb-2">Select your outfit type.</Text>
                        <TouchableOpacity onPress={() => setShowDropdown(true)} className="bg-white border border-gray-300 rounded-xl px-4 py-3 flex-row justify-between items-center mb-6 shadow-sm shadow-black/5">
                            <Text className={`text-base ${dressType ? "text-gray-900" : "text-gray-400"}`}>{dressType || "Choose dress type"}</Text>
                            <Ionicons name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>

                        <Modal visible={showDropdown} transparent animationType="fade">
                            <TouchableOpacity onPress={() => setShowDropdown(false)} className="flex-1 bg-black/30 justify-center items-center" activeOpacity={1}>
                                <View className="bg-white rounded-2xl w-80 max-h-[60%] py-4 px-2 shadow-lg">
                                    <Text className="text-lg font-semibold text-center mb-2">Select Dress Type</Text>
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        {dressTypes.map((type) => (
                                            <TouchableOpacity key={type} onPress={() => { setDressType(type); setShowDropdown(false); }} className="px-6 py-4 border-b border-gray-100">
                                                <Text className="text-gray-800 text-base">{type}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </TouchableOpacity>
                        </Modal>

                        <Text className="text-xl font-bold mb-1">Upload a Reference Image</Text>
                        <TouchableOpacity onPress={handleImagePick} className="mb-6">
                            {referralImage ? (
                                <Image source={{ uri: referralImage.uri }} className="w-full aspect-[3/2] rounded-xl shadow-md" />
                            ) : (
                                <View className="border border-dashed border-gray-400 h-32 rounded-xl justify-center items-center bg-white shadow-inner">
                                    <Text className="text-gray-500">Tap to upload image</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <Text className="text-xl font-bold mb-1">Voice Notes</Text>
                        <Text className="text-sm text-gray-600 mb-2">Speak your preferences. Up to 5 recordings.</Text>
                        <VoiceRecorder onRecordingComplete={(uris) => setVoiceNotes(uris)} />

                        <TouchableOpacity onPress={() => setScreen("measurements")} className={`py-4 rounded-full items-center ${dressType ? "bg-black" : "bg-gray-400"}`} disabled={!dressType}>
                            <Text className="text-white font-bold text-base">Next</Text>
                        </TouchableOpacity>
                    </ScrollView>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text className="text-3xl font-bold text-center mb-6 mt-4">Measurements</Text>
                        {!pickUp && (
                            <>
                                <Text className="text-lg font-bold mb-1">Enter your measurements</Text>
                                {['Chest', 'Waist', 'Length'].map((key) => (
                                    <TextInput key={key} placeholder={`${key} (in inches)`} className="border border-gray-300 rounded-lg px-3 py-2 mb-3 text-gray-900 bg-white" value={measurements[key] || ""} onChangeText={(val) => setMeasurements((prev) => ({ ...prev, [key]: val }))} />
                                ))}
                            </>
                        )}

                        <View className="my-6">
                            <Text className="text-center font-bold mb-2">OR</Text>
                            <Text className="text-sm text-gray-700 text-center mb-4">Pick up a reference dress for measurements.</Text>
                            <TouchableOpacity onPress={() => setPickUp(true)} className="bg-gray-800 py-3 rounded-full items-center">
                                <Text className="text-white font-semibold">Pick Up</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={handlePlaceOrder} disabled={loading} className="bg-black py-4 rounded-full items-center mb-4">
                            <Text className="text-white font-bold text-base">{loading ? "Placing Order..." : "Place Order"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onClose} className="items-center">
                            <Text className="text-gray-500 underline">Cancel</Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </SafeAreaView>
        </LinearGradient>
        );
}
