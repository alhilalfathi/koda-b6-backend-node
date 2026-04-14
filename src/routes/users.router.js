import { Router } from "express";
import * as userController from "../controller/users.controller.js"
import multer from "multer"
 
const upload = multer({ dest: "uploads/" })

const userRouter = Router()

userRouter.get("/profile", userController.getProfile)
userRouter.patch("/profile", userController.updateProfile)
userRouter.patch("/profile/password", userController.changePassword)
userRouter.patch("/profile/photo", upload.single("picture"), userController.uploadProfilePhoto)

userRouter.get("", userController.getAllUsers)
userRouter.get("/:id", userController.getUserByID)
userRouter.post("", userController.createUser)
userRouter.patch("/:id", userController.updateUser)
userRouter.delete("/:id", userController.deleteUser)


export default userRouter 