import { Router } from "express"
import * as cartController from "../controller/cart.controller.js"
import auth from "../middlewares/auth.middleware.js"

const cartRouter = Router()

cartRouter.post("/", auth, cartController.createCart)
cartRouter.get("/", auth, cartController.getCartByUser)
cartRouter.patch("/:id", auth, cartController.updateCart)
cartRouter.delete("/user", auth, cartController.deleteCart)

export default cartRouter