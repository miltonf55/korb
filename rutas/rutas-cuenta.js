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



    if (!validaciones.alphaNum3(body.password)) {
        req.session.alertaModificarPassword = "Recuerda no dejar tu contraseña vacia, la longitud debe ser menor a 40 y que solo puedes escribir los caracteres Aa-Zz Áá-Úú 0-9 . ¡ ? ¿ ! @ < >";
        req.session.EditarPasswordUsuario = true;
        res.redirect("/cuenta");
    } 
    else if (body.password1 !== body.password2) {
        req.session.alertaModificarPassword = "Las nuevas contraseñas no coinciden";
        req.session.EditarPasswordUsuario = true;
        res.redirect("/cuenta");
    } else if (!validaciones.alphaNum3(body.password0)) {
        req.session.alertaModificarPassword = "Contraseña anterior incorrecta";
        req.session.EditarPasswordUsuario = true;
        res.redirect("/cuenta");
    } else {
        db.verificarPassword(req.session.body.id, req.body.password0).then(msg => {
            if (!msg) {
                req.session.alertaModificarPassword = "Contraseña anterior incorrecta";
                req.session.EditarPasswordUsuario = true;
                res.redirect("/cuenta");
            } else {
                db.actualizarPassword(req.session.body.id, req.body.password1).then(msg => {
                    req.session.EditarPasswordUsuario = undefined;
                    req.session.alertaModificarDatos = msg;
                    res.redirect("/cuenta");


                }).catch(msg => {
                    req.session.alertaModificarPassword = "Algo salio mal. Por favor intente más tarde.";
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
        if (!validaciones.letras(body.nombre)) {
            req.session.alertaModificarDatos = "Recuerda no dejar el nombre vacio, que solo puedes escribir letras  y que la longitud debe ser menor a 30 caracteres";
            req.session.EditarDatosUsuario = true;
            res.redirect("/cuenta");
        }else if ( !validaciones.letras(body.appaterno) || !validaciones.letras(body.apmaterno)) {
            req.session.alertaModificarDatos = "Recuerda no dejar tus apellidos vacios, que solo puedes escribir letras  y que la longitud debe ser menor a 30 caracteres";
            req.session.EditarDatosUsuario = true;
            res.redirect("/cuenta");
        }else if (!validaciones.correo(body.correo)) {
            req.session.alertaModificarDatos = "Recuerda no dejar tu correo vacio, la longitud debe ser menor a 40 caracteres y que solo puedes escribir letras, números, arroba y punto";
            req.session.EditarDatosUsuario = true;
            res.redirect("/cuenta");
        }else if (!validaciones.alphaNum3(body.username)) {
            req.session.alertaModificarDatos = "Recuerda no dejar tu body, la longitud debe ser menor a 40 y que solo puedes escribir los caracteres Aa-Zz Áá-Úú 0-9 . ¡ ? ¿ ! @ < >";
            req.session.EditarDatosUsuario = true;
            res.redirect("/cuenta");
        }
        else {
            db.validarCorreo(body.correo.split(" ").join("")).then(msg => {
                if (!msg && body.correo.split(" ").join("") !== req.session.body.correo) {
                    req.session.alertaModificarDatos = "El correo ingresado ya siendo usado por otro usuario";
                    req.session.EditarDatosUsuario = true;
                    res.redirect("/cuenta");
                } else {
                    db.validarUsername(body.username.split(" ").join("")).then(msg => {
                        if (!msg && body.username.split(" ").join("") !== req.session.body.username) {
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
                                req.session.alertaModificarDatos = "Datos de usuario actualizados";
                                res.redirect("/cuenta");

                            }).catch(msg => {
                                console.log(msg);
                                req.session.alertaModificarDatos = "Algo salio mal. Por favor intente más tarde.55";
                                req.session.EditarDatosUsuario = true;
                                res.redirect("/cuenta");
                            });
                        }
                    }).catch(msg => {
                        console.log(msg)
                        req.session.alertaModificarDatos = "Algo salio mal. Por favor intente más tarde.66";
                        req.session.EditarDatosUsuario = true;
                        res.redirect("/cuenta");
                    });
                }
            }).catch(msg => {
                req.session.alertaModificarDatos = "Algo salio mal. Por favor intente más tarde.";
                req.session.EditarDatosUsuario = true;
                res.redirect("/cuenta");
            })
        }

    }
});



module.exports = app;