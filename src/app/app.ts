import express from "express";
import type { Express, Response, Request, NextFunction } from "express";
import APIResponse from "./common/utils/api-response.js";
import authRouter from "./modules/auth/routes.js";

const app: Express = express();

app.use(express.json());


app.get("/api/health", (req:Request, res:Response) => {
    return APIResponse.ok(res, "app is running healthy");
})

// app.use((req: Request, res:Response, next: NextFunction) => {
//     console.log(`${req.method} ${req.url}`)
//     next()
// })

app.use("/api/auth", authRouter);

export default app;