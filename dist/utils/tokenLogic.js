import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import ms from "ms";
dotenv.config({ path: './DB.env' });
const REFRESH_TIME = "14d";
const VERIFICATION_TIME = "1d";
const ACCESS_TIME = '15m';
const SALT_ROUNDS = 10;
export var TokenType;
(function (TokenType) {
    TokenType[TokenType["accessToken"] = 0] = "accessToken";
    TokenType[TokenType["refreshToken"] = 1] = "refreshToken";
    TokenType[TokenType["verificationToken"] = 2] = "verificationToken";
})(TokenType || (TokenType = {}));
function createToken(uID, type) {
    const payload = { ID: uID, };
    switch (type) {
        case TokenType.accessToken:
            const accessSecret = process.env.JWT_ACCESS_SECRET;
            if (!accessSecret)
                throw new Error("JWT_ACCESS_SECRET not defined");
            return jwt.sign(payload, accessSecret, { expiresIn: ACCESS_TIME, });
        case TokenType.refreshToken:
            const refreshSecret = process.env.JWT_REFRESH_SECRET;
            if (!refreshSecret)
                throw new Error("JWT_ACCESS_SECRET not defined");
            return jwt.sign(payload, refreshSecret, { expiresIn: REFRESH_TIME });
        case TokenType.verificationToken:
            const verifySecret = process.env.JWT_VERIFY_SECRET;
            if (!verifySecret)
                throw new Error("JWT_ACCESS_SECRET not defined");
            return jwt.sign(payload, verifySecret, { expiresIn: VERIFICATION_TIME });
        default:
            const _exhaustiveCheck = type;
            return _exhaustiveCheck;
    }
}
async function encryptToken(token) {
    const now = new Date();
    const expiration_date = new Date(now.getTime() + ms(REFRESH_TIME));
    const formattedDate = expiration_date.toISOString().slice(0, 19).replace('T', ' ');
    return await bcrypt.hash(token, SALT_ROUNDS);
}
export default {
    createToken,
    encryptToken
};
//# sourceMappingURL=tokenLogic.js.map