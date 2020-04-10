const express = require("express");
var app = express();
const http = require("http").Server(app);
const db = require ('./config/statmentDB.js');

//Configuración del puerto
app.set("port", (process.env.PORT || 5555));
http.listen(app.get("port"), function() {
	console.log("Servidor en el puerto", app.get("port"));
});

//Directorio donde se guardan todos los archivos estaticos, ya sea un html, imagenes, etc.
app.use(express.static("public"));

app.get("/", function(req, res) {

});

//Metodos de la app
app.get("/PruebaDB", function(req, res) {
    db.pruebaDB(function (err,data){
        id = data.map(obj => obj.id_pro);
        producto = data.map(obj => obj.nom_pro);
        console.log(id);
        res.send(producto);
    });
});

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