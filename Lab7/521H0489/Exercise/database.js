const mysql = require('mysql');
const connection = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    database: "nodejs_lab_6_7",
    dialect: 'mysql',
    logging: false
});

module.exports = connection