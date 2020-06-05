const autenticacion = (req, res, next) => {
    if (req.session.usuario == undefined) {
        res.redirect("/");
    } else {
        next();
    }
}
const autenticacionInversa = (req, res, next) => {
    if (req.session.usuario != undefined) {
        res.redirect("/proyecciones")
    } else {
        next();
    }
}

verificarPrivilegiosAdmin = (req, res, next) => {
    if (req.session.usuario.privilegios != 1) {
        res.redirect("/proyecciones");
    } else {
        next();
    }
}


verificarPrivilegiosUsuario = (req, res, next) => {
    if (req.session.usuario.privilegios != 2) {
        res.redirect("/proyecciones");
    } else {
        next();
    }
}





module.exports = {
    autenticacion,
    autenticacionInversa,
    verificarPrivilegiosAdmin,
    verificarPrivilegiosUsuario
}