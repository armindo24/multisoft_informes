var conn = require('../db');
var util = require('util');
var Informe = {};

Informe.all = function (params, cb) {
    conn.exec("SET ROWCOUNT 15"); //TODO: solucionar resultados muy grandes

    var select = "dba.vtacab.cod_tp_comp, dba.vtacab.comp_numero, dba.vtacab.cod_cliente, dba.f_get_AsoAbreviatura(dba.vtacab.cod_empresa, dba.vtacab.cod_cliente, 'V') as razon_social, dba.vtacab.fha_cbte, dba.vtacab.cod_usuario, dba.vtacab.to_exento, dba.vtacab.to_gravado, dba.vtacab.total_iva, dba.tpocbte.des_tp_comp, dba.vtacab.fact_cambio, dba.vtacab.tipo_iva, dba.tpocbte.tp_def, dba.tpocbte.tpomvto, dba.vtacab.cod_empresa, dba.vtacab.codmoneda, dba.vtacab.cod_sucursal, dba.vtacab.totaldescuento, dba.vtacab.nroservicio, dba.vtacab.anulado, dba.clientes.cat_iva, dba.clientes.ruc";
    var from = "dba.VtaCab, dba.Clientes, dba.TpoCbte";
    var where = "( dba.vtacab.cod_empresa = ? ) and ( dba.vtacab.cod_empresa = dba.clientes.cod_empresa ) and ( dba.vtacab.cod_cliente = dba.clientes.cod_cliente ) and ( dba.vtacab.cod_empresa =dba.tpocbte.cod_empresa ) and ( dba.vtacab.cod_tp_comp = dba.tpocbte.cod_tp_comp )";

    var sql = util.format("SELECT %s FROM %s WHERE %s", select, from, where);
    console.log(sql);
    console.log(params);
    conn.exec(sql, [params.empresa], function (err, r) {
        if (err) throw err;
        cb(r);
    });
};

module.exports = Informe;