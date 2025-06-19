// ✅ Fully Updated ProfilePage Component with Layout Tweaks
import React, { useState, useEffect, JSX } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import {
    User,
    Phone,
    MapPin,
    ShoppingBag,
    HelpCircle,
    FileText,
    LogOut,
    ChevronRight,
    Save,
    X,
} from 'lucide-react-native';

import { useToast } from 'react-native-toast-notifications';
import { useRouter } from 'expo-router';

import { fetchUserProfile, updateUserName, logoutUser } from '@/services/api';
import { getToken, clearAllTokens } from '@/utils/secureStore';

interface IconProps {
    size?: number;
    color?: string;
}

interface ProfileData {
    name: string;
    phone: string;
    address: {
        flatNumber?: string;
        block?: string;
        street?: string;
    };
}

interface ProfileItemProps {
    icon: (props: IconProps) => JSX.Element;
    label: string;
    value: string;
    onPress: () => void;
}

interface MenuButtonProps {
    icon: (props: IconProps) => JSX.Element;
    title: string;
    subtitle?: string;
    onPress: () => void;
    iconBgColor?: string;
    iconColor?: string;
}

const wrapIcon = (Icon: React.FC<IconProps>) => (props: IconProps) => <Icon {...props} />;

export default function ProfilePage(): JSX.Element {
    const toast = useToast();
    const router = useRouter();

    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [editing, setEditing] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>('');

    useEffect(() => {
        const loadProfileData = async () => {
            try {
                setLoading(true);
                const user = await fetchUserProfile();
                setProfileData(user);
                setNewName(user.name);
            } catch (error) {
                Alert.alert('Error', 'Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };
        void loadProfileData();
    }, []);

    const handleSaveName = async () => {
        try {
            const res = await updateUserName(newName);
            toast.show('✅ Name updated successfully.');
            setProfileData((prev) => prev && { ...prev, name: res.user.name });
            setEditing(false);
        } catch (err) {
            toast.show('❌ Failed to update name.', { type: 'danger' });
        }
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const token = await getToken('accessToken');

                        if (!token) {
                            toast.show("⚠️ No session found. Redirecting...", { type: "warning" });
                            router.replace("/(auth)/login");
                            return;
                        }

                        try {
                            await logoutUser();
                        } catch (err) {
                            console.warn("⚠️ Logout API failed (likely due to expired token). Continuing...");
                        }

                        await clearAllTokens();
                        toast.show("👋 Logged out.");
                        router.replace("/(auth)/login");
                    } catch (err) {
                        toast.show("❌ Logout flow failed.", { type: "danger" });
                    }
                },
            },
        ]);
    };

    const initials = profileData?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
    const fullAddress = `${profileData?.address?.flatNumber || ''}, ${profileData?.address?.block || ''}, ${profileData?.address?.street || ''}`;

    return (
        <SafeAreaView className="flex-1 bg-slate-50 mt-10">
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
                {/* Header with left-aligned image */}
                <View className="bg-white px-6 pt-10 pb-10 flex-row items-center space-x-5 rounded-b-3xl shadow-lg">
                    <View className="w-24 h-24 rounded-full bg-indigo-600 justify-center items-center shadow-lg">
                        <Text className="text-2xl font-bold text-white">{initials}</Text>
                    </View>
                    <View className="flex-1 left-4">
                        <Text className="text-base text-gray-600">Welcome back,</Text>
                        {editing ? (
                            <View className="flex-row items-center mt-1 space-x-2">
                                <TextInput
                                    value={newName}
                                    onChangeText={setNewName}
                                    className="bg-gray-100 text-gray-800 rounded-xl px-4 py-2 flex-1"
                                    placeholder="Enter your name"
                                />
                                <TouchableOpacity onPress={handleSaveName} className="bg-green-500 p-2 rounded-full">
                                    <Save size={18} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setEditing(false)} className="bg-gray-300 p-2 rounded-full">
                                    <X size={18} color="black" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity onPress={() => setEditing(true)}>
                                <Text className="text-2xl font-bold text-gray-900">{profileData?.name}</Text>
                                <Text className="text-sm text-blue-500 mt-1">Tap to edit name</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Profile Info */}
                <View className="mt-6 px-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">Profile Information</Text>
                    <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <ProfileItem icon={wrapIcon(User)} label="Full Name" value={profileData?.name || ''} onPress={() => {}} />
                        <View className="h-px bg-gray-100 ml-20" />
                        <ProfileItem icon={wrapIcon(Phone)} label="Phone Number" value={profileData?.phone || ''} onPress={() => {}} />
                        <View className="h-px bg-gray-100 ml-20" />
                        <ProfileItem icon={wrapIcon(MapPin)} label="Address" value={fullAddress} onPress={() => {}} />
                    </View>
                </View>

                {/* Menu */}
                <View className="mt-6 px-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</Text>
                    <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <MenuButton icon={wrapIcon(ShoppingBag)} title="My Orders" subtitle="View your order history" onPress={() => {}} iconBgColor="bg-green-50" iconColor="#059669" />
                        <View className="h-px bg-gray-100 ml-20" />
                        <MenuButton icon={wrapIcon(HelpCircle)} title="Help & Support" subtitle="Get assistance when you need it" onPress={() => {}} iconBgColor="bg-blue-50" iconColor="#0EA5E9" />
                        <View className="h-px bg-gray-100 ml-20" />
                        <MenuButton icon={wrapIcon(FileText)} title="Terms & Services" subtitle="Read our terms and conditions" onPress={() => {}} iconBgColor="bg-purple-50" iconColor="#8B5CF6" />
                    </View>
                </View>

                {/* Logout Button */}
                <View className="mt-8 px-6">
                    <TouchableOpacity className="flex-row items-center justify-center bg-white py-4 rounded-xl border border-red-100 shadow-sm" onPress={handleLogout} activeOpacity={0.8}>
                        <LogOut size={20} color="#EF4444" />
                        <Text className="text-base font-semibold text-red-500 ml-2">Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const ProfileItem = ({ icon: Icon, label, value, onPress }: ProfileItemProps): JSX.Element => (
    <TouchableOpacity className="flex-row items-center justify-between px-5 py-4" onPress={onPress} activeOpacity={0.7}>
        <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 rounded-full bg-indigo-50 justify-center items-center mr-4">
                <Icon size={20} color="#6366F1" />
            </View>
            <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-1 font-medium">{label}</Text>
                <Text className="text-base text-gray-900 font-medium">{value}</Text>
            </View>
        </View>
        <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
);

const MenuButton = ({ icon: Icon, title, subtitle, onPress, iconBgColor = 'bg-gray-50', iconColor = '#374151' }: MenuButtonProps): JSX.Element => (
    <TouchableOpacity className="flex-row items-center justify-between px-5 py-4" onPress={onPress} activeOpacity={0.7}>
        <View className="flex-row items-center flex-1">
            <View className={`w-11 h-11 rounded-full justify-center items-center mr-4 ${iconBgColor}`}>
                <Icon size={22} color={iconColor} />
            </View>
            <View>
                <Text className="text-base font-semibold text-gray-900 mb-1">{title}</Text>
                {subtitle && <Text className="text-sm text-gray-600">{subtitle}</Text>}
            </View>
        </View>
        <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
);