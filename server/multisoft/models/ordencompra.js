var conn = require('../db');
var q = require('./queryUtils');
var OrdenCompra = {};

OrdenCompra.all = function (filters, cb) {
    var sql = "SELECT dba.ordcompcab.cod_empresa,dba.ordcompcab.nroordcomp,dba.ordcompcab.codprov,date(dba.ordcompcab.fechaorden) as fechaorden,"+
                "dba.ordcompcab.codmoneda,cast(dba.ordcompcab.totalexen as decimal(20,0)) as totalexen,"+
                "cast(dba.ordcompcab.totalgrav as decimal(20,0)) as totalgrav,cast(dba.ordcompcab.iva as decimal(20,0)) as iva,"+
                "(case when dba.ordcompcab.estado = 'AP' then 'Aprobado' else "+
                    "(case when dba.ordcompcab.estado = 'PE' then 'Pendiente' else "+
                        "(case when dba.ordcompcab.estado = 'EP' then 'Entregado al Proveedor' else "+ 
                            "(case when dba.ordcompcab.estado = 'ED' then 'Enviado a Destino' else "+
                                "(case when dba.ordcompcab.estado = 'DE' then 'En proceso de Despacho' else "+ 
                                    "(case when dba.ordcompcab.estado = 'RE' then 'Recibido en Casa Matriz' else "+ 
                                        "(case when dba.ordcompcab.estado = 'CA' then 'Cancelado' end ) end ) end ) end ) end ) end) end) as estado,"+
                "dba.ordcompcab.porccumplido,dba.proveed.razonsocial,dba.ordcompcab.solicitadopor,"+
                "IFNULL(dba.ordcompcab.responsable,'') as responsable,dba.dpto.descrip,dba.ordcompcab.tipo_iva,IFNULL(dba.pedsumcab.nropedido,'') as nropedido,"+ 
                "(totalexen + totalgrav + (case when tipo_iva ='S' then 0 else  iva end)) as total "+
                "FROM dba.proveed ,((dba.ordcompcab LEFT OUTER JOIN dba.pedsumcab on dba.ordcompcab.cod_empresa = dba.pedsumcab.cod_empresa "+ 
                "and dba.ordcompcab.nrosolicitud = dba.pedsumcab.nrosolicitud) LEFT OUTER JOIN dba.dpto ON ( dba.dpto.cod_empresa = dba.ordcompcab.cod_empresa ) "+ 
                "and ( dba.dpto.cod_sucursal = dba.ordcompcab.cod_sucursal ) and ( dba.dpto.coddpto = dba.ordcompcab.coddpto )) "+ 
                "WHERE ( dba.ordcompcab.cod_empresa = dba.proveed.cod_empresa ) and ( dba.ordcompcab.codprov = dba.proveed.codprov ) "+ 
                "and ( dba.ordcompcab.cod_empresa = '"+filters.empresa+"' ) AND ( DATE (dba.ordcompcab.FechaOrden) >= DATE ('"+filters.compras_start+"') ) "+ 
                "AND ( DATE (dba.ordcompcab.FechaOrden) <= DATE ('"+filters.compras_end+"') ) and ( dba.ORDCOMPCAB.codDpto = '04' ) ";
    
    if (filters.proveedor) {
        sql += "AND (dba.ordcompcab.codprov IN " + q.in(filters.proveedor) + ") ";
    }
    
    if (filters.estado) {
        sql += "AND (dba.ordcompcab.estado IN " + q.in(filters.estado) + ") ";
    }
    
    if (filters.tipooc) {
        sql += "AND (dba.ordcompcab.TipoOrden IN " + q.in(filters.tipooc) + ") ";
    }
    
    console.log(sql)
    
    conn.exec(sql, function (err, row) {
        if (err) throw err;
        cb(row);
    });

};

module.exports = OrdenCompra;