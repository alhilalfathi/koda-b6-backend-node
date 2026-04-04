import { Router } from "express";
import * as productController from "../controller/product.controller.js"

const productRouter = Router()

productRouter.get("/", productController.getAllProduct)
productRouter.get("/:id", productController.getProductByID)
productRouter.post("/", productController.createProduct)
productRouter.patch("/:id", productController.updateProduct)
productRouter.delete("/:id", productController.deleteProduct)


export default productRouter