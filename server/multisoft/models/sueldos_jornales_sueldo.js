var conn = require('../db_sueldo');

var Sueldos_Jornales = {};

var qProcedure = [];
var responseCallback;
var empresa = null;

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
        console.log("entre aca porque ya no hay mas");
        var string_sql = "SELECT dba.tmpplanillasdo2_hist.cod_empresa, dba.tmpplanillasdo2_hist.anho, "+
                         "dba.tmpplanillasdo2_hist.codempleado, dba.tmpplanillasdo2_hist.cod_sucursal, "+
                         "dba.tmpplanillasdo2_hist.coddpto, dba.tmpplanillasdo2_hist.codcargo, "+
                         "dba.tmpplanillasdo2_hist.fechaliquid, dba.tmpplanillasdo2_hist.aportaips, "+
                         "dba.tmpplanillasdo2_hist.diashorastrab, dba.tmpplanillasdo2_hist.ingbasico, "+
                         "dba.tmpplanillasdo2_hist.ingbasicomes, dba.tmpplanillasdo2_hist.ingbasicoadicional, "+
                         "dba.tmpplanillasdo2_hist.ingbonificacion, dba.tmpplanillasdo2_hist.ingboniffam, "+
                         "dba.tmpplanillasdo2_hist.inghe30, dba.tmpplanillasdo2_hist.inghe50, "+
                         "dba.tmpplanillasdo2_hist.inghe100, dba.tmpplanillasdo2_hist.ingvarios, "+
                         "dba.tmpplanillasdo2_hist.descaporteips, dba.tmpplanillasdo2_hist.descvarios1, "+
                         "dba.tmpplanillasdo2_hist.descvarios2, dba.tmpplanillasdo2_hist.descanticipos, "+
                         "dba.tmpplanillasdo2_hist.importeletra, dba.empresa.des_empresa, dba.empleados.apellidos, "+
                         "dba.empleados.nombres, dba.sucursal.des_sucursal, dba.dpto.descrip FROM "+
                         "dba.tmpplanillasdo2_hist, dba.empresa, dba.empleados, dba.sucursal, dba.dpto WHERE "+
                         "( dba.tmpplanillasdo2_hist.cod_empresa = dba.empresa.cod_empresa ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_empresa = dba.empleados.cod_empresa ) and "+
                         "( dba.tmpplanillasdo2_hist.codempleado = dba.empleados.codempleado ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_empresa = dba.sucursal.cod_empresa ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_sucursal = dba.sucursal.cod_sucursal ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_empresa = dba.dpto.cod_empresa ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_sucursal = dba.dpto.cod_sucursal ) and "+
                         "( dba.tmpplanillasdo2_hist.coddpto = dba.dpto.coddpto ) and "+
                         "( dba.tmpplanillasdo2_hist.cod_empresa = '"+empresa+"' ) ORDER BY dba.sucursal.des_sucursal";
        console.log(string_sql);
        conn.exec(string_sql, function (err, r) {
            if (err) throw err;
            responseCallback(r);
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