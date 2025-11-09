import { TokenType } from "../utils/tokenLogic.js";
import type { User } from "../models/userModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

import { getEnv } from "../config/config.js";

import type { Response, Request, NextFunction } from "express";

export enum CredType {
    CredLogin,
    CredRegister
}

interface Message {
    success: boolean;
    message: string;
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
            (req as any).ID = decoded.ID;
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
    return async (req: Request, res: Response, next: NextFunction) => {
        switch (type){
            case CredType.CredLogin: {
                const { username, password } = (req as any).body;
                user = await userModel.findUserByUsername(username);
                if(user){
                    if(!userModel.checkIfUserIsVerified(user.id)){
                        return res.status(400).json({
                            success: false,
                            message: "Account is not verified."})
                    } else {
                        userModel.verifyPassword(password, user.password);
                        (req as any).user = user.id;
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
                const { username, password, email } = (req as any).body;
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
                (req as any).body = { username, password, email };
                next();
            }
        }
    }
}

const verifyAccessToken = verifyToken(TokenType.accessToken);
const verifyRefreshToken = verifyToken(TokenType.refreshToken);
const verifyVerificationToken = verifyToken(TokenType.verificationToken);

const verifyLogin = verifyCredentials(CredType.CredLogin);
const verifyRegister = verifyCredentials(CredType.CredRegister);

export default {    
    verifyAccessToken, 
    verifyRefreshToken, 
    verifyVerificationToken,
    verifyCredentials,
    verifyLogin,
    verifyRegister };