var conn = require('../db_integrado');

var OrdenPago = {};

function dbIsPostgres() {
    try {
        if (typeof conn.getStatus === 'function') {
            var st = conn.getStatus() || {};
            var eng = String(st.engine || st.configured_engine || '').toLowerCase();
            if (eng === 'postgres') return true;
            if (eng === 'sqlanywhere') return false;
        }
    } catch (e) {}
    return String(conn._engine || '').toLowerCase() === 'postgres';
}

OrdenPago.all = function (params,cb) {
    var sucursal = String(params.sucursal || '').trim();
    var tipoop = String(params.tipoop || '').trim();
    var moneda = String(params.moneda || '').trim();

    function hasFilter(v) {
        if (!v) return false;
        var x = v.toLowerCase();
        return x !== 'undefined' && x !== 'ninguno' && x !== 'null';
    }

//     var sucursal = (params.sucursal == "NINGUNA" || params.sucursal == " ") ? "" : params.sucursal;
//     var tipoop = (params.tipoop == "NINGUNO" || params.tipoop == " ") ? "" : params.tipoop;
// //     var comprobante = (params.comprobante == "NINGUNO" || params.comprobante == " ") ? "" : params.comprobante;
//     var tipoproveedor = (params.tipoproveedor == "NINGUNO" || params.tipoproveedor == " ") ? "" : params.tipoproveedor;
//     var proveedor = (params.proveedor == "NINGUNO" || params.proveedor == " ") ? "" : params.proveedor;

    var razonSocialExpr = dbIsPostgres()
        ? "coalesce(beneficiario, '') as RazonSocial,"
        : "ifnull(beneficiario, '', beneficiario) as RazonSocial,";
    var sql = "SELECT "+
                "DBA.SUCURSAL.Des_Sucursal as Des_Sucursal,DBA.OPCAB.NroOP as NroOP,DBA.TPOCBTE.des_tp_comp as des_tp_comp,DBA.OPCAB.Fecha as Fecha," + razonSocialExpr +
                "DBA.OPCAB.NroCheque as NroCheque, DBA.OPCAB.CodMoneda as CodMoneda,";
                if (params.moneda == 'LO') {
                    sql = sql + "cast(DBA.OPCAB.TotalImporte as decimal(20,0)) as TotalImporte ";
                } else {
                    sql = sql + "cast(DBA.OPCAB.TotalImporte as decimal(20,2)) as TotalImporte "; 
                }
            sql = sql + "FROM "+
                "DBA.OPCAB,DBA.EMPRESA,DBA.SUCURSAL,DBA.TPOCBTE "+
            "WHERE "+
                "DBA.OPCAB.Cod_Empresa = DBA.EMPRESA.Cod_Empresa AND DBA.SUCURSAL.Cod_Empresa = DBA.EMPRESA.Cod_Empresa AND "+
                "DBA.SUCURSAL.Cod_Sucursal = DBA.OPCAB.Cod_Sucursal AND DBA.TPOCBTE.Cod_Empresa = DBA.OPCAB.Cod_Empresa AND DBA.TPOCBTE.Cod_Tp_Comp = DBA.OPCAB.Cod_Tp_Comp "+
                "AND DBA.OPCAB.Anulado = 'N' AND "+
                "cast(DBA.EMPRESA.Cod_Empresa as varchar(50)) like '%"+params.empresa+"%' AND DBA.OPCAB.Fecha BETWEEN '"+params.desde+"' and '"+params.hasta+"' ";
            if (hasFilter(sucursal))
                sql = sql + " and cast(DBA.SUCURSAL.Cod_Sucursal as varchar(50)) like '%"+sucursal+"%' ";
            if (hasFilter(tipoop))
                sql = sql + " AND cast(DBA.OPCAB.cod_tp_comp as varchar(50)) like '%"+tipoop+"%' ";
            if (moneda == 'LO') {
                    sql = sql + " and dba.opcab.codmoneda = 'GS' ";
                } else if (moneda == 'EX') {
                    sql = sql + " and dba.opcab.codmoneda = 'US' "; 
                }
//             if (params.tipoproveedor != 'undefined')    
//                 sql = sql + " AND cast(DBA.PROVEED.TipoProv as varchar(50)) like '%"+params.tipoproveedor+"%' ";
//             if (params.proveedor != 'undefined') 
//                 sql = sql + " AND cast(DBA.PROVEED.CodProv as varchar(50)) like '%"+params.proveedor+"%' ";
    console.log(sql);
    conn.exec(sql, function(err, row){
        if (err) {
            console.error('[OrdenPago.all] error:', err.message || err);
            return cb([]);
        }
        cb(row);
    });
};

module.exports = OrdenPago;
