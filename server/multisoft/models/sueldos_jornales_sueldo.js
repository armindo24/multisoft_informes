var conn = require('../db_sueldo');
var util = require('util');
var moment = require('moment');
var q = require('./queryUtils');

var Sueldos_Jornales = {};

var qProcedure = [];
var responseCallback;
var empresa = null;
var empleados = null;
var sucursal = null;
var departamento = null;

Sueldos_Jornales.delete = function (cb) {
    conn.exec("DELETE FROM dba.tmpHistLiq;", function(err, row){
        if (err) throw err;
        cb("OK");
    });
};

Sueldos_Jornales.query_1 = function (params, cb) {
    conn.exec("INSERT INTO dba.tmpHistLiq "+
                "SELECT * FROM dba.HistLiq WHERE Cod_Empresa = '"+params.empresa+"' "+
                "AND month ( Fechaliquid ) = "+params.mes+" "+
                "AND year ( Fechaliquid ) = "+params.periodo, function(err, row){
        if (err) throw err;
        cb("OK");
    });
};

Sueldos_Jornales.procedures = function (params, cb) {
    
    empresa = params.empresa;
    sucursal = params.sucursal;
    departamento = params.departamento
    empleados = params.empleados
    var date = new Date(parseInt(params.periodo), parseInt(params.mes), 0);
    
    qProcedure.push("execute dba.generar_hist_temporal_planilla1 mCodEmpresa = '"+params.empresa+"' , mFechaProces = '"+date.toISOString().substring(0, 10)+"';");
    qProcedure.push("COMMIT;");
    qProcedure.push("execute dba.generar_hist_temporal_planilla2 mCodEmpresa = '"+params.empresa+"' , mFechaProces = '"+date.toISOString().substring(0, 10)+"';");
    qProcedure.push("COMMIT;");
    qProcedure.push("execute dba.generar_hist_temporal_planilla3 mCodEmpresa = '"+params.empresa+"' , mFechaProces = '"+date.toISOString().substring(0, 10)+"';");
    qProcedure.push("COMMIT;");
    qProcedure.push("execute dba.generar_hist_temporal_planilla7 mCodEmpresa = '"+params.empresa+"' , mFechaProces = '"+date.toISOString().substring(0, 10)+"';");
    qProcedure.push("COMMIT;");
    qProcedure.push("execute dba.generar_hist_temporal_planilla8 mCodEmpresa = '"+params.empresa+"' , mFechaProces = '"+date.toISOString().substring(0, 10)+"';");
    qProcedure.push("COMMIT;");
    qProcedure.push("execute dba.generar_hist_temporal_planilla9 mCodEmpresa = '"+params.empresa+"' , mFechaProces = '"+date.toISOString().substring(0, 10)+"';");
    qProcedure.push("COMMIT;");
        
    //console.log(qProcedure);
    responseCallback = cb;
    
    executeQueue();
};

function executeQueue() {
    if (qProcedure.length == 0) {
        var string_sql = "SELECT dba.tmpplanillasdo2_hist.cod_empresa, dba.tmpplanillasdo2_hist.anho, "+
                         "dba.tmpplanillasdo2_hist.codempleado, dba.tmpplanillasdo2_hist.cod_sucursal, "+
                         "dba.tmpplanillasdo2_hist.coddpto, dba.tmpplanillasdo2_hist.codcargo, "+
                         "dba.tmpplanillasdo2_hist.fechaliquid, dba.tmpplanillasdo2_hist.aportaips, "+
                         "dba.tmpplanillasdo2_hist.diashorastrab, "+
                         "cast(dba.tmpplanillasdo2_hist.ingbasico as decimal (20,0)) as ingbasico, "+
                         "cast(dba.tmpplanillasdo2_hist.ingbasicomes as decimal (20,0)) as ingbasicomes,"+
                         "cast(dba.tmpplanillasdo2_hist.ingbasicoadicional as decimal (20,0)) as ingbasicoadicional,"+
                         "cast(dba.tmpplanillasdo2_hist.ingbonificacion as decimal (20,0)) as ingbonificacion,"+
                         "cast(dba.tmpplanillasdo2_hist.ingboniffam as decimal (20,0)) as ingboniffam,"+
                         "cast(dba.tmpplanillasdo2_hist.inghe30 as decimal (20,0)) as inghe30,"+
                         "cast(dba.tmpplanillasdo2_hist.inghe50 as decimal (20,0)) as inghe50,"+
                         "cast(dba.tmpplanillasdo2_hist.inghe100 as decimal (20,0)) as inghe100,"+
                         "cast(dba.tmpplanillasdo2_hist.ingvarios as decimal (20,0)) as ingvarios,"+
                         "cast((dba.tmpplanillasdo2_hist.ingbasico + dba.tmpplanillasdo2_hist.ingbonificacion + dba.tmpplanillasdo2_hist.ingboniffam "+
                         "+ dba.tmpplanillasdo2_hist.inghe30 + dba.tmpplanillasdo2_hist.inghe50 + dba.tmpplanillasdo2_hist.inghe100 +dba.tmpplanillasdo2_hist.ingvarios)"+
                         " as decimal (20,0)) as toting_ind,"+
                         "cast(dba.tmpplanillasdo2_hist.descaporteips as decimal (20,0)) as descaporteips,"+
                         "cast(dba.tmpplanillasdo2_hist.descvarios1 as decimal (20,0)) as descvarios1,"+
                         "cast(dba.tmpplanillasdo2_hist.descvarios2 as decimal (20,0)) as descvarios2,"+
                         "cast(dba.tmpplanillasdo2_hist.descanticipos as decimal (20,0)) as descanticipos,"+
                         "cast((dba.tmpplanillasdo2_hist.descaporteips + dba.tmpplanillasdo2_hist.descvarios1 "+
                         " + dba.tmpplanillasdo2_hist.descvarios2 + dba.tmpplanillasdo2_hist.descanticipos) as decimal (20,0)) as totdesc_ind,"+
                         "cast((toting_ind-totdesc_ind) as decimal (20,0)) as total, "+
                         "dba.tmpplanillasdo2_hist.importeletra, dba.empresa.des_empresa, dba.empleados.apellidos, "+
                         "dba.empleados.nombres, dba.sucursal.des_sucursal, dba.dpto.descrip as des_dpto FROM "+
                         "dba.tmpplanillasdo2_hist, dba.empresa, dba.empleados, dba.sucursal, dba.dpto WHERE "+
                         "( dba.tmpplanillasdo2_hist.cod_empresa = dba.empresa.cod_empresa ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_empresa = dba.empleados.cod_empresa ) and "+
                         "( dba.tmpplanillasdo2_hist.codempleado = dba.empleados.codempleado ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_empresa = dba.sucursal.cod_empresa ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_sucursal = dba.sucursal.cod_sucursal ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_empresa = dba.dpto.cod_empresa ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_sucursal = dba.dpto.cod_sucursal ) and "+
                         "( dba.tmpplanillasdo2_hist.coddpto = dba.dpto.coddpto ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_empresa = '"+empresa+"' ) ";
        if (empleados) {
            string_sql += " AND (dba.tmpplanillasdo2_hist.codempleado IN " + q.in(empleados) + ") ";
        }
        
        if (sucursal) {
            string_sql += " AND (dba.tmpplanillasdo2_hist.cod_sucursal IN " + q.in(sucursal) + ") ";
        }
        
        if (departamento) {
            string_sql += " AND (dba.tmpplanillasdo2_hist.coddpto IN " + q.in(departamento) + ") ";
        }
        
        string_sql += " ORDER BY dba.sucursal.des_sucursal";
        conn.exec(string_sql, function (err, r) {
            if (err) throw err;
            var string_sql1 = "SELECT dba.tmpplanillasdo2_hist.cod_empresa, dba.tmpplanillasdo2_hist.anho, "+
                         "dba.tmpplanillasdo2_hist.codempleado, dba.tmpplanillasdo2_hist.cod_sucursal, "+
                         "dba.tmpplanillasdo2_hist.coddpto, dba.tmpplanillasdo2_hist.codcargo, "+
                         "dba.tmpplanillasdo2_hist.fechaliquid, dba.tmpplanillasdo2_hist.aportaips, "+
                         "dba.tmpplanillasdo2_hist.diashorastrab, "+
                         "cast(dba.tmpplanillasdo2_hist.ingbasico as decimal (20,0)) as ingbasico, "+
                         "cast(dba.tmpplanillasdo2_hist.ingbasicomes as decimal (20,0)) as ingbasicomes,"+
                         "cast(dba.tmpplanillasdo2_hist.ingbasicoadicional as decimal (20,0)) as ingbasicoadicional,"+
                         "cast(dba.tmpplanillasdo2_hist.ingbonificacion as decimal (20,0)) as ingbonificacion,"+
                         "cast(dba.tmpplanillasdo2_hist.ingboniffam as decimal (20,0)) as ingboniffam,"+
                         "cast(dba.tmpplanillasdo2_hist.inghe30 as decimal (20,0)) as inghe30,"+
                         "cast(dba.tmpplanillasdo2_hist.inghe50 as decimal (20,0)) as inghe50,"+
                         "cast(dba.tmpplanillasdo2_hist.inghe100 as decimal (20,0)) as inghe100,"+
                         "cast(dba.tmpplanillasdo2_hist.ingvarios as decimal (20,0)) as ingvarios,"+
                         "cast((dba.tmpplanillasdo2_hist.ingbasico + dba.tmpplanillasdo2_hist.ingbonificacion + dba.tmpplanillasdo2_hist.ingboniffam "+
                         "+ dba.tmpplanillasdo2_hist.inghe30 + dba.tmpplanillasdo2_hist.inghe50 + dba.tmpplanillasdo2_hist.inghe100 +dba.tmpplanillasdo2_hist.ingvarios)"+
                         " as decimal (20,0)) as toting_ind,"+
                         "cast(dba.tmpplanillasdo2_hist.descaporteips as decimal (20,0)) as descaporteips,"+
                         "cast(dba.tmpplanillasdo2_hist.descvarios1 as decimal (20,0)) as descvarios1,"+
                         "cast(dba.tmpplanillasdo2_hist.descvarios2 as decimal (20,0)) as descvarios2,"+
                         "cast(dba.tmpplanillasdo2_hist.descanticipos as decimal (20,0)) as descanticipos,"+
                         "cast((dba.tmpplanillasdo2_hist.descaporteips + dba.tmpplanillasdo2_hist.descvarios1 "+
                         " + dba.tmpplanillasdo2_hist.descvarios2 + dba.tmpplanillasdo2_hist.descanticipos) as decimal (20,0)) as totdesc_ind,"+
                         "cast((toting_ind-totdesc_ind) as decimal (20,0)) as total, "+
                         "dba.tmpplanillasdo2_hist.importeletra, dba.empresa.des_empresa, dba.empleados.apellidos, "+
                         "dba.empleados.nombres, dba.sucursal.des_sucursal, dba.dpto.descrip as des_dpto FROM "+
                         "dba.tmpplanillasdo2_hist, dba.empresa, dba.empleados, dba.sucursal, dba.dpto WHERE "+
                         "( dba.tmpplanillasdo2_hist.cod_empresa = dba.empresa.cod_empresa ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_empresa = dba.empleados.cod_empresa ) and "+
                         "( dba.tmpplanillasdo2_hist.codempleado = dba.empleados.codempleado ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_empresa = dba.sucursal.cod_empresa ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_sucursal = dba.sucursal.cod_sucursal ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_empresa = dba.dpto.cod_empresa ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_sucursal = dba.dpto.cod_sucursal ) and "+
                         "( dba.tmpplanillasdo2_hist.coddpto = dba.dpto.coddpto ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_empresa = '"+empresa+"' ) ";
            if (empleados) {
                string_sql1 += " AND (dba.tmpplanillasdo2_hist.codempleado IN " + q.in(empleados) + ") ";
            }
            
            if (sucursal) {
            string_sql += " AND (dba.tmpplanillasdo2_hist.cod_sucursal IN " + q.in(sucursal) + ") ";
            }
            
            if (departamento) {
                string_sql += " AND (dba.tmpplanillasdo2_hist.coddpto IN " + q.in(departamento) + ") ";
            }
            
            string_sql1 += " ORDER BY dba.dpto.descrip";
            conn.exec(string_sql1, function (err, r1) {
                if (err) throw err;
                responseCallback([r, r1]);
            })
        })
    } else {
        exec(qProcedure.shift(), executeQueue);
    }
}

function exec(storedProcedure, cb) {
    if (storedProcedure) {
        console.log(storedProcedure);
        conn.exec(storedProcedure, function (err, r) {
            if (err) throw err;
            cb();
        });
    }
}

module.exports = Sueldos_Jornales;