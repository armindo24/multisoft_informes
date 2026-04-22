CREATE PROCEDURE "DBA"."sp_tmp_rpt_compuestos"( in msid char(15),in mcod_empresa char(2),in pd_fecha_inicio_desde date,
  in pd_fecha_inicio_hasta date,in pd_fecha_fin_desde date,in pd_fecha_fin_hasta date,in ps_estado char(1),in ps_tipo_compuesto char(2),
  in ps_realizadopor varchar(250) ) 
/* RESULT( column_name column_type, ... ) */
begin
  declare err_usr exception for sqlstate value '99999';
  declare no_data_found exception for sqlstate value '02000';
  declare ls_cod_tp_comp char(4);
  declare ln_nroordprod numeric(7);
  declare ldt_fecha_inicio datetime;
  declare ldt_fecha_fin datetime;
  declare ls_cod_art_acondicionado char(14);
  declare ls_des_art_acondicionado varchar(150);
  declare ln_cant_art_acondicionado numeric(10,4);
  declare ln_precio_acondicionado numeric(16,4);
  declare ls_cod_art_remitido char(14);
  declare ln_cant_art_remitido numeric(10,4);
  declare ln_cant_activ_colocacion numeric(10,4);
  declare ln_pr_unit_activ_colocacion numeric(16,4);
  declare ls_cod_art_material char(14);
  declare ln_cant_art_material numeric(10,4);
  declare ln_cto_material numeric(16,4);
  declare ls_tipo_material char(2);
  declare ls_cadena_aux varchar(5000);
  declare li_pos integer;
  declare ls_realizadopor_aux varchar(250);
  declare ls_realizadopor varchar(250);
  //declaramos el cursor para obtener los datos de los articulos acondicionado (cabecera)
  declare lc_cursor_articulos_acondicionado_cabecera dynamic scroll cursor for
    select ordprodcab.cod_tp_comp,ordprodcab.nroordprod,ordprodcab.fechainicio,ordprodcab.fechafin,articulopadrecab.cod_articulo,
      articulopadrecab.des_art,ordprodcab.cantidad,ordprodcab.cto_prom_gs,ordprodcab.realizadopor
      from articulo as articulocab,articulo as articulopadrecab,ordprodcab
      where ordprodcab.cod_empresa = articulocab.cod_empresa
      and ordprodcab.cod_articulo = articulocab.cod_articulo
      and articulocab.cod_empresa = articulopadrecab.cod_empresa
      and articulocab.codartpad = articulopadrecab.cod_articulo
      and ordprodcab.cod_empresa = mcod_empresa
      and((pd_fecha_inicio_desde <> '1900-01-01' and pd_fecha_inicio_hasta <> '1900-01-01'
      and "date"(ordprodcab.fechainicio) between pd_fecha_inicio_desde and pd_fecha_inicio_hasta)
      or(pd_fecha_inicio_desde = '1900-01-01' and pd_fecha_inicio_hasta = '1900-01-01'))
      and((pd_fecha_fin_desde <> '1900-01-01' and pd_fecha_fin_hasta <> '1900-01-01'
      and "date"(ordprodcab.fechafin) between pd_fecha_fin_desde and pd_fecha_fin_hasta)
      or(pd_fecha_fin_desde = '1900-01-01' and pd_fecha_fin_hasta = '1900-01-01'))
      and(ordprodcab.estado = ps_estado or ps_estado = '')
      and(ordprodcab.tipo_compuesto = ps_tipo_compuesto or ps_tipo_compuesto = '')
      and(exists(select 1
        from tmp_realizadopor_compuesto
        where ordprodcab.realizadopor like tmp_realizadopor_compuesto.realizadopor)
      or ps_realizadopor = '')
      order by ordprodcab.cod_tp_comp asc,ordprodcab.nroordprod asc;
  //declaramos el cursor para obtener los datos de los articulos materiales (detalle)
  declare lc_cursor_articulos_materiales_detalle dynamic scroll cursor for
    select articulopadredet.cod_articulo,sum(ordproddet.cantidad),articulopadredet.tipo_material_compuesto
      from ordprodcab,ordproddet,articulo as articulodet,articulo as articulopadredet,articulo as articulocab
      where ordprodcab.cod_empresa = ordproddet.cod_empresa
      and ordprodcab.cod_tp_comp = ordproddet.cod_tp_comp
      and ordprodcab.nroordprod = ordproddet.nroordprod
      and ordproddet.cod_empresa = articulodet.cod_empresa
      and ordproddet.cod_articulo = articulodet.cod_articulo
      and articulodet.cod_empresa = articulopadredet.cod_empresa
      and articulodet.codartpad = articulopadredet.cod_articulo
      and ordprodcab.cod_empresa = articulocab.cod_empresa
      and ordprodcab.cod_articulo = articulocab.cod_articulo
      and articulodet.cod_empresa = articulocab.cod_empresa
      and articulodet.cod_familia <> articulocab.cod_familia
      and ordproddet.cod_empresa = mcod_empresa
      and ordproddet.cod_tp_comp = ls_cod_tp_comp
      and ordproddet.nroordprod = ln_nroordprod
      group by articulopadredet.cod_articulo,articulopadredet.tipo_material_compuesto
      order by articulopadredet.cod_articulo asc;
  //
  delete from tmp_realizadopor_compuesto
    where SessionID = msid;
  //
  set ls_cadena_aux = ps_realizadopor;
  //
  while length(ls_cadena_aux) > 0 loop
    set li_pos = charindex(';',ls_cadena_aux);
    if li_pos > 0 then
      set ls_realizadopor_aux = "left"(ls_cadena_aux,li_pos-1);
      set ls_cadena_aux = substring(ls_cadena_aux,li_pos+1)
    else
      set ls_realizadopor_aux = ls_cadena_aux;
      set ls_cadena_aux = ''
    end if;
    insert into tmp_realizadopor_compuesto( SessionID,realizadopor ) values
      ( msid,'%'+ls_realizadopor_aux+'%' ) 
  end loop;
  //
  open lc_cursor_articulos_acondicionado_cabecera;
  articulos_acondicionado_cabecera: loop fetch next lc_cursor_articulos_acondicionado_cabecera into ls_cod_tp_comp,ln_nroordprod,
      ldt_fecha_inicio,ldt_fecha_fin,ls_cod_art_acondicionado,ls_des_art_acondicionado,ln_cant_art_acondicionado,ln_precio_acondicionado,
      ls_realizadopor;
    //
    if(sqlstate = no_data_found) then
      leave articulos_acondicionado_cabecera
    end if;
    //
    set ls_cod_art_remitido = null;
    set ln_cant_art_remitido = null;
    //
    select coalesce(articulopadredet.cod_articulo,''),coalesce(ordproddet.cantidad,0)
      into ls_cod_art_remitido,ln_cant_art_remitido
      from ordprodcab,ordproddet,articulo as articulodet,articulo as articulopadredet,articulo as articulocab
      where ordprodcab.cod_empresa = ordproddet.cod_empresa
      and ordprodcab.cod_tp_comp = ordproddet.cod_tp_comp
      and ordprodcab.nroordprod = ordproddet.nroordprod
      and ordproddet.cod_empresa = articulodet.cod_empresa
      and ordproddet.cod_articulo = articulodet.cod_articulo
      and articulodet.cod_empresa = articulopadredet.cod_empresa
      and articulodet.codartpad = articulopadredet.cod_articulo
      and ordprodcab.cod_empresa = articulocab.cod_empresa
      and ordprodcab.cod_articulo = articulocab.cod_articulo
      and articulodet.cod_empresa = articulocab.cod_empresa
      and articulodet.cod_familia <> '99'
      and articulodet.cod_grupo <> '02'
      and ordproddet.cod_empresa = mcod_empresa
      and ordproddet.cod_tp_comp = ls_cod_tp_comp
      and ordproddet.nroordprod = ln_nroordprod;
    //
    set ln_cant_activ_colocacion = null;
    set ln_pr_unit_activ_colocacion = null;
    //
    select count(ordprodcab_activ.nroordprod),(sum(tipoactividad.precio_reacondicionamiento)/count(ordprodcab_activ.nroordprod))
      into ln_cant_activ_colocacion,ln_pr_unit_activ_colocacion
      from ordprodcab_activ,tipoactividad
      where ordprodcab_activ.cod_empresa = tipoactividad.cod_empresa
      and ordprodcab_activ.codtipoaccion = tipoactividad.codtipoaccion
      and ordprodcab_activ.cod_empresa = mcod_empresa
      and ordprodcab_activ.cod_tp_comp = ls_cod_tp_comp
      and ordprodcab_activ.nroordprod = ln_nroordprod
      and tipoactividad.contar_reacondicionamiento = 'S';
    //
    if ln_pr_unit_activ_colocacion is null then
      set ln_pr_unit_activ_colocacion = 0
    end if;
    //
    insert into tmp_rpt_compuestos( SessionID,cod_empresa,cod_tp_comp,nroordprod,fechainicio,fechafin,cod_articulo_remitido,
      cod_articulo_acondicionado,des_art_acondicionado,cant_articulo_acondicionado,cant_articulo_remitido,cant_activ_colocacion,
      pr_unit_acondicionado,pr_unit_activ_colocacion,realizadopor ) values
      ( msid,mcod_empresa,ls_cod_tp_comp,ln_nroordprod,ldt_fecha_inicio,ldt_fecha_fin,ls_cod_art_remitido,
      ls_cod_art_acondicionado,ls_des_art_acondicionado,ln_cant_art_acondicionado,ln_cant_art_remitido,ln_cant_activ_colocacion,
      ln_precio_acondicionado,ln_pr_unit_activ_colocacion,ls_realizadopor ) ;
    //
    open lc_cursor_articulos_materiales_detalle;
    articulos_materiales_detalle: loop fetch next lc_cursor_articulos_materiales_detalle into ls_cod_art_material,ln_cant_art_material,ls_tipo_material;
      //
      if(sqlstate = no_data_found) then
        leave articulos_materiales_detalle
      end if;
      //
      select coalesce(costo_ut_rep,0)
        into ln_cto_material from tmp_ebc_materiales_costo_aux
        where fecha_ini = pd_fecha_fin_desde
        and fecha_fin = pd_fecha_fin_hasta
        and cod_articulo = ls_cod_art_material;
      //
      if ln_cto_material is null then
        set ln_cto_material = 0
      end if;
      //
      case
      when ls_tipo_material = 'ES' then //Estuche
        update tmp_rpt_compuestos
          set cant_estuche = cant_estuche+ln_cant_art_material,cto_unit_prom_estuche = cto_unit_prom_estuche+ln_cto_material
          where SessionID = msid
          and cod_empresa = mcod_empresa
          and cod_tp_comp = ls_cod_tp_comp
          and nroordprod = ln_nroordprod
      when ls_tipo_material = 'ST' then //Sticker
        update tmp_rpt_compuestos
          set cant_sticker = cant_sticker+ln_cant_art_material,cto_unit_prom_sticker = cto_unit_prom_sticker+ln_cto_material
          where SessionID = msid
          and cod_empresa = mcod_empresa
          and cod_tp_comp = ls_cod_tp_comp
          and nroordprod = ln_nroordprod
      when ls_tipo_material = 'ET' then //Estampilla
        update tmp_rpt_compuestos
          set cant_estampilla = cant_estampilla+ln_cant_art_material,cto_unit_prom_estampilla = cto_unit_prom_estampilla+ln_cto_material
          where SessionID = msid
          and cod_empresa = mcod_empresa
          and cod_tp_comp = ls_cod_tp_comp
          and nroordprod = ln_nroordprod
      when ls_tipo_material = 'PR' then //Prospecto
        update tmp_rpt_compuestos
          set cant_prospecto = cant_prospecto+ln_cant_art_material,cto_unit_prom_prospecto = cto_unit_prom_prospecto+ln_cto_material
          where SessionID = msid
          and cod_empresa = mcod_empresa
          and cod_tp_comp = ls_cod_tp_comp
          and nroordprod = ln_nroordprod
      when ls_tipo_material = 'EQ' then //Etiqueta
        update tmp_rpt_compuestos
          set cant_etiqueta = cant_etiqueta+ln_cant_art_material,cto_unit_prom_etiqueta = cto_unit_prom_etiqueta+ln_cto_material
          where SessionID = msid
          and cod_empresa = mcod_empresa
          and cod_tp_comp = ls_cod_tp_comp
          and nroordprod = ln_nroordprod
      when ls_tipo_material = 'AM' then //Ampolla
        update tmp_rpt_compuestos
          set cant_ampolla = cant_ampolla+ln_cant_art_material,cto_unit_prom_ampolla = cto_unit_prom_ampolla+ln_cto_material
          where SessionID = msid
          and cod_empresa = mcod_empresa
          and cod_tp_comp = ls_cod_tp_comp
          and nroordprod = ln_nroordprod
      when ls_tipo_material = 'SE' then //Sello
        update tmp_rpt_compuestos
          set cant_sello = cant_sello+ln_cant_art_material,cto_unit_prom_sello = cto_unit_prom_sello+ln_cto_material
          where SessionID = msid
          and cod_empresa = mcod_empresa
          and cod_tp_comp = ls_cod_tp_comp
          and nroordprod = ln_nroordprod
      when ls_tipo_material = 'CU' then //Cuchara
        update tmp_rpt_compuestos
          set cant_cuchara = cant_cuchara+ln_cant_art_material,cto_unit_prom_cuchara = cto_unit_prom_cuchara+ln_cto_material
          where SessionID = msid
          and cod_empresa = mcod_empresa
          and cod_tp_comp = ls_cod_tp_comp
          and nroordprod = ln_nroordprod
      end case
    end loop articulos_materiales_detalle; //
    close lc_cursor_articulos_materiales_detalle
  end loop articulos_acondicionado_cabecera; //
  close lc_cursor_articulos_acondicionado_cabecera;
  //
  delete from tmp_realizadopor_compuesto
    where SessionID = msid
end;
