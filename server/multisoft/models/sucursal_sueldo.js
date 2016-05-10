var conn = require('../db_sueldo');

var Sucursal_sueldo = {};

Sucursal_sueldo.all = function (params,cb) {
    conn.exec("select Cod_Sucursal,Des_Sucursal from DBA.SUCURSAL where Cod_Empresa = '"+params.empresa+"'", function(err, row){
        if (err) throw err;
        cb(row);
    });
};

module.exports = Sucursal_sueldo;