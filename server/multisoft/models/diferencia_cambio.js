var conn = require('../db_integrado');

var DiferenciaCambio = {};

function esc(value) {
    return String(value == null ? '' : value).replace(/'/g, "''").trim();
}

function isPostgres() {
    try {
        if (typeof conn.getStatus === 'function') {
            var st = conn.getStatus() || {};
            return String(st.engine || st.configured_engine || '').toLowerCase() === 'postgres';
        }
    } catch (e) {}
    return String(conn._engine || '').toLowerCase() === 'postgres';
}

function firstDayOfMonth(value, periodo) {
    var v = String(value || '').trim();
    var match = /^(\d{4})-(\d{2})-\d{2}$/.exec(v);
    if (match) return match[1] + '-' + match[2] + '-01';
    return String(periodo || new Date().getFullYear()) + '-01-01';
}

function filterCondition(field, value) {
    var raw = esc(value);
    if (!raw) return '';

    var parts = raw.split(',').map(function (item) { return esc(item); }).filter(Boolean);
    if (parts.length > 1) {
        return ' AND ' + field + " IN ('" + parts.join("','") + "') ";
    }

    if (raw.indexOf('%') >= 0 || raw.indexOf('*') >= 0) {
        return ' AND ' + field + " LIKE '" + raw.replace(/\*/g, '%') + "' ";
    }

    return ' AND ' + field + " = '" + raw + "' ";
}

function normalizeNumber(value) {
    var n = Number(value || 0);
    return isFinite(n) ? n : 0;
}

function sqlValue(value) {
    if (value === null || typeof value === 'undefined' || String(value).trim() === '') return 'NULL';
    return "'" + esc(value) + "'";
}

function numValue(value, decimals) {
    var n = Number(value || 0);
    if (!isFinite(n)) n = 0;
    if (typeof decimals === 'number') return n.toFixed(decimals);
    return String(n);
}

function beginSql() {
    return isPostgres() ? 'BEGIN' : 'BEGIN TRANSACTION';
}

function execOnly(sql, cb) {
    conn.exec(sql, function (err) {
        cb(err || null);
    });
}

function rollbackWith(err, cb) {
    execOnly('ROLLBACK', function () {
        cb(err || new Error('No se pudo grabar la operacion.'));
    });
}

function insertDetailSql(empresa, periodo, nrotransac, row, line, concepto) {
    var dbcr = String(row.dbcr || '').trim().toUpperCase() === 'C' ? 'C' : 'D';
    var importe = normalizeNumber(row.importe);
    var importeme = normalizeNumber(row.importeme);
    var debito = dbcr === 'D' ? importe : 0;
    var credito = dbcr === 'C' ? importe : 0;
    var debitome = dbcr === 'D' ? importeme : 0;
    var creditome = dbcr === 'C' ? importeme : 0;

    return "INSERT INTO DBA.AsientosDet (" +
        "Cod_Empresa, NroTransac, Linea, Periodo, CodPlanCta, CodPlanAux, DBCR, Importe, ImporteME, Concepto, Debito, Credito, DebitoME, CreditoME" +
        ") VALUES (" +
        sqlValue(empresa) + ", " +
        numValue(nrotransac) + ", " +
        numValue(line) + ", " +
        sqlValue(periodo) + ", " +
        sqlValue(row.codplancta) + ", " +
        sqlValue(row.codplanaux) + ", " +
        sqlValue(dbcr) + ", " +
        numValue(importe, 4) + ", " +
        numValue(importeme, 4) + ", " +
        sqlValue(concepto || row.concepto) + ", " +
        numValue(debito, 4) + ", " +
        numValue(credito, 4) + ", " +
        numValue(debitome, 4) + ", " +
        numValue(creditome, 4) +
        ")";
}

function runRecalculo(empresa, periodo, done) {
    var sql = "UPDATE dba.asientosdet " +
        "SET importe = CASE WHEN dbcr = 'D' THEN round(debito, 0) WHEN dbcr = 'C' THEN round(credito, 0) ELSE round(importe, 0) END, " +
        "importeme = CASE WHEN dbcr = 'D' THEN round(debitome, 2) WHEN dbcr = 'C' THEN round(creditome, 2) ELSE round(importeme, 2) END, " +
        "debito = round(debito, 0), credito = round(credito, 0), debitome = round(debitome, 2), creditome = round(creditome, 2) " +
        "WHERE cod_empresa = '" + empresa + "' AND periodo = '" + periodo + "'";

    conn.exec(sql, function (err) {
        done(err);
    });
}

DiferenciaCambio.consultar = function (query, cb) {
    var empresa = esc(query.empresa);
    var periodo = esc(query.periodo);
    var fechaDesde = esc(query.fecha_desde);
    var fechaHasta = esc(query.fecha_hasta);
    var cuenta = esc(query.cuenta);
    var auxiliar = esc(query.auxiliar);
    var recalcular = String(query.recalcular || '').toUpperCase() === 'SI';

    if (!empresa || !periodo || !fechaDesde || !fechaHasta) {
        return cb(null, { rows: [], message: 'Faltan parametros para consultar diferencia de cambio.' });
    }

    var fechaInicio = firstDayOfMonth(fechaDesde, periodo);
    var limitClause = isPostgres() ? ' LIMIT 1000' : '';
    var topClause = isPostgres() ? '' : ' TOP 1000 ';

    function executeConsulta() {
        var sql = "SELECT" + topClause +
            " pc.codplancta AS codplancta, " +
            " pa.codplanaux AS codplanaux, " +
            " CASE WHEN pa.codplanaux IS NULL THEN pc.nombre ELSE pa.nombre END AS nombre, " +
            " CASE WHEN pa.codplanaux IS NULL THEN pc.codmoneda ELSE pa.codmoneda END AS monedabase, " +
            " COALESCE(CASE WHEN pa.codplanaux IS NULL THEN ag.saldogs ELSE ax.saldogs END, 0) AS saldogs, " +
            " COALESCE(CASE WHEN pa.codplanaux IS NULL THEN ag.saldome ELSE ax.saldome END, 0) AS saldome " +
            " FROM dba.plancta pc " +
            " LEFT JOIN dba.planauxi pa ON pc.cod_empresa = pa.cod_empresa AND pc.periodo = pa.periodo AND pc.codplancta = pa.codplancta " +
            " LEFT JOIN ( " +
            "   SELECT ad.codplancta, " +
            "          SUM(CASE WHEN ad.dbcr = 'D' THEN COALESCE(ad.debito, 0) ELSE 0 END) - SUM(CASE WHEN ad.dbcr = 'C' THEN COALESCE(ad.credito, 0) ELSE 0 END) AS saldogs, " +
            "          SUM(CASE WHEN ad.dbcr = 'D' THEN COALESCE(ad.debitome, 0) ELSE 0 END) - SUM(CASE WHEN ad.dbcr = 'C' THEN COALESCE(ad.creditome, 0) ELSE 0 END) AS saldome " +
            "   FROM dba.asientosdet ad " +
            "   JOIN dba.asientoscab ac ON ad.cod_empresa = ac.cod_empresa AND ad.nrotransac = ac.nrotransac " +
            "   WHERE ad.cod_empresa = '" + empresa + "' AND ad.periodo = '" + periodo + "' " +
            "     AND DATE(ac.fecha) >= DATE('" + fechaInicio + "') AND DATE(ac.fecha) <= DATE('" + fechaHasta + "') " +
            "   GROUP BY ad.codplancta " +
            " ) ag ON ag.codplancta = pc.codplancta " +
            " LEFT JOIN ( " +
            "   SELECT ad.codplancta, ad.codplanaux, " +
            "          SUM(CASE WHEN ad.dbcr = 'D' THEN COALESCE(ad.debito, 0) ELSE 0 END) - SUM(CASE WHEN ad.dbcr = 'C' THEN COALESCE(ad.credito, 0) ELSE 0 END) AS saldogs, " +
            "          SUM(CASE WHEN ad.dbcr = 'D' THEN COALESCE(ad.debitome, 0) ELSE 0 END) - SUM(CASE WHEN ad.dbcr = 'C' THEN COALESCE(ad.creditome, 0) ELSE 0 END) AS saldome " +
            "   FROM dba.asientosdet ad " +
            "   JOIN dba.asientoscab ac ON ad.cod_empresa = ac.cod_empresa AND ad.nrotransac = ac.nrotransac " +
            "   WHERE ad.cod_empresa = '" + empresa + "' AND ad.periodo = '" + periodo + "' " +
            "     AND DATE(ac.fecha) >= DATE('" + fechaInicio + "') AND DATE(ac.fecha) <= DATE('" + fechaHasta + "') " +
            "   GROUP BY ad.codplancta, ad.codplanaux " +
            " ) ax ON ax.codplancta = pc.codplancta AND ax.codplanaux = pa.codplanaux " +
            " WHERE pc.cod_empresa = '" + empresa + "' AND pc.periodo = '" + periodo + "' " +
            filterCondition('pc.codplancta', cuenta) +
            filterCondition('pa.codplanaux', auxiliar) +
            " AND (COALESCE(CASE WHEN pa.codplanaux IS NULL THEN ag.saldogs ELSE ax.saldogs END, 0) <> 0 " +
            "   OR COALESCE(CASE WHEN pa.codplanaux IS NULL THEN ag.saldome ELSE ax.saldome END, 0) <> 0) " +
            " ORDER BY pc.codplancta, pa.codplanaux" + limitClause;

        conn.exec(sql, function (err, rows) {
            if (err) {
                console.error('[DiferenciaCambio.consultar] error:', err.message || err);
                return cb(err);
            }

            cb(null, {
                rows: (rows || []).map(function (row) {
                    return {
                        codplancta: row.codplancta || row.CodPlanCta || row.CODPLANCTA || '',
                        codplanaux: row.codplanaux || row.CodPlanAux || row.CODPLANAUX || '',
                        nombre: row.nombre || row.Nombre || row.NOMBRE || '',
                        monedabase: row.monedabase || row.MonedaBase || row.MONEDABASE || '',
                        saldogs: normalizeNumber(row.saldogs || row.SaldoGS || row.SALDOGS),
                        saldome: normalizeNumber(row.saldome || row.SaldoME || row.SALDOME)
                    };
                }),
                fecha_inicio: fechaInicio
            });
        });
    }

    if (!recalcular) return executeConsulta();

    runRecalculo(empresa, periodo, function (err) {
        if (err) {
            console.error('[DiferenciaCambio.recalculo] error:', err.message || err);
            return cb(err);
        }
        executeConsulta();
    });
};

DiferenciaCambio.init = function (query, cb) {
    var empresa = esc(query.empresa);
    var periodo = esc(query.periodo);

    if (!empresa || !periodo) {
        return cb(null, {
            moneda_local: { descrip: 'Moneda Local', cantdecimal: 0 },
            moneda_extranjera: { descrip: 'Moneda Extranjera', cantdecimal: 2 },
            tipo_asientos: []
        });
    }

    var localSql = "SELECT M.CodMoneda AS codmoneda, M.Descrip AS descrip, C.CantDecimalGS AS cantdecimal " +
        "FROM DBA.Control C, DBA.Moneda M " +
        "WHERE C.Cod_Empresa = '" + empresa + "' " +
        "AND C.Periodo = '" + periodo + "' " +
        "AND C.MonedaLocal = M.CodMoneda";

    var extranjeraSql = "SELECT M.CodMoneda AS codmoneda, M.Descrip AS descrip, C.CantDecimalME AS cantdecimal " +
        "FROM DBA.Control C, DBA.Moneda M " +
        "WHERE C.Cod_Empresa = '" + empresa + "' " +
        "AND C.Periodo = '" + periodo + "' " +
        "AND C.MonedaExtranjera = M.CodMoneda";

    var tipoSql = "SELECT tipoasiento, descrip FROM dba.tipoasiento ORDER BY 1 ASC";

    conn.exec(localSql, function (localErr, localRows) {
        if (localErr) return cb(localErr);

        conn.exec(extranjeraSql, function (extranjeraErr, extranjeraRows) {
            if (extranjeraErr) return cb(extranjeraErr);

            conn.exec(tipoSql, function (tipoErr, tipoRows) {
                if (tipoErr) return cb(tipoErr);

                var local = (localRows || [])[0] || {};
                var extranjera = (extranjeraRows || [])[0] || {};

                cb(null, {
                    moneda_local: {
                        codmoneda: local.codmoneda || local.CodMoneda || local.CODMONEDA || '',
                        descrip: local.descrip || local.Descrip || local.DESCRIP || 'Moneda Local',
                        cantdecimal: normalizeNumber(local.cantdecimal || local.CantDecimalGS || local.CANTDECIMAL || 0)
                    },
                    moneda_extranjera: {
                        codmoneda: extranjera.codmoneda || extranjera.CodMoneda || extranjera.CODMONEDA || '',
                        descrip: extranjera.descrip || extranjera.Descrip || extranjera.DESCRIP || 'Moneda Extranjera',
                        cantdecimal: normalizeNumber(extranjera.cantdecimal || extranjera.CantDecimalME || extranjera.CANTDECIMAL || 2)
                    },
                    tipo_asientos: (tipoRows || []).map(function (row) {
                        return {
                            tipoasiento: row.tipoasiento || row.TipoAsiento || row.TIPOASIENTO || '',
                            descrip: row.descrip || row.Descrip || row.DESCRIP || ''
                        };
                    }).concat([{ tipoasiento: '', descrip: '' }])
                });
            });
        });
    });
};

DiferenciaCambio.nextTransac = function (query, cb) {
    var empresa = esc(query.empresa);

    if (!empresa) {
        return cb(null, { nrotransac: 1 });
    }

    var sql = "SELECT MAX(NroTransac) AS nrotransac FROM DBA.AsientosCab WHERE Cod_Empresa = '" + empresa + "'";
    conn.exec(sql, function (err, rows) {
        if (err) return cb(err);
        var row = (rows || [])[0] || {};
        var current = normalizeNumber(row.nrotransac || row.NroTransac || row.NROTRANSAC || 0);
        cb(null, { nrotransac: current + 1 });
    });
};

DiferenciaCambio.guardar = function (body, cb) {
    body = body || {};
    var empresa = esc(body.empresa);
    var periodo = esc(body.periodo);
    var tipoAsiento = esc(body.tipoasiento);
    var fecha = esc(body.fecha);
    var concepto = esc(body.concepto || 'Diferencia de cambio');
    var monedaLocal = esc(body.moneda_local || body.codmoneda || '');
    var rows = Array.isArray(body.rows) ? body.rows : [];

    if (!empresa || !periodo || !tipoAsiento || !fecha || !rows.length) {
        return cb(null, { ok: false, message: 'Faltan datos para grabar el asiento.' });
    }

    execOnly(beginSql(), function (beginErr) {
        if (beginErr) return cb(beginErr);

        var nextSql = "SELECT MAX(NroTransac) AS nrotransac FROM DBA.AsientosCab WHERE Cod_Empresa = '" + empresa + "'";
        conn.exec(nextSql, function (nextErr, nextRows) {
            if (nextErr) return rollbackWith(nextErr, cb);

            var maxRow = (nextRows || [])[0] || {};
            var nrotransac = normalizeNumber(maxRow.nrotransac || maxRow.NroTransac || maxRow.NROTRANSAC || 0) + 1;
            var updateControlSql = "UPDATE DBA.Control SET CtasToCont = " + numValue(nrotransac) + " WHERE Cod_Empresa = " + sqlValue(empresa);

            conn.exec(updateControlSql, function (controlErr) {
                if (controlErr) return rollbackWith(controlErr, cb);

                var cabSql = "INSERT INTO DBA.AsientosCab (Cod_Empresa, NroTransac, Periodo, TipoAsiento, NroCompr, Fecha, Transf, Origen, NroAsiento, CodMoneda) VALUES (" +
                    sqlValue(empresa) + ", " +
                    numValue(nrotransac) + ", " +
                    sqlValue(periodo) + ", " +
                    sqlValue(tipoAsiento) + ", NULL, " +
                    sqlValue(fecha) + ", 'N', 'CON', NULL, " +
                    sqlValue(monedaLocal) +
                    ")";

                conn.exec(cabSql, function (cabErr) {
                    if (cabErr) return rollbackWith(cabErr, cb);

                    var idx = 0;
                    function nextDetail() {
                        if (idx >= rows.length) {
                            return execOnly('COMMIT', function (commitErr) {
                                if (commitErr) return cb(commitErr);
                                cb(null, { ok: true, nrotransac: nrotransac });
                            });
                        }

                        var detailSql = insertDetailSql(empresa, periodo, nrotransac, rows[idx], idx + 1, concepto);
                        idx += 1;
                        conn.exec(detailSql, function (detErr) {
                            if (detErr) return rollbackWith(detErr, cb);
                            nextDetail();
                        });
                    }

                    nextDetail();
                });
            });
        });
    });
};

module.exports = DiferenciaCambio;
