var conn = require('../db');        
var util = require('util');
var q = require('./queryUtils');
var Gastos_Rendir = {};

Gastos_Rendir.all = function (filters, cb) {
    
    var string = "SELECT "+
                    "DBA.FACTCAB.Cod_Empresa,"+
                    "DBA.FACTCAB.NroRendicion,"+
                    "DBA.FACTCAB.Cod_Tp_Comp,"+
                    "dba.TPOCBTE.des_tp_comp,"+
                    "DBA.FACTCAB.NroFact,"+
                    "date(DBA.FACTCAB.FechaFact) as FechaFact,"+
                    "DBA.FACTCAB.CodProv,"+
                    "DBA.factcab.RazonSocial,"+ 
                    "DBA.FACTCAB.CodResponsable,"+
                    "P2.RazonSocial as NombreResp,"+
                    "DBA.FACTCAB.CodMoneda,"+
                    "dba.MONEDA.Descrip as DesMoneda,"+
                    "DBA.FACTCAB.IVAIncluido,"+ 
                    "DBA.FACTCAB.FactCambio,"+
                    "DBA.FACTCAB.TotalGrav,"+
                    "DBA.FACTCAB.IVA,"+
                    "DBA.FACTCAB.TotalExen,"+
                    "DBA.FACTCAB.Asentado,"+ 
                    "DBA.FACTCAB.TipoIVA,"+
                    "DBA.FACTCAB.NroTransac,"+
                    "DBA.Control.MonedaLocal,"+
                    "DBA.FactCab.PlanAuxProv,"+
                    "DBA.FactCab.Gravado,"+ 
                    "DBA.FactCab.Timbrado,"+
                    "dba.f_get_CuentaAuxName ( DBA.FactCab.Cod_Empresa,"+
                                                "dba.f_get_periodo (DBA.FactCab.Cod_Empresa,"+
                                                "date (DBA.FactCab.FechaFact)),"+ 
                                                "DBA.FactCab.PlanCtaProv,"+
                                                "DBA.FactCab.PlanAuxProv) as planuaxi_nombre,"+
                    "DBA.tpocbte.tp_def,"+
                    "DBA.TpoCbte.TpoMvto,"+
                    "DBA.Control.porcrrenta,"+
                    "DBA.factcab.retenible_renta,"+
                    "ROUND(case when DBA.FACTCAB.IVAIncluido = 'S' then DBA.FACTCAB.TotalGrav-DBA.FACTCAB.IVA else DBA.FACTCAB.TotalGrav end,((case when DBA.FACTCAB.CodMoneda = MonedaLocal then 0 else 4 end)* (case when DBA.tpocbte.tp_def = 'RT' then -1 else 1 end))) as calc_gravada,"+
                    "ROUND(DBA.FACTCAB.IVA, ((case when DBA.FACTCAB.CodMoneda = MonedaLocal then 0 else 2 end)* (case when DBA.tpocbte.tp_def = 'RT' then -1 else 1 end))) as calc_iva,"+
                    "DBA.FACTCAB.TotalExen * (case when DBA.tpocbte.tp_def = 'RT' then -1 else 1 end) as calc_excenta,"+
                    "case when DBA.tpocbte.tp_def <> 'RT' and DBA.TpoCbte.TpoMvto = 'AF' and DBA.Control.porcrrenta > 0 and DBA.factcab.retenible_renta = 'S' then ROUND(((calc_excenta*DBA.Control.porcrrenta)/100),0) else 0 end as calc_retrenta,"+
                    "((calc_gravada+DBA.FACTCAB.TotalExen+calc_iva) - calc_retrenta) *  (case when DBA.tpocbte.tp_def = 'RT' then -1 else 1 end) as calc_total "+  
                "FROM "+ 
                    "( DBA.FACTCAB LEFT OUTER JOIN DBA.PROVEED P2 ON DBA.FACTCAB.Cod_Empresa = P2.Cod_Empresa "+
                        "AND DBA.FACTCAB.CodResponsable = P2.CodProv ),"+
                    "DBA.Control,"+
                    "DBA.Proveed,"+
                    "dba.TPOCBTE,"+
                    "dba.MONEDA,"+
                    "dba.tpocbte "+ 
                "WHERE "+ 
                    "(dba.FACTCAB.Cod_Empresa = dba.TPOCBTE.Cod_Empresa) "+
                    "and (dba.MONEDA.CodMoneda = dba.FACTCAB.CodMoneda) "+
                    "and (dba.FACTCAB.Cod_Tp_Comp = dba.TPOCBTE.Cod_Tp_Comp) "+
                    "and ( DBA.FACTCAB.Cod_Empresa = DBA.Control.Cod_Empresa ) "+
                    "AND ( DBA.Control.Periodo = '"+filters.periodo+"') "+
                    "AND ( DBA.FACTCAB.Cod_Empresa = DBA.Proveed.Cod_Empresa ) "+
                    "AND ( DBA.FACTCAB.CodProv = DBA.Proveed.CodProv ) "+
                    "AND ( DBA.factcab.cod_empresa = DBA.tpocbte.cod_empresa ) "+ 
                    "AND ( DBA.factcab.cod_tp_comp = DBA.tpocbte.cod_tp_comp ) "+
                    "AND ( DBA.FACTCAB.FondoFijo = 'N' ) "+
                    "AND ( FactCab.cod_empresa = '"+filters.empresa+"') "+
                    "AND ( DATE (DBA.FACTCAB.FechaFact) >= DATE ('"+filters.compras_start+"') ) "+
                    "AND ( DATE (DBA.FACTCAB.FechaFact) <= DATE ('"+filters.compras_end+"') ) ";
                    
    if (filters.asentada == 'S'){
        string+= "AND EXISTS (select * from dba.factcab f2 where f2.cod_empresa = dba.factcab.cod_empresa and f2.codresponsable = dba.factcab.codresponsable and f2.nrorendicion = dba.factcab.nrorendicion and f2.Asentado = 'S' ) ";
    } else if (filters.asentada == 'N'){
        string+= "AND EXISTS (select * from dba.factcab f2 where f2.cod_empresa = dba.factcab.cod_empresa and f2.codresponsable = dba.factcab.codresponsable and f2.nrorendicion = dba.factcab.nrorendicion and f2.Asentado = 'N' ) ";
    }
    
    if (filters.proveedor) {
        string+= " AND (dba.FACTCAB.CodProv IN " + q.in(filters.proveedor) + ") ";
    } 
    
    if (filters.numero != null && filters.numero != "") {
        string+= " AND ( ( FactCab.NroRendicion = "+filters.numero+" ) ) ";
    } else {
        string+= " AND ( DBA.FACTCAB.NroRendicion > 0 ) ";
    }
    
    string+= " ORDER BY DBA.FACTCAB.CodResponsable";
    console.log(string);
    
    conn.exec(string, function (err, r) {
        if (err) throw err;
        cb(r);
    }) 

};

module.exports = Gastos_Rendir;