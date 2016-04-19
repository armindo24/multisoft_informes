var conn = require('../db_integrado');

var Proveedor = {};

Proveedor.all = function (params, cb) {
    conn.exec("select CodProv,upper(RazonSocial) as RazonSocial from DBA.PROVEED where estado = 'A' and Cod_Empresa = '" + params.empresa + "' and TipoProv = '" + params.tipo + "'", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

Proveedor.list = function (params, filters, cb) {
    var sql = "select CodProv,upper(RazonSocial) as RazonSocial from DBA.PROVEED where estado = 'A' and Cod_Empresa = ?";
    var sql_params = [params.empresa];

    if (filters.tipo_proveedor) {
        sql += " and TipoProv = ?";
        sql_params.push(filters.tipo_proveedor);
    }

    conn.exec(sql, sql_params, function (err, res) {
        if (err) throw err;
        cb(res);
    });
};

module.exports = Proveedor;