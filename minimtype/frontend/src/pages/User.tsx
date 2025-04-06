import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import useAPI from '../hooks/useAPI';
import { UserInfo } from '../components/UserInfo';
import { Graph } from '../components/Graph';
import { statsistics, TestSaved } from '../Interfaces';
import { Stats } from '../components/Stats';
import Arrowback from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Popup } from '../components/Popup';
import { deleteUser } from '../services/users';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';



export const UserPage = () => {


    const { theme } = useContext(ThemeContext)!;
    const { user, logout } = useContext(AuthContext)!;
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [currTest, setTest] = useState<statsistics | null>(null);
    const [testIndex, setIndex] = useState(0);
    const [arrColFor, setArrColFor] = useState(theme.value.textColor);
    const [arrColBac, setArrColBac] = useState(theme.value.textColor);
    const [deletion, setDelete] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage,setRows] = useState(5);
    const navigate = useNavigate();


    const { data, error, mutate, loading } = useAPI(`/tests/${user.userId}`);



    const visibleData = useMemo(() => {
        return data ? [...data].slice(page*rowsPerPage, page * rowsPerPage + rowsPerPage) : [];
    }, [rowsPerPage, page, data]);

    useEffect(() => {
        if (!loading) {
            mutate();
        }
    }, [loading, data])

    useEffect(() => {
        if (data && data.length !== 0) {
            const test = translateTestData(data[testIndex])
            setTest(test);
            if (testIndex === 0) {
                setArrColBac('text-gray-500');
            }
            else {
                setArrColBac(theme.value.textColor)
            }
            if (testIndex === data.length - 1) {
                setArrColFor('text-gray-500');
            }
            else {
                setArrColFor(theme.value.textColor);
            }
        }
    }, [testIndex, data])

    
    const tests = data && !loading ? data.length : 0;

    const WPM_graph_data = !data && loading ? [[]] :
        data.map((e : TestSaved )=> {
            const date = new Date(e.date);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const year = date.getFullYear();
            return [`${day}/${month}/${year}`, e.wpm, e.raw_wpm]
        });

    
    

    if (loading && true) {
        return (
            <CircularProgress size={300} sx={{color: "white"}} />
        );
    }

    const handleDeleteUser = () => {
        if (deletion === 'Confirm') {
            const response = deleteUser(user.userId);
            if (response !== null) {
                if (localStorage.getItem('token')) {
                    localStorage.removeItem('token');
                }
                if (localStorage.getItem('user')) {
                    localStorage.removeItem('user');
                }
                navigate('/practice2');
            }
        }
    }

    const handlePageChange = ( _ : React.MouseEvent<HTMLButtonElement, MouseEvent> | null , newPage: number | number[]) => {
        setPage(newPage as number);
    }

    const handleRows = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRows(parseInt(e.target.value, 10));
        setPage(0);
    }

    function translateTestData (test: TestSaved) : statsistics {
        const updatedTest : statsistics= {wpm: test.wpm, raw: test.raw_wpm,
            accuracy: test.accuracy, correctChars: test.characters.correct_chars as number,
            incorrectChars: test.characters.incorrect_chars as number,
            missedChars: test.characters.missed_chars as number,
            extraChars: test.characters.extra_chars as number,
            graphData: test.graph_data
        }
        return updatedTest;
    }   

    const handleModalClose = () => setOpen(false);
    const handleModalClose2 = () => setOpen2(false);
    const handleModalClose3 = () => setOpen3(false);

    const handleModalOpen = (e: React.MouseEvent<HTMLTableRowElement>) => {
        const index : number = Number(e.currentTarget.dataset.key) + page*rowsPerPage;
        const testData : TestSaved = data[index];
        setIndex(index);
        const test = translateTestData(testData);
        setTest(test);
        setOpen(true);
    }

    const nextTest = () => setIndex(prev => Math.min(prev + 1, data.length - 1))
    const prevTest = () => setIndex(prev => Math.max(prev - 1, 0));

    return (
        <div className={`${theme.value.background} ${theme.value.textColor} flex flex-col h-screen w-screen justify-center items-center overflow-y-scroll`}>
         
            {open && <Popup onClose={handleModalClose}>
                <div className='flex flex-row justify-between items-center'>
                    <div>
                        <Arrowback className={`${arrColBac}`} onClick={prevTest}/>
                    </div>
                    <div className="border-2 border-white/50 rounded-lg w-7/7 sm:w-5/7 p-4">
                        <Stats stats={currTest!}/>
                    </div>
                    <div>
                        <ArrowForward className={`${arrColFor}`} onClick={nextTest}/>
                    </div>
                </div>
            </Popup>}
            {open2 && <Popup onClose={handleModalClose2} classname='flex justify-center items-center'>
                <div className='bg-gray-700/40 flex flex-col justify-center w-1/2 sm:w-1/2 items-center gap-y-4 lg:w-2/5 p-2 rounded-lg'>
                           <span>Are You sure?</span> 
                        <div className='flex flex-row gap-x-3 justify-center'>
                            <span className='text-xs lg:text-sm'>Type 'Confirm'</span>
                            <input 
                                className='bg-white/30 rounded-md h-6 w-full lg:w-32 p-1'
                                value={deletion}
                                onChange={(e) => setDelete(e.target.value)}
                            ></input>
                        </div>
                        <button 
                            className='bg-red-700/80 rounded-md p-2 duration-200 active:scale-90'
                            onClick={handleDeleteUser}
                        >
                            Submit
                        </button>
                    </div>
                </Popup>}
                {open3 && <Popup onClose={handleModalClose3} classname='flex justify-center items-center'>
                    <div className='flex flex-col items-center gap-y-4 w-3/4 sm:w-1/2   lg:w-2/5 h-full bg-gray-700/40 p-4 rounded-lg'>
                        <div className='flex flex-row gap-x-3'>
                            <span className='lg:text-sm text-xs'>Old Password:</span>
                            <input type='password' className='lg:w-40 w-full min-h-8 rounded-md px-2 bg-white/30'/>
                        </div>
                        <div className='flex flex-row gap-x-2'>
                            <span className='lg:text-sm text-xs'>New Password:</span>
                            <input type='password' className='lg:w-40 w-full min-h-8 rounded-md px-2 bg-white/30'/>
                        </div>
                        <button
                            className='bg-blue-600/30 p-2 font-bold rounded-lg active:scale-95 transition-all'
                        >
                            Confirm
                        </button>
                    </div>
                    </Popup>}
            <div className='w-full h-full flex flex-col items-center py-12'>
                <div className='w-3/4 flex justify-between mb-8'>
                    <Arrowback className='transition-all active:scale-90'  onClick={() => navigate('/practice2')}/>
                    <LogoutIcon className='transition-all active:scale-90' onClick={() => {navigate('/practice2'); logout();}}/>
                </div>
                <div className='w-3/4 mb-10 md:w-1/2'>
                    <UserInfo tests ={tests}/>
                </div>
                <div className='w-10/12 lg:w-2/3 h-full min-h-[200px] flex items-center'>
                    <Graph graphData={ WPM_graph_data}/>
                </div>
                <TableContainer style={{minHeight: '75vh', width: '60%'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{color: `${theme.value.typeBoxText}`
                                , textAlign: "center"}}>
                                    TIme
                                </TableCell>
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
                                visibleData.map((e : TestSaved, i: number) => {
                                    let chars = `${e.characters.correct_chars}/${e.characters.incorrect_chars}`;
                                    chars += `/${e.characters.missed_chars}/${e.characters.extra_chars}`;
                                    const date = new Date(e.date);
                                    const time = date.toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
                                    return (
                                        <TableRow key={i} onClick={handleModalOpen} data-key={i}>
                                            <TableCell style={{color: `${theme.value.typeBoxText}`, 
                                            textAlign: 'center'}}>{e.graph_data.length}s</TableCell>
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
                    <TablePagination
                        component='div'
                        rowsPerPageOptions={[5, 10, 15]}
                        count={data ? data.length : 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRows}
                        sx={{color: 'white'}}
                    />
                </TableContainer>
                <div className='min-h-24 flex flex-col gap-y-4'>
                    <button className='rounded-md p-2 bg-sky-600/50 min-w-32 min-h-8 font-bold hover:bg-sky-700/50
                        ease-in-out duration-200 active:scale-95 '
                        onClick={() => setOpen3(true)}>
                        Reset Password
                    </button>
                    <button className='rounded-md bg-gray-500/50 p-2 min-w-32 min-h-10 font-bold
                     hover:bg-gray-700/50 ease-in-out duration-200 active:scale-95'
                     onClick={() => setOpen2(true)}
                     >
                        Delete Account
                    </button>           
                </div>
           </div>
        </div>
    );
}