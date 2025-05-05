import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ProfileScreen() {
    return (
        <ScrollView className="flex-1 bg-[#FFF2D7] px-5 pt-12">
            {/* Header */}
            <View className="flex-row items-center mb-6">
                <Ionicons name="person-circle-outline" size={34} color="#1F2937" />
                <Text className="text-2xl font-bold text-gray-800 ml-2">My Profile</Text>
            </View>

            {/* Profile Info Card */}
            <View className="bg-white rounded-2xl p-5 shadow mb-6">
                <Text className="text-xl font-semibold text-gray-900">Nikhil Kumar</Text>
                <Text className="text-sm text-gray-600 mt-1">+91 9876543210</Text>
                <TouchableOpacity className="mt-2">
                    <Text className="text-sm text-blue-600 font-medium">Edit Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Options List */}
            <View className="space-y-4">
                <ProfileOption label="My Orders" icon="receipt-outline" onPress={() => router.push('/(tabs)/orders')} />
                <ProfileOption label="My Measurements" icon="body-outline" onPress={() => {}} />
                <ProfileOption label="Language Preferences" icon="language-outline" onPress={() => {}} />
                <ProfileOption label="Help & Support" icon="help-circle-outline" onPress={() => {}} />
                <ProfileOption label="Settings" icon="settings-outline" onPress={() => {}} />
            </View>

            {/* Logout Button */}
            <TouchableOpacity
                className="mt-10 bg-red-100 py-4 rounded-xl shadow-sm"
                onPress={() => router.replace('/(auth)/login')}
            >
                <Text className="text-center text-red-600 font-bold text-base">Log Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

function ProfileOption({
                           label,
                           icon,
                           onPress,
                       }: {
    label: string;
    icon: any;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            className="bg-white rounded-xl px-5 py-4 flex-row items-center justify-between shadow-sm"
            onPress={onPress}
        >
            <View className="flex-row items-center">
                <Ionicons name={icon} size={22} color="#374151" />
                <Text className="ml-4 text-base text-gray-800">{label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
    );
}
