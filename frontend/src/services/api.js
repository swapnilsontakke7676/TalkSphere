import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

// This is for sending the token back to the server on protected routes
API.interceptors.request.use((req) => {
    if (localStorage.getItem('userInfo')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`;
    }
    return req;
});

export const registerUser = (formData) => API.post('/api/user/register', formData);
export const loginUser = (formData) => API.post('/api/user/login', formData);