CREATE PROCEDURE "DBA"."sp_tmp_ebc_materiales_Rpt"( in mSID char(15),in mCod_Empresa char(2),in mFechaDesde date,in mFechaHasta date ) 
/* RESULT( column_name column_type, ... ) */
begin
  declare err_usr exception for sqlstate value '99999';
  declare no_data_found exception for sqlstate value '02000';
  declare ls_cod_articulo char(14);
  declare ln_cant_compra numeric(13,2);
  declare ln_precio_costo_compra numeric(16,4);
  declare ln_monto_total_compra numeric(16,4);
  declare ln_unidad_costo_mat_reac numeric(13,2);
  declare ln_unidad_baja_destruccion numeric(13,2);
  declare ln_unidad_diferencia_inventario numeric(13,2);
  // Declaramos el cursor para compras
  declare lc_cursor_compras_mes_actual dynamic scroll cursor for
    select a.cod_articulo,
      sum(if t.af_existencia = 'D' then
        (d.cantidad-d.cantfaltante)*-1
      else if t.af_existencia = 'I' then
          (d.cantidad-d.cantfaltante)
        else 0
        endif
      endif) as cantidad,
      sum(if t.af_existencia = 'D' then
        (d.preciocosto*c.factcambio)*-1
      else if t.af_existencia = 'I' then
          (d.preciocosto*c.factcambio)
        else 0
        endif
      endif)/count() as precio_unitario,
      precio_unitario*cantidad as monto_total
      from factcab as c,factdet as d,tpocbte as t,articulo as ar,articulo as a
      where d.cod_empresa = c.cod_empresa
      and d.cod_tp_comp = c.cod_tp_comp
      and d.codprov = c.codprov
      and d.nrofact = c.nrofact
      and c.cod_empresa = t.cod_empresa
      and c.cod_tp_comp = t.cod_tp_comp
      and d.cod_empresa = ar.cod_empresa
      and d.cod_articulo = ar.cod_articulo
      and ar.cod_empresa = a.cod_empresa
      and ar.codartpad = a.cod_articulo
      and c.cod_empresa = mCod_Empresa
      and "date"(c.fechaingreso) between mFechaDesde and mFechaHasta
      and ar.cod_familia = '99'
      and ar.cod_grupo = '02'
      and a.cod_familia = '99'
      and a.cod_grupo = '02'
      and c.anulado = 'N'
      group by a.cod_articulo
      order by a.cod_articulo asc;
  // Declaramos el cursor para Costo de Mat. utilizados p/ reacond. en el mes
  declare lc_cursor_costo_materiales_reacondicionamiento dynamic scroll cursor for
    select articulopadre.cod_articulo,sum(ordproddet.cantidad*-1)
      from ordprodcab,ordproddet,articulo,articulo as articulopadre
      where ordprodcab.cod_empresa = ordproddet.cod_empresa
      and ordprodcab.cod_tp_comp = ordproddet.cod_tp_comp
      and ordprodcab.nroordprod = ordproddet.nroordprod
      and ordproddet.cod_empresa = articulo.cod_empresa
      and ordproddet.cod_articulo = articulo.cod_articulo
      and articulo.cod_empresa = articulopadre.cod_empresa
      and articulo.codartpad = articulopadre.cod_articulo
      and ordprodcab.cod_empresa = 'IN'
      and "date"(ordprodcab.fechafin) between mFechaDesde and mFechaHasta
      and articulo.cod_familia = '99'
      and articulo.cod_grupo = '02'
      and articulopadre.cod_familia = '99'
      and articulopadre.cod_grupo = '02'
      group by articulopadre.cod_articulo
      order by articulopadre.cod_articulo asc;
  // Declaramos el cursor para Diferencia de Inventario
  declare lc_cursor_diferencia_inventario dynamic scroll cursor for
    select articulopadre.cod_articulo,
      sum(if tpocbte.af_existencia = 'D' then
        (stdet.cantidad*-1)
      else if tpocbte.af_existencia = 'I' then
          (stdet.cantidad)
        else 0
        endif
      endif) as cantidad
      from stcab,stdet,articulo,articulo as articulopadre,tpocbte
      where stcab.cod_empresa = stdet.cod_empresa
      and stcab.cod_sucursal = stdet.cod_sucursal
      and stcab.cod_deposito = stdet.cod_deposito
      and stcab.cod_tp_comp = stdet.cod_tp_comp
      and stcab.comp_numero = stdet.comp_numero
      and stdet.cod_empresa = articulo.cod_empresa
      and stdet.cod_articulo = articulo.cod_articulo
      and articulo.cod_empresa = articulopadre.cod_empresa
      and articulo.codartpad = articulopadre.cod_articulo
      and stcab.cod_empresa = tpocbte.cod_empresa
      and stcab.cod_tp_comp = tpocbte.cod_tp_comp
      and stcab.cod_empresa = mCod_Empresa
      and "date"(stcab.fha_mvto) between mFechaDesde and mFechaHasta
      and articulo.cod_familia = '99'
      and articulo.cod_grupo = '02'
      and articulopadre.cod_familia = '99'
      and articulopadre.cod_grupo = '02'
      and tpocbte.diferencia_inventario = 'S'
      group by articulopadre.cod_articulo
      order by articulopadre.cod_articulo asc;
  // Declaramos el cursor para Baja para Destruccción
  declare lc_cursor_baja_destruccion dynamic scroll cursor for
    select articulopadre.cod_articulo,sum(stdet.cantidad*-1)
      from stcab,stdet,articulo,articulo as articulopadre,tpocbte
      where stcab.cod_empresa = stdet.cod_empresa
      and stcab.cod_sucursal = stdet.cod_sucursal
      and stcab.cod_deposito = stdet.cod_deposito
      and stcab.cod_tp_comp = stdet.cod_tp_comp
      and stcab.comp_numero = stdet.comp_numero
      and stdet.cod_empresa = articulo.cod_empresa
      and stdet.cod_articulo = articulo.cod_articulo
      and articulo.cod_empresa = articulopadre.cod_empresa
      and articulo.codartpad = articulopadre.cod_articulo
      and stcab.cod_empresa = tpocbte.cod_empresa
      and stcab.cod_tp_comp = tpocbte.cod_tp_comp
      and stcab.cod_empresa = mCod_Empresa
      and "date"(stcab.fha_mvto) between mFechaDesde and mFechaHasta
      and articulo.cod_familia = '99'
      and articulo.cod_grupo = '02'
      and articulopadre.cod_familia = '99'
      and articulopadre.cod_grupo = '02'
      and tpocbte.destruccion_mercaderia = 'S'
      group by articulopadre.cod_articulo
      order by articulopadre.cod_articulo asc;
  //
  open lc_cursor_compras_mes_actual;
  compras_mes_actual: loop fetch next lc_cursor_compras_mes_actual into ls_cod_articulo,ln_cant_compra,ln_precio_costo_compra,ln_monto_total_compra;
    //
    if(sqlstate = no_data_found) then
      leave compras_mes_actual
    end if;
    //
    if exists(select 1
        from tmp_ecuacion_bienes_cambio_materiales
        where SessionID = mSID
        and cod_empresa = mCod_Empresa
        and cod_articulo = ls_cod_articulo) then
      update tmp_ecuacion_bienes_cambio_materiales
        set unidad_compras = ln_cant_compra,costo_unitario_compras = ln_precio_costo_compra,total_compras = ln_monto_total_compra
        where SessionID = mSID
        and cod_empresa = mCod_Empresa
        and cod_articulo = ls_cod_articulo
    else
      insert into tmp_ecuacion_bienes_cambio_materiales( SessionID,cod_empresa,cod_articulo,unidad_compras,costo_unitario_compras,total_compras ) values
        ( mSID,mCod_Empresa,ls_cod_articulo,ln_cant_compra,ln_precio_costo_compra,ln_monto_total_compra ) 
    end if
  end loop compras_mes_actual;
  close lc_cursor_compras_mes_actual;
  //
  open lc_cursor_costo_materiales_reacondicionamiento;
  costo_materiales_reacondicionamiento: loop fetch next lc_cursor_costo_materiales_reacondicionamiento into ls_cod_articulo,ln_unidad_costo_mat_reac;
    //
    if(sqlstate = no_data_found) then
      leave costo_materiales_reacondicionamiento
    end if;
    //
    if exists(select 1
        from tmp_ecuacion_bienes_cambio_materiales
        where SessionID = mSID
        and cod_empresa = mCod_Empresa
        and cod_articulo = ls_cod_articulo) then
      update tmp_ecuacion_bienes_cambio_materiales
        set unidad_costo_reacondicionamiento = ln_unidad_costo_mat_reac
        where SessionID = mSID
        and cod_empresa = mCod_Empresa
        and cod_articulo = ls_cod_articulo
    else
      insert into tmp_ecuacion_bienes_cambio_materiales( SessionID,cod_empresa,cod_articulo,unidad_costo_reacondicionamiento ) values
        ( mSID,mCod_Empresa,ls_cod_articulo,ln_unidad_costo_mat_reac ) 
    end if
  end loop costo_materiales_reacondicionamiento;
  close lc_cursor_costo_materiales_reacondicionamiento;
  //
  open lc_cursor_diferencia_inventario;
  diferencia_inventario: loop fetch next lc_cursor_diferencia_inventario into ls_cod_articulo,ln_unidad_diferencia_inventario;
    //
    if(sqlstate = no_data_found) then
      leave diferencia_inventario
    end if;
    //
    if exists(select 1
        from tmp_ecuacion_bienes_cambio_materiales
        where SessionID = mSID
        and cod_empresa = mCod_Empresa
        and cod_articulo = ls_cod_articulo) then
      update tmp_ecuacion_bienes_cambio_materiales
        set unidad_diferencia_inventario = ln_unidad_diferencia_inventario
        where SessionID = mSID
        and cod_empresa = mCod_Empresa
        and cod_articulo = ls_cod_articulo
    else
      insert into tmp_ecuacion_bienes_cambio_materiales( SessionID,cod_empresa,cod_articulo,unidad_diferencia_inventario ) values
        ( mSID,mCod_Empresa,ls_cod_articulo,ln_unidad_diferencia_inventario ) 
    end if
  end loop diferencia_inventario;
  close lc_cursor_diferencia_inventario;
  //
  open lc_cursor_baja_destruccion;
  baja_destruccion: loop fetch next lc_cursor_baja_destruccion into ls_cod_articulo,ln_unidad_baja_destruccion;
    //
    if(sqlstate = no_data_found) then
      leave baja_destruccion
    end if;
    //
    if exists(select 1
        from tmp_ecuacion_bienes_cambio_materiales
        where SessionID = mSID
        and cod_empresa = mCod_Empresa
        and cod_articulo = ls_cod_articulo) then
      update tmp_ecuacion_bienes_cambio_materiales
        set unidad_baja_destruccion = ln_unidad_baja_destruccion
        where SessionID = mSID
        and cod_empresa = mCod_Empresa
        and cod_articulo = ls_cod_articulo
    else
      insert into tmp_ecuacion_bienes_cambio_materiales( SessionID,cod_empresa,cod_articulo,unidad_baja_destruccion ) values
        ( mSID,mCod_Empresa,ls_cod_articulo,ln_unidad_baja_destruccion ) 
    end if
  end loop baja_destruccion;
  close lc_cursor_baja_destruccion;
  //
  delete from tmp_ebc_materiales_costo_aux
    where fecha_ini = mFechaDesde
    and fecha_fin = mFechaHasta
    and cod_articulo in (select cod_articulo
      from tmp_ecuacion_bienes_cambio_materiales
      where SessionID = mSID
      and cod_empresa = mCod_Empresa);
  //
  insert into tmp_ebc_materiales_costo_aux( fecha_ini,fecha_fin,cod_articulo,costo_ut_rep ) 
    select mFechaDesde,mFechaHasta,cod_articulo,
      round(coalesce(nullif(costo_unitario_compras,0),nullif(Cto_Prom_inventario_inicial_Gs,0),0),4)
      from tmp_ecuacion_bienes_cambio_materiales
      where SessionID = mSID
      and cod_empresa = mCod_Empresa
      and coalesce(nullif(costo_unitario_compras,0),nullif(Cto_Prom_inventario_inicial_Gs,0),0) > 0
end;
