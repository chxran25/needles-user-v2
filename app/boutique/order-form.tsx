import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { placeOrder, CatalogueItem } from "@/services/api";
import { useToast } from "react-native-toast-notifications";
import { getUserProfile } from "@/services/api";

interface OrderFormProps {
    categories: string[];
    boutiqueId: string;
    userAddress: string;
    onClose: () => void;
}

export default function OrderForm({ categories, boutiqueId, userAddress, onClose }: OrderFormProps) {
    const toast = useToast();
    const [userId, setUserId] = useState("");
    const [dressType, setDressType] = useState(categories[0] || "");
    const [pickUp, setPickUp] = useState(false);
    const [measurements, setMeasurements] = useState<Record<string, string>>({});
    const [referralImage, setReferralImage] = useState<any>(null);
    const [voiceNotes, setVoiceNotes] = useState<any[]>([]);
    const [catalogueItems, setCatalogueItems] = useState<CatalogueItem[]>([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getUserProfile();
                setUserId(profile._id);
            } catch (err) {
                toast.show("Failed to load user profile", { type: "danger" });
            }
        };
        fetchProfile();
    }, []);

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
        if (!result.canceled && result.assets.length > 0) {
            setReferralImage(result.assets[0]);
        }
    };

    const handlePlaceOrder = async () => {
        try {
            if (!referralImage) {
                toast.show("Referral image is required", { type: "danger" });
                return;
            }

            const response = await placeOrder({
                userId,
                boutiqueId,
                dressType,
                pickUp,
                location: userAddress,
                measurements: pickUp ? undefined : measurements,
                referralImage,
                voiceNotes,
                catalogueItems,
            });

            toast.show(response.message, { type: "success" });
            onClose();
        } catch (error: any) {
            toast.show(error?.response?.data?.message || "Order failed", { type: "danger" });
        }
    };

    return (
        <ScrollView className="flex-1 px-4 py-6 bg-white">
            <Text className="text-xl font-bold mb-4">Place Your Order</Text>

            <Text className="font-semibold mb-1">Dress Type</Text>
            <View className="mb-4">
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        className={`py-2 px-4 rounded-full mb-2 ${dressType === cat ? "bg-orange-500" : "bg-gray-200"}`}
                        onPress={() => setDressType(cat)}
                    >
                        <Text className={dressType === cat ? "text-white" : "text-black"}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View className="flex-row justify-between items-center mb-4">
                <Text className="font-semibold">Pick Up from Home?</Text>
                <Switch value={pickUp} onValueChange={setPickUp} />
            </View>

            {!pickUp && (
                <View className="mb-4">
                    <Text className="font-semibold mb-1">Measurements</Text>
                    {['Chest', 'Waist', 'Length'].map((key) => (
                        <TextInput
                            key={key}
                            placeholder={`${key} (in inches)`}
                            className="border border-gray-300 rounded px-3 py-2 mb-2"
                            value={measurements[key] || ""}
                            onChangeText={(value) => setMeasurements((prev) => ({ ...prev, [key]: value }))}
                        />
                    ))}
                </View>
            )}

            <TouchableOpacity onPress={handleImagePick} className="mb-4">
                <Text className="font-semibold mb-2">Referral Image</Text>
                {referralImage ? (
                    <Image source={{ uri: referralImage.uri }} className="w-full h-40 rounded" />
                ) : (
                    <View className="border border-dashed border-gray-400 rounded h-32 justify-center items-center">
                        <Text className="text-gray-500">Tap to upload image</Text>
                    </View>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handlePlaceOrder}
                className="bg-black py-4 rounded-lg mt-4 items-center"
            >
                <Text className="text-white font-bold">Submit Order</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} className="mt-3 items-center">
                <Text className="text-gray-500 underline">Cancel</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
