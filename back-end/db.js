var mysql = require('mysql');

var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'nara_database'
});
module.exports=connection;