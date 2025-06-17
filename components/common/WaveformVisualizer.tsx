// components/common/WaveformVisualizer.tsx
import { View } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

export default function WaveformVisualizer() {
    // Create 6 animated height values
    const heights = Array.from({ length: 6 }, () => useSharedValue(10));

    useEffect(() => {
        heights.forEach((h, i) => {
            h.value = withRepeat(
                withTiming(Math.random() * 50 + 10, {
                    duration: 300 + i * 100,
                    easing: Easing.linear,
                }),
                -1,
                true // reverse
            );
        });
    }, []);

    return (
        <View className="flex-row gap-1 items-end h-14 mt-4">
            {heights.map((h, i) => {
                const style = useAnimatedStyle(() => ({
                    height: h.value,
                }));

                return (
                    <Animated.View
                        key={i}
                        style={[style]}
                        className="w-2 rounded-full bg-black"
                    />
                );
            })}
        </View>
    );
}
