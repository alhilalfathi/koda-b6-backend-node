import * as userModel from "../models/users.models.js";
import { constants } from "node:http2";
import { GenerateHash, VerifyHash } from "../lib/hash.js"
import path from "node:path"
import { v4 as uuidv4 } from "uuid"
import fs from "node:fs"

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
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function updateUser(req, res) {
    try {
        const { id } = req.params
        const { fullname, email, password } = req.body


        let updateData = {
            fullname: fullname || '',
            email: email || '',
            password: '' 
        }

        if (password && password.trim() !== '') {
            updateData.password = await GenerateHash(password)
        }

        const updatedUser = await userModel.updateUser(id, updateData)

        if (!updatedUser) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
                success: false,
                message: "User not found"
            })
        }

        const responseData = {
            id: updatedUser.id,
            fullname: updatedUser.fullname,
            email: updatedUser.email
        }

        res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "User updated successfully",
            data: responseData
        })

    } catch (error) {
        console.error("Update User Error:", error)
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

/**
 * GET /admin/users/profile
 * Get profile of logged in user
 */
export async function getProfile(req, res) {
    try {
        const user_id = res.locals.user.id

        const user = await userModel.getProfile(user_id)
        if (!user) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
                success: false,
                message: "User not found",
            })
        }

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "Get profile successfully",
            results: user,
        })
    } catch (error) {
        console.error("getProfile error:", error)
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        })
    }
}

/**
 * PATCH /admin/users/profile
 * Update profile of logged in user
 */
export async function updateProfile(req, res) {
    try {
        const user_id = res.locals.user.id
        const { fullname, email, password } = req.body

        const updated = await userModel.updateById(user_id, { fullname, email, password })

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "User updated successfully",
            results: updated,
        })
    } catch (error) {
        console.error("updateProfile error:", error)
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        })
    }
}

/**
 * PATCH /admin/users/profile/password
 * Change password of logged in user
 */
export async function changePassword(req, res) {
    try {
        const user_id = res.locals.user.id
        const { old_password, new_password } = req.body

        if (!old_password || !new_password) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "old_password and new_password are required",
            })
        }

        const user = await userModel.getById(user_id)
        if (!user) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
                success: false,
                message: "User not found",
            })
        }

        const match = await VerifyHash(old_password, user.password)
        if (!match) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "old password is incorrect",
            })
        }

        const hashed = await HashPassword(new_password)
        await userModel.updatePassword(user_id, hashed)

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "Password update successfully",
        })
    } catch (error) {
        console.error("changePassword error:", error)
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
            success: false,
            message: error.message,
        })
    }
}

/**
 * PATCH /admin/users/profile/photo
 * Upload profile photo for logged in user
 */
export async function uploadProfilePhoto(req, res) {
    try {
        const user_id = res.locals.user.id

        if (!req.file) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "File is required",
            })
        }

        const safeName = path.basename(req.file.originalname)
        const filename = `uploads/${Date.now()}_${uuidv4()}_${safeName}`

        fs.renameSync(req.file.path, filename)

        await userModel.upsertProfilePicture(user_id, filename)

        return res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "Upload success",
            results: filename,
        })
    } catch (error) {
        console.error("uploadProfilePhoto error:", error)
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        })
    }
}