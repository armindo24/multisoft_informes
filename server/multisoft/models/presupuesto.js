var conn = require('../db');

var Presupuesto = {};

Presupuesto.general = function (params, query, cb) {
    var sql = "SELECT " +
        "dba.presupcab.cod_empresa, dba.presupcab.cod_sucursal, " +
        "dba.presupcab.cod_tp_comp , dba.presupcab.comp_numero, " +
        "dba.presupcab.fha_cbte, dba.presupcab.cod_cliente, " +
        "dba.presupcab.razon_social, dba.presupcab.aprobadopor, " +
        "dba.presupcab.aprobadoel, dba.presupcab.total_venta, " +
        "dba.presupcab.codmoneda, dba.moneda.cantdecimal, " +
        "dba.moneda.descrip " +
        "FROM " +
        "dba.presupcab, dba.moneda " +
        "WHERE " +
        "(dba.moneda.codmoneda = dba.presupcab.codmoneda ) " +
        "AND presupcab.cod_empresa = ? " +
        "AND ( (Date(PresupCab.AprobadoEl) >= Date(?))  AND (Date(PresupCab.AprobadoEl) <= Date(?)) ) ";

    var sql_params = [params.empresa, query.aprobacion_start, query.aprobacion_end];

    if (query.estado) {
        sql += "AND (presupcab.estado = ?) ";
        sql_params.push(query.estado);
    }

    if (query.comprobante_start && query.comprobante_end) {
        sql += "AND (  ( Date(presupcab.fha_cbte) >= Date(?))  AND ( Date(presupcab.fha_cbte) <= Date(?))  ) ";
        sql_params.push(query.comprobante_start);
        sql_params.push(query.comprobante_end);
    }

    if (query.cliente) {
        sql += "AND ( (PresupCab.cod_cliente = ?) ) ";
        sql_params.push(query.cliente);
    }

    if (query.tipoComprobante) {
        sql += "AND presupcab.cod_tp_comp = ?";
        sql_params.push(query.tipoComprobante);
    }

    console.log(sql);
    console.log(sql_params);

    conn.exec(sql, sql_params, function (err, result) {
        if (err) throw err;
        cb(result);
    });
};

module.exports = Presupuesto;