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

CuentaContable.auxquery = function (params,query,cb) {
    if (query.nombre == null)
        query.nombre = ""
    if (query.codigo == null)
        query.codigo = ""
    console.log("select * from dba.PLANAUXI "+
                "where periodo = '"+params.periodo+"' "+
                "and Cod_Empresa = '"+params.empresa+"' "+
                "and Imputable = 'S' "+
                "and dba.PLANAUXI.CodPlanCta >= '"+params.cuentad+"' "+
                "and dba.PLANAUXI.CodPlanCta <= '"+params.cuentah+"' "+
                "and dba.PLANAUXI.Nombre like '%"+query.nombre+"%' "+
                "and dba.PLANAUXI.CodPlanAux like '%"+query.codigo+"%'")
    conn.exec("select * from dba.PLANAUXI "+
                "where periodo = '"+params.periodo+"' "+
                "and Cod_Empresa = '"+params.empresa+"' "+
                "and Imputable = 'S' "+
                "and dba.PLANAUXI.CodPlanCta >= '"+params.cuentad+"' "+
                "and dba.PLANAUXI.CodPlanCta <= '"+params.cuentah+"' "+
                "and dba.PLANAUXI.Nombre like '%"+query.nombre+"%' "+
                "and dba.PLANAUXI.CodPlanAux like '%"+query.codigo+"%'", function(err, row){
        if (err) throw err;
        cb(row);
    });
};

module.exports = CuentaContable;
