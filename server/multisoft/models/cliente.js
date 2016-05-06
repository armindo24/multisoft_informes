var conn = require('../db_integrado');

var Cliente = {};

Cliente.all = function (query, cb) {
    conn.exec("select Cod_Cliente,Razon_Social from dba.Clientes", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

Cliente.tipos = function (cb) {
    conn.exec("select Cod_Tp_Cliente, Des_Tp_Cliente from dba.TpoClte", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

module.exports = Cliente;