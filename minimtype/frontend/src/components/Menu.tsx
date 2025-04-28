import React, { ReactNode, useContext, useEffect, useState } from "react"
import { TestContext } from "../context/TestContext"
import { Box, Stack, Slider } from "@mui/material";
import VolumUp from '@mui/icons-material/VolumeUp';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeOff from '@mui/icons-material/VolumeOff'


export const Menu = ({ countDown, restart, volControl, vol } : { countDown: ReactNode, restart: () => void, volControl: (vol: number) => void, vol: number}) => {
    
    const { testTime, setTime } = useContext(TestContext)!;

    const updateTestTime = (e : React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement
        if (Number(target.id )!== testTime) {
            setTime(Number(target?.id));
            restart();
        }
    }
    const handleVolChange =  (_ : Event, newValue: number | number[]) => {
        volControl(newValue as number / 100);
    }

    const VolUp = () => {
        volControl(Math.min(vol + 0.1,1));
    }

    const [isMouseUpDown, setUD] = useState(false);
    const VolDown = () => {
        setUD(true);
        volControl(Math.max(vol - 0.1, 0));
    }

    const VolMoveD = () => {
        while (isMouseUpDown) {
            volControl(Math.max(vol - 0.1, 0));
            console.log(vol);
            return;
        }
    }

    const times = [15, 30, 60, 120];

    return (
        <div className="flex justify-between items-center w-full md:max-w-[1000px] mx-auto p-2 bg-gray-800/50 rounded-lg px-2">
            <div className="w-1/36"> {/* counter */}
                { countDown }
            </div>
            <div>
            <Box sx={{maxWidth: 200, width: {lg: '200px', md: '200px', sm: '100px', xs: '120px'}}}>
                <Stack spacing={2} direction={"row"} sx={{alignItems: 'center', mb: 1}}>
                    {vol !== 0 ? <VolumeDown onClick={VolDown}/> : <VolumeOff/>}
                    <Slider 
                        aria-label="Volume" 
                        value={Math.floor(vol * 100)} 
                        onChange={handleVolChange} 
                        valueLabelDisplay="auto"
                        sx={{maxWidth: '100%', width: {xs: '100%', sm: '100%', md: '60%', lg: '60%'}}}
                    />
                    <VolumUp onClick={VolUp}/>
                </Stack>
            </Box>

            </div>
            <div className="flex flex-row gap-x-2 items-center">
                {
                    times.map((e, i) => {
                        return (
                            <div 
                            className={`transition-colors cursor-pointer  @max-md:text-xs duration-300 select-none ${e === testTime ? 'text-yellow-500' : ''}`} 
                            onClick={updateTestTime} 
                            key={i} 
                            id={String(e)}
                            >{e}s</div>
                        )
                    })
                }
            </div>
        </div>
    )
}