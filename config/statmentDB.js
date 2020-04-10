const c = require('./dbConnection.js');

//Conexión a la db
var con = c.Connect;
//Query
exports.pruebaDB = function (callback) {
    con.query('SELECT * FROM producto', function (err, results) {      
        if(err) console.log("Error al realizar el query: "+err);
        callback(err, results);
    });
}

