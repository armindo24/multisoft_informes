var conn = require('../db_integrado');
var utils = require('./queryUtils');

var Empresa = {};

function dbIsPostgres() {
    try {
        if (typeof conn.getStatus === 'function') {
            var st = conn.getStatus() || {};
            var eng = String(st.engine || st.configured_engine || '').toLowerCase();
            if (eng === 'postgres') return true;
            if (eng === 'sqlanywhere') return false;
        }
    } catch (e) {}
    return String(conn._engine || '').toLowerCase() === 'postgres';
}

function esc(v) {
    return String(v == null ? '' : v).replace(/'/g, "''");
}

function normalizeEmpresaRows(rows) {
    if (!Array.isArray(rows)) return [];
    return normalizeEmpresaMeta(rows).map(function (r) {
        if (!r || typeof r !== 'object') return r;
        var cod = (typeof r.Cod_Empresa !== 'undefined') ? r.Cod_Empresa : r.cod_empresa;
        var des = (typeof r.Des_Empresa !== 'undefined') ? r.Des_Empresa : r.des_empresa;
        if (typeof cod === 'undefined' && typeof des === 'undefined') return r;
        r.Cod_Empresa = cod;
        r.Des_Empresa = des;
        return r;
    });
}

function pickCaseInsensitive(row, keys) {
    if (!row || typeof row !== 'object') return '';
    var map = {};
    Object.keys(row).forEach(function (key) {
        map[String(key).toLowerCase()] = row[key];
    });

    for (var i = 0; i < keys.length; i += 1) {
        var value = map[String(keys[i]).toLowerCase()];
        if (typeof value !== 'undefined' && value !== null && String(value).trim() !== '') {
            return value;
        }
    }

    return '';
}

function normalizeEmpresaMeta(rows) {
    if (!Array.isArray(rows)) return [];

    return rows.map(function (row) {
        if (!row || typeof row !== 'object') return row;

        var codigoEntidad = pickCaseInsensitive(row, [
            'codigo_entidad',
            'codigoidentidad',
            'codigo_identidad',
            'codidentidad',
            'cod_identidad',
            'cod_ident',
            'codigo_unico',
            'cod_unico',
            'codigo_bcp',
            'cod_bcp'
        ]);

        if (!codigoEntidad) {
            Object.keys(row).some(function (key) {
                var normalized = String(key || '').toLowerCase();
                if (
                    normalized.indexOf('cod') >= 0 &&
                    (normalized.indexOf('ident') >= 0 || normalized.indexOf('entidad') >= 0 || normalized.indexOf('bcp') >= 0)
                ) {
                    var value = row[key];
                    if (typeof value !== 'undefined' && value !== null && String(value).trim() !== '') {
                        codigoEntidad = value;
                        return true;
                    }
                }
                return false;
            });
        }

        var ruc = String(pickCaseInsensitive(row, ['ruc', 'RUC']) || '').trim();
        var rucBase = ruc.indexOf('-') >= 0 ? ruc.split('-')[0].trim() : ruc;
        var esCasaDeBolsa = pickCaseInsensitive(row, ['es_casa_de_bolsa', 'escasadebolsa', 'casa_de_bolsa']);

        row.codigo_entidad = String(codigoEntidad || '').trim();
        row.Codigo_Entidad = row.codigo_entidad;
        row.ruc = ruc;
        row.ruc_base = rucBase;
        row.es_casa_de_bolsa = String(esCasaDeBolsa || 'N').trim() || 'N';

        return row;
    });
}

function isInvalidObjectError(err) {
    if (!err) return false;
    var code = (typeof err.code !== 'undefined') ? String(err.code) : String(err.Code || '');
    var msg = String(err.message || err.Msg || '').toLowerCase();
    return code === '-2001' || msg.indexOf('invalid object') >= 0;
}

function execWithEmpresaFallback(sqlWithDba, sqlWithoutDba) {
    return conn.execAsync(sqlWithDba).catch(function (err) {
        if (!isInvalidObjectError(err)) throw err;
        return conn.execAsync(sqlWithoutDba);
    });
}

var toSqlList = function (value) {
    if (!value) return "'X'";
    if (Array.isArray(value)) {
        if (value.length === 0) return "'X'";
        return value.map(function (v) {
            var s = String(v);
            if (s.length >= 2 && s[0] === "'" && s[s.length - 1] === "'") {
                s = s.slice(1, -1);
            }
            return "'" + s.replace(/'/g, "''") + "'";
        }).join(',');
    }
    if (typeof value === 'string') {
        // If already looks like a SQL list, use as-is
        if (value.indexOf("'") !== -1 || value.indexOf(",") !== -1) return value;
        return "'" + value.replace(/'/g, "''") + "'";
    }
    return "'" + String(value).replace(/'/g, "''") + "'";
};

Empresa.all = function (query, cb) {
    var sqlDba = "select Cod_Empresa,Des_Empresa,codigo_entidad,es_casa_de_bolsa from dba.EMPRESA";
    var sqlNoDba = "select Cod_Empresa,Des_Empresa,codigo_entidad,es_casa_de_bolsa from EMPRESA";
    var fallbackSqlDba = "select Cod_Empresa,Des_Empresa from dba.EMPRESA";
    var fallbackSqlNoDba = "select Cod_Empresa,Des_Empresa from EMPRESA";
    if (query.empresa) {
        sqlDba += " WHERE Des_Empresa LIKE '" + query.empresa + "%'";
        sqlNoDba += " WHERE Des_Empresa LIKE '" + query.empresa + "%'";
        fallbackSqlDba += " WHERE Des_Empresa LIKE '" + query.empresa + "%'";
        fallbackSqlNoDba += " WHERE Des_Empresa LIKE '" + query.empresa + "%'";
    }
    return execWithEmpresaFallback(sqlDba, sqlNoDba)
        .catch(function (err) {
            var msg = String((err && (err.message || err.Msg || err.sqlMessage)) || err || '').toLowerCase();
            if (msg.indexOf('codigo_entidad') >= 0 || msg.indexOf('es_casa_de_bolsa') >= 0 || msg.indexOf('column') >= 0 || msg.indexOf('columna') >= 0) {
                return execWithEmpresaFallback(fallbackSqlDba, fallbackSqlNoDba);
            }
            throw err;
        })
        .then(normalizeEmpresaRows);
};

Empresa.notin = function (body, cb) {
    var empresas = toSqlList(body && body.empresas);
    conn.exec("select Cod_Empresa,Des_Empresa from dba.EMPRESA where Cod_Empresa not in (" + empresas + ")", function (err, row) {
        if (err) {
            console.error(err);
            return cb([]);
        }
        cb(normalizeEmpresaRows(row));
    });
};

Empresa.inin = function (body, cb) {
    var empresas = toSqlList(body && body.empresas);
    var sql = "select Cod_Empresa,Des_Empresa from dba.EMPRESA where Cod_Empresa in (" + empresas + ")";
    console.log('[Empresa.inin] sql=', sql, 'raw_empresas=', body && body.empresas);
    conn.exec(sql, function (err, row) {
        if (err) {
            console.error(err);
            return cb([]);
        }
        cb(normalizeEmpresaRows(row));
    });
};

Empresa.list = function (list) {
    var safeList = Array.isArray(list) ? list.filter(function (v) {
        return typeof v !== 'undefined' && v !== null && String(v).trim().length > 0;
    }) : [];
    if (!safeList.length) return Promise.resolve([]);

    var inClause = utils.in(safeList);
    var sqlDba = "Select Cod_Empresa, Des_Empresa, codigo_entidad, es_casa_de_bolsa from dba.EMPRESA where Cod_Empresa in " + inClause;
    var sqlNoDba = "Select Cod_Empresa, Des_Empresa, codigo_entidad, es_casa_de_bolsa from EMPRESA where Cod_Empresa in " + inClause;
    var fallbackSqlDba = "Select Cod_Empresa, Des_Empresa from dba.EMPRESA where Cod_Empresa in " + inClause;
    var fallbackSqlNoDba = "Select Cod_Empresa, Des_Empresa from EMPRESA where Cod_Empresa in " + inClause;
    console.log(sqlDba);
    return execWithEmpresaFallback(sqlDba, sqlNoDba)
        .catch(function (err) {
            var msg = String((err && (err.message || err.Msg || err.sqlMessage)) || err || '').toLowerCase();
            if (msg.indexOf('codigo_entidad') >= 0 || msg.indexOf('es_casa_de_bolsa') >= 0 || msg.indexOf('column') >= 0 || msg.indexOf('columna') >= 0) {
                return execWithEmpresaFallback(fallbackSqlDba, fallbackSqlNoDba);
            }
            throw err;
        })
        .then(normalizeEmpresaRows);
};

Empresa.meta = function (empresa) {
    var where = " where upper(trim(cod_empresa)) = upper(trim('" + esc(empresa) + "'))";
    var sqlDba = "select * from dba.empresa" + where;
    var sqlNoDba = "select * from empresa" + where;
    return execWithEmpresaFallback(sqlDba, sqlNoDba).then(normalizeEmpresaMeta);
};

Empresa.importarVentas = function (empresa, cb) {
    var sql = "select coalesce(importar_ventas, 'N') as importar_ventas " +
        "from dba.empresa where upper(trim(cod_empresa)) = upper(trim('" + esc(empresa) + "'))";
    conn.exec(sql, function (err, row) {
        if (err) return cb([{ importar_ventas: 'N' }]);
        cb(row || [{ importar_ventas: 'N' }]);
    });
};

Empresa.clientes = function (empresa, query, cb) {
    if (!query.cliente || query.cliente.length < 2) return Promise.resolve({});
    var sql = "select Cod_Cliente, Razon_Social, Cod_Tp_Cliente from dba.Clientes WHERE Cod_Empresa = ?";
    var sql_params = [empresa];
    if (query.tipo) {
        sql += " AND Cod_Tp_Cliente = ?";
        sql_params.push(query.tipo);
    }
    if (query.sucursal) {
        sql += " AND (Cod_Sucursal = ? OR Cod_Sucursal is null)";
        sql_params.push(query.sucursal);
    }

    if (query.cliente) {
        console.log(query);
        sql += " AND Razon_Social LIKE '" + query.cliente + "%'";
    }
    console.log(sql);
    console.log(sql_params);
    return conn.execAsync(sql, sql_params);
};

Empresa.bancos = function (params, query, cb) {
    var sql = "select b.codbanco, b.descrip from dba.cuentabancaria c join dba.bancos b on b.codbanco = c.codbanco where Cod_Empresa = ?"
    var sql_params = [params.empresa];
    conn.exec(sql, sql_params, function (err, row) {
        if (err) throw err;
        cb(row);
    });
};


Empresa.cuentas = function (params, query, cb) {
    var sql = "select c.cuentabanco, c.nombre from dba.cuentabancaria c where c.codbanco = ? and c.cod_empresa = ?";
    var sql_params = [params.banco, params.empresa];
    conn.exec(sql, sql_params, function (err, row) {
        if (err) throw  err;
        cb(row);
    });
};

Empresa.vendedores = function (params, query) {
    var sql =
        "SELECT cod_vendedor, des_vendedor " +
        "FROM dba.VENDEDOR " +
        "WHERE estado = 'A' ";

    return conn.execAsync(sql);
};

module.exports = Empresa;
