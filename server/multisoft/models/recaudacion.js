var conn = require('../db');

var Recaudacion = {};

Recaudacion.planillas = function (params, query) {
    var sql =
        "select NroPlanilla from dba.RECAUDCAB\n" +
        "where Cod_Empresa = ?";
    var sql_params = [params.empresa];
    console.log(sql_params);
    return conn.execAsync(sql, sql_params);
};

Recaudacion.planillaConsolidada = function (params, query) {
    var sql = "SELECT dba.recaudcab.cod_empresa, dba.recaudcab.cod_sucursal, " +
        "dba.recaudcab.nroplanilla, dba.recaudcab.estado, dba.recaudop.nrooperacion, " +
        "dba.recauddet.linea, dba.recaudcab.cod_cajero, dba.recauddet.cod_tp_pago, " +
        "dba.recauddet.codmoneda, dba.recauddet.fact_cambio, dba.recauddet.importe, " +
        "dba.recaudcab.fecha, dba.tporecaudacion.operador, " +
        "dba.tporecaudacion.agrupacion FROM dba.recaudcab, dba.recauddet, dba.recaudop, " +
        "dba.tporecaudacion WHERE dba.recaudop.cod_empresa = dba.recaudcab.cod_empresa " +
        "and dba.recaudop.cod_sucursal = dba.recaudcab.cod_sucursal and " +
        "dba.recaudop.nroplanilla = dba.recaudcab.nroplanilla and " +
        "dba.recaudop.cod_empresa = dba.recauddet.cod_empresa and " +
        "dba.recaudop.cod_sucursal = dba.recauddet.cod_sucursal and " +
        "dba.recaudop.nroplanilla = dba.recauddet.nroplanilla and " +
        "dba.recaudop.nrooperacion = dba.recauddet.nrooperacion and " +
        "dba.tporecaudacion.cod_empresa = dba.recauddet.cod_empresa and " +
        "dba.tporecaudacion.cod_tp_pago = dba.recauddet.cod_tp_pago  " +
        "and recaudcab.cod_empresa = 'BT'  " +
        "AND ( recaudcab.cod_sucursal = '00' )  " +
        "AND ((Date(recaudcab.fecha) >= Date('2013-10-01')) AND (Date(recaudcab.fecha) <= Date('2013-10-16'))) " +
        "AND ( recaudcab.estado = 'CE') \n" +
        "UNION  SELECT dba.pagoscab.cod_empresa, dba.recaudcomp.cod_sucursal, " +
        "dba.recaudcomp.nroplanilla, dba.recaudcab.estado, dba.pagoscab.pago_numero, " +
        "dba.pagosrec.linea, dba.pagoscab.cod_cajero, dba.pagosrec.cod_tp_pago, " +
        "dba.pagosrec.codmoneda, dba.pagosrec.fact_cambio, dba.pagosrec.importe, " +
        "dba.pagoscab.fecha, dba.tporecaudacion.operador, dba.tporecaudacion.agrupacion " +
        "FROM dba.pagoscab, dba.pagosrec, dba.recaudcomp, dba.tporecaudacion, " +
        "dba.recaudcab WHERE dba.pagosrec.cod_empresa = dba.pagoscab.cod_empresa  and " +
        "dba.pagosrec.cod_tp_comp = dba.pagoscab.cod_tp_comp and " +
        "dba.pagosrec.pago_numero = dba.pagoscab.pago_numero and " +
        "dba.recaudcomp.cod_empresa = dba.pagoscab.cod_empresa and " +
        "dba.recaudcomp.cod_tp_comp = dba.pagoscab.cod_tp_comp and " +
        "dba.recaudcomp.pago_numero = dba.pagoscab.pago_numero and " +
        "dba.recaudcomp.cod_empresa = dba.recaudcab.cod_empresa and " +
        "dba.recaudcomp.cod_sucursal = dba.recaudcab.cod_sucursal and " +
        "dba.recaudcomp.nroplanilla = dba.recaudcab.nroplanilla and " +
        "dba.tporecaudacion.cod_empresa = dba.pagosrec.cod_empresa and " +
        "dba.tporecaudacion.cod_tp_pago = dba.pagosrec.cod_tp_pago  and " +
        "dba.recaudcomp.aplicacion = 'N' and recaudcab.cod_empresa = 'BT'  " +
        "AND (recaudcab.cod_sucursal = '00' ) " +
        "AND ((Date(recaudcab.fecha) >= Date('2013-10-01')) " +
        "AND (Date(recaudcab.fecha) <= Date('2013-10-16')))  " +
        "AND (recaudcab.estado = 'CE') \n" +
        "UNION SELECT dba.pagoscab.cod_empresa, dba.recaudcomp.cod_sucursal, " +
        "dba.recaudcomp.nroplanilla, dba.recaudcab.estado, dba.pagoscab.pago_numero, " +
        "dba.recaudcomp.linea, dba.pagoscab.cod_cajero, if ( tpocbte.tp_def = 'RD' ) " +
        "then 'RECIBOS' ELSE 'NOTAS DE CREDITO' ENDIF, dba.pagoscab.codmoneda, " +
        "dba.pagoscab.fact_cambio, dba.recaudcomp.importe, dba.pagoscab.fecha, 'P', " +
        "'Aplicaciones' FROM dba.pagoscab, dba.recaudcomp, dba.recaudcab, dba.tpocbte " +
        "WHERE dba.recaudcomp.cod_empresa = dba.pagoscab.cod_empresa and " +
        "dba.recaudcomp.cod_tp_comp = dba.pagoscab.cod_tp_comp and " +
        "dba.recaudcomp.pago_numero = dba.pagoscab.pago_numero and " +
        "dba.recaudcomp.cod_empresa = dba.recaudcab.cod_empresa and " +
        "dba.recaudcomp.cod_sucursal = dba.recaudcab.cod_sucursal and " +
        "dba.recaudcomp.nroplanilla = dba.recaudcab.nroplanilla and " +
        "dba.tpocbte.cod_empresa = dba.pagoscab.cod_empresa and dba.tpocbte.cod_tp_comp " +
        "= dba.pagoscab.cod_tp_comp and dba.recaudcomp.aplicacion = 'S' and " +
        "recaudcab.cod_empresa = 'BT' AND ( recaudcab.cod_sucursal = '00' ) AND " +
        "((Date(recaudcab.fecha) >= Date('2013-10-01')) AND (Date(recaudcab.fecha) <= " +
        "Date('2013-10-16'))) AND ( recaudcab.estado = 'CE') ";

    return conn.execAsync(sql);
};

Recaudacion.resumido = function (params, query) {
    var sql = "SELECT DBA.pagoscab.cod_empresa , DBA.pagoscab.cod_tp_comp , " +
        "DBA.pagoscab.pago_numero , DBA.pagoscab.fecha , DBA.pagoscab.cod_cliente , " +
        "DBA.clientes.razon_social , dba.pagosrec.cod_tp_pago , dba.pagosrec.codmoneda " +
        ", dba.pagosrec.importe , DBA.pagoscab.tot_efectivo , " +
        "dba.tporecaudacion.abreviatura, dba.moneda.descrip , dba.moneda.cantdecimal " +
        "FROM dba.pagosrec  " +
        "RIGHT OUTER JOIN DBA.pagoscab ON dba.pagosrec.cod_empresa = " +
        "DBA.pagoscab.cod_empresa AND dba.pagosrec.cod_tp_comp = " +
        "DBA.pagoscab.cod_tp_comp AND dba.pagosrec.pago_numero = " +
        "DBA.pagoscab.pago_numero, DBA.clientes , DBA.tpocbte , dba.tporecaudacion , " +
        "dba.moneda  " +
        "WHERE clientes.cod_empresa = pagoscab.cod_empresa and " +
        "clientes.cod_cliente = pagoscab.cod_cliente and tpocbte.cod_empresa = " +
        "pagoscab.cod_empresa and tpocbte.cod_tp_comp = pagoscab.cod_tp_comp and " +
        "pagosrec.cod_empresa = tporecaudacion.cod_empresa and pagosrec.cod_tp_pago = " +
        "tporecaudacion.cod_tp_pago and pagosrec.codmoneda = moneda.codmoneda and " +
        "exists ( select * from dba.recaudcab, dba.recaudcomp Where " +
        "recaudcab.cod_empresa = recaudcomp.cod_empresa and recaudcab.cod_sucursal = " +
        "recaudcomp.cod_sucursal and recaudcab.nroplanilla = recaudcomp.nroplanilla and " +
        "recaudcomp.cod_empresa = pagoscab.cod_empresa and recaudcomp.cod_tp_comp = " +
        "pagoscab.cod_tp_comp and recaudcomp.pago_numero = pagoscab.pago_numero and " +
        "pagoscab.cod_empresa = ? ";

    var sqlParams = [params.empresa];

    if (query.sucursal) {
        sql += " AND ( pagoscab.cod_sucursal = ? ) ";
        sqlParams.push(query.sucursal);
    }
    if (query.start && query.end) {
        sql += " AND ( ( Date(recaudcab.fecha) >= Date(?)) AND ( Date(recaudcab.fecha) <= Date(?)) ) ";
        sqlParams.push(query.start, query.end);
    }

    if (query.estado) {
        sql += " AND ( recaudcab.estado = ?) ) ";
        sqlParams.push(query.estado);
    }

    var sqlOrder = sql + "ORDER BY pagoscab.cod_tp_comp";
    return conn.execAsync(sqlOrder, sqlParams);
};

module.exports = Recaudacion;