import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

interface Props {
    categories: string[];
    onClose: () => void;
}

export default function OrderForm({ categories, onClose }: Props) {
    const [step, setStep] = useState<"design" | "measurements">("design");

    const [imageUri, setImageUri] = useState<string | null>(null);
    const [instructions, setInstructions] = useState("");
    const [pickupRequested, setPickupRequested] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const [measurements, setMeasurements] = useState({
        chest: "",
        waist: "",
        hips: "",
        length: "",
    });

    const handleChooseImage = async () => {
        try {
            const {
                launchImageLibraryAsync,
                requestMediaLibraryPermissionsAsync,
            } = await import("expo-image-picker");

            const permissionResult = await requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert("Permission required", "Gallery access is needed.");
                return;
            }

            const result = await launchImageLibraryAsync({
                mediaTypes: ["images"],
                quality: 1,
            });

            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Image Picker error:", error);
            Alert.alert("Error", "Could not open gallery.");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1"
        >
            <ScrollView className="flex-1 bg-[#FCFCFC]">
                {/* Header */}
                <View className="bg-[#DDE3D2] rounded-b-3xl px-6 py-4 flex-row items-center justify-between shadow-sm">
                    <TouchableOpacity
                        onPress={onClose}
                        className="w-10 h-10 bg-white rounded-full items-center justify-center"
                    >
                        <Ionicons name="chevron-down" size={20} color="black" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold text-gray-800">
                        {step === "design" ? "Design" : "Measurements"}
                    </Text>
                    <View className="w-10 h-10" />
                </View>

                <View className="px-6 pt-8">
                    {step === "design" ? (
                        <>
                            {/* Dress Type Dropdown */}
                            <View className="mb-8">
                                <Text className="text-xl font-semibold mb-3 text-gray-800">
                                    Choose Dress Type
                                </Text>
                                <View className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                                    <Picker
                                        selectedValue={selectedCategory}
                                        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                                        mode="dropdown"
                                    >
                                        <Picker.Item label="Select category..." value="" />
                                        {categories.map((cat, index) => (
                                            <Picker.Item key={index} label={cat} value={cat} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            {/* Upload Image */}
                            <View className="mb-8">
                                <Text className="text-xl font-semibold mb-3 text-gray-800">
                                    Upload a Reference Image
                                </Text>
                                <TouchableOpacity
                                    className="bg-white py-4 px-6 rounded-2xl items-center shadow-sm"
                                    onPress={handleChooseImage}
                                >
                                    <Text className="text-gray-600 font-medium">
                                        Choose from Gallery
                                    </Text>
                                </TouchableOpacity>
                                {imageUri && (
                                    <Image
                                        source={{ uri: imageUri }}
                                        className="w-full h-52 rounded-2xl mt-4"
                                        resizeMode="cover"
                                    />
                                )}
                            </View>

                            {/* Instructions */}
                            <View className="mb-10">
                                <Text className="text-xl font-semibold mb-3 text-gray-800">
                                    Give Instructions
                                </Text>
                                <Text className="text-sm text-gray-500 mb-3">
                                    Type or speak the instructions for the designer.
                                </Text>
                                <TextInput
                                    className="bg-white rounded-2xl p-4 text-base shadow-sm"
                                    placeholder="E.g., Sleeveless, side zip, extra flare"
                                    multiline
                                    numberOfLines={4}
                                    value={instructions}
                                    onChangeText={setInstructions}
                                    textAlignVertical="top"
                                />
                            </View>

                            {/* Voice mic */}
                            <View className="items-center mb-12">
                                <View className="bg-[#DDE3D2] w-14 h-14 rounded-full justify-center items-center">
                                    <Ionicons name="mic-outline" size={24} color="black" />
                                </View>
                                <Text className="text-xs text-gray-500 mt-2">
                                    Voice input coming soon
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => setStep("measurements")}
                                className="bg-black py-4 rounded-full shadow-lg items-center"
                            >
                                <Text className="text-white font-semibold text-base">Done</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text className="text-xl font-semibold mb-6 text-gray-800 text-center">
                                Provide Your Measurements
                            </Text>

                            {/* Inputs */}
                            <View className="mb-10">
                                <Text className="text-base text-gray-700 mb-3 font-medium">
                                    Type your measurements (in inches)
                                </Text>
                                <View className="flex-row flex-wrap justify-between">
                                    {Object.entries(measurements).map(([key, val]) => (
                                        <TextInput
                                            key={key}
                                            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                            value={val}
                                            onChangeText={(text) =>
                                                setMeasurements((prev) => ({
                                                    ...prev,
                                                    [key]: text.replace(/[^0-9.]/g, ""),
                                                }))
                                            }
                                            keyboardType="numeric"
                                            inputMode="numeric"
                                            className="bg-white p-4 rounded-2xl w-[48%] mb-4 shadow-sm text-base"
                                        />
                                    ))}
                                </View>
                            </View>

                            {/* Pickup Option */}
                            <View className="mb-10 px-2">
                                <Text className="text-center font-semibold text-gray-800 mb-1">
                                    Would you like us to pick up a reference dress?
                                </Text>
                                <Text className="text-sm text-center text-gray-600 mb-3">
                                    A delivery person will visit your address to collect and
                                    return it safely.
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setPickupRequested(!pickupRequested)}
                                    className={`w-full py-3 rounded-full items-center ${
                                        pickupRequested ? "bg-green-600" : "bg-gray-300"
                                    }`}
                                >
                                    <Text className="text-white font-bold text-base">
                                        {pickupRequested ? "Pickup Requested" : "No Pickup Needed"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Submit */}
                            <TouchableOpacity
                                onPress={() => {
                                    const summary = {
                                        selectedCategory,
                                        selectedImage: imageUri,
                                        instructions,
                                        measurements,
                                        pickupRequested,
                                    };
                                    console.log("Order Summary:", summary);
                                    Alert.alert(
                                        "Order Submitted",
                                        "Your details have been shared with the boutique."
                                    );
                                    onClose();
                                }}
                                className="bg-black py-4 rounded-full shadow-lg items-center mb-12"
                            >
                                <Text className="text-white font-semibold text-base">Done</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
