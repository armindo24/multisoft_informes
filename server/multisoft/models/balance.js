var conn = require('../db');

var Balance = {};

Balance.general = function (params,cb) {
    var string="";
    if (params.aux == 'NO'){
        string = "SELECT DBA.PLANCTA.Cod_Empresa,DBA.PLANCTA.CodPlanCta,DBA.PLANCTA.Nombre,DBA.PLANCTA.Nivel,DBA.PLANCTA.Imputable,DBA.PLANCTA.TipoSaldo,DBA.Control.CTCtaOrden,"
        if (params.moneda == 'local'){
            string+="cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) as 'TOTAL_DEBITO',cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) as 'TOTAL_CREDITO',"+
                    "(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) "+
                    "ELSE cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) "+
                    "END) as 'SALDO' "
        } else {
            string+="cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) as 'TOTAL_DEBITO',cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) as 'TOTAL_CREDITO',"+
                    "(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) - cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) "+
                    "ELSE cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) - cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) "+
                    "END) as 'SALDO' "
        }
        string+="FROM DBA.CONTROL,DBA.PLANCTA,DBA.ACUMPLAN WHERE "+
                    "(DBA.Control.Cod_Empresa = DBA.PLANCTA.Cod_Empresa) AND (DBA.Control.Periodo = DBA.PLANCTA.Periodo) AND "+
                    "(DBA.PLANCTA.Cod_Empresa = DBA.AcumPlan.Cod_Empresa) AND (DBA.PLANCTA.Periodo = DBA.AcumPlan.Periodo) AND "+
                    "(DBA.PLANCTA.CodPlanCta = DBA.AcumPlan.CodPlanCta) AND (DBA.PLANCTA.Cod_Empresa = '"+params.empresa+"') "+
                    "AND (DBA.PLANCTA.Periodo = "+params.periodo+") AND (DBA.PLANCTA.CodPlanCta >= '"+params.cuentad+"') "+
                    "AND (DBA.PLANCTA.CodPlanCta <= '"+params.cuentah+"') "
        if (params.nivel > 0)
            string+="AND (DBA.PLANCTA.Nivel <= "+params.nivel+") "
        string+="AND (DBA.AcumPlan.AnhoMes >= "+parseInt(params.periodo.toString()+params.mesd.toString())+") AND (DBA.AcumPlan.AnhoMes <= "+parseInt(params.periodo.toString()+params.mesh.toString())+") "
        string+="GROUP BY DBA.PLANCTA.Cod_Empresa,DBA.PLANCTA.CodPlanCta,DBA.PLANCTA.Nombre,DBA.PLANCTA.Nivel,DBA.PLANCTA.Imputable,DBA.PLANCTA.TipoSaldo,DBA.CONTROL.CtCtaOrden "
        if (params.saldo == 'SI'){
            //string+="having SALDO >= 0 "
        } else {
            string+="having SALDO <> 0 "
        }
        string+="ORDER BY DBA.PLANCTA.CodPlanCta"
    } else {
        string = "SELECT DBA.PLANCTA.Cod_Empresa,DBA.PLANCTA.CodPlanCta,DBA.PLANCTA.Nombre,DBA.PLANCTA.Nivel,DBA.PLANCTA.Imputable,DBA.PLANCTA.TipoSaldo,DBA.Control.CTCtaOrden,"
        if (params.moneda == 'local'){
            string+="cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) as 'TOTAL_DEBITO',cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) as 'TOTAL_CREDITO',"+
                    "(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) "+
                    "ELSE cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) "+
                    "END) as 'SALDO' "
        } else {
            string+="cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) as 'TOTAL_DEBITO',cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) as 'TOTAL_CREDITO',"+
                    "(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) - cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) "+
                    "ELSE cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) - cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) "+
                    "END) as 'SALDO' "
        }
        string+="FROM DBA.CONTROL,DBA.PLANCTA,DBA.ACUMPLAN WHERE "+
                "(DBA.Control.Cod_Empresa = DBA.PLANCTA.Cod_Empresa) AND (DBA.Control.Periodo = DBA.PLANCTA.Periodo) AND "+
                "(DBA.PLANCTA.Cod_Empresa = DBA.AcumPlan.Cod_Empresa) AND (DBA.PLANCTA.Periodo = DBA.AcumPlan.Periodo) AND "+
                "(DBA.PLANCTA.CodPlanCta = DBA.AcumPlan.CodPlanCta) AND (DBA.PLANCTA.Cod_Empresa = '"+params.empresa+"') "+
                "AND (DBA.PLANCTA.Periodo = "+params.periodo+") AND (DBA.PLANCTA.CodPlanCta >= '"+params.cuentad+"') "+
                "AND (DBA.PLANCTA.CodPlanCta <= '"+params.cuentah+"') "
        if (params.nivel > 0)
                string+="AND (DBA.PLANCTA.Nivel <= "+params.nivel+") "
        string+="AND (DBA.AcumPlan.AnhoMes >= "+parseInt(params.periodo.toString()+params.mesd.toString())+") AND (DBA.AcumPlan.AnhoMes <= "+parseInt(params.periodo.toString()+params.mesh.toString())+") "
        string+="GROUP BY DBA.PLANCTA.Cod_Empresa,DBA.PLANCTA.CodPlanCta,DBA.PLANCTA.Nombre,DBA.PLANCTA.Nivel,DBA.PLANCTA.Imputable,DBA.PLANCTA.TipoSaldo,DBA.CONTROL.CtCtaOrden "
        if (params.saldo == 'SI'){
            //string+="having SALDO >= 0 "
        } else {
            string+="having SALDO <> 0 "
        }
       string+="UNION SELECT DBA.PLANAUXI.Cod_Empresa,DBA.PLANCTA.CodPlanCta + '-' + DBA.PLANAUXI.CodPlanAux as CTA,DBA.PLANAUXI.Nombre,DBA.PLANAUXI.Nivel,DBA.PLANAUXI.Imputable,DBA.PLANCTA.TipoSaldo,DBA.Control.CTCtaOrden,"
        if (params.moneda == 'local'){
            string+="cast(sum(DBA.AcumAuxi.TotalDb)as decimal(20,0)) as 'TOTAL_DEBITO',cast(sum(DBA.AcumAuxi.TotalCr)as decimal(20,0)) as 'TOTAL_CREDITO',"+
                    "(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(sum(DBA.AcumAuxi.TotalDb)as decimal(20,0)) - cast(sum(DBA.AcumAuxi.TotalCr)as decimal(20,0)) "+
                    "ELSE cast(sum(DBA.AcumAuxi.TotalCr)as decimal(20,0)) - cast(sum(DBA.AcumAuxi.TotalDb)as decimal(20,0)) "+
                    "END) as 'SALDO' "
        } else {
            string+="cast(sum(DBA.AcumAuxi.TotalDbME)as decimal(20,2)) as 'TOTAL_DEBITO',cast(sum(DBA.AcumAuxi.TotalCrME)as decimal(20,2)) as 'TOTAL_CREDITO',"+
                    "(CASE DBA.PLANCTA.TipoSaldo "+
                    "WHEN 'D' then cast(sum(DBA.AcumAuxi.TotalDbME)as decimal(20,2)) - cast(sum(DBA.AcumAuxi.TotalCrME)as decimal(20,2)) "+
                    "ELSE cast(sum(DBA.AcumAuxi.TotalCrME)as decimal(20,2)) - cast(sum(DBA.AcumAuxi.TotalDbME)as decimal(20,2)) "+
                    "END) as 'SALDO' "
        }
        string+="FROM DBA.CONTROL,DBA.PLANAUXI,DBA.PLANCTA,DBA.AcumAuxi WHERE "+
            "(DBA.Control.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa) AND (DBA.Control.Periodo = DBA.PLANAUXI.Periodo) AND "+
            "(DBA.PLANAUXI.CodPlanCta = DBA.PLANCTA.CodPlanCta) AND (DBA.PLANAUXI.Cod_Empresa = DBA.AcumAuxi.Cod_Empresa) AND "+
            "(DBA.PLANAUXI.Periodo = DBA.AcumAuxi.Periodo) AND (DBA.PLANAUXI.CodPlanAux = DBA.AcumAuxi.CodPlanAux) AND "+
            "(DBA.PLANAUXI.CodPlanCta  = DBA.AcumAuxi.CodPlanCta) AND (DBA.plancta.imputable = 'N') "+
            "AND (DBA.plancta.Auxiliar = 'S') AND (DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"') "+
            "AND (DBA.PLANAUXI.Periodo = "+params.periodo+") AND (DBA.PLANCTA.CodPlanCta >= '"+params.cuentad+"') "+
            "AND (DBA.PLANCTA.CodPlanCta <= '"+params.cuentah+"') "
        if (params.nivel > 0)
            string+="AND (DBA.PLANCTA.Nivel <= "+params.nivel+") "
        string+="AND (DBA.AcumAuxi.AnhoMes >= "+parseInt(params.periodo.toString()+params.mesd.toString())+") AND (DBA.AcumAuxi.AnhoMes <= "+parseInt(params.periodo.toString()+params.mesh.toString())+") "
        string+="GROUP BY DBA.PLANAUXI.Cod_Empresa,CTA,DBA.PLANAUXI.Nombre,DBA.PLANAUXI.Nivel,DBA.PLANAUXI.Imputable,DBA.PLANCTA.TipoSaldo,DBA.Control.CTCtaOrden "
        if (params.saldo == 'SI'){
            //string+="having SALDO >= 0 "
        } else {
            string+="having SALDO <> 0 "
        }
        string+="ORDER BY 1, 2"
    }
    conn.exec(string, function(err, row){
        if (err) throw err;
        cb(row);
    });
};

Balance.comprobado = function (params,cb) {
    var string = "SELECT DBA.PLANCTA.Cod_Empresa,DBA.PLANCTA.CodPlanCta,DBA.PLANCTA.Nombre,DBA.PLANCTA.Nivel,DBA.PLANCTA.Imputable,"+
    "ifnull((SELECT "
    if (params.moneda == 'local'){
        string+="(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(SUM (A2.TotalDB) -  SUM(A2.TotalCR) as decimal(20,0)) "+
                "ELSE cast(SUM (A2.TotalCR) -  SUM(A2.TotalDB) as decimal(20,0)) END)"
    } else {
        string+="(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(SUM (A2.TotalDBME) -  SUM(A2.TotalCRME) as decimal(20,2)) "+
                "ELSE cast(SUM (A2.TotalCRME) -  SUM(A2.TotalDBME) as decimal(20,2)) END)"
    }
    string+="FROM DBA.ACUMPLAN A2 WHERE "+
            "A2.Cod_Empresa = DBA.PLANCTA.Cod_Empresa AND A2.CodPlanCta  = DBA.PLANCTA.CodPlanCta "+
            "AND A2.Periodo = DBA.PLANCTA.Periodo AND A2.Anho = "+parseInt(params.periodoant)+" "+
            "AND A2.Mes < "+parseInt(params.mesant)+" "
    if (params.nivel > 0)
        string+="AND (DBA.PLANCTA.Nivel <= "+params.nivel+") "
    string+="),0,(SELECT "
    if (params.moneda == 'local'){
        string+="(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(SUM (A2.TotalDB) -  SUM(A2.TotalCR) as decimal(20,0)) "+
                    "ELSE cast(SUM (A2.TotalCR) -  SUM(A2.TotalDB) as decimal(20,0)) END)"
    } else {
        string+="(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(SUM (A2.TotalDBME) -  SUM(A2.TotalCRME) as decimal(20,2)) "+
                    "ELSE cast(SUM (A2.TotalCRME) -  SUM(A2.TotalDBME) as decimal(20,2)) END)"
    }
    string+="FROM DBA.ACUMPLAN A2 WHERE "+
        "A2.Cod_Empresa = DBA.PLANCTA.Cod_Empresa AND A2.CodPlanCta  = DBA.PLANCTA.CodPlanCta "+
        "AND A2.Periodo = DBA.PLANCTA.Periodo AND A2.Anho = "+parseInt(params.periodoant)+" "+
        "AND A2.Mes < "+parseInt(params.mesant)+" "
    if (params.nivel > 0)
        string+="AND (DBA.PLANCTA.Nivel <= "+params.nivel+") "
    string+=")) as SALDO_ANTERIOR,"
    if (params.moneda == 'local'){
        string+="ifnull(cast(DBA.ACUMPLAN.TotalDb as decimal(20,0)),0,cast(DBA.ACUMPLAN.TotalDb as decimal(20,0))) as TOTAL_DEBITO,"+
                "ifnull(cast(DBA.ACUMPLAN.TotalCr as decimal(20,0)),0,cast(DBA.ACUMPLAN.TotalCr as decimal(20,0))) as TOTAL_CREDITO,"
    } else {
        string+="ifnull(cast(DBA.ACUMPLAN.TotalDbME as decimal(20,2)),0,cast(DBA.ACUMPLAN.TotalDbME as decimal(20,2))) as TOTAL_DEBITO,"+
                "ifnull(cast(DBA.ACUMPLAN.TotalCrME as decimal(20,0)),0,cast(DBA.ACUMPLAN.TotalCrME as decimal(20,2))) as TOTAL_CREDITO,"
    }
    string+="DBA.PLANCTA.TipoSaldo,(CASE DBA.PLANCTA.TipoSaldo "+
        "WHEN 'D' THEN (SALDO_ANTERIOR + TOTAL_DEBITO)-TOTAL_CREDITO ELSE (SALDO_ANTERIOR + TOTAL_CREDITO)-TOTAL_DEBITO END) AS SALDO "+
        "FROM DBA.PLANCTA,DBA.ACUMPLAN WHERE DBA.PLANCTA.Cod_Empresa = DBA.ACUMPLAN.Cod_Empresa AND DBA.ACUMPLAN.Periodo = DBA.PLANCTA.Periodo "+
        "AND DBA.PLANCTA.CodPlanCta = DBA.ACUMPLAN.CodPlanCta AND DBA.ACUMPLAN.Anho = "+parseInt(params.periodo)+" "+
        "AND DBA.ACUMPLAN.Mes =  "+parseInt(params.mes)+" "
    if (params.nivel > 0)
        string+="AND (DBA.PLANCTA.Nivel <= "+params.nivel+") "
    string+="AND DBA.PLANCTA.cod_empresa = '"+params.empresa+"' ORDER BY DBA.PLANCTA.CodPlanCta"

    conn.exec(string, function(err, row){
        if (err) throw err;
        cb(row);
    });
};

module.exports = Balance;
