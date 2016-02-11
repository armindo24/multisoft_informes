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
    var cond = "d.cod_empresa = ? and d.cuentabanco = ? and fecha between ? and ?";
    var sql_params = [params.empresa, query.cuenta, query.fechad, query.fechah];
    if (query.sucursal) {
        cond += " and d.cod_sucursal = ?";
        sql_params.push(query.sucursal);
    }
    var sql = util.format("SELECT %s FROM %s JOIN %s on %s WHERE %s ORDER BY fecha", columns, table, join_table, join_cond, cond);
    var tot_sql = util.format("SELECT sum(dd.tot_efectivo) as total, avg(dd.tot_efectivo) FROM %s JOIN %s on %s WHERE %s", table, join_table, join_cond, cond);
    console.log(sql);
    console.log(tot_sql);

    conn.exec(sql, sql_params, function (err, row) {
        if (err) throw err;
        conn.exec(tot_sql, sql_params, function (err, aggr) {
            cb(row, aggr);
        });
    });
};

module.exports = ExtractoCuenta;