//import tokenLogic, { encryptToken } from "../utils/tokenLogic.js";
import bcrypt from "bcrypt";
import pool from "../config/db.js";

const SALT_ROUNDS: number =  10;

export interface User {
  id: number;
  email: string;
  password: string;
  is_verified: boolean;
}

// find

async function findUserByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const users = rows as User[];
    return users.at(0) ?? null;
}

async function findUserByUsername(username: string): Promise<User | null> {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    const users = rows as User[];
    return users.at(0) ?? null;
}

async function findUserById(uID: number): Promise<User | null> {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [uID]);
    const users = rows as User[];
    return users.at(0) ?? null;
}

async function findUserPassword(uID: number): Promise<string | null> {
    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [uID]);
    const user = (rows as { password: string }[])[0];
    return user?.password ?? null;
}

async function checkIfUserIsVerified(uID: number): Promise<boolean> {
    const user = await findUserById(uID);
    if (!user) throw new Error("No user found to verificate.");
    return user.is_verified;
}

// create

async function createUser(username: string, password: string, email: string): Promise<number> {
    await pool.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email]);
    const user = await findUserByEmail(email);
    if (!user) throw new Error("Failed to fetch created user");
    return user.id;
}

// REFRESH TOKEN ACTUALIZATION !!

// delete

async function deleteUser(uID?: number, username?: string, email?: string): Promise<boolean> {
    let user: User | null = null;

    if(uID){
        user = await findUserById(uID);
    } else if (email) {
        user = await findUserByEmail(email);
    } else if (username) {
        user = await findUserByUsername(username);
    }

    if(!user) {
        console.log("User not found");
        return false;
    }

    await pool.query("DELETE FROM users WHERE id = ?", [user.id]);
    console.log("Deleted user with id: ${user.id}");
    return true;
}

// update
async function createVerificationToken(uID: number, verificationToken: string): Promise<void> {
    const now = new Date();
    const expiration_date = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const formattedDate = expiration_date.toISOString().slice(0, 19).replace('T', ' ');
    await pool.query("INSERT INTO verification_token (user_id, token, expiration_date) VALUES (?, ?, ?)", [uID, verificationToken, formattedDate]);
}

async function verifyUser(uID: number): Promise<void> {
    await pool.query("UPDATE users SET is_verified = 1 WHERE id = ?", uID);
}

// utils

function hashPassword(password: string) {
    return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hashedPassword: string){
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
    verifyPassword };