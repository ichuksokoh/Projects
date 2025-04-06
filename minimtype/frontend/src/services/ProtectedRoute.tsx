import { ReactNode, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";


export default function ProtectedRoute({ children } : { children: ReactNode }) {
   const user = localStorage.getItem('user');
   const token = localStorage.getItem('token');
   const navigate = useNavigate();

   const { theme } = useContext(ThemeContext);


   if (!user || !token) {
        return (
            <div className={`${theme.value.background} ${theme.value.textColor} text-2xl  font-bold w-screen h-screen flex flex-col items-center justify-center gap-y-2`}>
                <span>
                    Please Login to view this page
                </span>
                <button
                    onClick={() => navigate('/practice2')}
                    className={`${theme.value.textColor} rounded-lg bg-gray-300/20 p-2 active:scale-90 duration-300 ease-out`}>
                    Go to Practice!
                </button>
            </div>  
        )
   }

   return (
    <>
        {children}
    </>
   )


}