//Archivos de configuración
require("./config/config");
require("./helpers/helpers");


//Invocación de librerias
const hbs = require("hbs");
const express = require("express");
const session = require("express-session");
const body_parser = require('body-parser');
const app = express();


//No se que es, pero ayuda a recuperar los datos del post
app.use(body_parser.urlencoded({
    extended: true
}));


//Asignar las sessions
app.use(session({
    secret: "ESTO ES SECRETO",
    resave: true,
    saveUninitialized: true
}));

//Asignar el directorio estático(para imágenes,css, etc)
app.use(express.static(__dirname + "/public"));


//Asignar la carpeta en la que se asignaran las vistas
hbs.registerPartials(__dirname + "/views/partials/");

//Asignar el motor de vistas
app.set("view engine", "hbs");

//Asignar donde estan nuestras rutas
app.use(require("./rutas/index.js"));



app.listen(process.env.PORT, () => {
    console.log("Escuchando en ", process.env.PORT);
});