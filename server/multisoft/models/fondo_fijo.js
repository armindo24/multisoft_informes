var conn = require('../db');
var util = require('util');
var q = require('./queryUtils');
var Fondo_Fijo = {};

Fondo_Fijo.all = function (filters, cb) {

    var string = "SELECT DBA.FACTCAB.Cod_Empresa,DBA.FACTCAB.AnhoFFijo,DBA.FACTCAB.MesFFijo,"+
                 "DBA.FACTCAB.NroFFijo,DBA.FACTCAB.NroFact,DBA.FACTCAB.FechaFact,"+
                 "DBA.FACTCAB.CodProv,DBA.FACTCAB.RazonSocial,DBA.FACTCAB.IVAIncluido,"+
                 "DBA.FACTCAB.TotalGrav,DBA.FACTCAB.IVA,DBA.FACTCAB.FactCambio,"+
                 "DBA.FACTCAB.TotalExen,DBA.FACTCAB.CodMoneda,dba.MONEDA.Descrip,DBA.Control.MonedaLocal,"+
                 "DBA.FACTCAB.CodDpto,DBA.FACTCAB.TipoIVA,DBA.FACTCAB.Gravado,"+
                 "DBA.FACTCAB.Cod_tp_Comp,DBA.FACTCAB.Timbrado,DBA.Dpto.Descrip,"+
                 "DBA.TpoCbte.Tp_Def,DBA.TpoCbte.TpoMvto,DBA.Control.porcrrenta,"+
                 "DBA.FACTCAB.retenible_renta FROM DBA.FACTCAB,DBA.Proveed,DBA.Control,DBA.Dpto,DBA.TpoCbte,dba.MONEDA "+
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
                 "AND ( DBA.Control.Periodo = '2015') AND ( FactCab.cod_empresa = '11') ";

};

module.exports = Fondo_Fijo;

