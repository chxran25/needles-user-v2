import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useScrollContext } from "@/context/ScrollContext";

export function useNavBarAutoHide(): Animated.Value {
    const { scrollY } = useScrollContext();
    const translateY = useRef(new Animated.Value(0)).current;
    const lastScrollY = useRef(0);
    const debounceTimer = useRef<number | null>(null);
    const isHidden = useRef(false);

    useEffect(() => {
        const diff = scrollY - lastScrollY.current;

        // Clear previous debounce timer
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        // Scroll down → hide (even if you're near top)
        if (diff > 5 && !isHidden.current) {
            Animated.timing(translateY, {
                toValue: 100,
                duration: 600,
                useNativeDriver: true,
            }).start();
            isHidden.current = true;
        }

        // Scroll up → show
        if (diff < -5 && isHidden.current) {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
            isHidden.current = false;
        }

        // Auto-show after user stops scrolling
        debounceTimer.current = window.setTimeout(() => {
            if (isHidden.current) {
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
                isHidden.current = false;
            }
        }, 500);

        lastScrollY.current = scrollY;
    }, [scrollY]);

    return translateY;
}
