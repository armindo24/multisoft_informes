var conn = require('../db_integrado');
var util = require('util');
var q = require('./queryUtils');
var Ventas = {};

var maxSelect = 10;
var CUENTAS_COBRAR_TTL_MS = 30000;
var cuentasCobrarCache = new Map();
var cuentasCobrarPending = new Map();

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

function esc(value) {
    return String(value === undefined || value === null ? '' : value).replace(/'/g, "''");
}

function monedaVentasCondition(monedaValue, fieldExpr) {
    var m = String(monedaValue || '').toUpperCase();
    var normField = "upper(trim(coalesce(" + fieldExpr + ",'')))";
    if (m === 'GS' || m === 'PYG' || m === 'LO' || m === 'LOCAL') {
        return " AND " + normField + " IN ('GS','PYG') ";
    }
    if (m === 'US' || m === 'USD' || m === 'EX' || m === 'EXTRANJERA') {
        return " AND " + normField + " IN ('US','USD') ";
    }
    return "";
}

function buildCuentasCobrarCacheKey(params, query) {
    return JSON.stringify({
        empresa: String(params.empresa || ''),
        start: String(query.start || ''),
        end: String(query.end || ''),
        vencimiento: String(query.vencimiento || ''),
        cliente: String(query.cliente || ''),
        calificacion: String(query.calificacion || ''),
        movimiento: String(query.movimiento || ''),
        condicion: String(query.condicion || ''),
        cobrador: String(query.cobrador || ''),
        vendedor: String(query.vendedor || ''),
        sucursal: String(query.sucursal || ''),
        zona: String(query.zona || ''),
        tipoCliente: String(query.tipoCliente || '')
    });
}

function getCachedCuentasCobrar(key) {
    var cached = cuentasCobrarCache.get(key);
    if (!cached) {
        return null;
    }

    if (cached.expiresAt < Date.now()) {
        cuentasCobrarCache.delete(key);
        return null;
    }

    return cached.rows;
}

function setCachedCuentasCobrar(key, rows) {
    cuentasCobrarCache.set(key, {
        rows: rows,
        expiresAt: Date.now() + CUENTAS_COBRAR_TTL_MS
    });
}

Ventas.all = function (params, filters, cb) {
    //conn.exec("SET ROWCOUNT 100"); //TODO: solucionar resultados muy grandes

    var select = "dba.vtacab.cod_tp_comp, dba.vtacab.comp_numero, dba.vtacab.codmoneda, dba.vtacab.cod_cliente, " +
        "dba.f_get_AsoAbreviatura(dba.vtacab.cod_empresa, dba.vtacab.cod_cliente, 'V') as razon_social, " +
        "dba.vtacab.razon_social as cliente," +
        "date(dba.vtacab.fha_cbte) as fecha, dba.vtacab.cod_usuario, cast(dba.vtacab.to_exento as decimal(20,2)), cast(dba.vtacab.to_gravado as decimal(20,2)), " +
        "cast(dba.vtacab.total_iva as decimal(20,2)), dba.tpocbte.des_tp_comp, cast(dba.vtacab.fact_cambio as decimal(20,2)), " +
        "dba.vtacab.tipo_iva, dba.tpocbte.tp_def, dba.tpocbte.tpomvto, dba.vtacab.cod_empresa, dba.vtacab.codmoneda, " +
        "dba.vtacab.cod_sucursal, cast(dba.vtacab.totaldescuento as decimal(20,2)), dba.vtacab.nroservicio, dba.vtacab.anulado, " +
        "dba.clientes.cat_iva, dba.clientes.ruc, dba.vendedor.des_vendedor";
    var from = "dba.VtaCab, dba.Clientes, dba.TpoCbte, dba.Vendedor";
    var where = "(dba.vtacab.anulado != 'S') and (dba.vtacab.cod_empresa = ?) and dba.vtacab.codmoneda = ?\n";
    var args = [params.empresa, filters.moneda ? filters.moneda : 'GS'];
    var join = "( dba.vtacab.cod_empresa = dba.clientes.cod_empresa ) and ( dba.vtacab.cod_cliente = dba.clientes.cod_cliente ) and ( dba.vtacab.cod_empresa =dba.tpocbte.cod_empresa ) and ( dba.vtacab.cod_tp_comp = dba.tpocbte.cod_tp_comp )" +
        " and (dba.vtacab.cod_vendedor = dba.vendedor.cod_vendedor)";

    if (filters.cliente) {
        where += " and (dba.vtacab.cod_cliente = ?)";
        args.push(filters.cliente);
    }

    if (filters.tipo_cliente) {
        where += " and (dba.clientes.cod_tp_cliente = ?)";
        args.push(filters.tipo_cliente);
    }

    if (filters.sucursal) {
        where += " and (dba.vtacab.cod_sucursal = ?)";
        args.push(filters.sucursal);
    }

    if (filters.tipo_comprobante) {
        where += " and (dba.vtacab.cod_tp_comp = ?)";
        args.push(filters.tipo_comprobante);
    }

    if (filters.desde && filters.hasta) {
        where += " and (dba.vtacab.fha_cbte BETWEEN ? and ?)";
        args.push(filters.desde);
        args.push(filters.hasta);
    }


    var sql = util.format("SELECT %s FROM %s WHERE %s and %s", select, from, where, join);
    if (filters.order) {
        if (filters.order == "cod_tp_comp") {
            sql += " ORDER BY dba.vtacab.Cod_Tp_Comp";
        } else if (filters.order == "cod_cliente") {
            sql += " ORDER BY dba.vtacab.cod_cliente";
        } else if (filters.order == "cod_vendedor") {
            sql += " ORDER BY dba.vtacab.cod_vendedor";
        }
    }

    console.log(sql);
    console.log(args);

    conn.exec(sql, args, function (err, r) {
        if (err) throw err;
        cb(r);
    });
};

Ventas.detalle = function (params, filter, cb) {
    console.log(params);
    console.log(filter);

    var sql = "SELECT d.cod_deposito, d.cod_articulo, d.descrip, d.lista_prec, d.cantidad, d.pr_unit, d.descuento, d.total_neto, d.linea" +
        " FROM dba.VTACAB c" +
        " JOIN dba.VTADET d on d.Comp_Numero = c.Comp_Numero and d.cod_empresa = c.cod_empresa" +
        " WHERE c.comp_numero = ? AND c.Cod_Empresa = ?";
    var sql_params = [params.comprobante, params.empresa];

    conn.exec(sql, sql_params, function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

Ventas.terminos = function (cb) {
    var sql = "SELECT cod_con_vta, des_con_vta, cuota, dias_credito, descuento, " +
        "ctrl_limite, efectivo, cheque, tarjeta, listas, " +
        "SubStr( listas, 1, 1) as L_1, " +
        "SubStr( listas, 2, 1) as L_2, " +
        "SubStr( listas, 3, 1) as L_3, " +
        "SubStr(listas, 4, 1) as L_4, " +
        "SubStr( listas, 5, 1) as L_5, " +
        "SubStr( listas, 6, 1) as L_6, " +
        "porcinteres, porcinteresentrega, 'N' as incluir " +
        "FROM dba.terminos " +
        "ORDER BY cod_con_vta ASC";
    conn.exec(sql, function (err, result) {
        if (err) throw err;
        cb(result);
    });
};

Ventas.articulos = function (params, query) {
    if (!query.articulo || query.articulo.length < 2) return Promise.resolve({});
    var sql = "SELECT cod_articulo, des_art\n" +
        "FROM dba.articulo\n" +
        "WHERE cod_empresa = ?\n";
    var sqlParams = [params.empresa];
    //if (query.sucursal) {
    //    sql += "AND (cod_sucursal = ? or cod_sucursal is null)\n";
    //    sqlParams.push(query.sucursal);
    //}
    if (query.tipoArticulo) {
        sql += "AND (articulo.cod_tp_art = ?)\n";
        sqlParams.push(query.tipoArticulo);
    }
    if (query.articulo) {
        sql += "AND des_art LIKE '" + query.articulo + "%'\n";
    }

    return conn.execAsync(sql, sqlParams);
};

Ventas.zonas = function (cb) {
    var sql = "SELECT cod_zona, des_zona FROM dba.ZONAVTA";
    conn.exec(sql, function (err, result) {
        if (err) throw err;
        cb(result);
    });
};
Ventas.cuentas = {};

function computeCuentasCobrar(params, query, cb) {
    var sql = "SELECT dba.cuotas.cod_empresa, dba.cuotas.cod_sucursal, " +
        "dba.cuotas.mvto_numero, dba.cuotas.cuota_numero, dba.cuotas.cod_cliente, " +
        "dba.cuotas.cod_tp_comp, dba.cuotas.comp_numero, dba.cuotas.fecha_ven, " +
        "dba.cuotas.importe, dba.cuotas.saldo, dba.clientes.razon_social, " +
        "dba.tpocbte.des_tp_comp, " +
        "dba.clientes.direccion, dba.clientes.email, dba.clientes.telefono1, " +
        "dba.clientes.telefono2, dba.clientes.fax, dba.clientes.ruc, " +
        "dba.clientes.contacto, dba.cuotas.fact_cambio, dba.cuotas.fecha_emi, " +
        "1 as tipo\n" +
        "FROM dba.cuotas, dba.clientes, dba.tpocbte\n" +
        "WHERE (dba.clientes.cod_empresa = dba.cuotas.cod_empresa) " +
        "and (dba.clientes.cod_cliente = dba.cuotas.cod_cliente) " +
        "and (dba.tpocbte.cod_empresa = dba.cuotas.cod_empresa) " +
        "and (dba.tpocbte.cod_tp_comp = dba.cuotas.cod_tp_comp) " +
        "and (dba.cuotas.saldo > 0) " +
        "and cuotas.cod_empresa = ? ";

    var sql_params = [params.empresa];

    if (query.start && query.end) {
        if (query.vencimiento === 'true') {
            sql += "and DATE(cuotas.fecha_ven) >= Date (?) " +
                "AND DATE(cuotas.fecha_ven) <= Date (?) ";
        } else {
            sql += "and DATE(cuotas.fecha_emi) >= Date (?) " +
                "AND DATE(cuotas.fecha_emi) <= Date (?) ";
        }
        sql_params.push(query.start);
        sql_params.push(query.end);
    }

    if (query.cliente) {
        sql += "AND ((DBA.clientes.cod_cliente = ?)) ";
        sql_params.push(query.cliente);
    }

    if (query.calificacion) {
        sql += "AND ((dba.clientes.cod_calificacion = ?)) ";
        sql_params.push(query.calificacion);
    }

    if (query.movimiento) {
        sql += "AND cuotas.cod_tp_comp = ? ";
        sql_params.push(query.movimiento);
    }

    if (query.condicion) {
        sql += "AND ( (dba.cuotas.cod_con_vta = ?) ) ";
        sql_params.push(query.condicion);
    }

    if (query.cobrador) {
        sql += "AND ( (DBA.Clientes.cod_cobrador = ?) ) ";
        sql_params.push(query.cobrador);
    }

    if (query.vendedor) {
        sql += "AND ( (DBA.Cuotas.cod_vendedor = ?) ) ";
        sql_params.push(query.vendedor);
    }

    if (query.sucursal) {
        sql += "AND cuotas.cod_sucursal = ? ";
        sql_params.push(query.sucursal);
    }

    if (query.zona) {
        sql += "AND ((dba.clientes.cod_zona = ?) ) ";
        sql_params.push(query.zona);
    }

    if (query.tipoCliente) {
        sql += "AND ( (dba.clientes.cod_tp_cliente = ?)) ";
        sql_params.push(query.tipoCliente);
    }

    sql += "\nORDER BY dba.cuotas.cod_empresa ASC, dba.cuotas.cod_cliente ASC, " +
        "dba.cuotas.mvto_numero ASC, dba.cuotas.cuota_numero ASC, " +
        "dba.cuotas.fecha_ven ASC ";
    console.log(sql);
    console.log(sql_params);
    conn.exec(sql, sql_params, function (err, result) {
        if (err) throw err;
        cb(result);
    });
};

Ventas.cuentas.cobrar = function (params, query, cb) {
    var key = buildCuentasCobrarCacheKey(params, query);
    var cached = getCachedCuentasCobrar(key);

    if (cached) {
        cb(cached);
        return;
    }

    if (cuentasCobrarPending.has(key)) {
        cuentasCobrarPending.get(key)
            .then(function (rows) {
                cb(rows);
            })
            .catch(function (error) {
                console.error('Error reutilizando cuentas por cobrar pendiente:', error);
                cb([]);
            });
        return;
    }

    var request = new Promise(function (resolve, reject) {
        try {
            computeCuentasCobrar(params, query, function (rows) {
                resolve(rows || []);
            });
        } catch (error) {
            reject(error);
        }
    })
        .then(function (rows) {
            setCachedCuentasCobrar(key, rows);
            cuentasCobrarPending.delete(key);
            return rows;
        })
        .catch(function (error) {
            cuentasCobrarPending.delete(key);
            throw error;
        });

    cuentasCobrarPending.set(key, request);

    request
        .then(function (rows) {
            cb(rows);
        })
        .catch(function (error) {
            console.error('Error cargando cuentas por cobrar:', error);
            cb([]);
        });
};

Ventas.estadisticas = {};
Ventas.estadisticas.clientes = function (params, query) {
    if (!query.empresa || !query.sucursal || !query.start || !query.end || !query.moneda) {
        return Promise.reject(new Error('Parametros incompletos para estadisticas de clientes'));
    }
    var clientes = [];
    if (query.cliente) {
        clientes = Array.isArray(query.cliente) ? query.cliente.slice(0, maxSelect) : [query.cliente];
    }
    var anhoExpr = dbIsPostgres() ? "extract(year from dba.vtacab.fha_cbte)::integer" : "year(dba.vtacab.fha_cbte)";
    var mesExpr = dbIsPostgres() ? "extract(month from dba.vtacab.fha_cbte)::integer" : "month(dba.vtacab.fha_cbte)";
    var whereBase =
        "AND ( dba.vtacab.anulado = 'N' ) " +
        "AND ( dba.vtacab.cod_empresa = '" + esc(query.empresa) + "' ) " +
        "AND ( dba.vtacab.cod_sucursal = '" + esc(query.sucursal) + "' ) " +
        "AND Date(dba.vtacab.fha_cbte) >= Date ('" + esc(query.start) + "') " +
        "AND Date(dba.vtacab.fha_cbte) <= Date ('" + esc(query.end) + "') " +
        monedaVentasCondition(query.moneda, "dba.vtacab.codmoneda");
    if (clientes.length) {
        whereBase += "AND ( dba.clientes.cod_cliente IN " + q.in(clientes) + " ) ";
    }
    if (query.tipoCliente) {
        whereBase += "AND ( dba.clientes.cod_tp_cliente = '" + esc(query.tipoCliente) + "' ) ";
    }
    var selectBase =
        " trim(dba.vtacab.codmoneda) as moneda, " +
        "__TIPO__ as tipo, " +
        " trim(dba.vtacab.cod_cliente) as vend, " +
        " trim(dba.clientes.razon_social) as nombre, " +
        anhoExpr + " as anho, " +
        mesExpr + " as mes, " +
        " sum(dba.vtacab.total_venta) as total ";
    var fromJoin =
        " FROM dba.clientes, dba.vtacab, dba.tpocbte " +
        "WHERE ( dba.vtacab.cod_cliente = dba.clientes.cod_cliente ) " +
        "AND ( dba.vtacab.cod_empresa = dba.clientes.cod_empresa ) " +
        "AND ( dba.vtacab.cod_empresa = dba.tpocbte.cod_empresa ) " +
        "AND ( dba.vtacab.cod_tp_comp = dba.tpocbte.cod_tp_comp ) ";
    var groupBy = " GROUP BY trim(dba.vtacab.codmoneda), trim(dba.vtacab.cod_cliente), trim(dba.clientes.razon_social), " + anhoExpr + ", " + mesExpr + " ";
    var sqlVentas =
        "SELECT " + selectBase.replace("__TIPO__", "'venta'") +
        fromJoin +
        "AND ( dba.tpocbte.tp_def <> 'NC' ) " +
        whereBase +
        groupBy;
    var sqlCreditos =
        "SELECT " + selectBase.replace("__TIPO__", "'credito'") +
        fromJoin +
        "AND ( dba.tpocbte.tp_def = 'NC' ) " +
        whereBase +
        groupBy;
    var sql = sqlVentas + " UNION ALL " + sqlCreditos + " ORDER BY moneda, vend, anho, mes, tipo";
    return conn.execAsync(sql);
};

Ventas.estadisticas.articulos = function (params, query) {
    var sql =
        "SELECT vend = Trim (dba.vtadet.cod_articulo), tipo = if dba.tpocbte.tp_def = " +
        "'NC' then 'credito' else 'venta' endif, nombre = Trim (dba.articulo.des_art ), anho = " +
        "year (dba.vtacab.fha_cbte ), mes = month (dba.vtacab.fha_cbte ), total = sum " +
        "(dba.vtadet.cantidad ), familia = dba.articulo.cod_familia\n" +
        "FROM dba.articulo, dba.vtacab, dba.vtadet, dba.tpocbte, dba.clientes\n" +
        "WHERE (dba.vtadet.cod_empresa = dba.vtacab.cod_empresa ) AND " +
        "( dba.vtadet.cod_tp_comp = dba.vtacab.cod_tp_comp ) AND " +
        "( dba.vtadet.comp_numero = dba.vtacab.comp_numero ) AND " +
        "( dba.vtacab.cod_cliente = dba.clientes.cod_cliente ) AND " +
        "( dba.vtacab.cod_empresa = dba.clientes.cod_empresa ) AND " +
        "( dba.vtadet.cod_articulo = dba.articulo.cod_articulo ) AND " +
        "( dba.vtadet.cod_empresa = dba.articulo.cod_empresa ) AND " +
        "( dba.vtacab.cod_empresa = dba.tpocbte.cod_empresa ) AND " +
        "( dba.vtacab.cod_tp_comp = dba.tpocbte.cod_tp_comp )\n" +
        "AND ( dba.vtacab.anulado = 'N' ) " +
        "AND ( dba.vtacab.cod_empresa = ? ) ";
    if (query.articulo) {
        var articulos = Array.isArray(query.articulo) ? query.articulo.slice(0, maxSelect) : [query.articulo];
        sql += "AND ((dba.vtadet.cod_articulo IN " + q.in(articulos) + " )) ";
    }
    sql +=
        "AND ( vtadet.cod_sucursal = ? ) " +
        "AND Date(dba.vtacab.fha_cbte) >= Date (?) " +
        "AND Date(dba.vtacab.fha_cbte) <= Date (?)\n" +
        "GROUP BY vend, tipo, nombre, anho, mes, familia\n" +
        "ORDER BY 1, 2, 3, 4";

    var sqlParams = [query.empresa, query.sucursal, query.start, query.end];
    return conn.execAsync(sql, sqlParams);
};

Ventas.estadisticas.vendedores = function (params, query) {
    if (!query.empresa || !query.sucursal || !query.start || !query.end || !query.moneda) {
        return Promise.reject(new Error('Parametros incompletos para estadisticas de vendedores'));
    }
    var vendedores = [];
    if (query.vendedor) {
        vendedores = Array.isArray(query.vendedor) ? query.vendedor.slice(0, maxSelect) : [query.vendedor];
    }
    var sql =
        "SELECT moneda = Trim ( dba.vtacab.codmoneda ),\n" +
        "vend = Trim ( dba.vtacab.cod_vendedor ), " +
        "tipo = if dba.tpocbte.tp_def = 'NC' then 'credito' else 'venta' endif, " +
        "nombre = Trim ( dba.vendedor.des_vendedor), " +
        "anho = year ( dba.vtacab.fha_cbte ), " +
        "mes = month ( dba.vtacab.fha_cbte ), " +
        "total = sum ( dba.vtacab.total_venta ) " +
        "FROM dba.vendedor, dba.vtacab, dba.tpocbte, dba.clientes\n" +
        "WHERE (dba.vtacab.cod_vendedor = dba.vendedor.cod_vendedor)\n" +
        "AND (dba.vtacab.cod_empresa = dba.tpocbte.cod_empresa) " +
        "AND (dba.vtacab.cod_tp_comp = dba.tpocbte.cod_tp_comp) " +
        "AND (dba.vtacab.cod_empresa = dba.clientes.cod_empresa) " +
        "AND (dba.vtacab.cod_cliente = dba.clientes.cod_cliente) " +
        "AND (dba.vtacab.anulado = 'N') " +
        "AND (dba.vtacab.cod_empresa = ?) " +
        "AND (dba.vtacab.cod_sucursal = ?) " +
        "AND Date(dba.vtacab.fha_cbte) >= Date (?) " +
        "AND Date(dba.vtacab.fha_cbte) <= Date (?) " +
        "AND (moneda = ?)\n" +
        "GROUP BY moneda, vend, tipo, nombre, anho, mes\n" +
        "ORDER BY 1, 2, 3, 4, 5";

    if (vendedores.length) {
        sql = sql.replace(
            "AND Date(dba.vtacab.fha_cbte) >= Date (?) ",
            "AND ( dba.vtacab.cod_vendedor IN " + q.in(vendedores) + " ) AND Date(dba.vtacab.fha_cbte) >= Date (?) "
        );
    }

    var sqlParams = [query.empresa, query.sucursal, query.start, query.end, query.moneda];

    return conn.execAsync(sql, sqlParams);
};

module.exports = Ventas;
