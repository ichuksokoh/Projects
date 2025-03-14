import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:5000', //Backend URL
    headers: {'Content-Type': 'application/json'}
});

// Add token to requests if logged in
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer: ${token}`;
    }
    return config;
});

export default API;