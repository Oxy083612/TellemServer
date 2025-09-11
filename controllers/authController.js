const app = require('../server');
const con = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path: './DB.env'});
const sendVerificationEmail = require('../utils/sendEmail.js');

const REFRESH_TIME = 7;
const VERIFICATION_TIME = 1;
const ACCESS_TIME = 15;

async function communicate(req, res){
    res.send("Komunikat!");
}

async function refresh(req, res){
    res.send("Auaua");
}

async function verify(req, res){
    const token = req.query.token;
    try {
        if (token.length <= 0){
            return res.status(400).send({ success: false, message: "Invalid token or the account is already verified."});
        }

        const [rows] = await con.execute("SELECT user_id FROM verification_token WHERE token LIKE ?", [`%${token}%`]);

        if (rows.length === 0){
            return res.status(400).send({ success: false, message: "Token doesn't exist"});
        }

        const _userId = rows[0].user_id;

        await con.execute('UPDATE users SET is_verified = 1 WHERE id = ?', [_userId]);

        await con.execute('DELETE FROM verification_token WHERE user_id = ?', [_userId]);

        return res.status(201).send({ success: true, message: "Your account is verified. Please proceed to log in."});

    } catch(err) {
        console.error(err);
        res.status(500).send({ success: false, message: "Server error" });  
    }
}

async function login(req, res){
    const { login, password } = req.body;
    try {
        const [ rows ] = await con.execute("SELECT password, id, is_verified FROM users WHERE username = ?", [login]);

        if (!(rows.length > 0)) {
            return res.status(400).send({ success: false, message: "Data credentials are incorrect" });
        } else if (rows[0].is_verified === 0) {
            return res.status(401).send({ success: false, message: "Account is not yet verified" });
        } else if (!(await bcrypt.compare(password, rows[0].password))) {
            return res.status(400).send({ success: false, message: "Data credentials are incorrect"});
        }

        const _userId = rows[0].id;
        
        const refreshToken = jwt.sign(
            { userId: _userId},
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: REFRESH_TIME + 'd'}
        );

        const accessToken = jwt.sign(
            { userId: _userId },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: ACCESS_TIME + 'm'}
        );

        const now = new Date();
        const expiration_date = new Date(now.getTime() + 24 * 60 * 60 * 1000 * REFRESH_TIME);
        const formattedDate = expiration_date.toISOString().slice(0, 19).replace('T', ' ');

        const saltRounds = 10;
        const hashedToken = await bcrypt.hash(refreshToken, saltRounds);

        await con.execute('INSERT INTO token (user_id, token_value, expiration_date) VALUES (?, ?, ?)', [_userId, hashedToken, formattedDate]);
        
        return res.json({
            success: true,
            accessToken,
            refreshToken
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "Server error" });
    }
}

async function register(req, res){
    const { login, password, email } = req.body;
    try {
        const [emailResult] = await con.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (emailResult.length > 0){
            return res.status(400).send({ success: false, message: "E-mail is already in use" });
        }

        const [loginResult] = await con.execute('SELECT * FROM users WHERE username = ?', [login]);
        if (loginResult.length > 0){
            return res.status(400).send({ success: false, message: "Username is taken" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        await con.execute('INSERT INTO users (password, username, email, is_verified) VALUES (?, ?, ?, ?)', [hashedPassword, login, email, 0]);

        const [rows] = await con.execute('SELECT id FROM users WHERE username = ?', [login]);
        const _userId = rows[0].id;
        const verificationToken = jwt.sign(
            { userId: _userId },
            process.env.JWT_SECRET,
            { expiresIn: '1d'}
        )

        const now = new Date();
        const expiration_date = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const formattedDate = expiration_date.toISOString().slice(0, 19).replace('T', ' ');

        await con.execute('INSERT INTO verification_token (user_id, token, expiration_date) VALUES (?, ?, ?)', [_userId, verificationToken, formattedDate]);

        const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;
        await sendVerificationEmail(email, verificationLink);

        return res.status(201).send({ success: true, message: "Account created. Check your email to verify." });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "Server error" });
    }

}

module.exports = {
    communicate,
    refresh,
    verify,
    login,
    register
}