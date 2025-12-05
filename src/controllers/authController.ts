import { TokenType } from "../utils/tokenLogic.js";

import tokenLogic from "../utils/tokenLogic.js"
import emailService from '../utils/sendEmail.js';
import userModel from "../models/userModel.js";

import type { Response, Request } from "express";

interface Message {
    success: boolean;
    message: string;
    uID?: number;
    accessToken?: string;
    accessTokenValidDate?: string;
    refreshToken?: string;
    refreshTokenValidDate?: string;
}

interface CredRequest {
    login: string;
    password: string;
    email?: string;
}

async function communicate(req: Request, res: Response<Message>){
    res.status(200).send({
        success: true,
        message: "Sending confirmation from node.js server"
    });
}

async function refresh(req: Request, res: Response<Message>){
    const uID = req.uID!;
    try {
        const token = tokenLogic.createToken(uID, TokenType.accessToken);
        const now = new Date();
        const accessTokenExpires = new Date(now.getTime() + 60 * 60 * 1000);
        return res.status(200).json({
            success: true,
            message: "Token successfully refreshed",
            accessToken: token,
            accessTokenValidDate: accessTokenExpires.toISOString().slice(0,19)
        })
    } catch {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

async function loginToken(req: Request, res: Response<Message>){
    const uID = req.uID!;
    try {
        const token = tokenLogic.createToken(uID, TokenType.accessToken);
        const now = new Date();
        const accessTokenExpires = new Date(now.getTime() + 60 * 60 * 1000);
        return res.status(200).json({
            success: true,
            message: "Successfully logged in",
            accessToken: token,
            accessTokenValidDate: accessTokenExpires.toISOString().slice(0,19)
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

async function verify(req: Request, res: Response<Message>){
    const uID = req.uID!;
    console.log("ID UŻYTKOWNIKA: " + uID);
    try {   
        if(!(await userModel.checkIfUserIsVerified(uID))){
            userModel.verifyUser(uID);
            return res.status(201).send({
                success: true, 
                message: "Your account is verified. Please proceed to log in."
            });
        } else {
            return res.status(400).send({
                success: false, 
                message: "Your account is already verified"
            });
        }
    } catch {
        res.status(500).send({ 
            success: false, 
            message: "Server error" });  
    }
}

async function login(req: Request, res: Response<Message>){
    const uID = req.uID!;
    try {
        const accessToken = tokenLogic.createToken(uID, TokenType.accessToken);
        const refreshToken = tokenLogic.createToken(uID, TokenType.refreshToken);

        const now = new Date();
        const accessTokenExpires = new Date(now.getTime() + 60 * 60 * 1000);
        const refreshTokenExpires = new Date(now.getTime() + 24 * 60 * 60 * 1000);


        return res.status(200).send({
            success: true,
            message: "Successfully logged in",
            uID,
            accessToken,
            accessTokenValidDate: accessTokenExpires.toISOString().slice(0,19),            
            refreshToken,
            refreshTokenValidDate: refreshTokenExpires.toISOString().slice(0,19)
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "Server error" });
    }
}

async function register(req: Request, res: Response<Message>){
    const { username, password, email } = req.body;
    try {
        const uID: number = await userModel.createUser(username, await userModel.hashPassword(password), email);
        const verificationToken = tokenLogic.createToken(uID, TokenType.verificationToken); 
        userModel.createVerificationToken(uID, verificationToken);
        const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;

        await emailService.sendVerificationEmail(email, verificationLink);

        return res.status(201).send({ success: true, message: "Account created. Check your email to verify." });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "Server error" });
    }

}

async function resend(req: Request, res: Response<Message>){
    const uID = req.uID;
    const email = req.email;
    try {
        const verificationToken = tokenLogic.createToken(uID!!, TokenType.verificationToken); 
        userModel.createVerificationToken(uID!!, verificationToken);
        const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;
        await emailService.sendVerificationEmail(email!!, verificationLink);
        return res.status(201).send({ success: true, message: "Account created. Check your email to verify." });
    } catch (err) {
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
    register,
    resend };