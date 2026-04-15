import { constants } from "node:http2"
import * as transactionModel from "../models/transaction.models.js"

/**
 * @swagger
 * /admin/transaction:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trx_id
 *               - fullname
 *               - email
 *               - address
 *               - delivery
 *               - delivery_fee
 *               - tax
 *               - total
 *             properties:
 *               trx_id:
 *                 type: string
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               delivery:
 *                 type: string
 *               delivery_fee:
 *                 type: number
 *               tax:
 *                 type: number
 *               total:
 *                 type: number
 *               status_order:
 *                 type: string
 *                 example: pending
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Internal server error
 */
export async function createTransaction(req, res) {
    try {
        const { trx_id, fullname, email, address, delivery, delivery_fee, tax, total, status_order } = req.body
        const user_id = res.locals.user.id

        if (!trx_id || !fullname || !email || !address || !delivery || !delivery_fee || !tax || !total) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "All fields are required",
            })
        }

        await transactionModel.createTransaction({
            trx_id,
            user_id,
            fullname,
            email,
            address,
            delivery,
            delivery_fee,
            tax,
            total,
            status_order: status_order || "pending",
        })

        return res.status(constants.HTTP_STATUS_CREATED).json({
            success: true,
            message: "Transaction created successfully",
        })
    } catch (error) {
        console.error("createTransaction error:", error)
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        })
    }
}

/**
 * @swagger
 * /admin/transaction:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *       500:
 *         description: Internal server error
 */
export async function getAllTransaction(req, res) {
    try {
        const result = await transactionModel.getAllTransaction()

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "Transactions fetched successfully",
            data: result,
        })
    } catch (error) {
        console.error("getAllTransaction error:", error)
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        })
    }
}

/**
 * @swagger
 * /admin/transaction/{id}:
 *   get:
 *     summary: Get transaction detail by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The transaction ID
 *     responses:
 *       200:
 *         description: Transaction detail fetched successfully
 *       400:
 *         description: Invalid transaction ID
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
export async function getDetail(req, res) {
    try {
        const id = parseInt(req.params.id)

        if (isNaN(id)) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "Invalid transaction ID",
            })
        }

        const result = await transactionModel.getDetail(id)

        if (!result) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
                success: false,
                message: "Transaction not found",
            })
        }

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "Transaction detail fetched successfully",
            data: result,
        })
    } catch (error) {
        console.error("getDetail error:", error)
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        })
    }
}

/**
 * @swagger
 * /admin/transaction/user:
 *   get:
 *     summary: Get transaction history for the authenticated user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction history fetched successfully
 *       500:
 *         description: Internal server error
 */
export async function getByUser(req, res) {
    try {
        const user_id = res.locals.user.id

        const result = await transactionModel.getByUserId(user_id)

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "Transaction history fetched successfully",
            data: result,
        })
    } catch (error) {
        console.error("getByUser error:", error)
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        })
    }
}