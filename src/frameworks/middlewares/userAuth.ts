import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel from "../models/userModel";


export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json("Authentication cookie missing");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;

        if (decodedToken.role !== "user") {
            return res.status(403).json("Unauthorized access");
        }

        const userId = decodedToken.userId;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json("User not found");
        }

        if (user.isBlocked) {

            return res.status(403).json("User is blocked");
        }


        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(401).json("Invalid or expired token");
    }
};

export default userAuth