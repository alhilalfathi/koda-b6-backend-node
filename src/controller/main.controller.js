import * as reviewModel from "../models/review.models.js";
import * as productModel from "../models/product.models.js";
import { constants } from "node:http2";
import { asyncHandler } from "../lib/errors.js";

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all product reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Successfully fetched all reviews
 *       500:
 *         description: Internal server error
 */
export const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await reviewModel.getAllReviews()

    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "Successfully get all reviews",
        data: reviews
    })
})

/**
 * @swagger
 * /recommended-products:
 *   get:
 *     summary: Get list of recommended products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Successfully fetched recommended products
 *       500:
 *         description: Internal server error
 */
export const getRecommendedProduct = asyncHandler(async (req, res) => {
    const recom = await productModel.recommendedProducts()

    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "Successfully get recommended product",
        data: recom
    })
})