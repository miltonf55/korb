$(() => {




    var socket = io();
    //Escuchar
    socket.on("connect", () => {
        console.log("Conectado al Servidor");
    });

    socket.on("disconnect", () => {

        console.log("Perdimos conexion con el servidor");
    });
    /*
    socket.on("enviarMensaje", (mensaje) => {
        console.log("Servidor:");
        console.log(mensaje);
    });*/

    //Emits son para enviar información

    /*
    socket.emit("enviarMensaje", {
            usuario: "Aaron",
            mensaje: "Hola Mundo"
        },
        (respuesta) => {
            console.log(respuesta);
        });}
        */






    //JQuery
    $("#hacerPublicacion").on("click", () => {

        $("#hacerPublicacion").addClass("btn btn-primary");
        $("#misPublicaciones").removeClass("btn btn-primary")
        $("#misPublicaciones").addClass("nav-link");
        $("#todasLasPublicaciones").removeClass("btn btn-primary")
        $("#todasLasPublicaciones").addClass("nav-link");


        $.ajax({
            url: `/obtenerTipoDePublicaciones`,
            success: (data) => {


                if (!data.ok) {
                    $("#publicacionesContent").html(`<div class="alert alert-danger" role="alert">Ha ocurrido un error inesperado, recarga la página para volver a intentarlo</div>`)
                } else {

                    let html = `<br>
                    <div id="mensajes"></div>
                        <div id='colorPublicacion' class="alert alert-primary" role="alert">
                              <h3>Crear Publicación</h3>
                              
                               
                              <table cellpadding="10" width="100%">
                                  <tr>
                                      <td width="70%">
                                          <div class="input-group mb-3">
                                          <div class="input-group-prepend">
                                            <span class="input-group-text">Título de Publicación</span>
                                          </div>
                                          <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" id="tituloPublicacion" maxlength="30">
                                          <br><div id="caracteresTitulo"></div>
                                        </div>
                                      </td>
                                      <td width="30%">
                                          <div class="input-group mb-3">
                                          <div class="input-group-prepend">
                                            <label class="input-group-text" for="inputGroupSelect01">Tipo de Publicación</label>
                                          </div>
                                          <select class="custom-select" id="selectTipoPublicacion">`

                    for (tipo of data.tipos) {
                        html += `<option>${tipo.des_tip}</option>`
                    }

                    html += ` </select>
                                    </div>
                                  </td>
                              </tr>
                              <tr>
                                  
                                     <td colspan="2" height="50%">
                                     
                                      <div class="input-group mb-3">
                                      <div class="input-group-prepend">
                                        <span class="input-group-text">Descripción</span>
                                      </div>
                                      <textarea class="form-control" aria-label="With textarea" id='descripcionPublicacion' maxlength="1000"></textarea>
                                      <br><div id='caracteresDescripcion'></div>
                                    </div>

                                  </td>
                              </tr>
                              <tr>
                                  <td colspan="2">
                                      <button id="subirPublicacion" class="btn btn-primary btn-block ">Subir Publicación</button>
                                  </td>
                              </tr>
                          </table>
                          </div>`

                    $("#publicacionesContent").html(html);

                    $("select").on("change", () => {
                        let tipoSeleccionado = $("#selectTipoPublicacion").val();

                        if (tipoSeleccionado == "Sugerencia") {
                            $("#colorPublicacion").removeClass();
                            $("#colorPublicacion").addClass("alert alert-primary");
                        } else if (tipoSeleccionado == "Bug") {
                            $("#colorPublicacion").removeClass();
                            $("#colorPublicacion").addClass("alert alert-warning");
                        } else if (tipoSeleccionado == "Error") {
                            $("#colorPublicacion").removeClass();
                            $("#colorPublicacion").addClass("alert alert-danger");
                        } else {
                            $("#colorPublicacion").removeClass();
                        }

                    });

                    $("#subirPublicacion").on("click", () => {

                        let tituloPublicacion = $("#tituloPublicacion").val();
                        let tipoPublicacion = $("#selectTipoPublicacion").val();
                        let descripcionPublicacion = $("#descripcionPublicacion").val();

                        $.ajax({
                            url: `/guardarPublicacion`,
                            method: "POST",
                            data: {
                                tituloPublicacion,
                                tipoPublicacion,
                                descripcionPublicacion
                            },
                            success: (data) => {
                                if (!data.ok) {
                                    $("#mensajes").html(`<div class='alert alert-danger'>${data.mensaje}</div>`);
                                } else {
                                    $("#mensajes").html(`<div class='alert alert-success'>${data.mensaje}</div>`);
                                    $("#tituloPublicacion").val("");
                                    $("#descripcionPublicacion").val("");
                                }
                            }
                        })
                    });

                    $("#tituloPublicacion").on("keyup", () => {
                        $("#caracteresTitulo").html(`${$("#tituloPublicacion").val().length}/30`)
                    });

                    $("#descripcionPublicacion").on("keyup", () => {
                        $("#caracteresDescripcion").html(`${$("#descripcionPublicacion").val().length}/1000`)
                    });

                }
            }
        })



    });

    $("#misPublicaciones").on("click", () => {

        $("#misPublicaciones").addClass("btn btn-primary");
        $("#todasLasPublicaciones").removeClass("btn btn-primary")
        $("#todasLasPublicaciones").addClass("nav-link");
        $("#hacerPublicacion").removeClass("btn btn-primary")
        $("#hacerPublicacion").addClass("nav-link");


        $.ajax({
            url: "/obtenerMisPublicaciones",
            success: (data) => {
                if (!data.ok) {
                    $("#publicacionesContent").html(`<h3>Mis Publicaciones</h3><br><br>
                            <div class="alert alert-danger" role="alert">${data.mensaje}</div>`)
                } else {
                    if (data.publicaciones.length == 0) {
                        $("#publicacionesContent").html(`<h3>Mis Publicaciones</h3><br><br>
                            <div class="alert alert-danger" role="alert">Aun no tienes publicaciones, ve a la pestaña 'Hacer Publicación' y publica la primera</div>`)
                    } else {


                        let html = `<br><h3>Mis Publicaciones</h3><br><div id='mensajes'></div>`;

                        for (publicacion of data.publicaciones) {

                            let fecha = new Date(publicacion.fec_pub);
                            let tipoPublicacionEscrito = "";
                            let estadoPublicacionEscrito = "";
                            let fechaEscrita = "";
                            if (publicacion.id_sta == 1) {
                                estadoPublicacionEscrito = `<div class="alert alert - primary" role="alert" align='center'>SIN RESOLVER</div>`;
                            } else {
                                estadoPublicacionEscrito = `<div class="alert alert-success" role="alert" align='center'>RESUELTA</div>`;
                            }

                            if (("" + fecha.getDate()).length == 1) {
                                fechaEscrita += "0" + fecha.getDate() + "-";
                            } else {
                                fechaEscrita += fecha.getDate() + "-";
                            }

                            if (("" + (fecha.getMonth() + 1)).length == 1) {
                                fechaEscrita += "0" + (fecha.getMonth() + 1) + "-";
                            } else {
                                fechaEscrita += (fecha.getMonth() + 1) + "-";
                            }
                            fechaEscrita += fecha.getFullYear();

                            if (publicacion.id_tip == 1) {
                                html += `<div class="alert alert-primary" role="alert" align='center'>`;
                                tipoPublicacionEscrito = "Sugerencia";
                            } else if (publicacion.id_tip == 2) {
                                html += `<div class="alert alert-warning" role="alert" align="center">`;
                                tipoPublicacionEscrito = "BUG";
                            } else if (publicacion.id_tip) {
                                html += `<div class="alert alert-danger" role="alert" align='center'>`;
                                tipoPublicacionEscrito = "ERROR"
                            }

                            html += `<table width="100%" cellpadding="10" border='1'> 
                                <tr>
                                    <td align='left' width='25%'>
                                        <small>Username: ${data.username}</small>
                                    </td>
                                    <td align='center' width='50%'>
                                        <h3><b>${publicacion.tit_pub}</b></h3>
                                    </td>
                                    <td align="center" width='25%'>
                                        Tipo de publicacion: ${tipoPublicacionEscrito}
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan='3'>
                                         <h4>Descripción:</h4>
                                       <h5>${publicacion.des_pub}</h5>
                                    </td>
                                </tr>
                                <tr>
                                    <td align='center'>
                                        <b>${estadoPublicacionEscrito}</b>
                                    </td>
                                    <td align='center'>
                                        <small>Publicado el ${fechaEscrita}</small>
                                    </td>
                                    <td>
                                        Votos: ${publicacion.vot_pub}
                                    </td>
                                </tr>
                                `
                            if (publicacion.ret_pub != null) {
                                html += `<tr>
                                        <td colspan="3">
                                            Comentarios del Desarrollador: ${publicacion.ret_pub}
                                        </td>
                                    </tr>`
                            }
                            html += `
                            </table>
                            <br>
                                 <button type="button" class="btn btn-primary btn-block" data-toggle="modal" data-target="#exampleModal${publicacion.id_pub}">
                                  Eliminar Publicación
                                </button>

                                <!-- Modal -->
                                <div class="modal fade" id="exampleModal${publicacion.id_pub}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                  <div class="modal-dialog">
                                    <div class="modal-content">
                                      <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">ATENCIÓN</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                          <span aria-hidden="true">&times;</span>
                                        </button>
                                      </div>
                                      <div class="modal-body">
                                        ¿Estas seguro de querer eliminar esta publicación?
                                      </div>
                                      <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal" >Cancelar</button>
                                        <button type="button" class="btn btn-primary" id='eliminarPublicacion${publicacion.id_pub}'>Eliminar</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                                            </div><hr>`


                        }

                        $("#publicacionesContent").html(html);
                        for (publicacion of data.publicaciones) {
                            $(`#eliminarPublicacion${publicacion.id_pub}`).on("click", () => {

                                $.ajax({
                                    url: "/eliminarPublicacion",
                                    method: "POST",
                                    data: {
                                        id: publicacion.id_pub
                                    },
                                    success: (msg) => {
                                        $(`#exampleModal${publicacion.id_pub}`).modal('toggle');
                                        $('body').removeClass('modal-open');
                                        $('.modal-backdrop').remove();

                                        if (!msg.ok) {
                                            $("#mensajes").html(`<div class="alert alert-danger" role="alert" align='center'>${msg.mensaje}</div>`)
                                        } else {
                                            $("#misPublicaciones").click();
                                            alert(`${msg.mensaje}`);

                                        }




                                    }
                                })
                            })
                        }
                    }

                }

            }
        });
    });


    $("#todasLasPublicaciones").on("click", () => {

        $("#todasLasPublicaciones").addClass("btn btn-primary");
        $("#misPublicaciones").removeClass("btn btn-primary")
        $("#misPublicaciones").addClass("nav-link");
        $("#hacerPublicacion").removeClass("btn btn-primary")
        $("#hacerPublicacion").addClass("nav-link");
    });



    $("#hacerPublicacion").click();



})