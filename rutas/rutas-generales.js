const hbs = require("hbs");
const express = require("express");
const session = require("express-session");
const db = require("../base-datos/conexion.js");
const validaciones = require("../middlewares/validaciones.js");

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





app.get("/activaJS", (req, res) => {

    res.send("<div align='center'><br><br><font color='red'><h1 align='center'>Para poder usar ésta página activa JavaScript y regresa a la página anterior</div>");
});


app.get("/", autenticacionInversa, (req, res) => {

    res.render("landpage", {
        TituloPagina: "Bienvenido"
    });

});


app.get("/proyecciones", (req, res) => {

    if (req.session.usuario == undefined) {
        res.render("proyeccioneslogout", {
            TituloPagina: "Proyecciones"
        });
    } else if (req.session.usuario != undefined) {
        if (req.session.admin == 1) {
            res.render("proyeccioneslogin", {
                TituloPagina: "Proyecciones",
                Admin: "Si"
            });
        } else {
            res.render("proyeccioneslogin", {
                TituloPagina: "Proyecciones"
            });
        }

    }

});







module.exports = app;