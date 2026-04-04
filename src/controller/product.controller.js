import * as productModel from "../models/product.models.js";
import { constants } from "node:http2";

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function createProduct(req, res) {
    const data = req.body
    const product = await productModel.createProduct(data)
    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "product created successfully",
        result: product
    })
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function getAllProduct(req, res) {
    const product = await productModel.getAllProducts()
    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "list all product",
        result: product
    })
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function getProductByID(req, res) {
    const product = await productModel.getProductByID()
    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "product found",
        result: product
    })
}

export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { product_name, product_desc, price, stock } = req.body;

        if (price !== undefined && isNaN(price)) {
            return res.status(400).json({ message: "Price must be a number" });
        }

        const updatedProduct = await productModel.updateProduct(id, {
            product_name,
            product_desc,
            price,
            stock
        })

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        })
    } catch (error) {
        console.error("Update Product Error:", error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export async function deleteProduct(req, res) {
    const id = parseInt(req.params.id)
    const product = await productModel.deleteProduct(id)

    if (!product) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
            success: false,
            message: "Product not found"
        })
    }

    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "Product deleted successfully",
        data: product
    })
}