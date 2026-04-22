create PROCEDURE "DBA"."Gen_Informe_Despacho_PorcAranc_Rpt"( in mSession_ID char(16),in mCod_Empresa char(2),in mPeriodo char(8),in mAnho numeric(4),in mCodDespachante char(4),in mNroDespacho numeric(7),in mCierre char(1),in mTipo char(1) ) 
//A = Asiento - C = Costeo
begin
  declare err_usr exception for sqlstate value '99999';
  declare no_data_found exception for sqlstate value '02000';
  declare mFactDet_M3 numeric(10,5);
  declare mFactDet_Peso numeric(10,5);
  declare mPorcArancelario numeric(5,2);
  declare mAgregCostoAntProrr char(1);
  declare mProrratearGastoPor char(1);
  declare mTotalFactDetM3 money;
  declare mTotalFactDetPeso money;
  declare mDespFact_TotalAplicado money;
  declare mDespFact_PorcAplicado numeric(5,2);
  declare mDesp_CodMonedaCostoME char(2);
  declare mDesp_CodMonedaFleteSeg char(2);
  declare mDesp_TotalFlete money;
  declare mDesp_TotalSeguro money;
  declare mTotalArtic_Mas_Gastos money;
  declare mSubTotalArtGast money;
  declare mSubTotalGralArtGast money;
  declare mFleteArticulo money;
  declare mSeguroArticulo money;
  declare auxCostoArticulo money;
  declare mValorImpArticulo money;
  declare mTipoItemArt char(2);
  declare mTipoItemGast char(2);
  declare mTipoItemIVA char(2);
  declare mTipoItemAranc char(2);
  declare mEsMuestra char(1);
  declare mArancelCosto char(1);
  declare mIVAIncluido char(1);
  declare mTp_Def char(2);
  declare mCodProv char(4);
  declare mCod_Tp_Comp char(4);
  declare mRazonSocial varchar(60);
  declare mNroFact numeric(15);
  declare mLinea numeric(3);
  declare mRazonSocDesp varchar(60);
  declare mFechaDespacho date;
  declare mCodMoneda char(2);
  declare mCodMonedaFact char(2);
  declare mFactCambio money;
  declare mFactCambioFactProv money;
  declare mTasaCambio money;
  declare mTasaCambioCostoME money;
  declare mFactorUtilizado money;
  declare mTotalFaltantes money;
  declare mTotalFact money;
  declare mTotalArancCostos money;
  declare mTotalIVA money;
  declare mTotalFactDesp money;
  declare mTotalGralFactDesp money;
  declare mTotalPesoBrutoDesp numeric(10,2);
  declare mTotalPesoNetoDesp numeric(10,2);
  declare mPesoBruto numeric(10,2);
  declare mPesoNeto numeric(10,2);
  declare mPesoFactGastosImp numeric(10,2);
  declare mPesoBrutoMuestras numeric(10,2);
  declare mPesoNetoMuestras numeric(10,2);
  declare mPlanCtaArt char(11);
  declare mPlanAuxArt char(11);
  declare mCtaImpCurso char(11);
  declare mAuxImpCurso char(11);
  declare mCod_Articulo char(14);
  declare mCod_Familia char(4);
  declare mCod_Grupo char(4);
  declare mCodArancel char(5);
  declare mTpDefArancel char(1);
  declare mDes_Art varchar(40);
  declare auxDes_Art varchar(40);
  declare mDescrip varchar(60);
  declare mCantidad numeric(13,2);
  declare mCantFacturada numeric(13,2);
  declare mCantFaltante numeric(13,2);
  declare mCantDetalles numeric(13,2);
  declare mCantTotalFaltas numeric(13,2);
  declare mCantTotalMuestras numeric(13,2);
  declare mTotal money;
  declare mTotalFacturado money;
  declare mTotalME money;
  declare mArt_Total money;
  declare mArt_TotalME money;
  declare mArt_Prorrateo money;
  declare mArt_ProrrateoME money;
  declare mIVA money;
  declare mIVADespacho money;
  declare mIVAOtros money;
  declare mCodProvLiq char(4);
  declare mRazonSocLiq varchar(60);
  declare mPorcIncid numeric(15,10);
  declare mPorcIncidTotal numeric(15,10);
  declare mPorcIncidGastos numeric(15,10);
  declare mPorcIncidArancel numeric(15,10);
  declare mValorImponible money;
  declare mTasaVI numeric(5,2);
  declare mValorImpDecreto money;
  declare mTasaVID numeric(5,2);
  declare mIncArtMuestra numeric(15,10);
  declare mIncCantArtFact numeric(15,10);
  declare mIncArtFact numeric(15,10);
  declare gIncArtFact numeric(15,10);
  declare mIncArtGastos numeric(15,10);
  declare mIncArancCostos numeric(15,10);
  declare mIncidencia numeric(15,10);
  declare mMonedaLocal char(2);
  declare mMonedaExtranjera char(2);
  declare mCantDecimalME numeric(1);
  declare mCantDecimalGS numeric(1);
  declare mGetFactor_GastImp char(1);
  declare mProrrateoImport char(1);
  declare mLimiteFaltantes money;
  declare mMonedaLimFalt char(2);
  declare mGenAstoImport char(2);
  declare mCierreDespacho char(1);
  declare primeraVez char(1);
  declare nCount numeric(5);
  declare mPr_Unit money;
  declare mPr_UnitME money;
  declare mImporte money;
  declare mImporteME money;
  declare gImporteME money;
  declare mImporteTotal money;
  declare mImporteTotalME money;
  declare mGastImp_RazonSocial varchar(60);
  declare mGastImp_PlanCta char(11);
  declare mGastImp_PlanAux char(11);
  declare mGastImp_CodProv char(4);
  declare mGastImp_Cod_Tp_Comp char(4);
  declare mGastImp_NroFact numeric(15);
  declare mGastImp_Linea numeric(3);
  declare mGastImp_Fecha date;
  declare mGastImp_IVAIncluido char(1);
  declare mGastImp_CodMoneda char(2);
  declare mGastImp_FactCambio money;
  declare mGastImp_TotalExen money;
  declare mGastImp_TotalGrav money;
  declare mGastImp_IVA money;
  declare mGastImp_FactTotalExen money;
  declare mGastImp_FactTotalGrav money;
  declare mGastImp_FactIVA money;
  declare mGastImp_IVAME money;
  declare mGastImp_Total money;
  declare mGastImp_TotalME money;
  declare mGastImp_TotalIVA money;
  declare mGastImp_TotalIVAME money;
  declare mGastImp_TotalFactura money;
  declare mGastImp_FactCabTotal money;
  declare mGastImp_NroFactStr char(20);
  declare mGastImp_M3 numeric(10,5);
  declare mGastImp_Peso numeric(10,5);
  declare mGastImp_PorcArancelario numeric(5,2);
  declare mGastImp_AgregCostoAntProrr char(1);
  declare mGastImp_ProrratearGastoPor char(1);
  declare mProrrateo money;
  declare mTotalPro money;
  declare mTotalPro_2 money;
  declare mDifProrrateo money;
  declare mProrrateoME money;
  declare mTotalProME money;
  declare mTotalProME_2 money;
  declare mDifProrrateoME money;
  declare mArt_ProrrateoOrigen money;
  declare mImporteOrigen money;
  declare mImporteOrigenME money;
  declare mDesFamilia varchar(40);
  declare mDesGrupo varchar(40);
  declare _ARTICULO char(2);
  declare _GASTO_IMPORTACION char(2);
  declare _ARANCEL char(2);
  declare _IVA_DESPACHO char(2);
  declare _IMPUESTO_RENTA char(2);
  declare _ARTICULO_FALTANTE char(2);
  declare _GASTO_IMP_FALTANTE char(2);
  declare _IVA_DESP_FALTANTE char(2);
  declare _ARANCEL_FALTANTE char(2);
  declare _IMPORTACION char(1);
  declare _COSTO char(1);
  declare _GASTO char(1);
  declare _GRAVADO char(1);
  declare _EXENTO char(1);
  declare _LEN_CODARANCEL numeric(5);
  declare _FACTURA_MUESTRA char(2);
  declare _DESCRIP_GASTOS_IMPORTACION varchar(40);
  declare _FACTOR_CAMBIO_DESPACHO char(1);
  declare _FACTOR_CAMBIO_FACTURA char(1);
  declare _TPDEF_ARANCEL_COMUN char(1);
  declare _TPDEF_IVA_DESPACHO char(1);
  declare _TPDEF_IVA_DECRETO char(1);
  declare _TPDEF_HONORARIOS char(1);
  declare _TPDEF_DERECHO_ADUANERO char(1);
  declare _TPDEF_ANTICIPO_RENTA char(1);
  declare _PRORRATEO_X_COSTO char(1);
  declare _PRORRATEO_X_PESO_BRUTO char(1);
  declare _PRORRATEO_X_PESO_NETO char(1);
  declare _PRORRATEO_X_PORC_ARANC char(1);
  declare _DISTRIBUIR_X_PORCENTAJE char(1);
  declare _DISTRIBUIR_X_MONTO char(1);
  declare _DISTRIBUIR_X_SISTEMA char(1);
  declare _PRORRATEO_NO_APLICABLE char(1);
  declare _PRORRATEAR_X_COSTO char(1);
  declare _PRORRATEAR_X_M3 char(1);
  declare _PRORRATEAR_X_PESO char(1);
  declare _GEN_ASTO_X_DESP char(2);
  declare _GEN_ASTO_X_IMPCURSO_DESP char(2);
  declare mCodTpComp char(4);
  declare mCodArticulo char(15);
  declare mTotPorcArancel money;
  declare mPorcArancel numeric(7,4);
  declare mTotalFOB money;
  declare mCantArt numeric(3);
  declare mTotalFOBPorcArancel money;
  declare mPorcArancelFOB numeric(7,4);
  declare mMontoPorcAranc money;
  declare mTotalFOBItem money;
  declare mMontoPorcArancItem money;
  declare mTotalProrrateado money;

  declare cur_Desp dynamic scroll cursor for select df.CodProv,
      df.Cod_Tp_Comp,
      df.NroFact,
      fd.Linea,
      fc.IVAIncluido,
      fc.CodMoneda,
      fc.FactCambio,
      if(mGetFactor_GastImp = _FACTOR_CAMBIO_FACTURA) then
        fc.FactCambio
      else
        d.TasaCambio
      endif,
      d.TasaCambioCostoME,
      (select IFNULL(SUM(fd2.Cantidad*fd2.Pr_Unit),0,
        SUM(fd2.Cantidad*fd2.Pr_Unit))
        from FactDet as fd2
        where fd2.Cod_Empresa = fc.Cod_Empresa
        and fd2.CodProv = fc.CodProv
        and fd2.Cod_Tp_Comp = fc.Cod_Tp_Comp
        and fd2.NroFact = fc.NroFact
        and fd2.EsGasto = 'N') as TOTALFACT,
      (select IFNULL(SUM(fd2.IVA),0,SUM(fd2.IVA))
        from FactDet as fd2
        where fd2.Cod_Empresa = fc.Cod_Empresa
        and fd2.CodProv = fc.CodProv
        and fd2.Cod_Tp_Comp = fc.Cod_Tp_Comp
        and fd2.NroFact = fc.NroFact
        and fd2.EsGasto = 'N') as TOTALIVA,
      fc.PesoBruto,fc.PesoNeto,
      p.RazonSocial,fd.Cod_Articulo,
      fd.PlanCtaArt,fd.PlanAuxArt,
      fd.CtaImpCurso,fd.AuxImpCurso,
      a.Des_Art,a.Cod_Familia,a.Cod_Grupo,
      (fd.Cantidad-fd.CantFaltante) as CANTIDAD,
      fd.Cantidad as CANTIDAD_FACTURADA,
      0 as CANTIDAD_FALTANTE,
      fd.Pr_Unit,
      fd.Pr_Unit*(fd.Cantidad-fd.CantFaltante) as TOTAL_DETALLE,
      fd.Total as TOTAL_FACTURADO,
      fd.IVA,d.FechaDespacho,
      d.ValorImponible,d.TasaVI,
      d.ValorImpDecreto,d.TasaVID,
      t.Tp_Def,fd.EsMuestra,fd.ArancelCosto,
      (fd.Cantidad*fd.M3) as TOTAL_M3_ARTIC,
      (fd.Cantidad*fd.Peso) as TOTAL_PESO_ARTIC,
      fd.PorcArancelario,
      fd.AgregCostoAntProrr,fd.ProrratearGastoPor,
      d.CodMonedaCostoME,d.CodMonedaFleteSeg,
      d.TotalFlete,d.TotalSeguro
      from FactCab as fc,FactDet as fd,Despacho as d,DespFact as df
        ,Proveed as p,Articulo as a,TpoCbte as t
      where d.Cod_Empresa = mCod_Empresa
      and d.Anho = mAnho
      and d.CodDespachante = mCodDespachante
      and d.NroDespacho = mNroDespacho
      and d.Cod_Empresa = df.Cod_Empresa
      and d.Anho = df.Anho
      and d.CodDespachante = df.CodDespachante
      and d.NroDespacho = df.NroDespacho
      and df.Cod_Empresa = fc.Cod_Empresa
      and df.CodProv = fc.CodProv
      and df.Cod_Tp_Comp = fc.Cod_Tp_Comp
      and df.NroFact = fc.NroFact
      and fc.Cod_Empresa = p.Cod_Empresa
      and fc.CodProv = p.CodProv
      and fc.Cod_Empresa = fd.Cod_Empresa
      and fc.CodProv = fd.CodProv
      and fc.Cod_Tp_Comp = fd.Cod_Tp_Comp
      and fc.NroFact = fd.NroFact
      and fd.Cod_Empresa = a.Cod_Empresa
      and fd.Cod_Articulo = a.Cod_Articulo
      and fc.TipoCompra = _IMPORTACION
      and fc.CostoGasto = _COSTO
      and fc.Cod_Empresa = t.Cod_Empresa
      and fc.Cod_Tp_Comp = t.Cod_Tp_Comp
      and fd.EsGasto = 'N'
      order by 1 asc,2 asc,3 asc,4 asc;

  declare cur_GastImp_FactProv dynamic scroll cursor for select p.CodPlanCta,p.CodPlanAux,
      p.CodProv,p.RazonSocial,
      fc.Cod_Tp_Comp,fc.NroFact,fd.Linea,fc.FechaFact,
      fc.IVAIncluido,fc.CodMoneda,
      if(mGetFactor_GastImp = _FACTOR_CAMBIO_FACTURA) then
        fc.FactCambio
      else
        mTasaCambio
      endif,
      if(fd.GravExen = _EXENTO) then
        fd.Cantidad*fd.Pr_Unit
      else
        0
      endif as TOTAL_EXEN,
      if(fd.GravExen = _GRAVADO) then
        fd.Cantidad*fd.Pr_Unit
      else
        0
      endif as TOTAL_GRAV,
      fd.IVA as TOTALIVA,
      fc.TotalExen,fc.TotalGrav,fc.IVA,
      fc.NroFactStr,a.Des_Art,
      (fd.Cantidad*fd.M3) as TOTAL_M3_GASTO,
      (fd.Cantidad*fd.Peso) as TOTAL_PESO_GASTO,
      fd.PorcArancelario,
      fd.AgregCostoAntProrr,fd.ProrratearGastoPor
      from FactCab as fc,DespFact as df,Despacho as d,FactDet as fd
        ,Proveed as p,Articulo as a
      where df.Cod_Empresa = mCod_Empresa
      and df.Anho = mAnho
      and df.CodDespachante = mCodDespachante
      and df.NroDespacho = mNroDespacho
      and df.Cod_Empresa = d.Cod_Empresa
      and df.Anho = d.Anho
      and df.CodDespachante = d.CodDespachante
      and df.NroDespacho = d.NroDespacho
      and df.Cod_Empresa = fc.Cod_Empresa
      and df.CodProv = fc.CodProv
      and df.Cod_Tp_Comp = fc.Cod_Tp_Comp
      and df.NroFact = fc.NroFact
      and fd.Cod_Empresa = fc.Cod_Empresa
      and fd.CodProv = fc.CodProv
      and fd.Cod_Tp_Comp = fc.Cod_Tp_Comp
      and fd.NroFact = fc.NroFact
      and fd.Cod_Empresa = a.Cod_Empresa
      and fd.Cod_Articulo = a.Cod_Articulo
      and fc.Cod_Empresa = p.Cod_Empresa
      and fc.CodProv = p.CodProv
      and fc.TipoCompra = _IMPORTACION
      and fc.CostoGasto = _COSTO
      and fd.EsGasto = 'S';

  declare cur_GastImp dynamic scroll cursor for select p.CodPlanCta,p.CodPlanAux,
      p.CodProv,p.RazonSocial,
      fc.Cod_Tp_Comp,fc.NroFact,fd.Linea,
      fc.FechaFact,fc.IVAIncluido,
      fc.CodMoneda,
      if(mGetFactor_GastImp = _FACTOR_CAMBIO_FACTURA) then
        fc.FactCambio
      else
        mTasaCambio
      endif,
      (select IFNULL(SUM(fd2.Cantidad*fd2.Pr_Unit),0,
        SUM(fd2.Cantidad*fd2.Pr_Unit))
        from FactDet as fd2
        where fd2.Cod_Empresa = fd.Cod_Empresa
        and fd2.CodProv = fd.CodProv
        and fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
        and fd2.NroFact = fd.NroFact
        and fd2.Linea = fd.Linea
        and fd2.GravExen = _EXENTO) as TOTAL_EXEN,
      (select IFNULL(SUM(fd2.Cantidad*fd2.Pr_Unit),0,
        SUM(fd2.Cantidad*fd2.Pr_Unit))
        from FactDet as fd2
        where fd2.Cod_Empresa = fd.Cod_Empresa
        and fd2.CodProv = fd.CodProv
        and fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
        and fd2.NroFact = fd.NroFact
        and fd2.Linea = fd.Linea
        and fd2.GravExen = _GRAVADO) as TOTAL_GRAV,
      (select IFNULL(SUM(fd2.IVA),0,
        SUM(fd2.IVA))
        from FactDet as fd2
        where fd2.Cod_Empresa = fd.Cod_Empresa
        and fd2.CodProv = fd.CodProv
        and fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
        and fd2.NroFact = fd.NroFact
        and fd2.Linea = fd.Linea) as TOTALIVA,
      (select IFNULL(SUM(fd2.Cantidad*fd2.Pr_Unit),0,
        SUM(fd2.Cantidad*fd2.Pr_Unit))
        from FactDet as fd2
        where fd2.Cod_Empresa = fd.Cod_Empresa
        and fd2.CodProv = fd.CodProv
        and fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
        and fd2.NroFact = fd.NroFact
        and fd2.EsGasto = 'S'
        and fd2.GravExen = _EXENTO) as FACT_TOTAL_EXEN,
      (select IFNULL(SUM(fd2.Cantidad*fd2.Pr_Unit),0,
        SUM(fd2.Cantidad*fd2.Pr_Unit))
        from FactDet as fd2
        where fd2.Cod_Empresa = fd.Cod_Empresa
        and fd2.CodProv = fd.CodProv
        and fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
        and fd2.NroFact = fd.NroFact
        and fd2.EsGasto = 'S'
        and fd2.GravExen = _GRAVADO) as FACT_TOTAL_GRAV,
      (select IFNULL(SUM(fd2.IVA),0,
        SUM(fd2.IVA))
        from FactDet as fd2
        where fd2.Cod_Empresa = fd.Cod_Empresa
        and fd2.CodProv = fd.CodProv
        and fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
        and fd2.NroFact = fd.NroFact
        and fd2.EsGasto = 'S') as FACT_TOTALIVA,
      fc.NroFactStr,a.Des_Art,
      (fd.Cantidad*fd.M3) as TOTAL_M3_GASTO,
      (fd.Cantidad*fd.Peso) as TOTAL_PESO_GASTO,
      fd.PorcArancelario,
      fd.AgregCostoAntProrr,fd.ProrratearGastoPor,
      df.TotalAplicado,df.PorcAplicado
      from DespFact as df,FactCab as fc,FactDet as fd
        ,Proveed as p,Articulo as a
      where df.Cod_Empresa = mCod_Empresa
      and df.Anho = mAnho
      and df.CodDespachante = mCodDespachante
      and df.NroDespacho = mNroDespacho
      and df.Cod_Empresa = fc.Cod_Empresa
      and df.CodProv = fc.CodProv
      and df.Cod_Tp_Comp = fc.Cod_Tp_Comp
      and df.NroFact = fc.NroFact
      and fc.Cod_Empresa = fd.Cod_Empresa
      and fc.CodProv = fd.CodProv
      and fc.Cod_Tp_Comp = fd.Cod_Tp_Comp
      and fc.NroFact = fd.NroFact
      and fd.Cod_Empresa = a.Cod_Empresa
      and fd.Cod_Articulo = a.Cod_Articulo
      and fc.TipoCompra = _IMPORTACION
      and fc.CostoGasto = _GASTO
      and fd.EsGasto = 'S'
      and fc.Cod_Empresa = p.Cod_Empresa
      and fc.CodProv = p.CodProv
      and exists(select *
        from FactGastosImp as fgi
        where fc.Cod_Empresa = fgi.Cod_Empresa
        and fc.Cod_Tp_Comp = fgi.Cod_Tp_Comp
        and fc.CodProv = fgi.CodProv
        and fc.NroFact = fgi.NroFact
        and fgi.Cod_Empresa = mCod_Empresa
        and fgi.Cod_Tp_Comp = mCod_Tp_Comp
        and fgi.CodProvImp = mCodProv
        and fgi.NroFactImp = mNroFact) union
    select p.CodPlanCta,p.CodPlanAux,
      p.CodProv,p.RazonSocial,
      fc.Cod_Tp_Comp,fc.NroFact,fd.Linea,
      fc.FechaFact,fc.IVAIncluido,
      fc.CodMoneda,
      if(mGetFactor_GastImp = _FACTOR_CAMBIO_FACTURA) then
        fc.FactCambio
      else
        mTasaCambio
      endif,
      (select IFNULL(SUM(fd2.Cantidad*fd2.Pr_Unit),0,
        SUM(fd2.Cantidad*fd2.Pr_Unit))
        from FactDet as fd2
        where fd2.Cod_Empresa = fd.Cod_Empresa
        and fd2.CodProv = fd.CodProv
        and fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
        and fd2.NroFact = fd.NroFact
        and fd2.Linea = fd.Linea
        and fd2.GravExen = _EXENTO) as TOTAL_EXEN,
      (select IFNULL(SUM(fd2.Cantidad*fd2.Pr_Unit),0,
        SUM(fd2.Cantidad*fd2.Pr_Unit))
        from FactDet as fd2
        where fd2.Cod_Empresa = fd.Cod_Empresa
        and fd2.CodProv = fd.CodProv
        and fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
        and fd2.NroFact = fd.NroFact
        and fd2.Linea = fd.Linea
        and fd2.GravExen = _GRAVADO) as TOTAL_GRAV,
      (select IFNULL(SUM(fd2.IVA),0,
        SUM(fd2.IVA))
        from FactDet as fd2
        where fd2.Cod_Empresa = fd.Cod_Empresa
        and fd2.CodProv = fd.CodProv
        and fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
        and fd2.NroFact = fd.NroFact
        and fd2.Linea = fd.Linea) as TOTALIVA,
      (select IFNULL(SUM(fd2.Cantidad*fd2.Pr_Unit),0,
        SUM(fd2.Cantidad*fd2.Pr_Unit))
        from FactDet as fd2
        where fd2.Cod_Empresa = fd.Cod_Empresa
        and fd2.CodProv = fd.CodProv
        and fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
        and fd2.NroFact = fd.NroFact
        and fd2.EsGasto = 'S'
        and fd2.GravExen = _EXENTO) as FACT_TOTAL_EXEN,
      (select IFNULL(SUM(fd2.Cantidad*fd2.Pr_Unit),0,
        SUM(fd2.Cantidad*fd2.Pr_Unit))
        from FactDet as fd2
        where fd2.Cod_Empresa = fd.Cod_Empresa
        and fd2.CodProv = fd.CodProv
        and fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
        and fd2.NroFact = fd.NroFact
        and fd2.EsGasto = 'S'
        and fd2.GravExen = _GRAVADO) as FACT_TOTAL_GRAV,
      (select IFNULL(SUM(fd2.IVA),0,
        SUM(fd2.IVA))
        from FactDet as fd2
        where fd2.Cod_Empresa = fd.Cod_Empresa
        and fd2.CodProv = fd.CodProv
        and fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
        and fd2.NroFact = fd.NroFact
        and fd2.EsGasto = 'S') as FACT_TOTALIVA,
      fc.NroFactStr,a.Des_Art,
      (fd.Cantidad*fd.M3) as TOTAL_M3_GASTO,
      (fd.Cantidad*fd.Peso) as TOTAL_PESO_GASTO,
      fd.PorcArancelario,
      fd.AgregCostoAntProrr,fd.ProrratearGastoPor,
      df.TotalAplicado,df.PorcAplicado
      from DespFact as df,FactCab as fc,FactDet as fd
        ,Proveed as p,Articulo as a
      where df.Cod_Empresa = mCod_Empresa
      and df.Anho = mAnho
      and df.CodDespachante = mCodDespachante
      and df.NroDespacho = mNroDespacho
      and df.Cod_Empresa = fc.Cod_Empresa
      and df.CodProv = fc.CodProv
      and df.Cod_Tp_Comp = fc.Cod_Tp_Comp
      and df.NroFact = fc.NroFact
      and fc.Cod_Empresa = fd.Cod_Empresa
      and fc.CodProv = fd.CodProv
      and fc.Cod_Tp_Comp = fd.Cod_Tp_Comp
      and fc.NroFact = fd.NroFact
      and fd.Cod_Empresa = a.Cod_Empresa
      and fd.Cod_Articulo = a.Cod_Articulo
      and fc.TipoCompra = _IMPORTACION
      and fc.CostoGasto = _GASTO
      and fd.EsGasto = 'S'
      and fc.Cod_Empresa = p.Cod_Empresa
      and fc.CodProv = p.CodProv
      and not exists(select *
        from FactGastosImp as fgi
        where fc.Cod_Empresa = fgi.Cod_Empresa
        and fc.CodProv = fgi.CodProv
        and fc.Cod_Tp_Comp = fgi.Cod_Tp_Comp
        and fc.NroFact = fgi.NroFact);

  declare cur_VerGastImp dynamic scroll cursor for select Cod_Articulo,ProrrateoME
      from tmpdespachos
      where Session_ID = mSession_ID
      and Cod_Empresa = mCod_Empresa
      and TipoItem = _GASTO_IMPORTACION
      order by ProrrateoME desc for update;
  declare cur_VerArancel dynamic scroll cursor for select distinct CodArancel
      from tmpdespachos
      where Session_ID = mSession_ID
      and Cod_Empresa = mCod_Empresa
      and TipoItem = _ARANCEL
      order by CodArancel asc for update;
  declare cur_AplDifArancel dynamic scroll cursor for select Cod_Articulo,Prorrateo
      from tmpdespachos
      where Session_ID = mSession_ID
      and Cod_Empresa = mCod_Empresa
      and TipoItem = _ARANCEL
      and CodArancel = mCodArancel
      order by Prorrateo desc for update;
  declare cur_Arancel_Tributo_Aduanero dynamic scroll cursor for select codprov,cod_tp_comp,nrofact,cod_articulo,total,factcambio,porcarancelario,
      codarancel
      from tmpdespachos
      where Session_ID = mSession_ID
      and Cod_Empresa = mCod_Empresa
      and tpdefarancel = _TPDEF_DERECHO_ADUANERO
      order by porcarancelario asc,cod_articulo asc;

  set _IMPORTACION = 'I';
  set _COSTO = 'C';
  set _GASTO = 'G';
  set _ARTICULO = 'AR';
  set _GASTO_IMPORTACION = 'GI';
  set _IVA_DESPACHO = 'ID';
  set _ARANCEL = 'LD';
  set _IMPUESTO_RENTA = 'RE';
  set _ARTICULO_FALTANTE = 'TA';
  set _GASTO_IMP_FALTANTE = 'TG';
  set _IVA_DESP_FALTANTE = 'TI';
  set _ARANCEL_FALTANTE = 'TL';
  set _TPDEF_ARANCEL_COMUN = 'A';
  set _TPDEF_IVA_DESPACHO = 'I';
  set _TPDEF_IVA_DECRETO = 'D';
  set _TPDEF_HONORARIOS = 'H';
  set _TPDEF_DERECHO_ADUANERO = 'E';
  set _TPDEF_ANTICIPO_RENTA = 'R';
  set _LEN_CODARANCEL = 0;
  set _FACTOR_CAMBIO_DESPACHO = 'D';
  set _FACTOR_CAMBIO_FACTURA = 'F';
  set _FACTURA_MUESTRA = 'FM';
  set _DESCRIP_GASTOS_IMPORTACION = 'Fletes - Gastos de Importacion';
  set _GRAVADO = 'G';
  set _EXENTO = 'E';
  set _PRORRATEO_X_COSTO = 'C';
  set _PRORRATEO_X_PESO_BRUTO = 'P';
  set _PRORRATEO_X_PESO_NETO = 'N';
  set _PRORRATEO_X_PORC_ARANC = 'A';
  set _DISTRIBUIR_X_PORCENTAJE = 'P';
  set _DISTRIBUIR_X_MONTO = 'M';
  set _DISTRIBUIR_X_SISTEMA = 'S';
  set _PRORRATEO_NO_APLICABLE = 'N';
  set _PRORRATEAR_X_COSTO = 'C';
  set _PRORRATEAR_X_M3 = 'M';
  set _PRORRATEAR_X_PESO = 'P';
  set _GEN_ASTO_X_DESP = 'GD';
  set _GEN_ASTO_X_IMPCURSO_DESP = 'IC';

  set mCodArancel = '';
  set mTpDefArancel = '';
  set primeraVez = 'S';

  select MonedaLocal,MonedaExtranjera,
    CantDecimalME,CantDecimalGS,
    ProrrateoImport,
    LimiteFaltantes,MonedaLimFalt,
    GenAstoImport,CierreDespacho into mMonedaLocal,
    mMonedaExtranjera,
    mCantDecimalME,mCantDecimalGS,
    mProrrateoImport,
    mLimiteFaltantes,mMonedaLimFalt,
    mGenAstoImport,
    mCierreDespacho from Control
    where Cod_Empresa = mCod_Empresa
    and Periodo = mPeriodo;

  select GetFactor_GastImp,TasaCambio into mGetFactor_GastImp,mTasaCambio
    from Despacho
    where Cod_Empresa = mCod_Empresa
    and Anho = mAnho
    and CodDespachante = mCodDespachante
    and NroDespacho = mNroDespacho;

  select RazonSocial
    into mRazonSocDesp from Proveed
    where Cod_Empresa = mCod_Empresa
    and CodProv = mCodDespachante;

  select COUNT(distinct fc.CodMoneda)
    into nCount from FactCab as fc,Despacho as d,DespFact as df
    where d.Cod_Empresa = mCod_Empresa
    and d.Anho = mAnho
    and d.CodDespachante = mCodDespachante
    and d.NroDespacho = mNroDespacho
    and d.Cod_Empresa = df.Cod_Empresa
    and d.Anho = df.Anho
    and d.CodDespachante = df.CodDespachante
    and d.NroDespacho = df.NroDespacho
    and df.Cod_Empresa = fc.Cod_Empresa
    and df.CodProv = fc.CodProv
    and df.Cod_Tp_Comp = fc.Cod_Tp_Comp
    and df.NroFact = fc.NroFact
    and fc.TipoCompra = _IMPORTACION
    and fc.CostoGasto = _COSTO;
  if(nCount > 1) then
    set msjError = 'Las monedas de las facturas importadas deben ser iguales.';
    signal err_usr
  end if;

  select MAX(fc.CodMoneda),
    SUM((fd.Cantidad*fd.Pr_Unit)
    +if(fc.IVAIncluido = 'S') then
      0
    else
      fd.IVA
    endif),
    SUM(fc.PesoBruto),SUM(fc.PesoNeto),
    SUM(fd.Cantidad*fd.M3),SUM(fd.Cantidad*fd.Peso) into mCodMonedaFact,
    mTotalFactDesp,
    mTotalPesoBrutoDesp,mTotalPesoNetoDesp,
    mTotalFactDetM3,
    mTotalFactDetPeso from FactCab as fc,Despacho as d,DespFact as df,FactDet as fd
    where d.Cod_Empresa = mCod_Empresa
    and d.Anho = mAnho
    and d.CodDespachante = mCodDespachante
    and d.NroDespacho = mNroDespacho
    and d.Cod_Empresa = df.Cod_Empresa
    and d.Anho = df.Anho
    and d.CodDespachante = df.CodDespachante
    and d.NroDespacho = df.NroDespacho
    and df.Cod_Empresa = fc.Cod_Empresa
    and df.CodProv = fc.CodProv
    and df.Cod_Tp_Comp = fc.Cod_Tp_Comp
    and df.NroFact = fc.NroFact
    and fd.Cod_Empresa = fc.Cod_Empresa
    and fd.CodProv = fc.CodProv
    and fd.Cod_Tp_Comp = fc.Cod_Tp_Comp
    and fd.NroFact = fc.NroFact
    and fc.TipoCompra = _IMPORTACION
    and fc.CostoGasto = _COSTO
    and fd.EsGasto = 'N';

  select SUM((fd.Cantidad*fd.Pr_Unit)
    +if(fc.IVAIncluido = 'S') then
      0
    else
      fd.IVA
    endif)
    into mTotalGralFactDesp from FactCab as fc,Despacho as d,DespFact as df,FactDet as fd
    where d.Cod_Empresa = mCod_Empresa
    and d.Anho = mAnho
    and d.CodDespachante = mCodDespachante
    and d.NroDespacho = mNroDespacho
    and d.Cod_Empresa = df.Cod_Empresa
    and d.Anho = df.Anho
    and d.CodDespachante = df.CodDespachante
    and d.NroDespacho = df.NroDespacho
    and df.Cod_Empresa = fc.Cod_Empresa
    and df.CodProv = fc.CodProv
    and df.Cod_Tp_Comp = fc.Cod_Tp_Comp
    and df.NroFact = fc.NroFact
    and fd.Cod_Empresa = fc.Cod_Empresa
    and fd.CodProv = fc.CodProv
    and fd.Cod_Tp_Comp = fc.Cod_Tp_Comp
    and fd.NroFact = fc.NroFact
    and fc.TipoCompra = _IMPORTACION
    and fc.CostoGasto = _COSTO;

  select SUM((fd.Cantidad*fd.Pr_Unit)
    +if(fc.IVAIncluido = 'S') then
      0
    else
      fd.IVA
    endif)
    into mTotalArancCostos from FactCab as fc,FactDet as fd,Despacho as d,DespFact as df
    where d.Cod_Empresa = mCod_Empresa
    and d.Anho = mAnho
    and d.CodDespachante = mCodDespachante
    and d.NroDespacho = mNroDespacho
    and d.Cod_Empresa = df.Cod_Empresa
    and d.Anho = df.Anho
    and d.CodDespachante = df.CodDespachante
    and d.NroDespacho = df.NroDespacho
    and df.Cod_Empresa = fc.Cod_Empresa
    and df.CodProv = fc.CodProv
    and df.Cod_Tp_Comp = fc.Cod_Tp_Comp
    and df.NroFact = fc.NroFact
    and fc.Cod_Empresa = fd.Cod_Empresa
    and fc.CodProv = fd.CodProv
    and fc.Cod_Tp_Comp = fd.Cod_Tp_Comp
    and fc.NroFact = fd.NroFact
    and fc.TipoCompra = _IMPORTACION
    and fc.CostoGasto = _COSTO
    and fd.EsGasto = 'N'
    and fd.ArancelCosto = 'S';

  select IFNULL(SUM(fd.Cantidad),0,SUM(fd.Cantidad))
    into mCantTotalMuestras from FactCab as fc,FactDet as fd,Despacho as d,DespFact as df
    where d.Cod_Empresa = mCod_Empresa
    and d.Anho = mAnho
    and d.CodDespachante = mCodDespachante
    and d.NroDespacho = mNroDespacho
    and d.Cod_Empresa = df.Cod_Empresa
    and d.Anho = df.Anho
    and d.CodDespachante = df.CodDespachante
    and d.NroDespacho = df.NroDespacho
    and df.Cod_Empresa = fc.Cod_Empresa
    and df.CodProv = fc.CodProv
    and df.Cod_Tp_Comp = fc.Cod_Tp_Comp
    and df.NroFact = fc.NroFact
    and fc.Cod_Empresa = fd.Cod_Empresa
    and fc.CodProv = fd.CodProv
    and fc.Cod_Tp_Comp = fd.Cod_Tp_Comp
    and fc.NroFact = fd.NroFact
    and fc.TipoCompra = _IMPORTACION
    and fc.CostoGasto = _COSTO
    and fd.EsGasto = 'N'
    and fd.EsMuestra = 'S';

  select IFNULL(SUM(PesoBruto),0,SUM(PesoBruto)),
    IFNULL(SUM(PesoNeto),0,SUM(PesoNeto)) into mPesoBrutoMuestras,mPesoNetoMuestras
    from FactCab as fc1
    where exists(select *
      from FactCab as fc,FactDet as fd,Despacho as d,DespFact as df
      where d.Cod_Empresa = mCod_Empresa
      and d.Anho = mAnho
      and d.CodDespachante = mCodDespachante
      and d.NroDespacho = mNroDespacho
      and d.Cod_Empresa = df.Cod_Empresa
      and d.Anho = df.Anho
      and d.CodDespachante = df.CodDespachante
      and d.NroDespacho = df.NroDespacho
      and df.Cod_Empresa = fc.Cod_Empresa
      and df.CodProv = fc.CodProv
      and df.Cod_Tp_Comp = fc.Cod_Tp_Comp
      and df.NroFact = fc.NroFact
      and fc.Cod_Empresa = fd.Cod_Empresa
      and fc.CodProv = fd.CodProv
      and fc.Cod_Tp_Comp = fd.Cod_Tp_Comp
      and fc.NroFact = fd.NroFact
      and fc.TipoCompra = _IMPORTACION
      and fc.CostoGasto = _COSTO
      and fd.EsMuestra = 'S'
      and fc1.Cod_Empresa = fc.Cod_Empresa
      and fc1.CodProv = fc.CodProv
      and fc1.Cod_Tp_Comp = fc.Cod_Tp_Comp
      and fc1.NroFact = fc.NroFact);

  select IFNULL(SUM(fd.Pr_Unit*fd.CantFaltante),0,
    SUM(fd.Pr_Unit*fd.CantFaltante)),
    IFNULL(SUM(fd.CantFaltante),0,SUM(fd.CantFaltante)) into mTotalFaltantes,mCantTotalFaltas
    from FactCab as fc,FactDet as fd,Despacho as d,DespFact as df
    where d.Cod_Empresa = mCod_Empresa
    and d.Anho = mAnho
    and d.CodDespachante = mCodDespachante
    and d.NroDespacho = mNroDespacho
    and d.Cod_Empresa = df.Cod_Empresa
    and d.Anho = df.Anho
    and d.CodDespachante = df.CodDespachante
    and d.NroDespacho = df.NroDespacho
    and df.Cod_Empresa = fc.Cod_Empresa
    and df.CodProv = fc.CodProv
    and df.Cod_Tp_Comp = fc.Cod_Tp_Comp
    and df.NroFact = fc.NroFact
    and fc.Cod_Empresa = fd.Cod_Empresa
    and fc.CodProv = fd.CodProv
    and fc.Cod_Tp_Comp = fd.Cod_Tp_Comp
    and fc.NroFact = fd.NroFact
    and fc.TipoCompra = _IMPORTACION
    and fc.CostoGasto = _COSTO
    and fd.EsGasto = 'N'
    and fd.CantFaltante > 0;

  open cur_Desp;
  Despachos: loop
    fetch next cur_Desp into mCodProv,mCod_Tp_Comp,mNroFact,
      mLinea,mIVAIncluido,
      mCodMoneda,mFactCambioFactProv,
      mFactCambio,mTasaCambioCostoME,
      mTotalFact,mTotalIVA,
      mPesoBruto,mPesoNeto,
      mRazonSocial,mCod_Articulo,
      mPlanCtaArt,mPlanAuxArt,
      mCtaImpCurso,mAuxImpCurso,
      mDes_Art,mCod_Familia,mCod_Grupo,
      mCantidad,mCantFacturada,mCantFaltante,
      mPr_Unit,mTotal,mTotalFacturado,
      mIVA,mFechaDespacho,
      mValorImponible,mTasaVI,
      mValorImpDecreto,mTasaVID,
      mTp_Def,mEsMuestra,mArancelCosto,
      mFactDet_M3,mFactDet_Peso,mPorcArancelario,
      mAgregCostoAntProrr,mProrratearGastoPor,
      mDesp_CodMonedaCostoME,mDesp_CodMonedaFleteSeg,
      mDesp_TotalFlete,mDesp_TotalSeguro;
    if(sqlstate = no_data_found) then
      leave Despachos
    end if;
    if(mCantFaltante > 0) then
      set mTipoItemArt = _ARTICULO_FALTANTE;
      set mTipoItemGast = _GASTO_IMP_FALTANTE;
      set mTipoItemIVA = _IVA_DESP_FALTANTE;
      set mTipoItemAranc = _ARANCEL_FALTANTE
    else
      set mTipoItemArt = _ARTICULO;
      set mTipoItemGast = _GASTO_IMPORTACION;
      set mTipoItemIVA = _IVA_DESPACHO;
      set mTipoItemAranc = _ARANCEL
    end if;
    if(mIVAIncluido = 'S') then
      set mTotal = mTotal-mIVA
    else
      set mTotalFact = mTotalFact+mTotalIVA
    end if;
    select IFNULL(SUM(Cantidad),0,SUM(Cantidad))
      into mCantDetalles from FactDet
      where Cod_Empresa = mCod_Empresa
      and CodProv = mCodProv
      and Cod_Tp_Comp = mCod_Tp_Comp
      and NroFact = mNroFact;
    set mIncCantArtFact = mCantidad/mCantDetalles;
    if((mTp_Def = _FACTURA_MUESTRA or mEsMuestra = 'S')
      and mCantTotalMuestras > 0) then
      set mIncArtMuestra = mCantidad/mCantTotalMuestras
    else
      set mIncArtMuestra = 1
    end if;
    set mIncArtFact = mTotal/mTotalFactDesp;
    if(mIncArtFact < 0) then
      set mIncArtFact = mIncArtFact*-1
    end if;
    if(mIncArtFact = 0) then
      set mIncArtFact = 1
    end if;
    if(mTp_Def = _FACTURA_MUESTRA or mEsMuestra = 'S') then
      set mArt_Total = 0;
      set mArt_TotalME = 0;
      set mArt_Prorrateo = 0;
      set mArt_ProrrateoME = 0;
      set mArt_ProrrateoOrigen = 0
    else
      set mArt_Total = (mTotalFact*mFactCambio);
      set mArt_TotalME = mTotalFact;
      if(mCodMonedaFact = mMonedaLimFalt
        and mTotalFaltantes < mLimiteFaltantes) then
        set mTotal = ABS(mTotal);
        set mArt_Prorrateo = (mTotal*mFactCambio);
        set mArt_ProrrateoME = mTotal
      else
        if(mTotal > 0) then
          set mArt_Prorrateo = (mTotalFacturado*mFactCambio);
          set mArt_ProrrateoME = mTotalFacturado
        else
          set mArt_Prorrateo = (mTotal*mFactCambio);
          set mArt_ProrrateoME = mTotal
        end if end if end if;
    if(mCodMoneda = mMonedaLocal) then
      set mImporte = mPr_Unit;
      set mImporteME = ROUND(mPr_Unit/mFactCambio,mCantDecimalME)
    else
      set mImporte = ROUND(mPr_Unit*mFactCambio,mCantDecimalGS);
      set mImporteME = mPr_Unit
    end if;
    set mImporteOrigen = mImporte;
    set mImporteOrigenME = mImporteME;
    if(mDesp_CodMonedaFleteSeg = mCodMoneda) then
      set mFleteArticulo = mDesp_TotalFlete*mIncArtFact;
      set mSeguroArticulo = mDesp_TotalSeguro*mIncArtFact;
      set auxCostoArticulo = mTotal+mFleteArticulo+mSeguroArticulo;
      if(mCodMoneda = mMonedaLocal) then
        set mValorImpArticulo = auxCostoArticulo
      else
        set mValorImpArticulo = ROUND(TRUNCNUM(auxCostoArticulo,2)*mTasaCambio,mCantDecimalGS)
      end if
    else
      set mFleteArticulo = (mDesp_TotalFlete*(mFactCambioFactProv
        /mTasaCambio))*mIncArtFact;
      set mSeguroArticulo = (mDesp_TotalSeguro*(mFactCambioFactProv
        /mTasaCambio))*mIncArtFact;
      set auxCostoArticulo = (mTotal*(mFactCambioFactProv/mTasaCambio))
        +mFleteArticulo+mSeguroArticulo;
      if(mCodMoneda = mMonedaLocal) then
        set mValorImpArticulo = auxCostoArticulo
      else
        set mValorImpArticulo = ROUND(TRUNCNUM(auxCostoArticulo,2)*mTasaCambio,mCantDecimalGS)
      end if end if;
    select Des_Familia
      into mDesFamilia from Familia
      where Cod_Familia = mCod_Familia;
    select Des_Grupo
      into mDesGrupo from Grupo
      where Cod_Familia = mCod_Familia
      and Cod_Grupo = mCod_Grupo;
    insert into tmpdespachos( Session_ID,Cod_Empresa,CodProv,RazonSocial,
      Cod_Tp_Comp,NroFact,CodDespachante,RazonSocDesp,
      NroDespacho,FechaDespacho,CodMoneda,
      FactCambio,TipoItem,Cod_Articulo,
      PlanCtaArt,PlanAuxArt,
      CtaImpCurso,AuxImpCurso,
      CodArancel,TpDefArancel,Descrip,
      Cantidad,CantFaltantes,CantTotal,
      Total,TotalME,
      Prorrateo,ProrrateoME,
      PorcIncid,
      IVADespacho,IVAOtros,
      CodProvLiq,RazonSocLiq,
      ValorImponible,TasaVI,
      ValorImpDecreto,TasaVID,
      ValorImpArticulo,
      AjusteFaltas,PrecioUnit,PrecioUnitME,
      Cod_Familia,Cod_Grupo,
      Des_Familia,Des_Grupo ) values
      ( mSession_ID,mCod_Empresa,mCodProv,mRazonSocial,
      mCod_Tp_Comp,mNroFact,mCodDespachante,mRazonSocDesp,
      mNroDespacho,mFechaDespacho,mCodMoneda,
      mFactCambio,mTipoItemArt,mCod_Articulo,
      mPlanCtaArt,mPlanAuxArt,
      mCtaImpCurso,mAuxImpCurso,
      mCodArancel,mTpDefArancel,mDes_Art,
      mCantidad,0,mCantidad,
      mArt_Total,mArt_TotalME,
      mArt_Prorrateo,mArt_ProrrateoME,
      0,
      0,0,
      mCodProv,mRazonSocial,
      mValorImponible,mTasaVI,
      mValorImpDecreto,mTasaVID,
      mValorImpArticulo,'N',
      mImporte,mImporteME,
      mCod_Familia,mCod_Grupo,
      mDesFamilia,mDesGrupo ) ;
    set mGastImp_PlanCta = null;
    set mGastImp_PlanAux = null;
    set mGastImp_CodProv = null;
    set mGastImp_RazonSocial = null;
    set mGastImp_Cod_Tp_Comp = null;
    set mGastImp_NroFact = null;
    set mGastImp_Linea = null;
    set mGastImp_Fecha = null;
    set mGastImp_IVAIncluido = null;
    set mGastImp_CodMoneda = null;
    set mGastImp_FactCambio = null;
    set mGastImp_TotalExen = null;
    set mGastImp_TotalGrav = null;
    set mGastImp_IVA = null;
    set mGastImp_FactTotalExen = null;
    set mGastImp_FactTotalGrav = null;
    set mGastImp_FactIVA = null;
    set mGastImp_NroFactStr = null;
    set mDes_Art = null;
    set mGastImp_M3 = null;
    set mGastImp_Peso = null;
    set mGastImp_PorcArancelario = null;
    set mGastImp_AgregCostoAntProrr = null;
    set mGastImp_ProrratearGastoPor = null;
    set mGastImp_Total = 0;
    set mGastImp_TotalME = 0;
    set mGastImp_TotalIVA = 0;
    set mGastImp_TotalIVAME = 0;
    if(mCodMoneda = mMonedaLocal) then
      set mTotalArtic_Mas_Gastos = mArt_Prorrateo
    else
      set mTotalArtic_Mas_Gastos = mArt_ProrrateoME
    end if;
    open cur_GastImp_FactProv;
    GastImp_FactProv: loop
      fetch next cur_GastImp_FactProv into mGastImp_PlanCta,mGastImp_PlanAux,
        mGastImp_CodProv,mGastImp_RazonSocial,
        mGastImp_Cod_Tp_Comp,
        mGastImp_NroFact,mGastImp_Linea,
        mGastImp_Fecha,mGastImp_IVAIncluido,
        mGastImp_CodMoneda,
        mGastImp_FactCambio,
        mGastImp_TotalExen,
        mGastImp_TotalGrav,
        mGastImp_IVA,
        mGastImp_FactTotalExen,
        mGastImp_FactTotalGrav,
        mGastImp_FactIVA,
        mGastImp_NroFactStr,
        mDes_Art,
        mGastImp_M3,mGastImp_Peso,
        mGastImp_PorcArancelario,
        mGastImp_AgregCostoAntProrr,
        mGastImp_ProrratearGastoPor;
      if(sqlstate = no_data_found) then
        leave GastImp_FactProv
      end if;
      set mGastImp_TotalFactura = mGastImp_TotalExen+mGastImp_TotalGrav;
      if(mGastImp_IVAIncluido = 'S') then
        set mGastImp_TotalFactura = mGastImp_TotalFactura-mGastImp_IVA
      end if;
      set mGastImp_FactCabTotal = mGastImp_FactTotalExen+mGastImp_FactTotalGrav;
      if(mGastImp_IVAIncluido = 'S') then
        set mGastImp_FactCabTotal = mGastImp_FactCabTotal-mGastImp_FactIVA
      end if;
      if(mGastImp_CodMoneda = mMonedaLocal) then
        set mImporte = mGastImp_TotalFactura;
        set mImporteTotal = mGastImp_FactCabTotal;
        if(mGetFactor_GastImp = _FACTOR_CAMBIO_DESPACHO) then
          set mGastImp_FactCambio = mTasaCambio;
          set mImporteME = ROUND(mGastImp_TotalFactura
            /mGastImp_FactCambio,
            mCantDecimalME);
          set mImporteTotalME = ROUND(mGastImp_FactCabTotal
            /mGastImp_FactCambio,
            mCantDecimalME)
        else
          set mGastImp_FactCambio = 0;
          select Factor_Vendedor
            into mGastImp_FactCambio from FactCamb
            where CodMoneda = mMonedaExtranjera
            and "DATE"(Fact_Fecha) = "DATE"(mGastImp_Fecha);
          if(sqlstate = no_data_found or mGastImp_FactCambio = 0) then
            set mGastImp_FactCambio = mTasaCambio
          end if;
          set mImporteME = ROUND(mGastImp_TotalFactura/mGastImp_FactCambio,
            mCantDecimalME);
          set mImporteTotalME = ROUND(mGastImp_FactCabTotal/mGastImp_FactCambio,
            mCantDecimalME)
        end if
      else set mImporte = ROUND(mGastImp_TotalFactura*mGastImp_FactCambio,
          mCantDecimalGS);
        set mImporteME = ROUND(mGastImp_TotalFactura,mCantDecimalME);
        set mImporteTotal = ROUND(mGastImp_FactCabTotal*mGastImp_FactCambio,
          mCantDecimalGS);
        set mImporteTotalME = ROUND(mGastImp_FactCabTotal,mCantDecimalME)
      end if;
      set mGastImp_Total = mImporteTotal;
      set mGastImp_TotalME = mImporteTotalME;
      if(mGastImp_ProrratearGastoPor = _PRORRATEAR_X_M3) then
        set mIncArtFact = mFactDet_M3/mTotalFactDetM3
      elseif(mGastImp_ProrratearGastoPor = _PRORRATEAR_X_PESO) then
        set mIncArtFact = mFactDet_Peso/mTotalFactDetPeso
      end if;
      if(mIncArtFact < 0) then
        set mIncArtFact = mIncArtFact*-1
      end if;
      select COUNT()
        into nCount from FactGastosImp
        where Cod_Empresa = mCod_Empresa
        and CodProv = mGastImp_CodProv
        and Cod_Tp_Comp = mGastImp_Cod_Tp_Comp
        and NroFact = mGastImp_NroFact;
      if(nCount > 0) then
        select if(mProrrateoImport = _PRORRATEO_X_PESO_BRUTO) then
            IFNULL(SUM(PesoBruto),0,SUM(PesoBruto))
          else if(mProrrateoImport = _PRORRATEO_X_PESO_NETO) then
              IFNULL(SUM(PesoNeto),0,SUM(PesoNeto))
            endif
          endif
          into mPesoFactGastosImp from FactCab as fc
          where exists(select *
            from FactGastosImp as fgi
            where fgi.Cod_Empresa = mCod_Empresa
            and fgi.CodProv = mGastImp_CodProv
            and fgi.NroFact = mGastImp_NroFact
            and fgi.Cod_Empresa = fc.Cod_Empresa
            and fgi.CodProvImp = fc.CodProv
            and fgi.NroFactImp = fc.NroFact);
        if(mProrrateoImport = _PRORRATEO_X_PESO_BRUTO) then
          set mIncArtGastos = mPesoBruto/mPesoFactGastosImp
        elseif(mProrrateoImport = _PRORRATEO_X_PESO_NETO) then
          set mIncArtGastos = mPesoNeto/mPesoFactGastosImp
        else
          set mIncArtGastos = mIncArtFact
        end if
      else set mIncArtGastos = 1
      end if;
      if(mTp_Def = _FACTURA_MUESTRA or mEsMuestra = 'S') then
        set mImporte = (mImporte*mIncArtGastos)*mIncArtFact;
        set mImporteME = (mImporteME*mIncArtGastos)*mIncArtFact;
        set mPorcIncidTotal = mIncArtGastos*mIncArtFact
      else
        if(mTotal = 0) then
          set mImporte = 0;
          set mImporteME = 0;
          set mPorcIncidTotal = 0
        else
          set mImporte = (mImporte*mIncArtGastos)*mIncArtFact;
          set mImporteME = (mImporteME*mIncArtGastos)*mIncArtFact;
          set mPorcIncidTotal = mIncArtGastos*mIncArtFact
        end if end if;
      if(mGastImp_AgregCostoAntProrr = 'S') then
        if(mCodMoneda = mMonedaLocal) then
          set mTotalArtic_Mas_Gastos = mTotalArtic_Mas_Gastos+mImporte
        else
          set mTotalArtic_Mas_Gastos = mTotalArtic_Mas_Gastos+mImporteME
        end if end if;
      set auxDes_Art = STRING(mDes_Art,' (Fact. Prov. Ext.)');
      insert into tmpdespachos( Session_ID,Cod_Empresa,CodProv,
        RazonSocial,Cod_Tp_Comp,NroFact,CodDespachante,
        RazonSocDesp,NroDespacho,FechaDespacho,
        CodMoneda,FactCambio,TipoItem,
        Cod_Articulo,
        PlanCtaArt,PlanAuxArt,
        CtaImpCurso,AuxImpCurso,
        CodArancel,TpDefArancel,Descrip,Cantidad,
        Total,TotalME,
        Prorrateo,ProrrateoME,
        PorcIncid,PorcIncidTotal,
        IVADespacho,IVAOtros,
        CodProvLiq,RazonSocLiq,
        NroFactLiq,
        ValorImponible,TasaVI,
        ValorImpDecreto,TasaVID,
        ValorImpArticulo,
        AjusteFaltas,
        Cod_Familia,Cod_Grupo ) values
        ( mSession_ID,mCod_Empresa,mCodProv,mRazonSocial,
        mCod_Tp_Comp,mNroFact,mCodDespachante,
        mRazonSocDesp,mNroDespacho,mFechaDespacho,
        mCodMoneda,mFactCambio,mTipoItemGast,
        mCod_Articulo,
        mPlanCtaArt,mPlanAuxArt,
        mCtaImpCurso,mAuxImpCurso,
        mCodArancel,mTpDefArancel,auxDes_Art,null,
        mGastImp_Total,mGastImp_TotalME,
        mImporte,mImporteME,
        0,mPorcIncidTotal,
        0,0,
        mGastImp_CodProv,mGastImp_RazonSocial,
        mGastImp_NroFact,
        mValorImponible,mTasaVI,
        mValorImpDecreto,mTasaVID,
        mValorImpArticulo,'N',
        mCod_Familia,mCod_Grupo ) 
    end loop GastImp_FactProv;
    close cur_GastImp_FactProv;
    if((mCodMoneda = mMonedaLocal and mTotalArtic_Mas_Gastos > mArt_Prorrateo)
      or(mCodMoneda = mMonedaExtranjera and mTotalArtic_Mas_Gastos > mArt_ProrrateoME)) then
      set mIncArtFact = mTotalArtic_Mas_Gastos/mTotalGralFactDesp;
      if(mIncArtFact < 0) then
        set mIncArtFact = mIncArtFact*-1
      end if;
      if(mIncArtFact = 0) then
        set mIncArtFact = 1
      end if end if;
    set mGastImp_PlanCta = null;
    set mGastImp_PlanAux = null;
    set mGastImp_CodProv = null;
    set mGastImp_RazonSocial = null;
    set mGastImp_Cod_Tp_Comp = null;
    set mGastImp_NroFact = null;
    set mGastImp_Linea = null;
    set mGastImp_Fecha = null;
    set mGastImp_IVAIncluido = null;
    set mGastImp_CodMoneda = null;
    set mGastImp_FactCambio = null;
    set mGastImp_TotalExen = null;
    set mGastImp_TotalGrav = null;
    set mGastImp_IVA = null;
    set mGastImp_FactTotalExen = null;
    set mGastImp_FactTotalGrav = null;
    set mGastImp_FactIVA = null;
    set mGastImp_NroFactStr = null;
    set mDes_Art = null;
    set mGastImp_M3 = null;
    set mGastImp_Peso = null;
    set mGastImp_PorcArancelario = null;
    set mGastImp_AgregCostoAntProrr = null;
    set mGastImp_ProrratearGastoPor = null;
    set mGastImp_Total = 0;
    set mGastImp_TotalME = 0;
    set mGastImp_TotalIVA = 0;
    set mGastImp_TotalIVAME = 0;
    set gIncArtFact = mIncArtFact;
    open cur_GastImp;
    GastImp: loop
      fetch next cur_GastImp into mGastImp_PlanCta,mGastImp_PlanAux,
        mGastImp_CodProv,mGastImp_RazonSocial,
        mGastImp_Cod_Tp_Comp,
        mGastImp_NroFact,mGastImp_Linea,
        mGastImp_Fecha,mGastImp_IVAIncluido,
        mGastImp_CodMoneda,
        mGastImp_FactCambio,
        mGastImp_TotalExen,
        mGastImp_TotalGrav,
        mGastImp_IVA,
        mGastImp_FactTotalExen,
        mGastImp_FactTotalGrav,
        mGastImp_FactIVA,
        mGastImp_NroFactStr,
        mDes_Art,
        mGastImp_M3,mGastImp_Peso,
        mGastImp_PorcArancelario,
        mGastImp_AgregCostoAntProrr,
        mGastImp_ProrratearGastoPor,
        mDespFact_TotalAplicado,
        mDespFact_PorcAplicado;
      if(sqlstate = no_data_found) then
        leave GastImp
      end if;
      set mGastImp_TotalFactura = mGastImp_TotalExen+mGastImp_TotalGrav;
      if(mGastImp_IVAIncluido = 'S') then
        set mGastImp_TotalFactura = mGastImp_TotalFactura-mGastImp_IVA
      end if;
      set mGastImp_FactCabTotal = mGastImp_FactTotalExen+mGastImp_FactTotalGrav;
      if(mGastImp_IVAIncluido = 'S') then
        set mGastImp_FactCabTotal = mGastImp_FactCabTotal-mGastImp_FactIVA
      end if;
      set mIncidencia = mGastImp_TotalFactura/mGastImp_FactCabTotal;
      if(mIncidencia < 0) then
        set mIncidencia = mIncidencia*-1
      end if;
      set mDespFact_TotalAplicado = mDespFact_TotalAplicado*mIncidencia;
      if(mDespFact_PorcAplicado > 0) then
        set mGastImp_TotalFactura = mGastImp_TotalFactura
          *mDespFact_PorcAplicado/100.0
      elseif(mDespFact_TotalAplicado > 0) then
        if(mDespFact_TotalAplicado > mGastImp_TotalFactura) then
          set mDespFact_TotalAplicado = mGastImp_TotalFactura
        end if;
        set mGastImp_TotalFactura = mDespFact_TotalAplicado
      end if;
      if(mGastImp_CodMoneda = mMonedaLocal) then
        set mImporte = mGastImp_TotalFactura;
        set mImporteTotal = mGastImp_FactCabTotal;
        if(mGetFactor_GastImp = _FACTOR_CAMBIO_DESPACHO) then
          set mGastImp_FactCambio = mTasaCambio;
          set mImporteME = ROUND(mGastImp_TotalFactura
            /mGastImp_FactCambio,
            mCantDecimalME);
          set mImporteTotalME = ROUND(mGastImp_FactCabTotal
            /mGastImp_FactCambio,
            mCantDecimalME)
        else
          select Factor_Vendedor
            into mGastImp_FactCambio from FactCamb
            where CodMoneda = mMonedaExtranjera
            and "DATE"(Fact_Fecha) = "DATE"(mGastImp_Fecha);
          if(sqlstate = no_data_found) then
            set mImporteME = 0;
            set mImporteTotalME = 0
          else
            set mImporteME = ROUND(mGastImp_TotalFactura
              /mGastImp_FactCambio,
              mCantDecimalME);
            set mImporteTotalME = ROUND(mGastImp_FactCabTotal
              /mGastImp_FactCambio,
              mCantDecimalME)
          end if
        end if
      else set mImporte = ROUND(mGastImp_TotalFactura*mGastImp_FactCambio,
          mCantDecimalGS);
        set mImporteME = ROUND(mGastImp_TotalFactura,mCantDecimalME);
        set mImporteTotal = ROUND(mGastImp_FactCabTotal*mGastImp_FactCambio,
          mCantDecimalGS);
        set mImporteTotalME = ROUND(mGastImp_FactCabTotal,mCantDecimalME)
      end if;
      set mGastImp_Total = mImporteTotal;
      set mGastImp_TotalME = mImporteTotalME;
      if(mGastImp_ProrratearGastoPor = _PRORRATEAR_X_M3) then
        set mIncArtFact = mFactDet_M3/mTotalFactDetM3
      elseif(mGastImp_ProrratearGastoPor = _PRORRATEAR_X_PESO) then
        set mIncArtFact = mFactDet_Peso/mTotalFactDetPeso
      else
        set mIncArtFact = gIncArtFact
      end if;
      if(mIncArtFact < 0) then
        set mIncArtFact = mIncArtFact*-1
      end if;
      select COUNT()
        into nCount from FactGastosImp
        where Cod_Empresa = mCod_Empresa
        and CodProv = mGastImp_CodProv
        and Cod_Tp_Comp = mGastImp_Cod_Tp_Comp
        and NroFact = mGastImp_NroFact;
      if(nCount > 0) then
        select if(mProrrateoImport = _PRORRATEO_X_PESO_BRUTO) then
            IFNULL(SUM(PesoBruto),0,SUM(PesoBruto))
          else if(mProrrateoImport = _PRORRATEO_X_PESO_NETO) then
              IFNULL(SUM(PesoNeto),0,SUM(PesoNeto))
            endif
          endif
          into mPesoFactGastosImp from FactCab as fc
          where exists(select *
            from FactGastosImp as fgi
            where fgi.Cod_Empresa = mCod_Empresa
            and fgi.CodProv = mGastImp_CodProv
            and fgi.NroFact = mGastImp_NroFact
            and fgi.Cod_Empresa = fc.Cod_Empresa
            and fgi.CodProvImp = fc.CodProv
            and fgi.NroFactImp = fc.NroFact);
        if(mProrrateoImport = _PRORRATEO_X_PESO_BRUTO) then
          set mIncArtGastos = mPesoBruto/mPesoFactGastosImp
        elseif(mProrrateoImport = _PRORRATEO_X_PESO_NETO) then
          set mIncArtGastos = mPesoNeto/mPesoFactGastosImp
        else
          set mIncArtGastos = mIncArtFact
        end if
      else set mIncArtGastos = 1
      end if;
      if(mTp_Def = _FACTURA_MUESTRA or mEsMuestra = 'S') then
        set mImporte = (mImporte*mIncArtGastos)*mIncArtFact;
        set mImporteME = (mImporteME*mIncArtGastos)*mIncArtFact;
        set mPorcIncidTotal = mIncArtGastos*mIncArtFact
      else
        if(mTotal = 0) then
          set mImporte = 0;
          set mImporteME = 0;
          set mPorcIncidTotal = 0
        else
          set mImporte = (mImporte*mIncArtGastos)*mIncArtFact;
          set mImporteME = (mImporteME*mIncArtGastos)*mIncArtFact;
          set mPorcIncidTotal = mIncArtGastos*mIncArtFact
        end if end if;
      insert into tmpdespachos( Session_ID,Cod_Empresa,CodProv,
        RazonSocial,Cod_Tp_Comp,NroFact,CodDespachante,
        RazonSocDesp,NroDespacho,FechaDespacho,
        CodMoneda,FactCambio,TipoItem,
        Cod_Articulo,
        PlanCtaArt,PlanAuxArt,
        CtaImpCurso,AuxImpCurso,
        CodArancel,TpDefArancel,Descrip,Cantidad,
        Total,TotalME,
        Prorrateo,ProrrateoME,
        PorcIncid,PorcIncidTotal,
        IVADespacho,IVAOtros,
        CodProvLiq,RazonSocLiq,
        NroFactLiq,
        ValorImponible,TasaVI,
        ValorImpDecreto,TasaVID,
        ValorImpArticulo,
        AjusteFaltas,
        Cod_Familia,Cod_Grupo ) values
        ( mSession_ID,mCod_Empresa,mCodProv,mRazonSocial,
        mCod_Tp_Comp,mNroFact,mCodDespachante,
        mRazonSocDesp,mNroDespacho,mFechaDespacho,
        mCodMoneda,mFactCambio,mTipoItemGast,
        mCod_Articulo,
        mPlanCtaArt,mPlanAuxArt,
        mCtaImpCurso,mAuxImpCurso,
        mCodArancel,mTpDefArancel,mDes_Art,null,
        mGastImp_Total,mGastImp_TotalME,
        mImporte,mImporteME,
        0,mPorcIncidTotal,
        0,0,
        mGastImp_CodProv,mGastImp_RazonSocial,
        mGastImp_NroFact,
        mValorImponible,mTasaVI,
        mValorImpDecreto,mTasaVID,
        mValorImpArticulo,'N',
        mCod_Familia,mCod_Grupo ) 
    end loop GastImp;
    close cur_GastImp;

    if(mArancelCosto = 'S') then
      set mSubTotalArtGast = 0;
      set mSubTotalGralArtGast = 0;
      select SUM(ProrrateoME)
        into mSubTotalArtGast from tmpdespachos
        where Session_ID = mSession_ID
        and Cod_Empresa = mCod_Empresa
        and Cod_Articulo = mCod_Articulo
        and TipoItem in( _ARTICULO,_GASTO_IMPORTACION ) ;
      select SUM(ProrrateoME)
        into mSubTotalGralArtGast from tmpdespachos
        where Session_ID = mSession_ID
        and Cod_Empresa = mCod_Empresa
        and TipoItem in( _ARTICULO,_GASTO_IMPORTACION ) ;
      set mIncArancCostos = mTotal/mTotalArancCostos;
      if(mIncArancCostos < 0) then
        set mIncArancCostos = mIncArancCostos*-1
      end if;
      insert into tmpdespachos( Session_ID,Cod_Empresa,CodProv,RazonSocial,
        Cod_Tp_Comp,NroFact,CodDespachante,RazonSocDesp,
        NroDespacho,FechaDespacho,
        CodMoneda,FactCambio,TipoItem,
        Cod_Articulo,
        PlanCtaArt,PlanAuxArt,
        CtaImpCurso,AuxImpCurso,
        CodArancel,TpDefArancel,Descrip,
        Cantidad,Total,TotalME,
        Prorrateo,ProrrateoME,
        PorcIncid,PorcIncidTotal,
        IVADespacho,IVAOtros,
        CodProvLiq,RazonSocLiq,
        ValorImponible,TasaVI,
        ValorImpDecreto,TasaVID,
        ValorImpArticulo,
        AjusteFaltas,
        Cod_Familia,Cod_Grupo ) 
        select mSession_ID,mCod_Empresa,mCodProv,mRazonSocial,
          mCod_Tp_Comp,mNroFact,mCodDespachante,mRazonSocDesp,
          mNroDespacho,d.FechaDespacho,
          mCodMoneda,mFactCambio,mTipoItemAranc,
          mCod_Articulo,
          if(mCierreDespacho = 'S'
          and mCierre = 'N'
          and mGenAstoImport = _GEN_ASTO_X_IMPCURSO_DESP) then
            l.CodPlanCta
          else
            mPlanCtaArt
          endif as PLANCTAART,
          if(mCierreDespacho = 'S'
          and mCierre = 'N'
          and mGenAstoImport = _GEN_ASTO_X_IMPCURSO_DESP) then
            l.CodPlanAux
          else
            mPlanAuxArt
          endif as PLANAUXART,
          mCtaImpCurso,mAuxImpCurso,
          REPLICATE('0',_LEN_CODARANCEL-Length(Trim(l.CodArancel)))
          +Trim(l.CodArancel),
          a.TpDef,a.Descrip,null as CANTIDAD,
          if(d.CodMoneda = mMonedaLocal) then
            if(a.TpDef = _TPDEF_IVA_DECRETO and l.Af_Costos = 'S') then
              if(mTipo = 'A') then
                SUM(l.Exento+l.Gravado+l.IVA)
              else
                SUM(l.TotalAplicado)
              endif
            else
              if(mTipo = 'A') then
                SUM(l.Exento+l.Gravado)
              else
                SUM(l.TotalAplicado)
              endif
            endif
          else
            if(a.TpDef = _TPDEF_IVA_DECRETO and l.Af_Costos = 'S') then
              if(mTipo = 'A') then
                SUM((l.Exento+l.Gravado+l.IVA)*mFactCambio)
              else
                SUM(l.TotalAplicado*mFactCambio)
              endif
            else
              if(mTipo = 'A') then
                SUM((l.Exento+l.Gravado)*mFactCambio)
              else
                SUM(l.TotalAplicado*mFactCambio)
              endif
            endif
          endif as TOTAL,
          if(d.CodMoneda = mMonedaLocal) then
            if(a.TpDef = _TPDEF_IVA_DECRETO and l.Af_Costos = 'S') then
              if(mTipo = 'A') then
                SUM(ROUND((l.Exento+l.Gravado+l.IVA)/mFactCambio,mCantDecimalME))
              else
                SUM(ROUND((l.TotalAplicado)/mFactCambio,mCantDecimalME))
              endif
            else
              if(mTipo = 'A') then
                SUM(ROUND((l.Exento+l.Gravado)/mFactCambio,mCantDecimalME))
              else
                SUM(ROUND((l.TotalAplicado)/mFactCambio,mCantDecimalME))
              endif
            endif
          else
            if(a.TpDef = _TPDEF_IVA_DECRETO and l.Af_Costos = 'S') then
              if(mTipo = 'A') then
                SUM(l.Exento+l.Gravado+l.IVA)
              else
                SUM(l.TotalAplicado)
              endif
            else
              if(mTipo = 'A') then
                SUM(l.Exento+l.Gravado)
              else
                SUM(l.TotalAplicado)
              endif
            endif
          endif as TOTALME,
          if(d.CodMoneda = mMonedaLocal) then
            if(a.TpDef = _TPDEF_IVA_DECRETO and l.Af_Costos = 'S') then
              if(mTipo = 'A') then
                SUM((l.Exento+l.Gravado+l.IVA)*mIncArancCostos)
              else
                SUM((l.TotalAplicado)*mIncArancCostos)
              endif
            else
              if(a.TpDef = _TPDEF_DERECHO_ADUANERO) then
                SUM(((mValorImpArticulo*mPorcArancelario)/100.0))
              else
                if(mTipo = 'A') then
                  SUM((l.Exento+l.Gravado)*mIncArancCostos)
                else
                  SUM((l.TotalAplicado)*mIncArancCostos)
                endif
              endif
            endif
          else
            if(a.TpDef = _TPDEF_IVA_DECRETO and l.Af_Costos = 'S') then
              if(mTipo = 'A') then
                SUM((l.Exento+l.Gravado+l.IVA)*mFactCambio*mIncArancCostos)
              else
                SUM((l.TotalAplicado)*mFactCambio*mIncArancCostos)
              endif
            else
              if(a.TpDef = _TPDEF_DERECHO_ADUANERO) then
                SUM(((mValorImpArticulo*mPorcArancelario)/100.0)*mFactCambio)
              else
                if(mTipo = 'A') then
                  SUM((l.Exento+l.Gravado)*mFactCambio*mIncArancCostos)
                else
                  SUM((l.TotalAplicado)*mFactCambio*mIncArancCostos)
                endif
              endif
            endif
          endif as PRORRATEO,
          if(d.CodMoneda = mMonedaLocal) then
            if(a.TpDef = _TPDEF_IVA_DECRETO and l.Af_Costos = 'S') then
              if(mTipo = 'A') then
                SUM(ROUND(((l.Exento+l.Gravado+l.IVA)/mFactCambio)*mIncArancCostos,mCantDecimalME))
              else
                SUM(ROUND(((l.TotalAplicado)/mFactCambio)*mIncArancCostos,mCantDecimalME))
              endif
            else
              if(a.TpDef = _TPDEF_DERECHO_ADUANERO) then
                SUM((((mValorImpArticulo*mPorcArancelario)/100.0)/mFactCambio))
              else
                if(mTipo = 'A') then
                  SUM(ROUND(((l.Exento+l.Gravado)/mFactCambio)*mIncArancCostos,mCantDecimalME))
                else
                  SUM(ROUND(((l.TotalAplicado)/mFactCambio)*mIncArancCostos,mCantDecimalME))
                endif
              endif
            endif
          else
            if(a.TpDef = _TPDEF_IVA_DECRETO and l.Af_Costos = 'S') then
              if(mTipo = 'A') then
                SUM(ROUND((l.Exento+l.Gravado+l.IVA)*mIncArancCostos,mCantDecimalME))
              else
                SUM(ROUND((l.TotalAplicado)*mIncArancCostos,mCantDecimalME))
              endif
            else
              if(a.TpDef = _TPDEF_DERECHO_ADUANERO) then
                SUM(((mValorImpArticulo*mPorcArancelario)/100.0))
              else
                if(mTipo = 'A') then
                  SUM(ROUND((l.Exento+l.Gravado)*mIncArancCostos,mCantDecimalME))
                else
                  SUM(ROUND((l.TotalAplicado)*mIncArancCostos,mCantDecimalME))
                endif
              endif
            endif
          endif as PRORRATEOME,
          0,
          if(a.TpDef = _TPDEF_DERECHO_ADUANERO) then
            (mTotal/mTotalArancCostos)
          else
            (mSubTotalArtGast/mSubTotalGralArtGast)
          endif,
          0 as IVADESPACHO,
          if(primeraVez = 'S' and a.TpDef <> _TPDEF_IVA_DECRETO) then
            SUM(l.IVA)
          else
            0
          endif as IVAOTROS,
          l.CodProv,p.RazonSocial,
          d.ValorImponible,d.TasaVI,
          d.ValorImpDecreto,d.TasaVID,
          mValorImpArticulo,'N',
          mCod_Familia,mCod_Grupo
          from Despacho as d,Liquidacion as l,Proveed as p,Aranceles as a
          where d.Cod_Empresa = mCod_Empresa
          and d.Anho = mAnho
          and d.CodDespachante = mCodDespachante
          and d.NroDespacho = mNroDespacho
          and d.Cod_Empresa = l.Cod_Empresa
          and d.Anho = l.Anho
          and d.CodDespachante = l.CodDespachante
          and d.NroDespacho = l.NroDespacho
          and l.Cod_Empresa = p.Cod_Empresa
          and l.CodProv = p.CodProv
          and l.Cod_Empresa = a.Cod_Empresa
          and l.CodArancel = a.CodArancel
          and a.TpDef <> _TPDEF_IVA_DESPACHO
          and l.Af_Costos = 'S'
          group by d.FechaDespacho,l.CodPlanCta,l.CodPlanAux,
          l.CodArancel,a.Descrip,
          d.CodMoneda,l.CodProv,p.RazonSocial,
          d.ValorImponible,d.TasaVI,
          d.ValorImpDecreto,d.TasaVID,
          l.Af_Costos,a.TpDef;
      if(primeraVez = 'S') then
        insert into tmpdespachos( Session_ID,Cod_Empresa,CodProv,RazonSocial,
          Cod_Tp_Comp,NroFact,CodDespachante,RazonSocDesp,
          NroDespacho,FechaDespacho,
          CodMoneda,FactCambio,TipoItem,
          Cod_Articulo,
          PlanCtaArt,PlanAuxArt,
          CtaImpCurso,AuxImpCurso,
          CodArancel,
          TpDefArancel,Descrip,Cantidad,
          Total,TotalME,Prorrateo,ProrrateoME,
          PorcIncid,PorcIncidTotal,
          IVADespacho,IVAOtros,
          CodProvLiq,RazonSocLiq,
          ValorImponible,TasaVI,
          ValorImpDecreto,TasaVID,
          ValorImpArticulo,
          AjusteFaltas,
          Cod_Familia,Cod_Grupo ) 
          select mSession_ID,mCod_Empresa,mCodProv,mRazonSocial,
            mCod_Tp_Comp,mNroFact,mCodDespachante,mRazonSocDesp,
            mNroDespacho,d.FechaDespacho,
            mCodMoneda,mFactCambio,mTipoItemIVA,
            mCod_Articulo,
            mPlanCtaArt,mPlanAuxArt,
            mCtaImpCurso,mAuxImpCurso,
            REPLICATE('0',_LEN_CODARANCEL-Length(Trim(l.CodArancel)))
            +Trim(l.CodArancel),
            a.TpDef,a.Descrip,null,
            0,0,0,0,
            0,
            mIncArancCostos,
            l.IVA as IVADESPACHO,0,
            l.CodProv,p.RazonSocial,
            d.ValorImponible,d.TasaVI,
            d.ValorImpDecreto,d.TasaVID,
            mValorImpArticulo,'N',
            mCod_Familia,mCod_Grupo
            from Despacho as d,Liquidacion as l,Proveed as p,Aranceles as a
            where d.Cod_Empresa = mCod_Empresa
            and d.Anho = mAnho
            and d.CodDespachante = mCodDespachante
            and d.NroDespacho = mNroDespacho
            and d.Cod_Empresa = l.Cod_Empresa
            and d.Anho = l.Anho
            and d.CodDespachante = l.CodDespachante
            and d.NroDespacho = l.NroDespacho
            and l.Cod_Empresa = p.Cod_Empresa
            and l.CodProv = p.CodProv
            and l.Cod_Empresa = a.Cod_Empresa
            and l.CodArancel = a.CodArancel
            and a.TpDef = _TPDEF_IVA_DESPACHO;
        insert into tmpdespachos( Session_ID,Cod_Empresa,CodProv,RazonSocial,
          Cod_Tp_Comp,NroFact,CodDespachante,RazonSocDesp,
          NroDespacho,FechaDespacho,
          CodMoneda,FactCambio,TipoItem,
          Cod_Articulo,
          PlanCtaArt,PlanAuxArt,
          CtaImpCurso,AuxImpCurso,
          CodArancel,
          TpDefArancel,Descrip,Cantidad,
          Total,TotalME,Prorrateo,ProrrateoME,
          PorcIncid,PorcIncidTotal,
          IVADespacho,IVAOtros,
          CodProvLiq,RazonSocLiq,
          ValorImponible,TasaVI,
          ValorImpDecreto,TasaVID,
          ValorImpArticulo,
          AjusteFaltas,
          Cod_Familia,Cod_Grupo ) 
          select mSession_ID,mCod_Empresa,mCodProv,mRazonSocial,
            mCod_Tp_Comp,mNroFact,mCodDespachante,mRazonSocDesp,
            mNroDespacho,d.FechaDespacho,
            mCodMoneda,mFactCambio,mTipoItemIVA,
            mCod_Articulo,
            mPlanCtaArt,mPlanAuxArt,
            mCtaImpCurso,mAuxImpCurso,
            REPLICATE('0',_LEN_CODARANCEL-Length(Trim(l.CodArancel)))
            +Trim(l.CodArancel),
            a.TpDef,a.Descrip,null,
            0,0,0,0,
            0,
            mIncArancCostos,
            l.IVA as IVADESPACHO,
            0,
            l.CodProv,p.RazonSocial,
            d.ValorImponible,d.TasaVI,
            d.ValorImpDecreto,d.TasaVID,
            mValorImpArticulo,'N',
            mCod_Familia,mCod_Grupo
            from Despacho as d,Liquidacion as l,Proveed as p,Aranceles as a
            where d.Cod_Empresa = mCod_Empresa
            and d.Anho = mAnho
            and d.CodDespachante = mCodDespachante
            and d.NroDespacho = mNroDespacho
            and d.Cod_Empresa = l.Cod_Empresa
            and d.Anho = l.Anho
            and d.CodDespachante = l.CodDespachante
            and d.NroDespacho = l.NroDespacho
            and l.Cod_Empresa = p.Cod_Empresa
            and l.CodProv = p.CodProv
            and l.Cod_Empresa = a.Cod_Empresa
            and l.CodArancel = a.CodArancel
            and a.TpDef = _TPDEF_IVA_DECRETO;
        insert into tmpdespachos( Session_ID,Cod_Empresa,CodProv,RazonSocial,
          Cod_Tp_Comp,NroFact,CodDespachante,RazonSocDesp,
          NroDespacho,FechaDespacho,
          CodMoneda,FactCambio,TipoItem,
          Cod_Articulo,
          PlanCtaArt,PlanAuxArt,
          CtaImpCurso,AuxImpCurso,
          CodArancel,
          TpDefArancel,Descrip,Cantidad,
          Total,TotalME,Prorrateo,ProrrateoME,
          PorcIncid,PorcIncidTotal,
          IVADespacho,IVAOtros,
          CodProvLiq,RazonSocLiq,
          ValorImponible,TasaVI,
          ValorImpDecreto,TasaVID,
          ValorImpArticulo,
          AjusteFaltas,
          Cod_Familia,Cod_Grupo ) 
          select mSession_ID,mCod_Empresa,mCodProv,mRazonSocial,
            mCod_Tp_Comp,mNroFact,mCodDespachante,mRazonSocDesp,
            mNroDespacho,d.FechaDespacho,
            mCodMoneda,mFactCambio,_IMPUESTO_RENTA,
            null as COD_ARTICULO,
            l.CodPlanCta,l.CodPlanAux,
            mCtaImpCurso,mAuxImpCurso,
            REPLICATE('0',_LEN_CODARANCEL-Length(Trim(l.CodArancel)))
            +Trim(l.CodArancel),
            a.TpDef,a.Descrip,null,
            if(d.CodMoneda = mMonedaLocal) then
              if(mTipo = 'A') then
                SUM(l.Exento+l.Gravado)
              else
                SUM(l.TotalAplicado)
              endif
            else
              if(mTipo = 'A') then
                SUM((l.Exento+l.Gravado)*mFactCambio)
              else
                SUM((l.TotalAplicado)*mFactCambio)
              endif
            endif as TOTAL,
            if(d.CodMoneda = mMonedaLocal) then
              if(mTipo = 'A') then
                SUM(ROUND((l.Exento+l.Gravado)/mFactCambio,mCantDecimalME))
              else
                SUM(ROUND((l.TotalAplicado)/mFactCambio,mCantDecimalME))
              endif
            else
              if(mTipo = 'A') then
                SUM(l.Exento+l.Gravado)
              else
                SUM(l.TotalAplicado)
              endif
            endif as TOTALME,
            if(d.CodMoneda = mMonedaLocal) then
              if(mTipo = 'A') then
                SUM(l.Exento+l.Gravado)
              else
                SUM(l.TotalAplicado)
              endif
            else
              if(mTipo = 'A') then
                SUM((l.Exento+l.Gravado)*mFactCambio)
              else
                SUM((l.TotalAplicado)*mFactCambio)
              endif
            endif as PRORRATEO,
            if(d.CodMoneda = mMonedaLocal) then
              if(mTipo = 'A') then
                SUM(ROUND((l.Exento+l.Gravado)/mFactCambio,mCantDecimalME))
              else
                SUM(ROUND((l.TotalAplicado)/mFactCambio,mCantDecimalME))
              endif
            else
              if(mTipo = 'A') then
                SUM(l.Exento+l.Gravado)
              else
                SUM(l.TotalAplicado)
              endif
            endif as PRORRATEOME,
            0 as PORCINCID,
            0 as PORCINCIDTOTAL,
            0 as IVADESPACHO,
            0 as IVAOTROS,
            l.CodProv,p.RazonSocial,
            d.ValorImponible,d.TasaVI,
            d.ValorImpDecreto,d.TasaVID,
            0 as VALORIMPARTICULO,'N',
            null as COD_FAMILIA,
            null as COD_GRUPO
            from Despacho as d,Liquidacion as l,Proveed as p,Aranceles as a
            where d.Cod_Empresa = mCod_Empresa
            and d.Anho = mAnho
            and d.CodDespachante = mCodDespachante
            and d.NroDespacho = mNroDespacho
            and d.Cod_Empresa = l.Cod_Empresa
            and d.Anho = l.Anho
            and d.CodDespachante = l.CodDespachante
            and d.NroDespacho = l.NroDespacho
            and l.Cod_Empresa = p.Cod_Empresa
            and l.CodProv = p.CodProv
            and l.Cod_Empresa = a.Cod_Empresa
            and l.CodArancel = a.CodArancel
            and a.TpDef = _TPDEF_ANTICIPO_RENTA
            and l.Af_Costos = 'N'
            group by d.FechaDespacho,l.CodPlanCta,l.CodPlanAux,
            l.CodArancel,a.Descrip,
            d.CodMoneda,l.CodProv,p.RazonSocial,
            d.ValorImponible,d.TasaVI,
            d.ValorImpDecreto,d.TasaVID,
            l.Af_Costos,a.TpDef;
        set primeraVez = 'N'
      end if
    end if
  end loop Despachos;
  close cur_Desp;

  set mTotalProrrateado = 0;
  open cur_Arancel_Tributo_Aduanero;
  Tributo_Aduanero: loop
    fetch next cur_Arancel_Tributo_Aduanero into mCodProv,mCodTpComp,mNroFact,mCodArticulo,
      mTotPorcArancel,mFactCambio,mPorcArancel,mCodArancel;
    if(sqlstate = no_data_found) then
      leave Tributo_Aduanero
    end if;
    select count()
      into mCantArt from factdet
      where cod_empresa = mCod_Empresa
      and codprov = mCodProv
      and cod_tp_comp = mCodTpComp
      and nrofact = mNroFact
      and cod_articulo = mCodArticulo;
    if mCantArt > 1 then
      set msjError = 'Los Articulos no se pueden repetir en la misma factura del proveedor.';
      signal err_usr
    end if;
    select porcarancelario
      into mPorcArancel from factdet
      where cod_empresa = mCod_Empresa
      and codprov = mCodProv
      and cod_tp_comp = mCodTpComp
      and nrofact = mNroFact
      and cod_articulo = mCodArticulo;
    if mPorcArancel > 0 then
      select sum(cantidad*pr_unit)
        into mTotalFOB from factdet
        where cod_empresa = mCod_Empresa
        and codprov = mCodProv
        and cod_tp_comp = mCodTpComp
        and nrofact = mNroFact;
      select sum(cantidad*pr_unit)
        into mTotalFOBPorcArancel from factdet
        where cod_empresa = mCod_Empresa
        and codprov = mCodProv
        and cod_tp_comp = mCodTpComp
        and nrofact = mNroFact
        and porcarancelario = mPorcArancel;
      set mPorcArancelFOB = round((mTotalFOBPorcArancel*100)/mTotalFOB,4);
      set mMontoPorcAranc = round((mPorcArancelFOB*mTotPorcArancel)/100,2);
      select cantidad*pr_unit
        into mTotalFOBItem from factdet
        where cod_empresa = mCod_Empresa
        and codprov = mCodProv
        and cod_tp_comp = mCodTpComp
        and nrofact = mNroFact
        and cod_articulo = mCodArticulo
        and porcarancelario = mPorcArancel;
      set mPorcArancelFOB = round((mTotalFOBItem*100)/mTotalFOBPorcArancel,4);
      set mMontoPorcArancItem = round((mPorcArancelFOB*mMontoPorcAranc)/100,2);
      set mTotalProrrateado = mTotalProrrateado+mMontoPorcArancItem;
      update tmpdespachos
        set prorrateo = mMontoPorcArancItem,
        prorrateome = round(mMontoPorcArancItem/mFactCambio,2)
        where session_id = mSession_ID
        and cod_empresa = mCod_Empresa
        and codprov = mCodProv
        and cod_tp_comp = mCodTpComp
        and nrofact = mNroFact
        and cod_articulo = mCodArticulo
        and codarancel = mCodArancel
    end if
  end loop Tributo_Aduanero;
  close cur_Arancel_Tributo_Aduanero;

  if(mTotalProrrateado-mTotPorcArancel) <> 0 then
    update tmpdespachos
      set prorrateo = prorrateo+((mTotalProrrateado-mTotPorcArancel)*-1),
      prorrateome = prorrateome+round(((mTotalProrrateado-mTotPorcArancel)*-1)/mFactCambio,2)
      where session_id = mSession_ID
      and cod_empresa = mCod_Empresa
      and codprov = mCodProv
      and cod_tp_comp = mCodTpComp
      and nrofact = mNroFact
      and cod_articulo = mCodArticulo
      and codarancel = mCodArancel
  end if;

  if(mTasaCambio <> mTasaCambioCostoME) then
    update tmpdespachos
      set ProrrateoME = ROUND(Prorrateo/mTasaCambioCostoME,mCantDecimalME)
      where Session_ID = mSession_ID
      and Cod_Empresa = mCod_Empresa
  end if;

  update tmpdespachos as t1
    set PorcIncid = Prorrateo*100.0/(select if(SUM(Prorrateo) = 0) then
        1
      else
        SUM(Prorrateo)
      endif
      from tmpdespachos as t2
      where t1.Session_ID = t2.Session_ID
      and t1.Cod_Empresa = t2.Cod_Empresa
      and t1.NroFact = t2.NroFact
      and t1.Cod_Articulo = t2.Cod_Articulo
      group by Cod_Articulo),
    CostoTotal = (select IFNULL(SUM(ROUND(Prorrateo,mCantDecimalGS)),
      0,
      SUM(ROUND(Prorrateo,mCantDecimalGS)))
      from tmpdespachos as t2
      where t1.Session_ID = t2.Session_ID
      and t1.Cod_Empresa = t2.Cod_Empresa
      and t1.NroFact = t2.NroFact
      and t1.Cod_Articulo = t2.Cod_Articulo
      group by Cod_Articulo),
    CostoTotalME = (select IFNULL(SUM(ROUND(ProrrateoME,mCantDecimalME)),
      0,
      SUM(ROUND(ProrrateoME,mCantDecimalME)))
      from tmpdespachos as t2
      where t1.Session_ID = t2.Session_ID
      and t1.Cod_Empresa = t2.Cod_Empresa
      and t1.NroFact = t2.NroFact
      and t1.Cod_Articulo = t2.Cod_Articulo
      group by Cod_Articulo),
    CantFaltantes = (select IFNULL(SUM(CantFaltantes),0,
      SUM(CantFaltantes))
      from tmpdespachos as t2
      where t1.Session_ID = t2.Session_ID
      and t1.Cod_Empresa = t2.Cod_Empresa
      and t1.NroFact = t2.NroFact
      and t1.Cod_Articulo = t2.Cod_Articulo
      group by Cod_Articulo)
    where Session_ID = mSession_ID
    and Cod_Empresa = mCod_Empresa;
  update tmpdespachos as t1
    set CostoUnitario = ROUND(CostoTotal/(select SUM(Cantidad)
      from tmpdespachos as t2
      where t1.Session_ID = t2.Session_ID
      and t1.Cod_Empresa = t2.Cod_Empresa
      and t1.NroFact = t2.NroFact
      and t1.Cod_Articulo = t2.Cod_Articulo
      and t2.Cantidad > 0
      group by Cod_Articulo),mCantDecimalGS),
    CostoUnitarioME = ROUND(CostoTotalME/(select SUM(Cantidad)
      from tmpdespachos as t2
      where t1.Session_ID = t2.Session_ID
      and t1.Cod_Empresa = t2.Cod_Empresa
      and t1.NroFact = t2.NroFact
      and t1.Cod_Articulo = t2.Cod_Articulo
      and t2.Cantidad > 0
      group by Cod_Articulo),mCantDecimalME)
    where Session_ID = mSession_ID
    and Cod_Empresa = mCod_Empresa;
end

