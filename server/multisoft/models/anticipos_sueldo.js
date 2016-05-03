var conn = require('../db_sueldo');
var util = require('util');
var moment = require('moment');
var q = require('./queryUtils');

var Anticipos = {};

var qProcedure = [];
var responseCallback;
var empresa = null;
var empleados = null;
var sucursal = null;
var departamento = null;

Anticipos.delete = function (cb) {
    conn.exec("DELETE FROM dba.tmpHistLiq;", function(err, row){
        if (err) throw err;
        cb("OK");
    });
};

Anticipos.query_1 = function (params, cb) {
    conn.exec("INSERT INTO dba.tmpHistLiq "+
                "SELECT * FROM dba.HistLiq WHERE Cod_Empresa = '"+params.empresa+"' "+
                "AND month ( Fechaliquid ) = "+params.mes+" "+
                "AND year ( Fechaliquid ) = "+params.periodo, function(err, row){
        if (err) throw err;
        cb("OK");
    });
};

Anticipos.procedures = function (params, cb) {
    
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
        var string_sql = "SELECT "+
                            "dba.tmphistliq.cod_empresa, "+   
                            "dba.tmphistliq.codempleado, "+
                            "dba.tmphistliq.codconcepto, "+  
                            "cast(dba.tmphistliq.importe as decimal (20,0)) as importe, "+  
                            "dba.empresa.des_empresa, "+  
                            "dba.concepsueldo.descrip, "+  
                            "dba.empleados.apellidos, "+  
                            "dba.empleados.nombres, "+
                            "dba.empleados.cedula, "+
                            "dba.sucursal.cod_sucursal, "+
                            "dba.sucursal.des_sucursal, "+   
                            "dba.dpto.CodDpto as coddpto, "+
                            "dba.dpto.descrip as des_dpto "+       
                        "FROM "+
                            "dba.tmphistliq, "+          
                            "dba.empresa, "+          
                            "dba.concepsueldo, "+  
                            "dba.sucursal, " +
                            "dba.dpto, " +        
                            "dba.empleados "+    
                        "WHERE "+ 
                            "( dba.tmphistliq.cod_empresa = dba.empresa.cod_empresa ) "+ 
                            "and ( dba.tmphistliq.cod_empresa = dba.concepsueldo.cod_empresa ) "+ 
                            "and ( dba.tmphistliq.codconcepto = dba.concepsueldo.codconcepto ) "+ 
                            "and ( dba.tmphistliq.cod_empresa = dba.empleados.cod_empresa ) "+ 
                            "and ( dba.tmphistliq.codempleado = dba.empleados.codempleado ) "+
                            "and ( dba.tmphistliq.cod_sucursal = dba.sucursal.cod_sucursal ) "+
                            "and ( dba.tmphistliq.cod_empresa = dba.sucursal.Cod_Empresa ) "+
                            "and ( dba.tmphistliq.CodDpto = dba.dpto.CodDpto ) "+   
                            "and (dba.DPTO.Cod_Sucursal = dba.SUCURSAL.Cod_Sucursal) "+
                            "and (dba.DPTO.Cod_Empresa = dba.tmpHISTLIQ.Cod_Empresa) "+
                            "and dba.tmphistliq.cod_empresa = '"+empresa+"' "+
                            "and dba.tmphistliq.codconcepto = 18";
        if (empleados) {
            string_sql += " AND (dba.tmpHISTLIQ.codempleado IN " + q.in(empleados) + ") ";
        }
        
        if (sucursal) {
            string_sql += " AND (dba.tmpHISTLIQ.cod_sucursal IN " + q.in(sucursal) + ") ";
        }
        
        if (departamento) {
            string_sql += " AND (dba.tmpHISTLIQ.CodDpto IN " + q.in(departamento) + ") ";
        }
        
        string_sql += " ORDER BY dba.sucursal.des_sucursal";
        
        console.log(string_sql);
        
        conn.exec(string_sql, function (err, r) {
            if (err) throw err;
            var string_sql1 = "SELECT "+
                            "dba.tmphistliq.cod_empresa, "+   
                            "dba.tmphistliq.codempleado, "+
                            "dba.tmphistliq.codconcepto, "+  
                            "dba.tmphistliq.importe, "+  
                            "dba.empresa.des_empresa, "+  
                            "dba.concepsueldo.descrip, "+  
                            "dba.empleados.apellidos, "+  
                            "dba.empleados.nombres, "+
                            "dba.empleados.cedula, "+    
                            "dba.sucursal.cod_sucursal, "+
                            "dba.sucursal.des_sucursal, "+   
                            "dba.dpto.CodDpto as coddpto, "+
                            "dba.dpto.descrip as des_dpto "+   
                        "FROM "+
                            "dba.tmphistliq, "+          
                            "dba.empresa, "+          
                            "dba.concepsueldo, "+  
                            "dba.sucursal, " +
                            "dba.dpto, "+          
                            "dba.empleados "+    
                        "WHERE "+ 
                            "( dba.tmphistliq.cod_empresa = dba.empresa.cod_empresa ) "+ 
                            "and ( dba.tmphistliq.cod_empresa = dba.concepsueldo.cod_empresa ) "+ 
                            "and ( dba.tmphistliq.codconcepto = dba.concepsueldo.codconcepto ) "+ 
                            "and ( dba.tmphistliq.cod_empresa = dba.empleados.cod_empresa ) "+ 
                            "and ( dba.tmphistliq.codempleado = dba.empleados.codempleado ) "+
                            "and ( dba.tmphistliq.cod_sucursal = dba.sucursal.cod_sucursal ) "+
                            "and ( dba.tmphistliq.cod_empresa = dba.sucursal.Cod_Empresa ) "+
                            "and ( dba.tmphistliq.CodDpto = dba.dpto.CodDpto ) "+   
                            "and (dba.DPTO.Cod_Sucursal = dba.SUCURSAL.Cod_Sucursal) "+
                            "and (dba.DPTO.Cod_Empresa = dba.tmpHISTLIQ.Cod_Empresa) "+
                            "and dba.tmphistliq.cod_empresa = '"+empresa+"' "+
                            "and dba.tmphistliq.codconcepto = 18";
           if (empleados) {
            string_sql1 += " AND (dba.tmpHISTLIQ.codempleado IN " + q.in(empleados) + ") ";
            }
            
            if (sucursal) {
                string_sql1 += " AND (dba.tmpHISTLIQ.cod_sucursal IN " + q.in(sucursal) + ") ";
            }
            
            if (departamento) {
                string_sql1 += " AND (dba.tmpHISTLIQ.CodDpto IN " + q.in(departamento) + ") ";
            }
            
            string_sql1 += " ORDER BY dba.dpto.descrip";
            
            console.log(string_sql1);
            
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

module.exports = Anticipos;