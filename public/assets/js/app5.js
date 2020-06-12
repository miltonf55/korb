$(() => {
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
            success: (datae) => {
                if (!datae.ok) {
                    $("#chart").html(`<div class="alert alert-danger" role="alert">Algo salio mal. Por favor intente mas tarde.</div>`)
                } else {
                    let html=grafica(datae.proyeccion, data.date);
                    $("#chart").html(html);
                }
            }
        });
    }
    $(document).ready(() => {
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
            </div>`);

        $("#proye").on("click", () => {
            $("#chart").html(`<div class="progress">
                                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div>
                            </div>`);
            var data = {
                id: $("#canastaSelect").val().split(" ").join(""),
                date: $("#date").val().split(" ").join("")
            }
            $.ajax({
                url: "/proyectoX",
                method: "POST",
                data,
                success: (datae) => {
                    if (!datae.ok) {
                        $("#chart").html(`<div class="alert alert-danger" role="alert">Algo salio mal. Por favor intente mas tarde.</div>`)
                    } else {
                        let html=grafica(datae.proyeccion, data.date);
                        $("#chart").html(html);
                    }
                }
            });



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
        return f;
    }
    function grafica(proyeccion, date){
        let m=proyeccion[0];
        let b=proyeccion[1];
        let x=0;
        let d=date.split("-");
        x=(parseInt(d[0])-2000)*12;
        x+=parseInt(d[1]);
        x-=12;
        let html=`<canvas id="myChart" class="table"></canvas>
        <script>    
            var ctx = document.getElementById('myChart').getContext('2d');
            var chart = new Chart(ctx, {
                
                type: 'bar',
                data:{
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    data: [`;
        for (let i = 0; i < 11; i++) {
            let y=(m*x)+b;
            html+=y+`,`
            x++;
        }
        x++;
        let y=(m*x)+b;
        html+=y+`],
        backgroundColor: ['#062b61','#246a73','#062b61','#246a73','#062b61','#246a73','#062b61','#246a73','#062b61','#246a73','#062b61','#246a73',],
        label: 'Proyeccion'}],
        labels: [`;
        if (x%12==0) {
            x-=12;
            for (let j = 0; j < 11; j++) {
                let dat="";
                let w=Math.floor(x/12);
                dat+=(w+2000)+"-";
                let mes=(x-(w*12))+1;
                if(mes<10)
                    mes='0'+mes;
                dat+=mes+"-01";
                html+="'"+dat+"',"
                x++;
            }
            x++;
            let dat="";
            let w=Math.floor(x/12);
            dat+=(w+1999)+"-";
            dat+="12-01";
            html+="'"+dat+`']},
            options: {responsive: true}
            });
            </script>`;   
        }else{
            x-=12;
            for (let j = 0; j < 11; j++) {
                let dat="";
                let w=Math.floor(x/12);
                dat+=(w+2000)+"-";
                let mes=x-(w*12);
                mes+=1;
                if(mes<10){
                    mes='0'+mes;
                    dat+=mes+"-01";
                }else{
                    dat+=mes+"-01";
                }
                    
                html+="'"+dat+"',"
                x++;
            }
            x++;
            let dat="";
            let w=Math.floor(x/12);
            dat+=(w+2000)+"-";
            let mes=x-(w*12);
            if(mes<10)
                mes='0'+mes;
            if(mes==0)
                mes='12';
            dat+=mes+"-01";
            html+="'"+dat+`']},
            options: {responsive: true}
            });
            </script>`;
        }
        return html;
    }
});
