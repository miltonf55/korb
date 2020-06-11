$(() => {
    console.log("Hi");
    function proyeccionCB() {
        let d=dateN();
        let data = {
            id: "38",
            date: d
        }
        $.ajax({
            url: "/proyectoX",
            method: "POST",
            data,
            success: (data) => {
                if (!data.ok) {
                    $("#horasNecesariasParaCBA").html(`<div class="alert alert-danger" role="alert">Necesitas llenar el formulario de la pestaña "Salario" para visualizar esta información</div>`)
                } else {
                    $("#chart").html(`<div class="alert alert-success" role="alert"> Horas</div>`);
                }
            }
        });
    }
        proyeccionCB();

        $("#proyecta").html(`<div class="input-group">
                <select class="custom-select" id="canastaSelect" name="canastaSelect" aria-label="Example select with button addon">
                    <option selected value="38">Canasta básica</option>
                    <option value="1">Tortilla de maiz</option>
                    <option value="2">Pasta para sopa</option>
                    <option value="3">Pan blanco</option>
                    <option value="4">Pan de dulce</option>
                    <option value="5">Pan para sandwich/hamburguesa</option>
                    <option value="6">Arroz en grano</option>
                    <option value="7">Cereal de maiz, arroz o trigo</option>
                    <option value="8">Bisctec</option>
                    <option value="9">Carne de res molida</option>
                    <option value="10">Costilla y chuleta de cerdo</option>
                    <option value="11">Chorizo y longaniza</option>
                    <option value="12">Jamon</option>
                    <option value="13">Pierna pechuga con hueso</option>
                    <option value="14">Pierna pechuga sin hueso</option>
                    <option value="15">Pollo entero</option>
                    <option value="16">Pescado entero</option>
                    <option value="17">Leche de vaca entera</option>
                    <option value="18">Queso fresco</option>
                    <option value="19">Yoghurt</option>
                    <option value="20">Huevos de gallina</option>
                    <option value="21">Aceite vegetal</option>
                    <option value="22">Papa</option>
                    <option value="23">Cebolla</option>
                    <option value="24">Chile</option>
                    <option value="25">Jitomate</option>
                    <option value="26">Frijol</option>
                    <option value="27">Limon</option>
                    <option value="28">Manzana</option>
                    <option value="29">Naranja</option>
                    <option value="30">Platano tabasco</option>
                    <option value="31">Azucar</option>
                    <option value="32">Pollo Rostizado</option>
                    <option value="33">Agua</option>
                    <option value="34">Jugos y nectares envasados</option>
                    <option value="35">Refrescos de cola y de sabores</option>
                    <option value="36">Comida consumida fuera del hogar</option>
                    <option value="37">Otros alimentos preparados</option>
                </select>
                <div class="input-group-append">
                    <input type="date" id="date" name="date" min='2000-01-01' max="2045-12-31" value="">
                </div>
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" id="proye" type="button">Aceptar</button>
                </div>
            </div>
            <br><br>
            <canvas id="myChart" class="table"></canvas>`);

        $("#proye").on("click", () => {


            let data = {
                id: $("#canastaSelect").val().split(" ").join(""),
                date: $("#date").val().split(" ").join("")
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
                }
            });



        });
    function dateN(){
        var fecha = new Date(); 
        var mes = fecha.getMonth()+1;
        var dia = fecha.getDate();
        var ano = fecha.getFullYear();
        if(dia<10)
            dia='0'+dia; 
        if(mes<10)
            mes='0'+mes;
        let f=ano+"-"+mes+"-"+dia;
        console.log(f);
        return f;
    }
});
