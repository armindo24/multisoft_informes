var conn = require('../db');
var util = require('util');
var q = require('./queryUtils');
var Ventas = {};

Ventas.all = function (params, filters, cb) {
    //conn.exec("SET ROWCOUNT 100"); //TODO: solucionar resultados muy grandes

    var select = "dba.vtacab.cod_tp_comp, dba.vtacab.comp_numero, dba.vtacab.cod_cliente, " +
        "dba.f_get_AsoAbreviatura(dba.vtacab.cod_empresa, dba.vtacab.cod_cliente, 'V') as razon_social, " +
        "dba.vtacab.razon_social as cliente," +
        "date(dba.vtacab.fha_cbte) as fecha, dba.vtacab.cod_usuario, cast(dba.vtacab.to_exento as decimal(20,2)), cast(dba.vtacab.to_gravado as decimal(20,2)), " +
        "cast(dba.vtacab.total_iva as decimal(20,2)), dba.tpocbte.des_tp_comp, cast(dba.vtacab.fact_cambio as decimal(20,2)), " +
        "dba.vtacab.tipo_iva, dba.tpocbte.tp_def, dba.tpocbte.tpomvto, dba.vtacab.cod_empresa, dba.vtacab.codmoneda, " +
        "dba.vtacab.cod_sucursal, cast(dba.vtacab.totaldescuento as decimal(20,2)), dba.vtacab.nroservicio, dba.vtacab.anulado, " +
        "dba.clientes.cat_iva, dba.clientes.ruc, dba.vendedor.des_vendedor";
    var from = "dba.VtaCab, dba.Clientes, dba.TpoCbte, dba.Vendedor";
    var where = "(dba.vtacab.anulado != 'S') and (dba.vtacab.cod_empresa = ?)"
    var args = [params.empresa];
    var join = "( dba.vtacab.cod_empresa = dba.clientes.cod_empresa ) and ( dba.vtacab.cod_cliente = dba.clientes.cod_cliente ) and ( dba.vtacab.cod_empresa =dba.tpocbte.cod_empresa ) and ( dba.vtacab.cod_tp_comp = dba.tpocbte.cod_tp_comp )" +
        " and (dba.vtacab.cod_vendedor = dba.vendedor.cod_vendedor)";

    if (filters.cliente) {
        where += " and (dba.vtacab.cod_cliente = ?)";
        args.push(filters.cliente);
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

Ventas.zonas = function (cb) {
    var sql = "SELECT cod_zona, des_zona FROM dba.ZONAVTA";
    conn.exec(sql, function (err, result) {
        if (err) throw err;
        cb(result);
    });
};
Ventas.cuentas = {};

Ventas.cuentas.cobrar = function (params, query, cb) {
    var sql = "SELECT dba.cuotas.cod_empresa, dba.cuotas.cod_sucursal, " +
        "dba.cuotas.mvto_numero, dba.cuotas.cuota_numero, dba.cuotas.cod_cliente, " +
        "dba.cuotas.cod_tp_comp, dba.cuotas.comp_numero, dba.cuotas.fecha_ven, " +
        "dba.cuotas.importe, dba.cuotas.saldo, dba.clientes.razon_social, " +
        "dba.clientes.direccion, dba.clientes.email, dba.clientes.telefono1, " +
        "dba.clientes.telefono2, dba.clientes.fax, dba.clientes.ruc, " +
        "dba.clientes.contacto, dba.cuotas.fact_cambio, dba.cuotas.fecha_emi, " +
        "1 as tipo\n" +
        "FROM dba.cuotas, dba.clientes\n" +
        "WHERE (dba.clientes.cod_empresa = dba.cuotas.cod_empresa) " +
        "and (dba.clientes.cod_cliente = dba.cuotas.cod_cliente) " +
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

Ventas.estadisticas = {};
Ventas.estadisticas.clientes = function (params, query) {
    if (!query.empresa || !query.cliente || !query.start || !query.end) return Promise.reject();
    var sql = "SELECT " +
        "moneda = Trim (dba.vtacab.codmoneda), " +
        "tipo = 'venta', vend = Trim(dba.vtacab.cod_cliente), " +
        "nombre = Trim (dba.clientes.razon_social), " +
        "anho = year (dba.vtacab.fha_cbte), " +
        "mes = month (dba.vtacab.fha_cbte), " +
        "total = sum(dba.vtacab.total_venta) \n" +
        "FROM dba.clientes, dba.vtacab, dba.tpocbte \n" +
        "WHERE ( dba.vtacab.cod_cliente = dba.clientes.cod_cliente ) " +
        "AND ( dba.vtacab.cod_empresa = dba.clientes.cod_empresa ) " +
        "AND ( dba.vtacab.cod_empresa = dba.tpocbte.cod_empresa ) " +
        "AND ( dba.vtacab.cod_tp_comp = dba.tpocbte.cod_tp_comp ) " +
        "AND ( dba.tpocbte.tp_def <> 'NC' ) " +
        "AND ( dba.vtacab.anulado = 'N' ) " +
        "AND ( dba.vtacab.cod_empresa = ? ) " +
        "AND ( dba.vtacab.cod_sucursal = ? ) " +
        "AND (  dba.clientes.cod_cliente IN " + q.in(query.cliente) + " )" +
        "AND Date(dba.vtacab.fha_cbte) >= Date (?) " +
        "AND Date(dba.vtacab.fha_cbte) <= Date (?) " +
        "GROUP BY moneda, vend, nombre, anho, mes \n" +
        "UNION " +
        "SELECT moneda = Trim (dba.vtacab.codmoneda), " +
        "tipo = 'credito', vend = Trim (dba.vtacab.cod_cliente), " +
        "nombre = Trim(dba.clientes.razon_social), " +
        "anho = year(dba.vtacab.fha_cbte), " +
        "mes = month(dba.vtacab.fha_cbte), " +
        "total = sum (dba.vtacab.total_venta) \n" +
        "FROM dba.clientes, dba.vtacab, dba.tpocbte \n" +
        "WHERE ( dba.vtacab.cod_cliente = dba.clientes.cod_cliente ) \n" +
        "AND ( dba.vtacab.cod_empresa = dba.clientes.cod_empresa ) " +
        "AND ( dba.vtacab.cod_empresa = dba.tpocbte.cod_empresa ) " +
        "AND ( dba.vtacab.cod_tp_comp = dba.tpocbte.cod_tp_comp ) " +
        "AND ( dba.tpocbte.tp_def = 'NC' ) " +
        "AND ( dba.vtacab.anulado = 'N' ) " +
        "AND ( dba.vtacab.cod_empresa = ? ) " +
        "AND ( dba.vtacab.cod_sucursal = ? ) " +
        "AND (  dba.clientes.cod_cliente IN " + q.in(query.cliente) + " )" +
        "AND Date(dba.vtacab.fha_cbte) >= Date (?) " +
        "AND Date(dba.vtacab.fha_cbte) <= Date (?) \n" +
        "GROUP BY moneda, vend, nombre, anho, mes \n" +
        "ORDER BY 1, 3, 4, 5, 2";
    var sqlParams = [query.empresa, query.sucursal, query.start, query.end];

    return conn.execAsync(sql, sqlParams.concat(sqlParams));
};

module.exports = Ventas;