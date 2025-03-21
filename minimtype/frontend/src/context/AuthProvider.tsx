import { ReactNode, useState } from "react";
import { logoutUser, loginUser, registerUser } from "../services/auth";
import { AuthContext } from "./AuthContext";


interface user {
    userId: string;
    userEmail: string;
    userSince: Date;
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<user>(JSON.parse(localStorage.getItem('user') || "{}"));

    const register = (user_email: string, password: string) => {
        return registerUser(user_email, password);
    }

    const login = (user_email: string, password: string) => {
        const response = loginUser(user_email, password);
        response.then(res => setUser(res?.user || JSON.parse("{}")));
        return response;
    }

    const logout = () => {
        logoutUser();
        setUser(JSON.parse("{}"));
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}