var conn = require('../db');

var CuentaContable = {};

CuentaContable.all = function (params,cb) {
    conn.exec("select CodPlanCta,(cast(CodPlanCta as varchar)+' - '+Nombre) as Nombre from DBA.PLANCTA where Cod_Empresa = '"+params.empresa+"' and PERIODO = "+params.periodo+" ORDER BY DBA.PLANCTA.CodPlanCta", function(err, row){
        if (err) throw err;
        cb(row);
    });
};

CuentaContable.aux = function (params,cb) {
    conn.exec("select (cast(DBA.PLANAUXI.CodPlanAux as varchar)+'-'+ cast(DBA.PLANAUXI.CodPlanCta as varchar)) as CodPlanAux,(cast(DBA.PLANAUXI.CodPlanAux as varchar)+'/'+cast(DBA.PLANAUXI.CodPlanCta as varchar)+' - '+Nombre) as Nombre  from DBA.PLANAUXI where Cod_Empresa = '"+params.empresa+"' and PERIODO = "+params.periodo+" ORDER BY DBA.PLANAUXI.CodPlanAux", function(err, row){
        if (err) throw err;
        cb(row);
    });
};

CuentaContable.auxquery = function (query,cb) {
    conn.exec("select top 30 DBA.PLANAUXI.CodPlanAux as id,"+
              "(cast(DBA.PLANAUXI.CodPlanAux as varchar)+'/'+cast(DBA.PLANAUXI.CodPlanCta as varchar)+' - '+Nombre) as nombre  "+
              "from DBA.PLANAUXI where Cod_Empresa = '"+query.empresa+"' and PERIODO = "+query.periodo+" and nombre like '"+query.texto+"%'"+
              "ORDER BY DBA.PLANAUXI.CodPlanAux", function(err, row){
        if (err) throw err;
        cb(row);
    });
};

module.exports = CuentaContable;
