import SearchedBoutiqueCard from '@/components/boutique/searchedBoutiqueCard';
import { fetchSearchResults } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Boutique } from '@/types';

export default function SearchScreen() {
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [results, setResults] = useState<Boutique[]>([]);
    const [fallbackMessage, setFallbackMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef<TextInput>(null);
    const { autoFocus } = useLocalSearchParams();

    useEffect(() => {
        if (autoFocus === 'true') {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [autoFocus]);

    const handleSearch = async () => {
        if (!search.trim()) return;
        setLoading(true);
        setError('');
        setFallbackMessage('');
        try {
            const res = await fetchSearchResults(search.trim());
            console.log("🔍 API response:", res);
            setResults(res.results || []);
            setFallbackMessage(res.results?.length === 0 ? res.message || 'No results found.' : '');
        } catch (err) {
            console.error("❌ Search Error:", err);
            setError('Something went wrong while searching.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1 px-4 pt-10"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 80, flexGrow: 1 }}
                >
                    {/* Search Bar */}
                    <View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm mb-4">
                        <Ionicons name="search" size={20} color="gray" />
                        <TextInput
                            ref={inputRef}
                            className="flex-1 ml-2 text-sm"
                            placeholder="Search for a Boutique or Style"
                            value={search}
                            onChangeText={setSearch}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        <Ionicons name="mic-outline" size={20} color="gray" />
                    </View>

                    {/* Tag Filters */}
                    <View className="flex-row flex-wrap gap-2 mb-6">
                        {["Lehengas", "Blouses", "Sarees", "Kurtis", "Bridal"].map((tag) => (
                            <TouchableOpacity
                                key={tag}
                                onPress={() => {
                                    const newTag = tag === selectedTag ? '' : tag;
                                    setSelectedTag(newTag);
                                    setSearch(newTag);
                                    handleSearch(); // auto-search
                                }}
                                className={`px-3 py-1 rounded-full ${
                                    selectedTag === tag ? 'bg-blue-600' : 'bg-blue-100'
                                }`}
                            >
                                <Text
                                    className={`text-xs font-medium ${
                                        selectedTag === tag ? 'text-white' : 'text-blue-600'
                                    }`}
                                >
                                    {tag}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Fallback Message */}
                    {fallbackMessage ? (
                        <Text className="text-center text-gray-400 mb-2">{fallbackMessage}</Text>
                    ) : null}

                    {/* Results */}
                    {loading ? (
                        <ActivityIndicator size="large" className="mt-10" />
                    ) : error ? (
                        <Text className="text-center text-red-500 mt-20">{error}</Text>
                    ) : results.length > 0 ? (
                        <View className="gap-4 mb-10">
                            {results.map((boutique) => (
                                <SearchedBoutiqueCard
                                    key={boutique._id}
                                    boutique={{
                                        ...boutique,
                                        dressTypes: (boutique.dressTypes ?? []).map((d) => ({
                                            ...d,
                                            images: d.images ?? [], // ← 🛠 Ensure images is always string[]
                                        })),
                                    }}
                                    query={search}
                                />


                            ))}
                        </View>
                    ) : (
                        <Text className="text-center text-gray-500 mt-20">No boutiques found.</Text>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
