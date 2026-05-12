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

module.exports = DiferenciaCambio;
