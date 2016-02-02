var conn = require('../db');

var Sucursal = {};

Sucursal.all = function (empresa,cb) {
    conn.exec("select Cod_Sucursal,Des_Sucursal from DBA.SUCURSAL where Cod_Empresa = '"+empresa+"'", function(err, row){
        if (err) throw err;
        cb(row);
    });
};

module.exports = Sucursal;