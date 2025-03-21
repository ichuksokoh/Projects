import { createContext } from "react";
import { TestTimer } from "../Interfaces";



export const TestContext = createContext<TestTimer | null>(null);


