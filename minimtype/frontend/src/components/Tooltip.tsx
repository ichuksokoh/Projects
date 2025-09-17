import { ReactNode } from "react"


export const TooltipBox  = ({ children, classname = "left-full top-1/2 -translate-y-1/2 ml-2"} : { children : ReactNode, classname? : string}) => {


    return (
        <div className={`absolute flex flex-col z-10 ${classname} w-max max-w-[250px] 
        p-2 rounded bg-gray-700/40 text-white text-xs opacity-0 group-hover:opacity-100 
        transition-opacity duration-200 before:content-[''] before:absolute before:left-[-16px] before:top-1/2 before:-translate-y-1/2
        before:border-8 before:border-transparent before:border-r-gray-700/40 group-focus-within:opacity-100`}>
            { children }
     </div>

    )
}