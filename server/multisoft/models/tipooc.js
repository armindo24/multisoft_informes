var conn = require('../db');

var Tipooc = {};

Tipooc.all = function (params,cb) {
    conn.exec("select * from dba.TipoOrden where Cod_Empresa = '"+params.empresa+"'", function(err, row){
        if (err) throw err;
        cb(row);
    });
};

module.exports = Tipooc;