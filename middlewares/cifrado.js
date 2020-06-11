const CryptoJS = require("crypto-js");

function cifrar(txt) {
    var ciphertext = CryptoJS.AES.encrypt(txt, process.env.KEY);
    return ciphertext;
}

function decifrar(ciphertext) {
    var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), process.env.KEY);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
}


module.exports = {
    cifrar,
    decifrar
}