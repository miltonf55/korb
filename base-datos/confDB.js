const mysql = require("mysql");

//Configuración de la conexión a la db hosteada
var confCon={
    connectionLimit:10,
	host:'us-cdbr-iron-east-01.cleardb.net',
	user:'ba36d017d9e475',
	password:'2e5db296',
	database:'heroku_7a19aa0bce95bcf'
};
var pool= mysql.createPool(confCon);
pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});
pool.on('connection', function (connection) {
    connection.query('SET SESSION auto_increment_increment=1')
});