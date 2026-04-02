import jwt from "jsonwebtoken";

const SECRET = process.env.APP_SECRET || "appsecret"

/**
 * @typedef {Object} Payload
 * @property {number} id 
 */
/**
 * 
 * @param {Payload} payload
 */
export function GenerateToken(payload){
    return jwt.sign(payload, SECRET)
}

/**
 * 
 * @param {string} token 
 * @returns {Payload}
 */
export function VerifyToken(token){
    try{
        const payload = jwt.verify(token, SECRET)
        return payload
    }catch{
        return null
    }
}