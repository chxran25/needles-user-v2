// services/auth.ts
import axios from "axios";
import { getToken, saveToken } from "@/utils/secureStore";

export const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = await getToken("refreshToken");

    if (!refreshToken) {
        console.error("⚠️ No refresh token found.");
        throw new Error("No refresh token available");
    }

    try {
        console.log("🔁 Refreshing token using:", refreshToken);

        const response = await axios.post(
            "https://needles-v1.onrender.com/User/refresh-token",
            {}, // empty body
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`, // ✅ correct format
                    "Content-Type": "application/json",
                },
            }
        );

        const { accessToken } = response.data;

        await saveToken("accessToken", accessToken);
        console.log("✅ Access token refreshed:", accessToken);

        return accessToken;
    } catch (error: any) {
        console.error("❌ Failed to refresh token:", error?.response?.data || error.message);
        throw error;
    }
};
