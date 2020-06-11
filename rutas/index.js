const hbs = require("hbs");
const express = require("express");
const session = require("express-session");
const db = require("../base-datos/conexion.js");
const validaciones = require("../middlewares/validaciones.js");
const pr = require("../middlewares/proyeccion.js");

const {
    autenticacion,
    autenticacionInversa,
    verificarPrivilegiosAdmin,
    verificarPrivilegiosUsuario
} = require("../middlewares/autenticacion.js");

const {
    cifrar,
    decifrar
} = require("../middlewares/cifrado.js");


const app = express();



//Instanciar rutas de sesión
app.use(require("./rutas-sesion.js"));

//Instancair rutas de cuenta
app.use(require("./rutas-cuenta.js"));

//Instanciar rutas de gestion de usuarios del admin
app.use(require("./rutas-admin-cuentas.js"));

//Instanciar las rutas generales
app.use(require("./rutas-generales.js"));

//Instanciar rutas del foro
app.use(require("./rutas-foro.js"));

//Instanciar rutas de salario
app.use(require("./rutas-salario.js"));

//Instanciar rutas de administración de precios
app.use(require("./rutas-precios.js"))

//Instanciar rutas de proyecciones
app.use(require("./rutas-proyecciones.js"));








module.exports = app;