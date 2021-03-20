import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }
    if (Array.isArray(token)) {
        return res.status(403).send({ message: "Invalid token!" });
    }

    jwt.verify(token, env.JWT_SECRET!, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.body.decodedId = decoded.id;
        next();
    });
};