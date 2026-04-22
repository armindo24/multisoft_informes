var conn = require('../db_integrado');

var Migraciones = {};

function esc(v) {
    return String(v == null ? '' : v).replace(/'/g, "''");
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

function beginSql() {
    return dbIsPostgres() ? 'BEGIN' : 'BEGIN TRANSACTION';
}

function nowSql() {
    return dbIsPostgres() ? 'CURRENT_TIMESTAMP' : 'CURRENT TIMESTAMP';
}

function sqlValue(v) {
    if (v === null || typeof v === 'undefined' || v === '') return 'NULL';
    return "'" + esc(v) + "'";
}

function numValue(v, dec) {
    if (v === null || typeof v === 'undefined' || v === '') return 'NULL';
    var n = Number(v);
    if (!isFinite(n)) return 'NULL';
    return (typeof dec === 'number') ? n.toFixed(dec) : String(n);
}

function normalizeDbCr(v) {
    var s = String(v || '').trim().toUpperCase();
    if (s === 'D' || s === 'DB' || s === 'DEBITO') return 'D';
    if (s === 'C' || s === 'CR' || s === 'CREDITO') return 'C';
    return s;
}

function execRows(sql, cb) {
    conn.exec(sql, function (err, rows) {
        if (err) return cb(err);
        cb(null, rows || []);
    });
}

function execOnly(sql, cb) {
    conn.exec(sql, function (err) {
        cb(err || null);
    });
}

function getNextNroTransac(empresa, cb) {
    execRows(
        "SELECT MAX(NroTransac) as max_nro FROM DBA.ASIENTOSCAB " +
        "WHERE Cod_Empresa = '" + esc(empresa) + "'",
        function (err, rows) {
            if (err) return cb(err);
            var next = Number((rows[0] && (rows[0].max_nro || rows[0].MAX_NRO || rows[0].NroTransac)) || 0) + 1;
            cb(null, next);
        }
    );
}

function isDuplicatePkError(err) {
    var msg = String(err && (err.message || err) || '').toLowerCase();
    return msg.indexOf('primary key') >= 0 && msg.indexOf('not unique') >= 0;
}

function rollbackWith(err, process, cb) {
    execOnly('ROLLBACK', function () {
        cb(null, {
            ok: false,
            error: err && (err.message || String(err)),
            process: process || []
        });
    });
}

function buildCabSql(empresa, periodo, monedaLocal, username, head, nextNro) {
    return "INSERT INTO DBA.ASIENTOSCAB (" +
        "Cod_Empresa, NroTransac, Periodo, CodMoneda, TipoAsiento, NroCompr, Fecha, Transf, Origen, NroAsiento, Autorizado, CargadoPor, FechaCarga, migrado" +
        ") VALUES (" +
        sqlValue(empresa) + ", " +
        numValue(nextNro) + ", " +
        sqlValue(periodo) + ", " +
        sqlValue(monedaLocal) + ", " +
        sqlValue(head.tipoasiento) + ", " +
        numValue(head.nrocompr) + ", " +
        sqlValue(head.fecha) + ", " +
        "'N', 'CON', NULL, 'N', " +
        sqlValue(username) + ", " +
        nowSql() + ", " +
        "'S'" +
        ")";
}

function buildDetSql(empresa, periodo, row, nextNro, linea) {
    var dbcr = normalizeDbCr(row.dbcr);
    var importe = Number(row.importe || 0);
    var importeme = Number(row.importeme || 0);
    var debito = (dbcr === 'D') ? importe : 0;
    var credito = (dbcr === 'C') ? importe : 0;
    var debitome = (dbcr === 'D') ? importeme : 0;
    var creditome = (dbcr === 'C') ? importeme : 0;

    return "INSERT INTO DBA.ASIENTOSDET (" +
        "Cod_Empresa, NroTransac, Linea, Periodo, CodPlanCta, CodPlanAux, DbCr, Conciliado, PreConciliado, Importe, ImporteME, Concepto, Debito, Credito, DebitoME, CreditoME, NroOrden" +
        ") VALUES (" +
        sqlValue(empresa) + ", " +
        numValue(nextNro) + ", " +
        numValue(linea) + ", " +
        sqlValue(periodo) + ", " +
        sqlValue(row.codplancta) + ", " +
        sqlValue(row.codplanaux) + ", " +
        sqlValue(dbcr) + ", " +
        "'N', 'N', " +
        numValue(importe, 4) + ", " +
        numValue(importeme, 4) + ", " +
        sqlValue(row.concepto) + ", " +
        numValue(debito, 4) + ", " +
        numValue(credito, 4) + ", " +
        numValue(debitome, 4) + ", " +
        numValue(creditome, 4) + ", " +
        numValue(linea) +
        ")";
}

function buildVtaCabSql(empresa, periodo, username, head, codTpComp, codSucursal) {
    var exenta = Number(head.exenta || 0);
    var grav5 = Number(head.to_gravado_5 || 0);
    var grav10 = Number(head.to_gravado_10 || 0);
    var iva5 = Number(head.total_iva_5 || 0);
    var iva10 = Number(head.total_iva_10 || 0);
    var totalIva = iva5 + iva10;
    var totalGravado = grav5 + grav10;
    var totalVenta = Number(head.total_neto || head.total || 0);
    var idTimb = 0;

    return "INSERT INTO DBA.VTACAB (" +
        "Cod_Empresa, Cod_Tp_Comp, Comp_Numero, Cod_Sucursal, Cod_Cliente, Lista_Prec, " +
        "Fha_Cbte, Cod_Con_Vta, Cod_Tp_Pago, Tipo_Vta, Cod_Vendedor, Com_Vendedor, ComisMan, " +
        "CodMoneda, Fact_Cambio, Descuento, To_Exento, To_Gravado, Total_IVA, Tipo_IVA, " +
        "Autorizado, Anulado, Cod_Usuario, Razon_Social, Direccion, RUC, Telefono, Observ, " +
        "CodPlanCta, CodPlanAux, Total_venta, Periodo, nrotimb, cod_establecimiento, cod_ptoexpedicion, Comp_Nro_Timb, id_timb" +
        ") VALUES (" +
        sqlValue(empresa) + ", " +
        sqlValue(codTpComp) + ", " +
        numValue(head.comp_numero) + ", " +
        sqlValue(codSucursal) + ", " +
        sqlValue(head.cod_cliente || null) + ", " +
        "1, " +
        sqlValue(head.fha_cbte) + ", " +
        sqlValue(head.cod_con_vta) + ", " +
        "'E', 'NO', NULL, 0, 'N', " +
        sqlValue(head.codmoneda || null) + ", " +
        numValue(head.fact_cambio) + ", " +
        "0, " +
        numValue(exenta, 4) + ", " +
        numValue(totalGravado, 4) + ", " +
        numValue(totalIva, 4) + ", " +
        "'D', 'N', " +
        sqlValue(head.anulado || 'N') + ", " +
        sqlValue(username) + ", " +
        sqlValue(head.razon_social || 'Sin Nombre') + ", " +
        sqlValue(head.direccion || null) + ", " +
        sqlValue(head.ruc || null) + ", " +
        sqlValue(head.telefono || null) + ", " +
        sqlValue(head.observ || null) + ", " +
        sqlValue(head.cta_cliente || null) + ", " +
        sqlValue(head.aux_cliente || null) + ", " +
        numValue(totalVenta, 4) + ", " +
        sqlValue(periodo) + ", " +
        numValue(head.nrotimb) + ", " +
        sqlValue(head.cod_establecimiento || null) + ", " +
        sqlValue(head.cod_ptoexpedicion || null) + ", " +
        numValue(head.nrotimb) + ", " +
        "0" +
        ")";
}

function buildVtaDetSql(empresa, periodo, row, codTpComp, codSucursal, codDeposito, idTimb) {
    return "INSERT INTO DBA.VTADET (" +
        "Cod_Empresa, Cod_Tp_Comp, Comp_Numero, Linea, Cod_Sucursal, Cod_Deposito, Cod_Articulo, " +
        "Cantidad, Pr_Unit, Total, Descrip, Total_Neto, Periodo, id_timb" +
        ") VALUES (" +
        sqlValue(empresa) + ", " +
        sqlValue(codTpComp) + ", " +
        numValue(row.comp_numero) + ", " +
        numValue(row.linea) + ", " +
        sqlValue(codSucursal) + ", " +
        sqlValue(codDeposito) + ", " +
        sqlValue(row.cod_articulo) + ", " +
        numValue(row.cantidad, 4) + ", " +
        numValue(row.pr_unit, 4) + ", " +
        numValue(row.total, 4) + ", " +
        sqlValue(row.descrip || null) + ", " +
        numValue(row.total_neto, 4) + ", " +
        sqlValue(periodo) + ", " +
        numValue(idTimb) +
        ")";
}

function uniqueClean(list) {
    var seen = {};
    var out = [];
    (Array.isArray(list) ? list : []).forEach(function (v) {
        var s = String(v == null ? '' : v).trim();
        if (!s || seen[s]) return;
        seen[s] = true;
        out.push(s);
    });
    return out;
}

function sqlInList(list) {
    var items = uniqueClean(list);
    if (!items.length) return "('')";
    return '(' + items.map(function (v) { return "'" + esc(v) + "'"; }).join(',') + ')';
}

Migraciones.ventasReferencias = function (params, cb) {
    var empresa = String(params && params.empresa || '').trim();
    var empresaDesc = String(params && params.empresa_desc || '').trim();
    var periodo = String(params && params.periodo || '').trim();
    var cuentas = uniqueClean(params && params.cuentas_cliente);
    var auxiliares = uniqueClean(params && params.aux_clientes);
    var articulos = uniqueClean(params && params.articulos);
    var condiciones = uniqueClean(params && params.condiciones);
    var monedas = uniqueClean(params && params.monedas).map(function (m) { return m.toUpperCase(); });
    var rucs = uniqueClean(params && params.rucs);
    var rucsNormalized = uniqueClean(rucs.map(function (r) {
        return String(r || '').replace(/\D/g, '');
    }).filter(function (r) { return r; }));

    if (!empresa || !periodo) {
        return cb(null, {
            ok: false,
            error: 'Empresa y periodo son obligatorios.',
            data: { plancta: [], planauxi: [], articulos: [], terminos: [], monedas: [] }
        });
    }

    var result = { plancta: [], planauxi: [], articulos: [], terminos: [], monedas: [], clientes: [] };

    function loadPlancta(next) {
        if (!cuentas.length) return next();
        var sql =
            "SELECT CodPlanCta, Imputable, Auxiliar " +
            "FROM DBA.PlanCta " +
            "WHERE Cod_Empresa = '" + esc(empresa) + "' " +
            "AND Periodo = '" + esc(periodo) + "' " +
            "AND CodPlanCta IN " + sqlInList(cuentas);
        execRows(sql, function (err, rows) {
            if (!err) result.plancta = rows || [];
            next(err);
        });
    }

    function loadPlanauxi(next) {
        if (!cuentas.length || !auxiliares.length) return next();
        var sql =
            "SELECT CodPlanCta, CodPlanAux " +
            "FROM DBA.PlanAuxi " +
            "WHERE Cod_Empresa = '" + esc(empresa) + "' " +
            "AND Periodo = '" + esc(periodo) + "' " +
            "AND CodPlanCta IN " + sqlInList(cuentas) + " " +
            "AND CodPlanAux IN " + sqlInList(auxiliares);
        execRows(sql, function (err, rows) {
            if (!err) result.planauxi = rows || [];
            next(err);
        });
    }

    function loadArticulos(next) {
        if (!articulos.length) return next();
        var sql =
            "SELECT Cod_Articulo " +
            "FROM DBA.Articulo " +
            "WHERE Cod_Empresa = '" + esc(empresa) + "' " +
            "AND Cod_Articulo IN " + sqlInList(articulos);
        execRows(sql, function (err, rows) {
            if (!err) result.articulos = rows || [];
            next(err);
        });
    }

    function loadTerminos(next) {
        if (!condiciones.length) return next();
        var sql =
            "SELECT Cod_Con_Vta " +
            "FROM DBA.Terminos " +
            "WHERE Cod_Con_Vta IN " + sqlInList(condiciones);
        execRows(sql, function (err, rows) {
            if (!err) result.terminos = rows || [];
            next(err);
        });
    }

    function loadMonedas(next) {
        if (!monedas.length) return next();
        var sql =
            "SELECT simbolo " +
            "FROM DBA.Moneda " +
            "WHERE upper(trim(simbolo)) IN " + sqlInList(monedas);
        execRows(sql, function (err, rows) {
            if (!err) result.monedas = rows || [];
            next(err);
        });
    }

    function loadClientes(next) {
        if (!rucsNormalized.length) return next();
        var sql =
            "SELECT Cod_Cliente, RUC " +
            "FROM DBA.Clientes " +
            "WHERE Cod_Empresa = '" + esc(empresa) + "' " +
            "AND REPLACE(REPLACE(REPLACE(RUC,'-',''),'.',''),' ','') IN " + sqlInList(rucsNormalized);
        execRows(sql, function (err, rows) {
            if (!err) result.clientes = rows || [];
            next(err);
        });
    }

    loadPlancta(function (err) {
        if (err) return cb(err);
        loadPlanauxi(function (err2) {
            if (err2) return cb(err2);
            loadArticulos(function (err3) {
                if (err3) return cb(err3);
                loadTerminos(function (err4) {
                    if (err4) return cb(err4);
                    loadMonedas(function (err5) {
                        if (err5) return cb(err5);
                        loadClientes(function (err6) {
                            if (err6) return cb(err6);
                            cb(null, { ok: true, data: result });
                        });
                    });
                });
            });
        });
    });
};

function nextClienteSql(empresa) {
    if (dbIsPostgres()) {
        return "SELECT MAX(LPAD(cod_cliente, 8, '0')) as max_cod " +
            "FROM dba.clientes WHERE cod_empresa = '" + esc(empresa) + "'";
    }
    return "SELECT MAX(REPLICATE('0', (8 - LEN(cod_cliente))) + cod_cliente) as max_cod " +
        "FROM DBA.CLIENTES WHERE cod_empresa = '" + esc(empresa) + "'";
}

function generateClienteCode(rawMax) {
    var n = parseInt(String(rawMax || '0').replace(/\D/g, ''), 10) || 0;
    var next = n + 1;
    var s = String(next);
    if (s.length >= 8) return s;
    return new Array(8 - s.length + 1).join('0') + s;
}

Migraciones.crearClientesVentas = function (params, cb) {
    var empresa = String(params && params.empresa || '').trim();
    var codTpComp = String(params && params.cod_tp_comp || '').trim();
    var codSucursal = String(params && params.cod_sucursal || '').trim();
    var usuarios = String(params && params.cod_usuario || '').trim().slice(0, 16);
    var clientes = Array.isArray(params && params.clientes) ? params.clientes : [];

    if (!empresa || !codTpComp || !clientes.length) {
        return cb(null, { ok: false, error: 'Datos incompletos para crear clientes.', created: [] });
    }

    var created = [];

    execRows(
        "SELECT CodPlanCta, CodPlanAux, CodPlanCtaME, CodPlanAuxME " +
        "FROM DBA.TPOCBTE WHERE Cod_Empresa = '" + esc(empresa) + "' " +
        "AND Cod_Tp_Comp = '" + esc(codTpComp) + "'",
        function (tpErr, tpRows) {
            if (tpErr) return cb(tpErr);
            var tp = tpRows && tpRows[0] ? tpRows[0] : {};
            var plancta = tp.CodPlanCta || tp.codplancta || null;
            var planaux = tp.CodPlanAux || tp.codplanaux || null;
            var planctaME = tp.CodPlanCtaME || tp.codplanctame || null;
            var planauxME = tp.CodPlanAuxME || tp.codplanauxme || null;

            function ensureClienteAt(index) {
                if (index >= clientes.length) {
                    return cb(null, { ok: true, created: created });
                }

                var cli = clientes[index] || {};
                var ruc = String(cli.ruc || '').trim();
                var razon = String(cli.razon_social || '').trim();
                var cond = String(cli.cod_con_vta || '').trim();
                var moneda = String(cli.codmoneda || '').trim();
                var cta = String(cli.codplancta || plancta || '').trim();
                var aux = String(cli.codplanaux || planaux || '').trim();

                if (!ruc) {
                    return ensureClienteAt(index + 1);
                }

                execRows(
                    "SELECT Cod_Cliente FROM DBA.CLIENTES WHERE Cod_Empresa = '" + esc(empresa) + "' " +
                    "AND RUC = '" + esc(ruc) + "'",
                    function (findErr, rows) {
                        if (findErr) return cb(findErr);
                        if (rows && rows[0] && (rows[0].Cod_Cliente || rows[0].cod_cliente)) {
                            return ensureClienteAt(index + 1);
                        }

                        execRows(nextClienteSql(empresa), function (maxErr, maxRows) {
                            if (maxErr) return cb(maxErr);
                            var rawMax = maxRows && maxRows[0] ? (maxRows[0].max_cod || maxRows[0].MAX_COD) : null;
                            var codCliente = generateClienteCode(rawMax);

                            var insertSql =
                                "INSERT INTO DBA.CLIENTES (" +
                                "Cod_Empresa, Cod_Cliente, Cod_Con_Vta, Cod_Zona, Cod_Tp_Cliente, Cod_Calificacion, Cod_Localidad, " +
                                "CodMoneda, Cod_Usuario, Razon_Social, RUC, nrocliente, plantilla, Cod_Sucursal, SaldoPorCliente, " +
                                "CodPlanCta, CodPlanAux, CodPlanCta_ME, CodPlanAux_ME" +
                                ") VALUES (" +
                                sqlValue(empresa) + ", " +
                                sqlValue(codCliente) + ", " +
                                sqlValue(cond || '01') + ", " +
                                "'AS', '1', 'EX', '01', " +
                                sqlValue(moneda || 'GS') + ", " +
                                sqlValue(usuarios || 'SYSTEM') + ", " +
                                sqlValue(razon || 'Sin Nombre') + ", " +
                                sqlValue(ruc) + ", " +
                                "0, 'C', " +
                                sqlValue(codSucursal || null) + ", 'S', " +
                                sqlValue(cta || null) + ", " +
                                sqlValue(aux || null) + ", " +
                                sqlValue(planctaME || null) + ", " +
                                sqlValue(planauxME || null) +
                                ")";

                            execOnly(insertSql, function (insErr) {
                                if (insErr) return cb(insErr);
                                created.push({ ruc: ruc, cod_cliente: codCliente });
                                ensureClienteAt(index + 1);
                            });
                        });
                    }
                );
            }

            ensureClienteAt(0);
        }
    );
};

Migraciones.importAsientos = function (params, cb) {
    var empresa = String(params && params.empresa || '').trim();
    var periodo = String(params && params.periodo || '').trim();
    var rows = Array.isArray(params && params.rows) ? params.rows : [];
    var username = String(params && params.username || '').trim().slice(0, 16);
    var process = [];
    var compNums = uniqueClean(rows.map(function (r) {
        var raw = String(r && r.comp_numero || '').trim();
        if (!raw) return '';
        var digits = raw.replace(/\D/g, '');
        if (digits) {
            if (digits.length > 7) digits = digits.slice(-7);
            raw = String(parseInt(digits, 10));
        }
        return raw;
    }));

    if (!empresa || !periodo) {
        return cb(null, { ok: false, error: 'Empresa y periodo son obligatorios.', process: process });
    }
    if (!rows.length) {
        return cb(null, { ok: false, error: 'No hay filas validadas para migrar.', process: process });
    }

    process.push('Iniciando migracion para empresa ' + empresa + ' y periodo ' + periodo + '.');

    execRows(
        "SELECT MonedaLocal FROM DBA.CONTROL " +
        "WHERE Cod_Empresa = '" + esc(empresa) + "' " +
        "AND Periodo = '" + esc(periodo) + "'",
        function (controlErr, controlRows) {
            if (controlErr) {
                return cb(null, { ok: false, error: controlErr.message || String(controlErr), process: process });
            }

            var monedaLocal = '';
            if (controlRows && controlRows[0]) {
                monedaLocal = String(controlRows[0].MonedaLocal || controlRows[0].monedalocal || '').trim();
            }
            if (!monedaLocal) monedaLocal = 'GS';
            process.push('Moneda local detectada: ' + monedaLocal + '.');

            var groups = {};
            rows.forEach(function (row) {
                var key = String(row.cod_empresa || empresa) + '|' + String(row.nrotransaccion || '');
                if (!groups[key]) groups[key] = [];
                groups[key].push(row);
            });

            var groupKeys = Object.keys(groups).sort(function (a, b) {
                var aa = Number(String(a).split('|')[1] || 0);
                var bb = Number(String(b).split('|')[1] || 0);
                return aa - bb;
            });
            process.push('Asientos a migrar: ' + groupKeys.length + '.');

            execOnly(beginSql(), function (beginErr) {
                if (beginErr) {
                    return cb(null, { ok: false, error: beginErr.message || String(beginErr), process: process });
                }
                process.push('Transaccion iniciada.');

                var inserted = [];

                function processGroupAt(index) {
                    if (index >= groupKeys.length) {
                        return execOnly('COMMIT', function (commitErr) {
                            if (commitErr) {
                                return cb(null, {
                                    ok: false,
                                    error: commitErr.message || String(commitErr),
                                    process: process
                                });
                            }
                            cb(null, {
                                ok: true,
                                message: 'Migracion finalizada. Asientos insertados: ' + inserted.length + '. Desde ' + inserted[0] + ' hasta ' + inserted[inserted.length - 1] + '.',
                                inserted_count: inserted.length,
                                from_nrotransac: inserted[0],
                                to_nrotransac: inserted[inserted.length - 1],
                                process: process
                            });
                        });
                    }

                    var key = groupKeys[index];
                    var group = groups[key].slice().sort(function (x, y) {
                        return Number(x.linea || 0) - Number(y.linea || 0);
                    });
                    var head = group[0];
                    var sourceEmpresa = String(head.cod_empresa || empresa).trim();
                    var sourceNroTransac = String(head.nrotransaccion || '').trim();
                    var tries = 0;

                    process.push(
                        'Procesando asiento origen Empresa ' + sourceEmpresa +
                        ' / NroTransaccion ' + sourceNroTransac +
                        ' con ' + group.length + ' lineas.'
                    );

                    function tryInsertCabecera() {
                        tries += 1;
                        getNextNroTransac(empresa, function (nextErr, nextNro) {
                            if (nextErr) return rollbackWith(nextErr, process, cb);

                            process.push('Intento ' + tries + ': reservando NroTransac destino ' + nextNro + '.');
                            execOnly(buildCabSql(empresa, periodo, monedaLocal, username, head, nextNro), function (cabErr) {
                                if (cabErr) {
                                    if (isDuplicatePkError(cabErr) && tries < 5) {
                                        process.push('NroTransac ' + nextNro + ' ya existe. Reintentando...');
                                        return tryInsertCabecera();
                                    }
                                    return rollbackWith(
                                        new Error(
                                            'Error al insertar cabecera para Empresa ' + sourceEmpresa +
                                            ' / NroTransaccion ' + sourceNroTransac +
                                            ' / destino ' + nextNro + ': ' +
                                            (cabErr.message || String(cabErr))
                                        ),
                                        process,
                                        cb
                                    );
                                }

                                process.push('Cabecera insertada con NroTransac destino ' + nextNro + '.');

                                function insertDetailAt(detailIndex) {
                                    if (detailIndex >= group.length) {
                                        inserted.push(nextNro);
                                        process.push('Detalle insertado para NroTransac destino ' + nextNro + '.');
                                        return processGroupAt(index + 1);
                                    }

                                    var row = group[detailIndex];
                                    var linea = Number(row.linea || (detailIndex + 1));
                                    execOnly(buildDetSql(empresa, periodo, row, nextNro, linea), function (detErr) {
                                        if (detErr) {
                                            return rollbackWith(
                                                new Error(
                                                    'Error al insertar detalle para Empresa ' + sourceEmpresa +
                                                    ' / NroTransaccion ' + sourceNroTransac +
                                                    ' / linea ' + linea + ': ' +
                                                    (detErr.message || String(detErr))
                                                ),
                                                process,
                                                cb
                                            );
                                        }
                                        insertDetailAt(detailIndex + 1);
                                    });
                                }

                                insertDetailAt(0);
                            });
                        });
                    }

                    tryInsertCabecera();
                }

                processGroupAt(0);
            });
        }
    );
};

Migraciones.importVentas = function (params, cb) {
    var empresa = String(params && params.empresa || '').trim();
    var empresaDesc = String(params && params.empresa_desc || '').trim();
    var periodo = String(params && params.periodo || '').trim();
    var codTpComp = String(params && params.cod_tp_comp || '').trim();
    var codSucursal = String(params && params.cod_sucursal || '').trim();
    var codDeposito = String(params && params.cod_deposito || '01').trim();
    var rows = Array.isArray(params && params.rows) ? params.rows : [];
    var username = String(params && params.username || '').trim().slice(0, 16);
    var process = [];
    var clienteCache = {};
    var createdClientes = [];
    var plancta = null;
    var planaux = null;
    var planctaME = null;
    var planauxME = null;
    var compNums = uniqueClean(rows.map(function (r) {
        var raw = String(r && r.comp_numero || '').trim();
        if (!raw) return '';
        var digits = raw.replace(/\D/g, '');
        if (digits) {
            if (digits.length > 7) digits = digits.slice(-7);
            raw = String(parseInt(digits, 10));
        }
        return raw;
    }));

    if (!empresa || !periodo || !codTpComp || !codSucursal) {
        return cb(null, { ok: false, error: 'Empresa, periodo, tipo comprobante y sucursal son obligatorios.', process: process });
    }
    if (!rows.length) {
        return cb(null, { ok: false, error: 'No hay filas validadas para migrar.', process: process });
    }

    if (empresaDesc) {
        process.push('Iniciando migracion de ventas para empresa ' + empresa + ' - ' + empresaDesc + '.');
    } else {
        process.push('Iniciando migracion de ventas para empresa ' + empresa + '.');
    }

    execRows(
        "SELECT Cod_Usuario FROM DBA.Usuarios WHERE lower(Cod_Usuario) = '" + esc(username.toLowerCase()) + "'",
        function (usrErr, usrRows) {
            if (usrErr) {
                return cb(null, { ok: false, error: usrErr.message || String(usrErr), process: process });
            }
            if (!usrRows || !usrRows.length) {
                return cb(null, {
                    ok: false,
                    error: "Code: -194 Msg: No primary key value for foreign key 'usuarios_vtacab' in table 'VTACAB'. " +
                        "Usuario '" + username + "' no existe en DBA.USUARIOS.",
                    process: process
                });
            }

    var condiciones = uniqueClean(rows.map(function (r) { return r.cod_con_vta; }));
    if (!condiciones.length) {
        return cb(null, { ok: false, error: 'Cod_Con_Vta es obligatorio en el Excel.', process: process });
    }

    execRows(
        "SELECT Cod_Con_Vta FROM DBA.Terminos WHERE Cod_Con_Vta IN " + sqlInList(condiciones),
        function (termErr, termRows) {
            if (termErr) {
                return cb(null, { ok: false, error: termErr.message || String(termErr), process: process });
            }
            var existentes = {};
            (termRows || []).forEach(function (r) {
                var c = String(r.Cod_Con_Vta || r.cod_con_vta || '').trim();
                if (c) existentes[c] = true;
            });
            var faltantes = condiciones.filter(function (c) { return c && !existentes[c]; });
            if (faltantes.length) {
                return cb(null, {
                    ok: false,
                    error: 'No existe la condicion de venta en TERMINOS: ' + faltantes.join(', ') + '.',
                    process: process
                });
            }

            function checkDuplicados(next) {
                if (!compNums.length) return next();
                var sql =
                    "SELECT Comp_Numero FROM DBA.VTACAB " +
                    "WHERE Cod_Empresa = " + sqlValue(empresa) + " " +
                    "AND Cod_Tp_Comp = " + sqlValue(codTpComp) + " " +
                    "AND Comp_Numero IN " + sqlInList(compNums);
                execRows(sql, function (err, rows) {
                    if (err) return next(err);
                    var duplicates = (rows || []).map(function (r) {
                        return String(r.Comp_Numero || r.comp_numero || '').trim();
                    }).filter(function (v) { return v; });
                    if (duplicates.length) {
                        return cb(null, {
                            ok: false,
                            error: 'Ya existen comprobantes de ventas para la empresa y tipo seleccionado: ' +
                                duplicates.join(', ') + '.',
                            process: process
                        });
                    }
                    next();
                });
            }

            function loadTpocbte(next) {
                execRows(
                    "SELECT CodPlanCta, CodPlanAux, CodPlanCtaME, CodPlanAuxME " +
                    "FROM DBA.TPOCBTE WHERE Cod_Empresa = '" + esc(empresa) + "' " +
                    "AND Cod_Tp_Comp = '" + esc(codTpComp) + "'",
                    function (tpErr, tpRows) {
                        if (tpErr) return next(tpErr);
                        var tp = tpRows && tpRows[0] ? tpRows[0] : {};
                        plancta = tp.CodPlanCta || tp.codplancta || null;
                        planaux = tp.CodPlanAux || tp.codplanaux || null;
                        planctaME = tp.CodPlanCtaME || tp.codplanctame || null;
                        planauxME = tp.CodPlanAuxME || tp.codplanauxme || null;
                        next();
                    }
                );
            }

            function ensureCliente(row, next) {
                var razon = String(row.razon_social || '').trim();
                var ruc = String(row.ruc || '').trim();
                if (!razon) razon = 'Sin Nombre';
                if (!ruc) ruc = '44444401-7';
                row.razon_social = razon;
                row.ruc = ruc;
                if (row.cod_cliente) {
                    clienteCache[ruc] = row.cod_cliente;
                    return next();
                }
                if (clienteCache[ruc]) {
                    row.cod_cliente = clienteCache[ruc];
                    return next();
                }
                execRows(
                    "SELECT Cod_Cliente FROM DBA.CLIENTES WHERE Cod_Empresa = '" + esc(empresa) + "' " +
                    "AND RUC = '" + esc(ruc) + "'",
                    function (findErr, foundRows) {
                        if (findErr) return next(findErr);
                        var existing = foundRows && foundRows[0] ? (foundRows[0].Cod_Cliente || foundRows[0].cod_cliente) : null;
                        if (existing) {
                            row.cod_cliente = existing;
                            clienteCache[ruc] = existing;
                            return next();
                        }
                        execRows(nextClienteSql(empresa), function (maxErr, maxRows) {
                            if (maxErr) return next(maxErr);
                            var rawMax = maxRows && maxRows[0] ? (maxRows[0].max_cod || maxRows[0].MAX_COD) : null;
                            var codCliente = generateClienteCode(rawMax);
                            var cond = String(row.cod_con_vta || '').trim() || '01';
                            var moneda = String(row.codmoneda || '').trim() || 'GS';
                            var cta = String(row.cta_cliente || plancta || '').trim();
                            var aux = String(row.aux_cliente || planaux || '').trim();
                            var insertSql =
                                "INSERT INTO DBA.CLIENTES (" +
                                "Cod_Empresa, Cod_Cliente, Cod_Con_Vta, Cod_Zona, Cod_Tp_Cliente, Cod_Calificacion, Cod_Localidad, " +
                                "CodMoneda, Cod_Usuario, Razon_Social, RUC, nrocliente, plantilla, Cod_Sucursal, SaldoPorCliente, " +
                                "CodPlanCta, CodPlanAux, CodPlanCta_ME, CodPlanAux_ME" +
                                ") VALUES (" +
                                sqlValue(empresa) + ", " +
                                sqlValue(codCliente) + ", " +
                                sqlValue(cond) + ", " +
                                "'AS', '1', 'EX', '01', " +
                                sqlValue(moneda) + ", " +
                                sqlValue(username || 'SYSTEM') + ", " +
                                sqlValue(razon) + ", " +
                                sqlValue(ruc) + ", " +
                                "0, 'C', " +
                                sqlValue(codSucursal || null) + ", 'S', " +
                                sqlValue(cta || null) + ", " +
                                sqlValue(aux || null) + ", " +
                                sqlValue(planctaME || null) + ", " +
                                sqlValue(planauxME || null) +
                                ")";
                            execOnly(insertSql, function (insErr) {
                                if (insErr) return next(insErr);
                                row.cod_cliente = codCliente;
                                clienteCache[ruc] = codCliente;
                                createdClientes.push({ ruc: ruc, cod_cliente: codCliente, razon_social: razon });
                                next();
                            });
                        });
                    }
                );
            }

            checkDuplicados(function (dupErr) {
                if (dupErr) {
                    return cb(null, { ok: false, error: dupErr.message || String(dupErr), process: process });
                }
                loadTpocbte(function (tpErr) {
                    if (tpErr) {
                        return cb(null, { ok: false, error: tpErr.message || String(tpErr), process: process });
                    }

                    var inserted = 0;
                    var vtacabInserted = 0;
                    var groups = {};
                    rows.forEach(function (row) {
                        var key = String(row.comp_numero || '').trim();
                        if (!key) return;
                        if (!groups[key]) groups[key] = [];
                        groups[key].push(row);
                    });
                    var compKeys = Object.keys(groups);

                    function insertImportRows(rowsComp, next) {
                        var idx = 0;
                        function step() {
                            if (idx >= rowsComp.length) return next(null);
                            var row = rowsComp[idx];
                            ensureCliente(row, function (cliErr) {
                                if (cliErr) return next(cliErr);
                                var iva = Number(row.total_iva_5 || 0) + Number(row.total_iva_10 || 0);
                                var montoTotal = row.total_neto;
                                if (montoTotal === undefined || montoTotal === null || montoTotal === '') {
                                    montoTotal = row.total;
                                }
                                var linea = row.linea;
                                if (linea === undefined || linea === null || linea === '') {
                                    linea = idx + 1;
                                }
                                var insertSql =
                                    "INSERT INTO DBA.Facturas_Import (" +
                                    "Cod_Empresa, Factura, NroFiscal, Bill_Ac, descripcion, CodMoneda, FactorCambio, " +
                                    "Monto, IVA, MontoTotal, ac_name, svc_no, direccion, cantidad, cod_articulo, Fecha, RUC, Linea, " +
                                    "PorcPartGravado, MontoPartGravado" +
                                    ") VALUES (" +
                                    sqlValue(empresa) + ", " +
                                    sqlValue(row.comp_numero) + ", " +
                                    sqlValue(row.comp_numero) + ", " +
                                    sqlValue(row.cod_cliente || '') + ", " +
                                    sqlValue(row.descrip || '') + ", " +
                                    sqlValue(row.codmoneda || '') + ", " +
                                    numValue(row.fact_cambio, 4) + ", " +
                                    numValue(row.total, 4) + ", " +
                                    numValue(iva, 4) + ", " +
                                    numValue(montoTotal, 4) + ", " +
                                    sqlValue(row.razon_social || '') + ", " +
                                    sqlValue(row.telefono || '') + ", " +
                                    sqlValue(row.direccion || '') + ", " +
                                    numValue(row.cantidad, 4) + ", " +
                                    sqlValue(row.cod_articulo || '') + ", " +
                                    sqlValue(row.fha_cbte || '') + ", " +
                                    sqlValue(row.ruc || '') + ", " +
                                    numValue(linea) + ", " +
                                    numValue(row.porcpartgravado, 4) + ", " +
                                    numValue(row.montopartgravado, 4) +
                                    ")";
                                execOnly(insertSql, function (insErr) {
                                    if (insErr) return next(insErr);
                                    inserted += 1;
                                    idx += 1;
                                    step();
                                });
                            });
                        }
                        step();
                    }

                    function callProcedure(rowsComp, next) {
                        var head = rowsComp[0] || {};
                        var listaPrec = 1;
                        var codConVta = head.cod_con_vta || '01';
                        var codTpPago = 'E';
                        var tipoVta = 'NO';
                        var codVendedor = '';
                        var tipoIva = 'D';
                        var callSql =
                            "CALL DBA.FacturasVta_ins_facturas(" +
                            sqlValue(empresa) + ", " +
                            sqlValue(codSucursal) + ", " +
                            sqlValue(codDeposito) + ", " +
                            sqlValue(codTpComp) + ", " +
                            numValue(listaPrec) + ", " +
                            sqlValue(codConVta) + ", " +
                            sqlValue(codTpPago) + ", " +
                            sqlValue(tipoVta) + ", " +
                            sqlValue(codVendedor) + ", " +
                            sqlValue(tipoIva) +
                            ")";
                        execOnly(callSql, function (callErr) {
                            if (callErr) return next(callErr);
                            next();
                        });
                    }

                    function fixCabecera(comp, rowsComp, next) {
                        var head = rowsComp[0];
                        var totals = {
                            exenta: 0,
                            grav5: 0,
                            iva5: 0,
                            grav10: 0,
                            iva10: 0,
                            totalVenta: 0
                        };
                        rowsComp.forEach(function (r) {
                            totals.exenta += Number(r.exenta || 0);
                            totals.grav5 += Number(r.to_gravado_5 || 0);
                            totals.iva5 += Number(r.total_iva_5 || 0);
                            totals.grav10 += Number(r.to_gravado_10 || 0);
                            totals.iva10 += Number(r.total_iva_10 || 0);
                            var neto = r.total_neto;
                            if (neto === undefined || neto === null || neto === '') {
                                neto = r.total;
                            }
                            totals.totalVenta += Number(neto || 0);
                        });
                        var totalIva = totals.iva5 + totals.iva10;
                        var totalGravado = totals.grav5 + totals.grav10;
                        var updateSql =
                            "UPDATE DBA.VTACAB SET " +
                            "To_Exento = " + numValue(totals.exenta, 4) + ", " +
                            "To_Gravado = " + numValue(totalGravado, 4) + ", " +
                            "Total_IVA = " + numValue(totalIva, 4) + ", " +
                            "To_Gravado_5 = " + numValue(totals.grav5, 4) + ", " +
                            "Total_IVA_5 = " + numValue(totals.iva5, 4) + ", " +
                            "To_Gravado_10 = " + numValue(totals.grav10, 4) + ", " +
                            "Total_IVA_10 = " + numValue(totals.iva10, 4) + ", " +
                            "Total_Venta = " + numValue(totals.totalVenta, 4) + ", " +
                            "NroTimb = " + numValue(head.nrotimb, 0) + ", " +
                            "Comp_Nro_Timb = " + numValue(comp, 0) + ", " +
                            "Cod_Establecimiento = " + sqlValue(head.cod_establecimiento || null) + ", " +
                            "Cod_PtoExpedicion = " + sqlValue(head.cod_ptoexpedicion || null) + " " +
                            "WHERE Cod_Empresa = " + sqlValue(empresa) + " " +
                            "AND Cod_Tp_Comp = " + sqlValue(codTpComp) + " " +
                            "AND Comp_Numero = " + sqlValue(comp);
                        execOnly(updateSql, function () { next(); });
                    }

                    function fixDetalle(rowsComp, next) {
                        var comp = rowsComp[0] ? rowsComp[0].comp_numero : null;
                        if (!comp) return next();
                        var updateSql =
                            "UPDATE DBA.VTADET SET " +
                            "PorcPartGravado = (SELECT fi.PorcPartGravado FROM DBA.Facturas_Import fi " +
                            "WHERE fi.Cod_Empresa = " + sqlValue(empresa) + " " +
                            "AND fi.NroFiscal = " + sqlValue(comp) + " " +
                            "AND fi.Linea = DBA.VTADET.Linea), " +
                            "MontoPartGravado = (SELECT fi.MontoPartGravado FROM DBA.Facturas_Import fi " +
                            "WHERE fi.Cod_Empresa = " + sqlValue(empresa) + " " +
                            "AND fi.NroFiscal = " + sqlValue(comp) + " " +
                            "AND fi.Linea = DBA.VTADET.Linea) " +
                            "WHERE Cod_Empresa = " + sqlValue(empresa) + " " +
                            "AND Cod_Tp_Comp = " + sqlValue(codTpComp) + " " +
                            "AND Comp_Numero = " + sqlValue(comp);
                        execOnly(updateSql, function () { next(); });
                    }

                    function finishSuccess() {
                        var compMin = null;
                        var compMax = null;
                        compNums.forEach(function (c) {
                            var n = parseInt(String(c), 10);
                            if (isNaN(n)) return;
                            if (compMin === null || n < compMin) compMin = n;
                            if (compMax === null || n > compMax) compMax = n;
                        });
                        if (vtacabInserted > 0) {
                            process.push('Cantidad de registro: ' + vtacabInserted + '.');
                        }
                        if (compMin !== null && compMax !== null) {
                            process.push('Ventas insertadas desde el Nro. ' + compMin + ' hasta el Nro. ' + compMax + '.');
                        }
                        function done() {
                            cb(null, {
                                ok: true,
                                message: 'Migracion finalizada. Registros procesados: ' + inserted + '.',
                                inserted_count: inserted,
                                process: process
                            });
                        }
                        if (!dbIsPostgres()) {
                            execOnly('COMMIT', function () { done(); });
                        } else {
                            done();
                        }
                    }

                    function processCompAt(idx) {
                        if (idx >= compKeys.length) {
                            process.push('Clientes creados automaticamente en migracion: ' + createdClientes.length + '.');
                            if (createdClientes.length) {
                                createdClientes.forEach(function (c) {
                                    var razon = c.razon_social ? (' - ' + c.razon_social) : '';
                                    process.push('Cliente creado: RUC ' + c.ruc + ' -> Cod_Cliente ' + c.cod_cliente + razon + '.');
                                });
                            }
                            return finishSuccess();
                        }
                        var comp = compKeys[idx];
                        var rowsComp = groups[comp] || [];
                        execOnly('DELETE FROM DBA.Facturas_Import WHERE Cod_Empresa = ' + sqlValue(empresa), function (delErr) {
                            if (delErr) return cb(null, { ok: false, error: delErr.message || String(delErr), process: process });
                            insertImportRows(rowsComp, function (insErr) {
                                if (insErr) {
                                    process.push('Error al cargar Facturas_Import para ' + comp + ': ' + (insErr.message || insErr));
                                    return processCompAt(idx + 1);
                                }
                                callProcedure(rowsComp, function (callErr) {
                                    if (callErr) {
                                        process.push('Error al ejecutar SP para ' + comp + ': ' + (callErr.message || callErr));
                                        return processCompAt(idx + 1);
                                    }
                                    fixCabecera(comp, rowsComp, function () {
                                        fixDetalle(rowsComp, function () {
                                            vtacabInserted += 1;
                                            if (!dbIsPostgres()) {
                                                execOnly('COMMIT', function () {
                                                    processCompAt(idx + 1);
                                                });
                                            } else {
                                                processCompAt(idx + 1);
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    }

                    processCompAt(0);
                });
            });
        }
    );
        }
    );
};

module.exports = Migraciones;
