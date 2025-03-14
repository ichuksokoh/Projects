import { Test } from "../models/Test";
import { User } from "../models/User";
import { Request, Response } from "express";
import bycrypt from 'bcryptjs';



export const updateUser = async (req: Request, res: Response) => {
    const userId = req?.params?.id;
    const { updatedEmail, updatedPw } = req?.body;
    try {
        const user = await User.findById(userId);
        if (user) {
            if (updatedEmail !== "") {
                user.user_email = updatedEmail;
            }
            if (updatedPw !== "") {
                const hashedpw = await bycrypt.hash(updatedPw,10);
                user.password = hashedpw;
            }
            const updatedUser = await user.save();
            res.status(200).send(`Updated User: ${updatedUser.id} successfully`);
        }
    }
    catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const userId = req?.params?.id;
    try {

        const user = await User.findById(userId);
        if (user) {
            const deletedTests = await Test.deleteMany({user_id: user.user_id });
            const deletedUser = await User.deleteOne({ _id: user?.id });
            if (deletedTests && deletedUser) {
                res.status(200).send('User deleted Successfully');
            }
            
        }
        
    }
     catch (error) {
        res.status(400).send(`Error deleting user: ${error}`);
    }
}