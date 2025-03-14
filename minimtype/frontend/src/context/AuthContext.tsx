import { createContext } from "react";

interface AuthContextType {
    userId: string | null;
    register: (user_email: string, password: string) => Promise<boolean>;
    login: (user_email: string, password: string) => Promise<void>;
    logout: () => void;
}



export const  AuthContext = createContext<AuthContextType | undefined>(undefined);