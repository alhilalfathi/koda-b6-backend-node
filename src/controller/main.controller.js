import * as reviewModel from "../models/review.models.js";
import * as productModel from "../models/product.models.js";

import { constants } from "node:http2";


/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function getAllReviews(req, res) {
    try {
        const reviews = await reviewModel.getAllReviews()

        res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "Successfully get all reviews",
            data: reviews
        })
    } catch (err) {
        console.error("Error getting reviews data", err)
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to get reviews data",
            error: err.message
        })
    }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function getRecommendedProduct(req, res) {
    try {
        const recom = await productModel.recommendedProducts()

        res.status(constants.HTTP_STATUS_OK).json({
            success: true,
            message: "Successfully get recommended product",
            data: recom
        })
    } catch (err) {
        console.error("Error getting product data", err)
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to get product data",
            error: err.message
        })
    }
}