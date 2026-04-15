import * as cartModel from "../models/cart.models.js"
import { constants } from "node:http2"
import { asyncHandler, AppError } from "../lib/errors.js"

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
export const createCart = asyncHandler(async (req, res) => {
    const { quantity, size_id, variant_id, product_id } = req.body
    const user_id = res.locals.user.id

    if (!quantity || !size_id || !variant_id || !product_id) {
        throw new AppError("quantity, size_id, variant_id, and product_id are required", constants.HTTP_STATUS_BAD_REQUEST)
    }

    const result = await cartModel.createCart({ quantity, size_id, variant_id, user_id, product_id })

    return res.status(constants.HTTP_STATUS_CREATED).json({
        success: true,
        message: "Cart updated successfully",
        data: result,
    })
})

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
export const getCartByUser = asyncHandler(async (req, res) => {
    const user_id = res.locals.user.id
    const result = await cartModel.getUserCart(user_id)

    return res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "Cart fetched successfully",
        data: result,
    })
})

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
export const updateCart = asyncHandler(async (req, res) => {
    const id_cart = parseInt(req.params.id)
    const { quantity, size, variant, product_id } = req.body
    const user_id = res.locals.user.id

    if (isNaN(id_cart)) {
        throw new AppError("Invalid cart ID", constants.HTTP_STATUS_BAD_REQUEST)
    }

    await cartModel.updateCart(id_cart, { quantity, size, variant, user_id, product_id })

    return res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "Cart updated successfully",
    })
})

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
export const deleteCart = asyncHandler(async (req, res) => {
    const user_id = res.locals.user.id
    await cartModel.deleteCart(user_id)

    return res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "Cart deleted successfully",
    })
})