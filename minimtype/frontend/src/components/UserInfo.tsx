import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


export const UserInfo  = ({ tests } : { tests: number }) => {
    
    const { user } = useContext(AuthContext)!;


    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const date = new Date(user.userSince);
    const month = date.getMonth();
    const year = date.getFullYear();
    const day = date.getDate();
    const dayOfWeek = date.getDay();

    return (
        <div className='bg-gray-600 h-full rounded-2xl py-4 px-2 flex flex-row items-center gap-x-2 min-w-3/5 min-h-1/3'>
                    <div className='w-[20%] flex flex-row justify-center'>
                        <AccountCircleIcon sx={{ transform: "scale(6)" }}/>
                    </div>
                    <div className='w-[35%]'>
                        <div>Email: {user.userEmail}</div>
                        <div>Memeber Since: {days[dayOfWeek]} {day}, {months[month]} {year}</div>
                    </div>
                    <div className='h-full w-[1px] self-stretch bg-white'></div>
                    <div className='w-[40%] text-center text-2xl'>
                        All Time Tests - { tests }
                    </div>
                </div>
    );
}