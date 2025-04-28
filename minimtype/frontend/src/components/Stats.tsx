import React, {  useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Graph } from "./Graph";
import { statsistics } from "../Interfaces";
import { TooltipBox } from "./Tooltip";


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
            <div className={`stats-box flex flex-col items-center md:items-stretch md:flex-row max-w-[1000px] md:max-h-[350px] mx-auto ${theme.value.textColor}`}>
                <div className="left-stats w-[30%] text-2xl sm:text-lg sm:w-[30%] p-7 flex flex-col items-center justify-center relative">
                    <div tabIndex={0} className="group relative flex flex-col items-center">
                        <div>Raw:</div>
                        <div>{Math.round(stats.raw)}</div>
                        <TooltipBox>
                            <span>{stats.raw} wpm</span>
                        </TooltipBox>
                    </div>
                    <div tabIndex={0} className="group relative flex flex-col items-center">
                        <div>WPM:</div>
                        <div>{Math.round(stats.wpm)}</div>
                        <TooltipBox>
                            <span>{stats.wpm} wpm</span>
                        </TooltipBox>
                    </div>
                   <div tabIndex={0} className="group relative flex flex-col items-center">
                    <div>Accuracy:</div>
                    <div>{Math.round(stats.accuracy)}%</div>
                    <TooltipBox>
                            <span>{stats.accuracy}%</span>
                            <span>{stats.correctChars} correct</span>
                            <span>{stats.incorrectChars} incorrect</span>
                    </TooltipBox>
                   </div>
                   <div tabIndex={0} className="group text-center relative flex flex-col items-center">
                   <div>Characters:</div>

                    {stats.testEndCorrectChars}/
                     {stats.testEndIncorrectChars}/ 
                     {stats.missedChars}/ 
                     {stats.extraChars}
                    <TooltipBox>
                        <span>Correct</span>
                        <span>Incorrect</span>
                        <span>Missed</span>
                        <span>Extra</span>
                    </TooltipBox> 
                    </div>

                </div>
                <div className="right-stats w-[100%] sm:w-[70%] h-[200px] sm:h-auto">
                    <Graph graphData={newGraphDaata}/>
                </div>

            </div>
        </div>
    )
}