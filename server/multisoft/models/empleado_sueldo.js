var conn = require('../db_sueldo');
var util = require('util');
var moment = require('moment');
var q = require('./queryUtils');

var Empleado = {};

Empleado.all = function (params, cb) {
    var string_sql = "SELECT "+
                "dba.empleados.codempleado ,"+             
                "dba.empleados.apellidos + ', ' + dba.empleados.nombres as nombres "+             
              "FROM "+ 
                "dba.empleados,"+ 
                "dba.empcargo,"+ 
                "dba.sucursal,"+ 
                "dba.dpto,"+ 
                "dba.cargos "+           
              "WHERE "+ 
                "( dba.empcargo.cod_empresa = dba.empleados.cod_empresa ) "+   
                "and ( dba.empcargo.codempleado = dba.empleados.codempleado )"+   
                "and ( dba.empcargo.cod_empresa = dba.sucursal.cod_empresa )"+   
                "and ( dba.empcargo.cod_sucursal = dba.sucursal.cod_sucursal )"+   
                "and ( dba.empcargo.cod_empresa = dba.dpto.cod_empresa )"+ 
                "and ( dba.empcargo.cod_sucursal = dba.dpto.cod_sucursal )"+   
                "and ( dba.empcargo.coddpto = dba.dpto.coddpto )"+   
                "and ( dba.empcargo.cod_empresa = dba.cargos.cod_empresa )"+   
                "and ( dba.empcargo.codcargo = dba.cargos.codcargo )"+    
                "and ( dba.empcargo.activo = 'S' )"+     
                "and ( dba.empcargo.tpdef = 'P' )"+    
                "and ( dba.empleados.cod_empresa = '" + params.empresa + "') ";
                
                if (params.sucursal) {
                    string_sql += " AND (dba.empcargo.cod_sucursal IN " + q.in(params.sucursal) + ") ";
                }
                
                if (params.departamento) {
                    string_sql += " AND (dba.empcargo.coddpto IN " + q.in(params.departamento) + ") ";
                }
                
    conn.exec(string_sql, function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

module.exports = Empleado;