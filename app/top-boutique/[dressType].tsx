import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchTopBoutiquesForDressType } from '@/services/api';
import BoutiqueCard from '@/components/boutique/BoutiqueCard';

type Boutique = {
    _id: string;
    name: string;
    area: string;
    headerImage?: string;
    dressTypes: { type: string }[];
    averageRating: number;
};

export default function TopBoutiquesForType() {
    const { dressType } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [boutiques, setBoutiques] = useState<Boutique[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBoutiques = async () => {
            try {
                if (!dressType) {
                    console.warn("⚠️ No dressType found in route params");
                    return;
                }

                console.log("📍 Screen opened for dress type:", dressType);
                setLoading(true);

                const data = await fetchTopBoutiquesForDressType(dressType as string);
                console.log("🎯 Received boutiques:", data.boutiques);

                setBoutiques(data.boutiques || []);
                setError(null);
            } catch (err: any) {
                console.error("❌ Error fetching boutiques:", err);
                setError(err?.response?.data?.message || "Failed to load boutiques.");
            } finally {
                setLoading(false);
            }
        };

        loadBoutiques();
    }, [dressType]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#FF5A5F" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center px-6">
                <Text className="text-red-500 text-center text-base">{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-light-100">
            <ScrollView className="px-4 pt-4">
                <Text className="text-2xl font-bold mb-4 capitalize">
                    Top Boutiques for “{dressType}”
                </Text>

                <View className="gap-6 pb-16">
                    {boutiques.length === 0 ? (
                        <Text className="text-gray-500 text-center">
                            No nearby boutiques found for this style.
                        </Text>
                    ) : (
                        boutiques.map((boutique) => {
                            const image =
                                typeof boutique.headerImage === 'string' &&
                                boutique.headerImage.startsWith('http')
                                    ? boutique.headerImage
                                    : `https://needles-v1.onrender.com${boutique.headerImage}`;

                            return (
                                <BoutiqueCard
                                    key={boutique._id}
                                    id={boutique._id}
                                    name={boutique.name}
                                    tags={boutique.dressTypes.map((d) => d.type)}
                                    location={boutique.area}
                                    image={image}
                                    rating={boutique.averageRating}
                                />
                            );
                        })
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
