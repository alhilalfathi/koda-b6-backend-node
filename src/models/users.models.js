/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} fullname
 * @property {string} email
 * @property {string} password
 * 
 */

/**
 * @type {User[]}
 */
const userData = []

let incrementID = userData.length + 1

/**
 * 
 * @param {User} data 
 * @returns {User}
 */
export function createUser(data) {
    const id = incrementID++
    const newData = {
    id,
    ...data
}
    userData.push(newData)
    return newData
}


/**
 * 
 * @returns {User[]}
 */
export function getAllUsers() {
    return userData
}

/**
 * 
 * @param {number} id 
 * @returns {User}
 */
export function getUserByID(id) {
    const found = userData.find((user)=> user.id === id)
    if (found){
        return found
    }else {
        throw new Error("user not found")
    }
}

/**
 * 
 * @param {number} id 
 * @param {Partial<User>} data 
 */
export function updateUser(id, data) {
    const foundIndex = userData.findIndex((user)=> user.id === id)
    if (foundIndex === -1) {
        return null
    }
    userData[foundIndex] = {
        ...userData[foundIndex],
        ...data
    }
    return userData
}