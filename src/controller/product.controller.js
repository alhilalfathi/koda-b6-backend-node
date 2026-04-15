import * as productModel from "../models/product.models.js";
import { constants } from "node:http2";
import redisClient from "../lib/redis.js";

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function createProduct(req, res) {
    const data = req.body
    const product = await productModel.createProduct(data)
    
    // Invalidate cache list
    await redisClient.del("products:all")

    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "product created successfully",
        result: product
    })
}

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function getAllProduct(req, res) {
    const cacheKey = "products:all"
    
    // Cek Redis
    const cached = await redisClient.get(cacheKey)
    if (cached) {
        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "list all product (from cache)",
            result: JSON.parse(cached)
        })
    }

    const product = await productModel.getAllProducts()
    
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(product))

    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "list all product",
        result: product
    })
}

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function getProductByID(req, res) {
    const { id } = req.params
    const cacheKey = `product:${id}`

    const cached = await redisClient.get(cacheKey)
    if (cached) {
        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "product found (from cache)",
            result: JSON.parse(cached)
        })
    }

    const product = await productModel.getProductByID(id)
    if (product) {
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(product))
    }

    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "product found",
        result: product
    })
}

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { product_name, product_desc, price, stock } = req.body;

        if (price !== undefined && isNaN(price)) {
            return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({ message: "Price must be a number" });
        }

        const updatedProduct = await productModel.updateProduct(id, {
            product_name,
            product_desc,
            price,
            stock
        })

        if (!updatedProduct) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
                success: false,
                message: "Product not found"
            })
        }

        // Hapus cache lama
        await redisClient.del(`product:${id}`)
        await redisClient.del("products:all")

        res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        })
    } catch (error) {
        console.error("Update Product Error:", error)
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error"
        })
    }
}

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function deleteProduct(req, res) {
    const id = parseInt(req.params.id)
    const product = await productModel.deleteProduct(id)

    if (!product) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
            success: false,
            message: "Product not found"
        })
    }

    // Bersihkan cache
    await redisClient.del(`product:${id}`)
    await redisClient.del("products:all")

    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "Product deleted successfully",
        data: product
    })
}