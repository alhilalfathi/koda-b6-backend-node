import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import userRouter from "./users.router.js";

const adminRouter = Router()

adminRouter.use(auth)

adminRouter.use("/users", userRouter)

export default adminRouter