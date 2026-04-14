import { constants } from "node:http2"
import * as transactionModel from "../models/transaction.models.js"

/**
 * POST /admin/transaction
 * Create a new transaction
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
 * GET /admin/transaction
 * Get all transactions
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
 * GET /admin/transaction/:id
 * Get transaction detail by ID
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
 * GET /admin/transaction/user
 * Get transaction history for the authenticated user
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