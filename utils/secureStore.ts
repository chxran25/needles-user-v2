import * as SecureStore from "expo-secure-store";

// ✅ Token Key Constant
export const ACCESS_TOKEN_KEY = "accessToken";

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
        // Add additional keys here if needed
    } catch (error) {
        console.error("Error clearing tokens:", error);
    }
};
