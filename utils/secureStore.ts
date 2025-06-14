import * as SecureStore from "expo-secure-store";

export const saveToken = async (key: string, value: string) => {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (error) {
        console.error("Error saving token:", error);
    }
};

export const getToken = async (key: string) => {
    try {
        return await SecureStore.getItemAsync(key);
    } catch (error) {
        console.error("Error retrieving token:", error);
        return null;
    }
};

export const deleteToken = async (key: string) => {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch (error) {
        console.error("Error deleting token:", error);
    }
};
