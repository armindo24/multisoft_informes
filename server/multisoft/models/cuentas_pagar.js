var conn = require('../db_integrado');
var q = require('./queryUtils');
var Cuentas_pagar = {};

var RESULT_TTL_MS = 30000;
var resultCache = new Map();
var pendingCache = new Map();

function execAsync(sql) {
    return new Promise(function (resolve, reject) {
        conn.exec(sql, function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows || []);
        });
    });
}

function trimValue(value) {
    return String(value == null ? '' : value).trim();
}

function hasValue(value) {
    return trimValue(value) !== '' && trimValue(value).toUpperCase() !== 'NINGUNO';
}

function escapeSql(value) {
    return trimValue(value).replace(/'/g, "''");
}

function normalizeList(value) {
    if (Array.isArray(value)) {
        return value
            .map(function (item) { return trimValue(item); })
            .filter(Boolean);
    }

    if (!hasValue(value)) {
        return [];
    }

    return trimValue(value)
        .split(',')
        .map(function (item) { return trimValue(item); })
        .filter(Boolean);
}

function buildCacheKey(filters) {
    return JSON.stringify({
        empresa: trimValue(filters.empresa || ''),
        periodo: trimValue(filters.periodo || ''),
        compras_start: trimValue(filters.compras_start || ''),
        compras_end: trimValue(filters.compras_end || ''),
        proveedor: normalizeList(filters.proveedor),
        tipo: normalizeList(filters.tipo)
    });
}

function getCachedResult(key) {
    var cached = resultCache.get(key);
    if (!cached) {
        return null;
    }

    if (cached.expiresAt < Date.now()) {
        resultCache.delete(key);
        return null;
    }

    return cached.rows;
}

function setCachedResult(key, rows) {
    resultCache.set(key, {
        rows: rows,
        expiresAt: Date.now() + RESULT_TTL_MS
    });
}

function buildProveedorFilters(filters, alias, tipoField) {
    var clauses = [];
    var proveedores = normalizeList(filters.proveedor);
    var tipos = normalizeList(filters.tipo);

    if (proveedores.length) {
        clauses.push(alias + ".CodProv IN " + q.in(proveedores));
    }

    if (tipos.length) {
        clauses.push(alias + "." + tipoField + " IN " + q.in(tipos));
    }

    return clauses.length ? " AND " + clauses.join(" AND ") + " " : "";
}

function amountFacturaExpr() {
    return "(case when FC.IVAIncluido = 'N' then isnull(FC.TotalExen,0) + isnull(FC.TotalGrav,0) + isnull(FC.IVA,0) else isnull(FC.TotalExen,0) + isnull(FC.TotalGrav,0) end)";
}

function amountDespachoExpr(alias) {
    return "(isnull(" + alias + ".TotalExento,0) + isnull(" + alias + ".TotalGravado,0) + isnull(" + alias + ".TotalIVA,0))";
}

function convertedImporteExpr(targetCurrencyExpr, paymentCurrencyExpr, importeExpr, opCambioExpr, opCabCambioExpr, localCurrency) {
    var target = "trim(" + targetCurrencyExpr + ")";
    var payment = "trim(" + paymentCurrencyExpr + ")";
    var importe = "isnull(" + importeExpr + ",0)";
    var opCambio = "isnull(" + opCambioExpr + ",1)";
    var opCabCambio = "isnull(" + opCabCambioExpr + ",1)";
    var local = "'" + escapeSql(localCurrency) + "'";
    var converted = "(case " +
        "when " + target + " = " + payment + " then " + importe + " " +
        "when " + payment + " = " + local + " then " + importe + " / (case when " + opCambio + " = 0 then 1 else " + opCambio + " end) " +
        "else " + importe + " * (case when " + opCambio + " = 1 then " + opCabCambio + " else " + opCambio + " end) " +
    "end)";

    return "(case " +
        "when " + target + " = " + local + " then round(" + converted + ", 0) " +
        "else round(" + converted + ", 2) " +
    "end)";
}

function convertedPagoFacturaExpr(localCurrency) {
    return "(case when isnull(OC.TipoOP,'') = 'C' then isnull(OD.Importe,0) else " +
        convertedImporteExpr('FC.CodMoneda', 'OC.CodMoneda', 'OD.Importe', 'OD.FactCambio', 'OC.FactCambio', localCurrency) +
    " end)";
}

function convertedPagoDespachoExpr(localCurrency) {
    return convertedImporteExpr('D.CodMoneda', 'OC.CodMoneda', 'OC.TotalImporte', 'OD.FactCambio', 'OC.FactCambio', localCurrency);
}

function buildFacturasNormales(filters) {
    var providerFilters = buildProveedorFilters(filters, 'P', 'TipoProv');
    var amountExpr = amountFacturaExpr();

    return "SELECT FC.CodProv, trim(FC.CodMoneda) as CodMoneda, upper(P.RazonSocial) as RazonSocial, " +
        "SUM(case when DATE(FC.FechaFact) < DATE('" + escapeSql(filters.compras_start) + "') then " + amountExpr + " else 0 end) as SaldoAnterior, " +
        "SUM(case when DATE(FC.FechaFact) >= DATE('" + escapeSql(filters.compras_start) + "') then " + amountExpr + " else 0 end) as TotalCredito, " +
        "cast(0 as decimal(20,2)) as TotalDebito " +
        "FROM DBA.FACTCAB FC, DBA.TPOCBTE T, DBA.PROVEED P " +
        "WHERE FC.Cod_Empresa = '" + escapeSql(filters.empresa) + "' " +
        "AND FC.Asentado = 'S' " +
        "AND FC.NroRendicion IS NULL " +
        "AND FC.FondoFijo = 'N' " +
        "AND FC.IncluirExtracto = 'S' " +
        "AND DATE(FC.FechaFact) <= DATE('" + escapeSql(filters.compras_end) + "') " +
        "AND FC.Cod_Empresa = T.Cod_Empresa " +
        "AND FC.Cod_Tp_Comp = T.Cod_Tp_Comp " +
        "AND T.Tp_Def NOT IN ('FM','NP','RT') " +
        "AND FC.Cod_Empresa = P.Cod_Empresa " +
        "AND FC.CodProv = P.CodProv " +
        providerFilters +
        "GROUP BY FC.CodProv, trim(FC.CodMoneda), upper(P.RazonSocial)";
}

function buildFacturasNegativas(filters) {
    var providerFilters = buildProveedorFilters(filters, 'P', 'TipoProv');
    var amountExpr = amountFacturaExpr();

    return "SELECT FC.CodProv, trim(FC.CodMoneda) as CodMoneda, upper(P.RazonSocial) as RazonSocial, " +
        "SUM(case when DATE(FC.FechaFact) < DATE('" + escapeSql(filters.compras_start) + "') then -" + amountExpr + " else 0 end) as SaldoAnterior, " +
        "cast(0 as decimal(20,2)) as TotalCredito, " +
        "SUM(case when DATE(FC.FechaFact) >= DATE('" + escapeSql(filters.compras_start) + "') then " + amountExpr + " else 0 end) as TotalDebito " +
        "FROM DBA.FACTCAB FC, DBA.TPOCBTE T, DBA.PROVEED P " +
        "WHERE FC.Cod_Empresa = '" + escapeSql(filters.empresa) + "' " +
        "AND FC.Asentado = 'S' " +
        "AND FC.NroRendicion IS NULL " +
        "AND FC.FondoFijo = 'N' " +
        "AND FC.IncluirExtracto = 'S' " +
        "AND DATE(FC.FechaFact) <= DATE('" + escapeSql(filters.compras_end) + "') " +
        "AND FC.Cod_Empresa = T.Cod_Empresa " +
        "AND FC.Cod_Tp_Comp = T.Cod_Tp_Comp " +
        "AND T.Tp_Def IN ('NP','RT') " +
        "AND FC.Cod_Empresa = P.Cod_Empresa " +
        "AND FC.CodProv = P.CodProv " +
        providerFilters +
        "GROUP BY FC.CodProv, trim(FC.CodMoneda), upper(P.RazonSocial)";
}

function buildPagosFacturas(filters, localCurrency) {
    var providerFilters = buildProveedorFilters(filters, 'P', 'TipoProv');
    var amountExpr = convertedPagoFacturaExpr(localCurrency);

    return "SELECT FC.CodProv, trim(FC.CodMoneda) as CodMoneda, upper(P.RazonSocial) as RazonSocial, " +
        "SUM(case when DATE(OC.Fecha) < DATE('" + escapeSql(filters.compras_start) + "') then -" + amountExpr + " else 0 end) as SaldoAnterior, " +
        "cast(0 as decimal(20,2)) as TotalCredito, " +
        "SUM(case when DATE(OC.Fecha) >= DATE('" + escapeSql(filters.compras_start) + "') then " + amountExpr + " else 0 end) as TotalDebito " +
        "FROM DBA.FACTCAB FC, DBA.PROVEED P, DBA.OPCAB OC, DBA.OPDET OD " +
        "WHERE FC.Cod_Empresa = '" + escapeSql(filters.empresa) + "' " +
        "AND FC.Asentado = 'S' " +
        "AND FC.NroRendicion IS NULL " +
        "AND FC.FondoFijo = 'N' " +
        "AND FC.IncluirExtracto = 'S' " +
        "AND DATE(FC.FechaFact) <= DATE('" + escapeSql(filters.compras_end) + "') " +
        "AND FC.Cod_Empresa = P.Cod_Empresa " +
        "AND FC.CodProv = P.CodProv " +
        providerFilters +
        "AND OC.Cod_Empresa = FC.Cod_Empresa " +
        "AND OC.CodProv = FC.CodProv " +
        "AND OC.Autorizado = 'S' " +
        "AND isnull(OC.Anulado,'N') <> 'S' " +
        "AND DATE(OC.Fecha) <= DATE('" + escapeSql(filters.compras_end) + "') " +
        "AND OC.Cod_Empresa = OD.Cod_Empresa " +
        "AND OC.TipoOP = OD.TipoOP " +
        "AND OC.NroOP = OD.NroOP " +
        "AND OD.Cod_Tp_Comp = FC.Cod_Tp_Comp " +
        "AND OD.NroFact = FC.NroFact " +
        "GROUP BY FC.CodProv, trim(FC.CodMoneda), upper(P.RazonSocial)";
}

function buildDespachos(filters) {
    var providerFilters = buildProveedorFilters(filters, 'P', 'TipoProv');
    var amountExpr = amountDespachoExpr('D');

    return "SELECT D.CodDespachante as CodProv, trim(D.CodMoneda) as CodMoneda, upper(P.RazonSocial) as RazonSocial, " +
        "SUM(case when DATE(D.FechaDespacho) < DATE('" + escapeSql(filters.compras_start) + "') then " + amountExpr + " else 0 end) as SaldoAnterior, " +
        "SUM(case when DATE(D.FechaDespacho) >= DATE('" + escapeSql(filters.compras_start) + "') then " + amountExpr + " else 0 end) as TotalCredito, " +
        "cast(0 as decimal(20,2)) as TotalDebito " +
        "FROM DBA.DESPACHO D, DBA.PROVEED P " +
        "WHERE D.Cod_Empresa = '" + escapeSql(filters.empresa) + "' " +
        "AND D.Asentado = 'S' " +
        "AND DATE(D.FechaDespacho) <= DATE('" + escapeSql(filters.compras_end) + "') " +
        "AND D.Cod_Empresa = P.Cod_Empresa " +
        "AND D.CodDespachante = P.CodProv " +
        providerFilters +
        "GROUP BY D.CodDespachante, trim(D.CodMoneda), upper(P.RazonSocial)";
}

function buildPagosDespachos(filters, localCurrency) {
    var providerFilters = buildProveedorFilters(filters, 'P', 'TipoProv');
    var amountExpr = convertedPagoDespachoExpr(localCurrency);

    return "SELECT D.CodDespachante as CodProv, trim(D.CodMoneda) as CodMoneda, upper(P.RazonSocial) as RazonSocial, " +
        "SUM(case when DATE(OC.Fecha) < DATE('" + escapeSql(filters.compras_start) + "') then -" + amountExpr + " else 0 end) as SaldoAnterior, " +
        "cast(0 as decimal(20,2)) as TotalCredito, " +
        "SUM(case when DATE(OC.Fecha) >= DATE('" + escapeSql(filters.compras_start) + "') then " + amountExpr + " else 0 end) as TotalDebito " +
        "FROM DBA.DESPACHO D, DBA.PROVEED P, DBA.OPCAB OC, DBA.OPDET OD " +
        "WHERE D.Cod_Empresa = '" + escapeSql(filters.empresa) + "' " +
        "AND D.Asentado = 'S' " +
        "AND DATE(D.FechaDespacho) <= DATE('" + escapeSql(filters.compras_end) + "') " +
        "AND D.Cod_Empresa = P.Cod_Empresa " +
        "AND D.CodDespachante = P.CodProv " +
        providerFilters +
        "AND OC.Cod_Empresa = D.Cod_Empresa " +
        "AND OC.CodProv = D.CodDespachante " +
        "AND OC.Autorizado = 'S' " +
        "AND isnull(OC.Anulado,'N') <> 'S' " +
        "AND DATE(OC.Fecha) <= DATE('" + escapeSql(filters.compras_end) + "') " +
        "AND OC.Cod_Empresa = OD.Cod_Empresa " +
        "AND OC.TipoOP = OD.TipoOP " +
        "AND OC.NroOP = OD.NroOP " +
        "AND ((OD.Anho = D.Anho AND OD.CodDespachante = D.CodDespachante AND OD.NroDespacho = D.NroDespacho) " +
        "OR (OD.NroFact = D.NroDespacho AND OD.NroDespacho IS NULL AND OD.CodProv IS NULL)) " +
        "GROUP BY D.CodDespachante, trim(D.CodMoneda), upper(P.RazonSocial)";
}

function buildAnticipos(filters) {
    var providerFilters = buildProveedorFilters(filters, 'P', 'TipoProv');

    return "SELECT OC.CodProv, trim(OC.CodMoneda) as CodMoneda, upper(P.RazonSocial) as RazonSocial, " +
        "SUM(case when DATE(OC.Fecha) < DATE('" + escapeSql(filters.compras_start) + "') then -isnull(OC.TotalImporte,0) else 0 end) as SaldoAnterior, " +
        "cast(0 as decimal(20,2)) as TotalCredito, " +
        "SUM(case when DATE(OC.Fecha) >= DATE('" + escapeSql(filters.compras_start) + "') then isnull(OC.TotalImporte,0) else 0 end) as TotalDebito " +
        "FROM DBA.OPCAB OC, DBA.PROVEED P " +
        "WHERE OC.Cod_Empresa = '" + escapeSql(filters.empresa) + "' " +
        "AND OC.Autorizado = 'S' " +
        "AND isnull(OC.Anulado,'N') <> 'S' " +
        "AND DATE(OC.Fecha) <= DATE('" + escapeSql(filters.compras_end) + "') " +
        "AND OC.CodProv IS NOT NULL " +
        "AND OC.Cod_Empresa = P.Cod_Empresa " +
        "AND OC.CodProv = P.CodProv " +
        providerFilters +
        "AND NOT EXISTS (" +
            "SELECT * FROM DBA.OPDET OD " +
            "WHERE OD.Cod_Empresa = OC.Cod_Empresa " +
            "AND OD.TipoOP = OC.TipoOP " +
            "AND OD.NroOP = OC.NroOP" +
        ") " +
        "GROUP BY OC.CodProv, trim(OC.CodMoneda), upper(P.RazonSocial)";
}

async function resolveMonedas(filters) {
    var rows = await execAsync(
        "SELECT trim(MonedaLocal) as MonedaLocal, trim(MonedaExtranjera) as MonedaExtranjera " +
        "FROM DBA.CONTROL WHERE Cod_Empresa = '" + escapeSql(filters.empresa) + "' " +
        "AND Periodo = '" + escapeSql(filters.periodo) + "'"
    );

    if (rows.length) {
        return {
            local: trimValue(rows[0].MonedaLocal || 'GS') || 'GS',
            extranjera: trimValue(rows[0].MonedaExtranjera || 'US') || 'US'
        };
    }

    return {
        local: 'GS',
        extranjera: 'US'
    };
}

function buildMainSql(filters, monedas) {
    var unionSql = [
        buildFacturasNormales(filters),
        buildFacturasNegativas(filters),
        buildPagosFacturas(filters, monedas.local),
        buildDespachos(filters),
        buildPagosDespachos(filters, monedas.local),
        buildAnticipos(filters)
    ].join(" UNION ALL ");

    return "SELECT * FROM (" +
        "SELECT base.CodProv, base.CodMoneda, base.RazonSocial, " +
        "SUM(base.SaldoAnterior) as SaldoAnterior, " +
        "SUM(base.TotalCredito) as TotalCredito, " +
        "SUM(base.TotalDebito) as TotalDebito, " +
        "M.Descrip, " +
        "(SUM(base.SaldoAnterior) + SUM(base.TotalCredito) - SUM(base.TotalDebito)) as Saldo " +
        "FROM (" + unionSql + ") as base, DBA.MONEDA M " +
        "WHERE base.CodMoneda = M.CodMoneda " +
        "GROUP BY base.CodProv, base.CodMoneda, base.RazonSocial, M.Descrip" +
        ") as tabla " +
        "WHERE tabla.Saldo > 0 " +
        "ORDER BY tabla.Descrip, tabla.RazonSocial";
}

async function loadCuentaPagarRows(filters) {
    if (!hasValue(filters.empresa) || !hasValue(filters.periodo) || !hasValue(filters.compras_start) || !hasValue(filters.compras_end)) {
        return [];
    }

    var monedas = await resolveMonedas(filters);
    var sql = buildMainSql(filters, monedas);
    return await execAsync(sql);
}

Cuentas_pagar.all = function (filters, cb) {
    var key = buildCacheKey(filters);
    var cachedRows = getCachedResult(key);

    if (cachedRows) {
        cb(cachedRows);
        return;
    }

    if (pendingCache.has(key)) {
        pendingCache.get(key)
            .then(function (rows) {
                cb(rows);
            })
            .catch(function (error) {
                console.error('Error reutilizando cache pendiente de cuentas por pagar:', error);
                cb([]);
            });
        return;
    }

    var request = loadCuentaPagarRows(filters)
        .then(function (rows) {
            setCachedResult(key, rows);
            pendingCache.delete(key);
            return rows;
        })
        .catch(function (error) {
            pendingCache.delete(key);
            throw error;
        });

    pendingCache.set(key, request);

    request
        .then(function (rows) {
            cb(rows);
        })
        .catch(function (error) {
            console.error('Error cargando cuentas por pagar:', error);
            cb([]);
        });
};

module.exports = Cuentas_pagar;
