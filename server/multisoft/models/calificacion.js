var conn = require('../db');

var Calificacion = {};

Calificacion.all = function (cb) {
    var sql = "select * from dba.CALIFICA order by dba.califica.Cod_Calificacion ASC;";
    conn.exec(sql, function (err, result) {
        if (err) throw err;
        cb(result);
    });
};

module.exports = Calificacion;