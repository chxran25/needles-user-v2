import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { fetchTopBoutiquesForDressType } from '@/services/api';
import BoutiqueCard from '@/components/boutique/BoutiqueCard';
import type { Boutique } from '@/types';

export default function TopBoutiquesForType() {
    const { dressType } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [boutiques, setBoutiques] = useState<Boutique[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadBoutiques = async () => {
            try {
                if (!dressType) {
                    console.warn('⚠️ No dressType found in route params');
                    return;
                }

                console.log('📍 Screen opened for dress type:', dressType);
                setLoading(true);

                const data = await fetchTopBoutiquesForDressType(dressType as string);
                console.log('🎯 Received boutiques:', data.boutiques);

                setBoutiques(data.boutiques || []);
                setError(null);
            } catch (err: any) {
                console.error('❌ Error fetching boutiques:', err);
                setError(err?.response?.data?.message || 'Failed to load boutiques.');
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

    return (
        <SafeAreaView className="flex-1 bg-light-100 relative">
            {/* 🔙 Inline Back Button */}
            <TouchableOpacity
                onPress={() => router.replace('/')}
                className="absolute top-12 left-4 z-50 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg"
            >
                <Ionicons name="arrow-back" size={20} color="black" />
            </TouchableOpacity>

            <ScrollView className="px-4 pt-20">
                <Text className="text-2xl font-bold mb-4 capitalize">
                    Top Boutiques for “{dressType}”
                </Text>

                {error ? (
                    <Text className="text-red-500 text-center text-base">{error}</Text>
                ) : boutiques.length === 0 ? (
                    <View className="flex items-center justify-center h-[300px]">
                        <Text className="text-gray-500 text-base text-center">
                            No nearby boutiques found for this style.
                        </Text>
                    </View>
                ) : (
                    <View className="gap-6 pb-16">
                        {boutiques.map((boutique) => {
                            console.log('🧪 Boutique ID:', boutique._id);
                            console.log('📷 headerImage raw:', boutique.headerImage);
                            console.log('🖼️ gallery:', boutique.gallery);

                            const headerImage =
                                Array.isArray(boutique.gallery) && boutique.gallery.length > 0
                                    ? boutique.gallery[0]
                                    : typeof boutique.headerImage === 'string'
                                        ? boutique.headerImage
                                        : Array.isArray(boutique.headerImage) && boutique.headerImage.length > 0
                                            ? boutique.headerImage[0]
                                            : 'https://via.placeholder.com/300x160';

                            console.log('✅ Final image used for card:', headerImage);

                            const uniqueTags: string[] = Array.from(
                                new Map(
                                    (boutique.dressTypes ?? []).map((d) => [
                                        d.type.toLowerCase().trim(),
                                        d.type,
                                    ])
                                ).values()
                            );

                            return (
                                <BoutiqueCard
                                    key={boutique._id}
                                    id={boutique._id}
                                    name={boutique.name}
                                    tags={uniqueTags}
                                    location={boutique.area}
                                    image={headerImage}
                                    rating={boutique.averageRating}
                                />
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
