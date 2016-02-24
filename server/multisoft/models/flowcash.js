var conn = require('../db');
var util = require('util');

var Flow = {};

Flow.all = function (params,cb) {

    var mesDiaDesde = new Date(params.periodo,parseInt(params.mes)-1,'01');
    var mesDiaHasta = new Date(mesDiaDesde.getFullYear(), mesDiaDesde.getMonth()+1, 0);
    var mes_aux = parseInt(mesDiaHasta.getMonth()+1);
    if ((mes_aux).toString().length == 1)
        mes_aux = '0'+mes_aux
    var str_mesDiaDesde = params.periodo + '-' + params.mes + '-01';
    var str_mesDiaHasta = mesDiaHasta.getFullYear() + '-' + mes_aux + '-' + mesDiaHasta.getDate()
    var mesanterior_aux = null
    if ((mesDiaHasta.getMonth()).toString() == '0'){
        mesanterior_aux = '12'
    } else {
        mesanterior_aux = mesDiaHasta.getMonth()
        if ((mesanterior_aux).toString().length == 1)
            mesanterior_aux = '0'+mesanterior_aux          
    }
    var annio_aux = params.periodo
    if (mes_aux == '01')
        annio_aux = parseInt(params.periodo)-1
    var str_mesDiaAnterior = annio_aux + '-' + mesanterior_aux + '-01';

    var string = "";
    
    if (parseInt(params.mes) > 1){ 
        var string =    "select "+
                            "pa.cod_empresa,"+
                            "pa.codmoneda,"+
                            "c.monedalocal,"+
                            "cast(sum (a.totaldb - a.totalcr ) as decimal(20,0)) as Saldo,"+
                            "cast(sum (a.totaldbme - a.totalcrme) as decimal(20,2)) as SaldoME "+
                        "from "+
                            "dba.planauxi pa,"+
                            "dba.acumauxi a,"+
                            "dba.control c "+
                        "where "+
                            "pa.Cod_Empresa = '"+params.empresa+"' "+
                            "and pa.Periodo = '"+params.periodo+"' "+
                            "and pa.cod_empresa = c.cod_empresa "+
                            "and pa.periodo = c.periodo "+
                            "and pa.tpcta = 'CB' "+
                            "and pa.cod_empresa = a.cod_empresa "+
                            "and pa.periodo = a.periodo "+
                            "and pa.codplancta = a.codplancta "+
                            "and pa.codplanaux = a.codplanaux "+    
                            "and a.anho = "+ params.periodo +
                            "and a.mes >= 1 "+
                            "and a.mes < " + params.mes +
                        "group by "+
                            "pa.cod_empresa,"+      
                            "pa.codmoneda,"+
                            "c.monedalocal";
    
    } else {
        var string =    "select "+ 
                            "pa.cod_empresa,"+
                            "pa.codmoneda,"+
                            "c.monedalocal,"+
                            "cast(sum (a.importe) as decimal(20,0)) as Saldo,"+
                            "cast(sum (a.importeme)  as decimal(20,2)) as SaldoME "+
                        "from "+
                            "dba.planauxi pa,"+
                            "dba.asientosdet a,"+
                            "dba.asientoscab ac,"+
                            "dba.control c,"+
                            "dba.tipoasiento t "+
                        "where "+
                            "pa.Cod_Empresa = '"+params.empresa+"' "+
                            "and pa.Periodo = '"+params.periodo+"' "+
                            "and pa.cod_empresa = c.cod_empresa "+
                            "and pa.periodo = c.periodo and pa.tpcta = 'CB' "+
                            "and pa.cod_empresa = a.cod_empresa "+
                            "and pa.periodo = a.periodo "+
                            "and pa.codplancta = a.codplancta "+
                            "and pa.codplanaux = a.codplanaux "+
                            "and ac.tipoasiento = t.tipoasiento "+
                            "and t.tipoasiento = c.tipoasientoaper "+
                            "and ac.cod_empresa = a.cod_empresa "+
                            "and ac.nrotransac = a.nrotransac "+
                            "and year (ac.fecha) = "+ params.periodo +
                            "and month (ac.fecha) = 1 "+
                        "group by "+
                            "pa.cod_empresa,"+
                            "pa.codmoneda,"+
                            "c.monedalocal";
    }
                
    conn.exec(string, function(err, row){
        if (err) throw err;
        data1 = row;
        
        var string1 = "";
        
        string1 =   "SELECT "+
                        "DBA.AsientosCab.Cod_empresa,"+
                        "DBA.AsientosDet.CodPlanCta,"+
                        "DBA.PlanCta.Nombre,"+
                        "'I' AS Tipo,"+
                        "cast(SUM (DBA.AsientosDet.Importe) as decimal(20,0)) AS Total,"+
                        "cast(SUM (DBA.AsientosDet.ImporteME) as decimal(20,2)) AS TotalME "+
                    "FROM "+
                        "DBA.AsientosCab,"+
                        "DBA.AsientosDet,"+
                        "DBA.TipoAsiento,"+
                        "DBA.PlanCta "+
                    "WHERE "+
                        "(DBA.AsientosCab.Cod_Empresa = '"+params.empresa+"') "+ 
                        "AND (DBA.AsientosCab.Periodo = '"+params.periodo+"' ) "+
                        "AND ((DATE(DBA.AsientosCab.Fecha) >= '"+str_mesDiaDesde+"') "+
                            "AND (DATE(DBA.AsientosCab.Fecha) <= '"+str_mesDiaHasta+"') "+
                            "AND (DBA.AsientosCab.Transf = 'N') OR (DBA.AsientosCab.Transf = 'D') "+
                            "AND (DATE(DBA.AsientosCab.Fecha) >= '"+str_mesDiaAnterior+"') "+
                            "AND (DATE(DBA.AsientosCab.Fecha) < '"+str_mesDiaDesde+"' ) ) "+
                        "AND (DBA.AsientosCab.Cod_Empresa = DBA.AsientosDet.Cod_Empresa) "+
                        "AND (DBA.AsientosCab.Periodo = DBA.AsientosDet.Periodo ) "+
                        "AND (DBA.AsientosCab.NroTransac = DBA.AsientosDet.NroTransac ) "+
                        "AND (DBA.AsientosCab.TipoAsiento = DBA.TipoAsiento.TipoAsiento) "+
                        "AND (DBA.AsientosDet.Cod_Empresa = DBA.PlanCta.Cod_Empresa ) "+
                        "AND (DBA.AsientosDet.Periodo = DBA.PlanCta.Periodo ) "+
                        "AND (DBA.AsientosDet.CodPlanCta = DBA.PlanCta.CodPlanCta ) "+
                        "AND (DBA.AsientosDet.DBCR = 'C') AND (DBA.TipoAsiento.TpDef = 'I') "+
                        "AND ( NOT EXISTS (SELECT * "+
                                            "FROM "+
                                                "DBA.PlanAuxi PA "+
                                            "WHERE "+
                                                "PA.Cod_Empresa = DBA.PlanCta.Cod_Empresa "+
                                                "AND PA.Periodo = DBA.PlanCta.Periodo "+
                                                "AND PA.CodPlancta = DBA.PlanCta.CodPlanCta "+
                                                "AND PA.TpCta = 'CB')) "+
                        "AND ( NOT EXISTS (SELECT * "+
                                            "FROM "+
                                                "DBA.LstCashFlow LCF "+
                                            "WHERE "+
                                                "LCF.Cod_Empresa = DBA.PlanCta.Cod_Empresa "+
                                                "AND LCF.Periodo = DBA.PlanCta.Periodo "+
                                                "AND LCF.CodPlancta = DBA.PlanCta.CodPlanCta "+
                                                "AND LCF.TipoCta IN ('N', 'I'))) "+
                    "GROUP BY "+
                        "DBA.AsientosCab.Cod_empresa,"+
                        "DBA.AsientosDet.CodPlanCta,"+
                        "DBA.PlanCta.Nombre "+
                    "UNION "+
                    "SELECT "+
                        "DBA.AsientosCab.Cod_empresa,"+
                        "DBA.AsientosDet.CodPlanCta,"+
                        "DBA.PlanCta.Nombre,"+
                        "'E' as Tipo,"+
                        "cast(SUM (DBA.AsientosDet.Importe ) as decimal(20,0)) AS Total,"+
                        "cast(SUM (DBA.AsientosDet.ImporteME) as decimal(20,2)) AS TotalME "+
                    "FROM "+
                        "DBA.AsientosCab,"+
                        "DBA.AsientosDet,"+ 
                        "DBA.TipoAsiento,"+
                        "DBA.PlanCta "+
                    "WHERE "+
                        "(DBA.AsientosCab.Cod_Empresa = '"+params.empresa+"') "+
                        "AND (DBA.AsientosCab.Periodo = '"+params.periodo+"' ) "+
                        "AND (DATE(DBA.AsientosCab.Fecha) >= '"+str_mesDiaDesde+"') "+
                        "AND (DATE (DBA.AsientosCab.Fecha) <= '"+str_mesDiaHasta+"') "+
                        "AND (DBA.AsientosCab.Transf <> 'D' ) "+
                        "AND (DBA.AsientosCab.Cod_Empresa = DBA.AsientosDet.Cod_Empresa) "+
                        "AND (DBA.AsientosCab.Periodo = DBA.AsientosDet.Periodo ) "+
                        "AND (DBA.AsientosCab.NroTransac = DBA.AsientosDet.NroTransac ) "+
                        "AND (DBA.AsientosCab.TipoAsiento = DBA.TipoAsiento.TipoAsiento) "+
                        "AND (DBA.AsientosDet.Cod_Empresa = DBA.PlanCta.Cod_Empresa) "+
                        "AND (DBA.AsientosDet.Periodo = DBA.PlanCta.Periodo ) "+
                        "AND (DBA.AsientosDet.CodPlanCta = DBA.PlanCta.CodPlanCta ) "+
                        "AND (DBA.AsientosDet.DBCR = 'D') "+
                        "AND (DBA.TipoAsiento.TpDef = 'E') "+
                        "AND ( NOT EXISTS (SELECT * "+
                                            "FROM "+
                                                "DBA.PlanAuxi PA "+
                                            "WHERE "+
                                                "PA.Cod_Empresa = DBA.PlanCta.Cod_Empresa "+
                                                "AND PA.Periodo = DBA.PlanCta.Periodo "+
                                                "AND PA.CodPlancta = DBA.PlanCta.CodPlanCta "+
                                                "AND PA.TpCta = 'CB')) "+
                        "AND ( NOT EXISTS (SELECT * "+
                                            "FROM "+
                                                "DBA.LstCashFlow LCF "+
                                            "WHERE "+
                                                "LCF.Cod_Empresa = DBA.PlanCta.Cod_Empresa "+
                                                "AND LCF.Periodo = DBA.PlanCta.Periodo "+
                                                "AND LCF.CodPlancta = DBA.PlanCta.CodPlanCta)) "+
                    "GROUP BY "+
                        "DBA.AsientosCab.Cod_empresa,"+
                        "DBA.AsientosDet.CodPlanCta,"+
                        "DBA.PlanCta.Nombre "+
                    "UNION "+
                    "SELECT "+
                        "DBA.AsientosCab.Cod_empresa,"+
                        "DBA.AsientosDet.CodPlanCta,"+
                        "DBA.PlanCta.Nombre,"+
                        "'I' AS Tipo,"+
                        "cast(SUM (IF (DBA.AsientosDet.DBCR = 'C') THEN DBA.AsientosDet.Importe ELSE 0 ENDIF) - SUM (IF (DBA.AsientosDet.DBCR = 'D') THEN DBA.AsientosDet.Importe ELSE 0 ENDIF) as decimal(20,0)) AS total,"+
                        "cast(SUM (IF (DBA.AsientosDet.DBCR = 'C') THEN DBA.AsientosDet.ImporteME ELSE 0 ENDIF) - SUM (IF (DBA.AsientosDet.DBCR = 'D') THEN DBA.AsientosDet.ImporteME ELSE 0 ENDIF) as decimal(20,2)) AS Totalme "+
                    "FROM "+
                        "DBA.AsientosCab,"+
                        "DBA.AsientosDet,"+
                        "DBA.TipoAsiento,"+
                        "DBA.PlanCta "+
                    "WHERE "+
                        "(DBA.AsientosCab.Cod_Empresa = '"+params.empresa+"') "+
                        "AND (DBA.AsientosCab.Periodo = '"+params.periodo+"' ) "+
                        "AND ( (DATE(DBA.AsientosCab.Fecha) >= '"+str_mesDiaDesde+"') "+
                            "AND (DATE(DBA.AsientosCab.Fecha) <= '"+str_mesDiaHasta+"') "+
                            "AND (DBA.AsientosCab.Transf = 'N' ) OR (DBA.AsientosCab.Transf = 'D' ) "+
                            "AND (DATE(DBA.AsientosCab.Fecha) >= '"+str_mesDiaAnterior+"') "+
                            "AND (DATE(DBA.AsientosCab.Fecha) < '"+str_mesDiaDesde+"' ) ) "+
                        "AND (DBA.AsientosCab.Cod_Empresa = DBA.AsientosDet.Cod_Empresa) "+
                        "AND (DBA.AsientosCab.Periodo = DBA.AsientosDet.Periodo ) "+
                        "AND (DBA.AsientosCab.NroTransac = DBA.AsientosDet.NroTransac ) "+
                        "AND (DBA.AsientosCab.TipoAsiento = DBA.TipoAsiento.TipoAsiento) "+
                        "AND (DBA.AsientosDet.Cod_Empresa = DBA.PlanCta.Cod_Empresa ) "+
                        "AND (DBA.AsientosDet.Periodo = DBA.PlanCta.Periodo ) "+
                        "AND (DBA.AsientosDet.CodPlanCta = DBA.PlanCta.CodPlanCta ) "+
                        "AND (DBA.TipoAsiento.TpDef = 'I') "+
                        "AND ( EXISTS (SELECT * "+
                                        "FROM "+
                                            "DBA.LstCashFlow LCF "+
                                        "WHERE "+
                                            "LCF.Cod_Empresa = DBA.PlanCta.Cod_Empresa "+
                                            "AND LCF.Periodo = DBA.PlanCta.Periodo "+
                                            "AND LCF.CodPlancta = DBA.PlanCta.CodPlanCta "+
                                            "AND LCF.TipoCta ='I')) "+
                    "GROUP BY "+
                        "DBA.AsientosCab.Cod_empresa,"+
                        "DBA.AsientosDet.CodPlanCta,"+
                        "DBA.PlanCta.Nombre";
        
        conn.exec(string1, function(err, row){
            data2 = row;
            
            var string2 = "";
            
            string2 =   "SELECT "+
                            "DBA.AsientosCab.Cod_empresa,"+
                            "DBA.AsientosDet.CodPlanCta,"+
                            "DBA.PlanCta.Nombre,"+
                            "DBA.PlanCta.TipoSaldo,"+
                            "SUM (IF (DBA.AsientosDet.DBCR = 'D') THEN DBA.AsientosDet.Importe ELSE 0 ENDIF) AS TotalDebito,"+
                            "SUM (IF (DBA.AsientosDet.DBCR = 'C') THEN DBA.AsientosDet.Importe ELSE 0 ENDIF) AS TotalCredito "+
                        "FROM "+
                            "DBA.AsientosCab,"+
                            "DBA.AsientosDet,"+
                            "DBA.TipoAsiento,"+
                            "DBA.lstCashFlow,"+
                            "DBA.PlanCta,"+
                            "DBA.Control "+
                        "WHERE "+
                            "(DBA.AsientosCab.Cod_Empresa = '"+params.empresa+"') "+
                            "AND (DBA.AsientosCab.Periodo = '"+params.periodo+"' ) "+ 
                            "AND (DBA.lstCashFlow.Cod_Empresa = DBA.PlanCta.Cod_Empresa) "+
                            "AND (DBA.lstCashFlow.Periodo = DBA.PlanCta.Periodo ) "+
                            "AND (DBA.lstCashFlow.CodPlanCta = DBA.PlanCta.CodPlanCta ) "+
                            "AND (DBA.lstCashFlow.TipoCta = 'S' ) "+
                            "AND (DATE (DBA.AsientosCab.Fecha) >= '"+str_mesDiaDesde+"') "+
                            "AND (DATE (DBA.AsientosCab.Fecha) <= '"+str_mesDiaHasta+"') "+
                            "AND (DBA.AsientosCab.Cod_Empresa = DBA.AsientosDet.Cod_Empresa) "+
                            "AND (DBA.AsientosCab.Periodo = DBA.AsientosDet.Periodo ) "+
                            "AND (DBA.AsientosCab.NroTransac = DBA.AsientosDet.NroTransac ) "+
                            "AND (DBA.AsientosCab.TipoAsiento = DBA.TipoAsiento.TipoAsiento) "+
                            "AND (DBA.AsientosCab.Cod_Empresa = DBA.Control.Cod_Empresa) "+
                            "AND (DBA.AsientosCab.Periodo = DBA.Control.Periodo ) "+
                            "AND (DBA.AsientosCab.TipoAsiento <> DBA.Control.TipoAsientoAper) "+
                            "AND (DBA.AsientosDet.Cod_Empresa = DBA.PlanCta.Cod_Empresa) "+
                            "AND (DBA.AsientosDet.Periodo = DBA.PlanCta.Periodo ) "+
                            "AND (DBA.AsientosDet.CodPlanCta = DBA.PlanCta.CodPlanCta ) "+
                        "GROUP BY "+
                            "DBA.AsientosCab.Cod_empresa,"+
                            "DBA.AsientosDet.CodPlanCta,"+
                            "DBA.PlanCta.Nombre,"+
                            "DBA.PlanCta.TipoSaldo "+
                        "UNION "+
                        "SELECT "+
                            "DBA.AsientosCab.Cod_empresa,"+
                            "DBA.AsientosDet.CodPlanCta,"+
                            "DBA.PlanCta.Nombre,"+
                            "DBA.PlanCta.TipoSaldo,"+
                            "SUM (IF (DBA.AsientosDet.DBCR = 'D') THEN DBA.AsientosDet.Importe ELSE 0 ENDIF) AS TotalDebito,"+
                            "SUM (IF (DBA.AsientosDet.DBCR = 'C') THEN DBA.AsientosDet.Importe ELSE 0 ENDIF) AS TotalCredito "+
                        "FROM "+
                            "DBA.AsientosCab,"+
                            "DBA.AsientosDet,"+
                            "DBA.TipoAsiento,"+
                            "DBA.lstCashFlow,"+
                            "DBA.PlanCta "+
                        "WHERE "+
                            "(DBA.AsientosCab.Cod_Empresa = '"+params.empresa+"') "+
                            "AND (DBA.AsientosCab.Periodo = '"+params.periodo+"' ) "+
                            "AND (DBA.lstCashFlow.Cod_Empresa = DBA.PlanCta.Cod_Empresa) "+
                            "AND (DBA.lstCashFlow.Periodo = DBA.PlanCta.Periodo ) "+
                            "AND (DBA.lstCashFlow.CodPlanCta = DBA.PlanCta.CodPlanCta ) "+
                            "AND (DBA.lstCashFlow.TipoCta = 'D') "+
                            "AND (DATE (DBA.AsientosCab.Fecha) >= '"+str_mesDiaDesde+"') "+
                            "AND (DATE (DBA.AsientosCab.Fecha) <= '"+str_mesDiaHasta+"') "+
                            "AND (DBA.AsientosCab.Transf <> 'S') "+
                            "AND (DBA.AsientosCab.Cod_Empresa = DBA.AsientosDet.Cod_Empresa) "+
                            "AND (DBA.AsientosCab.Periodo = DBA.AsientosDet.Periodo ) "+
                            "AND (DBA.AsientosCab.NroTransac = DBA.AsientosDet.NroTransac ) "+
                            "AND (DBA.AsientosCab.TipoAsiento = DBA.TipoAsiento.TipoAsiento) "+
                            "AND (DBA.AsientosDet.Cod_Empresa = DBA.PlanCta.Cod_Empresa) "+
                            "AND (DBA.AsientosDet.Periodo = DBA.PlanCta.Periodo ) "+
                            "AND (DBA.AsientosDet.CodPlanCta = DBA.PlanCta.CodPlanCta ) "+
                            "AND (DBA.TipoAsiento.TpDef = 'I') "+
                        "GROUP BY "+
                            "DBA.AsientosCab.Cod_empresa,"+
                            "DBA.AsientosDet.CodPlanCta,"+
                            "DBA.PlanCta.Nombre,"+
                            "DBA.PlanCta.TipoSaldo "+
                        "UNION "+
                        "SELECT "+
                            "DBA.AsientosCab.Cod_empresa,"+
                            "DBA.AsientosDet.CodPlanCta,"+
                            "DBA.PlanCta.Nombre,"+
                            "DBA.PlanCta.TipoSaldo,"+
                            "SUM (IF (DBA.AsientosDet.DBCR = 'D') THEN DBA.AsientosDet.Importe ELSE 0 ENDIF) AS TotalDebito,"+
                            "SUM (IF (DBA.AsientosDet.DBCR = 'C') THEN DBA.AsientosDet.Importe ELSE 0 ENDIF) AS TotalCredito "+
                        "FROM "+
                            "DBA.AsientosCab,"+
                            "DBA.AsientosDet,"+
                            "DBA.TipoAsiento,"+
                            "DBA.lstCashFlow,"+
                            "DBA.PlanCta "+
                        "WHERE "+
                            "(DBA.AsientosCab.Cod_Empresa = '"+params.empresa+"' ) "+
                            "AND (DBA.AsientosCab.Periodo = '"+params.periodo+"' ) "+
                            "AND (DBA.lstCashFlow.Cod_Empresa = DBA.PlanCta.Cod_Empresa) "+
                            "AND (DBA.lstCashFlow.Periodo = DBA.PlanCta.Periodo ) "+
                            "AND (DBA.lstCashFlow.CodPlanCta = DBA.PlanCta.CodPlanCta ) "+
                            "AND (DBA.lstCashFlow.TipoCta = 'D') "+
                            "AND (DBA.AsientosCab.Transf = 'D' ) "+
                            "AND (DATE (DBA.AsientosCab.Fecha) >= '"+str_mesDiaAnterior+"' ) "+
                            "AND (DATE (DBA.AsientosCab.Fecha) < '"+str_mesDiaDesde+"' ) "+
                            "AND (DBA.AsientosCab.Cod_Empresa = DBA.AsientosDet.Cod_Empresa) "+
                            "AND (DBA.AsientosCab.Periodo = DBA.AsientosDet.Periodo ) "+
                            "AND (DBA.AsientosCab.NroTransac = DBA.AsientosDet.NroTransac ) "+
                            "AND (DBA.AsientosCab.TipoAsiento = DBA.TipoAsiento.TipoAsiento) "+
                            "AND (DBA.AsientosDet.Cod_Empresa = DBA.PlanCta.Cod_Empresa) "+
                            "AND (DBA.AsientosDet.Periodo = DBA.PlanCta.Periodo ) "+
                            "AND (DBA.AsientosDet.CodPlanCta = DBA.PlanCta.CodPlanCta ) "+
                            "AND (DBA.TipoAsiento.TpDef = 'I') "+
                        "GROUP BY "+
                            "DBA.AsientosCab.Cod_empresa,"+
                            "DBA.AsientosDet.CodPlanCta,"+
                            "DBA.PlanCta.Nombre,"+
                            "DBA.PlanCta.TipoSaldo";
            
            conn.exec(string2, function(err, row){
                if (err) throw err;
                data3 = row;
                cb([{ saldos : data1 },{ movimientos : data2 },{ descuentoes : data3 }]);
            });
        });
    });

}

module.exports = Flow;