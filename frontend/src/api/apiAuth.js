import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || "";

const api = axios.create({
    baseURL: API_BASE,
});

export const registerUser = async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await api.post('/api/auth/login', userData);
    return response.data;
};