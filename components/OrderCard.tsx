import { View, Text, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import PaidBillModal from "@/components/modals/PaidBillModal";
import NotPaidBillModal from "@/components/modals/NotPaidBillModal";
import { Order } from "@/types/order";

interface OrderCardProps {
    order: Order;
    type: string; // "pending" | "paid" | "not paid"
}

export default function OrderCard({ order, type }: OrderCardProps) {
    const [showModal, setShowModal] = useState(false);

    const renderModal = () => {
        if (!showModal) return null;

        if (type === "paid") {
            return <PaidBillModal orderId={order.id} onClose={() => setShowModal(false)} />;
        } else if (type === "not paid") {
            return <NotPaidBillModal orderId={order.id} onClose={() => setShowModal(false)} />;
        }

        return null;
    };

    return (
        <View className="bg-white rounded-xl shadow-md mb-4 px-4 py-5">
            {/* 🧵 Order Info */}
            <View className="flex-row justify-between items-center mb-2">
                <View>
                    <Text className="text-3xl font-semibold text-gray-800">{order.boutiqueName}</Text>
                    <Text className="text-xs text-gray-500">{order.location}</Text>
                </View>
                <Text className="text-2xl font-bold text-orange-600 ">{order.status}</Text>
            </View>

            {/* 🖼 Preview Image */}
            <View className="mb-3">
                <Image
                    source={{ uri: order.imageUrl || "https://via.placeholder.com/80" }}
                    style={{ width: "100%", height: 160, borderRadius: 12 }}
                    resizeMode="cover"
                />
            </View>

            {/* 🧾 View Bill */}
            {type === "paid" || type === "not paid" ? (
                <TouchableOpacity onPress={() => setShowModal(true)} className="self-end mt-1">
                    <Text className="text-sm font-bold text-orange-700 underline">View Bill</Text>
                </TouchableOpacity>
            ) : null}

            {renderModal()}
        </View>
    );
}
