import * as productModel from "../models/product.models.js";
import { constants } from "node:http2";
import redisClient from "../lib/redis.js";

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_name
 *               - price
 *               - stock
 *             properties:
 *               product_name:
 *                 type: string
 *               product_desc:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product created successfully
 */
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
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products (cached or fresh)
 */
/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function getAllProduct(req, res) {
    const cacheKey = "products:all"
    
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
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details found
 */
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
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *               product_desc:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
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
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
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

    await redisClient.del(`product:${id}`)
    await redisClient.del("products:all")

    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "Product deleted successfully",
        data: product
    })
}