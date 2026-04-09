import { Router } from "express";
import type { Router as R } from "express";
import { handleSeats, getAllSeats, seatBooking } from "./controllers.js";
import { authenticationMiddleware } from "../../common/middleware/auth-middleware.js";

const bookingRouter: R = Router();

bookingRouter.post("/seed", authenticationMiddleware, handleSeats);
bookingRouter.get("/allseats", authenticationMiddleware, getAllSeats);
bookingRouter.put("/:id/:name", authenticationMiddleware, seatBooking);

export default bookingRouter;
