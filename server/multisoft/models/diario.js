var conn = require('../db_integrado');        

var Diario = {};

Diario.all = function (params,cb) {

    var string =  "SELECT dba.asientosdet.Cod_Empresa as EMPRESA,dba.asientosdet.NroTransac,dba.asientoscab.TipoAsiento,dba.asientoscab.NroCompr,dba.asientosdet.NroOrden as Linea,dba.asientosdet.CodPlanCta,"+
                    "dba.asientosdet.CodPlanAux,dba.asientosdet.Concepto,dba.asientosdet.DbCr,dba.asientosdet.Importe,dba.asientosdet.ImporteME,date(dba.asientoscab.Fecha) as Fecha,cast(dba.asientosdet.DEBITO as decimal(20,0)) as DEBITO,"+
                    "cast(dba.asientosdet.CREDITO as decimal(20,0)) as CREDITO,cast(dba.asientosdet.DEBITOME as decimal(20,2)) as DEBITO_ME,cast(dba.asientosdet.CREDITOME as decimal(20,2)) as CREDITO_ME,DBA.PLANCTA.Nombre as NOMBRECUENTA,DBA.PLANAUXI.Nombre as NOMBRECUENTAAUX,"+
                    "dba.tipoasiento.Descrip as TIPOASIENTO,DBA.asientoscab.autorizado,DBA.asientoscab.cargadopor,DBA.asientoscab.fechacarga,DBA.asientoscab.autorizadopor,DBA.asientoscab.fechaautoriz,"+
                    "DBA.asientoscab.nroasiento,upper(dba.asientosdet.Concepto) as BUSCAR_CONCEPTO "+
                  "FROM (dba.asientosdet LEFT OUTER JOIN DBA.PLANAUXI ON dba.asientosdet.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa "+ 
                  "AND dba.asientosdet.Periodo = DBA.PLANAUXI.Periodo AND dba.asientosdet.CodPlanCta = DBA.PLANAUXI.CodPlanCta "+ 
                  "AND dba.asientosdet.CodPlanAux = DBA.PLANAUXI.CodPlanAux),DBA.PLANCTA,dba.asientoscab,dba.tipoasiento "+ 
                  "WHERE (dba.asientosdet.Periodo = DBA.PLANCTA.Periodo) AND DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa "+ 
                  "AND DBA.PLANCTA.Periodo = DBA.ASIENTOSCAB.Periodo AND DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta "+ 
                  "AND DBA.ASIENTOSDET.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa AND DBA.ASIENTOSCAB.NroTransac = DBA.ASIENTOSDET.NroTransac "+
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