import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { logout } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  }


  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-xl text-white">
      <h1>🏠 Home Page</h1>
      <Link to="/practice" className="mt-4 p-2 bg-white rounded">
        Go to Practice
      </Link>
      <button onClick={handleLogout} className="rounded-md w-32 h-12">Logout</button>
    </div>
  );
}
