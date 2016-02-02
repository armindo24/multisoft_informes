var conn = require('../db');

var Comprobante = {};

Comprobante.empresa = function (empresa,cb) {
    conn.exec("select Cod_Tp_Comp,upper(des_tp_comp) as des_tp_comp from DBA.TPOCBTE where activo = 'S' and Cod_Empresa = '" + empresa + "'", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

module.exports = Comprobante;