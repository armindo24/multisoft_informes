var conn = require('../db');

var CuentaContable = {};

CuentaContable.all = function (params,cb) {
    conn.exec("select CodPlanCta,(cast(CodPlanCta as varchar)+' - '+Nombre) as Nombre from DBA.PLANCTA where Cod_Empresa = '"+params.empresa+"' and PERIODO = "+params.periodo+"ORDER BY DBA.PLANCTA.CodPlanCta", function(err, row){
        if (err) throw err;
        cb(row);
    });
};

module.exports = CuentaContable;