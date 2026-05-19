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
        "Cod_Empresa, NroTransac, Periodo, CodMoneda, TipoAsiento, NroCompr, Fecha, Transf, Origen, NroAsiento, FactCambio, Autorizado, CargadoPor, FechaCarga" +
        ") VALUES (" +
        sqlValue(body.empresa) + ", " +
        numValue(nrotransac) + ", " +
        sqlValue(body.periodo) + ", " +
        sqlValue(body.codmoneda) + ", " +
        sqlValue(body.tipoasiento) + ", " +
        (body.nrocompr ? numValue(body.nrocompr) : 'NULL') + ", " +
        sqlValue(body.fecha) + ", " +
        "'N', 'CON', NULL, " +
        (body.factcambio ? numValue(body.factcambio, 4) : 'NULL') + ", " +
        sqlValue(body.autorizado) + ", " +
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

function buildCabUpdateSql(body, nrotransac) {
    return "UPDATE DBA.AsientosCab SET " +
        "CodMoneda = " + sqlValue(body.codmoneda) + ", " +
        "TipoAsiento = " + sqlValue(body.tipoasiento) + ", " +
        "NroCompr = " + (body.nrocompr ? numValue(body.nrocompr) : 'NULL') + ", " +
        "Fecha = " + sqlValue(body.fecha) + ", " +
        "FactCambio = " + (body.factcambio ? numValue(body.factcambio, 4) : 'NULL') + ", " +
        "Autorizado = " + sqlValue(body.autorizado) + " " +
        "WHERE Cod_Empresa = " + sqlValue(body.empresa) + " " +
        "AND Periodo = " + sqlValue(body.periodo) + " " +
        "AND NroTransac = " + numValue(nrotransac);
}

function insertDetails(body, rows, nrotransac, cb) {
    var idx = 0;

    function nextDetail() {
        if (idx >= rows.length) return cb(null);

        var detailSql = buildDetSql(body, rows[idx], nrotransac, idx + 1);
        idx += 1;
        conn.exec(detailSql, function (detErr) {
            if (detErr) return cb(detErr);
            nextDetail();
        });
    }

    nextDetail();
}

function recalcularImportes(empresa, periodo, cb) {
    var sql = "UPDATE dba.asientosdet " +
        "SET importe = CASE WHEN dbcr = 'D' THEN round(debito, 0) WHEN dbcr = 'C' THEN round(credito, 0) ELSE round(importe, 0) END, " +
        "importeme = CASE WHEN dbcr = 'D' THEN round(debitome, 2) WHEN dbcr = 'C' THEN round(creditome, 2) ELSE round(importeme, 2) END, " +
        "debito = round(debito, 0), credito = round(credito, 0), debitome = round(debitome, 2), creditome = round(creditome, 2) " +
        "WHERE cod_empresa = " + sqlValue(empresa) + " AND periodo = " + sqlValue(periodo);

    if (isPostgres()) {
        return conn.exec(sql, function (err) {
            cb(err || null);
        });
    }

    execOnly("SET TEMPORARY OPTION fire_triggers = 'off'", function (disableErr) {
        if (disableErr) return cb(disableErr);
        conn.exec(sql, function (err) {
            execOnly("SET TEMPORARY OPTION fire_triggers = 'on'", function (enableErr) {
                cb(err || enableErr || null);
            });
        });
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
        factcambio: normalizeNumber(payload.factcambio),
        nrotransac: normalizeNumber(payload.nrotransac),
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

                        if (body.nrotransac > 0) {
                            var existsSql = "SELECT NroTransac FROM DBA.AsientosCab " +
                                "WHERE Cod_Empresa = " + sqlValue(body.empresa) + " " +
                                "AND Periodo = " + sqlValue(body.periodo) + " " +
                                "AND NroTransac = " + numValue(body.nrotransac);

                            return conn.exec(existsSql, function (existsErr, existsRows) {
                                if (existsErr) return rollbackWith(existsErr, cb);
                                if (!existsRows || !existsRows.length) {
                                    return rollbackWith(new Error('No se encontro el asiento ' + body.nrotransac + ' para actualizar.'), cb);
                                }

                                conn.exec(buildCabUpdateSql(body, body.nrotransac), function (updateErr) {
                                    if (updateErr) return rollbackWith(updateErr, cb);

                                    var deleteSql = "DELETE FROM DBA.AsientosDet " +
                                        "WHERE Cod_Empresa = " + sqlValue(body.empresa) + " " +
                                        "AND Periodo = " + sqlValue(body.periodo) + " " +
                                        "AND NroTransac = " + numValue(body.nrotransac);

                                    conn.exec(deleteSql, function (deleteErr) {
                                        if (deleteErr) return rollbackWith(deleteErr, cb);

                                        insertDetails(body, rows, body.nrotransac, function (detailsErr) {
                                            if (detailsErr) return rollbackWith(detailsErr, cb);

                                            return recalcularImportes(body.empresa, body.periodo, function (recalcErr) {
                                                if (recalcErr) return rollbackWith(recalcErr, cb);
                                                execOnly('COMMIT', function (commitErr) {
                                                    if (commitErr) return cb(commitErr);
                                                    cb(null, { ok: true, nrotransac: body.nrotransac, updated: true });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        }

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

                                    insertDetails(body, rows, nrotransac, function (detailsErr) {
                                        if (detailsErr) return rollbackWith(detailsErr, cb);

                                            return recalcularImportes(body.empresa, body.periodo, function (recalcErr) {
                                                if (recalcErr) return rollbackWith(recalcErr, cb);
                                                execOnly('COMMIT', function (commitErr) {
                                                    if (commitErr) return cb(commitErr);
                                                    cb(null, { ok: true, nrotransac: nrotransac });
                                                });
                                            });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

AsientoManual.imprimir = function (params, cb) {
    params = params || {};
    var empresa = esc(params.empresa);
    var periodo = esc(params.periodo);
    var nrotransac = normalizeNumber(params.nrotransac);

    if (!empresa || !periodo || !nrotransac) {
        return cb(null, { ok: false, message: 'Debe indicar empresa, periodo y numero de transaccion.' });
    }

    var lineExpr = isPostgres() ? 'COALESCE(ad.NroOrden, ad.Linea)' : 'isnull(ad.NroOrden, ad.Linea)';
    var sql = "SELECT " +
        "ad.Cod_Empresa AS cod_empresa, " +
        "emp.Des_Empresa AS empresa_nombre, " +
        "ad.NroTransac AS nrotransac, " +
        "ac.TipoAsiento AS tipoasiento, " +
        "ac.NroCompr AS nrocompr, " +
        "ac.CodMoneda AS codmoneda, " +
        lineExpr + " AS linea, " +
        "ad.CodPlanCta AS codplancta, " +
        "ad.CodPlanAux AS codplanaux, " +
        "ad.Concepto AS concepto, " +
        "ad.DbCr AS dbcr, " +
        "ad.Importe AS importe, " +
        "ad.ImporteME AS importeme, " +
        "ac.Fecha AS fecha, " +
        "ad.DEBITO AS debito, " +
        "ad.CREDITO AS credito, " +
        "ad.DEBITOME AS debito_me, " +
        "ad.CREDITOME AS credito_me, " +
        "pc.Nombre AS nombre_cuenta, " +
        "pa.Nombre AS nombre_auxiliar, " +
        "ta.Descrip AS tipo_descrip, " +
        "ac.autorizado AS autorizado, " +
        "ac.cargadopor AS cargadopor, " +
        "ac.fechacarga AS fechacarga, " +
        "ac.autorizadopor AS autorizadopor, " +
        "ac.fechaautoriz AS fechaautoriz, " +
        "ac.nroasiento AS nroasiento, " +
        "ac.factcambio AS factcambio, " +
        "upper(ad.Concepto) AS buscar_concepto " +
        "FROM dba.asientosdet ad " +
        "JOIN dba.asientoscab ac ON ac.Cod_Empresa = ad.Cod_Empresa AND ac.Periodo = ad.Periodo AND ac.NroTransac = ad.NroTransac " +
        "JOIN DBA.PLANCTA pc ON ad.Cod_Empresa = pc.Cod_Empresa AND ad.Periodo = pc.Periodo AND ad.CodPlanCta = pc.CodPlanCta " +
        "LEFT JOIN DBA.PLANAUXI pa ON ad.Cod_Empresa = pa.Cod_Empresa AND ad.Periodo = pa.Periodo AND ad.CodPlanCta = pa.CodPlanCta AND ad.CodPlanAux = pa.CodPlanAux " +
        "LEFT JOIN DBA.EMPRESA emp ON emp.Cod_Empresa = ad.Cod_Empresa " +
        "JOIN dba.tipoasiento ta ON ac.TipoAsiento = ta.TipoAsiento " +
        "WHERE ta.tpdef <> 'N' " +
        "AND ad.Cod_Empresa = " + sqlValue(empresa) + " " +
        "AND ad.Periodo = " + sqlValue(periodo) + " " +
        "AND ad.NroTransac = " + numValue(nrotransac) + " " +
        "ORDER BY ad.Cod_Empresa ASC, ad.NroTransac ASC, " + lineExpr + " ASC";

    conn.exec(sql, function (err, rows) {
        if (err) return cb(err);
        if (!rows || !rows.length) {
            return cb(null, { ok: false, message: 'No se encontraron datos para imprimir el asiento ' + nrotransac + '.' });
        }
        cb(null, { ok: true, rows: rows });
    });
};

module.exports = AsientoManual;
