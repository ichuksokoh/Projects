import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from "../models/User";

export const refreshToken = async (req: Request, res: Response) => {
    const refresh_token = req.cookies.refresh_token;
    try {
        if (!refresh_token) {
            res.status(403).json({ error: "No refresh token provided" });
            return;
        }
        const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET as string) as JwtPayload;
        if (!decoded || !decoded.userId) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const valid_refresh = await User.findOne({_id: decoded.userId, 'refresh_tokens.token': refresh_token});
        const valid_token = valid_refresh?.refresh_tokens.filter((token) => token.token === refresh_token);
        if (!valid_refresh || valid_token?.length !== 1) {
            res.status(401).json({error: "Not Authorized"});
            return;
        }

        const newToken = jwt.sign({ userId: decoded?.userId }, process.env.JWT_SECRET as string, {expiresIn: '30m'});
        res.send({ newToken: newToken});
    }
    catch (error) {
        res.status(500).send("Possible Server error or bad refresh Token");
    }


}