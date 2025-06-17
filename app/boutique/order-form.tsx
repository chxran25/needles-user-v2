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
import { LinearGradient } from "expo-linear-gradient";
import BackButton from "@/components/common/BackButton"; // ✅ Ensure this import is correct

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
            } catch {
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
        <SafeAreaView className="flex-1 bg-white relative">
            {/* 🍊 Gradient BG */}
            <LinearGradient
                colors={["#F97316", "#FFFFFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "25%",
                    zIndex: -1,
                }}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}
            >

                {/* Header Row with Back Button and Title */}
                <View className="flex-row items-center justify-between mt-4 mb-3 px-1">
                    <BackButton
                        iconSize={24}
                        iconColor="#111827"
                        className="p-2 bg-white/80 rounded-full shadow-md"
                        onPress={screen === "design" ? onClose : () => setScreen("design")}
                    />
                    <Text className="text-4xl font-extrabold text-gray-900 text-center flex-1 ml-[-24px]">
                        {screen === "design" ? "Design" : "Measurements"}
                    </Text>
                    {/* Spacer for symmetry */}
                    <View style={{ width: 40 }} />
                </View>

                {/* Progress Indicator */}
                <View className="flex-row justify-center items-center space-x-2 mb-4">
                    <View className={`w-24 h-1.5 rounded-full ${screen === "design" ? "bg-black" : "bg-gray-300"}`} />
                    <View className={`w-24 h-1.5 rounded-full ${screen === "measurements" ? "bg-black" : "bg-gray-300"}`} />
                </View>


                {screen === "design" ? (
                    <>
                        {/* Dress Type */}
                        <View className="px-5 py-6 bg-white rounded-2xl shadow-md mb-6">
                            <Text className="text-2xl font-semibold mb-2 text-gray-900">Dress Type</Text>
                            <Text className="text-base text-gray-500 mb-4">Select your outfit type.</Text>
                            <TouchableOpacity
                                onPress={() => setShowDropdown(true)}
                                className="bg-white border border-gray-300 rounded-xl px-4 py-4 flex-row justify-between items-center"
                            >
                                <Text className={`text-base ${dressType ? "text-gray-900" : "text-gray-400"}`}>
                                    {dressType || "Choose dress type"}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {/* Dropdown */}
                        <Modal visible={showDropdown} transparent animationType="fade">
                            <TouchableOpacity
                                onPress={() => setShowDropdown(false)}
                                className="flex-1 bg-black/30 justify-center items-center"
                                activeOpacity={1}
                            >
                                <View className="bg-white rounded-2xl w-80 max-h-[60%] py-4 px-2 shadow-lg">
                                    <Text className="text-lg font-semibold text-center mb-2">Select Dress Type</Text>
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
                                                <Text className="text-gray-800 text-base">{type}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </TouchableOpacity>
                        </Modal>

                        {/* Reference Image */}
                        <View className="px-5 py-6 bg-white rounded-2xl shadow-md mb-6">
                            <Text className="text-2xl font-semibold mb-2 text-gray-900">Upload a Reference Image</Text>
                            <TouchableOpacity onPress={handleImagePick}>
                                {referralImage ? (
                                    <Image source={{ uri: referralImage.uri }} className="w-full aspect-[3/2] rounded-xl shadow-md" />
                                ) : (
                                    <View className="border border-dashed border-gray-400 h-32 rounded-xl justify-center items-center bg-white">
                                        <Text className="text-gray-500">Tap to upload image</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Voice Notes */}
                        <View className="px-5 py-6 bg-white rounded-2xl shadow-md mb-6">
                            <Text className="text-2xl font-semibold mb-2 text-gray-900">Voice Notes</Text>
                            <Text className="text-base text-gray-500 mb-4">Speak your preferences. Up to 5 recordings.</Text>
                            <VoiceRecorder onRecordingComplete={(uris) => setVoiceNotes(uris)} />
                        </View>

                        {/* Next Button */}
                        <TouchableOpacity
                            onPress={() => setScreen("measurements")}
                            disabled={!dressType}
                            className="rounded-full overflow-hidden mt-2 mb-10"
                        >
                            <LinearGradient
                                colors={["#2563EB", "#9333EA"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className={`py-5 rounded-full items-center ${!dressType && "opacity-40"}`}
                            >
                                <Text className="text-white font-bold text-lg tracking-wide">Next</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        {/* Measurements Input */}
                        {!pickUp && (
                            <View className="px-5 py-6 bg-white rounded-2xl shadow-md mb-6">
                                <Text className="text-2xl font-semibold mb-4 text-gray-900">Enter your measurements</Text>
                                {["Chest", "Waist", "Length"].map((key) => (
                                    <TextInput
                                        key={key}
                                        placeholder={`${key} (in inches)`}
                                        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900 bg-white text-base"
                                        value={measurements[key] || ""}
                                        onChangeText={(val) => setMeasurements((prev) => ({ ...prev, [key]: val }))}
                                    />
                                ))}
                            </View>
                        )}

                        {/* Pickup CTA */}
                        <View className="my-8">
                            <Text className="text-center text-gray-700 text-base mb-2 font-semibold">
                                Not sure about your measurements?
                            </Text>
                            <Text className="text-center text-gray-700 text-base mb-4">
                                Let us pick up a reference dress from your home. We’ll take accurate measurements and return it safely.
                            </Text>

                            {/* Recommended Tag */}
                            <View className="self-start mb-3">
                                <View className="bg-indigo-100 px-4 py-1.5 rounded-full shadow-sm border border-indigo-300">
                                    <Text className="text-indigo-700 font-semibold text-sm">Recommended</Text>
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => setPickUp(true)} className="rounded-full overflow-hidden shadow-md mb-6">
                                <LinearGradient
                                    colors={["#2563EB", "#9333EA"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="py-4 px-6 rounded-full items-center"
                                >
                                    <Text className="text-white font-bold text-base tracking-wide">Pick Up</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* Place Order Button */}
                        <TouchableOpacity disabled={loading} onPress={handlePlaceOrder} className="rounded-full overflow-hidden mb-4">
                            <LinearGradient
                                colors={["#2563EB", "#9333EA"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className={`py-5 rounded-full items-center ${loading && "opacity-40"}`}
                            >
                                <Text className="text-white font-bold text-lg tracking-wide">
                                    {loading ? "Placing Order..." : "Place Order"}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onClose} className="items-center mt-4 mb-10">
                            <Text className="text-gray-500 underline text-base">Cancel</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
