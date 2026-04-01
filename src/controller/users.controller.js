import * as userModel from "../models/users.models.js";
import { constants } from "node:http2";

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function createUser(req, res) {
    const data = req.body
    const user = await userModel.createUser(data)
    res.json({
        success: true,
        message: "user created successfully",
        result: user
    })
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function getAllUsers(req, res) {
    const user = await userModel.getAllUsers()
    res.json({
        success: true,
        message: "list all users",
        result: user
    })
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function getUserByID(req, res) {
    const id = parseInt(req.params.id)
    const user = await userModel.getUserByID(id)

    if (!user) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
            success: false,
            message: "User not found"
        })
    }

    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        data: user
    })
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function updateUser(req, res) {
    const id = parseInt(req.params.id)
    const { email, password } = req.body

    const updateData = {}
    if (email !== undefined) {
        updateData.email = email
    }
    if (password !== undefined) {
        updateData.password = password
    }

    const updatedUser = await userModel.updateUser(id, updateData)

    if (!updatedUser) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
            success: false,
            message: "User not found"
        })
    }

    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser
    })
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function deleteUser(req, res) {
    const id = parseInt(req.params.id)
    const user = await userModel.deleteUser(id)

    if (!user) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
            success: false,
            message: "User not found"
        })
    }

    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "User deleted successfully",
        data: user
    })
}