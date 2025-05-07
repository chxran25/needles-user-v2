// File: app/(tabs)/orders.tsx

import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import OrderCard from '@/components/order/OrderCard';

const mockOrders = [
    {
        id: '1',
        boutiqueName: 'Tattva Fashions',
        dressType: 'Lehenga',
        status: 'Processing',
        totalAmount: '₹3200',
        datePlaced: '01 May 2025',
    },
    {
        id: '2',
        boutiqueName: 'Miyapur Store',
        dressType: 'Saree',
        status: 'Shipped',
        totalAmount: '₹1450',
        datePlaced: '28 Apr 2025',
    },
    {
        id: '3',
        boutiqueName: 'Ethnic Elegance',
        dressType: 'Blouse',
        status: 'Delivered',
        totalAmount: '₹850',
        datePlaced: '20 Apr 2025',
    },
];

const filterOptions = ['All', 'Processing', 'Shipped', 'Delivered'];

export default function OrdersScreen() {
    const [activeFilter, setActiveFilter] = useState('All');

    const groupedOrders = mockOrders.reduce((acc: Record<string, typeof mockOrders>, order) => {
        if (!acc[order.status]) acc[order.status] = [];
        acc[order.status].push(order);
        return acc;
    }, {});

    const renderFilteredOrders = () => {
        if (activeFilter === 'All') {
            return filterOptions
                .filter((status) => status !== 'All' && groupedOrders[status])
                .map((status) => (
                    <View key={status} className="mb-6">
                        <Text className="text-lg font-bold text-dark-100 mb-2">{status}</Text>
                        {groupedOrders[status].map((order) => (
                            <OrderCard key={order.id} {...order} />
                        ))}
                    </View>
                ));
        } else {
            const filtered = mockOrders.filter((order) => order.status === activeFilter);
            return filtered.map((order) => <OrderCard key={order.id} {...order} />);
        }
    };

    return (
        <ScrollView className="flex-1 bg-[#FFF2D7]" contentContainerStyle={{ paddingBottom: 80 }}>
            <View className="bg-gradient-to-b from-[#FFF2D7] to-[#FDEECF] rounded-b-3xl px-4 pt-12 pb-6 shadow-sm">
                <Text className="text-3xl font-extrabold text-center text-dark-200">My Orders</Text>
                <Text className="text-sm text-gray-500 text-center mt-1">You have {mockOrders.length} active orders</Text>

                {/* Filter Chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
                    {filterOptions.map((status) => {
                        const isActive = activeFilter === status;
                        return (
                            <TouchableOpacity
                                key={status}
                                onPress={() => setActiveFilter(status)}
                                className={`mr-3 px-5 py-2 rounded-full shadow-sm ${
                                    isActive ? 'bg-dark-100' : 'bg-white border border-gray-300'
                                }`}
                            >
                                <Text
                                    className={`text-sm font-semibold ${
                                        isActive ? 'text-white' : 'text-dark-100'
                                    }`}
                                >
                                    {status}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <View className="px-4 pt-6">
                {mockOrders.length === 0 ? (
                    <View className="flex-1 justify-center items-center mt-32">
                        <Text className="text-xl font-semibold text-gray-600 text-center">
                            You haven't placed any orders yet.
                        </Text>
                        <Text className="text-base text-gray-500 mt-2 text-center px-6">
                            Looks like your order list is empty. Once you place an order, you’ll see it right here!
                        </Text>
                    </View>
                ) : (
                    renderFilteredOrders()
                )}
            </View>
        </ScrollView>
    );
}