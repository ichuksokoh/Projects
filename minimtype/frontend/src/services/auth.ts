import API from "./api";

export const registerUser = async (user_email: string, password: string) => {
    const response = await API.post('/auth/register', {user_email, password});
    return response.data;
};

export const logoutUser = async () => {
    const response = await API.delete('/auth/refresh_token');
    if (response?.data.logged_out) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    else {
        throw new Error("Logout failed");
    }

};
export const loginUser = async (user_email: string, password: string) => {
    const response = await API.post('/auth/login', {user_email, password});
    if (response.data.token) { 
        localStorage.setItem('token', response.data.token);
    }
    if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};