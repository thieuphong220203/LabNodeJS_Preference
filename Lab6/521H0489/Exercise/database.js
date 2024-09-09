const {HOST, USER, DATABASE} = process.env
const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'nodejs_lab_6_7'
});

module.exports=connection