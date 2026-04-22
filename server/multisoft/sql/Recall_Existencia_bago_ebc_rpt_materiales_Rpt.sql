ALTER PROCEDURE "DBA"."Recall_Existencia_bago_ebc_rpt_materiales_Rpt"( in mSID char(15),in mCod_Empresa char(2),in mFechaDesde date,in mFechaHasta date ) 
/* RESULT( column_name column_type, ... ) */
begin
  // AQUI SE RECALCULA EL STOCK INICIAL PARA EL INFORME DE MATERIALES
  //--------------VENTAS------------------
  insert into dba.TmpRecallExistenciaEBC_Materiales
    select mSID,d.cod_empresa,m.cod_articulo,'VTA',
      sum(if t.af_existencia = 'D' then
        d.cantidad*-1
      else if t.af_existencia = 'I' then
          d.cantidad
        else 0
        endif
      endif)
      from vtacab as c,vtadet as d,tpocbte as t,articulo as a,articulo as m
      where c.cod_empresa = d.cod_empresa
      and c.cod_tp_comp = d.cod_tp_comp
      and c.comp_numero = d.comp_numero
      and c.cod_empresa = t.cod_empresa
      and c.cod_tp_comp = t.cod_tp_comp
      and d.cod_empresa = a.cod_empresa
      and d.cod_articulo = a.cod_articulo
      and a.cod_empresa = m.cod_empresa
      and a.codartpad = m.cod_articulo
      and d.cod_empresa = mCod_Empresa
      and "date"(c.fha_cbte) between mFechaDesde and mFechaHasta
      and c.anulado = 'N'
      and a.cod_familia = '99'
      and a.cod_grupo = '02'
      and m.cod_familia = '99'
      and m.cod_grupo = '02'
      group by d.cod_empresa,m.cod_articulo
      order by d.cod_empresa asc,m.cod_articulo asc;
  //---------REMISIONES NO FACTURADAS-------------
  insert into dba.TmpRecallExistenciaEBC_Materiales
    select mSID,d.cod_empresa,m.cod_articulo,'REM',sum(d.cantidad*-1)
      from remiscab as c,remisdet as d,tpocbte as t,articulo as a,articulo as m
      where c.cod_empresa = d.cod_empresa
      and c.cod_tp_comp = d.cod_tp_comp
      and c.comp_numero = d.comp_numero
      and c.cod_empresa = t.cod_empresa
      and c.cod_tp_comp = t.cod_tp_comp
      and d.cod_empresa = a.cod_empresa
      and d.cod_articulo = a.cod_articulo
      and a.cod_empresa = m.cod_empresa
      and a.codartpad = m.cod_articulo
      and c.rf_tp_comp is null
      and d.cod_empresa = mCod_Empresa
      and "date"(c.fha_cbte) between mFechaDesde and mFechaHasta
      and c.anulado = 'N'
      and t.af_existencia = 'D'
      and a.cod_familia = '99'
      and a.cod_grupo = '02'
      and m.cod_familia = '99'
      and m.cod_grupo = '02'
      group by d.cod_empresa,m.cod_articulo
      order by d.cod_empresa asc,m.cod_articulo asc;
  //---------------STOCK---------------
  insert into dba.TmpRecallExistenciaEBC_Materiales
    select mSID,d.cod_empresa,m.cod_articulo,'STK',
      sum(if t.af_existencia = 'D' then
        d.cantidad*-1
      else if t.af_existencia = 'I' then
          d.cantidad
        else 0
        endif
      endif)
      from stcab as c,stdet as d,tpocbte as t,articulo as a,articulo as m
      where c.cod_empresa = d.cod_empresa
      and c.cod_sucursal = d.cod_sucursal
      and c.cod_deposito = d.cod_deposito
      and c.cod_tp_comp = d.cod_tp_comp
      and c.comp_numero = d.comp_numero
      and c.cod_empresa = t.cod_empresa
      and c.cod_tp_comp = t.cod_tp_comp
      and d.cod_empresa = a.cod_empresa
      and d.cod_articulo = a.cod_articulo
      and a.cod_empresa = m.cod_empresa
      and a.codartpad = m.cod_articulo
      and d.cod_empresa = mCod_Empresa
      and "date"(c.fha_mvto) between mFechaDesde and mFechaHasta
      and t.tp_def <> 'TR'
      and a.cod_familia = '99'
      and a.cod_grupo = '02'
      and m.cod_familia = '99'
      and m.cod_grupo = '02'
      and d.cod_deposito <> '08'
      group by d.cod_empresa,m.cod_articulo
      order by d.cod_empresa asc,m.cod_articulo asc;
  //---------------PRODUCCION - ENTRADA------------
  insert into dba.TmpRecallExistenciaEBC_Materiales
    select mSID,c.cod_empresa,m.cod_articulo,'PRE',sum(c.cantidad)
      from ordprodcab as c,tpocbte as t,articulo as a,articulo as m
      where c.cod_empresa = t.cod_empresa
      and c.cod_tp_comp = t.cod_tp_comp
      and c.cod_empresa = a.cod_empresa
      and c.cod_articulo = a.cod_articulo
      and a.cod_empresa = m.cod_empresa
      and a.codartpad = m.cod_articulo
      and c.cod_empresa = mCod_Empresa
      and "date"(c.fechahoraprod) between mFechaDesde and mFechaHasta
      and a.cod_familia = '99'
      and a.cod_grupo = '02'
      and m.cod_familia = '99'
      and m.cod_grupo = '02'
      group by c.cod_empresa,m.cod_articulo
      order by c.cod_empresa asc,m.cod_articulo asc;
  //---------------PRODUCCION - SALIDA------------
  insert into dba.TmpRecallExistenciaEBC_Materiales
    select mSID,d.cod_empresa,m.cod_articulo,'PRS',sum(d.cantidad*-1)
      from ordprodcab as c,ordproddet as d,tpocbte as t,articulo as a,articulo as m
      where c.cod_empresa = d.cod_empresa
      and c.cod_tp_comp = d.cod_tp_comp
      and c.nroordprod = d.nroordprod
      and c.cod_empresa = t.cod_empresa
      and c.cod_tp_comp = t.cod_tp_comp
      and d.cod_empresa = a.cod_empresa
      and d.cod_articulo = a.cod_articulo
      and a.cod_empresa = m.cod_empresa
      and a.codartpad = m.cod_articulo
      and d.cod_empresa = mCod_Empresa
      and "date"(c.fechahoraprod) between mFechaDesde and mFechaHasta
      and a.cod_familia = '99'
      and a.cod_grupo = '02'
      and m.cod_familia = '99'
      and m.cod_grupo = '02'
      group by d.cod_empresa,m.cod_articulo
      order by d.cod_empresa asc,m.cod_articulo asc;
  //---------------COMPRAS------------
  insert into dba.TmpRecallExistenciaEBC_Materiales
    select mSID,d.cod_empresa,m.cod_articulo,'FCT',
      sum(if t.af_existencia = 'D' then
        (d.cantidad-d.cantfaltante)*-1
      else if t.af_existencia = 'I' then
          (d.cantidad-d.cantfaltante)
        else 0
        endif
      endif) as cantidad
      from factcab as c,factdet as d,tpocbte as t,articulo as a,articulo as m
      where c.cod_empresa = d.cod_empresa
      and c.cod_tp_comp = d.cod_tp_comp
      and c.codprov = d.codprov
      and c.nrofact = d.nrofact
      and c.cod_empresa = t.cod_empresa
      and c.cod_tp_comp = t.cod_tp_comp
      and d.cod_empresa = a.cod_empresa
      and d.cod_articulo = a.cod_articulo
      and a.cod_empresa = m.cod_empresa
      and a.codartpad = m.cod_articulo
      and c.cod_empresa = mCod_Empresa
      and "date"(c.fechaingreso) between mFechaDesde and mFechaHasta
      and c.asentado = 'S'
      and a.cod_familia = '99'
      and a.cod_grupo = '02'
      and m.cod_familia = '99'
      and m.cod_grupo = '02'
      group by d.cod_empresa,m.cod_articulo
      order by d.cod_empresa asc,m.cod_articulo asc;
  //---------------TRANSFERENCIA - ENTRADA---------------
  insert into dba.TmpRecallExistenciaEBC_Materiales
    select mSID,d.cod_empresa,m.cod_articulo,'TRE',sum(d.cantidad)
      from stcab as c,stdet as d,tpocbte as t,articulo as a,articulo as m
      where c.cod_empresa = d.cod_empresa
      and c.cod_sucursal = d.cod_sucursal
      and c.cod_deposito = d.cod_deposito
      and c.cod_tp_comp = d.cod_tp_comp
      and c.comp_numero = d.comp_numero
      and c.cod_empresa = t.cod_empresa
      and c.cod_tp_comp = t.cod_tp_comp
      and d.cod_empresa = a.cod_empresa
      and d.cod_articulo = a.cod_articulo
      and a.cod_empresa = m.cod_empresa
      and a.codartpad = m.cod_articulo
      and c.cod_empresa = mCod_Empresa
      and "date"(c.fha_mvto) between mFechaDesde and mFechaHasta
      and t.tp_def = 'TR'
      and t.af_existencia = 'D'
      and a.cod_familia = '99'
      and a.cod_grupo = '02'
      and m.cod_familia = '99'
      and m.cod_grupo = '02'
      and c.cod_deposito2 <> '08'
      group by d.cod_empresa,m.cod_articulo
      order by d.cod_empresa asc,m.cod_articulo asc;
  //---------------TRANSFERENCIA - SALIDA---------------
  insert into dba.TmpRecallExistenciaEBC_Materiales
    select mSID,d.cod_empresa,m.cod_articulo,'TRS',sum(d.cantidad*-1)
      from stcab as c,stdet as d,tpocbte as t,articulo as a,articulo as m
      where c.cod_empresa = d.cod_empresa
      and c.cod_sucursal = d.cod_sucursal
      and c.cod_deposito = d.cod_deposito
      and c.cod_tp_comp = d.cod_tp_comp
      and c.comp_numero = d.comp_numero
      and c.cod_empresa = t.cod_empresa
      and c.cod_tp_comp = t.cod_tp_comp
      and d.cod_empresa = a.cod_empresa
      and d.cod_articulo = a.cod_articulo
      and a.cod_empresa = m.cod_empresa
      and a.codartpad = m.cod_articulo
      and c.cod_empresa = mCod_Empresa
      and "date"(c.fha_mvto) between mFechaDesde and mFechaHasta
      and t.tp_def = 'TR'
      and t.af_existencia = 'D'
      and a.cod_familia = '99'
      and a.cod_grupo = '02'
      and m.cod_familia = '99'
      and m.cod_grupo = '02'
      and c.cod_deposito <> '08'
      group by d.cod_empresa,m.cod_articulo
      order by d.cod_empresa asc,m.cod_articulo asc;
  //-----------INSERTO EN EL TEMPORAL--------------
  insert into tmp_ExistenciaEBC_Materiales( SessionID,cod_empresa,cod_articulo,Existencia_Calc ) 
    select mSID,d.cod_empresa,d.cod_articulo,sum(if d.cantidad is null then 0 else d.cantidad endif)
      from dba.TmpRecallExistenciaEBC_Materiales as d
      where d.SessionID = mSID
      and d.cod_empresa = mCod_empresa
      group by d.cod_empresa,d.cod_articulo
      order by d.cod_empresa asc,d.cod_articulo asc;
  //
  insert into tmp_ecuacion_bienes_cambio_materiales( SessionID,cod_empresa,cod_articulo,unidad_inventario_inicial,Cto_Prom_inventario_inicial_Gs ) 
    select mSID,tmp_ExistenciaEBC_Materiales.cod_empresa,tmp_ExistenciaEBC_Materiales.Cod_Articulo,tmp_ExistenciaEBC_Materiales.existencia_calc,
      tmp_cto_ult_dia_mes_ebc_materiales.cto_prom_gs
      from tmp_ExistenciaEBC_Materiales,tmp_cto_ult_dia_mes_ebc_materiales
      where tmp_ExistenciaEBC_Materiales.Cod_empresa = tmp_cto_ult_dia_mes_ebc_materiales.Cod_empresa
      and tmp_ExistenciaEBC_Materiales.Cod_Articulo = tmp_cto_ult_dia_mes_ebc_materiales.cod_articulo
      and tmp_ExistenciaEBC_Materiales.SessionID = mSID
      and tmp_ExistenciaEBC_Materiales.Cod_Empresa = mCod_Empresa
      and tmp_cto_ult_dia_mes_ebc_materiales.fecha = mFechaHasta
      order by tmp_ExistenciaEBC_Materiales.Cod_Articulo asc;
  // DIAGNOSTICO TEMPORAL:
  // Se deja activa solo la primera pasada. La segunda pasada de recuento
  // queda desactivada completa para aislar el problema.
  delete from dba.TmpRecallExistenciaEBC_Materiales
    where SessionID = mSID;
  //
  set mFechaHasta = "date"(dateadd(day,-1,dateadd(month,2,dateadd(day,-day(mFechaHasta)+1,mFechaHasta))));
  /*
  // APARTIR DE AQUI SE RECALCULA EL STOCK PARA LA COLUMNA RECUENTO PARA EL INFORME DE MATERIALES (EMPRESA INTERCOM)
  //--------------VENTAS------------------
  insert into dba.TmpRecallExistenciaEBC_Materiales
    select mSID,d.cod_empresa,m.cod_articulo,'VTA',
      sum(if t.af_existencia = 'D' then
        d.cantidad*-1
      else if t.af_existencia = 'I' then
          d.cantidad
        else 0
        endif
      endif)
      from vtacab as c,vtadet as d,tpocbte as t,articulo as a,articulo as m
      where c.cod_empresa = d.cod_empresa
      and c.cod_tp_comp = d.cod_tp_comp
      and c.comp_numero = d.comp_numero
      and c.cod_empresa = t.cod_empresa
      and c.cod_tp_comp = t.cod_tp_comp
      and d.cod_empresa = a.cod_empresa
      and d.cod_articulo = a.cod_articulo
      and a.cod_empresa = m.cod_empresa
      and a.codartpad = m.cod_articulo
      and d.cod_empresa = 'IN'
      and "date"(c.fha_cbte) between mFechaDesde and mFechaHasta
      and c.anulado = 'N'
      and a.cod_familia = '99'
      and a.cod_grupo = '02'
      and m.cod_familia = '99'
      and m.cod_grupo = '02'
      group by d.cod_empresa,m.cod_articulo
      order by d.cod_empresa asc,m.cod_articulo asc;
  //---------REMISIONES NO FACTURADAS-------------
  insert into dba.TmpRecallExistenciaEBC_Materiales
    select mSID,d.cod_empresa,m.cod_articulo,'REM',sum(d.cantidad*-1)
      from remiscab as c,remisdet as d,tpocbte as t,articulo as a,articulo as m
      where c.cod_empresa = d.cod_empresa
      and c.cod_tp_comp = d.cod_tp_comp
      and c.comp_numero = d.comp_numero
      and c.cod_empresa = t.cod_empresa
      and c.cod_tp_comp = t.cod_tp_comp
      and d.cod_empresa = a.cod_empresa
      and d.cod_articulo = a.cod_articulo
      and a.cod_empresa = m.cod_empresa
      and a.codartpad = m.cod_articulo
      and c.rf_tp_comp is null
      and d.cod_empresa = 'IN'
      and "date"(c.fha_cbte) between mFechaDesde and mFechaHasta
      and c.anulado = 'N'
      and t.af_existencia = 'D'
      and a.cod_familia = '99'
      and a.cod_grupo = '02'
      and m.cod_familia = '99'
      and m.cod_grupo = '02'
      group by d.cod_empresa,m.cod_articulo
      order by d.cod_empresa asc,m.cod_articulo asc;
  //---------------STOCK---------------
  insert into dba.TmpRecallExistenciaEBC_Materiales
    select mSID,d.cod_empresa,m.cod_articulo,'STK',
      sum(if t.af_existencia = 'D' then
        d.cantidad*-1
      else if t.af_existencia = 'I' then
          d.cantidad
        else 0
        endif
      endif)
      from stcab as c,stdet as d,tpocbte as t,articulo as a,articulo as m
      where c.cod_empresa = d.cod_empresa
      and c.cod_sucursal = d.cod_sucursal
      and c.cod_deposito = d.cod_deposito
      and c.cod_tp_comp = d.cod_tp_comp
      and c.comp_numero = d.comp_numero
      and c.cod_empresa = t.cod_empresa
      and c.cod_tp_comp = t.cod_tp_comp
      and d.cod_empresa = a.cod_empresa
      and d.cod_articulo = a.cod_articulo
      and a.cod_empresa = m.cod_empresa
      and a.codartpad = m.cod_articulo
      and d.cod_empresa = 'IN'
      and "date"(c.fha_mvto) between mFechaDesde and mFechaHasta
      and t.tp_def <> 'TR'
      and a.cod_familia = '99'
      and a.cod_grupo = '02'
      and m.cod_familia = '99'
      and m.cod_grupo = '02'
      and d.cod_deposito <> '08'
      group by d.cod_empresa,m.cod_articulo
      order by d.cod_empresa asc,m.cod_articulo asc;
  //---------------PRODUCCION - ENTRADA------------
  insert into dba.TmpRecallExistenciaEBC_Materiales
    select mSID,c.cod_empresa,m.cod_articulo,'PRE',sum(c.cantidad)
      from ordprodcab as c,tpocbte as t,articulo as a,articulo as m
      where c.cod_empresa = t.cod_empresa
      and c.cod_tp_comp = t.cod_tp_comp
      and c.cod_empresa = a.cod_empresa
      and c.cod_articulo = a.cod_articulo
      and a.cod_empresa = m.cod_empresa
      and a.codartpad = m.cod_articulo
      and c.cod_empresa = 'IN'
      and "date"(c.fechahoraprod) between mFechaDesde and mFechaHasta
      and a.cod_familia = '99'
      and a.cod_grupo = '02'
      and m.cod_familia = '99'
      and m.cod_grupo = '02'
      group by c.cod_empresa,m.cod_articulo
      order by c.cod_empresa asc,m.cod_articulo asc;
  //---------------PRODUCCION - SALIDA------------
  insert into dba.TmpRecallExistenciaEBC_Materiales
    select mSID,d.cod_empresa,m.cod_articulo,'PRS',sum(d.cantidad*-1)
      from ordprodcab as c,ordproddet as d,tpocbte as t,articulo as a,articulo as m
      where c.cod_empresa = d.cod_empresa
      and c.cod_tp_comp = d.cod_tp_comp
      and c.nroordprod = d.nroordprod
      and c.cod_empresa = t.cod_empresa
      and c.cod_tp_comp = t.cod_tp_comp
      and d.cod_empresa = a.cod_empresa
      and d.cod_articulo = a.cod_articulo
      and a.cod_empresa = m.cod_empresa
      and a.codartpad = m.cod_articulo
      and d.cod_empresa = 'IN'
      and "date"(c.fechahoraprod) between mFechaDesde and mFechaHasta
      and a.cod_familia = '99'
      and a.cod_grupo = '02'
      and m.cod_familia = '99'
      and m.cod_grupo = '02'
      group by d.cod_empresa,m.cod_articulo
      order by d.cod_empresa asc,m.cod_articulo asc;
  //---------------COMPRAS------------
  insert into dba.TmpRecallExistenciaEBC_Materiales
    select mSID,d.cod_empresa,m.cod_articulo,'FCT',
      sum(if t.af_existencia = 'D' then
        (d.cantidad-d.cantfaltante)*-1
      else if t.af_existencia = 'I' then
          (d.cantidad-d.cantfaltante)
        else 0
        endif
      endif) as cantidad
      from factcab as c,factdet as d,tpocbte as t,articulo as a,articulo as m
      where c.cod_empresa = d.cod_empresa
      and c.cod_tp_comp = d.cod_tp_comp
      and c.codprov = d.codprov
      and c.nrofact = d.nrofact
      and c.cod_empresa = t.cod_empresa
      and c.cod_tp_comp = t.cod_tp_comp
      and d.cod_empresa = a.cod_empresa
      and d.cod_articulo = a.cod_articulo
      and a.cod_empresa = m.cod_empresa
      and a.codartpad = m.cod_articulo
      and c.cod_empresa = 'IN'
      and "date"(c.fechaingreso) between mFechaDesde and mFechaHasta
      and c.asentado = 'S'
      and a.cod_familia = '99'
      and a.cod_grupo = '02'
      and m.cod_familia = '99'
      and m.cod_grupo = '02'
      group by d.cod_empresa,m.cod_articulo
      order by d.cod_empresa asc,m.cod_articulo asc;
  //---------------TRANSFERENCIA - ENTRADA---------------
  insert into dba.TmpRecallExistenciaEBC_Materiales
    select mSID,d.cod_empresa,m.cod_articulo,'TRE',sum(d.cantidad)
      from stcab as c,stdet as d,tpocbte as t,articulo as a,articulo as m
      where c.cod_empresa = d.cod_empresa
      and c.cod_sucursal = d.cod_sucursal
      and c.cod_deposito = d.cod_deposito
      and c.cod_tp_comp = d.cod_tp_comp
      and c.comp_numero = d.comp_numero
      and c.cod_empresa = t.cod_empresa
      and c.cod_tp_comp = t.cod_tp_comp
      and d.cod_empresa = a.cod_empresa
      and d.cod_articulo = a.cod_articulo
      and a.cod_empresa = m.cod_empresa
      and a.codartpad = m.cod_articulo
      and c.cod_empresa = 'IN'
      and "date"(c.fha_mvto) between mFechaDesde and mFechaHasta
      and t.tp_def = 'TR'
      and t.af_existencia = 'D'
      and a.cod_familia = '99'
      and a.cod_grupo = '02'
      and m.cod_familia = '99'
      and m.cod_grupo = '02'
      and c.cod_deposito2 <> '08'
      group by d.cod_empresa,m.cod_articulo
      order by d.cod_empresa asc,m.cod_articulo asc;
  //---------------TRANSFERENCIA - SALIDA---------------
  insert into dba.TmpRecallExistenciaEBC_Materiales
    select mSID,d.cod_empresa,m.cod_articulo,'TRS',sum(d.cantidad*-1)
      from stcab as c,stdet as d,tpocbte as t,articulo as a,articulo as m
      where c.cod_empresa = d.cod_empresa
      and c.cod_sucursal = d.cod_sucursal
      and c.cod_deposito = d.cod_deposito
      and c.cod_tp_comp = d.cod_tp_comp
      and c.comp_numero = d.comp_numero
      and c.cod_empresa = t.cod_empresa
      and c.cod_tp_comp = t.cod_tp_comp
      and d.cod_empresa = a.cod_empresa
      and d.cod_articulo = a.cod_articulo
      and a.cod_empresa = m.cod_empresa
      and a.codartpad = m.cod_articulo
      and c.cod_empresa = 'IN'
      and "date"(c.fha_mvto) between mFechaDesde and mFechaHasta
      and t.tp_def = 'TR'
      and t.af_existencia = 'D'
      and a.cod_familia = '99'
      and a.cod_grupo = '02'
      and m.cod_familia = '99'
      and m.cod_grupo = '02'
      and c.cod_deposito <> '08'
      group by d.cod_empresa,m.cod_articulo
      order by d.cod_empresa asc,m.cod_articulo asc;
  //-----------INSERTO EN EL TEMPORAL--------------
  insert into tmp_ExistenciaEBC_Materiales( SessionID,cod_empresa,cod_articulo,Existencia_Calc ) 
    select mSID,d.cod_empresa,d.cod_articulo,sum(if d.cantidad is null then 0 else d.cantidad endif)
      from dba.TmpRecallExistenciaEBC_Materiales as d
      where d.SessionID = mSID
      and d.cod_empresa = 'IN'
      group by d.cod_empresa,d.cod_articulo
      order by d.cod_empresa asc,d.cod_articulo asc;
  //
  update tmp_ecuacion_bienes_cambio_materiales
    set tmp_ecuacion_bienes_cambio_materiales.recuento = tmp_ExistenciaEBC_Materiales.existencia_calc from
    tmp_ExistenciaEBC_Materiales
    where tmp_ecuacion_bienes_cambio_materiales.sessionid = tmp_ExistenciaEBC_Materiales.sessionid
    and tmp_ecuacion_bienes_cambio_materiales.cod_articulo = tmp_ExistenciaEBC_Materiales.cod_articulo
    and tmp_ecuacion_bienes_cambio_materiales.cod_empresa = mCod_empresa
    and tmp_ExistenciaEBC_Materiales.cod_empresa = 'IN'
    and tmp_ecuacion_bienes_cambio_materiales.sessionid = mSID
  */
end;
