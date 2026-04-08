import type { NextFunction, Request, Response } from "express";
import APIError from "../utils/api-error.js";
import { verifyUserToken } from "../utils/jwt.js";


export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    if (!header?.startsWith("Bearer")) return APIError.badRequest("Token should start with Bearer");

    const token = header.split(" ")[1];

    if (!token) return APIError.badRequest("Token is Missing");

    const user = verifyUserToken(token);

    // @ts-ignore
    req.user = user;
    
    next()
};