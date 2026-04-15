import * as userModel from "../models/users.models.js";
import { constants } from "node:http2";
import { GenerateHash, VerifyHash } from "../lib/hash.js"
import path from "node:path"
import { v4 as uuidv4 } from "uuid"
import fs from "node:fs"
import { asyncHandler, AppError } from "../lib/errors.js"

/**
 * @swagger
 * /admin/users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - password
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 */
export const createUser = asyncHandler(async (req, res) => {
    const user = await userModel.createUser(req.body)
    res.json({
        success: true,
        message: "user created successfully",
        result: user
    })
})

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
    const user = await userModel.getAllUsers()
    res.json({
        success: true,
        message: "list all users",
        result: user
    })
})

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details fetched
 *       404:
 *         description: User not found
 */
export const getUserByID = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)
    const user = await userModel.getUserByID(id)

    if (!user) {
        throw new AppError("User not found", constants.HTTP_STATUS_NOT_FOUND)
    }

    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        data: user
    })
})

/**
 * @swagger
 * /admin/users/{id}:
 *   patch:
 *     summary: Update user by ID
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
export const updateUser = asyncHandler(async (req, res) => {
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
        throw new AppError("User not found", constants.HTTP_STATUS_NOT_FOUND)
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
})

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
export const deleteUser = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)
    const user = await userModel.deleteUser(id)

    if (!user) {
        throw new AppError("User not found", constants.HTTP_STATUS_NOT_FOUND)
    }

    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "User deleted successfully",
        data: user
    })
})

/**
 * @swagger
 * /admin/users/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 */
export const getProfile = asyncHandler(async (req, res) => {
    const user_id = res.locals.user.id

    const user = await userModel.getProfile(user_id)
    if (!user) {
        throw new AppError("User not found", constants.HTTP_STATUS_NOT_FOUND)
    }

    return res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "Get profile successfully",
        results: user,
    })
})

/**
 * @swagger
 * /admin/users/profile:
 *   patch:
 *     summary: Update logged-in user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const user_id = res.locals.user.id
    const { fullname, email, password } = req.body

    const updated = await userModel.updateById(user_id, { fullname, email, password })

    return res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "User updated successfully",
        results: updated,
    })
})

/**
 * @swagger
 * /admin/users/profile/password:
 *   patch:
 *     summary: Change password for logged-in user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - old_password
 *               - new_password
 *             properties:
 *               old_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
export const changePassword = asyncHandler(async (req, res) => {
    const user_id = res.locals.user.id
    const { old_password, new_password } = req.body

    if (!old_password || !new_password) {
        throw new AppError("old_password and new_password are required", constants.HTTP_STATUS_BAD_REQUEST)
    }

    const user = await userModel.getById(user_id)
    if (!user) {
        throw new AppError("User not found", constants.HTTP_STATUS_NOT_FOUND)
    }

    const match = await VerifyHash(old_password, user.password)
    if (!match) {
        throw new AppError("old password is incorrect", constants.HTTP_STATUS_BAD_REQUEST)
    }

    const hashed = await GenerateHash(new_password)
    await userModel.updatePassword(user_id, hashed)

    return res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "Password update successfully",
    })
})

/**
 * @swagger
 * /admin/users/profile/photo:
 *   patch:
 *     summary: Upload profile photo
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 */
export const uploadProfilePhoto = asyncHandler(async (req, res) => {
    const user_id = res.locals.user.id

    if (!req.file) {
        throw new AppError("File is required", constants.HTTP_STATUS_BAD_REQUEST)
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
})

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete user with all related data (transactional)
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export const deleteUserWithTransaction = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
        throw new AppError("Invalid user ID", constants.HTTP_STATUS_BAD_REQUEST)
    }

    const user = await userModel.deleteUserWithTransaction(id)

    return res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "User deleted successfully",
        data: user
    })
})