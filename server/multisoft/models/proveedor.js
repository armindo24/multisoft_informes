var conn = require('../db');

var Proveedor = {};

Proveedor.all = function (empresa,tipo,cb) {
    conn.exec("select CodProv,upper(RazonSocial) as RazonSocial from DBA.PROVEED where estado = 'A' and Cod_Empresa = '"+empresa+"' and TipoProv = '"+tipo+"'", function(err, row){
        if (err) throw err;
        cb(row);
    });
};

module.exports = Proveedor;