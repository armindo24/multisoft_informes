var conn = require('../db_integrado');

var Cobrador = {};

Cobrador.list = function (cb) {
    var sql = "SELECT cod_cobrador, tpo_cobrador, des_cobrador " +
        "FROM dba.cobrador " +
            //"WHERE cod_sucursal = '01'" +
        "ORDER BY cod_cobrador ASC";

    conn.exec(sql, function (err, result) {
        if (err) throw err;
        cb(result);
    });
};

module.exports = Cobrador;