ALTER PROCEDURE "DBA"."Gen_Informe_Despacho_Costo_Rpt" ( in mSession_ID       char(16),
                                              in mCod_Empresa      char(2),
                                              in mPeriodo          char(8),
                                              in mAnho             numeric(4),
                                              in mCodDespachante   char(4),
                                              in mNroDespacho      numeric(7) )
begin
   declare err_usr exception for sqlstate '99999';
   declare no_data_found exception for sqlstate '02000';

   //
   // Tipos de ITEMS...
   //
   declare _ARTICULO                     char(2);
   declare _GASTO_IMPORTACION            char(2);
   declare _ARANCEL                      char(2);
   declare _IVA_DESPACHO                 char(2);
   declare _ARTICULO_FALTANTE            char(2);
   declare _GASTO_IMP_FALTANTE           char(2);
   declare _IVA_DESP_FALTANTE            char(2);
   declare _ARANCEL_FALTANTE             char(2);

   declare _IMPORTACION                  char(1);
   declare _COSTO                        char(1);
   declare _GASTO                        char(1);
   declare _GRAVADO                      char(1);
   declare _EXENTO                       char(1);
   declare _LEN_CODARANCEL               numeric(5);
   declare _FACTURA_MUESTRA              char(2);
   declare _DESCRIP_GASTOS_IMPORTACION   varchar(40);

   declare _FACTOR_CAMBIO_DESPACHO       char(1);
   declare _FACTOR_CAMBIO_FACTURA        char(1);

   declare _TPDEF_ARANCEL_COMUN          char(1);
   declare _TPDEF_IVA_DESPACHO           char(1);
   declare _TPDEF_IVA_DECRETO            char(1);
   declare _TPDEF_HONORARIOS             char(1);
   declare _PRORRATEO_X_COSTO            char(1);
   declare _PRORRATEO_X_PESO_BRUTO       char(1);
   declare _PRORRATEO_X_PESO_NETO        char(1);

   declare mTipoItemArt             char(2);
   declare mTipoItemGast            char(2);
   declare mTipoItemIVA             char(2);
   declare mTipoItemAranc           char(2);
   declare mEsMuestra               char(1);
   declare mArancelCosto            char(1);
   declare mIVAIncluido             char(1);
   declare mTp_Def                  char(2);
   declare mCodProv                 char(4);
   declare mCod_Tp_Comp             char(4);
   declare mRazonSocial             varchar(60);
   declare mNroFact                 numeric(15);
   declare mLinea                   numeric(3);
   declare mRazonSocDesp            varchar(60);
   declare mFechaDespacho           date;
   declare mCodMoneda               char(2);
   declare mCodMonedaFact           char(2);
   declare mFactCambio              money;
   declare mTasaCambio              money;
   declare mTasaCambioCostoME       money;
   declare mTotalFaltantes          money;
   declare mTotalFact               money;
   declare mTotalArancCostos        money;
   declare mTotalIVA                money;
   declare mTotalFactDesp           money;
   declare mTotalPesoBrutoDesp      numeric(10,2);
   declare mTotalPesoNetoDesp       numeric(10,2);
   declare mPesoBruto               numeric(10,2);
   declare mPesoNeto                numeric(10,2);
   declare mPesoFactGastosImp       numeric(10,2);
   declare mPesoBrutoMuestras       numeric(10,2);
   declare mPesoNetoMuestras        numeric(10,2);
   declare mPlanCtaArt              char(11);
   declare mPlanAuxArt              char(11);
   declare mCod_Articulo            char(14);
   declare mCod_Familia             char(4);
   declare mCod_Grupo               char(4);
   declare mCodArancel              char(5);
   declare mTpDefArancel            char(1);
   declare mDes_Art                 varchar(40);
   declare mDescrip                 varchar(60);
   declare mCantidad                numeric(13,2);
   declare mCantFacturada           numeric(13,2);
   declare mCantFaltante            numeric(13,2);
   declare mCantDetalles            numeric(13,2);
   declare mCantTotalFaltas         numeric(13,2);
   declare mCantTotalMuestras       numeric(13,2);
   declare mTotal                   money;
   declare mTotalFacturado          money;
   declare mTotalME                 money;
   declare mArt_Total               money;
   declare mArt_TotalME             money;
   declare mArt_Prorrateo           money;
   declare mArt_ProrrateoME         money;
   declare mIVA                     money;
   declare mIVADespacho             money;
   declare mIVAOtros                money;
   declare mCodProvLiq              char(4);
   declare mRazonSocLiq             varchar(60);
   declare mPorcIncid               numeric(15,10);
   declare mPorcIncidTotal          numeric(15,10);
   declare mPorcIncidGastos         numeric(15,10);
   declare mPorcIncidArancel        numeric(15,10);
   declare mValorImponible          money;
   declare mTasaVI                  numeric(5,2);
   declare mValorImpDecreto         money;
   declare mTasaVID                 numeric(5,2);
   declare mIncArtMuestra           numeric(15,10);
   declare mIncCantArtFact          numeric(15,10);
   declare mIncArtFact              numeric(15,10);
   declare mIncArtFactDesp          numeric(15,10);
   declare mIncArtGastos            numeric(15,10);
   declare mIncArancCostos          numeric(15,10);
   declare mMonedaLocal             char(2);
   declare mMonedaExtranjera        char(2);
   declare mCantDecimalME           numeric(1);
   declare mCantDecimalGS           numeric(1);
   declare mProrrateoImport         char(1);
   declare mLimiteFaltantes         money;
   declare mMonedaLimFalt           char(2);
   declare mGetFactor_GastImp       char(1);

   declare primeraVez               char(1);

   declare nCount                   numeric(5);
   declare mPr_Unit                 money;
   declare mPr_UnitME               money;
   declare mImporte                 money;
   declare mImporteME               money;
   declare gImporteME               money;
   declare mImporteTotal            money;
   declare mImporteTotalME          money;

   declare mGastImp_RazonSocial     varchar(60);
   declare mGastImp_PlanCta         char(11);
   declare mGastImp_PlanAux         char(11);
   declare mGastImp_CodProv         char(4);
   declare mGastImp_Cod_Tp_Comp     char(4);
   declare mGastImp_NroFact         numeric(15);
   declare mGastImp_Linea           numeric(3);
   declare mGastImp_Fecha           date;
   declare mGastImp_IVAIncluido     char(1);
   declare mGastImp_CodMoneda       char(2);
   declare mGastImp_FactCambio      money;
   declare mGastImp_TotalExen       money;
   declare mGastImp_TotalGrav       money;
   declare mGastImp_IVA             money;
   declare mGastImp_FactTotalExen   money;
   declare mGastImp_FactTotalGrav   money;
   declare mGastImp_FactIVA         money;
   declare mGastImp_IVAME           money;
   declare mGastImp_Total           money;
   declare mGastImp_TotalME         money;
   declare mGastImp_TotalIVA        money;
   declare mGastImp_TotalIVAME      money;
   declare mGastImp_TotalFactura    money;
   declare mGastImp_FactCabTotal    money;
   declare mGastImp_NroFactStr      char(20);

   declare mProrrateo               money;
   declare mTotalPro                money;
   declare mTotalPro_2              money;
   declare mDifProrrateo            money;
   declare mProrrateoME             money;
   declare mTotalProME              money;
   declare mTotalProME_2            money;
   declare mDifProrrateoME          money;

   declare mArt_ProrrateoOrigen     money;
   declare mImporteOrigen           money;
   declare mImporteOrigenME         money;
   declare mDesFamilia              varchar(40);
   declare mDesGrupo                varchar(40);

   declare cur_Desp cursor for
           SELECT df.CodProv, df.Cod_Tp_Comp, df.NroFact,
                  fd.Linea, fc.IVAIncluido,
                  fc.CodMoneda, d.TasaCambio, d.TasaCambioCostoME,

                  //
                  // A partir de la implementacion de ACE, se agrega
                  // que solo sean considerados los que NO SON GASTOS
                  // (que se configura en el detalle de la factura),
                  // por lo que se debe sumar los totales de los detalles...
                  //
                  // 2005-11-08
                  //
                  // (fc.TotalExen + fc.TotalGrav), fc.IVA,
                  //
                  (SELECT IFNULL ( SUM(fd2.Cantidad * fd2.Pr_Unit), 0,
                                   SUM(fd2.Cantidad * fd2.Pr_Unit) )
                   FROM   FactDet fd2
                   WHERE  fd2.Cod_Empresa = fc.Cod_Empresa
                   AND    fd2.CodProv     = fc.CodProv
                   AND    fd2.Cod_Tp_Comp = fc.Cod_Tp_Comp
                   AND    fd2.NroFact     = fc.NroFact
                   AND    fd2.EsGasto     = 'N') AS TOTALFACT,

                  (SELECT IFNULL ( SUM(fd2.IVA), 0, SUM(fd2.IVA) )
                   FROM   FactDet fd2
                   WHERE  fd2.Cod_Empresa = fc.Cod_Empresa
                   AND    fd2.CodProv     = fc.CodProv
                   AND    fd2.Cod_Tp_Comp = fc.Cod_Tp_Comp
                   AND    fd2.NroFact     = fc.NroFact
                   AND    fd2.EsGasto     = 'N') AS TOTALIVA,

                  fc.PesoBruto, fc.PesoNeto,
                  p.RazonSocial, fd.Cod_Articulo,
                  fd.PlanCtaArt, fd.PlanAuxArt,
                  a.Des_Art, a.Cod_Familia, a.Cod_Grupo,

                  //
                  // La cantidad que finalmente se considera
                  // en todos los procesos es la cantidad que llega
                  // a deposito, es decir, lo facturado menos
                  // lo faltante (si no hubo faltantes, el campo
                  // en cuestion tendria CERO)...
                  //
                  (fd.Cantidad - fd.CantFaltante) CANTIDAD,
                  fd.Cantidad                     CANTIDAD_FACTURADA,
                  0                               CANTIDAD_FALTANTE,

                  fd.Pr_Unit,
                  fd.Pr_Unit * (fd.Cantidad - fd.CantFaltante)  TOTAL_DETALLE,
                  fd.Total     TOTAL_FACTURADO,

                  fd.IVA, d.FechaDespacho,
                  d.ValorImponible, d.TasaVI,
                  d.ValorImpDecreto, d.TasaVID,
                  t.Tp_Def, fd.EsMuestra, fd.ArancelCosto

           FROM   FactCab fc, FactDet fd, Despacho d, DespFact df,
                  Proveed p, Articulo a, TpoCbte t
           WHERE  d.Cod_Empresa     = mCod_Empresa
           AND    d.Anho            = mAnho
           AND    d.CodDespachante  = mCodDespachante
           AND    d.NroDespacho     = mNroDespacho
           AND    d.Cod_Empresa     = df.Cod_Empresa
           AND    d.Anho            = df.Anho
           AND    d.CodDespachante  = df.CodDespachante
           AND    d.NroDespacho     = df.NroDespacho
           AND    df.Cod_Empresa    = fc.Cod_Empresa
           AND    df.CodProv        = fc.CodProv
           AND    df.Cod_Tp_Comp    = fc.Cod_Tp_Comp
           AND    df.NroFact        = fc.NroFact
           AND    fc.Cod_Empresa    = p.Cod_Empresa
           AND    fc.CodProv        = p.CodProv
           AND    fc.Cod_Empresa    = fd.Cod_Empresa
           AND    fc.CodProv        = fd.CodProv
           AND    fc.Cod_Tp_Comp    = fd.Cod_Tp_Comp
           AND    fc.NroFact        = fd.NroFact
           AND    fd.Cod_Empresa    = a.Cod_Empresa
           AND    fd.Cod_Articulo   = a.Cod_Articulo
           AND    fc.TipoCompra     = _IMPORTACION
           AND    fc.CostoGasto     = _COSTO
           AND    fc.Cod_Empresa    = t.Cod_Empresa
           AND    fc.Cod_Tp_Comp    = t.Cod_Tp_Comp
           //
           // A partir de la implementacion de ACE, se agrega
           // que solo sean considerados los que NO SON GASTOS
           // (que se configura en el detalle de la factura)...
           //
           // 2005-11-08
           //
           AND    fd.EsGasto        = 'N'
           ;

   //
   // Ver la lista de facturas para actualizar los costos...
   //

   declare cur_GastImp cursor for
           SELECT p.CodPlanCta, p.CodPlanAux,
                  p.CodProv, p.RazonSocial,
                  fc.Cod_Tp_Comp, fc.NroFact, fd.Linea,
                  fc.FechaFact, fc.IVAIncluido,
                  fc.CodMoneda,

                  //
                  // El factor de cambio se parametriza de donde se quita:
                  // si del despacho o de la factura...
                  //
                  IF ( mGetFactor_GastImp = _FACTOR_CAMBIO_FACTURA ) THEN
                     fc.FactCambio
                  ELSE
                     mTasaCambio // TASA DE CAMBIO DEL DESPACHO...
                  ENDIF,

                  //
                  // En vez de usar los totales de la cabecera,
                  // se usan del detalle...
                  //
                  // 2007/07/10
                  //
                  // fc.TotalExen, fc.TotalGrav, fc.IVA,
                  //
                  (SELECT IFNULL ( SUM(fd2.Cantidad * fd2.Pr_Unit), 0,
                                   SUM(fd2.Cantidad * fd2.Pr_Unit) )
                   FROM   FactDet fd2
                   WHERE  fd2.Cod_Empresa = fd.Cod_Empresa
                   AND    fd2.CodProv     = fd.CodProv
                   AND    fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
                   AND    fd2.NroFact     = fd.NroFact
                   AND    fd2.Linea       = fd.Linea
                   AND    fd2.GravExen    = _EXENTO ) AS TOTAL_EXEN,

                  (SELECT IFNULL ( SUM(fd2.Cantidad * fd2.Pr_Unit), 0,
                                   SUM(fd2.Cantidad * fd2.Pr_Unit) )
                   FROM   FactDet fd2
                   WHERE  fd2.Cod_Empresa = fd.Cod_Empresa
                   AND    fd2.CodProv     = fd.CodProv
                   AND    fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
                   AND    fd2.NroFact     = fd.NroFact
                   AND    fd2.Linea       = fd.Linea
                   AND    fd2.GravExen    = _GRAVADO) AS TOTAL_GRAV,

                  (SELECT IFNULL ( SUM(fd2.IVA), 0,
                                   SUM(fd2.IVA) )
                   FROM   FactDet fd2
                   WHERE  fd2.Cod_Empresa = fd.Cod_Empresa
                   AND    fd2.CodProv     = fd.CodProv
                   AND    fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
                   AND    fd2.NroFact     = fd.NroFact
                   AND    fd2.Linea       = fd.Linea) AS TOTALIVA,

                  fc.TotalExen, fc.TotalGrav, fc.IVA,

                  fc.NroFactStr, a.Des_Art

           FROM   DespFact df, FactCab fc, FactDet fd,
                  Proveed p, Articulo a

           WHERE  df.Cod_Empresa    = mCod_Empresa
           AND    df.Anho           = mAnho
           AND    df.CodDespachante = mCodDespachante
           AND    df.NroDespacho    = mNroDespacho
           AND    df.Cod_Empresa    = fc.Cod_Empresa
           AND    df.CodProv        = fc.CodProv
           AND    df.Cod_Tp_Comp    = fc.Cod_Tp_Comp
           AND    df.NroFact        = fc.NroFact
           AND    fc.Cod_Empresa    = fd.Cod_Empresa
           AND    fc.CodProv        = fd.CodProv
           AND    fc.Cod_Tp_Comp    = fd.Cod_Tp_Comp
           AND    fc.NroFact        = fd.NroFact
           AND    fd.Cod_Empresa    = a.Cod_Empresa
           AND    fd.Cod_Articulo   = a.Cod_Articulo
           AND    fc.TipoCompra     = _IMPORTACION
           AND    fc.CostoGasto     = _GASTO
           AND    fc.Cod_Empresa    = p.Cod_Empresa
           AND    fc.CodProv        = p.CodProv
           //
           // Se agrega esto:
           //
           // Se verifica a cuales facturas afectan los gastos,
           // si esta asignado el gasto a la factura que
           // se analiza en ese momento...
           //
           // marzo/2002x
           //
           AND    EXISTS (SELECT *
                          FROM   FactGastosImp fgi
                          WHERE  fc.Cod_Empresa  = fgi.Cod_Empresa
                          AND    fc.Cod_Tp_Comp  = fgi.Cod_Tp_Comp
                          AND    fc.CodProv      = fgi.CodProv
                          AND    fc.NroFact      = fgi.NroFact
                          AND    fgi.Cod_Empresa = mCod_Empresa
                          AND    fgi.Cod_Tp_Comp = mCod_Tp_Comp
                          AND    fgi.CodProvImp  = mCodProv
                          AND    fgi.NroFactImp  = mNroFact)

           //
           // ...o....
           //
           // si la factura de gasto de importacion se aplica
           // a todas las facturas del despacho (no fue
           // asignada a ninguna factura en particular)...
           //
           // marzo/2002
           //
           UNION

           SELECT p.CodPlanCta, p.CodPlanAux,
                  p.CodProv, p.RazonSocial,
                  fc.Cod_Tp_Comp, fc.NroFact, fd.Linea,
                  fc.FechaFact, fc.IVAIncluido,
                  fc.CodMoneda,

                  //
                  // El factor de cambio se parametriza de donde se quita:
                  // si del despacho o de la factura...
                  //
                  IF ( mGetFactor_GastImp = _FACTOR_CAMBIO_FACTURA ) THEN
                     fc.FactCambio
                  ELSE
                     mTasaCambio // TASA DE CAMBIO DEL DESPACHO...
                  ENDIF,

                  //
                  // En vez de usar los totales de la cabecera,
                  // se usan del detalle...
                  //
                  // 2007/07/10
                  //
                  // fc.TotalExen, fc.TotalGrav, fc.IVA,
                  //
                  (SELECT IFNULL ( SUM(fd2.Cantidad * fd2.Pr_Unit), 0,
                                   SUM(fd2.Cantidad * fd2.Pr_Unit) )
                   FROM   FactDet fd2
                   WHERE  fd2.Cod_Empresa = fd.Cod_Empresa
                   AND    fd2.CodProv     = fd.CodProv
                   AND    fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
                   AND    fd2.NroFact     = fd.NroFact
                   AND    fd2.Linea       = fd.Linea
                   AND    fd2.GravExen    = _EXENTO ) AS TOTAL_EXEN,

                  (SELECT IFNULL ( SUM(fd2.Cantidad * fd2.Pr_Unit), 0,
                                   SUM(fd2.Cantidad * fd2.Pr_Unit) )
                   FROM   FactDet fd2
                   WHERE  fd2.Cod_Empresa = fd.Cod_Empresa
                   AND    fd2.CodProv     = fd.CodProv
                   AND    fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
                   AND    fd2.NroFact     = fd.NroFact
                   AND    fd2.Linea       = fd.Linea
                   AND    fd2.GravExen    = _GRAVADO) AS TOTAL_GRAV,

                  (SELECT IFNULL ( SUM(fd2.IVA), 0,
                                   SUM(fd2.IVA) )
                   FROM   FactDet fd2
                   WHERE  fd2.Cod_Empresa = fd.Cod_Empresa
                   AND    fd2.CodProv     = fd.CodProv
                   AND    fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp
                   AND    fd2.NroFact     = fd.NroFact
                   AND    fd2.Linea       = fd.Linea) AS TOTALIVA,

                  fc.TotalExen, fc.TotalGrav, fc.IVA,

                  fc.NroFactStr, a.Des_Art

           FROM   DespFact df, FactCab fc, FactDet fd,
                  Proveed p, Articulo a
           WHERE  df.Cod_Empresa    = mCod_Empresa
           AND    df.Anho           = mAnho
           AND    df.CodDespachante = mCodDespachante
           AND    df.NroDespacho    = mNroDespacho
           AND    df.Cod_Empresa    = fc.Cod_Empresa
           AND    df.CodProv        = fc.CodProv
           AND    df.Cod_Tp_Comp    = fc.Cod_Tp_Comp
           AND    df.NroFact        = fc.NroFact
           AND    fc.Cod_Empresa    = fd.Cod_Empresa
           AND    fc.CodProv        = fd.CodProv
           AND    fc.Cod_Tp_Comp    = fd.Cod_Tp_Comp
           AND    fc.NroFact        = fd.NroFact
           AND    fd.Cod_Empresa    = a.Cod_Empresa
           AND    fd.Cod_Articulo   = a.Cod_Articulo
           AND    fc.TipoCompra     = _IMPORTACION
           AND    fc.CostoGasto     = _GASTO
           AND    fc.Cod_Empresa    = p.Cod_Empresa
           AND    fc.CodProv        = p.CodProv
           AND    NOT EXISTS (SELECT *
                              FROM   FactGastosImp fgi
                              WHERE  fc.Cod_Empresa = fgi.Cod_Empresa
                              AND    fc.CodProv     = fgi.CodProv
                              AND    fc.Cod_Tp_Comp = fgi.Cod_Tp_Comp
                              AND    fc.NroFact     = fgi.NroFact)
           //
           //
           // PRF SE QUITA POR AHORA PARA PROBAR LO DE ANCLA!!!
           //
           // 2007/07/10
           //
           // //
           // // A partir de la implementacion de ACE, se agrega
           // // que solo sean considerados los que NO SON GASTOS
           // // (que se configura en el detalle de la factura)...
           // //
           // // 2005-11-08
           // //
           // UNION
           //
           // SELECT p.CodPlanCta, p.CodPlanAux,
           //        p.CodProv, p.RazonSocial,
           //        fc.Cod_Tp_Comp, fc.NroFact, fd.Linea, fc.FechaFact,
           //        fc.IVAIncluido, fc.CodMoneda,
           //
           //        //
           //        // El factor de cambio se parametriza de donde se quita:
           //        // si del despacho o de la factura...
           //        //
           //        IF ( mGetFactor_GastImp = _FACTOR_CAMBIO_FACTURA ) THEN
           //           fc.FactCambio
           //        ELSE
           //           mTasaCambio // TASA DE CAMBIO DEL DESPACHO...
           //        ENDIF,
           //
           //        (SELECT IFNULL ( SUM(fd2.Cantidad * fd2.Pr_Unit), 0,
           //                         SUM(fd2.Cantidad * fd2.Pr_Unit) )
           //         FROM   FactDet fd2
           //         WHERE  fd2.Cod_Empresa = fc.Cod_Empresa
           //         AND    fd2.CodProv     = fc.CodProv
           //         AND    fd2.Cod_Tp_Comp = fc.Cod_Tp_Comp
           //         AND    fd2.NroFact     = fc.NroFact
           //         AND    fd2.GravExen    = _EXENTO
           //         AND    fd2.EsGasto     = 'S') AS TOTAL_EXEN,
           //
           //
           //        //
           //        // prf
           //        //
           //        // (SELECT IFNULL ( SUM ( IF (fc.IVAIncluido = 'S' ) THEN
           //        //                           (fd2.Cantidad * fd2.Pr_Unit) - fd2.IVA
           //        //                        ELSE
           //        //                           fd2.Cantidad * fd2.Pr_Unit
           //        //                        ENDIF
           //        //                       ),
           //        //                  0,
           //        //                  SUM ( IF (fc.IVAIncluido = 'S' ) THEN
           //        //                           (fd2.Cantidad * fd2.Pr_Unit) - fd2.IVA
           //        //                        ELSE
           //        //                           fd2.Cantidad * fd2.Pr_Unit
           //        //                        ENDIF
           //        //                       )
           //        //                )
           //        (SELECT IFNULL ( SUM(fd2.Cantidad * fd2.Pr_Unit), 0,
           //                         SUM(fd2.Cantidad * fd2.Pr_Unit) )
           //         FROM   FactDet fd2
           //         WHERE  fd2.Cod_Empresa = fc.Cod_Empresa
           //         AND    fd2.CodProv     = fc.CodProv
           //         AND    fd2.Cod_Tp_Comp = fc.Cod_Tp_Comp
           //         AND    fd2.NroFact     = fc.NroFact
           //         AND    fd2.GravExen    = _GRAVADO
           //         AND    fd2.EsGasto     = 'S') AS TOTAL_GRAV,
           //
           //        (SELECT IFNULL ( SUM(fd2.IVA), 0,
           //                         SUM(fd2.IVA) )
           //         FROM   FactDet fd2
           //         WHERE  fd2.Cod_Empresa = fc.Cod_Empresa
           //         AND    fd2.CodProv     = fc.CodProv
           //         AND    fd2.Cod_Tp_Comp = fc.Cod_Tp_Comp
           //         AND    fd2.NroFact     = fc.NroFact
           //         AND    fd2.EsGasto     = 'S') AS TOTALIVA,
           //
           //        fc.NroFactStr, a.Des_Art
           //
           // FROM   FactCab fc, DespFact df, Despacho d, FactDet fd,
           //        Proveed p, Articulo a
           //
           // WHERE  df.Cod_Empresa    = mCod_Empresa
           // AND    df.Anho           = mAnho
           // AND    df.CodDespachante = mCodDespachante
           // AND    df.NroDespacho    = mNroDespacho
           // AND    df.Cod_Empresa    = d.Cod_Empresa
           // AND    df.Anho           = d.Anho
           // AND    df.CodDespachante = d.CodDespachante
           // AND    df.NroDespacho    = d.NroDespacho
           // AND    df.Cod_Empresa    = fc.Cod_Empresa
           // AND    df.CodProv        = fc.CodProv
           // AND    df.Cod_Tp_Comp    = fc.Cod_Tp_Comp
           // AND    df.NroFact        = fc.NroFact
           // AND    fd.Cod_Empresa    = fc.Cod_Empresa
           // AND    fd.CodProv        = fc.CodProv
           // AND    fd.Cod_Tp_Comp    = fc.Cod_Tp_Comp
           // AND    fd.NroFact        = fc.NroFact
           // AND    fd.Cod_Empresa    = a.Cod_Empresa
           // AND    fd.Cod_Articulo   = a.Cod_Articulo
           // AND    fc.Cod_Empresa    = p.Cod_Empresa
           // AND    fc.CodProv        = p.CodProv
           // AND    fc.TipoCompra     = _IMPORTACION
           // AND    fc.CostoGasto     = _COSTO
           // AND    fd.EsGasto        = 'S'
           //

           ;

   declare cur_VerGastImp  cursor for
           SELECT Cod_Articulo, ProrrateoME
           FROM   tmpDespachos
           WHERE  Session_ID = mSession_ID
           AND    TipoItem   = _GASTO_IMPORTACION
           ORDER  BY ProrrateoME DESC
           FOR UPDATE
           ;

   declare cur_VerArancel  cursor for
           SELECT DISTINCT CodArancel
           FROM   tmpDespachos
           WHERE  Session_ID = mSession_ID
           AND    TipoItem   = _ARANCEL
           ORDER  BY CodArancel
           FOR UPDATE
           ;

   declare cur_AplDifArancel  cursor for
           SELECT Cod_Articulo, Prorrateo
           FROM   tmpDespachos
           WHERE  Session_ID = mSession_ID
           AND    TipoItem   = _ARANCEL
           AND    CodArancel = mCodArancel
           ORDER  BY Prorrateo DESC
           FOR UPDATE
           ;


   //
   // Se fijan las "CONSTANTES"...
   //
   set _IMPORTACION         = 'I';
   set _COSTO               = 'C';
   set _GASTO               = 'G';
   //
   // Estos son los tipos de items de las lineas del
   // informe que actualmente existen...
   //
   set _ARTICULO             = 'AR';
   set _GASTO_IMPORTACION    = 'GI';
   set _IVA_DESPACHO         = 'ID';
   set _ARANCEL              = 'LD';    // (L)iquidacion del (D)espacho...
   //
   // Se agregan estos tipos para separar los items relativos
   // a los articulos faltantes. Para la codificacion se antepone
   // una T (de fal(T)ante) para que se ubique al final del orden...
   //
   set _ARTICULO_FALTANTE   = 'TA';
   set _GASTO_IMP_FALTANTE  = 'TG';
   set _IVA_DESP_FALTANTE   = 'TI';
   set _ARANCEL_FALTANTE    = 'TL';

   //
   // Definiciones de Aranceles...
   //
   set _TPDEF_ARANCEL_COMUN = 'A';
   set _TPDEF_IVA_DESPACHO  = 'I';     // tpDef de IVA DEL DESPACHO
   set _TPDEF_IVA_DECRETO   = 'D';
   set _TPDEF_HONORARIOS    = 'H';
   set _LEN_CODARANCEL      = 5;

   //
   // Constantes varias...
   //
   set _FACTOR_CAMBIO_DESPACHO     = 'D';
   set _FACTOR_CAMBIO_FACTURA      = 'F';

   set _FACTURA_MUESTRA            = 'FM';
   set _DESCRIP_GASTOS_IMPORTACION = 'Fletes - Gastos de Importacion';
   set _GRAVADO                    = 'G';
   set _EXENTO                     = 'E';

   set _PRORRATEO_X_COSTO          = 'C';
   set _PRORRATEO_X_PESO_BRUTO     = 'P';
   set _PRORRATEO_X_PESO_NETO      = 'N';

   //
   // Se inicializan las variables...
   //
   set mCodArancel   = '';
   set mTpDefArancel = '';
   set primeraVez    = 'S';

   SELECT MonedaLocal, MonedaExtranjera,
          CantDecimalME, CantDecimalGS,
          GetFactor_GastImp
   INTO   mMonedaLocal, mMonedaExtranjera,
          mCantDecimalME, mCantDecimalGS,
          mGetFactor_GastImp
   FROM   Control
   WHERE  Cod_Empresa = mCod_Empresa
   AND    Periodo     = mPeriodo;

   SELECT RazonSocial
   INTO   mRazonSocDesp
   FROM   Proveed
   WHERE  Cod_Empresa = mCod_Empresa
   AND    CodProv     = mCodDespachante;

   //
   // Se debe controlar TODAS LAS FACTURAS de mercaderias
   // (definido como "IMPORTACION" y "COSTO") DEBEN ESTAR EN LA
   // MISMA MONEDA (una misma moneda extranjera), porque los calculos
   // se basan en esto...
   //
   SELECT COUNT ( DISTINCT fc.CodMoneda )
   INTO   nCount
   FROM   FactCab fc, Despacho d, DespFact df
   WHERE  d.Cod_Empresa     = mCod_Empresa
   AND    d.Anho            = mAnho
   AND    d.CodDespachante  = mCodDespachante
   AND    d.NroDespacho     = mNroDespacho
   AND    d.Cod_Empresa     = df.Cod_Empresa
   AND    d.Anho            = df.Anho
   AND    d.CodDespachante  = df.CodDespachante
   AND    d.NroDespacho     = df.NroDespacho
   AND    df.Cod_Empresa    = fc.Cod_Empresa
   AND    df.CodProv        = fc.CodProv
   AND    df.Cod_Tp_Comp    = fc.Cod_Tp_Comp
   AND    df.NroFact        = fc.NroFact
   AND    fc.TipoCompra     = _IMPORTACION
   AND    fc.CostoGasto     = _COSTO;

   if ( nCount > 1 ) then
      set msjError = 'Las monedas de las facturas importadas deben ser iguales.';
      signal err_usr;
   end if;

   //
   // Se obtiene el total general de todas las facturas del despacho...
   //
   // El riesgo que se asume es que todas las facturas de mercaderias
   // (definido como "IMPORTACION" y "COSTO") es que DEBAN ESTAR EN LA
   // MONEDA EXTRANJERA (UNA MISMA MONEDA).
   //
   // A partir de la implementacion de ACE, se agrega
   // que solo sean considerados los que NO SON GASTOS
   // (que se configura en el detalle de la factura),
   // por lo que se debe sumar los totales de los detalles...
   //
   // 2005-11-08
   //
   SELECT MAX(fc.CodMoneda),
          //
          // SUM(fc.TotalExen + fc.TotalGrav +
          //     IF ( fc.IVAIncluido = 'S' ) THEN
          //        0
          //     else
          //        fc.IVA
          //     ENDIF),
          //
          SUM ( (fd.Cantidad * fd.Pr_Unit) +

                 IF ( fc.IVAIncluido = 'S' ) THEN
                    0
                 ELSE
                    fd.IVA
                 ENDIF
              ),
          SUM (fc.PesoBruto), SUM (fc.PesoNeto)

   INTO   mCodMonedaFact, mTotalFactDesp,
          mTotalPesoBrutoDesp, mTotalPesoNetoDesp

   FROM   FactCab fc, Despacho d, DespFact df, FactDet fd
   WHERE  d.Cod_Empresa     = mCod_Empresa
   AND    d.Anho            = mAnho
   AND    d.CodDespachante  = mCodDespachante
   AND    d.NroDespacho     = mNroDespacho
   AND    d.Cod_Empresa     = df.Cod_Empresa
   AND    d.Anho            = df.Anho
   AND    d.CodDespachante  = df.CodDespachante
   AND    d.NroDespacho     = df.NroDespacho
   AND    df.Cod_Empresa    = fc.Cod_Empresa
   AND    df.CodProv        = fc.CodProv
   AND    df.Cod_Tp_Comp    = fc.Cod_Tp_Comp
   AND    df.NroFact        = fc.NroFact
   AND    fd.Cod_Empresa    = fc.Cod_Empresa
   AND    fd.CodProv        = fc.CodProv
   AND    fd.Cod_Tp_Comp    = fc.Cod_Tp_Comp
   AND    fd.NroFact        = fc.NroFact
   AND    fc.TipoCompra     = _IMPORTACION
   AND    fc.CostoGasto     = _COSTO
   AND    fd.EsGasto        = 'N';

   //
   // Se obtiene el total de los items a cuyos costos se deben sumar
   // los aranceles aduaneros...
   //
   SELECT SUM ( (fd.Cantidad * fd.Pr_Unit) +
                 IF ( fc.IVAIncluido = 'S' ) THEN
                    0
                 ELSE
                    fd.IVA
                 ENDIF
              )
   INTO   mTotalArancCostos
   FROM   FactCab fc, FactDet fd, Despacho d, DespFact df
   WHERE  d.Cod_Empresa     = mCod_Empresa
   AND    d.Anho            = mAnho
   AND    d.CodDespachante  = mCodDespachante
   AND    d.NroDespacho     = mNroDespacho
   AND    d.Cod_Empresa     = df.Cod_Empresa
   AND    d.Anho            = df.Anho
   AND    d.CodDespachante  = df.CodDespachante
   AND    d.NroDespacho     = df.NroDespacho
   AND    df.Cod_Empresa    = fc.Cod_Empresa
   AND    df.CodProv        = fc.CodProv
   AND    df.Cod_Tp_Comp    = fc.Cod_Tp_Comp
   AND    df.NroFact        = fc.NroFact
   AND    fc.Cod_Empresa    = fd.Cod_Empresa
   AND    fc.CodProv        = fd.CodProv
   AND    fc.Cod_Tp_Comp    = fd.Cod_Tp_Comp
   AND    fc.NroFact        = fd.NroFact
   AND    fc.TipoCompra     = _IMPORTACION
   AND    fc.CostoGasto     = _COSTO
   AND    fd.EsGasto        = 'N'
   AND    fd.ArancelCosto   = 'S';

   //
   // Se obtiene la cantidad total de items que son "MUESTRAS GRATIS",
   // utilizada para calcular la incidencia...
   //
   SELECT IFNULL ( SUM(fd.Cantidad), 0, SUM(fd.Cantidad) )
   INTO   mCantTotalMuestras
   FROM   FactCab fc, FactDet fd, Despacho d, DespFact df
   WHERE  d.Cod_Empresa     = mCod_Empresa
   AND    d.Anho            = mAnho
   AND    d.CodDespachante  = mCodDespachante
   AND    d.NroDespacho     = mNroDespacho
   AND    d.Cod_Empresa     = df.Cod_Empresa
   AND    d.Anho            = df.Anho
   AND    d.CodDespachante  = df.CodDespachante
   AND    d.NroDespacho     = df.NroDespacho
   AND    df.Cod_Empresa    = fc.Cod_Empresa
   AND    df.CodProv        = fc.CodProv
   AND    df.Cod_Tp_Comp    = fc.Cod_Tp_Comp
   AND    df.NroFact        = fc.NroFact
   AND    fc.Cod_Empresa    = fd.Cod_Empresa
   AND    fc.CodProv        = fd.CodProv
   AND    fc.Cod_Tp_Comp    = fd.Cod_Tp_Comp
   AND    fc.NroFact        = fd.NroFact
   AND    fc.TipoCompra     = _IMPORTACION
   AND    fc.CostoGasto     = _COSTO
   AND    fd.EsGasto        = 'N'
   AND    fd.EsMuestra      = 'S';

   //
   // Se obtiene los pesos netos y brutos de las facturas
   // que contienen MUESTRAS...
   //
   SELECT IFNULL ( SUM(PesoBruto), 0, SUM(PesoBruto) ),
          IFNULL ( SUM(PesoNeto),  0, SUM(PesoNeto) )
   INTO   mPesoBrutoMuestras, mPesoNetoMuestras
   FROM   FactCab fc1
   WHERE  EXISTS (SELECT *
                  FROM   FactCab fc, FactDet fd, Despacho d, DespFact df
                  WHERE  d.Cod_Empresa     = mCod_Empresa
                  AND    d.Anho            = mAnho
                  AND    d.CodDespachante  = mCodDespachante
                  AND    d.NroDespacho     = mNroDespacho
                  AND    d.Cod_Empresa     = df.Cod_Empresa
                  AND    d.Anho            = df.Anho
                  AND    d.CodDespachante  = df.CodDespachante
                  AND    d.NroDespacho     = df.NroDespacho
                  AND    df.Cod_Empresa    = fc.Cod_Empresa
                  AND    df.CodProv        = fc.CodProv
                  AND    df.Cod_Tp_Comp    = fc.Cod_Tp_Comp
                  AND    df.NroFact        = fc.NroFact
                  AND    fc.Cod_Empresa    = fd.Cod_Empresa
                  AND    fc.CodProv        = fd.CodProv
                  AND    fc.Cod_Tp_Comp    = fd.Cod_Tp_Comp
                  AND    fc.NroFact        = fd.NroFact
                  AND    fc.TipoCompra     = _IMPORTACION
                  AND    fc.CostoGasto     = _COSTO
                  AND    fd.EsMuestra      = 'S'
                  AND    fc1.Cod_Empresa   = fc.Cod_Empresa
                  AND    fc1.CodProv       = fc.CodProv
                  AND    fc1.Cod_Tp_Comp   = fc.Cod_Tp_Comp
                  AND    fc1.NroFact       = fc.NroFact);

   //
   // Se obtiene el IMPORTE TOTAL de los ARTICULOS FALTANTES, para
   // ver si se deben prorratear los costos o solo los aranceles
   // aduaneros (en base a lo configurado en "Control.LimiteFaltantes")...
   //
   SELECT IFNULL ( SUM(fd.Pr_Unit * fd.CantFaltante), 0,
                   SUM(fd.Pr_Unit * fd.CantFaltante) ),
          IFNULL ( SUM(fd.CantFaltante), 0, SUM(fd.CantFaltante) )
   INTO   mTotalFaltantes, mCantTotalFaltas
   FROM   FactCab fc, FactDet fd, Despacho d, DespFact df
   WHERE  d.Cod_Empresa     = mCod_Empresa
   AND    d.Anho            = mAnho
   AND    d.CodDespachante  = mCodDespachante
   AND    d.NroDespacho     = mNroDespacho
   AND    d.Cod_Empresa     = df.Cod_Empresa
   AND    d.Anho            = df.Anho
   AND    d.CodDespachante  = df.CodDespachante
   AND    d.NroDespacho     = df.NroDespacho
   AND    df.Cod_Empresa    = fc.Cod_Empresa
   AND    df.CodProv        = fc.CodProv
   AND    df.Cod_Tp_Comp    = fc.Cod_Tp_Comp
   AND    df.NroFact        = fc.NroFact
   AND    fc.Cod_Empresa    = fd.Cod_Empresa
   AND    fc.CodProv        = fd.CodProv
   AND    fc.Cod_Tp_Comp    = fd.Cod_Tp_Comp
   AND    fc.NroFact        = fd.NroFact
   AND    fc.TipoCompra     = _IMPORTACION
   AND    fc.CostoGasto     = _COSTO
   AND    fd.EsGasto        = 'N'
   AND    fd.CantFaltante   > 0;

   //
   // Se procesan las facturas del despacho...
   //
   open cur_Desp;
   Despachos:
   loop
      fetch cur_Desp into mCodProv, mCod_Tp_Comp, mNroFact,
                          mLinea, mIVAIncluido,
                          mCodMoneda, mFactCambio, mTasaCambioCostoME,
                          mTotalFact, mTotalIVA,
                          mPesoBruto, mPesoNeto,
                          mRazonSocial, mCod_Articulo,
                          mPlanCtaArt, mPlanAuxArt,
                          mDes_Art, mCod_Familia, mCod_Grupo,
                          mCantidad, mCantFacturada, mCantFaltante,
                          mPr_Unit, mTotal, mTotalFacturado,
                          mIVA, mFechaDespacho,
                          mValorImponible, mTasaVI,
                          mValorImpDecreto, mTasaVID,
                          mTp_Def, mEsMuestra, mArancelCosto;

      if ( SQLSTATE = no_data_found ) then
         leave Despachos;
      end if;

      //
      // Se guarda la tasa de cambio del despacho, para hacer
      // el ajuste al COSTO EN ME al final...
      //
      set mTasaCambio = mFactCambio;

      //
      // Dependiendo de si se tratan de faltantes,
      // se fija el tipo de item correspondiente...
      //
      if ( mCantFaltante > 0 ) then
         set mTipoItemArt   = _ARTICULO_FALTANTE;
         set mTipoItemGast  = _GASTO_IMP_FALTANTE;
         set mTipoItemIVA   = _IVA_DESP_FALTANTE;
         set mTipoItemAranc = _ARANCEL_FALTANTE;
      else
         set mTipoItemArt   = _ARTICULO;
         set mTipoItemGast  = _GASTO_IMPORTACION;
         set mTipoItemIVA   = _IVA_DESPACHO;
         set mTipoItemAranc = _ARANCEL;
      end if;

      //
      // Se calculan los totales del detalle y de la factura...
      //
      if ( mIVAIncluido = 'S' ) then
         set mTotal     = mTotal - mIVA;
      else
         set mTotalFact = mTotalFact + mTotalIVA;
      end if;

      //
      // Se obtiene la cantidad total de items de la factura
      // para calcular la incidencia por cantidades, utilizada
      // en el prorrateo por pesos...
      //
      SELECT IFNULL ( SUM(Cantidad), 0, SUM(Cantidad) )
      INTO   mCantDetalles
      FROM   FactDet
      WHERE  Cod_Empresa = mCod_Empresa
      AND    CodProv     = mCodProv
      AND    Cod_Tp_Comp = mCod_Tp_Comp
      AND    NroFact     = mNroFact;

      set mIncCantArtFact = mCantidad / mCantDetalles;

      //
      // Se ve la incidencia del articulo si es UNA MUESTRA...
      //
      if ( (mTp_Def = _FACTURA_MUESTRA OR mEsMuestra = 'S') AND
            mCantTotalMuestras > 0 ) then

         set mIncArtMuestra = mCantidad / mCantTotalMuestras;
      else
         set mIncArtMuestra = 1;
      end if;

      //
      // En base a lo configurado en Control, se fija
      // el indice de prorrateo, que puede ser :
      //
      //     - por el COSTO de la mercaderia,
      //     - por el peso bruto, o
      //     - por el peso neto...
      //
      // Se ve la incidencia de la factura en el total..
      //
      set mIncArtFact = mTotal / mTotalFactDesp;

      if ( mIncArtFact < 0 ) then
         set mIncArtFact = mIncArtFact * -1;
      end if;

      //
      // Se asegura que los totales de "pesos" no sean
      // iguales a cero para que no de el error de
      // "division por cero"...
      //
      if ( mTotalPesoBrutoDesp = 0 ) then
         set mTotalPesoBrutoDesp = 1;
      end if;

      if ( mTotalPesoNetoDesp = 0 ) then
         set mTotalPesoNetoDesp = 1;
      end if;

      //
      // Se calcula el indice de incidencia...
      //
      if ( mTp_Def = _FACTURA_MUESTRA OR mEsMuestra = 'S' ) then
         if ( mProrrateoImport = _PRORRATEO_X_PESO_BRUTO ) then
            //
            // rbl
            // 2002-11-12
            // set mIncArtFactDesp = mPesoBruto / mTotalPesoBrutoDesp;
            // set mIncArtFactDesp = mPesoBruto / mPesoBrutoMuestras;
            // set mIncArtFactDesp = mPesoBrutoMuestras / mTotalPesoBrutoDesp;
            //
            set mIncArtFactDesp = mPesoBruto / mTotalPesoBrutoDesp;

         elseif ( mProrrateoImport = _PRORRATEO_X_PESO_NETO ) then
            set mIncArtFactDesp = mPesoNetoMuestras / mTotalPesoNetoDesp;
         end if;
      else
         if ( mProrrateoImport = _PRORRATEO_X_PESO_BRUTO ) then
            set mIncArtFactDesp = mPesoBruto / mTotalPesoBrutoDesp;
         elseif ( mProrrateoImport = _PRORRATEO_X_PESO_NETO ) then
            set mIncArtFactDesp = mPesoNeto / mTotalPesoNetoDesp;
         else
            //
            // por el costo...
            //
            set mIncArtFactDesp = mTotal / mTotalFactDesp;
         end if;
      end if;

      //
      // Se asegura que el indice de prorrateo no sea CERO...
      //
      if ( mIncArtFact = 0 ) then
         set mIncArtFact = 1;
      end if;

      if ( mIncArtFactDesp = 0 ) then
         set mIncArtFactDesp = 1;
      end if;

      //
      // Si la factura corresponde a una FACTURA DE MUESTRA, o
      // si el item es una MUESTRA GRATIS, NO SE CONSIDERA EL
      // VALOR FACTURADO (el valor que aparece en la factura
      // no incide en el costo, ya que se toma solo los
      // aranceles aduaneros)...
      //
      if ( mTp_Def = _FACTURA_MUESTRA OR mEsMuestra = 'S' ) then
         set mArt_Total           = 0;
         set mArt_TotalME         = 0;
         set mArt_Prorrateo       = 0;
         set mArt_ProrrateoME     = 0;
         set mArt_ProrrateoOrigen = 0;
      else
         set mArt_Total       = (mTotalFact * mFactCambio);
         set mArt_TotalME     =  mTotalFact;

         //
         // Se verifica si no se debe considerar el monto de las
         // faltantes, en base a lo configurado en CONTROL...
         //
         if ( mCodMonedaFact  = mMonedaLimFalt AND
              mTotalFaltantes < mLimiteFaltantes ) then

              // set mCantidad = ABS(mCantidad);
              set mTotal    = ABS(mTotal);

              set mArt_Prorrateo   = (mTotal * mFactCambio);
              set mArt_ProrrateoME =  mTotal;
         else
            //
            // Si NO se debe considerar los faltantes, se debe
            // ver si la linea corresponde al total de articulos
            // para lo cual se debe considerar el total facturado,
            // sino se toma el monto de las faltantes...
            //
            // (los faltantes estan "MARCADOS" por el total negativo
            // que se le da en el cursor)...
            //
            if ( mTotal > 0 ) then
               set mArt_Prorrateo   = (mTotalFacturado * mFactCambio);
               set mArt_ProrrateoME =  mTotalFacturado;
            else
               set mArt_Prorrateo   = (mTotal * mFactCambio);
               set mArt_ProrrateoME =  mTotal;
            end if;
         end if;
      end if;

      //
      // Se toma el precio unitario cargado...
      //
      if ( mCodMoneda = mMonedaLocal ) then
         set mImporte   = mPr_Unit;
         set mImporteME = ROUND(mPr_Unit / mFactCambio, mCantDecimalME);
      else
         set mImporte   = ROUND(mPr_Unit * mFactCambio, mCantDecimalGS);
         set mImporteME = mPr_Unit;
      end if;

      //
      // Se guardan los valores originales...
      //
      set mImporteOrigen   = mImporte;
      set mImporteOrigenME = mImporteME;

      //
      // Se recuperarn los datos de la familia y grupo del articulo...
      //
      SELECT Des_Familia
      INTO   mDesFamilia
      FROM   Familia
      WHERE  Cod_Familia = mCod_Familia;

      SELECT Des_Grupo
      INTO   mDesGrupo
      FROM   Grupo
      WHERE  Cod_Familia = mCod_Familia
      AND    Cod_Grupo   = mCod_Grupo;

      //
      // Se inserta los datos del articulo...
      //
      INSERT INTO tmpDespachos (Session_ID, Cod_Empresa, CodProv, RazonSocial,
                                Cod_Tp_Comp, NroFact, CodDespachante, RazonSocDesp,
                                NroDespacho, FechaDespacho, CodMoneda,
                                FactCambio, TipoItem, Cod_Articulo,
                                PlanCtaArt, PlanAuxArt,
                                CodArancel, TpDefArancel, Descrip,
                                Cantidad, CantFaltantes, CantTotal,
                                Total, TotalME,
                                Prorrateo, ProrrateoME,
                                PorcIncid,
                                IVADespacho, IVAOtros,
                                CodProvLiq, RazonSocLiq,
                                ValorImponible, TasaVI,
                                ValorImpDecreto, TasaVID,
                                AjusteFaltas, PrecioUnit, PrecioUnitME,
                                Cod_Familia, Cod_Grupo,
                                Des_Familia, Des_Grupo  )

      VALUES (mSession_ID, mCod_Empresa, mCodProv, mRazonSocial,
              mCod_Tp_Comp, mNroFact, mCodDespachante, mRazonSocDesp,
              mNroDespacho, mFechaDespacho, mCodMoneda,
              mFactCambio, mTipoItemArt, mCod_Articulo,
              mPlanCtaArt, mPlanAuxArt,
              mCodArancel, mTpDefArancel, mDes_Art,
              mCantidad, 0, mCantidad,
              mArt_Total, mArt_TotalME,
              mArt_Prorrateo, mArt_ProrrateoME,
              0,
              0, 0,
              mCodProv, mRazonSocial,
              mValorImponible, mTasaVI,
              mValorImpDecreto, mTasaVID,
              'N', mImporte, mImporteME,
              mCod_Familia, mCod_Grupo,
              mDesFamilia ,  mDesGrupo );

      //                 GASTOS DE IMPORTACION...
      // ----------------------------------------------------------
      // Se procesan los gastos de la importacion (por ej., fletes)
      // ----------------------------------------------------------
      //
      set mGastImp_Total      = 0;
      set mGastImp_TotalME    = 0;
      set mGastImp_TotalIVA   = 0;
      set mGastImp_TotalIVAME = 0;

      open cur_GastImp;
      GastImp:
      loop
         fetch next cur_GastImp into mGastImp_PlanCta, mGastImp_PlanAux,
                                     mGastImp_CodProv, mGastImp_RazonSocial,
                                     mGastImp_Cod_Tp_Comp,
                                     mGastImp_NroFact, mGastImp_Linea,
                                     mGastImp_Fecha, mGastImp_IVAIncluido,
                                     mGastImp_CodMoneda,
                                     mGastImp_FactCambio,
                                     mGastImp_TotalExen,
                                     mGastImp_TotalGrav,
                                     mGastImp_IVA,
                                     mGastImp_FactTotalExen,
                                     mGastImp_FactTotalGrav,
                                     mGastImp_FactIVA,
                                     mGastImp_NroFactStr,
                                     mDes_Art;

         if ( SQLSTATE = no_data_found ) then
            leave GastImp;
         end if;

         set mGastImp_TotalFactura = mGastImp_TotalExen + mGastImp_TotalGrav;

         //
         // Si es IVA Incluido, se quita del total (que ya lo contiene)...
         //
         if ( mGastImp_IVAIncluido = 'S' ) then
            set mGastImp_TotalFactura = mGastImp_TotalFactura - mGastImp_IVA;
         end if;

         //
         // Se guarda el total de la cabecera para el informe final...
         //
         set mGastImp_FactCabTotal = mGastImp_FactTotalExen + mGastImp_FactTotalGrav;

         //
         // Si es IVA Incluido, se quita del total (que ya lo contiene)...
         //
         if ( mGastImp_IVAIncluido = 'S' ) then
            set mGastImp_FactCabTotal = mGastImp_FactCabTotal - mGastImp_FactIVA;
         end if;

         if ( mGastImp_CodMoneda = mMonedaLocal ) then
            set mImporte      = mGastImp_TotalFactura;
            set mImporteTotal = mGastImp_FactCabTotal;

            //
            // Se ve si el factor de cambio se toma del despacho
            // o de la factura de gasto...
            //
            if ( mGetFactor_GastImp = _FACTOR_CAMBIO_DESPACHO ) then

               set mGastImp_FactCambio = mTasaCambio;

               set mImporteME = ROUND(mGastImp_TotalFactura /
                                      mGastImp_FactCambio,
                                      mCantDecimalME);

               set mImporteTotalME = ROUND(mGastImp_FactCabTotal /
                                           mGastImp_FactCambio,
                                           mCantDecimalME);
            else
               //
               // ... o si el factor se debe obtener de
               // la cotizacion de la fecha de la factura...
               //
               // dba.Control.GetFactor_GastImp ===> 'F'   // Factura
               //
               //
               // 2008-07-25
               //
               // SELECT Factor
               //
               SELECT Factor_Vendedor
               INTO   mGastImp_FactCambio
               FROM   FactCamb
               WHERE  CodMoneda        = mMonedaExtranjera
               AND    DATE(Fact_Fecha) = DATE(mGastImp_Fecha);

               if ( SQLSTATE = no_data_found ) then
                  set mImporteME      = 0;
                  set mImporteTotalME = 0;
               else
                  set mImporteME = ROUND(mGastImp_TotalFactura /
                                         mGastImp_FactCambio,
                                         mCantDecimalME);

                  set mImporteTotalME = ROUND(mGastImp_FactCabTotal /
                                              mGastImp_FactCambio,
                                              mCantDecimalME);
               end if;
            end if;

         else
            set mImporte   = ROUND(mGastImp_TotalFactura * mGastImp_FactCambio,
                                   mCantDecimalGS);
            set mImporteME = ROUND(mGastImp_TotalFactura, mCantDecimalME);

            set mImporteTotal   = ROUND(mGastImp_FactCabTotal * mGastImp_FactCambio,
                                   mCantDecimalGS);
            set mImporteTotalME = ROUND(mGastImp_FactCabTotal, mCantDecimalME);
         end if;

         //
         // set mGastImp_Total   = mGastImp_Total   + mImporte;
         // set mGastImp_TotalME = mGastImp_TotalME + mImporteME;
         //
         set mGastImp_Total   = mImporteTotal;
         set mGastImp_TotalME = mImporteTotalME;

         //
         // A partir del 27/03/2002 se van insertando los gastos
         // a medida que se recupera porque las incidencias varian
         // dependiendo de cuales facturas son incididas por el
         // gasto...
         //
         // Si se cargo un numero de factura de referencia en los
         // gastos arancelarios, SIGNIFICA que los gastos SOLO
         // INCIDEN EN LA FACTURA EN CUESTION, en otro caso
         // se toma la incidencia dentro de todas las facturas
         // del despacho...
         //
         SELECT COUNT(*)
         INTO   nCount
         FROM   FactGastosImp
         WHERE  Cod_Empresa  = mCod_Empresa
         AND    CodProv      = mGastImp_CodProv
         AND    Cod_Tp_Comp  = mGastImp_Cod_Tp_Comp
         AND    NroFact      = mGastImp_NroFact;

         //
         // Si la factura de gasto se aplica a mas de una factura,
         // entonces se debe hallar la incidencia de la factura
         // actual entre TODAS LAS FACTURAS IMPLICADAS...
         //
         if ( nCount > 0 ) then

            SELECT IF ( mProrrateoImport = _PRORRATEO_X_PESO_BRUTO ) THEN
                      IFNULL ( SUM(PesoBruto), 0, SUM(PesoBruto) )
                   ELSE IF ( mProrrateoImport = _PRORRATEO_X_PESO_NETO ) THEN
                      IFNULL ( SUM(PesoNeto),  0, SUM(PesoNeto) )
                   ENDIF ENDIF
            INTO   mPesoFactGastosImp
            FROM   FactCab fc
            WHERE  EXISTS (SELECT *
                           FROM   FactGastosImp fgi
                           WHERE  fgi.Cod_Empresa  = mCod_Empresa
                           AND    fgi.CodProv      = mGastImp_CodProv
                           AND    fgi.NroFact      = mGastImp_NroFact
                           AND    fgi.Cod_Empresa  = fc.Cod_Empresa
                           AND    fgi.CodProvImp   = fc.CodProv
                           AND    fgi.NroFactImp   = fc.NroFact);

            //
            // set mIncArtGastos = mPesoBruto / mPesoBrutoMuestras;
            //
            if ( mProrrateoImport = _PRORRATEO_X_PESO_BRUTO ) then
               set mIncArtGastos = mPesoBruto / mPesoFactGastosImp;
            elseif ( mProrrateoImport = _PRORRATEO_X_PESO_NETO ) then
               set mIncArtGastos = mPesoNeto / mPesoFactGastosImp;
            else
               //
               // si es por el costo...
               //
               set mIncArtGastos = mIncArtFact;
            end if;

         //
         // prf
         //
         // Si no hay gastos que aplicar... NO DEBERIA SER SOLO 1
         // LA INCIDENCIA??
         //
         // REVISAR CUANDO LOS GASTOS SE APLICAN SOLO A CIERTAS FACTURAS!!!!
         //
         // 2007/07/10
         //
         // elseif ( nCount = 1 ) then
         //    set mIncArtGastos = 1;
         // else
         //    set mIncArtGastos = mIncArtFact;
         //
         else
            set mIncArtGastos = 1;
         end if;

         //
         // Se calcula el importe correspondiente en base al porcentaje
         // de incidencia del articulo...
         //

         //
         // Si la factura corresponde a una FACTURA DE MUESTRA, o
         // si el item es una MUESTRA GRATIS, al importe obtenido
         // previamente se le vuelve a aplicar el porcentaje de
         // incidencia de los articulos en base a la cantidad
         // facturada...
         //
         if ( mTp_Def = _FACTURA_MUESTRA OR mEsMuestra = 'S' ) then
            //
            // set mImporte   = (mImporte   * mIncArtGastos) * mIncArtMuestra;
            // set mImporteME = (mImporteME * mIncArtGastos) * mIncArtMuestra;
            // set mPorcIncidTotal = mIncArtGastos * mIncArtMuestra;
            //
            set mImporte   = (mImporte   * mIncArtGastos) * mIncCantArtFact;
            set mImporteME = (mImporteME * mIncArtGastos) * mIncCantArtFact;
            set mPorcIncidTotal = mIncArtGastos * mIncCantArtFact;
         else
            //
            // Si el total = 0 es que hay 100 % de faltantes,
            // por lo que los importes y el porcentaje de incidencia
            // deben ser CEROS
            //
            if ( mTotal = 0 ) then
               set mImporte        = 0;
               set mImporteME      = 0;
               set mPorcIncidTotal = 0;
            else
               set mImporte   = (mImporte   * mIncArtGastos) * mIncArtFact;
               set mImporteME = (mImporteME * mIncArtGastos) * mIncArtFact;
               set mPorcIncidTotal = mIncArtGastos * mIncArtFact;
            end if;
         end if;

         //
         // INSERT INTO prf VALUES ( STRING (
         // ' gasto_codprov ',  mGastImp_codprov,
         // ' gasto_fact ',  mGastImp_NroFact,
         // // ' prov ', mcodprov,
         // ' fact ', mnrofact,
         // ' INCID TOTAL ', mPorcincidTotal,
         // ' incArtFact ', mIncArtFact,
         // ' incArtFactDesp ', mIncArtFactDesp,
         // ' incArtGastos ', mIncArtGastos,
         // ' incCANTArt ', mIncCantArtFact,
         // ' GAST IMP TOTAL ', mGastImp_Total,
         // ' GAST IMP TOTAL ME ', mGastImp_TotalME,
         // ' mImporte ', mImporte,
         // ' mImporteME ', mImporteme,
         // ' cantidad ', mcantidad,
         // ' cod articu ', mcod_articulo,
         // '  mTipoItemGast ',  mTipoItemGast
         // ));
         //

         INSERT INTO tmpDespachos (Session_ID, Cod_Empresa, CodProv,
                                   RazonSocial, Cod_Tp_Comp, NroFact, CodDespachante,
                                   RazonSocDesp, NroDespacho, FechaDespacho,
                                   CodMoneda, FactCambio, TipoItem,
                                   Cod_Articulo, PlanCtaArt, PlanAuxArt,
                                   CodArancel, TpDefArancel, Descrip, Cantidad,
                                   Total, TotalME,
                                   Prorrateo, ProrrateoME,
                                   PorcIncid, PorcIncidTotal,
                                   IVADespacho, IVAOtros,
                                   CodProvLiq, RazonSocLiq,
                                   NroFactLiq,
                                   ValorImponible, TasaVI,
                                   ValorImpDecreto, TasaVID,
                                   AjusteFaltas,
                                   Cod_Familia, Cod_Grupo )
         VALUES (mSession_ID, mCod_Empresa, mCodProv, mRazonSocial,
                 mCod_Tp_Comp, mNroFact, mCodDespachante,
                 mRazonSocDesp, mNroDespacho, mFechaDespacho,
                 mCodMoneda, mFactCambio, mTipoItemGast, // _GASTO_IMPORTACION,
                 mCod_Articulo, mPlanCtaArt, mPlanAuxArt,
                 mCodArancel, mTpDefArancel, mDes_Art, NULL,

                 mGastImp_Total, mGastImp_TotalME,
                 mImporte, mImporteME,

                 0, mPorcIncidTotal,
                 0, 0,
                 // mCodProv,
                 mGastImp_CodProv, mGastImp_RazonSocial,
                 mGastImp_NroFact,
                 mValorImponible, mTasaVI,
                 mValorImpDecreto, mTasaVID,
                 'N', mCod_Familia, mCod_Grupo );

      end loop GastImp;
      close cur_GastImp;

      //
      // --------------------------------------------------------------
      // Se insertan los GASTOS ARANCELARIOS DE LA IMPORTACION...
      // --------------------------------------------------------------
      //
      // OBSERVACION: Se agregan los gastos arancelarios
      //              SOLO SI ESTA DEFINIDO EN EL DETALLE DE LA FACTURA
      //              de costo...
      //
      //              27/03/2002
      //
      if ( mArancelCosto = 'S' ) then
         //
         // Se obtiene el indice de prorrateo para los costos...
         //
         set mIncArancCostos = mTotal / mTotalArancCostos;

         //
         // Si la incidencia es negativa (para los faltantes),
         // aqui se lo vuelve positivo porque siempre se debe sumar...
         //
         if ( mIncArancCostos < 0 ) then
            set mIncArancCostos = mIncArancCostos * -1;
         end if;

         //
         // Se insertan todos los gastos arancelarios excepto
         // el arancel definido como IVA DEL DESPACHO, que se inserta
         // mas abajo...
         //
         // Se agrega esto: se consideran solo aquellos gastos
         // que tienen la marca de "AFECTA COSTOS"...
         //
         // 2005-11-07
         //
         INSERT INTO tmpDespachos (Session_ID, Cod_Empresa, CodProv, RazonSocial,
                                   Cod_Tp_Comp, NroFact, CodDespachante, RazonSocDesp,
                                   NroDespacho, FechaDespacho,
                                   CodMoneda, FactCambio, TipoItem,
                                   Cod_Articulo, PlanCtaArt, PlanAuxArt,
                                   CodArancel, TpDefArancel, Descrip,
                                   Cantidad, Total, TotalME,
                                   Prorrateo, ProrrateoME,
                                   PorcIncid, PorcIncidTotal,
                                   IVADespacho, IVAOtros,
                                   CodProvLiq, RazonSocLiq,
                                   ValorImponible, TasaVI,
                                   ValorImpDecreto, TasaVID,
                                   AjusteFaltas,
                                   Cod_Familia, Cod_Grupo )

         SELECT mSession_ID, mCod_Empresa, mCodProv, mRazonSocial,
                mCod_Tp_Comp, mNroFact, mCodDespachante, mRazonSocDesp,
                mNroDespacho, d.FechaDespacho,
                mCodMoneda, mFactCambio, mTipoItemAranc, // _ARANCEL,
                mCod_Articulo, mPlanCtaArt, mPlanAuxArt,

                REPLICATE('0', _LEN_CODARANCEL - Length(Trim(l.CodArancel))) +
                Trim(l.CodArancel),

                a.TpDef, a.Descrip, NULL   CANTIDAD,

                IF ( d.CodMoneda = mMonedaLocal ) THEN
                   //
                   // Si el item es el IVA del DECRETO y esta marcado
                   // como que "AFECTA AL GASTO", se considera el IVA...
                   //
                   IF ( a.TpDef = _TPDEF_IVA_DECRETO AND l.Af_Costos = 'S' ) THEN
                      SUM(l.Exento + l.Gravado + l.IVA)
                   ELSE
                      SUM(l.Exento + l.Gravado)
                   ENDIF
                ELSE
                   //
                   // Si el item es el IVA del DECRETO y esta marcado
                   // como que "AFECTA AL GASTO", se considera el IVA...
                   //
                   IF ( a.TpDef = _TPDEF_IVA_DECRETO AND l.Af_Costos = 'S' ) THEN
                      SUM((l.Exento + l.Gravado + l.IVA) * mFactCambio)
                   ELSE
                      SUM((l.Exento + l.Gravado) * mFactCambio)
                   ENDIF
                ENDIF     TOTAL,

                IF ( d.CodMoneda = mMonedaLocal ) THEN
                   //
                   // Si el item es el IVA del DECRETO y esta marcado
                   // como que "AFECTA AL GASTO", se considera el IVA...
                   //
                   IF ( a.TpDef = _TPDEF_IVA_DECRETO AND l.Af_Costos = 'S' ) THEN
                      SUM(ROUND((l.Exento + l.Gravado + l.IVA) / mFactCambio,
                                mCantDecimalME))
                   ELSE
                      SUM(ROUND((l.Exento + l.Gravado) / mFactCambio,
                                mCantDecimalME))
                   ENDIF
                ELSE
                   //
                   // Si el item es el IVA del DECRETO y esta marcado
                   // como que "AFECTA AL GASTO", se considera el IVA...
                   //
                   IF ( a.TpDef = _TPDEF_IVA_DECRETO AND l.Af_Costos = 'S' ) THEN
                      SUM(l.Exento + l.Gravado + l.IVA)
                   ELSE
                      SUM(l.Exento + l.Gravado)
                   ENDIF
                ENDIF     TOTALME,

                //
                // Se calculan los totales prorrateados...
                //
                IF ( d.CodMoneda = mMonedaLocal ) THEN
                   //
                   // Si el item es el IVA del DECRETO y esta marcado
                   // como que "AFECTA AL GASTO", se considera el IVA...
                   //
                   IF ( a.TpDef = _TPDEF_IVA_DECRETO AND l.Af_Costos = 'S' ) THEN
                      SUM((l.Exento + l.Gravado + l.IVA) * mIncArancCostos)
                   ELSE
                      SUM((l.Exento + l.Gravado) * mIncArancCostos)
                   ENDIF
                ELSE
                   //
                   // Si el item es el IVA del DECRETO y esta marcado
                   // como que "AFECTA AL GASTO", se considera el IVA...
                   //
                   IF ( a.TpDef = _TPDEF_IVA_DECRETO AND l.Af_Costos = 'S' ) THEN
                      SUM((l.Exento + l.Gravado + l.IVA) * mFactCambio *
                           mIncArancCostos)
                   ELSE
                      SUM((l.Exento + l.Gravado) * mFactCambio * mIncArancCostos)
                   ENDIF
                ENDIF     PRORRATEO,

                IF ( d.CodMoneda = mMonedaLocal ) THEN
                   //
                   // Si el item es el IVA del DECRETO y esta marcado
                   // como que "AFECTA AL GASTO", se considera el IVA...
                   //
                   IF ( a.TpDef = _TPDEF_IVA_DECRETO AND l.Af_Costos = 'S' ) THEN
                      SUM(ROUND(((l.Exento + l.Gravado + l.IVA ) / mFactCambio) *
                                mIncArancCostos, mCantDecimalME))
                   ELSE
                      SUM(ROUND(((l.Exento + l.Gravado) / mFactCambio) *
                                mIncArancCostos, mCantDecimalME))
                   ENDIF
                ELSE
                   //
                   // Si el item es el IVA del DECRETO y esta marcado
                   // como que "AFECTA AL GASTO", se considera el IVA...
                   //
                   IF ( a.TpDef = _TPDEF_IVA_DECRETO AND l.Af_Costos = 'S' ) THEN
                      SUM(ROUND((l.Exento + l.Gravado + l.IVA) * mIncArancCostos,
                                 mCantDecimalME))
                   ELSE
                      SUM(ROUND((l.Exento + l.Gravado) * mIncArancCostos,
                                 mCantDecimalME))
                   ENDIF
                ENDIF     PRORRATEOME,

                0, mIncArancCostos,

                0  IVADESPACHO,

                IF ( primeraVez = 'S' AND
                     (a.TpDef != _TPDEF_IVA_DECRETO OR
                      (a.TpDef = _TPDEF_IVA_DECRETO AND l.Af_Costos = 'N'))
                   ) THEN

                   SUM(l.IVA)
                ELSE
                   0
                ENDIF IVAOTROS,

                l.CodProv, p.RazonSocial,
                d.ValorImponible, d.TasaVI,
                d.ValorImpDecreto, d.TasaVID,
                'N', mCod_Familia, mCod_Grupo

         FROM   Despacho d, Liquidacion l, Proveed p, Aranceles a
         WHERE  d.Cod_Empresa        = mCod_Empresa
         AND    d.Anho               = mAnho
         AND    d.CodDespachante     = mCodDespachante
         AND    d.NroDespacho        = mNroDespacho
         AND    d.Cod_Empresa        = l.Cod_Empresa
         AND    d.Anho               = l.Anho
         AND    d.CodDespachante     = l.CodDespachante
         AND    d.NroDespacho        = l.NroDespacho
         AND    l.Cod_Empresa        = p.Cod_Empresa
         AND    l.CodProv            = p.CodProv
         AND    l.Cod_Empresa        = a.Cod_Empresa
         AND    l.CodArancel         = a.CodArancel
         //
         // Se ven todos los aranceles excepto el IVA DEL DESPACHO...
         // Antes estaba asi: 18/03/2002
         //
         // AND    (l.Exento+l.Gravado) > 0
         //
         AND    a.TpDef             != _TPDEF_IVA_DESPACHO
         AND    l.Af_Costos          = 'S'
         GROUP  BY d.FechaDespacho, l.CodArancel, a.Descrip,
                   d.CodMoneda, l.CodProv, p.RazonSocial,
                   d.ValorImponible, d.TasaVI,
                   d.ValorImpDecreto, d.TasaVID,
                   l.Af_Costos, a.TpDef;

         //
         // Se inserta el IVA DEL DESPACHO (solo una vez)...
         //
         if ( primeraVez = 'S' ) then
            //
            //
            // (A ESTO NO SE APLICA!!! porque no sale en el resumen del informe!!!
            //
            // Se agrega esto: se consideran solo aquellos gastos
            // que tienen la marca de "AFECTA COSTOS"...
            //
            // 2005-11-07
            //
            INSERT INTO tmpDespachos (Session_ID, Cod_Empresa, CodProv, RazonSocial,
                                      Cod_Tp_Comp, NroFact, CodDespachante, RazonSocDesp,
                                      NroDespacho, FechaDespacho,
                                      CodMoneda, FactCambio, TipoItem,
                                      Cod_Articulo, PlanCtaArt, PlanAuxArt,
                                      CodArancel,
                                      TpDefArancel, Descrip, Cantidad,
                                      Total, TotalME, Prorrateo, ProrrateoME,
                                      PorcIncid, PorcIncidTotal,
                                      IVADespacho, IVAOtros,
                                      CodProvLiq, RazonSocLiq,
                                      ValorImponible, TasaVI,
                                      ValorImpDecreto, TasaVID,
                                      AjusteFaltas,
                                      Cod_Familia, Cod_Grupo)

            SELECT mSession_ID, mCod_Empresa, mCodProv, mRazonSocial,
                   mCod_Tp_Comp, mNroFact, mCodDespachante, mRazonSocDesp,
                   mNroDespacho, d.FechaDespacho,
                   mCodMoneda, mFactCambio, mTipoItemIVA, // _IVA_DESPACHO,
                   mCod_Articulo, mPlanCtaArt, mPlanAuxArt,

                   REPLICATE('0', _LEN_CODARANCEL - Length(Trim(l.CodArancel))) +
                   Trim(l.CodArancel),

                   a.TpDef, a.Descrip, NULL,
                   0, 0, 0, 0,
                   0, mIncArancCostos,

                   l.IVA IVADESPACHO, 0,
                   l.CodProv, p.RazonSocial,
                   d.ValorImponible, d.TasaVI,
                   d.ValorImpDecreto, d.TasaVID,
                   'N', mCod_Familia, mCod_Grupo
            FROM   Despacho d, Liquidacion l, Proveed p, Aranceles a
            WHERE  d.Cod_Empresa        = mCod_Empresa
            AND    d.Anho               = mAnho
            AND    d.CodDespachante     = mCodDespachante
            AND    d.NroDespacho        = mNroDespacho
            AND    d.Cod_Empresa        = l.Cod_Empresa
            AND    d.Anho               = l.Anho
            AND    d.CodDespachante     = l.CodDespachante
            AND    d.NroDespacho        = l.NroDespacho
            AND    l.Cod_Empresa        = p.Cod_Empresa
            AND    l.CodProv            = p.CodProv
            AND    l.Cod_Empresa        = a.Cod_Empresa
            AND    l.CodArancel         = a.CodArancel
            AND    a.TpDef              = _TPDEF_IVA_DESPACHO;
            //
            // AND    (l.Exento+l.Gravado) = 0
            // AND    l.IVA                > 0
            //
            //
            // AQUI NO SE APLICA!!!
            // AND    l.Af_Costos          = 'S'
            //

            set primeraVez = 'N';
         end if;
      end if;

   end loop Despachos;
   close cur_Desp;

   //
   // Para la implementacion de ACE se agrego una nueva TASA DE CAMBIO
   // PARA LOS VALORES EN MONEDA EXTRANJERA, ya que las importaciones
   // se hace en LIBRAS, pero los costos finales se deben tener en US$...
   //
   // 2005-11-14
   //
   if ( mTasaCambio <> mTasaCambioCostoME ) then
      UPDATE tmpDespachos
      SET    ProrrateoME = ROUND (Prorrateo / mTasaCambioCostoME,
                                  mCantDecimalME)
      WHERE  Session_ID  = mSession_ID
      AND    Cod_Empresa = mCod_Empresa;
   end if;

   //
   // Se fija el porcentaje de incidencia de cada linea,
   // como asi tambien los costos totales y unitarios...
   //
   UPDATE tmpDespachos t1
   SET  PorcIncid = Prorrateo*100.0 / (SELECT IF ( SUM(Prorrateo) = 0 ) THEN
                                                   1
                                              ELSE
                                                   SUM(Prorrateo)
                                              ENDIF
                                       FROM   tmpDespachos t2
                                       WHERE  t1.Session_ID   = t2.Session_ID
                                       AND    t1.Cod_Empresa  = t2.Cod_Empresa
                                       AND    t1.NroFact      = t2.NroFact
                                       AND    t1.Cod_Articulo = t2.Cod_Articulo
                                       GROUP  BY Cod_Articulo),
        CostoTotal   = (SELECT IFNULL (SUM(ROUND(Prorrateo, mCantDecimalGS)),
                                       0,
                                       SUM(ROUND(Prorrateo, mCantDecimalGS)))
                        FROM   tmpDespachos t2
                        WHERE  t1.Session_ID   = t2.Session_ID
                        AND    t1.Cod_Empresa  = t2.Cod_Empresa
                        AND    t1.NroFact      = t2.NroFact
                        AND    t1.Cod_Articulo = t2.Cod_Articulo
                        GROUP  BY Cod_Articulo),
        CostoTotalME = (SELECT IFNULL (SUM(ROUND(ProrrateoME, mCantDecimalME)),
                                       0,
                                       SUM(ROUND(ProrrateoME, mCantDecimalME)))
                        FROM   tmpDespachos t2
                        WHERE  t1.Session_ID   = t2.Session_ID
                        AND    t1.Cod_Empresa  = t2.Cod_Empresa
                        AND    t1.NroFact      = t2.NroFact
                        AND    t1.Cod_Articulo = t2.Cod_Articulo
                        GROUP  BY Cod_Articulo),
        CantFaltantes = (SELECT IFNULL(SUM(CantFaltantes), 0,
                                       SUM(CantFaltantes))
                         FROM   tmpDespachos t2
                         WHERE  t1.Session_ID   = t2.Session_ID
                         AND    t1.Cod_Empresa  = t2.Cod_Empresa
                         AND    t1.NroFact      = t2.NroFact
                         AND    t1.Cod_Articulo = t2.Cod_Articulo
                         GROUP  BY Cod_Articulo)
   WHERE  Session_ID  = mSession_ID
   AND    Cod_Empresa = mCod_Empresa;

   UPDATE tmpDespachos t1
   SET  CostoUnitario   = ROUND(CostoTotal / (SELECT SUM(Cantidad)
                                      FROM   tmpDespachos t2
                                      WHERE  t1.Session_ID   = t2.Session_ID
                                      AND    t1.Cod_Empresa  = t2.Cod_Empresa
                                      AND    t1.NroFact      = t2.NroFact
                                      AND    t1.Cod_Articulo = t2.Cod_Articulo
                                      AND    t2.Cantidad     > 0
                                      GROUP  BY Cod_Articulo), mCantDecimalGS),
        CostoUnitarioME = ROUND(CostoTotalME / (SELECT SUM(Cantidad)
                                      FROM   tmpDespachos t2
                                      WHERE  t1.Session_ID   = t2.Session_ID
                                      AND    t1.Cod_Empresa  = t2.Cod_Empresa
                                      AND    t1.NroFact      = t2.NroFact
                                      AND    t1.Cod_Articulo = t2.Cod_Articulo
                                      AND    t2.Cantidad     > 0
                                      GROUP  BY Cod_Articulo), mCantDecimalME)
   WHERE  Session_ID  = mSession_ID
   AND    Cod_Empresa = mCod_Empresa;

   //
   // Se debe actualizar los PRECIOS DE COSTOS de los articulos en cuestion...
   //

end