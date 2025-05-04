// File: app/boutique/order-form.tsx

import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function OrderForm() {
    const [dressType, setDressType] = useState('');
    const [measurements, setMeasurements] = useState('');
    const [notes, setNotes] = useState('');
    const router = useRouter();

    const handleSubmit = () => {
        if (!dressType) {
            Alert.alert("Missing Info", "Please enter a dress type.");
            return;
        }

        const orderData = {
            dressType,
            measurements,
            notes,
        };

        console.log("Order submitted:", orderData);
        Alert.alert("Success", "Your order has been submitted!");
        router.back();
    };

    return (
        <ScrollView className="flex-1 bg-[#FFF2D7] px-4 pt-10">
            <Text className="text-2xl font-bold mb-6">Place Your Order</Text>

            <Text className="text-sm mb-1">Dress Type *</Text>
            <TextInput
                placeholder="e.g., Saree Blouse, Gown"
                className="bg-white rounded-lg p-3 mb-4 text-sm"
                value={dressType}
                onChangeText={setDressType}
            />

            <Text className="text-sm mb-1">Measurements</Text>
            <TextInput
                placeholder="Enter measurements or upload reference later"
                className="bg-white rounded-lg p-3 mb-4 text-sm"
                multiline
                numberOfLines={3}
                value={measurements}
                onChangeText={setMeasurements}
            />

            <Text className="text-sm mb-1">Notes</Text>
            <TextInput
                placeholder="Any special instructions?"
                className="bg-white rounded-lg p-3 mb-6 text-sm"
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
            />

            <TouchableOpacity
                onPress={handleSubmit}
                className="bg-black rounded-xl py-3 items-center mb-10"
            >
                <Text className="text-white font-semibold">Submit Order</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
