import { createContext } from "react";
import { DeviceTypeContext } from "../Interfaces";


export const DeviceContext = createContext<DeviceTypeContext | undefined>(undefined);