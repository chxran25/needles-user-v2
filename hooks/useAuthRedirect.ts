import { useEffect, useState } from "react";
import { useRouter, usePathname } from "expo-router";
import { getToken } from "@/utils/secureStore";
import { Alert } from "react-native";

export const useAuthRedirect = () => {
    const [checking, setChecking] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await getToken("accessToken");

                console.log("🧠 Auth check | token:", token, "| path:", pathname);

                if (!token && pathname !== "/login" && pathname !== "/otp") {
                    Alert.alert(
                        "Session Expired",
                        "Your session has expired. Please login again.",
                        [
                            {
                                text: "OK",
                                onPress: () => router.replace("/(auth)/login"),
                            },
                        ],
                        { cancelable: false }
                    );
                }
            } catch (error) {
                console.error("🔴 Auth token check failed:", error);
                router.replace("/(auth)/login");
            } finally {
                setChecking(false);
            }
        };

        checkAuth();
    }, []);

    return checking;
};