var conn = require('../db');

var Proveedor = {};

Proveedor.all = function (params,cb) {
    conn.exec("select CodProv,upper(RazonSocial) as RazonSocial from DBA.PROVEED where estado = 'A' and Cod_Empresa = '"+params.empresa+"' and TipoProv = '"+params.tipo+"'", function(err, row){
        if (err) throw err;
        cb(row);
    });
};

module.exports = Proveedor;