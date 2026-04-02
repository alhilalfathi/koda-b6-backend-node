import pool from "../lib/db.js"

/**
 * @typedef {Object} Review
 * @property {number} id
 * @property {number} user_id
 * @property {number} product_id
 * @property {string} messages
 * @property {number} rating
 * @property {number} path
 * @property {number} fullname
 */

/**
 * @returns {Promise<Review[]>}
 */
export async function getAllReviews() {
	const query = `
        SELECT 
            r."id", 
            r."user_id", 
            r."product_id", 
            r."messages", 
            r."rating",
            pic."path",
			u."fullname"
        FROM "REVIEWS" r
        LEFT JOIN "USER_PICTURE" pic ON pic."user_id" = r."user_id"
		LEFT JOIN "USER" u ON u."id" = r."user_id"
    `
    const userData = await pool.query(query)
    return userData.rows
}

/**
 * @param {number} id
 * @returns {Promise<Review|null>}
 */
export async function getReviewById(id) {
	const query = `
        SELECT "id", "user_id", "product_id", "messages", "rating" 
        FROM "REVIEWS" 
        WHERE "id" = $1
    `
    const value = [id]
    const userData = await pool.query(query, value)
    return userData.rows
}

/**
 * @param {Object} data
 * @returns {Promise<Review>}
 */
export async function createReview(data) {
    const { user_id, product_id, messages, rating } = data

    const query = `
        INSERT INTO "REVIEWS" (user_id, product_id, messages, rating) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
    `
    const value = [user_id, product_id, messages, rating]

    const result = await pool.query(query, value)
    return result.rows[0]
}

/**
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Review|null>}
 */
export async function updateReview(id, data) {
    const fields = []
    const values = [id]
    let paramCount = 2

    const allowedFields = ["user_id", "product_id", "messages", "rating"]

    for (const key of allowedFields) {
        if (data[key] !== undefined) {
            fields.push(`${key} = $${paramCount}`)
            values.push(data[key])
            paramCount++
        }
    }

    if (fields.length === 0) {
        return getReviewById(id)
    }

    const query = `UPDATE "REVIEWS" SET ${fields.join(", ")} WHERE id_review = $1 RETURNING *`

    const result = await pool.query(query, values)
    return result.rows[0] || null
}

/**
 * @param {number} id
 * @returns {Promise<Review|null>}
 */
export async function deleteReview(id) {
    const query = `DELETE FROM "REVIEWS" WHERE "id" = $1`

    const value = [id]

    const result = await pool.query( query, value)
    return result.rows[0] || null
}