var conn = require('../db_integrado');

var Departamento = {};

Departamento.all = function (params,cb) {
    conn.exec("select CodDpto,Descrip from dba.DPTO where Cod_Empresa = '"+params.empresa+"' and Cod_Sucursal = '"+params.sucursal+"'", function(err, row){
        if (err) throw err;
        cb(row);
    });
};

module.exports = Departamento;