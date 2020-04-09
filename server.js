const express = require("express");
const mysql=require('mysql');
var app = express();
const http = require("http").Server(app);

app.set("port", (process.env.PORT || 5555));
http.listen(app.get("port"), function() {
	console.log("Servidor en el puerto", app.get("port"));
});

var con= mysql.createConnection("mysql://ba36d017d9e475:2e5db296@us-cdbr-iron-east-01.cleardb.net/heroku_7a19aa0bce95bcf?reconnect=true");
    /*{
	host:'us-cdbr-iron-east-01.cleardb.net',
	user:'ba36d017d9e475',
	password:'2e5db296',
	database:'heroku_7a19aa0bce95bcf'
});*/
con.connect(function(err) {
    if (err) {
      console.error('Error connecting: ' + err.stack);
      return;
    }
   
    console.log('Connected as id ' + connection.threadId);
  });

app.use(express.static("public"));

app.get("/", function(req, res) {
    
});

app.get("*", function(req, res) {
	res.status(404).send("Error 404 - No existe esa página my friend");
});