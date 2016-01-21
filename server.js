var express = require('express');
var restapi = express();
var sqlanywhere = require('sqlanywhere');
var conn = sqlanywhere.createConnection();

var cstr = { Host : 'localhost:2638', Server : 'integrado', 
    UserID : 'dba', Password : 'ownnetmasterkey', DatabaseName : 'integrado' }	
	conn.connect(cstr, function( err ) {
		
	//empresas select option
	restapi.get('/api/v1/empresa/select', function(req, res){
		res.setHeader('Access-Control-Allow-Origin', '*');
		conn.exec("select Cod_Empresa,Des_Empresa from dba.EMPRESA", function(err, row){
			res.json({ data : row });
		});
	});
		
	//comprobantes select option
	restapi.get('/api/v1/comprobante/select/:empresa', function(req, res){
		res.setHeader('Access-Control-Allow-Origin', '*');
		var empresa = req.params.empresa;
		conn.exec("select Cod_Tp_Comp,upper(des_tp_comp) as des_tp_comp from DBA.TPOCBTE where activo = 'S' and Cod_Empresa = '"+empresa+"'", function(err, row){
			res.json({ data : row });
		});
	});	
	
	//proveedores select option
	restapi.get('/api/v1/proveedor/select/:empresa/:tipo', function(req, res){
		res.setHeader('Access-Control-Allow-Origin', '*');
		var empresa = req.params.empresa;
		var tipo = req.params.tipo;
		conn.exec("select CodProv,upper(RazonSocial) as RazonSocial from DBA.PROVEED where estado = 'A' and Cod_Empresa = '"+empresa+"' and TipoProv = '"+tipo+"'", function(err, row){
			res.json({ data : row });
		});
	});	
	
	//sucursales select option
	restapi.get('/api/v1/sucursal/select/:empresa', function(req, res){
		res.setHeader('Access-Control-Allow-Origin', '*');
		var empresa = req.params.empresa;
		conn.exec("select Cod_Sucursal,Des_Sucursal from DBA.SUCURSAL where Cod_Empresa = '"+empresa+"'", function(err, row){
			res.json({ data : row });
		});
	});	
	
	//list orden de pago
	restapi.get('/api/v1/ordenpago/list/:empresa/:sucursal/:tipoop/:comprobante/:tipoproveedor/:proveedor/:desde/:hasta', function(req, res){
		res.setHeader('Access-Control-Allow-Origin', '*');
		var empresa = req.params.empresa;
		var sucursal = req.params.sucursal;
		var tipoop = req.params.tipoop;
		var comprobante = req.params.comprobante;
		var tipoproveedor = req.params.tipoproveedor;
		var proveedor = req.params.proveedor;
		var desde = req.params.desde;
		var hasta = req.params.hasta;
		
		if (sucursal == "NINGUNA" || sucursal == " ")
			sucursal = ""
		
		if (tipoop == "NINGUNO" || tipoop == " ")
			tipoop = ""
			
		if (comprobante == "NINGUNO" || comprobante == " ")
			comprobante = ""
			
		if (tipoproveedor == "NINGUNO" || tipoproveedor == " ")
			tipoproveedor = ""
			
		if (proveedor == "NINGUNO" || proveedor == " ")
			proveedor = ""
		
		console.log("SELECT "+ 
				"Des_Sucursal,NroOP,des_tp_comp,date(Fecha) as Fecha,RazonSocial,cast(TotalImporte as decimal(20,0)) "+
				"FROM "+
					"DBA.OPCAB,DBA.EMPRESA,DBA.SUCURSAL,DBA.TPOCBTE,DBA.PROVEED "+
				"WHERE "+ 
					"DBA.OPCAB.Cod_Empresa = DBA.EMPRESA.Cod_Empresa AND DBA.SUCURSAL.Cod_Empresa = DBA.EMPRESA.Cod_Empresa AND "+  
					"DBA.SUCURSAL.Cod_Sucursal = DBA.OPCAB.Cod_Sucursal AND DBA.TPOCBTE.Cod_Tp_Comp = DBA.OPCAB.Cod_Tp_Comp AND "+ 
					"DBA.PROVEED.CodProv = DBA.OPCAB.CodProv AND DBA.PROVEED.Cod_Empresa = DBA.OPCAB.Cod_Empresa AND "+
					"DBA.PROVEED.Cod_Empresa = DBA.EMPRESA.Cod_Empresa AND DBA.OPCAB.Anulado = 'N' AND "+
					"cast(DBA.SUCURSAL.Cod_Sucursal as varchar(50)) like '%"+sucursal+"%' AND cast(DBA.EMPRESA.Cod_Empresa as varchar(50)) like '%"+empresa+"%' "+
					"AND cast(DBA.OPCAB.TipoOP as varchar(50)) like '%"+tipoop+"%' AND cast(DBA.TPOCBTE.Cod_Tp_Comp as varchar(50)) like '%"+comprobante+"%' "+
					"AND cast(DBA.PROVEED.TipoProv as varchar(50)) like '%"+tipoproveedor+"%' AND cast(DBA.PROVEED.CodProv as varchar(50)) like '%"+proveedor+"%' "+
					"AND DBA.OPCAB.Fecha BETWEEN '"+desde+"' and '"+hasta+"'")
				
		conn.exec("SELECT "+ 
						"Des_Sucursal,NroOP,des_tp_comp,date(Fecha) as Fecha,RazonSocial,cast(TotalImporte as decimal(20,0)) "+
					"FROM "+
						"DBA.OPCAB,DBA.EMPRESA,DBA.SUCURSAL,DBA.TPOCBTE,DBA.PROVEED "+
					"WHERE "+ 
						"DBA.OPCAB.Cod_Empresa = DBA.EMPRESA.Cod_Empresa AND DBA.SUCURSAL.Cod_Empresa = DBA.EMPRESA.Cod_Empresa AND "+  
						"DBA.SUCURSAL.Cod_Sucursal = DBA.OPCAB.Cod_Sucursal AND DBA.TPOCBTE.Cod_Tp_Comp = DBA.OPCAB.Cod_Tp_Comp AND "+ 
						"DBA.PROVEED.CodProv = DBA.OPCAB.CodProv AND DBA.PROVEED.Cod_Empresa = DBA.OPCAB.Cod_Empresa AND "+
						"DBA.PROVEED.Cod_Empresa = DBA.EMPRESA.Cod_Empresa AND DBA.OPCAB.Anulado = 'N' AND "+
						"cast(DBA.SUCURSAL.Cod_Sucursal as varchar(50)) like '%"+sucursal+"%' AND cast(DBA.EMPRESA.Cod_Empresa as varchar(50)) like '%"+empresa+"%' "+
						"AND cast(DBA.OPCAB.TipoOP as varchar(50)) like '%"+tipoop+"%' AND cast(DBA.TPOCBTE.Cod_Tp_Comp as varchar(50)) like '%"+comprobante+"%' "+
						"AND cast(DBA.PROVEED.TipoProv as varchar(50)) like '%"+tipoproveedor+"%' AND cast(DBA.PROVEED.CodProv as varchar(50)) like '%"+proveedor+"%' "+
						"AND DBA.OPCAB.Fecha BETWEEN '"+desde+"' and '"+hasta+"'", function(err, row){
			res.json({ data : row });
		});
	});
	
	//cuentas select option
	restapi.get('/api/v1/cuenta/select/:empresa/:periodo', function(req, res){
		res.setHeader('Access-Control-Allow-Origin', '*');
		var empresa = req.params.empresa;
		var periodo = req.params.periodo;
		conn.exec("select CodPlanCta,(cast(CodPlanCta as varchar)+' - '+Nombre) as Nombre from DBA.PLANCTA where Cod_Empresa = '"+empresa+"' and PERIODO = "+periodo+"ORDER BY DBA.PLANCTA.CodPlanCta", function(err, row){
			res.json({ data : row });
		});
	});
	
	//list balance general
	restapi.get('/api/v1/balancegeneral/list/:empresa/:periodo/:cuentad/:cuentah/:mesd/:mesh/:nivel/:saldo/:moneda/:aux', function(req, res){
		res.setHeader('Access-Control-Allow-Origin', '*');
		var empresa = req.params.empresa;
		var periodo = req.params.periodo;
		var cuentad = req.params.cuentad;
		var cuentah = req.params.cuentah;
		var mesd = req.params.mesd;
		var mesh = req.params.mesh;
		var nivel = req.params.nivel;
		var saldo = req.params.saldo;
		var moneda = req.params.moneda;
		var aux = req.params.aux;
		
		if (aux == 'NO'){
			var string = "SELECT "+ 
							"DBA.PLANCTA.Cod_Empresa,DBA.PLANCTA.CodPlanCta,DBA.PLANCTA.Nombre,DBA.PLANCTA.Nivel,DBA.PLANCTA.Imputable,DBA.PLANCTA.TipoSaldo,DBA.Control.CTCtaOrden,"
			if (moneda == 'local'){
				string+="cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) as 'TOTAL_DEBITO',cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) as 'TOTAL_CREDITO',"+
						"(CASE DBA.PLANCTA.TipoSaldo "+
							"WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) "+
							"ELSE cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) "+
							"END) as 'SALDO' "
			} else {
				string+="cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) as 'TOTAL_DEBITO',cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) as 'TOTAL_CREDITO',"+
						"(CASE DBA.PLANCTA.TipoSaldo "+
							"WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) - cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) "+
							"ELSE cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) - cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) "+
							"END) as 'SALDO' "
			}
			string+="FROM "+
						"DBA.CONTROL,DBA.PLANCTA,DBA.ACUMPLAN "+
					"WHERE "+
						"(DBA.Control.Cod_Empresa = DBA.PLANCTA.Cod_Empresa) AND (DBA.Control.Periodo = DBA.PLANCTA.Periodo) AND "+
						"(DBA.PLANCTA.Cod_Empresa = DBA.AcumPlan.Cod_Empresa) AND (DBA.PLANCTA.Periodo = DBA.AcumPlan.Periodo) AND "+
						"(DBA.PLANCTA.CodPlanCta = DBA.AcumPlan.CodPlanCta) AND (DBA.PLANCTA.Cod_Empresa = '"+empresa+"') "+
						"AND (DBA.PLANCTA.Periodo = "+periodo+") AND (DBA.PLANCTA.CodPlanCta >= '"+cuentad+"') "+  
						"AND (DBA.PLANCTA.CodPlanCta <= '"+cuentah+"') "
		  if (nivel > 0)
			string+="AND (DBA.PLANCTA.Nivel <= "+nivel+") "
			string+="AND (DBA.AcumPlan.AnhoMes >= "+parseInt(periodo.toString()+mesd.toString())+") AND (DBA.AcumPlan.AnhoMes <= "+parseInt(periodo.toString()+mesh.toString())+") "	
		  string+="GROUP BY "+
					"DBA.PLANCTA.Cod_Empresa,DBA.PLANCTA.CodPlanCta,DBA.PLANCTA.Nombre,DBA.PLANCTA.Nivel,DBA.PLANCTA.Imputable,DBA.PLANCTA.TipoSaldo,DBA.CONTROL.CtCtaOrden "
		  if (saldo == 'SI'){
				//string+="having SALDO >= 0 "
			} else {
				string+="having SALDO <> 0 "	
			}
		  string+="ORDER BY "+
					"DBA.PLANCTA.CodPlanCta"
		} else {
			var string = "SELECT "+ 
							"DBA.PLANCTA.Cod_Empresa,DBA.PLANCTA.CodPlanCta,DBA.PLANCTA.Nombre,DBA.PLANCTA.Nivel,DBA.PLANCTA.Imputable,DBA.PLANCTA.TipoSaldo,DBA.Control.CTCtaOrden,"
			if (moneda == 'local'){
				string+="cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) as 'TOTAL_DEBITO',cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) as 'TOTAL_CREDITO',"+
						"(CASE DBA.PLANCTA.TipoSaldo "+
							"WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) "+
							"ELSE cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) "+
							"END) as 'SALDO' "
			} else {
				string+="cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) as 'TOTAL_DEBITO',cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) as 'TOTAL_CREDITO',"+
						"(CASE DBA.PLANCTA.TipoSaldo "+
							"WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) - cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) "+
							"ELSE cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,2)) - cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,2)) "+
							"END) as 'SALDO' "
			}
			string+="FROM "+
						"DBA.CONTROL,DBA.PLANCTA,DBA.ACUMPLAN "+
					"WHERE "+
						"(DBA.Control.Cod_Empresa = DBA.PLANCTA.Cod_Empresa) AND (DBA.Control.Periodo = DBA.PLANCTA.Periodo) AND "+
						"(DBA.PLANCTA.Cod_Empresa = DBA.AcumPlan.Cod_Empresa) AND (DBA.PLANCTA.Periodo = DBA.AcumPlan.Periodo) AND "+
						"(DBA.PLANCTA.CodPlanCta = DBA.AcumPlan.CodPlanCta) AND (DBA.PLANCTA.Cod_Empresa = '"+empresa+"') "+
						"AND (DBA.PLANCTA.Periodo = "+periodo+") AND (DBA.PLANCTA.CodPlanCta >= '"+cuentad+"') "+  
						"AND (DBA.PLANCTA.CodPlanCta <= '"+cuentah+"') "
			  if (nivel > 0)
				string+="AND (DBA.PLANCTA.Nivel <= "+nivel+") "
			string+="AND (DBA.AcumPlan.AnhoMes >= "+parseInt(periodo.toString()+mesd.toString())+") AND (DBA.AcumPlan.AnhoMes <= "+parseInt(periodo.toString()+mesh.toString())+") "	
		  string+="GROUP BY "+
					"DBA.PLANCTA.Cod_Empresa,DBA.PLANCTA.CodPlanCta,DBA.PLANCTA.Nombre,DBA.PLANCTA.Nivel,DBA.PLANCTA.Imputable,DBA.PLANCTA.TipoSaldo,DBA.CONTROL.CtCtaOrden "
		  if (saldo == 'SI'){
				//string+="having SALDO >= 0 "
			} else {
				string+="having SALDO <> 0 "	
			}
		  string+="UNION "+
				  "SELECT "+
						"DBA.PLANAUXI.Cod_Empresa,DBA.PLANCTA.CodPlanCta + '-' + DBA.PLANAUXI.CodPlanAux as CTA,DBA.PLANAUXI.Nombre,DBA.PLANAUXI.Nivel,DBA.PLANAUXI.Imputable,DBA.PLANCTA.TipoSaldo,DBA.Control.CTCtaOrden,"
		if (moneda == 'local'){
			string+="cast(sum(DBA.AcumAuxi.TotalDb)as decimal(20,0)) as 'TOTAL_DEBITO',cast(sum(DBA.AcumAuxi.TotalCr)as decimal(20,0)) as 'TOTAL_CREDITO',"+
					"(CASE DBA.PLANCTA.TipoSaldo "+
						"WHEN 'D' then cast(sum(DBA.AcumAuxi.TotalDb)as decimal(20,0)) - cast(sum(DBA.AcumAuxi.TotalCr)as decimal(20,0)) "+
						"ELSE cast(sum(DBA.AcumAuxi.TotalCr)as decimal(20,0)) - cast(sum(DBA.AcumAuxi.TotalDb)as decimal(20,0)) "+
						"END) as 'SALDO' "
		} else {
			string+="cast(sum(DBA.AcumAuxi.TotalDbME)as decimal(20,2)) as 'TOTAL_DEBITO',cast(sum(DBA.AcumAuxi.TotalCrME)as decimal(20,2)) as 'TOTAL_CREDITO',"+
					"(CASE DBA.PLANCTA.TipoSaldo "+
						"WHEN 'D' then cast(sum(DBA.AcumAuxi.TotalDbME)as decimal(20,2)) - cast(sum(DBA.AcumAuxi.TotalCrME)as decimal(20,2)) "+
						"ELSE cast(sum(DBA.AcumAuxi.TotalCrME)as decimal(20,2)) - cast(sum(DBA.AcumAuxi.TotalDbME)as decimal(20,2)) "+
						"END) as 'SALDO' "
		}
		string+="FROM "+
					"DBA.CONTROL,DBA.PLANAUXI,DBA.PLANCTADBA.AcumAuxi "+
				"WHERE "+
					"(DBA.Control.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa) AND (DBA.Control.Periodo = DBA.PLANAUXI.Periodo) AND "+
					"(DBA.PLANAUXI.CodPlanCta = DBA.PLANCTA.CodPlanCta) AND (DBA.PLANAUXI.Cod_Empresa = DBA.AcumAuxi.Cod_Empresa) AND "+
					"(DBA.PLANAUXI.Periodo = DBA.AcumAuxi.Periodo) AND (DBA.PLANAUXI.CodPlanAux = DBA.AcumAuxi.CodPlanAux) AND "+
					"(DBA.PLANAUXI.CodPlanCta  = DBA.AcumAuxi.CodPlanCta) AND (DBA.plancta.imputable = 'N') "+
					"AND (DBA.plancta.Auxiliar = 'S') AND (DBA.PLANAUXI.Cod_Empresa = '"+empresa+"') "+
					"AND (DBA.PLANAUXI.Periodo = "+periodo+") AND (DBA.PLANCTA.CodPlanCta >= '"+cuentad+"') "+  
					"AND (DBA.PLANCTA.CodPlanCta <= '"+cuentah+"') "
		if (nivel > 0)
			string+="AND (DBA.PLANCTA.Nivel <= "+nivel+") "
		string+="AND (DBA.AcumAuxi.AnhoMes >= "+parseInt(periodo.toString()+mesd.toString())+") AND (DBA.AcumAuxi.AnhoMes <= "+parseInt(periodo.toString()+mesh.toString())+") "
		string+="GROUP BY "+
					"DBA.PLANAUXI.Cod_Empresa,CTA,DBA.PLANAUXI.Nombre,DBA.PLANAUXI.Nivel,DBA.PLANAUXI.Imputable,DBA.PLANCTA.TipoSaldo,DBA.Control.CTCtaOrden "		
		if (saldo == 'SI'){
			//string+="having SALDO >= 0 "
		} else {
			string+="having SALDO <> 0 "	
		}
		string+="ORDER BY 1, 2"
		}	
				
		conn.exec(string, function(err, row){
			res.json({ data : row });
		});
	});
	
	//list balance comprobado
	restapi.get('/api/v1/balancecomprobado/list/:empresa/:periodo/:periodoant/:mes/:mesant/:nivel/:moneda', function(req, res){
		res.setHeader('Access-Control-Allow-Origin', '*');
		var empresa = req.params.empresa;
		var periodo = req.params.periodo;
		var periodoant = req.params.periodoant;
		var mes = req.params.mes;
		var mesant = req.params.mesant;
		var nivel = req.params.nivel;
		var moneda = req.params.moneda;
		
		var string = "SELECT " +
						"DBA.PLANCTA.Cod_Empresa,DBA.PLANCTA.CodPlanCta,DBA.PLANCTA.Nombre,DBA.PLANCTA.Nivel,DBA.PLANCTA.Imputable,"+
						"ifnull((SELECT "
						if (moneda == 'local'){
							string+="(CASE DBA.PLANCTA.TipoSaldo "+
										"WHEN 'D' then cast(SUM (A2.TotalDB) -  SUM(A2.TotalCR) as decimal(20,0)) "+
										"ELSE cast(SUM (A2.TotalCR) -  SUM(A2.TotalDB) as decimal(20,0)) END)"
						} else {
							string+="(CASE DBA.PLANCTA.TipoSaldo "+
										"WHEN 'D' then cast(SUM (A2.TotalDBME) -  SUM(A2.TotalCRME) as decimal(20,2)) "+
										"ELSE cast(SUM (A2.TotalCRME) -  SUM(A2.TotalDBME) as decimal(20,2)) END)"
						}
						string+="FROM "+ 
								"DBA.ACUMPLAN A2 "+
							"WHERE "+
								"A2.Cod_Empresa = DBA.PLANCTA.Cod_Empresa AND A2.CodPlanCta  = DBA.PLANCTA.CodPlanCta "+
								"AND A2.Periodo = DBA.PLANCTA.Periodo AND A2.Anho = "+parseInt(periodoant)+" "+
								"AND A2.Mes < "+parseInt(mesant)+" "
						if (nivel > 0)
							string+="AND (DBA.PLANCTA.Nivel <= "+nivel+") "
							string+="),0,(SELECT "
											if (moneda == 'local'){
												string+="(CASE DBA.PLANCTA.TipoSaldo "+
															"WHEN 'D' then cast(SUM (A2.TotalDB) -  SUM(A2.TotalCR) as decimal(20,0)) "+
															"ELSE cast(SUM (A2.TotalCR) -  SUM(A2.TotalDB) as decimal(20,0)) END)"
											} else {
												string+="(CASE DBA.PLANCTA.TipoSaldo "+
															"WHEN 'D' then cast(SUM (A2.TotalDBME) -  SUM(A2.TotalCRME) as decimal(20,2)) "+
															"ELSE cast(SUM (A2.TotalCRME) -  SUM(A2.TotalDBME) as decimal(20,2)) END)"
											}
							 string+="FROM "+
											"DBA.ACUMPLAN A2 "+
									 "WHERE "+
											"A2.Cod_Empresa = DBA.PLANCTA.Cod_Empresa AND A2.CodPlanCta  = DBA.PLANCTA.CodPlanCta "+
											"AND A2.Periodo = DBA.PLANCTA.Periodo AND A2.Anho = "+parseInt(periodoant)+" "+
											"AND A2.Mes < "+parseInt(mesant)+" "
											if (nivel > 0)
												string+="AND (DBA.PLANCTA.Nivel <= "+nivel+") "
							string+=")) as SALDO_ANTERIOR,"
						if (moneda == 'local'){
							string+="ifnull(cast(DBA.ACUMPLAN.TotalDb as decimal(20,0)),0,cast(DBA.ACUMPLAN.TotalDb as decimal(20,0))) as TOTAL_DEBITO,"+
									"ifnull(cast(DBA.ACUMPLAN.TotalCr as decimal(20,0)),0,cast(DBA.ACUMPLAN.TotalCr as decimal(20,0))) as TOTAL_CREDITO,"
						} else {
							string+="ifnull(cast(DBA.ACUMPLAN.TotalDbME as decimal(20,2)),0,cast(DBA.ACUMPLAN.TotalDbME as decimal(20,2))) as TOTAL_DEBITO,"+
									"ifnull(cast(DBA.ACUMPLAN.TotalCrME as decimal(20,0)),0,cast(DBA.ACUMPLAN.TotalCrME as decimal(20,2))) as TOTAL_CREDITO,"
						}
				string+="DBA.PLANCTA.TipoSaldo,"+
						"(CASE DBA.PLANCTA.TipoSaldo "+
							"WHEN 'D' THEN (SALDO_ANTERIOR + TOTAL_DEBITO)-TOTAL_CREDITO "+
							"ELSE (SALDO_ANTERIOR + TOTAL_CREDITO)-TOTAL_DEBITO END) AS SALDO "+
					"FROM DBA.PLANCTA,DBA.ACUMPLAN WHERE "+
						"DBA.PLANCTA.Cod_Empresa = DBA.ACUMPLAN.Cod_Empresa AND DBA.ACUMPLAN.Periodo = DBA.PLANCTA.Periodo "+
						"AND DBA.PLANCTA.CodPlanCta = DBA.ACUMPLAN.CodPlanCta AND DBA.ACUMPLAN.Anho = "+parseInt(periodo)+" "+
						"AND DBA.ACUMPLAN.Mes =  "+parseInt(mes)+" "
						if (nivel > 0)
							string+="AND (DBA.PLANCTA.Nivel <= "+nivel+") "
				string+="AND DBA.PLANCTA.cod_empresa = '"+empresa+"' "+
							"ORDER BY DBA.PLANCTA.CodPlanCta"
                                                                    
		conn.exec(string, function(err, row){
			res.json({ data : row });
		});
	});	
	
	//tipo asiento select option
	restapi.get('/api/v1/tipoasiento/select/', function(req, res){
		res.setHeader('Access-Control-Allow-Origin', '*');
		conn.exec("SELECT DBA.TipoAsiento.TipoAsiento,DBA.TipoAsiento.Descrip FROM DBA.TipoAsiento WHERE TpDef <> 'N' ORDER BY DBA.TipoAsiento.TipoAsiento", function(err, row){
			res.json({ data : row });
		});
	});	
	
	//list diario comprobado
	restapi.get('/api/v1/diariocomprobado/list/:empresa/:tipoasiento/:fechad/:fechah/:autorizado', function(req, res){
		res.setHeader('Access-Control-Allow-Origin', '*');
		
		var empresa = req.params.empresa;
		var tipoasiento = req.params.tipoasiento;
		var fechad = req.params.fechad;
		var fechah = req.params.fechah;
		var autorizado = req.params.autorizado;
		
		var string =  "SELECT "+
							"dba.asientosdet.Cod_Empresa as EMPRESA,dba.asientosdet.NroTransac,dba.asientoscab.TipoAsiento,dba.asientoscab.NroCompr,dba.asientosdet.NroOrden as Linea,dba.asientosdet.CodPlanCta,"+
							"dba.asientosdet.CodPlanAux,dba.asientosdet.Concepto,dba.asientosdet.DbCr,dba.asientosdet.Importe,dba.asientosdet.ImporteME,date(dba.asientoscab.Fecha) as Fecha,cast(dba.asientosdet.DEBITO as decimal(20,0)) as DEBITO,"+
							"cast(dba.asientosdet.CREDITO as decimal(20,0)) as CREDITO,cast(dba.asientosdet.DEBITOME as decimal(20,2)) as DEBITO_ME,cast(dba.asientosdet.CREDITOME as decimal(20,2)) as CREDITO_ME,DBA.PLANCTA.Nombre as NOMBRECUENTA,DBA.PLANAUXI.Nombre as NOMBRECUENTAAUX,"+
							"dba.tipoasiento.Descrip as TIPOASIENTO,DBA.asientoscab.autorizado,DBA.asientoscab.cargadopor,DBA.asientoscab.fechacarga,DBA.asientoscab.autorizadopor,DBA.asientoscab.fechaautoriz,"+
							"DBA.asientoscab.nroasiento,upper(dba.asientosdet.Concepto) as BUSCAR_CONCEPTO	"+
					  "FROM "+
							"(dba.asientosdet LEFT OUTER JOIN DBA.PLANAUXI ON dba.asientosdet.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa AND dba.asientosdet.Periodo = DBA.PLANAUXI.Periodo AND dba.asientosdet.CodPlanCta = DBA.PLANAUXI.CodPlanCta AND dba.asientosdet.CodPlanAux = DBA.PLANAUXI.CodPlanAux),DBA.PLANCTA,dba.asientoscab,dba.tipoasiento "+
					  "WHERE "+
							"( dba.asientosdet.Periodo = DBA.PLANCTA.Periodo ) "+
							"AND ( dba.asientosdet.CodPlanCta = DBA.PLANCTA.CodPlanCta ) "+
							"AND ( dba.asientoscab.Cod_Empresa = dba.asientosdet.Cod_Empresa ) "+
							"AND ( dba.asientoscab.NroTransac  = dba.asientosdet.NroTransac ) "+
							"AND ( dba.asientoscab.TipoAsiento = dba.tipoasiento.TipoAsiento ) " +
							"AND ( dba.AsientosCAB.cod_empresa = '"+empresa+"' ) "+
							"AND ( dba.asientoscab.TipoAsiento = '"+tipoasiento+"') "+
							"AND (DBA.asientoscab.fecha BETWEEN '"+fechad+"' and '"+fechah+"') "						
		if(autorizado == 'SI')
				string+="AND (DBA.asientoscab.autorizado = 'S') "
		if(autorizado == 'NO')
				string+="AND (DBA.asientoscab.autorizado = 'N') "
			string+= "ORDER BY "+
							"DBA.AsientosCAB.Cod_Empresa ASC,DBA.AsientosCAB.Fecha ASC,DBA.AsientosDet.NroTransac ASC,DBA.AsientosDet.Linea ASC"
		
		conn.exec(string, function(err, row){
			res.json({ data : row });
		});
	});	


	restapi.listen(3000);
	restapi.use(function(req, res, next){
		res.setTimeout(120000, function(){
			console.log('Request has timed out.');
				res.send(408);
			});

		next();
});

});

/*

*/

