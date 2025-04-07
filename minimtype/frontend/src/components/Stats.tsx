import React, {  useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Graph } from "./Graph";
import { statsistics } from "../Interfaces";


export const Stats = ({ stats, handleRestart=()=>{return;} } : { stats : statsistics, handleRestart?: (e: React.KeyboardEvent) => void}) => {

    const { theme } = useContext(ThemeContext);
    let timeSet = new Set();
    const newGraphDaata = stats.graphData.filter((e,i) => {
        if (!timeSet.has(e[0])) {
            timeSet.add(e[0]);
            return true;
        }
        return false;
    });

    return (
        <div onKeyDown={handleRestart}>
            <div className={`stats-box items-center flex-col md:flex-row flex max-w-[1000px] md:max-h-[350px] mx-auto ${theme.value.textColor}`}>
                <div className="left-stats w-[30%] text-2xl sm:text-lg sm:w-[30%] p-7 flex flex-col items-center justify-center">
                    <div>Raw:</div>
                    <div>{stats.raw}</div>
                   <div>WPM:</div>
                   <div>{stats.wpm}</div>
                   <div>Accuracy:</div>
                   <div>{stats.accuracy}%</div>
                   <div>Characters:</div>
                   <div className="">

                    {stats.correctChars}/
                     {stats.incorrectChars}/ 
                     {stats.missedChars}/ 
                     {stats.extraChars} 
                    </div>

                </div>
                <div className="right-stats w-[60%] sm:w-[70%]">
                    <Graph graphData={newGraphDaata}/>
                </div>

            </div>
        </div>
    )
}