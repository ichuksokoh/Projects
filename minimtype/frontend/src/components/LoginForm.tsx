import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginForm = ({ openClose } : {openClose : (open: boolean) => void}) => {

    const [email, setEmail] = useState("");
    const [password, setPw] = useState("");
    const [error, setError] = useState("");
    const [error2, setError2] = useState("");
    const { login, logout } = useContext(AuthContext)!;
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);



    const handleLogin = async (e : React.FormEvent) => {
        e.preventDefault();
        if (!isValidEmail(email)) {
            setError2("Invalid Email Address*");
            return;
        }
        if (email === "" || password === "") {
            setError("Email/Password Required*");
            return;
        }
        const loggedIn = await login(email, password);
        if (loggedIn !== null && localStorage.getItem('userId')) {
            setError("");
            console.log("Success");
            
            openClose(false);
            setTimeout(() => { 
                logout();
                // navigate('/login')
                console.log("logged out");
            }, (3600 * 1000));
            navigate('/practice2')
        }
        else {
            console.log("Failure");
            setError("Incorrect Email or Password")
        }
    }

    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }
    


    return (
        <Box
            className="flex flex-col gap-5"
            p={3}
        >
            <TextField
                error={error !== "" || error2 !== ""}
                helperText={error || error2}
                variant="outlined"
                type="email"
                label="Enter Email"
                sx={{ "& .MuiInputBase-input": { color: "white" },
                      "& label.Mui-focused" : { color: "white"},
                      "& label": {color: "white"}}}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                variant="outlined"
                error={error !== ""}
                helperText={error}
                type={showPassword ? "text" : "password"}
                label="Enter Password"
                sx={{ "& .MuiInputBase-input": { color: "white" },
                      "& label": { color: "white"},
                      "& label.Mui-focused": { color: "white"}}}
                onChange={(e) => setPw(e.target.value)}
                slotProps={{
                    input: {
                      sx: { color: "white" },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff sx={{color: "white"}}/> : <Visibility sx={{color: "white"}} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
            />
            <Button
                variant="contained"
                size="large"
                onClick={handleLogin}
            >Login</Button>
        </Box>
    )
};