const chai = require("chai");
const assert = chai.assert;

const validaciones = require("../middlewares/validaciones.js");
const db = require("../base-datos/conexion.js")

describe("Probar Validación de Letras (Caso Positivo)", () => {
    it("Solo se pueden poner letras y espacios en esta validación, máxima longitud de 30 caracteres", () => {
        result = validaciones.letras("Hola Mundo");

        assert.equal(true, result);
    });
});

describe("Probar Validación de Letras (Caso Negativo)", () => {
    it("Solo se pueden poner letras y espacios en esta validación, máxima longitud de 30 caracteres", () => {
        result = validaciones.letras("Hola Mundo123123");

        assert.equal(false, result);
    });
});


describe("Probar validación alfanumérica (Caso Positivo)", () => {
    it("Solo se pueden introducir letras, números y los caracteres siguientes: (.¡?¿!) longitud máxima de 30 caracteres", () => {
        result = validaciones.alphaNumC("¿Pasará la prueba?");
        assert.equal(true, result);
    });
});


describe("Probar validación alfanumérica (Caso Negativo)", () => {
    it("Solo se pueden introducir letras, números y los caracteres siguientes: (.¡?¿!) longitud máxima de 30 caracteres", () => {
        result = validaciones.alphaNumC("¿Pasará la prueba?--__#$%");
        assert.equal(false, result);
    });
});

describe("Probar validacion para escritura (Caso Positivo)", () => {
    it("Solo se pueden introducir letras, números y los caracteres siguientes: (.¡?¿!#$%&()=,;:-_) longitud máxima de 1100 caracteres", () => {
        result = validaciones.escritura(".¡?¿!#$%&()=,;:-_ Estos son los caracteres válidos");
        assert.equal(true, result);
    });
});

describe("Probar validacion para escritura (Caso Negativo)", () => {
    it("Solo se pueden introducir letras, números y los caracteres siguientes: (.¡?¿!#$%&()=,;:-_) longitud máxima de 1100 caracteres", () => {
        result = validaciones.escritura("@*****@ Estos son algunos de los caracteres no válidos");
        assert.equal(false, result);
    });
});

describe("Probar la validacion para números decimales (Caso Positivo)", () => {
    it("Solo se pueden introducir números del tipo float", () => {
        result = validaciones.validarDecimal("23.56");
        assert.equal(true, result);

    });
});

describe("Probar la validacion para números decimales (Caso Negativo)", () => {
    it("Solo se pueden introducir números del tipo float", () => {
        result = validaciones.validarDecimal("23.asd");
        assert.equal(false, result);

    });
});

describe("Probar la validación de números enteros (Caso Positivo)", () => {
    it("Solo se pueden introducir numeros del tipo integer", () => {
        result = validaciones.validarEntero("5");
        assert.equal(true, result);
    });
});

describe("Probar la validación de números enteros (Caso Negativo)", () => {
    it("Solo se pueden introducir numeros del tipo integer", () => {
        result = validaciones.validarEntero("5.6");
        assert.equal(false, result);
    });
});

describe("Probar la obtención del salario de un usuario", () => {
    it("Se ingresa el id del usuario y obtenemos un objeto con los datos del sueldo del usuario," +
        "de ese objeto simplemente sacamos el sueldo", () => {
            db.obtenerDatosSueldo(1).then(data => {
                assert.equal(data.sue_dat, 6000); //El 6000 es el dato que anteriormente se habia ingresado en la bd
            }).catch(err => {
                assert.equal(true, false);
            });
        })
})


describe("Probar la obtencion de las horas necesarias de trabajo para poder adquirir la canasta básica", () => {
    it("Se ingresa el id del usuario y se obtiene un objeto en el cual se encuentran las horas necesarias", () => {
        db.obtenerHorasParaCBA(1).then(data => {
            assert.equal(parseFloat(data.horas).toFixed(2), 37.50); //El 37.50 es el dato que ya se obtuvo previamente para realizar 
            //la prueba
        }).catch(err => {
            console.log(err);
            assert.equal(true, false);
        })
    });
});


describe("Probar el método que obtiene el último precio de la canasta básica", () => {
    it("Simplemente se llama al método y se obtiene un objeto en cual se encuentra el precio de la canasta básica", () => {
        db.obtenerPrecioCanastaBasica().then(data => {
            assert.equal(data.can_pre, 1562.66); //El 1562.66 fue sacado directamente de la bd para poder comprobar que el
            //método funciona
        }).catch(err => {
            assert.equal(true, false);
        })
    });
});