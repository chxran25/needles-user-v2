// services/auth.ts
import api from "./api";
import { getToken, saveToken } from "@/utils/secureStore";

export const refreshAccessToken = async () => {
    const refreshToken = await getToken("refreshToken");

    if (!refreshToken) {
        console.error("⚠️ No refresh token found.");
        throw new Error("No refresh token available");
    }

    try {
        const response = await api.post("/refresh-token", { refreshToken });
        const { accessToken } = response.data;

        await saveToken("accessToken", accessToken);
        console.log("♻️ Access token refreshed");

        return accessToken;
    } catch (error) {
        console.error("❌ Failed to refresh token:", error);
        throw error;
    }
};
