import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { updateUserLocation } from "@/services/api"; // ✅ Using new function

export default function UpdateLocationForm() {
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [flatNumber, setFlatNumber] = useState("");
    const [block, setBlock] = useState("");
    const [street, setStreet] = useState("");
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    // 📍 Get location when component mounts
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                toast.show("Permission to access location was denied", { type: "danger" });
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setLat(location.coords.latitude);
            setLng(location.coords.longitude);
        })();
    }, []);

    const handleSubmit = async () => {
        if (!flatNumber || !block || !street || lat == null || lng == null) {
            toast.show("Please fill all fields and allow location access", { type: "warning" });
            return;
        }

        try {
            setLoading(true);
            await updateUserLocation({
                lat,
                lng,
                flatNumber,
                block,
                street,
            });
            toast.show("📍 Location updated successfully", { type: "success" });
        } catch (err) {
            console.error("Update failed:", err);
            toast.show("❌ Failed to update location", { type: "danger" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="p-4 bg-white rounded-xl shadow">
            <Text className="text-lg font-bold mb-4 text-gray-800">Update Your Address</Text>

            <TextInput
                placeholder="Flat Number"
                value={flatNumber}
                onChangeText={setFlatNumber}
                className="border border-gray-300 rounded-md px-3 py-2 mb-3"
            />
            <TextInput
                placeholder="Block"
                value={block}
                onChangeText={setBlock}
                className="border border-gray-300 rounded-md px-3 py-2 mb-3"
            />
            <TextInput
                placeholder="Street"
                value={street}
                onChangeText={setStreet}
                className="border border-gray-300 rounded-md px-3 py-2 mb-4"
            />

            {loading ? (
                <ActivityIndicator size="small" color="#000" />
            ) : (
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-black py-3 rounded-lg"
                >
                    <Text className="text-white text-center font-semibold">Save Location</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
