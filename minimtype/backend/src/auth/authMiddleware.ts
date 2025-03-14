import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';


export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ error: 'Authentication required' });
        return; 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        if (!decoded) {
            res.status(404).json('User not found');
            return;
        }
        next();
      } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
         return
      }
}