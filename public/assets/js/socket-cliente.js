var socket = io();
//Escuchar
socket.on("connect", () => {
    console.log("Conectado al Servidor");
});

socket.on("disconnect", () => {

    console.log("Perdimos conexion con el servidor");
});

socket.on("enviarMensaje", (mensaje) => {
    console.log("Servidor:");
    console.log(mensaje);
});

//Emits son para enviar información
socket.emit("enviarMensaje", {
        usuario: "Aaron",
        mensaje: "Hola Mundo"
    },
    (respuesta) => {
        console.log(respuesta);
    });