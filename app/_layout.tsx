import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ToastProvider } from "react-native-toast-notifications";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import { ScrollProvider } from "@/context/ScrollContext";
import { SessionProvider } from "@/context/SessionContext";
import SessionExpiredModal from "@/components/modals/SessionExpiredModal";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

import "react-native-reanimated";
import "./globals.css";

export default function RootLayout() {
    const checking = useAuthRedirect();

    if (checking) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ScrollProvider>
                    <SessionProvider>
                        <BottomSheetModalProvider>
                            <ToastProvider
                                placement="top"
                                duration={3000}
                                animationType="slide-in"
                                offset={60}
                            >
                                <ActionSheetProvider>
                                    <>
                                        <Stack screenOptions={{ headerShown: false }} />
                                        <SessionExpiredModal />
                                    </>
                                </ActionSheetProvider>
                            </ToastProvider>
                        </BottomSheetModalProvider>
                    </SessionProvider>
                </ScrollProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
