var conn = require('../db_integrado');

var AsientoManual = {};

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

function normalizeNumber(value) {
    var raw = String(value == null ? '' : value).trim();
    if (raw.indexOf(',') >= 0) raw = raw.replace(/\./g, '').replace(',', '.');
    var n = Number(raw || 0);
    return isFinite(n) ? n : 0;
}

function beginSql() {
    return isPostgres() ? 'BEGIN' : 'BEGIN TRANSACTION';
}

function nowSql() {
    return isPostgres() ? 'CURRENT_TIMESTAMP' : 'CURRENT TIMESTAMP';
}

function execOnly(sql, cb) {
    conn.exec(sql, function (err) {
        cb(err || null);
    });
}

function rollbackWith(err, cb) {
    execOnly('ROLLBACK', function () {
        cb(err || new Error('No se pudo grabar el asiento.'));
    });
}

function parseDate(value) {
    if (value instanceof Date && !isNaN(value.getTime())) return value;
    var raw = String(value || '').trim();
    var match = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
    if (!match) return null;
    var date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    if (isNaN(date.getTime())) return null;
    return date;
}

function rowDateValue(row, names) {
    for (var i = 0; i < names.length; i += 1) {
        if (typeof row[names[i]] !== 'undefined' && row[names[i]] !== null) return row[names[i]];
    }
    return null;
}

function validatePeriodo(empresa, periodo, fecha, cb) {
    var fechaAsiento = parseDate(fecha);
    if (!fechaAsiento) return cb(new Error('La fecha del asiento no es valida.'));

    var yearIni = isPostgres() ? 'EXTRACT(YEAR FROM DATE(fechaini))' : 'year(date(fechaini))';
    var yearFin = isPostgres() ? 'EXTRACT(YEAR FROM DATE(fechafin))' : 'year(date(fechafin))';
    var sql = "SELECT " + yearIni + " AS anho_ini, " +
        yearFin + " AS anho_fin, " +
        "date(fechaini) AS fechaini, date(fechafin) AS fechafin " +
        "FROM dba.Periodo WHERE Cod_Empresa = " + sqlValue(empresa) + " AND periodo = " + sqlValue(periodo);

    conn.exec(sql, function (err, rows) {
        if (err) return cb(err);
        var row = (rows || [])[0];
        if (!row) return cb(new Error('No se encontro el periodo contable ' + periodo + '.'));

        var anhoIni = normalizeNumber(row.anho_ini || row.ANHO_INI || row.Anho_Ini);
        var anhoFin = normalizeNumber(row.anho_fin || row.ANHO_FIN || row.Anho_Fin);
        var fechaIni = parseDate(rowDateValue(row, ['fechaini', 'FECHAINI', 'FechaIni']));
        var fechaFin = parseDate(rowDateValue(row, ['fechafin', 'FECHAFIN', 'FechaFin']));

        if (anhoIni === anhoFin) {
            if (String(fechaAsiento.getFullYear()) !== String(periodo)) {
                return cb(new Error('La fecha del asiento a grabar no corresponde al periodo ' + periodo + '.'));
            }
            return cb(null);
        }

        if (!fechaIni || !fechaFin || fechaAsiento < fechaIni || fechaAsiento > fechaFin) {
            return cb(new Error('La fecha del asiento a grabar no corresponde al periodo ' + periodo + '.'));
        }

        cb(null);
    });
}

function fetchAccountRules(empresa, periodo, rows, cb) {
    var codes = {};
    rows.forEach(function (row) {
        var code = esc(row.codplancta);
        if (code) codes[code] = true;
    });
    var list = Object.keys(codes);
    if (!list.length) return cb(null, {});

    var sql = "SELECT codplancta, nombre, imputable, auxiliar " +
        "FROM dba.plancta " +
        "WHERE cod_empresa = " + sqlValue(empresa) + " " +
        "AND periodo = " + sqlValue(periodo) + " " +
        "AND codplancta IN ('" + list.join("','") + "')";

    conn.exec(sql, function (err, accountRows) {
        if (err) return cb(err);
        var rules = {};
        (accountRows || []).forEach(function (row) {
            var code = String(row.codplancta || row.CodPlanCta || row.CODPLANCTA || '').trim();
            if (!code) return;
            rules[code] = {
                imputable: String(row.imputable || row.Imputable || row.IMPUTABLE || '').trim().toUpperCase(),
                auxiliar: String(row.auxiliar || row.Auxiliar || row.AUXILIAR || '').trim().toUpperCase()
            };
        });
        cb(null, rules);
    });
}

function validateTipoAsiento(tipoAsiento, cb) {
    var sql = "SELECT TipoAsiento FROM DBA.TipoAsiento WHERE TipoAsiento = " + sqlValue(tipoAsiento);
    conn.exec(sql, function (err, rows) {
        if (err) return cb(err);
        if (!rows || !rows.length) return cb(new Error('El Tipo de Asiento no existe en DBA.TipoAsiento: ' + tipoAsiento + '.'));
        cb(null);
    });
}

function validateUsuario(username, cb) {
    var user = esc(username);
    if (!user) return cb(new Error('Debe indicar el usuario que carga el asiento.'));

    var sql = "SELECT Cod_Usuario FROM DBA.Usuarios WHERE lower(Cod_Usuario) = " + sqlValue(user.toLowerCase());
    conn.exec(sql, function (err, rows) {
        if (err) return cb(err);
        if (!rows || !rows.length) {
            return cb(new Error("El usuario '" + user + "' no existe en DBA.USUARIOS. Verifique el usuario integrado antes de grabar el asiento."));
        }
        cb(null);
    });
}

function normalizeRows(rows, accountRules) {
    var cleanRows = [];
    var totalDebito = 0;
    var totalCredito = 0;
    var totalDebitoME = 0;
    var totalCreditoME = 0;

    for (var i = 0; i < rows.length; i += 1) {
        var row = rows[i] || {};
        var codplancta = esc(row.codplancta);
        var codplanaux = esc(row.codplanaux);
        if (!codplancta) continue;

        var rule = accountRules[codplancta] || {};
        if (!rule.imputable && !rule.auxiliar) throw new Error('La cuenta ' + codplancta + ' no existe para el periodo seleccionado.');
        if (rule.auxiliar === 'S' && !codplanaux) throw new Error('Debe completar el Auxiliar para la cuenta ' + codplancta + '.');
        if (rule.auxiliar === 'N' && codplanaux) throw new Error('Esta cuenta no usa auxiliares: ' + codplancta + '.');

        var debito = normalizeNumber(row.debito);
        var credito = normalizeNumber(row.credito);
        var debitome = normalizeNumber(row.debitome);
        var creditome = normalizeNumber(row.creditome);
        if (debito <= 0 && credito <= 0 && debitome <= 0 && creditome <= 0) {
            throw new Error('Debe completar el Importe Credito o Debito en la linea ' + (i + 1) + '.');
        }

        var dbcr = (debito > 0 || debitome > 0) ? 'D' : 'C';
        var importe = dbcr === 'D' ? debito : credito;
        var importeme = dbcr === 'D' ? debitome : creditome;

        totalDebito += debito;
        totalCredito += credito;
        totalDebitoME += debitome;
        totalCreditoME += creditome;

        cleanRows.push({
            codplancta: codplancta,
            codplanaux: codplanaux,
            dbcr: dbcr,
            importe: importe,
            importeme: importeme,
            debito: debito,
            credito: credito,
            debitome: debitome,
            creditome: creditome,
            concepto: esc(row.concepto),
            proyecto: esc(row.proyecto),
            rubro: esc(row.rubro)
        });
    }

    if (!cleanRows.length) throw new Error('El asiento no cuenta con detalles.');
    if (Math.trunc(totalDebito * 100) !== Math.trunc(totalCredito * 100)) {
        throw new Error('El Asiento no Balancea. Debito: ' + totalDebito.toFixed(2) + ' - Credito: ' + totalCredito.toFixed(2) + '.');
    }
    if (Math.round(totalDebitoME * 100) !== Math.round(totalCreditoME * 100)) {
        throw new Error('El Asiento no Balancea en Moneda Extranjera. Debito: ' + totalDebitoME.toFixed(2) + ' - Credito: ' + totalCreditoME.toFixed(2) + '.');
    }

    return cleanRows;
}

function buildCabSql(body, nrotransac) {
    return "INSERT INTO DBA.AsientosCab (" +
        "Cod_Empresa, NroTransac, Periodo, CodMoneda, TipoAsiento, NroCompr, Fecha, Transf, Origen, NroAsiento, Autorizado, CargadoPor, FechaCarga" +
        ") VALUES (" +
        sqlValue(body.empresa) + ", " +
        numValue(nrotransac) + ", " +
        sqlValue(body.periodo) + ", " +
        sqlValue(body.codmoneda) + ", " +
        sqlValue(body.tipoasiento) + ", " +
        (body.nrocompr ? numValue(body.nrocompr) : 'NULL') + ", " +
        sqlValue(body.fecha) + ", " +
        "'N', 'CON', NULL, " + sqlValue(body.autorizado) + ", " +
        sqlValue(body.usuario || '') + ", " +
        nowSql() +
        ")";
}

function buildDetSql(body, row, nrotransac, linea) {
    return "INSERT INTO DBA.AsientosDet (" +
        "Cod_Empresa, NroTransac, Linea, Periodo, CodPlanCta, CodPlanAux, DBCR, Conciliado, PreConciliado, Importe, ImporteME, Concepto, Debito, Credito, DebitoME, CreditoME, NroOrden" +
        ") VALUES (" +
        sqlValue(body.empresa) + ", " +
        numValue(nrotransac) + ", " +
        numValue(linea) + ", " +
        sqlValue(body.periodo) + ", " +
        sqlValue(row.codplancta) + ", " +
        sqlValue(row.codplanaux) + ", " +
        sqlValue(row.dbcr) + ", " +
        "'N', 'N', " +
        numValue(row.importe, 4) + ", " +
        numValue(row.importeme, 4) + ", " +
        sqlValue(row.concepto) + ", " +
        numValue(row.debito, 4) + ", " +
        numValue(row.credito, 4) + ", " +
        numValue(row.debitome, 4) + ", " +
        numValue(row.creditome, 4) + ", " +
        numValue(linea) +
        ")";
}

function recalcularImportes(empresa, periodo, cb) {
    var sql = "UPDATE dba.asientosdet " +
        "SET importe = CASE WHEN dbcr = 'D' THEN round(debito, 0) WHEN dbcr = 'C' THEN round(credito, 0) ELSE round(importe, 0) END, " +
        "importeme = CASE WHEN dbcr = 'D' THEN round(debitome, 2) WHEN dbcr = 'C' THEN round(creditome, 2) ELSE round(importeme, 2) END, " +
        "debito = round(debito, 0), credito = round(credito, 0), debitome = round(debitome, 2), creditome = round(creditome, 2) " +
        "WHERE cod_empresa = " + sqlValue(empresa) + " AND periodo = " + sqlValue(periodo);

    conn.exec(sql, function (err) {
        cb(err || null);
    });
}

AsientoManual.guardar = function (payload, cb) {
    payload = payload || {};
    var body = {
        empresa: esc(payload.empresa),
        periodo: esc(payload.periodo),
        tipoasiento: esc(payload.tipoasiento),
        fecha: esc(payload.fecha),
        nrocompr: payload.nrocompr,
        codmoneda: esc(payload.codmoneda || payload.moneda || ''),
        autorizado: String(payload.autorizado || 'N').trim().toUpperCase() === 'S' ? 'S' : 'N',
        usuario: esc(payload.usuario || ''),
        rows: Array.isArray(payload.rows) ? payload.rows : []
    };

    if (!body.empresa || !body.periodo || !body.tipoasiento || !body.fecha || !body.codmoneda) {
        return cb(null, { ok: false, message: 'Debe completar empresa, periodo, fecha, moneda y tipo de asiento.' });
    }

    validatePeriodo(body.empresa, body.periodo, body.fecha, function (periodErr) {
        if (periodErr) return cb(null, { ok: false, message: periodErr.message || String(periodErr) });

        validateUsuario(body.usuario, function (userErr) {
            if (userErr) return cb(null, { ok: false, message: userErr.message || String(userErr) });

            validateTipoAsiento(body.tipoasiento, function (tipoErr) {
                if (tipoErr) return cb(null, { ok: false, message: tipoErr.message || String(tipoErr) });

                fetchAccountRules(body.empresa, body.periodo, body.rows, function (rulesErr, rules) {
                    if (rulesErr) return cb(rulesErr);

                    var rows;
                    try {
                        rows = normalizeRows(body.rows, rules);
                    } catch (validationErr) {
                        return cb(null, { ok: false, message: validationErr.message || String(validationErr) });
                    }

                    execOnly(beginSql(), function (beginErr) {
                        if (beginErr) return cb(beginErr);

                        var nextSql = "SELECT MAX(NroTransac) AS nrotransac FROM DBA.AsientosCab WHERE Cod_Empresa = " + sqlValue(body.empresa);
                        conn.exec(nextSql, function (nextErr, nextRows) {
                            if (nextErr) return rollbackWith(nextErr, cb);

                            var maxRow = (nextRows || [])[0] || {};
                            var nrotransac = normalizeNumber(maxRow.nrotransac || maxRow.NroTransac || maxRow.NROTRANSAC || 0) + 1;
                            var updateControlSql = "UPDATE DBA.Control SET CtasToCont = " + numValue(nrotransac) + " WHERE Cod_Empresa = " + sqlValue(body.empresa);

                            conn.exec(updateControlSql, function (controlErr) {
                                if (controlErr) return rollbackWith(controlErr, cb);

                                conn.exec(buildCabSql(body, nrotransac), function (cabErr) {
                                    if (cabErr) return rollbackWith(cabErr, cb);

                                    var idx = 0;
                                    function nextDetail() {
                                        if (idx >= rows.length) {
                                            return recalcularImportes(body.empresa, body.periodo, function (recalcErr) {
                                                if (recalcErr) return rollbackWith(recalcErr, cb);
                                                execOnly('COMMIT', function (commitErr) {
                                                    if (commitErr) return cb(commitErr);
                                                    cb(null, { ok: true, nrotransac: nrotransac });
                                                });
                                            });
                                        }

                                        var detailSql = buildDetSql(body, rows[idx], nrotransac, idx + 1);
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
                });
            });
        });
    });
};

module.exports = AsientoManual;
