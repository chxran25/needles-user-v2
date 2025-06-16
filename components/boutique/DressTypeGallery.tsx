import { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import ImageViewing from "react-native-image-viewing";
import CategoryTags from "@/components/boutique/CategoryTags";

type DressType = {
    type: string;
    images?: string[];
};

type Props = {
    dressTypes: DressType[];
};

export default function DressTypeGallery({ dressTypes }: Props) {
    const [selectedType, setSelectedType] = useState<string>("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        if (dressTypes.length > 0) {
            setSelectedType(dressTypes[0].type);
            setSelectedImages(dressTypes[0].images || []);
        }
    }, [dressTypes]);

    const handleSelect = (type: string) => {
        setSelectedType(type);
        const match = dressTypes.find((d) => d.type === type);
        setSelectedImages(match?.images || []);
    };

    const imagesForViewer = selectedImages.map((uri) => ({
        uri: uri.startsWith("http") ? uri : `https://needles-v1.onrender.com${uri}`,
    }));

    return (
        <View className="space-y-5 mt-2 mb-6">
            {/* Horizontal tags */}
            <View className="px-1">
                <CategoryTags
                    categories={dressTypes.map((d) => d.type)}
                    selected={selectedType}
                    onSelect={handleSelect}
                />
            </View>

            {/* Dress Images */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
                {imagesForViewer.map((img, index) => (
                    <Pressable
                        key={index}
                        onPress={() => {
                            setImageIndex(index);
                            setIsViewerOpen(true);
                        }}
                        className="mr-4"
                    >
                        <Image
                            source={{ uri: img.uri }}
                            className="w-40 h-60 rounded-2xl bg-gray-200 shadow-md"
                            resizeMode="cover"
                        />
                    </Pressable>
                ))}
            </ScrollView>

            {/* Fullscreen viewer */}
            <ImageViewing
                images={imagesForViewer}
                imageIndex={imageIndex}
                visible={isViewerOpen}
                onRequestClose={() => setIsViewerOpen(false)}
                swipeToCloseEnabled
                doubleTapToZoomEnabled
            />
        </View>
    );
}
