import { TestContext } from "./TestContext";
import { useState, ReactNode } from "react";

export const TestProvider = ({ children } : { children: ReactNode}) => {
    const [testTime, setTime] = useState(30);

    const values = {
        testTime,
        setTime
    }

    return (
        <TestContext.Provider value={values}>
            {children}
        </TestContext.Provider>
    )
}

