import { useEffect, useState } from "react";
import { useRouter, usePathname } from "expo-router";
import { getToken } from "@/utils/secureStore";

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
                    router.replace("/login");
                }
            } catch (error) {
                console.error("🔴 Auth token check failed:", error);
                router.replace("/login");
            } finally {
                setChecking(false);
            }
        };

        checkAuth();
    }, []);


    return checking;
};
