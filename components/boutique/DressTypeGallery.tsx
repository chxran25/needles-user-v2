import { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import ImageViewing from "react-native-image-viewing";
import CategoryTags from "@/components/boutique/CategoryTags";

// Updated type for image object
type ImageItem = {
    _id: string;
    url: string;
    // embedding can be added if needed: embedding: number[]
};

type DressType = {
    type: string;
    images?: ImageItem[];
};

type Props = {
    dressTypes: DressType[];
};

export default function DressTypeGallery({ dressTypes }: Props) {
    const [selectedType, setSelectedType] = useState<string>("");
    const [selectedImages, setSelectedImages] = useState<ImageItem[]>([]);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        console.log("👗 dressTypes received:", dressTypes);
        if (dressTypes.length > 0) {
            const firstType = dressTypes[0];
            setSelectedType(firstType.type);
            console.log("👉 default selected type:", firstType.type);
            console.log("🖼 default images:", firstType.images);
            setSelectedImages(firstType.images || []);
        }
    }, [dressTypes]);

    const handleSelect = (type: string) => {
        setSelectedType(type);
        const match = dressTypes.find((d) => d.type === type);
        const validImages = (match?.images || []).filter((img): img is ImageItem => typeof img.url === "string");
        console.log(`📌 Selected type: ${type}`);
        console.log("📸 Images for this type:", validImages);
        setSelectedImages(validImages);
    };

    const imagesForViewer = selectedImages.map((img) => {
        const fullUri = img.url.startsWith("http") ? img.url : `https://needles-v1.onrender.com${img.url}`;
        console.log("🧵 Mapped image URI:", fullUri);
        return { uri: fullUri };
    });

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
