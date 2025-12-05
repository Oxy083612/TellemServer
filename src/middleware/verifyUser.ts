import { TokenType } from "../utils/tokenLogic.js";
import type { User } from "../models/userModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

import { getEnv } from "../config/config.js";

import type { Response, Request, NextFunction } from "express";

export enum CredType {
    CredLogin,
    CredRegister,
    CredResend
}

interface AccessLogic {
    username: string;
    password: string;
    email?: string;
}

function verifyToken(type: TokenType) {
    let secret = "";

    switch (type) {
    case TokenType.accessToken:
        secret = process.env.JWT_ACCESS_SECRET!;
        break;
    case TokenType.refreshToken:
        secret = process.env.JWT_REFRESH_SECRET!;
        break;
    case TokenType.verificationToken:
        secret = process.env.JWT_VERIFY_SECRET!;
        break;
    }

    return async (req: Request, res: Response, next: NextFunction) => {
        let token: string | undefined;
        if(type == TokenType.verificationToken){
            token = req.query.token as string;
        } else {
            token = req.headers.authorization?.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        try {
            const decoded = jwt.verify(token, secret) as JwtPayload;
            req.uID = decoded.uID;
            next();
        } catch(err){
            return res.status(403).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
    }
}

// verify type? verify.login, verify.register?
function verifyCredentials(type: CredType){
    let user: User | null = null;
    return async (req: Request<AccessLogic>, res: Response, next: NextFunction) => {
        switch (type){
            case CredType.CredLogin: {
                const { username, password }  = req.body as AccessLogic;
                user = await userModel.findUserByUsername(username);
                if(user){
                    if(!(await userModel.verifyPassword(password, user.password))){
                        return res.status(400).json({
                            success: false,
                            message: "Incorrect credentials."})
                    }
                    if(!(await userModel.checkIfUserIsVerified(user.id))){
                        console.log("NOT VERIFIED");
                        return res.status(403).json({
                            success: false,
                            message: "Account is not verified."})
                    } else {
                        req.uID = user.id;
                        next();
                    }
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "No user found."})
                }
                break;
            }
            case CredType.CredRegister: {
                const { username, password, email } = req.body as AccessLogic;
                
                if((username == undefined || username == null) || !username.match("^.{8,}$")){
                    return res.status(400).json({
                        success: false,
                        message: "No username given or it's incorrect."})
                }

                if((password == undefined || password == null) || !password.match("^(?=.*[A-Z]).{8,}$")){
                    return res.status(400).json({
                        success: false,
                        message: "No password given or it's incorrect."})
                }

                if((email == undefined || email == null) || !email.match("^[^@\\s]+@[^@\\s]+\\.[^@\\s]{2,}$")){
                    return res.status(400).json({
                        success: false,
                        message: "No E-mail given or it's incorrect."})
                }

                user = await userModel.findUserByEmail(email);
                
                if(user){
                    return res.status(400).json({
                        success: false,
                        message: "E-mail is already in use."})
                }
                user = await userModel.findUserByUsername(username);
                if(user){
                    return res.status(400).json({
                        success: false,
                        message: "Username is already taken."
                    })
                }
                req.body = { username, password, email };
                next();
            }
            case CredType.CredResend: {
                const { username } = req.body;
                user = await userModel.findUserByUsername(username);
                if (user) {
                    if((await userModel.checkIfUserIsVerified(user.id))) {
                        
                        return res.status(400).json({
                            success: false,
                            message: "Account is already verified."})
                    }
                    req.uID = user.id;
                    req.email = user.email;
                    next();
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Incorrect credentials."})
                }
                break;
            }
        }
    }
}

const verifyAccessToken = verifyToken(TokenType.accessToken);
const verifyRefreshToken = verifyToken(TokenType.refreshToken);
const verifyVerificationToken = verifyToken(TokenType.verificationToken);

const verifyLogin = verifyCredentials(CredType.CredLogin);
const verifyRegister = verifyCredentials(CredType.CredRegister);
const verifyResend = verifyCredentials(CredType.CredResend);

export default {    
    verifyAccessToken, 
    verifyRefreshToken, 
    verifyVerificationToken,
    verifyCredentials,
    verifyLogin,
    verifyRegister,
    verifyResend };