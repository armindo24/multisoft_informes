CREATE PROCEDURE "DBA"."Gen_Proveed_Saldo" ( mSID            char(15),
                                     mCodEmpresa     char(2),
                                     mPeriodo        char(8),
                                     mCodProv        char(4),
                                     mFechaDesde     date,
                                     mFechaHasta     date,
                                     mTipoSaldo      char(1) )
begin
   declare err_usr exception for sqlstate '99999';
   declare no_data_found exception for sqlstate '02000';

   declare _FACTURAS           numeric(1);
   declare _PAGOS              numeric(1);
   declare _DESPACHOS          numeric(1);
   declare _FACTURA_MUESTRA    char(2);
   declare _TPDEF_DESPACHOS    char(2);
   declare _RETENCION          char(2);
   declare _NOTA_CREDITO_PROVEEDOR char(2);

   declare bIncluir            char (1);
   declare mNroFact            numeric(15);
   declare mCodTpComp          char(4);
   declare mFechaFact          datetime;
   declare mFechaVto           datetime;
   declare mIvaIncluido        char(1);
   declare mFactCambio         money;
   declare mTotalExen          money;
   declare mTotalGrav          money;
   declare mIVA                money;
   declare mSaldo              money;
   declare mTotalImporte       money;
   declare mSaldoAnterior      money;
   declare mCredito            money;
   declare mDebito             money;
   declare mSaldoAnteriorME    money;
   declare mCreditoME          money;
   declare mDebitoME           money;

   declare mCodMoneda          char(2);
   declare mRazonSocial        varchar(60);
   declare mTp_Def             char(2);
   declare mCant               numeric(5);

   declare mNroOP              numeric(15);
   declare mFecha              datetime;
   declare mOPCambio           money;
   declare mOPCabCambio        money;
   declare mOPMoneda           char(2);
   declare mImporte            money;
   declare mComentario         varchar(40);

   declare mAnho               numeric(4);
   declare mNroDespacho        numeric(15);
   declare mAnhoRef            numeric(4);
   declare mNroDespachoRef     numeric(15);
   declare mFechaDespacho      date;

   declare mMonedaLocal        char(2);
   declare mMonedaExt          char(2);

   declare mTotal              money;
   declare mTipoOp             char(1);
   declare mFechaIni           datetime;
   declare mFechaFin           datetime;

   declare crs_Compras cursor for
           SELECT fc.nrofact, fc.cod_tp_comp, fc.fechafact,
                  fc.fechavto, fc.ivaincluido, fc.factcambio,
                  fc.totalexen, fc.totalgrav, fc.iva,
                  fc.saldo, fc.codmoneda, p.RazonSocial,
                  t.tp_def, fc.Anho, fc.NroDespacho
           FROM   TpoCbte t, Proveed p, FactCab fc
           WHERE  FC.Cod_Empresa      = mCodEmpresa
           AND    FC.CodProv          = mCodProv
           AND    FC.Asentado         = 'S'
           AND    FC.Nrorendicion IS NULL
           AND    FC.FondoFijo        = 'N'
           AND    FC.IncluirExtracto  = 'S'
           //AND    DATE(FC.FechaFact) <= mFechaHasta
           AND    FC.FechaFact       <= mFechaFin
           AND    FC.Cod_Empresa      = P.Cod_Empresa
           AND    FC.CodProv          = P.CodProv
           AND    FC.Cod_Empresa      = T.Cod_Empresa
           AND    FC.Cod_tp_Comp      = T.Cod_tp_Comp
           AND    T.Tp_Def           != _FACTURA_MUESTRA
           ORDER  BY fc.fechafact, fc.nrofact;

   declare crs_Pagos cursor for
           SELECT od.nroop, oc.cod_tp_comp, oc.fecha,
                  od.factcambio, oc.codmoneda, od.importe,
                  T.Tp_def, oc.concepto, oc.totalimporte,
                  oc.factcambio, oc.tipoop
           FROM   TpoCBTE T, OPCab OC, OPDet OD
           WHERE  OC.cod_empresa  = mCodEmpresa
           AND    OC.codprov      = mCodProv
           AND    OC.autorizado   = 'S'
           AND    OC.anulado     <> 'S'
           //AND    DATE(OC.Fecha) <= mFechaHasta
           AND    OC.Fecha       <= mFechaFin
           AND    OC.cod_empresa  = T.Cod_Empresa
           AND    OC.Cod_Tp_Comp  = T.Cod_Tp_Comp
           AND    OC.cod_empresa  = od.cod_empresa
           AND    OC.TipoOP       = od.TipoOP
           AND    OC.nroop        = od.nroop
           AND    od.nrofact      = mNroFact
           AND    od.cod_tp_comp  = mCodTpComp
           ORDER  BY OC.Fecha, od.NroOP;

   declare crs_Despachos cursor for
           SELECT d.Anho, d.NroDespacho, d.FechaDespacho, d.FactCambio,
                  d.TotalExento, d.TotalGravado, d.TotalIVA,
                  d.Saldo, d.CodMoneda, p.RazonSocial
           FROM   Despacho d, Proveed p
           WHERE  d.Cod_Empresa          = mCodEmpresa
           AND    d.CodDespachante       = mCodProv
           AND    d.Asentado             = 'S'
           //AND    DATE(d.FechaDespacho) <= mFechaHasta
           AND    d.FechaDespacho       <= mFechaFin
           AND    d.Cod_Empresa          = p.Cod_Empresa
           AND    d.CodDespachante       = p.CodProv
           ORDER  BY d.FechaDespacho, d.NroDespacho;

   declare crs_PagosDesp cursor for
           SELECT od.NroOP, oc.Cod_Tp_Comp, oc.Fecha,
                  od.FactCambio, oc.CodMoneda, od.Importe,
                  T.Tp_Def, oc.Concepto, oc.TotalImporte,
                  oc.FactCambio
           FROM   TpoCbte t, OPCab oc, OPDet od
           WHERE  oc.Cod_Empresa    = mCodEmpresa
           AND    oc.CodProv        = mCodProv
           AND    oc.Autorizado     = 'S'
           AND    oc.Anulado       <> 'S'
           //AND    DATE(oc.Fecha)   <= mFechaHasta
           AND    oc.Fecha         <= mFechaFin
           AND    oc.Cod_Empresa    = T.Cod_Empresa
           AND    oc.Cod_Tp_Comp    = T.Cod_Tp_Comp
           AND    oc.Cod_Empresa    = od.Cod_Empresa
           AND    oc.TipoOP         = od.TipoOP
           AND    oc.NroOP          = od.NroOP
           //   ----------------------------------------------------
           //   esto debe ser, pero por generaciones que se
           //   hicieron "mal" al comienzo se agrega lo del 'OR'...
           //   ----------------------------------------------------
           //   AND    od.Anho           = mAnho
           //   AND    od.CodDespachante = mCodProv
           //   AND    od.NroDespacho    = mNroDespacho
           //
           AND (
                 (od.Anho           = mAnho    AND
                  od.CodDespachante = mCodProv AND
                  od.NroDespacho    = mNroDespacho) OR

                 (od.NroFact     = mNroDespacho AND
                  od.NroDespacho IS NULL        AND
                  od.CodProv     IS NULL)
               )
           ORDER  BY oc.Fecha, od.NroOP;

   declare crs_Anticipos cursor for
           SELECT oc.nroop, oc.cod_tp_comp, oc.fecha,
                  oc.factcambio, oc.codmoneda,
                  oc.TotalImporte, T.Tp_def, oc.concepto,
                  p.razonsocial
           FROM   TpoCBTE T, OPCab OC, Proveed P
           WHERE  oc.cod_empresa   = mCodEmpresa
           AND    oc.codprov       = mCodProv
           AND    oc.autorizado    = 'S'
           AND    oc.anulado      <> 'S'
           //AND    DATE (oc.Fecha) <= mFechaHasta
           AND    oc.Fecha           <= mFechaFin
           AND    OC.Cod_Empresa      = P.Cod_Empresa
           AND    OC.CodProv          = P.CodProv
           AND    oc.cod_empresa   = T.Cod_Empresa
           AND    oc.Cod_Tp_Comp   = T.Cod_Tp_Comp
           AND    NOT EXISTS (SELECT *
                              FROM   OPDet od
                              WHERE  oc.cod_empresa = od.cod_empresa
                              AND    oc.TipoOP      = od.TipoOP
                              AND    oc.nroop       = od.nroop);

   set _FACTURAS         = 1;
   set _PAGOS            = 2;
   set _DESPACHOS        = 3;
   set _FACTURA_MUESTRA  = 'FM';
   set _TPDEF_DESPACHOS  = 'DE';
   set _RETENCION        = 'RT';
   set _NOTA_CREDITO_PROVEEDOR = 'NP';

   //
   // Se traen los datos necesarios de la tabla de CONTROL...
   //
   SELECT MonedaLocal, MonedaExtranjera
   INTO   mMonedaLocal, mMonedaExt
   FROM   Control
   WHERE  Cod_Empresa = mCodEmpresa
   AND    Periodo     = mPeriodo;

   set mSaldoAnterior   = 0;
   set mSaldoAnteriorME = 0;

   set mDebito  = 0;
   set mCredito = 0;

   set mDebitoME  = 0;
   set mCreditoME = 0;
   
   message string ('Procesando proveedor...', mCodProv ) type info to client;
   
   message string ('Antes crs_Compras...', mCodProv ) type info to client;

   set mFechaIni = DATETIME(STRING(mFechaDesde) + ' 00:00:00');
   set mFechaFin = DATETIME(STRING(mFechaHasta) + ' 23:59:59');

   open crs_Compras;
   Compras:
   loop
      fetch crs_Compras into mNroFact, mCodTpComp, mFechaFact,
                            mFechaVto, mIvaIncluido,
                            mFactCambio, mTotalExen, mTotalGrav,
                            mIVA, mSaldo, mCodMoneda, mRazonSocial,
                            mTp_Def, mAnhoRef, mNroDespachoRef;

      if ( SQLSTATE = no_data_found ) then
          leave Compras;
      end if;

      message string ('Procesando crs_Compras...', mCodProv, '#', mCodTpComp, '#', mNroFact, '#', mCodMoneda ) type info to client;
      
      set mTotal = mTotalExen + mTotalGrav;
      set bIncluir = 'N';

      if ( mSaldo = 0 AND mTipoSaldo IN ( 'C', 'T' ) ) THEN
         set bIncluir = 'S';
      elseif ( mSaldo > 0 AND mTipoSaldo IN ('S', 'T' ) ) THEN
         set bIncluir = 'S';
      end if;

      if ( bIncluir = 'S' ) THEN
         if ( mIVAIncluido = 'N' ) then
            set mTotal = mTotal + mIVA;
         end if;

         //
         // Si se trata de una NOTA DE CREDITO
         //
         if ( mTp_Def = _NOTA_CREDITO_PROVEEDOR ) OR ( mTp_Def = _RETENCION ) then

            if mTp_Def = _NOTA_CREDITO_PROVEEDOR then
               set mComentario = 'Nota Créd. Nº ' + TRIM(STRING(mNroFact));
            else
               set mComentario = 'Retención Nº ' + TRIM(STRING(mNroFact));
            end if;

            if ( DATE(mFechaDesde) <= DATE (mFechaFact) ) then
               if ( mCodMoneda = mMonedaLocal ) then
                  set mDebito = mDebito + mTotal ;
               else
                  set mDebitoME = mDebitoME + mTotal ;
               end if;
            else
               if ( mCodMoneda = mMonedaLocal ) then
                  set mSaldoAnterior = mSaldoAnterior - mTotal;
               else
                  set mSaldoAnteriorME = mSaldoAnteriorME - mTotal;
               end if;
            end if;

         else
            set mComentario = '';

            if ( DATE(mFechaDesde) <= DATE (mFechaFact) ) then
               if ( mCodMoneda = mMonedaLocal ) then
                  set mCredito = mCredito + mTotal;
               else
                  set mCreditoME = mCreditoME + mTotal;
               end if;
            else
               if ( mCodMoneda = mMonedaLocal ) then
                  set mSaldoAnterior = mSaldoAnterior + mTotal;
               else
                  set mSaldoAnteriorME = mSaldoAnteriorME + mTotal;
               end if;
            end if;
         end if;
         //
         // Ver los pagos relacionados a la Factura
         //
         open crs_Pagos;
         Pagos:
         loop
            fetch crs_Pagos into mNroOP, mCodTpComp, mFecha, mOPCambio,
                                 mOPMoneda, mImporte, mTp_Def,
                                 mComentario, mTotalImporte, mOPCabCambio,
                                 mTipoOp;

            if ( SQLSTATE = no_data_found ) then
                leave Pagos;
            end if;

            if mTipoOp <> 'C' then
               if ( mCodMoneda <> mOPMoneda ) then
                  if ( mOPMoneda = mMonedaLocal ) then
                     set mImporte      = mImporte      / mOPCambio;
                     set mTotalImporte = mTotalImporte / mOPCambio;
                  else
                     if ( mOPCambio = 1 ) THEN
                        set mOPCambio = mOPCabCambio;
                     end if;
                     set mImporte      = mImporte      * mOPCambio;
                     set mTotalImporte = mTotalImporte * mOPCambio;
                  end if;
               end if;
               if ( mCodMoneda = mMonedaLocal ) then
                  set mTotalImporte = ROUND (mTotalImporte, 0);
                  set mImporte      = ROUND (mImporte, 0);
               else
                  set mTotalImporte = ROUND (mTotalImporte, 2);
                  set mImporte      = ROUND (mImporte, 2);
               end if;
            end if;
            if ( DATE(mFechaDesde) <= DATE (mFecha) ) then
               if ( mCodMoneda = mMonedaLocal ) then
                  set mDebito = mDebito + mImporte;
               else
                  set mDebitoME = mDebitoME + mImporte;
               end if;
            else
               if ( mCodMoneda = mMonedaLocal ) then
                  set mSaldoAnterior = mSaldoAnterior - mImporte;
               else
                  set mSaldoAnteriorME = mSaldoAnteriorME - mImporte;
               end if;
            end if;

         end loop Pagos;
         close crs_Pagos;
      END IF;
   end LOOP Compras;
   close crs_Compras;

   //
   // Se ven los despachos cargados...
   //
   //set mSaldoAnterior = 0;
   
   message string ('Antes crs_Despachos...', mCodProv ) type info to client;

   open crs_Despachos;
   Despachos:
   loop
      fetch crs_Despachos into mAnho, mNroDespacho, mFechaDespacho,
                               mFactCambio, mTotalExen,
                               mTotalGrav, mIVA,
                               mSaldo, mCodMoneda, mRazonSocial;

      if ( SQLSTATE = no_data_found ) then
          leave Despachos;
      end if;

      message string ('Procesando crs_Despachos...', mCodProv, '#', mNroDespacho, '#', mCodMoneda ) type info to client;

      set mTotal = mTotalExen + mTotalGrav + mIVA;
      if ( DATE(mFechaDesde) <= DATE (mFechaDespacho) ) then
         if ( mCodMoneda = mMonedaLocal ) then
            set mCredito = mCredito + mTotal;
         else
            set mCreditoME = mCreditoME + mTotal;
         end if;
      else
         if ( mCodMoneda = mMonedaLocal ) then
            set mSaldoAnterior = mSaldoAnterior + mTotal;
         else
            set mSaldoAnteriorME = mSaldoAnteriorME + mTotal;
         end if;
      end if;

      //
      // Ver los pagos relacionados al Despacho...
      //
      open crs_PagosDesp;
      Pagos:
      loop
         fetch crs_PagosDesp into mNroOP, mCodTpComp, mFecha, mOPCambio,
                                  mOPMoneda, mImporte, mTp_Def,
                                  mComentario, mTotalImporte, mOPCabCambio;

         if ( SQLSTATE = no_data_found ) then
             leave Pagos;
         end if;

         if ( mCodMoneda <> mOPMoneda ) then
            if ( mOPMoneda = mMonedaLocal ) then
               set mImporte      = mImporte      / mOPCambio;
               set mTotalImporte = mTotalImporte / mOPCambio;
            else
               if ( mOPCambio = 1 ) THEN
                  set mOPCambio = mOPCabCambio;
               end if;

               set mImporte      = mImporte      * mOPCambio;
               set mTotalImporte = mTotalImporte * mOPCambio;
            end if;
         end if;

         if ( DATE(mFechaDesde) <= DATE (mFecha) ) then
            if ( mCodMoneda = mMonedaLocal ) then
               set mDebito = mDebito + mTotalImporte;
            else
               set mDebitoME = mDebitoME + mTotalImporte;
            end if;
         else
            if ( mCodMoneda = mMonedaLocal ) then
               set mSaldoAnterior = mSaldoAnterior - mTotalImporte;
            else
               set mSaldoAnteriorME = mSaldoAnteriorME - mTotalImporte;
            end if;
         end if;

      end loop Pagos;
      close crs_PagosDesp;

   end LOOP Despachos;
   close crs_Despachos;

   //
   // Se procesan los anticipos (no aplicados a facturas)
   // a los proveedores...
   //
   message string ('Antes crs_Anticipos...', mCodProv ) type info to client;

   open crs_Anticipos;
   Anticipos:
   loop
      fetch crs_Anticipos into mNroOP, mCodTpComp, mFecha, mOPCambio,
                               mOPMoneda, mImporte, mTp_Def, mComentario,
                               mRazonSocial;

      if ( SQLSTATE = no_data_found ) then
         leave Anticipos;
      end if;

      message string ('Procesando crs_Anticipos...', mCodProv, '#', mNroOP, '#', mCodTpComp, '#', mOPMoneda ) type info to client;

      if ( DATE(mFechaDesde) <= DATE (mFecha) ) then
         if ( mOPMoneda = mMonedaLocal ) then
            set mDebito = mDebito + mImporte;
         else
            set mDebitoME = mDebitoME + mImporte;
         end if;
      else
         if ( mOPMoneda = mMonedaLocal ) then
            set mSaldoAnterior = mSaldoAnterior - mImporte;
         else
            set mSaldoAnteriorME = mSaldoAnteriorME - mImporte;
         end if;
      end if;

   end loop Anticipos;
   close crs_Anticipos;

   /*
   INSERT INTO prf values ( string (
        '-> ' , mCodProv , ' = ',
        mSaldoAnterior, ' | ',
        mDebito       , ' | ',
        mCredito
   ));
   */

   message string ('Insertando 1 ...' ) type info to client;


   INSERT INTO tmpExtProv (ID, cod_empresa, tiporegistro, codprov,
                           razonsocial, codmoneda, cod_tp_comp,
                           nrofact, fechafact, fechavto, saldo,
                           tp_def, comentario, saldoanterior,
                           debito, credito, opmoneda)
         VALUES (mSID, mCodEmpresa, 5, mCodProv,
                  mRazonSocial, mMonedaLocal, mCodTpComp,
                 1, mFechaDesde, mFechaHasta, 0,
                 mTp_Def , mComentario, mSaldoAnterior, mDebito, mCredito,
                 mCodMoneda);

   message string ('Insertando 2 ...' ) type info to client;

   INSERT INTO tmpExtProv (ID, cod_empresa, tiporegistro, codprov,
                           razonsocial, codmoneda, cod_tp_comp,
                           nrofact, fechafact, fechavto, saldo,
                           tp_def, comentario, saldoanterior,
                           debito, credito, opmoneda)
         VALUES (mSID, mCodEmpresa, 5, mCodProv,
                 mRazonSocial, mMonedaExt, mCodTpComp,
                 1, mFechaDesde, mFechaHasta, 0,
                 mTp_Def , mComentario, mSaldoAnteriorME, mDebitoME, mCreditoME,
                 mMonedaExt);

end;
