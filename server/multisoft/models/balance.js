var conn = require('../db_integrado');

var Balance = {};

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

function execRows(sql, cb) {
    conn.exec(sql, function (err, rows) {
        if (err) return cb(err);
        cb(null, rows || []);
    });
}

function tableExists(tableName, cb) {
    var probe = dbIsPostgres()
        ? ("SELECT 1 AS ok FROM " + tableName + " LIMIT 1")
        : ("SELECT TOP 1 1 AS ok FROM " + tableName);
    conn.exec(probe, function (err) {
        if (!err) return cb(null, true);
        var code = (err && (err.code || err.Code));
        var msg = String((err && (err.message || err.Msg || err.sqlMessage)) || err || '').toLowerCase();
        if (code === -141 || (msg.indexOf("table") >= 0 && msg.indexOf("not found") >= 0)) {
            return cb(null, false);
        }
        if (msg.indexOf('does not exist') >= 0 || msg.indexOf('no existe la relación') >= 0 || msg.indexOf('undefined table') >= 0) {
            return cb(null, false);
        }
        cb(err);
    });
}

function resolvePucTable(cb) {
    var list = dbIsPostgres()
        ? ['DBA.planctaestrategico', 'DBA.planctaunico']
        : ['DBA.planctaunico', 'DBA.planctaestrategico'];
    var i = 0;
    (function next() {
        if (i >= list.length) return cb(null, null);
        var t = list[i++];
        tableExists(t, function (err, ok) {
            if (err) return cb(err);
            if (ok) return cb(null, t);
            next();
        });
    })();
}

function getSchemaWarning(err, contextLabel) {
    if (!err) return '';
    var code = (err && (err.code || err.Code));
    var msg = String((err && (err.message || err.Msg || err.sqlMessage)) || err || '');
    var tableOrColumn = '';
    var m1 = msg.match(/Table\s+'([^']+)'/i);
    if (m1 && m1[1]) tableOrColumn = m1[1];
    var m2 = msg.match(/Column\s+'([^']+)'/i);
    if (m2 && m2[1]) tableOrColumn = m2[1];

    if (code === -141) {
        return "No existe la tabla requerida (" + (tableOrColumn || 'tabla no identificada') + ") para " + contextLabel + ".";
    }
    if (code === -143) {
        return "No existe la columna requerida (" + (tableOrColumn || 'columna no identificada') + ") para " + contextLabel + ".";
    }
    return "No se pudo generar " + contextLabel + ". " + msg;
}

function toNumber(value) {
    var n = parseFloat(value);
    return isNaN(n) ? 0 : n;
}

function formatLike(sample, value) {
    var s = (sample === null || typeof sample === 'undefined') ? '' : String(sample);
    if (s.indexOf('.') >= 0) return value.toFixed(2);
    return String(Math.round(value));
}

function hasDecimals(v) {
    return String(v === null || typeof v === 'undefined' ? '' : v).indexOf('.') >= 0;
}

function toBigIntSafe(v) {
    var s = String(v === null || typeof v === 'undefined' ? '0' : v).trim();
    if (!s) s = '0';
    if (s.indexOf('.') >= 0) s = s.split('.')[0];
    if (s === '' || s === '-') s = '0';
    if (s[0] === '+') s = s.slice(1);
    return BigInt(s);
}

function addNumericStrings(a, b) {
    if (hasDecimals(a) || hasDecimals(b)) {
        return String(toNumber(a) + toNumber(b));
    }
    return (toBigIntSafe(a) + toBigIntSafe(b)).toString();
}

function subNumericStrings(a, b) {
    if (hasDecimals(a) || hasDecimals(b)) {
        return String(toNumber(a) - toNumber(b));
    }
    return (toBigIntSafe(a) - toBigIntSafe(b)).toString();
}

function rollupPucToParents(rows) {
    if (!rows || !rows.length) return rows || [];
    var byCode = {};
    rows.forEach(function (r) {
        byCode[(r.CodPlanCta || '').toString().trim()] = r;
    });

    rows.slice().sort(function (a, b) {
        return toNumber(b.Nivel) - toNumber(a.Nivel);
    }).forEach(function (child) {
        var parentCode = (child.CodPlanCtaPad || '').toString().trim();
        if (!parentCode || !byCode[parentCode]) return;
        var parent = byCode[parentCode];

        var nDeb = addNumericStrings(parent.TOTAL_DEBITO, child.TOTAL_DEBITO);
        var nCre = addNumericStrings(parent.TOTAL_CREDITO, child.TOTAL_CREDITO);

        parent.TOTAL_DEBITO = nDeb;
        parent.TOTAL_CREDITO = nCre;

        var saldo = ((parent.TipoSaldo || '').toString().toUpperCase() === 'D')
            ? subNumericStrings(nDeb, nCre)
            : subNumericStrings(nCre, nDeb);
        parent.SALDO = saldo;
    });
    return rows;
}

function normalizeConditionList(raw, fieldName) {
    var txt = (raw || '').toString().trim();
    if (!txt) return '';
    if (txt.indexOf('DBA.AcumPlan.CodPlanCta') >= 0 || txt.indexOf('AcumPlan.CodPlanCta') >= 0) {
        return txt;
    }
    var tokens = txt.split(/[\s,;]+/).map(function (v) { return v.trim(); }).filter(Boolean);
    if (!tokens.length) return '';
    var inList = tokens.map(function (v) { return "'" + v.replace(/'/g, "''") + "'"; }).join(',');
    return fieldName + " IN (" + inList + ")";
}

function getResultadoEjercicioNew(params, cb) {
    var sqlControl = "SELECT dba.control.ctasingreso, dba.control.ctasegreso " +
        "FROM dba.control " +
        "WHERE cod_empresa = '" + params.empresa + "' AND periodo = '" + params.periodo + "'";
    execRows(sqlControl, function (err, rows) {
        if (err) return cb(err);
        if (!rows.length) return cb(null, { mTotalIngreso: 0, mTotalEgreso: 0, mTotalIngresoME: 0, mTotalEgresoME: 0 });

        var ctasIngreso = normalizeConditionList(rows[0].ctasingreso || rows[0].CtaSIngreso, "DBA.AcumPlan.CodPlanCta");
        var ctasEgreso = normalizeConditionList(rows[0].ctasegreso || rows[0].CtaSEgreso, "DBA.AcumPlan.CodPlanCta");
        var anhoMesIni = parseInt(String(params.periodo) + String(params.mesd), 10);
        var anhoMesFin = parseInt(String(params.periodo) + String(params.mesh), 10);

        var baseSql = "SELECT SUM(DBA.AcumPlan.TotalDb) as TotalDb, SUM(DBA.AcumPlan.TotalCr) as TotalCr, " +
            "SUM(DBA.AcumPlan.TotalDbME) as TotalDbME, SUM(DBA.AcumPlan.TotalCrME) as TotalCrME " +
            "FROM DBA.ACUMPLAN " +
            "WHERE DBA.AcumPlan.Cod_Empresa = '" + params.empresa + "' " +
            "AND DBA.AcumPlan.Periodo = '" + params.periodo + "' " +
            "AND DBA.AcumPlan.AnhoMes >= '" + anhoMesIni + "' " +
            "AND DBA.AcumPlan.AnhoMes <= '" + anhoMesFin + "' ";

        var sqlIngresos = baseSql + (ctasIngreso ? (" AND (" + ctasIngreso + ") ") : "");
        var sqlEgresos = baseSql + (ctasEgreso ? (" AND (" + ctasEgreso + ") ") : "");

        execRows(sqlIngresos, function (e1, ri) {
            if (e1) return cb(e1);
            execRows(sqlEgresos, function (e2, re) {
                if (e2) return cb(e2);

                var iRow = (ri && ri.length) ? ri[0] : {};
                var eRow = (re && re.length) ? re[0] : {};

                var mINGDebito = toNumber(iRow.TotalDb);
                var mINGCredito = toNumber(iRow.TotalCr);
                var mINGDebitoME = toNumber(iRow.TotalDbME);
                var mINGCreditoME = toNumber(iRow.TotalCrME);

                var mEGRDebito = toNumber(eRow.TotalDb);
                var mEGRCredito = toNumber(eRow.TotalCr);
                var mEGRDebitoME = toNumber(eRow.TotalDbME);
                var mEGRCreditoME = toNumber(eRow.TotalCrME);

                cb(null, {
                    mTotalIngreso: mINGCredito - mINGDebito,
                    mTotalEgreso: mEGRDebito - mEGRCredito,
                    mTotalIngresoME: mINGCreditoME - mINGDebitoME,
                    mTotalEgresoME: mEGRDebitoME - mEGRCreditoME
                });
            });
        });
    });
}

function updResultadoEjercicio(params, mResultado, mResultadoME, cb) {
    var sqlControl = "SELECT CtaResultEjer, MonedaLocal " +
        "FROM DBA.Control " +
        "WHERE Cod_Empresa = '" + params.empresa + "' AND Periodo = '" + params.periodo + "'";
    execRows(sqlControl, function (err, rows) {
        if (err) return cb(err);
        if (!rows.length) return cb(null);

        var ctaResultado = rows[0].CtaResultEjer || rows[0].ctaresultejer;
        if (!ctaResultado) return cb(null);

        var anhoProc = parseInt(params.periodo, 10);
        var mesProc = parseInt(params.mesh, 10);

        var sqlReset = "UPDATE DBA.AcumPlan " +
            "SET TotalDB = 0, TotalCR = 0, TotalDBME = 0, TotalCRME = 0 " +
            "WHERE Cod_Empresa = '" + params.empresa + "' " +
            "AND Periodo = '" + params.periodo + "' " +
            "AND CodPlanCta = '" + ctaResultado + "' " +
            "AND Anho = " + anhoProc + " " +
            "AND Mes <= " + mesProc;
        var sqlBlockingTimeout = "SET TEMPORARY OPTION blocking_timeout = '5000'";
        conn.exec(sqlBlockingTimeout, function () {
            conn.exec("BEGIN TRANSACTION", function (beginErr) {
                if (beginErr) return cb(beginErr);
                conn.exec(sqlReset, function (e1) {
                    if (e1) {
                        conn.exec("ROLLBACK", function () { cb(e1); });
                        return;
                    }

                    var sqlCount = "SELECT COUNT(*) as CANT " +
                        "FROM DBA.AcumPlan " +
                        "WHERE Cod_Empresa = '" + params.empresa + "' " +
                        "AND Periodo = '" + params.periodo + "' " +
                        "AND CodPlanCta = '" + ctaResultado + "' " +
                        "AND Anho = " + anhoProc + " " +
                        "AND Mes = " + mesProc;

                    execRows(sqlCount, function (e2, rc) {
                        if (e2) {
                            conn.exec("ROLLBACK", function () { cb(e2); });
                            return;
                        }
                        var cant = toNumber((rc[0] && (rc[0].CANT || rc[0]['COUNT(*)'])) || 0);
                        var totalDB = 0;
                        var totalCR = toNumber(mResultado);
                        var totalDBME = 0;
                        var totalCRME = toNumber(mResultadoME);

                        var sqlUpsert = '';
                        if (cant <= 0) {
                            sqlUpsert = "INSERT INTO dba.acumplan (cod_empresa, periodo, codplancta, anho, mes, totaldb, totalcr, totaldbme, totalcrme) VALUES (" +
                                "'" + params.empresa + "', '" + params.periodo + "', '" + ctaResultado + "', " + anhoProc + ", " + mesProc + ", " +
                                totalDB + ", " + totalCR + ", " + totalDBME + ", " + totalCRME + ")";
                        } else {
                            sqlUpsert = "UPDATE DBA.AcumPlan " +
                                "SET TotalDB = " + totalDB + ", TotalCR = " + totalCR + ", TotalDBME = " + totalDBME + ", TotalCRME = " + totalCRME + " " +
                                "WHERE Cod_Empresa = '" + params.empresa + "' " +
                                "AND Periodo = '" + params.periodo + "' " +
                                "AND CodPlanCta = '" + ctaResultado + "' " +
                                "AND Anho = " + anhoProc + " " +
                                "AND Mes = " + mesProc;
                        }

                        conn.exec(sqlUpsert, function (e3) {
                            if (e3) {
                                conn.exec("ROLLBACK", function () {
                                    cb(e3);
                                });
                                return;
                            }
                            conn.exec("COMMIT", function (e4) {
                                if (e4) return cb(e4);
                                cb(null);
                            });
                        });
                    });
                });
            });
        });
    });
}

Balance.general = function (params,cb) {
    var string="";
    var isPg = dbIsPostgres();
    var ctaExpr = isPg
        ? "(cast(DBA.PLANCTA.CodPlanCta as varchar) || '-' || cast(DBA.PLANAUXI.CodPlanAux as varchar))"
        : "DBA.PLANCTA.CodPlanCta + '-' + DBA.PLANAUXI.CodPlanAux";
    var anhoMesDesde = parseInt(params.periodo.toString() + params.mesd.toString(), 10);
    var anhoMesHasta = parseInt(params.periodo.toString() + params.mesh.toString(), 10);
    var anhoMesPlanExpr = "cast(coalesce(DBA.AcumPlan.AnhoMes, '0') as integer)";
    var anhoMesAuxExpr = "cast(coalesce(DBA.AcumAuxi.AnhoMes, '0') as integer)";
    var havingExprPlan = (params.moneda == 'local')
        ? "(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) ELSE cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) END)"
        : "(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) - cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) ELSE cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) - cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) END)";
    var havingExprAux = (params.moneda == 'local')
        ? "(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(sum(DBA.AcumAuxi.TotalDb)as decimal(20,0)) - cast(sum(DBA.AcumAuxi.TotalCr)as decimal(20,0)) ELSE cast(sum(DBA.AcumAuxi.TotalCr)as decimal(20,0)) - cast(sum(DBA.AcumAuxi.TotalDb)as decimal(20,0)) END)"
        : "(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(sum(DBA.AcumAuxi.TotalDbME)as decimal(20,2)) - cast(sum(DBA.AcumAuxi.TotalCrME)as decimal(20,2)) ELSE cast(sum(DBA.AcumAuxi.TotalCrME)as decimal(20,2)) - cast(sum(DBA.AcumAuxi.TotalDbME)as decimal(20,2)) END)";
    if (params.aux == 'NO'){
        string = "SELECT DBA.PLANCTA.Cod_Empresa,DBA.PLANCTA.CodPlanCta,DBA.PLANCTA.Nombre,DBA.PLANCTA.Nivel,DBA.PLANCTA.Imputable,DBA.PLANCTA.TipoSaldo,DBA.Control.CTCtaOrden,"
        if (params.moneda == 'local'){
            string+="cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) as TOTAL_DEBITO,cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) as TOTAL_CREDITO,"+
                    "(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) "+
                    "ELSE cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) "+
                    "END) as SALDO "
        } else {
            string+="cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) as TOTAL_DEBITO,cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) as TOTAL_CREDITO,"+
                    "(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) - cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) "+
                    "ELSE cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) - cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) "+
                    "END) as SALDO "
        }
        string+="FROM DBA.CONTROL,DBA.PLANCTA,DBA.ACUMPLAN WHERE "+
                    "(DBA.Control.Cod_Empresa = DBA.PLANCTA.Cod_Empresa) AND (DBA.Control.Periodo = DBA.PLANCTA.Periodo) AND "+
                    "(DBA.PLANCTA.Cod_Empresa = DBA.AcumPlan.Cod_Empresa) AND (DBA.PLANCTA.Periodo = DBA.AcumPlan.Periodo) AND "+
                    "(DBA.PLANCTA.CodPlanCta = DBA.AcumPlan.CodPlanCta) AND (DBA.PLANCTA.Cod_Empresa = '"+params.empresa+"') "+
                    "AND (DBA.PLANCTA.Periodo = '"+params.periodo+"') AND (DBA.PLANCTA.CodPlanCta >= '"+params.cuentad+"') "+
                    "AND (DBA.PLANCTA.CodPlanCta <= '"+params.cuentah+"') "
        if (params.nivel > 0)
            string+="AND (DBA.PLANCTA.Nivel <= "+params.nivel+") "
        string+="AND ("+anhoMesPlanExpr+" >= "+anhoMesDesde+") AND ("+anhoMesPlanExpr+" <= "+anhoMesHasta+") "
        string+="GROUP BY DBA.PLANCTA.Cod_Empresa,DBA.PLANCTA.CodPlanCta,DBA.PLANCTA.Nombre,DBA.PLANCTA.Nivel,DBA.PLANCTA.Imputable,DBA.PLANCTA.TipoSaldo,DBA.CONTROL.CtCtaOrden "
        if (params.saldo == 'SI'){
            //string+="having SALDO >= 0 "
        } else {
            string+="having " + havingExprPlan + " <> 0 "
        }
        string+="ORDER BY DBA.PLANCTA.CodPlanCta"
    } else {
        string = "SELECT DBA.PLANCTA.Cod_Empresa,DBA.PLANCTA.CodPlanCta,DBA.PLANCTA.Nombre,DBA.PLANCTA.Nivel,DBA.PLANCTA.Imputable,DBA.PLANCTA.TipoSaldo,DBA.Control.CTCtaOrden,"
        if (params.moneda == 'local'){
            string+="cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) as TOTAL_DEBITO,cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) as TOTAL_CREDITO,"+
                    "(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) "+
                    "ELSE cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) "+
                    "END) as SALDO "
        } else {
            string+="cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) as TOTAL_DEBITO,cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) as TOTAL_CREDITO,"+
                    "(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) - cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) "+
                    "ELSE cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) - cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) "+
                    "END) as SALDO "
        }
        string+="FROM DBA.CONTROL,DBA.PLANCTA,DBA.ACUMPLAN WHERE "+
                "(DBA.Control.Cod_Empresa = DBA.PLANCTA.Cod_Empresa) AND (DBA.Control.Periodo = DBA.PLANCTA.Periodo) AND "+
                "(DBA.PLANCTA.Cod_Empresa = DBA.AcumPlan.Cod_Empresa) AND (DBA.PLANCTA.Periodo = DBA.AcumPlan.Periodo) AND "+
                "(DBA.PLANCTA.CodPlanCta = DBA.AcumPlan.CodPlanCta) AND (DBA.PLANCTA.Cod_Empresa = '"+params.empresa+"') "+
                "AND (DBA.PLANCTA.Periodo = '"+params.periodo+"') AND (DBA.PLANCTA.CodPlanCta >= '"+params.cuentad+"') "+
                "AND (DBA.PLANCTA.CodPlanCta <= '"+params.cuentah+"') "
        if (params.nivel > 0)
                string+="AND (DBA.PLANCTA.Nivel <= "+params.nivel+") "
        string+="AND ("+anhoMesPlanExpr+" >= "+anhoMesDesde+") AND ("+anhoMesPlanExpr+" <= "+anhoMesHasta+") "
        string+="GROUP BY DBA.PLANCTA.Cod_Empresa,DBA.PLANCTA.CodPlanCta,DBA.PLANCTA.Nombre,DBA.PLANCTA.Nivel,DBA.PLANCTA.Imputable,DBA.PLANCTA.TipoSaldo,DBA.CONTROL.CtCtaOrden "
        if (params.saldo == 'SI'){
            //string+="having SALDO >= 0 "
        } else {
            string+="having " + havingExprPlan + " <> 0 "
        }
       string+="UNION SELECT DBA.PLANAUXI.Cod_Empresa,"+ctaExpr+" as CTA,DBA.PLANAUXI.Nombre,DBA.PLANAUXI.Nivel,DBA.PLANAUXI.Imputable,DBA.PLANCTA.TipoSaldo,DBA.Control.CTCtaOrden,"
        if (params.moneda == 'local'){
            string+="cast(sum(DBA.AcumAuxi.TotalDb)as decimal(20,0)) as TOTAL_DEBITO,cast(sum(DBA.AcumAuxi.TotalCr)as decimal(20,0)) as TOTAL_CREDITO,"+
                    "(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' then cast(sum(DBA.AcumAuxi.TotalDb)as decimal(20,0)) - cast(sum(DBA.AcumAuxi.TotalCr)as decimal(20,0)) "+
                    "ELSE cast(sum(DBA.AcumAuxi.TotalCr)as decimal(20,0)) - cast(sum(DBA.AcumAuxi.TotalDb)as decimal(20,0)) "+
                    "END) as SALDO "
        } else {
            string+="cast(sum(DBA.AcumAuxi.TotalDbME)as decimal(20,2)) as TOTAL_DEBITO,cast(sum(DBA.AcumAuxi.TotalCrME)as decimal(20,2)) as TOTAL_CREDITO,"+
                    "(CASE DBA.PLANCTA.TipoSaldo "+
                    "WHEN 'D' then cast(sum(DBA.AcumAuxi.TotalDbME)as decimal(20,2)) - cast(sum(DBA.AcumAuxi.TotalCrME)as decimal(20,2)) "+
                    "ELSE cast(sum(DBA.AcumAuxi.TotalCrME)as decimal(20,2)) - cast(sum(DBA.AcumAuxi.TotalDbME)as decimal(20,2)) "+
                    "END) as SALDO "
        }
        string+="FROM DBA.CONTROL,DBA.PLANAUXI,DBA.PLANCTA,DBA.AcumAuxi WHERE "+
            "(DBA.Control.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa) AND (DBA.Control.Periodo = DBA.PLANAUXI.Periodo) AND "+
            "(DBA.PLANAUXI.CodPlanCta = DBA.PLANCTA.CodPlanCta) AND (DBA.PLANAUXI.Cod_Empresa = DBA.AcumAuxi.Cod_Empresa) AND "+
            "(DBA.PLANAUXI.Periodo = DBA.AcumAuxi.Periodo) AND (DBA.PLANAUXI.CodPlanAux = DBA.AcumAuxi.CodPlanAux) AND "+
            "(DBA.PLANAUXI.CodPlanCta  = DBA.AcumAuxi.CodPlanCta) AND (DBA.plancta.imputable = 'N') "+
            "AND (DBA.plancta.Auxiliar = 'S') AND (DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"') "+
            "AND (DBA.PLANAUXI.Periodo = '"+params.periodo+"') AND (DBA.PLANCTA.CodPlanCta >= '"+params.cuentad+"') "+
            "AND (DBA.PLANCTA.CodPlanCta <= '"+params.cuentah+"') "
        if (params.nivel > 0)
            string+="AND (DBA.PLANCTA.Nivel <= "+params.nivel+") "
        string+="AND ("+anhoMesAuxExpr+" >= "+anhoMesDesde+") AND ("+anhoMesAuxExpr+" <= "+anhoMesHasta+") "
        string+="GROUP BY DBA.PLANAUXI.Cod_Empresa,"+ctaExpr+",DBA.PLANAUXI.Nombre,DBA.PLANAUXI.Nivel,DBA.PLANAUXI.Imputable,DBA.PLANCTA.TipoSaldo,DBA.Control.CTCtaOrden "
        if (params.saldo == 'SI'){
            //string+="having SALDO >= 0 "
        } else {
            string+="having " + havingExprAux + " <> 0 "
        }
        string+="ORDER BY 1, 2"
    }
    conn.exec(string, function(err, row){
        if (err) {
            console.error('[Balance.general] Error ejecutando consulta:', err.message || err);
            return cb({ rows: [], warning: getSchemaWarning(err, 'Balance General') });
        }
        cb({ rows: row || [], warning: '' });
    });
};

Balance.generalPuc = function (params, cb) {
    params = params || {};
    params.cuentad = String(params.cuentad || '1').trim();
    params.cuentah = String(params.cuentah || '9').trim();
    if (!params.cuentad) params.cuentad = '1';
    if (!params.cuentah) params.cuentah = '9';
    params.mesd = params.mesd || '01';
    params.mesh = params.mesh || params.mesd || '01';
    params.nivel = params.nivel || 0;
    params.recalcular_saldos = (params.recalcular_saldos || 'N').toString().toUpperCase();
    params.balance_cuentas_puc = (params.balance_cuentas_puc || 'NO').toString().toUpperCase();

    if (params.balance_cuentas_puc === 'SI') {
        runGeneralPucCuentasQuery(params, function (rows, warning) {
            attachResultadoEjercicio(params, rows, warning, cb);
        });
        return;
    }

    if (params.recalcular_saldos !== 'S') {
        runGeneralPucQuery(params, function (rows, warning) {
            attachResultadoEjercicio(params, rows, warning, cb);
        });
        return;
    }

    // Replica de lógica PowerBuilder: recalcular resultado del ejercicio antes del listado.
    getResultadoEjercicioNew(params, function (resErr, tot) {
        if (!resErr && tot) {
            var resultado = toNumber(tot.mTotalIngreso) - toNumber(tot.mTotalEgreso);
            var resultadoME = toNumber(tot.mTotalIngresoME) - toNumber(tot.mTotalEgresoME);
            updResultadoEjercicio(params, resultado, resultadoME, function (updErr) {
                if (updErr) {
                    console.warn('[Balance.generalPuc] No se pudo actualizar resultado ejercicio:', updErr.message || updErr);
                }
                runGeneralPucQuery(params, function (rows, warning) {
                    attachResultadoEjercicio(params, rows, warning, cb);
                });
            });
            return;
        }
        if (resErr) {
            console.warn('[Balance.generalPuc] No se pudo calcular resultado ejercicio:', resErr.message || resErr);
        }
        runGeneralPucQuery(params, function (rows, warning) {
            attachResultadoEjercicio(params, rows, warning, cb);
        });
    });
};

function attachResultadoEjercicio(params, rows, warning, cb) {
    getResultadoEjercicioNew(params, function (err, tot) {
        if (err || !tot) {
            return cb({
                rows: rows || [],
                resultado: { local: 0, extranjera: 0 },
                warning: warning || ''
            });
        }
        var resultado = toNumber(tot.mTotalIngreso) - toNumber(tot.mTotalEgreso);
        var resultadoME = toNumber(tot.mTotalIngresoME) - toNumber(tot.mTotalEgresoME);
        return cb({
            rows: rows || [],
            resultado: {
                local: resultado,
                extranjera: resultadoME
            },
            warning: warning || ''
        });
    });
}

function runGeneralPucCuentasQuery(params, cb) {
    var requestedNivel = parseInt(params.nivel, 10) || 0;
    var mesDesde = parseInt(params.mesd, 10) || 1;
    var mesHasta = parseInt(params.mesh, 10) || mesDesde;
    var anhoMesDiaDesde = parseInt(String(params.periodo) + (mesDesde < 10 ? ('0' + mesDesde) : String(mesDesde)) + '01', 10);
    var anhoMesDiaHasta = parseInt(String(params.periodo) + (mesHasta < 10 ? ('0' + mesHasta) : String(mesHasta)) + '31', 10);

    if (params.practicado_al) {
        var p = String(params.practicado_al).trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(p)) {
            anhoMesDiaHasta = parseInt(p.substring(0, 4) + p.substring(5, 7) + p.substring(8, 10), 10);
        }
    }
    tableExists('DBA.AcumplanDia', function (existsErr, hasAcumplanDia) {
        if (existsErr) {
            console.error('[runGeneralPucCuentasQuery] Error verificando tabla AcumplanDia:', existsErr.message || existsErr);
            return cb([], getSchemaWarning(existsErr, 'Balance General PUC'));
        }
        resolvePucTable(function (pErr, pucTable) {
            if (pErr) {
                console.error('[runGeneralPucCuentasQuery] Error resolviendo tabla PUC:', pErr.message || pErr);
                return cb([], getSchemaWarning(pErr, 'Balance General PUC'));
            }
            var allowPucJoin = !!pucTable;

            var accumTable = hasAcumplanDia ? 'DBA.AcumplanDia' : 'DBA.Acumplan';
            var rangeField = hasAcumplanDia ? 'AnhoMesDia' : 'AnhoMes';
            var anhoMesDesde = parseInt(String(params.periodo) + (mesDesde < 10 ? ('0' + mesDesde) : String(mesDesde)), 10);
            var anhoMesHasta = parseInt(String(params.periodo) + (mesHasta < 10 ? ('0' + mesHasta) : String(mesHasta)), 10);
            var rangeDesde = hasAcumplanDia ? anhoMesDiaDesde : anhoMesDesde;
            var rangeHasta = hasAcumplanDia ? anhoMesDiaHasta : anhoMesHasta;
            if (!hasAcumplanDia && params.practicado_al) {
                var p = String(params.practicado_al).trim();
                if (/^\d{4}-\d{2}-\d{2}$/.test(p)) {
                    rangeHasta = parseInt(p.substring(0, 4) + p.substring(5, 7), 10);
                }
            }

            var localExpr = "(case DBA.PLANCTA.TipoSaldo when 'D' then sum(coalesce(" + accumTable + ".TotalDb,0)) - sum(coalesce(" + accumTable + ".TotalCr,0)) else sum(coalesce(" + accumTable + ".TotalCr,0)) - sum(coalesce(" + accumTable + ".TotalDb,0)) end)";
            var meExpr = "(case DBA.PLANCTA.TipoSaldo when 'D' then sum(coalesce(" + accumTable + ".TotalDbME,0)) - sum(coalesce(" + accumTable + ".TotalCrME,0)) else sum(coalesce(" + accumTable + ".TotalCrME,0)) - sum(coalesce(" + accumTable + ".TotalDbME,0)) end)";
            // En PostgreSQL puede venir varchar tanto en AnhoMes como AnhoMesDia.
            // Forzamos cast numérico para comparar con enteros en ambos motores.
            var rangeExpr = "cast(coalesce(" + accumTable + "." + rangeField + ",'0') as integer)";
            var isAmbas = (params.moneda === 'ambas');
            var saldoExpr = params.moneda == 'local'
                ? localExpr
                : (isAmbas
                    ? "(case when upper(coalesce(DBA.PLANCTA.CodMoneda,'')) in ('GS','PYG') then " + localExpr + " else " + meExpr + " end)"
                    : meExpr);
            var saldoScale = (params.moneda == 'local' ? "0" : "2");
            var havingExpr = isAmbas
                ? ("(cast(" + localExpr + " as decimal(20,0)) <> 0 OR cast(" + meExpr + " as decimal(20,2)) <> 0)")
                : ("cast(" + saldoExpr + " as decimal(20," + saldoScale + ")) <> 0");

            function buildSql(usePucJoin, useFiscalField) {
            var planCtaExpr = "cast(DBA.PLANCTA.CodPlanCta as varchar(60))";
            var sql = "SELECT DBA.PLANCTA.Cod_Empresa, " +
                "DBA.PLANCTA.CodPlanCta as CodPlanCta, " +
                "DBA.PLANCTA.Nombre as Nombre, " +
                "DBA.PLANCTA.CodPlanCtaPad as CodPlanCtaPad, " +
                "DBA.PLANCTA.Nivel as Nivel, " +
                "DBA.PLANCTA.Imputable as Imputable, " +
                "cast(sum(coalesce(" + accumTable + ".TotalDb,0)) as decimal(20,0)) as TOTAL_DEBITO, " +
                "cast(sum(coalesce(" + accumTable + ".TotalCr,0)) as decimal(20,0)) as TOTAL_CREDITO, " +
                "cast(sum(coalesce(" + accumTable + ".TotalDbME,0)) as decimal(20,2)) as TOTAL_DEBITOME, " +
                "cast(sum(coalesce(" + accumTable + ".TotalCrME,0)) as decimal(20,2)) as TOTAL_CREDITOME, " +
                "cast(" + localExpr + " as decimal(20,0)) as SALDO_LOCAL, " +
                "cast(" + meExpr + " as decimal(20,2)) as SALDO_ME, " +
                "cast(" + saldoExpr + " as decimal(20," + saldoScale + ")) as SALDO, " +
                "DBA.PLANCTA.TipoSaldo as TipoSaldo, " +
                "DBA.Control.CTCtaOrden as CTCtaOrden, " +
                (useFiscalField ? "DBA.PLANCTA.CodPlanCtaFiscal as codplanctafiscal, " : "'' as codplanctafiscal, ") +
                (usePucJoin ? "planuni.codplanctaestrategico as codplanctauni, " : "DBA.PLANCTA.CodPlanCta as codplanctauni, ") +
                (usePucJoin ? "planuni.nombre as nombreuni, " : "DBA.PLANCTA.Nombre as nombreuni, ") +
                "coalesce(moneda.simbolo, DBA.PLANCTA.codmoneda, '') as simbolo " +
                "FROM DBA.Control, DBA.PLANCTA " +
                "LEFT OUTER JOIN " + accumTable + " ON DBA.PLANCTA.Cod_Empresa = " + accumTable + ".Cod_Empresa " +
                "AND DBA.PLANCTA.Periodo = " + accumTable + ".Periodo " +
                "AND DBA.PLANCTA.CodPlanCta = " + accumTable + ".CodPlanCta " +
                "AND " + accumTable + ".Cod_Empresa = '" + params.empresa + "' " +
                "AND " + accumTable + ".Periodo = '" + params.periodo + "' " +
                "AND " + rangeExpr + " >= " + rangeDesde + " " +
                "AND " + rangeExpr + " <= " + rangeHasta + " " +
                (usePucJoin ? (
                "LEFT JOIN " + pucTable + " as planuni ON DBA.PLANCTA.CodPlanCtauni = planuni.CodPlanCtaestrategico " +
                "AND planuni.cod_empresa = DBA.PLANCTA.Cod_Empresa " +
                "AND planuni.periodo = DBA.PLANCTA.Periodo "
                ) : "") +
                "LEFT OUTER JOIN dba.moneda ON DBA.PLANCTA.codmoneda = moneda.codmoneda " +
                "WHERE DBA.Control.Cod_Empresa = DBA.PLANCTA.Cod_Empresa " +
                "AND DBA.Control.Periodo = DBA.PLANCTA.Periodo " +
                "AND DBA.PLANCTA.Cod_Empresa = '" + params.empresa + "' " +
                "AND DBA.PLANCTA.Periodo = '" + params.periodo + "' " +
                "AND " + planCtaExpr + " >= '" + params.cuentad + "' " +
                "AND " + planCtaExpr + " <= '" + params.cuentah + "' ";

            if (requestedNivel > 0) {
                sql += "AND DBA.PLANCTA.Nivel <= " + requestedNivel + " ";
            }

            sql += "GROUP BY DBA.PLANCTA.Cod_Empresa, DBA.PLANCTA.CodPlanCta, DBA.PLANCTA.Nombre, DBA.PLANCTA.CodPlanCtaPad, DBA.PLANCTA.Nivel, DBA.PLANCTA.Imputable, DBA.PLANCTA.TipoSaldo, DBA.PLANCTA.CodMoneda, DBA.Control.CTCtaOrden, " +
                (useFiscalField ? "DBA.PLANCTA.CodPlanCtaFiscal, " : "") +
                (usePucJoin ? "planuni.codplanctaestrategico, planuni.nombre, " : "") +
                "coalesce(moneda.simbolo, DBA.PLANCTA.codmoneda, '') ";

            if (params.incluir !== 'SI') {
                sql += "HAVING " + havingExpr + " ";
            }

            sql += "ORDER BY DBA.PLANCTA.CodPlanCta";
            return sql;
            }

            function runWithFallback() {
            var sql = buildSql(allowPucJoin, true);
            conn.exec(sql, function (err, row) {
                if (err) {
                    var msg = String((err && (err.message || err.Msg || err.sqlMessage)) || err || '').toLowerCase();
                    var schemaRelated = msg.indexOf('planctaunico') >= 0 ||
                        msg.indexOf('planctaestrategico') >= 0 ||
                        msg.indexOf('codplanctauni') >= 0 ||
                        msg.indexOf('codplanctafiscal') >= 0 ||
                        msg.indexOf('column') >= 0 ||
                        msg.indexOf('columna') >= 0;
                    if (schemaRelated) {
                        var sqlNoPucNoFiscal = buildSql(false, false);
                        return conn.exec(sqlNoPucNoFiscal, function (err2, row2) {
                            if (err2) {
                                console.error('[runGeneralPucCuentasQuery] Error fallback sin PUC:', err2.message || err2);
                                return cb([], getSchemaWarning(err2, 'Balance General PUC'));
                            }
                            return cb(row2 || [], 'Se cargó el informe sin vínculo PUC (estructura distinta entre motores).');
                        });
                    }
                    console.error('[runGeneralPucCuentasQuery] Error ejecutando consulta:', err.message || err);
                    return cb([], getSchemaWarning(err, 'Balance General PUC'));
                }
                if ((row || []).length === 0 && hasAcumplanDia) {
                    // Fallback: si acumulado diario no trae filas, probar acumulado mensual.
                    var sqlMes = sql
                        .replace(/DBA\.AcumplanDia/g, 'DBA.Acumplan')
                        .replace(/AnhoMesDia/g, 'AnhoMes')
                        .replace(new RegExp(">=\\s*" + rangeDesde, "g"), ">= " + anhoMesDesde)
                        .replace(new RegExp("<=\\s*" + rangeHasta, "g"), "<= " + anhoMesHasta);
                    return conn.exec(sqlMes, function (err3, row3) {
                        if (err3) {
                            console.error('[runGeneralPucCuentasQuery] Error fallback Acumplan:', err3.message || err3);
                            return cb([], getSchemaWarning(err3, 'Balance General PUC'));
                        }
                        if ((row3 || []).length > 0) {
                            return cb(row3 || [], '');
                        }
                        return cb(row3 || [], '');
                    });
                }
                cb(row || [], '');
            });
            }

            runWithFallback();
        });
    });
}

function runGeneralPucQuery(params, cb) {
    var anhoMesDesde = parseInt(params.periodo.toString() + params.mesd.toString(), 10);
    var anhoMesHasta = parseInt(params.periodo.toString() + params.mesh.toString(), 10);
    var requestedNivel = parseInt(params.nivel, 10) || 0;
    var debugEnabled = String(params.debug || '') === '1' || String(process.env.BALANCE_PUC_DEBUG || '') === '1';
    var debugParent = (params.debug_parent || '11020105001').toString().trim();
    var localExpr = "(case planctaunico.tiposaldo when 'D' then sum(coalesce(acumplan.totaldb,0)) - sum(coalesce(acumplan.totalcr,0)) else sum(coalesce(acumplan.totalcr,0)) - sum(coalesce(acumplan.totaldb,0)) end)";
    var meExpr = "(case planctaunico.tiposaldo when 'D' then sum(coalesce(acumplan.totaldbme,0)) - sum(coalesce(acumplan.totalcrme,0)) else sum(coalesce(acumplan.totalcrme,0)) - sum(coalesce(acumplan.totaldbme,0)) end)";
    var isAmbas = (params.moneda === 'ambas');
    var saldoExpr = params.moneda == 'local'
        ? localExpr
        : (isAmbas
            ? "(case when upper(coalesce(moneda.simbolo, padre.codmoneda, '')) in ('GS','PYG') then " + localExpr + " else " + meExpr + " end)"
            : meExpr);
    var saldoScale = (params.moneda == 'local' ? "0" : "2");
    var havingExpr = isAmbas
        ? ("(cast(" + localExpr + " as decimal(20,0)) <> 0 OR cast(" + meExpr + " as decimal(20,2)) <> 0)")
        : ("cast(" + saldoExpr + " as decimal(20," + saldoScale + ")) <> 0");
    var factDate = String(params.periodo) + "-" + String(params.mesh || '01') + "-01";
    if (params.practicado_al) {
        var p = String(params.practicado_al).trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(p)) {
            factDate = p;
            anhoMesHasta = parseInt(p.substring(0, 4) + p.substring(5, 7), 10);
        }
    }
    var ctaEstrExpr = "cast(planctaunico.codplanctaestrategico as varchar(60))";
    var string = "SELECT planctaunico.cod_empresa, " +
        " padre.codplanctaestrategico as CodPlanCta, " +
        " padre.nombre as Nombre, " +
        " padre.codplanctaestrategicopad as CodPlanCtaPad, " +
        " padre.nivel as Nivel, " +
        " planctaunico.imputable as Imputable, " +
        " cast(sum(coalesce(acumplan.totaldb,0)) as decimal(20,0)) as TOTAL_DEBITO, " +
        " cast(sum(coalesce(acumplan.totalcr,0)) as decimal(20,0)) as TOTAL_CREDITO, " +
        " cast(sum(coalesce(acumplan.totaldbme,0)) as decimal(20,2)) as TOTAL_DEBITOME, " +
        " cast(sum(coalesce(acumplan.totalcrme,0)) as decimal(20,2)) as TOTAL_CREDITOME, " +
        " cast(" + localExpr + " as decimal(20,0)) as SALDO_LOCAL, " +
        " cast(" + meExpr + " as decimal(20,2)) as SALDO_ME, " +
        " cast(" + saldoExpr + " as decimal(20," + saldoScale + ")) as SALDO, " +
        " planctaunico.tiposaldo as TipoSaldo, " +
        " '0' as CTCtaOrden, " +
        " padre.codplanctaestrategico as codplanctauni, " +
        " max(planctaunico.tipo_cuenta) as tipo_cuenta, " +
        " coalesce(moneda.simbolo, padre.codmoneda, '') as simbolo, " +
        " max(factcamb.factor_compra_set) as factor_compra_set " +
        "FROM dba.control, __PUC_TABLE__ planctaunico " +
        "INNER JOIN dba.plancta " +
        " ON planctaunico.cod_empresa = plancta.cod_empresa " +
        "AND planctaunico.periodo = plancta.periodo " +
        "AND planctaunico.codplanctaestrategico = plancta.codplanctauni " +
        "AND plancta.cod_empresa = '" + params.empresa + "' " +
        "AND plancta.periodo = '" + params.periodo + "' " +
        "LEFT OUTER JOIN dba.acumplan " +
        " ON plancta.cod_empresa = acumplan.cod_empresa " +
        "AND plancta.periodo = acumplan.periodo " +
        "AND plancta.codplancta = acumplan.codplancta " +
        "AND acumplan.cod_empresa = '" + params.empresa + "' " +
        "AND acumplan.periodo = '" + params.periodo + "' " +
        "AND cast(coalesce(acumplan.anhomes,'0') as integer) >= " + anhoMesDesde + " " +
        "AND cast(coalesce(acumplan.anhomes,'0') as integer) <= " + anhoMesHasta + " " +
        "INNER JOIN __PUC_TABLE__ padre " +
        " ON planctaunico.cod_empresa = padre.cod_empresa " +
        "AND planctaunico.periodo = padre.periodo " +
        "AND planctaunico.codplanctaestrategicopad = padre.codplanctaestrategico " +
        "LEFT OUTER JOIN dba.moneda " +
        " ON padre.codmoneda = moneda.codmoneda " +
        "LEFT OUTER JOIN dba.factcamb " +
        " ON factcamb.codmoneda = 'US' " +
        "AND date(factcamb.fact_fecha) = (select max(date(fact_fecha)) from dba.factcamb where codmoneda = 'US' and date(fact_fecha) = cast('" + factDate + "' as date)) " +
        "WHERE control.cod_empresa = planctaunico.cod_empresa " +
        "AND control.periodo = planctaunico.periodo " +
        "AND planctaunico.cod_empresa = '" + params.empresa + "' " +
        "AND planctaunico.periodo = '" + params.periodo + "' " +
        "AND " + ctaEstrExpr + " >= '" + params.cuentad + "' " +
        "AND " + ctaEstrExpr + " <= '" + params.cuentah + "' ";

    if (requestedNivel > 0) {
        string += "AND padre.nivel <= " + requestedNivel + " ";
    }

    string += "GROUP BY planctaunico.cod_empresa, padre.codplanctaestrategico, padre.nombre, padre.codplanctaestrategicopad, padre.nivel, planctaunico.imputable, planctaunico.tiposaldo, coalesce(moneda.simbolo, padre.codmoneda, '') ";

    if (params.incluir !== 'SI') {
        string += "HAVING " + havingExpr + " ";
    }

    string += "ORDER BY padre.codplanctaestrategico";

    function executeQuery(sql, fallbackWarning) {
        conn.exec(sql, function (err, row) {
            if (err) {
                var errCode = (err && (err.code || err.Code));
                var errMsg = String((err && (err.message || err.Msg || err.sqlMessage)) || err || '').toLowerCase();
                var missingTipoCuenta = (errCode === -143) && errMsg.indexOf('tipo_cuenta') >= 0;
                if (missingTipoCuenta) {
                    var sqlSinTipoCuenta = sql.replace(
                        "max(planctaunico.tipo_cuenta) as tipo_cuenta, ",
                        "'' as tipo_cuenta, "
                    );
                    return conn.exec(sqlSinTipoCuenta, function (err2, row2) {
                        if (err2) {
                            console.error('[runGeneralPucQuery] Error en fallback tipo_cuenta:', err2.message || err2);
                            return cb([], getSchemaWarning(err2, 'Balance General PUC'));
                        }
                        return processRows(row2 || [], "No existe la columna requerida (tipo_cuenta). Se cargó el informe sin ese campo.");
                    });
                }
                console.error('[runGeneralPucQuery] Error ejecutando consulta:', err.message || err);
                return cb([], getSchemaWarning(err, 'Balance General PUC'));
            }
            processRows(row || [], fallbackWarning || '');
        });
    }

    function processRows(rawRows, warning) {
        if (debugEnabled) {
            console.log('[PUC][raw] rows=', (rawRows || []).length, 'empresa=', params.empresa, 'periodo=', params.periodo, 'mesd=', params.mesd, 'mesh=', params.mesh, 'nivel=', params.nivel);
        }
        if (debugEnabled) {
            var rawParent = rawRows.find(function (r) { return String(r.CodPlanCta || '').trim() === debugParent; }) || null;
            var rawChildren = rawRows.filter(function (r) { return String(r.CodPlanCtaPad || '').trim() === debugParent; });
            var rawChildDeb = rawChildren.reduce(function (acc, r) { return acc + toNumber(r.TOTAL_DEBITO); }, 0);
            var rawChildCre = rawChildren.reduce(function (acc, r) { return acc + toNumber(r.TOTAL_CREDITO); }, 0);
            console.log('[PUC][raw-parent]', debugParent, rawParent ? ('deb=' + rawParent.TOTAL_DEBITO + ' cre=' + rawParent.TOTAL_CREDITO + ' sal=' + rawParent.SALDO + ' niv=' + rawParent.Nivel) : 'NO_ENCONTRADO');
            console.log('[PUC][raw-children]', debugParent, 'cant=', rawChildren.length, 'sumDeb=', rawChildDeb, 'sumCre=', rawChildCre);
        }
        var filtered = rawRows;
        if (debugEnabled) {
            var filteredParent = filtered.find(function (r) { return String(r.CodPlanCta || '').trim() === debugParent; }) || null;
            console.log('[PUC][filtered-parent]', debugParent, filteredParent ? ('deb=' + filteredParent.TOTAL_DEBITO + ' cre=' + filteredParent.TOTAL_CREDITO + ' sal=' + filteredParent.SALDO + ' niv=' + filteredParent.Nivel) : 'NO_ENCONTRADO');
            console.log('[PUC][filtered] rows=', filtered.length);
        }
        cb(filtered, warning || '');
    }

    resolvePucTable(function (pErr, pucTable) {
        if (pErr) {
            console.error('[runGeneralPucQuery] Error resolviendo tabla PUC:', pErr.message || pErr);
            return cb([], getSchemaWarning(pErr, 'Balance General PUC'));
        }
        if (!pucTable) {
            return cb([], 'No existe tabla PUC (planctaunico/planctaestrategico).');
        }
        executeQuery(string.replace(/__PUC_TABLE__/g, pucTable), '');
    });
}

Balance.comprobado = function (params,cb) {
    var periodo = parseInt(params.periodo, 10) || 0;
    var periodoAnt = parseInt(params.periodoant, 10) || 0;
    var mes = parseInt(params.mes, 10) || 0;
    var mesAnt = parseInt(params.mesant, 10) || 0;
    var nivel = parseInt(params.nivel, 10) || 0;
    var isLocal = (params.moneda == 'local');

    var saldoAnteriorExpr = isLocal
        ? "(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' THEN cast(coalesce(SUM(A2.TotalDB),0) - coalesce(SUM(A2.TotalCR),0) as decimal(20,0)) ELSE cast(coalesce(SUM(A2.TotalCR),0) - coalesce(SUM(A2.TotalDB),0) as decimal(20,0)) END)"
        : "(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' THEN cast(coalesce(SUM(A2.TotalDBME),0) - coalesce(SUM(A2.TotalCRME),0) as decimal(20,2)) ELSE cast(coalesce(SUM(A2.TotalCRME),0) - coalesce(SUM(A2.TotalDBME),0) as decimal(20,2)) END)";

    var saldoAnteriorSubq = "(SELECT " + saldoAnteriorExpr + " FROM DBA.ACUMPLAN A2 " +
        "WHERE A2.Cod_Empresa = DBA.PLANCTA.Cod_Empresa " +
        "AND A2.CodPlanCta = DBA.PLANCTA.CodPlanCta " +
        "AND A2.Periodo = DBA.PLANCTA.Periodo " +
        "AND A2.Anho = " + periodoAnt + " " +
        "AND A2.Mes < " + mesAnt + ")";
    var saldoAnterior = "coalesce(" + saldoAnteriorSubq + ", 0)";

    var totalDeb = isLocal
        ? "cast(coalesce(DBA.ACUMPLAN.TotalDb,0) as decimal(20,0))"
        : "cast(coalesce(DBA.ACUMPLAN.TotalDbME,0) as decimal(20,2))";
    var totalCre = isLocal
        ? "cast(coalesce(DBA.ACUMPLAN.TotalCr,0) as decimal(20,0))"
        : "cast(coalesce(DBA.ACUMPLAN.TotalCrME,0) as decimal(20,2))";

    var saldoExpr = "(CASE DBA.PLANCTA.TipoSaldo WHEN 'D' THEN ((" + saldoAnterior + " + " + totalDeb + ") - " + totalCre + ") " +
        "ELSE ((" + saldoAnterior + " + " + totalCre + ") - " + totalDeb + ") END)";

    var string = "SELECT DBA.PLANCTA.Cod_Empresa, DBA.PLANCTA.CodPlanCta, DBA.PLANCTA.Nombre, DBA.PLANCTA.Nivel, DBA.PLANCTA.Imputable, " +
        saldoAnterior + " as SALDO_ANTERIOR, " +
        totalDeb + " as TOTAL_DEBITO, " +
        totalCre + " as TOTAL_CREDITO, " +
        "DBA.PLANCTA.TipoSaldo, " +
        saldoExpr + " as SALDO " +
        "FROM DBA.PLANCTA, DBA.ACUMPLAN " +
        "WHERE DBA.PLANCTA.Cod_Empresa = DBA.ACUMPLAN.Cod_Empresa " +
        "AND DBA.ACUMPLAN.Periodo = DBA.PLANCTA.Periodo " +
        "AND DBA.PLANCTA.CodPlanCta = DBA.ACUMPLAN.CodPlanCta " +
        "AND DBA.ACUMPLAN.Anho = " + periodo + " " +
        "AND DBA.ACUMPLAN.Mes = " + mes + " ";
    if (nivel > 0) {
        string += "AND DBA.PLANCTA.Nivel <= " + nivel + " ";
    }
    string += "AND DBA.PLANCTA.cod_empresa = '" + params.empresa + "' " +
        "ORDER BY DBA.PLANCTA.CodPlanCta";

    conn.exec(string, function(err, row){
        if (err) {
            console.error('[Balance.comprobado] Error ejecutando consulta:', err.message || err);
            return cb({ rows: [], warning: getSchemaWarning(err, 'Balance Comprobado') });
        }
        cb({ rows: row || [], warning: '' });
    });
};

Balance.integralAuxiliares = function (params, cb) {
    params = params || {};
    var empresa = (params.empresa || '').toString().trim();
    var periodo = (params.periodo || '').toString().trim();
    var mesd = (params.mesd || '01').toString().trim();
    var mesh = (params.mesh || mesd).toString().trim();
    var moneda = ((params.moneda || 'local') + '').toLowerCase();
    var ctaDesde = (params.cuentad || '1').toString().trim();
    var ctaHasta = (params.cuentah || '9').toString().trim();
    var fechaDesde = (params.fechad || params.start || '').toString().trim();
    var fechaHasta = (params.fechah || params.end || '').toString().trim();
    var limite = parseInt(params.limit || '200', 10);
    if (isNaN(limite) || limite <= 0) limite = 200;
    if (limite > 1000) limite = 1000;

    if (!empresa || !periodo) {
        return cb({ clientes: [], proveedores: [], warning: 'Faltan parametros para detalle auxiliar.' });
    }

    var anhoMesDesde = parseInt(periodo + mesd, 10);
    var anhoMesHasta = parseInt(periodo + mesh, 10);
    if (!anhoMesDesde || !anhoMesHasta) {
        return cb({ clientes: [], proveedores: [], warning: 'Rango de fechas invalido para detalle auxiliar.' });
    }
    if (!fechaDesde) fechaDesde = periodo + '-' + mesd + '-01';
    if (!fechaHasta) fechaHasta = periodo + '-' + mesh + '-31';

    var debExpr = (moneda === 'extranjera') ? "sum(coalesce(a.TotalDbME,0))" : "sum(coalesce(a.TotalDb,0))";
    var creExpr = (moneda === 'extranjera') ? "sum(coalesce(a.TotalCrME,0))" : "sum(coalesce(a.TotalCr,0))";
    var scale = (moneda === 'extranjera') ? "2" : "0";
    var saldoExpr = "(case when upper(coalesce(c.TipoSaldo,'')) = 'D' then (" + debExpr + " - " + creExpr + ") else (" + creExpr + " - " + debExpr + ") end)";
    var anhoMesExpr = "cast(coalesce(a.AnhoMes, '0') as integer)";

    function classifyAndReturn(rows, warning) {
        var src = rows || [];
        var reCli = /(CLIENTE|COBRAR|DEUDOR|CTAS?\s*X?\s*COBRAR|CUENTAS?\s*POR\s*COBRAR)/i;
        var reProv = /(PROVEED|PAGAR|ACREEDOR|DEVENG|CTAS?\s*X?\s*PAGAR|CUENTAS?\s*POR\s*PAGAR)/i;
        var clientes = [];
        var proveedores = [];
        var otrosPos = [];
        var otrosNeg = [];

        src.forEach(function (r) {
        var auxName = r.nombreplanauxi || r.NombrePlanAuxi || r.auxiliar || r.Auxiliar || r.nombre || r.Nombre || '';
        var deb = (typeof r.Debito !== 'undefined') ? r.Debito : r.debito;
        var cre = (typeof r.Credito !== 'undefined') ? r.Credito : r.credito;
        var sal = (typeof r.Saldo !== 'undefined') ? r.Saldo : r.saldo;
        var cta = r.Cuenta || r.cuenta || '';
            var item = {
                CodPlanCta: r.CodPlanCta || r.codplancta,
                CodPlanAux: r.CodPlanAux || r.codplanaux,
                Nombre: auxName,
                Cuenta: cta,
                Debito: deb,
                Credito: cre,
                Saldo: sal
            };
            var cuentaNombre = String(cta);
            var saldo = toNumber(sal);
            if (reCli.test(cuentaNombre)) {
                clientes.push(item);
            } else if (reProv.test(cuentaNombre)) {
                proveedores.push(item);
            } else if (saldo >= 0) {
                otrosPos.push(item);
            } else {
                otrosNeg.push(item);
            }
        });

        if (!clientes.length) clientes = otrosPos;
        if (!proveedores.length) proveedores = otrosNeg;

        cb({
            clientes: clientes.slice(0, limite),
            proveedores: proveedores.slice(0, limite),
            warning: warning || ''
        });
    }

    function runFallback(sqlWarning) {
        var sql = "SELECT p.CodPlanCta, p.CodPlanAux, p.Nombre as Auxiliar, c.Nombre as Cuenta, c.TipoSaldo, " +
            "cast(" + debExpr + " as decimal(20," + scale + ")) as Debito, " +
            "cast(" + creExpr + " as decimal(20," + scale + ")) as Credito, " +
            "cast(" + saldoExpr + " as decimal(20," + scale + ")) as Saldo " +
            "FROM DBA.PLANAUXI p " +
            "INNER JOIN DBA.PLANCTA c ON c.Cod_Empresa = p.Cod_Empresa AND c.Periodo = p.Periodo AND c.CodPlanCta = p.CodPlanCta " +
            "LEFT OUTER JOIN DBA.ACUMAUXI a ON a.Cod_Empresa = p.Cod_Empresa AND a.Periodo = p.Periodo AND a.CodPlanCta = p.CodPlanCta AND a.CodPlanAux = p.CodPlanAux " +
            "AND " + anhoMesExpr + " >= " + anhoMesDesde + " AND " + anhoMesExpr + " <= " + anhoMesHasta + " " +
            "WHERE p.Cod_Empresa = '" + empresa + "' AND p.Periodo = '" + periodo + "' AND p.Imputable = 'S' " +
            "AND p.CodPlanCta >= '" + ctaDesde + "' AND p.CodPlanCta <= '" + ctaHasta + "' " +
            "GROUP BY p.CodPlanCta, p.CodPlanAux, p.Nombre, c.Nombre, c.TipoSaldo " +
            "HAVING cast(" + saldoExpr + " as decimal(20," + scale + ")) <> 0 " +
            "ORDER BY abs(cast(" + saldoExpr + " as decimal(20," + scale + "))) DESC";

        conn.exec(sql, function (err, rows) {
            if (err) {
                console.error('[Balance.integralAuxiliares] Error ejecutando consulta fallback:', err.message || err);
                return cb({ clientes: [], proveedores: [], warning: getSchemaWarning(err, 'Detalle auxiliar de Balance Integral') });
            }
            classifyAndReturn(rows || [], sqlWarning || '');
        });
    }

    var debFunExpr = (moneda === 'extranjera') ? "sum(coalesce(v.debitome,0))" : "sum(coalesce(v.debito,0))";
    var creFunExpr = (moneda === 'extranjera') ? "sum(coalesce(v.creditome,0))" : "sum(coalesce(v.credito,0))";
    var saldoFunExpr = "(case when upper(coalesce(max(c.TipoSaldo),'')) = 'D' then (" + debFunExpr + " - " + creFunExpr + ") else (" + creFunExpr + " - " + debFunExpr + ") end)";
    var sqlFunc = "SELECT v.codplancta as CodPlanCta, v.codplanaux as CodPlanAux, max(v.nombreplanauxi) as Auxiliar, " +
        "max(c.Nombre) as Cuenta, max(c.TipoSaldo) as TipoSaldo, " +
        "cast(" + debFunExpr + " as decimal(20," + scale + ")) as Debito, " +
        "cast(" + creFunExpr + " as decimal(20," + scale + ")) as Credito, " +
        "cast(" + saldoFunExpr + " as decimal(20," + scale + ")) as Saldo " +
        "FROM dba.f_vmayoraux('" + empresa + "', '" + periodo + "', '" + ctaDesde + "', '" + ctaHasta + "', '', 'ZZZZZZZZZZZZZZZZ', '" + fechaDesde + "', '" + fechaHasta + "') v " +
        "LEFT JOIN DBA.PLANCTA c ON c.Cod_Empresa = '" + empresa + "' AND c.Periodo = '" + periodo + "' AND c.CodPlanCta = v.codplancta " +
        "GROUP BY v.codplancta, v.codplanaux " +
        "HAVING cast(" + saldoFunExpr + " as decimal(20," + scale + ")) <> 0 " +
        "ORDER BY abs(cast(" + saldoFunExpr + " as decimal(20," + scale + "))) DESC";

    conn.exec(sqlFunc, function (err, rows) {
        if (err) {
            var msg = String((err && (err.message || err.Msg || err.sqlMessage)) || err || '').toLowerCase();
            var code = (err && (err.code || err.Code));
            var fnMissing = msg.indexOf('f_vmayoraux') >= 0 || msg.indexOf('not found') >= 0 || code === -141 || code === -143;
            if (fnMissing) {
                return runFallback('No se encontro la funcion dba.f_vmayoraux. Se uso ACUMAUXI como respaldo.');
            }
            console.error('[Balance.integralAuxiliares] Error ejecutando funcion:', err.message || err);
            return runFallback(getSchemaWarning(err, 'Detalle auxiliar de Balance Integral'));
        }
        classifyAndReturn(rows || [], '');
    });
};

module.exports = Balance;
