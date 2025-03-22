import { useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import useAPI from '../hooks/useAPI';
import { UserInfo } from '../components/UserInfo';
import { Graph } from '../components/Graph';
import { TestSaved } from '../Interfaces';



export const UserPage = () => {


    const { theme } = useContext(ThemeContext)!;
    const { user } = useContext(AuthContext)!;



    const { data, error, mutate, loading } = useAPI(`/tests/${user.userId}`);

    useEffect(() => {
        console.log(loading);
        if (!loading) {
            console.log(data);
        }
    }, [loading, data])

    
    const tests = data && !loading ? data.length : 0;

    const WPM_graph_data = loading ? [[]] :
        data.map((e : TestSaved )=> {
            const date = new Date(e.date);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const year = date.getFullYear();
            return [`${day}/${month}/${year}`, e.wpm, e.raw_wpm]
        });

    console.log(WPM_graph_data);
    

    if (loading && true) {
        return (
            <CircularProgress size={300} sx={{color: "white"}} />
        );
    }


    return (
        <div className={`${theme.value.background} ${theme.value.textColor} flex flex-col h-screen w-screen justify-center items-center overflow-scroll`}>
            <div className='w-[100vh] h-[600px] flex flex-col items-center'>
                <div className='w-[120vh] h-[1000px]'>
                    <UserInfo tests ={tests}/>
                </div>
                <div className='w-[130vh] h-[130vh]'>
                    <Graph graphData={ WPM_graph_data}/>
                </div>
                <TableContainer style={{minHeight: '800px', minWidth: '900px'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{color: `${theme.value.typeBoxText}`
                                , textAlign: "center"}}> WPM </TableCell>
                                <TableCell style={{color: `${theme.value.typeBoxText}`
                                , textAlign: "center"}}> RAW </TableCell>
                                <TableCell style={{color: `${theme.value.typeBoxText}`
                                , textAlign: "center"}}> Accuracy </TableCell>
                                <TableCell style={{color: `${theme.value.typeBoxText}`
                                , textAlign: "center"}}> <div className='flex flex-col'><span>Characters</span><span>(Correct/Incorrect/Missed/Extra)</span></div> </TableCell>
                                <TableCell style={{color: `${theme.value.typeBoxText}`
                                , textAlign: "center"}}> Date </TableCell> 
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.map((e : TestSaved, i: number) => {
                                    let chars = `${e.characters.correct_chars}/${e.characters.incorrect_chars}`;
                                    chars += `/${e.characters.missed_chars}/${e.characters.extra_chars}`;
                                    const date = new Date(e.date);
                                    const time = date.toLocaleString();
                                    return (
                                        <TableRow key={i}>
                                            <TableCell style={{color: `${theme.value.typeBoxText}`, 
                                            textAlign: 'center'}}>{e.wpm}</TableCell>
                                            <TableCell style={{color: `${theme.value.typeBoxText}`, 
                                                textAlign: "center"}}>{e.raw_wpm}</TableCell>
                                            <TableCell style={{color: `${theme.value.typeBoxText}`,
                                                textAlign: "center"}}>{e.accuracy}</TableCell>
                                            <TableCell style={{color: `${theme.value.typeBoxText}`,
                                                textAlign: "center"}}>{chars}</TableCell>
                                            <TableCell style={{color: `${theme.value.typeBoxText}`,
                                                textAlign: "center"}}>{time}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className='min-h-24'>
                    <button className='rounded-md bg-gray-500 p-2 min-w-32 min-h-10 font-bold
                     hover:bg-gray-700 ease-in-ou duration-200 active:scale-95'>
                        Delete Account
                    </button>           
                </div>
           </div>
        </div>
    );
}