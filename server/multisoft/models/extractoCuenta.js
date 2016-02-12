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
    var join_cond = "(dd.nrodeposito = d.nrodeposito and dd.Codbanco = d.Codbanco and dd.cod_empresa = d.cod_empresa)";
    var cond = "d.cod_empresa = ? and d.codbanco = ? and d.cuentabanco = ? and fecha between ? and ? and d.estado = 'A'";
    var sql_params = [params.empresa, query.banco, query.cuenta, query.fechad, query.fechah];
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
            if (err) throw err;
            cb(row, aggr);
        });
    });
};

ExtractoCuenta.extracciones = function (params, query, cb) {
    console.log(params);
    console.log(query);
    var columns = "date(e.fecha) as fecha, e.codbanco, e.extraccionnro, e.beneficiario, e.importe, e.observ";
    var table = "dba.extcuenta e";
    var cond = "e.cod_empresa = ? and e.cuentabanco = ? and e.codbanco = ? and fecha between ? and ? and e.anulado = 'N' and e.estado = 'A'";
    var order = "fecha";
    var sql = util.format("SELECT %s FROM %s WHERE %s ORDER BY %s", columns, table, cond, order);
    var tot_sql = util.format("SELECT sum(e.importe) as total FROM %s WHERE %s", table, cond);
    var sql_params = [params.empresa, query.cuenta, query.banco, query.fechad, query.fechah];
    console.log(sql);
    console.log(sql_params);
    console.log(tot_sql);
    conn.exec(sql, sql_params, function (err, row) {
        if (err) throw err;
        conn.exec(tot_sql, sql_params, function (err, aggr) {
            if (err) throw err;
            cb(row, aggr);
        });
    });
};

module.exports = ExtractoCuenta;