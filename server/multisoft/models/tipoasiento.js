var conn = require('../db');

var TipoAsiento = {};

TipoAsiento.all = function (cb) {
     conn.exec("SELECT DBA.TipoAsiento.TipoAsiento,DBA.TipoAsiento.Descrip FROM DBA.TipoAsiento WHERE TpDef <> 'N' ORDER BY DBA.TipoAsiento.TipoAsiento", function(err, row){
        if (err) throw err;
        cb(row);
    });
}
module.exports = TipoAsiento;