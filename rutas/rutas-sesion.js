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


app.get("/login", (req, res) => {

    if (req.session.usuario == undefined) {
        res.render("login", {
            TituloPagina: "Iniciar Sesión",
            RegistroUsuario: req.session.registro,
            InicioSesionFallido: req.session.inicioSesionFallido,
            CorreoLogin: req.session.correoLogin
        });
        req.session.registro = undefined;
        req.session.inicioSesionFallido = undefined;
        req.session.correoLogin = undefined;

    } else if (req.session.usuario != undefined) {
        res.redirect("/proyecciones");
    }

});

app.post("/login", autenticacionInversa, (req, res) => {


    db.iniciarSesion(req.body.correo, req.body.password).then(datos => {
        if (datos == undefined) {
            req.session.inicioSesionFallido = "Correo o contraseña incorrectos";
            req.session.correoLogin = req.body.correo;
            res.redirect("/login");

        } else if (datos != undefined) {
            req.session.usuario = datos;


            if (req.session.usuario.privilegios == 1) {
                req.session.admin = 1;
            }
            res.redirect("/proyecciones");
        } else {
            req.session.inicioSesionFallido = "Algo salio mal. Por favor intente más tarde.";
            req.session.correoLogin = req.body.correo;

            res.redirect("/login");
        }
    }).catch(console.log);

    req.session.inicioSesionFallido = undefined;
    req.session.correoLogin = undefined;



});


app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});




app.get("/registro", autenticacionInversa, (req, res) => {


    res.render("registro", {
        TituloPagina: "Registro",
        Mensaje: req.session.mensaje,
        Datos: req.session.datosForm
    });
    req.session.mensaje = undefined;
    req.session.datosForm = {};
});


app.post("/registro", autenticacionInversa, (req, res) => {
    let Usuario = {
        nombre: req.body.nombre,
        appaterno: req.body.appaterno,
        apmaterno: req.body.apmaterno,
        correo: req.body.correo,
        username: req.body.username,
        password: req.body.password,
        password2: req.body.password2

    }

    req.session.datosForm = Usuario;

    if (Usuario.nombre.split(" ").join("") === "" || Usuario.appaterno.split(" ").join("") === "" || Usuario.apmaterno.split(" ").join("") === "" ||
        Usuario.correo.split(" ").join("") === "" || Usuario.username.split(" ").join("") === "" || Usuario.password.split(" ").join("") === "" ||
        Usuario.password2.split(" ").join("") === "") {

        req.session.mensaje = "Asegurate de haber llenado todos los campos";
        res.redirect("/registro");
    } else if (!validaciones.alphaNumC(Usuario.nombre) || !validaciones.alphaNumC(Usuario.appaterno) || !validaciones.alphaNumC(Usuario.apmaterno) ||
        !validaciones.alphaNumC(Usuario.correo) || !validaciones.alphaNumC(Usuario.username) || !validaciones.alphaNumC(Usuario.password) ||
        !validaciones.alphaNumC(Usuario.password2)) {
        console.log(validaciones.alphaNumC(Usuario.correo));

        req.session.mensaje = "Solo se permiten los caracteres Aa-Zz Áá-Úú 0-9 . ¡ ? ¿ ! @";
        res.redirect("/registro");

    } else {

        db.validarCorreo(Usuario.correo.split(" ").join("")).then(msg => {

            if (!msg) {
                req.session.mensaje = "El correo ingresado ya esta siendo utilizado";
                res.redirect("/registro");
            } else {

                db.validarUsername(Usuario.username).then(msg => {
                    if (!msg) {
                        req.session.mensaje = "El nombre de usuario ingresado ya esta siendo utilizado";
                        res.redirect("/registro");
                    } else if (req.body.password !== req.body.password2) {
                        req.session.mensaje = "Las contraseñas no coinciden";
                        res.redirect("/registro");
                    } else if (req.body.terminos == undefined) {
                        req.session.mensaje = "Debes aceptar las políticas de privacidad";
                        res.redirect("/registro");
                    } else {
                        Usuario.password = cifrar(Usuario.password);
                        Usuario.nombre = cifrar(Usuario.nombre);
                        Usuario.appaterno = cifrar(Usuario.appaterno.split(" ").join(""));
                        Usuario.apmaterno = cifrar(Usuario.apmaterno.split(" ").join(""));
                        Usuario.correo = cifrar(Usuario.correo.split(" ").join(""));
                        db.agregarUsuario(Usuario).then((msg) => {
                            req.session.registro = "Usuario registrado";
                            req.session.datosForm = undefined;
                            res.redirect("/login");
                        }).catch((error) => {
                            req.session.mensaje = "Algo salio mal. Por favor intente más tarde.";
                            res.redirect("/registro");
                        });
                    }


                }).catch(console.log);
            }

        }).catch(console.log);

    }
});







module.exports = app;