var conn = require('../db_integrado');

var CentroCostos = {};

CentroCostos.all = function (params, cb) {
    var string = "SELECT DBA.ACUMAUXI.CodPlanAux,UPPER (DBA.PLANCTA.CodPlanCta) AS CodPlanCta,DBA.PLANCTA.Nombre,"+
                 "DBA.PLANCTA.TipoSaldo,"+
                 "CAST(sum(DBA.ACUMAUXI.TotalDbME) as decimal(20,2)) as sum_TotalDbME,"+
                 "CAST(sum(DBA.ACUMAUXI.TotalCrME) as decimal(20,2)) as sum_TotalCrME,"+
                 "CAST(sum(DBA.ACUMAUXI.TotalDb) as decimal(20,0)) as sum_TotalDb,"+
                 "CAST(sum(DBA.ACUMAUXI.TotalCr) as decimal(20,0)) as sum_TotalCr,"+
                 "UPPER (DBA.ACUMAUXI.CodPlanCta) AS CodPlanCta_0,DBA.PLANAUXI.Nombre As PlanAuxi_Nombre "+
                 "FROM DBA.ACUMAUXI,DBA.PLANCTA,DBA.PLANAUXI WHERE "+ 
                 "DBA.ACUMAUXI.Cod_Empresa = DBA.PLANCTA.Cod_Empresa "+
                 "AND DBA.ACUMAUXI.Periodo = DBA.PLANCTA.Periodo "+ 
                 "AND DBA.ACUMAUXI.CodPlanCta = DBA.PLANCTA.CodPlanCta "+
                 "AND DBA.ACUMAUXI.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa "+    
                 "AND DBA.ACUMAUXI.Periodo = DBA.PLANAUXI.Periodo "+
                 "AND DBA.ACUMAUXI.CodPlanCta = DBA.PLANAUXI.CodPlanCta "+
                 "AND DBA.ACUMAUXI.CodPlanAux = DBA.PLANAUXI.CodPlanAux "+
                 "AND DBA.ACUMAUXI.Cod_Empresa = '"+params.empresa+"' "+
                 "AND DBA.ACUMAUXI.Periodo = '"+params.periodo+"' "+
                 "AND DBA.ACUMAUXI.AnhoMes >= '"+params.periodo+params.mesd+"' "+
                 "AND DBA.ACUMAUXI.AnhoMes <= '"+params.periodo+params.mesh+"' "+
                 "AND DBA.PLANAUXI.Imputable = 'S' " 
                 if (params.nivel > 0)
                    string+="AND DBA.PLANAUXI.Nivel = "+params.nivel+" "
                 string+="AND DBA.PLANAUXI.CodPlanCta >= '"+params.cuentad+"' AND DBA.PLANAUXI.CodPlanCta <= '"+params.cuentah+"' " 
                 if (params.cuentaad != 'NINGUNA' && params.cuentaah != 'NINGUNA')
                    string+="AND DBA.PLANAUXI.CodPlanAux >= '"+params.cuentaad+"' AND DBA.PLANAUXI.CodPlanAux <= '"+params.cuentaah+"' "
                 string+="GROUP BY DBA.ACUMAUXI.CodPlanAux,CodPlanCta,DBA.PLANCTA.Nombre,DBA.PLANCTA.TipoSaldo,CodPlanCta_0,PlanAuxi_Nombre "+
                 "order by CodPlanCta,DBA.ACUMAUXI.CodPlanAux ";
    console.log(string)
    conn.exec(string, function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

module.exports = CentroCostos;