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




app.get("/gestionUsuarios", autenticacion, verificarPrivilegiosAdmin, (req, res) => {

    req.session.datosParaValidar = undefined;
    req.session.idGuardarCambios = undefined;

    if (req.session.admin == 1) {

        db.obtenerUsuarios(req.session.usuario.id).then(msg => {
            if (req.session.usuariosFiltrados) {
                res.render("gestion-usuarios", {
                    Filtro: req.session.filtro,
                    TituloPagina: "Gestion de Usuarios",
                    Admin: "Si",
                    Usuarios: req.session.usuariosFiltrados,
                    ExitoEliminacionUsuario: req.session.ExitoMensajeEliminacionUsuario,
                    ErrorEliminacionUsuario: req.session.ErrorEliminacionUsuario

                });
            } else {
                res.render("gestion-usuarios", {

                    TituloPagina: "Gestion de Usuarios",
                    Admin: "Si",
                    Usuarios: msg,
                    ExitoEliminacionUsuario: req.session.ExitoMensajeEliminacionUsuario,
                    ErrorEliminacionUsuario: req.session.ErrorEliminacionUsuario

                });
            }

            req.session.ExitoMensajeEliminacionUsuario = undefined;
            req.session.ErrorEliminacionUsuario = undefined;
        }).catch(msg => {
            console.log(msg)
            res.render("gestion-usuarios", {

                TituloPagina: "Gestion de Usuarios",
                Admin: "Si",
                MensajeEliminacionUsuario: req.session.MensajeEliminacionUsuario,
                MensajeError: "Ha ocurrido un error inesperado, vuelve a intentarlo más tarde",
                ErrorEliminacionUsuario: req.session.ErrorEliminacionUsuario
            });
            req.session.ExitoMensajeEliminacionUsuario = undefined;
            req.session.ErrorEliminacionUsuario = undefined;

        });

    } else {
        res.render("proyeccioneslogin", {
            TituloPagina: "Proyecciones"
        });
    }
});




app.post("/eliminarUsuario", (req, res) => {


    let body = req.query;

    if (body.id == req.session.usuario.id) {
        req.session.ErrorEliminacionUsuario = "No es posible eliminar a este usuario";
        res.redirect("/gestionUsuarios");
    } else {

        db.obtenerUsuarioById(body.id).then(usuario => {

            if (usuario.privilegios == 1) {
                req.session.ErrorEliminacionUsuario = "No es posible eliminar a este usuario, para más detalles entrar en contacto con desarrolladores";
                res.redirect("/gestionUsuarios");
            } else {
                db.eliminarUsuario(body.id).then(msg => {

                    req.session.ExitoMensajeEliminacionUsuario = msg;
                    res.redirect("/filtro");

                }).catch(err => {

                    req.session.ErrorEliminacionUsuario = err;
                    res.redirect("/gestionUsuarios");
                });

            }
        }).catch(err => {
            req.session.ErrorEliminacionUsuario = "No es posible eliminar a este usuario, para más detalles entrar en contacto con desarrolladores";
            res.redirect("/gestionUsuarios");
        });

    }




});


app.post("/modificarUsuario", (req, res) => {

    let body = req.query;


    req.session.idModificarUsuario = body.id;

    res.redirect("/modificarUsuario");

});

app.get("/modificarUsuario", autenticacion, verificarPrivilegiosAdmin, (req, res) => {
    db.obtenerUsuarioById(req.session.idModificarUsuario).then(msg => {
        if (msg.privilegios == 1) {
            res.redirect("/gestionUsuarios");
            req.session.idModificarUsuario = undefined;
        } else {
            req.session.idGuardarCambios = req.session.idModificarUsuario;
            req.session.idModificarUsuario = undefined;
            req.session.datosParaValidar = {
                correo: msg.correo,
                username: msg.username
            }
            res.render("modificacion-usuario", {
                Datos: msg,
                TituloPagina: "Modificar Usuario",
                idModificarUsuario: req.session.idModificarUsuario,
                Admin: "Si",
                alertaAdminModificarDatos: req.session.alertaAdminModificarDatos
            });
            req.session.alertaAdminModificarDatos = undefined;
        }
    }).catch(err => {
        req.session.idModificarUsuario = undefined;
        req.session.alertaAdminModificarDatos = undefined;
        res.redirect("/gestionUsuarios");
    });



});

app.post("/guardarModificaciones", (req, res) => {

    if (req.session.idGuardarCambios) {

        let body = req.body;

        if (body.nombre != undefined && body.appaterno != undefined && body.apmaterno != undefined && body.username != undefined && body.correo != undefined) {
            if (body.nombre.split(" ").join("") === "" || body.appaterno.split(" ").join("") === "" || body.apmaterno.split(" ").join("") === "" ||
                body.username.split(" ").join("") === "" || body.correo.split(" ").join("") === "") {

                req.session.alertaAdminModificarDatos = "No puedes dejar espacios en blanco";
                req.session.idModificarUsuario = req.session.idGuardarCambios;
                res.redirect("/modificarUsuario");

            } else if (!validaciones.alphaNumC(body.nombre) || !validaciones.alphaNumC(body.appaterno) || !validaciones.alphaNumC(body.apmaterno) ||
                !validaciones.alphaNumC(body.username) || !validaciones.alphaNumC(body.correo)) {


                req.session.alertaAdminModificarDatos = "Solo se permiten los caracteres Aa-Zz Áá-Úú 0-9 . ¡ ? ¿ ! @";
                req.session.idModificarUsuario = req.session.idGuardarCambios;
                res.redirect("/modificarUsuario");

            } else {

                db.validarCorreo(body.correo.split(" ").join("")).then(msg => {



                    if (!msg && body.correo.split(" ").join("") != req.session.datosParaValidar.correo) {
                        req.session.alertaAdminModificarDatos = "El correo ingresado ya esta siendo usado por otro usuario";
                        req.session.idModificarUsuario = req.session.idGuardarCambios;
                        res.redirect("/modificarUsuario");


                    } else {
                        db.validarUsername(body.username.split(" ").join("")).then(msg => {
                            if (!msg && body.username.split(" ").join("") !== req.session.datosParaValidar.username) {


                                req.session.alertaAdminModificarDatos = "El username ingresado ya esta siendo usado por otro usuario";
                                req.session.idModificarUsuario = req.session.idGuardarCambios;
                                res.redirect("/modificarUsuario");


                            } else {

                                let datos = {
                                    nombre: body.nombre,
                                    appaterno: body.appaterno,
                                    apmaterno: body.apmaterno,
                                    correo: body.correo,
                                    username: body.username
                                }

                                db.actualizarDatosUsuario(req.session.idGuardarCambios, datos).then(msg => {

                                    if (msg == undefined) {
                                        req.session.alertaAdminModificarDatos = "Ha ocurrido un error inesperado";
                                        req.session.idModificarUsuario = req.session.idGuardarCambios;
                                        res.redirect("/modificarUsuario");
                                    } else {
                                        req.session.ExitoMensajeEliminacionUsuario = "Datos de usuario actualizados";
                                        res.redirect("/filtro");
                                    }
                                }).catch(err => {
                                    console.log(err)
                                    req.session.alertaAdminModificarDatos = "Ha ocurrido un error inesperado";
                                    req.session.idModificarUsuario = req.session.idGuardarCambios;
                                    res.redirect("/modificarUsuario");
                                })

                            }
                        })
                    }
                })


            }

        } else {
            req.session.idModificarUsuario = req.session.idGuardarCambios;
            res.redirect("/modificarUsuario");

            //Si todo sale bien eliminas estos atributos de la sesión
            //req.session.datosParaValidar
            //req.session.idGuardarCambios
        }


    } else {
        res.redirect("/gestionUsuarios");
    }



});



app.get("/filtro", autenticacion, verificarPrivilegiosAdmin, (req, res) => {


    let filtro = req.query.filtros;

    if (filtro) {
        req.session.filtro = filtro;
    } else if (!req.session.filtro) {
        req.session.filtro = "Sin filtro";
    }







    db.getUsuariosOrdenados(req.session.usuario.id, req.session.filtro).then(msg => {

        req.session.usuariosFiltrados = msg;
        res.redirect("/gestionUsuarios");
    }).catch(err => {

        req.session.ErrorEliminacionUsuario = err;
        res.redirect("/gestionUsuarios");


    });




});

module.exports = app;