var conn = require('../db_integrado');

var Control = {};

function safeCbError(cb, err, label) {
    console.error('[' + label + '] Error ejecutando consulta:', err && (err.message || err));
    cb([]);
}

Control.cierre = function (params, cb) {
    var sql = "SELECT Cod_Empresa, Periodo, Fecha1erCierre, FechaCierre, Mes1erCierre, MesCierre " +
        "FROM DBA.CONTROL " +
        "WHERE Cod_Empresa = '" + String(params.empresa || '').replace(/'/g, "''") + "' " +
        "AND Periodo = '" + String(params.periodo || '').replace(/'/g, "''") + "'";
    conn.exec(sql, function (err, row) {
        if (err) return safeCbError(cb, err, 'Control.cierre');
        cb(row || []);
    });
};

module.exports = Control;
