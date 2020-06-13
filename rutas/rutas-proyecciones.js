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
            TituloPagina: "Proyecciones",
            script: "assets/js/app5.js"
        });
    } else if (req.session.usuario != undefined) {
        if (req.session.admin == 1) {
            res.render("proyeccioneslogin", {
                TituloPagina: "Proyecciones",
                Admin: "Si",
                script: "assets/js/app5.js"
            });
        } else {
            res.render("proyeccioneslogin", {
                TituloPagina: "Proyecciones",
                script: "assets/js/app5.js"
            });
        }

    }

});

app.post("/proyectoX", (req, res) => {
    let body = req.body;
    let data = {
        id: body.id,
        date: body.date
    };
    if (data.id<39&&data.id>0) {
        if (validaciones.validarDate(data.date)) {
            db.numeroRegistradoProductos(data.id).then(data2 => {
                var xN = data2.map(obj => obj.regCount);
                db.obtenerCostosCB(data.id).then(data1 => {
                    var y = data1.map(obj => obj.can_pre);
                    var r=pr.valoresProyeccion(xN, y);
                    res.json({
                        ok: true,
                        proyeccion: r
                    });
                }).catch(err => {
                        res.json({
                            ok: false,
                            ms: "Algo salio mal. Por favor intente más tarde."
                        })
                    });
            }).catch(err => {
                res.json({
                    ok: false,
                    ms: "Algo salio mal. Por favor intente más tarde."
                })
            });
        }else{
            res.json({
                ok: false,
                ms: "Hay un problema con la fecha, vuelve a intentar."
            });
        }
    }
    else{
        res.json({
            ok: false,
            ms: "Ya te sientes hacker moviendole al html, pero nel"
        });
    }
    
});




module.exports = app;