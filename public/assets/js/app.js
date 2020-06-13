$(() => {

    function horasParaCBA() {
        $.ajax({
            url: "/obtenerHorasParaCBA",
            success: (data) => {
                if (!data.ok) {
                    $("#horasNecesariasParaCBA").html(`<div class="alert alert-danger" role="alert">Necesitas llenar el formulario de la pestaña "Salario" para visualizar esta información</div>`)
                } else {
                    $("#horasNecesariasParaCBA").html(`<div class="alert alert-success" role="alert">${data.horas.toFixed(2)} Horas</div>`);
                }
            }
        });
    }

    function horasParaGastos() {
        $.ajax({
            url: "/obtenerHorasParaGastos",
            success: (data) => {
                if (!data.ok) {
                    $("#horasNecesariasParaGastos").html(`<div class="alert alert-danger" role="alert">Necesitas llenar los formularios de las pestañas "Salario" y "Gastos" para visualizar esta información</div>`)
                } else {
                    $("#horasNecesariasParaGastos").html(`<div class="alert alert-success" role="alert">${data.horas.toFixed(2)} Horas</div>`);
                }
            }
        })
    }


    $("#salarioForm").on("click", () => {
        horasParaCBA();
        horasParaGastos();
        $("#salarioForm").addClass("btn btn-primary");
        $("#gastosForm").removeClass("btn btn-primary")
        $("#gastosForm").addClass("nav-link");

        $("#formsContent").html(`<h3 align="center">Datos Salario</h3>

  <br>
  <div id="mensaje"></div>
  
  <div align="center">
    <table cellpadding="10">
    <tr>
      <td>
        Sueldo Mensual:
      </td>
      <td>
        <input type="text" class="form-control" id="sueldoMensual" placeholder="(valor)">
      </td>
      <td>
        Horas de trabajo al día:
      </td>
      <td>
         <input type="text" class="form-control" id="horasAlDia" placeholder="(valor)">
      </td>
    </tr>  
    <tr>
      <td>
        Días trabajados a la semana:
      </td>
      <td>
        <input type="text" class="form-control" id="diasALaSemana" placeholder="(valor)">
      </td>
      <td colspan="2">
    <button class="btn btn-primary btn-block" id="guardarDatosSalario">Guardar</button>
      </td>
    </tr>
  </table>
  </div>`);

        $("#guardarDatosSalario").on("click", () => {


            let data = {
                sueldo: $("#sueldoMensual").val().split(" ").join(""),
                horas: $("#horasAlDia").val().split(" ").join(""),
                dias: $("#diasALaSemana").val().split(" ").join("")
            }


            $.ajax({
                url: "/guardarDatosSalario",
                method: "POST",
                data,
                success: (msg) => {

                    if (msg.ok == false) {
                        $("#mensaje").html(`<div class="alert alert-danger" role="alert">${msg.mensaje}</div>`)

                    } else if (msg.ok == true) {
                        $("#mensaje").html(`<div class="alert alert-success" role="alert">${msg.mensaje}</div>`)
                        $.ajax({
                            url: "/obtenerSalario",
                            success: (msg) => {
                                $("#sueldoMensual").val(msg.sue_dat);
                                $("#horasAlDia").val(msg.hor_dat);
                                $("#diasALaSemana").val(msg.dia_dat);
                            }
                        });
                    }
                    horasParaCBA();
                    horasParaGastos();
                }
            });



        })
        $.ajax({
            url: "/obtenerSalario",
            success: (msg) => {
                $("#sueldoMensual").val(msg.sue_dat);
                $("#horasAlDia").val(msg.hor_dat);
                $("#diasALaSemana").val(msg.dia_dat);
            }
        })
    });





    $("#gastosForm").on("click", () => {

        $("#gastosForm").addClass("btn btn-primary");
        $("#salarioForm").removeClass("btn btn-primary");
        $("#salarioForm").addClass("nav-link")

        $("#formsContent").html(`<h3 align="center">Datos de Gastos(Mensuales)</h3>
          <div id="mensaje"></div>
                  <div id="presupuestoDisponible"></div>
        <div align="center">
            <table cellpadding="10">
            <tr>
              <td>
                Transporte:
              </td>
              <td>
                <input type="text" class="form-control" id="gastoTransporte" maxlength="9" placeholder="(valor)">
              </td>
              <td>
                Pago de servicios:
              </td>
              <td>
                 <input type="text" class="form-control" id="gastoServicios" maxlength="9" placeholder="(valor)">
              </td>
            </tr>  
            <tr>
              <td>
                Renta:
              </td>
              <td>
                <input type="text" class="form-control" id="gastoRenta" maxlength="9" placeholder="(valor)">
              </td>
              <td>
                Pago de deudas:
              </td>
              <td>
                <input type="text" class="form-control" id="gastoDeudas" maxlength="9" placeholder="(valor)">
              </td>
            </tr>
            <tr>
              <td>
                Pago de seguros:
              </td>
              <td>
                <input type="text" class="form-control" id="gastoSeguros" maxlength="9" placeholder="(valor)">
              </td>
              <td>
                Pago de tarjetas:
              </td>
              <td>
                <input type="text" class="form-control" id="gastoTarjetas" maxlength="9" placeholder="(valor)">
              </td>
            </tr>
            <tr>
              <td>
                Otros:
              </td>
              <td>
                <input type="text" class="form-control" id="gastoOtros" maxlength="9" placeholder="(valor)">
              </td>
              <td>
                Precio canasta básica:
              </td>
              <td>
                <div id="precioCanastaBasica"></div>
              </td>
            </tr>
            <tr>
            <td colspan="4">
              <button class="btn btn-primary btn-block" id="guardarDatosGastos">Guardar</button>
            </td>
            </tr>
          </table>
          </div>`);

        $.ajax({
            url: "/obtenerDatosGastos",
            success: (data) => {
                if (data.transporte) {
                    $("#gastoTransporte").val(data.transporte);
                    $("#gastoServicios").val(data.servicios);
                    $("#gastoRenta").val(data.renta);
                    $("#gastoDeudas").val(data.deudas);
                    $("#gastoSeguros").val(data.seguros);
                    $("#gastoTarjetas").val(data.tarjetas);
                    $("#gastoOtros").val(data.otros);

                    $("#gastoTransporte").keyup();
                    $("#gastoServicios").keyup();
                    $("#gastoRenta").keyup();
                    $("#gastoDeudas").keyup();
                    $("#gastoSeguros").keyup();
                    $("#gastoTarjetas").keyup();
                    $("#gastoOtros").keyup();


                }
            }
        })
        $("#guardarDatosGastos").on("click", () => {
            let data = {
                transporte: $("#gastoTransporte").val().split(" ").join(""),
                servicios: $("#gastoServicios").val().split(" ").join(""),
                renta: $("#gastoRenta").val().split(" ").join(""),
                deudas: $("#gastoDeudas").val().split(" ").join(""),
                seguros: $("#gastoSeguros").val().split(" ").join(""),
                tarjetas: $("#gastoTarjetas").val().split(" ").join(""),
                otros: $("#gastoOtros").val().split(" ").join(""),

            };

            $.ajax({
                url: "/guardarDatosGastos",
                method: "POST",
                data,
                success: (msg) => {
                    if (msg.ok == false) {
                        $("#mensaje").html(`<div class="alert alert-danger" role="alert">${msg.mensaje}</div>`)
                    } else if (msg.ok == true) {
                        $("#mensaje").html(`<div class="alert alert-success" role="alert">${msg.mensaje}</div>`)
                    }
                    horasParaCBA();
                    horasParaGastos();
                }
            });


        });

        let gastoTransporte = 0;
        let gastoServicios = 0;
        let gastoRenta = 0;
        let gastoDeudas = 0;
        let gastoSeguros = 0;
        let gastoTarjetas = 0;
        let gastoOtros = 0;
        let sueldo = 0;
        let canastaBasica = 0;
        let sueldoRestante = 0;

        $.ajax({
            url: "/obtenerSalario",
            success: (msg) => {

                sueldoRestante = msg.sue_dat;
                sueldo = msg.sue_dat;
                $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${msg.sue_dat}</div> </font>`);



            }
        });








        $("#gastoTransporte").on("keyup", () => {
            if (sueldo != 0) {
                let input = $("#gastoTransporte").val().split(" ").join("");

                if (input == "") {
                    gastoTransporte = 0;
                    sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;
                    if (sueldoRestante < 0) {
                        $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                    } else {
                        $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                    }
                } else {

                    if (!isNaN(input)) {

                        gastoTransporte = parseFloat(input)
                        sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;

                        if (sueldoRestante < 0) {
                            $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        } else {
                            $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        }

                    } else {
                        gastoTransporte = 0;
                        sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;
                        if (sueldoRestante < 0) {
                            $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        } else {
                            $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        }
                    }

                }
            }
        }); //Fin input gasto transporte


        $("#gastoServicios").on("keyup", () => {
            if (sueldo != 0) {

                let input = $("#gastoServicios").val().split(" ").join("");

                if (input == "") {
                    gastoServicios = 0;
                    sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;
                    if (sueldoRestante < 0) {
                        $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                    } else {
                        $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                    }
                } else {

                    if (!isNaN(input)) {

                        gastoServicios = parseFloat(input)
                        sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;

                        if (sueldoRestante < 0) {
                            $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        } else {
                            $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        }

                    } else {
                        gastoServicios = 0;
                        sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;
                        if (sueldoRestante < 0) {
                            $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        } else {
                            $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        }
                    }

                }
            }
        }); //Fin input gasto servicios




        $("#gastoRenta").on("keyup", () => {
            if (sueldo != 0) {
                let input = $("#gastoRenta").val().split(" ").join("");

                if (input == "") {
                    gastoRenta = 0;
                    sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;
                    if (sueldoRestante < 0) {
                        $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                    } else {
                        $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                    }
                } else {

                    if (!isNaN(input)) {

                        gastoRenta = parseFloat(input)
                        sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;

                        if (sueldoRestante < 0) {
                            $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        } else {
                            $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        }

                    } else {
                        gastoRenta = 0;
                        sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;
                        if (sueldoRestante < 0) {
                            $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        } else {
                            $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        }
                    }

                }
            }
        }); //Fin input gasto renta




        $("#gastoDeudas").on("keyup", () => {
            if (sueldo != 0) {
                let input = $("#gastoDeudas").val().split(" ").join("");

                if (input == "") {
                    gastoDeudas = 0;
                    sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;
                    if (sueldoRestante < 0) {
                        $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                    } else {
                        $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                    }
                } else {

                    if (!isNaN(input)) {

                        gastoDeudas = parseFloat(input)
                        sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;

                        if (sueldoRestante < 0) {
                            $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        } else {
                            $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        }

                    } else {
                        gastoDeudas = 0;
                        sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;
                        if (sueldoRestante < 0) {
                            $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        } else {
                            $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        }
                    }

                }
            }
        }); //Fin input gasto deudas





        $("#gastoSeguros").on("keyup", () => {
            if (sueldo != 0) {
                let input = $("#gastoSeguros").val().split(" ").join("");

                if (input == "") {
                    gastoSeguros = 0;
                    sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;
                    if (sueldoRestante < 0) {
                        $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                    } else {
                        $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                    }
                } else {

                    if (!isNaN(input)) {

                        gastoSeguros = parseFloat(input)
                        sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;

                        if (sueldoRestante < 0) {
                            $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        } else {
                            $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        }

                    } else {
                        gastoSeguros = 0;
                        sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;
                        if (sueldoRestante < 0) {
                            $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        } else {
                            $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        }
                    }

                }
            }
        }); //Fin input gasto seguros

        $("#gastoTarjetas").on("keyup", () => {
            if (sueldo != 0) {
                let input = $("#gastoTarjetas").val().split(" ").join("");

                if (input == "") {
                    gastoTarjetas = 0;
                    sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;
                    if (sueldoRestante < 0) {
                        $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                    } else {
                        $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                    }
                } else {

                    if (!isNaN(input)) {

                        gastoTarjetas = parseFloat(input)
                        sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;

                        if (sueldoRestante < 0) {
                            $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        } else {
                            $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        }

                    } else {
                        gastoTarjetas = 0;
                        sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;
                        if (sueldoRestante < 0) {
                            $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        } else {
                            $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        }
                    }

                }
            }
        }); //Fin input gasto tarjetas


        $("#gastoOtros").on("keyup", () => {
            if (sueldo != 0) {
                let input = $("#gastoOtros").val().split(" ").join("");

                if (input == "") {
                    gastoOtros = 0;
                    sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;
                    if (sueldoRestante < 0) {
                        $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                    } else {
                        $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                    }
                } else {

                    if (!isNaN(input)) {

                        gastoOtros = parseFloat(input)
                        sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;

                        if (sueldoRestante < 0) {
                            $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        } else {
                            $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        }

                    } else {
                        gastoOtros = 0;
                        sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;
                        if (sueldoRestante < 0) {
                            $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        } else {
                            $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        }
                    }

                }
            }
        }); //Fin input gasto otros



        $.ajax({
            url: "/canastaBasica",
            success: (msg) => {

                if (msg.ok == true) {
                    canastaBasica = parseFloat(msg.precio);
                    $("#precioCanastaBasica").html(`${msg.precio}`);

                    if (sueldo != 0) {
                        sueldoRestante = sueldo - gastoTransporte - canastaBasica - gastoServicios - gastoRenta - gastoDeudas - gastoSeguros - gastoTarjetas - gastoOtros;
                        if (sueldoRestante < 0) {
                            $("#presupuestoDisponible").html(`<font color='red'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        } else {
                            $("#presupuestoDisponible").html(`<font color='green'>Presupuesto disponible: <div id='sueldo'>${sueldoRestante}</div> </font>`);
                        }
                    }


                }

                function actualizar() {
                    let data = {
                        transporte: $("#gastoTransporte").val().split(" ").join(""),
                        servicios: $("#gastoServicios").val().split(" ").join(""),
                        renta: $("#gastoRenta").val().split(" ").join(""),
                        deudas: $("#gastoDeudas").val().split(" ").join(""),
                        seguros: $("#gastoSeguros").val().split(" ").join(""),
                        tarjetas: $("#gastoTarjetas").val().split(" ").join(""),
                        otros: $("#gastoOtros").val().split(" ").join(""),

                    };

                    $.ajax({
                        url: "/guardarDatosGastos",
                        method: "POST",
                        data,
                        success: (msg) => {

                        }
                    });
                }







                $.ajax({
                    url: "/obtenerDatosGastos",
                    success: (data) => {
                        if (data.transporte) {
                            $("#gastoTransporte").val(data.transporte);
                            $("#gastoServicios").val(data.servicios);
                            $("#gastoRenta").val(data.renta);
                            $("#gastoDeudas").val(data.deudas);
                            $("#gastoSeguros").val(data.seguros);
                            $("#gastoTarjetas").val(data.tarjetas);
                            $("#gastoOtros").val(data.otros);

                            $("#gastoTransporte").keyup();
                            $("#gastoServicios").keyup();
                            $("#gastoRenta").keyup();
                            $("#gastoDeudas").keyup();
                            $("#gastoSeguros").keyup();
                            $("#gastoTarjetas").keyup();
                            $("#gastoOtros").keyup();

                            if (data.cba != canastaBasica) {

                                $("#mensaje").html(`<div class="alert alert-primary" role="alert">El precio de la canasta básica cambio desde la última vez que fueron guardados los gastos <br>Precio uardado: ${data.cba}<br>Precio actual: ${canastaBasica}</div>`);

                                actualizar();

                            }
                        }
                    }
                })
            }



        })






    });


    $("#salarioForm").click();









});