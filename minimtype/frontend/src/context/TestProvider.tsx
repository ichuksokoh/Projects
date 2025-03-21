import { TestContext } from "./TestContext";
import { useState, ReactNode } from "react";

export const TestProvider = ({ children } : { children: ReactNode}) => {
    const defaultTime = localStorage.getItem('defaulttime');
    const [testTime, setTime] = useState(Number(defaultTime) || 30);

    const values = {
        testTime,
        setTime: (newTime: number) => 
            {localStorage.setItem('defaulttime', String(newTime)); setTime(_ => newTime);}
    }

    return (
        <TestContext.Provider value={values}>
            {children}
        </TestContext.Provider>
    )
}

