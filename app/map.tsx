import { View, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MapScreen() {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                setLoading(false);
                return;
            }

            const {
                coords: { latitude, longitude },
            } = await Location.getCurrentPositionAsync({});
            setLocation({ latitude, longitude });
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="black" />
                <Text className="mt-4 text-gray-600">Fetching your location...</Text>
            </SafeAreaView>
        );
    }

    if (!location) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white">
                <Text className="text-red-500">Unable to retrieve location.</Text>
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1">
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                showsUserLocation={true}
            >
                <Marker
                    coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }}
                    title="You are here"
                />
            </MapView>
        </View>
    );
}
