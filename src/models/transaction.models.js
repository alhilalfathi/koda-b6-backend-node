import pool from "../lib/db.js"

/**
 * @typedef {Object} Transaction
 * @property {string} trx_id
 * @property {number} user_id
 * @property {string} fullname
 * @property {string} email
 * @property {string} address
 * @property {string} delivery
 * @property {number} delivery_fee
 * @property {number} tax
 * @property {number} total
 * @property {string} status_order
 */

/**
 * @typedef {Object} TransactionItem
 * @property {number} product_id
 * @property {number} qty
 * @property {string} product_name
 * @property {number} price
 * @property {string} image
 */

/**
 * @typedef {Object} TransactionDetailResponse
 * @property {number} id
 * @property {string} trx_id
 * @property {string} order_date
 * @property {number} total
 * @property {string} status_order
 * @property {TransactionItem[]} items
 */

/**
 * @typedef {Object} TransactionHistoryResponse
 * @property {number} id
 * @property {string} trx_id
 * @property {string} order_date
 * @property {number} total
 * @property {string} status_order
 */

/**
 * Create a new transaction
 * @param {Transaction} data
 * @returns {Promise<void>}
 */
export async function createTransaction(data) {
    const { trx_id, user_id, fullname, email, address, delivery, delivery_fee, tax, total, status_order } = data
    const query = `
        INSERT INTO "TRANSACTION" (
            trx_id, 
            user_id,  
            fullname, 
            email, 
            address, 
            delivery, 
            delivery_fee, 
            tax, 
            total, 
            status_order
        ) 
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    `
    const values = [trx_id, user_id, fullname, email, address, delivery, delivery_fee, tax, total, status_order]
    await pool.query(query, values)
}

/**
 * Get all transactions
 * @returns {Promise<Transaction[]>}
 */
export async function getAllTransaction() {
    const query = `
        SELECT 
            "id", 
            "trx_id", 
            "user_id", 
            "order_date", 
            "fullname", 
            "email", 
            "address", 
            "delivery", 
            "delivery_fee", 
            "tax", 
            "total", 
            "status_order"
        FROM "TRANSACTION"
    `
    const result = await pool.query(query)
    return result.rows
}

/**
 * Get transaction detail with products by transaction ID
 * @param {number} id
 * @returns {Promise<TransactionDetailResponse>}
 */
export async function getDetail(id) {
    const query = `
        SELECT 
            t.id,
            t.trx_id,
            t.order_date,
            t.total,
            t.status_order,
            tp.product_id,
            tp.qty,
            p.product_name,
            p.price,
            COALESCE(pi.path, '') as path
        FROM "TRANSACTION" t
        JOIN "TRANSACTION_PRODUCT" tp ON tp.transaction_id = t.id
        JOIN "PRODUCT" p ON p.id = tp.product_id
        LEFT JOIN "PRODUCT_IMAGE" pi ON pi.product_id = p.id
        WHERE t.id = $1
    `
    const result = await pool.query(query, [id])
    const rows = result.rows

    if (rows.length === 0) return null

    const detail = {
        id: rows[0].id,
        trx_id: rows[0].trx_id,
        order_date: rows[0].order_date,
        total: rows[0].total,
        status_order: rows[0].status_order,
        items: rows.map(row => ({
            product_id: row.product_id,
            qty: row.qty,
            product_name: row.product_name,
            price: row.price,
            image: row.path,
        }))
    }

    return detail
}

/**
 * Get transaction history by user ID
 * @param {number} user_id
 * @returns {Promise<TransactionHistoryResponse[]>}
 */
export async function getByUserId(user_id) {
    const query = `
        SELECT 
            id,
            trx_id,
            order_date,
            total,
            status_order
        FROM "TRANSACTION"
        WHERE user_id = $1
        ORDER BY order_date DESC
    `
    const result = await pool.query(query, [user_id])
    return result.rows
}