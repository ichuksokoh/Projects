import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';


export const UserInfo  = ({ tests } : { tests: number }) => {
    
    const { user } = useContext(AuthContext)!;
    const { theme } = useContext(ThemeContext)!;


    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const date = new Date(user.userSince);
    const month = date.getMonth();
    const year = date.getFullYear();
    const day = date.getDate();
    const dayOfWeek = date.getDay();

    return (
        <div className={`bg-gray-500/40 scale-[130%] sm:scale-100 h-[130%] w-full rounded-2xl py-4 px-4 flex flex-row items-center gap-x-2`}>
                    <div className=' w-[15%] flex justify-start sm:justify-center'>
                        <AccountCircleIcon sx={{width: '50%', transform: {lg: 'scale(5)', sm: 'scale(3)', xs: 'scale(2)'}}}/>
                    </div>
                    <div className='w-[45%] sm:w-[40%] sm:scale-100 scale-[115%] text-left  text-[7px] font-bold lg:text-lg'>
                        <div>Email: {user.userEmail}</div>
                        <div>User Since: {days[dayOfWeek]} {day}, {months[month]} {year}</div>
                    </div>
                    <div className='h-full w-[1px] self-stretch bg-white'></div>
                    <div className='w-[40%] text-center text-[10px] scale-[120%] lg:text-2xl'>
                        All Time Tests - { tests }
                    </div>
                </div>
    );
}