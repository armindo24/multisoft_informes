var conn = require('../db');
var util = require('util');
var Compras = {};

Compras.all = function (filters, cb) {
    //conn.exec("SET ROWCOUNT 100"); //TODO: solucionar resultados muy grandes

    var select = ""
    
    if (filters.moneda == "GS"){
        select = "case when dba.FACTCAB.anulado = 'N' then 'Activo' else 'Anulado' end as estado,DBA.EMPRESA.Des_Empresa,DBA.FACTCAB.CodProv,DBA.FACTCAB.NroFact,date(DBA.FACTCAB.FechaFact) as FechaFact,DBA.FACTCAB.Cod_Tp_Comp,"+ 
                "DBA.FACTCAB.Cod_Sucursal,DBA.FACTCAB.CodDpto,DBA.FACTCAB.CodMoneda,DBA.FACTCAB.Dcto,DBA.FACTCAB.TotalGrav,"+ 
                "cast(DBA.FACTCAB.IVA as decimal (20,0)) as IVA,DBA.FACTCAB.FactCambio,cast(DBA.FACTCAB.TotalExen as decimal (20,0)) as TotalExen,DBA.FACTCAB.IVAIncluido,DBA.DPTO.coddpto,"+ 
                "DBA.DPTO.descrip,DBA.MONEDA.Descrip,DBA.MONEDA.cantdecimal,DBA.Proveed.RazonSocial,DBA.SUCURSAL.des_sucursal,"+ 
                "DBA.TPOCBTE.des_tp_comp,DBA.tpocbte.af_existencia,DBA.factcab.fechacarga,DBA.Proveed.ruc,"+ 
                "case when DBA.FactCab.TipoIva = 'D' then 'Desglosado' else 'Incluido' end as TipoIva,DBA.FactCab.Asentado,DBA.FactCab.TipoCompra,case when DBA.FactCab.retenible_renta = 'NO' then 'NO' else 'SI' end as retenible_renta,"+
                "cast((case when FACTCAB.IVAIncluido = 'S' then  DBA.FACTCAB.TotalGrav - DBA.FACTCAB.IVA else DBA.FACTCAB.TotalGrav end) as decimal (20,0)) as gravada,"+
                "isnull(DBA.FactCab.Timbrado,DBA.Proveed.Timbrado,DBA.FactCab.Timbrado) as Timbrado,"+
                "cast(dba.FACTCAB.IVA+DBA.FACTCAB.TotalExen+(case when FACTCAB.IVAIncluido = 'S' then  DBA.FACTCAB.TotalGrav - DBA.FACTCAB.IVA else DBA.FACTCAB.TotalGrav end) as decimal (20,0)) as total";
    } else {
        select = "case when dba.FACTCAB.anulado = 'N' then 'Activo' else 'Anulado' end as estado,DBA.EMPRESA.Des_Empresa,DBA.FACTCAB.CodProv,DBA.FACTCAB.NroFact,date(DBA.FACTCAB.FechaFact) as FechaFact,DBA.FACTCAB.Cod_Tp_Comp,"+ 
                "DBA.FACTCAB.Cod_Sucursal,DBA.FACTCAB.CodDpto,DBA.FACTCAB.CodMoneda,DBA.FACTCAB.Dcto,DBA.FACTCAB.TotalGrav,"+ 
                "cast(DBA.FACTCAB.IVA as decimal (20,2)) as IVA,DBA.FACTCAB.FactCambio,cast(DBA.FACTCAB.TotalExen as decimal (20,2)) as TotalExen,DBA.FACTCAB.IVAIncluido,DBA.DPTO.coddpto,"+ 
                "DBA.DPTO.descrip,DBA.MONEDA.Descrip,DBA.MONEDA.cantdecimal,DBA.Proveed.RazonSocial,DBA.SUCURSAL.des_sucursal,"+ 
                "DBA.TPOCBTE.des_tp_comp,DBA.tpocbte.af_existencia,DBA.factcab.fechacarga,DBA.Proveed.ruc,"+ 
                "case when DBA.FactCab.TipoIva = 'D' then 'Desglosado' else 'Incluido' end as TipoIva,DBA.FactCab.Asentado,DBA.FactCab.TipoCompra,case when DBA.FactCab.retenible_renta = 'NO' then 'NO' else 'SI' end as retenible_renta,"+
                "cast((case when FACTCAB.IVAIncluido = 'S' then  DBA.FACTCAB.TotalGrav - DBA.FACTCAB.IVA else DBA.FACTCAB.TotalGrav end) as decimal (20,2)) as gravada,"+
                "isnull(DBA.FactCab.Timbrado,DBA.Proveed.Timbrado,DBA.FactCab.Timbrado) as Timbrado,"+
                "cast(dba.FACTCAB.IVA+DBA.FACTCAB.TotalExen+(case when FACTCAB.IVAIncluido = 'S' then  DBA.FACTCAB.TotalGrav - DBA.FACTCAB.IVA else DBA.FACTCAB.TotalGrav end) as decimal (20,2)) as total";
    }
    var from = "DBA.FACTCAB,DBA.EMPRESA,DBA.SUCURSAL,DBA.TPOCBTE,DBA.DPTO,DBA.MONEDA,DBA.Proveed";
    var where = "( DBA.FACTCAB.Cod_Empresa = DBA.EMPRESA.cod_empresa ) and ( DBA.FACTCAB.Cod_Empresa = DBA.SUCURSAL.cod_empresa ) "+ 
                "and ( DBA.FACTCAB.Cod_Sucursal = DBA.SUCURSAL.cod_sucursal ) and ( DBA.FACTCAB.CodMoneda = DBA.MONEDA.CodMoneda ) "+ 
                "and ( DBA.FACTCAB.Cod_Empresa = DBA.TPOCBTE.Cod_Empresa ) and ( DBA.FACTCAB.Cod_Tp_Comp = DBA.TPOCBTE.cod_tp_comp ) "+ 
                "and ( DBA.FACTCAB.Cod_Empresa = DBA.PROVEED.Cod_Empresa ) and ( DBA.FACTCAB.CodProv = DBA.PROVEED.CodProv ) "+ 
                "and ( DBA.FACTCAB.Cod_Empresa = DBA.DPTO.cod_empresa ) and ( DBA.FACTCAB.Cod_Sucursal = DBA.DPTO.cod_sucursal ) "+ 
                "and ( DBA.FACTCAB.CodDpto = DBA.DPTO.coddpto ) AND ( FactCab.cod_empresa = '"+filters.empresa+"') AND (FACTCAB.Cod_Sucursal = '01') "+
                "AND (FACTCAB.CodDpto = '01') AND (FACTCAB.CodMoneda = 'GS') AND ( DATE (DBA.FACTCAB.FechaFact) >= DATE ('2015-01-01') ) "+  
                "AND ( DATE (DBA.FACTCAB.FechaFact) <= DATE ('2015-12-31') )";
//                 "and ( DBA.FACTCAB.CodDpto = DBA.DPTO.coddpto ) AND ( FactCab.cod_empresa = '"+filters.empresa+"') AND (FACTCAB.Cod_Sucursal = '"+filters.sucursal+"') "+
//                 "AND (FACTCAB.CodDpto = '"+filters.departamento+"') AND (FACTCAB.CodMoneda = '"+filters.moneda+"') AND ( DATE (DBA.FACTCAB.FechaFact) >= DATE ('"+filters.compras_start+"') ) "+  
//                 "AND ( DATE (DBA.FACTCAB.FechaFact) <= DATE ('"+filters.compras_end+"') )";

//     if (filters.cliente) {
//         where += " and (dba.vtacab.cod_cliente = ?)";
//         args.push(filters.cliente);
//     }
// 
//     if (filters.sucursal) {
//         where += " and (dba.vtacab.cod_sucursal = ?)";
//         args.push(filters.sucursal);
//     }
// 
//     if (filters.tipo_comprobante) {
//         where += " and (dba.vtacab.cod_tp_comp = ?)";
//         args.push(filters.tipo_comprobante);
//     }
// 
//     if (filters.desde && filters.hasta) {
//         where += " and (dba.vtacab.fha_cbte BETWEEN ? and ?)";
//         args.push(filters.desde);
//         args.push(filters.hasta);
//     }


    var sql = util.format("SELECT %s FROM %s WHERE %s", select, from, where);
//     if (filters.order) {
//         if (filters.order == "cod_tp_comp") {
//             sql += " ORDER BY dba.vtacab.Cod_Tp_Comp";
//         } else if (filters.order == "cod_cliente") {
//             sql += " ORDER BY dba.vtacab.cod_cliente";
//         } else if (filters.order == "cod_vendedor") {
//             sql += " ORDER BY dba.vtacab.cod_vendedor";
//         }
//     }

    console.log(sql);

    conn.exec(sql, function (err, r) {
        if (err) throw err;
        cb(r);
    });
};

module.exports = Compras;