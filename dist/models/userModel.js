//import tokenLogic, { encryptToken } from "../utils/tokenLogic.js";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
const SALT_ROUNDS = 10;
// find
async function findUserByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const users = rows;
    return users.at(0) ?? null;
}
async function findUserByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    const users = rows;
    return users.at(0) ?? null;
}
async function findUserById(uID) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [uID]);
    const users = rows;
    return users.at(0) ?? null;
}
async function findUserPassword(uID) {
    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [uID]);
    const user = rows[0];
    return user?.password ?? null;
}
async function checkIfUserIsVerified(uID) {
    const user = await findUserById(uID);
    if (!user)
        return false;
    return user.is_verified;
}
// create
async function createUser(username, password, email) {
    await pool.query('INSERT INTO users (password, username, email) VALUES (?, ?, ?)', [hashPassword(password), username, email]);
    const user = await findUserByEmail(email);
    if (!user)
        throw new Error("Failed to fetch created user");
    return user.id;
}
// REFRESH TOKEN ACTUALIZATION !!
// delete
async function deleteUser(uID, username, email) {
    let user = null;
    if (uID) {
        user = await findUserById(uID);
    }
    else if (email) {
        user = await findUserByEmail(email);
    }
    else if (username) {
        user = await findUserByUsername(username);
    }
    if (!user) {
        console.log("User not found");
        return false;
    }
    await pool.query("DELETE FROM users WHERE id = ?", [user.id]);
    console.log("Deleted user with id: ${user.id}");
    return true;
}
// update
async function createVerificationToken(uID, verificationToken) {
    const now = new Date();
    const expiration_date = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const formattedDate = expiration_date.toISOString().slice(0, 19).replace('T', ' ');
    await pool.query("INSERT INTO verification_token (user_id, token, expiration_date) VALUES (?, ?, ?)", [uID, verificationToken, formattedDate]);
}
async function verifyUser(uID) {
    await pool.query("UPDATE users SET is_verified = 1 WHERE id = ?", uID);
}
// utils
function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}
export default {
    findUserByEmail,
    findUserByUsername,
    findUserById,
    findUserPassword,
    createUser,
    deleteUser,
    verifyUser,
    checkIfUserIsVerified,
    createVerificationToken,
    hashPassword,
    verifyPassword
};
//# sourceMappingURL=userModel.js.map