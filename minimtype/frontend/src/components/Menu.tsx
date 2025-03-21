import React, { ReactNode, useContext } from "react"
import { TestContext } from "../context/TestContext"


export const Menu = ({ countDown, restart } : { countDown: ReactNode, restart: () => void}) => {
    
    const { setTime } = useContext(TestContext)!;

    const updateTestTime = (e : React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement
        setTime(Number(target?.id));
     
        restart();
    }
    
    return (
        <div className="flex justify-between max-w-[1000px] mx-auto p-2">
            <div> {/* counter */}
                { countDown }
            </div>
            <div className="flex flex-row gap-x-2 items-center"> {/* modes */}
                <div id="15" onClick={updateTestTime}> 15s</div> {/* time-mode */}
                <div id="30" onClick={updateTestTime}> 30s</div> {/* time-mode */}
                <div id="60" onClick={updateTestTime}> 60s </div> {/* time-mode */}
                <div id="120" onClick={updateTestTime}> 120s </div> {/* time-mode */}

            </div>
        </div>
    )
}