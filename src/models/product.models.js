import pool from "../lib/db.js"


/**
 * @typedef {Object} Product
 * @property {number} product_id
 * @property {string} product_name
 * @property {string} product_desc
 * @property {number} price
 * @property {number} stock
 * @property {string} category
 * @property {string} path
 */

/**
 * @returns {Promise<Product[]>}
 */
export async function getAllProducts() {
    const query = `
        SELECT 
            p."id", 
            p."product_name", 
            p."product_desc", 
            p."price", 
            p."stock", 
            MIN(img."path") AS "path", 
			string_agg( c."category" , ',' ) AS "category"
        FROM "PRODUCT" p
        LEFT JOIN "PRODUCT_IMAGES" img ON img."product_id" = p."id"
        JOIN "PRODUCT_CATEGORY" pcat ON pcat."product_id" = p."id"
        JOIN "CATEGORY" c ON c."id" = pcat."category_id"
		GROUP BY p."id", p."product_name", p."product_desc", p."price", p."stock"
    `
    const userData = await pool.query(query)
    return userData.rows
}

/**
 * @param {number} id
 * @returns {Promise<Product|null>}
 */
export async function getProductById(id) {
    const query = `
        SELECT 
            p."id", 
            p."product_name", 
            p."product_desc", 
            p."price", 
            p."stock", 
            MIN(img."path") AS "path", 
			string_agg( c."category" , ',' ) AS "category"
        FROM "PRODUCT" p
        LEFT JOIN "PRODUCT_IMAGES" img ON img."product_id" = p."id"
        JOIN "PRODUCT_CATEGORY" pcat ON pcat."product_id" = p."id"
        JOIN "CATEGORY" c ON c."id" = pcat."category_id"
		GROUP BY p."id", p."product_name", p."product_desc", p."price", p."stock"
        WHERE id = $1
    `
    const value = [id]
    const userData = await pool.query(query,value)
    return userData.rows||null
}

/**
 * @param {Object} data
 * @returns {Promise<Product>}
 */
export async function createProduct(data) {
    const { product_name, product_desc, price, stock } = data
    const query = `
        INSERT INTO "PRODUCT" (product_name, product_desc, price, stock) 
        VALUES ($1,$2,$3,$4)
        RETURNING *
        `
    const value = [product_name, product_desc, price, stock]
    const result = await pool.query(query, value)
    return result.rows[0]
}

/**
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Product|null>}
 */
export async function updateProduct(id, data) {
    const fields = []
    const values = [id]
    let paramCount = 2

    const allowedFields = ["product_name", "product_desc", "price", "stock"]

    for (const key of allowedFields) {
        if (data[key] !== undefined) {
            fields.push(`"${key}" = $${paramCount}`)
            values.push(data[key])
            paramCount++
        }
    }

    if (fields.length === 0) {
        return getProductById(id)
    }

    const query = `UPDATE "PRODUCT" SET ${fields.join(", ")} WHERE id = $1 RETURNING *`
    const result = await pool.query(query, values)
    return result.rows[0] || null
}

/**
 * @param {number} id
 * @returns {Promise<Product|null>}
 */
export async function deleteProduct(id) {
    const query = `
    DELETE
    FROM "PRODUCT"
    WHERE id = $1
    `
    const value = [id]
    const userData = await pool.query(query,value)
    return userData.rows[0]||null
}

/**
 * @returns {Promise<Product[]>}
 */
export async function recommendedProducts() {
    const query = `
		SELECT "PRODUCT"."id", "product_name", "product_desc", "price", "stock", "path", COUNT("REVIEWS"."product_id") AS "total_review"
		FROM "PRODUCT"
		JOIN "REVIEWS" ON "REVIEWS"."product_id" = "PRODUCT"."id"
		JOIN "PRODUCT_IMAGES" ON "PRODUCT_IMAGES"."product_id" = "PRODUCT"."id"
		GROUP BY "PRODUCT"."id", "PRODUCT_IMAGES"."path"
		ORDER BY "total_review" DESC
		LIMIT 4
	`
    const userData = await pool.query(query)
    return userData.rows
}
