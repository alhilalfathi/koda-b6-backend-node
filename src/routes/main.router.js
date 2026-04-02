import { Router } from "express"
import { constants } from "node:http2"
import * as mainController from "../controller/main.controller.js";

const mainRouter = Router()

mainRouter.get("/reviews", mainController.getAllReviews)
mainRouter.get("/recommended-products", mainController.getRecommendedProduct)

export default mainRouter