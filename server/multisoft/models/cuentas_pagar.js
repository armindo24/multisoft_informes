var conn = require('../db');
var util = require('util');
var Promise = require('bluebird');
var moment = require('moment');
var q = require('./queryUtils');
var Cuentas_pagar = {};

var mSID = null;
var responseCallback;
var responseData;

Cuentas_pagar.all = function (filters, cb) {

    var sql_proveedores = "SELECT CodProv FROM DBA.Proveed WHERE Cod_Empresa = '" + filters.empresa + "'"
    var string_sql = "SELECT DBA.Proveed.Cod_Empresa,DBA.Proveed.CodProv,DBA.TmpExtProv.CodMoneda,DBA.Proveed.RazonSocial," +
        "DBA.TmpExtProv.SaldoAnterior,SUM(DBA.TmpExtProv.Credito) as TotalCredito,SUM(DBA.TmpExtProv.Debito ) as TotalDebito," +
        "DBA.Moneda.Descrip FROM DBA.Proveed,DBA.TmpExtProv,DBA.Moneda WHERE DBA.Proveed.Cod_Empresa = DBA.TmpExtProv.Cod_Empresa " +
        "AND DBA.Proveed.CodProv = DBA.TmpExtProv.CodProv AND DBA.TmpExtProv.CodMoneda = DBA.Moneda.CodMoneda AND DBA.TmpExtProv.ID = '" + mSID + "' " +
        "GROUP BY DBA.Proveed.Cod_Empresa,DBA.Proveed.CodProv,DBA.TmpExtProv.CodMoneda,DBA.Proveed.RazonSocial," +
        "DBA.TmpExtProv.SaldoAnterior,DBA.Moneda.Descrip";

    if (filters.proveedor) {
        sql_proveedores += " AND (dba.FACTCAB.CodProv IN " + q.in(filters.proveedor) + ") ";
    }

    mSID = moment().format('DDMMYYYYHHmmss');
    var string_delete = "DELETE FROM DBA.TmpExtProv WHERE ID ='" + mSID + "'";
    console.log(mSID);

    var string_procedure;
    responseCallback = cb;
    var qProcedure = [];

    conn.execAsync(sql_proveedores)
    .then(function (r) {
        for (var a = 0; a < r.length; a++) {
            string_procedure =
                "execute dba.gen_proveed_saldo mSID ='" + mSID + "' , " +
                "mCodEmpresa ='" + filters.empresa + "' , mPeriodo ='" + filters.periodo + "' , " +
                "mCodProv ='" + r[a].CodProv + "' , mFechaDesde ='" + filters.compras_start + "' , " +
                "mFechaHasta ='" + filters.compras_end + "' , mTipoSaldo ='T'";
            qProcedure.push(string_procedure);
        }
        return qProcedure;
    })
    .then(function (queue) {
        return Promise.mapSeries(queue, function (sp) {
            return conn.execAsync(sp);
        });
    })
    .then(function (queueResults) {
        console.log('cero');
        return conn.execAsync(string_sql);
    })
    .then(function (finalResults) {
        conn.exec(string_delete).then(function () {
            return finalResults;
        });
    });
};

module.exports = Cuentas_pagar;