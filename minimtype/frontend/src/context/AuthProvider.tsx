import { ReactNode, useState } from "react";
import { logoutUser, loginUser, registerUser } from "../services/auth";
import { AuthContext } from "./AuthContext";


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

    const register = (user_email: string, password: string) => {
        return registerUser(user_email, password);
    }

    const login = (user_email: string, password: string) => {
        return loginUser(user_email, password);
    }

    const logout = () => {
        logoutUser();
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ userId, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}