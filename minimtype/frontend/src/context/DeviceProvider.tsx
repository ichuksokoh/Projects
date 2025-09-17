import { ReactNode } from "react";
import { DeviceContext } from "./DeviceContext";



export const DeviceProvider = ({ children } : {children : ReactNode}) => {
    const isMobile = /Android|iPhone|iPad|Mobi/i.test(navigator.userAgent);

    return (
        <DeviceContext.Provider value={{isMobile}}>
            { children }
        </DeviceContext.Provider>
    )
}