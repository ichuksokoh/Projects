import {  useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Graph } from "./Graph";
import { statsistics } from "../Interfaces";


export const Stats = ({ stats } : { stats : statsistics}) => {

    const { theme } = useContext(ThemeContext);
    let timeSet = new Set();
    const newGraphDaata = stats.graphData.filter((e,i) => {
        if (!timeSet.has(e[0])) {
            timeSet.add(e[0]);
            return true;
            if (stats.graphData.length <= 30 || (i % 3 === 1 && stats.graphData.length >= 60) ) {
                return true;
            }
        }
        return false;
    });

    return (
        <div>
            <div className={`stats-box flex max-w-[1000px] max-h-[350px] mx-auto ${theme.value.textColor}`}>
                <div className="left-stats w-[30%] p-7 flex flex-col justify-center text-xl">
                    <div>Raw:</div>
                      <div>{stats.raw}</div>
                   <div>WPM:</div>
                   <div>{stats.wpm}</div>
                   <div>Accuracy:</div>
                   <div>{stats.accuracy}%</div>
                   <div>Characters:</div>
                   <div>{stats.correctChars} / {stats.incorrectChars} / {stats.missedChars} / {stats.extraChars} </div>

                </div>
                <div className="right-stats w-[70%]">
                    <Graph graphData={stats.graphData}/>
                </div>

            </div>
        </div>
    )
}