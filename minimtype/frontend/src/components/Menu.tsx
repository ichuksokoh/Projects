import React, { ReactNode, useContext, useEffect } from "react"
import { TestContext } from "../context/TestContext"
import { Box, Stack, Slider } from "@mui/material";
import VolumUp from '@mui/icons-material/VolumeUp';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeOff from '@mui/icons-material/VolumeOff'


export const Menu = ({ countDown, restart, volControl, vol } : { countDown: ReactNode, restart: () => void, volControl: (vol: number) => void, vol: number}) => {
    
    const { setTime } = useContext(TestContext)!;

    const updateTestTime = (e : React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement
        setTime(Number(target?.id));
        restart();
    }
    const handleVolChange =  (_ : Event, newValue: number | number[]) => {
        volControl(newValue as number / 100);
    }

    const VolUp = () => {
        volControl(Math.min(vol + 0.1,1));
    }
    const VolDown = () => {
        volControl(Math.max(vol - 0.1, 0));
    }

    return (
        <div className="flex justify-between max-w-[1000px] mx-auto p-2">
            <div> {/* counter */}
                { countDown }
            </div>
            <div>
            <Box sx={{width: 200}}>
                <Stack spacing={2} direction={"row"} sx={{alignItems: 'center', mb: 1}}>
                    {vol !== 0 ? <VolumeDown onClick={VolDown}/> : <VolumeOff/>}
                    <Slider aria-label="Volume" value={Math.floor(vol * 100)} onChange={handleVolChange} valueLabelDisplay="auto" />
                    <VolumUp onClick={VolUp}/>
                </Stack>
            </Box>

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