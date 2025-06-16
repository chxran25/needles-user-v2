import { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";

type CategoryTagsProps = {
    categories: string[];
};

type GradientPair = {
    colors: readonly [string, string];
    textColor: string;
};

const STORAGE_KEY = "CATEGORY_GRADIENT_MAP";

// 🎨 Clean, aesthetic gradients
const GRADIENT_PALETTE: GradientPair[] = [
    { colors: ["#f6d365", "#fda085"] as const, textColor: "#7c2d12" },
    { colors: ["#a1c4fd", "#c2e9fb"] as const, textColor: "#1e3a8a" },
    { colors: ["#fbc2eb", "#a6c1ee"] as const, textColor: "#4b0082" },
    { colors: ["#84fab0", "#8fd3f4"] as const, textColor: "#065f46" },
    { colors: ["#ffecd2", "#fcb69f"] as const, textColor: "#92400e" },
    { colors: ["#c2e59c", "#64b3f4"] as const, textColor: "#1f2937" },
    { colors: ["#fad0c4", "#ffd1ff"] as const, textColor: "#6b21a8" },
    { colors: ["#e0c3fc", "#8ec5fc"] as const, textColor: "#3730a3" },
    { colors: ["#d4fc79", "#96e6a1"] as const, textColor: "#365314" },
    { colors: ["#fdfbfb", "#ebedee"] as const, textColor: "#374151" },
];

export default function CategoryTags({ categories }: CategoryTagsProps) {
    const [colorMap, setColorMap] = useState<Record<string, GradientPair>>({});
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            loadAndAssignColors(categories);
        }
    }, [categories]);

    const loadAndAssignColors = async (categories: string[]) => {
        try {
            const stored = await SecureStore.getItemAsync(STORAGE_KEY);
            let existingMap: Record<string, GradientPair> = stored ? JSON.parse(stored) : {};
            let updated = { ...existingMap };
            let changed = false;

            categories.forEach((tag) => {
                const key = tag.trim().toLowerCase();
                if (!updated[key]) {
                    const random = GRADIENT_PALETTE[Math.floor(Math.random() * GRADIENT_PALETTE.length)];
                    updated[key] = random;
                    changed = true;
                }
            });

            if (changed) {
                await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updated));
            }

            setColorMap(updated);
        } catch (e) {
            console.error("Failed to load or update category colors:", e);
        }
    };

    return (
        <View className="flex-row flex-wrap gap-2">
            {categories.map((tag, index) => {
                const key = tag.trim().toLowerCase();
                const { colors, textColor } = colorMap[key] || GRADIENT_PALETTE[0];

                return (
                    <LinearGradient
                        key={index}
                        colors={colors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            borderRadius: 999,
                            paddingVertical: 6,
                            paddingHorizontal: 14,
                        }}
                    >
                        <Text style={{ color: textColor, fontWeight: "600", fontSize: 13 }}>{tag}</Text>
                    </LinearGradient>
                );
            })}
        </View>
    );
}
