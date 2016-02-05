var conn = require('../db');

var Empresa = {};

Empresa.all = function (cb) {
    conn.exec("select Cod_Empresa,Des_Empresa from dba.EMPRESA", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

Empresa.notin = function (params,cb) {
    var vector = params.empresas.toString().split("-")
    var new_vector = []
    for (var a=0;a<vector.length;a++){
        new_vector.push("'"+vector[a]+"'")
    }
    var empresas = new_vector.join(',')
    console.log(empresas)
    conn.exec("select Cod_Empresa,Des_Empresa from dba.EMPRESA where Cod_Empresa not in ("+empresas+")", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

Empresa.in = function (params,cb) {
    var vector = params.empresas.toString().split("-")
    var empresas = vector.join(',')
    conn.exec("select Cod_Empresa,Des_Empresa from dba.EMPRESA where Cod_Empresa in ("+empresas+")", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

Empresa.clientes = function (empresa, query, cb) {
    var sql = "select Cod_Cliente, Razon_Social, Cod_Tp_Cliente from dba.Clientes WHERE Cod_Empresa = ?";
    var sql_params = [empresa];
    if (query.tipo) {
        sql += " AND Cod_Tp_Cliente = ?";
        sql_params.push(query.tipo);
    }
    conn.exec(sql, sql_params, function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

module.exports = Empresa;