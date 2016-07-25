var conn = require('../db_integrado');

var OrdenPago = {};

OrdenPago.all = function (params,cb) {

//     var sucursal = (params.sucursal == "NINGUNA" || params.sucursal == " ") ? "" : params.sucursal;
//     var tipoop = (params.tipoop == "NINGUNO" || params.tipoop == " ") ? "" : params.tipoop;
// //     var comprobante = (params.comprobante == "NINGUNO" || params.comprobante == " ") ? "" : params.comprobante;
//     var tipoproveedor = (params.tipoproveedor == "NINGUNO" || params.tipoproveedor == " ") ? "" : params.tipoproveedor;
//     var proveedor = (params.proveedor == "NINGUNO" || params.proveedor == " ") ? "" : params.proveedor;


    var sql = "SELECT "+
                "Des_Sucursal,NroOP,des_tp_comp,date(Fecha) as Fecha,ifnull(beneficiario, '', beneficiario) as RazonSocial,";
                if (params.moneda == 'LO') {
                    sql = sql + "cast(TotalImporte as decimal(20,0)) ";
                } else {
                    sql = sql + "cast(TotalImporte as decimal(20,2)) "; 
                }
            sql = sql + "FROM "+
                "DBA.OPCAB,DBA.EMPRESA,DBA.SUCURSAL,DBA.TPOCBTE "+
            "WHERE "+
                "DBA.OPCAB.Cod_Empresa = DBA.EMPRESA.Cod_Empresa AND DBA.SUCURSAL.Cod_Empresa = DBA.EMPRESA.Cod_Empresa AND "+
                "DBA.SUCURSAL.Cod_Sucursal = DBA.OPCAB.Cod_Sucursal AND DBA.TPOCBTE.Cod_Empresa = DBA.OPCAB.Cod_Empresa AND DBA.TPOCBTE.Cod_Tp_Comp = DBA.OPCAB.Cod_Tp_Comp "+
                "AND DBA.OPCAB.Anulado = 'N' AND "+
                "cast(DBA.EMPRESA.Cod_Empresa as varchar(50)) like '%"+params.empresa+"%' AND DBA.OPCAB.Fecha BETWEEN '"+params.desde+"' and '"+params.hasta+"' ";
            if (params.sucursal != 'undefined')
                sql = sql + " and cast(DBA.SUCURSAL.Cod_Sucursal as varchar(50)) like '%"+params.sucursal+"%' ";
            if (params.tipoop != 'undefined')
                sql = sql + " AND cast(DBA.OPCAB.cod_tp_comp as varchar(50)) like '%"+params.tipoop+"%' ";
            if (params.moneda == 'LO') {
                    sql = sql + " and dba.opcab.codmoneda = 'GS' ";
                } else {
                    sql = sql + " and dba.opcab.codmoneda = 'US' "; 
                }
//             if (params.tipoproveedor != 'undefined')    
//                 sql = sql + " AND cast(DBA.PROVEED.TipoProv as varchar(50)) like '%"+params.tipoproveedor+"%' ";
//             if (params.proveedor != 'undefined') 
//                 sql = sql + " AND cast(DBA.PROVEED.CodProv as varchar(50)) like '%"+params.proveedor+"%' ";
    console.log(sql);
    conn.exec(sql, function(err, row){
        if (err) throw err;
        cb(row);
    });
};

module.exports = OrdenPago;