import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
    baseURL: 'https://needles-v1.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ Automatically attach token to every request
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("🔐 Attached token:", token);
        } else {
            console.warn("⚠️ No access token found in SecureStore");
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ API Methods

export const userLogin = async ({ phone }) => {
    const response = await api.post("/User/login", { phone });
    return response.data;
};

export const verifyOtp = async ({ phone, otp }) => {
    const response = await api.post("/User/verify-otp", { phone, otp });
    return response.data;
};

export const fetchRecommendedBoutiques = async (area = '') => {
    const response = await api.get("/User/Boutiques/recommended", {
        params: { area },
    });
    return response.data.recommendedBoutiques;
};

export const fetchRecommendedDressTypes = async () => {
    const response = await api.get("/User/recommended");
    return response.data.dressTypes; // returns array of { label, imageUrl?, count, relevance }
};

// ✅ CORRECTED: includes /User prefix
export const fetchTopBoutiquesForDressType = async (dressType) => {
    if (!dressType) throw new Error("Dress type is required");

    const url = `/User/recommended/dressType/${encodeURIComponent(dressType)}`;
    console.log("📡 Fetching top boutiques for:", dressType);
    console.log("🌐 API URL:", url);

    try {
        const response = await api.get(url);
        console.log("✅ API Success:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ API Error (fetchTopBoutiquesForDressType):", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
};
