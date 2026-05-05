var conn = require('../db_integrado');

var Rg90 = {};

function esc(value) {
    return String(value === undefined || value === null ? '' : value).replace(/'/g, "''");
}

function dbIsPostgres() {
    try {
        if (typeof conn.getStatus === 'function') {
            var st = conn.getStatus() || {};
            var eng = String(st.engine || st.configured_engine || '').toLowerCase();
            if (eng === 'postgres') return true;
            if (eng === 'sqlanywhere') return false;
        }
    } catch (e) {}
    return String(conn._engine || '').toLowerCase() === 'postgres';
}

function buildVentasSql(params) {
    var empresa = esc(params.empresa);
    var desde = esc(params.desde);
    var hasta = esc(params.hasta);
    var sucursalSql = params.sucursal ? (" AND base.cod_sucursal = '" + esc(params.sucursal) + "' ") : '';
    var usePg = dbIsPostgres();

    return `
SELECT *
FROM (
  SELECT
    '1' as tipo_registro,
    dba.vtacab.cod_empresa as cod_empresa,
    dba.vtacab.cod_sucursal as cod_sucursal,
    dba.vtacab.cod_tp_comp as cod_tp_comp,
    date(dba.vtacab.fha_cbte) as fechafact,
    dba.clientes.razon_social as razonsocial,
    dba.clientes.ruc as ruc,
    ( dba.vtacab.to_gravado - ( dba.vtacab.totaldctograv_d + dba.vtacab.totaldctograv + dba.vtacab.tot2dodctograv ) ) as total_grav,
    ( dba.vtacab.to_gravado_5 - ( dba.vtacab.totaldctograv_d_5 + dba.vtacab.totaldctograv_5 + dba.vtacab.tot2dodctograv_5 ) ) as total_grav_5,
    ( dba.vtacab.to_gravado_10 - ( dba.vtacab.totaldctograv_d_10 + dba.vtacab.totaldctograv_10 + dba.vtacab.tot2dodctograv_10 ) ) as total_grav_10,
    dba.vtacab.total_iva as total_iva,
    dba.vtacab.total_iva_5 as total_iva_5,
    dba.vtacab.total_iva_10 as total_iva_10,
    ( dba.vtacab.to_exento - ( dba.vtacab.totaldctoexen_d + dba.vtacab.totaldctoexen + dba.vtacab.tot2dodctoexen ) ) as total_exenta,
    dba.vtacab.comp_numero as comp_inicial,
    dba.vtacab.comp_numero as comp_final,
    dba.tpocbte.des_tp_comp as des_tp_comp,
    dba.tpocbte.timbrado as timbrado,
    dba.tpocbte.nrotimbrado as nrotimbrado,
    dba.tpocbte.tp_def as tp_def,
    dba.tpocbte.TipoLibroIVA as agrup,
    dba.vtacab.tipo_iva as tipo_iva,
    dba.vtacab.anulado as anulado,
    t2.TipoLibroIVA as ref_tp_comp,
    dba.vtacab.codmoneda as codmoneda,
    dba.vtacab.fact_cambio as factcambio,
    dba.vtacab.cod_con_vta as cod_con_vta,
    dba.terminos.des_con_vta as des_con_vta,
    dba.terminos.cuota as cuota,
    dba.terminos.dias_credito as dias_credito,
    dba.vtacab.nrotimb as nrotimb,
    dba.vtacab.cod_establecimiento as cod_establecimiento,
    dba.vtacab.cod_ptoexpedicion as cod_ptoexpedicion,
    dba.vtacab.comp_nro_timb as comp_nro_timb,
    NULL as nro_fact_aso,
    NULL as nro_timb_aso,
    dba.vtacab.cod_cliente as clientes
  FROM dba.vtacab
       LEFT OUTER JOIN dba.tpocbte t2 ON dba.vtacab.Cod_Empresa = t2.Cod_Empresa AND dba.vtacab.rf_tp_comp = t2.cod_tp_comp,
       dba.control,
       dba.clientes LEFT OUTER JOIN dba.tpoclte ON dba.clientes.cod_tp_cliente = dba.tpoclte.cod_tp_cliente AND dba.tpoclte.DetHechauka = 'S',
       dba.tpocbte,
       dba.terminos
  WHERE ( dba.vtacab.cod_empresa = dba.clientes.cod_empresa )
    AND ( dba.vtacab.cod_empresa = dba.control.cod_empresa )
    AND ( dba.f_get_periodo(dba.vtacab.cod_empresa, date(dba.vtacab.fha_cbte)) = dba.control.periodo )
    AND ( dba.vtacab.cod_cliente <> dba.control.cod_cliente_varios )
    AND ( dba.vtacab.cod_cliente = dba.clientes.cod_cliente )
    AND ( dba.tpocbte.cod_empresa = dba.vtacab.cod_empresa )
    AND ( dba.tpocbte.cod_tp_comp = dba.vtacab.cod_tp_comp )
    AND ( dba.tpocbte.TipoLibroIVA IS NOT NULL )
    AND ( dba.tpocbte.tp_def != 'NC' )
    AND ( dba.vtacab.cod_con_vta = dba.terminos.cod_con_vta )
    AND ( dba.vtacab.anulado = 'N' )
    AND ( dba.TpoCbte.documentoElectronico = 'N' )
    AND ( dba.vtacab.cod_empresa = '${empresa}' )
    AND ( DATE(dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )

  UNION (
    SELECT
      '2' as tipo_registro,
      dba.resvtacab.cod_empresa as cod_empresa,
      dba.resvtacab.cod_sucursal as cod_sucursal,
      dba.resvtacab.cod_tp_comp as cod_tp_comp,
      date(dba.resvtacab.fecha) as fechafact,
      dba.clientes.razon_social as razonsocial,
      dba.clientes.ruc as ruc,
      SUM(dba.resvtadet.totalgravado ${usePg ? '* dba.resvtacab.factcambio' : ''}) as total_grav,
      SUM(dba.resvtadet.totalgravado ${usePg ? '* dba.resvtacab.factcambio' : ''}) as total_grav_5,
      SUM(dba.resvtadet.totalgravado ${usePg ? '* dba.resvtacab.factcambio' : ''}) as total_grav_10,
      SUM(dba.resvtadet.totaliva ${usePg ? '* dba.resvtacab.factcambio' : ''}) as total_iva,
      SUM(dba.resvtadet.totaliva ${usePg ? '* dba.resvtacab.factcambio' : ''}) as total_iva_5,
      SUM(dba.resvtadet.totaliva ${usePg ? '* dba.resvtacab.factcambio' : ''}) as total_iva_10,
      SUM(dba.resvtadet.totalexento ${usePg ? '* dba.resvtacab.factcambio' : ''}) as total_exenta,
      dba.resvtacab.comp_inicial as comp_inicial,
      dba.resvtacab.comp_final as comp_final,
      dba.tpocbte.des_tp_comp as des_tp_comp,
      dba.tpocbte.timbrado as timbrado,
      dba.tpocbte.nrotimbrado as nrotimbrado,
      dba.tpocbte.tp_def as tp_def,
      dba.tpocbte.TipoLibroIVA as agrup,
      'D' as tipo_iva,
      'N' as anulado,
      NULL as ref_tp_comp,
      dba.resvtacab.codmoneda as codmoneda,
      dba.resvtacab.factcambio as factcambio,
      NULL as cod_con_vta,
      NULL as des_con_vta,
      0 as cuota,
      0 as dias_credito,
      NULL as nrotimb,
      '0' as cod_establecimiento,
      '0' as cod_ptoexpedicion,
      dba.resvtacab.comp_inicial as comp_nro_timb,
      NULL as nro_fact_aso,
      NULL as nro_timb_aso,
      '' as clientes
    FROM dba.clientes, dba.resvtacab, dba.resvtadet, dba.tpocbte
    WHERE ( dba.resvtacab.cod_empresa = dba.clientes.cod_empresa )
      AND ( dba.resvtacab.cod_cliente = dba.clientes.cod_cliente )
      AND ( dba.resvtacab.cod_empresa = dba.resvtadet.cod_empresa )
      AND ( dba.resvtacab.cod_sucursal = dba.resvtadet.cod_sucursal )
      AND ( dba.resvtacab.cod_tp_comp = dba.resvtadet.cod_tp_comp )
      AND ( dba.resvtacab.comp_inicial = dba.resvtadet.comp_inicial )
      AND ( dba.resvtacab.comp_final = dba.resvtadet.comp_final )
      AND ( dba.tpocbte.cod_empresa = dba.resvtacab.cod_empresa )
      AND ( dba.tpocbte.cod_tp_comp = dba.resvtacab.cod_tp_comp )
      AND ( dba.tpocbte.TipoLibroIVA IS NOT NULL )
      AND ( dba.TpoCbte.documentoElectronico = 'N' )
      AND ( dba.resvtacab.cod_empresa = '${empresa}' )
      AND ( DATE(dba.resvtacab.fecha) BETWEEN DATE('${desde}') AND DATE('${hasta}') )
    GROUP BY
      dba.resvtacab.cod_empresa,
      dba.resvtacab.cod_sucursal,
      dba.resvtacab.cod_tp_comp,
      dba.resvtacab.fecha,
      dba.clientes.razon_social,
      dba.clientes.ruc,
      dba.resvtacab.comp_inicial,
      dba.resvtacab.comp_final,
      dba.tpocbte.des_tp_comp,
      dba.tpocbte.timbrado,
      dba.tpocbte.nrotimbrado,
      dba.tpocbte.TipoLibroIVA,
      dba.tpocbte.Tp_Def,
      dba.resvtacab.codmoneda,
      dba.resvtacab.factcambio
  )

  UNION

  SELECT
    '3' as tipo_registro,
    dba.vtacab.cod_empresa as cod_empresa,
    dba.vtacab.cod_sucursal as cod_sucursal,
    dba.vtacab.cod_tp_comp as cod_tp_comp,
    date(dba.vtacab.fha_cbte) as fechafact,
    dba.clientes.razon_social as razonsocial,
    dba.clientes.ruc as ruc,
    ( dba.vtacab.to_gravado - ( dba.vtacab.totaldctograv_d + dba.vtacab.totaldctograv + dba.vtacab.tot2dodctograv ) ) as total_grav,
    ( dba.vtacab.to_gravado_5 - ( dba.vtacab.totaldctograv_d_5 + dba.vtacab.totaldctograv_5 + dba.vtacab.tot2dodctograv_5 ) ) as total_grav_5,
    ( dba.vtacab.to_gravado_10 - ( dba.vtacab.totaldctograv_d_10 + dba.vtacab.totaldctograv_10 + dba.vtacab.tot2dodctograv_10 ) ) as total_grav_10,
    dba.vtacab.total_iva as total_iva,
    dba.vtacab.total_iva_5 as total_iva_5,
    dba.vtacab.total_iva_10 as total_iva_10,
    ( dba.vtacab.to_exento - ( dba.vtacab.totaldctoexen_d + dba.vtacab.totaldctoexen + dba.vtacab.tot2dodctoexen ) ) as total_exenta,
    dba.vtacab.comp_numero as comp_inicial,
    dba.vtacab.comp_numero as comp_final,
    dba.tpocbte.des_tp_comp as des_tp_comp,
    dba.tpocbte.timbrado as timbrado,
    dba.tpocbte.nrotimbrado as nrotimbrado,
    dba.tpocbte.tp_def as tp_def,
    dba.tpocbte.TipoLibroIVA as agrup,
    dba.vtacab.tipo_iva as tipo_iva,
    dba.vtacab.anulado as anulado,
    t2.TipoLibroIVA as ref_tp_comp,
    dba.vtacab.codmoneda as codmoneda,
    dba.vtacab.fact_cambio as factcambio,
    dba.vtacab.cod_con_vta as cod_con_vta,
    dba.terminos.des_con_vta as des_con_vta,
    dba.terminos.cuota as cuota,
    dba.terminos.dias_credito as dias_credito,
    dba.vtacab.nrotimb as nrotimb,
    '0' as cod_establecimiento,
    '0' as cod_ptoexpedicion,
    dba.vtacab.comp_nro_timb as comp_nro_timb,
    NULL as nro_fact_aso,
    NULL as nro_timb_aso,
    dba.vtacab.cod_cliente as clientes
  FROM dba.vtacab
       LEFT OUTER JOIN dba.tpocbte t2 ON dba.vtacab.Cod_Empresa = t2.Cod_Empresa AND dba.vtacab.rf_tp_comp = t2.cod_tp_comp,
       dba.clientes,
       dba.control,
       dba.tpocbte,
       dba.terminos
  WHERE ( dba.vtacab.cod_empresa = dba.clientes.cod_empresa )
    AND ( dba.f_get_periodo(dba.vtacab.cod_empresa, date(dba.vtacab.fha_cbte)) = dba.control.periodo )
    AND ( dba.vtacab.cod_empresa = dba.control.cod_empresa )
    AND ( dba.vtacab.cod_cliente = dba.control.cod_cliente_varios )
    AND ( dba.vtacab.cod_cliente = dba.clientes.cod_cliente )
    AND ( dba.tpocbte.cod_empresa = dba.vtacab.cod_empresa )
    AND ( dba.tpocbte.cod_tp_comp = dba.vtacab.cod_tp_comp )
    AND ( dba.vtacab.cod_con_vta = dba.terminos.cod_con_vta )
    AND ( dba.tpocbte.TipoLibroIVA IS NOT NULL )
    AND ( dba.tpocbte.tp_def != 'NC' )
    AND ( dba.vtacab.anulado = 'N' )
    AND ( dba.TpoCbte.documentoElectronico = 'N' )
    AND ( dba.vtacab.cod_empresa = '${empresa}' )
    AND ( DATE(dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )

    UNION

    SELECT
      '4' as tipo_registro,
    dba.vtacab.cod_empresa as cod_empresa,
    '00' as cod_sucursal,
    'FC' as cod_tp_comp,
    DATE('${hasta}') as fechafact,
    'SIN NOMBRE' as razonsocial,
    'X' as ruc,
    ( dba.vtacab.to_gravado - ( dba.vtacab.totaldctograv_d + dba.vtacab.totaldctograv + dba.vtacab.tot2dodctograv ) ) as total_grav,
    ( dba.vtacab.to_gravado_5 - ( dba.vtacab.totaldctograv_d_5 + dba.vtacab.totaldctograv_5 + dba.vtacab.tot2dodctograv_5 ) ) as total_grav_5,
    ( dba.vtacab.to_gravado_10 - ( dba.vtacab.totaldctograv_d_10 + dba.vtacab.totaldctograv_10 + dba.vtacab.tot2dodctograv_10 ) ) as total_grav_10,
    dba.vtacab.total_iva as total_iva,
    dba.vtacab.total_iva_5 as total_iva_5,
    dba.vtacab.total_iva_10 as total_iva_10,
    ( dba.vtacab.to_exento - ( dba.vtacab.totaldctoexen_d + dba.vtacab.totaldctoexen + dba.vtacab.tot2dodctoexen ) ) as total_exenta,
    0 as comp_inicial,
    0 as comp_final,
    'VENTA CONTADO' as des_tp_comp,
    '0' as timbrado,
    '0' as nrotimbrado,
    'CT' as tp_def,
    'CT' as agrup,
    dba.vtacab.tipo_iva as tipo_iva,
    dba.vtacab.anulado as anulado,
    NULL as ref_tp_comp,
    dba.vtacab.codmoneda as codmoneda,
    dba.vtacab.fact_cambio as factcambio,
    NULL as cod_con_vta,
    NULL as des_con_vta,
    0 as cuota,
    0 as dias_credito,
    NULL as nrotimb,
    '0' as cod_establecimiento,
    '0' as cod_ptoexpedicion,
    0 as comp_nro_timb,
    NULL as nro_fact_aso,
    NULL as nro_timb_aso,
    dba.vtacab.cod_cliente as clientes
  FROM dba.vtacab
       LEFT OUTER JOIN dba.tpocbte t2 ON dba.vtacab.Cod_Empresa = t2.Cod_Empresa AND dba.vtacab.rf_tp_comp = t2.cod_tp_comp,
       dba.tpoclte,
       dba.tpocbte,
       dba.control,
       dba.clientes
  WHERE ( dba.vtacab.cod_empresa = dba.clientes.cod_empresa )
    AND ( dba.vtacab.cod_cliente = dba.clientes.cod_cliente )
    AND ( dba.f_get_periodo(dba.vtacab.cod_empresa, date(dba.vtacab.fha_cbte)) = dba.control.periodo )
    AND ( dba.vtacab.cod_cliente <> dba.control.cod_cliente_varios )
    AND ( dba.vtacab.cod_empresa = dba.control.cod_empresa )
    AND ( dba.tpocbte.cod_empresa = dba.vtacab.cod_empresa )
    AND ( dba.tpocbte.cod_tp_comp = dba.vtacab.cod_tp_comp )
    AND ( dba.tpocbte.TipoLibroIVA IS NOT NULL )
    AND ( dba.vtacab.anulado = 'N' )
    AND ( dba.TpoCbte.documentoElectronico = 'N' )
    AND ( dba.clientes.cod_tp_cliente = dba.tpoclte.cod_tp_cliente )
    AND ( dba.tpoclte.DetHechauka = 'N' )
    AND ( dba.tpocbte.tp_def != 'NC' )
    AND ( dba.vtacab.cod_empresa = '${empresa}' )
    AND ( DATE(dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )
) base
WHERE 1=1
${sucursalSql}
ORDER BY base.fechafact, base.cod_tp_comp, base.comp_inicial`;
}

function buildVentasSqlTimbrado(params) {
    var empresa = esc(params.empresa);
    var desde = esc(params.desde);
    var hasta = esc(params.hasta);
    var sucursalSql = params.sucursal ? (" AND base.cod_sucursal = '" + esc(params.sucursal) + "' ") : '';

    return `
SELECT *
FROM (
  SELECT
    '1' as tipo_registro,
    dba.vtacab.cod_empresa as cod_empresa,
    dba.vtacab.cod_sucursal as cod_sucursal,
    dba.vtacab.cod_tp_comp as cod_tp_comp,
    date(dba.vtacab.fha_cbte) as fechafact,
    dba.clientes.razon_social as razonsocial,
    dba.clientes.ruc as ruc,
    ( dba.vtacab.to_gravado - ( dba.vtacab.totaldctograv_d + dba.vtacab.totaldctograv + dba.vtacab.tot2dodctograv ) ) as total_grav,
    ( dba.vtacab.to_gravado_5 - ( dba.vtacab.totaldctograv_d_5 + dba.vtacab.totaldctograv_5 + dba.vtacab.tot2dodctograv_5 ) ) as total_grav_5,
    ( dba.vtacab.to_gravado_10 - ( dba.vtacab.totaldctograv_d_10 + dba.vtacab.totaldctograv_10 + dba.vtacab.tot2dodctograv_10 ) ) as total_grav_10,
    dba.vtacab.total_iva as total_iva,
    dba.vtacab.total_iva_5 as total_iva_5,
    dba.vtacab.total_iva_10 as total_iva_10,
    ( dba.vtacab.to_exento - ( dba.vtacab.totaldctoexen_d + dba.vtacab.totaldctoexen + dba.vtacab.tot2dodctoexen ) ) as total_exenta,
    dba.vtacab.comp_numero as comp_inicial,
    dba.vtacab.comp_numero as comp_final,
    dba.tpocbte.des_tp_comp as des_tp_comp,
    dba.vtacab.nrotimb as timbrado,
    dba.vtacab.nrotimb as nrotimbrado,
    dba.tpocbte.tp_def as tp_def,
    dba.tpocbte.TipoLibroIVA as agrup,
    dba.vtacab.tipo_iva as tipo_iva,
    dba.vtacab.anulado as anulado,
    t2.TipoLibroIVA as ref_tp_comp,
    dba.vtacab.codmoneda as codmoneda,
    dba.vtacab.fact_cambio as factcambio,
    dba.vtacab.cod_con_vta as cod_con_vta,
    dba.terminos.des_con_vta as des_con_vta,
    dba.terminos.cuota as cuota,
    dba.terminos.dias_credito as dias_credito,
    dba.vtacab.nrotimb as nrotimb,
    dba.vtacab.cod_establecimiento as cod_establecimiento,
    dba.vtacab.cod_ptoexpedicion as cod_ptoexpedicion,
    dba.vtacab.comp_nro_timb as comp_nro_timb,
    null as nro_fact_aso,
    null as nro_timb_aso,
    dba.vtacab.cod_cliente as clientes
  FROM dba.vtacab
       LEFT OUTER JOIN dba.tpocbte t2 ON dba.vtacab.Cod_Empresa = t2.Cod_Empresa AND dba.vtacab.rf_tp_comp = t2.cod_tp_comp,
       dba.tpoclte,
       dba.tpocbte,
       dba.control,
       dba.clientes,
       dba.terminos
  WHERE ( dba.vtacab.cod_empresa = dba.clientes.cod_empresa )
    AND ( dba.vtacab.cod_empresa = dba.control.cod_empresa )
    AND ( dba.f_get_periodo( dba.vtacab.cod_empresa, date (dba.vtacab.fha_cbte)) = dba.control.periodo )
    AND ( dba.vtacab.cod_cliente <> dba.control.cod_cliente_varios )
    AND ( dba.vtacab.cod_cliente = dba.clientes.cod_cliente )
    AND ( dba.tpocbte.cod_empresa = dba.vtacab.cod_empresa )
    AND ( dba.tpocbte.cod_tp_comp = dba.vtacab.cod_tp_comp )
    AND ( dba.vtacab.cod_con_vta = dba.terminos.cod_con_vta )
    AND ( dba.tpocbte.TipoLibroIVA IS NOT NULL )
    AND ( dba.tpocbte.tp_def != 'NC' )
    AND ( dba.clientes.cod_tp_cliente = dba.tpoclte.cod_tp_cliente )
    AND ( dba.tpoclte.DetHechauka = 'S' )
    AND ( dba.vtacab.anulado = 'N' )
    AND ( dba.vtacab.cod_empresa = '${empresa}' )
    AND ( DATE (dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )

  UNION

  SELECT
    '6' as tipo_registro,
    dba.vtacab.cod_empresa as cod_empresa,
    dba.vtacab.cod_sucursal as cod_sucursal,
    dba.vtacab.cod_tp_comp as cod_tp_comp,
    date(dba.vtacab.fha_cbte) as fechafact,
    dba.clientes.razon_social as razonsocial,
    dba.clientes.ruc as ruc,
    ( dba.vtacab.to_gravado - ( dba.vtacab.totaldctograv_d + dba.vtacab.totaldctograv + dba.vtacab.tot2dodctograv ) ) as total_grav,
    ( dba.vtacab.to_gravado_5 - ( dba.vtacab.totaldctograv_d_5 + dba.vtacab.totaldctograv_5 + dba.vtacab.tot2dodctograv_5 ) ) as total_grav_5,
    ( dba.vtacab.to_gravado_10 - ( dba.vtacab.totaldctograv_d_10 + dba.vtacab.totaldctograv_10 + dba.vtacab.tot2dodctograv_10 ) ) as total_grav_10,
    dba.vtacab.total_iva as total_iva,
    dba.vtacab.total_iva_5 as total_iva_5,
    dba.vtacab.total_iva_10 as total_iva_10,
    ( dba.vtacab.to_exento - ( dba.vtacab.totaldctoexen_d + dba.vtacab.totaldctoexen + dba.vtacab.tot2dodctoexen ) ) as total_exenta,
    dba.vtacab.comp_numero as comp_inicial,
    dba.vtacab.comp_numero as comp_final,
    dba.tpocbte.des_tp_comp as des_tp_comp,
    dba.vtacab.nrotimb as timbrado,
    dba.vtacab.nrotimb as nrotimbrado,
    dba.tpocbte.tp_def as tp_def,
    dba.tpocbte.TipoLibroIVA as agrup,
    dba.vtacab.tipo_iva as tipo_iva,
    dba.vtacab.anulado as anulado,
    t2.TipoLibroIVA as ref_tp_comp,
    dba.vtacab.codmoneda as codmoneda,
    dba.vtacab.fact_cambio as factcambio,
    null as cod_con_vta,
    null as des_con_vta,
    0 as cuota,
    0 as dias_credito,
    dba.vtacab.nrotimb as nrotimb,
    dba.vtacab.cod_establecimiento as cod_establecimiento,
    dba.vtacab.cod_ptoexpedicion as cod_ptoexpedicion,
    dba.vtacab.comp_nro_timb as comp_nro_timb,
    null as nro_fact_aso,
    null as nro_timb_aso,
    dba.vtacab.cod_cliente as clientes
  FROM dba.vtacab
       LEFT OUTER JOIN dba.tpocbte t2 ON dba.vtacab.Cod_Empresa = t2.Cod_Empresa AND dba.vtacab.rf_tp_comp = t2.cod_tp_comp,
       dba.tpocbte,
       dba.control,
       dba.clientes
  WHERE ( dba.vtacab.cod_empresa = dba.clientes.cod_empresa )
    AND ( dba.vtacab.cod_empresa = dba.control.cod_empresa )
    AND ( dba.f_get_periodo( dba.vtacab.cod_empresa, date (dba.vtacab.fha_cbte)) = dba.control.periodo )
    AND ( dba.vtacab.cod_cliente <> dba.control.cod_cliente_varios )
    AND ( dba.vtacab.cod_cliente = dba.clientes.cod_cliente )
    AND ( dba.tpocbte.cod_empresa = dba.vtacab.cod_empresa )
    AND ( dba.tpocbte.cod_tp_comp = dba.vtacab.cod_tp_comp )
    AND ( dba.tpocbte.TipoLibroIVA IS NOT NULL )
    AND ( dba.tpocbte.tp_def = 'NC' )
    AND ( dba.vtacab.anulado = 'N' )
    AND ( dba.vtacab.cod_empresa = '${empresa}' )
    AND ( DATE (dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )

  UNION

  SELECT
    '2' as tipo_registro,
    dba.resvtacab.cod_empresa as cod_empresa,
    dba.resvtacab.cod_sucursal as cod_sucursal,
    dba.resvtacab.cod_tp_comp as cod_tp_comp,
    date(dba.resvtacab.fecha) as fechafact,
    dba.clientes.razon_social as razonsocial,
    dba.clientes.ruc as ruc,
    (dba.resvtadet.totalgravado * dba.resvtacab.factcambio) as total_grav,
    (dba.resvtadet.totalgravado * dba.resvtacab.factcambio) as total_grav_5,
    (dba.resvtadet.totalgravado * dba.resvtacab.factcambio) as total_grav_10,
    (dba.resvtadet.totaliva * dba.resvtacab.factcambio) as total_iva,
    (dba.resvtadet.totaliva * dba.resvtacab.factcambio) as total_iva_5,
    (dba.resvtadet.totaliva * dba.resvtacab.factcambio) as total_iva_10,
    (dba.resvtadet.totalexento * dba.resvtacab.factcambio) as total_exenta,
    dba.resvtacab.comp_inicial as comp_inicial,
    dba.resvtacab.comp_final as comp_final,
    dba.tpocbte.des_tp_comp as des_tp_comp,
    '0' as timbrado,
    '0' as nrotimbrado,
    dba.tpocbte.tp_def as tp_def,
    dba.tpocbte.TipoLibroIVA as agrup,
    'D' as tipo_iva,
    'N' as anulado,
    null as ref_tp_comp,
    dba.resvtacab.codmoneda as codmoneda,
    1 as factcambio,
    null as cod_con_vta,
    null as des_con_vta,
    0 as cuota,
    0 as dias_credito,
    '0' as nrotimb,
    '0' as cod_establecimiento,
    '0' as cod_ptoexpedicion,
    0 as comp_nro_timb,
    null as nro_fact_aso,
    null as nro_timb_aso,
    '' as clientes
  FROM dba.clientes, dba.resvtacab, dba.resvtadet, dba.tpocbte
  WHERE ( dba.resvtacab.cod_empresa = dba.clientes.cod_empresa )
    and ( dba.resvtacab.cod_cliente = dba.clientes.cod_cliente )
    and ( dba.resvtacab.cod_empresa = dba.resvtadet.cod_empresa )
    and ( dba.resvtacab.cod_sucursal = dba.resvtadet.cod_sucursal )
    and ( dba.resvtacab.cod_tp_comp = dba.resvtadet.cod_tp_comp )
    and ( dba.resvtacab.comp_inicial = dba.resvtadet.comp_inicial )
    and ( dba.resvtacab.comp_final = dba.resvtadet.comp_final )
    and ( dba.tpocbte.cod_empresa = dba.resvtacab.cod_empresa )
    and ( dba.tpocbte.cod_tp_comp = dba.resvtacab.cod_tp_comp )
    and ( dba.tpocbte.TipoLibroIVA IS NOT NULL )
    and ( dba.resvtacab.cod_empresa = '${empresa}' )
    and ( DATE (dba.resvtacab.fecha) BETWEEN DATE('${desde}') AND DATE('${hasta}') )

  UNION

  SELECT
    '3' as tipo_registro,
    dba.vtacab.cod_empresa as cod_empresa,
    dba.vtacab.cod_sucursal as cod_sucursal,
    dba.vtacab.cod_tp_comp as cod_tp_comp,
    date(dba.vtacab.fha_cbte) as fechafact,
    dba.clientes.razon_social as razonsocial,
    dba.clientes.ruc as ruc,
    ( dba.vtacab.to_gravado - ( dba.vtacab.totaldctograv_d + dba.vtacab.totaldctograv + dba.vtacab.tot2dodctograv ) ) * dba.vtacab.fact_cambio as total_grav,
    ( dba.vtacab.to_gravado_5 - ( dba.vtacab.totaldctograv_d_5 + dba.vtacab.totaldctograv_5 + dba.vtacab.tot2dodctograv_5 ) ) * dba.vtacab.fact_cambio as total_grav_5,
    ( dba.vtacab.to_gravado_10 - ( dba.vtacab.totaldctograv_d_10 + dba.vtacab.totaldctograv_10 + dba.vtacab.tot2dodctograv_10 ) ) * dba.vtacab.fact_cambio as total_grav_10,
    (dba.vtacab.total_iva * dba.vtacab.fact_cambio) as total_iva,
    (dba.vtacab.total_iva_5 * dba.vtacab.fact_cambio) as total_iva_5,
    (dba.vtacab.total_iva_10 * dba.vtacab.fact_cambio) as total_iva_10,
    ( dba.vtacab.to_exento - ( dba.vtacab.totaldctoexen_d + dba.vtacab.totaldctoexen + dba.vtacab.tot2dodctoexen ) ) * dba.vtacab.fact_cambio as total_exenta,
    dba.vtacab.comp_numero as comp_inicial,
    dba.vtacab.comp_numero as comp_final,
    'VENTA CONTADO' as des_tp_comp,
    dba.vtacab.nrotimb as timbrado,
    dba.vtacab.nrotimb as nrotimbrado,
    'CT' as tp_def,
    'CT' as agrup,
    dba.vtacab.tipo_iva as tipo_iva,
    dba.vtacab.anulado as anulado,
    null as ref_tp_comp,
    dba.vtacab.codmoneda as codmoneda,
    1 as factcambio,
    null as cod_con_vta,
    null as des_con_vta,
    0 as cuota,
    0 as dias_credito,
    dba.vtacab.nrotimb as nrotimb,
    dba.vtacab.cod_establecimiento as cod_establecimiento,
    dba.vtacab.cod_ptoexpedicion as cod_ptoexpedicion,
    dba.vtacab.comp_nro_timb as comp_nro_timb,
    null as nro_fact_aso,
    null as nro_timb_aso,
    dba.vtacab.cod_cliente as clientes
  FROM dba.vtacab
       LEFT OUTER JOIN dba.tpocbte t2 ON dba.vtacab.Cod_Empresa = t2.Cod_Empresa AND dba.vtacab.rf_tp_comp = t2.cod_tp_comp,
       dba.clientes,
       dba.control,
       dba.tpocbte
  WHERE ( dba.vtacab.cod_empresa = dba.clientes.cod_empresa )
    and ( dba.f_get_periodo( dba.vtacab.cod_empresa, date (dba.vtacab.fha_cbte)) = dba.control.periodo )
    and ( dba.vtacab.cod_empresa = dba.control.cod_empresa )
    and ( dba.vtacab.cod_cliente = dba.control.cod_cliente_varios )
    and ( dba.vtacab.cod_cliente = dba.clientes.cod_cliente )
    and ( dba.tpocbte.cod_empresa = dba.vtacab.cod_empresa )
    and ( dba.tpocbte.cod_tp_comp = dba.vtacab.cod_tp_comp )
    and ( dba.tpocbte.TipoLibroIVA IS NOT NULL )
    and ( dba.tpocbte.tp_def != 'NC' )
    and ( dba.vtacab.anulado = 'N' )
    and ( dba.vtacab.cod_empresa = '${empresa}' )
    and ( DATE (dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )

  UNION

  SELECT
    '4' as tipo_registro,
    dba.vtacab.cod_empresa as cod_empresa,
    '00' as cod_sucursal,
    'FC' as cod_tp_comp,
    DATE('${hasta}') as fechafact,
    'SIN NOMBRE' as razonsocial,
    'X' as ruc,
    ( dba.vtacab.to_gravado - ( dba.vtacab.totaldctograv_d + dba.vtacab.totaldctograv + dba.vtacab.tot2dodctograv ) ) * dba.vtacab.fact_cambio as total_grav,
    ( dba.vtacab.to_gravado_5 - ( dba.vtacab.totaldctograv_d_5 + dba.vtacab.totaldctograv_5 + dba.vtacab.tot2dodctograv_5 ) ) * dba.vtacab.fact_cambio as total_grav_5,
    ( dba.vtacab.to_gravado_10 - ( dba.vtacab.totaldctograv_d_10 + dba.vtacab.totaldctograv_10 + dba.vtacab.tot2dodctograv_10 ) ) * dba.vtacab.fact_cambio as total_grav_10,
    (dba.vtacab.total_iva * dba.vtacab.fact_cambio) as total_iva,
    (dba.vtacab.total_iva_5 * dba.vtacab.fact_cambio) as total_iva_5,
    (dba.vtacab.total_iva_10 * dba.vtacab.fact_cambio) as total_iva_10,
    ( dba.vtacab.to_exento - ( dba.vtacab.totaldctoexen_d + dba.vtacab.totaldctoexen + dba.vtacab.tot2dodctoexen ) ) * dba.vtacab.fact_cambio as total_exenta,
    0 as comp_inicial,
    0 as comp_final,
    'VENTA CONTADO' as des_tp_comp,
    '0' as timbrado,
    '0' as nrotimbrado,
    'CT' as tp_def,
    'CT' as agrup,
    dba.vtacab.tipo_iva as tipo_iva,
    dba.vtacab.anulado as anulado,
    null as ref_tp_comp,
    dba.vtacab.codmoneda as codmoneda,
    1 as factcambio,
    null as cod_con_vta,
    null as des_con_vta,
    0 as cuota,
    0 as dias_credito,
    '0' as nrotimb,
    '0' as cod_establecimiento,
    '0' as cod_ptoexpedicion,
    0 as comp_nro_timb,
    null as nro_fact_aso,
    null as nro_timb_aso,
    dba.vtacab.cod_cliente as clientes
  FROM dba.vtacab
       LEFT OUTER JOIN dba.tpocbte t2 ON dba.vtacab.Cod_Empresa = t2.Cod_Empresa AND dba.vtacab.rf_tp_comp = t2.cod_tp_comp,
       dba.tpoclte,
       dba.tpocbte,
       dba.control,
       dba.clientes
  WHERE ( dba.vtacab.cod_empresa = dba.clientes.cod_empresa )
    and ( dba.vtacab.cod_cliente = dba.clientes.cod_cliente )
    and ( dba.f_get_periodo( dba.vtacab.cod_empresa, date (dba.vtacab.fha_cbte)) = dba.control.periodo )
    and ( dba.vtacab.cod_cliente <> dba.control.cod_cliente_varios )
    and ( dba.vtacab.cod_empresa = dba.control.cod_empresa )
    and ( dba.tpocbte.cod_empresa = dba.vtacab.cod_empresa )
    and ( dba.tpocbte.cod_tp_comp = dba.vtacab.cod_tp_comp )
    and ( dba.tpocbte.TipoLibroIVA IS NOT NULL )
    and ( dba.tpocbte.tp_def != 'NC' )
    and ( dba.vtacab.anulado = 'N' )
    and ( dba.clientes.cod_tp_cliente = dba.tpoclte.cod_tp_cliente )
    and ( dba.tpoclte.DetHechauka = 'N' )
    and ( dba.vtacab.cod_empresa = '${empresa}' )
    and ( DATE (dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )

  UNION

  SELECT
      '5' as tipo_registro,
      dba.factcab.cod_empresa as cod_empresa,
    dba.factcab.cod_sucursal as cod_sucursal,
    dba.factcab.cod_tp_comp as cod_tp_comp,
    date(dba.factcab.fechafact) as fechafact,
    dba.factcab.razonsocial as razonsocial,
    dba.factcab.ruc as ruc,
    dba.factcab.totalgrav as total_grav,
    (dba.factcab.gravado5 + dba.factcab.total_iva_5) as total_grav_5,
    (dba.factcab.gravado10 + dba.factcab.total_iva_10) as total_grav_10,
    dba.factcab.iva as total_iva,
    dba.factcab.total_iva_5 as total_iva_5,
    dba.factcab.total_iva_10 as total_iva_10,
    dba.factcab.totalexen as total_exenta,
    dba.factcab.nrofact as comp_inicial,
    dba.factcab.nrofact as comp_final,
    dba.tpocbte.des_tp_comp as des_tp_comp,
    dba.factcab.timbrado as timbrado,
    dba.factcab.timbrado as nrotimbrado,
    dba.tpocbte.tp_def as tp_def,
    'NOTA CREDITO DE PROVEEDOR' as agrup,
    if ( dba.factcab.IVAIncluido = 'S' ) then 'I' else 'D' endif as tipo_iva,
    'N' as anulado,
    null as ref_tp_comp,
    dba.factcab.codmoneda as codmoneda,
    dba.factcab.factcambio as factcambio,
    null as cod_con_vta,
    null as des_con_vta,
    0 as cuota,
    0 as dias_credito,
    dba.factcab.timbrado as nrotimb,
    '0' as cod_establecimiento,
    '0' as cod_ptoexpedicion,
    dba.factcab.nrofact as comp_nro_timb,
    replicate('0',3-length(string(fc.cod_establecimiento)))+string(fc.cod_establecimiento) + '-' + replicate('0',3-length(string(fc.cod_punto_emision)))+string(fc.cod_punto_emision) + '-' + replicate('0',7-length(string(fc.nrofactura)))+string(fc.nrofactura) as nro_fact_aso,
    fc.timbrado as nro_timb_aso,
    '' as clientes
  FROM dba.tpocbte,
       dba.control,
       dba.proveed,
       ((dba.factcab LEFT OUTER JOIN dba.tpocbte t2 ON dba.factcab.Cod_Empresa = t2.Cod_Empresa AND dba.factcab.cod_tp_compref = t2.cod_tp_comp)
         LEFT OUTER JOIN dba.notacredprov ncp on ncp.cod_empresa = dba.factcab.cod_empresa and ncp.codprov = dba.factcab.codprov and ncp.Cod_tp_compNC = dba.factcab.cod_tp_comp and ncp.nrofactNC = dba.factcab.nrofact)
         LEFT OUTER JOIN dba.factcab fc on ncp.cod_empresa = fc.cod_empresa and ncp.codprov = fc.codprov and ncp.cod_tp_comp = fc.cod_tp_comp and ncp.nrofact = fc.nrofact
  WHERE ( dba.factcab.cod_empresa = dba.control.cod_empresa )
    and ( dba.f_get_periodo( dba.factcab.cod_empresa, date (dba.factcab.fechafact)) = dba.control.periodo )
    and ( dba.factcab.cod_tp_comp != dba.control.cod_tp_compriva )
    and ( dba.factcab.cod_empresa = dba.proveed.cod_empresa )
    and ( dba.factcab.codprov = dba.proveed.codprov )
    and ( dba.tpocbte.cod_empresa = dba.factcab.cod_empresa )
    and ( dba.tpocbte.cod_tp_comp = dba.factcab.cod_tp_comp )
    and ( dba.factcab.gravado = 'S' )
    and ( dba.tpocbte.tp_def = 'NP' )
    and ( dba.factcab.cod_empresa = '${empresa}' )
    and ( DATE (dba.factcab.fechafact) BETWEEN DATE('${desde}') AND DATE('${hasta}') )

  UNION

  SELECT
    '5' as tipo_registro,
    dba.liquidacion.cod_empresa as cod_empresa,
    dba.despacho.cod_sucursal as cod_sucursal,
    dba.liquidacion.cod_tp_comp as cod_tp_comp,
    date(dba.liquidacion.fechacbte) as fechafact,
    dba.proveed.razonsocial as razonsocial,
    dba.proveed.ruc as ruc,
    dba.liquidacion.gravado as total_grav,
    if ( dba.liquidacion.porc_iva = 5 ) then dba.liquidacion.gravado + dba.liquidacion.iva else 0 endif as total_grav_5,
    if ( dba.liquidacion.porc_iva = 10 ) then dba.liquidacion.gravado + dba.liquidacion.iva else 0 endif as total_grav_10,
    dba.liquidacion.iva as total_iva,
    if ( dba.liquidacion.porc_iva = 5 ) then dba.liquidacion.iva else 0 endif as total_iva_5,
    if ( dba.liquidacion.porc_iva = 10 ) then dba.liquidacion.iva else 0 endif as total_iva_10,
    dba.liquidacion.exento as total_exenta,
    dba.liquidacion.nrocbte as comp_inicial,
    dba.liquidacion.nrocbte as comp_final,
    dba.tpocbte.des_tp_comp as des_tp_comp,
    dba.liquidacion.timbrado as timbrado,
    dba.liquidacion.timbrado as nrotimbrado,
    dba.tpocbte.tp_def as tp_def,
    'NOTA CREDITO DE PROVEEDOR' as agrup,
    dba.liquidacion.tipo_iva as tipo_iva,
    'N' as anulado,
    null as ref_tp_comp,
    dba.despacho.codmoneda as codmoneda,
    dba.despacho.factcambio as factcambio,
    null as cod_con_vta,
    null as des_con_vta,
    0 as cuota,
    0 as dias_credito,
    dba.liquidacion.timbrado as nrotimb,
    '0' as cod_establecimiento,
    '0' as cod_ptoexpedicion,
    dba.liquidacion.nrocbte as comp_nro_timb,
    null as nro_fact_aso,
    null as nro_timb_aso,
    '' as clientes
  FROM dba.tpocbte,
       dba.despacho,
       dba.proveed,
       dba.liquidacion,
       dba.aranceles
  WHERE dba.liquidacion.cod_empresa = dba.despacho.cod_empresa
    and dba.liquidacion.anho = dba.despacho.anho
    and dba.liquidacion.coddespachante = dba.despacho.coddespachante
    and dba.liquidacion.nrodespacho = dba.despacho.nrodespacho
    and dba.liquidacion.cod_empresa = dba.proveed.cod_empresa
    and dba.liquidacion.codprov = dba.proveed.codprov
    and dba.tpocbte.cod_empresa = dba.liquidacion.cod_empresa
    and dba.tpocbte.cod_tp_comp = dba.liquidacion.cod_tp_comp
    and dba.tpocbte.tp_def = 'NP'
    and dba.liquidacion.libroiva = 'S'
    and dba.liquidacion.cod_empresa = dba.aranceles.cod_empresa
    and dba.liquidacion.codarancel = dba.aranceles.codarancel
    and dba.aranceles.tpdef = 'N'
    and dba.liquidacion.cod_empresa = '${empresa}'
    and ( DATE (dba.liquidacion.fechacbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )
) base
WHERE 1=1
${sucursalSql}
ORDER BY base.fechafact, base.cod_tp_comp, base.comp_inicial`;
}

function buildVentasDiagnosticsQueries(params) {
    var empresa = esc(params.empresa);
    var desde = esc(params.desde);
    var hasta = esc(params.hasta);

    return [
        {
            key: 'base_vtacab_periodo',
            sql: `
SELECT COUNT(*) as cantidad
FROM dba.vtacab
WHERE ( dba.vtacab.cod_empresa = '${empresa}' )
  AND ( DATE(dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )`
        },
        {
            key: 'base_vtacab_anulado_n',
            sql: `
SELECT COUNT(*) as cantidad
FROM dba.vtacab
WHERE ( dba.vtacab.cod_empresa = '${empresa}' )
  AND ( DATE(dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )
  AND ( dba.vtacab.anulado = 'N' )`
        },
        {
            key: 'base_vtacab_anulado_no_s',
            sql: `
SELECT COUNT(*) as cantidad
FROM dba.vtacab
WHERE ( dba.vtacab.cod_empresa = '${empresa}' )
  AND ( DATE(dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )
  AND ( coalesce(dba.vtacab.anulado, 'N') <> 'S' )`
        },
        {
            key: 'base_vtacab_con_tpocbte',
            sql: `
SELECT COUNT(*) as cantidad
FROM dba.vtacab, dba.tpocbte
WHERE ( dba.vtacab.cod_empresa = '${empresa}' )
  AND ( DATE(dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )
  AND ( dba.vtacab.cod_empresa = dba.tpocbte.cod_empresa )
  AND ( dba.vtacab.cod_tp_comp = dba.tpocbte.cod_tp_comp )`
        },
        {
            key: 'base_vtacab_tipo_libro',
            sql: `
SELECT COUNT(*) as cantidad
FROM dba.vtacab, dba.tpocbte
WHERE ( dba.vtacab.cod_empresa = '${empresa}' )
  AND ( DATE(dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )
  AND ( dba.vtacab.cod_empresa = dba.tpocbte.cod_empresa )
  AND ( dba.vtacab.cod_tp_comp = dba.tpocbte.cod_tp_comp )
  AND ( dba.tpocbte.TipoLibroIVA IS NOT NULL )`
        },
        {
            key: 'base_vtacab_no_nc',
            sql: `
SELECT COUNT(*) as cantidad
FROM dba.vtacab, dba.tpocbte
WHERE ( dba.vtacab.cod_empresa = '${empresa}' )
  AND ( DATE(dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )
  AND ( dba.vtacab.cod_empresa = dba.tpocbte.cod_empresa )
  AND ( dba.vtacab.cod_tp_comp = dba.tpocbte.cod_tp_comp )
  AND ( dba.tpocbte.TipoLibroIVA IS NOT NULL )
  AND ( dba.tpocbte.tp_def != 'NC' )`
        },
        {
            key: 'base_vtacab_con_terminos',
            sql: `
SELECT COUNT(*) as cantidad
FROM dba.vtacab, dba.terminos
WHERE ( dba.vtacab.cod_empresa = '${empresa}' )
  AND ( DATE(dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )
  AND ( dba.vtacab.cod_con_vta = dba.terminos.cod_con_vta )`
        },
        {
            key: 'base_vtacab_control_periodo',
            sql: `
SELECT COUNT(*) as cantidad
FROM dba.vtacab, dba.control
WHERE ( dba.vtacab.cod_empresa = '${empresa}' )
  AND ( DATE(dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )
  AND ( dba.vtacab.cod_empresa = dba.control.cod_empresa )
  AND ( dba.f_get_periodo(dba.vtacab.cod_empresa, date(dba.vtacab.fha_cbte)) = dba.control.periodo )`
        },
        {
            key: 'base_resvtacab_periodo',
            sql: `
SELECT COUNT(*) as cantidad
FROM dba.resvtacab
WHERE ( dba.resvtacab.cod_empresa = '${empresa}' )
  AND ( DATE(dba.resvtacab.fecha) BETWEEN DATE('${desde}') AND DATE('${hasta}') )`
        },
        {
            key: 'tipo_1_vtacab_clientes',
            sql: `
SELECT COUNT(*) as cantidad
FROM dba.vtacab
     LEFT OUTER JOIN dba.tpocbte t2 ON dba.vtacab.Cod_Empresa = t2.Cod_Empresa AND dba.vtacab.rf_tp_comp = t2.cod_tp_comp,
     dba.control,
     dba.clientes LEFT OUTER JOIN dba.tpoclte ON dba.clientes.cod_tp_cliente = dba.tpoclte.cod_tp_cliente AND dba.tpoclte.DetHechauka = 'S',
     dba.tpocbte,
     dba.terminos
WHERE ( dba.vtacab.cod_empresa = dba.clientes.cod_empresa )
  AND ( dba.vtacab.cod_empresa = dba.control.cod_empresa )
  AND ( dba.f_get_periodo(dba.vtacab.cod_empresa, date(dba.vtacab.fha_cbte)) = dba.control.periodo )
  AND ( dba.vtacab.cod_cliente <> dba.control.cod_cliente_varios )
  AND ( dba.vtacab.cod_cliente = dba.clientes.cod_cliente )
  AND ( dba.tpocbte.cod_empresa = dba.vtacab.cod_empresa )
  AND ( dba.tpocbte.cod_tp_comp = dba.vtacab.cod_tp_comp )
  AND ( dba.tpocbte.TipoLibroIVA IS NOT NULL )
  AND ( dba.tpocbte.tp_def != 'NC' )
  AND ( dba.vtacab.cod_con_vta = dba.terminos.cod_con_vta )
  AND ( dba.vtacab.anulado = 'N' )
  AND ( dba.TpoCbte.documentoElectronico = 'N' )
  AND ( dba.vtacab.cod_empresa = '${empresa}' )
  AND ( DATE(dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )`
        },
        {
            key: 'tipo_2_resumen',
            sql: `
SELECT COUNT(*) as cantidad
FROM (
  SELECT dba.resvtacab.comp_inicial
  FROM dba.clientes, dba.resvtacab, dba.resvtadet, dba.tpocbte
  WHERE ( dba.resvtacab.cod_empresa = dba.clientes.cod_empresa )
    AND ( dba.resvtacab.cod_cliente = dba.clientes.cod_cliente )
    AND ( dba.resvtacab.cod_empresa = dba.resvtadet.cod_empresa )
    AND ( dba.resvtacab.cod_sucursal = dba.resvtadet.cod_sucursal )
    AND ( dba.resvtacab.cod_tp_comp = dba.resvtadet.cod_tp_comp )
    AND ( dba.resvtacab.comp_inicial = dba.resvtadet.comp_inicial )
    AND ( dba.resvtacab.comp_final = dba.resvtadet.comp_final )
    AND ( dba.tpocbte.cod_empresa = dba.resvtacab.cod_empresa )
    AND ( dba.tpocbte.cod_tp_comp = dba.resvtacab.cod_tp_comp )
    AND ( dba.tpocbte.TipoLibroIVA IS NOT NULL )
    AND ( dba.TpoCbte.documentoElectronico = 'N' )
    AND ( dba.resvtacab.cod_empresa = '${empresa}' )
    AND ( DATE(dba.resvtacab.fecha) BETWEEN DATE('${desde}') AND DATE('${hasta}') )
  GROUP BY dba.resvtacab.cod_empresa,
           dba.resvtacab.cod_sucursal,
           dba.resvtacab.cod_tp_comp,
           dba.resvtacab.fecha,
           dba.clientes.razon_social,
           dba.clientes.ruc,
           dba.resvtacab.comp_inicial,
           dba.resvtacab.comp_final,
           dba.tpocbte.des_tp_comp,
           dba.tpocbte.timbrado,
           dba.tpocbte.nrotimbrado,
           dba.tpocbte.TipoLibroIVA,
           dba.tpocbte.Tp_Def,
           dba.resvtacab.codmoneda,
           dba.resvtacab.factcambio
) base`
        },
        {
            key: 'tipo_3_cliente_varios',
            sql: `
SELECT COUNT(*) as cantidad
FROM dba.vtacab
     LEFT OUTER JOIN dba.tpocbte t2 ON dba.vtacab.Cod_Empresa = t2.Cod_Empresa AND dba.vtacab.rf_tp_comp = t2.cod_tp_comp,
     dba.clientes,
     dba.control,
     dba.tpocbte,
     dba.terminos
WHERE ( dba.vtacab.cod_empresa = dba.clientes.cod_empresa )
  AND ( dba.f_get_periodo(dba.vtacab.cod_empresa, date(dba.vtacab.fha_cbte)) = dba.control.periodo )
  AND ( dba.vtacab.cod_empresa = dba.control.cod_empresa )
  AND ( dba.vtacab.cod_cliente = dba.control.cod_cliente_varios )
  AND ( dba.vtacab.cod_cliente = dba.clientes.cod_cliente )
  AND ( dba.tpocbte.cod_empresa = dba.vtacab.cod_empresa )
  AND ( dba.tpocbte.cod_tp_comp = dba.vtacab.cod_tp_comp )
  AND ( dba.vtacab.cod_con_vta = dba.terminos.cod_con_vta )
  AND ( dba.tpocbte.TipoLibroIVA IS NOT NULL )
  AND ( dba.tpocbte.tp_def != 'NC' )
  AND ( dba.vtacab.anulado = 'N' )
  AND ( dba.TpoCbte.documentoElectronico = 'N' )
  AND ( dba.vtacab.cod_empresa = '${empresa}' )
  AND ( DATE(dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )`
        },
        {
            key: 'tipo_4_sin_nombre',
            sql: `
SELECT COUNT(*) as cantidad
FROM dba.vtacab
     LEFT OUTER JOIN dba.tpocbte t2 ON dba.vtacab.Cod_Empresa = t2.Cod_Empresa AND dba.vtacab.rf_tp_comp = t2.cod_tp_comp,
     dba.tpoclte,
     dba.tpocbte,
     dba.control,
     dba.clientes
WHERE ( dba.vtacab.cod_empresa = dba.clientes.cod_empresa )
  AND ( dba.vtacab.cod_cliente = dba.clientes.cod_cliente )
  AND ( dba.f_get_periodo(dba.vtacab.cod_empresa, date(dba.vtacab.fha_cbte)) = dba.control.periodo )
  AND ( dba.vtacab.cod_cliente <> dba.control.cod_cliente_varios )
  AND ( dba.vtacab.cod_empresa = dba.control.cod_empresa )
  AND ( dba.tpocbte.cod_empresa = dba.vtacab.cod_empresa )
  AND ( dba.tpocbte.cod_tp_comp = dba.vtacab.cod_tp_comp )
  AND ( dba.tpocbte.TipoLibroIVA IS NOT NULL )
  AND ( dba.vtacab.anulado = 'N' )
  AND ( dba.TpoCbte.documentoElectronico = 'N' )
  AND ( dba.clientes.cod_tp_cliente = dba.tpoclte.cod_tp_cliente )
  AND ( dba.tpoclte.DetHechauka = 'N' )
  AND ( dba.tpocbte.tp_def != 'NC' )
  AND ( dba.vtacab.cod_empresa = '${empresa}' )
  AND ( DATE(dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )`
        }
    ];
}

function buildComprasDiagnosticsQueries(params) {
    var empresa = esc(params.empresa);
    var desde = esc(params.desde);
    var hasta = esc(params.hasta);
    var sucursalFactcabSql = params.sucursal ? (" AND ( dba.FactCab.Cod_Sucursal = '" + esc(params.sucursal) + "' ) ") : '';

    return [
        {
            key: 'compra_factcab',
            sql: `
SELECT COUNT(*) as cantidad
FROM DBA.EMPRESA, DBA.FACTCAB, DBA.Proveed, DBA.TpoCbte, DBA.Terminos
WHERE ( DBA.EMPRESA.Cod_Empresa = DBA.FACTCAB.Cod_Empresa )
  and ( DBA.Proveed.Cod_Empresa = DBA.FACTCAB.Cod_Empresa )
  and ( DBA.Proveed.CodProv = DBA.FACTCAB.CodProv )
  and ( DBA.TpoCbte.Cod_Empresa = DBA.FACTCAB.Cod_Empresa )
  and ( DBA.FACTCAB.Gravado = 'S' )
  and ( DBA.TpoCbte.Cod_Tp_Comp = DBA.FACTCAB.Cod_Tp_Comp )
  and (( DBA.TpoCbte.TP_DEF != 'NP') and ( DBA.TpoCbte.TP_DEF != 'RT'))
  and ( DBA.TpoCbte.documentoElectronico = 'N' )
  and ( DBA.Factcab.Cod_Con_Vta = DBA.Terminos.Cod_Con_Vta)
  and ( dba.FactCab.cod_empresa = '${empresa}' )
  and Date(dba.FactCab.FechaFact) >= Date ('${desde}')
  and Date(dba.FactCab.FechaFact) <= Date('${hasta}')
  ${sucursalFactcabSql}`
        },
        {
            key: 'compra_liquidacion',
            sql: `
SELECT COUNT(*) as cantidad
FROM (
  SELECT dba.liquidacion.nrocbte
  FROM DBA.EMPRESA, DBA.Despacho, DBA.Liquidacion, DBA.Proveed, DBA.TpoCbte, DBA.Aranceles
  WHERE ( DBA.Liquidacion.Cod_Empresa = DBA.Despacho.Cod_Empresa )
    and ( DBA.Liquidacion.Anho = DBA.Despacho.Anho )
    and ( DBA.Liquidacion.CodDespachante = DBA.Despacho.CodDespachante )
    and ( DBA.Liquidacion.NroDespacho = DBA.Despacho.NroDespacho )
    and ( DBA.Liquidacion.LibroIVA = 'S' )
    and ( DBA.EMPRESA.Cod_Empresa = DBA.Liquidacion.Cod_Empresa )
    and ( DBA.Proveed.Cod_Empresa = DBA.Liquidacion.Cod_Empresa )
    and ( DBA.Proveed.CodProv = DBA.Liquidacion.CodProv )
    and ( DBA.Aranceles.Cod_Empresa = DBA.Liquidacion.Cod_Empresa )
    and ( DBA.Aranceles.CodArancel = DBA.Liquidacion.CodArancel )
    and ( DBA.Aranceles.TpDef != 'I' )
    and ( DBA.TpoCbte.Cod_Empresa = DBA.Liquidacion.Cod_Empresa )
    and ( DBA.TpoCbte.Cod_Tp_Comp = DBA.Liquidacion.Cod_Tp_Comp )
    and (( DBA.TpoCbte.TP_DEF != 'NP') and ( DBA.TpoCbte.documentoElectronico = 'N') and ( DBA.TpoCbte.TP_DEF != 'RT'))
    and ( dba.Liquidacion.cod_empresa = '${empresa}' )
    and Date(dba.Liquidacion.FechaCbte) >= Date ('${desde}')
    and Date(dba.Liquidacion.FechaCbte) <= Date('${hasta}')
  GROUP BY dba.empresa.des_empresa, dba.liquidacion.codprov, dba.liquidacion.nrocbte, dba.liquidacion.timbrado,
           dba.liquidacion.fechacbte, dba.liquidacion.cod_tp_comp, dba.liquidacion.porc_iva, dba.despacho.factcambio,
           dba.despacho.codmoneda, DBA.Proveed.RazonSocial, DBA.Proveed.RUC, DBA.TpoCbte.Tp_def, DBA.Despacho.NroDespacho,
           DBA.despacho.ValorImponible, DBA.despacho.ValorImpDecreto, DBA.despacho.tipo_despacho
) base`
        },
        {
            key: 'compra_despacho',
            sql: `
SELECT COUNT(*) as cantidad
FROM DBA.EMPRESA, DBA.Despacho, DBA.Proveed, DBA.DespFact
WHERE DBA.Despacho.cod_empresa = DBA.Empresa.cod_empresa
  AND DBA.DespFact.cod_empresa = DBA.Proveed.cod_empresa
  AND DBA.DespFact.codprov = DBA.Proveed.codprov
  AND dba.despacho.cod_empresa = dba.despfact.cod_empresa
  AND dba.despacho.anho = dba.despfact.anho
  AND dba.despacho.coddespachante = dba.despfact.coddespachante
  AND dba.despacho.nrodespacho = dba.despfact.nrodespacho
  AND DBA.Proveed.TipoProv = 'PE'
  AND DBA.Despacho.tipo_despacho = 'I'
  AND ( dba.despacho.cod_empresa = '${empresa}' )
  AND Date(dba.Despacho.FechaDespacho) >= Date ('${desde}')
  AND Date(dba.Despacho.FechaDespacho) <= Date('${hasta}')`
        },
        {
            key: 'compra_liqtarj',
            sql: `
SELECT COUNT(*) as cantidad
FROM (
  SELECT dba.LiqTarjCab.NroLiq
  FROM dba.Empresa, dba.LiqTarjCab, dba.LiqTarjDet, dba.Proveed
  WHERE dba.Empresa.Cod_Empresa = dba.LiqTarjCab.Cod_Empresa
    AND dba.Proveed.Cod_Empresa = dba.LiqTarjCab.Cod_Empresa
    AND dba.Proveed.CodProv = dba.LiqTarjCab.CodProv
    AND dba.LiqTarjCab.Cod_Empresa = dba.LiqTarjDet.Cod_Empresa
    AND dba.LiqTarjCab.CodProv = dba.LiqTarjDet.CodProv
    AND dba.LiqTarjCab.NroLiq = dba.LiqTarjDet.NroLiq
    AND dba.LiqTarjCab.Timbrado = dba.LiqTarjDet.Timbrado
    AND ( dba.LiqTarjCab.Cod_Empresa = '${empresa}' )
    AND Date(dba.LiqTarjCab.FechaLiq) >= Date ('${desde}')
    AND Date(dba.LiqTarjCab.FechaLiq) <= Date('${hasta}')
  GROUP BY dba.Empresa.des_Empresa, dba.LiqTarjCab.CodProv, dba.LiqTarjCab.Nroliq,
           if (DBA.LiqTarjCab.Timbrado IS NULL ) then DBA.Proveed.Timbrado else DBA.LiqTarjCab.Timbrado endif,
           dba.LiqTarjCab.FechaLiq, dba.LiqTarjCab.FactCambio, dba.LiqTarjCab.CodMoneda,
           dba.Proveed.RazonSocial, dba.LiqTarjCab.CostoGasto, dba.Proveed.RUC
) base`
        },
        {
            key: 'compra_vtacab_nc',
            sql: `
SELECT COUNT(*) as cantidad
FROM DBA.EMPRESA, DBA.VTACAB, DBA.CLIENTES, DBA.TpoCbte
WHERE ( DBA.EMPRESA.Cod_Empresa = DBA.VTACAB.Cod_Empresa )
  and ( DBA.CLIENTES.Cod_Empresa = DBA.VTACAB.Cod_Empresa )
  and ( DBA.CLIENTES.Cod_Cliente = DBA.VTACAB.Cod_Cliente )
  and ( DBA.TpoCbte.Cod_Empresa = DBA.VTACAB.Cod_Empresa )
  and ( DBA.TpoCbte.Cod_Tp_Comp = DBA.VTACAB.Cod_Tp_Comp )
  and ( DBA.TpoCbte.documentoElectronico = 'N' )
  and ( DBA.VTACAB.Anulado = 'N')
  and ( DBA.TpoCbte.TP_DEF = 'NC' )
  and ( dba.VtaCab.Cod_Empresa = '${empresa}' )
  and Date(dba.VtaCab.Fha_Cbte) >= Date ('${desde}')
  and Date(dba.VtaCab.Fha_Cbte) <= Date('${hasta}')`
        }
    ];
}

function buildComprasSql(params, options) {
    var empresa = esc(params.empresa);
    var desde = esc(params.desde);
    var hasta = esc(params.hasta);
    var sucursalFactcabSql = params.sucursal ? (" AND ( dba.FactCab.Cod_Sucursal = '" + esc(params.sucursal) + "' ) ") : '';
    var usaIdTimb = !!(options && options.usaIdTimb);
    var joinVcExtra = usaIdTimb ? " and vc.id_timb = DBA.VTADET.id_timb_ref_NC" : "";
    var joinVtaDetExtra = usaIdTimb ? " and ( DBA.VTACAB.id_timb = DBA.VTADET.id_timb ) " : "";

    return `
SELECT *
FROM (
  SELECT
    dba.EMPRESA.Des_Empresa as des_empresa,
    dba.FACTCAB.CodProv as codprov,
    string(if ( DBA.FACTCAB.NroFactStr IS NULL OR Length ( Trim (DBA.FACTCAB.NroFactStr ) ) <= 0 OR dba.f_esNumero (DBA.FACTCAB.NroFactStr) = 'N' ) then DBA.FACTCAB.NroFact else DBA.FACTCAB.NroFactStr endif) as nrofact,
    if (DBA.FactCab.Timbrado IS NULL ) then DBA.Proveed.Timbrado else DBA.FactCab.Timbrado endif as timbradoprov,
    date(DBA.FACTCAB.FechaFact) as fechafact,
    DBA.FACTCAB.Cod_Tp_Comp as cod_tp_comp,
    (DBA.FACTCAB.TotalGrav * DBA.FACTCAB.FactCambio) as total_grav,
    (DBA.FACTCAB.IVA * DBA.FACTCAB.FactCambio) as total_iva,
    DBA.FACTCAB.FactCambio as factcambio,
    DBA.FACTCAB.CodMoneda as codmoneda,
    (DBA.FACTCAB.TotalExen * DBA.FACTCAB.FactCambio) as total_exenta,
    DBA.FACTCAB.IvaIncluido as iva_incluido,
    DBA.FACTCAB.CostoGasto as costo_gasto,
    if (DBA.FactCab.RazonSocial IS NULL ) then DBA.Proveed.RazonSocial else DBA.FactCab.RazonSocial endif as razonsocial,
    if (DBA.FactCab.RUC IS NULL ) then DBA.Proveed.RUC else DBA.FactCab.RUC endif as ruc,
    DBA.TpoCbte.Tp_def as tp_def,
    'F' AS tipo,
    0 AS despacho,
    0 AS valor_imponible,
    0 AS valor_imp_decreto,
    DBA.FactCab.TipoIVA as tipoiva,
    DBA.FactCab.TipoCompra as tipocompra,
    (DBA.FACTCAB.Total_IVA_5 * DBA.FACTCAB.FactCambio) as tot_iva_5,
    (DBA.FACTCAB.Total_IVA_10 * DBA.FACTCAB.FactCambio) as tot_iva_10,
    (DBA.FACTCAB.Gravado5 * DBA.FACTCAB.FactCambio) as total_grav_5,
    (DBA.FACTCAB.Gravado10 * DBA.FACTCAB.FactCambio) as total_grav_10,
    dba.factcab.cod_con_vta as cod_con_vta,
    dba.terminos.des_con_vta as des_con_vta,
    dba.terminos.cuota as cuota,
    '0' as comp_nro_timbrado,
    null as nrodespacholong,
    null as nro_fact_aso,
    null as nro_timb_aso,
    dba.tpocbte.tpomvto as tpomvto,
    dba.Proveed.TipoProv as tipoprov,
    null as cliente_ruc_ref,
    'FACTCAB' as origen
  FROM DBA.EMPRESA, DBA.FACTCAB, DBA.Proveed, DBA.TpoCbte, DBA.Terminos
  WHERE ( DBA.EMPRESA.Cod_Empresa = DBA.FACTCAB.Cod_Empresa )
    and ( DBA.Proveed.Cod_Empresa = DBA.FACTCAB.Cod_Empresa )
    and ( DBA.Proveed.CodProv = DBA.FACTCAB.CodProv )
    and ( DBA.TpoCbte.Cod_Empresa = DBA.FACTCAB.Cod_Empresa )
    and ( DBA.FACTCAB.Gravado = 'S' )
    and ( DBA.TpoCbte.Cod_Tp_Comp = DBA.FACTCAB.Cod_Tp_Comp )
    and (( DBA.TpoCbte.TP_DEF != 'NP') and ( DBA.TpoCbte.TP_DEF != 'RT'))
    and ( DBA.TpoCbte.documentoElectronico = 'N' )
    and ( DBA.Factcab.Cod_Con_Vta = DBA.Terminos.Cod_Con_Vta)
    and ( dba.FactCab.cod_empresa = '${empresa}' )
    and Date(dba.FactCab.FechaFact) >= Date ('${desde}')
    and Date(dba.FactCab.FechaFact) <= Date('${hasta}')
    ${sucursalFactcabSql}

  UNION

  SELECT
    dba.empresa.des_empresa as des_empresa,
    dba.liquidacion.codprov as codprov,
    STRING (dba.liquidacion.nrocbte) as nrofact,
    dba.liquidacion.Timbrado as timbradoprov,
    date(dba.liquidacion.fechacbte) as fechafact,
    dba.liquidacion.cod_tp_comp as cod_tp_comp,
    SUM (dba.liquidacion.gravado) as total_grav,
    SUM (dba.liquidacion.iva) as total_iva,
    dba.despacho.factcambio as factcambio,
    dba.despacho.codmoneda as codmoneda,
    SUM (dba.liquidacion.exento) as total_exenta,
    'D' as iva_incluido,
    'C' as costo_gasto,
    DBA.Proveed.RazonSocial as razonsocial,
    DBA.Proveed.RUC as ruc,
    DBA.TpoCbte.Tp_def as tp_def,
    DBA.despacho.tipo_despacho as tipo,
    DBA.Despacho.NroDespacho as despacho,
    DBA.despacho.ValorImponible as valor_imponible,
    DBA.despacho.ValorImpDecreto as valor_imp_decreto,
    'D' as tipoiva,
    DBA.despacho.tipo_despacho as tipocompra,
    if (DBA.Liquidacion.Porc_Iva = 5) then SUM(dba.liquidacion.iva) else 0 endif as tot_iva_5,
    if (DBA.Liquidacion.Porc_Iva = 10) then SUM(dba.liquidacion.iva) else 0 endif as tot_iva_10,
    if (DBA.Liquidacion.Porc_Iva = 5) then SUM(dba.liquidacion.gravado) else 0 endif as total_grav_5,
    if (DBA.Liquidacion.Porc_Iva = 10) then SUM(dba.liquidacion.gravado) else 0 endif as total_grav_10,
    null as cod_con_vta,
    null as des_con_vta,
    0 as cuota,
    '0' as comp_nro_timbrado,
    null as nrodespacholong,
    null as nro_fact_aso,
    null as nro_timb_aso,
    null as tpomvto,
    dba.Proveed.TipoProv as tipoprov,
    null as cliente_ruc_ref,
    'LIQUIDACION' as origen
  FROM DBA.EMPRESA, DBA.Despacho, DBA.Liquidacion, DBA.Proveed, DBA.TpoCbte, DBA.Aranceles
  WHERE ( DBA.Liquidacion.Cod_Empresa = DBA.Despacho.Cod_Empresa )
    and ( DBA.Liquidacion.Anho = DBA.Despacho.Anho )
    and ( DBA.Liquidacion.CodDespachante = DBA.Despacho.CodDespachante )
    and ( DBA.Liquidacion.NroDespacho = DBA.Despacho.NroDespacho )
    and ( DBA.Liquidacion.LibroIVA = 'S' )
    and ( DBA.EMPRESA.Cod_Empresa = DBA.Liquidacion.Cod_Empresa )
    and ( DBA.Proveed.Cod_Empresa = DBA.Liquidacion.Cod_Empresa )
    and ( DBA.Proveed.CodProv = DBA.Liquidacion.CodProv )
    and ( DBA.Aranceles.Cod_Empresa = DBA.Liquidacion.Cod_Empresa )
    and ( DBA.Aranceles.CodArancel = DBA.Liquidacion.CodArancel )
    and ( DBA.Aranceles.TpDef != 'I' )
    and ( DBA.TpoCbte.Cod_Empresa = DBA.Liquidacion.Cod_Empresa )
    and ( DBA.TpoCbte.Cod_Tp_Comp = DBA.Liquidacion.Cod_Tp_Comp )
    and (( DBA.TpoCbte.TP_DEF != 'NP') and ( DBA.TpoCbte.documentoElectronico = 'N') and ( DBA.TpoCbte.TP_DEF != 'RT'))
    and ( dba.Liquidacion.cod_empresa = '${empresa}' )
    and Date(dba.Liquidacion.FechaCbte) >= Date ('${desde}')
    and Date(dba.Liquidacion.FechaCbte) <= Date('${hasta}')
  GROUP BY dba.empresa.des_empresa, dba.liquidacion.codprov, dba.liquidacion.nrocbte, dba.liquidacion.timbrado,
           dba.liquidacion.fechacbte, dba.liquidacion.cod_tp_comp, dba.despacho.factcambio,
           dba.despacho.codmoneda, DBA.Proveed.RazonSocial, DBA.Proveed.RUC, DBA.Proveed.TipoProv, DBA.TpoCbte.Tp_def, DBA.Despacho.NroDespacho,
           DBA.despacho.ValorImponible, DBA.despacho.ValorImpDecreto, DBA.Aranceles.TpDef, DBA.Liquidacion.Porc_Iva, DBA.despacho.tipo_despacho

  UNION

  SELECT
    dba.empresa.des_empresa as des_empresa,
    dba.despacho.coddespachante as codprov,
    STRING(dba.despacho.nrodespacho) as nrofact,
    '0' as timbradoprov,
    date(dba.despacho.fechadespacho) as fechafact,
    'DP' as cod_tp_comp,
    if dba.despacho.iva_despacho > 0 then (dba.despacho.valorimponible + dba.despacho.valorimponible_otros) else 0 endif as total_grav,
    dba.despacho.iva_despacho as total_iva,
    dba.despacho.factcambio as factcambio,
    dba.despacho.codmoneda as codmoneda,
    if dba.despacho.iva_despacho = 0 then (dba.despacho.valorimponible + dba.despacho.valorimponible_otros) else 0 endif as total_exenta,
    'D' as iva_incluido,
    'C' as costo_gasto,
    DBA.Proveed.RazonSocial as razonsocial,
    DBA.Proveed.nroidentificacion as ruc,
    'DP' as tp_def,
    'D' as tipo,
    DBA.despacho.nrodespacho as despacho,
    DBA.despacho.ValorImponible as valor_imponible,
    0 as valor_imp_decreto,
    'D' as tipoiva,
    'I' as tipocompra,
    if dba.despacho.TasaVI = 5 then dba.despacho.iva_despacho else 0 endif as tot_iva_5,
    if dba.despacho.TasaVI = 10 then dba.despacho.iva_despacho else 0 endif as tot_iva_10,
    if (dba.despacho.iva_despacho > 0 and dba.despacho.TasaVI = 5) then (dba.despacho.valorimponible + dba.despacho.valorimponible_otros) else 0 endif as total_grav_5,
    if (dba.despacho.iva_despacho > 0 and dba.despacho.TasaVI = 10) then (dba.despacho.valorimponible + dba.despacho.valorimponible_otros) else 0 endif as total_grav_10,
    null as cod_con_vta,
    null as des_con_vta,
    0 as cuota,
    '0' as comp_nro_timbrado,
    trim(dba.despacho.nrodespacholong) as nrodespacholong,
    null as nro_fact_aso,
    null as nro_timb_aso,
    null as tpomvto,
    DBA.Proveed.TipoProv as tipoprov,
    null as cliente_ruc_ref,
    'DESPACHO' as origen
  FROM DBA.EMPRESA, DBA.Despacho, DBA.Proveed, DBA.DespFact
  WHERE DBA.Despacho.cod_empresa = DBA.Empresa.cod_empresa
    AND DBA.DespFact.cod_empresa = DBA.Proveed.cod_empresa
    AND DBA.DespFact.codprov = DBA.Proveed.codprov
    AND dba.despacho.cod_empresa = dba.despfact.cod_empresa
    AND dba.despacho.anho = dba.despfact.anho
    AND dba.despacho.coddespachante = dba.despfact.coddespachante
    AND dba.despacho.nrodespacho = dba.despfact.nrodespacho
    AND DBA.Proveed.TipoProv = 'PE'
    AND DBA.Despacho.tipo_despacho = 'I'
    AND ( dba.despacho.cod_empresa = '${empresa}' )
    AND Date(dba.Despacho.FechaDespacho) >= Date ('${desde}')
    AND Date(dba.Despacho.FechaDespacho) <= Date('${hasta}')

  UNION

  SELECT
    dba.empresa.des_empresa as des_empresa,
    dba.LiqTarjCab.CodProv as codprov,
    string(dba.LiqTarjCab.NroLiq) as nrofact,
    if (DBA.LiqTarjCab.Timbrado IS NULL ) then DBA.Proveed.Timbrado else DBA.LiqTarjCab.Timbrado endif as timbradoprov,
    date(dba.LiqTarjCab.FechaLiq) as fechafact,
    'LQ' as cod_tp_comp,
    SUM(dba.LiqTarjDet.Descuento) as total_grav,
    SUM(dba.LiqTarjDet.IVA) as total_iva,
    dba.LiqTarjCab.FactCambio as factcambio,
    dba.LiqTarjCab.CodMoneda as codmoneda,
    0 as total_exenta,
    'D' as iva_incluido,
    dba.LiqTarjCab.CostoGasto as costo_gasto,
    dba.Proveed.RazonSocial as razonsocial,
    dba.Proveed.RUC as ruc,
    'LQ' as tp_def,
    'L' as tipo,
    0 as despacho,
    0 as valor_imponible,
    0 as valor_imp_decreto,
    'D' as tipoiva,
    'L' as tipocompra,
    0 as tot_iva_5,
    SUM(dba.LiqTarjDet.IVA) as tot_iva_10,
    0 as total_grav_5,
    SUM(dba.LiqTarjDet.Descuento) as total_grav_10,
    null as cod_con_vta,
    null as des_con_vta,
    0 as cuota,
    '0' as comp_nro_timbrado,
    null as nrodespacholong,
    null as nro_fact_aso,
    null as nro_timb_aso,
    null as tpomvto,
    dba.Proveed.TipoProv as tipoprov,
    null as cliente_ruc_ref,
    'LIQTARJ' as origen
  FROM dba.Empresa, dba.LiqTarjCab, dba.LiqTarjDet, dba.Proveed
  WHERE dba.Empresa.Cod_Empresa = dba.LiqTarjCab.Cod_Empresa
    AND dba.Proveed.Cod_Empresa = dba.LiqTarjCab.Cod_Empresa
    AND dba.Proveed.CodProv = dba.LiqTarjCab.CodProv
    AND dba.LiqTarjCab.Cod_Empresa = dba.LiqTarjDet.Cod_Empresa
    AND dba.LiqTarjCab.CodProv = dba.LiqTarjDet.CodProv
    AND dba.LiqTarjCab.NroLiq = dba.LiqTarjDet.NroLiq
    AND dba.LiqTarjCab.Timbrado = dba.LiqTarjDet.Timbrado
    AND ( dba.LiqTarjCab.Cod_Empresa = '${empresa}' )
    AND Date(dba.LiqTarjCab.FechaLiq) >= Date ('${desde}')
    AND Date(dba.LiqTarjCab.FechaLiq) <= Date('${hasta}')
  GROUP BY dba.Empresa.des_Empresa, dba.LiqTarjCab.CodProv, dba.LiqTarjCab.Nroliq,
           if (DBA.LiqTarjCab.Timbrado IS NULL ) then DBA.Proveed.Timbrado else DBA.LiqTarjCab.Timbrado endif,
           dba.LiqTarjCab.FechaLiq, dba.LiqTarjCab.FactCambio, dba.LiqTarjCab.CodMoneda,
           dba.Proveed.RazonSocial, dba.LiqTarjCab.CostoGasto, dba.Proveed.RUC, dba.Proveed.TipoProv

  UNION

  SELECT distinct
    DBA.EMPRESA.Des_Empresa as des_empresa,
    DBA.VTACAB.Cod_Cliente as codprov,
    STRING(dba.vtacab.cod_establecimiento + '-' + dba.vtacab.cod_ptoexpedicion + '-' + STRING(DBA.VTACAB.comp_numero)) as nrofact,
    string(DBA.VTACAB.nrotimb) as timbradoprov,
    date(DBA.VTACAB.fha_cbte) as fechafact,
    DBA.VTACAB.Cod_Tp_Comp as cod_tp_comp,
    (dba.vtacab.to_gravado - ( dba.vtacab.totaldctograv_d + dba.vtacab.totaldctograv + dba.vtacab.tot2dodctograv )) as total_grav,
    dba.vtacab.total_iva as total_iva,
    DBA.VTACAB.Fact_Cambio as factcambio,
    DBA.VTACAB.CodMoneda as codmoneda,
    ( dba.vtacab.to_exento - ( dba.vtacab.totaldctoexen_d + dba.vtacab.totaldctoexen + dba.vtacab.tot2dodctoexen )) as total_exenta,
    if ( DBA.VTACAB.Tipo_IVA = 'I' ) then 'S' else 'N' endif as iva_incluido,
    'G' as costo_gasto,
    dba.vtacab.razon_social as razonsocial,
    if (DBA.VTACAB.RUC = '44444401-7' ) or (DBA.VTACAB.RUC = '88888801-5' ) then
      IF (UPPER(DBA.CLIENTES.CEDULA) = 'X' ) then 'X' ELSE UPPER(DBA.CLIENTES.CEDULA) ENDIF
    else
      DBA.VTACAB.RUC
    endif as ruc,
    DBA.TpoCbte.Tp_def as tp_def,
    'F' AS tipo,
    0 AS despacho,
    0 AS valor_imponible,
    0 AS valor_imp_decreto,
    DBA.VTACAB.Tipo_IVA as tipoiva,
    'L' as tipocompra,
    dba.vtacab.total_iva_5 as tot_iva_5,
    dba.vtacab.total_iva_10 as tot_iva_10,
    ( dba.vtacab.to_gravado_5 - ( dba.vtacab.totaldctograv_d_5 + dba.vtacab.totaldctograv_5 + dba.vtacab.tot2dodctograv_5 ) - if ( DBA.VTACAB.Tipo_IVA = 'D' ) then 0 else dba.vtacab.total_iva_5 endif ) as total_grav_5,
    ( dba.vtacab.to_gravado_10 - ( dba.vtacab.totaldctograv_d_10 + dba.vtacab.totaldctograv_10 + dba.vtacab.tot2dodctograv_10 ) - if ( DBA.VTACAB.Tipo_IVA = 'D' ) then 0 else dba.vtacab.total_iva_10 endif ) as total_grav_10,
    null as cod_con_vta,
    null as des_con_vta,
    0 as cuota,
    trim(dba.vtacab.cod_establecimiento) + '-' + trim(dba.vtacab.cod_ptoexpedicion) + '-' + STRING(DBA.VTACAB.comp_nro_timb) as comp_nro_timbrado,
    null as nrodespacholong,
    vc.cod_establecimiento + '-' + vc.cod_ptoexpedicion + '-' + replicate('0',7-length(string(vc.comp_numero))) + string(vc.comp_numero) as nro_fact_aso,
    vc.nrotimb as nro_timb_aso,
    '' as tpomvto,
    'PL' as tipoprov,
    DBA.CLIENTES.RUC as cliente_ruc_ref,
    'VTACAB_NC' as origen
  FROM DBA.EMPRESA, DBA.VTACAB, DBA.VTADET left join DBA.vtacab vc on vc.cod_empresa = DBA.VTADET.cod_Empresa and vc.cod_tp_comp = DBA.VTADET.tp_ref_nc and vc.comp_numero = DBA.VTADET.nro_ref_NC${joinVcExtra},
       DBA.CLIENTES, DBA.TpoCbte
  WHERE ( DBA.EMPRESA.Cod_Empresa = DBA.VTACAB.Cod_Empresa )
    and ( DBA.CLIENTES.Cod_Empresa = DBA.VTACAB.Cod_Empresa )
    and ( DBA.CLIENTES.Cod_Cliente = DBA.VTACAB.Cod_Cliente )
    and ( DBA.TpoCbte.Cod_Empresa = DBA.VTACAB.Cod_Empresa )
    and ( DBA.TpoCbte.Cod_Tp_Comp = DBA.VTACAB.Cod_Tp_Comp )
    and ( DBA.VTACAB.Cod_Empresa = DBA.VTADET.Cod_Empresa )
    and ( DBA.VTACAB.Cod_Tp_Comp = DBA.VTADET.Cod_Tp_Comp )
    and ( DBA.VTACAB.comp_numero = DBA.VTADET.comp_numero )
    ${joinVtaDetExtra}
    and ( DBA.TpoCbte.documentoElectronico = 'N' )
    and ( DBA.VTACAB.Anulado = 'N')
    and ( DBA.TpoCbte.TP_DEF = 'NC' )
    and ( dba.VtaCab.Cod_Empresa = '${empresa}' )
    and Date(dba.VtaCab.Fha_Cbte) >= Date ('${desde}')
    and Date(dba.VtaCab.Fha_Cbte) <= Date('${hasta}')
) base
ORDER BY base.timbradoprov, base.nrofact`;
}

function execRows(sql, cb) {
    conn.exec(sql, function (err, rows) {
        if (err) return cb(err);
        cb(null, rows || []);
    });
}

function normalizeTipo(params) {
    return String(params.tipoInformacion || 'VENTA').trim().toUpperCase() === 'COMPRA' ? 'COMPRA' : 'VENTA';
}

function padLeft(value, size, fill) {
    var text = String(value === undefined || value === null ? '' : value);
    var ch = fill || '0';
    while (text.length < size) text = ch + text;
    return text;
}

function onlyDigits(value) {
    return String(value === undefined || value === null ? '' : value).replace(/\D/g, '');
}

function toNumber(value) {
    var n = Number(value || 0);
    return isFinite(n) ? n : 0;
}

function toText(value) {
    return String(value === undefined || value === null ? '' : value).trim();
}

function absNumber(value) {
    return Math.abs(toNumber(value));
}

function numberFromPrimaryOrFallback(primary, fallback) {
    if (primary === null || primary === undefined || primary === '') {
        return toNumber(fallback);
    }
    return toNumber(primary);
}

function compraMontos(row) {
    var totalIva5 = absNumber(numberFromPrimaryOrFallback(row.tot_iva_5, row.total_iva_5));
    var totalIva10 = absNumber(numberFromPrimaryOrFallback(row.tot_iva_10, row.total_iva_10 || row.total_iva));
    var grav5Base = (row.total_grav_5 === null || row.total_grav_5 === undefined || row.total_grav_5 === '')
        ? (totalIva5 ? Math.round((totalIva5 * 100) / 5) : 0)
        : absNumber(row.total_grav_5);
    var grav10Base = (row.total_grav_10 === null || row.total_grav_10 === undefined || row.total_grav_10 === '')
        ? (totalIva10 ? Math.round((totalIva10 * 100) / 10) : 0)
        : absNumber(row.total_grav_10);
    var totalGrav5 = grav5Base + totalIva5;
    var totalGrav10 = grav10Base + totalIva10;
    var totalExenta = absNumber(numberFromPrimaryOrFallback(row.total_exenta, row.to_exento));
    return {
        totalIva5: totalIva5,
        totalIva10: totalIva10,
        totalGrav5: totalGrav5,
        totalGrav10: totalGrav10,
        totalExenta: totalExenta,
        total: totalGrav5 + totalGrav10 + totalExenta
    };
}

function compraTotalFacturaBase(row) {
    return compraMontos(row).total;
}

function splitRuc(value) {
    var text = toText(value);
    if (!text) return { base: '1234567890', dv: '0', raw: '' };
    var pos = text.lastIndexOf('-');
    if (pos >= 0) {
        return {
            base: text.slice(0, pos).replace(/-/g, '') || '1234567890',
            dv: text.slice(pos + 1) || '0',
            raw: text
        };
    }
    return { base: text.replace(/-/g, '') || '1234567890', dv: '0', raw: text };
}

function formatDateDDMMYYYY(value) {
    if (!value) return '';
    var text = String(value);
    if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
        return text.slice(8, 10) + '/' + text.slice(5, 7) + '/' + text.slice(0, 4);
    }
    return text;
}

function formatFacturaTimbrada(value) {
    var text = toText(value);
    if (!text) return '000-000-0000000';
    if (text.indexOf('-') >= 0) return text;
    var digits = onlyDigits(text);
    if (!digits) return '000-000-0000000';
    var numero = padLeft(digits.slice(-7), 7, '0');
    var prefijo = padLeft(digits.slice(0, -7), 6, '0');
    return prefijo.slice(0, 3) + '-' + prefijo.slice(3, 6) + '-' + numero;
}

function formatCompraFacturaTimbrada(value, tpomvto) {
    var text = toText(value).replace(/\.0+$/, '');
    if (!text) return '000-000-0000000';
    if (toText(tpomvto).toUpperCase() === 'TR') return text;
    if (text.indexOf('-') >= 0) return text;
    var digits = onlyDigits(text);
    if (!digits) return '000-000-0000000';
    var base = '';
    if (digits.length < 12) {
        var restShort = digits.slice(4);
        base = '00' + digits.slice(0, 4) + padLeft(restShort, 7, '0');
    } else if (digits.length === 12) {
        var restMedium = digits.slice(5);
        base = '0' + digits.slice(0, 5) + padLeft(restMedium, 7, '0');
    } else {
        var restLong = digits.slice(5);
        base = digits.slice(0, 5) + padLeft(restLong, 7, '0');
    }
    base = onlyDigits(base);
    return base.slice(0, 3) + '-' + base.slice(3, 6) + '-' + base.slice(6, 13);
}

function buildFacturaTimbradaFromParts(est, pto, numero) {
    var codEst = padLeft(onlyDigits(est || '0').slice(-3), 3, '0');
    var codPto = padLeft(onlyDigits(pto || '0').slice(-3), 3, '0');
    var nro = padLeft(onlyDigits(numero || '0').slice(-7), 7, '0');
    return codEst + '-' + codPto + '-' + nro;
}

function getPeriodoInf(params) {
    var periodo = toText(params.periodo);
    var mes = padLeft(toText(params.mes || params.mesd || ''), 2, '0');
    return mes + periodo;
}

function runPreview(params, cb) {
    var tipo = normalizeTipo(params);
    if (tipo === 'COMPRA') {
        var periodo = toText(params.periodo) || toText(params.desde).slice(0, 4);
        var sqlControl = "SELECT usaIdTimb FROM dba.control WHERE cod_empresa = '" + esc(params.empresa) + "' AND periodo = '" + esc(periodo) + "'";
        return execRows(sqlControl, function (controlErr, controlRows) {
            if (controlErr) return cb(controlErr);
            var controlRow = (controlRows || [])[0] || {};
            var usaIdTimb = toText(controlRow.usaIdTimb || controlRow.usaidtimb).toUpperCase() === 'S';
            return execRows(buildComprasSql(params, { usaIdTimb: usaIdTimb }), function (rowsErr, rows) {
                if (rowsErr) return cb(rowsErr);
                return loadCompraRegistroExportados(params, function (exportErr, exportedSet) {
                    if (exportErr) return cb(exportErr);
                    var filteredRows = sortCompraRows(filterCompraRowsByRegistroExport(rows || [], exportedSet || {}, params.descargarRegistrosExportados));
                    if (String(params.debug || '').toLowerCase() === 'true') {
                        try {
                            console.log('[RG90 DEBUG COMPRA FILTER]', JSON.stringify(
                                buildCompraExportFilterDebug(rows || [], filteredRows || [])
                            ));
                        } catch (e) {}
                    }
                    cb(null, filteredRows);
                });
            });
        });
    }
    execRows("SELECT COUNT(*) as cantidad FROM DBA.timbradoCab", function (countErr, countRows) {
        if (countErr) return cb(countErr);
        var countRow = countRows[0] || {};
        var usaTimbrado = toNumber(countRow.cantidad || countRow.CANTIDAD || countRow['COUNT(*)']) > 0;
        var empresa = String(params.empresa || '').trim().toUpperCase();
        var sql = usaTimbrado
            ? buildVentasSqlTimbrado(params)
            : buildVentasSql(params);

        if (usaTimbrado && (empresa === 'PA' || empresa === 'LA')) {
            try {
                console.log('[RG90] Empresa con variante APRO no implementada aun, usando timbrado base:', empresa);
            } catch (e) {}
        }

        execRows(sql, cb);
    });
}

function runDiagnosticsQueries(queries, cb) {
    var result = {};
    var index = 0;

    function next() {
        if (index >= queries.length) {
            return cb(null, result);
        }
        var item = queries[index++];
        execRows(item.sql, function (err, rows) {
            if (err) return cb(err);
            var row = rows[0] || {};
            result[item.key] = toNumber(row.cantidad || row.CANTIDAD || row['COUNT(*)']);
            next();
        });
    }

    next();
}

function compraRegistroKey(codProv, nroFact, fechaFact, codTpComp, tpDef, tipo) {
    return [
        toText(codProv),
        String(toNumber(nroFact)),
        toText(fechaFact).slice(0, 10),
        toText(codTpComp).toUpperCase(),
        toText(tpDef).toUpperCase(),
        toText(tipo).toUpperCase()
    ].join('|');
}

function compraRegistroKeyFromRow(row) {
    return compraRegistroKey(
        row.codprov,
        numericFacturaValue(row.nrofact),
        row.fechafact,
        row.cod_tp_comp,
        row.tp_def,
        row.tipo
    );
}

function loadCompraRegistroExportados(params, cb) {
    var empresa = esc(params.empresa);
    var desde = esc(params.desde);
    var hasta = esc(params.hasta);
    var sql = `
SELECT codprov, nrofact, fechafact, cod_tp_comp, tp_def, tipo
FROM dba.registro_export_rg90
WHERE cod_empresa = '${empresa}'
  AND date(fechafact) >= date('${desde}')
  AND date(fechafact) <= date('${hasta}')`;
    execRows(sql, function (err, rows) {
        if (err) return cb(err);
        var set = Object.create(null);
        (rows || []).forEach(function (row) {
            set[compraRegistroKey(row.codprov, row.nrofact, row.fechafact, row.cod_tp_comp, row.tp_def, row.tipo)] = true;
        });
        cb(null, set);
    });
}

function filterCompraRowsByRegistroExport(rows, exportedSet, descargarExportados) {
    var wantExported = String(descargarExportados || '').toLowerCase() === 'true';
    return (rows || []).filter(function (row) {
        var exists = !!exportedSet[compraRegistroKeyFromRow(row)];
        if (wantExported && isCompraVentaNotaCredito(row)) return true;
        return wantExported ? exists : !exists;
    });
}

function buildCompraRowsDebug(rows) {
    var result = {
        rows: (rows || []).length,
        visible_total_base: 0,
        visible_total_split: 0,
        exento_total: 0,
        rows_total_exenta_null: 0,
        rows_total_grav_5_null: 0,
        rows_total_grav_10_null: 0,
        rows_tot_iva_5_null: 0,
        rows_tot_iva_10_null: 0,
        origenes: {},
        factcab_grupos: {}
    };
    (rows || []).forEach(function (row) {
        var origen = toText(row.origen) || 'SIN_ORIGEN';
        var montos = compraMontos(row);
        var totalBase = compraTotalFacturaBase(row);
        var exenta = absNumber(numberFromPrimaryOrFallback(row.total_exenta, row.to_exento));
        if (!result.origenes[origen]) {
            result.origenes[origen] = {
                rows: 0,
                total_base: 0,
                total_split: 0,
                exenta: 0,
                total_exenta_null: 0
            };
        }
        result.rows += 0;
        result.visible_total_base += totalBase;
        result.visible_total_split += montos.total;
        result.exento_total += exenta;
        result.origenes[origen].rows += 1;
        result.origenes[origen].total_base += totalBase;
        result.origenes[origen].total_split += montos.total;
        result.origenes[origen].exenta += exenta;
        if (row.total_exenta === null || row.total_exenta === undefined || row.total_exenta === '') {
            result.rows_total_exenta_null += 1;
            result.origenes[origen].total_exenta_null += 1;
        }
        if (row.total_grav_5 === null || row.total_grav_5 === undefined || row.total_grav_5 === '') result.rows_total_grav_5_null += 1;
        if (row.total_grav_10 === null || row.total_grav_10 === undefined || row.total_grav_10 === '') result.rows_total_grav_10_null += 1;
        if (row.tot_iva_5 === null || row.tot_iva_5 === undefined || row.tot_iva_5 === '') result.rows_tot_iva_5_null += 1;
        if (row.tot_iva_10 === null || row.tot_iva_10 === undefined || row.tot_iva_10 === '') result.rows_tot_iva_10_null += 1;

        if (origen === 'FACTCAB') {
            var factcabKey = [
                toText(row.tp_def).toUpperCase() || 'SIN_TPDEF',
                toText(row.tipoiva).toUpperCase() || 'SIN_TIPOIVA',
                toText(row.tipocompra).toUpperCase() || 'SIN_TIPOCOMPRA',
                toText(row.cod_tp_comp).toUpperCase() || 'SIN_CODTP'
            ].join('|');
            if (!result.factcab_grupos[factcabKey]) {
                result.factcab_grupos[factcabKey] = {
                    rows: 0,
                    total_base: 0,
                    total_split: 0,
                    exenta: 0,
                    grav: 0,
                    iva: 0
                };
            }
            result.factcab_grupos[factcabKey].rows += 1;
            result.factcab_grupos[factcabKey].total_base += totalBase;
            result.factcab_grupos[factcabKey].total_split += montos.total;
            result.factcab_grupos[factcabKey].exenta += exenta;
            result.factcab_grupos[factcabKey].grav += absNumber(row.total_grav);
            result.factcab_grupos[factcabKey].iva += absNumber(row.total_iva);
        }
    });
    return result;
}

function buildCompraExportFilterDebug(baseRows, filteredRows) {
    var result = {
        base_rows: (baseRows || []).length,
        filtered_rows: (filteredRows || []).length,
        removed_rows: 0,
        removed_total_base: 0,
        removed_origenes: {}
    };
    var filteredMap = Object.create(null);
    (filteredRows || []).forEach(function (row) {
        filteredMap[compraRegistroKeyFromRow(row)] = (filteredMap[compraRegistroKeyFromRow(row)] || 0) + 1;
    });
    (baseRows || []).forEach(function (row) {
        var key = compraRegistroKeyFromRow(row);
        if (filteredMap[key]) {
            filteredMap[key] -= 1;
            return;
        }
        var origen = toText(row.origen) || 'SIN_ORIGEN';
        var totalBase = compraTotalFacturaBase(row);
        result.removed_rows += 1;
        result.removed_total_base += totalBase;
        if (!result.removed_origenes[origen]) {
            result.removed_origenes[origen] = { rows: 0, total_base: 0 };
        }
        result.removed_origenes[origen].rows += 1;
        result.removed_origenes[origen].total_base += totalBase;
    });
    return result;
}

function loadVentasNotaCreditoTotal(params, cb) {
    var empresa = esc(params.empresa);
    var desde = esc(params.desde);
    var hasta = esc(params.hasta);
    var sql = `
SELECT
  coalesce(SUM(dba.vtacab.total_venta), 0) as total_nc
FROM dba.vtacab, dba.tpocbte
WHERE ( dba.vtacab.cod_empresa = dba.tpocbte.cod_empresa )
  AND ( dba.vtacab.cod_tp_comp = dba.tpocbte.cod_tp_comp )
  AND ( dba.vtacab.cod_empresa = '${empresa}' )
  AND ( dba.vtacab.anulado = 'N' )
  AND ( dba.tpocbte.tp_def = 'NC' )
  AND ( DATE(dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )`;
    execRows(sql, function (err, rows) {
        if (err) return cb(err);
        var row = rows[0] || {};
        cb(null, toNumber(row.total_nc || row.TOTAL_NC));
    });
}

function loadVentasVisibleTotal(params, cb) {
    var empresa = esc(params.empresa);
    var desde = esc(params.desde);
    var hasta = esc(params.hasta);
    var sql = `
SELECT
  coalesce(SUM(dba.vtacab.total_venta), 0) as total_visible
FROM dba.vtacab, dba.tpocbte
WHERE ( dba.vtacab.cod_empresa = dba.tpocbte.cod_empresa )
  AND ( dba.vtacab.cod_tp_comp = dba.tpocbte.cod_tp_comp )
  AND ( dba.vtacab.cod_empresa = '${empresa}' )
  AND ( dba.vtacab.anulado = 'N' )
  AND ( dba.tpocbte.tp_def != 'NC' )
  AND ( DATE(dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )`;
    execRows(sql, function (err, rows) {
        if (err) return cb(err);
        var row = rows[0] || {};
        cb(null, toNumber(row.total_visible || row.TOTAL_VISIBLE));
    });
}

function loadVentasExentoTotal(params, cb) {
    var empresa = esc(params.empresa);
    var desde = esc(params.desde);
    var hasta = esc(params.hasta);
    var sql = `
SELECT
  coalesce(SUM(dba.vtacab.to_exento), 0) as exento_total
FROM dba.vtacab, dba.tpocbte
WHERE ( dba.vtacab.cod_empresa = dba.tpocbte.cod_empresa )
  AND ( dba.vtacab.cod_tp_comp = dba.tpocbte.cod_tp_comp )
  AND ( dba.vtacab.cod_empresa = '${empresa}' )
  AND ( dba.vtacab.anulado = 'N' )
  AND ( dba.tpocbte.tp_def != 'NC' )
  AND ( DATE(dba.vtacab.fha_cbte) BETWEEN DATE('${desde}') AND DATE('${hasta}') )`;
    execRows(sql, function (err, rows) {
        if (err) return cb(err);
        var row = rows[0] || {};
        cb(null, toNumber(row.exento_total || row.EXENTO_TOTAL));
    });
}

function loadEmpresaInfo(empresa, cb) {
    var sql = "SELECT ruc, des_empresa, RepresentanteLegal, RUCRepresentanteLegal, Importador, " +
        "coalesce(imputa_ire, 'N') as imputa_ire, coalesce(imputa_irp, 'N') as imputa_irp " +
        "FROM dba.empresa WHERE cod_empresa = '" + esc(empresa) + "'";
    execRows(sql, function (err, rows) {
        if (err) return cb(err);
        cb(null, rows[0] || {});
    });
}

function validateEmpresaInfoForRg90(empresaInfo) {
    var representante = toText(empresaInfo && empresaInfo.RepresentanteLegal || empresaInfo && empresaInfo.representantelegal);
    var rucRepresentante = toText(empresaInfo && empresaInfo.RUCRepresentanteLegal || empresaInfo && empresaInfo.rucrepresentantelegal);
    if (!representante || !rucRepresentante) {
        return 'Debe completar los datos de Representante Legal y RUC del Representante Legal en Parametros de la empresa antes de generar RG90.';
    }
    return '';
}

function nextFilenameData(params, empresaInfo, tipo, cb) {
    var rucEmpresa = splitRuc(empresaInfo.ruc || '');
    var periodoInf = getPeriodoInf(params);
    var prefix = rucEmpresa.base + '_REG_' + periodoInf + '_' + (tipo === 'COMPRA' ? 'C1' : 'V1');
    var sql = "SELECT nombre_archivo FROM dba.REGISTRO_EXPORT_RG90 WHERE cod_empresa = '" + esc(params.empresa) + "'";
    execRows(sql, function (err, rows) {
        if (err) return cb(err);
        var maxSeq = 0;
        (rows || []).forEach(function (row) {
            var name = toText(row.nombre_archivo || row.NOMBRE_ARCHIVO);
            if (name.indexOf(prefix) !== 0) return;
            var digits = onlyDigits(name.slice(prefix.length));
            var seq = parseInt(digits.slice(-3), 10);
            if (isFinite(seq) && seq > maxSeq) maxSeq = seq;
        });
        var nextSeq = padLeft(maxSeq + 1, 3, '0');
        var extension = tipo === 'COMPRA' ? '.TXT' : '.txt';
        cb(null, {
            rucBase: rucEmpresa.base,
            filename: prefix + nextSeq + extension,
            nombreArchivo: prefix + nextSeq
        });
    });
}

function numericFacturaValue(value) {
    var text = toText(value).replace(/\.0+$/, '');
    if (!text) return 0;
    if (text.indexOf('-') >= 0) {
        var parts = text.split('-');
        return parseInt(onlyDigits(parts[parts.length - 1]) || '0', 10) || 0;
    }
    return parseInt(onlyDigits(text) || '0', 10) || 0;
}

function registroPayloadFromRow(row, tipo, nombreArchivo) {
    var codProv = tipo === 'COMPRA' ? toText(row.codprov) : toText(row.clientes);
    var nroFact = tipo === 'COMPRA'
        ? numericFacturaValue(row.nrofact)
        : numericFacturaValue(row.comp_inicial || row.nrofact);
    var codEst = padLeft(onlyDigits(row.cod_establecimiento || '0').slice(-3), 3, '0') || '000';
    var codPto = padLeft(onlyDigits(row.cod_ptoexpedicion || '0').slice(-3), 3, '0') || '000';
    var tpDef = toText(row.tp_def);
    var tipoRow = tipo === 'COMPRA' ? toText(row.tipo) : toText(row.tipo_registro || row.tipo);
    var nroFactura = '';
    if (tpDef === 'NC' || ((tpDef === 'CC' || tpDef === 'CD') && tipoRow === 'F')) {
        nroFactura = padLeft(String(nroFact), 7, '0').slice(-7);
    }
    return {
        codprov: codProv,
        nrofact: nroFact,
        fechafact: toText(row.fechafact).slice(0, 10),
        cod_tp_comp: toText(row.cod_tp_comp),
        tp_def: tpDef,
        tipo: tipoRow || 'F',
        nombre_archivo: nombreArchivo,
        cod_establecimiento: codEst || '000',
        cod_pto_expedicion: codPto || '000',
        nro_factura: nroFactura
    };
}

function persistRegistros(params, rows, tipo, nombreArchivo, cb) {
    if (!rows.length) return cb(null);
    var payloads = rows.map(function (row) {
        return registroPayloadFromRow(row, tipo, nombreArchivo);
    });
    conn.exec('BEGIN TRANSACTION', function (beginErr) {
        if (beginErr) return cb(beginErr);
        var index = 0;
        function step() {
            if (index >= payloads.length) {
                return conn.exec('COMMIT', function (commitErr) {
                    cb(commitErr || null);
                });
            }
            var item = payloads[index++];
            var sql = "INSERT INTO dba.REGISTRO_EXPORT_RG90 " +
                "(cod_empresa, codprov, nrofact, fechafact, cod_tp_comp, tp_def, tipo, nombre_archivo, cod_establecimiento, cod_pto_expedicion, nro_factura) VALUES (" +
                "'" + esc(params.empresa) + "', " +
                "'" + esc(item.codprov) + "', " +
                String(toNumber(item.nrofact)) + ", " +
                "DATE('" + esc(item.fechafact) + "'), " +
                "'" + esc(item.cod_tp_comp) + "', " +
                "'" + esc(item.tp_def) + "', " +
                "'" + esc(item.tipo) + "', " +
                "'" + esc(item.nombre_archivo) + "', " +
                "'" + esc(item.cod_establecimiento || '000') + "', " +
                "'" + esc(item.cod_pto_expedicion || '000') + "', " +
                (item.nro_factura ? "'" + esc(item.nro_factura) + "'" : "NULL") +
                ")";
            conn.exec(sql, function (err) {
                if (err) {
                    return conn.exec('ROLLBACK', function () {
                        cb(err);
                    });
                }
                step();
            });
        }
        step();
    });
}

function joinDelimited(values, delimiter) {
    return values.map(function (value) {
        var text = String(value === undefined || value === null ? '' : value).replace(/\.000000/g, '');
        if (delimiter === ',') {
            return '"' + text.replace(/"/g, '""') + '"';
        }
        return text;
    }).join(delimiter);
}

function buildVentaLine(row, empresaInfo, delimiter) {
    var ruc = splitRuc(row.ruc);
    var totalIva5 = absNumber(row.total_iva_5);
    var totalIva10 = absNumber(row.total_iva_10);
    var totalGrav5 = absNumber(row.total_grav_5) + totalIva5;
    var totalGrav10 = absNumber(row.total_grav_10) + totalIva10;
    var totalExenta = absNumber(row.total_exenta);
    var total = totalGrav5 + totalGrav10 + totalExenta;
    var tpDef = toText(row.tp_def).toUpperCase();
    var tipoDoc = ruc.raw === 'X' ? '15' : (ruc.raw.indexOf('-') >= 0 ? '11' : '12');
    var tipoOperacion = tpDef === 'NC' || tpDef === 'NP' ? '110' : (tpDef === 'ND' ? '111' : '109');
    var condicionVenta = (tpDef === 'CD' || toNumber(row.dias_credito) > 0 || toNumber(row.cuota) > 0) ? '2' : '1';
    var tipoMoneda = toText(row.codmoneda).toUpperCase() === 'GS' ? 'N' : 'S';
    var nroFactTimbrado = buildFacturaTimbradaFromParts(row.cod_establecimiento, row.cod_ptoexpedicion, row.comp_nro_timb || row.comp_inicial);
    var nroFactAso = toText(row.nro_fact_aso) || '0';
    var nroTimbAso = toText(row.nro_timb_aso) || '0';
    return joinDelimited([
        '1',
        tipoDoc,
        ruc.base,
        toText(row.razonsocial),
        tipoOperacion,
        formatDateDDMMYYYY(row.fechafact),
        String(toNumber(row.nrotimb)),
        nroFactTimbrado,
        String(Math.round(totalGrav10)),
        String(Math.round(totalGrav5)),
        String(Math.round(totalExenta)),
        String(Math.round(total)),
        condicionVenta,
        tipoMoneda,
        'S',
        toText(empresaInfo.imputa_ire || 'N'),
        toText(empresaInfo.imputa_irp || 'N'),
        nroFactAso,
        nroTimbAso
    ], delimiter || '\t');
}

function buildCompraLine(row, empresaInfo, delimiter) {
    var ruc = splitRuc(row.ruc);
    var montos = compraMontos(row);
    var tpDef = toText(row.tp_def).toUpperCase();
    var tpomvto = toText(row.tpomvto).toUpperCase();
    var tipoProv = toText(row.tipoprov).toUpperCase() || 'PL';
    var tipoCompra = toText(row.tipocompra).toUpperCase();
    var importador = toText(empresaInfo && empresaInfo.Importador || empresaInfo && empresaInfo.importador).toUpperCase();
    if (!importador) importador = 'NO';
    if (importador === 'S') importador = 'SI';
    var tipoDoc = '11';
    if ((toText(row.tipo).toUpperCase() === 'I' && tipoProv === 'PE')) {
        tipoDoc = '11';
    } else if (tipoCompra === 'I' && tipoProv === 'PE') {
        tipoDoc = tpDef === 'DP' ? '17' : '11';
    } else if (tpDef === 'NC' || tpDef === 'NP') {
        if (ruc.raw === 'X') tipoDoc = '15';
        else if (ruc.raw.indexOf('-') >= 0) tipoDoc = '11';
        else tipoDoc = toText(row.cliente_ruc_ref) === '88888801-5' ? '14' : '12';
    } else if (tpDef === 'CC' || tpDef === 'CD' || tpDef === 'ND') {
        tipoDoc = '11';
    }
    var tipoOperacion = '';
    if (importador === 'NO') {
        tipoOperacion = '109';
        if (tpomvto === 'BV') tipoOperacion = '103';
        else if (tpomvto === 'EP') tipoOperacion = '108';
        else if (tpomvto === 'BR') tipoOperacion = '104';
        else if (tpomvto === 'BT') tipoOperacion = '102';
        else if (tpomvto === 'TR') tipoOperacion = '112';
    } else {
        if (tipoCompra === 'E') tipoOperacion = '109';
        else if (tpDef === 'NC') tipoOperacion = '110';
    }
    var condicionCompra = tpDef === 'CD' ? '2' : '1';
    var tipoMoneda = toText(row.codmoneda).toUpperCase() === 'GS' ? 'N' : 'S';
    var timbrado = (tpDef === 'DP' || tipoProv === 'PE') ? '0' : (toText(row.timbradoprov) || '0');
    var nroFactTimbrado = '';
    if (tpDef === 'DP' || tipoProv === 'PE') {
        nroFactTimbrado = toText(row.nrodespacholong) || toText(row.nrofact);
    } else if (tpDef === 'NC' || tpDef === 'NP') {
        nroFactTimbrado = toText(row.nrofact);
    } else {
        nroFactTimbrado = formatCompraFacturaTimbrada(row.nrofact, tpomvto);
    }
    var nroFactAso = toText(row.nro_fact_aso) || '';
    var nroTimbAso = toText(row.nro_timb_aso) || '';
    var totalExenta = montos.totalExenta;
    if (tpomvto === 'AF') {
        tipoOperacion = '101';
        tipoDoc = '12';
        totalExenta = 0;
    }
    if (tpDef === 'DP') {
        tipoOperacion = '107';
        tipoDoc = '17';
        tipoMoneda = 'S';
    }
    if (tpDef === 'NC' || tpDef === 'NP') {
        tipoOperacion = '110';
        if (!nroFactAso) nroFactAso = '0';
        if (!nroTimbAso) nroTimbAso = '0';
        if (toText(row.ruc) === '44444401') {
            row = Object.assign({}, row, { razonsocial: 'Sin Nombre' });
        }
    }
    return joinDelimited([
        '2',
        tipoDoc,
        ruc.base,
        toText(row.razonsocial),
        tipoOperacion,
        formatDateDDMMYYYY(row.fechafact),
        timbrado,
        nroFactTimbrado,
        String(Math.round(montos.totalGrav10)),
        String(Math.round(montos.totalGrav5)),
        String(Math.round(totalExenta)),
        String(Math.round(montos.totalGrav5 + montos.totalGrav10 + totalExenta)),
        condicionCompra,
        tipoMoneda,
        'S',
        toText(empresaInfo.imputa_ire || 'N'),
        toText(empresaInfo.imputa_irp || 'N'),
        'N',
        nroFactAso,
        nroTimbAso
    ], delimiter || '\t');
}

function buildDelimitedContent(tipo, rows, empresaInfo, delimiter) {
    return rows.map(function (row) {
        return tipo === 'COMPRA'
            ? buildCompraLine(row, empresaInfo, delimiter)
            : buildVentaLine(row, empresaInfo, delimiter);
    }).join('\r\n');
}

function buildCompraSummary(rows) {
    var summary = {
        visible_total: 0,
        exento_total: 0,
        note_credit_total: 0
    };
    (rows || []).forEach(function (row) {
        var tpDef = toText(row.tp_def).toUpperCase();
        var montos = compraMontos(row);
        var totalFactura = compraTotalFacturaBase(row);
        if (tpDef !== 'NP' && tpDef !== 'ND' && tpDef !== 'NC') {
            summary.visible_total += totalFactura;
            summary.exento_total += absNumber(numberFromPrimaryOrFallback(row.total_exenta, row.to_exento));
        }
        if (tpDef === 'NC' || tpDef === 'NP') {
            summary.note_credit_total += totalFactura;
        }
    });
    return summary;
}

function buildTxtContent(tipo, rows, empresaInfo) {
    return buildDelimitedContent(tipo, rows, empresaInfo, '\t');
}

function buildCsvContent(tipo, rows, empresaInfo) {
    return buildDelimitedContent(tipo, rows, empresaInfo, ',');
}

function isCompraVentaNotaCredito(row) {
    var tpDef = toText(row && row.tp_def).toUpperCase();
    return (tpDef === 'NC' || tpDef === 'NP') && toText(row && row.origen).toUpperCase() !== 'VTACAB_NC';
}

function compraSortNumero(row) {
    var tpDef = toText(row && row.tp_def).toUpperCase();
    var tpomvto = toText(row && row.tpomvto).toUpperCase();
    var tipoProv = toText(row && row.tipoprov).toUpperCase();
    var tipoCompra = toText(row && row.tipocompra).toUpperCase();
    if (tpDef === 'DP' || tipoProv === 'PE' || tipoCompra === 'I') {
        return toText(row && (row.nrodespacholong || row.nrofact));
    }
    if (tpDef === 'NC' || tpDef === 'NP') {
        return toText(row && row.nrofact);
    }
    return formatCompraFacturaTimbrada(row && row.nrofact, tpomvto);
}

function sortCompraRows(rows) {
    return (rows || []).slice().sort(function (a, b) {
        var aIsNc = isCompraVentaNotaCredito(a);
        var bIsNc = isCompraVentaNotaCredito(b);
        if (aIsNc !== bIsNc) return aIsNc ? 1 : -1;
        var fechaA = toText(a && a.fechafact).slice(0, 10);
        var fechaB = toText(b && b.fechafact).slice(0, 10);
        if (fechaA !== fechaB) return fechaA.localeCompare(fechaB);
        var nroA = compraSortNumero(a);
        var nroB = compraSortNumero(b);
        if (nroA !== nroB) return nroA.localeCompare(nroB, undefined, { numeric: true, sensitivity: 'base' });
        var timbA = toText(a && a.timbradoprov);
        var timbB = toText(b && b.timbradoprov);
        if (timbA !== timbB) return timbA.localeCompare(timbB);
        return 0;
    });
}

function exportRowsForTipo(tipo, rows) {
    if (tipo === 'COMPRA') {
        return sortCompraRows(rows || []);
    }
    if (tipo !== 'VENTA') {
        return rows || [];
    }
    var normales = [];
    var notasProveedor = [];
    (rows || []).forEach(function (row) {
        var tpDef = toText(row.tp_def).toUpperCase();
        if (tpDef === 'NC') {
            return;
        }
        if (tpDef === 'NP') {
            notasProveedor.push(row);
            return;
        }
        normales.push(row);
    });
    return normales.concat(notasProveedor);
}

Rg90.preview = function (params, cb) {
    loadEmpresaInfo(params.empresa, function (empresaErr, empresaInfo) {
        if (empresaErr) return cb(empresaErr);
        var empresaValidationError = validateEmpresaInfoForRg90(empresaInfo);
        if (empresaValidationError) {
            return cb(null, {
                rows: [],
                debug: null,
                summary: null,
                warning: empresaValidationError
            });
        }
        runPreview(params, function (err, rows) {
            if (err) return cb(err);
            var tipo = normalizeTipo(params);
            if (tipo !== 'VENTA') {
                return loadVentasNotaCreditoTotal(params, function (ncErr, ventasNoteCreditTotal) {
                    if (ncErr) return cb(ncErr);
                    var compraSummary = buildCompraSummary(rows || []);
                    compraSummary.note_credit_total = ventasNoteCreditTotal;
                    if (String(params.debug || '').toLowerCase() !== 'true') {
                        return cb(null, { rows: rows || [], debug: null, summary: compraSummary, warning: null });
                    }
                    return runDiagnosticsQueries(buildComprasDiagnosticsQueries(params), function (diagErr, debug) {
                        if (diagErr) return cb(diagErr);
                        var rowsDebug = buildCompraRowsDebug(rows || []);
                        try {
                            console.log('[RG90 DEBUG COMPRA]', JSON.stringify({
                                empresa: params.empresa,
                                desde: params.desde,
                                hasta: params.hasta,
                                rows: (rows || []).length,
                                debug: debug || {},
                                rowsDebug: rowsDebug
                            }));
                        } catch (e) {}
                        cb(null, { rows: rows || [], debug: debug || null, summary: compraSummary, warning: null });
                    });
                });
            }
            loadVentasNotaCreditoTotal(params, function (sumErr, noteCreditTotal) {
                if (sumErr) return cb(sumErr);
                loadVentasVisibleTotal(params, function (visibleErr, visibleTotal) {
                    if (visibleErr) return cb(visibleErr);
                    loadVentasExentoTotal(params, function (exentoErr, exentoTotal) {
                        if (exentoErr) return cb(exentoErr);
                        if (String(params.debug || '').toLowerCase() !== 'true') {
                            return cb(null, {
                                rows: rows || [],
                                debug: null,
                                summary: {
                                    note_credit_total: noteCreditTotal,
                                    visible_total: visibleTotal,
                                    exento_total: exentoTotal
                                },
                                warning: null
                            });
                        }
                        runDiagnosticsQueries(buildVentasDiagnosticsQueries(params), function (diagErr, debug) {
                            if (diagErr) return cb(diagErr);
                            try {
                                console.log('[RG90 DEBUG VENTA]', JSON.stringify({
                                    empresa: params.empresa,
                                    desde: params.desde,
                                    hasta: params.hasta,
                                    rows: (rows || []).length,
                                    summary: {
                                        note_credit_total: noteCreditTotal,
                                        visible_total: visibleTotal,
                                        exento_total: exentoTotal
                                    },
                                    debug: debug || {}
                                }));
                            } catch (e) {}
                            cb(null, {
                                rows: rows || [],
                                debug: debug || null,
                                summary: {
                                    note_credit_total: noteCreditTotal,
                                    visible_total: visibleTotal,
                                    exento_total: exentoTotal
                                },
                                warning: null
                            });
                        });
                    });
                });
            });
        });
    });
};

Rg90.export = function (params, cb) {
    runPreview(params, function (previewErr, rows) {
        if (previewErr) return cb(previewErr);
        var tipo = normalizeTipo(params);
        var exportRows = exportRowsForTipo(tipo, rows);
        var format = toText(params.format).toLowerCase() === 'csv' ? 'csv' : 'txt';
        loadEmpresaInfo(params.empresa, function (empresaErr, empresaInfo) {
            if (empresaErr) return cb(empresaErr);
            var empresaValidationError = validateEmpresaInfoForRg90(empresaInfo);
            if (empresaValidationError) {
                return cb(new Error(empresaValidationError));
            }
            nextFilenameData(params, empresaInfo, tipo, function (fileErr, fileData) {
                if (fileErr) return cb(fileErr);
                var filename = format === 'csv'
                    ? String(fileData.filename || '').replace(/\.txt$/i, '.csv').replace(/\.TXT$/i, '.csv')
                    : fileData.filename;
                var content = format === 'csv'
                    ? buildCsvContent(tipo, exportRows, empresaInfo)
                    : buildTxtContent(tipo, exportRows, empresaInfo);
                var afterPersist = function (persistErr) {
                    if (persistErr) return cb(persistErr);
                    cb(null, {
                        filename: filename,
                        rowCount: exportRows.length,
                        content: content
                    });
                };
                if (format === 'csv') {
                    return afterPersist(null);
                }
                persistRegistros(params, exportRows, tipo, fileData.nombreArchivo, afterPersist);
            });
        });
    });
};

module.exports = Rg90;
