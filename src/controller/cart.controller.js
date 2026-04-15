import * as cartModel from "../models/cart.models.js"
import { constants } from "node:http2"

/**
 * @swagger
 * /admin/cart:
 *   post:
 *     summary: Create or update cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - size_id
 *               - variant_id
 *               - product_id
 *             properties:
 *               quantity:
 *                 type: integer
 *               size_id:
 *                 type: integer
 *               variant_id:
 *                 type: integer
 *               product_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Cart updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export async function createCart(req, res) {
    try {
        const { quantity, size_id, variant_id, product_id } = req.body
        const user_id = res.locals.user.id

        if (!quantity || !size_id || !variant_id || !product_id) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "quantity, size_id, variant_id, and product_id are required",
            })
        }

        const result = await cartModel.createCart({
            quantity,
            size_id,
            variant_id,
            user_id,
            product_id,
        })

        return res.status(constants.HTTP_STATUS_CREATED).json({
            success: true,
            message: "Cart updated successfully",
            data: result,
        })
    } catch (error) {
        console.error("createCart error:", error)
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        })
    }
}

/**
 * @swagger
 * /admin/cart:
 *   get:
 *     summary: Get all cart items for the authenticated user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *       500:
 *         description: Internal server error
 */
export async function getCartByUser(req, res) {
    try {
        const user_id = res.locals.user.id

        const result = await cartModel.getUserCart(user_id)

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "Cart fetched successfully",
            data: result,
        })
    } catch (error) {
        console.error("getCartByUser error:", error)
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        })
    }
}

/**
 * @swagger
 * /admin/cart/{id}:
 *   patch:
 *     summary: Update a cart item by cart ID
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The cart ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *               size:
 *                 type: integer
 *               variant:
 *                 type: integer
 *               product_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       400:
 *         description: Invalid cart ID
 *       500:
 *         description: Internal server error
 */
export async function updateCart(req, res) {
    try {
        const id_cart = parseInt(req.params.id)
        const { quantity, size, variant, product_id } = req.body
        const user_id = res.locals.user.id

        if (isNaN(id_cart)) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "Invalid cart ID",
            })
        }

        await cartModel.updateCart(id_cart, {
            quantity,
            size,
            variant,
            user_id,
            product_id,
        })

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "Cart updated successfully",
        })
    } catch (error) {
        console.error("updateCart error:", error)
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        })
    }
}

/**
 * @swagger
 * /admin/cart/user:
 *   delete:
 *     summary: Delete all cart items for the authenticated user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       500:
 *         description: Internal server error
 */
export async function deleteCart(req, res) {
    try {
        const user_id = res.locals.user.id

        await cartModel.deleteCart(user_id)

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "Cart deleted successfully",
        })
    } catch (error) {
        console.error("deleteCart error:", error)
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        })
    }
}