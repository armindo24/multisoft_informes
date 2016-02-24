var conn = require('../db');

var Rubro = {};

Rubro.list = function (params, cb) {
    var sql = "SELECT dba.rubrosaf.cod_empresa, dba.rubrosaf.codrubro, dba.rubrosaf.descrip, dba.rubrosaf.porcdeprec, dba.rubrosaf.vidautil, dba.rubrosaf.depreciable," +
        " dba.rubrosaf.planctaactivo, dba.rubrosaf.planauxactivo, dba.rubrosaf.ctadeprejer, dba.rubrosaf.auxdeprejer, dba.rubrosaf.ctadepracum, dba.rubrosaf.auxdepracum" +
        " FROM dba.rubrosaf WHERE dba.rubrosAF.Cod_Empresa = ?";

    var sql_params = [params.empresa];

    conn.exec(sql, sql_params, function (err, res) {
        if (err) throw err;
        cb(res);
    });
};

Rubro.subsubro = function (params, cb) {
    var sql = "select sr.descrip, sr.codsubrubro from dba.SUBRUBROSAF sr" +
        " join dba.RUBROS r on sr.CodRubro = r.CodRubro" +
        " where sr.Cod_Empresa = ? and r.CodRubro = ?";

    var sql_params = [params.empresa, params.rubro];
    conn.exec(sql, sql_params, function (err, res) {
        if (err) throw err;
        cb(res);
    });
};

module.exports = Rubro;