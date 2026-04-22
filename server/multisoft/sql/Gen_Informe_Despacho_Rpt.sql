-- Procedimientos Rpt para costo_articulo_full / Ecuacion BC Materiales
--
-- Si: estos procedimientos deben quedar catalogados en la base.
-- El backend ya llama a:
--   DBA.Gen_Informe_Despacho_Rpt
--
-- Y ese wrapper, segun Control.ProrrateoImport, debe derivar a:
--   DBA.Gen_Informe_Despacho_PorcAranc_Rpt
--   DBA.Gen_Informe_Despacho_Costo_Rpt
--   DBA.Gen_Informe_Despacho_Peso_Rpt
--
-- Objetivo de las versiones *_Rpt:
--   - llenar / recalcular tmpdespachos
--   - mantener toda la logica de costeo del despacho
--   - NO actualizar dba.FactDet
--   - NO disparar auditoria sobre dba.FACTDET_AuditDB
--
-- Cambio clave:
--   copiar los procedimientos originales y quitar el bloque final que hace:
--     update FactDet set PrecioCosto   = ...
--     update FactDet set PrecioCostoML = ...
--
-- =====================================================================
-- 1. Wrapper principal: DBA.Gen_Informe_Despacho_Rpt
-- =====================================================================

ALTER PROCEDURE "DBA"."Gen_Informe_Despacho_Rpt"
(
    IN mSession_ID       CHAR(16),
    IN mCod_Empresa      CHAR(2),
    IN mPeriodo          CHAR(8),
    IN mAnho             NUMERIC(4),
    IN mCodDespachante   CHAR(4),
    IN mNroDespacho      NUMERIC(7),
    IN mCierre           CHAR(1),
    IN mTipo             CHAR(1)
)
BEGIN
   DECLARE err_usr EXCEPTION FOR SQLSTATE '99999';
   DECLARE no_data_found EXCEPTION FOR SQLSTATE '02000';

   DECLARE _PRORRATEO_X_COSTO              CHAR(1);
   DECLARE _PRORRATEO_X_PESO_BRUTO         CHAR(1);
   DECLARE _PRORRATEO_X_PESO_NETO          CHAR(1);
   DECLARE _PRORRATEO_X_PORC_ARANCELARIO   CHAR(1);

   DECLARE mMonedaLocal                    CHAR(2);
   DECLARE mMonedaExtranjera               CHAR(2);
   DECLARE mCantDecimalME                  NUMERIC(1);
   DECLARE mCantDecimalGS                  NUMERIC(1);
   DECLARE mProrrateoImport                CHAR(1);
   DECLARE mLimiteFaltantes                MONEY;
   DECLARE mMonedaLimFalt                  CHAR(2);

   SET _PRORRATEO_X_COSTO            = 'C';
   SET _PRORRATEO_X_PESO_BRUTO       = 'P';
   SET _PRORRATEO_X_PESO_NETO        = 'N';
   SET _PRORRATEO_X_PORC_ARANCELARIO = 'A';

   SELECT MonedaLocal, MonedaExtranjera,
          CantDecimalME, CantDecimalGS,
          ProrrateoImport, LimiteFaltantes, MonedaLimFalt
   INTO   mMonedaLocal, mMonedaExtranjera,
          mCantDecimalME, mCantDecimalGS,
          mProrrateoImport, mLimiteFaltantes, mMonedaLimFalt
   FROM   Control
   WHERE  Cod_Empresa = mCod_Empresa
   AND    Periodo     = mPeriodo;

   IF ( mProrrateoImport = _PRORRATEO_X_PESO_BRUTO OR
        mProrrateoImport = _PRORRATEO_X_PESO_NETO ) THEN

      CALL Gen_Informe_Despacho_Peso_Rpt(
           mSession_ID,
           mCod_Empresa,
           mPeriodo,
           mAnho,
           mCodDespachante,
           mNroDespacho
      );

   ELSEIF ( mProrrateoImport = _PRORRATEO_X_PORC_ARANCELARIO ) THEN

      CALL Gen_Informe_Despacho_PorcAranc_Rpt(
           mSession_ID,
           mCod_Empresa,
           mPeriodo,
           mAnho,
           mCodDespachante,
           mNroDespacho,
           mCierre,
           mTipo
      );

   ELSE

      CALL Gen_Informe_Despacho_Costo_Rpt(
           mSession_ID,
           mCod_Empresa,
           mPeriodo,
           mAnho,
           mCodDespachante,
           mNroDespacho
      );

   END IF;

END;

-- =====================================================================
-- 2. Gen_Informe_Despacho_PorcAranc_Rpt
-- =====================================================================
--
-- Base:
--   copiar DBA.Gen_Informe_Despacho_PorcAranc
--
-- Renombre:
--   ALTER PROCEDURE "DBA"."Gen_Informe_Despacho_PorcAranc_Rpt" (...)
--
-- Dejar:
--   toda la logica que:
--   - lee despacho / facturas / liquidaciones
--   - inserta en tmpdespachos
--   - recalcula prorrateo
--   - recalcula costo total / costo unitario
--
-- Cortar:
--   desde:
--     open cur_FactDesp;
--   hasta:
--     close cur_FactDesp
--
-- En otras palabras:
--   la version Rpt termina justo despues de estos dos updates sobre tmpdespachos:
--
--     update tmpdespachos as t1
--       set PorcIncid = ...,
--           CostoTotal = ...,
--           CostoTotalME = ...,
--           CantFaltantes = ...
--       where Session_ID = mSession_ID
--       and Cod_Empresa = mCod_Empresa;
--
--     update tmpdespachos as t1
--       set CostoUnitario = ...,
--           CostoUnitarioME = ...
--       where Session_ID = mSession_ID
--       and Cod_Empresa = mCod_Empresa;
--
--   y luego:
--     END
--
-- Bloque que NO debe existir en la version Rpt:
--
--     open cur_FactDesp;
--     FactDespachos: loop
--       ...
--       update FactDet as fd set fd.PrecioCosto = ...
--       update FactDet as fd set fd.PrecioCosto = fd.Pr_Unit ...
--       update FactDet as fd set fd.PrecioCostoML = ...
--       update FactDet as fd set fd.PrecioCostoML = ...
--     end loop FactDespachos;
--     close cur_FactDesp
--
-- Ese bloque es el que dispara FACTDET_AuditDB.
--
-- Firma esperada:
--
-- ALTER PROCEDURE "DBA"."Gen_Informe_Despacho_PorcAranc_Rpt"
-- (
--     IN mSession_ID       CHAR(16),
--     IN mCod_Empresa      CHAR(2),
--     IN mPeriodo          CHAR(8),
--     IN mAnho             NUMERIC(4),
--     IN mCodDespachante   CHAR(4),
--     IN mNroDespacho      NUMERIC(7),
--     IN mCierre           CHAR(1),
--     IN mTipo             CHAR(1)
-- )
-- BEGIN
--   -- mismo cuerpo de Gen_Informe_Despacho_PorcAranc
--   -- sin el bloque final open cur_FactDesp / close cur_FactDesp
-- END;

-- =====================================================================
-- 3. Gen_Informe_Despacho_Costo_Rpt
-- =====================================================================
--
-- Base:
--   copiar DBA.Gen_Informe_Despacho_Costo
--
-- Renombre:
--   ALTER PROCEDURE "DBA"."Gen_Informe_Despacho_Costo_Rpt" (...)
--
-- Aplicar exactamente el mismo criterio:
--   quitar desde:
--     open cur_FactDesp;
--   hasta:
--     close cur_FactDesp;
--
-- Firma esperada:
--
-- ALTER PROCEDURE "DBA"."Gen_Informe_Despacho_Costo_Rpt"
-- (
--     IN mSession_ID       CHAR(16),
--     IN mCod_Empresa      CHAR(2),
--     IN mPeriodo          CHAR(8),
--     IN mAnho             NUMERIC(4),
--     IN mCodDespachante   CHAR(4),
--     IN mNroDespacho      NUMERIC(7)
-- )
-- BEGIN
--   -- mismo cuerpo de Gen_Informe_Despacho_Costo
--   -- sin el bloque final open cur_FactDesp / close cur_FactDesp
-- END;

-- =====================================================================
-- 4. Gen_Informe_Despacho_Peso_Rpt
-- =====================================================================
--
-- Solo es necesario si Control.ProrrateoImport puede venir con:
--   'P' o 'N'
--
-- Base:
--   copiar DBA.Gen_Informe_Despacho_Peso
--
-- Renombre:
--   ALTER PROCEDURE "DBA"."Gen_Informe_Despacho_Peso_Rpt" (...)
--
-- Aplicar el mismo criterio:
--   quitar el bloque final que actualiza FactDet.

-- =====================================================================
-- 5. Checklist de catalogacion en la base
-- =====================================================================
--
-- Minimo para el caso actual:
--   1. Catalogar DBA.Gen_Informe_Despacho_Rpt
--   2. Catalogar DBA.Gen_Informe_Despacho_PorcAranc_Rpt
--
-- Recomendado para dejarlo completo:
--   3. Catalogar DBA.Gen_Informe_Despacho_Costo_Rpt
--   4. Catalogar DBA.Gen_Informe_Despacho_Peso_Rpt
--
-- Verificacion rapida sugerida:
--   SELECT proc_name
--   FROM SYS.SYSPROCEDURE
--   WHERE proc_name IN (
--       'Gen_Informe_Despacho_Rpt',
--       'Gen_Informe_Despacho_PorcAranc_Rpt',
--       'Gen_Informe_Despacho_Costo_Rpt',
--       'Gen_Informe_Despacho_Peso_Rpt'
--   );
--
-- Nota final:
--   En este workspace solo dejamos la guia y el backend preparado.
--   La catalogacion real debe hacerse en la base SQL Anywhere donde vive DBA.
