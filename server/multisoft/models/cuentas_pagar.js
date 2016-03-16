var conn = require('../db');
var util = require('util');
var q = require('./queryUtils');
var Cuentas_pagar = {};

var qProcedure = [];

Cuentas_pagar.all = function (filters, cb) {

    var sql_proveedores = "SELECT CodProv FROM DBA.Proveed WHERE Cod_Empresa = '" + filters.empresa + "'"

    if (filters.proveedor) {
        sql_proveedores += " AND (dba.FACTCAB.CodProv IN " + q.in(filters.proveedor) + ") ";
    }

    var currentdate = new Date();
    var mSID =
        (currentdate.getDate()).toString() +
        (currentdate.getMonth() + 1).toString() +
        (currentdate.getFullYear()).toString() +
        (currentdate.getHours()).toString() +
        (currentdate.getMinutes()).toString() +
        (currentdate.getSeconds()).toString();

    console.log(mSID);

    var string_procedure;

    conn.exec(sql_proveedores, function (err, r) {
        if (err) throw err;
        for (var a = 0; a < r.length; a++) {
            console.log(r[a].CodProv);
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
    exec(qProcedure.shift(), executeQueue);
}

function exec(storedProcedure, cb) {
    if (storedProcedure) {
        conn.exec(storedProcedure, function (err, r) {
            if (err) throw err;
            console.log(r);
            cb();
        });
    }
}

module.exports = Cuentas_pagar;