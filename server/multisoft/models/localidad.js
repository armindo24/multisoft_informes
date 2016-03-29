var conn = require('../db');

var Localidad = {};

Localidad.list = function () {
    var sql =
        "SELECT cod_localidad, des_localidad " +
        "FROM dba.LOCALIDA " +
        "ORDER BY cod_localidad ASC";

    return conn.execAsync(sql);
};

module.exports = Localidad;