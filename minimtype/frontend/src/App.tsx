// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useState, useEffect} from 'react'
import { Route, Routes, useFetcher, useNavigate } from "react-router-dom"
import Practice from './pages/Practice';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthProvider';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './services/ProtectedRoute';
import Practice2 from './pages/Practice2';
import { TestProvider } from './context/TestProvider';
import { ThemeProvider } from './context/ThemeProvider';

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState<string>('');

  const protectedRoutes = [
    {path: '/home', element: <Home/>},
    {path: '/', element: <Home/>},
    {path: '/practice', element: <Practice/>},
    {path: '/practice2', element: <Practice2/>},
  ]

  useEffect(() => {
    // Fetch data from the backend API
    fetch('http://localhost:5000/api/message')
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message); // Set the message from backend
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

 

  return (
    <AuthProvider>
      <TestProvider>
        <ThemeProvider>
          <Routes>
            <Route path='/register' element={<Register/>} />
            <Route path='/login' element={<Login/>} />
            {protectedRoutes.map(({ path, element }, index) => (
              <Route key={index} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>}/>
            ))}
              {/* <Route path='/home' element={<Home/>} />
              <Route path='/practice' element={<Practice/>} /> */}
          </Routes>
        </ThemeProvider>
      </TestProvider>
    </AuthProvider>
  )
}

export default App
