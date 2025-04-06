import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from "../models/User";


export const logout_refreshToken = async (req: Request, res: Response) => {
    const old_refresh_token = req.cookies.refresh_token
    try {
        if (!old_refresh_token) {
            res.status(403).json({error: "No refresh token provided"});
            return;
        }
        const decoded = jwt.verify(old_refresh_token, process.env.JWT_SECRET as string) as JwtPayload;

        if (!decoded || !decoded.userId) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const result = await User.updateOne(
            {_id: decoded.userId},
            {
                $pull: {refresh_tokens: {token: old_refresh_token}}
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`${old_refresh_token} removed succesfully`);
        }
        else {
            console.log('No token found');
        }
        
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/auth/refresh_token'
        })

        res.send({logged_out: true})

        
    } 
    catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json({error: "Error removing token"});
    }

};