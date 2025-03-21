import { createContext } from "react";
import { AuthContextType } from "../Interfaces";

// interface AuthContextType {
//     user: {
//         userId: string;
//         userEmail: string;
//         userSince: Date;
//     };
//     register: (user_email: string, password: string) => Promise<boolean>;
//     login: (user_email: string, password: string) => Promise<void>;
//     logout: () => void;
// }



export const  AuthContext = createContext<AuthContextType | undefined>(undefined);