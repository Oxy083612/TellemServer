import express from "express";
import authController from "../controllers/authController.js";
import verifyUser from "../middleware/verifyUser.js";
const router = express.Router();
router.get('/communicate', authController.communicate);
router.get('/verify/:token', verifyUser.verifyVerificationToken, authController.verify);
router.post('/refresh', verifyUser.verifyRefreshToken, authController.refresh);
router.post('/loginToken/:token', verifyUser.verifyAccessToken, authController.loginToken);
router.post('/login', verifyUser.verifyCredentials, authController.login);
router.post('/register', authController.register);
export default router;
//# sourceMappingURL=auth.js.map