var conn = require('../db_integrado');
var q = require('./queryUtils');
var Stock = {};

Stock.articulos = function (params, query) {
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

    if (query.articulo) {
        if (query.articulo.constructor === Array) {
            sql += "AND articulo.cod_articulo IN " + q.in(query.articulo) + "\n";
        } else {
            sql += "AND articulo.cod_articulo = ?\n";
            sqlParams.push(query.articulo);
        }
    }
    if (query.tipo) {
        sql += "AND articulo.cod_tp_art = ?\n";
        sqlParams.push(query.tipo);
    }
    if (query.estado) {
        sql += "AND articulo.estado = ?\n";
        sqlParams.push(query.estado);
    }
    if (query.familia) {
        sql += "AND articulo.cod_familia = ?\n";
        sqlParams.push(query.familia);
    }
    if (query.grupo) {
        sql += "AND articulo.cod_grupo = ?\n";
        sqlParams.push(query.grupo);
    }
    if (query.rotacion) {
        sql += "AND articulo.rotacion = ?\n";
        sqlParams.push(query.rotacion);
    }
    sql += "ORDER BY dba.articulo.cod_familia, dba.articulo.cod_grupo;";

    return conn.execAsync(sql, sqlParams);
};

Stock.listaPrecios = function (params, query) {
    if (!query.lista) query.lista = '1';
    if (!query.sucursal) query.sucursal = '';
    var sql =
        "SELECT DBA.articulo.cod_empresa, DBA.articulo.cod_familia, " +
        "DBA.articulo.cod_grupo, DBA.articulo.cod_subgrupo, " +
        "DBA.articulo.cod_individual, if dba.articulo.codartpad is null then " +
        "dba.articulo.cod_articulo else dba.articulo.codartpad endif as codigo, " +
        "DBA.articulo.nroarticulo, DBA.articulo.cod_original, DBA.articulo.referencia, " +
        "DBA.articulo.des_art,\n";
    if (query.lista) {
        sql += "DBA.articulo.pr" + query.lista + "_gs pr_gs, DBA.articulo.pr" + query.lista + "_me pr_me,\n";
    }
    sql +=
        "DBA.articulo.cod_iva, DBA.FAMILIA.des_familia, DBA.GRUPO.des_grupo,\n" +
        "ISNULL((\n" +
        "	SELECT SUM( dba.artdep.existencia )\n" +
        "	FROM dba.artdep\n" +
        "	WHERE (dba.artdep.cod_empresa = dba.articulo.cod_empresa )\n" +
        "	AND ( dba.artdep.cod_articulo = dba.articulo.cod_articulo )\n" +
        "	AND ( dba.artdep.cod_sucursal = ? )\n" +
        "), 0) existencia\n" +
        "FROM dba.articulo, DBA.FAMILIA, DBA.GRUPO\n" +
        "WHERE ( dba.articulo.Cod_Familia = DBA.GRUPO.cod_familia )\n" +
        "AND ( dba.articulo.Cod_Grupo = dba.GRUPO.cod_grupo)\n" +
        "AND ( dba.articulo.Cod_Familia = dba.FAMILIA.Cod_Familia)\n" +
        "AND ( articulo.cod_empresa = ?)\n";

    var sqlParams = [query.sucursal, params.empresa];
    if (query.estado) {
        sql += "AND ( articulo.estado = ?)\n";
        sqlParams.push(query.estado);
    }
    if (query.tipo) {
        sql += "AND articulo.cod_tp_art = ?\n";
        sqlParams.push(query.tipo);
    }
    if (query.familia) {
        sql += "AND articulo.cod_familia = ?\n";
        sqlParams.push(query.familia);
    }
    if (query.grupo) {
        sql += "AND articulo.cod_grupo = ?\n";
        sqlParams.push(query.grupo);
    }
    if (query.sucursal) {
        sql +=
            "AND exists ( " +
            "	select * from dba.artdep " +
            "	where articulo.cod_empresa  = artdep.cod_empresa " +
            "	and  articulo.cod_articulo = artdep.cod_articulo " +
            "	and  artdep.cod_sucursal  = ? " +
            ")\n";
        sqlParams.push(query.sucursal);
    }

    sql += "ORDER BY dba.articulo.cod_familia, dba.articulo.cod_grupo";

    return conn.execAsync(sql, sqlParams);
};

Stock.existenciaDeposito = function (params, query) {
    //Cero, Positivo y Negativo, Negativo, Positivo
    var mappings = {'Z': '=', 'PN': '!=', 'N': '<', 'P': '>'};
    var sql =
        "SELECT dba.articulo.cod_familia, dba.articulo.cod_grupo, " +
        "dba.articulo.cod_subgrupo, dba.articulo.cod_individual, " +
        "dba.articulo.cod_articulo, dba.articulo.cod_original, dba.articulo.referencia, " +
        "dba.articulo.des_art, dba.articulo.pto_pedido, dba.articulo.cantembalaje, " +
        "dba.articulo.tipoembalaje, dba.artdep.cod_deposito, dba.artdep.existencia, " +
        "dba.artdep.cod_empresa, dba.artdep.cod_sucursal, DBA.FAMILIA.des_familia\n" +
        "FROM dba.artdep, dba.articulo, dba.sucursal, DBA.FAMILIA\n" +
        "WHERE ( dba.articulo.Cod_Familia = DBA.FAMILIA.cod_familia )\n" +
        "AND ( dba.articulo.Cod_Empresa = dba.sucursal.Cod_Empresa )\n" +
        "AND ( dba.articulo.cod_empresa = dba.artdep.cod_empresa )\n" +
        "AND ( dba.articulo.cod_articulo = dba.artdep.cod_articulo )\n" +
        "AND ( dba.artdep.cod_empresa = dba.sucursal.cod_empresa )\n" +
        "AND ( dba.artdep.cod_sucursal = dba.sucursal.cod_sucursal )\n" +
        "AND dba.artdep.cod_Empresa = ?\n";
    var sqlParams = [params.empresa];

    if (query.sucursal) {
        sql += "AND dba.artdep.cod_sucursal = ?\n";
        sqlParams.push(query.sucursal);
    }

    if (query.deposito) {
        sql += "AND dba.artdep.cod_deposito = ?\n";
        sqlParams.push(query.deposito);
    }
    if (query.existencia && mappings.hasOwnProperty(query.existencia)) {
        sql += "AND dba.artdep.existencia " + mappings[query.existencia] + " 0\n";
    }
    if (query.estado) {
        sql += "AND dba.articulo.estado = ?\n";
        sqlParams.push(query.estado);
    }
    if (query.tipo) {
        sql += "AND ( (dba.articulo.cod_tp_art = ?) )\n";
        sqlParams.push(query.tipo);
    }
    if (query.familia) {
        sql += "AND (dba.articulo.cod_familia = ?)\n";
        sqlParams.push(query.familia);
    }
    if (query.grupo) {
        sql += "AND (dba.articulo.cod_grupo = ?)\n";
        sqlParams.push(query.grupo);
    }
    sql += "ORDER BY dba.articulo.cod_familia, dba.articulo.cod_grupo, dba.articulo.cod_articulo, dba.artdep.cod_sucursal";

    return conn.execAsync(sql, sqlParams);
};

Stock.listas = function () {
    var sql = "select list_precio id, list_nombre name from dba.ListaPrecio;";
    return conn.execAsync(sql);
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

Stock.depositos = function (params, query) {
    var sql =
        "SELECT cod_deposito id, des_deposito name FROM dba.DEPOSITO d\n" +
        "WHERE d.cod_empresa = ?\n" +
        "AND d.cod_sucursal = ?\n";

    var sqlParams = [params.empresa, params.sucursal];
    return conn.execAsync(sql, sqlParams);
};

module.exports = Stock;