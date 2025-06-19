import { useEffect } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useRouter } from "expo-router";

import { useSession } from "@/context/SessionContext";
import { clearAllTokens } from "@/utils/secureStore";

export default function SessionExpiredModal() {
    const { expired, resetSession } = useSession();
    const router = useRouter();

    const handleOk = async () => {
        await clearAllTokens();
        resetSession();
        router.replace("/(auth)/login");
    };

    useEffect(() => {
        if (expired) {
            console.log("🔒 Session expired — showing modal");
        }
    }, [expired]);

    return (
        <Modal
            visible={expired}
            transparent
            animationType="fade"
            onRequestClose={handleOk}
        >
            <View className="flex-1 bg-black/50 justify-center items-center px-6">
                <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                    className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-lg items-center"
                >
                    <Text className="text-lg font-semibold text-gray-900 mb-2">
                        Session Expired
                    </Text>
                    <Text className="text-sm text-gray-600 text-center mb-6">
                        Your login session has expired. Please log in again to continue.
                    </Text>

                    <TouchableOpacity
                        className="bg-indigo-600 rounded-full px-5 py-3 w-full items-center"
                        onPress={handleOk}
                        activeOpacity={0.9}
                    >
                        <Text className="text-white text-base font-semibold">Log In Again</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}
