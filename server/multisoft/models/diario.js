var conn = require('../db');

var Diario = {};

Diario.all = function (params,cb) {

    var string =  "SELECT dba.asientosdet.Cod_Empresa as EMPRESA,dba.asientosdet.NroTransac,dba.asientoscab.TipoAsiento,dba.asientoscab.NroCompr,dba.asientosdet.NroOrden as Linea,dba.asientosdet.CodPlanCta,"+
        "dba.asientosdet.CodPlanAux,dba.asientosdet.Concepto,dba.asientosdet.DbCr,dba.asientosdet.Importe,dba.asientosdet.ImporteME,date(dba.asientoscab.Fecha) as Fecha,cast(dba.asientosdet.DEBITO as decimal(20,0)) as DEBITO,"+
        "cast(dba.asientosdet.CREDITO as decimal(20,0)) as CREDITO,cast(dba.asientosdet.DEBITOME as decimal(20,2)) as DEBITO_ME,cast(dba.asientosdet.CREDITOME as decimal(20,2)) as CREDITO_ME,DBA.PLANCTA.Nombre as NOMBRECUENTA,DBA.PLANAUXI.Nombre as NOMBRECUENTAAUX,"+
        "dba.tipoasiento.Descrip as TIPOASIENTO,DBA.asientoscab.autorizado,DBA.asientoscab.cargadopor,DBA.asientoscab.fechacarga,DBA.asientoscab.autorizadopor,DBA.asientoscab.fechaautoriz,"+
        "DBA.asientoscab.nroasiento,upper(dba.asientosdet.Concepto) as BUSCAR_CONCEPTO "+
        "FROM DBA.PLANCTA,dba.PLANAUXI,dba.asientoscab,dba.asientosdet,dba.tipoasiento WHERE DBA.PLANCTA.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa "+
        "AND DBA.PLANCTA.Periodo = DBA.PLANAUXI.Periodo AND DBA.PLANCTA.CodPlanCta = DBA.PLANAUXI.CodPlanCta AND DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa "+
        "AND DBA.PLANCTA.Periodo = DBA.ASIENTOSCAB.Periodo AND DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta AND DBA.ASIENTOSDET.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa "+
        "and dba.PLANAUXI.CodPlanAux = dba.ASIENTOSDET.CodPlanAux and dba.PLANAUXI.CodPlanCta = dba.ASIENTOSDET.CodPlanCta AND DBA.ASIENTOSCAB.NroTransac = DBA.ASIENTOSDET.NroTransac "+
        "AND dba.ASIENTOSCAB.TipoAsiento = dba.TIPOASIENTO.TipoAsiento " +
        "AND ( dba.AsientosCAB.cod_empresa = '"+params.empresa+"' ) "
        if (params.tipoasiento != 'NINGUNO')
            string+="AND ( dba.asientoscab.TipoAsiento = '"+params.tipoasiento+"') "
        string+="AND (DBA.asientoscab.fecha BETWEEN '"+params.fechad+"' and '"+params.fechah+"') "
        if(params.autorizado == 'SI')
            string+="AND (DBA.asientoscab.autorizado = 'S') "
        if(params.autorizado == 'NO')
            string+="AND (DBA.asientoscab.autorizado = 'N') "
        string+= "ORDER BY DBA.AsientosCAB.Cod_Empresa ASC,DBA.AsientosCAB.Fecha ASC,DBA.AsientosDet.NroTransac ASC,DBA.AsientosDet.Linea ASC"
    console.log(string)
    conn.exec(string, function(err, row){
        if (err) throw err;
        cb(row);
    });
}
module.exports = Diario;