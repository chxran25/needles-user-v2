// utils/token.ts
import * as SecureStore from "expo-secure-store";

export async function getAccessToken() {
    return await SecureStore.getItemAsync("accessToken");
}
