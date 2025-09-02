const dotenv = require('dotenv');
dotenv.config({path: './DB.env'});
const mysql = require('mysql2/promise');
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

// connecting to database

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sruba321',
    database: 'tellemdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;