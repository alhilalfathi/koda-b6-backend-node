import * as userModel from "../models/users.models.js";
import { constants } from "node:http2";

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function register(req, res) {
    try {
        const { fullname, email, password } = req.body

        if (!fullname || !email || !password) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "Fullname, email, password are required"
            })
        }

        const existingUser = await userModel.getUserByEmail(email)
        if (existingUser) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "Email already registered"
            })
        }

        const newUser = await userModel.createUser({
            fullname,
            email,
            password
        })

        const userCreated = {
            id: newUser.id,
            fullname: newUser.fullname,
            email: newUser.email
        }

        res.status(constants.HTTP_STATUS_CREATED).json({
            success: true,
            message: "User registered successfully",
            data: userCreated
        })
    } catch (error) {
        console.error("Register error:", error)
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error"
        })
    }
}


/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function login(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "Email and password are required"
            })
        }

        const user = await userModel.getUserByEmail(email)
        if (!user) {
            return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        if (user.password !== password) {
            return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const userLogin = {
            id: user.id,
            fullname: user.fullname,
            email: user.email
        }

        res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "Login successful",
            data: userLogin
        })
    } catch (error) {
        console.error("Login error:", error)
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error"
        })
    }
}