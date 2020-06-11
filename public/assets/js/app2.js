$(() => {

    function obtenerIdProducto(texto) {
        let palabras = texto.split(" ");
        palabras.forEach((palabra, idx) => {
            palabras[idx] = palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
        });

        return palabras.join("");
    }


    $("#guardarPrecios").on("click", () => {

        $.ajax({
            url: "/obtenerProductos",
            success: (data) => {
                if (data.ok == true) {
                    let inputs = [];
                    let productos = data.productos;

                    for (producto of productos) {
                        if (producto.nombreProducto != "Canasta Basica") {
                            if ($("#" + obtenerIdProducto(producto.nombreProducto)).val() == undefined) {
                                inputs.push({
                                    nombreProducto: producto.nombreProducto,
                                    precioInput: undefined
                                });
                            } else {
                                inputs.push({
                                    nombreProducto: producto.nombreProducto,
                                    precioInput: $("#" + obtenerIdProducto(producto.nombreProducto)).val() + "".split(" ").join("")
                                });
                            }
                        }

                    }

                    let resultado = {
                        datosProductos: inputs,
                        fechaPrecios: $("#fechaPrecios").val()
                    }

                    $.ajax({
                        url: "/guardarPrecios",
                        method: "POST",
                        data: resultado,
                        success: (msg) => {
                            alert(msg.mensaje);
                        }
                    })
                }
            }
        })

    });



})