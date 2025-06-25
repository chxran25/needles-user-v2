import { View, Text, TouchableOpacity, Image, ActivityIndicator, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { MediaType } from 'expo-image-picker';
import { uploadImageForSearch } from '@/services/api';

// 💡 Define type for search result
type SearchResult = {
    boutiqueId: string;
    boutiqueName: string;
    area: string;
    dressType: string;
    imageUrl: string;
    similarity: number;
};

export default function ImageSearchScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchCompleted, setSearchCompleted] = useState(false);
    const router = useRouter();

    const pickImageFromLibrary = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets?.[0]?.uri) {
            const uri = result.assets[0].uri;
            setImage(uri);
            handleUpload(uri);
        }
    };

    const takePhoto = async () => {
        // Request camera permission
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Camera permission is required to take photos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets?.[0]?.uri) {
            const uri = result.assets[0].uri;
            setImage(uri);
            handleUpload(uri);
        }
    };

    const handleUpload = async (uri: string) => {
        setLoading(true);
        setSearchCompleted(false);
        try {
            const res = await uploadImageForSearch(uri);
            setResults(res.topMatches || []);
            setSearchCompleted(true);
        } catch (err) {
            console.error('Image search failed:', err);
            Alert.alert('Search Failed', 'Unable to search for similar dresses. Please try again.');
            setSearchCompleted(true);
        } finally {
            setLoading(false);
        }
    };

    const resetSearch = () => {
        setImage(null);
        setResults([]);
        setSearchCompleted(false);
        setLoading(false);
    };

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center px-6">
            <View className="items-center mb-8">
                <View className="w-24 h-24 bg-gray-800 rounded-full items-center justify-center mb-6">
                    <Ionicons name="camera-outline" size={40} color="white" />
                </View>
                <Text className="text-white text-xl font-medium mb-2">Search with your camera</Text>
                <Text className="text-gray-400 text-center text-base leading-6">
                    Take a photo or upload an image to find similar dresses at nearby boutiques
                </Text>
            </View>

            <View className="w-full space-y-4">
                <TouchableOpacity
                    onPress={takePhoto}
                    className="bg-blue-600 rounded-full py-4 px-8 flex-row items-center justify-center"
                >
                    <Ionicons name="camera" size={24} color="white" />
                    <Text className="text-white text-lg font-medium ml-3">Take Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={pickImageFromLibrary}
                    className="bg-gray-700 rounded-full py-4 px-8 flex-row items-center justify-center"
                >
                    <Ionicons name="images" size={24} color="white" />
                    <Text className="text-white text-lg font-medium ml-3">Choose from Gallery</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderSearchResults = () => (
        <View className="flex-1">
            {/* Header with uploaded image */}
            <View className="bg-gray-900 p-4 border-b border-gray-700">
                <View className="flex-row items-center justify-between mb-3">
                    <TouchableOpacity onPress={resetSearch} className="p-2">
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-lg font-medium">Search Results</Text>
                    <TouchableOpacity onPress={pickImageFromLibrary} className="p-2">
                        <Ionicons name="images" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {image && (
                    <View className="items-center">
                        <Image
                            source={{ uri: image }}
                            className="w-64 h-48 rounded-2xl"
                            resizeMode="cover"
                        />
                        <Text className="text-gray-400 text-sm mt-2">
                            {results.length} similar {results.length === 1 ? 'dress' : 'dresses'} found
                        </Text>
                    </View>
                )}
            </View>

            {/* Loading state */}
            {loading && (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text className="text-white mt-4 text-lg">Searching for similar dresses...</Text>
                </View>
            )}

            {/* No results */}
            {!loading && searchCompleted && results.length === 0 && (
                <View className="flex-1 items-center justify-center px-6">
                    <Ionicons name="search-outline" size={64} color="#6B7280" />
                    <Text className="text-white text-xl font-medium mt-4 mb-2">No matches found</Text>
                    <Text className="text-gray-400 text-center mb-6">
                        We couldn't find any similar dresses. Try a different image or adjust the angle.
                    </Text>
                    <TouchableOpacity
                        onPress={takePhoto}
                        className="bg-blue-600 rounded-full py-3 px-6"
                    >
                        <Text className="text-white font-medium">Try Another Photo</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Results list */}
            {!loading && results.length > 0 && (
                <FlatList
                    data={results}
                    keyExtractor={(item, index) => `${item.boutiqueId}-${index}`}
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            className="bg-white rounded-xl mb-4 overflow-hidden"
                            onPress={() => router.push(`/boutique/${item.boutiqueId}`)}
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                        >
                            <Image
                                source={{
                                    uri: item.imageUrl.startsWith('http')
                                        ? item.imageUrl
                                        : `https://needles-v1.onrender.com${item.imageUrl}`
                                }}
                                className="w-full h-48"
                                resizeMode="cover"
                            />
                            <View className="p-4">
                                <View className="flex-row items-center justify-between mb-2">
                                    <Text className="font-bold text-lg text-gray-900 flex-1" numberOfLines={1}>
                                        {item.boutiqueName}
                                    </Text>
                                    <View className="bg-green-100 px-2 py-1 rounded-full">
                                        <Text className="text-green-800 text-xs font-medium">
                                            {Math.round(item.similarity * 100)}% match
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex-row items-center mb-1">
                                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                                    <Text className="text-gray-600 ml-1">{item.area}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Ionicons name="shirt-outline" size={16} color="#6B7280" />
                                    <Text className="text-gray-600 ml-1">{item.dressType}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-black">
            {!image ? renderEmptyState() : renderSearchResults()}
        </SafeAreaView>
    );
}