var conn = require('../db');
var q = require('./queryUtils');
var Activo = {};

Activo.bienes = function (params, filters, cb) {
    var sql = "SELECT dba.bienactivo.cod_empresa, dba.bienactivo.codactivo, " +
        "dba.bienactivo.descrip, dba.bienactivo.cod_articulo, dba.bienactivo.cantidad, " +
        "dba.bienactivo.nroserie, dba.bienactivo.nroparte, dba.bienactivo.codrubro, " +
        "dba.bienactivo.codsubrubro, dba.bienactivo.vidautil, " +
        "dba.bienactivo.vidautilrestante, dba.bienactivo.revaluable, " +
        "dba.bienactivo.depreciable, dba.bienactivo.codmonedaext, " +
        "dba.bienactivo.codubicacion, dba.bienactivo.codresponsable, " +
        "dba.bienactivo.fechacompra, dba.bienactivo.fechaalta, " +
        "dba.bienactivo.fechainiproc, dba.bienactivo.fechafinactivo, " +
        "dba.bienactivo.codprov, dba.bienactivo.cod_tp_comp, dba.bienactivo.nrofact, " +
        "dba.BienActivo.NroPedido, dba.BienActivo.NroSolicitud, " +
        "dba.BienActivo.NroOrdComp, dba.BienActivo.NroOP, " +
        "dba.BienActivo.ImportRegNormal, dba.BienActivo.ImportLey60_90, " +
        "dba.BienActivo.ImportNroDcto, dba.bienactivo.costocompra, " +
        "dba.bienactivo.costocomprame, dba.bienactivo.retasacion, " +
        "dba.bienactivo.retasacionme, dba.bienactivo.cantidadorig, " +
        "dba.bienactivo.codoriginal, dba.bienactivo.rubrooriginal, " +
        "dba.bienactivo.subrubrooriginal, dba.bienactivo.ubicoriginal, " +
        "dba.bienactivo.costocompraorig, dba.bienactivo.costocomprameorig, " +
        "dba.bienactivo.comentario, dba.bienactivo.configuracion, " +
        "dba.bienactivo.metodocalc, dba.bienactivo.tipodeprec, " +
        "dba.bienactivo.fechareval, dba.bienactivo.valoractual, " +
        "dba.bienactivo.valoractualme, dba.bienactivo.valorreval, " +
        "dba.bienactivo.valorrevalme, dba.bienactivo.valorrevalacum, " +
        "dba.bienactivo.valorrevalacumme, dba.bienactivo.valorrevalacumini, " +
        "dba.bienactivo.valorrevalacuminime, dba.bienactivo.deprecactual, " +
        "dba.bienactivo.deprecactualme, dba.bienactivo.deprecajuste, " +
        "dba.bienactivo.deprecajusteme, dba.bienactivo.deprecacum, " +
        "dba.bienactivo.deprecacumme, dba.bienactivo.deprecacumini, " +
        "dba.bienactivo.deprecacuminime, dba.bienactivo.fechaalta_2, " +
        "dba.bienactivo.fechainiproc_2, dba.bienactivo.vidautil_2, " +
        "dba.bienactivo.vidautilrestante_2, dba.bienactivo.valoractual_2, " +
        "dba.bienactivo.valoractualme_2, dba.bienactivo.valorreval_2, " +
        "dba.bienactivo.valorrevalme_2, dba.bienactivo.valorrevalacum_2, " +
        "dba.bienactivo.valorrevalacumme_2, dba.bienactivo.valorrevalacumini_2, " +
        "dba.bienactivo.valorrevalacuminime_2, dba.bienactivo.deprecactual_2, " +
        "dba.bienactivo.deprecactualme_2, dba.bienactivo.deprecajuste_2, " +
        "dba.bienactivo.deprecajusteme_2, dba.bienactivo.deprecacum_2, " +
        "dba.bienactivo.deprecacumme_2, dba.bienactivo.deprecacumini_2, " +
        "dba.bienactivo.deprecacuminime_2, dba.bienactivo.fechaalta_3, " +
        "dba.bienactivo.fechainiproc_3, dba.bienactivo.vidautil_3, " +
        "dba.bienactivo.vidautilrestante_3, dba.bienactivo.valoractual_3, " +
        "dba.bienactivo.valoractualme_3, dba.bienactivo.valorreval_3, " +
        "dba.bienactivo.valorrevalme_3, dba.bienactivo.valorrevalacum_3, " +
        "dba.bienactivo.valorrevalacumme_3, dba.bienactivo.valorrevalacumini_3, " +
        "dba.bienactivo.valorrevalacuminime_3, dba.bienactivo.deprecactual_3, " +
        "dba.bienactivo.deprecactualme_3, dba.bienactivo.deprecajuste_3, " +
        "dba.bienactivo.deprecajusteme_3, dba.bienactivo.deprecacum_3, " +
        "dba.bienactivo.deprecacumme_3, dba.bienactivo.deprecacumini_3, " +
        "dba.bienactivo.deprecacuminime_3, dba.bienactivo.Medidas, " +
        "dba.bienactivo.Cronologia, dba.bienactivo.Tecnica, dba.bienactivo.Autor, " +
        "dba.bienactivo.Origen, dba.bienactivo.Firmado, dba.bienactivo.Fechado, " +
        "dba.bienactivo.Titulo, dba.bienactivo.Tema, dba.bienactivo.EstadoConserv, " +
        "dba.bienactivo.Valoracion, dba.bienactivo.CodMonedaVal, " +
        "dba.bienactivo.FechaValoracion, dba.bienactivo.FechaFicha, " +
        "dba.bienactivo.FichaConfeccPor, dba.bienactivo.estado, " +
        "dba.bienactivo.cod_tp_compmvto, dba.bienactivo.nromvto, " +
        "dba.bienactivo.fechaultmvto, dba.bienactivo.monedaultmvto, " +
        "dba.bienactivo.factcambultmvto, dba.bienactivo.importeultmvto, " +
        "dba.bienactivo.motivoultmvto, dba.rubrosaf.descrip, dba.subrubrosaf.descrip , " +
        "dba.ubicacion.descrip as ubicacion_descrip, dba.responsable.apellido , STRING " +
        "(dba.responsable.nombre, IF ( dba.Sucursal.Des_Sucursal IS NOT NULL ) THEN " +
        "STRING(' - ', dba.Sucursal.Des_Sucursal) ENDIF, IF ( dba.Sucursal.Des_Sucursal " +
        "IS NOT NULL ) THEN STRING(' - ', dba.Dpto.Descrip) ENDIF) AS Nombre, " +
        "dba.articulo.des_art, dba.articulo.unidad, dba.proveed.razonsocial, r2.Descrip " +
        "AS RUBROORIGINAL_DESCRIP, s2.Descrip AS SUBRUBROORIGINAL_DESCRIP, u2.Descrip " +
        "AS UBICORIGINAL_DESCRIP, dba.Control.EtiqRevDeprec_1, " +
        "dba.Control.EtiqRevDeprec_2, dba.Control.EtiqRevDeprec_3 FROM ( ( ( ( ( ( ( ( " +
        "( ( dba.bienactivo LEFT OUTER JOIN dba.rubrosaf ON ( dba.rubrosaf.cod_empresa " +
        "= dba.bienactivo.cod_empresa ) AND ( dba.rubrosaf.codrubro = " +
        "dba.bienactivo.codrubro )) LEFT OUTER JOIN dba.subrubrosaf ON " +
        "dba.bienactivo.cod_empresa = dba.subrubrosaf.cod_empresa AND " +
        "dba.bienactivo.codrubro = dba.subrubrosaf.codrubro AND " +
        "dba.bienactivo.codsubrubro = dba.subrubrosaf.codsubrubro) LEFT OUTER JOIN ( ( " +
        "dba.responsable LEFT OUTER JOIN dba.sucursal ON dba.responsable.Cod_Empresa = " +
        "dba.sucursal.Cod_Empresa AND dba.responsable.Cod_Sucursal = " +
        "dba.sucursal.Cod_Sucursal) LEFT OUTER JOIN dba.Dpto ON " +
        "dba.responsable.Cod_Empresa = dba.dpto.Cod_Empresa AND " +
        "dba.responsable.Cod_Sucursal = dba.dpto.Cod_Sucursal AND " +
        "dba.responsable.CodDpto = dba.dpto.CodDpto) ON dba.bienactivo.Cod_Empresa = " +
        "dba.responsable.Cod_Empresa AND dba.bienactivo.CodResponsable = " +
        "dba.responsable.CodResponsable) LEFT OUTER JOIN dba.ubicacion ON " +
        "dba.bienactivo.cod_empresa = dba.ubicacion.cod_empresa AND " +
        "dba.bienactivo.codubicacion = dba.ubicacion.codubicacion) LEFT OUTER JOIN " +
        "dba.proveed ON dba.bienactivo.cod_empresa = dba.proveed.cod_empresa AND " +
        "dba.bienactivo.codprov = dba.proveed.codprov) LEFT OUTER JOIN dba.articulo ON " +
        "dba.bienactivo.cod_empresa = dba.articulo.cod_empresa AND " +
        "dba.bienactivo.cod_articulo = dba.articulo.cod_articulo) LEFT OUTER JOIN " +
        "dba.rubrosaf r2 ON dba.bienactivo.cod_empresa = r2.cod_empresa AND " +
        "dba.bienactivo.rubrooriginal = r2.codrubro) LEFT OUTER JOIN dba.subrubrosaf s2 " +
        "ON dba.bienactivo.cod_empresa = s2.cod_empresa AND " +
        "dba.bienactivo.rubrooriginal = s2.codrubro AND dba.bienactivo.subrubrooriginal " +
        "= s2.codsubrubro) LEFT OUTER JOIN dba.ubicacion u2 ON " +
        "dba.bienactivo.cod_empresa = u2.cod_empresa AND dba.bienactivo.ubicoriginal = " +
        "u2.codubicacion) LEFT OUTER JOIN dba.control ON dba.bienactivo.cod_empresa = " +
        "dba.control.cod_empresa AND dba.control.Periodo = ? ) " +
        "WHERE dba.bienactivo.cod_empresa = ? " +
        "AND DATE(dba.bienactivo.fechacompra) >= DATE(?) " +
        "AND DATE(dba.bienactivo.fechacompra) <= DATE(?) " +
        "AND DATE(dba.bienactivo.fechaalta) >= DATE(?) " +
        "AND DATE(dba.bienactivo.fechaalta) <= DATE(?) ";

    var sql_params = [
        filters.periodo_year, params.empresa,
        filters.compras_start, filters.compras_end,
        filters.ventas_start, filters.ventas_end
    ];

    console.log(filters);

    if (filters.despreciable && filters.despreciable === 'true') {
        sql += "AND (UPPER(dba.bienactivo.depreciable) = 'S') ";
    } else {
        sql += "AND (UPPER(dba.bienactivo.depreciable) = 'N') ";
    }

    if (filters.revaluable && filters.revaluable === 'true') {
        sql += "AND (UPPER(dba.bienactivo.revaluable) = 'S') ";
    } else {
        sql += "AND (UPPER(dba.bienactivo.revaluable) = 'N') ";
    }

    if (filters.estado && filters.estado != 'T') {
        sql += "AND (dba.bienactivo.estado = ?) ";
        sql_params.push(filters.estado);
    }


    if (filters.rubro) {
        sql += "AND ( ( dba.bienactivo.codrubro = ? ) ) ";
        sql_params.push(filters.rubro);
    }

    conn.exec(sql, sql_params, function (err, res) {
        if (err) throw err;
        cb(res);
    });

    if (filters.subrubro) {
        sql += " AND ( dba.bienactivo.codsubrubro = ? )";
        sql_params.push(filters.subrubro);
    }

    if (filters.proveedor) {
        sql += " AND (dba.bienactivo.codprov IN " + q.in(filters.proveedor) + ")";
    }

    if (filters.articulo) {
        sql += " AND (dba.bienactivo.cod_articulo IN " + q.in(filters.articulo) + ")";
    }

    if (filters.sucursal) {
        sql += " AND (dba.sucursal.Cod_Sucursal = ?)";
        sql_params.push(filters.sucursal);
    }

    console.log(sql_params);
    console.log(sql);
};

module.exports = Activo;