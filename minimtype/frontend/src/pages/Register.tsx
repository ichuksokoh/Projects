import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";



export default function Register() {
    const { register } = useContext(AuthContext)!;
    const [user_email, setEmail] = useState("");
    const [password, setPw] = useState("");
    const [confirmPw, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [visible, setVis] = useState([false, false])
    const navigate = useNavigate();


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPw) {
            setError("Passwords do not match");
            return;
        }
        try {
            const success = await register(user_email, password);
            if (success) {
                setError("");
                navigate('/login');
            }
        } 
        catch (error) {
            console.error(error);
            setError('Registration failed. Please try again.');
        }
    }

    const handleUserExists = async () => {
        navigate('/login');
    }

    const handleSeePw = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target?.id == "Pw1") {
            setVis(prev => [!prev[0], prev[1]]);
        }
        else if (e.target?.id == "Pw2") {
            setVis(prev => [prev[0], !prev[1]]);
        }
    }

    return (
        <>
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-500 text-white">
            <form title="Register" onSubmit={handleRegister} className="bg-gray-600 rounded-md p-2">
                <h1>Register</h1>
                <div className="flex flex-col items-start justify-center gap-y-1">
                    <h2>Email</h2>
                    <input 
                        className="border-2 p-1 rounded-md"
                        type="text"
                        placeholder="Email (e.g. example@gmail.com)"
                        value={user_email}
                        onChange={e => setEmail(e.target.value)}
                    />

                    <h2>Password</h2>
                    <input
                        className="border-2 p-1 rounded-md"
                        type={visible[0] ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={e => setPw(e.target.value)}
                    />
                    <div className="flex flex-row gap-x-2">
                        <input type="checkbox" checked={visible[0]} id="Pw1" onChange={(e) => handleSeePw(e)}/>
                        <p>Show Password</p>
                    </div>
                    <h2>Confirm Password</h2>
                    <input
                        className="border-2 p-1 rounded-md"
                        type={visible[1] ? "text" : "password"}
                        value={confirmPw}
                        onChange={e => setConfirm(e.target.value)}
                    />
                    <div className="flex flex-row gap-x-2 mb-2">
                        <input type="checkbox" checked={visible[1]} id="Pw2" onChange={(e) => handleSeePw(e)}/>
                        <p>Show Password</p>
                    </div>
                    <div className="flex flex-col">
                        <button
                            className="rounded-md max-w-32"
                            type="submit"
                        >Register</button>
                        <div className="flex flex-row gap-x-2">
                        <p>Already A user?</p>  
                        <p className='text-blue-400 hover:text-blue-300' onClick={handleUserExists}>Login</p>
                        </div>

                    </div>
                </div>
            </form>
                {error !== "" && <p className="text-red font-bold">*{error}</p>}
        </div>
        </>
    )
}