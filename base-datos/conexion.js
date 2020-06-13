const c = require('./confDB.js');

//Conexión a la db
var pool = c.Connect;

const {
    cifrar,
    decifrar
} = require("../middlewares/cifrado.js");




const probarConexion = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                resolve("Base de Datos en linea");
            }
            connection.release();
        });
    });
};


const validarCorreo = (correo) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(`select * from usuario`, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        var disponible = true;

                        for (usuario of res) {
                            if (decifrar(usuario.cor_usu) === correo) {

                                disponible = false;
                            }
                        }

                        resolve(disponible);
                    }
                });
                
            }
            connection.release();
        });
    });
}


const validarUsername = (username) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(`select * from usuario where usus_usu='${username}'`, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {

                        if (res[0] != undefined) {

                            resolve(false);
                        } else {

                            resolve(true);
                        }
                    }
                });
            }
            connection.release();
        });
    });
}


const agregarUsuario = (usuario) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {   
                pool.query(`insert into usuario (nom_usu,app_usu,apm_usu,usus_usu,pas_usu,cor_usu,id_pri) 
                    values('${usuario.nombre}','${usuario.appaterno}','${usuario.apmaterno}','${usuario.username}','${usuario.password}','${usuario.correo}',2)`, (err) => {
                    if (err) {
                        console.log(err);
                        reject(err)
                    } else {
                        resolve("Registrado");
                    }
                });
            }
            connection.release();
        });        
    });
}


const iniciarSesion = (correo, password) => {
    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                connection.query(`select * from usuario`, (err, res) => {

                    let datos = undefined;

                    for (usuario of res) {
                        if (decifrar(usuario.cor_usu) === correo && decifrar(usuario.pas_usu) === password) {

                            datos = {
                                id: usuario.id_usu,
                                nombreCompleto: `${decifrar(usuario.app_usu)} ${decifrar(usuario.apm_usu)} ${decifrar(usuario.nom_usu)}`,
                                nombre: decifrar(usuario.nom_usu),
                                appaterno: decifrar(usuario.app_usu),
                                apmaterno: decifrar(usuario.apm_usu),
                                username: usuario.usus_usu,
                                correo: decifrar(usuario.cor_usu),
                                privilegios: usuario.id_pri
                            }
                        }
                    }
                    resolve(datos);

                });
            }
            connection.release();
        });

    });
}


const actualizarDatosUsuario = (id, datos) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {

            if (err) {
                reject(err)
            } else {
                connection.query(`update usuario set nom_usu='${cifrar(datos.nombre)}',app_usu='${cifrar(datos.appaterno)}',apm_usu='${cifrar(datos.apmaterno)}', cor_usu='${cifrar(datos.correo)}', usus_usu='${datos.username}' where id_usu='${id}'`, (err) => {

                    if (err) {
                        reject(err);
                    } else {
                        pool.getConnection((err, connection) => {

                            if (err) {
                                reject(err);
                            } else {
                                connection.query(`select * from usuario where id_usu='${id}'`, (err, res) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        let datos = undefined;

                                        for (usuario of res) {
                                            datos = {
                                                id: usuario.id_usu,
                                                nombreCompleto: `${decifrar(usuario.app_usu)} ${decifrar(usuario.apm_usu)} ${decifrar(usuario.nom_usu)}`,
                                                nombre: decifrar(usuario.nom_usu),
                                                appaterno: decifrar(usuario.app_usu),
                                                apmaterno: decifrar(usuario.apm_usu),
                                                username: usuario.usus_usu,
                                                correo: decifrar(usuario.cor_usu),
                                                privilegios: usuario.id_pri
                                            }
                                        }
                                        resolve(datos);
                                    }
                                });
                            }

                            connection.release();
                        });
                    }
                });
            }

            connection.release();
        });
    });
}


const verificarPassword = (id, password) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {

            if (err) {
                reject(err)
            } else {
                connection.query(`select * from usuario where id_usu=${id}`, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        if (decifrar(res[0].pas_usu) === password) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }
                })
            }

            connection.release();
        });
    });
}

const actualizarPassword = (id, password) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                connection.query(`update usuario set pas_usu='${cifrar(password)}' where id_usu=${id}`, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve("Contraseña actualizada");
                    }
                });
            }
            connection.release();
        });
    });
}


const obtenerUsuarios = (id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                connection.query(`select * from usuario where id_usu!=${id}`, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        let usuarios = [];
                        let datos = {};

                        for (usuario of res) {

                            if (usuario.id_pri == 1) {
                                datos = {
                                    id: usuario.id_usu,
                                    nombreCompleto: `${decifrar(usuario.app_usu)} ${decifrar(usuario.apm_usu)} ${decifrar(usuario.nom_usu)}`,
                                    nombre: decifrar(usuario.nom_usu),
                                    appaterno: decifrar(usuario.app_usu),
                                    apmaterno: decifrar(usuario.apm_usu),
                                    username: usuario.usus_usu,
                                    correo: decifrar(usuario.cor_usu),
                                    privilegios: "Administrador",
                                    intocable: true
                                }
                            } else if (usuario.id_pri == 2) {
                                datos = {
                                    id: usuario.id_usu,
                                    nombreCompleto: `${decifrar(usuario.app_usu)} ${decifrar(usuario.apm_usu)} ${decifrar(usuario.nom_usu)}`,
                                    nombre: decifrar(usuario.nom_usu),
                                    appaterno: decifrar(usuario.app_usu),
                                    apmaterno: decifrar(usuario.apm_usu),
                                    username: usuario.usus_usu,
                                    correo: decifrar(usuario.cor_usu),
                                    privilegios: "Usuario"
                                }
                            }

                            usuarios.push(datos);
                            datos = {};

                        }

                        resolve(usuarios);
                    }


                });
            }
            connection.release();
        });
    });
}



const eliminarUsuario = (id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {

            if (err) {
                reject(err)
            } else {
                connection.query(`delete from usuario where id_usu=${id}`, (err) => {
                    if (err) {
                        reject("No es posible eliminar a este usuario, para más detalles entrar en contacto con desarrolladores");
                    } else {
                        resolve("Usuario eliminado");
                    }
                });
            }

            connection.release();
        });
    });
}


const obtenerUsuarioById = (id) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {

            if (err) {
                reject(err)
            } else {
                connection.query(`select * from usuario where id_usu=${id}`, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        if (res[0] == undefined) {
                            reject(false);
                        } else {
                            let datos = {
                                nombreCompleto: `${decifrar(res[0].app_usu)} ${decifrar(res[0].apm_usu)} ${decifrar(res[0].nom_usu)}`,
                                nombre: decifrar(res[0].nom_usu),
                                appaterno: decifrar(res[0].app_usu),
                                apmaterno: decifrar(res[0].apm_usu),
                                username: res[0].usus_usu,
                                correo: decifrar(res[0].cor_usu),
                                privilegios: res[0].id_pri
                            }

                            resolve(datos);
                        }
                    }
                });
            }

            connection.release();
        });
    });
}



const getUsuariosOrdenados = (id, filtro) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {


            if (err) {
                reject("Ha ocurrido un error inesperado, vuelve a intentarlo más tarde");
            } else {



                connection.query(`select * from usuario where id_usu!=${id}`, (err, res) => {


                    if (err) {
                        reject("Ha ocurrido un error inesperado, vuelve a intentarlo más tarde");
                    } else {


                        let resultados = [];
                        let datos = {};

                        for (usuario of res) {


                            if (usuario.id_pri == 1) {
                                datos = {
                                    id: usuario.id_usu,
                                    nombreCompleto: `${decifrar(usuario.app_usu)} ${decifrar(usuario.apm_usu)} ${decifrar(usuario.nom_usu)}`,
                                    nombre: decifrar(usuario.nom_usu),
                                    appaterno: decifrar(usuario.app_usu),
                                    apmaterno: decifrar(usuario.apm_usu),
                                    username: usuario.usus_usu,
                                    correo: decifrar(usuario.cor_usu),
                                    privilegios: "Administrador",
                                    intocable: true
                                }
                            } else if (usuario.id_pri == 2) {
                                datos = {
                                    id: usuario.id_usu,
                                    nombreCompleto: `${decifrar(usuario.app_usu)} ${decifrar(usuario.apm_usu)} ${decifrar(usuario.nom_usu)}`,
                                    nombre: decifrar(usuario.nom_usu),
                                    appaterno: decifrar(usuario.app_usu),
                                    apmaterno: decifrar(usuario.apm_usu),
                                    username: usuario.usus_usu,
                                    correo: decifrar(usuario.cor_usu),
                                    privilegios: "Usuario"
                                }
                            }

                            resultados.push(datos);
                            datos = {};

                        }




                        if (filtro === "Por apellido(ascendente)") {
                            let resultadosOrdenados = [];

                            resultadosOrdenados = resultados.sort(function (a, b) {
                                if (a.appaterno > b.appaterno) {
                                    return 1;
                                }
                                if (a.appaterno < b.appaterno) {
                                    return -1;
                                }
                                // a must be equal to b
                                return 0;
                            });

                            resolve(resultadosOrdenados);


                        } else if (filtro === "Por apellido(descendente)") {

                            let resultadosOrdenados = [];

                            resultadosOrdenados = resultados.sort(function (a, b) {
                                if (a.appaterno < b.appaterno) {
                                    return 1;
                                }
                                if (a.appaterno > b.appaterno) {
                                    return -1;
                                }
                                // a must be equal to b
                                return 0;
                            });

                            resolve(resultadosOrdenados);

                        } else if (filtro === "Por nombre de usuario(ascendente)") {

                            let resultadosOrdenados = [];

                            resultadosOrdenados = resultados.sort(function (a, b) {
                                if (a.username > b.username) {
                                    return 1;
                                }
                                if (a.username < b.username) {
                                    return -1;
                                }
                                // a must be equal to b
                                return 0;
                            });

                            resolve(resultadosOrdenados);

                        } else if (filtro === "Por nombre de usuario(descendente)") {

                            let resultadosOrdenados = [];

                            resultadosOrdenados = resultados.sort(function (a, b) {
                                if (a.username < b.username) {
                                    return 1;
                                }
                                if (a.username > b.username) {
                                    return -1;
                                }
                                // a must be equal to b
                                return 0;
                            });

                            resolve(resultadosOrdenados);


                        } else if (filtro === "Solo usuarios") {

                            let resultadosOrdenados = [];

                            for (usuario of resultados) {
                                if (usuario.privilegios === "Usuario") {
                                    resultadosOrdenados.push(usuario);
                                }
                            }

                            resolve(resultadosOrdenados);
                        } else if (filtro === "Solo admins") {

                            let resultadosOrdenados = [];

                            for (usuario of resultados) {
                                if (usuario.privilegios === "Administrador") {
                                    resultadosOrdenados.push(usuario);
                                }
                            }
                            resolve(resultadosOrdenados);
                        } else if (filtro === "Sin filtro") {
                            resolve(undefined)
                        } else {

                            reject("Filtro no encontrado");
                        }




                    }

                });







            }





            connection.release();
        });


    });
}

const obtenerDatosSueldo = (id) => {
    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {

            if (err) {
                reject({})
            } else {
                connection.query(`select * from datosusu where id_usu=${id}`, (err, res) => {

                    if (err) {
                        reject({})
                    } else {
                        resolve(res[res.length - 1]);
                    }
                })
            }

            connection.release();
        });

    });
}

const guardarDatosSalario = (data, id) => {
    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {


            if (err) {
                reject(err);
            } else {
                let fecha = new Date();
                connection.query(` insert into datosusu(sue_dat,hor_dat,dia_dat,fec_dat,id_usu) values(${data.sueldo},${data.horas},${data.dias},'${fecha.getFullYear()}-${fecha.getMonth()+1}-${fecha.getDate()}',${id})`, (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve("Datos guardados");
                    }
                })
            }

            connection.release();
        })
    });
}


const guardarDatosGastos = (data, id, cba) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {


                pool.getConnection((err, connection) => {

                    if (err) {
                        reject(err)
                    } else {
                        connection.query(`select * from presupuesto where id_usu=${id}`, (err, res) => {
                            if (err) {
                                reject(err);
                            } else {

                                if (res[0]) {
                                    pool.getConnection((err, connection) => {

                                        if (err) {
                                            reject(err)
                                        } else {
                                            connection.query(`update presupuesto set tra_prs=${data.transporte},ser_prs=${data.servicios},
                                                            pat_prs=${data.tarjetas},ren_prs=${data.renta},deu_prs=${data.deudas}, seg_prs=${data.seguros},
                                                            cba_prs=${cba},otr_prs=${data.otros} where id_usu=${id}`, (err) => {
                                                if (err) {
                                                    reject(err)
                                                } else {
                                                    resolve("Datos guardados");
                                                }
                                            });
                                        }
                                        connection.release();
                                    });
                                } else {
                                    connection.query(`insert into presupuesto(tra_prs,ser_prs,pat_prs,ren_prs,deu_prs,seg_prs,cba_prs,otr_prs,id_usu)
                                                values(${data.transporte},${data.servicios},${data.tarjetas},${data.renta},${data.deudas},${data.seguros},${cba},${data.otros},${id})`, (err) => {
                                        if (err) {
                                            reject(err)
                                        } else {
                                            resolve("Datos guardados");
                                        }
                                    });
                                }
                            }
                        })
                    }

                    connection.release();
                });





            }
            connection.release();
        })
    })

}


const obtenerPrecioCanastaBasica = () => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {

            if (err) {
                reject(err)
            } else {
                connection.query("select * from precio where id_pro=38", (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res[res.length - 1]);
                    }
                })
            }
            connection.release();
        });
    });

}

const obtenerDatosGastos = (id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject({});
            } else {
                connection.query(`select * from presupuesto where id_usu=${id}`, (err, res) => {
                    if (err) {
                        reject({})
                    } else {
                        let result = res[0];
                        if (result) {

                            let data = {

                                transporte: result.tra_prs,
                                servicios: result.ser_prs,
                                tarjetas: result.pat_prs,
                                renta: result.ren_prs,
                                deudas: result.deu_prs,
                                seguros: result.seg_prs,
                                otros: result.otr_prs,
                                cba: result.cba_prs

                            }
                            resolve(data);
                        } else {
                            reject({});
                        }

                    }
                })
            }

            connection.release();
        })
    });
}



const obtenerHorasParaCBA = (id) => {

    return new Promise((resolve, reject) => {

        obtenerPrecioCanastaBasica().then(msg1 => {

            let precioCanastaBasica = msg1.can_pre;

            obtenerDatosSueldo(id).then(msg2 => {
                let datosSueldo = msg2;

                let sueldoPorHora = ((datosSueldo.sue_dat) / ((datosSueldo.hor_dat) * (datosSueldo.dia_dat) * (4)));

                let horasNecesarias = precioCanastaBasica / sueldoPorHora;

                resolve({
                    ok: true,
                    horas: horasNecesarias
                });

            }).catch(err => {

                reject({
                    ok: false
                });
            })


        }).catch(err => {

            reject({
                ok: false
            });
        });





    });
}



const obtenerHorasParaGastos = (id) => {
    return new Promise((resolve, reject) => {

        obtenerDatosGastos(id).then(msg1 => {

            let precioGastos = msg1.transporte + msg1.servicios + msg1.tarjetas + msg1.renta + msg1.deudas + msg1.seguros + msg1.otros + msg1.cba;

            obtenerDatosSueldo(id).then(msg2 => {
                let datosSueldo = msg2;

                let sueldoPorHora = ((datosSueldo.sue_dat) / ((datosSueldo.hor_dat) * (datosSueldo.dia_dat) * (4)));

                let horasNecesarias = precioGastos / sueldoPorHora;

                resolve({
                    ok: true,
                    horas: horasNecesarias
                });

            }).catch(err => {

                reject({
                    ok: false
                });
            })


        }).catch(err => {

            reject({
                ok: false
            });
        });





    });
};


const obtenerPrecios = () => {

    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {

            if (err) {
                reject(err);
            } else {
                connection.query("select * from precio", (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        let resultados = [];
                        let data = {}
                        for (precio of res) {
                            data = {
                                idProducto: precio.id_pro,
                                precioProducto: precio.can_pre,
                                fecha: new Date(precio.fec_pre)
                            }
                            resultados.push(data);
                            data = {};
                        }
                        resolve(resultados);
                    }
                })
            }
            connection.release();
        });


    });

};

const obtenerUltimosPreciosdeProductos = () => {

    return new Promise((resolve, reject) => {
        let resultados = [];
        let data = {};
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query("select * from precio where fec_pre =(select max(fec_pre) from precio) order by fec_pre", (err, res) => {
                    if (err) {
                        reject(err)
                    } else {

                        for (precio of res) {
                            data = {
                                idProducto: precio.id_pro,
                                precioProducto: precio.can_pre,
                                fecha: new Date(precio.fec_pre)
                            }
                            resultados.push(data);
                            data = {};
                        }
                        resolve(resultados);



                    }



                });
            }
            connection.release();
        })

    });
};


const obtenerProductos = () => {
    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                connection.query("select * from producto", (err, res) => {

                    if (err) {
                        reject(err)
                    } else {
                        let resultados = [];
                        let data = {};

                        for (producto of res) {
                            data = {
                                idProducto: producto.id_pro,
                                nombreProducto: producto.nom_pro
                            }
                            resultados.push(data);
                            data = {};
                        }
                        resolve(resultados);

                    }

                });
            }
        })
    });
}


const guardarPrecios = (productos, fecha) => {

    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {

            if (err) {
                reject(err);
            } else {
                let query = `insert into precio(can_pre,fec_pre,id_pro) values`;

                for (producto of productos) {
                    if (producto.idProducto == productos[productos.length - 1].idProducto) {
                        query += `(${producto.precioProducto},'${fecha}',${producto.idProducto});`
                    } else {
                        query += `(${producto.precioProducto},'${fecha}',${producto.idProducto}),`
                    }

                }
                connection.query(query, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve("Datos Guardados");
                    }
                });


            }

            connection.release();

        });
    });
}

const obtenerTiposDePublicacion = () => {
    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {

            if (err) {
                reject(err);
            } else {
                connection.query("select * from tipopublicacion", (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                })
            }
            connection.release();
        });

    });
}

const guardarPublicacion = (data, id) => {
    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {


            if (err) {
                reject(err)
            } else {
                connection.query(`insert into publicacion(tit_pub,des_pub,fec_pub,hor_pub,min_pub,id_tip,id_usu,id_sta,vot_pub)
                    values ('${data.titulo}','${data.descripcion}','${data.fecha}','${data.hora}','${data.minuto}',${data.idTipoPublicacion},${id},1,0)`, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve("Publicación Guardada");
                    }
                });
            }

            connection.release();
        });

    });
}

const eliminarPublicacion = (idPublicacion, idUsuario) => {
    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {


            if (err) {
                reject(err)
            } else {
                connection.query(`select * from publicacion where id_pub=${idPublicacion} and id_usu=${idUsuario}`, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        if (res[0] != undefined) {

                            pool.getConnection((err, connection) => {

                                if (err) {
                                    reject(err)
                                } else {
                                    connection.query(`delete from publicacion where id_pub=${idPublicacion}`, (err) => {
                                        if (err) {
                                            reject(err)
                                        } else {
                                            resolve("Publicación Eliminada");
                                        }
                                    });
                                }

                                connection.release();
                            });

                        } else {
                            reject("F")
                        }
                    }
                });
            }


            connection.release();
        });
    });
}
const obtenerCostosCB = (id) => {

    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {

            if (err) {
                reject(err)
            } else {
                connection.query(`select can_pre from precio where id_pro=${id}`, (err, res) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            }


            connection.release();
        });
    });

}
const numeroRegistradoProductos = (id) => {

    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {

            if (err) {
                reject(err)
            } else {
                connection.query(`select count(can_pre) AS regCount from precio where id_pro=${id}`, (err, res) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            }


            connection.release();
        });
    });

}
const obtenerTodasLasPublicaciones = (idUsuario, filtros) => {

    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {

            if (err) {
                reject(err)
            } else {
                let sql = `select * from publicacion `;
                let {
                    filtroTipoPublicacion,
                    filtroEstadoResolucion,
                    filtroVotos
                } = filtros


                if (filtroTipoPublicacion != "" || filtroEstadoResolucion != "") {
                    sql += `where `
                    if (filtroTipoPublicacion != "" && filtroEstadoResolucion != "") {

                        if (filtroTipoPublicacion == "Sugerencias") {
                            sql += `id_tip=1 and `
                        } else if (filtroTipoPublicacion == "BUGs") {
                            sql += `id_tip=2 and `
                        } else if (filtroTipoPublicacion == "Errores") {
                            sql += `id_tip=3 and `
                        }

                    } else if (filtroTipoPublicacion != "") {

                        if (filtroTipoPublicacion == "Sugerencias") {
                            sql += `id_tip=1 `
                        } else if (filtroTipoPublicacion == "BUGs") {
                            sql += `id_tip=2 `
                        } else if (filtroTipoPublicacion == "Errores") {
                            sql += `id_tip=3 `
                        }
                    }
                    if (filtroEstadoResolucion != "") {
                        if (filtroEstadoResolucion == "Resueltas") {
                            sql += `id_sta=2 `
                        } else if (filtroEstadoResolucion == "Sin Resolver") {
                            sql += `id_sta=1 `
                        }
                    }

                }

                connection.query(`${sql}order by id_pub desc`, (err, res) => {

                    if (err) {

                        reject(err);
                    } else {
                        let publicacionesNormales = res;
                        pool.getConnection((err, connection) => {

                            if (err) {
                                reject(err)
                            } else {
                                connection.query(`select * from votos`, (err, res2) => {

                                    if (err) {

                                        reject(err);
                                    } else {
                                        pool.getConnection((err, connection) => {
                                            if (err) {
                                                reject(err)
                                            } else {
                                                connection.query(`select * from usuario`, (err, res3) => {
                                                    if (err) {
                                                        reject(err)
                                                    } else {
                                                        let usuarios = res3;

                                                        let resultados = [];

                                                        let votosPositivos = 0;
                                                        let votosNegativos = 0;
                                                        let voto = undefined;
                                                        for (publicacion of publicacionesNormales) {
                                                            data = {}
                                                            for (votos of res2) {
                                                                if (publicacion.id_pub == votos.id_pub && votos.est_vot == 2) {
                                                                    votosPositivos++;
                                                                    if (votos.id_usu == idUsuario) {
                                                                        voto = true;
                                                                    }
                                                                } else if (publicacion.id_pub == votos.id_pub && votos.est_vot == 1) {
                                                                    votosNegativos++;
                                                                    if (votos.id_usu == idUsuario) {
                                                                        voto = false;
                                                                    }
                                                                }
                                                            }

                                                            for (usuario of usuarios) {
                                                                if (usuario.id_usu == publicacion.id_usu) {
                                                                    resultados.push({
                                                                        id_pub: publicacion.id_pub,
                                                                        tit_pub: publicacion.tit_pub,
                                                                        des_pub: publicacion.des_pub,
                                                                        ret_pub: publicacion.ret_pub,
                                                                        fec_pub: publicacion.fec_pub,
                                                                        hor_pub: publicacion.hor_pub,
                                                                        min_pub: publicacion.min_pub,
                                                                        id_tip: publicacion.id_tip,
                                                                        id_usu: publicacion.id_usu,
                                                                        id_sta: publicacion.id_sta,
                                                                        votosPositivos,
                                                                        votosNegativos,
                                                                        username: usuario.usus_usu,
                                                                        voto
                                                                    })
                                                                }
                                                            }
                                                            votosPositivos = 0;
                                                            votosNegativos = 0;
                                                            voto = undefined;




                                                        }
                                                        let resultadosOrdenados = [];
                                                        if (filtroVotos == "Por Me Gustas(Descendente)") {


                                                            resultadosOrdenados = resultados.sort(function (a, b) {
                                                                if (a.votosPositivos < b.votosPositivos) {
                                                                    return 1;
                                                                }
                                                                if (a.votosPositivos > b.votosPositivos) {
                                                                    return -1;
                                                                }
                                                                // a must be equal to b
                                                                return 0;
                                                            });
                                                        } else if (filtroVotos == "Por Me Gustas(Ascendente)") {
                                                            resultadosOrdenados = resultados.sort(function (a, b) {
                                                                if (a.votosPositivos > b.votosPositivos) {
                                                                    return 1;
                                                                }
                                                                if (a.votosPositivos < b.votosPositivos) {
                                                                    return -1;
                                                                }
                                                                // a must be equal to b
                                                                return 0;
                                                            });
                                                        } else if (filtroVotos == "Por No Me Gustas(Descendente)") {
                                                            resultadosOrdenados = resultados.sort(function (a, b) {
                                                                if (a.votosNegativos < b.votosNegativos) {
                                                                    return 1;
                                                                }
                                                                if (a.votosNegativos > b.votosNegativos) {
                                                                    return -1;
                                                                }
                                                                // a must be equal to b
                                                                return 0;
                                                            });

                                                        } else if (filtroVotos == "Por No Me Gustas(Ascendente)") {
                                                            resultadosOrdenados = resultados.sort(function (a, b) {
                                                                if (a.votosNegativos > b.votosNegativos) {
                                                                    return 1;
                                                                }
                                                                if (a.votosNegativos < b.votosNegativos) {
                                                                    return -1;
                                                                }
                                                                // a must be equal to b
                                                                return 0;
                                                            });

                                                        } else {
                                                            resultadosOrdenados = resultados;
                                                        }
                                                        resolve(resultadosOrdenados)
                                                    }
                                                });
                                            }
                                        })


                                    }
                                });
                            }


                            connection.release();
                        });
                    }
                });
            }


            connection.release();
        });
    });
}

const obtenerPublicacionesDeUsuario = (id, filtros) => {

    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {

            if (err) {
                reject(err)
            } else {

                let sql = `select * from publicacion where `;
                let {
                    filtroTipoPublicacion,
                    filtroEstadoResolucion,
                    filtroVotos
                } = filtros


                if (filtroTipoPublicacion != "") {

                    if (filtroTipoPublicacion == "Sugerencias") {
                        sql += `id_tip=1 and `
                    } else if (filtroTipoPublicacion == "BUGs") {
                        sql += `id_tip=2 and `
                    } else if (filtroTipoPublicacion == "Errores") {
                        sql += `id_tip=3 and `
                    }
                }

                if (filtroEstadoResolucion != "") {
                    if (filtroEstadoResolucion == "Resueltas") {
                        sql += `id_sta=2 and `
                    } else if (filtroEstadoResolucion == "Sin Resolver") {
                        sql += `id_sta=1 and `
                    }
                }



                connection.query(`${sql}id_usu=${id} order by id_pub desc`, (err, res) => {

                    if (err) {
                        reject(err);
                    } else {
                        let publicacionesNormales = res;
                        pool.getConnection((err, connection) => {

                            if (err) {
                                reject(err)
                            } else {
                                connection.query(`select * from votos`, (err, res2) => {

                                    if (err) {

                                        reject(err);
                                    } else {
                                        let resultados = [];

                                        let votosPositivos = 0;
                                        let votosNegativos = 0;
                                        let voto = undefined;
                                        for (publicacion of publicacionesNormales) {

                                            for (votos of res2) {
                                                if (publicacion.id_pub == votos.id_pub && votos.est_vot == 2) {
                                                    votosPositivos++;
                                                    if (votos.id_usu == id) {
                                                        voto = true;
                                                    }
                                                } else if (publicacion.id_pub == votos.id_pub && votos.est_vot == 1) {
                                                    votosNegativos++;
                                                    if (votos.id_usu == id) {
                                                        voto = false;
                                                    }
                                                }
                                            }



                                            resultados.push({
                                                id_pub: publicacion.id_pub,
                                                tit_pub: publicacion.tit_pub,
                                                des_pub: publicacion.des_pub,
                                                ret_pub: publicacion.ret_pub,
                                                fec_pub: publicacion.fec_pub,
                                                hor_pub: publicacion.hor_pub,
                                                min_pub: publicacion.min_pub,
                                                id_tip: publicacion.id_tip,
                                                id_usu: publicacion.id_usu,
                                                id_sta: publicacion.id_sta,
                                                votosPositivos,
                                                votosNegativos,
                                                voto
                                            })
                                            votosPositivos = 0;
                                            votosNegativos = 0;
                                            voto = undefined;

                                        }

                                        let resultadosOrdenados = [];
                                        if (filtroVotos == "Por Me Gustas(Descendente)") {


                                            resultadosOrdenados = resultados.sort(function (a, b) {
                                                if (a.votosPositivos < b.votosPositivos) {
                                                    return 1;
                                                }
                                                if (a.votosPositivos > b.votosPositivos) {
                                                    return -1;
                                                }
                                                // a must be equal to b
                                                return 0;

                                            });

                                        } else if (filtroVotos == "Por Me Gustas(Ascendente)") {
                                            resultadosOrdenados = resultados.sort(function (a, b) {
                                                if (a.votosPositivos > b.votosPositivos) {
                                                    return 1;
                                                }
                                                if (a.votosPositivos < b.votosPositivos) {
                                                    return -1;
                                                }
                                                // a must be equal to b
                                                return 0;
                                            });
                                        } else if (filtroVotos == "Por No Me Gustas(Descendente)") {
                                            resultadosOrdenados = resultados.sort(function (a, b) {
                                                if (a.votosNegativos < b.votosNegativos) {
                                                    return 1;
                                                }
                                                if (a.votosNegativos > b.votosNegativos) {
                                                    return -1;
                                                }
                                                // a must be equal to b
                                                return 0;
                                            });
                                        } else if (filtroVotos == "Por No Me Gustas(Ascendente)") {
                                            resultadosOrdenados = resultados.sort(function (a, b) {
                                                if (a.votosNegativos > b.votosNegativos) {
                                                    return 1;
                                                }
                                                if (a.votosNegativos < b.votosNegativos) {
                                                    return -1;
                                                }
                                                // a must be equal to b
                                                return 0;
                                            });

                                        } else {
                                            resultadosOrdenados = resultados;
                                        }
                                        resolve(resultadosOrdenados)
                                    }
                                });
                            }


                            connection.release();
                        });
                    }
                });
            }


            connection.release();
        });
    });

}

const darLikeAPublicacion = (idPublicacion, idUsuario) => {
    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {

            if (err) {
                reject(err)
            } else {
                connection.query(`select * from votos where id_pub=${idPublicacion} and id_usu=${idUsuario}`, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {

                        if (res[0] == undefined) {
                            pool.getConnection((err, connection) => {
                                if (err) {
                                    reject(err)
                                } else {
                                    connection.query(`insert into votos(est_vot,id_usu,id_pub) values(2,${idUsuario},${idPublicacion})`, (err) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(4);
                                        }
                                    })
                                }
                                connection.release();
                            })

                        } else {
                            pool.getConnection((err, connection) => {
                                if (res[0].est_vot == 2) {
                                    connection.query(`update votos set est_vot = 0 where id_usu=${idUsuario} and id_pub=${idPublicacion}`, (err) => {
                                        if (err) {
                                            reject(err)
                                        } else {
                                            resolve(1)
                                        }
                                    })
                                } else if (res[0].est_vot == 1) {
                                    connection.query(`update votos set est_vot = 2 where id_usu=${idUsuario} and id_pub=${idPublicacion}`, (err) => {
                                        if (err) {
                                            reject(err)
                                        } else {
                                            resolve(2)
                                        }
                                    });
                                } else if (res[0].est_vot == 0) {
                                    connection.query(`update votos set est_vot = 2 where id_usu=${idUsuario} and id_pub=${idPublicacion}`, (err) => {
                                        if (err) {
                                            reject(err)
                                        } else {
                                            resolve(3)
                                        }
                                    });
                                }
                                connection.release();
                            });

                        }
                    }
                })
            }
            connection.release();
        });

    });
}

const darDislikeAPublicacion = (idPublicacion, idUsuario) => {
    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {

            if (err) {
                reject(err)
            } else {
                connection.query(`select * from votos where id_pub=${idPublicacion} and id_usu=${idUsuario}`, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {

                        if (res[0] == undefined) {
                            pool.getConnection((err, connection) => {
                                if (err) {
                                    reject(err)
                                } else {
                                    connection.query(`insert into votos(est_vot,id_usu,id_pub) values(1,${idUsuario},${idPublicacion})`, (err) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(4);
                                        }
                                    })
                                }
                                connection.release();
                            })

                        } else {
                            pool.getConnection((err, connection) => {
                                if (res[0].est_vot == 2) {
                                    connection.query(`update votos set est_vot = 1 where id_usu=${idUsuario} and id_pub=${idPublicacion}`, (err) => {
                                        if (err) {
                                            reject(err)
                                        } else {
                                            resolve(1)
                                        }
                                    })
                                } else if (res[0].est_vot == 1) {
                                    connection.query(`update votos set est_vot = 0 where id_usu=${idUsuario} and id_pub=${idPublicacion}`, (err) => {
                                        if (err) {
                                            reject(err)
                                        } else {
                                            resolve(2)
                                        }
                                    });
                                } else if (res[0].est_vot == 0) {
                                    connection.query(`update votos set est_vot = 1 where id_usu=${idUsuario} and id_pub=${idPublicacion}`, (err) => {
                                        if (err) {
                                            reject(err)
                                        } else {
                                            resolve(3)
                                        }
                                    });
                                }
                                connection.release();
                            });

                        }
                    }
                })
            }
            connection.release();
        });

    });
}

const obtenerVotosPublicacion = (idPublicacion) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {

            if (err) {
                reject(err)
            } else {
                connection.query(`select * from votos where id_pub=${idPublicacion} `, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        let votosPositivos = 0;
                        let votosNegativos = 0;
                        for (voto of res) {
                            if (voto.est_vot == 2) {
                                votosPositivos++;
                            } else if (voto.est_vot == 1) {
                                votosNegativos++;
                            }
                        }
                        resolve({
                            votosPositivos,
                            votosNegativos
                        });
                    }
                });
            }

            connection.release();
        });
    });
}

const guardarRetroalimentacion = (idPublicacion, retroalimentacionPublicacion) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(`update publicacion set ret_pub='${retroalimentacionPublicacion} <br><br><b> En caso de que el problema continue, puede volver a hacer una publicación o mandar un correo a geleceksoftwaredevelopment@gmail.com</b>', id_sta=2 where id_pub=${idPublicacion}`, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        pool.getConnection((err, connection) => {
                            if (err) {
                                reject(err)
                            } else {
                                connection.query(`select id_usu,tit_pub from publicacion where id_pub=${idPublicacion}`, (err, res) => {

                                    resolve(res);
                                });
                            }
                            connection.release();
                        })

                    }
                });
            }
            connection.release();
        });
    });
}



module.exports = {
    validarCorreo,
    agregarUsuario,
    validarUsername,
    iniciarSesion,
    actualizarDatosUsuario,
    verificarPassword,
    actualizarPassword,
    obtenerUsuarios,
    eliminarUsuario,
    obtenerUsuarioById,
    getUsuariosOrdenados,
    obtenerDatosSueldo,
    guardarDatosSalario,
    guardarDatosGastos,
    obtenerPrecioCanastaBasica,
    obtenerDatosGastos,
    obtenerHorasParaCBA,
    obtenerHorasParaGastos,
    obtenerPrecios,
    obtenerUltimosPreciosdeProductos,
    obtenerProductos,
    guardarPrecios,
    obtenerTiposDePublicacion,
    guardarPublicacion,
    eliminarPublicacion,
    numeroRegistradoProductos,
    obtenerCostosCB,
    //Nuevos métodos
    obtenerTodasLasPublicaciones,
    obtenerPublicacionesDeUsuario,
    darLikeAPublicacion,
    darDislikeAPublicacion,
    obtenerVotosPublicacion,
    guardarRetroalimentacion

};
