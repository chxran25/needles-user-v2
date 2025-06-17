import { View } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    Easing,
    interpolate,
} from "react-native-reanimated";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function WaveformVisualizer() {
    // Create 8 animated height values for a more detailed waveform
    const heights = Array.from({ length: 8 }, () => useSharedValue(0.2));
    const opacities = Array.from({ length: 8 }, () => useSharedValue(0.3));

    useEffect(() => {
        heights.forEach((height, i) => {
            // Stagger the animations for a more organic feel
            const delay = i * 150;
            const duration = 400 + Math.random() * 300;

            setTimeout(() => {
                height.value = withRepeat(
                    withTiming(Math.random() * 0.8 + 0.2, {
                        duration,
                        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
                    }),
                    -1,
                    true
                );
            }, delay);
        });

        opacities.forEach((opacity, i) => {
            const delay = i * 100;
            setTimeout(() => {
                opacity.value = withRepeat(
                    withTiming(Math.random() * 0.5 + 0.5, {
                        duration: 600 + Math.random() * 400,
                        easing: Easing.inOut(Easing.ease),
                    }),
                    -1,
                    true
                );
            }, delay);
        });
    }, []);

    return (
        <View className="flex-row items-end justify-center gap-1.5 h-16 px-4">
            {heights.map((height, i) => {
                const animatedStyle = useAnimatedStyle(() => {
                    const barHeight = interpolate(
                        height.value,
                        [0, 1],
                        [8, 48]
                    );

                    return {
                        height: barHeight,
                        opacity: opacities[i].value,
                        transform: [
                            {
                                scaleY: height.value,
                            },
                        ],
                    };
                });

                return (
                    <Animated.View
                        key={i}
                        style={[animatedStyle]}
                        className="w-1 bg-white rounded-full"
                    />
                );
            })}
        </View>
    );
}