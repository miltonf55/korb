const {
    io
} = require("../server");
const db = require("../base-datos/conexion.js");
io.on("connection", (client) => {


    // Escuchar el cliente

    client.on("like", (data) => {


        db.darLikeAPublicacion(data.idPublicacion, data.idUsuario).then(msg => {

            db.obtenerVotosPublicacion(data.idPublicacion).then(msg2 => {
                client.broadcast.emit("like", {
                    estado: msg,
                    idPublicacion: data.idPublicacion,
                    idUsuario: data.idUsuario,
                    votos: msg2
                });
                client.emit("like", {
                    estado: msg,
                    idPublicacion: data.idPublicacion,
                    idUsuario: data.idUsuario,
                    votos: msg2
                });
            }).catch(console.log)



        }).catch(console.log);


    });

    client.on("dislike", (data) => {

        db.darDislikeAPublicacion(data.idPublicacion, data.idUsuario).then(msg => {

            db.obtenerVotosPublicacion(data.idPublicacion).then(msg2 => {
                client.broadcast.emit("dislike", {
                    estado: msg,
                    idPublicacion: data.idPublicacion,
                    idUsuario: data.idUsuario,
                    votos: msg2
                });
                client.emit("dislike", {
                    estado: msg,
                    idPublicacion: data.idPublicacion,
                    idUsuario: data.idUsuario,
                    votos: msg2
                });
            }).catch(console.log)



        }).catch(console.log);
    });

    client.on("nuevaPublicacion", (publicacion) => {
        client.broadcast.emit("nuevaPublicacion", publicacion);
        client.emit("nuevaPublicacion", publicacion);

    })

    client.on("guardarRetroalimentacion", (data) => {
        console.log(data);
        client.broadcast.emit("guardarRetroalimentacion", data);

    })

});