import pool from "../lib/db.js"

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} fullname
 * @property {string} email
 * @property {string} password
 * 
 */

/**
 * 
 * @param {User} data 
 * @returns {Promise<User>}
 */
export async function createUser(data) {
    const { fullname, email, password } = data
    const query = `
        INSERT INTO "USER" (fullname, email, password)
        VALUES ($1, $2, $3)
        RETURNING *
        `
    const value = [fullname, email, password]
    const result = await pool.query(query, value)
    return result.rows[0]
}


/**
 * 
 * @returns {Promise<User[]>}
 */
export async function getAllUsers() {
    const query = `
    SELECT id, fullname, email
    FROM "USER"
    `
    const userData = await pool.query(query)
    return userData.rows
}

/**
 * 
 * @param {number} id 
 * @returns {Promise<User>}
 */
export async function getUserByID(id) {
    const query = `
    SELECT id, fullname, email
    FROM "USER"
    WHERE id = $1
    `
    const value = [id]
    const userData = await pool.query(query,value)
    return userData.rows[0]
}

/**
 * 
 * @param {string} email 
 * @returns {Promise<User>}
 */
export async function getUserByEmail(email) {
    const query = `
    SELECT id, fullname, email, password
    FROM "USER"
    WHERE email = $1
    `
    const value = [email]
    const userData = await pool.query(query,value)
    return userData.rows[0]
}

/**
 * 
 * @param {number} id 
 * @param {Partial<User>} data 
 * @returns {Promise<User>}
 */
export async function updateUser(id, data) {
    const {fullname, email, password} = data
    const query = `
    UPDATE "USER" SET 
    fullname = COALESCE(NULLIF($1,''), fullname),
    email = COALESCE(NULLIF($2,''), email),
    password = COALESCE(NULLIF($3,''), password)
    WHERE id = $4
    RETURNING id, fullname, email, password
    `
    const value = [fullname, email, password, id]
    const userData = await pool.query(query,value)
    return userData.rows[0]
}


/**
 * 
 * @param {number} id 
 * @returns {Promise<User>}
 */
export async function deleteUser(id) {
    const query = `
    DELETE
    FROM "USER"
    WHERE id = $1
    `
    const value = [id]
    const userData = await pool.query(query,value)
    return userData.rows[0]
}

/**
 * Update user password by ID
 * @param {number} id
 * @param {string} hashedPassword
 * @returns {Promise<void>}
 */
export async function updatePassword(id, hashedPassword) {
    const query = `UPDATE "USER" SET password=$1 WHERE id=$2`
    await pool.query(query, [hashedPassword, id])
}

/**
 * Get user profile with picture
 * @param {number} id
 * @returns {Promise<ProfileResponse|null>}
 */
export async function getProfile(id) {
    const query = `
        SELECT 
            u.id, 
            u.fullname, 
            u.email,
            up.path AS picture
        FROM "USER" u
        LEFT JOIN LATERAL (
            SELECT path 
            FROM "USER_PICTURE" 
            WHERE user_id = u.id 
            ORDER BY id DESC 
            LIMIT 1
        ) up ON true
        WHERE u.id = $1
    `
    const result = await pool.query(query, [id])
    return result.rows[0] || null
}

/**
 * Upsert user profile picture
 * @param {number} userId
 * @param {string} path
 * @returns {Promise<void>}
 */
export async function upsertProfilePicture(userId, path) {
    const query = `
        INSERT INTO "USER_PICTURE" (user_id, path)
        VALUES ($1, $2)
        ON CONFLICT (user_id)
        DO UPDATE SET path = EXCLUDED.path
    `
    await pool.query(query, [userId, path])
}