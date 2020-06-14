const letras = (checkStr) => {
    var checkOk = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ" + "abcdefghijklmnopqrstuvwxyzáéíóú" + " ";
    var todovalido = true;
    for (i = 0; i < checkStr.length; i++) {
        ch = checkStr.charAt(i);
        for (j = 0; j < checkOk.length; j++) {
            if (ch == checkOk.charAt(j)) {
                break;
            }
        }
        if (j == checkOk.length) {
            todovalido = false;
            break;
        }
    }
    if (checkStr.length < 1 || checkStr.length > 30) {
        todovalido = false;
    }
    return todovalido;
}
const alphaNumC = (checkStr) => {
    var checkOk = "ABCDEFGHIJHKLMNÑOPQRSTUVWXYZÁÉÍÓÚ" + "abcdefghijklmnopqrstuvwxyzáéíóú" + "@1234567890.¡?¿!<> ";
    var todovalido = true;
    for (i = 0; i < checkStr.length; i++) {
        ch = checkStr.charAt(i);
        for (j = 0; j < checkOk.length; j++) {
            if (ch == checkOk.charAt(j)) {
                break;
            }
        }
        if (j == checkOk.length) {
            todovalido = false;
            break;
        }
    }
    if (checkStr.length < 1) {
        todovalido = false;
    }
    return todovalido;
}
const alphaNum3 = (checkStr) => {
    var checkOk = "ABCDEFGHIJHKLMNÑOPQRSTUVWXYZÁÉÍÓÚ" + "abcdefghijklmnopqrstuvwxyzáéíóú" + "@1234567890.¡?¿!<> ";
    var todovalido = true;
    for (i = 0; i < checkStr.length; i++) {
        ch = checkStr.charAt(i);
        for (j = 0; j < checkOk.length; j++) {
            if (ch == checkOk.charAt(j)) {
                break;
            }
        }
        if (j == checkOk.length) {
            todovalido = false;
            break;
        }
    }
    if (checkStr.length < 1 || checkStr.length > 40) {
        todovalido = false;
    }
    return todovalido;
}
const correo = (checkStr) => {
    var checkOk = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ" + "abcdefghijklmnopqrstuvwxyzáéíóú" + "@1234567890.";
    var todovalido = true;
    for (i = 0; i < checkStr.length; i++) {
        ch = checkStr.charAt(i);
        for (j = 0; j < checkOk.length; j++) {
            if (ch == checkOk.charAt(j)) {
                break;
            }
        }
        if (j == checkOk.length) {
            todovalido = false;
            break;
        }
    }
    if (checkStr.length < 1 || checkStr.length > 40) {
        todovalido = false;
    }
    return todovalido;
}
const escritura = (checkStr) => {
    var checkOk = "ABCDEFGHIJHKLMNÑOPQRSTUVWXYZÁÉÍÓÚ" + "abcdefghijklmnopqrstuvwxyzáéíóú" + "1234567890.¡?¿!#$%&()=,;:-_ ";
    var todovalido = true;
    for (i = 0; i < checkStr.length; i++) {
        ch = checkStr.charAt(i);
        for (j = 0; j < checkOk.length; j++) {
            if (ch == checkOk.charAt(j)) {
                break;
            }
        }

        if (j == checkOk.length && ch != "\n") {

            todovalido = false;
            break;
        }
    }
    if (checkStr.length < 1) {

        todovalido = false;
    }

    return todovalido;
}


function validarDecimal(valor) {
    if (valor.length > 6 && !valor.includes(".")) {
        return false;
    } else {
        var RE = /^\d{0,6}(\.\d{1})?\d{0,1}$/;
        if (RE.test(valor)) {
            return true;
        } else {
            return false;
        }
    }

}

function validarDecimal2(valor) {
    if (valor.length > 6 && !valor.includes(".")) {
        return false;
    } else {
        var RE = /^\d{0,4}(\.\d{1})?\d{0,1}$/;
        if (RE.test(valor)) {
            return true;
        } else {
            return false;
        }
    }

}

function validarEntero(numero) {
    if (numero % 1 == 0) {
        return true;
    } else {
        return false;
    }
}

function validarDate(checkStr) {
    var checkOk = "1234567890-";
    var todovalido = true;
    for (i = 0; i < checkStr.length; i++) {
        ch = checkStr.charAt(i);
        for (j = 0; j < checkOk.length; j++) {
            if (ch == checkOk.charAt(j)) {
                break;
            }
        }
        if (j == checkOk.length) {
            todovalido = false;
            break;
        }
    }
    if (!checkStr.length == 10) {
        todovalido = false;
    }
    return todovalido;
}




module.exports = {
    letras,
    alphaNumC,
    escritura,
    validarDecimal,
    validarEntero,
    validarDecimal2,
    validarDate,
    correo,
    alphaNum3
};