var conn = require('../db');

var Usuarios = {};

Usuarios.compras = function (params, cb) {
    conn.exec("Select lower ( cod_usuario ) as cod_usuario From dba.usuarios where empresas = '"+params.empresa+"' order by cod_usuario", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

module.exports = Usuarios;