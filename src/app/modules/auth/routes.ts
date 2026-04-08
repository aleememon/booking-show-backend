import { type Router as R, Router } from "express";
import { handleLogin, handleLogout, handleSignUp } from "./controllers.js";
import { authenticationMiddleware } from "../../common/middleware/auth-middleware.js";

const authRouter: R = Router();

authRouter.post("/signup", handleSignUp);
authRouter.post("/signin", handleLogin);
authRouter.get("/logout", authenticationMiddleware, handleLogout)
export default authRouter;