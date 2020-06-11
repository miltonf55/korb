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



app.get("/cuenta", autenticacion, (req, res) => {
    if (req.session.admin == 1) {
        res.render("cuenta", {
            TituloPagina: "Datos de la Cuenta",
            Admin: "Si",
            Datos: req.session.usuario,
            EditarDatosUsuario: req.session.EditarDatosUsuario,
            EditarPasswordUsuario: req.session.EditarPasswordUsuario,
            AlertaModificarDatos: req.session.alertaModificarDatos,
            AlertaModificarPassword: req.session.alertaModificarPassword
        });
    } else {
        res.render("cuenta", {
            TituloPagina: "Datos de la Cuenta",
            Datos: req.session.usuario,
            EditarDatosUsuario: req.session.EditarDatosUsuario,
            EditarPasswordUsuario: req.session.EditarPasswordUsuario,
            AlertaModificarDatos: req.session.alertaModificarDatos,
            AlertaModificarPassword: req.session.alertaModificarPassword
        });
    }
    req.session.alertaModificarDatos = undefined;
    req.session.EditarDatosUsuario = undefined;
    req.session.alertaModificarPassword = undefined;
    req.session.EditarPasswordUsuario = undefined;

});


app.get("/editarDatos", autenticacion, (req, res) => {
    req.session.EditarDatosUsuario = true;
    res.redirect("/cuenta");
});

app.get("/editarPassword", autenticacion, (req, res) => {
    req.session.EditarPasswordUsuario = true;
    res.redirect("/cuenta");
});



app.post("/editarPassword", autenticacion, (req, res) => {

    let body = req.body;



    if (body.password0.split(" ").join("") === "" || body.password1.split(" ").join("") === "" || body.password2.split(" ").join("") === "") {
        req.session.alertaModificarPassword = "No puedes dejar campos en blanco";
        req.session.EditarPasswordUsuario = true;
        res.redirect("/cuenta");
    } else if (!validaciones.alphaNumC(body.password2) || !validaciones.alphaNumC(body.password1)) {
        req.session.alertaModificarPassword = "Solo se permiten los caracteres Aa-Zz Áá-Úú 0-9 . ¡ ? ¿ ! @";
        req.session.EditarPasswordUsuario = true;
        res.redirect("/cuenta");
    } else if (body.password1 !== body.password2) {
        req.session.alertaModificarPassword = "Las nuevas contraseñas no coinciden";
        req.session.EditarPasswordUsuario = true;
        res.redirect("/cuenta");
    } else if (!validaciones.alphaNumC(body.password0)) {
        req.session.alertaModificarPassword = "Contraseña anterior incorrecta";
        req.session.EditarPasswordUsuario = true;
        res.redirect("/cuenta");
    } else {
        db.verificarPassword(req.session.usuario.id, req.body.password0).then(msg => {
            if (!msg) {
                req.session.alertaModificarPassword = "Contraseña anterior incorrecta";
                req.session.EditarPasswordUsuario = true;
                res.redirect("/cuenta");
            } else {
                db.actualizarPassword(req.session.usuario.id, req.body.password1).then(msg => {
                    req.session.EditarPasswordUsuario = undefined;
                    req.session.alertaModificarDatos = msg;
                    res.redirect("/cuenta");


                }).catch(msg => {
                    req.session.alertaModificarPassword = "Ha ocurrido un error inesperado, vuelve a intentarlo porfavor";
                    req.session.EditarPasswordUsuario = true;
                    res.redirect("/cuenta");
                });
            }
        }).catch(msg => {

        });
    }





});

app.post("/editarDatos", autenticacion, (req, res) => {
    let body = req.body;
    if (body.nombre != undefined && body.appaterno != undefined && body.apmaterno != undefined && body.username != undefined && body.correo != undefined) {
        if (body.nombre.split(" ").join("") === "" || body.appaterno.split(" ").join("") === "" || body.apmaterno.split(" ").join("") === "" ||
            body.username.split(" ").join("") === "" || body.correo.split(" ").join("") === "") {

            req.session.alertaModificarDatos = "No puedes dejar campos en blanco";
            req.session.EditarDatosUsuario = true;
            res.redirect("/cuenta");

        } else if (!validaciones.alphaNumC(body.nombre) || !validaciones.alphaNumC(body.appaterno) || !validaciones.alphaNumC(body.apmaterno) ||
            !validaciones.alphaNumC(body.username) || !validaciones.alphaNumC(body.correo)) {

            req.session.alertaModificarDatos = "Solo se permiten los caracteres Aa-Zz Áá-Úú 0-9 . ¡ ? ¿ ! @";
            req.session.EditarDatosUsuario = true;
            res.redirect("/cuenta");

        } else {
            db.validarCorreo(body.correo.split(" ").join("")).then(msg => {


                if (!msg && body.correo.split(" ").join("") !== req.session.usuario.correo) {
                    req.session.alertaModificarDatos = "El correo ingresado ya siendo usado por otro usuario";
                    req.session.EditarDatosUsuario = true;
                    res.redirect("/cuenta");
                } else {
                    db.validarUsername(body.username.split(" ").join("")).then(msg => {
                        if (!msg && body.username.split(" ").join("") !== req.session.usuario.username) {
                            req.session.alertaModificarDatos = "El nombre de usuario ingresado ya siendo usado por otro usuario";
                            req.session.EditarDatosUsuario = true;
                            res.redirect("/cuenta");
                        } else {
                            let datos = {
                                nombre: body.nombre,
                                appaterno: body.appaterno,
                                apmaterno: body.apmaterno,
                                correo: body.correo,
                                username: body.username
                            }

                            db.actualizarDatosUsuario(req.session.usuario.id, datos).then(msg => {
                                req.session.usuario = msg;
                                req.session.EditarDatosUsuario = undefined;
                                req.session.alertaModificarDatos = "Datos de Usuario Actualizados";
                                res.redirect("/cuenta");

                            }).catch(msg => {
                                console.log(msg);
                                req.session.alertaModificarDatos = "Ha ocurrido un error inesperado, intentalo de nuevo";
                                req.session.EditarDatosUsuario = true;
                                res.redirect("/cuenta");
                            });
                        }
                    }).catch(msg => {
                        req.session.alertaModificarDatos = "Ha ocurrido un error inesperado, vuelve a intentarlo";
                        req.session.EditarDatosUsuario = true;
                        res.redirect("/cuenta");
                    });
                }
            }).catch(msg => {
                req.session.alertaModificarDatos = "Ha ocurrido un error inesperado, vuelve a intentarlo";
                req.session.EditarDatosUsuario = true;
                res.redirect("/cuenta");
            })
        }

    }
});



module.exports = app;