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
    let Usuario = {
        correo: req.body.correo,
        password: req.body.password
    }
    if (!validaciones.correo(Usuario.correo)) {
        req.session.inicioSesionFallido = "Recuerda no dejar tu correo vacio, la longitud debe ser menor a 40 caracteres y que solo puedes escribir letras, números, arroba y punto";
        res.redirect("/login");

    }else if (!validaciones.alphaNum3(Usuario.password)) {
        req.session.inicioSesionFallido = "Recuerda no dejar tu contraseña vacia, la longitud debe ser menor a 40 y que solo puedes escribir los caracteres Aa-Zz Áá-Úú 0-9 . ¡ ? ¿ ! @ < >";
        res.redirect("/login" );
    }
    else {
        db.iniciarSesion(Usuario.correo, Usuario.password).then(datos => {
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
     }

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

    if (!validaciones.letras(Usuario.nombre)) {
        req.session.mensaje = "Recuerda no dejar el nombre vacio, que solo puedes escribir letras  y que la longitud debe ser menor a 30 caracteres";
        res.redirect("/registro");
    }else if ( !validaciones.letras(Usuario.appaterno) || !validaciones.letras(Usuario.apmaterno)) {
        req.session.mensaje = "Recuerda no dejar tus apellidos vacios, que solo puedes escribir letras  y que la longitud debe ser menor a 30 caracteres";
        res.redirect("/registro");
    }
    else if (!validaciones.correo(Usuario.correo)) {

        req.session.mensaje = "Recuerda no dejar tu correo vacio, la longitud debe ser menor a 40 caracteres y que solo puedes escribir letras, números, arroba y punto";
        res.redirect("/registro");

    }else if (!validaciones.alphaNum3(Usuario.username)) {
        req.session.mensaje = "Recuerda no dejar tu usuario, la longitud debe ser menor a 40 y que solo puedes escribir los caracteres Aa-Zz Áá-Úú 0-9 . ¡ ? ¿ ! @ < >";
        res.redirect("/registro");
    }
    else if (!validaciones.alphaNum3(Usuario.password)) {
        req.session.mensaje = "Recuerda no dejar tu contraseña vacia, la longitud debe ser menor a 40 y que solo puedes escribir los caracteres Aa-Zz Áá-Úú 0-9 . ¡ ? ¿ ! @ < >";
        res.redirect("/login" );
    }
    else {

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