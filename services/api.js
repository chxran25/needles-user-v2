import axios from 'axios';

const api = axios.create({
    baseURL: 'https://needles-v1.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const userLogin = async ({ phone }) => {
    const response = await api.post("/User/login", { phone });
    return response.data;
};

export const verifyOtp = async ({ phone, otp }) => {
    const response = await api.post("/User/verify-otp", { phone, otp });
    return response.data;
};
