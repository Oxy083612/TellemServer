import express from "express";
import authController from "../controllers/authController.js";
import verifyUser from "../middleware/verifyUser.js";

const router = express.Router();

interface Message {
    success: boolean;
    message: string;
    accessToken?: string;
    refreshToken?: string;
}

interface TokenRequest {
    token: string;
}

router.get('/communicate', authController.communicate);
router.get('/verify', verifyUser.verifyVerificationToken, authController.verify);
router.post('/refresh', verifyUser.verifyRefreshToken, authController.refresh);
router.post('/loginToken', verifyUser.verifyAccessToken, authController.loginToken);
router.post('/login', verifyUser.verifyLogin, authController.login);
router.post('/register', verifyUser.verifyRegister, authController.register);

export default router;