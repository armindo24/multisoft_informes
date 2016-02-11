var conn = require('../db');

var Empresa = {};

Empresa.all = function (cb) {
    conn.exec("select Cod_Empresa,Des_Empresa from dba.EMPRESA", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

Empresa.notin = function (body, cb) {
    conn.exec("select Cod_Empresa,Des_Empresa from dba.EMPRESA where Cod_Empresa not in (" + body.empresas + ")", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

Empresa.inin = function (body, cb) {
    conn.exec("select Cod_Empresa,Des_Empresa from dba.EMPRESA where Cod_Empresa in (" + body.empresas + ")", function (err, row) {
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
    if (query.sucursal) {
        sql += " AND Cod_Sucursal = ?";
        sql_params.push(query.sucursal);
    }

    if (query.cliente) {
        console.log(query);
        sql += " AND Razon_Social LIKE '" + query.cliente + "%'";
    }
    console.log(sql);
    console.log(sql_params);
    conn.exec(sql, sql_params, function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

Empresa.bancos = function (params, query, cb) {
    var sql = "select b.codbanco, b.descrip from cuentabancaria c join bancos b on b.codbanco = c.codbanco where Cod_Empresa = ?"
    var sql_params = [params.empresa];
    conn.exec(sql, sql_params, function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

module.exports = Empresa;