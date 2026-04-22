var conn = require('../db_integrado');        

var Diario = {};

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

Diario.all = function (params,cb) {
    var periodo = String(params.fechad || '').slice(0, 4);
    var fechad = params.fechad + " 00:00:00";
    var fechah = params.fechah + " 00:00:00";
    var string =
        "SELECT ad.Cod_Empresa as EMPRESA, ad.NroTransac, ac.TipoAsiento, ac.NroCompr, " +
        "ad.NroOrden as Linea, ad.CodPlanCta, ad.CodPlanAux, ad.Concepto, " +
        "date(ac.Fecha) as Fecha, cast(ad.DEBITO as decimal(20,0)) as DEBITO, " +
        "cast(ad.CREDITO as decimal(20,0)) as CREDITO, cast(ad.DEBITOME as decimal(20,2)) as DEBITO_ME, " +
        "cast(ad.CREDITOME as decimal(20,2)) as CREDITO_ME, pc.Nombre as NOMBRECUENTA, " +
        "pa.Nombre as NOMBRECUENTAAUX, ta.Descrip as TIPOASIENTO " +
        "FROM dba.AsientosCab ac " +
        "JOIN dba.AsientosDet ad ON ad.Cod_Empresa = ac.Cod_Empresa AND ad.NroTransac = ac.NroTransac " +
        "JOIN dba.PlanCta pc ON pc.Cod_Empresa = ad.Cod_Empresa AND pc.Periodo = ad.Periodo AND pc.CodPlanCta = ad.CodPlanCta " +
        "JOIN dba.TipoAsiento ta ON ta.TipoAsiento = ac.TipoAsiento " +
        "LEFT OUTER JOIN dba.PlanAuxi pa ON pa.Cod_Empresa = ad.Cod_Empresa AND pa.Periodo = ad.Periodo " +
        "AND pa.CodPlanCta = ad.CodPlanCta AND pa.CodPlanAux = ad.CodPlanAux " +
        "WHERE ac.Cod_Empresa = '" + params.empresa + "' ";

    if (periodo) {
        string += "AND ad.Periodo = '" + periodo + "' ";
        string += "AND ac.Periodo = '" + periodo + "' ";
    }
    if (params.tipoasiento != 'NINGUNO') {
        string += "AND ac.TipoAsiento = '" + params.tipoasiento + "' ";
    }
    if (dbIsPostgres()) {
        string += "AND ac.Fecha >= '" + fechad + "' AND ac.Fecha < ('" + fechah + "'::timestamp + interval '1 day') ";
    } else {
        string += "AND ac.Fecha >= '" + fechad + "' AND ac.Fecha < dateadd(dd,1,'" + fechah + "') ";
    }
    if(params.autorizado == 'SI')
        string += "AND ac.autorizado = 'S' ";
    if(params.autorizado == 'NO')
        string += "AND ac.autorizado = 'N' ";
    string += "ORDER BY ac.Fecha ASC, ad.NroTransac ASC, ad.NroOrden ASC";

    console.log(string);
    conn.exec(string, function(err, row){
        if (err) {
            console.error('[Diario.all] Error ejecutando consulta:', err.message || err);
            return cb([]);
        }
        cb(row);
    });
}
module.exports = Diario;
