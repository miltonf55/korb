const express = require("express");
const mysql=require('mysql');
var app = express();
const http = require("http").Server(app);
//Configuración del puerto
app.set("port", (process.env.PORT || 5555));
http.listen(app.get("port"), function() {
	console.log("Servidor en el puerto", app.get("port"));
});
//Configuración de la conexión a la db hosteada
var confCon={
    connectionLimit:10,
	host:'us-cdbr-iron-east-01.cleardb.net',
	user:'ba36d017d9e475',
	password:'2e5db296',
	database:'heroku_7a19aa0bce95bcf'
};
var conP= mysql.createPool(confCon);
conP.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
  });
conP.on('connection', function (connection) {
    connection.query('SET SESSION auto_increment_increment=1')
  });
//
//Directorio donde se guardan todos los archivos estaticos, ya sea un html, imagenes, etc.
app.use(express.static("public"));

app.get("/", function(req, res) {

});

//Metodos de la app
app.get("/PruebaDB", function(req, res) {
    pruebaDB(function (err,data){
        id = data.map(obj => obj.id_pro);
        producto = data.map(obj => obj.nom_pro);
        console.log(id);
        res.send(producto);
    });
});
//Query
function pruebaDB(callback) {
    conP.query('SELECT * FROM producto', function (err, results) {      
        if(err) console.log("Error al realizar el query: "+err);
        callback(err, results);
    });
}
//IMPORTANTE: ESTOS METODOS PARA MANEJAR ERRORES VAN AL FINAL DE TODO
//Erro 404, page not found
app.use(function(req, res, next) {
    res.status(404).send("Error 404 - No existe esa página my friend");
});
//error 500, algo esta mal con la app y se murio jsjsjsjs
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Error 500 - Something is clearly wrong!');
});