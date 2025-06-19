import { View, Text, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import PaidBillModal from "@/components/modals/PaidBillModal";
import NotPaidBillModal from "@/components/modals/NotPaidBillModal";
import RateOrderModal from "@/components/modals/RateOrderModal"; // ✅ Import the modal
import { Order } from "@/types/order";

interface OrderCardProps {
    order: Order;
    type: "pending" | "paid" | "not paid" | "completed";
    index?: number;
}

export default function OrderCard({ order, type }: OrderCardProps) {
    const [showBillModal, setShowBillModal] = useState(false);
    const [showRateModal, setShowRateModal] = useState(false); // ✅ New modal state

    const renderModal = () => {
        if (type === "paid" || type === "completed") {
            return (
                <PaidBillModal
                    orderId={order.id}
                    onClose={() => setShowBillModal(false)}
                />
            );
        } else if (type === "not paid") {
            return (
                <NotPaidBillModal
                    orderId={order.id}
                    onClose={() => setShowBillModal(false)}
                />
            );
        }
        return null;
    };

    return (
        <View className="bg-[#FFF7ED] rounded-2xl shadow-lg mb-4 px-4 py-5 border border-orange-200">
            {/* Header: Boutique + Status */}
            <View className="flex-row justify-between items-center mb-3">
                <View>
                    <Text className="text-2xl font-extrabold text-orange-900">
                        {order.boutiqueName}
                    </Text>
                    {order.location && (
                        <Text className="text-xs text-gray-500">{order.location}</Text>
                    )}
                </View>
                <View className="bg-orange-100 px-3 py-1 rounded-full">
                    <Text className="text-xs font-semibold text-orange-600">
                        {order.status}
                    </Text>
                </View>
            </View>

            {/* Image */}
            <View className="mb-4 overflow-hidden rounded-xl">
                <Image
                    source={{ uri: order.imageUrl || "https://via.placeholder.com/80" }}
                    style={{ width: "100%", height: 160 }}
                    resizeMode="cover"
                />
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-between items-center">
                {(type === "paid" || type === "not paid" || type === "completed") && (
                    <TouchableOpacity onPress={() => setShowBillModal(true)}>
                        <Text className="text-sm font-bold text-orange-700 underline">
                            View Bill
                        </Text>
                    </TouchableOpacity>
                )}

                {type === "completed" && (
                    <TouchableOpacity onPress={() => setShowRateModal(true)}>
                        <Text className="text-sm font-bold text-orange-500 underline">
                            Rate Order
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Modals */}
            {showBillModal && renderModal()}

            {/* ⭐ Rating Modal for Completed Orders */}
            {type === "completed" && (
                <RateOrderModal
                    visible={showRateModal}
                    boutiqueId={order.boutiqueId}
                    onClose={() => setShowRateModal(false)}
                />
            )}
        </View>
    );
}
