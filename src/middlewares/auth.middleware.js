import { VerifyToken } from "../lib/jwt.js"
import { constants } from "node:http2"

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export default function auth(req, res, next) {
    const authHeader = req.headers.authorization
    
    const prefix = "Bearer "
    if (!authHeader || !authHeader.startsWith(prefix)) {
        return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized: No token provided"
        })
    }

    const token = authHeader.slice(prefix.length)

    try {
        const payload = VerifyToken(token)
        
        if (!payload) {
            return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized: Invalid token"
            })
        }

        res.locals.user = payload

        next()
    } catch (error) {
        console.error("JWT Verification Error:", error.message)
        
        return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized: " + (error.name === 'TokenExpiredError' ? "Token expired" : "Invalid token")
        })
    }
}