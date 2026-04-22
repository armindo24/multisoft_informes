var conn = require('../db_integrado');
var util = require('util');
var q = require('./queryUtils');
var Compras = {};

function hasValue(value) {
    return value !== undefined && value !== null && String(value).trim() !== '';
}

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

function top10Prefix() {
    return dbIsPostgres() ? 'SELECT ' : 'SELECT top 10 ';
}

function top10Suffix() {
    return dbIsPostgres() ? ' LIMIT 10' : '';
}

function monedaCompraCondition(monedaValue, fieldExpr) {
    var normField = "upper(trim(coalesce(" + fieldExpr + ",'')))";
    var m = String(monedaValue || '').toUpperCase();
    if (m === 'GS' || m === 'PYG' || m === 'LO' || m === 'LOCAL') {
        return " AND " + normField + " IN ('GS','PYG') ";
    }
    if (m === 'US' || m === 'USD' || m === 'EX' || m === 'EXTRANJERA') {
        return " AND " + normField + " IN ('US','USD') ";
    }
    return "";
}

function asentadaCompraCondition(asentadaValue, fieldExpr) {
    var v = String(asentadaValue || '').toUpperCase().trim();
    // PR: procesada/asentada, PE: pendiente/no asentada.
    if (!v || v === 'PR' || v === 'S' || v === 'SI') {
        return " AND " + fieldExpr + " = 'S' ";
    }
    if (v === 'PE' || v === 'N' || v === 'NO') {
        return " AND " + fieldExpr + " = 'N' ";
    }
    if (v === 'ALL' || v === 'A' || v === 'TODOS') {
        return "";
    }
    return " AND " + fieldExpr + " = 'S' ";
}

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
                "AND (FACTCAB.CodMoneda = '"+filters.moneda+"') AND ( DATE (DBA.FACTCAB.FechaFact) >= DATE ('"+filters.compras_start+"') ) "+  
                "AND ( tpocbte.tp_def <> 'RT') AND ( DATE (DBA.FACTCAB.FechaFact) <= DATE ('"+filters.compras_end+"') )";


    var sql = util.format("SELECT %s FROM %s WHERE %s", select, from, where);

    if (hasValue(filters.departamento)) {
        sql += " AND (FACTCAB.CodDpto = '" + String(filters.departamento).trim() + "') ";
    }
    
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
    
    if (params.moneda == "GS"){
    
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

Compras.articulo = function (filters, cb){
  
  var sql = "";
  console.log(filters.moneda);
  if (filters.moneda == "GS"){
      var sql = "select date(dba.FACTCAB.FechaFact) as f_emision,date(dba.FACTCAB.FechaCarga) as f_carga,dba.FACTDET.Cod_Tp_Comp,dba.FACTDET.NroFact,"+
                "dba.FACTDET.CodProv,dba.PROVEED.RazonSocial,dba.FACTCAB.CodMoneda,dba.FACTDET.Cod_Articulo,dba.ARTICULO.Des_Art,"+
                "dba.FACTDET.Cantidad,cast(dba.FACTDET.Pr_Unit as decimal(20,0)) as Pr_Unit,"+
                "case when dba.TPOCBTE.tp_def = 'NP' then cast(dba.FACTDET.Pr_Unit as decimal(20,0)) else cast(dba.FACTDET.PrecioCosto as decimal(20,0)) end as Costo_Neto,"+
                "cast(dba.FACTDET.IVA as decimal(20,0)) as IVA,cast(((dba.FACTDET.Pr_Unit*dba.FACTDET.Cantidad) - dba.FACTDET.IVA) as decimal (20,0)) as total_sin_iva,"+
                "cast((dba.FACTDET.Pr_Unit*dba.FACTDET.Cantidad) as decimal(20,0)) as total_con_iva from dba.FACTDET,dba.FACTCAB,"+
                "dba.PROVEED,dba.TPOCBTE,dba.ARTICULO WHERE dba.FACTCAB.Cod_Empresa = dba.FACTDET.Cod_Empresa and dba.FACTCAB.CodProv = dba.FACTDET.CodProv "+
                "and dba.FACTCAB.NroFact = dba.FACTDET.NroFact and dba.FACTCAB.Cod_Tp_Comp = dba.FACTDET.Cod_Tp_Comp and dba.FACTDET.CodProv = dba.PROVEED.CodProv "+
                "and dba.FACTDET.Cod_Empresa = dba.PROVEED.Cod_Empresa and dba.FACTDET.Cod_Tp_Comp = dba.TPOCBTE.Cod_Tp_Comp and dba.FACTDET.Cod_Empresa = dba.TPOCBTE.Cod_Empresa "+
                "and dba.FACTDET.Cod_Articulo = dba.ARTICULO.Cod_Articulo and dba.FACTDET.Cod_Empresa = dba.ARTICULO.Cod_Empresa and dba.TPOCBTE.tp_def <> 'RT' "+ 
                "and dba.FACTDET.Cod_Empresa = '"+filters.empresa+"' and dba.FACTCAB.Cod_Sucursal = '"+filters.sucursal+"' "+
                "and dba.FACTCAB.anulado = 'N' and dba.FACTCAB.CodMoneda = '"+filters.moneda+"' "+
                "and ( DATE (dba.FACTCAB.FechaFact) >= DATE ('"+filters.compras_start+"') ) "+  
                "and ( DATE (dba.FACTCAB.FechaFact) <= DATE ('"+filters.compras_end+"') )";
  } else {
      var sql = "select date(dba.FACTCAB.FechaFact) as f_emision,date(dba.FACTCAB.FechaCarga) as f_carga,dba.FACTDET.Cod_Tp_Comp,dba.FACTDET.NroFact,"+
                "dba.FACTDET.CodProv,dba.PROVEED.RazonSocial,dba.FACTCAB.CodMoneda,dba.FACTDET.Cod_Articulo,dba.ARTICULO.Des_Art,"+
                "dba.FACTDET.Cantidad,cast(dba.FACTDET.Pr_Unit as decimal(20,2)) as Pr_Unit,"+
                "case when dba.TPOCBTE.tp_def = 'NP' then cast(dba.FACTDET.Pr_Unit as decimal(20,2)) else cast(dba.FACTDET.PrecioCosto as decimal(20,2)) end as Costo_Neto,"+
                "cast(dba.FACTDET.IVA as decimal(20,2)) as IVA,cast(((dba.FACTDET.Pr_Unit*dba.FACTDET.Cantidad) - dba.FACTDET.IVA) as decimal (20,2)) as total_sin_iva,"+
                "cast((dba.FACTDET.Pr_Unit*dba.FACTDET.Cantidad) as decimal(20,2)) as total_con_iva from dba.FACTDET,dba.FACTCAB,"+
                "dba.PROVEED,dba.TPOCBTE,dba.ARTICULO WHERE dba.FACTCAB.Cod_Empresa = dba.FACTDET.Cod_Empresa and dba.FACTCAB.CodProv = dba.FACTDET.CodProv "+
                "and dba.FACTCAB.NroFact = dba.FACTDET.NroFact and dba.FACTCAB.Cod_Tp_Comp = dba.FACTDET.Cod_Tp_Comp and dba.FACTDET.CodProv = dba.PROVEED.CodProv "+
                "and dba.FACTDET.Cod_Empresa = dba.PROVEED.Cod_Empresa and dba.FACTDET.Cod_Tp_Comp = dba.TPOCBTE.Cod_Tp_Comp and dba.FACTDET.Cod_Empresa = dba.TPOCBTE.Cod_Empresa "+
                "and dba.FACTDET.Cod_Articulo = dba.ARTICULO.Cod_Articulo and dba.FACTDET.Cod_Empresa = dba.ARTICULO.Cod_Empresa and dba.TPOCBTE.tp_def <> 'RT' "+ 
                "and dba.FACTDET.Cod_Empresa = '"+filters.empresa+"' and dba.FACTCAB.Cod_Sucursal = '"+filters.sucursal+"' "+
                "and dba.FACTCAB.anulado = 'N' and dba.FACTCAB.CodMoneda = '"+filters.moneda+"' "+
                "and ( DATE (dba.FACTCAB.FechaFact) >= DATE ('"+filters.compras_start+"') ) "+  
                "and ( DATE (dba.FACTCAB.FechaFact) <= DATE ('"+filters.compras_end+"') )";
  }

    if (hasValue(filters.departamento)) {
        sql += " AND (dba.FACTCAB.CodDpto = '" + String(filters.departamento).trim() + "') ";
    }
  
     if (filters.tipooc) {
        sql += " AND (dba.FACTCAB.Cod_Tp_Comp IN " + q.in(filters.tipooc) + ") ";
    } 
    
    if (filters.proveedor) {
        sql += " AND (dba.FACTCAB.CodProv IN " + q.in(filters.proveedor) + ") ";
    } 
    
    if (filters.articulo) {
        sql += " AND (dba.FACTDET.Cod_Articulo IN " + q.in(filters.articulo) + ") ";
    } 
    
    
    sql += "ORDER BY dba.FACTDET.Cod_Articulo";
    
    console.log(sql)
    
    conn.exec(sql, function (err, r) {
        if (err) throw err;
        cb(r);
    }) 
};

Compras.ranking_aticulo = function (filters, cb) {
    //conn.exec("SET ROWCOUNT 100"); //TODO: solucionar resultados muy grandes

    var select = ""
    
    if (filters.moneda == "GS"){
        select = top10Prefix()+
                    "DBA.FACTDET.Cod_Articulo,"+
                    "DBA.ARTICULO.Des_Art,"+ 
                    "cast(SUM(DBA.FACTDET.Cantidad * DBA.FACTDET.Pr_Unit) as decimal (20,0)) AS TotalItem "+ 
                 "FROM "+ 
                    "DBA.FACTCAB,"+ 
                    "DBA.FACTDET,"+ 
                    "DBA.ARTICULO "+ 
                 "WHERE "+ 
                    "DBA.FACTCAB.Cod_empresa = DBA.FACTDET.Cod_empresa "+ 
                    "AND DBA.FACTCAB.CodProv = DBA.FACTDET.CodProv "+ 
                    "AND DBA.FACTCAB.Cod_Tp_Comp = DBA.FACTDET.Cod_Tp_Comp "+ 
                    "AND DBA.FACTCAB.NroFact = DBA.FACTDET.NroFact "+ 
                    "AND DBA.FACTDET.Cod_empresa = DBA.ARTICULO.Cod_empresa "+ 
                    "AND DBA.FACTDET.Cod_Articulo = DBA.ARTICULO.Cod_Articulo "+ 
                    "AND ( DBA.FactCab.cod_empresa = '"+filters.empresa+"') "+ 
                    "AND Date (FactCab.FechaFact) >= Date ('"+filters.compras_start+"') "+ 
                    "AND Date (FactCab.FechaFact) <= Date('"+filters.compras_end+"') ";
    } else {
        select = top10Prefix()+
                    "DBA.FACTDET.Cod_Articulo,"+
                    "DBA.ARTICULO.Des_Art,"+ 
                    "cast(SUM(DBA.FACTDET.Cantidad * DBA.FACTDET.Pr_Unit) as decimal (20,2)) AS TotalItem "+ 
                 "FROM "+ 
                    "DBA.FACTCAB,"+ 
                    "DBA.FACTDET,"+ 
                    "DBA.ARTICULO "+ 
                 "WHERE "+ 
                    "DBA.FACTCAB.Cod_empresa = DBA.FACTDET.Cod_empresa "+ 
                    "AND DBA.FACTCAB.CodProv = DBA.FACTDET.CodProv "+ 
                    "AND DBA.FACTCAB.Cod_Tp_Comp = DBA.FACTDET.Cod_Tp_Comp "+ 
                    "AND DBA.FACTCAB.NroFact = DBA.FACTDET.NroFact "+ 
                    "AND DBA.FACTDET.Cod_empresa = DBA.ARTICULO.Cod_empresa "+ 
                    "AND DBA.FACTDET.Cod_Articulo = DBA.ARTICULO.Cod_Articulo "+ 
                    "AND ( DBA.FactCab.cod_empresa = '"+filters.empresa+"') "+ 
                    "AND Date (FactCab.FechaFact) >= Date ('"+filters.compras_start+"') "+ 
                    "AND Date (FactCab.FechaFact) <= Date('"+filters.compras_end+"') ";
    }
    
    if (filters.articulo) {
        select += " AND (dba.FACTDET.Cod_Articulo IN " + q.in(filters.articulo) + ") ";
    } 

    select += monedaCompraCondition(filters.moneda, "DBA.FACTCAB.CodMoneda");
    
    select+= "GROUP BY "+ 
                  "DBA.FACTDET.Cod_Articulo,"+ 
                  "DBA.ARTICULO.Des_Art "+ 
              "ORDER BY "+ 
                  "TotalItem DESC" + top10Suffix();
        
    console.log(select);
    
    conn.exec(select, function (err, r) {
        if (err) {
            console.error('[Compras.ranking_aticulo] error:', err.message || err);
            return cb([]);
        }
        cb(r);
    });
};
    
Compras.ranking_proveedor = function (filters, cb) {
    //conn.exec("SET ROWCOUNT 100"); //TODO: solucionar resultados muy grandes
    var totalExpr = "cast(SUM( (DBA.FACTCAB.TotalExen + (DBA.FACTCAB.TotalGrav - (CASE WHEN DBA.FACTCAB.IVAIncluido = 'S' THEN DBA.FACTCAB.IVA ELSE 0 END))) * (CASE WHEN dba.tpocbte.tp_def = 'NP' THEN -1 ELSE 1 END) ) as decimal (20,__SCALE__)) AS TotalCompras ";
    var selectBase = "";
    var dateExpr = "__DATE_EXPR__";
    if (filters.moneda == "GS"){
        selectBase = top10Prefix()+
                    "DBA.Proveed.CodProv,"+ 
                    "DBA.Proveed.RazonSocial,"+ 
                    totalExpr.replace('__SCALE__', '0') + 
                 "FROM "+ 
                    "DBA.proveed,"+ 
                    "DBA.FACTCAB,"+ 
                    "DBA.TPOCBTE "+ 
                 "WHERE "+ 
                    "( DBA.FACTCAB.Cod_Empresa = DBA.Proveed.Cod_Empresa ) "+ 
                    "AND ( DBA.FACTCAB.CodProv = DBA.Proveed.CodProv ) "+ 
                    "AND ( 1=1 ) "+ 
                    "AND ( DBA.FACTCAB.COD_EMPRESA = DBA.TPOCBTE.COD_EMPRESA) "+ 
                    "AND ( DBA.FACTCAB.COD_TP_COMP = DBA.TPOCBTE.COD_TP_COMP) "+ 
                    "AND ( FactCab.cod_empresa = '"+filters.empresa+"') "+ 
                    "AND " + dateExpr + " >= Date ('"+filters.compras_start+"') "+ 
                    "AND " + dateExpr + " <= Date('"+filters.compras_end+"') "; 
    } else {
        selectBase = top10Prefix()+
                    "DBA.Proveed.CodProv,"+ 
                    "DBA.Proveed.RazonSocial,"+ 
                    totalExpr.replace('__SCALE__', '2') + 
                 "FROM "+ 
                    "DBA.proveed,"+ 
                    "DBA.FACTCAB,"+ 
                    "DBA.TPOCBTE "+ 
                 "WHERE "+ 
                    "( DBA.FACTCAB.Cod_Empresa = DBA.Proveed.Cod_Empresa ) "+ 
                    "AND ( DBA.FACTCAB.CodProv = DBA.Proveed.CodProv ) "+ 
                    "AND ( 1=1 ) "+ 
                    "AND ( DBA.FACTCAB.COD_EMPRESA = DBA.TPOCBTE.COD_EMPRESA) "+ 
                    "AND ( DBA.FACTCAB.COD_TP_COMP = DBA.TPOCBTE.COD_TP_COMP) "+ 
                    "AND ( FactCab.cod_empresa = '"+filters.empresa+"') "+ 
                    "AND " + dateExpr + " >= Date ('"+filters.compras_start+"') "+ 
                    "AND " + dateExpr + " <= Date('"+filters.compras_end+"') "; 
    }

    var proveedorCond = "";
    if (filters.proveedor) {
        proveedorCond = " AND (dba.FACTCAB.CodProv IN " + q.in(filters.proveedor) + ") ";
    }
    var sucursalCond = hasValue(filters.sucursal)
        ? (" AND (dba.FACTCAB.Cod_Sucursal = '" + String(filters.sucursal).trim() + "') ")
        : "";
    var monedaCond = monedaCompraCondition(filters.moneda, "dba.factcab.codmoneda");
    var asentadaCond = asentadaCompraCondition(filters.asentada, "dba.factcab.asentado");
    var asentadaAllCond = asentadaCompraCondition('ALL', "dba.factcab.asentado");
    var groupOrder = "GROUP BY DBA.Proveed.CodProv,DBA.Proveed.RazonSocial ORDER BY TotalCompras DESC" + top10Suffix();

    function buildSql(useSucursal, useMoneda, dateField, useAllAsentada) {
        var dateSql = "Date(FactCab." + dateField + ")";
        return selectBase.replace(new RegExp("__DATE_EXPR__", "g"), dateSql) +
            proveedorCond +
            (useSucursal ? sucursalCond : "") +
            (useAllAsentada ? asentadaAllCond : asentadaCond) +
            (useMoneda ? monedaCond : "") +
            groupOrder;
    }

    function execWithFallback(sql, next) {
        console.log(sql);
        conn.exec(sql, function (err, rows) {
            if (err) return next(err);
            next(null, rows || []);
        });
    }

    var dateFields = ['FechaFact', 'FechaIngreso', 'FechaCarga'];
    var allowAsentadaFallback = String(filters.asentada || '').toUpperCase().trim() !== 'ALL';
    var attempts = [];
    dateFields.forEach(function (df) {
        attempts.push({ useSucursal: true, useMoneda: true, dateField: df, label: 'base/' + df, useAllAsentada: false });
        attempts.push({ useSucursal: true, useMoneda: false, dateField: df, label: 'sin_moneda/' + df, useAllAsentada: false });
        attempts.push({ useSucursal: false, useMoneda: false, dateField: df, label: 'general/' + df, useAllAsentada: false });
        if (allowAsentadaFallback) {
            attempts.push({ useSucursal: true, useMoneda: true, dateField: df, label: 'base_all_asentada/' + df, useAllAsentada: true });
            attempts.push({ useSucursal: true, useMoneda: false, dateField: df, label: 'sin_moneda_all_asentada/' + df, useAllAsentada: true });
            attempts.push({ useSucursal: false, useMoneda: false, dateField: df, label: 'general_all_asentada/' + df, useAllAsentada: true });
        }
    });

    (function runAttempt(i) {
        if (i >= attempts.length) return cb([]);
        var at = attempts[i];
        execWithFallback(buildSql(at.useSucursal, at.useMoneda, at.dateField, at.useAllAsentada), function (err, rows) {
            if (err) {
                console.error('[Compras.ranking_proveedor] ' + at.label + ' error:', err.message || err);
                return runAttempt(i + 1);
            }
            if (rows && rows.length) return cb(rows);
            runAttempt(i + 1);
        });
    })(0);
};


module.exports = Compras;
