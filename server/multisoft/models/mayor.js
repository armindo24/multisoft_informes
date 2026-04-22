var conn = require('../db_integrado');

var Mayor = {};

function normalizeAuxRows(rows) {
    return (rows || []).map(function (r) {
        if (!r || typeof r !== 'object') return r;
        return {
            CodPlanCta: (typeof r.CodPlanCta !== 'undefined') ? r.CodPlanCta : r.codplancta,
            Cuenta: (typeof r.Cuenta !== 'undefined') ? r.Cuenta : r.cuenta,
            CodPlanAux: (typeof r.CodPlanAux !== 'undefined') ? r.CodPlanAux : r.codplanaux,
            Auxiliar: (typeof r.Auxiliar !== 'undefined') ? r.Auxiliar : r.auxiliar
        };
    });
}

function normalizeDetalleAuxRows(rows) {
    return (rows || []).map(function (r) {
        if (!r || typeof r !== 'object') return r;
        return {
            Cod_Empresa: (typeof r.Cod_Empresa !== 'undefined') ? r.Cod_Empresa : r.cod_empresa,
            NroCompr: (typeof r.NroCompr !== 'undefined') ? r.NroCompr : r.nrocompr,
            NroTransac: (typeof r.NroTransac !== 'undefined') ? r.NroTransac : r.nrotransac,
            CodPlanAux: (typeof r.CodPlanAux !== 'undefined') ? r.CodPlanAux : r.codplanaux,
            Auxiliar: (typeof r.Auxiliar !== 'undefined') ? r.Auxiliar : r.auxiliar,
            TipoSaldo: (typeof r.TipoSaldo !== 'undefined') ? r.TipoSaldo : r.tiposaldo,
            tiposaldo: (typeof r.tiposaldo !== 'undefined') ? r.tiposaldo : r.TipoSaldo,
            CodPlanCta: (typeof r.CodPlanCta !== 'undefined') ? r.CodPlanCta : r.codplancta,
            Cuenta: (typeof r.Cuenta !== 'undefined') ? r.Cuenta : r.cuenta,
            Fecha: (typeof r.Fecha !== 'undefined') ? r.Fecha : r.fecha,
            ANHO: (typeof r.ANHO !== 'undefined') ? r.ANHO : r.anho,
            MES: (typeof r.MES !== 'undefined') ? r.MES : r.mes,
            Codmoneda: (typeof r.Codmoneda !== 'undefined') ? r.Codmoneda : r.codmoneda,
            Tipoasiento: (typeof r.Tipoasiento !== 'undefined') ? r.Tipoasiento : r.tipoasiento,
            Abreviatura: (typeof r.Abreviatura !== 'undefined') ? r.Abreviatura : r.abreviatura,
            Linea: (typeof r.Linea !== 'undefined') ? r.Linea : r.linea,
            Concepto: (typeof r.Concepto !== 'undefined') ? r.Concepto : r.concepto,
            Dbcr: (typeof r.Dbcr !== 'undefined') ? r.Dbcr : r.dbcr,
            Origen: (typeof r.Origen !== 'undefined') ? r.Origen : r.origen,
            Importe: (typeof r.Importe !== 'undefined') ? r.Importe : r.importe,
            Credito: (typeof r.Credito !== 'undefined') ? r.Credito : r.credito,
            Debito: (typeof r.Debito !== 'undefined') ? r.Debito : r.debito,
            CreditoME: (typeof r.CreditoME !== 'undefined') ? r.CreditoME : r.creditome,
            DebitoME: (typeof r.DebitoME !== 'undefined') ? r.DebitoME : r.debitome
        };
    });
}

function normalizeSaldoAuxRows(rows) {
    return (rows || []).map(function (r) {
        if (!r || typeof r !== 'object') return r;
        return {
            CodPlanAux: (typeof r.CodPlanAux !== 'undefined') ? r.CodPlanAux : r.codplanaux,
            TipoSaldo: (typeof r.TipoSaldo !== 'undefined') ? r.TipoSaldo : r.tiposaldo,
            tiposaldo: (typeof r.tiposaldo !== 'undefined') ? r.tiposaldo : r.TipoSaldo,
            Credito: (typeof r.Credito !== 'undefined') ? r.Credito : r.credito,
            Debito: (typeof r.Debito !== 'undefined') ? r.Debito : r.debito,
            CreditoME: (typeof r.CreditoME !== 'undefined') ? r.CreditoME : r.creditome,
            DebitoME: (typeof r.DebitoME !== 'undefined') ? r.DebitoME : r.debitome
        };
    });
}

function dbIsPostgres() {
    try {
        if (typeof conn.getStatus === 'function') {
            var st = conn.getStatus() || {};
            var eng = String(st.engine || st.configured_engine || '').toLowerCase();
            if (eng === 'postgres') return true;
            if (eng === 'sqlanywhere') return false;
        }
    } catch (e) {}
    return String(conn._engine || '').toLowerCase() === 'postgres';
}

function plusOneDayExpr(dateTimeLiteral) {
    if (dbIsPostgres()) return "('" + dateTimeLiteral + "'::timestamp + interval '1 day')";
    return "dateadd(dd,1,'" + dateTimeLiteral + "')";
}

function minusOneDayExpr(dateTimeLiteral) {
    if (dbIsPostgres()) return "('" + dateTimeLiteral + "'::timestamp - interval '1 day')";
    return "dateadd(dd,-1,'" + dateTimeLiteral + "')";
}

Mayor.cuentas = function (params,cb) {
    params = params || {};
    params.tipoasiento = (!params.tipoasiento || params.tipoasiento === 'undefined') ? 'NINGUNO' : String(params.tipoasiento).trim();
    var tipoFilter = params.tipoasiento !== 'NINGUNO' ? (" AND ac.TipoAsiento = '" + params.tipoasiento + "' ") : "";
    var fromAccount = params.cuentad;
    var toAccount = params.cuentah;
    var noRange = !fromAccount || !toAccount || fromAccount === 'undefined' || toAccount === 'undefined' ||
        fromAccount === 'NINGUNA' || toAccount === 'NINGUNA';
    var accountFilterAsiento = noRange ? "" :
        ("AND p.CodPlanCta >= '" + fromAccount + "' AND p.CodPlanCta <= '" + toAccount + "' ");
    var accountFilterPlan = noRange ? "" :
        ("AND p.CodPlanCta >= '" + fromAccount + "' AND p.CodPlanCta <= '" + toAccount + "' ");
    var data1Sql;

    if (params.incluir == "NO") {
        data1Sql =
            "SELECT DISTINCT ad.Codplancta, p.Nombre AS NOMBREPLANCTA, p.Codplanctapad, " +
            "COALESCE(pp.Nombre, '') AS NOMBREPLANCTAPAD " +
            "FROM dba.Asientoscab ac " +
            "JOIN dba.Asientosdet ad ON ac.Cod_empresa = ad.Cod_empresa AND ac.Nrotransac = ad.Nrotransac AND ac.Periodo = ad.Periodo " +
            "JOIN dba.PLANCTA p " +
            "  ON ad.Cod_empresa = p.Cod_empresa AND ad.Periodo = p.Periodo AND ad.Codplancta = p.Codplancta " +
            "LEFT JOIN dba.PLANCTA pp " +
            "  ON pp.Cod_Empresa = p.Cod_Empresa AND pp.Periodo = p.Periodo AND pp.CodPlanCta = p.Codplanctapad " +
            "WHERE EXISTS (SELECT 1 FROM dba.TipoAsiento ta WHERE ta.TipoAsiento = ac.TipoAsiento AND ta.TpDef NOT IN ('N')) " +
            "AND ac.Cod_Empresa = '" + params.empresa + "' " +
            "AND ac.Periodo = '" + params.periodo + "' " +
            "AND (p.Imputable = 'S' OR p.Auxiliar = 'S') " +
            "AND ac.Fecha >= '" + params.fechad + "' AND ac.Fecha < " + plusOneDayExpr(params.fechah) + " " +
            accountFilterAsiento +
            tipoFilter +
            "ORDER BY ad.Codplancta";
    } else {
        // Incluir cuentas sin movimiento: traer todo plan de cuentas del rango sin unir con asientos.
        data1Sql =
            "SELECT p.CodPlanCta AS Codplancta, p.Nombre AS NOMBREPLANCTA, p.Codplanctapad, " +
            "COALESCE(pp.Nombre, '') AS NOMBREPLANCTAPAD " +
            "FROM dba.PLANCTA p " +
            "LEFT JOIN dba.PLANCTA pp " +
            "  ON pp.Cod_Empresa = p.Cod_Empresa AND pp.Periodo = p.Periodo AND pp.CodPlanCta = p.Codplanctapad " +
            "WHERE p.Cod_Empresa = '" + params.empresa + "' " +
            "AND p.Periodo = '" + params.periodo + "' " +
            "AND (p.Imputable = 'S' OR p.Auxiliar = 'S') " +
            accountFilterPlan +
            "ORDER BY p.CodPlanCta";
    }

    conn.exec(data1Sql, function (err, row) {
        if (err) {
            console.error('[Mayor.cuentas] error:', err.message || err);
            return cb([{ data1: [] }, { data2: [] }]);
        }
        var data1 = row || [];
        var parentMap = {};
        for (var i = 0; i < data1.length; i++) {
            var p = data1[i];
            if (!p || !p.Codplanctapad) continue;
            if (!parentMap[p.Codplanctapad]) {
                parentMap[p.Codplanctapad] = {
                    Codplanctapad: p.Codplanctapad,
                    NOMBREPLANCTAPAD: p.NOMBREPLANCTAPAD
                };
            }
        }
        var data2 = Object.keys(parentMap)
            .sort(function (a, b) {
                a = String(a);
                b = String(b);
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            })
            .map(function (k) { return parentMap[k]; });
        cb([{ data1: data1 }, { data2: data2 }]);
    });
};

Mayor.cuentasdetalle = function (params,cb) {

    var string1 = "select ac.Cod_empresa,ac.Nrocompr,ac.Nrotransac,"+
    "ac.NroAsiento,vmc.Periodo, ac.Autorizado,"+
    "vmc.Codplancta,pa.Nombre as NOMBREPLANCTA,pa.Codplanctapad,"+
    "pa.tiposaldo,dba.f_get_CuentaName (pa.cod_empresa, pa.periodo, pa.codplanctapad ) as NOMBREPLANCTAPAD,"+
    "date(ac.Fecha) as Fecha,YEAR(ac.Fecha) as ANHO,MONTH(ac.Fecha) as MES,"+
    "ac.Codmoneda,ac.Tipoasiento,'' as Abreviatura,"+
    "vmc.Linea,vmc.Concepto,vmc.Dbcr,"+
    "ac.Origen,vmc.Importe,"+
    "round(vmc.Credito,0) as Credito,round(vmc.Debito,0) as Debito,"+
    "round(vmc.CreditoME,2) as CreditoME,round(vmc.DebitoME,2) as DebitoME,"+
    "vmc.CodPlanAux "+
    "from dba.Asientosdet vmc "+
    "join dba.Asientoscab ac on ac.Cod_empresa = vmc.Cod_empresa and ac.Nrotransac = vmc.Nrotransac and ac.Periodo = vmc.Periodo "+
    "join dba.PlanCta pa on pa.Cod_empresa = vmc.Cod_empresa and pa.Periodo = vmc.Periodo and pa.CodPlanCta = vmc.CodPlanCta "+
    "where vmc.Cod_empresa = '"+params.empresa+"' "+
    "and vmc.Periodo = '"+params.periodo+"' "+
    "and ac.Fecha >= '"+params.fechad+" 00:00:00' and ac.Fecha < "+plusOneDayExpr(params.fechah+" 00:00:00")+" "+
    "and vmc.Codplancta = '"+params.cuenta+"' "+
    "and exists (select 1 from dba.TipoAsiento ta where ta.TipoAsiento = ac.TipoAsiento and ta.TpDef not in ('N')) "
    if (params.tipoasiento !== 'NINGUNO')
        string1+="AND ac.TipoAsiento = '"+params.tipoasiento+"' "
    // Orden alineado al reporte PB: fecha, nrotransac y linea
    string1+="order by Fecha,ac.Nrotransac,vmc.Linea"
    conn.exec(string1, function(err, row){
        if (err) {
            console.error('[Mayor.cuentasdetalle] error detalle:', err.message || err);
            return cb([{ dato1 : [] },{ dato2 : [] }]);
        }
        data1 = row
        var string2 = "select vmc.CodPlanCta,pa.TipoSaldo,round(sum(vmc.Credito),0) as Credito,"+
        "round(sum(vmc.Debito),0) as Debito,round(sum(vmc.CreditoME),2) as CreditoME,"+
        "round(sum(vmc.DebitoME),2) as DebitoME from "+
        "dba.Asientosdet vmc "+
        "join dba.Asientoscab ac on ac.Cod_empresa = vmc.Cod_empresa and ac.Nrotransac = vmc.Nrotransac and ac.Periodo = vmc.Periodo "+
        "join dba.PlanCta pa on pa.Cod_empresa = vmc.Cod_empresa and pa.Periodo = vmc.Periodo and pa.CodPlanCta = vmc.CodPlanCta "+
        "where vmc.Cod_empresa = '"+params.empresa+"' and vmc.Periodo = '"+params.periodo+"' "+
        "and ac.Fecha < '"+params.fechad+" 00:00:00' and vmc.Codplancta = '"+params.cuenta+"' "+
        "and exists (select 1 from dba.TipoAsiento ta where ta.TipoAsiento = ac.TipoAsiento and ta.TpDef not in ('N')) "
        if (params.tipoasiento !== 'NINGUNO')
            string2+="AND ac.TipoAsiento = '"+params.tipoasiento+"' "
        string2+="group by vmc.CodPlanCta,pa.TipoSaldo "
        conn.exec(string2, function(err, row){
            if (err) {
                console.error('[Mayor.cuentasdetalle] error saldo anterior:', err.message || err);
                return cb([{ dato1 : data1 || [] },{ dato2 : [] }]);
            }
            data2 = row;
            cb([{ dato1 : data1 },{ dato2 : data2 }]);
        });
    });
};


Mayor.cuentasaux = function (params,cb) {
    params = params || {};
    params.tipoasiento = (!params.tipoasiento || params.tipoasiento === 'undefined') ? 'NINGUNO' : String(params.tipoasiento).trim();
    params.cuentad = (!params.cuentad || params.cuentad === 'undefined') ? '1' : String(params.cuentad).trim();
    params.cuentah = (!params.cuentah || params.cuentah === 'undefined') ? '9' : String(params.cuentah).trim();
    params.cuentaad = (!params.cuentaad || params.cuentaad === 'undefined') ? 'NINGUNA' : String(params.cuentaad).trim();
    params.cuentaah = (!params.cuentaah || params.cuentaah === 'undefined') ? 'NINGUNA' : String(params.cuentaah).trim();

    if (params.incluir == "NO"){
        var string ="SELECT DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre as Cuenta,DBA.PLANAUXI.CodPlanAux,DBA.PLANAUXI.Nombre as Auxiliar "+
                    "FROM DBA.PLANAUXI,DBA.PLANCTA,DBA.ASIENTOSCAB,DBA.ASIENTOSDET,DBA.TIPOASIENTO WHERE "+
                    "DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANAUXI.CodPlanAux = DBA.ASIENTOSDET.CodPlanAux "+
                    "and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta and DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSCAB.Periodo "+
                    "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta "+
                    "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSCAB.Periodo and DBA.PLANCTA.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa "+
                    "and DBA.PLANCTA.Periodo = DBA.PLANAUXI.Periodo and DBA.PLANCTA.CodPlanCta = DBA.PLANAUXI.CodPlanCta and DBA.ASIENTOSCAB.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa "+
                    "and DBA.ASIENTOSCAB.Periodo = DBA.ASIENTOSDET.Periodo and DBA.ASIENTOSCAB.NroTransac = DBA.ASIENTOSDET.NroTransac "+
                    "and DBA.ASIENTOSCAB.TipoAsiento = DBA.TIPOASIENTO.TipoAsiento and DBA.TIPOASIENTO.TpDef not in( 'N') "+
                    "and DBA.PLANAUXI.PERIODO = '"+params.periodo+"' and DBA.PLANAUXI.Imputable = 'S' and DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"' "+
                    "and DBA.PLANAUXI.CodPlanCta >= '"+params.cuentad+"' and DBA.PLANAUXI.CodPlanCta <= '"+params.cuentah+"' ";
                    if (params.cuentaad != 'NINGUNA' && params.cuentaah != 'NINGUNA')
                        string+="and DBA.PLANAUXI.CodPlanAux >= '"+params.cuentaad+"' and DBA.PLANAUXI.CodPlanAux <= '"+params.cuentaah+"' "; 
                    string+="and DBA.ASIENTOSCAB.Fecha BETWEEN '"+params.fechad+"' and '"+params.fechah+"' ";
                    if (params.tipoasiento !== 'NINGUNO')
                        string+="AND dba.ASIENTOSCAB.TipoAsiento = '"+params.tipoasiento+"' ";
                    string+="GROUP BY DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre,DBA.PLANAUXI.CodPlanAux,DBA.PLANAUXI.Nombre ORDER BY DBA.PLANAUXI.CodPlanCta,DBA.PLANAUXI.CodPlanAux";
        console.log(string)
        conn.exec(string, function(err, row){
            if (err) {
                console.error('[Mayor.cuentasaux] error data1:', err.message || err);
                return cb([{ data1 : [] },{ data2 : [] }]);
            }
            data1 = normalizeAuxRows(row)
            var string1 = "SELECT DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre as Cuenta "+
                            "FROM DBA.PLANAUXI,DBA.PLANCTA,DBA.ASIENTOSCAB,DBA.ASIENTOSDET,DBA.TIPOASIENTO WHERE "+
                            "DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANAUXI.CodPlanAux = DBA.ASIENTOSDET.CodPlanAux "+
                            "and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta and DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSCAB.Periodo "+
                            "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta "+
                            "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSCAB.Periodo and DBA.PLANCTA.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa "+
                            "and DBA.PLANCTA.Periodo = DBA.PLANAUXI.Periodo and DBA.PLANCTA.CodPlanCta = DBA.PLANAUXI.CodPlanCta and DBA.ASIENTOSCAB.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa "+
                            "and DBA.ASIENTOSCAB.Periodo = DBA.ASIENTOSDET.Periodo and DBA.ASIENTOSCAB.NroTransac = DBA.ASIENTOSDET.NroTransac "+
                            "and DBA.ASIENTOSCAB.TipoAsiento = DBA.TIPOASIENTO.TipoAsiento and DBA.TIPOASIENTO.TpDef not in( 'N') "+
                            "and DBA.PLANAUXI.PERIODO = '"+params.periodo+"' and DBA.PLANAUXI.Imputable = 'S' and DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"' "+
                            "and DBA.PLANAUXI.CodPlanCta >= '"+params.cuentad+"' and DBA.PLANAUXI.CodPlanCta <= '"+params.cuentah+"' ";
                            if (params.cuentaad != 'NINGUNA' && params.cuentaah != 'NINGUNA')
                                string1+="and DBA.PLANAUXI.CodPlanAux >= '"+params.cuentaad+"' and DBA.PLANAUXI.CodPlanAux <= '"+params.cuentaah+"' "; 
                            string1+="and DBA.ASIENTOSCAB.Fecha BETWEEN '"+params.fechad+"' and '"+params.fechah+"' ";
                            if (params.tipoasiento !== 'NINGUNO')
                                string1+="AND dba.ASIENTOSCAB.TipoAsiento = '"+params.tipoasiento+"' ";
                            string1+="GROUP BY DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre ORDER BY DBA.PLANAUXI.CodPlanCta";
            console.log(string1)
            conn.exec(string1, function(err, row){
                if (err) {
                    console.error('[Mayor.cuentasaux] error data2:', err.message || err);
                    return cb([{ data1 : data1 || [] },{ data2 : [] }]);
                }
                data2 = normalizeAuxRows(row);
                cb([{ data1 : data1 },{ data2 : data2 }]);
            });
        });
    } else {
        var string ="SELECT DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre as Cuenta,DBA.PLANAUXI.CodPlanAux,DBA.PLANAUXI.Nombre as Auxiliar "+
                    "FROM DBA.PLANAUXI,DBA.PLANCTA,DBA.ASIENTOSCAB,DBA.ASIENTOSDET,DBA.TIPOASIENTO WHERE "+
                    "DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANAUXI.CodPlanAux = DBA.ASIENTOSDET.CodPlanAux "+
                    "and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta and DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSCAB.Periodo "+
                    "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta "+
                    "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSCAB.Periodo and DBA.PLANCTA.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa "+
                    "and DBA.PLANCTA.Periodo = DBA.PLANAUXI.Periodo and DBA.PLANCTA.CodPlanCta = DBA.PLANAUXI.CodPlanCta and DBA.ASIENTOSCAB.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa "+
                    "and DBA.ASIENTOSCAB.Periodo = DBA.ASIENTOSDET.Periodo and DBA.ASIENTOSCAB.NroTransac = DBA.ASIENTOSDET.NroTransac "+
                    "and DBA.ASIENTOSCAB.TipoAsiento = DBA.TIPOASIENTO.TipoAsiento and DBA.TIPOASIENTO.TpDef not in( 'N') "+
                    "and DBA.PLANAUXI.PERIODO = '"+params.periodo+"' and DBA.PLANAUXI.Imputable = 'S' and DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"' "+
                    "and DBA.PLANAUXI.CodPlanCta >= '"+params.cuentad+"' and DBA.PLANAUXI.CodPlanCta <= '"+params.cuentah+"' ";
                    if (params.cuentaad != 'NINGUNA' && params.cuentaah != 'NINGUNA')
                        string+="and DBA.PLANAUXI.CodPlanAux >= '"+params.cuentaad+"' and DBA.PLANAUXI.CodPlanAux <= '"+params.cuentaah+"' "; 
                    string+="and DBA.ASIENTOSCAB.Fecha BETWEEN '"+params.fechad+"' and '"+params.fechah+"' ";
                    if (params.tipoasiento !== 'NINGUNO')
                        string+="AND dba.ASIENTOSCAB.TipoAsiento = '"+params.tipoasiento+"' ";
                    //string+="GROUP BY DBA.PLANAUXI.CodPlanCta,Cuenta,DBA.PLANAUXI.CodPlanAux,Auxiliar ORDER BY DBA.PLANAUXI.CodPlanCta,DBA.PLANAUXI.CodPlanAux";
                    string+="union SELECT DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre as Cuenta,DBA.PLANAUXI.CodPlanAux,DBA.PLANAUXI.Nombre as Auxiliar "+
                            "FROM DBA.PLANAUXI,DBA.PLANCTA WHERE DBA.PLANCTA.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.PLANAUXI.Periodo "+
                            "and DBA.PLANCTA.CodPlanCta = DBA.PLANAUXI.CodPlanCta and DBA.PLANAUXI.PERIODO = '"+params.periodo+"' and DBA.PLANAUXI.Imputable = 'S' "+
                            "and DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"' and DBA.PLANAUXI.CodPlanCta >= '"+params.cuentad+"' and DBA.PLANAUXI.CodPlanCta <= '"+params.cuentah+"' ";
                    if (params.cuentaad != 'NINGUNA' && params.cuentaah != 'NINGUNA')
                        string+="and DBA.PLANAUXI.CodPlanAux >= '"+params.cuentaad+"' and DBA.PLANAUXI.CodPlanAux <= '"+params.cuentaah+"' "; 
                    string+="GROUP BY DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre,DBA.PLANAUXI.CodPlanAux,DBA.PLANAUXI.Nombre ORDER BY DBA.PLANAUXI.CodPlanCta,DBA.PLANAUXI.CodPlanAux";
        console.log(string)
        conn.exec(string, function(err, row){
            if (err) {
                console.error('[Mayor.cuentasaux] error data1 union:', err.message || err);
                return cb([{ data1 : [] },{ data2 : [] }]);
            }
            data1 = normalizeAuxRows(row)
            var string1 = "SELECT DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre as Cuenta "+
                            "FROM DBA.PLANAUXI,DBA.PLANCTA,DBA.ASIENTOSCAB,DBA.ASIENTOSDET,DBA.TIPOASIENTO WHERE "+
                            "DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANAUXI.CodPlanAux = DBA.ASIENTOSDET.CodPlanAux "+
                            "and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta and DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSCAB.Periodo "+
                            "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta "+
                            "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSCAB.Periodo and DBA.PLANCTA.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa "+
                            "and DBA.PLANCTA.Periodo = DBA.PLANAUXI.Periodo and DBA.PLANCTA.CodPlanCta = DBA.PLANAUXI.CodPlanCta and DBA.ASIENTOSCAB.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa "+
                            "and DBA.ASIENTOSCAB.Periodo = DBA.ASIENTOSDET.Periodo and DBA.ASIENTOSCAB.NroTransac = DBA.ASIENTOSDET.NroTransac "+
                            "and DBA.ASIENTOSCAB.TipoAsiento = DBA.TIPOASIENTO.TipoAsiento and DBA.TIPOASIENTO.TpDef not in( 'N') "+
                            "and DBA.PLANAUXI.PERIODO = '"+params.periodo+"' and DBA.PLANAUXI.Imputable = 'S' and DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"' "+
                            "and DBA.PLANAUXI.CodPlanCta >= '"+params.cuentad+"' and DBA.PLANAUXI.CodPlanCta <= '"+params.cuentah+"' ";
                            if (params.cuentaad != 'NINGUNA' && params.cuentaah != 'NINGUNA')
                                string1+="and DBA.PLANAUXI.CodPlanAux >= '"+params.cuentaad+"' and DBA.PLANAUXI.CodPlanAux <= '"+params.cuentaah+"' "; 
                            string1+="and DBA.ASIENTOSCAB.Fecha BETWEEN '"+params.fechad+"' and '"+params.fechah+"' ";
                            if (params.tipoasiento !== 'NINGUNO')
                                string1+="AND dba.ASIENTOSCAB.TipoAsiento = '"+params.tipoasiento+"' ";
                            //string1+="GROUP BY DBA.PLANAUXI.CodPlanCta,Cuenta ORDER BY DBA.PLANAUXI.CodPlanCta";
                            string1+="union SELECT DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre as Cuenta "+
                                    "FROM DBA.PLANAUXI,DBA.PLANCTA WHERE DBA.PLANCTA.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.PLANAUXI.Periodo "+
                                    "and DBA.PLANCTA.CodPlanCta = DBA.PLANAUXI.CodPlanCta and DBA.PLANAUXI.PERIODO = '"+params.periodo+"' and DBA.PLANAUXI.Imputable = 'S' "+
                                    "and DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"' and DBA.PLANAUXI.CodPlanCta >= '"+params.cuentad+"' and DBA.PLANAUXI.CodPlanCta <= '"+params.cuentah+"' ";
                            if (params.cuentaad != 'NINGUNA' && params.cuentaah != 'NINGUNA')
                                string1+="and DBA.PLANAUXI.CodPlanAux >= '"+params.cuentaad+"' and DBA.PLANAUXI.CodPlanAux <= '"+params.cuentaah+"' "; 
                            string1+="GROUP BY DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre ORDER BY DBA.PLANAUXI.CodPlanCta";
            console.log(string1)
            conn.exec(string1, function(err, row){
                if (err) {
                    console.error('[Mayor.cuentasaux] error data2 union:', err.message || err);
                    return cb([{ data1 : data1 || [] },{ data2 : [] }]);
                }
                data2 = normalizeAuxRows(row);
                cb([{ data1 : data1 },{ data2 : data2 }]);
            });
        });
    }
};

Mayor.cuentasdetalleaux = function (params,cb) {
    params = params || {};
    params.tipoasiento = (!params.tipoasiento || params.tipoasiento === 'undefined') ? 'NINGUNO' : String(params.tipoasiento).trim();
    var string = "SELECT DBA.ASIENTOSCAB.Cod_Empresa,DBA.ASIENTOSCAB.NroCompr,DBA.ASIENTOSCAB.NroTransac,DBA.PLANAUXI.CodPlanAux,"+
                 "DBA.PLANAUXI.Nombre as Auxiliar,DBA.PLANCTA.TipoSaldo,DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre as Cuenta,"+
                 "date(DBA.ASIENTOSCAB.Fecha) as Fecha,YEAR(dba.Asientoscab.Fecha) as ANHO,MONTH(dba.Asientoscab.Fecha) as MES,"+
                 "DBA.Asientoscab.Codmoneda,DBA.Asientoscab.Tipoasiento,DBA.TipoAsiento.Abreviatura,DBA.Asientosdet.Linea,"+
                 "DBA.Asientosdet.Concepto,DBA.Asientosdet.Dbcr,DBA.Asientoscab.Origen,DBA.Asientosdet.Importe,"+
                 "cast(dba.Asientosdet.Credito as decimal(20,0)) as Credito,cast(dba.Asientosdet.Debito as decimal(20,0)) as Debito,"+
                 "cast(dba.Asientosdet.CreditoME as decimal(20,2)) as CreditoME,cast(dba.Asientosdet.DebitoME as decimal(20,2)) as DebitoME "+    
                 "FROM DBA.PLANAUXI,DBA.PLANCTA,DBA.ASIENTOSCAB,DBA.ASIENTOSDET,DBA.TIPOASIENTO WHERE "+ 
                 "DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSDET.Periodo "+ 
                 "and DBA.PLANAUXI.CodPlanAux = DBA.ASIENTOSDET.CodPlanAux and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta "+ 
                 "and DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSCAB.Periodo "+
                 "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSDET.Periodo "+ 
                 "and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa "+ 
                 "and DBA.PLANCTA.Periodo = DBA.ASIENTOSCAB.Periodo and DBA.PLANCTA.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa "+
                 "and DBA.PLANCTA.Periodo = DBA.PLANAUXI.Periodo and DBA.PLANCTA.CodPlanCta = DBA.PLANAUXI.CodPlanCta "+
                 "and DBA.ASIENTOSCAB.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.ASIENTOSCAB.Periodo = DBA.ASIENTOSDET.Periodo "+ 
                 "and DBA.ASIENTOSCAB.NroTransac = DBA.ASIENTOSDET.NroTransac and DBA.ASIENTOSCAB.TipoAsiento = DBA.TIPOASIENTO.TipoAsiento "+ 
                 "and DBA.TIPOASIENTO.TpDef not in( 'N') ";
                 if (params.tipoasiento !== 'NINGUNO')
                    string+="AND dba.ASIENTOSCAB.TipoAsiento = '"+params.tipoasiento+"' ";
                 string+="and DBA.PLANAUXI.PERIODO = '"+params.periodo+"' and DBA.PLANAUXI.Imputable = 'S' and DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"' "+
                 "and DBA.PLANAUXI.CodPlanAux = '"+params.cuenta+"' and DBA.PLANAUXI.CodPlanCta = '"+params.path+"' and DBA.ASIENTOSCAB.Fecha BETWEEN '"+params.fechad+"' and '"+params.fechah+"' "+
                 "ORDER BY DBA.PLANAUXI.CodPlanAux ";
    console.log(string)
    conn.exec(string, function(err, row){
        if (err) {
            console.error('[Mayor.cuentasdetalleaux] error detalle:', err.message || err);
            return cb([{ dato1 : [] },{ dato2 : [] }]);
        }
        data1 = normalizeDetalleAuxRows(row)
        var string1 = "SELECT DBA.PLANAUXI.CodPlanAux,DBA.PLANCTA.TipoSaldo,cast(sum(dba.Asientosdet.Credito) as decimal(20,0)) as Credito,"+
                      "cast(sum(dba.Asientosdet.Debito) as decimal(20,0)) as Debito,cast(sum(dba.Asientosdet.CreditoME) as decimal(20,2)) as CreditoME,"+
                      "cast(sum(dba.Asientosdet.DebitoME) as decimal(20,2)) as DebitoME FROM DBA.PLANAUXI,DBA.PLANCTA,DBA.ASIENTOSCAB,DBA.ASIENTOSDET,DBA.TIPOASIENTO "+ 
                      "WHERE DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANAUXI.CodPlanAux = DBA.ASIENTOSDET.CodPlanAux "+ 
                      "and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta and DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSCAB.Periodo "+ 
                      "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta "+ 
                      "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSCAB.Periodo and DBA.PLANCTA.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa "+ 
                      "and DBA.PLANCTA.Periodo = DBA.PLANAUXI.Periodo and DBA.PLANCTA.CodPlanCta = DBA.PLANAUXI.CodPlanCta and DBA.ASIENTOSCAB.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa "+ 
                      "and DBA.ASIENTOSCAB.Periodo = DBA.ASIENTOSDET.Periodo and DBA.ASIENTOSCAB.NroTransac = DBA.ASIENTOSDET.NroTransac and DBA.ASIENTOSCAB.TipoAsiento = DBA.TIPOASIENTO.TipoAsiento "+ 
                      "and DBA.TIPOASIENTO.TpDef not in( 'N') ";
                      if (params.tipoasiento !== 'NINGUNO')
                          string1+="AND dba.ASIENTOSCAB.TipoAsiento = '"+params.tipoasiento+"' ";
                      string1+="and DBA.PLANAUXI.PERIODO = '"+params.periodo+"' and DBA.PLANAUXI.Imputable = 'S' and DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"' and DBA.PLANAUXI.CodPlanAux = '"+params.cuenta+"' and DBA.PLANAUXI.CodPlanCta = '"+params.path+"' "+ 
                               "and DBA.ASIENTOSCAB.Fecha < '"+params.fechad+" 00:00:00' GROUP BY DBA.PLANAUXI.CodPlanAux,DBA.PLANCTA.TipoSaldo ORDER BY DBA.PLANAUXI.CodPlanAux";
        console.log(string1)
        conn.exec(string1, function(err, row){
            if (err) {
                console.error('[Mayor.cuentasdetalleaux] error saldo anterior:', err.message || err);
                return cb([{ dato1 : data1 || [] },{ dato2 : [] }]);
            }
            data2 = normalizeSaldoAuxRows(row);
            cb([{ dato1 : data1 },{ dato2 : data2 }]);
        });
    });

};

module.exports = Mayor;
