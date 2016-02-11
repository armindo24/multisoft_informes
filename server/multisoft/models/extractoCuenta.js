var conn = require('../db');
var util = require('util');

var ExtractoCuenta = {};
//select date(d.fecha) as fecha, d.cuentabanco, d.nrodeposito, dd.tot_efectivo, d.observ
//from dba.depcuenta d
//join dba.depcuentadet dd on (dd.nrodeposito = d.nrodeposito and dd.Codbanco = d.Codbanco)
//where d.cuentabanco = '23-1992502' and fecha BETWEEN '2013-02-11' and '2016-02-11'
//order by fecha;

ExtractoCuenta.depositos = function (params, query, cb) {
    console.log(params);
    console.log(query);
    var columns = "date(d.fecha) as fecha, d.cuentabanco, d.nrodeposito, dd.tot_efectivo, d.observ";
    var table = "dba.depcuenta d";
    var join_table = "dba.depcuentadet dd";
    var join_cond = "(dd.nrodeposito = d.nrodeposito and dd.Codbanco = d.Codbanco)";
    var cond = "d.cuentabanco = ? and fecha between ? and ?";
    var sql_params = [params.cuenta, query.fechad, query.fechah];
    var sql = util.format("SELECT %s FROM %s JOIN %s on %s WHERE %s ORDER BY fecha", columns, table, join_table, join_cond, cond);
    console.log(sql);
    conn.exec(sql, sql_params, function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

module.exports = ExtractoCuenta;