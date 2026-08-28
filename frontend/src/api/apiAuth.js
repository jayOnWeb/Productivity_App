import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000",
});

export const registerUser = async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await api.post('/api/auth/login', userData);
    return response.data;
};