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

const OrderCard: FC<OrderCardProps> = ({ id, boutiqueName, status, dressType, datePlaced }) => {
    return (
        <View className="bg-white rounded-xl p-4 mb-4 shadow">
            <Text className="text-base font-semibold mb-1">{boutiqueName}</Text>
            <Text className="text-sm text-gray-500 mb-1">Dress: {dressType}</Text>
            <Text className="text-sm text-gray-500 mb-1">Order ID: {id}</Text>
            <View className="flex-row justify-between items-center mt-2">
                <Text className="text-xs text-gray-400">Placed on: {datePlaced}</Text>
                <Text
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                        status === 'Delivered'
                            ? 'bg-green-100 text-green-700'
                            : status === 'In Progress'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-200 text-gray-600'
                    }`}
                >
                    {status}
                </Text>
            </View>
        </View>
    );
};

export default OrderCard;
