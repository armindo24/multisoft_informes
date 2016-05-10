var conn = require('../db_sueldo');
var util = require('util');
var moment = require('moment');
var q = require('./queryUtils');
var Aguinaldos_Sueldo = {};

var qProcedure = [];

var responseCallback;
var responseData;
var empresa = null;
var empleados = null;
var sucursal = null;
var departamento = null;
var Anho = null;

Aguinaldos_Sueldo.existe = function (filters, cb) {

    var sql_concepto = "SELECT ConceptoAguinaldo FROM dba.ControlSdo WHERE Cod_Empresa = '" + filters.empresa + "'"

    conn.exec(sql_concepto, function (err, r) {
        if (err) throw err;
        console.log(r);
        cb(r);
    })
};

Aguinaldos_Sueldo.procedures = function (params, cb) {
    
    empresa = params.empresa;
    sucursal = params.sucursal;
    departamento = params.departamento
    empleados = params.empleados
    
     var anho = params.fecha.substring(0, 4);
     Anho = anho
     
    qProcedure.push("execute dba.generar_liquidacion_aguinaldos mCodEmpresa = '"+params.empresa+"', mAnho = '"+anho+"', mFechaProces = '"+params.fecha+"';");
    qProcedure.push("COMMIT;");
        
    responseCallback = cb;  
    
    executeQueue();
};

function executeQueue() {
    if (qProcedure.length == 0) {
        var string_sql = "SELECT "+
                            "dba.liqaguinaldo.cod_empresa," +   
                            "dba.liqaguinaldo.anho," +
                            "dba.liqaguinaldo.codempleado," +   
                            "dba.liqaguinaldo.cod_sucursal, "+
                            "dba.SUCURSAL.Des_Sucursal as des_sucursal," +   
                            "dba.liqaguinaldo.coddpto," +
                            "dba.DPTO.Descrip as des_dpto," +
                            "dba.liqaguinaldo.codcargo," +
                            "dba.liqaguinaldo.codconcepto," +   
                            "dba.liqaguinaldo.fechaliquid," +
                            "cast(dba.liqaguinaldo.enero as decimal (20,0)) as enero," +   
                            "cast(dba.liqaguinaldo.febrero as decimal (20,0)) as febrero," +   
                            "cast(dba.liqaguinaldo.marzo as decimal (20,0)) as marzo," +   
                            "cast(dba.liqaguinaldo.abril as decimal (20,0)) as abril," +   
                            "cast(dba.liqaguinaldo.mayo as decimal (20,0)) as mayo," +   
                            "cast(dba.liqaguinaldo.junio as decimal (20,0)) as junio," +   
                            "cast(dba.liqaguinaldo.julio as decimal (20,0)) as julio," +   
                            "cast(dba.liqaguinaldo.agosto as decimal (20,0)) as agosto," +   
                            "cast(dba.liqaguinaldo.setiembre as decimal (20,0)) as setiembre," +   
                            "cast(dba.liqaguinaldo.octubre as decimal (20,0)) as octubre," +   
                            "cast(dba.liqaguinaldo.noviembre as decimal (20,0)) as noviembre," +   
                            "cast(dba.liqaguinaldo.diciembre as decimal (20,0)) as diciembre," +   
                            "dba.liqaguinaldo.procesadohasta," +   
                            "dba.empleados.apellidos," +   
                            "dba.empleados.nombres," +   
                            "dba.empleados.fechaentrada," +   
                            "dba.empresa.des_empresa, "+
                            "(enero + febrero + marzo + abril + mayo + junio + julio + agosto + setiembre + octubre + noviembre + diciembre) as totgen, " +
                            "cast((enero + febrero + marzo + abril + mayo + junio + julio + agosto + setiembre + octubre + noviembre + diciembre)/12 as decimal (20,0)) as aguipropdet " +
                         "FROM "+
                            "dba.liqaguinaldo,"+   
                            "dba.empleados,"+   
                            "dba.empresa,"+
                            "dba.SUCURSAL,"+
                            "dba.DPTO "+
                         "WHERE "+ 
                            "( dba.liqaguinaldo.cod_empresa = dba.empleados.cod_empresa ) and "+  
                            "( dba.liqaguinaldo.codempleado = dba.empleados.codempleado ) and "+  
                            "( dba.liqaguinaldo.cod_empresa = dba.empresa.cod_empresa ) and "+  
                            "( dba.SUCURSAL.Cod_Sucursal = dba.LIQAGUINALDO.Cod_Sucursal ) AND "+ 
                            "( dba.SUCURSAL.Cod_Empresa = dba.EMPRESA.Cod_Empresa ) and "+
                            "( dba.DPTO.CodDpto = dba.LIQAGUINALDO.CodDpto ) AND "+ 
                            "( dba.DPTO.Cod_Sucursal = dba.LIQAGUINALDO.Cod_Sucursal ) and "+
                            "( dba.DPTO.Cod_Empresa = dba.LIQAGUINALDO.Cod_Empresa ) AND "+
                            "( dba.DPTO.Cod_Empresa = dba.EMPRESA.Cod_Empresa ) and "+
                            "( dba.DPTO.Cod_Sucursal = dba.SUCURSAL.Cod_Sucursal ) and "+
                            "( dba.liqaguinaldo.cod_empresa = '"+empresa+"' ) AND "+
                            "( dba.liqaguinaldo.anho = "+Anho+" ) ";
        if (empleados) {
            string_sql += " AND (dba.liqaguinaldo.codempleado IN " + q.in(empleados) + ") ";
        }
        
        if (sucursal) {
            string_sql += " AND (dba.liqaguinaldo.cod_sucursal IN " + q.in(sucursal) + ") ";
        }
        
        if (departamento) {
            string_sql += " AND (dba.LIQAGUINALDO.CodDpto IN " + q.in(departamento) + ") ";
        }
        
        string_sql += " ORDER BY dba.sucursal.des_sucursal";
        
        console.log(string_sql);
        
        conn.exec(string_sql, function (err, r) {
            if (err) throw err;
            var string_sql1 = "SELECT "+
                                "dba.liqaguinaldo.cod_empresa," +   
                                "dba.liqaguinaldo.anho," +
                                "dba.liqaguinaldo.codempleado," +   
                                "dba.liqaguinaldo.cod_sucursal, "+
                                "dba.SUCURSAL.Des_Sucursal as des_sucursal," +   
                                "dba.liqaguinaldo.coddpto," +
                                "dba.DPTO.Descrip as des_dpto," +
                                "dba.liqaguinaldo.codcargo," +
                                "dba.liqaguinaldo.codconcepto," +   
                                "dba.liqaguinaldo.fechaliquid," +
                                "cast(dba.liqaguinaldo.enero as decimal (20,0)) as enero," +   
                                "cast(dba.liqaguinaldo.febrero as decimal (20,0)) as febrero," +   
                                "cast(dba.liqaguinaldo.marzo as decimal (20,0)) as marzo," +   
                                "cast(dba.liqaguinaldo.abril as decimal (20,0)) as abril," +   
                                "cast(dba.liqaguinaldo.mayo as decimal (20,0)) as mayo," +   
                                "cast(dba.liqaguinaldo.junio as decimal (20,0)) as junio," +   
                                "cast(dba.liqaguinaldo.julio as decimal (20,0)) as julio," +   
                                "cast(dba.liqaguinaldo.agosto as decimal (20,0)) as agosto," +   
                                "cast(dba.liqaguinaldo.setiembre as decimal (20,0)) as setiembre," +   
                                "cast(dba.liqaguinaldo.octubre as decimal (20,0)) as octubre," +   
                                "cast(dba.liqaguinaldo.noviembre as decimal (20,0)) as noviembre," +   
                                "cast(dba.liqaguinaldo.diciembre as decimal (20,0)) as diciembre," +   
                                "dba.liqaguinaldo.procesadohasta," +   
                                "dba.empleados.apellidos," +   
                                "dba.empleados.nombres," +   
                                "dba.empleados.fechaentrada," +   
                                "dba.empresa.des_empresa, "+
                            "(enero + febrero + marzo + abril + mayo + junio + julio + agosto + setiembre + octubre + noviembre + diciembre) as totgen, " +
                            "cast((enero + febrero + marzo + abril + mayo + junio + julio + agosto + setiembre + octubre + noviembre + diciembre)/12 as decimal (20,0)) as aguipropdet " +
                             "FROM "+
                                "dba.liqaguinaldo,"+   
                                "dba.empleados,"+   
                                "dba.empresa,"+
                                "dba.SUCURSAL,"+
                                "dba.DPTO "+
                             "WHERE "+ 
                                "( dba.liqaguinaldo.cod_empresa = dba.empleados.cod_empresa ) and "+  
                                "( dba.liqaguinaldo.codempleado = dba.empleados.codempleado ) and "+  
                                "( dba.liqaguinaldo.cod_empresa = dba.empresa.cod_empresa ) and "+  
                                "( dba.SUCURSAL.Cod_Sucursal = dba.LIQAGUINALDO.Cod_Sucursal ) AND "+ 
                                "( dba.SUCURSAL.Cod_Empresa = dba.EMPRESA.Cod_Empresa ) and "+
                                "( dba.DPTO.CodDpto = dba.LIQAGUINALDO.CodDpto ) AND "+ 
                                "( dba.DPTO.Cod_Sucursal = dba.LIQAGUINALDO.Cod_Sucursal ) and "+
                                "( dba.DPTO.Cod_Empresa = dba.LIQAGUINALDO.Cod_Empresa ) AND "+
                                "( dba.DPTO.Cod_Empresa = dba.EMPRESA.Cod_Empresa ) and "+
                                "( dba.DPTO.Cod_Sucursal = dba.SUCURSAL.Cod_Sucursal ) and "+
                                "( dba.liqaguinaldo.cod_empresa = '"+empresa+"' ) AND "+
                                "( dba.liqaguinaldo.anho = "+Anho+" ) ";
            if (empleados) {
                string_sql1 += " AND (dba.liqaguinaldo.codempleado IN " + q.in(empleados) + ") ";
            }
            
            if (sucursal) {
                string_sql1 += " AND (dba.liqaguinaldo.cod_sucursal IN " + q.in(sucursal) + ") ";
            }
            
            if (departamento) {
                string_sql1 += " AND (dba.LIQAGUINALDO.CodDpto IN " + q.in(departamento) + ") ";
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


module.exports = Aguinaldos_Sueldo;