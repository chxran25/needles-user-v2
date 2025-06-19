import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { updateUserLocation } from '@/services/api';
import { useToast } from 'react-native-toast-notifications';
import { useRouter } from 'expo-router';
import BackButton from '@/components/common/BackButton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LocationCoords {
    latitude: number;
    longitude: number;
}

interface AddressForm {
    flat: string;
    block: string;
    street: string;
}

export default function MapAndLocationForm() {
    const [location, setLocation] = useState<LocationCoords | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const toast = useToast();
    const router = useRouter();

    const [addressForm, setAddressForm] = useState<AddressForm>({
        flat: '',
        block: '',
        street: '',
    });

    const [fieldErrors, setFieldErrors] = useState<Partial<AddressForm>>({});

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
            const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        } catch (err) {
            console.error('Location fetch error:', err);
            setLocationError('Unable to fetch location.');
            toast.show('Failed to get your location', { type: 'danger' });
        }
    }, [toast]);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            if (await requestLocationPermission()) {
                await getCurrentLocation();
            }
            setLoading(false);
        };
        init();
    }, [requestLocationPermission, getCurrentLocation]);

    const validateForm = (): boolean => {
        const errors: Partial<AddressForm> = {};
        if (!addressForm.flat.trim()) errors.flat = 'Flat number is required';
        if (!addressForm.block.trim()) errors.block = 'Block is required';
        if (!addressForm.street.trim()) errors.street = 'Street is required';
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: keyof AddressForm, value: string) => {
        setAddressForm(prev => ({ ...prev, [field]: value }));
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleUpdateLocation = async () => {
        if (!location) {
            toast.show('Location not available', { type: 'warning' });
            return;
        }
        if (!validateForm()) {
            toast.show('Please fill all fields', { type: 'warning' });
            return;
        }

        try {
            setUpdating(true);
            await updateUserLocation({
                lat: location.latitude,
                lng: location.longitude,
                flatNumber: addressForm.flat.trim(),
                block: addressForm.block.trim(),
                street: addressForm.street.trim(),
            });

            toast.show('Location updated!', { type: 'success' });
            setAddressForm({ flat: '', block: '', street: '' });

            // ✅ Redirect to home
            router.replace('/');
        } catch (err) {
            console.error('Update error:', err);
            toast.show('Failed to update location', { type: 'danger' });
        } finally {
            setUpdating(false);
        }
    };

    const renderInputField = (
        field: keyof AddressForm,
        placeholder: string,
        accessibilityLabel: string
    ) => (
        <View className="mb-4">
            <View className={`rounded-2xl overflow-hidden ${fieldErrors[field] ? 'border-2 border-red-400' : ''}`}>
                <LinearGradient colors={['#f8fafc', '#f1f5f9', '#e2e8f0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <TextInput
                        className="px-4 py-4 text-base bg-transparent"
                        placeholder={placeholder}
                        placeholderTextColor="#64748b"
                        value={addressForm[field]}
                        onChangeText={(value) => handleInputChange(field, value)}
                        accessibilityLabel={accessibilityLabel}
                        accessibilityHint={`Enter your ${field}`}
                    />
                </LinearGradient>
            </View>
            {fieldErrors[field] && (
                <Text className="text-red-500 text-xs mt-2 ml-2">{fieldErrors[field]}</Text>
            )}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                {/* Map Section */}
                <View style={{ height: SCREEN_HEIGHT * 0.6 }} className="w-full relative">
                    {loading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="large" color="#3B82F6" />
                            <Text className="text-gray-500 mt-2">Fetching location...</Text>
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
                        >
                            <Marker coordinate={location} title="You are here" />
                        </MapView>
                    ) : null}

                    {/* Floating Title */}
                    <View className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg border border-gray-200 z-10">
                        <Text className="text-base font-semibold text-gray-800">
                            Update Your Address
                        </Text>
                    </View>

                    {/* ✅ Back Button */}
                    <BackButton />
                </View>

                {/* Form Section */}
                <LinearGradient
                    colors={['#ffffff', '#f8fafc', '#f1f5f9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        flex: 1,
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        marginTop: -24,
                        paddingTop: 32,
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                    }}
                >
                    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                        <Text className="text-gray-600 mb-6 text-center">
                            Enter your address details below
                        </Text>

                        {renderInputField('flat', 'Enter flat number', 'Flat number input')}
                        {renderInputField('block', 'Enter block', 'Block input')}
                        {renderInputField('street', 'Enter street / apt', 'Street or apartment input')}

                        <TouchableOpacity
                            onPress={handleUpdateLocation}
                            disabled={updating || !location}
                            className="rounded-xl mb-6 overflow-hidden"
                            accessibilityLabel="Update location button"
                            accessibilityHint="Tap to save your address and location"
                        >
                            <LinearGradient
                                colors={updating || !location
                                    ? ['#9ca3af', '#6b7280']
                                    : ['#1f2937', '#111827', '#000000']
                                }
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{ paddingVertical: 16 }}
                            >
                                {updating ? (
                                    <View className="flex-row items-center justify-center">
                                        <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
                                        <Text className="text-white text-center font-semibold">
                                            Updating...
                                        </Text>
                                    </View>
                                ) : (
                                    <Text className="text-white text-center font-semibold">
                                        Update Location
                                    </Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </ScrollView>
                </LinearGradient>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
