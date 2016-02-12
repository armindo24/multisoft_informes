var conn = require('../db');
var util = require('util');

var ExtractoCuenta = {};

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

ExtractoCuenta.saldoAnterior = function (params, query, cb) {
    console.log(params);
    console.log(query);
    //TODO: check sucursal filter
    var depositos = "SELECT sum(dd.tot_efectivo) FROM dba.depcuenta d JOIN dba.depcuentadet dd on (dd.nrodeposito = d.nrodeposito and dd.Codbanco = d.Codbanco and dd.cod_empresa = d.cod_empresa) " +
        "WHERE d.cod_empresa = ? and d.codbanco = ? and d.cuentabanco = ? " +
        "and fecha between ? and ? and d.estado = 'A'";
    var extracciones = "SELECT sum(e.importe) FROM dba.extcuenta e " +
        "WHERE e.cod_empresa = ? and e.cuentabanco = ? and e.codbanco = ? " +
        "and fecha between ? and ? and e.anulado = 'N' and e.estado = 'A'";

    var sql = util.format("%s UNION %s", depositos, extracciones);
    var sql_params = [params.empresa, query.banco, query.cuenta, '1901-01-01', query.fechad];
    sql_params = sql_params.concat(sql_params);
    console.log(sql);
    console.log(sql_params);
    var sql = "select sum(dd.tot_efectivo) from dba.depcuenta d join dba.depcuentadet dd on d.nrodeposito = dd.nrodeposito and d.Cod_Empresa = dd.Cod_Empresa and d.Codbanco = dd.Codbanco and d.cuentabanco = dd.cuentabanco " +
        "where d.codbanco = ? and d.Cod_Empresa = ? and d.cuentabanco = ? and d.fecha between '1901-01-01' and ? and d.estado = 'A' " +
        "UNION " +
        "select sum(e.importe) from dba.extcuenta e " +
        "where e.codbanco = ? and e.Cod_Empresa = ? and e.cuentabanco = ? and e.fecha between '1901-01-01' and ? and e.anulado = 'N' and e.estado = 'A'";

    var sql_params = [query.banco, params.empresa, query.cuenta, query.fechad];
    conn.exec(sql, sql_params.concat(sql_params), function (err, row) {
        if (err) throw err;
        cb(row);
    })
};

module.exports = ExtractoCuenta;