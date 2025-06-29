import SearchedBoutiqueCard from '@/components/boutique/searchedBoutiqueCard';
import {
    fetchSearchResults,
    uploadImageForSearch,
    fetchImageSearchResult
} from '@/services/api';
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
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import type { Boutique } from '@/types';

export default function SearchScreen() {
    const { autoFocus } = useLocalSearchParams();
    const inputRef = useRef<TextInput>(null);
    const { showActionSheetWithOptions } = useActionSheet();

    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [results, setResults] = useState<Boutique[]>([]);
    const [fallbackMessage, setFallbackMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageSearchActive, setImageSearchActive] = useState(false);

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
        setImageSearchActive(false);

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

    const handleImageSearch = () => {
        showActionSheetWithOptions(
            {
                title: "Search with an image",
                options: ["Take Photo", "Choose from Gallery", "Cancel"],
                cancelButtonIndex: 2,
            },
            async (selectedIndex) => {
                if (selectedIndex === 0) {
                    await launchCameraForSearch();
                } else if (selectedIndex === 1) {
                    await pickImageFromGalleryForSearch();
                }
            }
        );
    };

    const launchCameraForSearch = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Camera permission is required.');
                return;
            }
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.canceled && result.assets?.[0]?.uri) {
                handleImageUpload(result.assets[0].uri);
            }
        } catch (err) {
            console.error("❌ Camera error:", err);
            Alert.alert("Error", "Could not open camera.");
        }
    };

    const pickImageFromGalleryForSearch = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.canceled && result.assets?.[0]?.uri) {
                handleImageUpload(result.assets[0].uri);
            }
        } catch (err) {
            console.error("❌ Gallery error:", err);
            Alert.alert("Error", "Could not open gallery.");
        }
    };

    const handleImageUpload = async (uri: string) => {
        setLoading(true);
        setError('');
        setFallbackMessage('');
        setImageSearchActive(true);
        try {
            const uploadResponse = await uploadImageForSearch(uri);
            const jobId = uploadResponse.jobId;
            console.log("✅ Queued Image Search jobId:", jobId);
            pollForImageResult(jobId);
        } catch (err) {
            console.error("❌ Upload error:", err);
            Alert.alert("Error", "Image upload failed.");
            setLoading(false);
            setImageSearchActive(false);
        }
    };

    const pollForImageResult = async (jobId: string) => {
        let attempts = 0;
        const maxAttempts = 5;
        const poll = async () => {
            try {
                const res = await fetchImageSearchResult(jobId);
                console.log("📡 Poll result:", res);

                if (res.status === 'completed') {
                    const normalized = (res.results || []).map((item: any) => ({
                        _id: item.boutiqueId,
                        name: item.boutiqueName,
                        area: item.area,
                        dressTypes: [
                            {
                                type: item.dressType,
                                images: [item.imageUrl],
                            },
                        ],
                        averageRating: (item.similarity ?? 0) * 5, // scale similarity to 0-5
                    }));
                    setResults(normalized);
                    setFallbackMessage(normalized.length === 0 ? 'No results found.' : '');
                    setLoading(false);
                    setImageSearchActive(false);
                    return;
                }
                if (res.status === 'failed') {
                    setError(res.message || 'Image search failed.');
                    setLoading(false);
                    setImageSearchActive(false);
                    return;
                }
                if (res.status === 'processing') {
                    if (attempts < maxAttempts) {
                        attempts++;
                        setTimeout(poll, 3000);
                    } else {
                        setError('Image search timed out. Please try again.');
                        setLoading(false);
                        setImageSearchActive(false);
                    }
                }
            } catch (err) {
                console.error("❌ Poll error:", err);
                setError('Something went wrong while checking search status.');
                setLoading(false);
                setImageSearchActive(false);
            }
        };
        poll();
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
                        <TouchableOpacity onPress={handleImageSearch}>
                            <Ionicons name="camera-outline" size={20} color="gray" />
                        </TouchableOpacity>
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
                                    handleSearch();
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

                    {/* Fallback / Error */}
                    {fallbackMessage ? (
                        <Text className="text-center text-gray-400 mb-2">{fallbackMessage}</Text>
                    ) : null}
                    {error ? (
                        <Text className="text-center text-red-500 mb-4">{error}</Text>
                    ) : null}

                    {/* Loading */}
                    {loading && (
                        <View className="mt-20 items-center justify-center">
                            <ActivityIndicator size="large" color="#3B82F6" />
                            {imageSearchActive && (
                                <Text className="mt-4 text-gray-600">Analyzing your image...</Text>
                            )}
                        </View>
                    )}

                    {/* Results */}
                    {!loading && results.length > 0 ? (
                        <View className="gap-4 mb-10">
                            {results.map((boutique, index) => (
                                <SearchedBoutiqueCard
                                    key={boutique._id + index}
                                    boutique={{
                                        ...boutique,
                                        dressTypes: (boutique.dressTypes ?? []).map((d) => ({
                                            ...d,
                                            images: d.images ?? [],
                                        })),
                                    }}
                                    query={search}
                                />
                            ))}
                        </View>
                    ) : (
                        !loading &&
                        !error &&
                        !fallbackMessage &&
                        <Text className="text-center text-gray-500 mt-20">
                            No boutiques found.
                        </Text>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
