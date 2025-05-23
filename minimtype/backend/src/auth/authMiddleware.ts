import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';



export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer: ', '');
    if (!token) {
        res.status(401).json({ error: 'Authentication required' });
        return; 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if (!decoded || !decoded.userId) {
            console.log(token);
            res.status(404).json({ error: "User not found" });
        }
        next();
      } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
         return
      }
}