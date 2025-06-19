import * as SecureStore from "expo-secure-store";

// ✅ Token Key Constants
export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

// 🔐 Save a token
export const saveToken = async (key: string, value: string) => {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (error) {
        console.error("Error saving token:", error);
    }
};

// 🔓 Retrieve a token
export const getToken = async (key: string) => {
    try {
        return await SecureStore.getItemAsync(key);
    } catch (error) {
        console.error("Error retrieving token:", error);
        return null;
    }
};

// ❌ Delete a token
export const deleteToken = async (key: string) => {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch (error) {
        console.error("Error deleting token:", error);
    }
};

// 🧹 Delete all relevant tokens (for logout)
export const clearAllTokens = async () => {
    try {
        await deleteToken(ACCESS_TOKEN_KEY);
        await deleteToken(REFRESH_TOKEN_KEY); // 🔄 Clear refresh token as well
    } catch (error) {
        console.error("Error clearing tokens:", error);
    }
};
