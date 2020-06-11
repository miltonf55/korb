const ML = require("ml-regression");

function valoresProyeccion(xN) {
    console.log(xN);
    /* Define features
    var x = new Array(xN);
    var y = new Array(XN);*/
    var x = [1,2,3];
    var y = [1,2,3];
    // Create a model
    var regression = new ML.SimpleLinearRegression(x, y);
    // Get results
    console.log("Ichi "+regression.predict(0));
    console.log("Ni "+regression.computeX(0));
    console.log("San "+regression);
    return x;
}

module.exports = {
    valoresProyeccion
}

