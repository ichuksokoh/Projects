import { createContext } from "react";
import { AuthContextType } from "../Interfaces";




export const  AuthContext = createContext<AuthContextType | undefined>(undefined);