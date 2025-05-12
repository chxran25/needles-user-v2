import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import "./globals.css";
import "react-native-reanimated";
import { ScrollProvider } from "@/context/ScrollContext";

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ScrollProvider>
                    <BottomSheetModalProvider>
                        <Stack
                            screenOptions={{
                                animation: "slide_from_right", // You can change to 'fade' or others
                                headerShown: false, // Optional: keep headers off
                            }}
                        />
                    </BottomSheetModalProvider>
                </ScrollProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
