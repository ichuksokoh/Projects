import { AppBar, Modal, Tabs, Tab } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React, { useContext, useEffect, useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


export const Account = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);
    const navigate = useNavigate();

    const handleModalOpen = () => {
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const handleValueChange = (e: React.SyntheticEvent ,v: any) => {
        setValue(v);
    }

    const { user, logout} = useContext(AuthContext)!;
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        if (JSON.stringify(user) !== "{}") {
            setLoggedIn(true);
        }
        else {
            setLoggedIn(false);
        }
    }, [user])

    return (
        <div>
            <div className="flex flex-row gap-x-2">
                {loggedIn ? <AccountCircleIcon onClick={() => navigate('/user')}/> : <AccountCircleIcon onClick={handleModalOpen}/>}
                {loggedIn ? <LogoutIcon className='hover:cursor-pointer' onClick={() => {logout(); setLoggedIn(false)}}/> : <></>}
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                className='flex items-center justify-center'
            >
                <div className='text-white w-[400px] bg-gray-700 rounded-md'>
                    <AppBar position='static' className='!bg-transparent'>
                        <Tabs 
                            variant='fullWidth'
                            value={value}
                            onChange={handleValueChange}
                        >
                            <Tab className='!text-white' label='login'></Tab>
                            <Tab className='!text-white' label='signup'></Tab>
                        </Tabs>
                    </AppBar>
                    {value === 0 ? <LoginForm openClose={setOpen} /> : <SignupForm openClose={setOpen}/>}
                </div>
            </Modal>
        </div>
    )
}