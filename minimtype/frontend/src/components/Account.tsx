import { AppBar, Modal, Tabs, Tab } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React, { useContext, useEffect, useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './Signup';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../context/AuthContext';


export const Account = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);


    const handleModalOpen = () => {
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const handleValueChange = (e: React.SyntheticEvent ,v: any) => {
        setValue(v);
    }

    const { logout} = useContext(AuthContext)!;
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        if (localStorage.getItem('userId')) {
            setLoggedIn(true);
        }
        else {
            setLoggedIn(false);
        }
    }, [localStorage.getItem('userId')])

    return (
        <div>
            {loggedIn ? <></> : <AccountCircleIcon onClick={handleModalOpen}/>}
            {loggedIn ? <LogoutIcon className='hover:cursor-pointer' onClick={() => {logout(); setLoggedIn(false)}}/> : <></>}
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
                    {value === 0 ? <LoginForm openClose={setOpen} /> : <SignupForm/>}
                </div>
            </Modal>
        </div>
    )
}