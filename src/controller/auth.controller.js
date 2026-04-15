import { GenerateHash, VerifyHash } from "../lib/hash.js";
import { GenerateToken } from "../lib/jwt.js";
import * as userModel from "../models/users.models.js";
import { constants } from "node:http2";
import { asyncHandler, AppError } from "../lib/errors.js";

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
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
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request (Email already exists or missing fields)
 *       500:
 *         description: Internal server error
 */
export const register = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body

    if (!fullname || !email || !password) {
        throw new AppError("Fullname, email, password are required", constants.HTTP_STATUS_BAD_REQUEST)
    }

    const existingUser = await userModel.getUserByEmail(email)
    if (existingUser) {
        throw new AppError("Email already registered", constants.HTTP_STATUS_BAD_REQUEST)
    }

    const hashedPass = await GenerateHash(password)
    const newUser = await userModel.createUser({ fullname, email, password: hashedPass })

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
})

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized (Invalid email or password)
 *       500:
 *         description: Internal server error
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new AppError("Email and password are required", constants.HTTP_STATUS_BAD_REQUEST)
    }

    const user = await userModel.getUserByEmail(email)
    if (!user) {
        throw new AppError("Invalid email or password", constants.HTTP_STATUS_UNAUTHORIZED)
    }

    const isValid = await VerifyHash(user.password, password)
    if (!isValid) {
        throw new AppError("Invalid email or password", constants.HTTP_STATUS_UNAUTHORIZED)
    }

    const token = GenerateToken({ id: user.id })

    const userLogin = {
        id: user.id,
        fullname: user.fullname,
        email: user.email
    }

    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "Login successful",
        data: { ...userLogin, token }
    })
})