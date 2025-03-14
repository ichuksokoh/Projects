import { useContext } from "react";
import { Options } from "../components/Options"
import { TypingBox } from "../components/TypingBox"
import { ThemeContext } from "../context/ThemeContext";




export default function Practice2() {

    const { theme } = useContext(ThemeContext)!;


    return (
        <>
            <div className={` ${theme.value.background} ${theme.value.textColor} p-4 max-w-screen h-screen 
            transition-all duration-[0.25s] ease-linear grid auto-rows-fr items-center text-center`}>
                <div>Header</div>
                <TypingBox/>
                <Options/>
            
            </div>
        </>
    )
}