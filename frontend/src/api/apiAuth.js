import axios from 'axios';

const api = axios.create({
    baseURL : "http://localhost:3000",
});

export const registerUser = async (userData) => {
    try {
        console.log("Sending Data from FrontEnd : " , userData);

        const response = await api.post('/api/auth/register' , userData);

        console.log("response" , response.data);

        return response.data
    } catch (error) {
        console.log(error);
    }
};

export const loginUser = async (userData) => {
    try {
        console.log("Sending Data to backedn : " , userData);

        const response = await api.post('/api/auth/login' , userData);

        console.log("response" , response.data);

        return response.data;
    } catch (error) {
        console.log(error);
    }
};