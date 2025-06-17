import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";

type CategoryTagsProps = {
    categories: string[];
    selected?: string;
    onSelect?: (type: string) => void;
};

type GradientPair = {
    colors: readonly [string, string];
    textColor: string;
};

const STORAGE_KEY = "CATEGORY_GRADIENT_MAP";

const GRADIENT_PALETTE: GradientPair[] = [
    { colors: ["#f6d365", "#fda085"], textColor: "#7c2d12" },
    { colors: ["#a1c4fd", "#c2e9fb"], textColor: "#1e3a8a" },
    { colors: ["#fbc2eb", "#a6c1ee"], textColor: "#4b0082" },
    { colors: ["#84fab0", "#8fd3f4"], textColor: "#065f46" },
    { colors: ["#ffecd2", "#fcb69f"], textColor: "#92400e" },
    { colors: ["#c2e59c", "#64b3f4"], textColor: "#1f2937" },
    { colors: ["#fad0c4", "#ffd1ff"], textColor: "#6b21a8" },
    { colors: ["#e0c3fc", "#8ec5fc"], textColor: "#3730a3" },
    { colors: ["#d4fc79", "#96e6a1"], textColor: "#365314" },
    { colors: ["#fdfbfb", "#ebedee"], textColor: "#374151" },
];

export default function CategoryTags({ categories, selected, onSelect }: CategoryTagsProps) {
    const [colorMap, setColorMap] = useState<Record<string, GradientPair>>({});
    const initialized = useRef(false);

    // ✅ Cleaned-up version of categories: trimmed, deduplicated
    const uniqueCategories = Array.from(
        new Map(
            categories.map((cat) => [cat.toLowerCase().trim(), cat])
        ).values()
    );

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            assignAndStoreColors(uniqueCategories);
        }
    }, [categories.join(",")]); // ensures refresh when categories change

    const assignAndStoreColors = async (categories: string[]) => {
        const stored = await SecureStore.getItemAsync(STORAGE_KEY);
        let existing: Record<string, GradientPair> = stored ? JSON.parse(stored) : {};
        let updated: Record<string, GradientPair> = {};
        let changed = false;

        const currentKeys = categories.map((cat) => cat.toLowerCase().trim());

        currentKeys.forEach((key) => {
            if (!existing[key]) {
                const random = GRADIENT_PALETTE[Math.floor(Math.random() * GRADIENT_PALETTE.length)];
                updated[key] = random;
                changed = true;
            } else {
                updated[key] = existing[key];
            }
        });

        const hasDeletedKeys = Object.keys(existing).some(key => !currentKeys.includes(key));

        if (changed || hasDeletedKeys) {
            await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updated));
        }

        setColorMap(updated);
    };

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            <View className="flex-row gap-2 px-1">
                {uniqueCategories.map((tag, index) => {
                    const key = tag.toLowerCase().trim();
                    const { colors, textColor } = colorMap[key] || GRADIENT_PALETTE[0];
                    const isSelected = selected === tag;

                    return (
                        <Pressable key={index} onPress={() => onSelect?.(tag)}>
                            <LinearGradient
                                colors={colors}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    borderRadius: 999,
                                    paddingVertical: 6,
                                    paddingHorizontal: 14,
                                    opacity: onSelect ? (isSelected ? 1 : 0.6) : 1,
                                    borderWidth: isSelected ? 2 : 0,
                                    borderColor: isSelected ? "#000" : "transparent",
                                }}
                            >
                                <Text style={{ color: textColor, fontWeight: "600", fontSize: 13 }}>{tag}</Text>
                            </LinearGradient>
                        </Pressable>
                    );
                })}
            </View>
        </ScrollView>
    );
}
