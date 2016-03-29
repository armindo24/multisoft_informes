var conn = require('../db');

var Localidad = {};

Localidad.list = function () {
    var sql =
        "SELECT Cod_Localidad, Des_Localidad " +
        "FROM dba.LOCALIDA " +
        "ORDER BY Cod_Localidad ASC";

    return conn.execAsync(sql);
};

module.exports = Localidad;