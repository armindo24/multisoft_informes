var conn = require('../db.js');

var Empresa = {};
Empresa.all = function () {
    conn.exec("select Cod_Empresa,Des_Empresa from dba.EMPRESA", function (err, row) {
        if (err) throw err;
        return row;
    });
};

Empresa.test = function () {
    return 'Empresa test';
};

Empresa.comprobante = function (empresa) {
    return "select comprobante: " + empresa;
    conn.exec("select Cod_Tp_Comp,upper(des_tp_comp) as des_tp_comp from DBA.TPOCBTE where activo = 'S' and Cod_Empresa = '" + empresa + "'", function (err, row) {
        if (err) throw err;
        return row;
    });
};

module.exports = Empresa;