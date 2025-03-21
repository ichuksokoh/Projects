import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import Visibility  from "@mui/icons-material/Visibility";
import VisibilityOff  from "@mui/icons-material/VisibilityOff";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


export const SignupForm = () => {

    const [email, setEmail] = useState("");
    const [password, setPw] = useState("");
    const [confirmPw, setPw2] = useState("");
    const [error, setError] = useState("");
    const [error2, setError2] = useState("");
    const [error3, setError3] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const navigate = useNavigate();

    const { register } = useContext(AuthContext)!;
    


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidEmail(email)) {
            setError3("Invalid Email Address*");
            return;
        }
        if (password === "" || email === "") {
            setError("Email/Password Required*");
            return;
        }
        if (password !== confirmPw) {
            setError2("Passwords do not match*");
            return;
        }
        try {
            const success = await register(email, password);
            if (success) {
                setError("");
                navigate('/practice2');
            }
        } 
        catch (error) {
            console.error(error);
            setError('Registration failed. Please try again.');
        }
    }
    
    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }

    useEffect(() => {
        console.log(error);
    }, [error]);


    return (
        <Box
            className="flex flex-col gap-5"
            p={3}
        >
            <TextField
                error={error !== "" || error3 !== ""}
                helperText={error || error3}
                variant="outlined"
                type="email"
                label="Enter Email"
                sx={{ "& .MuiInputBase-input": { color: "white" },
                      "& label": {color: "white"},
                      "& label.Mui-focused": {color: "white"}}}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                error={error !== ""}
                helperText={error}
                variant="outlined"
                type="password"
                label="Enter Password"
                sx={{ "& .MuiInputBase-input": { color: "white" },
                      "& label": {color: "white"},
                      "& label.Mui-focused": {color: "white"}}}
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
                                {showPassword ? <VisibilityOff sx={{color:"white"}} /> : <Visibility sx={{color:"white"}}/>}
                                </IconButton>
                            </InputAdornment>
                            ),
                    },
                }}
            />
            <TextField
                error={error2 !== ""}
                helperText={error2}
                variant="outlined"
                type="password"
                label="Confirm Password"
                sx={{ "& .MuiInputBase-input": { color: "white" },
                      "& label": {color: "white"},
                      "& label.Mui-focused": {color: "white"}}}
             
                onChange={(e) => setPw2(e.target.value)}
                slotProps={{
                    input: {
                        sx: { color: "white" },
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword2((prev) => !prev)}
                                edge="end"
                                >
                                {showPassword2 ? <VisibilityOff sx={{color:"white"}} /> : <Visibility sx={{color:"white"}} />}
                                </IconButton>
                            </InputAdornment>
                            ),
                    },
                }}
            />
            <Button
                variant="contained"
                size="large"
                onClick={handleRegister}
            >Signup</Button>
        </Box>
    )
};