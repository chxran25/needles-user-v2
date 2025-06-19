import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { router } from 'expo-router';

import { Boutique, CatalogueItem } from '@/types';
import { Order } from '@/types/order';
import { clearAllTokens } from '@/utils/secureStore';

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

// ✅ Global 401 Handler
let alreadyAlerted = false;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error?.response?.status;

        if (status === 401 && !alreadyAlerted) {
            alreadyAlerted = true;

            Alert.alert(
                "Session Expired",
                "Your login session has expired. Please log in again.",
                [
                    {
                        text: "OK",
                        onPress: async () => {
                            await clearAllTokens();
                            router.replace("/(auth)/login");
                            alreadyAlerted = false;
                        },
                    },
                ],
                { cancelable: false }
            );
        }

        return Promise.reject(error);
    }
);

// ✅ API Methods
export const userLogin = async ({ phone }: { phone: string }) => {
    const response = await api.post("/User/login", { phone });
    return response.data;
};

export const verifyOtp = async ({ phone, otp }: { phone: string; otp: string }) => {
    const response = await api.post("/User/verify-otp", { phone, otp });
    console.log(response);
    return response.data;
};

export const fetchRecommendedBoutiques = async (area = ''): Promise<Boutique[]> => {
    const response = await api.get("/User/Boutiques/recommended", {
        params: { area },
    });
    return response.data.recommendedBoutiques;
};

export const fetchRecommendedDressTypes = async (): Promise<{
    label: string;
    imageUrl?: string;
    count?: number;
    relevance?: number;
}[]> => {
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

    const response = await api.get(`/User/boutique/${id}`);
    return response.data.boutique;
};

export const fetchBoutiqueCatalogue = async (
    boutiqueId: string
): Promise<{ boutiqueName: string; catalogue: CatalogueItem[] }> => {
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

export const fetchNotPaidOrders = async (): Promise<Order[]> => {
    const response = await api.get("/User/order/Pending");
    return response.data.orders.map((o: any) => ({
        id: o.orderId,
        status: "Not Paid",
        boutiqueName: o.boutiqueName,
        imageUrl: o.referralImage,
        dressType: o.dressType ?? "Custom Dress",
        price: o.amount,
        deliveryDate: o.deliveryDate ?? "N/A",
    }));
};

export const fetchActualPendingOrders = async (): Promise<Order[]> => {
    const response = await api.get("/User/order/OrderPending");
    return response.data.orders.map((o: any) => ({
        id: o.orderId,
        status: "Pending",
        boutiqueName: o.boutiqueName,
        imageUrl: o.referralImage,
        dressType: o.dressType ?? "Custom Dress",
        price: o.amount,
        deliveryDate: o.deliveryDate ?? "N/A",
    }));
};

export const fetchPaidOrders = async (): Promise<Order[]> => {
    const response = await api.get("/User/order/Paid");
    return response.data.orders.map((o: any) => ({
        id: o.orderId,
        status: "Paid",
        boutiqueName: o.boutiqueName,
        imageUrl: o.referralImage,
        dressType: o.dressType ?? "Custom Dress",
        price: o.amount,
        deliveryDate: o.deliveryDate ?? "N/A",
    }));
};

export const fetchBillDetails = async (orderId: string): Promise<any> => {
    const response = await api.get(`/User/order/${orderId}/bill`);
    return response.data.bill;
};

export const markBillAsPaid = async (orderId: string): Promise<any> => {
    const response = await api.get(`/User/order/Pending/${orderId}/Bill/Pay`);
    return response.data;
};

export const rejectBill = async (orderId: string): Promise<any> => {
    const response = await api.get(`/User/order/Pending/${orderId}/Bill/Reject`);
    return response.data;
};

export const updateUserLocation = async ({
                                             lat,
                                             lng,
                                             flatNumber,
                                             block,
                                             street,
                                         }: {
    lat: number;
    lng: number;
    flatNumber: string;
    block: string;
    street: string;
}): Promise<any> => {
    const response = await api.put("/User/location", {
        lat,
        lng,
        flatNumber,
        block,
        street,
    });
    return response.data;
};

export const fetchUserProfile = async (): Promise<{
    name: string;
    phone: string;
    address: {
        flatNumber?: string;
        block?: string;
        street?: string;
    };
}> => {
    const response = await api.get("/User/profile");
    return response.data.user;
};

export const updateUserName = async (name: string): Promise<{
    message: string;
    user: {
        name: string;
        phone: string;
    };
}> => {
    const response = await api.put("/User/update-name", { name });
    return response.data;
};

export const logoutUser = async (): Promise<{ message: string }> => {
    const response = await api.post("/User/logout");
    return response.data;
};
