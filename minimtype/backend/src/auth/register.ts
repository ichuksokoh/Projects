import bcrypt from "bcryptjs";
import {Request, Response } from "express";
import { User } from "../models/User";

//Registering user for minimtype
export const registerUser = async (req: Request, res: Response) => {
    const {user_email, password } = req.body;
    try {
        const existingUser = await User.findOne({ user_email: user_email });
        if (existingUser) {
            res.status(400).json({ error: "User already exists." });
            return;
        }
        const hashedpw = await bcrypt.hash(password, 10);
        const result = await User.create({user_email: user_email, password: hashedpw});
        const success = result ? true: false;
        res.send({ success });
        // res.status(201).json({id: result._id, user_email: result.user_email, user_id: result.user_id})
    } 
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}