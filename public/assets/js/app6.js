$(() => {

    var socket = io();

    let filtrosDeBusqueda = {
        filtroTipoPublicacion: "",
        filtroEstadoResolucion: "Sin Resolver",
        filtroVotos: "Por Me Gustas(Descendente)"
    };


    $("#todasLasPublicaciones").on("click", () => {



        $("#todasLasPublicaciones").addClass("btn btn-primary");
        $("#misPublicaciones").removeClass("btn btn-primary")
        $("#misPublicaciones").addClass("nav-link");
        $("#hacerPublicacion").removeClass("btn btn-primary");
        $("#hacerPublicacion").addClass("nav-link");

        $("#publicacionesContent").html(`<br><br><div class="progress">
                                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div>
                            </div>`);
        $.ajax({
            url: "/obtenerTodasLasPublicaciones",
            method: "POST",
            data: {
                filtrosDeBusqueda
            },
            success: (data) => {

                if (!data.ok) {
                    $("#publicacionesContent").html(`<h3>Publicaciones</h3><br>
                            <div class="alert alert-danger" role="alert">${data.mensaje}</div>`)
                } else {
                    if (data.publicaciones.length == 0 && (filtrosDeBusqueda.filtroTipoPublicacion != "" || filtrosDeBusqueda.filtroEstadoResolucion != "" || filtrosDeBusqueda.filtroVotos != "")) {
                        $("#publicacionesContent").html(`<br><h4>Todas las Publicaciones</h4><br>
                            <div class="alert alert-danger" role="alert">No hay publicaciones pendientes</div>`);
                    } else if (data.publicaciones.length == 0) {
                        $("#publicacionesContent").html(`<br><h4>Todas las Publicaciones</h4><br><br><br>
                            <div class="alert alert-danger" role="alert">Aun hay publicaciones de los usuarios</div>`)
                    } else {


                        let html = `<br><h4>Todas las Publicaciones</h4><div id='mensajes'></div>
                       `;
                        for (publicacion of data.publicaciones) {





                            let fecha = new Date(publicacion.fec_pub);
                            let tipoPublicacionEscrito = "";
                            let estadoPublicacionEscrito = "";
                            let fechaEscrita = "";

                            let voto = "";

                            if (publicacion.voto == undefined) {
                                voto = `<div id='imgLike${publicacion.id_pub}'><img src='assets/img/like.png' style='cursor:pointer' width='80%' id='like${publicacion.id_pub}'> <div id='numLikes${publicacion.id_pub}'> ${publicacion.votosPositivos}</div></div>
                                                        </td>
                                                        <td align='center'>
                                                            <div id='imgDislike${publicacion.id_pub}'><img src='assets/img/dislike.png' style='cursor:pointer' width='80%' id='dislike${publicacion.id_pub}'><div id='numDislikes${publicacion.id_pub}'> ${publicacion.votosNegativos}</div></div>`
                            } else if (publicacion.voto == true) {
                                voto = `<div id='imgLike${publicacion.id_pub}'><img src='assets/img/likeMarcado.png' style='cursor:pointer' width='80%' id='like${publicacion.id_pub}'> <div id='numLikes${publicacion.id_pub}'> ${publicacion.votosPositivos}</div></div>
                                                        </td>
                                                        <td align='center'>
                                                            <div id='imgDislike${publicacion.id_pub}'><img src='assets/img/dislike.png' style='cursor:pointer' width='80%' id='dislike${publicacion.id_pub}'><div id='numDislikes${publicacion.id_pub}'> ${publicacion.votosNegativos}</div></div>`
                            } else if (publicacion.voto == false) {
                                voto = `<div id='imgLike${publicacion.id_pub}'><img src='assets/img/like.png' style='cursor:pointer' width='80%' id='like${publicacion.id_pub}'> <div id='numLikes${publicacion.id_pub}'> ${publicacion.votosPositivos}</div></div>
                                                        </td>
                                                        <td align='center'>
                                                            <div id='imgDislike${publicacion.id_pub}'><img src='assets/img/dislikeMarcado.png' style='cursor:pointer' width='80%' id='dislike${publicacion.id_pub}'><div id='numDislikes${publicacion.id_pub}'> ${publicacion.votosNegativos}</div></div>`
                            }


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

                            html += ` <table width="100%" cellpadding="10" border='1'> 
                                            <tr>
                                                <td align='left' width='25%'>
                                                    <small>Username: ${publicacion.username}</small>
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
                                                <td align='center'>
                                                <table >
                                                    <tr>
                                                        <td align='center'>
                                                            ${voto}
                                                        </td>
                                                    </tr>
                                                </table>
                                                
                                                
                                                    
                                                </td>
                                                    </tr>`





                            html += `<tr>
                                <tr><td colspan='3'>Respuesta: 
                                "
                                        <div class="input-group mb-3">
                                          <div class="input-group-prepend">
                                            
                                          </div>
                                          <textarea class="form-control" aria-label="With textarea" id='retroalimentacionPublicacion${publicacion.id_pub}' maxlength="240"></textarea>
                                          <br><div id='caracteresDescripcion'></div>
                                        </div>`

                            if (publicacion.id_tip == 2 || publicacion.id_tip == 3) {
                                html += `
                                        En caso de que el problema continue, puede volver a hacer una publicación o mandar un correo a geleceksoftwaredevelopment@gmail.com"    
                                    </td>
                                    </tr>`
                            } else {
                                html += `"</td></tr>`
                            }

                            html += `<tr>
                                    <td colspan='3'>
                                        <button id='guardarRetroalimentacion${publicacion.id_pub}' class='btn btn-primary btn-block'>Responder Publicación</button>
                                    </td>
                                </tr>`

                            html += `
                                        </table>
                                        <br>                                      
                                                                        `
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
                                        <button type="button" class="btn btn-danger" id='eliminarPublicacion${publicacion.id_pub}'>Eliminar</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                                            </div><hr>`


                        }

                        $("#publicacionesContent").html(html);


                        for (publicacion of data.publicaciones) {
                            let idPublicacion = publicacion.id_pub;
                            $(`#eliminarPublicacion${idPublicacion}`).on("click", () => {

                                $.ajax({
                                    url: "/eliminarPublicacion2",
                                    method: "POST",
                                    data: {
                                        id: idPublicacion
                                    },
                                    success: (msg) => {
                                        $(`#exampleModal${idPublicacion}`).modal('toggle');
                                        $('body').removeClass('modal-open');
                                        $('.modal-backdrop').remove();

                                        if (!msg.ok) {
                                            $("#mensajes").html(`<div class="alert alert-danger" role="alert" align='center'>${msg.mensaje}</div>`)
                                        } else {
                                            $("#todasLasPublicaciones").click();
                                            socket.emit("nuevaPublicacion", {});
                                            alert(`${msg.mensaje}`);

                                        }




                                    }
                                })
                            })



                        }

                        for (publicacion of data.publicaciones) {
                            let idPublicacion = publicacion.id_pub;
                            $(`#guardarRetroalimentacion${idPublicacion}`).on("click", () => {
                                $.ajax({
                                    url: "/guardarRetroalimentacion",
                                    method: "POST",
                                    data: {
                                        idPublicacion,
                                        retroalimentacionPublicacion: $(`#retroalimentacionPublicacion${idPublicacion}`).val()
                                    },
                                    success: (data) => {
                                        if (!data.ok) {
                                            alert(data.mensaje);
                                        } else {
                                            alert("Respuesta a publicación guardada");

                                            socket.emit("guardarRetroalimentacion", {
                                                id: data.idUsuario,
                                                titulo: data.tituloPublicacion
                                            });
                                            $("#todasLasPublicaciones").click();


                                        }
                                    }
                                })

                            });
                        }

                        $.ajax({
                            url: "/obtenerIdUsuario",
                            success: (id) => {
                                for (publicacion of data.publicaciones) {
                                    let idPublicacion = publicacion.id_pub;
                                    $(`#like${publicacion.id_pub}`).off();

                                    $(`#like${publicacion.id_pub}`).on("click", () => {

                                        socket.emit("like", {
                                            idPublicacion,
                                            idUsuario: id.idUsuario
                                        });

                                    });
                                    $(`#dislike${publicacion.id_pub}`).off();
                                    $(`#dislike${publicacion.id_pub}`).on("click", () => {

                                        socket.emit("dislike", {
                                            idPublicacion,
                                            idUsuario: id.idUsuario
                                        });

                                    });
                                }

                            }
                        })








                    }





                }

            }






        });

    });


    socket.on("guardarRetroalimentacion", (data) => {
        $("#todasLasPublicaciones").click();
    })

    socket.on("nuevaPublicacion", (nuevaPublicacion) => {

        $("#todasLasPublicaciones").click();

    });

    socket.on("like", (data2) => {


        $.ajax({
            url: "/obtenerIdUsuario",
            success: (id) => {

                if (data2.estado == 1 && data2.idUsuario == id.idUsuario) {

                    $(`#imgLike${data2.idPublicacion}`).html(`<div id='imgLike${data2.idPublicacion}'><img src='assets/img/like.png' style='cursor:pointer' width='80%' id='like${data2.idPublicacion}'> <div id='numLikes${data2.idPublicacion}'> ${data2.votos.votosPositivos}</div></div>`)
                } else if (data2.estado == 2 && data2.idUsuario == id.idUsuario) {
                    $(`#imgLike${data2.idPublicacion}`).html(`<div id='imgLike${data2.idPublicacion}'><img src='assets/img/likeMarcado.png' style='cursor:pointer' width='80%' id='like${data2.idPublicacion}'><div id='numLikes${data2.idPublicacion}'> ${data2.votos.votosPositivos}</div></div>`)
                    $(`#imgDislike${data2.idPublicacion}`).html(`<div id='imgDislike${data2.idPublicacion}'><img src='assets/img/dislike.png' style='cursor:pointer' width='80%' id='dislike${data2.idPublicacion}'> <div id='numDislikes${data2.idPublicacion}'> ${data2.votos.votosNegativos}</div></div>`)
                } else if ((data2.estado == 3 || data2.estado == 4) && data2.idUsuario == id.idUsuario) {

                    $(`#imgLike${data2.idPublicacion}`).html(`<div id='imgLike${data2.idPublicacion}'><img src='assets/img/likeMarcado.png' style='cursor:pointer' width='80%' id='like${data2.idPublicacion}'> <div id='numLikes${data2.idPublicacion}'> ${data2.votos.votosPositivos}</div></div>`)
                } else {
                    $(`#numLikes${data2.idPublicacion}`).html(data2.votos.votosPositivos);
                    $(`#numDislikes${data2.idPublicacion}`).html(data2.votos.votosNegativos);
                }



                $(`#like${data2.idPublicacion}`).off();
                $(`#like${data2.idPublicacion}`).on("click", () => {

                    socket.emit("like", {
                        idPublicacion: data2.idPublicacion,
                        idUsuario: id.idUsuario
                    });

                });
                $(`#dislike${data2.idPublicacion}`).off();
                $(`#dislike${data2.idPublicacion}`).on("click", () => {

                    socket.emit("dislike", {
                        idPublicacion: data2.idPublicacion,
                        idUsuario: id.idUsuario
                    });

                });

            }
        })



    });



    socket.on("dislike", (data2) => {


        $.ajax({
            url: "/obtenerIdUsuario",
            success: (id) => {
                if (data2.estado == 1 && data2.idUsuario == id.idUsuario) {

                    $(`#imgLike${data2.idPublicacion}`).html(`<div id='imgLike${data2.idPublicacion}'><img src='assets/img/like.png' style='cursor:pointer' width='80%' id='like${data2.idPublicacion}'> <div id='numLikes${data2.idPublicacion}'> ${data2.votos.votosPositivos}</div></div>`)
                    $(`#imgDislike${data2.idPublicacion}`).html(`<div id='imgDislike${data2.idPublicacion}'><img src='assets/img/dislikeMarcado.png' style='cursor:pointer' width='80%' id='dislike${data2.idPublicacion}'> <div id='numDislikes${data2.idPublicacion}'> ${data2.votos.votosNegativos}</div></div>`)
                } else if (data2.estado == 2 && data2.idUsuario == id.idUsuario) {

                    $(`#imgDislike${data2.idPublicacion}`).html(`<div id='imgDislike${data2.idPublicacion}'><img src='assets/img/dislike.png' style='cursor:pointer' width='80%' id='dislike${data2.idPublicacion}'> <div id='numDislikes${data2.idPublicacion}'> ${data2.votos.votosNegativos}</div></div>`)
                } else if ((data2.estado == 3 || data2.estado == 4) && data2.idUsuario == id.idUsuario) {

                    $(`#imgDislike${data2.idPublicacion}`).html(`<div id='imgDislike${data2.idPublicacion}'><img src='assets/img/dislikeMarcado.png' style='cursor:pointer' width='80%' id='dislike${data2.idPublicacion}'> <div id='numDislikes${data2.idPublicacion}'> ${data2.votos.votosNegativos}</div></div>`)
                } else {
                    $(`#numLikes${data2.idPublicacion}`).html(data2.votos.votosPositivos);
                    $(`#numDislikes${data2.idPublicacion}`).html(data2.votos.votosNegativos);
                }


                $(`#like${data2.idPublicacion}`).off();
                $(`#like${data2.idPublicacion}`).on("click", () => {

                    socket.emit("like", {
                        idPublicacion: data2.idPublicacion,
                        idUsuario: id.idUsuario
                    });

                });
                $(`#dislike${data2.idPublicacion}`).off();
                $(`#dislike${data2.idPublicacion}`).on("click", () => {

                    socket.emit("dislike", {
                        idPublicacion: data2.idPublicacion,
                        idUsuario: id.idUsuario
                    });

                });

            }
        })

    });


    $("#todasLasPublicaciones").click();




})