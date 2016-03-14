var conn = require('../db');
var util = require('util');
var q = require('./queryUtils');
var Compras = {};

Compras.all = function (filters, cb) {
    //conn.exec("SET ROWCOUNT 100"); //TODO: solucionar resultados muy grandes

    var select = ""
    
    if (filters.moneda == "GS"){
        select = "case when dba.FACTCAB.anulado = 'N' then 'Activo' else 'Anulado' end as estado,DBA.EMPRESA.Cod_Empresa,DBA.EMPRESA.Des_Empresa,DBA.FACTCAB.CodProv,DBA.FACTCAB.NroFact,date(DBA.FACTCAB.FechaFact) as FechaFact,DBA.FACTCAB.Cod_Tp_Comp,DBA.TPOCBTE.Des_Tp_Comp,"+ 
                "DBA.FACTCAB.Cod_Sucursal,DBA.FACTCAB.CodDpto,DBA.FACTCAB.CodMoneda,DBA.FACTCAB.Dcto,DBA.FACTCAB.TotalGrav,"+ 
                "cast(DBA.FACTCAB.IVA as decimal (20,0)) as IVA,DBA.FACTCAB.FactCambio,cast(DBA.FACTCAB.TotalExen as decimal (20,0)) as TotalExen,DBA.FACTCAB.IVAIncluido,DBA.DPTO.coddpto,"+ 
                "DBA.DPTO.descrip,DBA.MONEDA.Descrip,DBA.MONEDA.cantdecimal,DBA.Proveed.RazonSocial,DBA.SUCURSAL.des_sucursal,"+ 
                "DBA.TPOCBTE.des_tp_comp,DBA.tpocbte.af_existencia,DBA.factcab.fechacarga,DBA.Proveed.ruc,"+ 
                "case when DBA.FactCab.TipoIva = 'D' then 'Desglosado' else 'Incluido' end as TipoIva,DBA.FactCab.Asentado,DBA.FactCab.TipoCompra,case when DBA.FactCab.retenible_renta = 'NO' then 'NO' else 'SI' end as retenible_renta,"+
                "cast((case when FACTCAB.IVAIncluido = 'S' then  DBA.FACTCAB.TotalGrav - DBA.FACTCAB.IVA else DBA.FACTCAB.TotalGrav end) as decimal (20,0)) as gravada,"+
                "isnull(DBA.FactCab.Timbrado,DBA.Proveed.Timbrado,DBA.FactCab.Timbrado) as Timbrado,"+
                "cast(dba.FACTCAB.IVA+DBA.FACTCAB.TotalExen+(case when FACTCAB.IVAIncluido = 'S' then  DBA.FACTCAB.TotalGrav - DBA.FACTCAB.IVA else DBA.FACTCAB.TotalGrav end) as decimal (20,0)) as total";
    } else {
        select = "case when dba.FACTCAB.anulado = 'N' then 'Activo' else 'Anulado' end as estado,DBA.EMPRESA.Cod_Empresa,DBA.EMPRESA.Des_Empresa,DBA.FACTCAB.CodProv,DBA.FACTCAB.NroFact,date(DBA.FACTCAB.FechaFact) as FechaFact,DBA.FACTCAB.Cod_Tp_Comp,DBA.TPOCBTE.Des_Tp_Comp,"+ 
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
                "and ( DBA.FACTCAB.CodDpto = DBA.DPTO.coddpto ) AND ( FactCab.cod_empresa = '"+filters.empresa+"') AND (FACTCAB.Cod_Sucursal = '"+filters.sucursal+"') "+
                "AND (FACTCAB.CodDpto = '"+filters.departamento+"') AND (FACTCAB.CodMoneda = '"+filters.moneda+"') AND ( DATE (DBA.FACTCAB.FechaFact) >= DATE ('"+filters.compras_start+"') ) "+  
                "AND ( tpocbte.tp_def <> 'RT') AND ( DATE (DBA.FACTCAB.FechaFact) <= DATE ('"+filters.compras_end+"') )";


    var sql = util.format("SELECT %s FROM %s WHERE %s", select, from, where);
    
    if (filters.tipooc) {
        sql += " AND (dba.FACTCAB.Cod_Tp_Comp IN " + q.in(filters.tipooc) + ") ";
    } 
    
    if (filters.proveedor) {
        sql += " AND (dba.FACTCAB.CodProv IN " + q.in(filters.proveedor) + ") ";
    } 
    
    if (filters.agrupar) {
        if (filters.agrupar == "Cod_Tp_Comp") {
            sql += " ORDER BY dba.FACTCAB.Cod_Tp_Comp";
        } else if (filters.agrupar == "RazonSocial") {
            sql += " ORDER BY dba.FACTCAB.CodProv";
        } else if (filters.agrupar == "AR") {
            //sql += " ORDER BY dba.FACTCAB.cod_vendedor";
        }
    }

    console.log(sql);

    conn.exec(sql, function (err, r) {
        if (err) throw err;
        cb(r);
    });
};


Compras.detail = function (params, cb){

    var sql = ""
    
    if (params.moneda = "GS"){
    
        sql = "select dba.ARTICULO.Cod_Articulo,dba.ARTICULO.Des_Art,dba.FACTDET.GravExen,dba.FACTDET.Cantidad,"+
                "cast(dba.FACTDET.Pr_Unit as decimal(20,0)) as Pr_Unit,cast(dba.FACTDET.IVA as decimal(20,0)) as IVA,"+
                "cast(dba.FACTDET.Total as decimal(20,0)) as Total from dba.FACTDET,dba.ARTICULO "+
                "where dba.FACTDET.Cod_Articulo = dba.ARTICULO.Cod_Articulo and dba.FACTDET.Cod_Empresa = dba.ARTICULO.Cod_Empresa "+
                "and dba.FACTDET.Cod_Empresa = '"+params.empresa+"' and dba.FACTDET.NroFact = '"+params.factura+"' "+
                "and dba.FACTDET.cod_tp_comp = '"+params.comprobante+"' and dba.FACTDET.CodProv = '"+params.proveedor+"'";   
        
    } else {
        
        sql = "select dba.ARTICULO.Cod_Articulo,dba.ARTICULO.Des_Art,dba.FACTDET.GravExen,dba.FACTDET.Cantidad,"+
                "cast(dba.FACTDET.Pr_Unit as decimal(20,2)) as Pr_Unit,cast(dba.FACTDET.IVA as decimal(20,2)) as IVA,"+
                "cast(dba.FACTDET.Total as decimal(20,2)) as Total from dba.FACTDET,dba.ARTICULO,dba.TPOCBTE "+
                "where dba.FACTDET.Cod_Articulo = dba.ARTICULO.Cod_Articulo and dba.FACTDET.Cod_Empresa = dba.ARTICULO.Cod_Empresa "+
                "and dba.FACTDET.Cod_Empresa = '"+params.empresa+"' and dba.FACTDET.NroFact = '"+params.factura+"' "+
                "and dba.FACTDET.cod_tp_comp = '"+params.comprobante+"' and dba.FACTDET.CodProv = '"+params.proveedor+"'";   

        
    }            
    conn.exec(sql, function (err, r) {
        if (err) throw err;
        cb(r);
    }) 
};

module.exports = Compras;