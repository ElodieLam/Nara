const util = require('util')
var mysql = require('mysql');

var connection = mysql.createPool({
    multipleStatements : true,
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'nara_database'
});

connection.getConnection((err, connect) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }

    if (connect) connect.release()

    return
})

connection.query = util.promisify(connection.query)

module.exports=connection;