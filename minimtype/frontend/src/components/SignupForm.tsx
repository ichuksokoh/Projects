import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import Visibility  from "@mui/icons-material/Visibility";
import VisibilityOff  from "@mui/icons-material/VisibilityOff";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PasswordValidator from "password-validator";


export const SignupForm = ({ openClose } : {openClose : (open: boolean) => void}) => {

    const [email, setEmail] = useState("");
    const [password, setPw] = useState("");
    const [confirmPw, setPw2] = useState("");
    const [error, setError] = useState("");
    const [error2, setError2] = useState("");
    const [error3, setError3] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const navigate = useNavigate();

    const {login, register, user } = useContext(AuthContext)!;
    const pwSchema = new PasswordValidator();
        pwSchema
            .is().min(6, 'At least 6 characters please')
            .is().max(100, 'Only 100 characters allowed')
            .has().uppercase(1, 'At least 1 Capital letter')
            .has().lowercase(1, 'At least 1 Lower Case letter')
            .has().digits(1, 'At least 1 number')
            .has().not().spaces(0, 'No spaces allowed')
            .has().symbols(1, 'At least 1 symbol');
    
    


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email === "") {
            setError("Email Required*");
        }
        else {
            setError("");
        }
        if (!isValidEmail(email)) {
            setError("Invalid Email Address*");
            return;
        }
        else {
            setError("");
        }
        if (password === "") {
            setError2("Password Required*");
            return;
        }
        else {
            setError2("");
        }
        if (password !== confirmPw) {
            setError2("Passwords do not match*");
            setError3("Passwords do not match*");
            return;
        }
        else {
            setError2("");
            setError3("");
        }
        if (!pwSchema.validate(password)) {
            const msgs = pwSchema.validate(password, {details: true});
            console.log(msgs);
            setError2('Password must contain at least 8 characters and at least 1 symbol, number, uppercase and lowercase letter');
            return;
        }
        try {
            const success = await register(email, password);
            if (success) {
                setError("");
                console.log("Success signing up");
                const loggedin = await login(email, password);
                console.log(user);
                console.log(loggedin);
                if (loggedin !== null) {
                    console.log("rerouting");
                    openClose(false);
                    navigate('/practice2');
                }
                
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
                error={error !== ""}
                helperText={error}
                variant="outlined"
                type="email"
                label="Enter Email"
                sx={{ "& .MuiInputBase-input": { color: "white" },
                      "& label": {color: "white"},
                      "& label.Mui-focused": {color: "white"}}}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                error={error2 !== ""}
                helperText={error2}
                variant="outlined"
                type={showPassword ? "text" : "password"}
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
                error={error3 !== ""}
                helperText={error3}
                variant="outlined"
                type={showPassword2 ? "text" : "password"}
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