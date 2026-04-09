import type { NextFunction, Request, Response } from "express";
import { verifyUserToken } from "../utils/jwt.js";

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers["authorization"];

  if (!header?.startsWith("Bearer")) {
    return res.status(400).json({ message: "Token should start with Bearer" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(400).json({ message: "Token is Missing" });
  }

  try {
    const user = verifyUserToken(token);

    if (!user) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    // @ts-ignore
    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};
