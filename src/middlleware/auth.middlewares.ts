import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Espera "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. No hay token." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRETO_SUPER");
        (req as any).user = decoded; // <--- AQUÍ se define el userToken que buscas
        next();
    } catch (error) {
        res.status(403).json({ message: "Token no válido o expirado" });
    }
};