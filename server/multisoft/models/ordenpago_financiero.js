var conn = require('../db_integrado');

var OrdenPagoFinanciero = {};

OrdenPagoFinanciero.all = function (params, cb) {
    var sql = "SELECT " +
        "opcab.cod_empresa, " +
        "opcab.nroop, " +
        "date(opcab.fecha) as fecha, " +
        "(if coalesce(opcab.codprov, '') <> '' then " +
            "opcab.codprov " +
        "else " +
            "opcab.codbenef " +
        "endif) as proveedor, " +
        "(if coalesce(opcab.codprov, '') <> '' then " +
            "proveed.razonsocial " +
        "else " +
            "opcab.beneficiario " +
        "endif) as descipcion_proveedor, " +
        "(if opcab.anulado = 'S' then " +
            "'Anulado' " +
        "else " +
            "if opcab.asentado = 'S' then " +
                "'Asentado' " +
            "else " +
                "if opcab.cheqimp = 'S' then " +
                    "'Pagado' " +
                "else " +
                    "if opcab.autorizado = 'S' then " +
                        "'Autorizado' " +
                    "else " +
                        "'Pendiente' " +
                    "endif " +
                "endif " +
            "endif " +
        "endif) as estado_op, " +
        "opcab.concepto, " +
        "opcab.ctabanco, " +
        "opcab.cod_usuario, " +
        "opcab.nrotransac, " +
        "proveed.ruc, " +
        "(right('000' || cast(factcab.cod_establecimiento as varchar), 3) || '-' || " +
        " right('000' || cast(factcab.cod_punto_emision as varchar), 3) || '-' || " +
        " right('0000000' || cast(factcab.nrofactura as varchar), 7)) as nro_factura, " +
        "factcab.fechafact, " +
        "factcab.fechavto, " +
        "(factcab.totalexen + factcab.totalgrav) as monto_factura, " +
        "factcab.saldo, " +
        "moneda_factura.descrip as descripcion_moneda_factura, " +
        "opdet.importe, " +
        "moneda_op.descrip as descripcion_moneda_op, " +
        "bancos.descrip, " +
        "empresa.des_empresa, " +
        "opcab.tipoop " +
        "FROM dba.opcab " +
        "LEFT OUTER JOIN dba.proveed " +
        "ON proveed.cod_empresa = opcab.cod_empresa " +
        " AND proveed.codprov = opcab.codprov " +
        "LEFT OUTER JOIN dba.opdet " +
        "ON opdet.cod_empresa = opcab.cod_empresa " +
        " AND opdet.tipoop = opcab.tipoop " +
        " AND opdet.nroop = opcab.nroop " +
        "LEFT OUTER JOIN dba.factcab " +
        "ON factcab.cod_empresa = opdet.cod_empresa " +
        " AND factcab.codprov = opdet.codprov " +
        " AND factcab.cod_tp_comp = opdet.cod_tp_comp " +
        " AND factcab.nrofact = opdet.nrofact " +
        "LEFT OUTER JOIN dba.moneda as moneda_factura " +
        "ON moneda_factura.codmoneda = factcab.codmoneda " +
        "LEFT OUTER JOIN dba.moneda as moneda_op " +
        "ON moneda_op.codmoneda = opcab.codmoneda " +
        "LEFT OUTER JOIN dba.bancos " +
        "ON bancos.codbanco = opcab.codbanco " +
        "LEFT OUTER JOIN dba.empresa " +
        "ON empresa.cod_empresa = opcab.cod_empresa " +
        "WHERE opcab.cod_empresa like '%" + params.empresa + "%' " +
        "AND opcab.fecha BETWEEN '" + params.desde + "' and '" + params.hasta + "' ";

    if (params.tipoop != 'undefined') {
        sql = sql + " AND opcab.tipoop like '%" + params.tipoop + "%' ";
    }
    if (params.moneda && params.moneda !== 'ALL' && params.moneda !== 'undefined') {
        sql = sql + " AND opcab.codmoneda = '" + params.moneda + "' ";
    }
    if (params.proveedor && params.proveedor !== 'undefined') {
        sql = sql + " AND (opcab.codprov like '%" + params.proveedor + "%' OR opcab.codbenef like '%" + params.proveedor + "%') ";
    }

    conn.exec(sql, function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

module.exports = OrdenPagoFinanciero;
