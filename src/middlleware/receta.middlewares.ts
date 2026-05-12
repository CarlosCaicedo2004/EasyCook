import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const GetDataFromToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Espera "Bearer TOKEN"

    if (!token) {
        return next();
        
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRETO_SUPER");
        (req as any).query.userId = decoded;
    } finally {
        next();
    }
};