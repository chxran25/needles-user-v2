// app/(auth)/register.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from 'react-native-toast-notifications';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { registerUser } from '@/services/api';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface UserData {
    name: string;
    phone: string;
    flatNumber: string;
    block: string;
    street: string;
}

interface LocationCoords {
    latitude: number;
    longitude: number;
}

export default function RegisterScreen() {
    const router = useRouter();
    const toast = useToast();

    const [currentStep, setCurrentStep] = useState(1); // 1 = Basic Details, 2 = Location & Address
    const [userData, setUserData] = useState<UserData>({
        name: '',
        phone: '',
        flatNumber: '',
        block: '',
        street: '',
    });

    const [location, setLocation] = useState<LocationCoords | null>(null);
    const [loading, setLoading] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    const requestLocationPermission = useCallback(async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                toast.show('Permission denied for location', { type: 'danger' });
                setLocationError('Location permission is required.');
                return false;
            }
            return true;
        } catch (err) {
            console.error('Permission error:', err);
            toast.show('Failed to request permission', { type: 'danger' });
            return false;
        }
    }, [toast]);

    const getCurrentLocation = useCallback(async () => {
        try {
            const pos = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });
            setLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            });
        } catch (err) {
            console.error('Location fetch error:', err);
            setLocationError('Unable to fetch location.');
            toast.show('Failed to get your location', { type: 'danger' });
        }
    }, [toast]);

    const handleContinueToLocation = async () => {
        const { name, phone } = userData;

        // Validation for basic details only
        if (!name || !phone || phone.length < 10) {
            toast.show('Please fill in all required fields', { type: 'danger' });
            return;
        }

        // Move to location step and fetch location
        setCurrentStep(2);
        setLoading(true);
        if (await requestLocationPermission()) {
            await getCurrentLocation();
        }
        setLoading(false);
    };

    const showError = (err: any) => {
        console.log('❌ API Error:', JSON.stringify(err?.response?.data, null, 2));
        const message =
            typeof err?.response?.data === 'string'
                ? err.response.data
                : err?.response?.data?.error ??
                err?.response?.data?.message ??
                err?.message ??
                'Something went wrong';
        toast.show(message, { type: 'danger' });
    };

    const handleRegister = async () => {
        if (!location) {
            toast.show('Location not available', { type: 'warning' });
            return;
        }

        // Validation for address fields
        const { flatNumber, street } = userData;
        if (!flatNumber || !street) {
            toast.show('Please fill in all required address fields', { type: 'danger' });
            return;
        }

        const formattedPhone = userData.phone.startsWith('+91') ? userData.phone : `+91${userData.phone}`;
        setRegistering(true);

        try {
            const res = await registerUser({
                name: userData.name,
                phone: formattedPhone,
                address: {
                    flatNumber: userData.flatNumber,
                    block: userData.block,
                    street: userData.street,
                    location: {
                        lat: location.latitude,
                        lng: location.longitude,
                    },
                },
            });

            toast.show('Registration successful! OTP sent to your phone.', { type: 'success' });

            // Redirect to OTP screen
            router.push({
                pathname: '/otp',
                params: { phone: formattedPhone },
            });
        } catch (err) {
            showError(err);
        } finally {
            setRegistering(false);
        }
    };

    const handleBack = () => {
        if (currentStep === 2) {
            setCurrentStep(1);
        } else {
            router.back();
        }
    };

    const handleRefreshLocation = async () => {
        setLoading(true);
        if (await requestLocationPermission()) {
            await getCurrentLocation();
        }
        setLoading(false);
    };

    // Step 1: Basic Details (Name & Phone)
    const renderUserDetailsStep = () => (
        <SafeAreaView className="flex-1 bg-[#FFF2D7] px-6">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo */}
                    <View className="items-center mb-12">
                        <Image
                            source={require("../../assets/images/needles-logo.png")}
                            resizeMode="contain"
                            className="h-32 w-72"
                        />
                        <Text className="text-lg text-gray-700 mt-4 tracking-wide">
                            Another <Text className="text-yellow-700 font-semibold">stitch</Text> just a registration away!
                        </Text>
                    </View>

                    {/* Progress Indicator */}
                    <View className="flex-row items-center justify-center mb-8">
                        <View className="bg-yellow-600 w-10 h-10 rounded-full items-center justify-center">
                            <Text className="text-white font-bold text-base">1</Text>
                        </View>
                        <View className="w-16 h-1 bg-gray-300 mx-3" />
                        <View className="bg-gray-300 w-10 h-10 rounded-full items-center justify-center">
                            <Text className="text-gray-500 font-bold text-base">2</Text>
                        </View>
                    </View>

                    {/* Form Card */}
                    <View className="bg-white rounded-3xl p-8 shadow-lg">
                        <Text className="text-2xl font-bold text-gray-800 mb-8 text-center">
                            Create Your Account
                        </Text>

                        {/* Full Name */}
                        <Text className="text-gray-700 font-medium mb-3 text-base">Full Name</Text>
                        <TextInput
                            value={userData.name}
                            onChangeText={(text) => setUserData((prev) => ({ ...prev, name: text }))}
                            placeholder="Enter your full name"
                            placeholderTextColor="#aaa"
                            className="bg-gray-100 rounded-xl px-6 py-4 text-lg text-gray-800 mb-6"
                        />

                        {/* Phone Number */}
                        <Text className="text-gray-700 font-medium mb-3 text-base">Phone Number</Text>
                        <TextInput
                            value={userData.phone}
                            onChangeText={(text) => setUserData((prev) => ({ ...prev, phone: text }))}
                            keyboardType="phone-pad"
                            placeholder="e.g. 9876543210"
                            placeholderTextColor="#aaa"
                            className="bg-gray-100 rounded-xl px-6 py-4 text-lg text-gray-800 mb-8"
                        />

                        {/* Continue Button */}
                        <Pressable
                            onPress={handleContinueToLocation}
                            className="mt-2 bg-black rounded-xl py-5 shadow-md"
                        >
                            <View className="flex-row items-center justify-center">
                                <Text className="text-white font-semibold text-lg tracking-wide mr-2">
                                    Continue to Location
                                </Text>
                                <Ionicons name="arrow-forward" size={22} color="white" />
                            </View>
                        </Pressable>
                    </View>

                    {/* Divider */}
                    <View className="flex-row items-center my-10">
                        <View className="flex-1 h-px bg-gray-300" />
                        <Text className="mx-4 text-gray-400 text-base">Or register with</Text>
                        <View className="flex-1 h-px bg-gray-300" />
                    </View>

                    {/* Social Register */}
                    <View className="flex-row justify-center space-x-8">
                        <Pressable className="bg-white p-4 rounded-full shadow-md">
                            <Ionicons name="logo-facebook" size={28} color="#1877F2" />
                        </Pressable>
                        <Pressable className="bg-white p-4 rounded-full shadow-md">
                            <Ionicons name="logo-google" size={28} color="#DB4437" />
                        </Pressable>
                        <Pressable className="bg-white p-4 rounded-full shadow-md">
                            <Ionicons name="logo-apple" size={28} color="#000" />
                        </Pressable>
                    </View>

                    {/* Login Link */}
                    <Pressable onPress={() => router.push("/login")} className="mt-12 mb-8">
                        <Text className="text-center text-gray-800 text-base">
                            Already have an account?{" "}
                            <Text className="text-amber-600 font-semibold underline">Login Now</Text>
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );

    // Step 2: Location & Address Details
    const renderLocationStep = () => (
        <SafeAreaView className="flex-1 bg-[#FFF2D7]">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Header */}
                <View className="px-6 pt-4 pb-2">
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={handleBack}
                            className="bg-white p-3 rounded-full shadow-sm"
                        >
                            <Ionicons name="arrow-back" size={24} color="#374151" />
                        </TouchableOpacity>

                        <View className="items-center">
                            <Image
                                source={require("../../assets/images/needles-logo.png")}
                                resizeMode="contain"
                                className="h-12 w-32"
                            />
                        </View>

                        <View className="w-12" />
                    </View>

                    {/* Progress Indicator */}
                    <View className="flex-row items-center justify-center mt-4 mb-2">
                        <View className="bg-yellow-600 w-10 h-10 rounded-full items-center justify-center">
                            <Ionicons name="checkmark" size={18} color="white" />
                        </View>
                        <View className="w-16 h-1 bg-yellow-600 mx-3" />
                        <View className="bg-yellow-600 w-10 h-10 rounded-full items-center justify-center">
                            <Text className="text-white font-bold text-base">2</Text>
                        </View>
                    </View>

                    <Text className="text-center text-gray-700 text-base">
                        <Text className="text-yellow-700 font-semibold">Pin</Text> your location and add address
                    </Text>
                </View>

                {/* Map Section */}
                <View style={{ height: SCREEN_HEIGHT * 0.35 }} className="mx-6 rounded-3xl overflow-hidden shadow-lg">
                    {loading ? (
                        <View className="flex-1 items-center justify-center bg-white">
                            <ActivityIndicator size="large" color="#F59E0B" />
                            <Text className="text-gray-500 mt-2">Fetching your location...</Text>
                        </View>
                    ) : location ? (
                        <MapView
                            style={{ flex: 1 }}
                            initialRegion={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                            toolbarEnabled={false}
                            onRegionChangeComplete={(region) => {
                                setLocation({
                                    latitude: region.latitude,
                                    longitude: region.longitude,
                                });
                            }}
                        >
                            <Marker
                                coordinate={location}
                                title="Your Location"
                                description="Drag the map to adjust"
                                pinColor="#F59E0B"
                            />
                        </MapView>
                    ) : (
                        <View className="flex-1 items-center justify-center bg-gray-100">
                            <Ionicons name="location-outline" size={48} color="#9CA3AF" />
                            <Text className="text-gray-500 mt-2 text-center px-4">
                                Unable to fetch location
                            </Text>
                            <TouchableOpacity
                                onPress={handleRefreshLocation}
                                className="mt-4 bg-yellow-600 px-4 py-2 rounded-lg"
                            >
                                <Text className="text-white font-medium">Retry</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Address Form */}
                <ScrollView className="flex-1 px-6 mt-4" showsVerticalScrollIndicator={false}>
                    <View className="bg-white rounded-3xl p-6 shadow-lg">
                        <Text className="text-xl font-bold text-gray-800 mb-6 text-center">
                            Complete Your Address
                        </Text>

                        {/* Flat Number */}
                        <Text className="text-gray-700 font-medium mb-2">Flat Number</Text>
                        <TextInput
                            value={userData.flatNumber}
                            onChangeText={(text) => setUserData((prev) => ({ ...prev, flatNumber: text }))}
                            placeholder="e.g. 101, A-12"
                            placeholderTextColor="#aaa"
                            className="bg-gray-100 rounded-xl px-5 py-3 text-lg text-gray-800 mb-4"
                        />

                        {/* Block (Optional) */}
                        <Text className="text-gray-700 font-medium mb-2">Block (Optional)</Text>
                        <TextInput
                            value={userData.block}
                            onChangeText={(text) => setUserData((prev) => ({ ...prev, block: text }))}
                            placeholder="e.g. Block A, Tower 1"
                            placeholderTextColor="#aaa"
                            className="bg-gray-100 rounded-xl px-5 py-3 text-lg text-gray-800 mb-4"
                        />

                        {/* Street */}
                        <Text className="text-gray-700 font-medium mb-2">Street</Text>
                        <TextInput
                            value={userData.street}
                            onChangeText={(text) => setUserData((prev) => ({ ...prev, street: text }))}
                            placeholder="e.g. MG Road, Anna Nagar"
                            placeholderTextColor="#aaa"
                            className="bg-gray-100 rounded-xl px-5 py-3 text-lg text-gray-800 mb-6"
                        />

                        {/* GPS Coordinates */}
                        {location && (
                            <View className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6">
                                <Text className="text-green-700 text-sm text-center">
                                    📍 GPS: ({location.latitude.toFixed(6)}, {location.longitude.toFixed(6)})
                                </Text>
                            </View>
                        )}

                        {/* Register Button */}
                        <TouchableOpacity
                            onPress={handleRegister}
                            disabled={registering || !location}
                            className="rounded-xl mb-4 overflow-hidden"
                        >
                            <LinearGradient
                                colors={registering || !location
                                    ? ['#9ca3af', '#6b7280']
                                    : ['#1f2937', '#111827', '#000000']
                                }
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{ paddingVertical: 16 }}
                            >
                                {registering ? (
                                    <View className="flex-row items-center justify-center">
                                        <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
                                        <Text className="text-white text-center font-semibold text-lg">
                                            Creating Account...
                                        </Text>
                                    </View>
                                ) : (
                                    <Text className="text-white text-center font-semibold text-lg">
                                        Complete Registration
                                    </Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Instruction */}
                        <Text className="text-gray-500 text-xs text-center">
                            Drag the map above to adjust your exact location
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );

    return currentStep === 1 ? renderUserDetailsStep() : renderLocationStep();
}