var conn = require('../db_sueldo');
var util = require('util');
var moment = require('moment');
var q = require('./queryUtils');

var Departamento_Sueldo = {};

Departamento_Sueldo.all = function (params,cb) {
    var string_sql = "select CodDpto,Descrip from dba.DPTO "+
                     "where Cod_Empresa = '"+params.empresa+"' ";
    if (params.sucursal) {
        string_sql += " AND (cod_sucursal IN " + q.in(params.sucursal) + ") ";
    }
    conn.exec(string_sql, function(err, row){
        if (err) throw err;
        cb(row);
    });
};

module.exports = Departamento_Sueldo;