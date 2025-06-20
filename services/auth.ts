// services/auth.ts
import axios from "axios";
import { getToken, saveToken } from "@/utils/secureStore";

// 🔁 Refresh Access Token using stored refresh token
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
            { refreshToken }, // ✅ Send refresh token in request body
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        if (!accessToken) {
            throw new Error("No access token received from refresh endpoint");
        }

        // 🧠 Optional: Update refresh token if backend rotated it
        await saveToken("accessToken", accessToken);
        if (newRefreshToken) {
            await saveToken("refreshToken", newRefreshToken);
        }

        console.log("✅ Access token refreshed:", accessToken);
        return accessToken;
    } catch (error: any) {
        console.error("❌ Failed to refresh token:", error?.response?.data || error.message);
        throw error;
    }
};
