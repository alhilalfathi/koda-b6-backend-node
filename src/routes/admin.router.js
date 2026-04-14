import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import userRouter from "./users.router.js";
import cartRouter from "./cart.router.js";

const adminRouter = Router()

adminRouter.use(auth)

adminRouter.use("/users", userRouter)
adminRouter.use("/cart", cartRouter)

export default adminRouter