import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type CategoryTagsProps = {
    categories: string[];
    onSelectCategory?: (category: string) => void;
};

const CategoryTags = ({ categories, onSelectCategory }: CategoryTagsProps) => {
    const getCategoryColor = (category: string) => {
        const colorMap: Record<string, { bg: string; text: string }> = {
            Lehengas: { bg: "bg-blue-100", text: "text-blue-600" },
            Magenta: { bg: "bg-pink-100", text: "text-pink-600" },
            Blouses: { bg: "bg-orange-100", text: "text-orange-600" },
            Dresses: { bg: "bg-green-100", text: "text-green-600" },
            Ethnic: { bg: "bg-yellow-100", text: "text-yellow-700" },
            Bridal: { bg: "bg-red-100", text: "text-red-600" },
            Western: { bg: "bg-purple-100", text: "text-purple-600" },
            Casual: { bg: "bg-indigo-100", text: "text-indigo-600" },
        };

        return colorMap[category] || { bg: "bg-gray-200", text: "text-gray-600" };
    };

    return (
        <View className="flex-row flex-wrap">
            {categories.map((category, index) => {
                const { bg, text } = getCategoryColor(category);

                return (
                    <TouchableOpacity
                        key={`${category}-${index}`}
                        accessibilityRole="button"
                        className={`${bg} rounded-full px-4 py-2 mr-2 mb-2`}
                        onPress={() => onSelectCategory?.(category)}
                    >
                        <Text className={`${text} text-sm font-semibold`}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default CategoryTags;
