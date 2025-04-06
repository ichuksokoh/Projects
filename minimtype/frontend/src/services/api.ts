import axios from "axios";
import { logoutUser } from "./auth";


const HOST = import.meta.env.VITE_HOST || '127.0.0.1';
const API = axios.create({
    baseURL: `http://${HOST}:5000`, //Backend URL
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});

// Add token to requests if logged in
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer: ${token}`;
    }
    return config;
});

API.interceptors.response.use((response) => response, async (error) => {
    if (error.config._retry) {
        await logoutUser();
    }
    if (error.response.status === 401 && !error.config._retry) {
        console.log(error.config._retry);
            console.log('trying again');
            error.config._retry = true;
            try {
                const { data } = await API.post('/auth/refresh_token');
                if (!data || !data.newToken) {
                    console.log("Attempt to stop");
                    return Promise.reject(error);
                }
                localStorage.setItem('token', data.newToken);
                return API(error.config);
            } 
            catch (error) {
                console.error('Refresh Token failed: ', error);
            }
        }

        return Promise.reject(error);
    } 
);

export default API;