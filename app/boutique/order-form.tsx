// ✅ components/boutique/OrderForm.tsx

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
import * as ImagePicker from "expo-image-picker";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    categories: string[];
    onClose: () => void;
}

export default function OrderForm({ categories, onClose }: Props) {
    const [selectedDress, setSelectedDress] = useState<string | null>(null);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [instructions, setInstructions] = useState("");
    const [measurements, setMeasurements] = useState({
        chest: "",
        waist: "",
        hips: "",
        length: "",
    });

    const handleChooseImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSubmitMeasurements = () => {
        Alert.alert("Success", "Measurements submitted successfully!");
    };

    const handlePickupRequest = () => {
        Alert.alert("Scheduled", "Pickup has been scheduled.");
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1"
        >
            <ScrollView className="flex-1 bg-[#FFF2D7]">
                <View className="bg-[#DDE3D2] rounded-b-3xl px-6 py-4 flex-row items-center justify-between shadow-sm">
                    <TouchableOpacity onPress={onClose} className="w-10 h-10 bg-white rounded-full items-center justify-center">
                        <Ionicons name="chevron-down" size={20} color="black" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-800">Order Form</Text>
                    <View className="w-10 h-10">{/* Placeholder to balance layout */}</View>
                </View>

                <View className="px-4 pt-6">
                    {/* Dress Type */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold mb-2">Select Dress Type</Text>
                        <Dropdown
                            data={categories.map((item) => ({ label: item, value: item }))}
                            value={selectedDress}
                            labelField="label"
                            valueField="value"
                            placeholder="Choose a dress type"
                            onChange={(item) => setSelectedDress(item.value)}
                            style={{
                                borderWidth: 1,
                                borderColor: "#000",
                                borderRadius: 10,
                                paddingHorizontal: 12,
                                height: 50,
                                justifyContent: "center",
                                backgroundColor: "#fff",
                            }}
                            containerStyle={{ borderRadius: 10 }}
                        />
                    </View>

                    {/* Upload Reference Image */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold mb-2">Upload a Reference Image</Text>
                        <TouchableOpacity
                            className="bg-white py-3 rounded-xl items-center"
                            onPress={handleChooseImage}
                        >
                            <Text className="text-gray-600 font-medium">Choose from Gallery</Text>
                        </TouchableOpacity>
                        {imageUri && (
                            <Image
                                source={{ uri: imageUri }}
                                className="w-full h-40 rounded-xl mt-3"
                                resizeMode="cover"
                            />
                        )}
                    </View>

                    {/* Give Instructions */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold mb-2">Give Instructions</Text>
                        <TextInput
                            className="bg-white rounded-xl p-3 text-base"
                            placeholder="Type instructions for the designer"
                            multiline
                            numberOfLines={3}
                            value={instructions}
                            onChangeText={setInstructions}
                            textAlignVertical="top"
                        />
                        <TouchableOpacity className="items-center mt-4">
                            <View className="bg-gray-200 w-12 h-12 rounded-full justify-center items-center">
                                <Ionicons name="mic-outline" size={22} color="black" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Measurements */}
                    <Text className="text-xl font-bold mb-4 text-center">Measurements</Text>
                    <Text className="text-base font-semibold mb-2">Type Your Measurements</Text>
                    <View className="flex-row justify-between flex-wrap mb-4">
                        {Object.keys(measurements).map((key) => (
                            <TextInput
                                key={key}
                                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                value={measurements[key as keyof typeof measurements]}
                                onChangeText={(text) =>
                                    setMeasurements((prev) => ({ ...prev, [key]: text }))
                                }
                                className="bg-white p-3 rounded-xl w-[48%] mb-3"
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        onPress={handleSubmitMeasurements}
                        className="bg-black py-4 rounded-xl items-center mb-6"
                    >
                        <Text className="text-white font-semibold">Done</Text>
                    </TouchableOpacity>

                    {/* OR Pickup */}
                    <Text className="text-center text-gray-500 font-medium mb-2">OR</Text>
                    <Text className="text-center text-base font-semibold mb-2">
                        We'll pick up Reference dress from you
                    </Text>
                    <View className="items-center mb-2">
                        <Text className="bg-gray-200 px-3 py-1 rounded-full text-sm font-medium">
                            Recommended
                        </Text>
                    </View>
                    <Text className="text-sm text-center text-gray-600 mb-4 px-2">
                        A delivery person will come to your address, take the reference dress safely to the boutique, take measurements from it. Both will be returned safely at delivery time.
                    </Text>

                    <TouchableOpacity
                        onPress={handlePickupRequest}
                        className="bg-[#E5E7EB] py-4 rounded-xl items-center mb-8"
                    >
                        <Text className="font-bold text-base">Pick Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
