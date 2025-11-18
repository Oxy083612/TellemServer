import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import ms from "ms";
dotenv.config({path: './DB.env'});

const REFRESH_TIME: ms.StringValue = "14d";
const VERIFICATION_TIME: ms.StringValue = "1d";
const ACCESS_TIME: ms.StringValue = '15m';
const SALT_ROUNDS: number =  10;

export enum TokenType {
    accessToken,
    refreshToken,
    verificationToken,
}

function createToken(uID: number, type: TokenType){

    const payload = { uID: uID, }; 

    switch (type) {
        case TokenType.accessToken:
            const accessSecret = process.env.JWT_ACCESS_SECRET;
            if (!accessSecret) throw new Error("JWT_ACCESS_SECRET not defined");
            return jwt.sign(
                payload, 
                accessSecret, 
                { expiresIn: ACCESS_TIME,});

        case TokenType.refreshToken:
            const refreshSecret = process.env.JWT_REFRESH_SECRET;
            if (!refreshSecret) throw new Error("JWT_ACCESS_SECRET not defined");
            return jwt.sign(
                payload,
                refreshSecret,
                { expiresIn: REFRESH_TIME });

        case TokenType.verificationToken:
            const verifySecret = process.env.JWT_VERIFY_SECRET;
            if (!verifySecret) throw new Error("JWT_ACCESS_SECRET not defined");
            return jwt.sign(
                payload,
                verifySecret,
                { expiresIn: VERIFICATION_TIME });
        
        default:
            const _exhaustiveCheck: never = type;
            return _exhaustiveCheck;
    }
}

async function encryptToken(token: string){
    const now = new Date();
    const expiration_date = new Date(now.getTime() + ms(REFRESH_TIME));
    const formattedDate = expiration_date.toISOString().slice(0, 19).replace('T', ' ');

    return await bcrypt.hash(token, SALT_ROUNDS);
}

export default { 
    createToken, 
    encryptToken };