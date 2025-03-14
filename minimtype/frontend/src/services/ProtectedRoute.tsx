import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function ProtectedRoute({ children } : { children: ReactNode }) {
   const userId = localStorage.getItem('userId');
   const token = localStorage.getItem('token');
   const navigate = useNavigate();

   useEffect(() => {
    if (!userId || !token) {
        navigate('/register');
    }
    else {
        console.log("userId: ", userId);
        console.log("token: ", token);
    }

   }, [userId, token, navigate])

   if (!userId || !token) return null;

   return (
    <>
        {children}
    </>
   )


}