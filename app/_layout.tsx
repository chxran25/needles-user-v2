import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import "./globals.css";
import 'react-native-reanimated';
import { ScrollProvider } from "@/context/ScrollContext"; // ✅ Add this

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ScrollProvider>
                    <BottomSheetModalProvider>
                        <Slot />
                    </BottomSheetModalProvider>
                </ScrollProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
