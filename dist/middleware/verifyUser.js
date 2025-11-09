import tokenLogic, { TokenType } from "../utils/tokenLogic.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: './DB.env' });
import { create } from "domain";
export var CredType;
(function (CredType) {
    CredType[CredType["CredLogin"] = 0] = "CredLogin";
    CredType[CredType["CredRegister"] = 1] = "CredRegister";
})(CredType || (CredType = {}));
function verifyToken(type) {
    let secret = "";
    switch (type) {
        case TokenType.accessToken:
            secret = process.env.JWT_ACCESS_SECRET;
            break;
        case TokenType.refreshToken:
            secret = process.env.JWT_REFRESH_TOKEN;
            break;
        case TokenType.verificationToken:
            secret = process.env.JWT_VERIFY_TOKEN;
            break;
    }
    return async (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }
        try {
            const decoded = jwt.verify(token, secret);
            req.user = decoded;
            next();
        }
        catch {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
    };
}
// verify type? verify.login, verify.register?
function verifyCredentials(type) {
    let user = null;
    return async (req, res, next) => {
        switch (type) {
            case CredType.CredLogin: {
                const { username, password } = req.body;
                user = await userModel.findUserByUsername(username);
                if (user) {
                    if (!userModel.checkIfUserIsVerified(user.id)) {
                        return res.status(400).json({
                            success: false,
                            message: "Account is not verified."
                        });
                    }
                    else {
                        userModel.verifyPassword(password, user.password);
                        req.user = user.id;
                        next();
                    }
                }
                else {
                    return res.status(400).json({
                        success: false,
                        message: "No user found."
                    });
                }
                break;
            }
            case CredType.CredRegister: {
                const { username, password, email } = req.body;
                user = await userModel.findUserByEmail(email);
                if (user) {
                    return res.status(400).json({
                        success: false,
                        message: "E-mail is already in use."
                    });
                }
                user = await userModel.findUserByUsername(username);
                if (user) {
                    return res.status(400).json({
                        success: false,
                        message: "Username is already taken."
                    });
                }
                req.body = { username, password, email };
                next();
            }
        }
    };
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
    verifyRegister
};
//# sourceMappingURL=verifyUser.js.map