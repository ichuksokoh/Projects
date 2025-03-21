import { useContext } from "react";
import { Options } from "../components/Options"
import { TypingBox } from "../components/TypingBox"
import { ThemeContext } from "../context/ThemeContext";
import { Dashboard } from "../components/Dashboard";




export default function Practice2() {

    const { theme } = useContext(ThemeContext)!;


    return (
        <>
            <div className={` ${theme.value.background} ${theme.value.textColor} p-4 gap-8 w-screen h-screen 
            transition-all duration-[0.25s] ease-linear grid grid-flow-row items-center text-center`}>
                <Dashboard/>
                <TypingBox/>
                <Options/>
            </div>
        </>
    )
}