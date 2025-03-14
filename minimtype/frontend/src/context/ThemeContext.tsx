import { createContext } from "react";
import { themeOptions, ThemeValues } from "../utils/themeOptions";


interface ThemeContext {
    theme: ThemeValues;
    setTheme: (theme: ThemeValues) => void;
};


const defaultValue = localStorage.getItem('theme') ? JSON.parse(localStorage.getItem('theme')!) : themeOptions[0];
export const ThemeContext = createContext<ThemeContext>(defaultValue);