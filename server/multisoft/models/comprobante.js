var conn = require('../db');

var Comprobante = {};

Comprobante.empresa = function (params, cb) {
    conn.exec("select Cod_Tp_Comp,upper(des_tp_comp) as des_tp_comp from DBA.TPOCBTE where activo = 'S' and Cod_Empresa = ?", [params.empresa], function (err, row) {
        if (err) throw err;
        cb(row);
    });
};


Comprobante.compras = function (params, cb) {
    conn.exec("SELECT dba.tpocbte.cod_tp_comp,dba.TPOCBTE.des_tp_comp FROM dba.tpocbte WHERE ( DBA.tpocbte.tp_def IN ( 'CC' , 'CD' , 'NP' ) ) AND ( dba.tpocbte.cod_empresa = '"+params.empresa+"' ) ORDER BY dba.tpocbte.cod_tp_comp", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

module.exports = Comprobante;