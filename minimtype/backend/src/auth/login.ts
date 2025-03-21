// import  bycrypt  from "bcryptjs";
import {Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response) => {
    const {user_email, password} = req.body;
    try {
        const user = await User.findOne({ user_email });

        if (!user) {
            res.status(400).json({error: "Invalid Credentials"});
            return;
        }

        const validPw = await user.verifyPw(password);
        if (!validPw) {
            res.status(400).json({error: "Invalid Credentials"});
            return;
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });


        res.send({ token: token, user: {userId: user._id, userEmail: user.user_email, userSince: user.user_since}});


    } 
    catch (error) {
        console.error("Error logging in: ", error);
        res.status(500).json({error: "Server Error"})
    }
}