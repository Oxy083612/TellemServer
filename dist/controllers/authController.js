import { TokenType } from "../utils/tokenLogic.js";
import tokenLogic from "../utils/tokenLogic.js";
import emailService from '../utils/sendEmail.js';
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config({ path: './DB.env' });
async function communicate(req, res) {
    res.status(200).send({
        success: true,
        message: "Sending confirmation from node.js server"
    });
}
async function refresh(req, res) {
    const uID = req.ID;
    try {
        const token = tokenLogic.createToken(uID, TokenType.accessToken);
        return res.status(200).json({
            success: true,
            message: "Token successfully refreshed",
            accessToken: token
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}
async function loginToken(req, res) {
    const uID = req.ID;
    try {
        const token = tokenLogic.createToken(uID, TokenType.accessToken);
        return res.status(200).json({
            success: true,
            message: "Successfully logged in",
            accessToken: token
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}
async function verify(req, res) {
    const uID = req.ID;
    try {
        if (!userModel.checkIfUserIsVerified(uID)) {
            userModel.verifyUser(uID);
            return res.status(201).send({
                success: true,
                message: "Your account is verified. Please proceed to log in."
            });
        }
        else {
            return res.status(400).send({
                success: true,
                message: "Your account is already verified"
            });
        }
    }
    catch {
        res.status(500).send({
            success: false,
            message: "Server error"
        });
    }
}
async function login(req, res) {
    const uID = req.user;
    try {
        const accessToken = tokenLogic.createToken(uID, TokenType.accessToken);
        const refreshToken = tokenLogic.createToken(uID, TokenType.refreshToken);
        return res.json({
            success: true,
            message: "Successfully logged in",
            accessToken,
            refreshToken
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "Server error" });
    }
}
async function register(req, res) {
    const { username, password, email } = req.body;
    try {
        const uID = await userModel.createUser(username, await userModel.hashPassword(password), email);
        const verificationToken = tokenLogic.createToken(uID, TokenType.verificationToken);
        userModel.createVerificationToken(uID, verificationToken);
        const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;
        await emailService.sendVerificationEmail(email, verificationLink);
        return res.status(201).send({ success: true, message: "Account created. Check your email to verify." });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "Server error" });
    }
}
export default {
    communicate,
    refresh,
    loginToken,
    verify,
    login,
    register
};
//# sourceMappingURL=authController.js.map