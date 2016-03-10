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
        "AND presupcab.cod_empresa = 'BT' AND (presupcab.estado = 'A') " +
        "AND ( (Date(PresupCab.AprobadoEl) >= Date('2013-03-10'))  AND (Date(PresupCab.AprobadoEl) <= Date('2016-03-10')) ) ";

    conn.exec(sql, function (err, result) {
        if (err) throw err;
        cb(result);
    });
};

module.exports = Presupuesto;