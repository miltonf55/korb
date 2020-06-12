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
/*app.post("/proyecciones", autenticacionInversa,(req, res) => {
    let idPro=req.body.canastaSelect;
    let date=req.body.date;
    db.numeroRegistradoProductos(idPro).then(data => {
        var xN = data.map(obj => obj.regCount);
        db.obtenerCostosCB(idPro).then(data1 => {
            var y = data1.map(obj => obj.can_pre);
            var r=pr.valoresProyeccion(xN, y);
            console.log(r);
        }).catch(console.log);
    }).catch(console.log);
    
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

});*/

app.post("/proyectoX", autenticacion, (req, res) => {
    let body = req.body;
    let data = {
        id: body.id,
        date: body.date
    };
    db.numeroRegistradoProductos(data.id).then(data2 => {
        var xN = data2.map(obj => obj.regCount);
        db.obtenerCostosCB(data.id).then(data1 => {
            var y = data1.map(obj => obj.can_pre);
            var r=pr.valoresProyeccion(xN, y);
            console.log(r);
            res.json({
                ok: true,
                mensaje: "Datos guardados correctamente"
            });
        }).catch(console.log);
    }).catch(console.log);
});




module.exports = app;