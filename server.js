const express = require("express");
var app = express();
const http = require("http").Server(app);

app.set("port", (process.env.PORT || 5555));
http.listen(app.get("port"), function() {
	console.log("Servidor en el puerto", app.get("port"));
});

app.use(express.static("public"));

app.get("/", function(req, res) {
    
});

app.get("*", function(req, res) {
	res.status(404).send("Error 404 - No existe esa página my friend");
});