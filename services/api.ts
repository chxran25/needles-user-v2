import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { router } from 'expo-router';

import { Boutique, CatalogueItem } from '@/types';
import { Order } from '@/types/order';
import { clearAllTokens, saveToken } from '@/utils/secureStore';
import { refreshAccessToken } from '@/services/auth';

// ✅ Axios Instance
const api = axios.create({
    baseURL: 'https://needles-v1.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ Attach Bearer Token
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

// ✅ Global 401 Token Refresh Logic
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error?.response?.status;

        if (status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    if (typeof token === "string") {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    } else {
                        return Promise.reject(new Error("Invalid token"));
                    }
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshAccessToken();
                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                await clearAllTokens();
                Alert.alert("Session Expired", "Please login again.", [
                    { text: "OK", onPress: () => router.replace("/(auth)/login") },
                ]);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;

//
// ==========================
// ✅ AUTH METHODS
// ==========================

export const userLogin = async ({ phone }: { phone: string }) => {
    const response = await api.post("/User/login", { phone });
    return response.data;
};

export const verifyOtp = async ({ phone, otp }: { phone: string; otp: string }) => {
    const response = await api.post("/User/verify-otp", { phone, otp });
    const { accessToken, refreshToken } = response.data;

    await saveToken("accessToken", accessToken);
    await saveToken("refreshToken", refreshToken);

    return response.data;
};

export const logoutUser = async (): Promise<{ message: string }> => {
    const response = await api.post("/User/logout");
    return response.data;
};

//
// ==========================
// ✅ USER PROFILE + LOCATION
// ==========================

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
    user: { name: string; phone: string };
}> => {
    const response = await api.put("/User/update-name", { name });
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

//
// ==========================
// ✅ BOUTIQUES + DRESS TYPES
// ==========================

export const fetchRecommendedBoutiques = async (area = ''): Promise<Boutique[]> => {
    const response = await api.get("/User/Boutiques/recommended", { params: { area } });
    return response.data.recommendedBoutiques;
};

export const fetchRecommendedDressTypes = async (): Promise<
    { label: string; imageUrl?: string; count?: number; relevance?: number }[]
> => {
    const response = await api.get("/User/recommended");
    return response.data.dressTypes;
};

export const fetchTopBoutiquesForDressType = async (dressType: string): Promise<any> => {
    if (!dressType) throw new Error("Dress type is required");

    const url = `/User/recommended/dressType/${encodeURIComponent(dressType)}`;
    console.log("📡 Fetching top boutiques for:", dressType);
    const response = await api.get(url);
    return response.data;
};

export const fetchSearchResults = async (query: string): Promise<Boutique[]> => {
    if (!query) throw new Error("Search query is required");
    const response = await api.get("/User/search", { params: { query } });
    return response.data;
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

//
// ==========================
// ✅ ORDERS + BILLING
// ==========================

export const placeOrder = async (formData: FormData): Promise<any> => {
    const response = await api.post("/User/order/place", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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

export const fetchCompletedOrders = async (): Promise<Order[]> => {
    const response = await api.get("/User/order/Completed");
    return response.data.orders.map((o: any) => ({
        id: o._id ?? o.orderId,
        boutiqueId: o.boutiqueId?._id ?? o.boutiqueId,
        status: "Completed",
        boutiqueName: o.boutiqueId?.name ?? "Boutique",
        imageUrl: o.referralImage ?? "",
        dressType: o.dressType ?? "Custom Dress",
        price: o.bill?.totalAmount ?? 0,
        deliveryDate: new Date(o.createdAt).toLocaleDateString(),
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

//
// ==========================
// ✅ RATINGS
// ==========================

export const submitOrderRating = async ({
                                            boutiqueId,
                                            rating,
                                            comment,
                                            orderId,
                                        }: {
    boutiqueId: string;
    rating: number;
    comment?: string;
    orderId: string;
}): Promise<any> => {
    const response = await api.post("/User/rate-order", {
        boutiqueId,
        rating,
        comment,
        orderId,
    });
    return response.data;
};
