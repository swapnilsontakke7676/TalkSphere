import axios from 'axios';

// Create an Axios instance with the base URL from your environment variables.
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

/*
  This is a 'request interceptor'. It will attach the user's JWT token 
  to the headers of every request if the user is logged in. 
  This is crucial for protected routes.
*/
API.interceptors.request.use((req) => {
    if (localStorage.getItem('userInfo')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`;
    }
    return req;
});


// --- Authentication Endpoints ---
export const registerUser = (formData) => API.post('/api/user/register', formData);
export const loginUser = (formData) => API.post('/api/user/login', formData);


// --- Message Endpoints (NEWLY ADDED) ---

/**
 * Fetches all messages for a specific chat.
 * @param {string} chatId - The ID of the chat.
 * @returns {Promise} Axios promise with the messages.
 */
export const fetchMessages = (chatId) => API.get(`/api/message/${chatId}`);

/**
 * Sends a new message.
 * @param {object} messageData - The message data, containing content and chatId.
 * @returns {Promise} Axios promise with the newly created message.
 */
export const sendMessage = (messageData) => API.post('/api/message', messageData);


// --- Chat Endpoints (You will add these later) ---
// export const fetchChats = () => API.get('/api/chat');
// export const searchUsers = (searchQuery) => API.get(`/api/user?search=${searchQuery}`);


export default API;