var conn = require('../db_sueldo');

var Tp_Movimiento = {};

Tp_Movimiento.all = function (params, cb) {
    conn.exec("SELECT codmvto , descrip FROM dba.MvtoLegajo WHERE "+
                "cod_empresa ='" + params.empresa + "' ORDER BY codmvto ASC", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

module.exports = Tp_Movimiento;