import { ReactNode, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { themeOptions } from "../utils/themeOptions";




export const ThemeProvider = ({ children } : { children: ReactNode }) => {
    const savedTheme = localStorage.getItem('theme') ? JSON.parse(localStorage.getItem('theme')!) : themeOptions[0];
    const [theme, setTheme] = useState(savedTheme);

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}