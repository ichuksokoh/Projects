import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress } from '@mui/material';
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
        <div className={`${theme.value.background} ${theme.value.textColor} flex flex-col h-screen w-screen justify-center items-center`}>
            <div className='w-1/2 h-3/4 flex flex-col'>
                <div className='w-full h-full'>
                    <UserInfo tests ={tests}/>
                </div>
                <div>
                    <Graph graphData={ WPM_graph_data}/>

                </div>
           </div>
        </div>
    );
}