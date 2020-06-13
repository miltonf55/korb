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


app.get("/obtenerIdUsuario", autenticacion, (req, res) => {

    res.json({
        idUsuario: req.session.usuario.id
    });

});



app.get("/foro", autenticacion, (req, res) => {

    if (req.session.usuario == undefined) {
        res.render("proyeccioneslogout", {
            TituloPagina: "Proyecciones"
        });
    } else if (req.session.usuario != undefined) {
        if (req.session.admin == 1) {
            res.render("foro-admin", {
                TituloPagina: "Foro de Discusion",
                Admin: "Si",
                script: "assets/js/app6.js"
            });
        } else {
            res.render("foro", {
                TituloPagina: "Foro de Discusión",
                script: "assets/js/app4.js"
            });
        }

    }

});


app.get("/obtenerTipoDePublicaciones", autenticacion, (req, res) => {
    db.obtenerTiposDePublicacion().then(msg => {
        res.json({
            ok: true,
            tipos: msg
        });
    }).catch(err => {
        res.json({
            ok: false,
            error: err
        })

    });
});

app.post("/guardarPublicacion", autenticacion, (req, res) => {

    let body = req.body;

    let titulo = body.tituloPublicacion;
    let descripcion = body.descripcionPublicacion;
    let tipo = body.tipoPublicacion;


    if (titulo.split(" ").join("") == "" || descripcion.split(" ").join("") == "") {
        res.json({
            ok: false,
            mensaje: "Debes llenar todos los campos para subir tu publicación"
        });
    } else if (!validaciones.escritura(titulo) || !validaciones.escritura(descripcion)) {
        res.json({
            ok: false,
            mensaje: "Solo se permiten los caracteres Aa-Zz Áá-Úú 0-9 . ¡ ? ¿ ! # $ % & ( ) = , ; : - _ "
        })
    } else if (descripcion.length > 400) {
        res.json({
            ok: false,
            mensaje: "Máximo 400 caracteres en la descripción"
        })
    } else if (titulo.length > 30) {
        res.json({
            ok: false,
            mensaje: "Máximo 30 carácteres en el título"
        })
    } else {

        db.obtenerTiposDePublicacion().then(msg => {
            let valido = false;
            let idTipoPublicacion = undefined;
            for (tipoPublicacion of msg) {
                if (tipoPublicacion.des_tip === tipo) {
                    valido = true;
                    idTipoPublicacion = tipoPublicacion.id_tip
                }


            }
            if (!valido) {
                res.json({
                    ok: false,
                    mensaje: "Ha ocurrido un error inesperado, vuelve a intentarlo más tarde"
                })
            } else {
                let data = {
                    titulo,
                    descripcion,
                    idTipoPublicacion,
                    fecha: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
                    hora: `${new Date().getHours()}`,
                    minuto: `${new Date().getMinutes()}`,
                    username: req.session.usuario.username
                }

                db.guardarPublicacion(data, req.session.usuario.id).then(msg => {
                    res.json({
                        ok: true,
                        mensaje: "La publicación ha sido subida, puedes verla en 'Mis Publicaciones' o en 'Todas las Publicaciones'",
                        publicacion: data
                    })
                }).catch(err => {
                    console.log(err)
                    res.json({
                        ok: false,
                        mensaje: "Ha ocurrido un error inesperado, vuelve a intentarlo más tarde"
                    })
                });

            }
        }).catch(err => {
            console.log(err)
            res.json({
                ok: false,
                mensaje: "Ha ocurrido un error inesperado, vuelve a intentarlo más tarde"
            })

        });

    }

});

app.post("/obtenerMisPublicaciones", autenticacion, (req, res) => {
    let filtrosDeBusqueda = req.body.filtrosDeBusqueda2;

    if (filtrosDeBusqueda.filtroTipoPublicacion != "Sugerencias" && filtrosDeBusqueda.filtroTipoPublicacion != "BUGs" && filtrosDeBusqueda.filtroTipoPublicacion != "Errores") {
        filtrosDeBusqueda.filtroTipoPublicacion = "";
    }

    if (filtrosDeBusqueda.filtroEstadoResolucion != "Resueltas" && filtrosDeBusqueda.filtroEstadoResolucion != "Sin Resolver") {
        filtrosDeBusqueda.filtroEstadoResolucion = "";
    }

    db.obtenerPublicacionesDeUsuario(req.session.usuario.id, filtrosDeBusqueda).then(data => {
        res.json({
            ok: true,
            publicaciones: data,
            username: req.session.usuario.username
        });
    }).catch(err => {
        console.log(err);
        res.json({
            ok: false,
            mensaje: "Ha ocurrido un error inesperado, vuelve a intentarlo más tarde"
        })
    })

});

app.post("/eliminarPublicacion", autenticacion, (req, res) => {
    let body = req.body;
    db.eliminarPublicacion(body.id, req.session.usuario.id).then(msg => {
        res.json({
            ok: true,
            mensaje: "La publicación ha sido eliminada"
        })
    }).catch(err => {
        console.log(err);
        res.json({
            ok: false,
            mensaje: "Ha ocurrido un error inesperado, vuelve a intentarlo más tarde"
        })
    });
});

app.post("/obtenerTodasLasPublicaciones", autenticacion, (req, res) => {
    let filtrosDeBusqueda = req.body.filtrosDeBusqueda;

    if (filtrosDeBusqueda.filtroTipoPublicacion != "Sugerencias" && filtrosDeBusqueda.filtroTipoPublicacion != "BUGs" && filtrosDeBusqueda.filtroTipoPublicacion != "Errores") {
        filtrosDeBusqueda.filtroTipoPublicacion = "";
    }

    if (filtrosDeBusqueda.filtroEstadoResolucion != "Resueltas" && filtrosDeBusqueda.filtroEstadoResolucion != "Sin Resolver") {
        filtrosDeBusqueda.filtroEstadoResolucion = "";
    }




    db.obtenerTodasLasPublicaciones(req.session.usuario.id, filtrosDeBusqueda).then(data => {
        res.json({
            ok: true,
            publicaciones: data
        });
    }).catch(err => {
        console.log(err);
        res.json({
            ok: false,
            mensaje: "Ha ocurrido un error inesperado, vuelve a intentarlo más tarde"
        })
    })

});

app.post("/guardarRetroalimentacion", autenticacion, (req, res) => {
    let idPublicacion = req.body.idPublicacion;
    let retroalimentacionPublicacion = req.body.retroalimentacionPublicacion;

    if (retroalimentacionPublicacion.split(" ").join("") == "") {
        res.json({
            ok: false,
            mensaje: "No puedes mandar una respuesta en blanco"
        });
    } else if (!validaciones.escritura(retroalimentacionPublicacion)) {
        res.json({
            ok: false,
            mensaje: "Solo se permiten los caracteres Aa-Zz Áá-Úú 0-9 . ¡ ? ¿ ! # $ % & ( ) = , ; : - _ "
        })
    } else {
        db.guardarRetroalimentacion(idPublicacion, retroalimentacionPublicacion).then(msg => {

            res.json({
                ok: true,
                idUsuario: msg[0].id_usu,
                tituloPublicacion: msg[0].tit_pub
            })
        }).catch(err => {
            res.json({
                ok: false,
                mensaje: "Ha ocurrido un erro inesperado, vuelve a intentarlo más tarde"
            });
        })
    }
});



module.exports = app;