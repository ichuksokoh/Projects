import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


export default function Login() {
    const [user_email, setEmail] = useState("");
    const [password, setPw] = useState("");
    const [error, setError] = useState("")
    const [visible, setVis] = useState(false)
    const [timer, setTimer] = useState(3600);
    const navigate = useNavigate();
    const { login, logout } = useContext(AuthContext)!;

    
  




    const handleLogin = async (e : React.FormEvent) => {
        e.preventDefault();
        const loggedIn = await login(user_email, password);
        if (loggedIn !== null && localStorage.getItem('userId')) {
            setError("");
            console.log("Success");
            navigate('/practice2')
            setTimeout(() => { 
                logout();
                navigate('/login')
                console.log("logged out");
            }, (timer * 1000));
        }
        else {
            console.log("Failure");
            setError("Incorrect Email or Password")
        }
    }

    const handleDoesNotExist = async () => {
        navigate('/register');
    }

    const handleSeePw = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target?.id == "Pw1") {
            setVis(prev => !prev);
        }
    }

    return (
        <>
            <div className="flex flex-col h-screen w-screen justify-center items-center bg-gray-500 text-white">
            <form title="Login" onSubmit={(e) => handleLogin(e)} className="gap-y-1 bg-gray-600 rounded-md p-2">
                <h1>Login</h1>
                <div className="flex flex-col items-start justify-center">
                    <div className="flex flex-col gap-y-2 mb-2">
                        <h2>Email</h2>
                        <input 
                            className="border-2 p-1 rounded-md"
                            type="text"
                            placeholder="Email (e.g. example@gmail.com)"
                            value={user_email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-y-2 mb-5">
                        <h2>Password</h2>
                        <input
                            className="border-2 p-1 rounded-md"
                            type={visible ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={e => setPw(e.target.value)}
                        />
                        <div className="flex flex-row gap-x-2">
                            <input type="checkbox" id="Pw1" checked={visible} onChange={handleSeePw}/>
                            <p>Show Password</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-start justify-center">
                        <button
                            className="rounded-md w-20 mb-2"
                            type="submit"
                        >Login</button>
                        <div className="flex flex-row gap-x-2 items-center">
                            <p>Not a User?</p>  
                            <p className='rounded-md text-blue-400 hover:text-blue-300' onClick={handleDoesNotExist}>Register</p>
                        </div>
                    </div>
                </div>
            </form>
                {error !== ""    && <p className="text-red font-bold">*{error}</p>}
               
            </div>
        </>
    )
}