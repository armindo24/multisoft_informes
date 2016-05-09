var conn = require('../db_sueldo');
var util = require('util');
var q = require('./queryUtils');
var Legajos = {};

Legajos.all = function (filters, cb) {
    //conn.exec("SET ROWCOUNT 100"); //TODO: solucionar resultados muy grandes

    var select = "id = identity(8), dba.legajo.cod_empresa, dba.legajo.codempleado, "+
                 "date(dba.legajo.fecha) as fecha, "+
                 "dba.legajo.codmvto, "+
                 "case when dba.legajo.aprobado = 'S' then 'Si' else 'No' end as aprobado,"+
                 "isnull(dba.legajo.sucanterior,'',dba.legajo.sucanterior) as sucanterior, "+
                 "isnull(dba.legajo.dptoanterior,'',dba.legajo.dptoanterior) as dptoanterior, "+         
                 "dba.legajo.cargoanterior, "+
                 "cast(dba.legajo.sueldoanterior as decimal (20,0)) as sueldoanterior, "+
                 "dba.legajo.sucactual, dba.legajo.dptoactual, "+           
                 "dba.legajo.cargoactual, "+
                 "cast(dba.legajo.sueldoactual as decimal (20,0)) as sueldoactual, "+
                 "dba.legajo.porcvariacion, dba.legajo.observacion, dba.empleados.apellidos, "+           
                 "dba.empleados.nombres, dba.empleados.cedula, "+
                 "case when cast(dba.empleados.fechanac as varchar) = '' or cast(dba.empleados.fechanac as varchar) is null then '' else cast(date(dba.empleados.fechanac) as varchar) end as fechanac, "+
                 "dba.empleados.sexo, case when dba.empleados.estcivil = 'S' then 'Soltero' else (case when dba.empleados.estcivil = 'C' then 'Casado' else (case when dba.empleados.estcivil = 'D' then 'Divorciado' else (case when dba.empleados.estcivil = 'O' then 'Otros' end) end) end) end as estcivil, "+ 
                 "case when dba.empleados.aportaips = 'S' then 'Si' else 'No' end as aportaips,"+           
                 "isnull(dba.empleados.nroips,'',dba.empleados.nroips) as nroips, "+
                 "isnull(dba.empleados.direccion,'',dba.empleados.direccion) as direccion, isnull(dba.empleados.telefono,'',dba.empleados.telefono) as telefono, date(dba.empleados.fechaentrada) as fechaentrada, dba.empresa.des_empresa, "+
                 "dba.mvtolegajo.descrip as dmovimiento, "+
                 "isnull(sucursal_a.des_sucursal,'',sucursal_a.des_sucursal) as suc_anterior, "+
                 "isnull(sucursal_b.des_sucursal,'',sucursal_b.des_sucursal) as suc_actual, "+
                 "isnull(dpto_a.descrip,'',dpto_a.descrip) as dpto_anterior, "+
                 "isnull(dpto_b.descrip,'',dpto_b.descrip) as dpto_actual, "+
                 "isnull(cargos_a.descrip,'',cargos_a.descrip) as car_anterior, "+
                 "isnull(cargos_b.descrip,'',cargos_b.descrip) as car_actual";
                 
    var from = "(dba.legajo LEFT OUTER JOIN dba.sucursal sucursal_a ON dba.legajo.cod_empresa = sucursal_a.cod_empresa AND dba.legajo.sucanterior = sucursal_a.cod_sucursal "+
               "LEFT OUTER JOIN dba.dpto dpto_a ON dba.legajo.cod_empresa = dpto_a.cod_empresa AND dba.legajo.sucanterior = dpto_a.cod_sucursal AND dba.legajo.dptoanterior = dpto_a.coddpto "+
               "LEFT OUTER JOIN dba.cargos cargos_a ON dba.legajo.cod_empresa = cargos_a.cod_empresa AND dba.legajo.cargoanterior = cargos_a.codcargo LEFT OUTER JOIN dba.sucursal sucursal_b ON "+
               "dba.legajo.cod_empresa = sucursal_b.cod_empresa AND dba.legajo.sucactual = sucursal_b.cod_sucursal LEFT OUTER JOIN dba.dpto dpto_b ON dba.legajo.cod_empresa = dpto_b.cod_empresa "+
               "AND dba.legajo.sucactual = dpto_b.cod_sucursal AND dba.legajo.dptoactual = dpto_b.coddpto LEFT OUTER JOIN dba.cargos cargos_b ON dba.legajo.cod_empresa = cargos_b.cod_empresa "+ 
               "AND dba.legajo.cargoactual = cargos_b.codcargo), dba.empleados, dba.empresa, dba.mvtolegajo";
    
    var where = "( dba.empleados.cod_empresa = dba.legajo.cod_empresa ) and ( dba.empleados.codempleado = dba.legajo.codempleado ) "+ 
                "and ( dba.legajo.cod_empresa = dba.empresa.cod_empresa ) and ( dba.legajo.cod_empresa = dba.mvtolegajo.cod_empresa ) "+
                "and ( dba.legajo.codmvto = dba.mvtolegajo.codmvto ) and ( ( dba.legajo.cod_empresa = '"+filters.empresa+"' ) )"; 

    var sql = util.format("SELECT %s FROM %s WHERE %s", select, from, where);
    
    if (filters.empleados) {
        sql += " AND (dba.legajo.codempleado IN " + q.in(filters.empleados) + ") ";
    } 
    
    if (filters.tipo) {
        sql += " AND (dba.legajo.codmvto IN " + q.in(filters.tipo) + ") ";
    } 
    
    sql += " ORDER BY dba.empleados.codempleado,dba.legajo.fecha ASC";

    console.log(sql);

    conn.exec(sql, function (err, r) {
        if (err) throw err;
        cb(r);
    });
};

module.exports = Legajos;