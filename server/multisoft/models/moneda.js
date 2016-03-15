var conn = require('../db');

var Moneda = {};

Moneda.list = function (cb) {
    var sql = "select m.simbolo, m.factcambio, m.descrip, m.cantdecimal from dba.moneda m";
    conn.exec(sql, function (err, result) {
        if (err) throw err;
        cb(result);
    });
};

module.exports = Moneda;