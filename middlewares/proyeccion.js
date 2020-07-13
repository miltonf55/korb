const ML = require("ml-regression");

function valoresProyeccion(xN, y) {
    // Define features
    //prediction(xN, y);
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
/*async function prediction(xN, y,){
    var x = new Array();
    for (let index = 0; index < xN; index++) {
        x[index]=index+1;
    }
    var data={
        x:x,
        y:y
    };
    function createModel() {
        // Create a sequential model
        const model = tf.sequential(); 
        
        // Add a input layer
        model.add(tf.layers.dense({inputShape: [1], units: 50, useBias: true}));
        model.add(tf.layers.dense({units: 50, activation: 'sigmoid'}));
        model.add(tf.layers.dense({units: 50, activation: 'sigmoid'}));
        model.add(tf.layers.dense({units: 50, activation: 'sigmoid'}));
        model.add(tf.layers.dense({units: 50, activation: 'sigmoid'}));
      
        // Add an output layer
        model.add(tf.layers.dense({units: 1, useBias: true})); 
        return model;
    }
    function convertToTensor(data) {
        // Wrapping these calculations in a tidy will dispose any 
        // intermediate tensors.
        
        return tf.tidy(() => {
          // Step 1. Shuffle the data    
          tf.util.shuffle(data);
      
          // Step 2. Convert data to Tensor
          const inputs = data.map(d => d.x)
          const labels = data.map(d => d.y);
      
          const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
          const labelTensor = tf.tensor2d(labels, [labels.length, 1]);
      
          //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
          const inputMax = inputTensor.max();
          const inputMin = inputTensor.min();  
          const labelMax = labelTensor.max();
          const labelMin = labelTensor.min();
      
          const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
          const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));
      
          return {
            inputs: normalizedInputs,
            labels: normalizedLabels,
            // Return the min/max bounds so we can use them later.
            inputMax,
            inputMin,
            labelMax,
            labelMin,
          }
        });  
      }
      async function trainModel(model, inputs, labels) {
        // Prepare the model for training.  
        model.compile({
          optimizer: tf.train.adam(),
          loss: tf.losses.meanSquaredError,
          metrics: ['mse'],
        });
        
        const batchSize = 32;
        const epochs = 25;
        
        return await model.fit(inputs, labels, {
          batchSize,
          epochs,
          shuffle: true
        });
      }
    var model = createModel(); 
    var tensorData = convertToTensor(data);
    var {inputs, labels} = tensorData; 
    await trainModel(model, inputs, labels);
    function testModel(model, normalizationData) {
        const {inputMax, inputMin, labelMin, labelMax} = normalizationData;  
        
        // Generate predictions for a uniform range of numbers between 0 and 1;
        // We un-normalize the data by doing the inverse of the min-max scaling 
        // that we did earlier.
        const [xs, preds] = tf.tidy(() => {
          
          const xs = tf.linspace(0, 1, 100);      
          const preds = model.predict(xs.reshape([100, 1]));      
          
          const unNormXs = xs
            .mul(inputMax.sub(inputMin))
            .add(inputMin);
          
          const unNormPreds = preds
            .mul(labelMax.sub(labelMin))
            .add(labelMin);
          
          // Un-normalize the data
          return [unNormXs.dataSync(), unNormPreds.dataSync()];
        });
        
       
        var predictedPoints = Array.from(xs).map((val, i) => {
          return {x: val, y: preds[i]}
        });
        console.log(predictedPoints);
      }
      // Make some predictions using the model and compare them to the
      // original data
      testModel(model, tensorData);
}*/


module.exports = {
    valoresProyeccion
}

