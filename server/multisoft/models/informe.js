var conn = require('../db');
var util = require('util');
var Informe = {};

Informe.all = function (params, filters, cb) {
    console.log(params);
    console.log(filters);
    conn.exec("SET ROWCOUNT 15"); //TODO: solucionar resultados muy grandes

    var select = "dba.vtacab.cod_tp_comp, dba.vtacab.comp_numero, dba.vtacab.cod_cliente, " +
        "dba.f_get_AsoAbreviatura(dba.vtacab.cod_empresa, dba.vtacab.cod_cliente, 'V') as razon_social, " +
        "date(dba.vtacab.fha_cbte) as fecha, dba.vtacab.cod_usuario, cast(dba.vtacab.to_exento as decimal(20,2)), cast(dba.vtacab.to_gravado as decimal(20,2)), " +
        "cast(dba.vtacab.total_iva as decimal(20,2)), dba.tpocbte.des_tp_comp, cast(dba.vtacab.fact_cambio as decimal(20,2)), " +
        "dba.vtacab.tipo_iva, dba.tpocbte.tp_def, dba.tpocbte.tpomvto, dba.vtacab.cod_empresa, dba.vtacab.codmoneda, " +
        "dba.vtacab.cod_sucursal, cast(dba.vtacab.totaldescuento as decimal(20,2)), dba.vtacab.nroservicio, dba.vtacab.anulado, " +
        "dba.clientes.cat_iva, dba.clientes.ruc";
    var from = "dba.VtaCab, dba.Clientes, dba.TpoCbte";
    var where = "(dba.vtacab.anulado != 'S') and (dba.vtacab.cod_empresa = ?)"
    var args = [params.empresa];
    var join = "( dba.vtacab.cod_empresa = dba.clientes.cod_empresa ) and ( dba.vtacab.cod_cliente = dba.clientes.cod_cliente ) and ( dba.vtacab.cod_empresa =dba.tpocbte.cod_empresa ) and ( dba.vtacab.cod_tp_comp = dba.tpocbte.cod_tp_comp )";

    if (filters.cliente) {
        where += " and (dba.vtacab.cod_cliente = ?)";
        args.push(filters.cliente);
    }

    if (filters.tipo_comprobante) {
        where += " and (dba.vtacab.cod_tp_comp = ?)";
        args.push(filters.tipo_comprobante);
    }

    if (filters.fechad && filters.fechah) {
        where += " and (dba.vtacab.fha_cbte BETWEEN ? and ?)";
        args.push(filters.fechad);
        args.push(filters.fechah);
    }

    var sql = util.format("SELECT %s FROM %s WHERE %s and %s", select, from, where, join);
    console.log(sql);
    console.log(args);
    conn.exec(sql, args, function (err, r) {
        if (err) throw err;
        cb(r);
    });
};

module.exports = Informe;