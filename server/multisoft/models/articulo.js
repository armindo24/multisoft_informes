var conn = require('../db_integrado');

var Articulo = {};

function sqlValue(value) {
    if (value === null || value === undefined) return 'NULL';
    return "'" + String(value).replace(/'/g, "''") + "'";
}

Articulo.list = function (params, filters, cb) {
    filters = filters || {};
    var limit = parseInt(filters.limit, 10);
    if (!isFinite(limit) || limit <= 0) limit = 0;
    var engine = 'sqlanywhere';
    try {
        if (conn && typeof conn.getStatus === 'function') {
            engine = (conn.getStatus().engine || '').toLowerCase();
        }
    } catch (e) {}
    if (!engine) engine = 'sqlanywhere';
    var topClause = (limit > 0 && engine === 'sqlanywhere') ? ("TOP " + limit + " ") : "";

    var sql = "SELECT " + topClause +
        "dba.articulo.cod_empresa, dba.articulo.cod_articulo, dba.articulo.des_art, " +
        "dba.articulo.cod_tp_art, dba.articulo.codmoneda, dba.articulo.iva, " +
        "dba.articulo.cto_prom_gs, dba.articulo.cto_prom_me, dba.articulo.cto_ult_gs, dba.articulo.cto_ult_me " +
        "FROM dba.articulo " +
        "JOIN dba.tpoart ON dba.tpoart.cod_tp_art = dba.articulo.cod_tp_art " +
        "WHERE dba.articulo.cod_empresa = " + sqlValue(params.empresa) + " " +
        "AND COALESCE(dba.tpoart.tpdef, 'S') = 'S' ";

    if (filters.articulo && String(filters.articulo).trim().length) {
        var term = String(filters.articulo).trim() + '%';
        sql += "AND ( dba.articulo.des_art LIKE " + sqlValue(term) +
            " OR dba.articulo.cod_articulo LIKE " + sqlValue(term) + " ) ";
    }

    if (filters.tipo) {
        sql += "AND dba.articulo.cod_tp_art = " + sqlValue(filters.tipo) + " ";
    }

    sql += "ORDER BY dba.articulo.cod_articulo ";

    if (limit > 0 && engine !== 'sqlanywhere') {
        sql += " LIMIT " + limit;
    }

    conn.exec(sql, function (err, res) {
        if (err) throw err;
        cb(res);
    });
};

Articulo.all = function (params, filter) {
    var sql =
        "SELECT DISTINCT a.cod_articulo id, a.des_art name\n" +
        "FROM dba.articulo a\n" +
        "JOIN dba.tpoart ta ON ta.cod_tp_art = a.cod_tp_art\n";
    var where = "WHERE a.cod_empresa = " + sqlValue(params.empresa) + "\n" +
        "AND COALESCE(ta.tpdef, 'S') = 'S'\n";

    filter = filter || {};
    if (filter.sucursal || filter.deposito) {
        sql += "JOIN dba.artdep d ON d.cod_empresa = a.cod_empresa AND d.cod_articulo = a.cod_articulo\n";
        if (filter.sucursal) {
            where += "AND d.cod_sucursal = " + sqlValue(filter.sucursal) + "\n";
        }
        if (filter.deposito) {
            where += "AND d.cod_deposito = " + sqlValue(filter.deposito) + "\n";
        }
    }
    sql += where;
    if (filter.familia) {
        sql += "AND a.cod_familia = " + sqlValue(filter.familia) + "\n";
    }
    if (filter.grupo) {
        sql += "AND a.cod_grupo = " + sqlValue(filter.grupo) + "\n";
    }
    if (filter.tipo) {
        sql += "AND a.cod_tp_art = " + sqlValue(filter.tipo);
    }
    if (filter.articulo) {
        var term = String(filter.articulo).trim() + '%';
        sql += "AND ( a.des_art LIKE " + sqlValue(term) + " OR a.cod_articulo LIKE " + sqlValue(term) + " )";
    }

    return conn.execAsync(sql);
};

Articulo.tipos = function () {
    var sql = "SELECT cod_tp_art id, descrip name FROM dba.tpoart WHERE COALESCE(tpdef, 'S') = 'S';";
    return conn.execAsync(sql);
};

module.exports = Articulo;
