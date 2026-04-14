import pool from "../lib/db.js"


/**
 * @typedef {Object} Cart
 * @property {number} id
 * @property {number} quantity
 * @property {string} size
 * @property {number} variant
 * @property {number} user_id
 * @property {number} product_id
 */

/**
 * @typedef {Object} CartResponse
 * @property {number} id
 * @property {number} product_id
 * @property {string} product_name
 * @property {number} price
 * @property {string} path
 * @property {number} quantity
 * @property {string} size
 * @property {string} variant
 * @property {number} user_id
 */

/**
 * 
 * @param {Cart} data 
 * @returns 
 */
export async function createCart(data) {
    const { quantity, size_id, variant_id, user_id, product_id } = data
    const query = `
        INSERT INTO "CART" (quantity, size, variant, user_id, product_id) 
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (user_id, product_id, size, variant) 
        DO UPDATE SET quantity = "CART".quantity + EXCLUDED.quantity
		`
    const value = [quantity, size_id, variant_id, user_id, product_id]
    const result = await pool.query(query, value)
    return result.rows[0]
}


/**
 * Get cart items by user ID
 * @param {number} id
 * @returns {Promise<CartResponse[]>}
 */
export async function getUserCart(id) {
    const query =`
    SELECT 
        c."id", 
        c."quantity", 
        c."size", 
        c."variant", 
        c."user_id", 
        c."product_id",
        p."product_name",
        p."price",
        pi."path"
    FROM "CART" c
    JOIN "PRODUCT" p ON c."product_id" = p."id"
	LEFT JOIN "PRODUCT_IMAGES" pi ON c."product_id" = pi."product_id"
    WHERE c."user_id" = $1
    `
    const result = await pool.query(query, [user_id])
    return result.rows
}

/**
 * Update cart quantity
 * @param {number} id_cart
 * @param {Cart} data
 * @returns {Promise<void>}
 */
export async function updateCart(id_cart, data) {
    const {quantity, size, variant, user_id, product_id} = data
    const query = `
    UPDATE "CART" 
    SET "quantity"=$1, "size"=$2, "variant"=$3, "user_id"=$4, "product_id"=$5 WHERE "id"=$6
    `
    const value = [quantity, size, variant, user_id, product_id, id_cart]
    await pool.query(query, value)
}

/**
 * Delete cart item
 * @param {number} user_id
 * @returns {Promise<void>}
 */
export async function deleteCart(user_id) {
    await pool.query(`DELETE FROM cart WHERE user_id = $1`, [user_id])
}