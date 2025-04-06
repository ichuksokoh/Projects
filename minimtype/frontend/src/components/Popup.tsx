import { ReactNode } from "react"



export const Popup = ({ children, onClose, classname = ""} : {children: ReactNode, onClose: () => void, classname?: string}) => {



    return (
        <div onClick={() => onClose()}
            className="flex absolute w-screen h-screen backdrop-blur-md z-50 items-center justify-center"
        >
            <div onClick={(e) => e.stopPropagation()} className={`w-full lg:w-2/3 ${classname}`}>
                { children }
            </div>
        </div>
    )
}