var conn = require('../db');

var Mayor = {};

Mayor.cuentas = function (params,cb) {

    if (incluir == "NO"){
        var string = "select dba.Asientosdet.Codplancta,plancta_a.Nombre as NOMBREPLANCTA,plancta_a.Codplanctapad,"+
        "dba.f_get_CuentaName (plancta_a.cod_empresa, plancta_a.periodo, plancta_a.codplanctapad ) as NOMBREPLANCTAPAD "+
        "from dba.Asientoscab,dba.Asientosdet,dba.TipoAsiento,(select * from DBA.PLANCTA where Imputable = 'S' union select * from dba.PLANCTA where Auxiliar = 'S') as plancta_a "+
        "where dba.Asientoscab.Cod_empresa = dba.Asientosdet.Cod_empresa and dba.Asientoscab.Nrotransac = dba.Asientosdet.Nrotransac "+
        "and dba.ASIENTOSCAB.Periodo = dba.ASIENTOSDET.Periodo and dba.Asientosdet.Cod_empresa = plancta_a.Cod_empresa "+
        "and dba.Asientosdet.Periodo = plancta_a.Periodo and dba.Asientosdet.Codplancta = plancta_a.Codplancta "+
        "and dba.AsientosCab.TipoAsiento = dba.TipoAsiento.TipoAsiento and dba.TipoAsiento.TpDef not in( 'N') "+
        "AND dba.ASIENTOSCAB.Cod_Empresa = '"+empresa+"' and dba.ASIENTOSCAB.Periodo = '"+periodo+"' AND dba.ASIENTOSCAB.Fecha BETWEEN '"+fechad+"' and '"+fechah+"' "+
        "AND plancta_a.CodPlanCta >= '"+cuentad+"' and plancta_a.CodPlanCta <= '"+cuentah+"' "
        if (tipoasiento != 'NINGUNO')
            string+="AND dba.TipoAsiento.TipoAsiento = '"+tipoasiento+"' "
        string+="group by dba.Asientosdet.Codplancta,NOMBREPLANCTA,plancta_a.Codplanctapad,NOMBREPLANCTAPAD order by dba.Asientosdet.Codplancta"
        conn.exec(string, function(err, row){
            data1 = row
            var string1 = "select plancta_a.Codplanctapad,dba.f_get_CuentaName (plancta_a.cod_empresa, plancta_a.periodo, plancta_a.codplanctapad ) as NOMBREPLANCTAPAD "+
            "from dba.Asientoscab,dba.Asientosdet,dba.TipoAsiento,(select * from DBA.PLANCTA where Imputable = 'S' union select * from dba.PLANCTA where Auxiliar = 'S') as plancta_a "+
            "where dba.Asientoscab.Cod_empresa = dba.Asientosdet.Cod_empresa and dba.Asientoscab.Nrotransac = dba.Asientosdet.Nrotransac "+
            "and dba.ASIENTOSCAB.Periodo = dba.ASIENTOSDET.Periodo and dba.Asientosdet.Cod_empresa = plancta_a.Cod_empresa "+
            "and dba.Asientosdet.Periodo = plancta_a.Periodo and dba.Asientosdet.Codplancta = plancta_a.Codplancta "+
            "and dba.AsientosCab.TipoAsiento = dba.TipoAsiento.TipoAsiento and dba.TipoAsiento.TpDef not in( 'N') "+
            "AND dba.ASIENTOSCAB.Cod_Empresa = '"+empresa+"' and dba.ASIENTOSCAB.Periodo = '"+periodo+"' "+
            "AND dba.ASIENTOSCAB.Fecha BETWEEN '"+fechad+"' and '"+fechah+"' AND plancta_a.CodPlanCta >= '"+cuentad+"' "+
            "and plancta_a.CodPlanCta <= '"+cuentah+"' "
            if (tipoasiento != 'NINGUNO')
                string1+="AND dba.TipoAsiento.TipoAsiento = '"+tipoasiento+"' "
            string1+="group by NOMBREPLANCTAPAD,plancta_a.Codplanctapad order by plancta_a.Codplanctapad"
                conn.exec(string1, function(err, row){
                    data2 = row
                    if (err) throw err;
                    cb([{ data1 : data1 },{ data2 : data2 }]);
            });
        });
    } else {
        var string = "select dba.Asientosdet.Codplancta,plancta_a.Nombre as NOMBREPLANCTA,plancta_a.Codplanctapad,dba.f_get_CuentaName (plancta_a.cod_empresa, plancta_a.periodo, plancta_a.codplanctapad ) as NOMBREPLANCTAPAD "+
        "from dba.Asientoscab,dba.Asientosdet,dba.TipoAsiento,(select * from DBA.PLANCTA where Imputable = 'S' union select * from dba.PLANCTA where Auxiliar = 'S') as plancta_a "+
        "where dba.Asientoscab.Cod_empresa = dba.Asientosdet.Cod_empresa and dba.Asientoscab.Nrotransac = dba.Asientosdet.Nrotransac "+
        "and dba.ASIENTOSCAB.Periodo = dba.ASIENTOSDET.Periodo and dba.Asientosdet.Cod_empresa = plancta_a.Cod_empresa "+
        "and dba.Asientosdet.Periodo = plancta_a.Periodo and dba.Asientosdet.Codplancta = plancta_a.Codplancta "+
        "and dba.AsientosCab.TipoAsiento = dba.TipoAsiento.TipoAsiento and dba.TipoAsiento.TpDef not in( 'N') "+
        "AND dba.ASIENTOSCAB.Cod_Empresa = '"+empresa+"' and dba.ASIENTOSCAB.Periodo = '"+periodo+"' "+
        "AND dba.ASIENTOSCAB.Fecha BETWEEN '"+fechad+"' and '"+fechah+"' AND plancta_a.CodPlanCta >= '"+cuentad+"' " +
        "and plancta_a.CodPlanCta <= '"+cuentah+"' "
        if (tipoasiento != 'NINGUNO')
            string+="AND dba.TipoAsiento.TipoAsiento = '"+tipoasiento+"' "
        string+="UNION select plancta_a.CodPlanCta,plancta_a.Nombre as NOMBREPLANCTA,plancta_a.Codplanctapad,"+
        "dba.f_get_CuentaName (plancta_a.cod_empresa, plancta_a.periodo, plancta_a.codplanctapad ) as NOMBREPLANCTAPAD "+
        "from (select * from DBA.PLANCTA where Imputable = 'S' union select * from dba.PLANCTA where Auxiliar = 'S') as plancta_a "+
        "WHERE plancta_a.Cod_Empresa = '"+empresa+"' and plancta_A.Periodo = '"+periodo+"' "+
        "AND plancta_a.CodPlanCta >= '"+cuentad+"' and plancta_a.CodPlanCta <= '"+cuentah+"' order by Codplancta"
        conn.exec(string, function(err, row){
            data1 = row
            var string1 = "select plancta_a.Codplanctapad,dba.f_get_CuentaName (plancta_a.cod_empresa, plancta_a.periodo, plancta_a.codplanctapad ) as NOMBREPLANCTAPAD "+
            "from dba.Asientoscab,dba.Asientosdet,dba.TipoAsiento,(select * from DBA.PLANCTA where Imputable = 'S' union select * from dba.PLANCTA where Auxiliar = 'S') as plancta_a "+
            "where dba.Asientoscab.Cod_empresa = dba.Asientosdet.Cod_empresa and dba.Asientoscab.Nrotransac = dba.Asientosdet.Nrotransac "+
            "and dba.ASIENTOSCAB.Periodo = dba.ASIENTOSDET.Periodo and dba.Asientosdet.Cod_empresa = plancta_a.Cod_empresa "+
            "and dba.Asientosdet.Periodo = plancta_a.Periodo and dba.Asientosdet.Codplancta = plancta_a.Codplancta "+
            "and dba.AsientosCab.TipoAsiento = dba.TipoAsiento.TipoAsiento and dba.TipoAsiento.TpDef not in( 'N') "+
            "AND dba.ASIENTOSCAB.Cod_Empresa = '"+empresa+"' and dba.ASIENTOSCAB.Periodo = '"+periodo+"' "+
            "AND dba.ASIENTOSCAB.Fecha BETWEEN '"+fechad+"' and '"+fechah+"' AND plancta_a.CodPlanCta >= '"+cuentad+"' "+
            "and plancta_a.CodPlanCta <= '"+cuentah+"' "
            if (tipoasiento != 'NINGUNO')
                string1+="AND dba.TipoAsiento.TipoAsiento = '"+tipoasiento+"' "
            string1+="group by NOMBREPLANCTAPAD,plancta_a.Codplanctapad "
            string1+="UNION select plancta_a.Codplanctapad,dba.f_get_CuentaName (plancta_a.cod_empresa, plancta_a.periodo, plancta_a.codplanctapad ) as NOMBREPLANCTAPAD "+
            "from (select * from DBA.PLANCTA where Imputable = 'S' union select * from dba.PLANCTA where Auxiliar = 'S') as plancta_a "+
            "WHERE plancta_a.Cod_Empresa = '"+empresa+"' and plancta_A.Periodo = '"+periodo+"' "+
            "AND plancta_a.CodPlanCta >= '"+cuentad+"' and plancta_a.CodPlanCta <= '"+cuentah+"' "+
            "group by NOMBREPLANCTAPAD,plancta_a.Codplanctapad order by Codplanctapad"
            conn.exec(string1, function(err, row){
                data2 = row
                cb([{ data1 : data1 },{ data2 : data2 }]);
            });
        }
    }
}
module.exports = Mayor;
