import { ReactNode, useState } from "react";
import { logoutUser, loginUser, registerUser } from "../services/auth";
import { AuthContext } from "./AuthContext";


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState<string>(localStorage.getItem('userId') || "");
    const [userEmail, setUserEmail] = useState<string>(localStorage.getItem('userEmail') || "");

    const register = (user_email: string, password: string) => {
        return registerUser(user_email, password);
    }

    const login = (user_email: string, password: string) => {
        return loginUser(user_email, password);
    }

    const logout = () => {
        logoutUser();
        setUserId("");
        setUserEmail("");
    };

    return (
        <AuthContext.Provider value={{ userId, register, login, logout, userEmail }}>
            {children}
        </AuthContext.Provider>
    )
}