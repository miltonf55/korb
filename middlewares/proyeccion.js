const ML = require("ml-regression");

function valoresProyeccion(xN, y) {
    // Define features
    var x = new Array();
    for (let index = 0; index < xN; index++) {
        x[index]=index+1;
    }
    // Create a model
    var regression = new ML.SimpleLinearRegression(x, y);
    // Get results  
    let r= new Array(2);
    r[0]=regression.slope;
    r[1]=regression.intercept;
    return r;
}

module.exports = {
    valoresProyeccion
}

