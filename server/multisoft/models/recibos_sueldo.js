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
                            "NUMBER() as id, "+
                            "dba.tmpplanillasdo1_hist.cod_empresa ,"+           
                            "dba.tmpplanillasdo1_hist.anho ,"+           
                            "dba.tmpplanillasdo1_hist.codempleado ,"+           
                            "dba.tmpplanillasdo1_hist.cod_sucursal ,"+           
                            "dba.tmpplanillasdo1_hist.coddpto ,"+           
                            "cast(dba.tmpplanillasdo1_hist.codcargo as integer) as codcargo ,"+           
                            "dba.tmpplanillasdo1_hist.codconcepto ,"+           
                            "date(dba.tmpplanillasdo1_hist.fechamvto) as fechamvto,"+    
                            "date(dba.tmpplanillasdo1_hist.fechaliquid) as fechaliquid,"+           
                            "date(dba.tmpplanillasdo1_hist.fechainiconc) as  fechainiconc,"+           
                            "dba.tmpplanillasdo1_hist.nroprestamo ,"+           
                            "dba.tmpplanillasdo1_hist.nrocuota ,"+           
                            "cast(dba.tmpplanillasdo1_hist.cantdiashoras as decimal (20,0)) as cantdiashoras,"+           
                            "dba.tmpplanillasdo1_hist.deducible ,"+           
                            "dba.tmpplanillasdo1_hist.af_aguinaldo ,"+           
                            "cast(dba.tmpplanillasdo1_hist.importedebito as decimal (20,0)) as importedebito,"+           
                            "cast(dba.tmpplanillasdo1_hist.importecredito as decimal (20,0)) as importecredito,"+           
                            "cast(dba.tmpplanillasdo1_hist.importeaporteips as decimal (20,0)) as importeaporteips,"+        
                            "cast(dba.tmpplanillasdo1_hist.tipomov as integer) as tipomov ,"+
                            "dba.empresa.des_empresa ,"+           
                            "dba.empleados.codempleado ,"+           
                            "ltrim(rtrim(dba.empleados.apellidos)) as apellidos,"+         
                            "ltrim(rtrim(dba.empleados.nombres)) as nombres,"+           
                            "dba.concepsueldo.descrip as con_descrip,"+       
                            "dba.dpto.descrip as des_dpto,"+           
                            "dba.sucursal.des_sucursal ,"+           
                            "dba.tmpplanillasdo1_hist.importeletra "+   
                         "FROM " +
                            "dba.tmpplanillasdo1_hist ,"+           
                            "dba.empresa ,"+           
                            "dba.empleados ,"+           
                            "dba.concepsueldo ,"+           
                            "dba.sucursal ,"+           
                            "dba.dpto "+     
                         "WHERE "+ 
                            "( dba.tmpplanillasdo1_hist.cod_empresa = dba.empresa.cod_empresa ) "+ 
                            "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.concepsueldo.cod_empresa ) "+ 
                            "and ( dba.tmpplanillasdo1_hist.codconcepto = dba.concepsueldo.codconcepto ) "+
                            "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.empleados.cod_empresa ) "+
                            "and ( dba.tmpplanillasdo1_hist.codempleado = dba.empleados.codempleado ) "+
                            "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.sucursal.cod_empresa ) "+
                            "and ( dba.tmpplanillasdo1_hist.cod_sucursal = dba.sucursal.cod_sucursal ) "+
                            "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.dpto.cod_empresa ) "+
                            "and ( dba.tmpplanillasdo1_hist.cod_sucursal = dba.dpto.cod_sucursal ) "+
                            "and ( dba.tmpplanillasdo1_hist.coddpto = dba.dpto.coddpto ) "+
                            "and ( ( dba.tmpplanillasdo1_hist.cod_empresa = '"+empresa+"' ) ) ";
    
        if (empleados) {
            string_sql += " AND (dba.tmpplanillasdo1_hist.codempleado IN " + q.in(empleados) + ") ";
        }
        
        if (sucursal) {
            string_sql += " AND (dba.tmpplanillasdo1_hist.cod_sucursal IN " + q.in(sucursal) + ") ";
        }
        
        if (departamento) {
            string_sql += " AND (dba.tmpplanillasdo1_hist.CodDpto IN " + q.in(departamento) + ") ";
        }
        
        string_sql += " ORDER BY dba.empleados.apellidos";
        
        console.log(string_sql);
        
        conn.exec(string_sql, function (err, r) {
            if (err) throw err;
                var string_sql1 = "SELECT "+
                                    "NUMBER() as id, "+
                                    "dba.tmpplanillasdo1_hist.cod_empresa ,"+           
                                    "dba.tmpplanillasdo1_hist.anho ,"+           
                                    "dba.tmpplanillasdo1_hist.codempleado ,"+           
                                    "dba.tmpplanillasdo1_hist.cod_sucursal ,"+           
                                    "dba.tmpplanillasdo1_hist.coddpto ,"+           
                                    "cast(dba.tmpplanillasdo1_hist.codcargo as integer) as codcargo ,"+           
                                    "dba.tmpplanillasdo1_hist.codconcepto ,"+           
                                    "date(dba.tmpplanillasdo1_hist.fechamvto) as fechamvto,"+    
                                    "date(dba.tmpplanillasdo1_hist.fechaliquid) as fechaliquid,"+           
                                    "date(dba.tmpplanillasdo1_hist.fechainiconc) as  fechainiconc,"+           
                                    "dba.tmpplanillasdo1_hist.nroprestamo ,"+           
                                    "dba.tmpplanillasdo1_hist.nrocuota ,"+           
                                    "cast(dba.tmpplanillasdo1_hist.cantdiashoras as decimal (20,0)) as cantdiashoras,"+           
                                    "dba.tmpplanillasdo1_hist.deducible ,"+           
                                    "dba.tmpplanillasdo1_hist.af_aguinaldo ,"+           
                                    "cast(dba.tmpplanillasdo1_hist.importedebito as decimal (20,0)) as importedebito,"+           
                                    "cast(dba.tmpplanillasdo1_hist.importecredito as decimal (20,0)) as importecredito,"+           
                                    "cast(dba.tmpplanillasdo1_hist.importeaporteips as decimal (20,0)) as importeaporteips,"+        
                                    "cast(dba.tmpplanillasdo1_hist.tipomov as integer) as tipomov ,"+        
                                    "dba.empresa.des_empresa ,"+           
                                    "dba.empleados.codempleado ,"+           
                                    "ltrim(rtrim(dba.empleados.apellidos)) as apellidos,"+         
                                    "ltrim(rtrim(dba.empleados.nombres)) as nombres,"+           
                                    "dba.concepsueldo.descrip as con_descrip,"+       
                                    "dba.dpto.descrip as des_dpto,"+           
                                    "dba.sucursal.des_sucursal ,"+           
                                    "dba.tmpplanillasdo1_hist.importeletra "+   
                                 "FROM " +
                                    "dba.tmpplanillasdo1_hist ,"+           
                                    "dba.empresa ,"+           
                                    "dba.empleados ,"+           
                                    "dba.concepsueldo ,"+           
                                    "dba.sucursal ,"+           
                                    "dba.dpto "+     
                                 "WHERE "+ 
                                    "( dba.tmpplanillasdo1_hist.cod_empresa = dba.empresa.cod_empresa ) "+ 
                                    "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.concepsueldo.cod_empresa ) "+ 
                                    "and ( dba.tmpplanillasdo1_hist.codconcepto = dba.concepsueldo.codconcepto ) "+
                                    "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.empleados.cod_empresa ) "+
                                    "and ( dba.tmpplanillasdo1_hist.codempleado = dba.empleados.codempleado ) "+
                                    "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.sucursal.cod_empresa ) "+
                                    "and ( dba.tmpplanillasdo1_hist.cod_sucursal = dba.sucursal.cod_sucursal ) "+
                                    "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.dpto.cod_empresa ) "+
                                    "and ( dba.tmpplanillasdo1_hist.cod_sucursal = dba.dpto.cod_sucursal ) "+
                                    "and ( dba.tmpplanillasdo1_hist.coddpto = dba.dpto.coddpto ) "+
                                    "and ( ( dba.tmpplanillasdo1_hist.cod_empresa = '"+empresa+"' ) ) ";
    
            if (empleados) {
                string_sql1 += " AND (dba.tmpplanillasdo1_hist.codempleado IN " + q.in(empleados) + ") ";
            }
            
            if (sucursal) {
                string_sql1 += " AND (dba.tmpplanillasdo1_hist.cod_sucursal IN " + q.in(sucursal) + ") ";
            }
            
            if (departamento) {
                string_sql1 += " AND (dba.tmpplanillasdo1_hist.CodDpto IN " + q.in(departamento) + ") ";
            }
        
            string_sql1 += " ORDER BY dba.tmpplanillasdo1_hist.cod_sucursal";
            
            console.log(string_sql1);
                
            conn.exec(string_sql1, function (err, r1) {
                if (err) throw err;
                    var string_sql2 = "SELECT "+
                                        "NUMBER() as id, "+
                                        "dba.tmpplanillasdo1_hist.cod_empresa ,"+           
                                        "dba.tmpplanillasdo1_hist.anho ,"+           
                                        "dba.tmpplanillasdo1_hist.codempleado ,"+           
                                        "dba.tmpplanillasdo1_hist.cod_sucursal ,"+           
                                        "dba.tmpplanillasdo1_hist.coddpto ,"+           
                                        "cast(dba.tmpplanillasdo1_hist.codcargo as integer) as codcargo ,"+           
                                        "dba.tmpplanillasdo1_hist.codconcepto ,"+           
                                        "date(dba.tmpplanillasdo1_hist.fechamvto) as fechamvto,"+    
                                        "date(dba.tmpplanillasdo1_hist.fechaliquid) as fechaliquid,"+           
                                        "date(dba.tmpplanillasdo1_hist.fechainiconc) as  fechainiconc,"+           
                                        "dba.tmpplanillasdo1_hist.nroprestamo ,"+           
                                        "dba.tmpplanillasdo1_hist.nrocuota ,"+           
                                        "cast(dba.tmpplanillasdo1_hist.cantdiashoras as decimal (20,0)) as cantdiashoras,"+           
                                        "dba.tmpplanillasdo1_hist.deducible ,"+           
                                        "dba.tmpplanillasdo1_hist.af_aguinaldo ,"+           
                                        "cast(dba.tmpplanillasdo1_hist.importedebito as decimal (20,0)) as importedebito,"+           
                                        "cast(dba.tmpplanillasdo1_hist.importecredito as decimal (20,0)) as importecredito,"+           
                                        "cast(dba.tmpplanillasdo1_hist.importeaporteips as decimal (20,0)) as importeaporteips,"+        
                                        "cast(dba.tmpplanillasdo1_hist.tipomov as integer) as tipomov ,"+        
                                        "dba.empresa.des_empresa ,"+           
                                        "dba.empleados.codempleado ,"+           
                                        "ltrim(rtrim(dba.empleados.apellidos)) as apellidos,"+         
                                        "ltrim(rtrim(dba.empleados.nombres)) as nombres,"+           
                                        "dba.concepsueldo.descrip as con_descrip,"+       
                                        "dba.dpto.descrip as des_dpto,"+           
                                        "dba.sucursal.des_sucursal ,"+           
                                        "dba.tmpplanillasdo1_hist.importeletra "+   
                                     "FROM " +
                                        "dba.tmpplanillasdo1_hist ,"+           
                                        "dba.empresa ,"+           
                                        "dba.empleados ,"+           
                                        "dba.concepsueldo ,"+           
                                        "dba.sucursal ,"+           
                                        "dba.dpto "+     
                                     "WHERE "+ 
                                        "( dba.tmpplanillasdo1_hist.cod_empresa = dba.empresa.cod_empresa ) "+ 
                                        "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.concepsueldo.cod_empresa ) "+ 
                                        "and ( dba.tmpplanillasdo1_hist.codconcepto = dba.concepsueldo.codconcepto ) "+
                                        "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.empleados.cod_empresa ) "+
                                        "and ( dba.tmpplanillasdo1_hist.codempleado = dba.empleados.codempleado ) "+
                                        "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.sucursal.cod_empresa ) "+
                                        "and ( dba.tmpplanillasdo1_hist.cod_sucursal = dba.sucursal.cod_sucursal ) "+
                                        "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.dpto.cod_empresa ) "+
                                        "and ( dba.tmpplanillasdo1_hist.cod_sucursal = dba.dpto.cod_sucursal ) "+
                                        "and ( dba.tmpplanillasdo1_hist.coddpto = dba.dpto.coddpto ) "+
                                        "and ( ( dba.tmpplanillasdo1_hist.cod_empresa = '"+empresa+"' ) ) ";
    
                if (empleados) {
                    string_sql2 += " AND (dba.tmpplanillasdo1_hist.codempleado IN " + q.in(empleados) + ") ";
                }
                
                if (sucursal) {
                    string_sql2 += " AND (dba.tmpplanillasdo1_hist.cod_sucursal IN " + q.in(sucursal) + ") ";
                }
                
                if (departamento) {
                    string_sql2 += " AND (dba.tmpplanillasdo1_hist.CodDpto IN " + q.in(departamento) + ") ";
                }
            
                string_sql2 += " ORDER BY dba.dpto.descrip";
            
                console.log(string_sql2);
                
                conn.exec(string_sql2, function (err, r2) {
                    if (err) throw err;
                        var string_sql3 = "SELECT "+
                                            "NUMBER() as id, "+
                                            "dba.tmpplanillasdo1_hist.cod_empresa ,"+           
                                            "dba.tmpplanillasdo1_hist.anho ,"+           
                                            "dba.tmpplanillasdo1_hist.codempleado ,"+           
                                            "dba.tmpplanillasdo1_hist.cod_sucursal ,"+           
                                            "dba.tmpplanillasdo1_hist.coddpto ,"+           
                                            "cast(dba.tmpplanillasdo1_hist.codcargo as integer) as codcargo ,"+           
                                            "dba.tmpplanillasdo1_hist.codconcepto ,"+           
                                            "date(dba.tmpplanillasdo1_hist.fechamvto) as fechamvto,"+    
                                            "date(dba.tmpplanillasdo1_hist.fechaliquid) as fechaliquid,"+           
                                            "date(dba.tmpplanillasdo1_hist.fechainiconc) as  fechainiconc,"+           
                                            "dba.tmpplanillasdo1_hist.nroprestamo ,"+           
                                            "dba.tmpplanillasdo1_hist.nrocuota ,"+           
                                            "cast(dba.tmpplanillasdo1_hist.cantdiashoras as decimal (20,0)) as cantdiashoras,"+           
                                            "dba.tmpplanillasdo1_hist.deducible ,"+           
                                            "dba.tmpplanillasdo1_hist.af_aguinaldo ,"+           
                                            "cast(dba.tmpplanillasdo1_hist.importedebito as decimal (20,0)) as importedebito,"+           
                                            "cast(dba.tmpplanillasdo1_hist.importecredito as decimal (20,0)) as importecredito,"+           
                                            "cast(dba.tmpplanillasdo1_hist.importeaporteips as decimal (20,0)) as importeaporteips,"+        
                                            "cast(dba.tmpplanillasdo1_hist.tipomov as integer) as tipomov ,"+        
                                            "dba.empresa.des_empresa ,"+           
                                            "dba.empleados.codempleado ,"+           
                                            "ltrim(rtrim(dba.empleados.apellidos)) as apellidos,"+         
                                            "ltrim(rtrim(dba.empleados.nombres)) as nombres,"+           
                                            "dba.concepsueldo.descrip as con_descrip,"+       
                                            "dba.dpto.descrip as des_dpto,"+           
                                            "dba.sucursal.des_sucursal ,"+           
                                            "dba.tmpplanillasdo1_hist.importeletra "+   
                                         "FROM " +
                                            "dba.tmpplanillasdo1_hist ,"+           
                                            "dba.empresa ,"+           
                                            "dba.empleados ,"+           
                                            "dba.concepsueldo ,"+           
                                            "dba.sucursal ,"+           
                                            "dba.dpto "+     
                                         "WHERE "+ 
                                            "( dba.tmpplanillasdo1_hist.cod_empresa = dba.empresa.cod_empresa ) "+ 
                                            "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.concepsueldo.cod_empresa ) "+ 
                                            "and ( dba.tmpplanillasdo1_hist.codconcepto = dba.concepsueldo.codconcepto ) "+
                                            "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.empleados.cod_empresa ) "+
                                            "and ( dba.tmpplanillasdo1_hist.codempleado = dba.empleados.codempleado ) "+
                                            "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.sucursal.cod_empresa ) "+
                                            "and ( dba.tmpplanillasdo1_hist.cod_sucursal = dba.sucursal.cod_sucursal ) "+
                                            "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.dpto.cod_empresa ) "+
                                            "and ( dba.tmpplanillasdo1_hist.cod_sucursal = dba.dpto.cod_sucursal ) "+
                                            "and ( dba.tmpplanillasdo1_hist.coddpto = dba.dpto.coddpto ) "+
                                            "and ( ( dba.tmpplanillasdo1_hist.cod_empresa = '"+empresa+"' ) ) ";
    
                        if (empleados) {
                            string_sql3 += " AND (dba.tmpplanillasdo1_hist.codempleado IN " + q.in(empleados) + ") ";
                        }
                        
                        if (sucursal) {
                            string_sql3 += " AND (dba.tmpplanillasdo1_hist.cod_sucursal IN " + q.in(sucursal) + ") ";
                        }
                        
                        if (departamento) {
                            string_sql3 += " AND (dba.tmpplanillasdo1_hist.CodDpto IN " + q.in(departamento) + ") ";
                        }
                    
                        string_sql3 += " ORDER BY dba.tmpplanillasdo1_hist.tipomov ";
                    
                        console.log(string_sql3);
                        
                        conn.exec(string_sql3, function (err, r3) {
                            if (err) throw err;
                                var string_sql4 = "SELECT "+
                                                    "NUMBER() as id, "+
                                                    "dba.tmpplanillasdo1_hist.cod_empresa ,"+           
                                                    "dba.tmpplanillasdo1_hist.anho ,"+           
                                                    "dba.tmpplanillasdo1_hist.codempleado ,"+           
                                                    "dba.tmpplanillasdo1_hist.cod_sucursal ,"+           
                                                    "dba.tmpplanillasdo1_hist.coddpto ,"+           
                                                    "cast(dba.tmpplanillasdo1_hist.codcargo as integer) as codcargo ,"+           
                                                    "dba.tmpplanillasdo1_hist.codconcepto ,"+           
                                                    "date(dba.tmpplanillasdo1_hist.fechamvto) as fechamvto,"+    
                                                    "date(dba.tmpplanillasdo1_hist.fechaliquid) as fechaliquid,"+           
                                                    "date(dba.tmpplanillasdo1_hist.fechainiconc) as  fechainiconc,"+           
                                                    "dba.tmpplanillasdo1_hist.nroprestamo ,"+           
                                                    "dba.tmpplanillasdo1_hist.nrocuota ,"+           
                                                    "cast(dba.tmpplanillasdo1_hist.cantdiashoras as decimal (20,0)) as cantdiashoras,"+           
                                                    "dba.tmpplanillasdo1_hist.deducible ,"+           
                                                    "dba.tmpplanillasdo1_hist.af_aguinaldo ,"+           
                                                    "cast(dba.tmpplanillasdo1_hist.importedebito as decimal (20,0)) as importedebito,"+           
                                                    "cast(dba.tmpplanillasdo1_hist.importecredito as decimal (20,0)) as importecredito,"+           
                                                    "cast(dba.tmpplanillasdo1_hist.importeaporteips as decimal (20,0)) as importeaporteips,"+        
                                                    "cast(dba.tmpplanillasdo1_hist.tipomov as integer) as tipomov ,"+        
                                                    "dba.empresa.des_empresa ,"+           
                                                    "dba.empleados.codempleado ,"+           
                                                    "ltrim(rtrim(dba.empleados.apellidos)) as apellidos,"+         
                                                    "ltrim(rtrim(dba.empleados.nombres)) as nombres,"+           
                                                    "dba.concepsueldo.descrip as con_descrip,"+       
                                                    "dba.dpto.descrip as des_dpto,"+           
                                                    "dba.sucursal.des_sucursal ,"+           
                                                    "dba.tmpplanillasdo1_hist.importeletra "+   
                                                 "FROM " +
                                                    "dba.tmpplanillasdo1_hist ,"+           
                                                    "dba.empresa ,"+           
                                                    "dba.empleados ,"+           
                                                    "dba.concepsueldo ,"+           
                                                    "dba.sucursal ,"+           
                                                    "dba.dpto "+     
                                                 "WHERE "+ 
                                                    "( dba.tmpplanillasdo1_hist.cod_empresa = dba.empresa.cod_empresa ) "+ 
                                                    "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.concepsueldo.cod_empresa ) "+ 
                                                    "and ( dba.tmpplanillasdo1_hist.codconcepto = dba.concepsueldo.codconcepto ) "+
                                                    "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.empleados.cod_empresa ) "+
                                                    "and ( dba.tmpplanillasdo1_hist.codempleado = dba.empleados.codempleado ) "+
                                                    "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.sucursal.cod_empresa ) "+
                                                    "and ( dba.tmpplanillasdo1_hist.cod_sucursal = dba.sucursal.cod_sucursal ) "+
                                                    "and ( dba.tmpplanillasdo1_hist.cod_empresa = dba.dpto.cod_empresa ) "+
                                                    "and ( dba.tmpplanillasdo1_hist.cod_sucursal = dba.dpto.cod_sucursal ) "+
                                                    "and ( dba.tmpplanillasdo1_hist.coddpto = dba.dpto.coddpto ) "+
                                                    "and ( ( dba.tmpplanillasdo1_hist.cod_empresa = '"+empresa+"' ) ) ";
            
                                if (empleados) {
                                    string_sql4 += " AND (dba.tmpplanillasdo1_hist.codempleado IN " + q.in(empleados) + ") ";
                                }
                                
                                if (sucursal) {
                                    string_sql4 += " AND (dba.tmpplanillasdo1_hist.cod_sucursal IN " + q.in(sucursal) + ") ";
                                }
                                
                                if (departamento) {
                                    string_sql4 += " AND (dba.tmpplanillasdo1_hist.CodDpto IN " + q.in(departamento) + ") ";
                                }
                            
                                //string_sql4 += " ORDER BY dba.tmpplanillasdo1_hist.tipomov ";
                            
                                console.log(string_sql4);
                                
                                conn.exec(string_sql4, function (err, r4) {
                                    if (err) throw err;
                                    responseCallback([r, r1, r2, r3, r4]);
                            })
                    }) 
                })        
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