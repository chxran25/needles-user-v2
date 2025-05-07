// File: components/order/OrderCard.tsx

import { View, Text } from 'react-native';
import { FC } from 'react';

interface OrderCardProps {
    id: string;
    boutiqueName: string;
    status: string;
    dressType: string;
    datePlaced: string;
}

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'Delivered':
            return {
                bg: 'bg-green-100',
                text: 'text-green-800',
            };
        case 'Shipped':
            return {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
            };
        case 'Processing':
        default:
            return {
                bg: 'bg-gray-200',
                text: 'text-gray-700',
            };
    }
};

const OrderCard: FC<OrderCardProps> = ({ id, boutiqueName, status, dressType, datePlaced }) => {
    const { bg, text } = getStatusStyles(status);

    return (
        <View className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 shadow-sm">
            {/* Header: Boutique Name */}
            <Text className="text-lg font-bold text-dark-100 mb-1">{boutiqueName}</Text>

            {/* Section Divider */}
            <View className="h-0.5 bg-light-200 my-2 rounded-full" />

            {/* Details */}
            <View className="space-y-1 mb-4">
                <Text className="text-sm text-gray-800">
                    <Text className="font-semibold">Dress Type: </Text>{dressType}
                </Text>
                <Text className="text-sm text-gray-800">
                    <Text className="font-semibold">Order ID: </Text>{id}
                </Text>
                <Text className="text-sm text-gray-800">
                    <Text className="font-semibold">Placed on: </Text>{datePlaced}
                </Text>
            </View>

            {/* Status Badge */}
            <View className="flex-row justify-end">
                <View className={`px-3 py-1 rounded-full ${bg}`}>
                    <Text className={`text-xs font-semibold ${text}`}>{status}</Text>
                </View>
            </View>

        </View>
    );
};

export default OrderCard;
