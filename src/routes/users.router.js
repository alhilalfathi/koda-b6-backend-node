import { Router } from "express";
import * as userController from "../controller/users.controller.js"

const userRouter = Router()

userRouter.get("", userController.getAllUsers)
userRouter.get("/:id", userController.getUserByID)
userRouter.post("", userController.createUser)
userRouter.patch("/:id", userController.updateUser)


export default userRouter 