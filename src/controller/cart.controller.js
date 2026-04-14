import * as cartModel from "../models/cart.models.js"
import { constants } from "node:http2"

/**
 * POST /admin/cart
 * Create or update cart item
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
 * GET /admin/cart
 * Get all cart items for the authenticated user
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
 * PATCH /admin/cart/:id
 * Update a cart item by cart ID
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
 * DELETE /admin/cart/user
 * Delete all cart items for the authenticated user
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