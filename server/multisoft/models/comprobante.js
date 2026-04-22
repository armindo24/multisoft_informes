var conn = require('../db_integrado');

var Comprobante = {};

Comprobante.empresa = function (params, cb) {
    conn.exec("select Cod_Tp_Comp,upper(des_tp_comp) as des_tp_comp from DBA.TPOCBTE where activo = 'S' and Cod_Empresa = ?", [params.empresa], function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

Comprobante.ventasMigracion = function (params, cb) {
    var sql = "select Cod_Tp_Comp, upper(des_tp_comp) as des_tp_comp, activo, cod_tipodoc, tpomvto " +
        "from DBA.TPOCBTE " +
        "where activo = 'S' " +
        "and Cod_Empresa = '" + params.empresa + "' " +
        "and cod_tipodoc = 'FR' " +
        "and tp_def in ('CR','CT') " +
        "order by Cod_Tp_Comp";
    conn.exec(sql, function (err, row) {
        if (row && row.length) return cb(row);

        var fallbackSql = "select Cod_Tp_Comp, upper(des_tp_comp) as des_tp_comp, activo, cod_tipodoc, tpomvto " +
            "from DBA.TPOCBTE " +
            "where activo = 'S' " +
            "and Cod_Empresa = '" + params.empresa + "' " +
            "and tp_def in ('CR','CT') " +
            "order by Cod_Tp_Comp";
        conn.exec(fallbackSql, function (fallbackErr, fallbackRow) {
            if (fallbackRow && fallbackRow.length) return cb(fallbackRow);
            Comprobante.empresa(params, function (defaultRow) {
                cb(defaultRow || []);
            });
        });
    });
};

Comprobante.cobrar = function (params, filter, cb) {
    var sql = "SELECT cbte.cod_tp_comp, cbte.des_tp_comp, cbte.tp_def, def.Descrip   " +
        "FROM DBA.TPOCBTE cbte " +
        "JOIN DBA.Tp_Def def on def.tp_def = cbte.tp_def  " +
        "WHERE cbte.cod_empresa = ?   " +
        "AND  cbte.tp_def IN ( 'CT', 'CR', 'NC','N0','N1','N " +
        "2','N3','N4','N5','N6','N7','N8','N9','F0','F1','F2','F3','F4','F5','F6','F7', " +
        "'F8','F9' ) " +
        "AND cbte.activo ='S'  " +
        "ORDER BY cbte.tp_def ASC, cbte.cod_tp_comp ASC ";

    var sql_params = [params.empresa];
    conn.exec(sql, sql_params, function (err, result) {
        if (err) throw err;
        cb(result);
    });
};

Comprobante.compras = function (params, cb) {
    conn.exec("SELECT dba.tpocbte.cod_tp_comp,dba.TPOCBTE.des_tp_comp FROM dba.tpocbte WHERE ( DBA.tpocbte.tp_def IN ( 'CC' , 'CD' , 'NP' ) ) AND ( dba.tpocbte.cod_empresa = '" + params.empresa + "' ) ORDER BY dba.tpocbte.cod_tp_comp", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

Comprobante.presupuesto = function (params, query, cb) {
    var sql = "SELECT Cod_Tp_Comp,  des_tp_comp, tp_def " +
        "FROM DBA.TPOCBTE  WHERE DBA.TPOCBTE.cod_empresa = ?  " +
        "AND  tp_def = 'PT' AND activo ='S' " +
        "ORDER BY DBA.TPOCBTE.tp_def ASC,  DBA.TPOCBTE.cod_tp_comp ASC";
    var sql_params = [params.empresa];

    conn.exec(sql, sql_params, function (err, result) {
        if (err) throw err;
        cb(result);
    });
};

Comprobante.op = function (params, cb) {
    conn.exec("select Cod_Tp_Comp,des_tp_comp from dba.tpocbte where tp_def = 'OP' AND ( dba.tpocbte.cod_empresa = '" + params.empresa + "' ) ORDER BY dba.tpocbte.cod_tp_comp", function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

module.exports = Comprobante;
