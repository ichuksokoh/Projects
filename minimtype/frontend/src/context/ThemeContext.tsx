import { createContext } from "react";
import { themeOptions } from "../utils/themeOptions";
import { Theme } from "../Interfaces";



const defaultValue = localStorage.getItem('theme') ? JSON.parse(localStorage.getItem('theme')!) : themeOptions[0];
export const ThemeContext = createContext<Theme>(defaultValue);