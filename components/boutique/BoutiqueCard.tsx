import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import CategoryTags from "./CategoryTags";

type Props = {
  id: string;
  name: string;
  tags: string[];
  location: string;
  image?: string | number | null; // optional
  rating: number;
};

export default function BoutiqueCard({
  id,
  name,
  tags,
  location,
  image,
  rating,
}: Props) {
  const isValidRemoteImage =
    typeof image === "string" && image.startsWith("http");

  const imageSource =
    isValidRemoteImage
      ? { uri: image }
      : require("@/assets/images/fallback-image.png");

  return (
    <Link href={{ pathname: "/boutique/[id]", params: { id } }} asChild>
      <TouchableOpacity
        className="bg-white rounded-xl px-4 py-3 shadow-md border border-gray-100 mb-4"
        activeOpacity={0.9}
      >
        {/* Boutique Image */}
        <Image
          source={imageSource}
          className="w-full h-40 rounded-xl bg-gray-200"
          resizeMode="cover"
        />

        {/* Name & Rating */}
        <View className="flex-row justify-between items-center mt-3">
          <Text
            className="text-lg font-bold text-gray-900 flex-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
          <View className="flex-row ml-2">
            {Array.from({ length: Math.round(rating) }).map((_, i) => (
              <Ionicons
                key={i}
                name="star"
                size={16}
                color="#facc15"
                style={{ marginRight: 2 }}
              />
            ))}
            {Array.from({ length: 5 - Math.round(rating) }).map((_, i) => (
              <Ionicons
                key={`empty-${i}`}
                name="star-outline"
                size={16}
                color="#d1d5db"
                style={{ marginRight: 2 }}
              />
            ))}
          </View>
        </View>

        {/* Tags */}
        {tags?.length > 0 && (
          <View className="mt-3">
            <Text className="text-sm text-gray-600 font-medium mb-1">
              Known for:
            </Text>
            <CategoryTags categories={[...new Set(tags.map(tag => tag.trim().toLowerCase()))]} />
          </View>
        )}

        {/* Location */}
        <View className="pt-3">
          <Text className="text-sm text-gray-500">{'📍'} {location}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
