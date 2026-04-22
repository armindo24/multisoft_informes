var conn = require('../db_integrado');
var util = require('util');

var Flow = {};
var FLOWCACHE_TTL_MS = 30000;
var flowResultCache = new Map();
var flowPendingCache = new Map();
var LST_CASHFLOW_MISSING_TTL_MS = 10 * 60 * 1000;
var lstCashFlowMissingCache = new Map();

function buildFlowCacheKey(params) {
    return JSON.stringify({
        periodo: String(params.periodo || ''),
        empresa: String(params.empresa || ''),
        mes: String(params.mes || '')
    });
}

function getFlowCachedResult(key) {
    var cached = flowResultCache.get(key);
    if (!cached) {
        return null;
    }

    if (cached.expiresAt < Date.now()) {
        flowResultCache.delete(key);
        return null;
    }

    return cached.data;
}

function setFlowCachedResult(key, data) {
    flowResultCache.set(key, {
        data: data,
        expiresAt: Date.now() + FLOWCACHE_TTL_MS
    });
}

function buildLstCashFlowKey(params) {
    return JSON.stringify({
        empresa: String(params.empresa || ''),
        periodo: String(params.periodo || '')
    });
}

function isLstCashFlowKnownMissing(params) {
    var key = buildLstCashFlowKey(params);
    var cached = lstCashFlowMissingCache.get(key);
    if (!cached) {
        return false;
    }

    if (cached.expiresAt < Date.now()) {
        lstCashFlowMissingCache.delete(key);
        return false;
    }

    return true;
}

function rememberMissingLstCashFlow(params) {
    lstCashFlowMissingCache.set(buildLstCashFlowKey(params), {
        expiresAt: Date.now() + LST_CASHFLOW_MISSING_TTL_MS
    });
}

function isMissingLstCashFlow(err) {
    var message = String((err && (err.message || err.msg)) || '').toLowerCase();
    return message.indexOf("table 'lstcashflow' not found") !== -1 ||
        message.indexOf("table \"lstcashflow\" not found") !== -1 ||
        (message.indexOf('lstcashflow') !== -1 && message.indexOf('not found') !== -1);
}

function buildBancosSql(params) {
    return "select "+
                "pa.cod_empresa,"+
                "pa.codmoneda,"+
                "c.monedalocal,"+
                "sum (a.totaldb - a.totalcr) as Saldo,"+
                "sum (a.totaldbme - a.totalcrme) as SaldoME "+
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
                "and pa.Periodo = a.periodo "+
                "and pa.codplancta = a.codplancta "+
                "and pa.codplanaux = a.codplanaux "+
                "and a.anho = "+params.periodo+" " +
                "and a.mes >= 1 " +
                "and a.mes <= "+ params.mes+" " +
            "group by "+
                "pa.cod_empresa,"+
                "pa.codmoneda,"+
                "c.monedalocal";
}

function buildSaldoInicialSql(params) {
    return "select " +
                "pa.cod_empresa," +
                "pa.codmoneda," +
                "c.monedalocal," +
                "cast(sum(a.totaldb - a.totalcr) as decimal(20,0)) as Saldo," +
                "cast(sum(a.totaldbme - a.totalcrme) as decimal(20,2)) as SaldoME " +
            "from " +
                "dba.planauxi pa," +
                "dba.acumauxi a," +
                "dba.control c " +
            "where " +
                "pa.Cod_Empresa = '" + params.empresa + "' " +
                "and pa.Periodo = '" + params.periodo + "' " +
                "and pa.cod_empresa = c.cod_empresa " +
                "and pa.periodo = c.periodo " +
                "and pa.tpcta = 'CB' " +
                "and pa.cod_empresa = a.cod_empresa " +
                "and pa.periodo = a.periodo " +
                "and pa.codplancta = a.codplancta " +
                "and pa.codplanaux = a.codplanaux " +
                "and a.anho = " + params.periodo + " " +
                "and a.mes >= 1 " +
                "and a.mes < " + params.mes + " " +
            "group by " +
                "pa.cod_empresa," +
                "pa.codmoneda," +
                "c.monedalocal";
}

function buildSaldoAperturaSql(params) {
    return "select " +
                "pa.cod_empresa," +
                "pa.codmoneda," +
                "c.monedalocal," +
                "sum(a.importe) as Saldo," +
                "sum(a.importeme) as SaldoME " +
            "from " +
                "dba.planauxi pa," +
                "dba.asientosdet a," +
                "dba.asientoscab ac," +
                "dba.control c," +
                "dba.tipoasiento t " +
            "where " +
                "pa.Cod_Empresa = '" + params.empresa + "' " +
                "and pa.Periodo = '" + params.periodo + "' " +
                "and pa.cod_empresa = c.cod_empresa " +
                "and pa.tpcta = 'CB' " +
                "and pa.cod_empresa = a.cod_empresa " +
                "and pa.periodo = a.periodo " +
                "and pa.codplancta = a.codplancta " +
                "and pa.codplanaux = a.codplanaux " +
                "and ac.tipoasiento = t.tipoasiento " +
                "and t.tipoasiento = c.tipoasientoaper " +
                "and ac.cod_empresa = a.cod_empresa " +
                "and ac.nrotransac = a.nrotransac " +
                "and year(ac.fecha) = " + params.periodo + " " +
                "and month(ac.fecha) = " + params.mes + " " +
            "group by " +
                "pa.cod_empresa," +
                "pa.codmoneda," +
                "c.monedalocal";
}

function finishFlowWithFallback(data1, data2, data3, params, cb) {
    return conn.exec(buildBancosSql(params), function(err, row){
        if (err) {
            console.error('[flowcash] Error cargando bancos en fallback:', err);
            return cb([{ saldos : data1 || [] },{ movimientos : data2 || [] },{ descuentos : data3 || [] },{ bancos : [] }]);
        }
        var data4 = row;
        cb([{ saldos : data1 || [] },{ movimientos : data2 || [] },{ descuentos : data3 || [] },{ bancos : data4 || [] }]);
    });
}

function computeFlowAll(params, cb) {
    var data1 = [];
    var data2 = [];
    var data3 = [];
    var data4 = [];

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

    var string = parseInt(params.mes) > 1
        ? buildSaldoInicialSql(params)
        : buildSaldoAperturaSql(params);
    console.log(string)       
    conn.exec(string, function(err, row){
        if (err) {
            console.error('[flowcash] Error cargando saldos:', err);
            return cb([{ saldos : [] },{ movimientos : [] },{ descuentos : [] },{ bancos : [] }]);
        }
        data1 = row;

        if (isLstCashFlowKnownMissing(params)) {
            console.warn('[flowcash] Tabla lstCashFlow marcada como ausente para', params.empresa, params.periodo, '- se usa flujo parcial en cache.');
            return finishFlowWithFallback(data1, [], [], params, cb);
        }
        
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
            if (err) {
                if (isMissingLstCashFlow(err)) {
                    rememberMissingLstCashFlow(params);
                    console.warn('[flowcash] Tabla lstCashFlow no existe para', params.empresa, params.periodo, '- se devuelve flujo parcial.');
                    return finishFlowWithFallback(data1, [], [], params, cb);
                }

                console.error('[flowcash] Error cargando movimientos:', err);
                return finishFlowWithFallback(data1, [], [], params, cb);
            }

            data2 = row;
            
            var string2 = "";
            
            string2 =   "select "+
                            "Cod_empresa,"+
                            "CodPlanCta,"+
                            "Nombre,"+
                            "TipoSaldo,"+
                            "cast(TotalDebito as decimal(20,0)),"+
                            "cast(TotalCredito as decimal(20,0)),"+
                            "cast((if (TipoSaldo = 'D') then abs(TotalDebito-TotalCredito) else abs(TotalCredito-TotalDebito) endif) as decimal(20,0)) as Saldo "+ 
                        "from "+
                            "(SELECT DBA.AsientosCab.Cod_empresa,"+   
                                "DBA.AsientosDet.CodPlanCta,"+
                                "DBA.PLANCTA.Nombre,"+
                                "DBA.PLANCTA.TipoSaldo,"+
                                "SUM ( IF ( DBA.AsientosDet.DBCR = 'D' ) THEN DBA.AsientosDet.Importe ELSE 0 ENDIF) AS TotalDebito,"+
                                "SUM ( IF ( DBA.AsientosDet.DBCR = 'C' ) THEN DBA.AsientosDet.Importe ELSE 0 ENDIF) AS TotalCredito "+
                            "FROM "+
                                "DBA.AsientosCab,"+ 
                                "DBA.AsientosDet,"+
                                "DBA.TipoAsiento T,"+ 
                                "DBA.lstCashFlow,"+
                                "DBA.PLANCTA,"+
                                "DBA.Control  "+
                            "WHERE "+
                                "( DBA.AsientosCab.Cod_Empresa = '"+params.empresa+"' ) "+
                                "AND ( DBA.lstCashFlow.Cod_Empresa = DBA.PLANCTA.Cod_Empresa ) "+ 
                                "AND ( DBA.lstCashFlow.Periodo = DBA.PLANCTA.Periodo ) "+ 
                                "AND ( DBA.lstCashFlow.CodPlanCta = DBA.PLANCTA.CodPlanCta ) "+ 
                                "AND ( DBA.lstCashFlow.TipoCta = 'S' ) "+
                                "AND ( DATE (DBA.AsientosCab.Fecha) >= '"+str_mesDiaDesde+"' ) "+ 
                                "AND ( DATE (DBA.AsientosCab.Fecha) <= '"+str_mesDiaHasta+"' ) "+
                                "AND ( DBA.AsientosCab.Cod_Empresa = DBA.AsientosDet.Cod_Empresa ) "+ 
                                "AND ( DBA.AsientosCab.NroTransac = DBA.AsientosDet.NroTransac ) "+
                                "AND ( DBA.AsientosCab.TipoAsiento = T.TipoAsiento ) "+
                                "AND ( DBA.AsientosCab.TipoAsiento = T.TipoAsiento ) "+
                                "AND ( DBA.AsientosCab.Cod_Empresa = Control.Cod_Empresa ) "+ 
                                "AND ( DBA.AsientosCab.TipoAsiento <> Control.TipoAsientoAper) "+ 
                                "AND ( DBA.AsientosDet.Cod_Empresa = DBA.PLANCTA.Cod_Empresa ) "+
                                "AND ( DBA.AsientosDet.Periodo = DBA.PLANCTA.Periodo ) "+
                                "AND ( DBA.AsientosDet.CodPlanCta = DBA.PLANCTA.CodPlanCta ) "+ 
                            "GROUP BY "+
                                "DBA.AsientosCab.Cod_empresa,"+   
                                "DBA.AsientosDet.CodPlanCta,"+
                                "DBA.PLANCTA.Nombre,"+
                                "DBA.PLANCTA.TipoSaldo "+
                            "UNION "+
                            "SELECT "+
                                "DBA.AsientosCab.Cod_empresa,"+   
                                "DBA.AsientosDet.CodPlanCta,"+
                                "DBA.PLANCTA.Nombre,"+
                                "DBA.PLANCTA.TipoSaldo,"+
                                "SUM ( IF ( DBA.AsientosDet.DBCR = 'D' ) THEN DBA.AsientosDet.Importe ELSE 0 ENDIF) AS TotalDebito,"+
                                "SUM ( IF ( DBA.AsientosDet.DBCR = 'C' ) THEN DBA.AsientosDet.Importe ELSE 0 ENDIF) AS TotalCredito "+
                            "FROM "+
                                "DBA.AsientosCab,"+
                                "DBA.AsientosDet,"+
                                "DBA.TipoAsiento T,"+ 
                                "DBA.lstCashFlow,"+
                                "DBA.PLANCTA "+
                           "WHERE "+
                                "( DBA.AsientosCab.Cod_Empresa = '"+params.empresa+"' ) "+
                                "AND ( DBA.lstCashFlow.Cod_Empresa = DBA.PLANCTA.Cod_Empresa ) "+
                                "AND ( DBA.lstCashFlow.Periodo = DBA.PLANCTA.Periodo ) "+
                                "AND ( DBA.lstCashFlow.CodPlanCta = DBA.PLANCTA.CodPlanCta ) "+ 
                                "AND ( DBA.lstCashFlow.TipoCta = 'D' ) "+
                                "AND ( DATE (DBA.AsientosCab.Fecha) >= '"+str_mesDiaDesde+"' ) "+ 
                                "AND ( DATE (DBA.AsientosCab.Fecha) <= '"+str_mesDiaHasta+"' ) "+
                                "AND ( DBA.AsientosCab.Transf <> 'S' ) "+
                                "AND ( DBA.AsientosCab.Cod_Empresa = DBA.AsientosDet.Cod_Empresa ) "+ 
                                "AND ( DBA.AsientosCab.NroTransac = DBA.AsientosDet.NroTransac ) "+
                                "AND ( DBA.AsientosCab.TipoAsiento = T.TipoAsiento ) "+
                                "AND ( DBA.AsientosDet.Cod_Empresa = DBA.PLANCTA.Cod_Empresa ) "+ 
                                "AND ( DBA.AsientosDet.Periodo = DBA.PLANCTA.Periodo ) "+
                                "AND ( DBA.AsientosDet.CodPlanCta = DBA.PLANCTA.CodPlanCta ) "+ 
                                "AND ( T.TpDef = 'I' ) "+
                            "GROUP BY "+
                                "DBA.AsientosCab.Cod_empresa,"+   
                                "DBA.AsientosDet.CodPlanCta,"+
                                "DBA.PLANCTA.Nombre,"+
                                "DBA.PLANCTA.TipoSaldo "+
                            "UNION "+
                            "SELECT "+
                                "DBA.AsientosCab.Cod_empresa,"+   
                                "DBA.AsientosDet.CodPlanCta,"+
                                "DBA.PLANCTA.Nombre,"+
                                "DBA.PLANCTA.TipoSaldo,"+ 
                                "SUM ( IF ( DBA.AsientosDet.DBCR = 'D' ) THEN DBA.AsientosDet.Importe ELSE 0 ENDIF) AS TotalDebito,"+
                                "SUM ( IF ( DBA.AsientosDet.DBCR = 'C' ) THEN DBA.AsientosDet.Importe ELSE 0 ENDIF) AS TotalCredito "+
                            "FROM "+
                                "DBA.AsientosCab,"+ 
                                "DBA.AsientosDet,"+
                                "DBA.TipoAsiento T,"+ 
                                "DBA.lstCashFlow,"+
                                "DBA.PLANCTA "+
                           "WHERE "+
                                "( DBA.AsientosCab.Cod_Empresa = '"+params.empresa+"' ) "+ 
                                "AND ( DBA.lstCashFlow.Cod_Empresa = DBA.PLANCTA.Cod_Empresa ) "+ 
                                "AND ( DBA.lstCashFlow.Periodo = DBA.PLANCTA.Periodo ) "+
                                "AND ( DBA.lstCashFlow.CodPlanCta = DBA.PLANCTA.CodPlanCta ) "+
                                "AND ( DBA.lstCashFlow.TipoCta = 'D' ) "+
                                "AND ( DBA.AsientosCab.Transf = 'D' ) "+
                                "AND ( DATE (DBA.AsientosCab.Fecha) >= '"+str_mesDiaAnterior+"' ) "+ 
                                "AND ( DATE (DBA.AsientosCab.Fecha) < '"+str_mesDiaDesde+"' ) "+
                                "AND ( DBA.AsientosCab.Cod_Empresa = DBA.AsientosDet.Cod_Empresa ) "+ 
                                "AND ( DBA.AsientosCab.NroTransac = DBA.AsientosDet.NroTransac ) "+
                                "AND ( DBA.AsientosCab.TipoAsiento = T.TipoAsiento ) "+
                                "AND ( DBA.AsientosDet.Cod_Empresa = DBA.PLANCTA.Cod_Empresa ) "+ 
                                "AND ( DBA.AsientosDet.Periodo = DBA.PLANCTA.Periodo ) "+
                                "AND ( DBA.AsientosDet.CodPlanCta = DBA.PLANCTA.CodPlanCta ) "+
                                "AND ( T.TpDef = 'I') "+
                            "GROUP BY "+
                                "DBA.AsientosCab.Cod_empresa,"+   
                                "DBA.AsientosDet.CodPlanCta,"+
                                "DBA.PLANCTA.Nombre,"+
                                "DBA.PLANCTA.TipoSaldo) as tabla";
                        
            conn.exec(string2, function(err, row){
                if (err) {
                    if (isMissingLstCashFlow(err)) {
                        rememberMissingLstCashFlow(params);
                        console.warn('[flowcash] Tabla lstCashFlow no existe para', params.empresa, params.periodo, '- se omiten descuentos.');
                        data3 = [];
                        return finishFlowWithFallback(data1, data2, data3, params, cb);
                    }

                    console.error('[flowcash] Error cargando descuentos:', err);
                    return finishFlowWithFallback(data1, data2, [], params, cb);
                }
                data3 = row;
                
                conn.exec(buildBancosSql(params), function(err, row){
                    if (err) {
                        console.error('[flowcash] Error cargando bancos:', err);
                        return cb([{ saldos : data1 },{ movimientos : data2 },{ descuentos : data3 },{ bancos : [] }]);
                    }
                    data4 = row;
                    cb([{ saldos : data1 },{ movimientos : data2 },{ descuentos : data3 },{ bancos : data4 }]);
                });
            });
        });
    });

}

Flow.all = function (params, cb) {
    var key = buildFlowCacheKey(params);
    var cached = getFlowCachedResult(key);

    if (cached) {
        cb(cached);
        return;
    }

    if (flowPendingCache.has(key)) {
        flowPendingCache.get(key)
            .then(function (result) {
                cb(result);
            })
            .catch(function (error) {
                console.error('Error reutilizando flowcash pendiente:', error);
                cb([]);
            });
        return;
    }

    var request = new Promise(function (resolve, reject) {
        try {
            computeFlowAll(params, function (result) {
                resolve(result || []);
            });
        } catch (error) {
            reject(error);
        }
    })
        .then(function (result) {
            setFlowCachedResult(key, result);
            flowPendingCache.delete(key);
            return result;
        })
        .catch(function (error) {
            flowPendingCache.delete(key);
            throw error;
        });

    flowPendingCache.set(key, request);

    request
        .then(function (result) {
            cb(result);
        })
        .catch(function (error) {
            console.error('Error cargando flowcash:', error);
            cb([]);
        });
};

module.exports = Flow;
