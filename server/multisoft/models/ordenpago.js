var conn = require('../db');

var OrdenPago = {};

OrdenPago.all = function (params,cb) {

    var sucursal = (params.sucursal == "NINGUNA" || params.sucursal == " ") ? "" : params.sucursal;
    var tipoop = (params.tipoop == "NINGUNO" || params.tipoop == " ") ? "" : params.tipoop;
    var comprobante = (params.comprobante == "NINGUNO" || params.comprobante == " ") ? "" : params.comprobante;
    var tipoproveedor = (params.tipoproveedor == "NINGUNO" || params.tipoproveedor == " ") ? "" : params.tipoproveedor;
    var proveedor = (params.proveedor == "NINGUNO" || params.proveedor == " ") ? "" : params.proveedor;

    conn.exec("SELECT "+
                "Des_Sucursal,NroOP,des_tp_comp,date(Fecha) as Fecha,RazonSocial,cast(TotalImporte as decimal(20,0)) "+
            "FROM "+
                "DBA.OPCAB,DBA.EMPRESA,DBA.SUCURSAL,DBA.TPOCBTE,DBA.PROVEED "+
            "WHERE "+
                "DBA.OPCAB.Cod_Empresa = DBA.EMPRESA.Cod_Empresa AND DBA.SUCURSAL.Cod_Empresa = DBA.EMPRESA.Cod_Empresa AND "+
                "DBA.SUCURSAL.Cod_Sucursal = DBA.OPCAB.Cod_Sucursal AND DBA.TPOCBTE.Cod_Tp_Comp = DBA.OPCAB.Cod_Tp_Comp AND "+
                "DBA.PROVEED.CodProv = DBA.OPCAB.CodProv AND DBA.PROVEED.Cod_Empresa = DBA.OPCAB.Cod_Empresa AND "+
                "DBA.PROVEED.Cod_Empresa = DBA.EMPRESA.Cod_Empresa AND DBA.OPCAB.Anulado = 'N' AND "+
                "cast(DBA.SUCURSAL.Cod_Sucursal as varchar(50)) like '%"+sucursal+"%' AND cast(DBA.EMPRESA.Cod_Empresa as varchar(50)) like '%"+params.empresa+"%' "+
                "AND cast(DBA.OPCAB.TipoOP as varchar(50)) like '%"+tipoop+"%' AND cast(DBA.TPOCBTE.Cod_Tp_Comp as varchar(50)) like '%"+comprobante+"%' "+
                "AND cast(DBA.PROVEED.TipoProv as varchar(50)) like '%"+tipoproveedor+"%' AND cast(DBA.PROVEED.CodProv as varchar(50)) like '%"+proveedor+"%' "+
                "AND DBA.OPCAB.Fecha BETWEEN '"+params.desde+"' and '"+params.hasta+"'", function(err, row){
        if (err) throw err;
        cb(row);
    });
};

module.exports = Sucursal;