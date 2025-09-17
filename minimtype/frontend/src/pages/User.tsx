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
import { deleteUser, getUserPw } from '../services/users';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import bcrypt from 'bcryptjs';
import PasswordValidator from 'password-validator';
import { resetPassword } from '../services/resetPassword';
import { Dropdown } from 'primereact/dropdown';
import ArrowDown from '@mui/icons-material/ArrowDownward';
import ArrowUp from '@mui/icons-material/ArrowUpward';


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
    const [oldPw, setOldPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage,setRows] = useState(5);
    const navigate = useNavigate();


    const pwSchema = new PasswordValidator();
    pwSchema
        .is().min(6, 'At least 6 characters please')
        .is().max(100, 'Only 100 characters allowed')
        .has().uppercase(1, 'At least 1 Capital letter')
        .has().lowercase(1, 'At least 1 Lower Case letter')
        .has().digits(1, 'At least 1 number')
        .has().not().spaces(0, 'No spaces allowed')
        .has().symbols(1, 'At least 1 symbol');

    const { data, error, mutate, loading } = useAPI(`/tests/${user.userId}`);

    const testTypes2 = ['All', 'Mobile', 'PC'];
    const [testType2, setTestType2] = useState(testTypes2[0]);
    const [WPM_graph_data, set_graph_data] = useState(!data && loading ? [[]] :
        data.map((e : TestSaved )=> {
            const date = new Date(e.date);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const year = date.getFullYear();
            return [`${day}/${month}/${year}`, e.wpm, e.raw_wpm]
        }).reverse());


    const usedData = useMemo(() => {
        return data ? data.filter((e: TestSaved) => {
            return (testType2 === 'Mobile' && e.mobile) ||
                    ((testType2 === 'All' && true) || (testType2 === 'PC' && !e.mobile))
        }) : [];
    }, [data, testType2]);

    const visibleData = useMemo(() => {
        return usedData ? [...usedData].slice(page*rowsPerPage, page * rowsPerPage + rowsPerPage) : [];
    }, [rowsPerPage, page, data, testType2]);
    

    useEffect(() => {
        if (!loading) {
            mutate();
        }
        if (data && !loading) {
            set_graph_data(data.map((e : TestSaved )=> {
                const date = new Date(e.date);
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const year = date.getFullYear();
                return [`${day}/${month}/${year}`, e.wpm, e.raw_wpm]
            }).reverse());
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

  

    useEffect(() => {
        if (testType2 === 'Mobile' && data && !loading) {
            set_graph_data(data.filter((e: TestSaved) => e.mobile).map((e : TestSaved) => {
                const date = new Date(e.date);
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const year = date.getFullYear();
                return [`${day}/${month}/${year}`, e.wpm, e.raw_wpm]
            }).reverse());
        }
        if (testType2 === 'PC' && data && !loading) {
            set_graph_data(!data && loading ? [[]]: data.filter((e: TestSaved) => !e.mobile).map((e : TestSaved) => {
                const date = new Date(e.date);
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const year = date.getFullYear();
                return [`${day}/${month}/${year}`, e.wpm, e.raw_wpm]
            }).reverse());
        }
        if (testType2 == 'All' && data && !loading) {
            set_graph_data(!data && loading ? [[]]: data.map((e : TestSaved) => {
                const date = new Date(e.date);
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const year = date.getFullYear();
                return [`${day}/${month}/${year}`, e.wpm, e.raw_wpm]
            }).reverse());
        }
    }, [testType2, data, loading]);


    

    if (loading) {
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

    const handleResetPassword = async () => {
        const fetched_pw = await getUserPw(user.userId);
        if (await bcrypt.compare(oldPw, fetched_pw.pw)) {
            if (newPw === confirmPw && pwSchema.validate(newPw)) {
                console.log(newPw);
                resetPassword(user.userId, newPw);
                setOpen3(false);
            }
            else {
                console.log('try again');
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
            testEndCorrectChars: test.characters.test_end_correct_chars as number,
            testEndIncorrectChars: test.characters.test_end_incorrect_chars as number,
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
                        <Arrowback className={`active:scale-90 duration-300 ease-in ${arrColBac} cursor-pointer`} onClick={prevTest}/>
                    </div>
                    <div className="border-2 border-white/50 rounded-lg w-7/7 sm:w-5/7 p-4">
                        <Stats stats={currTest!}/>
                    </div>
                    <div>
                        <ArrowForward className={`active:scale-90 duration-300 ease-in-out ${arrColFor} cursor-pointer`} onClick={nextTest}/>
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
                        <div className='flex flex-row gap-x-3 items-center'>
                            <span className='lg:w-24 lg:text-sm text-xs'>Old Password:</span>
                            <input 
                                value={oldPw} 
                                onChange={(e) => setOldPw(e.target.value)} 
                                type='password' 
                                className='lg:w-40 w-full min-h-8 rounded-md px-2 bg-white/30'
                            />
                        </div>
                        <div className='flex flex-row gap-x-2 items-center'>
                            <span className='lg:w-24 lg:text-sm text-xs'>New Password:</span>
                            <input 
                                value={newPw}
                                onChange={(e) => setNewPw(e.target.value)}
                                type='password' 
                                className='lg:w-40 w-full min-h-8 rounded-md px-2 bg-white/30'
                            />
                        </div>
                        <div className='flex flex-row gap-x-2 items-center'>
                            <span className='lg:w-24 lg:text-sm text-xs'>Confirm New Password:</span>
                            <input 
                                value={confirmPw}
                                onChange={(e) => setConfirmPw(e.target.value)}
                                type='password' 
                                className='lg:w-40 w-full min-h-8 rounded-md px-2 bg-white/30'
                            />
                        </div>
                        <button
                            onClick={handleResetPassword}
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
                <div className=''>
                    <Dropdown value={testType2} onChange={(e) => setTestType2(e.value)} options={testTypes2} placeholder='Select a Test Type' className='sm:w-[125px] text-center w-full bg-gray-300/40 text-white rounded-lg p-2'
                            panelClassName='bg-white/60 rounded-lg' pt={{item: (options) => ({ className: !options!.context.selected ? 'hover:bg-stone-100 p-2 rounded-md' : 'bg-stone-100 p-2 rounded-md'})}}/>
                    
                </div>
                <div className='w-10/12 lg:w-2/3 h-full min-h-[200px] flex items-center'>
                    <Graph graphData={ WPM_graph_data}/>
                </div>
                <TableContainer style={{minHeight: '75vh'}} sx={{width: {lg: '70%', xs: '90%'}}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{color: `${theme.value.typeBoxText}`
                                , textAlign: "center"}}>
                                    TIme
                                </TableCell>
                                <TableCell style={{color: `${theme.value.typeBoxText}`
                                , textAlign: "center", flex: 'flex', flexDirection: 'column'}}>
                                    <ArrowUp sx={{scale: 0.7, color: 'b'}} className='active:border-black!'/>
                                     WPM 
                                </TableCell>
                                <TableCell style={{color: `${theme.value.typeBoxText}`
                                , textAlign: "center"}}> RAW </TableCell>
                                <TableCell style={{color: `${theme.value.typeBoxText}`
                                , textAlign: "center"}}> Accuracy </TableCell>
                                <TableCell style={{color: `${theme.value.typeBoxText}`
                                , textAlign: "center"}}> 
                                    <div className='flex flex-col'><span>Characters</span><span className='text-[10px] sm:text-sm'>(Correct/Incorrect/Missed/Extra)</span></div> 
                                </TableCell>
                                <TableCell style={{color: `${theme.value.typeBoxText}`
                                , textAlign: "center"}}> Date </TableCell> 
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                visibleData.map((e : TestSaved, i: number) => {
                                    let chars = `${e.characters.test_end_correct_chars}/${e.characters.test_end_incorrect_chars}`;
                                    chars += `/${e.characters.missed_chars}/${e.characters.extra_chars}`;
                                    const date = new Date(e.date);
                                    const time = date.toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
                                    return (
                                        <TableRow className='cursor-pointer' key={i} onClick={handleModalOpen} data-key={i}>
                                            <TableCell style={{color: `${theme.value.typeBoxText}`, 
                                            textAlign: 'center'}}>{e.graph_data.length}s</TableCell>
                                            <TableCell style={{color: `${theme.value.typeBoxText}`, 
                                            textAlign: 'center'}}>{Math.round(e.wpm)}</TableCell>
                                            <TableCell style={{color: `${theme.value.typeBoxText}`, 
                                                textAlign: "center"}}>{Math.round(e.raw_wpm)}</TableCell>
                                            <TableCell style={{color: `${theme.value.typeBoxText}`,
                                                textAlign: "center"}}>{Math.round(e.accuracy)}%</TableCell>
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
                        count={usedData ? usedData.length : 0}
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