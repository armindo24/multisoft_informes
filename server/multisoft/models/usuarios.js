var conn = require('../db');

var Usuarios = {};

Usuarios.compras = function (params, cb) {
    conn.exec("Select lower ( cod_usuario ) as cod_usuario From dba.usuarios where empresas = '" + params.empresa + "' order by cod_usuario", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

Usuarios.cajeros = function (params, query, cb) {
    var sql =
        "select cod_usuario as id, (Nombres + ' ' + Apellidos) as nombre\n" +
        "from dba.usuarios\n" +
        "where Tp_Def in ('C', 'A');";
    return conn.execAsync(sql);
};

module.exports = Usuarios;