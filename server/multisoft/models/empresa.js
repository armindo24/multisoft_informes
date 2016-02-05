var conn = require('../db');

var Empresa = {};

Empresa.all = function (cb) {
    conn.exec("select Cod_Empresa,Des_Empresa from dba.EMPRESA", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

Empresa.notin = function (body,cb) {
    conn.exec("select Cod_Empresa,Des_Empresa from dba.EMPRESA where Cod_Empresa not in ("+body.empresas+")", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

Empresa.inin = function (body,cb) {
    conn.exec("select Cod_Empresa,Des_Empresa from dba.EMPRESA where Cod_Empresa in ("+body.empresas+")", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

module.exports = Empresa;