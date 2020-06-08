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






app.get("/foro", autenticacion, (req, res) => {

    if (req.session.usuario == undefined) {
        res.render("proyeccioneslogout", {
            TituloPagina: "Proyecciones"
        });
    } else if (req.session.usuario != undefined) {
        if (req.session.admin == 1) {
            res.render("foro", {
                TituloPagina: "Foro de Discusion",
                Admin: "Si",
                script: "assets/js/socket-cliente.js"
            });
        } else {
            res.render("foro", {
                TituloPagina: "Foro de Discusión",
                script: "assets/js/socket-cliente.js"
            });
        }

    }

});

module.exports = app;