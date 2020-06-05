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






app.get("/salario", autenticacion, (req, res) => {

    if (req.session.admin == 1) {
        res.render("salario", {
            TituloPagina: "Gestion de Salario",
            Admin: "Si"
        });
    } else {
        res.render("salario", {
            TituloPagina: "Gestion de Salario"
        });

    }

});

app.get("/obtenerSalario", autenticacion, (req, res) => {
    db.obtenerDatosSueldo(req.session.usuario.id).then(msg => {

        res.json(msg);
    }).catch(err => {
        res.json(msg);
    })
});

app.post("/guardarDatosSalario", autenticacion, (req, res) => {

    let body = req.body;

    let data = {
        sueldo: body.sueldo,
        horas: body.horas,
        dias: body.dias
    };



    if (data.sueldo == "" || data.horas == "" || data.dias == "") {
        res.json({
            ok: false,
            mensaje: "No puedes dejar campos en blanco"
        });
    } else if (isNaN(data.sueldo) || isNaN(data.horas) || isNaN(data.dias)) {
        res.json({
            ok: false,
            mensaje: "Solo valores numéricos"
        });

    } else if (!validaciones.validarDecimal(data.sueldo) || parseInt(data.sueldo, 10) <= 0) {

        res.json({
            ok: false,
            mensaje: "El valor del sueldo no es válido, solo 6 enteros y 2 decimales (mayor a 0)"
        })

    } else if (!validaciones.validarEntero(data.horas) || parseInt(data.horas, 10) < 1 || parseInt(data.horas, 10) > 12) {

        res.json({
            ok: false,
            mensaje: "El valor de las horas no es válido, debe de ser un número entero menor o igual a 12 pero mayor o igual a 1"
        })

    } else if (!validaciones.validarEntero(data.dias) || parseInt(data.dias, 10) < 1 || parseInt(data.dias, 10) > 7) {
        res.json({
            ok: false,
            mensaje: "El valor de los días no es válido, debe de ser un número entero menor o igual a 7 pero mayor o igual a 1"
        });
    } else if ((parseFloat(data.sueldo) / (parseFloat(data.dias) * 4)) < 185.56) {
        res.json({
            ok: false,
            mensaje: "El valor del sueldo esta por debajo del salario minimo"
        });
    } else {
        db.guardarDatosSalario(data, req.session.usuario.id).then(msg => {
            res.json({
                ok: true,
                mensaje: "Datos guardados correctamente"
            });
        }).catch(err => {
            res.json({
                ok: false,
                mensaje: "Ha ocurrido un error inesperado, vuelve a intentarlo más tarde"
            })

        });
    }
});

app.post("/guardarDatosGastos", autenticacion, (req, res) => {

    let body = req.body;


    let data = {
        transporte: body.transporte,
        servicios: body.servicios,
        tarjetas: body.tarjetas,
        renta: body.renta,
        deudas: body.deudas,
        seguros: body.seguros,
        otros: body.otros
    };


    if (data.transporte == "" || data.servicios == "" || data.tarjetas == "" || data.renta == "" || data.deudas == "" ||
        data.seguros == "" || data.otros == "") {
        res.json({
            ok: false,
            mensaje: "Todos los campos deben de ser llenados"
        })
    } else if (!validaciones.validarDecimal(data.transporte) || !validaciones.validarDecimal(data.servicios) ||
        !validaciones.validarDecimal(data.tarjetas) || !validaciones.validarDecimal(data.renta) ||
        !validaciones.validarDecimal(data.deudas) || !validaciones.validarDecimal(data.deudas) ||
        !validaciones.validarDecimal(data.seguros) || !validaciones.validarDecimal(data.otros)) {

        res.json({
            ok: false,
            mensaje: "Los valores deben ser números positivos, máximo dos decimales y seis números antes del punto"
        })

    } else if (parseFloat(data.transporte) < 0 || parseFloat(data.servicios) < 0 || parseFloat(data.tarjetas) < 0 ||
        parseFloat(data.renta) < 0 || parseFloat(data.deudas) < 0 || parseFloat(data.seguros) < 0 || parseFloat(data.otros) < 0) {

        res.json({
            ok: false,
            mensaje: "Los valores deben ser positivos"
        });
    } else {


        db.obtenerPrecioCanastaBasica().then(msg => {


            db.guardarDatosGastos(data, req.session.usuario.id, msg.can_pre).then(msg => {
                res.json({
                    ok: true,
                    mensaje: "Datos guardados correctamente"
                });
            }).catch(err => {
                res.json({
                    ok: true,
                    mensaje: "Ha ocurrido un error inesperado, vuelve a intentarlo más tarde"
                });
            })


        }).catch(err => {
            res.json({
                ok: true,
                mensaje: "Ha ocurrido un error inesperado, vuelve a intentarlo más tarde"
            });
        })



    }


});

app.get("/obtenerDatosGastos", autenticacion, (req, res) => {

    db.obtenerDatosGastos(req.session.usuario.id).then(msg => res.json(msg)).catch(msg => res.json(msg));
});


app.get("/canastaBasica", autenticacion, (req, res) => {

    db.obtenerPrecioCanastaBasica().then(msg => res.json({
        ok: true,
        precio: msg.can_pre
    })).catch(err => res.json({
        ok: false
    }));

});

app.get("/obtenerHorasParaCBA", autenticacion, (req, res) => {


    db.obtenerHorasParaCBA(req.session.usuario.id).then(msg => res.json(msg)).catch(err => res.json(err));


});

app.get("/obtenerHorasParaGastos", autenticacion, (req, res) => {


    db.obtenerHorasParaGastos(req.session.usuario.id).then(msg => res.json(msg)).catch(err => res.json(err));
});



module.exports = app;