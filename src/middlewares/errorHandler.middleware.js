import { constants } from "node:http2"

/**
 * Centralized error handler middleware.
 *
 * @param {Error} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export default function errorHandler(err, req, res, next) {
    console.error(`[${req.method} ${req.originalUrl}]`, err)

    const statusCode = err.statusCode ?? constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
    const message = err.isOperational ? err.message : "Internal server error"

    res.status(statusCode).json({
        success: false,
        message,
    })
}