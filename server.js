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
		
		conn.exec("SELECT "+ 
						//"Des_Empresa,"+
						"Des_Sucursal,"+
						"NroOP,"+
						"des_tp_comp,"+
						"date(Fecha) as Fecha,"+
						"RazonSocial,"+
						//"Autorizado,"+
						//"Impreso,"+
						//"Asentado,"+
						"cast(TotalImporte as decimal(20,0)) "+
					"FROM "+
						"DBA.OPCAB,"+
						"DBA.EMPRESA,"+
						"DBA.SUCURSAL,"+
						"DBA.TPOCBTE,"+
						"DBA.PROVEED "+
					"WHERE "+ 
						"DBA.OPCAB.Cod_Empresa = DBA.EMPRESA.Cod_Empresa AND "+
						"DBA.SUCURSAL.Cod_Empresa = DBA.EMPRESA.Cod_Empresa AND "+  
						"DBA.SUCURSAL.Cod_Sucursal = DBA.OPCAB.Cod_Sucursal AND "+  
						"DBA.TPOCBTE.Cod_Tp_Comp = DBA.OPCAB.Cod_Tp_Comp AND "+ 
						"DBA.PROVEED.CodProv = DBA.OPCAB.CodProv AND "+
						"DBA.PROVEED.Cod_Empresa = DBA.OPCAB.Cod_Empresa AND "+
						"DBA.PROVEED.Cod_Empresa = DBA.EMPRESA.Cod_Empresa AND "+
						"DBA.OPCAB.Anulado = 'N' AND "+
						"cast(DBA.SUCURSAL.Cod_Sucursal as varchar(50)) like '%"+sucursal+"%' "+
						"AND cast(DBA.EMPRESA.Cod_Empresa as varchar(50)) like '%"+empresa+"%' "+
						"AND cast(DBA.OPCAB.TipoOP as varchar(50)) like '%"+tipoop+"%' "+
						"AND cast(DBA.TPOCBTE.Cod_Tp_Comp as varchar(50)) like '%"+comprobante+"%' "+
						"AND cast(DBA.PROVEED.TipoProv as varchar(50)) like '%"+tipoproveedor+"%' "+
						"AND cast(DBA.PROVEED.CodProv as varchar(50)) like '%"+proveedor+"%' "+
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
							"DBA.PLANCTA.Cod_Empresa,"+
							"DBA.PLANCTA.CodPlanCta,"+
							"DBA.PLANCTA.Nombre,"+ 
							"DBA.PLANCTA.Nivel,"+
							"DBA.PLANCTA.Imputable,"+
							"DBA.PLANCTA.TipoSaldo,"+
							"DBA.Control.CTCtaOrden,"
							if (moneda == 'local'){
								string+="cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) as 'TOTAL_DEBITO',"+
										"cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) as 'TOTAL_CREDITO',"+
										"(CASE DBA.PLANCTA.TipoSaldo "+
											"WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) "+
											"ELSE cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) "+
											"END) as 'SALDO' "
							} else {
								string+="cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,0)) as 'TOTAL_DEBITO',"+
										"cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,0)) as 'TOTAL_CREDITO',"+
										"(CASE DBA.PLANCTA.TipoSaldo "+
											"WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,0)) "+
											"ELSE cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,0)) "+
											"END) as 'SALDO' "
							}
							string+="FROM "+
										"DBA.CONTROL,"+
										"DBA.PLANCTA,"+
										"DBA.ACUMPLAN "+
									"WHERE "+
										"(DBA.Control.Cod_Empresa = DBA.PLANCTA.Cod_Empresa) AND "+
										"(DBA.Control.Periodo = DBA.PLANCTA.Periodo) AND "+
										"(DBA.PLANCTA.Cod_Empresa = DBA.AcumPlan.Cod_Empresa) AND "+
										"(DBA.PLANCTA.Periodo = DBA.AcumPlan.Periodo) AND "+
										"(DBA.PLANCTA.CodPlanCta = DBA.AcumPlan.CodPlanCta) AND "+
										"(DBA.PLANCTA.Cod_Empresa = '"+empresa+"') "+
										"AND (DBA.PLANCTA.Periodo = "+periodo+") "+
										"AND (DBA.PLANCTA.CodPlanCta >= '"+cuentad+"') "+  
										"AND (DBA.PLANCTA.CodPlanCta <= '"+cuentah+"') "
						  if (nivel > 0)
							string+="AND (DBA.PLANCTA.Nivel <= "+nivel+") "
							string+="AND (DBA.AcumPlan.AnhoMes >= "+parseInt(periodo.toString()+mesd.toString())+") "+
									"AND (DBA.AcumPlan.AnhoMes <= "+parseInt(periodo.toString()+mesh.toString())+") "	
						  string+="GROUP BY "+
									"DBA.PLANCTA.Cod_Empresa,"+
									"DBA.PLANCTA.CodPlanCta,"+
									"DBA.PLANCTA.Nombre,"+
									"DBA.PLANCTA.Nivel,"+
									"DBA.PLANCTA.Imputable,"+
									"DBA.PLANCTA.TipoSaldo,"+
									"DBA.CONTROL.CtCtaOrden "
						  if (saldo == 'SI'){
								//string+="having SALDO >= 0 "
							} else {
								string+="having SALDO <> 0 "	
							}
						  string+="ORDER BY "+
									"DBA.PLANCTA.CodPlanCta"
		} else {
			var string = "SELECT "+ 
							"DBA.PLANCTA.Cod_Empresa,"+
							"DBA.PLANCTA.CodPlanCta,"+
							"DBA.PLANCTA.Nombre,"+ 
							"DBA.PLANCTA.Nivel,"+
							"DBA.PLANCTA.Imputable,"+
							"DBA.PLANCTA.TipoSaldo,"+
							"DBA.Control.CTCtaOrden,"
							if (moneda == 'local'){
								string+="cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) as 'TOTAL_DEBITO',"+
										"cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) as 'TOTAL_CREDITO',"+
										"(CASE DBA.PLANCTA.TipoSaldo "+
											"WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) "+
											"ELSE cast(sum(DBA.AcumPlan.TotalCr)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalDb)as decimal(20,0)) "+
											"END) as 'SALDO' "
							} else {
								string+="cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,0)) as 'TOTAL_DEBITO',"+
										"cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,0)) as 'TOTAL_CREDITO',"+
										"(CASE DBA.PLANCTA.TipoSaldo "+
											"WHEN 'D' then cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,0)) "+
											"ELSE cast(sum(DBA.AcumPlan.TotalCrME)as decimal(20,0)) - cast(sum(DBA.AcumPlan.TotalDbME)as decimal(20,0)) "+
											"END) as 'SALDO' "
							}
							string+="FROM "+
										"DBA.CONTROL,"+
										"DBA.PLANCTA,"+
										"DBA.ACUMPLAN "+
									"WHERE "+
										"(DBA.Control.Cod_Empresa = DBA.PLANCTA.Cod_Empresa) AND "+
										"(DBA.Control.Periodo = DBA.PLANCTA.Periodo) AND "+
										"(DBA.PLANCTA.Cod_Empresa = DBA.AcumPlan.Cod_Empresa) AND "+
										"(DBA.PLANCTA.Periodo = DBA.AcumPlan.Periodo) AND "+
										"(DBA.PLANCTA.CodPlanCta = DBA.AcumPlan.CodPlanCta) AND "+
										"(DBA.PLANCTA.Cod_Empresa = '"+empresa+"') "+
										"AND (DBA.PLANCTA.Periodo = "+periodo+") "+
										"AND (DBA.PLANCTA.CodPlanCta >= '"+cuentad+"') "+  
										"AND (DBA.PLANCTA.CodPlanCta <= '"+cuentah+"') "
						  if (nivel > 0)
							string+="AND (DBA.PLANCTA.Nivel <= "+nivel+") "
							string+="AND (DBA.AcumPlan.AnhoMes >= "+parseInt(periodo.toString()+mesd.toString())+") "+
									"AND (DBA.AcumPlan.AnhoMes <= "+parseInt(periodo.toString()+mesh.toString())+") "	
						  string+="GROUP BY "+
									"DBA.PLANCTA.Cod_Empresa,"+
									"DBA.PLANCTA.CodPlanCta,"+
									"DBA.PLANCTA.Nombre,"+
									"DBA.PLANCTA.Nivel,"+
									"DBA.PLANCTA.Imputable,"+
									"DBA.PLANCTA.TipoSaldo,"+
									"DBA.CONTROL.CtCtaOrden "
						  if (saldo == 'SI'){
								//string+="having SALDO >= 0 "
							} else {
								string+="having SALDO <> 0 "	
							}
						  string+="UNION "+
								  "SELECT "+
									"DBA.PLANAUXI.Cod_Empresa,"+
									"DBA.PLANCTA.CodPlanCta + '-' + DBA.PLANAUXI.CodPlanAux as CTA,"+
									"DBA.PLANAUXI.Nombre,"+
									"DBA.PLANAUXI.Nivel,"+
									"DBA.PLANAUXI.Imputable,"+
									"DBA.PLANCTA.TipoSaldo,"+
									"DBA.Control.CTCtaOrden,"
									if (moneda == 'local'){
										string+="cast(sum(DBA.AcumAuxi.TotalDb)as decimal(20,0)) as 'TOTAL_DEBITO',"+
												"cast(sum(DBA.AcumAuxi.TotalCr)as decimal(20,0)) as 'TOTAL_CREDITO',"+
												"(CASE DBA.PLANCTA.TipoSaldo "+
													"WHEN 'D' then cast(sum(DBA.AcumAuxi.TotalDb)as decimal(20,0)) - cast(sum(DBA.AcumAuxi.TotalCr)as decimal(20,0)) "+
													"ELSE cast(sum(DBA.AcumAuxi.TotalCr)as decimal(20,0)) - cast(sum(DBA.AcumAuxi.TotalDb)as decimal(20,0)) "+
													"END) as 'SALDO' "
									} else {
										string+="cast(sum(DBA.AcumAuxi.TotalDbME)as decimal(20,0)) as 'TOTAL_DEBITO',"+
												"cast(sum(DBA.AcumAuxi.TotalCrME)as decimal(20,0)) as 'TOTAL_CREDITO',"+
												"(CASE DBA.PLANCTA.TipoSaldo "+
													"WHEN 'D' then cast(sum(DBA.AcumAuxi.TotalDbME)as decimal(20,0)) - cast(sum(DBA.AcumAuxi.TotalCrME)as decimal(20,0)) "+
													"ELSE cast(sum(DBA.AcumAuxi.TotalCrME)as decimal(20,0)) - cast(sum(DBA.AcumAuxi.TotalDbME)as decimal(20,0)) "+
													"END) as 'SALDO' "
									}
									string+="FROM "+
												"DBA.CONTROL,"+
												"DBA.PLANAUXI,"+
												"DBA.PLANCTA,"+
												"DBA.AcumAuxi "+
											"WHERE "+
												"(DBA.Control.Cod_Empresa = DBA.PLANAUXI.Cod_Empresa) AND "+
												"(DBA.Control.Periodo = DBA.PLANAUXI.Periodo) AND "+
												"(DBA.PLANAUXI.CodPlanCta = DBA.PLANCTA.CodPlanCta) AND "+
												"(DBA.PLANAUXI.Cod_Empresa = DBA.AcumAuxi.Cod_Empresa) AND "+
												"(DBA.PLANAUXI.Periodo = DBA.AcumAuxi.Periodo) AND "+
												"(DBA.PLANAUXI.CodPlanAux = DBA.AcumAuxi.CodPlanAux) AND "+
												"(DBA.PLANAUXI.CodPlanCta  = DBA.AcumAuxi.CodPlanCta) "+
												"AND (DBA.plancta.imputable = 'N') "+
												"AND (DBA.plancta.Auxiliar = 'S') "+
												"AND (DBA.PLANAUXI.Cod_Empresa = '"+empresa+"') "+
												"AND (DBA.PLANAUXI.Periodo = "+periodo+") "+
												"AND (DBA.PLANCTA.CodPlanCta >= '"+cuentad+"') "+  
												"AND (DBA.PLANCTA.CodPlanCta <= '"+cuentah+"') "
												if (nivel > 0)
													string+="AND (DBA.PLANCTA.Nivel <= "+nivel+") "
												string+="AND (DBA.AcumAuxi.AnhoMes >= "+parseInt(periodo.toString()+mesd.toString())+") "+
														"AND (DBA.AcumAuxi.AnhoMes <= "+parseInt(periodo.toString()+mesh.toString())+") "
												string+="GROUP BY "+
															"DBA.PLANAUXI.Cod_Empresa,"+
															"CTA,"+
															"DBA.PLANAUXI.Nombre,"+
															"DBA.PLANAUXI.Nivel,"+
															"DBA.PLANAUXI.Imputable,"+
															"DBA.PLANCTA.TipoSaldo,"+
															"DBA.Control.CTCtaOrden "		
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

