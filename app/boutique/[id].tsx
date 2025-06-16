import OrderForm from "@/app/boutique/order-form";
import BackButton from "@/components/common/BackButton";
import { fetchBoutiqueDetails, fetchBoutiqueCatalogue } from "@/services/api";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import DressTypeGallery from "@/components/boutique/DressTypeGallery";
import CatalogueModal, { CatalogueItem } from "@/components/boutique/CatalogueModal";
import { Boutique } from "@/services/api";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import ImageViewing from "react-native-image-viewing";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function BoutiqueDetails() {
    const { id } = useLocalSearchParams();
    const [visible, setVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const catalogueAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
    const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
    const [catalogueItems, setCatalogueItems] = useState<CatalogueItem[]>([]);
    const [boutique, setBoutique] = useState<Boutique | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (id) fetchBoutique();
        catalogueAnim.setValue(SCREEN_HEIGHT);
    }, [id]);

    const fetchBoutique = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await fetchBoutiqueDetails(id as string);
            setBoutique(data);
            const catalogueRes = await fetchBoutiqueCatalogue(id as string);
            setCatalogueItems(catalogueRes.catalogue || []);
        } catch (err) {
            setError("Failed to load boutique details.");
        } finally {
            setLoading(false);
        }
    };

    const toggleOrderForm = () => {
        if (!isOrderFormOpen) {
            setIsOrderFormOpen(true);
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setIsOrderFormOpen(false);
            });
        }
    };

    const openCatalogue = () => {
        setIsCatalogueOpen(true);
    };


    const closeCatalogue = () => {
        setIsCatalogueOpen(false);
    };


    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [SCREEN_HEIGHT, 0],
    });

    const catalogueTranslateY = catalogueAnim;

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#FF6B6B" />
            </View>
        );
    }

    if (error || !boutique) {
        return (
            <View className="flex-1 justify-center items-center px-4 bg-gray-50">
                <Text className="text-red-500 text-center text-lg">{error || "Boutique not found."}</Text>
            </View>
        );
    }

    const headerImage =
        Array.isArray(boutique.headerImage) && boutique.headerImage.length > 0
            ? boutique.headerImage[0]
            : typeof boutique.headerImage === "string"
                ? boutique.headerImage
                : null;

    const bannerImageUri =
        headerImage && headerImage.startsWith("http")
            ? headerImage
            : headerImage
                ? `https://needles-v1.onrender.com${headerImage}`
                : "https://via.placeholder.com/600x300?text=Boutique+Banner";

    const galleryImages = [
        { uri: bannerImageUri },
        ...(boutique.gallery || [])
            .filter((uri) => typeof uri === "string" && uri.trim().length > 0)
            .map((uri) => ({
                uri: uri.startsWith("http") ? uri : `https://needles-v1.onrender.com${uri}`,
            })),
    ];

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            <View className="flex-1 bg-gray-50">
                <ImageViewing
                    images={galleryImages}
                    imageIndex={currentIndex}
                    visible={visible}
                    onRequestClose={() => setVisible(false)}
                />

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="relative">
                        <TouchableOpacity onPress={() => { setCurrentIndex(0); setVisible(true); }}>
                            <ImageBackground
                                source={{ uri: bannerImageUri }}
                                className="w-full h-80"
                                imageStyle={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
                                resizeMode="cover"
                            >
                                <View className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent rounded-b-3xl" />
                            </ImageBackground>
                        </TouchableOpacity>

                        <BackButton />
                    </View>

                    <View className="bg-white mx-4 -mt-10 rounded-t-[32px] shadow-2xl z-10 pb-40">
                        <View className="px-5 pt-10 space-y-8">
                            <View className="mb-6">
                                <View className="flex-row justify-between items-start mb-3">
                                    <View className="flex-1">
                                        <Text className="text-3xl font-bold text-gray-900 mb-2">{boutique.name}</Text>
                                        <View className="flex-row items-center">
                                            <View className="flex-row mr-2">
                                                {Array.from({ length: 5 }).map((_, i) => {
                                                    const rating = boutique.averageRating || 0;
                                                    if (i + 1 <= Math.floor(rating)) {
                                                        return <Ionicons key={i} name="star" size={16} color="#FFD700" />;
                                                    } else if (i < rating) {
                                                        return <Ionicons key={i} name="star-half" size={16} color="#FFD700" />;
                                                    } else {
                                                        return <Ionicons key={i} name="star-outline" size={16} color="#E5E7EB" />;
                                                    }
                                                })}
                                            </View>
                                            <Text className="text-sm text-gray-600 font-medium">
                                                {boutique.averageRating?.toFixed(1) || "0.0"} Rating
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full border border-orange-200">
                                        <View className="flex-row items-center">
                                            <Ionicons name="location" size={14} color="#EA580C" />
                                            <Text className="text-orange-700 font-semibold text-sm ml-1">
                                                {boutique.area || "Location"}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View className="h-px bg-gray-200 mb-6" />

                            <View className="mb-8">
                                <Text className="text-lg font-bold text-gray-900 mb-4">Our Work</Text>
                                {boutique.dressTypes && boutique.dressTypes.length > 0 && (
                                    <DressTypeGallery dressTypes={boutique.dressTypes} />
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <TouchableOpacity
                    onPress={openCatalogue}
                    className="absolute bottom-32 right-4 w-24 h-24 bg-black rounded-full shadow-lg items-center justify-center z-10"
                >
                    <View className="items-center justify-center">
                        <MaterialIcons name="menu-book" size={34} color="#FFFFFF" />
                        <Text className="text-[11px] text-white mt-0.1">CATALOGUE</Text>
                    </View>
                </TouchableOpacity>



                <TouchableOpacity
                    className={`absolute bottom-6 left-4 right-4 shadow-2xl z-10 ${isOrderFormOpen ? "opacity-0" : ""}`}
                    onPress={toggleOrderForm}
                    style={{ opacity: isOrderFormOpen ? 0 : 1 }}
                >
                    <View className="bg-gradient-to-r from-orange-500 to-red-500 py-4 px-6 rounded-2xl">
                        <View className="flex-row justify-center items-center">
                            <Ionicons name="bag-add" size={22} color="white" />
                            <Text className="ml-2 text-white font-bold text-lg">Place Your Order</Text>
                            <Ionicons name="chevron-up" size={20} color="white" className="ml-2" />
                        </View>
                    </View>
                </TouchableOpacity>

                {isOrderFormOpen && (
                    <Animated.View
                        className="absolute left-0 right-0 bg-white z-20 rounded-t-3xl shadow-2xl overflow-hidden"
                        style={{ transform: [{ translateY }], height: SCREEN_HEIGHT }}
                    >
                        <OrderForm
                            categories={boutique.dressTypes?.map((d: { type: string }) => d.type) || []}
                            onClose={toggleOrderForm}
                        />
                    </Animated.View>
                )}

                <CatalogueModal
                    visible={isCatalogueOpen}
                    onClose={closeCatalogue}
                    catalogueItems={catalogueItems}
                />
            </View>
        </KeyboardAvoidingView>
    );
}