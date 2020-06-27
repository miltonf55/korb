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
                    $("#chart").html(`<div class="alert alert-danger" role="alert">${datae.ms}</div>`)
                } else {
                    let html=grafica(datae.proyeccion, data.date, 38);
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
                    <option value="12">Jamón</option>
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
            </div>`);

        $("#date").change(() => {
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
                        $("#chart").html(`<div class="alert alert-danger" role="alert">${datae.ms}</div>`)
                    } else {
                        let html=grafica(datae.proyeccion, data.date, parseInt(data.id));
                        $("#chart").html(html);
                    }
                }
            });
        });
        $("#canastaSelect").change(() => {
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
                        $("#chart").html(`<div class="alert alert-danger" role="alert">${datae.ms}</div>`)
                    } else {
                        let html=grafica(datae.proyeccion, data.date, parseInt(data.id));
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
    function grafica(proyeccion, date, id){
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
                datasets: [{
                    data: [`;
        for (let i = 0; i < 11; i++) {
            let y=(m*x)+b;
            html+=y+`,`
            x++;
        }
        x++;
        let y=(m*x)+b;
        let r=Math.floor(Math.random() * 7) + 1;
        switch (r) {
            case 1:
                html+=y+`],
                backgroundColor: ['#062b61','#246a73','#062b61','#246a73','#062b61','#246a73','#062b61','#246a73','#062b61','#246a73','#062b61','#246a73'], `;
            break;
            case 2:
                html+=y+`],
                backgroundColor: ['#246a73','#062b61','#246a73','#062b61','#246a73','#062b61','#246a73','#062b61','#246a73','#062b61','#246a73','#062b61'], `; 
            break;
            case 3:
                html+=y+`],
                backgroundColor: ['#B26E63','#062b61','#B26E63','#062b61','#B26E63','#062b61','#B26E63','#062b61','#B26E63','#062b61','#B26E63','#062b61'], `;
            break;
            case 4:
                html+=y+`],
                backgroundColor: ['#FF6978','#246a73','#FF6978','#246a73','#FF6978','#246a73','#FF6978','#246a73','#FF6978','#246a73','#FF6978','#246a73'], `;
            break;
            case 5:
                html+=y+`],
                backgroundColor: ['#246a73','#062b61','#246a73','#062b61','#246a73','#062b61','#246a73','#062b61','#246a73','#062b61','#246a73','#062b61'], `; 
            break;
            case 6:
                html+=y+`],
                backgroundColor: ['#B26E63','#062b61','#B26E63','#062b61','#B26E63','#062b61','#B26E63','#062b61','#B26E63','#062b61','#B26E63','#062b61'], `;
            break;
            case 7:
                html+=y+`],
                backgroundColor: ['#FF6978','#246a73','#FF6978','#246a73','#FF6978','#246a73','#FF6978','#246a73','#FF6978','#246a73','#FF6978','#246a73'], `;
            break;
        
            default:
                html+=y+`],
                backgroundColor: ['#062b61','#246a73','#062b61','#246a73','#062b61','#246a73','#062b61','#246a73','#062b61','#246a73','#062b61','#246a73'], `;
            break;
        }

        switch (id) {
            case 1:
                html+=`label: 'Proyección Tortilla de maiz'}],
                labels: [`;
            break;
            case 2:
                html+=`label: 'Proyección Pasta para sopa'}],
                labels: [`;
            break;
            case 3:
                html+=`label: 'Proyección Pan blanco'}],
                labels: [`;
            break;
            case 4:
                html+=`label: 'Proyección Pan de dulce'}],
                labels: [`;
            break;
            case 5:
                html+=`label: 'Proyección Pan para sandwich/hamburguesa'}],
                labels: [`;
            break;
            case 6:
                html+=`label: 'Proyección Arroz en grano'}],
                labels: [`;
            break;
            case 7:
                html+=`label: 'Proyección Cereal de maiz, arroz o trigo'}],
                labels: [`;
            break;
            case 8:
                html+=`label: 'Proyección Bisctec'}],
                labels: [`;
            break;
            case 9:
                html+=`label: 'Proyección Carne de res molida'}],
                labels: [`;
            break;
            case 10:
                html+=`label: 'Proyección Costilla y chuleta de cerdo'}],
                labels: [`;
            break;
            case 11:
                html+=`label: 'Proyección Chorizo y longaniza'}],
                labels: [`;
            break;
            case 12:
                html+=`label: 'Proyección Jamón'}],
                labels: [`;
            break;
            case 13:
                html+=`label: 'Proyección Pierna pechuga con hueso'}],
                labels: [`;
            break;
            case 14:
                html+=`label: 'Proyección Pierna pechuga sin hueso'}],
                labels: [`;
            break;
            case 15:
                html+=`label: 'Proyección Pollo entero'}],
                labels: [`;
            break;
            case 16:
                html+=`label: 'Proyección Pescado entero'}],
                labels: [`;
            break;
            case 17:
                html+=`label: 'Proyección Leche de vaca entera'}],
                labels: [`;
            break;
            case 18:
                html+=`label: 'Proyección Queso fresco'}],
                labels: [`;
            break;
            case 19:
                html+=`label: 'Proyección Yoghurt'}],
                labels: [`;
            break;
            case 20:
                html+=`label: 'Proyección Huevos de gallina'}],
                labels: [`;
            break;
            case 21:
                html+=`label: 'Proyección Aceite vegetal'}],
                labels: [`;
            break;
            case 22:
                html+=`label: 'Proyección Papa'}],
                labels: [`;
            break;
            case 23:
                html+=`label: 'Proyección Cebolla'}],
                labels: [`;
            break;
            case 24:
                html+=`label: 'Proyección Chile'}],
                labels: [`;
            break;
            case 25:
                html+=`label: 'Proyección Jitomate'}],
                labels: [`;
            break;
            case 26:
                html+=`label: 'Proyección Frijol'}],
                labels: [`;
            break;
            case 27:
                html+=`label: 'Proyección Limon'}],
                labels: [`;
            break;
            case 28:
                html+=`label: 'Proyección Manzana'}],
                labels: [`;
            break;
            case 29:
                html+=`label: 'Proyección Naranja'}],
                labels: [`;
            break;
            case 30:
                html+=`label: 'Proyección Platano'}],
                labels: [`;
            break;
            case 31:
                html+=`label: 'Proyección Azucar'}],
                labels: [`;
            break;
            case 32:
                html+=`label: 'Proyección Pollo'}],
                labels: [`;
            break;
            case 33:
                html+=`label: 'Proyección Agua'}],
                labels: [`;
            break;
            case 34:
                html+=`label: 'Proyección Jugos y nectares envasados'}],
                labels: [`;
            break;
            case 35:
                html+=`label: 'Proyección Refrescos de cola y de sabores'}],
                labels: [`;
            break;
            case 36:
                html+=`label: 'Proyección Comida consumida fuera del hogar'}],
                labels: [`;
            break;
            case 37:
                html+=`label: 'Proyección Otros alimentos preparados'}],
                labels: [`;
            break;
            case 38:
                html+=`label: 'Proyección Canasta básica'}],
                labels: [`;
            break;
            default:
                html+=`label: 'Proyección'}],
                labels: [`;
            break;
        }

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
