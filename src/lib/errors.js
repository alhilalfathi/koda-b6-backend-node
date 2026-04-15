/**
 * Operational (known) error that can carry an HTTP status code and a safe message.
 */
export class AppError extends Error {
    /**
     * @param {string} message
     * @param {number} statusCode
     */
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }
}

/**
 * Wraps an async Express route handler so it automatically forwards any
 * thrown errors to the centralized error handler via `next(err)`.
 *
 * @param {(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<any>} fn
 * @returns {import("express").RequestHandler}
 */
export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}