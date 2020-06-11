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



app.get("/proyecciones", (req, res) => {

    if (req.session.usuario == undefined) {
        res.render("proyeccioneslogout", {
            TituloPagina: "Proyecciones"
        });
    } else if (req.session.usuario != undefined) {
        if (req.session.admin == 1) {
            res.render("proyeccioneslogin", {
                TituloPagina: "Proyecciones",
                Admin: "Si",
                script: "assets/js/app3.js"
            });
        } else {
            res.render("proyeccioneslogin", {
                TituloPagina: "Proyecciones"
            });
        }

    }

});
app.post("/proyecciones", (req, res) => {

    if (req.session.usuario == undefined) {
        res.render("proyeccioneslogout", {
            TituloPagina: "Proyecciones"
        });
        console.log(req.body.canastaSelect);
        console.log(req.body.date);
    } else if (req.session.usuario != undefined) {
        if (req.session.admin == 1) {
            res.render("proyeccioneslogin", {
                TituloPagina: "Proyecciones",
                Admin: "Si",
                script: "assets/js/app3.js"
            });
        } else {
            res.render("proyeccioneslogin", {
                TituloPagina: "Proyecciones"
            });
        }

    }

});




module.exports = app;