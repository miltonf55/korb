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




app.get("/gestionPrecios", autenticacion, verificarPrivilegiosAdmin, (req, res) => {

    db.obtenerProductos().then(productos => {

        db.obtenerUltimosPreciosdeProductos().then(precios => {

            let productosConPrecios = [];
            let data = {};


            for (producto of productos) {

                for (precio of precios) {

                    if (precio.idProducto == producto.idProducto && producto.idProducto != 38) {
                        data = {
                            nombreProducto: producto.nombreProducto,
                            precioProducto: precio.precioProducto

                        }
                        productosConPrecios.push(data);
                        data = {};
                    }


                }



            }


            res.render("precios", {
                TituloPagina: "Gestion de Precios",
                Admin: "Si",
                Productos: productosConPrecios,
                script: "assets/js/app2.js"

            });
        }).catch(err => {
            console.log(err);
        });

    }).catch(err => {
        console.log(err);

    });


});

app.get("/obtenerPrecios", autenticacion, verificarPrivilegiosAdmin, (req, res) => {
    db.obtenerPrecios().then(msg => res.json(msg)).catch(err => res.json({
        ok: false,
        error: err
    }));
});

app.get("/obtenerProductos", autenticacion, verificarPrivilegiosAdmin, (req, res) => {
    db.obtenerProductos().then(msg => {
        res.json({
            ok: true,
            productos: msg
        });
    }).catch(err => {
        res.json({
            ok: false,
            error: err
        })
    })
});

app.post("/guardarPrecios", autenticacion, verificarPrivilegiosAdmin, (req, res) => {


    let body = req.body;

    let datosProductos = body.datosProductos;
    let fechaPrecios = body.fechaPrecios;


    for (producto of datosProductos) {
        if (producto.precioInput == undefined) {
            res.json({
                ok: false,
                mensaje: "Ha ocurrido un error inesperado, intentalo más tarde"
            });
        }
    }

    for (producto of datosProductos) {

        if (producto.precioInput.split(" ").join("") == "") {
            res.json({
                ok: false,
                mensaje: "Asegurate de llenar todos los campos"
            });
        }

    }


    for (producto of datosProductos) {
        if (isNaN(producto.precioInput.split(" ").join(""))) {
            res.json({
                ok: false,
                mensaje: "Solo valores numéricos"
            });
        }
    }

    for (producto of datosProductos) {

        if ((!validaciones.validarDecimal2(producto.precioInput) || parseFloat(producto.precioInput) > 9999.99) && parseFloat(producto.precioInput) > 0) {

            res.json({
                ok: false,
                mensaje: "Solo son permitidos 4 enteros y 2 decimales"
            });

        }
    }


    for (producto of datosProductos) {
        if (parseFloat(producto.precioInput) <= 0) {
            res.json({
                ok: false,
                mensaje: "Todos los datos deben de ser positivos"
            });
        }
    }



    if (fechaPrecios == "") {
        res.json({
            ok: false,
            mensaje: "Asigna una fecha para los campos"
        });
    }

    if (parseInt(new Date(fechaPrecios).getFullYear()) > parseInt(new Date().getFullYear())) {
        res.json({
            ok: false,
            mensaje: "Fecha no válida, debe de ser una fecha pasada"
        });
    } else if ((parseInt(new Date(fechaPrecios).getMonth()) > parseInt(new Date().getMonth())) && (parseInt(new Date(fechaPrecios).getFullYear()) == parseInt(new Date().getFullYear()))) {
        res.json({
            ok: false,
            mensaje: "Fecha no válida, debe de ser una fecha pasada"
        });
    } else if ((parseInt(new Date(fechaPrecios).getDate()) > parseInt(new Date().getDate())) && (parseInt(new Date(fechaPrecios).getMonth()) == parseInt(new Date().getMonth())) && (parseInt(new Date(fechaPrecios).getFullYear()) == parseInt(new Date().getFullYear()))) {
        res.json({
            ok: false,
            mensaje: "Fecha no válida, debe de ser una fecha pasada"
        });
    } else {

        db.obtenerProductos().then(productosConID => {
            let productosParaGuardar = [];
            let precioCanastaBasica = 0;
            for (producto of datosProductos) {
                precioCanastaBasica += parseFloat(producto.precioInput);
            }
            datosProductos.push({
                nombreProducto: "Canasta Basica",
                precioInput: "" + precioCanastaBasica.toFixed(2)
            });
            for (producto of datosProductos) {
                for (idProducto of productosConID) {
                    if (producto.nombreProducto == idProducto.nombreProducto) {

                        productosParaGuardar.push({
                            idProducto: idProducto.idProducto,
                            precioProducto: producto.precioInput
                        });

                    }

                }

            }




            db.guardarPrecios(productosParaGuardar, fechaPrecios).then(msg => {
                res.json({
                    ok: true,
                    mensaje: msg
                });
            }).catch(err => {
                console.log(err);
                res.json({
                    ok: false,
                    mensaje: "Ha ocurrido un error inesperado"
                })
            })

        }).catch(err => {
            console.log(err);
            res.json({
                ok: false,
                mensaje: "Ha ocurrido un error inesperado, intentalo de nuevo más tarde"
            })
        })
    }




});





module.exports = app;