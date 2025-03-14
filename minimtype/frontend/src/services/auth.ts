import API from "./api";

export const registerUser = async (user_email: string, password: string) => {
    const response = await API.post('/auth/register', {user_email, password});
    return response.data;
};

export const loginUser = async (user_email: string, password: string) => {
    const response = await API.post('/auth/login', {user_email, password});
    if (response.data.token) { 
        localStorage.setItem('token', response.data.token);
    }
    if (response.data.userId) {
        localStorage.setItem('userId', response.data.userId);
    }
    return response.data
}

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
}