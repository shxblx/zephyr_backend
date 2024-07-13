import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: string;
    role: string;
}


const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.adminJwt;
        console.log(`Token for ${req.method} ${req.path}:`, token);


        if (!token) {

            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;

        if (decoded.role !== 'admin') {

            return res.status(403).json({ message: 'Admin access required' });
        }


        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default adminAuth;