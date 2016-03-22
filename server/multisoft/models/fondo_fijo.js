var conn = require('../db');
var util = require('util');
var q = require('./queryUtils');
var Fondo_Fijo = {};

Fondo_Fijo.all = function (filters, cb) {

    var string = "SELECT DBA.FACTCAB.Cod_Empresa,DBA.FACTCAB.AnhoFFijo,DBA.FACTCAB.MesFFijo,"+
                 "DBA.FACTCAB.NroFFijo,DBA.FACTCAB.NroFact,date(DBA.FACTCAB.FechaFact) as FechaFact,"+
                 "DBA.FACTCAB.CodProv,DBA.FACTCAB.RazonSocial,DBA.FACTCAB.IVAIncluido,"+
                 "DBA.FACTCAB.TotalGrav,DBA.FACTCAB.IVA,DBA.FACTCAB.FactCambio,"+
                 "DBA.FACTCAB.TotalExen,DBA.FACTCAB.CodMoneda,dba.MONEDA.Descrip as des_moneda,DBA.Control.MonedaLocal,"+
                 "DBA.FACTCAB.CodDpto,DBA.FACTCAB.TipoIVA,DBA.FACTCAB.Gravado,"+
                 "DBA.FACTCAB.Cod_tp_Comp,DBA.FACTCAB.Timbrado,DBA.Dpto.Descrip,"+
                 "DBA.TpoCbte.Tp_Def,DBA.TpoCbte.TpoMvto,DBA.Control.porcrrenta,"+
                 "DBA.FACTCAB.retenible_renta,"+
                 "round((case when DBA.FACTCAB.IVAIncluido = 'S' then DBA.FACTCAB.TotalGrav-DBA.FACTCAB.IVA else DBA.FACTCAB.TotalGrav end),"+
                 "((case when DBA.FACTCAB.CodMoneda = DBA.Control.MonedaLocal then 0 else 4 end) * (case when DBA.TpoCbte.Tp_Def = 'RT' then -1 else 1 end) "+
                 "))as totalgravado,DBA.FACTCAB.TotalExen * (case when DBA.TpoCbte.Tp_Def = 'RT' then -1 else 1 end) as totalexen1," +
                 "round (DBA.FACTCAB.IVA , (case when DBA.FACTCAB.CodMoneda = DBA.Control.MonedaLocal then 0 else 2 end) * (case when DBA.TpoCbte.Tp_Def = 'RT' then -1 else 1 end)) as totaliva," +
                 "(totalgravado + DBA.FACTCAB.TotalExen + totaliva ) *  (case when DBA.TpoCbte.Tp_Def = 'RT' then -1 else 1 end) as total,"+
                 "case when DBA.FACTCAB.retenible_renta = 'S' and DBA.TpoCbte.Tp_Def <> 'RT' and DBA.TpoCbte.TpoMvto = 'AF' "+
                 "and DBA.Control.porcrrenta > 0 then round((total*DBA.Control.porcrrenta)/100, 0) else 0 end as ret_renta," +
                 "total - ret_renta as neto " + 
                 "FROM DBA.FACTCAB,DBA.Proveed,DBA.Control,DBA.Dpto,DBA.TpoCbte,dba.MONEDA "+
                 "WHERE ( DBA.FACTCAB.Cod_Empresa = DBA.Proveed.Cod_Empresa ) "+
                 "and dba.FACTCAB.CodMoneda = dba.MONEDA.CodMoneda "+
                 "AND ( DBA.FACTCAB.CodProv = DBA.Proveed.CodProv ) "+
                 "AND ( DBA.factcab.cod_empresa = dba.tpocbte.cod_empresa ) "+
                 "and ( DBA.factcab.cod_tp_comp   = DBA.tpocbte.cod_tp_comp ) "+
                 "and ( DBA.FACTCAB.Cod_Empresa = DBA.Dpto.Cod_Empresa ) "+
                 "AND ( DBA.FACTCAB.Cod_Sucursal= DBA.Dpto.Cod_Sucursal) "+
                 "AND ( DBA.FACTCAB.CodDpto = DBA.Dpto.CodDpto) "+
                 "AND ( DBA.FACTCAB.FondoFijo = 'S' ) "+
                 "AND ( DBA.FACTCAB.Anulado = 'N' ) "+
                 "AND ( DBA.FactCAB.Cod_Empresa = DBA.Control.Cod_Empresa ) "+
                 "AND ( DBA.Control.Periodo = '2015') AND ( FactCab.cod_empresa = '11') "+
                 "order by des_moneda,AnhoFFijo,MesFFijo,NroFFijo";

    conn.exec(string, function (err, r) {
        if (err) throw err;
        cb(r);
    }) 

};

module.exports = Fondo_Fijo;

