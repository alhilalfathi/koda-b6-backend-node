import { Router } from "express"
import * as transactionController from "../controller/transaction.controller.js"
import auth from "../middlewares/auth.middleware.js"

const transactionRouter = Router()

transactionRouter.get("/user", auth, transactionController.getByUser)
transactionRouter.post("/", auth, transactionController.createTransaction)
transactionRouter.get("/", auth, transactionController.getAllTransaction)
transactionRouter.get("/:id", auth, transactionController.getDetail)

export default transactionRouter