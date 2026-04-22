var conn = require('../db_sueldo');
var utils = require('./queryUtils');

var Empresa = {};

function normalizeEmpresaRows(rows) {
    if (!Array.isArray(rows)) return [];
    return rows.map(function (r) {
        if (!r || typeof r !== 'object') return r;
        var cod = (typeof r.Cod_Empresa !== 'undefined') ? r.Cod_Empresa : r.cod_empresa;
        var des = (typeof r.Des_Empresa !== 'undefined') ? r.Des_Empresa : r.des_empresa;
        if (typeof cod === 'undefined' && typeof des === 'undefined') return r;
        r.Cod_Empresa = cod;
        r.Des_Empresa = des;
        return r;
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
        if (value.indexOf("'") !== -1 || value.indexOf(",") !== -1) return value;
        return "'" + value.replace(/'/g, "''") + "'";
    }
    return "'" + String(value).replace(/'/g, "''") + "'";
};

Empresa.all = function (query, cb) {
    var sql = "select Cod_Empresa,Des_Empresa from dba.EMPRESA";
    if (query.empresa) {
        sql += " WHERE Des_Empresa LIKE '" + query.empresa + "%'";
    }
    return conn.execAsync(sql).then(normalizeEmpresaRows);
};

Empresa.notin = function (body, cb) {
    var empresas = toSqlList(body && body.empresas);
    var sql = "select Cod_Empresa,Des_Empresa from dba.EMPRESA where Cod_Empresa not in (" + empresas + ")";
    conn.exec(sql, function (err, row) {
        if (err) {
            console.error('[EmpresaSueldo.notin] error:', err.message || err);
            return cb([]);
        }
        cb(normalizeEmpresaRows(row));
    });
};

Empresa.inin = function (body, cb) {
    var empresas = toSqlList(body && body.empresas);
    var sql = "select Cod_Empresa,Des_Empresa from dba.EMPRESA where Cod_Empresa in (" + empresas + ")";
    console.log('[EmpresaSueldo.inin] sql=', sql, 'raw_empresas=', body && body.empresas);
    conn.exec(sql, function (err, row) {
        if (err) {
            console.error('[EmpresaSueldo.inin] error:', err.message || err);
            return cb([]);
        }
        cb(normalizeEmpresaRows(row));
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
        if (err) {
            console.error('[EmpresaSueldo.bancos] error:', err.message || err);
            return cb([]);
        }
        cb(row);
    });
};


Empresa.cuentas = function (params, query, cb) {
    var sql = "select c.cuentabanco, c.nombre from dba.cuentabancaria c where c.codbanco = ? and c.cod_empresa = ?";
    var sql_params = [params.banco, params.empresa];
    conn.exec(sql, sql_params, function (err, row) {
        if (err) {
            console.error('[EmpresaSueldo.cuentas] error:', err.message || err);
            return cb([]);
        }
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

Empresa.list = function (list) {
    var sql = "Select Cod_Empresa, Des_Empresa from dba.EMPRESA where Cod_Empresa in " + utils.in(list);
    console.log(sql);
    return conn.execAsync(sql).then(normalizeEmpresaRows);
};

module.exports = Empresa;
