var conn = require('../db');

var Recaudacion = {};

Recaudacion.planillas = function (params, query) {
    var sql =
        "select NroPlanilla from dba.RECAUDCAB\n" +
        "where Cod_Empresa = ?";
    var sql_params = [params.empresa];
    console.log(sql_params);
    return conn.execAsync(sql, sql_params);
};

module.exports = Recaudacion;