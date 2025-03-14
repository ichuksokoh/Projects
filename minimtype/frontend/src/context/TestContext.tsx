import { createContext } from "react";


interface TestType {
    testTime: number;
    setTime: (newtime: number) => void;
};

export const TestContext = createContext<TestType | null>(null);


