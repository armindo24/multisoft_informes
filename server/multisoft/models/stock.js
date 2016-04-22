var conn = require('../db_integrado');
var q = require('./queryUtils');
var Stock = {};

Stock.articulos = function (params, filter) {
    var sql =
        "SELECT dba.articulo.cod_familia, dba.familia.des_familia, " +
        "dba.articulo.cod_grupo, dba.grupo.des_grupo, dba.articulo.cod_subgrupo, " +
        "dba.subgrupo.des_subgrupo, dba.articulo.cod_individual, " +
        "dba.individual.des_individual, dba.articulo.cod_articulo, " +
        "dba.articulo.cod_original, dba.articulo.des_art, dba.articulo.comision_vta, " +
        "dba.articulo.descuento, dba.articulo.unidad, dba.articulo.cod_iva, " +
        "dba.articulo.st_max, dba.articulo.iva, dba.articulo.cod_empresa, " +
        "dba.articulo.PorcComisLista1, dba.articulo.PorcComisLista2, " +
        "dba.articulo.PorcComisLista3, dba.articulo.PorcComisLista4, " +
        "dba.articulo.porc_financ, dba.articulo.porc_financ_me\n" +
        "FROM dba.articulo" +
        "\n" +
        "LEFT OUTER JOIN dba.grupo\n" +
        "ON dba.articulo.cod_familia = dba.grupo.cod_familia " +
        "AND dba.articulo.cod_grupo = dba.grupo.cod_grupo " +
        "\n" +
        "LEFT OUTER JOIN dba.subgrupo\n" +
        "ON dba.articulo.cod_familia = dba.subgrupo.cod_familia " +
        "AND dba.articulo.cod_grupo = dba.subgrupo.cod_grupo " +
        "AND dba.articulo.cod_subgrupo = dba.subgrupo.cod_subgrupo" +
        "\n" +
        "LEFT OUTER JOIN dba.individual\n" +
        "ON dba.articulo.cod_familia = dba.individual.cod_familia " +
        "AND dba.articulo.cod_grupo = dba.individual.cod_grupo " +
        "AND dba.articulo.cod_subgrupo = dba.individual.cod_subgrupo " +
        "AND dba.articulo.cod_individual = dba.individual.cod_individual, dba.familia" +
        "\n" +
        "WHERE ( dba.articulo.cod_familia = dba.familia.cod_familia )\n" +
        "AND ( dba.articulo.cod_empresa = ? )\n" +
        "AND ( articulo.cto_prom_gs is null or articulo.cto_prom_gs <= 0 ) " +
        "AND ( articulo.cto_ult_gs is null or articulo.cto_ult_gs <= 0 ) " +
        "AND ( articulo.cto_ult_fob_gs is null or articulo.cto_ult_fob_gs <= 0 ) " +
        "AND ( articulo.cto_prom_me is null or articulo.cto_prom_me <= 0 ) " +
        "AND ( articulo.cto_ult_me is null or articulo.cto_ult_me <= 0 ) " +
        "AND ( articulo.cto_ult_fob_me is null or articulo.cto_ult_fob_me <= 0 )\n";
    var sqlParams = [params.empresa];

    if (filter.articulo) {
        if (filter.articulo.constructor === Array) {
            sql += "AND articulo.cod_articulo IN " + q.in(filter.articulo) + "\n";
        } else {
            sql += "AND articulo.cod_articulo = ?\n";
            sqlParams.push(filter.articulo);
        }
    }
    if (filter.tipo) {
        sql += "AND articulo.cod_tp_art = ?\n";
        sqlParams.push(filter.tipo);
    }
    if (filter.estado) {
        sql += "AND articulo.estado = ?\n";
        sqlParams.push(filter.estado);
    }
    if (filter.familia) {
        sql += "AND articulo.cod_familia = ?\n";
        sqlParams.push(filter.familia);
    }
    if (filter.grupo) {
        sql += "AND articulo.cod_grupo = ?\n";
        sqlParams.push(filter.grupo);
    }
    if (filter.rotacion) {
        sql += "AND articulo.rotacion = ?\n";
        sqlParams.push(filter.rotacion);
    }
    sql += "ORDER BY dba.articulo.cod_familia, dba.articulo.cod_grupo;";

    return conn.execAsync(sql, sqlParams);
};

Stock.familias = function () {
    var sql = "SELECT cod_familia id, des_familia name FROM DBA.familia  ORDER BY cod_familia ASC";
    return conn.execAsync(sql);
};

Stock.grupos = function (query) {
    if (!query.familia) return Promise.resolve({});
    var sql = "SELECT cod_grupo id, des_grupo name FROM dba.grupo WHERE Cod_Familia = ? ORDER BY cod_grupo ASC";
    var sqlParams = [query.familia];

    return conn.execAsync(sql, sqlParams);
};

module.exports = Stock;