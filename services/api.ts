import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ✅ Setup Axios instance
const api = axios.create({
    baseURL: 'https://needles-v1.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ Attach Bearer Token from SecureStore
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

// ✅ Type Definitions
export type Boutique = {
    _id: string;
    name: string;
    area: string;
    averageRating: number;
    headerImage?: string[] | string;
    gallery?: string[];
    dressTypes?: { type: string }[];
};

export type CatalogueItem = {
    itemName: string;
    price: number;
};

// ✅ API Methods
export const userLogin = async ({ phone }: { phone: string }) => {
    const response = await api.post("/User/login", { phone });
    return response.data;
};

export const verifyOtp = async ({ phone, otp }: { phone: string; otp: string }) => {
    const response = await api.post("/User/verify-otp", { phone, otp });
    return response.data;
};

export const fetchRecommendedBoutiques = async (area = ''): Promise<Boutique[]> => {
    const response = await api.get("/User/Boutiques/recommended", {
        params: { area },
    });
    return response.data.recommendedBoutiques;
};

export const fetchRecommendedDressTypes = async (): Promise<{ label: string; imageUrl?: string; count: number; relevance: number }[]> => {
    const response = await api.get("/User/recommended");
    return response.data.dressTypes;
};

export const fetchTopBoutiquesForDressType = async (dressType: string): Promise<any> => {
    if (!dressType) throw new Error("Dress type is required");

    const url = `/User/recommended/dressType/${encodeURIComponent(dressType)}`;
    console.log("📡 Fetching top boutiques for:", dressType);
    console.log("🌐 API URL:", url);

    try {
        const response = await api.get(url);
        console.log("✅ API Success:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ API Error (fetchTopBoutiquesForDressType):", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
};

export const fetchSearchResults = async (query: string): Promise<Boutique[]> => {
    if (!query) throw new Error("Search query is required");

    try {
        const response = await api.get("/User/search", {
            params: { query },
        });
        console.log("🔍 Search Results:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ API Error (fetchSearchResults):", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
};

export const fetchBoutiqueDetails = async (id: string): Promise<Boutique> => {
    if (!id) throw new Error("Boutique ID is required");

    try {
        const response = await api.get(`/User/boutique/${id}`);
        return response.data.boutique;
    } catch (error) {
        console.error("❌ API Error (fetchBoutiqueDetails):", error);
        throw error;
    }
};

export const fetchBoutiqueCatalogue = async (boutiqueId: string): Promise<{ boutiqueName: string; catalogue: CatalogueItem[] }> => {
    const response = await api.get(`/User/${boutiqueId}/catalogue`);
    return response.data;
};

export const placeOrder = async (formData: FormData): Promise<any> => {
    const response = await api.post('/User/order/place', formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

