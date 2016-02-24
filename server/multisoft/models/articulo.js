var conn = require('../db');

var Articulo = {};

Articulo.list = function (params, filters, cb) {
    var sql = "SELECT dba.articulo.cod_empresa, dba.articulo.cod_articulo, dba.articulo.cod_familia, " +
        "dba.articulo.cod_grupo, dba.articulo.cod_subgrupo, dba.articulo.cod_individual, dba.articulo.cod_original, " +
        "dba.articulo.codmoneda, dba.articulo.cod_tp_art, dba.articulo.unidad, dba.articulo.des_art, dba.articulo.iva, " +
        "dba.articulo.cod_iva, dba.familia.des_familia, dba.articulo.cod_usuario, dba.articulo.comision_vta, " +
        "dba.articulo.descuento, dba.articulo.fha_ult_mov, dba.articulo.st_max, dba.articulo.pto_pedido, " +
        "dba.articulo.cto_prom_gs, dba.articulo.cto_prom_me, dba.articulo.cto_ult_gs, dba.articulo.cto_ult_me, " +
        "dba.articulo.cto_ult_fob_gs, dba.articulo.cto_ult_fob_me, dba.articulo.pr1_gs, dba.articulo.pr1_me, " +
        "dba.articulo.pr2_gs, dba.articulo.pr2_me, dba.articulo.pr3_gs, dba.articulo.pr3_me, dba.articulo.pr4_gs, " +
        "dba.articulo.pr4_me, dba.articulo.cta_cont, dba.articulo.aux_cont, dba.articulo.codartpad, " +
        "dba.articulo.referencia, dba.articulo.estado, dba.articulo.cantembalaje, dba.articulo.porcpartgravado, " +
        "dba.articulo.ctaimpcurso, dba.articulo.auximpcurso FROM dba.articulo, dba.familia, DBA.tpoart " +
        "WHERE ( dba.articulo.cod_familia = dba.familia.cod_familia ) AND " +
        "( dba.articulo.cod_tp_art = DBA.tpoart.cod_tp_art ) AND ( articulo.cod_empresa = ? ) AND " +
        "( DBA.TPOART.tpdef IN ('A', 'I') )";

    var sql_params = [params.empresa];

    conn.exec(sql, sql_params, function (err, res) {
        if (err) throw err;
        cb(res);
    });
};

module.exports = Articulo;