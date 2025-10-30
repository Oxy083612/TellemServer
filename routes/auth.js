const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/communicate', authController.communicate);
router.get('/verify', authController.verify);
router.post('/loginToken', authController.loginToken);
router.post('/refresh', authController.refresh);
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;