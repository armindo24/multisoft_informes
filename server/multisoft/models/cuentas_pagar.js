var conn = require('../db');
var util = require('util');
var q = require('./queryUtils');
var Cuentas_pagar = {};

var qProcedure = [];

var mSID = null
var responseCallback;
var responseData;

Cuentas_pagar.all = function (filters, cb) {

    var sql_proveedores = "SELECT CodProv FROM DBA.Proveed WHERE Cod_Empresa = '" + filters.empresa + "'"

    if (filters.proveedor) {
        sql_proveedores += " AND (dba.FACTCAB.CodProv IN " + q.in(filters.proveedor) + ") ";
    }

    var currentdate = new Date();
    mSID =
        (currentdate.getDate()).toString() +
        (currentdate.getMonth() + 1).toString() +
        (currentdate.getFullYear()).toString() +
        (currentdate.getHours()).toString() +
        (currentdate.getMinutes()).toString() +
        (currentdate.getSeconds()).toString();

    console.log(mSID);

    var string_procedure;
    responseCallback = cb;

    conn.exec(sql_proveedores, function (err, r) {

        if (err) throw err;
        for (var a = 0; a < r.length; a++) {
            string_procedure =
                "execute dba.gen_proveed_saldo mSID ='" + mSID + "' , " +
                "mCodEmpresa ='" + filters.empresa + "' , mPeriodo ='" + filters.periodo + "' , " +
                "mCodProv ='" + r[a].CodProv + "' , mFechaDesde ='" + filters.compras_start + "' , " +
                "mFechaHasta ='" + filters.compras_end + "' , mTipoSaldo ='T'";
            qProcedure.push(string_procedure);
        }
        executeQueue();
    })
};

function executeQueue() {
    if (qProcedure.length == 0) {
        console.log('cero');
        var string_sql = "SELECT DBA.Proveed.Cod_Empresa,DBA.Proveed.CodProv,DBA.TmpExtProv.CodMoneda,DBA.Proveed.RazonSocial," +
            "DBA.TmpExtProv.SaldoAnterior,SUM(DBA.TmpExtProv.Credito) as TotalCredito,SUM(DBA.TmpExtProv.Debito ) as TotalDebito," +
            "DBA.Moneda.Descrip FROM DBA.Proveed,DBA.TmpExtProv,DBA.Moneda WHERE DBA.Proveed.Cod_Empresa = DBA.TmpExtProv.Cod_Empresa " +
            "AND DBA.Proveed.CodProv = DBA.TmpExtProv.CodProv AND DBA.TmpExtProv.CodMoneda = DBA.Moneda.CodMoneda AND DBA.TmpExtProv.ID = '" + mSID + "' " +
            "GROUP BY DBA.Proveed.Cod_Empresa,DBA.Proveed.CodProv,DBA.TmpExtProv.CodMoneda,DBA.Proveed.RazonSocial," +
            "DBA.TmpExtProv.SaldoAnterior,DBA.Moneda.Descrip";

        conn.exec(string_sql, function (err, r) {
            if (err) throw err;
            responseData = r;
            var string_delete = "DELETE FROM DBA.TmpExtProv WHERE ID ='" + mSID + "'";
            conn.exec(string_delete, function (err, r) {
                if (err) throw err;
                responseCallback(responseData);
            });
        })
    } else {
        exec(qProcedure.shift(), executeQueue);
    }
}

function exec(storedProcedure, cb) {
    if (storedProcedure) {
        conn.exec(storedProcedure, function (err, r) {
            if (err) throw err;
            cb();
        });
    }
}

module.exports = Cuentas_pagar;