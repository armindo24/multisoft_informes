var conn = require('../db_integrado');
var util = require('util');

var CuentaContable = {};

CuentaContable.all = function (params, cb) {
    conn.exec("select CodPlanCta,(cast(CodPlanCta as varchar)+' - '+Nombre) as Nombre from DBA.PLANCTA where Cod_Empresa = '" + params.empresa + "' and PERIODO = " + params.periodo + " ORDER BY DBA.PLANCTA.CodPlanCta", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

CuentaContable.aux = function (params, cb) {
    conn.exec("select (cast(DBA.PLANAUXI.CodPlanAux as varchar)+'-'+ cast(DBA.PLANAUXI.CodPlanCta as varchar)) as CodPlanAux,(cast(DBA.PLANAUXI.CodPlanAux as varchar)+'/'+cast(DBA.PLANAUXI.CodPlanCta as varchar)+' - '+Nombre) as Nombre  from DBA.PLANAUXI where Cod_Empresa = '" + params.empresa + "' and PERIODO = " + params.periodo + " ORDER BY DBA.PLANAUXI.CodPlanAux", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

CuentaContable.auxquery = function (params, query, cb) {
    if (query.nombre == null)
        query.nombre = ""
    if (query.codigo == null)
        query.codigo = ""
    console.log("select * from dba.PLANAUXI " +
        "where periodo = '" + params.periodo + "' " +
        "and Cod_Empresa = '" + params.empresa + "' " +
        "and Imputable = 'S' " +
        "and dba.PLANAUXI.CodPlanCta >= '" + params.cuentad + "' " +
        "and dba.PLANAUXI.CodPlanCta <= '" + params.cuentah + "' " +
        "and dba.PLANAUXI.Nombre like '%" + query.nombre + "%' " +
        "and dba.PLANAUXI.CodPlanAux like '%" + query.codigo + "%'")
    conn.exec("select * from dba.PLANAUXI " +
        "where periodo = '" + params.periodo + "' " +
        "and Cod_Empresa = '" + params.empresa + "' " +
        "and Imputable = 'S' " +
        "and dba.PLANAUXI.CodPlanCta >= '" + params.cuentad + "' " +
        "and dba.PLANAUXI.CodPlanCta <= '" + params.cuentah + "' " +
        "and dba.PLANAUXI.Nombre like '%" + query.nombre + "%' " +
        "and dba.PLANAUXI.CodPlanAux like '%" + query.codigo + "%'", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

CuentaContable.auxiliar = function (params, query, cb) {
    var sql = "select * from dba.PLANAUXI p where Cod_Empresa = ? " +
        "and p.Imputable = 'S' ";
    var sql_params = [params.empresa];
    console.log(query);

    if (query.periodo) {
        sql += "and periodo = ? ";
        sql_params.push(query.periodo);
    }

    if (query.cuentad && query.cuentah) {
        sql += "and p.CodPlanCta >= ? and p.CodPlanCta <= ? ";
        sql_params.push(query.cuentad);
        sql_params.push(query.cuentah);
    }

    if (query.filter) {
        sql += " and (p.Nombre like '%s%s%s' or p.CodPlanAux like '%s%s%s')";
        sql = util.format(sql, '%', query.filter, '%', '%', query.filter, '%');
    }

    conn.exec(sql, sql_params, function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

module.exports = CuentaContable;
