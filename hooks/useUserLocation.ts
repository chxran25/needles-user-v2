import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export function useUserLocation() {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.warn('Permission to access location was denied');
                return;
            }

            const {
                coords: { latitude, longitude },
            } = await Location.getCurrentPositionAsync({});
            setLocation({ latitude, longitude });
        })();
    }, []);

    return location;
}
