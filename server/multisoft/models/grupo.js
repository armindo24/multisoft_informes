var conn = require('../db_integrado');

var Grupo = {};

Grupo.all = function (cb) {
    conn.exec("select cod_grupo, des_grupo from dba.Grupo", function (err, row) {
        if (err) throw  err;
        cb(row);
    });
};


module.exports = Grupo;