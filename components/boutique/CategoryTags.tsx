import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type CategoryTagsProps = {
    categories: string[];
    onSelectCategory?: (category: string) => void;
};

const CategoryTags = ({ categories, onSelectCategory }: CategoryTagsProps) => {
    const getCategoryColor = (category: string) => {
        const colorMap: Record<string, { bg: string; text: string }> = {
            Lehengas: { bg: "bg-purple-100", text: "text-purple-700" },
            Blouses: { bg: "bg-orange-100", text: "text-orange-700" },
            Dresses: { bg: "bg-green-100", text: "text-green-700" },
            Bridal: { bg: "bg-red-100", text: "text-red-700" },
            Ethnic: { bg: "bg-yellow-100", text: "text-yellow-800" },
            Western: { bg: "bg-blue-100", text: "text-blue-700" },
            Casual: { bg: "bg-gray-200", text: "text-gray-700" },
        };

        return colorMap[category] || { bg: "bg-light-200", text: "text-textDark" };
    };

    return (
        <View className="flex-row flex-wrap gap-2">
            {categories.map((category, index) => {
                const { bg, text } = getCategoryColor(category);

                return (
                    <TouchableOpacity
                        key={`${category}-${index}`}
                        accessibilityRole="button"
                        className={`${bg} px-3 py-1 rounded-full`}
                        onPress={() => onSelectCategory?.(category)}
                        activeOpacity={onSelectCategory ? 0.8 : 1}
                    >
                        <Text className={`${text} text-xs font-medium`}>{category}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default CategoryTags;
