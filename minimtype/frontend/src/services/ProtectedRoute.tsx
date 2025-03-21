import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function ProtectedRoute({ children } : { children: ReactNode }) {
   const user = localStorage.getItem('user');
   const token = localStorage.getItem('token');
   const navigate = useNavigate();

   useEffect(() => {
    if (!user || !token) {
        navigate('/practice2');
    }

   }, [user, token, navigate])

//    if (!userId || !token) return null;

   return (
    <>
        {children}
    </>
   )


}