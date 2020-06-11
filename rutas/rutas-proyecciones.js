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
app.post("/proyecciones", autenticacionInversa,(req, res) => {
    let idPro=req.body.canastaSelect;
    let date=req.body.date;
    db.numeroRegistradoProductos(idPro).then(datos => {
        var xN=datos;
        pr.valoresProyeccion(xN);
    }).catch(console.log);
    
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




module.exports = app;