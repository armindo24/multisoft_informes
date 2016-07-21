var conn = require('../db_integrado');

var Mayor = {};

Mayor.cuentas = function (params,cb) {

    console.log(typeof(params.tipoasiento));

    if (params.incluir == "NO"){
        var string = "select dba.Asientosdet.Codplancta,plancta_a.Nombre as NOMBREPLANCTA,plancta_a.Codplanctapad,"+
        "dba.f_get_CuentaName (plancta_a.cod_empresa, plancta_a.periodo, plancta_a.codplanctapad ) as NOMBREPLANCTAPAD "+
        "from dba.Asientoscab,dba.Asientosdet,dba.TipoAsiento,(select * from DBA.PLANCTA where Imputable = 'S' union select * from dba.PLANCTA where Auxiliar = 'S') as plancta_a "+
        "where dba.Asientoscab.Cod_empresa = dba.Asientosdet.Cod_empresa and dba.Asientoscab.Nrotransac = dba.Asientosdet.Nrotransac "+
        "and dba.ASIENTOSCAB.Periodo = dba.ASIENTOSDET.Periodo and dba.Asientosdet.Cod_empresa = plancta_a.Cod_empresa "+
        "and dba.Asientosdet.Periodo = plancta_a.Periodo and dba.Asientosdet.Codplancta = plancta_a.Codplancta "+
        "and dba.AsientosCab.TipoAsiento = dba.TipoAsiento.TipoAsiento and dba.TipoAsiento.TpDef not in( 'N') "+
        "AND dba.ASIENTOSCAB.Cod_Empresa = '"+params.empresa+"' and dba.ASIENTOSCAB.Periodo = '"+params.periodo+"' AND dba.ASIENTOSCAB.Fecha BETWEEN '"+params.fechad+"' and '"+params.fechah+"' "+
        "AND plancta_a.CodPlanCta >= '"+params.cuentad+"' and plancta_a.CodPlanCta <= '"+params.cuentah+"' "
        if (params.tipoasiento != 'undefined')
            string+="AND dba.TipoAsiento.TipoAsiento = '"+params.tipoasiento+"' "
        string+="group by dba.Asientosdet.Codplancta,NOMBREPLANCTA,plancta_a.Codplanctapad,NOMBREPLANCTAPAD order by dba.Asientosdet.Codplancta"
        conn.exec(string, function(err, row){
            data1 = row
            var string1 = "select plancta_a.Codplanctapad,dba.f_get_CuentaName (plancta_a.cod_empresa, plancta_a.periodo, plancta_a.codplanctapad ) as NOMBREPLANCTAPAD "+
            "from dba.Asientoscab,dba.Asientosdet,dba.TipoAsiento,(select * from DBA.PLANCTA where Imputable = 'S' union select * from dba.PLANCTA where Auxiliar = 'S') as plancta_a "+
            "where dba.Asientoscab.Cod_empresa = dba.Asientosdet.Cod_empresa and dba.Asientoscab.Nrotransac = dba.Asientosdet.Nrotransac "+
            "and dba.ASIENTOSCAB.Periodo = dba.ASIENTOSDET.Periodo and dba.Asientosdet.Cod_empresa = plancta_a.Cod_empresa "+
            "and dba.Asientosdet.Periodo = plancta_a.Periodo and dba.Asientosdet.Codplancta = plancta_a.Codplancta "+
            "and dba.AsientosCab.TipoAsiento = dba.TipoAsiento.TipoAsiento and dba.TipoAsiento.TpDef not in( 'N') "+
            "AND dba.ASIENTOSCAB.Cod_Empresa = '"+params.empresa+"' and dba.ASIENTOSCAB.Periodo = '"+params.periodo+"' "+
            "AND dba.ASIENTOSCAB.Fecha BETWEEN '"+params.fechad+"' and '"+params.fechah+"' AND plancta_a.CodPlanCta >= '"+params.cuentad+"' "+
            "and plancta_a.CodPlanCta <= '"+params.cuentah+"' "
            if (params.tipoasiento != 'undefined')
                string1+="AND dba.TipoAsiento.TipoAsiento = '"+params.tipoasiento+"' "
            string1+="group by NOMBREPLANCTAPAD,plancta_a.Codplanctapad order by plancta_a.Codplanctapad"
            conn.exec(string1, function(err, row){
                data2 = row;
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
        "AND dba.ASIENTOSCAB.Cod_Empresa = '"+params.empresa+"' and dba.ASIENTOSCAB.Periodo = '"+params.periodo+"' "+
        "AND dba.ASIENTOSCAB.Fecha BETWEEN '"+params.fechad+"' and '"+params.fechah+"' AND plancta_a.CodPlanCta >= '"+params.cuentad+"' " +
        "and plancta_a.CodPlanCta <= '"+params.cuentah+"' "
        if (params.tipoasiento != 'undefined')
            string+="AND dba.TipoAsiento.TipoAsiento = '"+params.tipoasiento+"' "
        string+="UNION select plancta_a.CodPlanCta,plancta_a.Nombre as NOMBREPLANCTA,plancta_a.Codplanctapad,"+
        "dba.f_get_CuentaName (plancta_a.cod_empresa, plancta_a.periodo, plancta_a.codplanctapad ) as NOMBREPLANCTAPAD "+
        "from (select * from DBA.PLANCTA where Imputable = 'S' union select * from dba.PLANCTA where Auxiliar = 'S') as plancta_a "+
        "WHERE plancta_a.Cod_Empresa = '"+params.empresa+"' and plancta_A.Periodo = '"+params.periodo+"' "+
        "AND plancta_a.CodPlanCta >= '"+params.cuentad+"' and plancta_a.CodPlanCta <= '"+params.cuentah+"' order by Codplancta"
        conn.exec(string, function(err, row){
            data1 = row
            var string1 = "select plancta_a.Codplanctapad,dba.f_get_CuentaName (plancta_a.cod_empresa, plancta_a.periodo, plancta_a.codplanctapad ) as NOMBREPLANCTAPAD "+
            "from dba.Asientoscab,dba.Asientosdet,dba.TipoAsiento,(select * from DBA.PLANCTA where Imputable = 'S' union select * from dba.PLANCTA where Auxiliar = 'S') as plancta_a "+
            "where dba.Asientoscab.Cod_empresa = dba.Asientosdet.Cod_empresa and dba.Asientoscab.Nrotransac = dba.Asientosdet.Nrotransac "+
            "and dba.ASIENTOSCAB.Periodo = dba.ASIENTOSDET.Periodo and dba.Asientosdet.Cod_empresa = plancta_a.Cod_empresa "+
            "and dba.Asientosdet.Periodo = plancta_a.Periodo and dba.Asientosdet.Codplancta = plancta_a.Codplancta "+
            "and dba.AsientosCab.TipoAsiento = dba.TipoAsiento.TipoAsiento and dba.TipoAsiento.TpDef not in( 'N') "+
            "AND dba.ASIENTOSCAB.Cod_Empresa = '"+params.empresa+"' and dba.ASIENTOSCAB.Periodo = '"+params.periodo+"' "+
            "AND dba.ASIENTOSCAB.Fecha BETWEEN '"+params.fechad+"' and '"+params.fechah+"' AND plancta_a.CodPlanCta >= '"+params.cuentad+"' "+
            "and plancta_a.CodPlanCta <= '"+params.cuentah+"' "
            if (params.tipoasiento != 'undefined')
                string1+="AND dba.TipoAsiento.TipoAsiento = '"+params.tipoasiento+"' "
            string1+="group by NOMBREPLANCTAPAD,plancta_a.Codplanctapad "
            string1+="UNION select plancta_a.Codplanctapad,dba.f_get_CuentaName (plancta_a.cod_empresa, plancta_a.periodo, plancta_a.codplanctapad ) as NOMBREPLANCTAPAD "+
            "from (select * from DBA.PLANCTA where Imputable = 'S' union select * from dba.PLANCTA where Auxiliar = 'S') as plancta_a "+
            "WHERE plancta_a.Cod_Empresa = '"+params.empresa+"' and plancta_A.Periodo = '"+params.periodo+"' "+
            "AND plancta_a.CodPlanCta >= '"+params.cuentad+"' and plancta_a.CodPlanCta <= '"+params.cuentah+"' "+
            "group by NOMBREPLANCTAPAD,plancta_a.Codplanctapad order by Codplanctapad"
            conn.exec(string1, function(err, row){
                data2 = row;
                cb([{ data1 : data1 },{ data2 : data2 }]);
            });
        });
    }
};

Mayor.cuentasdetalle = function (params,cb) {

    var string1 = "select dba.Asientoscab.Cod_empresa,dba.Asientoscab.Nrocompr,dba.Asientoscab.Nrotransac,"+
    "dba.Asientoscab.NroAsiento,dba.Asientoscab.Periodo, dba.Asientoscab.Autorizado,"+
    "dba.Asientosdet.Codplancta,plancta_a.Nombre as NOMBREPLANCTA,plancta_a.Codplanctapad,"+
    "plancta_a.tiposaldo,dba.f_get_CuentaName (plancta_a.cod_empresa, plancta_a.periodo, plancta_a.codplanctapad ) as NOMBREPLANCTAPAD,"+
    "date(dba.Asientoscab.Fecha) as Fecha,YEAR(dba.Asientoscab.Fecha) as ANHO,MONTH(dba.Asientoscab.Fecha) as MES,"+
    "dba.Asientoscab.Codmoneda,dba.Asientoscab.Tipoasiento,dba.TipoAsiento.Abreviatura,"+
    "dba.Asientosdet.Linea,dba.Asientosdet.Concepto,dba.Asientosdet.Dbcr,"+
    "dba.Asientoscab.Origen,dba.Asientosdet.Importe,"+
    "cast(dba.Asientosdet.Credito as decimal(20,0)) as Credito,cast(dba.Asientosdet.Debito as decimal(20,0)) as Debito,"+
    "cast(dba.Asientosdet.CreditoME as decimal(20,2)) as CreditoME,cast(dba.Asientosdet.DebitoME as decimal(20,2)) as DebitoME,"+
    "dba.Asientosdet.CodPlanAux "+
    "from dba.Asientoscab,dba.Asientosdet,dba.TipoAsiento,(select * from DBA.PLANCTA where Imputable = 'S' union select * from dba.PLANCTA where Auxiliar = 'S') as plancta_a "+
    "where dba.Asientoscab.Cod_empresa = dba.Asientosdet.Cod_empresa and dba.Asientoscab.Nrotransac = dba.Asientosdet.Nrotransac "+
    "and dba.Asientoscab.Periodo = dba.Asientosdet.Periodo and dba.Asientosdet.Cod_empresa = plancta_a.Cod_empresa "+
    "and dba.Asientosdet.Periodo = plancta_a.Periodo and dba.Asientosdet.Codplancta = plancta_a.Codplancta "+
    "and dba.AsientosCab.TipoAsiento = dba.TipoAsiento.TipoAsiento "+
    "and dba.TipoAsiento.TpDef not in( 'N') and dba.Asientoscab.Cod_empresa = '"+params.empresa+"' "+
    "and dba.Asientoscab.Periodo = '"+params.periodo+"' and dba.Asientoscab.Fecha BETWEEN '"+params.fechad+"' and '"+params.fechah+"' "+
    "and dba.Asientosdet.Codplancta = '"+params.cuenta+"' "
    if (params.tipoasiento != 'undefined')
        string1+="AND dba.TipoAsiento.TipoAsiento = '"+params.tipoasiento+"' "
    string1+="order by dba.Asientosdet.Codplancta,Fecha"
    console.log(string1)
    conn.exec(string1, function(err, row){
        data1 = row
        var string2 = "select dba.Asientosdet.CodPlanCta,plancta_a.TipoSaldo,cast(sum(dba.Asientosdet.Credito) as decimal(20,0)) as Credito,"+
        "cast(sum(dba.Asientosdet.Debito) as decimal(20,0)) as Debito,cast(sum(dba.Asientosdet.CreditoME) as decimal(20,2)) as CreditoME,"+
        "cast(sum(dba.Asientosdet.DebitoME) as decimal(20,2)) as DebitoME from "+
        "dba.Asientoscab,dba.Asientosdet,dba.TipoAsiento,(select * from DBA.PLANCTA where Imputable = 'S' union select * from dba.PLANCTA where Auxiliar = 'S') as plancta_a "+
        "where dba.Asientoscab.Cod_empresa = dba.Asientosdet.Cod_empresa and dba.Asientoscab.Nrotransac = dba.Asientosdet.Nrotransac "+
        "and dba.Asientoscab.Periodo = dba.Asientosdet.Periodo and dba.Asientosdet.Cod_empresa = plancta_a.Cod_empresa "+
        "and dba.Asientosdet.Periodo = plancta_a.Periodo and dba.Asientosdet.Codplancta = plancta_a.Codplancta "+
        "and dba.AsientosCab.TipoAsiento = dba.TipoAsiento.TipoAsiento and dba.TipoAsiento.TpDef not in( 'N') "+
        "and dba.Asientoscab.Cod_empresa = '"+params.empresa+"' and dba.Asientoscab.Periodo = '"+params.periodo+"' "+
        "and dba.Asientoscab.Fecha BETWEEN '"+params.periodo+"-01-01' and dateadd(dd,-1,'"+params.fechad+"') and dba.Asientosdet.Codplancta = '"+params.cuenta+"' "
        if (params.tipoasiento != 'undefined')
            string2+="AND dba.TipoAsiento.TipoAsiento = '"+params.tipoasiento+"' "
        string2+="group by dba.Asientosdet.CodPlanCta,plancta_a.TipoSaldo "
        conn.exec(string2, function(err, row){
            data2 = row;
            cb([{ dato1 : data1 },{ dato2 : data2 }]);
        });
    });
};


Mayor.cuentasaux = function (params,cb) {
    if (params.incluir == "NO"){
        var string ="SELECT DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre as Cuenta,DBA.PLANAUXI.CodPlanAux,DBA.PLANAUXI.Nombre as Auxiliar "+
                    "FROM DBA.PLANAUXI,DBA.PLANCTA,DBA.ASIENTOSCAB,DBA.ASIENTOSDET,DBA.TIPOASIENTO WHERE "+
                    "DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANAUXI.CodPlanAux = DBA.ASIENTOSDET.CodPlanAux "+
                    "and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta and DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSCAB.Periodo "+
                    "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta "+
                    "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSCAB.Periodo and DBA.PLANCTA.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa "+
                    "and DBA.PLANCTA.Periodo = DBA.PLANAUXI.Periodo and DBA.PLANCTA.CodPlanCta = DBA.PLANAUXI.CodPlanCta and DBA.ASIENTOSCAB.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa "+
                    "and DBA.ASIENTOSCAB.Periodo = DBA.ASIENTOSDET.Periodo and DBA.ASIENTOSCAB.NroTransac = DBA.ASIENTOSDET.NroTransac "+
                    "and DBA.ASIENTOSCAB.TipoAsiento = DBA.TIPOASIENTO.TipoAsiento and DBA.TIPOASIENTO.TpDef not in( 'N') "+
                    "and DBA.PLANAUXI.PERIODO = '"+params.periodo+"' and DBA.PLANAUXI.Imputable = 'S' and DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"' "+
                    "and DBA.PLANAUXI.CodPlanCta >= '"+params.cuentad+"' and DBA.PLANAUXI.CodPlanCta <= '"+params.cuentah+"' ";
                    if (params.cuentaad != 'NINGUNA' && params.cuentaah != 'NINGUNA')
                        string+="and DBA.PLANAUXI.CodPlanAux >= '"+params.cuentaad+"' and DBA.PLANAUXI.CodPlanAux <= '"+params.cuentaah+"' "; 
                    string+="and DBA.ASIENTOSCAB.Fecha BETWEEN '"+params.fechad+"' and '"+params.fechah+"' ";
                    if (params.tipoasiento != 'undefined')
                        string+="AND dba.ASIENTOSCAB.TipoAsiento = '"+params.tipoasiento+"' ";
                    string+="GROUP BY DBA.PLANAUXI.CodPlanCta,Cuenta,DBA.PLANAUXI.CodPlanAux,Auxiliar ORDER BY DBA.PLANAUXI.CodPlanCta,DBA.PLANAUXI.CodPlanAux";
        console.log(string)
        conn.exec(string, function(err, row){
            data1 = row
            var string1 = "SELECT DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre as Cuenta "+
                            "FROM DBA.PLANAUXI,DBA.PLANCTA,DBA.ASIENTOSCAB,DBA.ASIENTOSDET,DBA.TIPOASIENTO WHERE "+
                            "DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANAUXI.CodPlanAux = DBA.ASIENTOSDET.CodPlanAux "+
                            "and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta and DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSCAB.Periodo "+
                            "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta "+
                            "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSCAB.Periodo and DBA.PLANCTA.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa "+
                            "and DBA.PLANCTA.Periodo = DBA.PLANAUXI.Periodo and DBA.PLANCTA.CodPlanCta = DBA.PLANAUXI.CodPlanCta and DBA.ASIENTOSCAB.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa "+
                            "and DBA.ASIENTOSCAB.Periodo = DBA.ASIENTOSDET.Periodo and DBA.ASIENTOSCAB.NroTransac = DBA.ASIENTOSDET.NroTransac "+
                            "and DBA.ASIENTOSCAB.TipoAsiento = DBA.TIPOASIENTO.TipoAsiento and DBA.TIPOASIENTO.TpDef not in( 'N') "+
                            "and DBA.PLANAUXI.PERIODO = '"+params.periodo+"' and DBA.PLANAUXI.Imputable = 'S' and DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"' "+
                            "and DBA.PLANAUXI.CodPlanCta >= '"+params.cuentad+"' and DBA.PLANAUXI.CodPlanCta <= '"+params.cuentah+"' ";
                            if (params.cuentaad != 'NINGUNA' && params.cuentaah != 'NINGUNA')
                                string1+="and DBA.PLANAUXI.CodPlanAux >= '"+params.cuentaad+"' and DBA.PLANAUXI.CodPlanAux <= '"+params.cuentaah+"' "; 
                            string1+="and DBA.ASIENTOSCAB.Fecha BETWEEN '"+params.fechad+"' and '"+params.fechah+"' ";
                            if (params.tipoasiento != 'undefined')
                                string1+="AND dba.ASIENTOSCAB.TipoAsiento = '"+params.tipoasiento+"' ";
                            string1+="GROUP BY DBA.PLANAUXI.CodPlanCta,Cuenta ORDER BY DBA.PLANAUXI.CodPlanCta";
            console.log(string1)
            conn.exec(string1, function(err, row){
                data2 = row;
                if (err) throw err;
                cb([{ data1 : data1 },{ data2 : data2 }]);
            });
        });
    } else {
        var string ="SELECT DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre as Cuenta,DBA.PLANAUXI.CodPlanAux,DBA.PLANAUXI.Nombre as Auxiliar "+
                    "FROM DBA.PLANAUXI,DBA.PLANCTA,DBA.ASIENTOSCAB,DBA.ASIENTOSDET,DBA.TIPOASIENTO WHERE "+
                    "DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANAUXI.CodPlanAux = DBA.ASIENTOSDET.CodPlanAux "+
                    "and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta and DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSCAB.Periodo "+
                    "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta "+
                    "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSCAB.Periodo and DBA.PLANCTA.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa "+
                    "and DBA.PLANCTA.Periodo = DBA.PLANAUXI.Periodo and DBA.PLANCTA.CodPlanCta = DBA.PLANAUXI.CodPlanCta and DBA.ASIENTOSCAB.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa "+
                    "and DBA.ASIENTOSCAB.Periodo = DBA.ASIENTOSDET.Periodo and DBA.ASIENTOSCAB.NroTransac = DBA.ASIENTOSDET.NroTransac "+
                    "and DBA.ASIENTOSCAB.TipoAsiento = DBA.TIPOASIENTO.TipoAsiento and DBA.TIPOASIENTO.TpDef not in( 'N') "+
                    "and DBA.PLANAUXI.PERIODO = '"+params.periodo+"' and DBA.PLANAUXI.Imputable = 'S' and DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"' "+
                    "and DBA.PLANAUXI.CodPlanCta >= '"+params.cuentad+"' and DBA.PLANAUXI.CodPlanCta <= '"+params.cuentah+"' ";
                    if (params.cuentaad != 'NINGUNA' && params.cuentaah != 'NINGUNA')
                        string+="and DBA.PLANAUXI.CodPlanAux >= '"+params.cuentaad+"' and DBA.PLANAUXI.CodPlanAux <= '"+params.cuentaah+"' "; 
                    string+="and DBA.ASIENTOSCAB.Fecha BETWEEN '"+params.fechad+"' and '"+params.fechah+"' ";
                    if (params.tipoasiento != 'undefined')
                        string+="AND dba.ASIENTOSCAB.TipoAsiento = '"+params.tipoasiento+"' ";
                    //string+="GROUP BY DBA.PLANAUXI.CodPlanCta,Cuenta,DBA.PLANAUXI.CodPlanAux,Auxiliar ORDER BY DBA.PLANAUXI.CodPlanCta,DBA.PLANAUXI.CodPlanAux";
                    string+="union SELECT DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre as Cuenta,DBA.PLANAUXI.CodPlanAux,DBA.PLANAUXI.Nombre as Auxiliar "+
                            "FROM DBA.PLANAUXI,DBA.PLANCTA WHERE DBA.PLANCTA.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.PLANAUXI.Periodo "+
                            "and DBA.PLANCTA.CodPlanCta = DBA.PLANAUXI.CodPlanCta and DBA.PLANAUXI.PERIODO = '"+params.periodo+"' and DBA.PLANAUXI.Imputable = 'S' "+
                            "and DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"' and DBA.PLANAUXI.CodPlanCta >= '"+params.cuentad+"' and DBA.PLANAUXI.CodPlanCta <= '"+params.cuentah+"' ";
                    if (params.cuentaad != 'NINGUNA' && params.cuentaah != 'NINGUNA')
                        string+="and DBA.PLANAUXI.CodPlanAux >= '"+params.cuentaad+"' and DBA.PLANAUXI.CodPlanAux <= '"+params.cuentaah+"' "; 
                    string+="GROUP BY DBA.PLANAUXI.CodPlanCta,Cuenta,DBA.PLANAUXI.CodPlanAux,Auxiliar ORDER BY CodPlanCta,CodPlanAux";
        console.log(string)
        conn.exec(string, function(err, row){
            data1 = row
            var string1 = "SELECT DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre as Cuenta "+
                            "FROM DBA.PLANAUXI,DBA.PLANCTA,DBA.ASIENTOSCAB,DBA.ASIENTOSDET,DBA.TIPOASIENTO WHERE "+
                            "DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANAUXI.CodPlanAux = DBA.ASIENTOSDET.CodPlanAux "+
                            "and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta and DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSCAB.Periodo "+
                            "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta "+
                            "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSCAB.Periodo and DBA.PLANCTA.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa "+
                            "and DBA.PLANCTA.Periodo = DBA.PLANAUXI.Periodo and DBA.PLANCTA.CodPlanCta = DBA.PLANAUXI.CodPlanCta and DBA.ASIENTOSCAB.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa "+
                            "and DBA.ASIENTOSCAB.Periodo = DBA.ASIENTOSDET.Periodo and DBA.ASIENTOSCAB.NroTransac = DBA.ASIENTOSDET.NroTransac "+
                            "and DBA.ASIENTOSCAB.TipoAsiento = DBA.TIPOASIENTO.TipoAsiento and DBA.TIPOASIENTO.TpDef not in( 'N') "+
                            "and DBA.PLANAUXI.PERIODO = '"+params.periodo+"' and DBA.PLANAUXI.Imputable = 'S' and DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"' "+
                            "and DBA.PLANAUXI.CodPlanCta >= '"+params.cuentad+"' and DBA.PLANAUXI.CodPlanCta <= '"+params.cuentah+"' ";
                            if (params.cuentaad != 'NINGUNA' && params.cuentaah != 'NINGUNA')
                                string1+="and DBA.PLANAUXI.CodPlanAux >= '"+params.cuentaad+"' and DBA.PLANAUXI.CodPlanAux <= '"+params.cuentaah+"' "; 
                            string1+="and DBA.ASIENTOSCAB.Fecha BETWEEN '"+params.fechad+"' and '"+params.fechah+"' ";
                            if (params.tipoasiento != 'undefined')
                                string1+="AND dba.ASIENTOSCAB.TipoAsiento = '"+params.tipoasiento+"' ";
                            //string1+="GROUP BY DBA.PLANAUXI.CodPlanCta,Cuenta ORDER BY DBA.PLANAUXI.CodPlanCta";
                            string1+="union SELECT DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre as Cuenta "+
                                    "FROM DBA.PLANAUXI,DBA.PLANCTA WHERE DBA.PLANCTA.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.PLANAUXI.Periodo "+
                                    "and DBA.PLANCTA.CodPlanCta = DBA.PLANAUXI.CodPlanCta and DBA.PLANAUXI.PERIODO = '"+params.periodo+"' and DBA.PLANAUXI.Imputable = 'S' "+
                                    "and DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"' and DBA.PLANAUXI.CodPlanCta >= '"+params.cuentad+"' and DBA.PLANAUXI.CodPlanCta <= '"+params.cuentah+"' ";
                            if (params.cuentaad != 'NINGUNA' && params.cuentaah != 'NINGUNA')
                                string1+="and DBA.PLANAUXI.CodPlanAux >= '"+params.cuentaad+"' and DBA.PLANAUXI.CodPlanAux <= '"+params.cuentaah+"' "; 
                            string1+="GROUP BY DBA.PLANAUXI.CodPlanCta,Cuenta ORDER BY CodPlanCta";
            console.log(string1)
            conn.exec(string1, function(err, row){
                data2 = row;
                if (err) throw err;
                cb([{ data1 : data1 },{ data2 : data2 }]);
            });
        });
    }
};

Mayor.cuentasdetalleaux = function (params,cb) {
    var string = "SELECT DBA.ASIENTOSCAB.Cod_Empresa,DBA.ASIENTOSCAB.NroCompr,DBA.ASIENTOSCAB.NroTransac,DBA.PLANAUXI.CodPlanAux,"+
                 "DBA.PLANAUXI.Nombre as Auxiliar,DBA.PLANCTA.TipoSaldo,DBA.PLANAUXI.CodPlanCta,DBA.PLANCTA.Nombre as Cuenta,"+
                 "date(DBA.ASIENTOSCAB.Fecha) as Fecha,YEAR(dba.Asientoscab.Fecha) as ANHO,MONTH(dba.Asientoscab.Fecha) as MES,"+
                 "DBA.Asientoscab.Codmoneda,DBA.Asientoscab.Tipoasiento,DBA.TipoAsiento.Abreviatura,DBA.Asientosdet.Linea,"+
                 "DBA.Asientosdet.Concepto,DBA.Asientosdet.Dbcr,DBA.Asientoscab.Origen,DBA.Asientosdet.Importe,"+
                 "cast(dba.Asientosdet.Credito as decimal(20,0)) as Credito,cast(dba.Asientosdet.Debito as decimal(20,0)) as Debito,"+
                 "cast(dba.Asientosdet.CreditoME as decimal(20,2)) as CreditoME,cast(dba.Asientosdet.DebitoME as decimal(20,2)) as DebitoME "+    
                 "FROM DBA.PLANAUXI,DBA.PLANCTA,DBA.ASIENTOSCAB,DBA.ASIENTOSDET,DBA.TIPOASIENTO WHERE "+ 
                 "DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSDET.Periodo "+ 
                 "and DBA.PLANAUXI.CodPlanAux = DBA.ASIENTOSDET.CodPlanAux and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta "+ 
                 "and DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSCAB.Periodo "+
                 "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSDET.Periodo "+ 
                 "and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa "+ 
                 "and DBA.PLANCTA.Periodo = DBA.ASIENTOSCAB.Periodo and DBA.PLANCTA.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa "+
                 "and DBA.PLANCTA.Periodo = DBA.PLANAUXI.Periodo and DBA.PLANCTA.CodPlanCta = DBA.PLANAUXI.CodPlanCta "+
                 "and DBA.ASIENTOSCAB.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.ASIENTOSCAB.Periodo = DBA.ASIENTOSDET.Periodo "+ 
                 "and DBA.ASIENTOSCAB.NroTransac = DBA.ASIENTOSDET.NroTransac and DBA.ASIENTOSCAB.TipoAsiento = DBA.TIPOASIENTO.TipoAsiento "+ 
                 "and DBA.TIPOASIENTO.TpDef not in( 'N') ";
                 if (params.tipoasiento != 'undefined')
                    string+="AND dba.ASIENTOSCAB.TipoAsiento = '"+params.tipoasiento+"' ";
                 string+="and DBA.PLANAUXI.PERIODO = '"+params.periodo+"' and DBA.PLANAUXI.Imputable = 'S' and DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"' "+
                 "and DBA.PLANAUXI.CodPlanAux = '"+params.cuenta+"' and DBA.PLANAUXI.CodPlanCta = '"+params.path+"' and DBA.ASIENTOSCAB.Fecha BETWEEN '"+params.fechad+"' and '"+params.fechah+"' "+
                 "ORDER BY DBA.PLANAUXI.CodPlanAux ";
    console.log(string)
    conn.exec(string, function(err, row){
        data1 = row
        var string1 = "SELECT DBA.PLANAUXI.CodPlanAux,DBA.PLANCTA.TipoSaldo,cast(sum(dba.Asientosdet.Credito) as decimal(20,0)) as Credito,"+
                      "cast(sum(dba.Asientosdet.Debito) as decimal(20,0)) as Debito,cast(sum(dba.Asientosdet.CreditoME) as decimal(20,2)) as CreditoME,"+
                      "cast(sum(dba.Asientosdet.DebitoME) as decimal(20,2)) as DebitoME FROM DBA.PLANAUXI,DBA.PLANCTA,DBA.ASIENTOSCAB,DBA.ASIENTOSDET,DBA.TIPOASIENTO "+ 
                      "WHERE DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANAUXI.CodPlanAux = DBA.ASIENTOSDET.CodPlanAux "+ 
                      "and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta and DBA.PLANAUXI.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANAUXI.Periodo = DBA.ASIENTOSCAB.Periodo "+ 
                      "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSDET.Periodo and DBA.PLANCTA.CodPlanCta = DBA.ASIENTOSDET.CodPlanCta "+ 
                      "and DBA.PLANCTA.Cod_Empresa = DBA.ASIENTOSCAB.Cod_Empresa and DBA.PLANCTA.Periodo = DBA.ASIENTOSCAB.Periodo and DBA.PLANCTA.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa "+ 
                      "and DBA.PLANCTA.Periodo = DBA.PLANAUXI.Periodo and DBA.PLANCTA.CodPlanCta = DBA.PLANAUXI.CodPlanCta and DBA.ASIENTOSCAB.Cod_Empresa = DBA.ASIENTOSDET.Cod_Empresa "+ 
                      "and DBA.ASIENTOSCAB.Periodo = DBA.ASIENTOSDET.Periodo and DBA.ASIENTOSCAB.NroTransac = DBA.ASIENTOSDET.NroTransac and DBA.ASIENTOSCAB.TipoAsiento = DBA.TIPOASIENTO.TipoAsiento "+ 
                      "and DBA.TIPOASIENTO.TpDef not in( 'N') ";
                      if (params.tipoasiento != 'undefined')
                          string1+="AND dba.ASIENTOSCAB.TipoAsiento = '"+params.tipoasiento+"' ";
                      string1+="and DBA.PLANAUXI.PERIODO = '"+params.periodo+"' and DBA.PLANAUXI.Imputable = 'S' and DBA.PLANAUXI.Cod_Empresa = '"+params.empresa+"' and DBA.PLANAUXI.CodPlanAux = '"+params.cuenta+"' and DBA.PLANAUXI.CodPlanCta = '"+params.path+"' "+ 
                               "and DBA.ASIENTOSCAB.Fecha BETWEEN '"+params.periodo+"-01-01' and dateadd(dd,-1,'"+params.fechad+"') GROUP BY DBA.PLANAUXI.CodPlanAux,DBA.PLANCTA.TipoSaldo ORDER BY DBA.PLANAUXI.CodPlanAux";
        console.log(string1)
        conn.exec(string1, function(err, row){
            data2 = row;
            cb([{ dato1 : data1 },{ dato2 : data2 }]);
        });
    });

};

module.exports = Mayor;
