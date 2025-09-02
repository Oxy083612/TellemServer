const con = require('./config/db.js');

// loggin in function that checks if the user that is trying to connect is giving right login credentials
function logger(login, password){
    console.log("LOGOWANIE");
    con.query(`SELECT password FROM users WHERE username LIKE '` + login + `'`, (err, result, fields) => {
        if (err) throw err;
        console.log(result);
        if (Object.keys(result).length === 0){
            // checking if the password is incorrect
            return false;
        } else if (result[0].password != password){
            // additional condition, if the login is the same as the other users
            return false;
        } else {
            // credentials are confirmed
            console.log('logowanie powiodlo sie');
            return true;
        }
    });
}

module.exports = logger;