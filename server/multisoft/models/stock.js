var conn = require('../db_integrado');
var q = require('./queryUtils');
var fs = require('fs');
var path = require('path');
var Stock = {};
//Cero, Positivo y Negativo, Negativo, Positivo
var mappings = {'Z': '=', 'PN': '!=', 'N': '<', 'P': '>'};
var STOCK_VALORIZADO_TTL_MS = 30000;
var stockValorizadoCache = new Map();
var stockValorizadoPending = new Map();

function buildSessionId() {
    var base = String(Date.now()) + String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    return base.slice(-15);
}

function logCostoArticuloFull(message) {
    try {
        var dir = path.join(__dirname, '..', 'logs');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.appendFileSync(
            path.join(dir, 'stock-costo-articulo-full.log'),
            new Date().toISOString() + ' ' + message + '\n',
            { encoding: 'utf8' }
        );
    } catch (e) {
        console.error('No se pudo escribir stock-costo-articulo-full.log:', e);
    }
}

function sqlValue(value) {
    if (value === null || value === undefined) return 'NULL';
    return "'" + String(value).replace(/'/g, "''") + "'";
}

function buildStockValorizadoCacheKey(params, query) {
    return JSON.stringify({
        empresa: String(params.empresa || ''),
        sucursal: String(query.sucursal || ''),
        deposito: String(query.deposito || ''),
        estado: String(query.estado || ''),
        tipo: String(query.tipo || ''),
        familia: String(query.familia || ''),
        grupo: String(query.grupo || ''),
        existencia: String(query.existencia || ''),
        moneda: String(query.moneda || 'L'),
        costeo: String(query.costeo || 'P'),
        articulo: Array.isArray(query.articulo) ? query.articulo.join(',') : String(query.articulo || ''),
        summary: String(query.summary || '')
    });
}

function getCachedStockValorizado(key) {
    var cached = stockValorizadoCache.get(key);
    if (!cached) {
        return null;
    }

    if (cached.expiresAt < Date.now()) {
        stockValorizadoCache.delete(key);
        return null;
    }

    return cached.rows;
}

function setCachedStockValorizado(key, rows) {
    stockValorizadoCache.set(key, {
        rows: rows,
        expiresAt: Date.now() + STOCK_VALORIZADO_TTL_MS
    });
}

function buildRangeFilter(column, rawValue, negate) {
    var value = String(rawValue || '').trim();
    if (!value) return '';
    var tokens = value.split(';').map(function (item) {
        return String(item || '').trim();
    }).filter(Boolean);
    if (!tokens.length) return '';

    var parts = tokens.map(function (token) {
        if (token.indexOf(':') >= 0) {
            var bounds = token.split(':');
            var from = String(bounds[0] || '').trim();
            var to = String(bounds[1] || '').trim();
            if (from && to) {
                return "(" + column + " BETWEEN " + sqlValue(from) + " AND " + sqlValue(to) + ")";
            }
        }
        return "(" + column + " = " + sqlValue(token) + ")";
    });

    if (!parts.length) return '';
    return "AND " + (negate ? "NOT " : "") + "(" + parts.join(" OR ") + ") ";
}

Stock.articulos = function (params, query) {
    var sql =
        "SELECT dba.articulo.cod_familia, dba.familia.des_familia, " +
        "dba.articulo.cod_grupo, dba.grupo.des_grupo, dba.articulo.cod_subgrupo, " +
        "dba.subgrupo.des_subgrupo, dba.articulo.cod_individual, " +
        "dba.individual.des_individual, dba.articulo.cod_articulo, " +
        "dba.articulo.cod_original, dba.articulo.des_art, dba.articulo.comision_vta, " +
        "dba.articulo.descuento, dba.articulo.unidad, dba.articulo.cod_iva, " +
        "dba.articulo.st_max, dba.articulo.iva, dba.articulo.cod_empresa, " +
        "dba.articulo.PorcComisLista1, dba.articulo.PorcComisLista2, " +
        "dba.articulo.PorcComisLista3, dba.articulo.PorcComisLista4, " +
        "dba.articulo.porc_financ, dba.articulo.porc_financ_me\n" +
        "FROM dba.articulo" +
        "\n" +
        "LEFT OUTER JOIN dba.grupo\n" +
        "ON dba.articulo.cod_familia = dba.grupo.cod_familia " +
        "AND dba.articulo.cod_grupo = dba.grupo.cod_grupo " +
        "\n" +
        "LEFT OUTER JOIN dba.subgrupo\n" +
        "ON dba.articulo.cod_familia = dba.subgrupo.cod_familia " +
        "AND dba.articulo.cod_grupo = dba.subgrupo.cod_grupo " +
        "AND dba.articulo.cod_subgrupo = dba.subgrupo.cod_subgrupo" +
        "\n" +
        "LEFT OUTER JOIN dba.individual\n" +
        "ON dba.articulo.cod_familia = dba.individual.cod_familia " +
        "AND dba.articulo.cod_grupo = dba.individual.cod_grupo " +
        "AND dba.articulo.cod_subgrupo = dba.individual.cod_subgrupo " +
        "AND dba.articulo.cod_individual = dba.individual.cod_individual, dba.familia" +
        "\n" +
        "WHERE ( dba.articulo.cod_familia = dba.familia.cod_familia )\n" +
        "AND ( dba.articulo.cod_empresa = ? )\n" +
        "AND ( articulo.cto_prom_gs is null or articulo.cto_prom_gs <= 0 ) " +
        "AND ( articulo.cto_ult_gs is null or articulo.cto_ult_gs <= 0 ) " +
        "AND ( articulo.cto_ult_fob_gs is null or articulo.cto_ult_fob_gs <= 0 ) " +
        "AND ( articulo.cto_prom_me is null or articulo.cto_prom_me <= 0 ) " +
        "AND ( articulo.cto_ult_me is null or articulo.cto_ult_me <= 0 ) " +
        "AND ( articulo.cto_ult_fob_me is null or articulo.cto_ult_fob_me <= 0 )\n";
    var sqlParams = [params.empresa];

    if (query.articulo) {
        if (query.articulo.constructor === Array) {
            sql += "AND articulo.cod_articulo IN " + q.in(query.articulo) + "\n";
        } else {
            sql += "AND articulo.cod_articulo = ?\n";
            sqlParams.push(query.articulo);
        }
    }
    if (query.tipo) {
        sql += "AND articulo.cod_tp_art = ?\n";
        sqlParams.push(query.tipo);
    }
    if (query.estado) {
        sql += "AND articulo.estado = ?\n";
        sqlParams.push(query.estado);
    }
    if (query.familia) {
        sql += "AND articulo.cod_familia = ?\n";
        sqlParams.push(query.familia);
    }
    if (query.grupo) {
        sql += "AND articulo.cod_grupo = ?\n";
        sqlParams.push(query.grupo);
    }
    if (query.rotacion) {
        sql += "AND articulo.rotacion = ?\n";
        sqlParams.push(query.rotacion);
    }
    sql += "ORDER BY dba.articulo.cod_familia, dba.articulo.cod_grupo;";

    return conn.execAsync(sql, sqlParams);
};

Stock.listaPrecios = function (params, query) {
    if (!query.lista) query.lista = '1';
    if (!query.sucursal) query.sucursal = '';
    var sql =
        "SELECT DBA.articulo.cod_empresa, DBA.articulo.cod_familia, " +
        "DBA.articulo.cod_grupo, DBA.articulo.cod_subgrupo, " +
        "DBA.articulo.cod_individual, if dba.articulo.codartpad is null then " +
        "dba.articulo.cod_articulo else dba.articulo.codartpad endif as codigo, " +
        "DBA.articulo.nroarticulo, DBA.articulo.cod_original, DBA.articulo.referencia, " +
        "DBA.articulo.des_art,\n";
    if (query.lista) {
        sql += "DBA.articulo.pr" + query.lista + "_gs pr_gs, DBA.articulo.pr" + query.lista + "_me pr_me,\n";
    }
    sql +=
        "DBA.articulo.cod_iva, DBA.FAMILIA.des_familia, DBA.GRUPO.des_grupo,\n" +
        "ISNULL((\n" +
        "	SELECT SUM( dba.artdep.existencia )\n" +
        "	FROM dba.artdep\n" +
        "	WHERE (dba.artdep.cod_empresa = dba.articulo.cod_empresa )\n" +
        "	AND ( dba.artdep.cod_articulo = dba.articulo.cod_articulo )\n" +
        "	AND ( dba.artdep.cod_sucursal = ? )\n" +
        "), 0) existencia\n" +
        "FROM dba.articulo, DBA.FAMILIA, DBA.GRUPO\n" +
        "WHERE ( dba.articulo.Cod_Familia = DBA.GRUPO.cod_familia )\n" +
        "AND ( dba.articulo.Cod_Grupo = dba.GRUPO.cod_grupo)\n" +
        "AND ( dba.articulo.Cod_Familia = dba.FAMILIA.Cod_Familia)\n" +
        "AND ( articulo.cod_empresa = ?)\n";

    var sqlParams = [query.sucursal, params.empresa];
    if (query.estado) {
        sql += "AND ( articulo.estado = ?)\n";
        sqlParams.push(query.estado);
    }
    if (query.tipo) {
        sql += "AND articulo.cod_tp_art = ?\n";
        sqlParams.push(query.tipo);
    }
    if (query.familia) {
        sql += "AND articulo.cod_familia = ?\n";
        sqlParams.push(query.familia);
    }
    if (query.grupo) {
        sql += "AND articulo.cod_grupo = ?\n";
        sqlParams.push(query.grupo);
    }
    if (query.sucursal) {
        sql +=
            "AND exists ( " +
            "	select * from dba.artdep " +
            "	where articulo.cod_empresa  = artdep.cod_empresa " +
            "	and  articulo.cod_articulo = artdep.cod_articulo " +
            "	and  artdep.cod_sucursal  = ? " +
            ")\n";
        sqlParams.push(query.sucursal);
    }

    sql += "ORDER BY dba.articulo.cod_familia, dba.articulo.cod_grupo";

    return conn.execAsync(sql, sqlParams);
};

Stock.existenciaDeposito = function (params, query) {
    var sql =
        "SELECT dba.articulo.cod_familia, dba.articulo.cod_grupo, " +
        "dba.articulo.cod_subgrupo, dba.articulo.cod_individual, " +
        "dba.articulo.cod_articulo, dba.articulo.cod_original, dba.articulo.referencia, " +
        "dba.articulo.des_art, dba.articulo.pto_pedido, dba.articulo.cantembalaje, " +
        "dba.articulo.tipoembalaje, dba.artdep.cod_deposito, dba.artdep.existencia, " +
        "dba.artdep.cod_empresa, dba.artdep.cod_sucursal, DBA.FAMILIA.des_familia\n" +
        "FROM dba.artdep, dba.articulo, dba.sucursal, DBA.FAMILIA\n" +
        "WHERE ( dba.articulo.Cod_Familia = DBA.FAMILIA.cod_familia )\n" +
        "AND ( dba.articulo.Cod_Empresa = dba.sucursal.Cod_Empresa )\n" +
        "AND ( dba.articulo.cod_empresa = dba.artdep.cod_empresa )\n" +
        "AND ( dba.articulo.cod_articulo = dba.artdep.cod_articulo )\n" +
        "AND ( dba.artdep.cod_empresa = dba.sucursal.cod_empresa )\n" +
        "AND ( dba.artdep.cod_sucursal = dba.sucursal.cod_sucursal )\n" +
        "AND dba.artdep.cod_Empresa = ?\n";
    var sqlParams = [params.empresa];

    if (query.sucursal) {
        sql += "AND dba.artdep.cod_sucursal = ?\n";
        sqlParams.push(query.sucursal);
    }

    if (query.deposito) {
        sql += "AND dba.artdep.cod_deposito = ?\n";
        sqlParams.push(query.deposito);
    }
    if (query.existencia && mappings.hasOwnProperty(query.existencia)) {
        sql += "AND dba.artdep.existencia " + mappings[query.existencia] + " 0\n";
    }
    if (query.estado) {
        sql += "AND dba.articulo.estado = ?\n";
        sqlParams.push(query.estado);
    }
    if (query.tipo) {
        sql += "AND ( (dba.articulo.cod_tp_art = ?) )\n";
        sqlParams.push(query.tipo);
    }
    if (query.familia) {
        sql += "AND (dba.articulo.cod_familia = ?)\n";
        sqlParams.push(query.familia);
    }
    if (query.grupo) {
        sql += "AND (dba.articulo.cod_grupo = ?)\n";
        sqlParams.push(query.grupo);
    }
    sql += "ORDER BY dba.articulo.cod_familia, dba.articulo.cod_grupo, dba.articulo.cod_articulo, dba.artdep.cod_sucursal";

    return conn.execAsync(sql, sqlParams);
};

Stock.listas = function () {
    var sql = "select list_precio id, list_nombre name from dba.ListaPrecio;";
    return conn.execAsync(sql);
};

Stock.familias = function () {
    var sql = "SELECT cod_familia id, des_familia name FROM DBA.familia  ORDER BY cod_familia ASC";
    return conn.execAsync(sql);
};

Stock.grupos = function (query) {
    if (!query.familia) return Promise.resolve([]);
    var sql =
        "SELECT cod_familia familia, cod_grupo id, des_grupo name " +
        "FROM dba.grupo " +
        "WHERE cod_familia = " + sqlValue(query.familia) + " " +
        "ORDER BY cod_grupo ASC";
    return conn.execAsync(sql);
};

Stock.subgrupos = function (query) {
    if (!query.familia || !query.grupo) return Promise.resolve([]);
    var sql =
        "SELECT cod_familia familia, cod_grupo grupo, cod_subgrupo id, des_subgrupo name " +
        "FROM dba.subgrupo " +
        "WHERE cod_familia = " + sqlValue(query.familia) + " " +
        "AND cod_grupo = " + sqlValue(query.grupo) + " " +
        "ORDER BY cod_subgrupo ASC";
    return conn.execAsync(sql);
};

Stock.individuales = function (query) {
    if (!query.familia || !query.grupo || !query.subgrupo) return Promise.resolve([]);
    var sql =
        "SELECT cod_familia familia, cod_grupo grupo, cod_subgrupo subgrupo, cod_individual id, des_individual name " +
        "FROM dba.individual " +
        "WHERE cod_familia = " + sqlValue(query.familia) + " " +
        "AND cod_grupo = " + sqlValue(query.grupo) + " " +
        "AND cod_subgrupo = " + sqlValue(query.subgrupo) + " " +
        "ORDER BY cod_individual ASC";
    return conn.execAsync(sql);
};

Stock.depositos = function (params, query) {
    var sql =
        "SELECT cod_deposito id, des_deposito name FROM dba.DEPOSITO d\n" +
        "WHERE d.cod_empresa = " + sqlValue(params.empresa) + "\n" +
        "AND d.cod_sucursal = " + sqlValue(params.sucursal) + "\n";

    return conn.execAsync(sql);
};

function computeStockValorizado(params, query) {
    if (!query.moneda) {
        query.moneda = 'L'; //moneda local por defecto
    }
    var moneda = query.moneda === 'E' ? '_me' : '_gs'; //columna de moneda
    if (!query.costeo) {
        query.costeo = 'P'; //precio promedio por defecto
    }
    var costeo;
    switch (query.costeo) {
        case "P":
            costeo = "cto_prom";
            break;
        case "U":
            costeo = "cto_ult";
            break;
        case "F":
            costeo = "cto_ult_fob";
            break;
        default:
            costeo = "pr" + query.costeo; //se selecciono lista de precio
    }
    var sqlParams = [params.empresa];
    var selectClause = query.summary === 'S'
        ? "SELECT " +
            "count(distinct dba.articulo.cod_articulo) as articulos, " +
            "sum(dba.artdep.existencia) as total_existencia, " +
            "sum(dba.artdep.existencia * dba.articulo." + costeo + moneda + ") as valor_inventario "
        : "SELECT dba.artdep.cod_empresa, dba.artdep.cod_sucursal, " +
            "dba.artdep.cod_deposito, dba.sucursal.des_sucursal, dba.deposito.des_deposito, " +
            "dba.articulo.cod_familia, dba.familia.des_familia, dba.articulo.cod_grupo, dba.grupo.des_grupo, " +
            "dba.articulo.cod_subgrupo, dba.articulo.cod_individual, " +
            "dba.articulo.cod_articulo, dba.articulo.codartpad, dba.articulo.nroarticulo, " +
            "dba.articulo.cod_original, dba.articulo.des_art, " +
            "dba.articulo." + costeo + moneda + " as costo, " +
            "sum(dba.artdep.existencia) as total_existencia  ";
    var sql =
        selectClause +
        "FROM dba.artdep, dba.articulo, dba.sucursal, dba.deposito, dba.familia, dba.grupo " +
        "WHERE (dba.articulo.cod_empresa = dba.artdep.cod_empresa) " +
        "AND (dba.articulo.cod_articulo = dba.artdep.cod_articulo) " +
        "AND (dba.articulo.cod_familia = dba.familia.cod_familia) " +
        "AND (dba.articulo.cod_familia = dba.grupo.cod_familia) " +
        "AND (dba.articulo.cod_grupo = dba.grupo.cod_grupo) " +
        "AND (dba.artdep.cod_empresa = dba.sucursal.cod_empresa) " +
        "AND (dba.artdep.cod_sucursal = dba.sucursal.cod_sucursal) " +
        "AND (dba.artdep.cod_empresa = dba.deposito.cod_empresa) " +
        "AND (dba.artdep.cod_sucursal = dba.deposito.cod_sucursal) " +
        "AND (dba.artdep.cod_deposito = dba.deposito.cod_deposito)\n" +
        "AND (dba.artdep.cod_empresa = ?)\n";

    var groupBy =
        "GROUP BY dba.artdep.cod_empresa, dba.artdep.cod_sucursal, dba.artdep.cod_deposito, " +
        "dba.sucursal.des_sucursal, dba.deposito.des_deposito, " +
        "dba.articulo.cod_familia, dba.familia.des_familia, dba.articulo.cod_grupo, dba.grupo.des_grupo, " +
        "dba.articulo.cod_subgrupo, dba.articulo.cod_individual, " +
        "dba.articulo.codartpad, dba.articulo.cod_articulo, dba.articulo.nroarticulo, " +
        "dba.articulo.cod_original, dba.articulo.des_art, costo\n";
    var orderBy = "ORDER BY dba.articulo.cod_familia, dba.articulo.cod_grupo, dba.articulo.cod_articulo";

    if (query.articulo) {
        if (query.articulo.constructor === Array) {
            sql += "AND articulo.cod_articulo IN " + q.in(query.articulo) + "\n";
        } else {
            sql += "AND articulo.cod_articulo = ?\n";
            sqlParams.push(query.articulo);
        }
    }

    if (query.existencia && mappings.hasOwnProperty(query.existencia)) {
        sql += "AND dba.artdep.existencia " + mappings[query.existencia] + " 0\n";
        groupBy += "HAVING total_existencia " + mappings[query.existencia] + " 0\n";
    }

    if (query.sucursal) {
        sql += "AND dba.artdep.cod_sucursal = ?\n";
        sqlParams.push(query.sucursal);
    }

    if (query.deposito) {
        sql += "AND dba.artdep.cod_deposito = ?\n";
        sqlParams.push(query.deposito);
    }

    if (query.iva) {
        sql += "AND dba.articulo.cod_iva = ?\n";
        sqlParams.push(query.iva);
    }

    if (query.estado) {
        sql += "AND dba.articulo.estado = ?\n";
        sqlParams.push(query.estado);
    }

    if (query.tipo) {
        sql += "AND dba.articulo.cod_tp_art = ?\n";
        sqlParams.push(query.tipo);
    }

    if (query.familia) {
        sql += "AND ((dba.articulo.cod_familia = ?))\n";
        sqlParams.push(query.familia);
    }

    if (query.grupo) {
        sql += "AND ((dba.articulo.cod_grupo = ?))\n";
        sqlParams.push(query.grupo);
    }

    sql = query.summary === 'S' ? sql : (sql + groupBy + orderBy);
    return conn.execAsync(sql, sqlParams);
};

Stock.valorizado = function (params, query) {
    query = query || {};
    var key = buildStockValorizadoCacheKey(params, query);
    var cached = getCachedStockValorizado(key);

    if (cached) {
        return Promise.resolve(cached);
    }

    if (stockValorizadoPending.has(key)) {
        return stockValorizadoPending.get(key);
    }

    var request = computeStockValorizado(params, query)
        .then(function (rows) {
            var safeRows = rows || [];
            setCachedStockValorizado(key, safeRows);
            stockValorizadoPending.delete(key);
            return safeRows;
        })
        .catch(function (error) {
            stockValorizadoPending.delete(key);
            throw error;
        });

    stockValorizadoPending.set(key, request);
    return request;
};

Stock.costoArticuloFull = function (params, query) {
    var empresa = params.empresa;
    var estado = (query.estado || '').trim();
    var tipo = (query.tipo || '').trim();
    var sucursal = (query.sucursal || '').trim();
    var deposito = (query.deposito || '').trim();
    var articulo = query.articulo;
    var calcularEmpresa = String(query.calcular_empresa || 'N').toUpperCase() === 'S';
    var inventarioFisico = String(query.inventario_fisico || 'N').toUpperCase() === 'S';
    var soloHijos = String(query.solo_hijos || 'N').toUpperCase() === 'S';
    var recalcular = String(query.recalcular || 'N').toUpperCase() === 'S';
    var debugRecall = String(query.debug_recall || query.recall_dbg || 'N').toUpperCase() === 'S';
    var isEbcMaterialesMode = String(query.ecuacion_mat || 'N').toUpperCase() === 'S';
    var fechaDesde = (query.fechad || '').trim();
    var fechaHasta = (query.fechah || '').trim();
    var mUpdArtDep = inventarioFisico ? 'I' : 'S';
    var sessionId = buildSessionId();
    var clientSessionId = (query.client_session_id || '').trim();
    var codFamilia = (query.cod_familia || query.familia || '99').trim();
    var incCodFamilia = (query.inc_cod_familia || '').trim();
    var excCodFamilia = (query.exc_cod_familia || '').trim();
    var incCodGrupo = (query.inc_cod_grupo || '').trim();
    var excCodGrupo = (query.exc_cod_grupo || '').trim();
    var incCodSubgrupo = (query.inc_cod_subgrupo || '').trim();
    var excCodSubgrupo = (query.exc_cod_subgrupo || '').trim();
    var incCodIndividual = (query.inc_cod_individual || '').trim();
    var excCodIndividual = (query.exc_cod_individual || '').trim();
    var periodo = (query.periodo || '').trim();
    var anho = Number((query.anho || '').trim() || 0);
    var empresaDespachos = (empresa === 'IN') ? 'BG' : empresa;
    var codDespachante = (query.cod_despachante || '').trim();
    var nroDespacho = Number((query.nro_despacho || '').trim() || 0);
    var cierre = (query.cierre || 'N').trim() || 'N';
    var tipoDespacho = (query.tipo_despacho || 'C').trim() || 'C';
    var fechaInicioDesde = (query.fecha_inicio_desde || '1900-01-01').trim() || '1900-01-01';
    var fechaInicioHasta = (query.fecha_inicio_hasta || '1900-01-01').trim() || '1900-01-01';
    var fechaFinDesdeComp = (query.fecha_fin_desde || '1900-01-01').trim() || '1900-01-01';
    var fechaFinHastaComp = (query.fecha_fin_hasta || '1900-01-01').trim() || '1900-01-01';
    var estadoCompuesto = (query.estado_compuesto || '').trim();
    var tipoCompuesto = (query.tipo_compuesto || '').trim();
    var realizadoPor = (query.realizadopor || '').trim();
    var despachoLimit = Number((query.debug_despacho_limit || '').trim() || 0);
    var useExtendedEbcMateriales =
        String(query.ecuacion_mat || 'N').toUpperCase() === 'S' &&
        !!periodo &&
        !!anho;
    var progressCallback = (query && typeof query._progressCallback === 'function')
        ? query._progressCallback
        : null;

    function reportProgress(step, progress, message) {
        if (!progressCallback) return;
        try {
            progressCallback({
                step: step || '',
                progress: typeof progress === 'number' ? progress : 0,
                message: message || step || ''
            });
        } catch (e) {}
    }

    logCostoArticuloFull(
        '[START] empresa=' + empresa +
        ' client_session_id=' + (clientSessionId || '-') +
        ' sessionId=' + sessionId +
        ' ecuacion_orig=' + String(query.ecuacion_orig || 'N') +
        ' ecuacion_mat=' + String(query.ecuacion_mat || 'N') +
        ' debug_recall=' + (debugRecall ? 'S' : 'N') +
        ' recalcular=' + String(query.recalcular || 'N') +
        ' ebc_mat_ext=' + (useExtendedEbcMateriales ? 'S' : 'N') +
        ' fechad=' + fechaDesde +
        ' fechah=' + fechaHasta
    );
    reportProgress('Inicio', 2, 'Preparando informe');

    function pickValue(row, keys, defVal) {
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            if (Object.prototype.hasOwnProperty.call(row, k) && row[k] !== null && row[k] !== undefined) {
                return row[k];
            }
        }
        return defVal;
    }

    function toNumber(v) {
        var n = Number(v);
        return isNaN(n) ? 0 : n;
    }

    function safeDivide(numerator, denominator) {
        var num = toNumber(numerator);
        var den = toNumber(denominator);
        if (!den) return 0;
        return num / den;
    }

    function roundNumber(value, decimals) {
        var n = toNumber(value);
        var factor = Math.pow(10, decimals || 0);
        return Math.round(n * factor) / factor;
    }

    function buildPeriodParts(baseDate) {
        var periodDate = new Date((baseDate || fechaHasta || fechaDesde || '') + 'T00:00:00');
        return {
            anio: isNaN(periodDate.getTime()) ? '' : periodDate.getFullYear(),
            mes: isNaN(periodDate.getTime()) ? '' : (periodDate.getMonth() + 1)
        };
    }

    function buildPeriodoValue(parts) {
        var anioVal = String(parts && parts.anio ? parts.anio : '').trim();
        var mesVal = Number(parts && parts.mes ? parts.mes : 0);
        if (!anioVal || !mesVal) return '';
        return anioVal + String(mesVal).padStart(2, '0');
    }

    function shouldPersistMonthlyHistory() {
        if (String(query.ecuacion_mat || 'N').toUpperCase() !== 'S') {
            return false;
        }
        if (!useExtendedEbcMateriales) {
            return false;
        }
        var restricted = [
            sucursal,
            deposito,
            tipo,
            (estado && estado !== 'T') ? estado : '',
            articulo ? 'ART' : '',
            incCodFamilia,
            excCodFamilia,
            incCodGrupo,
            excCodGrupo,
            incCodSubgrupo,
            excCodSubgrupo,
            incCodIndividual,
            excCodIndividual,
            codDespachante,
            nroDespacho ? String(nroDespacho) : '',
            estadoCompuesto,
            tipoCompuesto,
            realizadoPor
        ].filter(function (v) { return !!String(v || '').trim(); });

        return restricted.length === 0 && !!fechaDesde && !!fechaHasta;
    }

    var persistMonthlyHistory = function (rows) {
        rows = rows || [];
        if (!shouldPersistMonthlyHistory()) {
            logCostoArticuloFull('[HIST] skip sessionId=' + sessionId + ' motivo=filtros_o_modo');
            return Promise.resolve(rows);
        }

        var periodParts = buildPeriodParts(fechaHasta || fechaDesde);
        var anioHist = Number(periodParts.anio || 0);
        var mesHist = Number(periodParts.mes || 0);
        var periodoHist = (periodo || buildPeriodoValue(periodParts) || '').trim();
        if (!anioHist || !mesHist || !periodoHist) {
            logCostoArticuloFull('[HIST] skip sessionId=' + sessionId + ' motivo=periodo_invalido');
            return Promise.resolve(rows);
        }

        var historyMap = {};
        rows.forEach(function (row) {
            var codArticuloHist = pickValue(row, ['cod_articulo'], '');
            var codReacondHist = pickValue(row, ['cod_pt_reacondicionado'], '');
            var histKey = [empresa, anioHist, mesHist, codArticuloHist, codReacondHist].join('|');
            historyMap[histKey] = row;
        });
        var historyRows = Object.keys(historyMap).map(function (key) {
            return historyMap[key];
        });

        var deleteParams = [empresa, anioHist, mesHist];
        var insertPrefix =
            "INSERT INTO dba.rpt_costo_articulo_full_hist (" +
            "cod_empresa, anio, mes, periodo, fecha_desde, fecha_hasta, cod_articulo, cod_pt_reacondicionado, des_art, " +
            "fob_usd_origen, porcentaje_costo_total_importacion, costo_total_us_actual, " +
            "servicio_clasificacion_director, servicio_clasificacion_proveedor, servicio_no_gr, estuche_gr, prospecto_gr, inkjet_gr, " +
            "sticker_sello_seguridad, solvente_celofane, total_costo_produccion_gs, total_costo_produccion_us, costo_total_final_us, " +
            "fecha_generacion, session_id, client_session_id" +
            ") VALUES ";

        function buildRowSql(row) {
            return "(" + [
                sqlValue(empresa),
                sqlValue(anioHist),
                sqlValue(mesHist),
                sqlValue(periodoHist),
                sqlValue(fechaDesde),
                sqlValue(fechaHasta),
                sqlValue(pickValue(row, ['cod_articulo'], '')),
                sqlValue(pickValue(row, ['cod_pt_reacondicionado'], '')),
                sqlValue(pickValue(row, ['des_art'], '')),
                sqlValue(roundNumber(pickValue(row, ['fob_usd_origen'], 0), 4)),
                sqlValue(roundNumber(pickValue(row, ['porcentaje_costo_total_importacion'], 0), 4)),
                sqlValue(roundNumber(pickValue(row, ['costo_total_us_actual'], 0), 4)),
                sqlValue(roundNumber(pickValue(row, ['servicio_clasificacion_director'], 0), 4)),
                sqlValue(roundNumber(pickValue(row, ['servicio_clasificacion_proveedor'], 0), 4)),
                sqlValue(roundNumber(pickValue(row, ['servicio_no_gr'], 0), 4)),
                sqlValue(roundNumber(pickValue(row, ['estuche_gr'], 0), 4)),
                sqlValue(roundNumber(pickValue(row, ['prospecto_gr'], 0), 4)),
                sqlValue(roundNumber(pickValue(row, ['inkjet_gr'], 0), 4)),
                sqlValue(roundNumber(pickValue(row, ['sticker_sello_seguridad'], 0), 4)),
                sqlValue(roundNumber(pickValue(row, ['solvente_celofane'], 0), 4)),
                sqlValue(roundNumber(pickValue(row, ['total_costo_produccion_gs'], 0), 4)),
                sqlValue(roundNumber(pickValue(row, ['total_costo_produccion_us'], 0), 4)),
                sqlValue(roundNumber(pickValue(row, ['costo_total_final_us'], 0), 4)),
                'CURRENT TIMESTAMP',
                sqlValue(sessionId),
                sqlValue(clientSessionId || '')
            ].join(', ') + ")";
        }

        logCostoArticuloFull('[HIST] begin empresa=' + empresa + ' periodo=' + periodoHist + ' rows=' + rows.length + ' unique_rows=' + historyRows.length + ' sessionId=' + sessionId);
        return conn.execAsync(
            "DELETE FROM dba.rpt_costo_articulo_full_hist WHERE cod_empresa = ? AND anio = ? AND mes = ?",
            deleteParams
        ).then(function () {
            var chunks = [];
            var chunkSize = 100;
            for (var i = 0; i < historyRows.length; i += chunkSize) {
                chunks.push(historyRows.slice(i, i + chunkSize));
            }
            return chunks.reduce(function (chain, chunk) {
                return chain.then(function () {
                    if (!chunk.length) return Promise.resolve();
                    var sql = insertPrefix + chunk.map(buildRowSql).join(', ');
                    return conn.execAsync(sql);
                });
            }, Promise.resolve());
        }).then(function () {
            logCostoArticuloFull('[HIST] ok empresa=' + empresa + ' periodo=' + periodoHist + ' rows=' + historyRows.length + ' sessionId=' + sessionId);
            return rows;
        }).catch(function (err) {
            logCostoArticuloFull('[HIST] error sessionId=' + sessionId + ' detalle=' + String(err && (err.message || err)));
            return rows;
        });
    };

        var loadTmpArticulo = function () {
        var artWhere =
            "FROM dba.articulo a " +
            "JOIN dba.tpoart ta ON ta.cod_tp_art = a.cod_tp_art " +
            "WHERE a.cod_empresa = ? " +
            "AND ta.ctrlexistencia = 'S' " +
            "AND COALESCE(ta.tpdef, 'S') = 'S' ";
        var artParams = [empresa];

        if (isEbcMaterialesMode) {
            artWhere += "AND a.cod_familia = '99' AND a.cod_grupo = '02' ";
        }

        if (tipo) {
            artWhere += "AND a.cod_tp_art = ? ";
            artParams.push(tipo);
        }
        if (estado && estado !== 'T') {
            artWhere += "AND a.estado = ? ";
            artParams.push(estado);
        }
        if (soloHijos) {
            artWhere += "AND COALESCE(a.codartpad, '') <> '' ";
        }
        artWhere += buildRangeFilter("a.cod_familia", incCodFamilia, false);
        artWhere += buildRangeFilter("a.cod_familia", excCodFamilia, true);
        artWhere += buildRangeFilter("a.cod_grupo", incCodGrupo, false);
        artWhere += buildRangeFilter("a.cod_grupo", excCodGrupo, true);
        artWhere += buildRangeFilter("a.cod_subgrupo", incCodSubgrupo, false);
        artWhere += buildRangeFilter("a.cod_subgrupo", excCodSubgrupo, true);
        artWhere += buildRangeFilter("a.cod_individual", incCodIndividual, false);
        artWhere += buildRangeFilter("a.cod_individual", excCodIndividual, true);
        if (articulo) {
            if (articulo.constructor === Array) {
                artWhere += "AND a.cod_articulo IN " + q.in(articulo) + " ";
            } else {
                artWhere += "AND a.cod_articulo = ? ";
                artParams.push(articulo);
            }
        }
        var artWhereSql = artWhere
            .replace("WHERE a.cod_empresa = ? ", "WHERE a.cod_empresa = " + sqlValue(empresa) + " ")
            .replace(/AND a\.cod_tp_art = \? /g, tipo ? ("AND a.cod_tp_art = " + sqlValue(tipo) + " ") : '')
            .replace(/AND a\.estado = \? /g, (estado && estado !== 'T') ? ("AND a.estado = " + sqlValue(estado) + " ") : '');
        if (articulo && articulo.constructor !== Array) {
            artWhereSql = artWhereSql.replace(/AND a\.cod_articulo = \? /g, "AND a.cod_articulo = " + sqlValue(articulo) + " ");
        }
        var countSql = "SELECT COUNT(DISTINCT a.cod_articulo) AS total " + artWhereSql;
        var insertSql =
            "INSERT INTO dba.tmparticulo(sessionid,cod_empresa,cod_articulo,des_art) " +
            "SELECT DISTINCT " + sqlValue(sessionId) + ", " + sqlValue(empresa) + ", a.cod_articulo, COALESCE(a.des_art, '') " +
            artWhereSql;

        return conn.execAsync(
            "DELETE FROM dba.tmparticulo WHERE sessionid = ? AND cod_empresa = ?",
            [sessionId, empresa]
        ).then(function () {
            return conn.execAsync(countSql);
        }).then(function (rows) {
            var total = 0;
            if (rows && rows.length) {
                total = Number(rows[0].total || rows[0].TOTAL || 0);
                if (isNaN(total)) total = 0;
            }
            if (!total) {
                return Promise.resolve();
            }
            return conn.execAsync(insertSql);
        }).then(function (result) {
            return result;
        });
    };

    var runRecall = function () {
        if (!recalcular) {
            return Promise.resolve();
        }

        var depSql =
            "SELECT d.cod_sucursal, d.cod_deposito " +
            "FROM dba.deposito d " +
            "WHERE d.cod_empresa = ? ";
        var depParams = [empresa];

        if (!calcularEmpresa) {
            depSql += "AND d.cod_sucursal = ? ";
            depParams.push(sucursal || '');
        }
        if (deposito) {
            depSql += "AND d.cod_deposito = ? ";
            depParams.push(deposito);
        }
        depSql += "ORDER BY d.cod_sucursal, d.cod_deposito";

        return conn.execAsync(depSql, depParams).then(function (deps) {
            deps = deps || [];
            if (!deps.length) return Promise.resolve();
            return deps.reduce(function (chain, dep) {
                return chain.then(function () {
                    return conn.execAsync(
                        "CALL dba.recall_existencia(?,?,?,?,?,?,?)",
                        [
                            sessionId,
                            empresa,
                            dep.cod_sucursal,
                            dep.cod_deposito,
                            fechaDesde || fechaHasta || null,
                            fechaHasta || fechaDesde || null,
                            mUpdArtDep
                        ]
                    );
                });
            }, Promise.resolve());
        });
    };

    var prepareEbcMaterialesTemps = function (fDesde, fHasta, fHastaRecall) {
        return loadTmpArticulo().then(function () {
            return conn.execAsync(
                "DELETE FROM dba.tmp_ebc_materiales_costo_aux WHERE fecha_ini = ? AND fecha_fin = ?",
                [fDesde, fHasta]
            );
        }).then(function () {
            return conn.execAsync(
                "DELETE FROM dba.tmp_cto_ult_dia_mes_ebc_materiales WHERE cod_empresa = ? AND fecha = ?",
                [empresa, fHasta]
            );
        }).then(function () {
            var recallProc = "CALL dba.Recall_Existencia_bago_ebc_rpt_materiales_Rpt(?,?,?,?)";
            logCostoArticuloFull('[EBC_MAT] PROC recall=' + recallProc + ' sessionId=' + sessionId);
            return conn.queryAsync(
                recallProc,
                [sessionId, empresa, '1901-01-01', fHastaRecall]
            );
        }).then(function () {
            return conn.queryAsync(
                "CALL dba.sp_tmp_ebc_materiales_Rpt(?,?,?,?)",
                [sessionId, empresa, fDesde, fHasta]
            );
        });
    };

    var runEbcMaterialesFull = function () {
        if (!useExtendedEbcMateriales) {
            return Promise.resolve(null);
        }

        var fDesde = fechaDesde || fechaHasta || null;
        var fHasta = fechaHasta || fechaDesde || null;
        if (!fDesde || !fHasta) {
            return Promise.resolve([]);
        }

        var fHastaRecall = (function () {
            var d = new Date(fDesde + 'T00:00:00');
            if (isNaN(d.getTime())) return fDesde;
            d.setDate(d.getDate() - 1);
            var y = d.getFullYear();
            var m = String(d.getMonth() + 1).padStart(2, '0');
            var day = String(d.getDate()).padStart(2, '0');
            return y + '-' + m + '-' + day;
        })();
        logCostoArticuloFull('[EBC_MAT_EXT] EMPRESAS empresa_materiales=' + empresa + ' empresa_despachos=' + empresaDespachos + ' sessionId=' + sessionId);

        var logExtStep = function (label, fn) {
            logCostoArticuloFull('[EBC_MAT_EXT] INICIO ' + label + ' sessionId=' + sessionId);
            var progressMapStart = {
                'limpieza temporales extendidos': 5,
                'preparacion materiales': 15,
                'buscar despachos por rango': 40,
                'Gen_Informe_Despacho por rango': 50,
                'sp_tmp_rpt_compuestos': 70,
                'lectura datasets extendidos': 85,
                'merge dataset final': 95
            };
            var progressMapDone = {
                'limpieza temporales extendidos': 10,
                'preparacion materiales': 35,
                'buscar despachos por rango': 45,
                'Gen_Informe_Despacho por rango': 65,
                'sp_tmp_rpt_compuestos': 80,
                'lectura datasets extendidos': 92,
                'merge dataset final': 99
            };
            reportProgress(label, progressMapStart[label] || 10, 'Procesando ' + label);
            return Promise.resolve().then(fn).then(function (result) {
                logCostoArticuloFull('[EBC_MAT_EXT] OK ' + label + ' sessionId=' + sessionId);
                reportProgress(label, progressMapDone[label] || 90, 'OK ' + label);
                return result;
            }).catch(function (err) {
                logCostoArticuloFull('[EBC_MAT_EXT] ERROR ' + label + ' sessionId=' + sessionId + ' detalle=' + (err && err.message ? err.message : err));
                throw err;
            });
        };

        var cleanupExtendedTemps = function () {
            return Promise.all([
                conn.execAsync(
                    "DELETE FROM dba.tmparticulo WHERE sessionid = ? AND cod_empresa = ?",
                    [sessionId, empresa]
                ),
                conn.execAsync(
                    "DELETE FROM dba.TmpRecallExistenciaEBC_Materiales WHERE SessionID = ?",
                    [sessionId]
                ),
                conn.execAsync(
                    "DELETE FROM dba.tmp_ExistenciaEBC_Materiales WHERE SessionID = ?",
                    [sessionId]
                ),
                conn.execAsync(
                    "DELETE FROM dba.tmp_ecuacion_bienes_cambio_materiales WHERE SessionID = ?",
                    [sessionId]
                ),
                conn.execAsync(
                    "DELETE FROM dba.tmp_ecuacion_bienes_cambio WHERE id = ?",
                    [sessionId]
                ),
                conn.execAsync(
                    "DELETE FROM dba.tmp_ebc_ipr_aux WHERE fecha_ini = ? AND fecha_fin = ?",
                    [fDesde, fHasta]
                ),
                conn.execAsync(
                    "DELETE FROM dba.TmpRecallExistenciaEBC WHERE SessionID = ?",
                    [sessionId]
                ),
                conn.execAsync(
                    "DELETE FROM dba.tmp_existencia WHERE id = ?",
                    [sessionId]
                )
            ]).then(function () {
                return [];
            });
        };

        var fetchDespachosInRange = function () {
            var sqlDesp =
                "SELECT DISTINCT d.anho, d.coddespachante, d.nrodespacho, DATE(d.fechadespacho) AS fechadespacho " +
                "FROM dba.despacho d " +
                "WHERE d.cod_empresa = ? " +
                "AND d.anho = ? " +
                "AND DATE(d.fechadespacho) BETWEEN ? AND ? ";
            var sqlDespParams = [empresaDespachos, anho, fDesde, fHasta];

            if (codDespachante) {
                sqlDesp += "AND d.coddespachante = ? ";
                sqlDespParams.push(codDespachante);
            }
            if (nroDespacho) {
                sqlDesp += "AND d.nrodespacho = ? ";
                sqlDespParams.push(nroDespacho);
            }

            sqlDesp += "ORDER BY d.anho, d.coddespachante, d.nrodespacho";
            return conn.execAsync(sqlDesp, sqlDespParams).then(function (rows) {
                rows = (rows || []).map(function (row) {
                    return {
                        anho: toNumber(pickValue(row, ['anho', 'Anho'], anho)),
                        cod_despachante: String(pickValue(row, ['coddespachante', 'CodDespachante'], '') || '').trim(),
                        nro_despacho: toNumber(pickValue(row, ['nrodespacho', 'NroDespacho'], 0)),
                        fecha_despacho: pickValue(row, ['fechadespacho', 'FechaDespacho'], '')
                    };
                }).filter(function (row) {
                    return row.cod_despachante && row.nro_despacho;
                });
                var effectiveDespachoLimit = despachoLimit > 0 ? despachoLimit : 0;
                if (effectiveDespachoLimit > 0 && rows.length > effectiveDespachoLimit) {
                    rows = rows.slice(0, effectiveDespachoLimit);
                }
                logCostoArticuloFull(
                    '[EBC_MAT_EXT] despachos_encontrados=' + rows.length +
                    ' sessionId=' + sessionId +
                    (rows.length ? ' primero=' + rows[0].cod_despachante + '/' + rows[0].nro_despacho : '')
                );
                return rows;
            });
        };

        var runDespachosImportacion = function (despachos) {
            var procGenInformeRpt = "CALL dba.Gen_Informe_Despacho_Rpt(?,?,?,?,?,?,?,?)";
            despachos = despachos || [];
            if (!despachos.length) {
                logCostoArticuloFull('[EBC_MAT_EXT] SIN despachos en rango sessionId=' + sessionId + ' desde=' + fDesde + ' hasta=' + fHasta);
                return Promise.resolve([]);
            }
            return despachos.reduce(function (chain, despacho) {
                return chain.then(function (results) {
                    return conn.queryAsync(
                        procGenInformeRpt,
                        [
                            sessionId,
                            empresaDespachos,
                            periodo,
                            despacho.anho || anho,
                            despacho.cod_despachante,
                            despacho.nro_despacho,
                            cierre,
                            tipoDespacho
                        ]
                    ).catch(function (err) {
                        if (err && /Gen_Informe_Despacho(?:_[A-Za-z]+)?_Rpt/i.test(String(err.message || err))) {
                            var missingProcError = new Error(
                                "Falta catalogar en la base los procedimientos de reporte del despacho " +
                                "(DBA.Gen_Informe_Despacho_Rpt y sus variantes *_Rpt). " +
                                "Revise el script SQL en multisoft_informes/server/multisoft/sql/Gen_Informe_Despacho_Rpt.sql"
                            );
                            missingProcError.cause = err;
                            throw missingProcError;
                        }
                        throw err;
                    }).then(function () {
                        results.push(despacho);
                        return results;
                    });
                });
            }, Promise.resolve([]));
        };

        var rebuildTmpDespachosCosts = function () {
            var sqlCostoTotal =
                "UPDATE dba.tmpdespachos AS t1 " +
                "SET " +
                "  CostoTotal = ( " +
                "    SELECT IFNULL(SUM(ROUND(COALESCE(t2.Prorrateo,0),0)),0,SUM(ROUND(COALESCE(t2.Prorrateo,0),0))) " +
                "    FROM dba.tmpdespachos t2 " +
                "    WHERE t1.Session_ID = t2.Session_ID " +
                "      AND t1.Cod_Empresa = t2.Cod_Empresa " +
                "      AND t1.NroFact = t2.NroFact " +
                "      AND t1.Cod_Articulo = t2.Cod_Articulo " +
                "    GROUP BY t2.Cod_Articulo " +
                "  ), " +
                "  CostoTotalME = ( " +
                "    SELECT IFNULL(SUM(ROUND(COALESCE(t2.ProrrateoME,0),4)),0,SUM(ROUND(COALESCE(t2.ProrrateoME,0),4))) " +
                "    FROM dba.tmpdespachos t2 " +
                "    WHERE t1.Session_ID = t2.Session_ID " +
                "      AND t1.Cod_Empresa = t2.Cod_Empresa " +
                "      AND t1.NroFact = t2.NroFact " +
                "      AND t1.Cod_Articulo = t2.Cod_Articulo " +
                "    GROUP BY t2.Cod_Articulo " +
                "  ) " +
                "WHERE t1.Session_ID = ? " +
                "  AND t1.Cod_Empresa = ?";

            var sqlCostoUnitario =
                "UPDATE dba.tmpdespachos AS t1 " +
                "SET " +
                "  CostoUnitario = ROUND( " +
                "    CostoTotal / ( " +
                "      SELECT SUM(COALESCE(t2.Cantidad,0)) " +
                "      FROM dba.tmpdespachos t2 " +
                "      WHERE t1.Session_ID = t2.Session_ID " +
                "        AND t1.Cod_Empresa = t2.Cod_Empresa " +
                "        AND t1.NroFact = t2.NroFact " +
                "        AND t1.Cod_Articulo = t2.Cod_Articulo " +
                "        AND t2.Cantidad > 0 " +
                "      GROUP BY t2.Cod_Articulo " +
                "    ), 0 " +
                "  ), " +
                "  CostoUnitarioME = ROUND( " +
                "    CostoTotalME / ( " +
                "      SELECT SUM(COALESCE(t2.Cantidad,0)) " +
                "      FROM dba.tmpdespachos t2 " +
                "      WHERE t1.Session_ID = t2.Session_ID " +
                "        AND t1.Cod_Empresa = t2.Cod_Empresa " +
                "        AND t1.NroFact = t2.NroFact " +
                "        AND t1.Cod_Articulo = t2.Cod_Articulo " +
                "        AND t2.Cantidad > 0 " +
                "      GROUP BY t2.Cod_Articulo " +
                "    ), 4 " +
                "  ) " +
                "WHERE t1.Session_ID = ? " +
                "  AND t1.Cod_Empresa = ?";

            return conn.queryAsync(sqlCostoTotal, [sessionId, empresaDespachos]).then(function () {
                return conn.queryAsync(sqlCostoUnitario, [sessionId, empresaDespachos]);
            }).then(function () {
            });
        };

        var debugTmpDespachosSnapshot = function () {
            var sqlDebug =
                "SELECT TOP 60 cod_articulo, nrofact, tipoitem, total, totalme, prorrateo, prorrateome, factcambio " +
                "FROM dba.tmpdespachos " +
                "WHERE session_id = ? " +
                "AND cod_empresa = ? " +
                "AND tipoitem IN ('AR','GI','TG','LD','TL') " +
                "ORDER BY cod_articulo, nrofact, tipoitem";

            return conn.execAsync(sqlDebug, [sessionId, empresaDespachos]).then(function (rows) {
                rows = rows || [];
                logCostoArticuloFull('[EBC_MAT_EXT] TMPDESPACHOS rows=' + rows.length + ' sessionId=' + sessionId);
            }).catch(function (err) {
                logCostoArticuloFull('[EBC_MAT_EXT] TMPDESPACHOS ERROR sessionId=' + sessionId + ' detalle=' + String(err && (err.message || err)));
            });
        };

        var fetchBaseImportacion = function () {
            var sqlImport =
                "SELECT DISTINCT " +
                "t.session_id, t.cod_empresa, t.codprov, t.cod_articulo, COALESCE(NULLIF(a.codartpad,''), t.cod_articulo) AS cod_art_pad, " +
                "COALESCE(ap.des_art, a.des_art, t.descrip) AS des_art_padre, " +
                "t.nrofact, t.descrip, t.cantidad, t.canttotal, t.prorrateo, t.prorrateome, " +
                "t.costounitario AS tmp_costo_unitario_raw, t.costounitariome AS tmp_costo_unitario_me_raw, " +
                "t.costototal AS tmp_costo_total_raw, t.costototalme AS tmp_costo_total_me_raw, " +
                "t.preciounitme AS costo_fob_us, " +
                "COALESCE(t.costounitariome, 0) AS costo_cif_us, " +
                "COALESCE(fd.peso,0) AS peso, COALESCE(fd.porcarancelario,0) AS porcarancelario, COALESCE(fd.iva,0) AS iva, " +
                "(SELECT IFNULL(SUM(t2.prorrateo), 0, SUM(t2.prorrateo)) " +
                " FROM dba.tmpdespachos t2 " +
                " WHERE t2.session_id = t.session_id " +
                " AND t2.cod_empresa = t.cod_empresa " +
                " AND t2.cod_articulo = t.cod_articulo " +
                " AND t2.tipoitem IN ('GI', 'TG')) AS total_gastos, " +
                "(SELECT IFNULL(SUM(CASE " +
                "   WHEN COALESCE(t2.prorrateome,0) <> 0 THEN t2.prorrateome " +
                "   WHEN COALESCE(t2.factcambio,0) <> 0 THEN t2.prorrateo / t2.factcambio " +
                "   ELSE 0 END), 0, " +
                "   SUM(CASE " +
                "   WHEN COALESCE(t2.prorrateome,0) <> 0 THEN t2.prorrateome " +
                "   WHEN COALESCE(t2.factcambio,0) <> 0 THEN t2.prorrateo / t2.factcambio " +
                "   ELSE 0 END)) " +
                " FROM dba.tmpdespachos t2 " +
                " WHERE t2.session_id = t.session_id " +
                " AND t2.cod_empresa = t.cod_empresa " +
                " AND t2.cod_articulo = t.cod_articulo " +
                " AND t2.tipoitem IN ('GI', 'TG')) AS total_gastos_me, " +
                "(SELECT IFNULL(SUM(t2.prorrateo), 0, SUM(t2.prorrateo)) " +
                " FROM dba.tmpdespachos t2 " +
                " WHERE t2.session_id = t.session_id " +
                " AND t2.cod_empresa = t.cod_empresa " +
                " AND t2.cod_articulo = t.cod_articulo " +
                " AND t2.tipoitem IN ('LD', 'TL') " +
                " AND COALESCE(t2.tpdefarancel,'') <> 'E') AS total_aranceles, " +
                "(SELECT IFNULL(SUM(CASE " +
                "   WHEN COALESCE(t2.prorrateome,0) <> 0 THEN t2.prorrateome " +
                "   WHEN COALESCE(t2.factcambio,0) <> 0 THEN t2.prorrateo / t2.factcambio " +
                "   ELSE 0 END), 0, " +
                "   SUM(CASE " +
                "   WHEN COALESCE(t2.prorrateome,0) <> 0 THEN t2.prorrateome " +
                "   WHEN COALESCE(t2.factcambio,0) <> 0 THEN t2.prorrateo / t2.factcambio " +
                "   ELSE 0 END)) " +
                " FROM dba.tmpdespachos t2 " +
                " WHERE t2.session_id = t.session_id " +
                " AND t2.cod_empresa = t.cod_empresa " +
                " AND t2.cod_articulo = t.cod_articulo " +
                " AND t2.tipoitem IN ('LD', 'TL') " +
                " AND COALESCE(t2.tpdefarancel,'') <> 'E') AS total_aranceles_me, " +
                "(SELECT IFNULL(SUM(t2.prorrateo), 0, SUM(t2.prorrateo)) " +
                " FROM dba.tmpdespachos t2 " +
                " WHERE t2.session_id = t.session_id " +
                " AND t2.cod_empresa = t.cod_empresa " +
                " AND t2.cod_articulo = t.cod_articulo " +
                " AND t2.tipoitem = 'LD' " +
                " AND COALESCE(t2.tpdefarancel,'') = 'E') AS total_tributo_aduanero, " +
                "(SELECT IFNULL(SUM(CASE " +
                "   WHEN COALESCE(t2.prorrateome,0) <> 0 THEN t2.prorrateome " +
                "   WHEN COALESCE(t2.factcambio,0) <> 0 THEN t2.prorrateo / t2.factcambio " +
                "   ELSE 0 END), 0, " +
                "   SUM(CASE " +
                "   WHEN COALESCE(t2.prorrateome,0) <> 0 THEN t2.prorrateome " +
                "   WHEN COALESCE(t2.factcambio,0) <> 0 THEN t2.prorrateo / t2.factcambio " +
                "   ELSE 0 END)) " +
                " FROM dba.tmpdespachos t2 " +
                " WHERE t2.session_id = t.session_id " +
                " AND t2.cod_empresa = t.cod_empresa " +
                " AND t2.cod_articulo = t.cod_articulo " +
                " AND t2.tipoitem = 'LD' " +
                " AND COALESCE(t2.tpdefarancel,'') = 'E') AS total_tributo_aduanero_me " +
                "FROM dba.tmpdespachos t " +
                "LEFT JOIN dba.factdet fd " +
                "  ON t.cod_empresa = fd.cod_empresa " +
                " AND t.codprov = fd.codprov " +
                " AND t.cod_tp_comp = fd.cod_tp_comp " +
                " AND t.nrofact = fd.nrofact " +
                " AND t.cod_articulo = fd.cod_articulo " +
                "LEFT JOIN dba.articulo a " +
                "  ON a.cod_empresa = t.cod_empresa " +
                " AND a.cod_articulo = t.cod_articulo " +
                "LEFT JOIN dba.articulo ap " +
                "  ON ap.cod_empresa = a.cod_empresa " +
                " AND ap.cod_articulo = a.codartpad " +
                "WHERE t.cod_empresa = ? " +
                "AND t.session_id = ? " +
                "AND t.tipoitem = 'AR' ";
            var sqlImportParams = [empresaDespachos, sessionId];

            if (articulo) {
                if (articulo.constructor === Array) {
                    sqlImport += "AND t.cod_articulo IN " + q.in(articulo) + " ";
                } else {
                    sqlImport += "AND t.cod_articulo = ? ";
                    sqlImportParams.push(articulo);
                }
            }

            sqlImport += "ORDER BY t.cod_articulo, t.nrofact";
            return conn.execAsync(sqlImport, sqlImportParams);
        };

        var acondEmpresaFuente = empresa;

        var fetchAcondicionamientoPorEmpresa = function (empresaAcond) {
            var sqlComp =
                "SELECT c.cod_empresa, c.cod_tp_comp, c.nroordprod, c.fechainicio, c.fechafin, " +
                "c.cod_articulo_remitido, c.cod_articulo_acondicionado, c.des_art_acondicionado, " +
                "COALESCE(NULLIF(ar.codartpad,''), c.cod_articulo_remitido) AS cod_art_pad_remitido, " +
                "COALESCE(NULLIF(aa.codartpad,''), c.cod_articulo_acondicionado) AS cod_art_pad_acondicionado, " +
                "c.cant_articulo_acondicionado, c.cant_articulo_remitido, c.cant_activ_colocacion, " +
                "c.pr_unit_acondicionado, c.pr_unit_activ_colocacion, " +
                "c.cant_estuche, c.cto_unit_prom_estuche, " +
                "c.cant_sticker, c.cto_unit_prom_sticker, " +
                "c.cant_estampilla, c.cto_unit_prom_estampilla, " +
                "c.cant_prospecto, c.cto_unit_prom_prospecto, " +
                "c.cant_etiqueta, c.cto_unit_prom_etiqueta, " +
                "c.cant_ampolla, c.cto_unit_prom_ampolla, " +
                "c.cant_sello, c.cto_unit_prom_sello, " +
                "c.cant_cuchara, c.cto_unit_prom_cuchara, " +
                "c.realizadopor " +
                "FROM dba.tmp_rpt_compuestos c " +
                "LEFT JOIN dba.articulo ar " +
                "  ON ar.cod_empresa = c.cod_empresa " +
                " AND ar.cod_articulo = c.cod_articulo_remitido " +
                "LEFT JOIN dba.articulo aa " +
                "  ON aa.cod_empresa = c.cod_empresa " +
                " AND aa.cod_articulo = c.cod_articulo_acondicionado " +
                "WHERE c.SessionID = ? AND c.cod_empresa = ?";
            return conn.execAsync(sqlComp, [sessionId, empresaAcond]);
        };

        var fetchBaseAcondicionamiento = function () {
            var sqlCompAll =
                "SELECT c.cod_empresa, c.cod_tp_comp, c.nroordprod, c.fechainicio, c.fechafin, " +
                "c.cod_articulo_remitido, c.cod_articulo_acondicionado, c.des_art_acondicionado, " +
                "COALESCE(NULLIF(ar.codartpad,''), c.cod_articulo_remitido) AS cod_art_pad_remitido, " +
                "COALESCE(NULLIF(aa.codartpad,''), c.cod_articulo_acondicionado) AS cod_art_pad_acondicionado, " +
                "c.cant_articulo_acondicionado, c.cant_articulo_remitido, c.cant_activ_colocacion, " +
                "c.pr_unit_acondicionado, c.pr_unit_activ_colocacion, " +
                "c.cant_estuche, c.cto_unit_prom_estuche, " +
                "c.cant_sticker, c.cto_unit_prom_sticker, " +
                "c.cant_estampilla, c.cto_unit_prom_estampilla, " +
                "c.cant_prospecto, c.cto_unit_prom_prospecto, " +
                "c.cant_etiqueta, c.cto_unit_prom_etiqueta, " +
                "c.cant_ampolla, c.cto_unit_prom_ampolla, " +
                "c.cant_sello, c.cto_unit_prom_sello, " +
                "c.cant_cuchara, c.cto_unit_prom_cuchara, " +
                "c.realizadopor " +
                "FROM dba.tmp_rpt_compuestos c " +
                "LEFT JOIN dba.articulo ar " +
                "  ON ar.cod_empresa = c.cod_empresa " +
                " AND ar.cod_articulo = c.cod_articulo_remitido " +
                "LEFT JOIN dba.articulo aa " +
                "  ON aa.cod_empresa = c.cod_empresa " +
                " AND aa.cod_articulo = c.cod_articulo_acondicionado " +
                "WHERE c.SessionID = ?";
            return conn.execAsync(sqlCompAll, [sessionId]).then(function (rows) {
                rows = rows || [];
                if (rows.length) {
                    var fuenteMap = {};
                    rows.forEach(function (row) {
                        var codEmpresa = pickValue(row, ['cod_empresa'], '') || '';
                        fuenteMap[codEmpresa] = true;
                    });
                    acondEmpresaFuente = Object.keys(fuenteMap).filter(Boolean).join(',') || 'SESSION';
                    return rows;
                }
                return fetchAcondicionamientoPorEmpresa(empresa).then(function (empresaRows) {
                    if ((empresaRows || []).length || empresaDespachos === empresa) {
                        acondEmpresaFuente = empresa;
                        return empresaRows || [];
                    }
                    return fetchAcondicionamientoPorEmpresa(empresaDespachos).then(function (fallbackRows) {
                        acondEmpresaFuente = empresaDespachos;
                        return fallbackRows || [];
                    });
                });
            });
        };

        var fetchBaseMateriales = function () {
            var costoExpr =
                "CASE " +
                "WHEN COALESCE(t.unidad_inventario_inicial,0) + COALESCE(t.unidad_compras,0) = 0 THEN 0 " +
                "ELSE (COALESCE(t.cmp_sub_costo_total_inv_ini,0) + COALESCE(t.total_compras,0)) / " +
                "(COALESCE(t.unidad_inventario_inicial,0) + COALESCE(t.unidad_compras,0)) " +
                "END";
            var sqlMat =
                "SELECT t.sessionid, t.cod_empresa, t.cod_articulo, a.des_art, " +
                costoExpr + " AS cmp_costo_ut_rep " +
                "FROM dba.tmp_ecuacion_bienes_cambio_materiales t " +
                "JOIN dba.articulo a ON a.cod_empresa = t.cod_empresa AND a.cod_articulo = t.cod_articulo " +
                "WHERE t.sessionid = ? AND t.cod_empresa = ? " +
                "ORDER BY t.cod_articulo";
            return conn.execAsync(sqlMat, [sessionId, empresa]).catch(function () {
                return [];
            });
        };

        var debugBaseMateriales = function () {
            return Promise.all([
                conn.execAsync(
                    "SELECT COUNT(*) AS total FROM dba.tmp_ExistenciaEBC_Materiales WHERE SessionID = ? AND cod_empresa = ?",
                    [sessionId, empresa]
                ),
                conn.execAsync(
                    "SELECT COUNT(*) AS total FROM dba.tmp_ecuacion_bienes_cambio_materiales WHERE SessionID = ? AND cod_empresa = ?",
                    [sessionId, empresa]
                ),
                conn.execAsync(
                    "SELECT COUNT(*) AS total " +
                    "FROM dba.tmp_ecuacion_bienes_cambio_materiales t " +
                    "JOIN dba.articulo a ON a.cod_empresa = t.cod_empresa AND a.cod_articulo = t.cod_articulo " +
                    "WHERE t.sessionid = ? AND t.cod_empresa = ?",
                    [sessionId, empresa]
                )
            ]).then(function (res) {
                var exist = toNumber(pickValue((res[0] || [])[0], ['total', 'Total'], 0));
                var ebc = toNumber(pickValue((res[1] || [])[0], ['total', 'Total'], 0));
                var base = toNumber(pickValue((res[2] || [])[0], ['total', 'Total'], 0));
                logCostoArticuloFull('[EBC_MAT_EXT] BASE_MATERIALES tmp_existencia=' + exist + ' tmp_ebc=' + ebc + ' base=' + base + ' sessionId=' + sessionId);
                return [];
            }).catch(function (err) {
                logCostoArticuloFull('[EBC_MAT_EXT] BASE_MATERIALES ERROR sessionId=' + sessionId + ' detalle=' + String(err && (err.message || err)));
                return [];
            });
        };

        var debugTmpRptCompuestos = function () {
            return conn.execAsync(
                "SELECT cod_empresa, COUNT(*) AS rows " +
                "FROM dba.tmp_rpt_compuestos " +
                "WHERE SessionID = ? " +
                "GROUP BY cod_empresa " +
                "ORDER BY cod_empresa",
                [sessionId]
            ).then(function (rows) {
                logCostoArticuloFull('[EBC_MAT_EXT] TMP_RPT_COMPUESTOS rows=' + JSON.stringify(rows || []) + ' sessionId=' + sessionId);
                return null;
            }).catch(function (err) {
                logCostoArticuloFull('[EBC_MAT_EXT] TMP_RPT_COMPUESTOS ERROR sessionId=' + sessionId + ' detalle=' + String(err && (err.message || err)));
                return null;
            });
        };

        var fetchFactorCambioMes = function () {
            var sql =
                "SELECT TOP 1 DATE(f.fact_fecha) AS fecha, COALESCE(NULLIF(f.factor_vendedor,0), f.factor, 0) AS factor " +
                "FROM dba.factcamb f " +
                "WHERE f.codmoneda = 'US' " +
                "AND f.cod_empresa = ? " +
                "AND DATE(f.fact_fecha) <= ? " +
                "ORDER BY DATE(f.fact_fecha) DESC";
            return conn.execAsync(sql, [empresa, fHasta]).then(function (rows) {
                rows = rows || [];
                var row = rows[0] || {};
                var factor = toNumber(pickValue(row, ['factor', 'Factor'], 0));
                logCostoArticuloFull('[EBC_MAT_EXT] FACTCAMB factor=' + factor + ' fecha=' + pickValue(row, ['fecha', 'fact_fecha'], '') + ' sessionId=' + sessionId);
                return factor;
            }).catch(function (err) {
                logCostoArticuloFull('[EBC_MAT_EXT] FACTCAMB ERROR sessionId=' + sessionId + ' detalle=' + String(err && (err.message || err)));
                return 0;
            });
        };

        var fetchLiquidacionDistribuida = function () {
            var sqlLiq =
                "SELECT art.cod_art_pad, " +
                "  SUM(CASE " +
                "    WHEN liq.TpDef = 'I' THEN liq.iva_me * art.participacion " +
                "    WHEN liq.TpDef = 'A' AND liq.Af_Costos = 'S' THEN liq.iva_me * art.participacion " +
                "    ELSE 0 END) AS gastos_me, " +
                "  SUM(CASE " +
                "    WHEN liq.TpDef = 'A' AND liq.Af_Costos = 'S' THEN liq.total_me * art.participacion " +
                "    ELSE 0 END) AS aranceles_me, " +
                "  SUM(CASE " +
                "    WHEN liq.TpDef = 'R' THEN liq.total_me * art.participacion " +
                "    WHEN liq.TpDef NOT IN ('A','I') AND liq.Af_Costos = 'S' THEN liq.total_me * art.participacion " +
                "    ELSE 0 END) AS otros_me " +
                "FROM ( " +
                "  SELECT t.nrofact, COALESCE(NULLIF(ap.codartpad,''), t.cod_articulo) AS cod_art_pad, " +
                "         SUM(COALESCE(t.prorrateome,0)) AS art_prorrateome, " +
                "         CASE " +
                "           WHEN COALESCE(ft.total_prorrateome,0) <> 0 THEN SUM(COALESCE(t.prorrateome,0)) / ft.total_prorrateome " +
                "           ELSE 0 END AS participacion " +
                "  FROM dba.tmpdespachos t " +
                "  LEFT JOIN dba.articulo ap " +
                "    ON ap.cod_empresa = t.cod_empresa " +
                "   AND ap.cod_articulo = t.cod_articulo " +
                "  JOIN ( " +
                "    SELECT nrofact, SUM(COALESCE(prorrateome,0)) AS total_prorrateome " +
                "    FROM dba.tmpdespachos " +
                "    WHERE session_id = ? AND cod_empresa = ? AND tipoitem = 'AR' " +
                "    GROUP BY nrofact " +
                "  ) ft ON ft.nrofact = t.nrofact " +
                "  WHERE t.session_id = ? " +
                "    AND t.cod_empresa = ? " +
                "    AND t.tipoitem = 'AR' " +
                "  GROUP BY t.nrofact, COALESCE(NULLIF(ap.codartpad,''), t.cod_articulo), ft.total_prorrateome " +
                ") art " +
                "JOIN ( " +
                "  SELECT x.nrofact, a.TpDef, l.Af_Costos, " +
                "         SUM(CASE " +
                "           WHEN COALESCE(x.factcambio,0) <> 0 THEN COALESCE(l.TotalAplicado,0) / x.factcambio " +
                "           ELSE 0 END) AS total_me " +
                "       , SUM(CASE " +
                "           WHEN COALESCE(x.factcambio,0) <> 0 THEN COALESCE(l.IVA,0) / x.factcambio " +
                "           ELSE 0 END) AS iva_me " +
                "  FROM ( " +
                "    SELECT DISTINCT nrofact, coddespachante, nrodespacho, factcambio " +
                "    FROM dba.tmpdespachos " +
                "    WHERE session_id = ? AND cod_empresa = ? AND tipoitem = 'AR' " +
                "  ) x " +
                "  JOIN dba.Liquidacion l " +
                "    ON l.Cod_Empresa = ? " +
                "   AND l.Anho = ? " +
                "   AND l.CodDespachante = x.coddespachante " +
                "   AND l.NroDespacho = x.nrodespacho " +
                "  JOIN dba.Aranceles a " +
                "    ON a.Cod_Empresa = l.Cod_Empresa " +
                "   AND a.CodArancel = l.CodArancel " +
                "  GROUP BY x.nrofact, a.TpDef, l.Af_Costos " +
                ") liq ON liq.nrofact = art.nrofact " +
                "GROUP BY art.cod_art_pad";

            return conn.execAsync(sqlLiq, [sessionId, empresaDespachos, sessionId, empresaDespachos, sessionId, empresaDespachos, empresaDespachos, anho]).then(function (rows) {
                rows = rows || [];
                logCostoArticuloFull('[EBC_MAT_EXT] LIQUIDACION_DISTRIBUIDA rows=' + rows.length + ' sessionId=' + sessionId);
                return rows;
            }).catch(function (err) {
                logCostoArticuloFull('[EBC_MAT_EXT] LIQUIDACION_DISTRIBUIDA ERROR sessionId=' + sessionId + ' detalle=' + String(err && (err.message || err)));
                return [];
            });
        };

        var fetchGastosFacturaObjetivoDetalle = function () {
            var sqlObjetivo =
                "WITH art AS ( " +
                "  SELECT t.nrofact, COALESCE(NULLIF(ap.codartpad,''), t.cod_articulo) AS cod_art_pad, " +
                "         SUM(COALESCE(t.prorrateome,0)) AS art_prorrateome, " +
                "         CASE WHEN COALESCE(ft.total_prorrateome,0) <> 0 " +
                "              THEN SUM(COALESCE(t.prorrateome,0)) / ft.total_prorrateome " +
                "              ELSE 0 END AS participacion " +
                "  FROM dba.tmpdespachos t " +
                "  LEFT JOIN dba.articulo ap ON ap.cod_empresa = t.cod_empresa AND ap.cod_articulo = t.cod_articulo " +
                "  JOIN ( " +
                "    SELECT nrofact, SUM(COALESCE(prorrateome,0)) AS total_prorrateome " +
                "    FROM dba.tmpdespachos " +
                "    WHERE session_id = ? AND cod_empresa = ? AND tipoitem = 'AR' " +
                "    GROUP BY nrofact " +
                "  ) ft ON ft.nrofact = t.nrofact " +
                "  WHERE t.session_id = ? AND t.cod_empresa = ? AND t.tipoitem = 'AR' " +
                "    AND t.nrofact = '10000000003' " +
                "    AND COALESCE(NULLIF(ap.codartpad,''), t.cod_articulo) IN ('BG076','BG077') " +
                "  GROUP BY t.nrofact, COALESCE(NULLIF(ap.codartpad,''), t.cod_articulo), ft.total_prorrateome " +
                "), imp AS ( " +
                "  SELECT DISTINCT coddespachante, nrodespacho, codprov, cod_tp_comp, nrofact " +
                "  FROM dba.tmpdespachos " +
                "  WHERE session_id = ? AND cod_empresa = ? AND tipoitem = 'AR' AND nrofact = '10000000003' " +
                "), gastos AS ( " +
                "  SELECT fc.NroFact AS gasto_nrofact, fd.Linea AS gasto_linea, a.Des_Art AS gasto_desc, " +
                "         fc.CodProv AS gasto_codprov, fc.Cod_Tp_Comp AS gasto_cod_tp_comp, " +
                "         fc.FechaFact, fc.IVAIncluido, fc.CodMoneda, fc.FactCambio, " +
                "         COALESCE(df.TotalAplicado,0) AS despacho_total_aplicado_gs, " +
                "         COALESCE(df.PorcAplicado,0) AS despacho_porc_aplicado, " +
                "         COALESCE((SELECT SUM(fd2.Cantidad*fd2.Pr_Unit) FROM FactDet fd2 " +
                "                   WHERE fd2.Cod_Empresa = fd.Cod_Empresa AND fd2.CodProv = fd.CodProv " +
                "                     AND fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp AND fd2.NroFact = fd.NroFact " +
                "                     AND fd2.Linea = fd.Linea AND fd2.GravExen = 'E'),0) AS total_exen_gs, " +
                "         COALESCE((SELECT SUM(fd2.Cantidad*fd2.Pr_Unit) FROM FactDet fd2 " +
                "                   WHERE fd2.Cod_Empresa = fd.Cod_Empresa AND fd2.CodProv = fd.CodProv " +
                "                     AND fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp AND fd2.NroFact = fd.NroFact " +
                "                     AND fd2.Linea = fd.Linea AND fd2.GravExen = 'G'),0) AS total_grav_gs, " +
                "         COALESCE((SELECT SUM(fd2.IVA) FROM FactDet fd2 " +
                "                   WHERE fd2.Cod_Empresa = fd.Cod_Empresa AND fd2.CodProv = fd.CodProv " +
                "                     AND fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp AND fd2.NroFact = fd.NroFact " +
                "                     AND fd2.Linea = fd.Linea),0) AS total_iva_gs, " +
                "         COALESCE((SELECT SUM(fd2.Cantidad*fd2.Pr_Unit) FROM FactDet fd2 " +
                "                   WHERE fd2.Cod_Empresa = fd.Cod_Empresa AND fd2.CodProv = fd.CodProv " +
                "                     AND fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp AND fd2.NroFact = fd.NroFact " +
                "                     AND fd2.EsGasto = 'S' AND fd2.GravExen = 'E'),0) AS fact_total_exen_gs, " +
                "         COALESCE((SELECT SUM(fd2.Cantidad*fd2.Pr_Unit) FROM FactDet fd2 " +
                "                   WHERE fd2.Cod_Empresa = fd.Cod_Empresa AND fd2.CodProv = fd.CodProv " +
                "                     AND fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp AND fd2.NroFact = fd.NroFact " +
                "                     AND fd2.EsGasto = 'S' AND fd2.GravExen = 'G'),0) AS fact_total_grav_gs, " +
                "         COALESCE((SELECT SUM(fd2.IVA) FROM FactDet fd2 " +
                "                   WHERE fd2.Cod_Empresa = fd.Cod_Empresa AND fd2.CodProv = fd.CodProv " +
                "                     AND fd2.Cod_Tp_Comp = fd.Cod_Tp_Comp AND fd2.NroFact = fd.NroFact " +
                "                     AND fd2.EsGasto = 'S'),0) AS fact_total_iva_gs, " +
                "         CASE WHEN EXISTS ( " +
                "                SELECT 1 FROM FactGastosImp fgi " +
                "                JOIN imp i ON i.codprov = fgi.CodProvImp AND i.nrofact = fgi.NroFactImp " +
                "                WHERE fgi.Cod_Empresa = fc.Cod_Empresa AND fgi.CodProv = fc.CodProv " +
                "                  AND fgi.Cod_Tp_Comp = fc.Cod_Tp_Comp AND fgi.NroFact = fc.NroFact " +
                "              ) THEN 'S' ELSE 'N' END AS vinculado_factura_objetivo " +
                "  FROM imp i " +
                "  JOIN DespFact df ON df.Cod_Empresa = ? AND df.Anho = ? AND df.CodDespachante = i.coddespachante AND df.NroDespacho = i.nrodespacho " +
                "  JOIN FactCab fc ON fc.Cod_Empresa = df.Cod_Empresa AND fc.CodProv = df.CodProv AND fc.Cod_Tp_Comp = df.Cod_Tp_Comp AND fc.NroFact = df.NroFact " +
                "  JOIN FactDet fd ON fd.Cod_Empresa = fc.Cod_Empresa AND fd.CodProv = fc.CodProv AND fd.Cod_Tp_Comp = fc.Cod_Tp_Comp AND fd.NroFact = fc.NroFact " +
                "  JOIN Articulo a ON a.Cod_Empresa = fd.Cod_Empresa AND a.Cod_Articulo = fd.Cod_Articulo " +
                "  WHERE fc.TipoCompra = 'I' AND fc.CostoGasto = 'G' AND fd.EsGasto = 'S' " +
                "    AND ( EXISTS ( " +
                "            SELECT 1 FROM FactGastosImp fgi " +
                "            WHERE fgi.Cod_Empresa = fc.Cod_Empresa AND fgi.CodProv = fc.CodProv " +
                "              AND fgi.Cod_Tp_Comp = fc.Cod_Tp_Comp AND fgi.NroFact = fc.NroFact " +
                "              AND fgi.CodProvImp = i.codprov AND fgi.NroFactImp = i.nrofact " +
                "          ) " +
                "       OR NOT EXISTS ( " +
                "            SELECT 1 FROM FactGastosImp fgi " +
                "            WHERE fgi.Cod_Empresa = fc.Cod_Empresa AND fgi.CodProv = fc.CodProv " +
                "              AND fgi.Cod_Tp_Comp = fc.Cod_Tp_Comp AND fgi.NroFact = fc.NroFact " +
                "          )) " +
                ") " +
                "SELECT art.nrofact, art.cod_art_pad, art.participacion, " +
                "       g.gasto_nrofact, g.gasto_linea, g.gasto_desc, g.vinculado_factura_objetivo, " +
                "       g.despacho_total_aplicado_gs, g.despacho_porc_aplicado, " +
                "       g.total_exen_gs, g.total_grav_gs, g.total_iva_gs, " +
                "       g.fact_total_exen_gs, g.fact_total_grav_gs, g.fact_total_iva_gs, " +
                "       CASE WHEN g.IVAIncluido = 'S' " +
                "            THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) " +
                "            ELSE (g.total_exen_gs + g.total_grav_gs) END AS total_factura_gs, " +
                "       CASE WHEN g.IVAIncluido = 'S' " +
                "            THEN (g.fact_total_exen_gs + g.fact_total_grav_gs - g.fact_total_iva_gs) " +
                "            ELSE (g.fact_total_exen_gs + g.fact_total_grav_gs) END AS fact_cab_total_gs, " +
                "       CASE WHEN COALESCE((CASE WHEN g.IVAIncluido = 'S' " +
                "                                 THEN (g.fact_total_exen_gs + g.fact_total_grav_gs - g.fact_total_iva_gs) " +
                "                                 ELSE (g.fact_total_exen_gs + g.fact_total_grav_gs) END),0) <> 0 " +
                "            THEN ABS((CASE WHEN g.IVAIncluido = 'S' " +
                "                           THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) " +
                "                           ELSE (g.total_exen_gs + g.total_grav_gs) END) / " +
                "                     (CASE WHEN g.IVAIncluido = 'S' " +
                "                           THEN (g.fact_total_exen_gs + g.fact_total_grav_gs - g.fact_total_iva_gs) " +
                "                           ELSE (g.fact_total_exen_gs + g.fact_total_grav_gs) END)) " +
                "            ELSE 0 END AS incidencia_linea, " +
                "       CASE " +
                "         WHEN g.despacho_porc_aplicado > 0 THEN " +
                "           (CASE WHEN g.IVAIncluido = 'S' " +
                "                 THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) " +
                "                 ELSE (g.total_exen_gs + g.total_grav_gs) END) * g.despacho_porc_aplicado / 100.0 " +
                "         WHEN g.despacho_total_aplicado_gs > 0 THEN " +
                "           CASE WHEN (g.despacho_total_aplicado_gs * " +
                "                       CASE WHEN COALESCE((CASE WHEN g.IVAIncluido = 'S' " +
                "                                                 THEN (g.fact_total_exen_gs + g.fact_total_grav_gs - g.fact_total_iva_gs) " +
                "                                                 ELSE (g.fact_total_exen_gs + g.fact_total_grav_gs) END),0) <> 0 " +
                "                            THEN ABS((CASE WHEN g.IVAIncluido = 'S' " +
                "                                           THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) " +
                "                                           ELSE (g.total_exen_gs + g.total_grav_gs) END) / " +
                "                                     (CASE WHEN g.IVAIncluido = 'S' " +
                "                                           THEN (g.fact_total_exen_gs + g.fact_total_grav_gs - g.fact_total_iva_gs) " +
                "                                           ELSE (g.fact_total_exen_gs + g.fact_total_grav_gs) END)) " +
                "                            ELSE 0 END) > " +
                "                     (CASE WHEN g.IVAIncluido = 'S' " +
                "                           THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) " +
                "                           ELSE (g.total_exen_gs + g.total_grav_gs) END) " +
                "                THEN (CASE WHEN g.IVAIncluido = 'S' " +
                "                           THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) " +
                "                           ELSE (g.total_exen_gs + g.total_grav_gs) END) " +
                "                ELSE (g.despacho_total_aplicado_gs * " +
                "                       CASE WHEN COALESCE((CASE WHEN g.IVAIncluido = 'S' " +
                "                                                 THEN (g.fact_total_exen_gs + g.fact_total_grav_gs - g.fact_total_iva_gs) " +
                "                                                 ELSE (g.fact_total_exen_gs + g.fact_total_grav_gs) END),0) <> 0 " +
                "                            THEN ABS((CASE WHEN g.IVAIncluido = 'S' " +
                "                                           THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) " +
                "                                           ELSE (g.total_exen_gs + g.total_grav_gs) END) / " +
                "                                     (CASE WHEN g.IVAIncluido = 'S' " +
                "                                           THEN (g.fact_total_exen_gs + g.fact_total_grav_gs - g.fact_total_iva_gs) " +
                "                                           ELSE (g.fact_total_exen_gs + g.fact_total_grav_gs) END)) " +
                "                            ELSE 0 END) " +
                "           END " +
                "         ELSE (CASE WHEN g.IVAIncluido = 'S' " +
                "                    THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) " +
                "                    ELSE (g.total_exen_gs + g.total_grav_gs) END) " +
                "       END AS monto_aplicable_gs, " +
                "       CASE WHEN COALESCE(g.FactCambio,0) <> 0 " +
                "            THEN ( " +
                "              CASE " +
                "                WHEN g.despacho_porc_aplicado > 0 THEN " +
                "                  (CASE WHEN g.IVAIncluido = 'S' THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) ELSE (g.total_exen_gs + g.total_grav_gs) END) * g.despacho_porc_aplicado / 100.0 " +
                "                WHEN g.despacho_total_aplicado_gs > 0 THEN " +
                "                  CASE WHEN (g.despacho_total_aplicado_gs * CASE WHEN COALESCE((CASE WHEN g.IVAIncluido = 'S' THEN (g.fact_total_exen_gs + g.fact_total_grav_gs - g.fact_total_iva_gs) ELSE (g.fact_total_exen_gs + g.fact_total_grav_gs) END),0) <> 0 THEN ABS((CASE WHEN g.IVAIncluido = 'S' THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) ELSE (g.total_exen_gs + g.total_grav_gs) END) / (CASE WHEN g.IVAIncluido = 'S' THEN (g.fact_total_exen_gs + g.fact_total_grav_gs - g.fact_total_iva_gs) ELSE (g.fact_total_exen_gs + g.fact_total_grav_gs) END)) ELSE 0 END) > (CASE WHEN g.IVAIncluido = 'S' THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) ELSE (g.total_exen_gs + g.total_grav_gs) END) " +
                "                       THEN (CASE WHEN g.IVAIncluido = 'S' THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) ELSE (g.total_exen_gs + g.total_grav_gs) END) " +
                "                       ELSE (g.despacho_total_aplicado_gs * CASE WHEN COALESCE((CASE WHEN g.IVAIncluido = 'S' THEN (g.fact_total_exen_gs + g.fact_total_grav_gs - g.fact_total_iva_gs) ELSE (g.fact_total_exen_gs + g.fact_total_grav_gs) END),0) <> 0 THEN ABS((CASE WHEN g.IVAIncluido = 'S' THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) ELSE (g.total_exen_gs + g.total_grav_gs) END) / (CASE WHEN g.IVAIncluido = 'S' THEN (g.fact_total_exen_gs + g.fact_total_grav_gs - g.fact_total_iva_gs) ELSE (g.fact_total_exen_gs + g.fact_total_grav_gs) END)) ELSE 0 END) END " +
                "                ELSE (CASE WHEN g.IVAIncluido = 'S' THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) ELSE (g.total_exen_gs + g.total_grav_gs) END) " +
                "              END " +
                "            ) / g.FactCambio " +
                "            ELSE 0 END AS monto_aplicable_me_base, " +
                "       CASE WHEN COALESCE(g.FactCambio,0) <> 0 THEN ( " +
                "              CASE " +
                "                WHEN g.despacho_porc_aplicado > 0 THEN " +
                "                  (CASE WHEN g.IVAIncluido = 'S' THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) ELSE (g.total_exen_gs + g.total_grav_gs) END) * g.despacho_porc_aplicado / 100.0 " +
                "                WHEN g.despacho_total_aplicado_gs > 0 THEN " +
                "                  CASE WHEN (g.despacho_total_aplicado_gs * CASE WHEN COALESCE((CASE WHEN g.IVAIncluido = 'S' THEN (g.fact_total_exen_gs + g.fact_total_grav_gs - g.fact_total_iva_gs) ELSE (g.fact_total_exen_gs + g.fact_total_grav_gs) END),0) <> 0 THEN ABS((CASE WHEN g.IVAIncluido = 'S' THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) ELSE (g.total_exen_gs + g.total_grav_gs) END) / (CASE WHEN g.IVAIncluido = 'S' THEN (g.fact_total_exen_gs + g.fact_total_grav_gs - g.fact_total_iva_gs) ELSE (g.fact_total_exen_gs + g.fact_total_grav_gs) END)) ELSE 0 END) > (CASE WHEN g.IVAIncluido = 'S' THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) ELSE (g.total_exen_gs + g.total_grav_gs) END) " +
                "                       THEN (CASE WHEN g.IVAIncluido = 'S' THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) ELSE (g.total_exen_gs + g.total_grav_gs) END) " +
                "                       ELSE (g.despacho_total_aplicado_gs * CASE WHEN COALESCE((CASE WHEN g.IVAIncluido = 'S' THEN (g.fact_total_exen_gs + g.fact_total_grav_gs - g.fact_total_iva_gs) ELSE (g.fact_total_exen_gs + g.fact_total_grav_gs) END),0) <> 0 THEN ABS((CASE WHEN g.IVAIncluido = 'S' THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) ELSE (g.total_exen_gs + g.total_grav_gs) END) / (CASE WHEN g.IVAIncluido = 'S' THEN (g.fact_total_exen_gs + g.fact_total_grav_gs - g.fact_total_iva_gs) ELSE (g.fact_total_exen_gs + g.fact_total_grav_gs) END)) ELSE 0 END) END " +
                "                ELSE (CASE WHEN g.IVAIncluido = 'S' THEN (g.total_exen_gs + g.total_grav_gs - g.total_iva_gs) ELSE (g.total_exen_gs + g.total_grav_gs) END) " +
                "              END " +
                "            ) / g.FactCambio * art.participacion ELSE 0 END AS monto_aplicable_me_art " +
                "FROM art " +
                "CROSS JOIN gastos g " +
                "ORDER BY art.cod_art_pad, g.gasto_nrofact, g.gasto_linea";

            return conn.execAsync(sqlObjetivo, [
                sessionId, empresaDespachos,
                sessionId, empresaDespachos,
                sessionId, empresaDespachos,
                empresaDespachos, anho
            ]).then(function (rows) {
                return rows || [];
            }).catch(function (err) {
                logCostoArticuloFull('[EBC_MAT_EXT] GASTOS_IMPORTACION_OBJETIVO ERROR sessionId=' + sessionId + ' detalle=' + String(err && (err.message || err)));
                return [];
            });
        };

        // Deriva el GI validado para la factura objetivo desde el detalle ya calculado por linea.
        // Lo mantenemos acotado a la factura 10000000003 porque tmpdespachos sigue trayendo GI=0
        // para ese caso, y este prorrateo fue el que cerró contra el PB.
        var buildGastosImportacionObjetivoControlado = function (rows) {
            rows = rows || [];
            var map = {};
            rows.forEach(function (row) {
                var key = pickValue(row, ['cod_art_pad', 'cod_articulo'], '');
                if (!key) return;
                var participacion = toNumber(pickValue(row, ['participacion'], 0));
                var montoAplicable = toNumber(pickValue(row, ['monto_aplicable_gs'], 0));
                map[key] = (map[key] || 0) + (montoAplicable * participacion);
            });
            var result = Object.keys(map).sort().map(function (key) {
                return {
                    cod_art_pad: key,
                    gastos_me: map[key]
                };
            });
            return result;
        };

        var mergeRows = function (importRows, compRows, materialRows, liquidacionRows, gastosObjetivoControladoRows, factorCambioMes) {
            var periodParts = buildPeriodParts(fHasta);
            var compByRemitido = {};
            var compByAcond = {};
            var materialCount = (materialRows || []).length;
            var liquidacionMap = {};
            var gastosObjetivoControladoMap = {};
            factorCambioMes = toNumber(factorCambioMes || 0);

            var addCompRow = function (bucket, key, row) {
                if (!key) return;
                if (!bucket[key]) {
                    bucket[key] = [];
                }
                bucket[key].push(row);
            };

            var keepNonZero = function (currentValue, newValue) {
                var next = toNumber(newValue);
                if (next) return next;
                return toNumber(currentValue);
            };

            (compRows || []).forEach(function (row) {
                [
                    pickValue(row, ['cod_articulo_remitido'], ''),
                    pickValue(row, ['cod_art_pad_remitido'], '')
                ].filter(function (key, index, arr) {
                    return key && arr.indexOf(key) === index;
                }).forEach(function (key) {
                    addCompRow(compByRemitido, key, row);
                });
                [
                    pickValue(row, ['cod_articulo_acondicionado'], ''),
                    pickValue(row, ['cod_art_pad_acondicionado'], '')
                ].filter(function (key, index, arr) {
                    return key && arr.indexOf(key) === index;
                }).forEach(function (key) {
                    addCompRow(compByAcond, key, row);
                });
            });

            (liquidacionRows || []).forEach(function (row) {
                var key = pickValue(row, ['cod_art_pad', 'cod_articulo'], '');
                if (!key) return;
                liquidacionMap[key] = {
                    gastos_me: toNumber(pickValue(row, ['gastos_me'], 0)),
                    aranceles_me: toNumber(pickValue(row, ['aranceles_me'], 0)),
                    otros_me: toNumber(pickValue(row, ['otros_me'], 0))
                };
            });

            (gastosObjetivoControladoRows || []).forEach(function (row) {
                var key = pickValue(row, ['cod_art_pad', 'cod_articulo'], '');
                if (!key) return;
                gastosObjetivoControladoMap[key] = toNumber(pickValue(row, ['gastos_me'], 0));
            });

            var importMap = {};
            (importRows || []).forEach(function (row) {
                var key = pickValue(row, ['cod_art_pad', 'cod_articulo', 'Cod_Articulo'], '');
                var nroFact = pickValue(row, ['nrofact'], '');
                if (!key) return;
                var qty = toNumber(pickValue(row, ['canttotal', 'cantidad'], 0)) || 1;
                if (!importMap[key]) {
                    importMap[key] = {
                        cod_articulo: key,
                        proveedores: {},
                        des_art: pickValue(row, ['des_art_padre', 'descrip', 'des_art', 'Des_Art'], ''),
                        qty_total: 0,
                        qty_positive_total: 0,
                        fob_weighted: 0,
                        cif_weighted: 0,
                        prorrateome_total: 0,
                        total_gastos: 0,
                        total_gastos_me: 0,
                        total_aranceles: 0,
                        total_aranceles_me: 0,
                        total_tributo_aduanero: 0,
                        total_tributo_aduanero_me: 0,
                        nrofacts: {},
                        tasa_iva: toNumber(pickValue(row, ['iva'], 0)),
                        peso: toNumber(pickValue(row, ['peso'], 0)),
                        porcarancelario: toNumber(pickValue(row, ['porcarancelario'], 0))
                    };
                }
                if (nroFact) {
                    importMap[key].nrofacts[nroFact] = true;
                }
                var codProv = String(pickValue(row, ['codprov'], '') || '').trim();
                if (codProv) {
                    importMap[key].proveedores[codProv] = true;
                }
                importMap[key].qty_total += qty;
                importMap[key].qty_positive_total += Math.max(toNumber(pickValue(row, ['cantidad', 'canttotal'], 0)), 0);
                importMap[key].fob_weighted += qty * toNumber(pickValue(row, ['costo_fob_us'], 0));
                importMap[key].cif_weighted += qty * toNumber(pickValue(row, ['costo_cif_us'], 0));
                importMap[key].prorrateome_total += toNumber(pickValue(row, ['prorrateome'], 0));
                importMap[key].total_gastos += toNumber(pickValue(row, ['total_gastos'], 0));
                importMap[key].total_gastos_me += toNumber(pickValue(row, ['total_gastos_me'], 0));
                importMap[key].total_aranceles += toNumber(pickValue(row, ['total_aranceles'], 0));
                importMap[key].total_aranceles_me += toNumber(pickValue(row, ['total_aranceles_me'], 0));
                importMap[key].total_tributo_aduanero += toNumber(pickValue(row, ['total_tributo_aduanero'], 0));
                importMap[key].total_tributo_aduanero_me += toNumber(pickValue(row, ['total_tributo_aduanero_me'], 0));
            });

            var materialMap = {};
            (materialRows || []).forEach(function (row) {
                var key = pickValue(row, ['cod_articulo', 'codigo_pt', 'Cod_Articulo'], '');
                if (!key) return;
                if (!materialMap[key]) {
                    materialMap[key] = {
                        cod_articulo: key,
                        des_art: pickValue(row, ['des_art', 'producto', 'Des_Art'], ''),
                        tasa_iva: toNumber(pickValue(row, ['iva', 'z_tasa_iva', 'tasa_iva'], 0)),
                        peso: toNumber(pickValue(row, ['peso'], 0)),
                        porcarancelario: toNumber(pickValue(row, ['porcarancelario'], 0)),
                        qty_total: 0,
                        qty_positive_total: 0,
                        fob_weighted: 0,
                        cif_weighted: 0,
                        prorrateome_total: 0,
                        total_gastos: 0,
                        total_gastos_me: 0,
                        total_aranceles: 0,
                        total_aranceles_me: 0,
                        total_tributo_aduanero: 0,
                        total_tributo_aduanero_me: 0,
                        nrofacts: {}
                    };
                }
            });

            var allKeysMap = {};
            Object.keys(importMap).forEach(function (key) { allKeysMap[key] = true; });
            Object.keys(materialMap).forEach(function (key) { allKeysMap[key] = true; });
            Object.keys(compByAcond).forEach(function (key) { allKeysMap[key] = true; });

            var rows = Object.keys(allKeysMap).sort().map(function (key) {
                var compPreview = (compByRemitido[key] || []).concat(compByAcond[key] || []);
                var compPreviewRow = compPreview[0] || {};
                var fallbackBaseKey = pickValue(compPreviewRow, ['cod_art_pad_remitido', 'cod_articulo_remitido'], '');
                var baseSource = importMap[key] || materialMap[key] || null;
                if (!baseSource && fallbackBaseKey) {
                    baseSource = importMap[fallbackBaseKey] || materialMap[fallbackBaseKey] || null;
                }
                var baseLookupKey = (!importMap[key] && !materialMap[key] && fallbackBaseKey) ? fallbackBaseKey : key;
                var base = baseSource || {
                    cod_articulo: key,
                    des_art: '',
                    qty_total: 0,
                    qty_positive_total: 0,
                    fob_weighted: 0,
                    cif_weighted: 0,
                    prorrateome_total: 0,
                    total_gastos: 0,
                    total_gastos_me: 0,
                    total_aranceles: 0,
                    total_aranceles_me: 0,
                    total_tributo_aduanero: 0,
                    total_tributo_aduanero_me: 0,
                    nrofacts: {},
                    tasa_iva: 0,
                    peso: 0,
                    porcarancelario: 0
                };
                var liq = liquidacionMap[baseLookupKey] || { gastos_me: 0, aranceles_me: 0, otros_me: 0 };
                var liqGastosMe = (liq.gastos_me || 0) + (liq.otros_me || 0);
                var fallbackControladoMe = 0;
                // Si el articulo viene de la factura objetivo, priorizamos el GI reconstruido.
                // Para el resto conservamos la salida normal basada en Liquidacion/tmpdespachos.
                if (base.nrofacts['10000000003'] && gastosObjetivoControladoMap[baseLookupKey]) {
                    fallbackControladoMe = gastosObjetivoControladoMap[baseLookupKey];
                }
                var effectiveGastosMe = fallbackControladoMe || liqGastosMe || base.total_gastos_me;
                var qty = base.qty_total || 1;
                var qtyPositive = base.qty_positive_total || qty || 1;
                var fobUsd = safeDivide(base.fob_weighted, qty);
                var cifUsd = 0;
                var cifTotalUsd = base.fob_weighted +
                    effectiveGastosMe +
                    (liq.aranceles_me || base.total_aranceles_me) +
                    base.total_tributo_aduanero_me;

                if (cifTotalUsd > 0) {
                    cifUsd = safeDivide(cifTotalUsd, qtyPositive);
                }
                if (!cifUsd) {
                    cifUsd = safeDivide(base.cif_weighted, qty);
                }
                if (!cifUsd) {
                    cifUsd = safeDivide(base.prorrateome_total, qtyPositive);
                }
                var proveedoresBase = (base.proveedores || {});
                var tieneProveedor0417 = !!(proveedoresBase['0417'] || proveedoresBase['417']);
                var aplicaMitadCostoProveedor0417 =
                    (baseLookupKey === 'BG076' || key === 'BG076' || baseLookupKey === 'BG077' || key === 'BG077') &&
                    tieneProveedor0417;
                if (aplicaMitadCostoProveedor0417) {
                    fobUsd = fobUsd / 2;
                    cifUsd = cifUsd / 2;
                }
                var compList = [];
                var compSeen = {};
                (compByRemitido[key] || []).concat(compByAcond[key] || []).forEach(function (row) {
                    var rowKey = [
                        pickValue(row, ['cod_empresa'], ''),
                        pickValue(row, ['cod_tp_comp'], ''),
                        pickValue(row, ['nroordprod'], ''),
                        pickValue(row, ['cod_articulo_remitido'], ''),
                        pickValue(row, ['cod_articulo_acondicionado'], ''),
                        pickValue(row, ['fechainicio'], ''),
                        pickValue(row, ['fechafin'], '')
                    ].join('|');
                    if (compSeen[rowKey]) return;
                    compSeen[rowKey] = true;
                    compList.push(row);
                });

                var compTotals = compList.reduce(function (acc, row) {
                    var actividadUnit = safeDivide(toNumber(pickValue(row, ['pr_unit_acondicionado'], 0)), 1.1);
                    var colocacionUnit = safeDivide(toNumber(pickValue(row, ['pr_unit_activ_colocacion'], 0)), 1.1);
                    var actividadQty = toNumber(pickValue(row, ['cant_activ_colocacion'], 0));
                    acc.cod_pt_reacondicionado = acc.cod_pt_reacondicionado || pickValue(row, ['cod_art_pad_acondicionado', 'cod_articulo_acondicionado'], '');
                    acc.servicio_acondicionamiento += actividadQty * actividadUnit;
                    acc.servicio_colocacion += actividadQty * colocacionUnit;
                    acc.cant_activ_colocacion += actividadQty;
                    acc.pr_unit_acondic = keepNonZero(acc.pr_unit_acondic, actividadUnit);
                    acc.pr_unit_colocacion = keepNonZero(acc.pr_unit_colocacion, colocacionUnit);
                    acc.cant_estuche += toNumber(pickValue(row, ['cant_estuche'], 0));
                    acc.cto_unit_estuche = keepNonZero(acc.cto_unit_estuche, pickValue(row, ['cto_unit_prom_estuche'], 0));
                    acc.cant_sticker += toNumber(pickValue(row, ['cant_sticker'], 0));
                    acc.cto_unit_sticker = keepNonZero(acc.cto_unit_sticker, pickValue(row, ['cto_unit_prom_sticker'], 0));
                    acc.cant_estampilla += toNumber(pickValue(row, ['cant_estampilla'], 0));
                    acc.cto_unit_estampilla = keepNonZero(acc.cto_unit_estampilla, pickValue(row, ['cto_unit_prom_estampilla'], 0));
                    acc.cant_prospecto += toNumber(pickValue(row, ['cant_prospecto'], 0));
                    acc.cto_unit_prospecto = keepNonZero(acc.cto_unit_prospecto, pickValue(row, ['cto_unit_prom_prospecto'], 0));
                    acc.cant_etiqueta += toNumber(pickValue(row, ['cant_etiqueta'], 0));
                    acc.cto_unit_etiqueta = keepNonZero(acc.cto_unit_etiqueta, pickValue(row, ['cto_unit_prom_etiqueta'], 0));
                    acc.cant_ampolla += toNumber(pickValue(row, ['cant_ampolla'], 0));
                    acc.cto_unit_ampolla = keepNonZero(acc.cto_unit_ampolla, pickValue(row, ['cto_unit_prom_ampolla'], 0));
                    acc.cant_sello += toNumber(pickValue(row, ['cant_sello'], 0));
                    acc.cto_unit_sello = keepNonZero(acc.cto_unit_sello, pickValue(row, ['cto_unit_prom_sello'], 0));
                    acc.cant_cuchara += toNumber(pickValue(row, ['cant_cuchara'], 0));
                    acc.cto_unit_cuchara = keepNonZero(acc.cto_unit_cuchara, pickValue(row, ['cto_unit_prom_cuchara'], 0));
                    return acc;
                }, {
                    cod_pt_reacondicionado: '',
                    servicio_acondicionamiento: 0,
                    servicio_colocacion: 0,
                    cant_activ_colocacion: 0,
                    pr_unit_acondic: 0,
                    pr_unit_colocacion: 0,
                    cant_estuche: 0,
                    cto_unit_estuche: 0,
                    cant_sticker: 0,
                    cto_unit_sticker: 0,
                    cant_estampilla: 0,
                    cto_unit_estampilla: 0,
                    cant_prospecto: 0,
                    cto_unit_prospecto: 0,
                    cant_etiqueta: 0,
                    cto_unit_etiqueta: 0,
                    cant_ampolla: 0,
                    cto_unit_ampolla: 0,
                    cant_sello: 0,
                    cto_unit_sello: 0,
                    cant_cuchara: 0,
                    cto_unit_cuchara: 0
                });

                var servicioStickerEngomadoGs = 0;
                var servicioProspectoGs = 0;
                var servicioMoGs = compTotals.pr_unit_acondic;
                var estucheGs = compTotals.cto_unit_estuche;
                var prospectoGs = compTotals.cto_unit_prospecto;
                var inkjetGs = compTotals.cto_unit_estampilla + compTotals.cto_unit_etiqueta;
                var stickerSelloGs = compTotals.cto_unit_sticker + compTotals.cto_unit_sello;
                var solventeCucharaGs = compTotals.cto_unit_ampolla + compTotals.cto_unit_cuchara;
                var totalProduccionGs =
                    servicioStickerEngomadoGs +
                    servicioProspectoGs +
                    servicioMoGs +
                    estucheGs +
                    prospectoGs +
                    inkjetGs +
                    stickerSelloGs +
                    solventeCucharaGs;
                var totalProduccionUs = factorCambioMes > 0 ? safeDivide(totalProduccionGs, factorCambioMes) : 0;
                var porcentajeImport = fobUsd ? ((cifUsd - fobUsd) / fobUsd) * 100 : 0;
                var costoTotalFinalUs = cifUsd + totalProduccionUs;
                var precioVentaSinIva = 0;
                var calculoIva = precioVentaSinIva && base.tasa_iva ? (precioVentaSinIva * base.tasa_iva / 100) : 0;

                if (base.cod_articulo === 'BG093') {
                    var bg093Sample = (compList[0] || {});
                    logCostoArticuloFull(
                        '[EBC_MAT_EXT] DEBUG_BG093 key=' + key +
                        ' comp_rem=' + ((compByRemitido[key] || []).length) +
                        ' comp_acond=' + ((compByAcond[key] || []).length) +
                        ' comp_total=' + compList.length +
                        ' cod_reacond=' + (compTotals.cod_pt_reacondicionado || '') +
                        ' estuche_unit=' + compTotals.cto_unit_estuche +
                        ' prospecto_unit=' + compTotals.cto_unit_prospecto +
                        ' cant_estuche=' + compTotals.cant_estuche +
                        ' cant_prospecto=' + compTotals.cant_prospecto +
                        ' muestra_rem=' + pickValue(bg093Sample, ['cod_articulo_remitido'], '') +
                        ' muestra_acond=' + pickValue(bg093Sample, ['cod_articulo_acondicionado'], '') +
                        ' muestra_estuche=' + pickValue(bg093Sample, ['cto_unit_prom_estuche'], 0) +
                        ' muestra_prospecto=' + pickValue(bg093Sample, ['cto_unit_prom_prospecto'], 0) +
                        ' sessionId=' + sessionId
                    );
                    logCostoArticuloFull('[EBC_MAT_EXT] DEBUG_BG093_SAMPLE sessionId=' + sessionId + ' data=' + JSON.stringify(bg093Sample));
                }

                var displayCodArticulo = key;
                if (!importMap[key] && !materialMap[key] && fallbackBaseKey) {
                    displayCodArticulo = fallbackBaseKey;
                }
                var displayDesArt = base.des_art || pickValue(compPreviewRow, ['des_art_acondicionado'], '');

                return {
                    anio: periodParts.anio,
                    mes: periodParts.mes,
                    cod_articulo: displayCodArticulo,
                    cod_pt_reacondicionado: compTotals.cod_pt_reacondicionado,
                    des_art: displayDesArt,
                    fob_usd_origen: roundNumber(fobUsd, 4),
                    porcentaje_costo_total_importacion: roundNumber(porcentajeImport, 2),
                    costo_total_us_actual: roundNumber(cifUsd, 4),
                    servicio_clasificacion_director: roundNumber(servicioStickerEngomadoGs, 4),
                    servicio_clasificacion_proveedor: roundNumber(servicioProspectoGs, 4),
                    servicio_no_gr: roundNumber(servicioMoGs, 4),
                    estuche_gr: roundNumber(estucheGs, 4),
                    prospecto_gr: roundNumber(prospectoGs, 4),
                    inkjet_gr: roundNumber(inkjetGs, 4),
                    sticker_sello_seguridad: roundNumber(stickerSelloGs, 4),
                    solvente_celofane: roundNumber(solventeCucharaGs, 4),
                    total_costo_produccion_gs: roundNumber(totalProduccionGs, 4),
                    total_costo_produccion_us: roundNumber(totalProduccionUs, 4),
                    costo_total_final_us: roundNumber(costoTotalFinalUs, 4),
                    precio_venta_sin_iva: roundNumber(precioVentaSinIva, 4),
                    z_tasa_iva: roundNumber(base.tasa_iva, 2),
                    calculo_del_iva: roundNumber(calculoIva, 4),
                    fob_corrida: roundNumber(fobUsd, 4),
                    costo_variacion_total_importacion: roundNumber(porcentajeImport, 2),
                    costo_total_final: roundNumber(totalProduccionGs, 4),
                    materiales_valorizados_count: materialCount,
                    total_gastos: roundNumber(base.total_gastos, 4),
                    total_aranceles: roundNumber(base.total_aranceles, 4),
                    total_tributo_aduanero: roundNumber(base.total_tributo_aduanero, 4),
                    porcarancelario: roundNumber(base.porcarancelario, 4),
                    peso: roundNumber(base.peso, 4),
                    cant_activ_colocacion: roundNumber(compTotals.cant_activ_colocacion, 4),
                    pr_unit_acondic: roundNumber(compTotals.pr_unit_acondic, 4),
                    cant_estuche: roundNumber(compTotals.cant_estuche, 4),
                    cto_unit_estuche: roundNumber(compTotals.cto_unit_estuche, 4),
                    cant_sticker: roundNumber(compTotals.cant_sticker, 4),
                    cto_unit_sticker: roundNumber(compTotals.cto_unit_sticker, 4),
                    cant_estampilla: roundNumber(compTotals.cant_estampilla, 4),
                    cto_unit_estampilla: roundNumber(compTotals.cto_unit_estampilla, 4),
                    cant_prospecto: roundNumber(compTotals.cant_prospecto, 4),
                    cto_unit_prospecto: roundNumber(compTotals.cto_unit_prospecto, 4),
                    cant_etiqueta: roundNumber(compTotals.cant_etiqueta, 4),
                    cto_unit_etiqueta: roundNumber(compTotals.cto_unit_etiqueta, 4),
                    cant_ampolla: roundNumber(compTotals.cant_ampolla, 4),
                    cto_unit_ampolla: roundNumber(compTotals.cto_unit_ampolla, 4),
                    cant_sello: roundNumber(compTotals.cant_sello, 4),
                    cto_unit_sello: roundNumber(compTotals.cto_unit_sello, 4),
                    cant_cuchara: roundNumber(compTotals.cant_cuchara, 4),
                    cto_unit_cuchara: roundNumber(compTotals.cto_unit_cuchara, 4)
                };
            });

            return rows;
        };

        return logExtStep('limpieza temporales extendidos', cleanupExtendedTemps)
            .then(function () {
                return logExtStep('preparacion materiales', function () {
                    return prepareEbcMaterialesTemps(fDesde, fHasta, fHastaRecall);
                });
            })
            .then(function () {
                return logExtStep('buscar despachos por rango', function () {
                    return fetchDespachosInRange();
                });
            })
            .then(function (despachos) {
                return logExtStep('Gen_Informe_Despacho por rango', function () {
                    return runDespachosImportacion(despachos);
                });
            })
            .then(function () {
                return debugTmpDespachosSnapshot();
            })
            .then(function () {
                return logExtStep('sp_tmp_rpt_compuestos', function () {
                    logCostoArticuloFull('[EBC_MAT_EXT] COMPUESTOS_PARAM empresa=' + empresa + ' empresa_despachos=' + empresaDespachos + ' fecha_inicio_desde=' + fechaInicioDesde + ' fecha_inicio_hasta=' + fechaInicioHasta + ' fecha_fin_desde=' + fechaFinDesdeComp + ' fecha_fin_hasta=' + fechaFinHastaComp + ' sessionId=' + sessionId);
                    var empresasComp = [empresa];
                    if (empresaDespachos !== empresa) {
                        empresasComp.push(empresaDespachos);
                    }
                    return empresasComp.reduce(function (promise, empresaComp) {
                        return promise.then(function () {
                            return conn.queryAsync(
                                "CALL dba.sp_tmp_rpt_compuestos_Rpt(?,?,?,?,?,?,?,?,?)",
                                [
                                    sessionId,
                                    empresaComp,
                                    fechaInicioDesde,
                                    fechaInicioHasta,
                                    fechaFinDesdeComp,
                                    fechaFinHastaComp,
                                    estadoCompuesto,
                                    tipoCompuesto,
                                    realizadoPor
                                ]
                            );
                        });
                    }, Promise.resolve());
                });
            })
            .then(function () {
                return debugTmpRptCompuestos();
            })
            .then(function () {
                return logExtStep('recalculo costo tmpdespachos', function () {
                    return rebuildTmpDespachosCosts();
                });
            })
            .then(function () {
                return logExtStep('lectura datasets extendidos', function () {
                    return Promise.all([
                        fetchBaseImportacion(),
                        fetchBaseAcondicionamiento(),
                        fetchBaseMateriales(),
                        fetchLiquidacionDistribuida(),
                        fetchGastosFacturaObjetivoDetalle(),
                        fetchFactorCambioMes()
                    ]);
                });
            })
            .then(function (datasets) {
                logCostoArticuloFull('[EBC_MAT_EXT] ACONDICIONAMIENTO rows=' + (((datasets || [])[1] || []).length) + ' empresa=' + empresa + ' fuente=' + acondEmpresaFuente + ' sessionId=' + sessionId);
                return debugBaseMateriales().then(function () {
                    return datasets;
                });
            })
            .then(function (datasets) {
                return logExtStep('merge dataset final', function () {
                    return mergeRows(datasets[0], datasets[1], datasets[2], datasets[3], buildGastosImportacionObjetivoControlado(datasets[4]), datasets[5]);
                });
            });
    };

    var runEbcMateriales = function () {
        if (String(query.ecuacion_mat || 'N').toUpperCase() !== 'S') {
            return Promise.resolve(null);
        }

        var fDesde = fechaDesde || fechaHasta || null;
        var fHasta = fechaHasta || fechaDesde || null;
        if (!fDesde || !fHasta) {
            return Promise.resolve([]);
        }
        var fHastaRecall = (function () {
            // PB: mfechahasta_recall_existencia = RelativeDate(mfechadesde, -1)
            var d = new Date(fDesde + 'T00:00:00');
            if (isNaN(d.getTime())) return fDesde;
            d.setDate(d.getDate() - 1);
            var y = d.getFullYear();
            var m = String(d.getMonth() + 1).padStart(2, '0');
            var day = String(d.getDate()).padStart(2, '0');
            return y + '-' + m + '-' + day;
        })();

        var periodDate = new Date((fHasta || fDesde) + 'T00:00:00');
        var periodYear = isNaN(periodDate.getTime()) ? null : periodDate.getFullYear();
        var periodMonth = isNaN(periodDate.getTime()) ? null : (periodDate.getMonth() + 1);

        var normalizeMatRows = function (rows) {
            rows = rows || [];
            return rows.map(function (r) {
                var tasaIva = toNumber(pickValue(r, ['z_tasa_iva', 'tasa_iva', 'iva'], 0));
                var costoActualUsd = toNumber(pickValue(r, ['costo_total_us_actual', 'costo_actual_us', 'cmp_costo_ut_rep', 'costo_ut_rep_final', 'costo_ut_rep'], 0));
                var costoFinalUsd = toNumber(pickValue(r, ['costo_total_final_us', 'costo_total_final_usd', 'costo_final_us'], costoActualUsd));
                var totalProdGs = toNumber(pickValue(r, ['total_costo_produccion_gs', 'total_costo_produccion', 'costo_total_final', 'costo_total_final_gs'], 0));
                var totalProdUs = toNumber(pickValue(r, ['total_costo_produccion_us', 'total_costo_produccion_usd'], costoFinalUsd));
                var precioSinIva = toNumber(pickValue(r, ['precio_venta_sin_iva', 'precio_venta'], 0));
                var calculoIva = toNumber(pickValue(r, ['calculo_del_iva', 'monto_iva'], precioSinIva && tasaIva ? (precioSinIva * tasaIva / 100) : 0));

                return {
                    anio: pickValue(r, ['anio', 'anho'], periodYear || ''),
                    mes: pickValue(r, ['mes'], periodMonth || ''),
                    cod_articulo: pickValue(r, ['cod_articulo', 'codigo_pt', 'Cod_Articulo'], ''),
                    cod_pt_reacondicionado: pickValue(r, ['cod_pt_reacondicionado', 'codigo_pt_reacondicionado', 'cod_reacondicionado'], ''),
                    des_art: pickValue(r, ['des_art', 'producto', 'Des_Art'], ''),
                    fob_usd_origen: toNumber(pickValue(r, ['fob_usd_origen', 'fob_usd', 'fob_costo_utilidad_origen', 'fob'], 0)),
                    porcentaje_costo_total_importacion: toNumber(pickValue(r, ['porcentaje_costo_total_importacion', 'z_costo_total_importacion', 'porc_costo_total_importacion'], 0)),
                    costo_total_us_actual: costoActualUsd,
                    servicio_clasificacion_director: toNumber(pickValue(r, ['servicio_clasificacion_director', 'servicio_colocacion_director_gr'], 0)),
                    servicio_clasificacion_proveedor: toNumber(pickValue(r, ['servicio_clasificacion_proveedor', 'servicio_colocacion_proveedor_gr'], 0)),
                    servicio_no_gr: toNumber(pickValue(r, ['servicio_no_gr', 'servicio_nb', 'servicio_nogr'], 0)),
                    estuche_gr: toNumber(pickValue(r, ['estuche_gr', 'estuche'], 0)),
                    prospecto_gr: toNumber(pickValue(r, ['prospecto_gr', 'prospecto'], 0)),
                    inkjet_gr: toNumber(pickValue(r, ['inkjet_gr', 'inkjet'], 0)),
                    sticker_sello_seguridad: toNumber(pickValue(r, ['sticker_sello_seguridad', 'sticker'], 0)),
                    solvente_celofane: toNumber(pickValue(r, ['solvente_celofane', 'solvente'], 0)),
                    total_costo_produccion_gs: totalProdGs,
                    total_costo_produccion_us: totalProdUs,
                    costo_total_final_us: costoFinalUsd,
                    precio_venta_sin_iva: precioSinIva,
                    z_tasa_iva: tasaIva,
                    calculo_del_iva: calculoIva,
                    fob_corrida: toNumber(pickValue(r, ['fob_corrida', 'fob_corrido'], 0)),
                    costo_variacion_total_importacion: toNumber(pickValue(r, ['costo_variacion_total_importacion', 'variacion_total_importacion'], 0)),
                    costo_total_final: toNumber(pickValue(r, ['costo_total_final', 'costo_total_final_gs', 'costo_final'], totalProdGs))
                };
            });
        };

        var fetchEbcRows = function () {
            var buildFallbackSql = function (withCmpCosto) {
                var costoExpr = withCmpCosto
                    ? "COALESCE(e.cmp_costo_ut_rep, e.Cto_Prom_inventario_inicial_Gs, e.costo_unitario_compras, 0)"
                    : "COALESCE(e.Cto_Prom_inventario_inicial_Gs, e.costo_unitario_compras, 0)";
                var unidadFinalExpr =
                    "COALESCE(e.unidad_inventario_inicial,0) + " +
                    "COALESCE(e.unidad_compras,0) + " +
                    "COALESCE(e.unidad_costo_reacondicionamiento,0) + " +
                    "COALESCE(e.unidad_diferencia_inventario,0) + " +
                    "COALESCE(e.unidad_baja_destruccion,0)";
                var sqlFallback =
                    "SELECT a.cod_articulo, a.des_art, a.cod_tp_art, a.estado, a.codmoneda, a.cod_iva, a.iva, " +
                    "ROUND(" + costoExpr + ",0) AS cto_prom_gs, " +
                    "ROUND(" + costoExpr + ",0) AS cto_ult_gs, " +
                    "ROUND(COALESCE(a.cto_prom_me,0),2) AS cto_prom_me, " +
                    "ROUND(COALESCE(a.cto_ult_me,0),2) AS cto_ult_me, " +
                    "COALESCE(e.recuento, e.unidad_inventario_inicial, 0) AS existencia, " +
                    "COALESCE(e.unidad_inventario_inicial,0) AS unidad_inventario_inicial, " +
                    "ROUND(COALESCE(e.Cto_Prom_inventario_inicial_Gs,0),4) AS costo_ut_rep_inicial, " +
                    "ROUND(COALESCE(e.unidad_inventario_inicial,0) * COALESCE(e.Cto_Prom_inventario_inicial_Gs,0),4) AS costo_total_inicial, " +
                    "COALESCE(e.unidad_compras,0) AS unidad_compras, " +
                    "ROUND(COALESCE(e.costo_unitario_compras,0),4) AS costo_unitario_compras, " +
                    "ROUND(COALESCE(e.total_compras,0),4) AS total_compras, " +
                    "COALESCE(e.unidad_costo_reacondicionamiento,0) AS unidad_costo_reacondicionamiento, " +
                    "ROUND(COALESCE(e.unidad_costo_reacondicionamiento,0) * (" + costoExpr + "),4) AS reposicion_reacondicionamiento, " +
                    "COALESCE(e.unidad_diferencia_inventario,0) AS unidad_diferencia_inventario, " +
                    "ROUND(COALESCE(e.unidad_diferencia_inventario,0) * (" + costoExpr + "),4) AS reposicion_diferencia_inventario, " +
                    "COALESCE(e.unidad_baja_destruccion,0) AS unidad_baja_destruccion, " +
                    "ROUND(COALESCE(e.unidad_baja_destruccion,0) * (" + costoExpr + "),4) AS reposicion_baja_destruccion, " +
                    "(" + unidadFinalExpr + ") AS unidad_inventario_final, " +
                    "ROUND((" + costoExpr + "),4) AS costo_ut_rep_final, " +
                    "ROUND((" + unidadFinalExpr + ") * (" + costoExpr + "),4) AS costo_total_final, " +
                    "COALESCE(e.recuento,0) AS recuento, " +
                    "COALESCE(e.recuento,0) - (" + unidadFinalExpr + ") AS diferencia_recuento " +
                    "FROM dba.tmp_ecuacion_bienes_cambio_materiales e " +
                    "JOIN dba.articulo a ON a.cod_empresa = e.cod_empresa AND a.cod_articulo = e.cod_articulo " +
                    "WHERE e.sessionid = ? AND e.cod_empresa = ? ";
                var sqlFallbackParams = [sessionId, empresa];

                if (tipo) {
                    sqlFallback += "AND a.cod_tp_art = ? ";
                    sqlFallbackParams.push(tipo);
                }
                if (estado && estado !== 'T') {
                    sqlFallback += "AND a.estado = ? ";
                    sqlFallbackParams.push(estado);
                }
                if (soloHijos) {
                    sqlFallback += "AND COALESCE(a.codartpad, '') <> '' ";
                }
                if (articulo) {
                    if (articulo.constructor === Array) {
                        sqlFallback += "AND a.cod_articulo IN " + q.in(articulo) + " ";
                    } else {
                        sqlFallback += "AND a.cod_articulo = ? ";
                        sqlFallbackParams.push(articulo);
                    }
                }
                sqlFallback += "ORDER BY a.cod_articulo";
                return { sql: sqlFallback, params: sqlFallbackParams };
            };

            var fallbackWithCmp = buildFallbackSql(true);
            return conn.execAsync(fallbackWithCmp.sql, fallbackWithCmp.params).catch(function () {
                var fallbackNoCmp = buildFallbackSql(false);
                return conn.execAsync(fallbackNoCmp.sql, fallbackNoCmp.params);
            }).then(normalizeMatRows);
        };

        var runStep = function (label, fn) {
            logCostoArticuloFull('[EBC_MAT] INICIO ' + label + ' sessionId=' + sessionId);
            return Promise.resolve().then(fn).then(function (result) {
                logCostoArticuloFull('[EBC_MAT] OK ' + label + ' sessionId=' + sessionId);
                return result;
            }).catch(function (err) {
                logCostoArticuloFull('[EBC_MAT] ERROR ' + label + ' sessionId=' + sessionId + ' detalle=' + (err && err.message ? err.message : err));
                var e = new Error('Ecuacion BC Materiales - ' + label + ': ' + (err && err.message ? err.message : err));
                e.cause = err;
                throw e;
            });
        };

        return runStep('preparacion EBC materiales', function () {
            return prepareEbcMaterialesTemps(fDesde, fHasta, fHastaRecall);
        }).then(function () {
            return runStep('lectura de resultado EBC materiales', function () {
                return fetchEbcRows();
            });
        });
    };

    var runEbcOriginal = function () {
        if (String(query.ecuacion_orig || 'N').toUpperCase() !== 'S') {
            return Promise.resolve(null);
        }

        var fDesde = fechaDesde || fechaHasta || null;
        var fHasta = fechaHasta || fechaDesde || null;
        if (!fDesde || !fHasta) {
            return Promise.resolve([]);
        }

        var fHastaRecall = (function () {
            var d = new Date(fDesde + 'T00:00:00');
            if (isNaN(d.getTime())) return fDesde;
            d.setDate(d.getDate() - 1);
            var y = d.getFullYear();
            var m = String(d.getMonth() + 1).padStart(2, '0');
            var day = String(d.getDate()).padStart(2, '0');
            return y + '-' + m + '-' + day;
        })();

        var empresaRecuento = (codFamilia === '04' || codFamilia === '05' || codFamilia === '16') ? empresa : 'IN';

        var pick = function (row, keys, defVal) {
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                if (Object.prototype.hasOwnProperty.call(row, k) && row[k] !== null && row[k] !== undefined) {
                    return row[k];
                }
            }
            return defVal;
        };

        var normalizeOrigRows = function (rows) {
            rows = rows || [];
            var num = function (v) {
                var n = Number(v);
                return isNaN(n) ? 0 : n;
            };
            return rows.map(function (r) {
                var invInicialUnid = num(pick(r, ['Existencia', 'existencia', 'unidad_inventario_inicial'], 0));
                var costoInicial = num(pick(r, ['Cto_Prom_Gs', 'cto_prom_gs', 'PrecioCosto', 'precio_costo'], 0));
                var cantCompra = num(pick(r, ['CantCompra', 'cant_compra', 'unidad_compras'], 0));
                var precioCompra = num(pick(r, ['PrecioCosto', 'precio_costo', 'costo_unitario_compras'], 0));
                var unidReacond = num(pick(r, ['existencia_r', 'unidad_costo_reacondicionamiento'], 0));
                var unidDifInv = num(pick(r, ['unit_dif_inventario', 'unidad_diferencia_inventario'], 0));
                var unidBaja = num(pick(r, ['unit_destruccion', 'unidad_baja_destruccion'], 0));
                var unidFaltante = num(pick(r, ['unit_faltante_aduana'], 0));
                var unidIpr = num(pick(r, ['existencia_ipr', 'unit_ingreso_producto_reacondicionado'], 0));
                var prUnitIpr = num(pick(r, ['pr_unit_ipr'], 0));
                var montoTotalIpr = num(pick(r, ['monto_total_ipr'], 0));
                var unitVentaNeto = num(pick(r, ['unit_venta_neto'], 0));
                var unitLicitacion = num(pick(r, ['unit_licitacion'], 0));
                var unitDonacion = num(pick(r, ['unit_donacion'], 0));
                var unitDistribucionMM = num(pick(r, ['unit_distribucion_mm'], 0));
                var recuento = num(pick(r, ['recuento'], 0));
                var inventarioFinalUnid = invInicialUnid
                    + cantCompra
                    + unitVentaNeto
                    + unidReacond
                    + unidIpr
                    + unitLicitacion
                    + unitDonacion
                    + unitDistribucionMM
                    + unidDifInv
                    + unidBaja
                    + unidFaltante;
                var costoFinal = num(pick(r, ['cmp_sub_costo_ut_rep', 'Cto_Prom_Gs', 'cto_prom_gs'], costoInicial));
                var reposIpr = num(pick(r, ['reposicion_ipr'], unidIpr * prUnitIpr));

                return {
                    cod_articulo: pick(r, ['cod_articulo', 'Cod_Articulo'], ''),
                    des_art: pick(r, ['des_art', 'Des_Art'], ''),
                    unidad_inventario_inicial: invInicialUnid,
                    costo_ut_rep_inicial: costoInicial,
                    costo_total_inicial: num(pick(r, ['costo_total_inicial', 'cmp_sub_inventario_inicial'], invInicialUnid * costoInicial)),
                    unidad_compras: cantCompra,
                    costo_unitario_compras: precioCompra,
                    total_compras: num(pick(r, ['total_compras'], cantCompra * precioCompra)),
                    unidad_costo_reacondicionamiento: unidReacond,
                    reposicion_reacondicionamiento: num(pick(r, ['reposicion_reacondicionamiento', 'cmp_sub_reposicion_reacondicionamiento'], unidReacond * costoInicial)),
                    unidad_diferencia_inventario: unidDifInv,
                    reposicion_diferencia_inventario: num(pick(r, ['reposicion_diferencia_inventario'], unidDifInv * costoInicial)),
                    unidad_baja_destruccion: unidBaja + unidFaltante,
                    reposicion_baja_destruccion: num(pick(r, ['reposicion_baja_destruccion'], (unidBaja + unidFaltante) * costoInicial)),
                    unidad_ipr: unidIpr,
                    costo_unitario_ipr: prUnitIpr,
                    total_ipr: montoTotalIpr,
                    reposicion_ipr: reposIpr,
                    unidad_inventario_final: num(pick(r, ['unidad_inventario_final', 'cmp_unidad_inventario_final'], inventarioFinalUnid)),
                    costo_ut_rep_final: costoFinal,
                    costo_total_final: num(pick(r, ['costo_total_final', 'cmp_sub_costo', 'cmp_sub_costo_total'], inventarioFinalUnid * costoFinal)),
                    recuento: recuento,
                    diferencia_recuento: num(pick(r, ['diferencia_recuento', 'recuento_cmp', 'recuento_cmp_sub_costo'], recuento - inventarioFinalUnid))
                };
            });
        };

        return conn.execAsync("DELETE FROM dba.tmp_ecuacion_bienes_cambio WHERE id = ?", [sessionId])
            .then(function () {
                return conn.execAsync("DELETE FROM dba.TmpRecallExistenciaEBC WHERE SessionID = ? AND Cod_Empresa = ?", [sessionId, empresa]);
            })
            .then(function () {
                return conn.execAsync("DELETE FROM dba.tmp_existencia WHERE id = ? AND cod_empresa = ?", [sessionId, empresa]);
            })
            .then(function () {
                return conn.execAsync("DELETE FROM dba.tmp_ebc_ipr_aux WHERE fecha_ini = ? AND fecha_fin = ?", [fDesde, fHasta]);
            })
            .then(function () {
                return conn.execAsync(
                    "CALL dba.recall_existencia_bago_ebc_rpt(?,?,?,?,?,?)",
                    [sessionId, codFamilia, empresa, sucursal || '', '1901-01-01', fHastaRecall]
                );
            })
            .then(function () {
                return conn.execAsync(
                    "CALL dba.sp_tmp_ebc_new(?,?,?,?,?,?)",
                    [sessionId, codFamilia, empresa, sucursal || '', fDesde, fHasta]
                );
            })
            .then(function () {
                return conn.execAsync(
                    "CALL dba.Recall_Existencia_recuento_ebc_rpt(?,?,?,?,?,?)",
                    [sessionId, codFamilia, empresaRecuento, sucursal || '', '1901-01-01', fHasta]
                );
            })
            .then(function () {
                // Refuerzo de recuento: evita dependencia de cod_empresa fijo dentro del SP.
                return conn.execAsync(
                    "UPDATE dba.tmp_ecuacion_bienes_cambio t " +
                    "SET recuento = e.existencia_calc " +
                    "FROM dba.tmp_existencia e " +
                    "WHERE t.id = e.id " +
                    "AND t.cod_sucursal = e.cod_sucursal " +
                    "AND t.cod_articulo = e.cod_articulo " +
                    "AND e.id = ? " +
                    "AND e.cod_empresa = ? " +
                    "AND e.cod_sucursal = ?",
                    [sessionId, empresaRecuento, sucursal || '']
                ).catch(function () {
                    return null;
                });
            })
            .then(function () {
                return conn.execAsync(
                    "CALL dba.sp_tmp_ebc_ipr_aux(?,?,?,?,?,?)",
                    [sessionId, codFamilia, empresa, sucursal || '', fDesde, fHasta]
                );
            })
            .then(function () {
                var sqlOrig =
                    "SELECT t.*, a.des_art, a.cod_tp_art, a.estado, a.codmoneda, a.iva " +
                    "FROM dba.tmp_ecuacion_bienes_cambio t " +
                    "LEFT JOIN dba.articulo a ON a.cod_empresa = t.cod_empresa AND a.cod_articulo = t.cod_articulo " +
                    "WHERE t.id = ? ";
                var sqlOrigParams = [sessionId];
                if (articulo) {
                    if (articulo.constructor === Array) {
                        sqlOrig += "AND t.cod_articulo IN " + q.in(articulo) + " ";
                    } else {
                        sqlOrig += "AND t.cod_articulo = ? ";
                        sqlOrigParams.push(articulo);
                    }
                }
                sqlOrig += "ORDER BY t.cod_articulo";
                return conn.execAsync(sqlOrig, sqlOrigParams);
            })
            .then(normalizeOrigRows);
    };

    var sql =
        "SELECT a.cod_articulo, " +
        "a.des_art, " +
        "a.cod_tp_art, " +
        "a.estado, " +
        "a.codmoneda, " +
        "a.cod_iva, " +
        "a.iva, " +
        "ROUND(COALESCE(a.cto_prom_gs, 0), 0) AS cto_prom_gs, " +
        "ROUND(COALESCE(a.cto_ult_gs, 0), 0) AS cto_ult_gs, " +
        "ROUND(COALESCE(a.cto_prom_me, 0), 2) AS cto_prom_me, " +
        "ROUND(COALESCE(a.cto_ult_me, 0), 2) AS cto_ult_me, " +
        "COALESCE(SUM(ad.existencia), 0) AS existencia " +
        "FROM dba.articulo a " +
        "JOIN dba.tpoart ta ON ta.cod_tp_art = a.cod_tp_art " +
        "LEFT JOIN dba.artdep ad ON ad.cod_empresa = a.cod_empresa " +
        "AND ad.cod_articulo = a.cod_articulo " +
        "WHERE a.cod_empresa = ? " +
        "AND ta.ctrlexistencia = 'S' " +
        "AND COALESCE(ta.tpdef, 'S') = 'S' ";

    var sqlParams = [empresa];

    if (tipo) {
        sql += "AND a.cod_tp_art = ? ";
        sqlParams.push(tipo);
    }
    if (estado && estado !== 'T') {
        sql += "AND a.estado = ? ";
        sqlParams.push(estado);
    }
    if (soloHijos) {
        sql += "AND COALESCE(a.codartpad, '') <> '' ";
    }
    sql += buildRangeFilter("a.cod_familia", incCodFamilia, false);
    sql += buildRangeFilter("a.cod_familia", excCodFamilia, true);
    sql += buildRangeFilter("a.cod_grupo", incCodGrupo, false);
    sql += buildRangeFilter("a.cod_grupo", excCodGrupo, true);
    sql += buildRangeFilter("a.cod_subgrupo", incCodSubgrupo, false);
    sql += buildRangeFilter("a.cod_subgrupo", excCodSubgrupo, true);
    sql += buildRangeFilter("a.cod_individual", incCodIndividual, false);
    sql += buildRangeFilter("a.cod_individual", excCodIndividual, true);
    if (sucursal) {
        sql += "AND ad.cod_sucursal = ? ";
        sqlParams.push(sucursal);
    }
    if (deposito) {
        sql += "AND ad.cod_deposito = ? ";
        sqlParams.push(deposito);
    }

    if (articulo) {
        if (articulo.constructor === Array) {
            sql += "AND a.cod_articulo IN " + q.in(articulo) + " ";
        } else {
            sql += "AND a.cod_articulo = ? ";
            sqlParams.push(articulo);
        }
    }

    sql +=
        "GROUP BY a.cod_articulo, a.des_art, a.cod_tp_art, a.estado, a.codmoneda, a.cod_iva, a.iva, " +
        "a.cto_prom_gs, a.cto_ult_gs, a.cto_prom_me, a.cto_ult_me " +
        "ORDER BY a.cod_articulo";

    var sqlFinal = sql;
    if (tipo) {
        sqlFinal = sqlFinal.replace("WHERE a.cod_empresa = ? ", "WHERE a.cod_empresa = " + sqlValue(empresa) + " ");
    } else {
        sqlFinal = sqlFinal.replace("WHERE a.cod_empresa = ? ", "WHERE a.cod_empresa = " + sqlValue(empresa) + " ");
    }
    sqlFinal = sqlFinal
        .replace(/AND a\.cod_tp_art = \? /g, tipo ? ("AND a.cod_tp_art = " + sqlValue(tipo) + " ") : '')
        .replace(/AND a\.estado = \? /g, (estado && estado !== 'T') ? ("AND a.estado = " + sqlValue(estado) + " ") : '')
        .replace(/AND ad\.cod_sucursal = \? /g, sucursal ? ("AND ad.cod_sucursal = " + sqlValue(sucursal) + " ") : '')
        .replace(/AND ad\.cod_deposito = \? /g, deposito ? ("AND ad.cod_deposito = " + sqlValue(deposito) + " ") : '');
    if (articulo) {
        if (articulo.constructor === Array) {
            sqlFinal += "";
        } else {
            sqlFinal = sqlFinal.replace("GROUP BY", "AND a.cod_articulo = " + sqlValue(articulo) + " GROUP BY");
        }
    }
    if (articulo && articulo.constructor === Array) {
        sqlFinal = sqlFinal.replace("GROUP BY", "AND a.cod_articulo IN " + q.in(articulo) + " GROUP BY");
    }

    return runEbcOriginal().then(function (origRows) {
        logCostoArticuloFull('[FLOW] runEbcOriginal rows=' + ((origRows && origRows.length) || 0) + ' sessionId=' + sessionId);
        if (origRows) {
            reportProgress('Finalizado', 100, 'Informe generado');
            return origRows;
        }
        return runEbcMaterialesFull();
    }).then(function (ebcExtRows) {
        logCostoArticuloFull('[FLOW] runEbcMaterialesFull rows=' + ((ebcExtRows && ebcExtRows.length) || 0) + ' sessionId=' + sessionId);
        if (ebcExtRows) {
            reportProgress('Finalizado', 100, 'Informe generado');
            return ebcExtRows;
        }
        return runEbcMateriales();
    }).then(function (ebcRows) {
        logCostoArticuloFull('[FLOW] runEbcMateriales rows=' + ((ebcRows && ebcRows.length) || 0) + ' sessionId=' + sessionId);
        if (ebcRows) {
            reportProgress('Finalizado', 100, 'Informe generado');
            return ebcRows;
        }
        if (!recalcular) {
            reportProgress('Consulta final', 95, 'Leyendo resultado final');
            return conn.execAsync(sqlFinal);
        }
        reportProgress('Preparacion base', 10, 'Cargando temporales base');
        return loadTmpArticulo().then(function () {
            reportProgress('Recall', 60, 'Ejecutando recalculo');
            return runRecall();
        }).then(function () {
            reportProgress('Consulta final', 95, 'Leyendo resultado final');
            return conn.execAsync(sqlFinal);
        });
    }).then(function (rows) {
        return persistMonthlyHistory(rows);
    }).then(function (rows) {
        logCostoArticuloFull('[END] rows=' + ((rows && rows.length) || 0) + ' sessionId=' + sessionId);
        reportProgress('Finalizado', 100, 'Informe generado');
        return rows;
    }).catch(function (err) {
        logCostoArticuloFull('[FATAL] sessionId=' + sessionId + ' detalle=' + (err && err.message ? err.message : err));
        throw err;
    }).finally(function () {
        logCostoArticuloFull('[CLEANUP] sessionId=' + sessionId);
        var preserveTemps =
            String(query.debug_recall || 'N').toUpperCase() === 'S' ||
            String(query.debug_preserve_temps || 'N').toUpperCase() === 'S';
        if (!recalcular &&
            String(query.ecuacion_orig || 'N').toUpperCase() !== 'S' &&
            String(query.ecuacion_mat || 'N').toUpperCase() !== 'S') {
            return conn.execAsync("COMMIT").catch(function () {
                return null;
            });
        }
        if (preserveTemps) {
            logCostoArticuloFull('[CLEANUP_SKIP] sessionId=' + sessionId + ' motivo=debug preserve temps');
            return conn.execAsync("COMMIT").catch(function () {
                return null;
            });
        }
        var cleanup = [
            conn.execAsync(
                "DELETE FROM dba.tmparticulo WHERE sessionid = ? AND cod_empresa = ?",
                [sessionId, empresa]
            ),
            conn.execAsync(
                "DELETE FROM dba.TmpRecallExistenciaEBC_Materiales WHERE SessionID = ?",
                [sessionId]
            ),
            conn.execAsync(
                "DELETE FROM dba.tmp_ExistenciaEBC_Materiales WHERE SessionID = ?",
                [sessionId]
            ),
            conn.execAsync(
                "DELETE FROM dba.tmp_ecuacion_bienes_cambio_materiales WHERE SessionID = ?",
                [sessionId]
            ),
            conn.execAsync(
                "DELETE FROM dba.tmp_ecuacion_bienes_cambio WHERE id = ?",
                [sessionId]
            ),
            conn.execAsync(
                "DELETE FROM dba.tmp_ebc_ipr_aux WHERE fecha_ini = ? AND fecha_fin = ?",
                [fechaDesde || fechaHasta || null, fechaHasta || fechaDesde || null]
            ),
            conn.execAsync(
                "DELETE FROM dba.TmpRecallExistenciaEBC WHERE SessionID = ?",
                [sessionId]
            ),
            conn.execAsync(
                "DELETE FROM dba.tmp_existencia WHERE id = ?",
                [sessionId]
            ),
            conn.execAsync(
                "DELETE FROM dba.tmpdespachos WHERE session_id = ? AND cod_empresa = ?",
                [sessionId, empresaDespachos]
            ),
            conn.execAsync(
                "DELETE FROM dba.tmp_rpt_compuestos WHERE SessionID = ?",
                [sessionId]
            ),
            conn.execAsync(
                "DELETE FROM dba.tmp_realizadopor_compuesto WHERE SessionID = ?",
                [sessionId]
            )
        ];
        return Promise.all(cleanup)
            .catch(function () {
                return null;
            })
            .then(function () {
                return conn.execAsync("COMMIT").catch(function () {
                    return null;
                });
            });
    });
};

Stock.diagnosticoEbcMateriales = function (params, query) {
    var empresa = params.empresa;
    var estado = (query.estado || '').trim();
    var tipo = (query.tipo || '').trim();
    var articulo = query.articulo;
    var soloHijos = String(query.solo_hijos || 'N').toUpperCase() === 'S';
    var fechaDesde = (query.fechad || '').trim();
    var fechaHasta = (query.fechah || '').trim();
    var sessionId = buildSessionId();
    var incCodFamilia = (query.inc_cod_familia || '').trim();
    var excCodFamilia = (query.exc_cod_familia || '').trim();
    var incCodGrupo = (query.inc_cod_grupo || '').trim();
    var excCodGrupo = (query.exc_cod_grupo || '').trim();
    var incCodSubgrupo = (query.inc_cod_subgrupo || '').trim();
    var excCodSubgrupo = (query.exc_cod_subgrupo || '').trim();
    var incCodIndividual = (query.inc_cod_individual || '').trim();
    var excCodIndividual = (query.exc_cod_individual || '').trim();
    var fHastaRecall = fechaHasta || fechaDesde || null;
    var pasos = [];

    function addPaso(nombre, detalle) {
        pasos.push({
            paso: nombre,
            detalle: detalle || '',
            fecha_hora: new Date().toISOString()
        });
        logCostoArticuloFull('[EBC_MAT_DIAG] ' + nombre + ' sessionId=' + sessionId + (detalle ? ' detalle=' + detalle : ''));
    }

    function loadTmpArticuloDiag() {
        var artWhere =
            "FROM dba.articulo a " +
            "JOIN dba.tpoart ta ON ta.cod_tp_art = a.cod_tp_art " +
            "WHERE a.cod_empresa = ? " +
            "AND ta.ctrlexistencia = 'S' " +
            "AND COALESCE(ta.tpdef, 'S') = 'S' ";

        if (tipo) {
            artWhere += "AND a.cod_tp_art = ? ";
        }
        if (estado && estado !== 'T') {
            artWhere += "AND a.estado = ? ";
        }
        if (soloHijos) {
            artWhere += "AND COALESCE(a.codartpad, '') <> '' ";
        }
        artWhere += buildRangeFilter("a.cod_familia", incCodFamilia, false);
        artWhere += buildRangeFilter("a.cod_familia", excCodFamilia, true);
        artWhere += buildRangeFilter("a.cod_grupo", incCodGrupo, false);
        artWhere += buildRangeFilter("a.cod_grupo", excCodGrupo, true);
        artWhere += buildRangeFilter("a.cod_subgrupo", incCodSubgrupo, false);
        artWhere += buildRangeFilter("a.cod_subgrupo", excCodSubgrupo, true);
        artWhere += buildRangeFilter("a.cod_individual", incCodIndividual, false);
        artWhere += buildRangeFilter("a.cod_individual", excCodIndividual, true);
        if (articulo) {
            if (articulo.constructor === Array) {
                artWhere += "AND a.cod_articulo IN " + q.in(articulo) + " ";
            } else {
                artWhere += "AND a.cod_articulo = ? ";
            }
        }

        var artWhereSql = artWhere
            .replace("WHERE a.cod_empresa = ? ", "WHERE a.cod_empresa = " + sqlValue(empresa) + " ")
            .replace(/AND a\.cod_tp_art = \? /g, tipo ? ("AND a.cod_tp_art = " + sqlValue(tipo) + " ") : '')
            .replace(/AND a\.estado = \? /g, (estado && estado !== 'T') ? ("AND a.estado = " + sqlValue(estado) + " ") : '');

        if (articulo) {
            if (articulo.constructor !== Array) {
                artWhereSql = artWhereSql.replace(/AND a\.cod_articulo = \? /g, "AND a.cod_articulo = " + sqlValue(articulo) + " ");
            }
        }

        var countSql = "SELECT COUNT(*) AS total " + artWhereSql;
        var insertSql =
            "INSERT INTO dba.tmparticulo(sessionid,cod_empresa,cod_articulo,des_art) " +
            "SELECT " + sqlValue(sessionId) + ", " + sqlValue(empresa) + ", a.cod_articulo, COALESCE(a.des_art, '') " +
            artWhereSql;

        return conn.execAsync(
            "DELETE FROM dba.tmparticulo WHERE sessionid = ? AND cod_empresa = ?",
            [sessionId, empresa]
        ).then(function () {
            addPaso('tmparticulo_limpio');
            return conn.execAsync(countSql);
        }).then(function (rows) {
            var total = 0;
            if (rows && rows.length) {
                total = Number(rows[0].total || rows[0].TOTAL || 0);
                if (isNaN(total)) total = 0;
            }
            addPaso('tmparticulo_seleccionados', String(total));
            if (!total) {
                return 0;
            }
            return conn.execAsync(insertSql).then(function () {
                addPaso('tmparticulo_insertado', String(total));
                return total;
            });
        });
    }

    function getCount(sql, paramsList) {
        return conn.execAsync(sql, paramsList).then(function (rows) {
            if (!rows || !rows.length) return 0;
            var row = rows[0];
            var value = row.total || row.TOTAL || row.cantidad || row.CANTIDAD || 0;
            value = Number(value);
            return isNaN(value) ? 0 : value;
        });
    }

    addPaso('inicio', 'empresa=' + empresa + ', sessionId=' + sessionId);

    return loadTmpArticuloDiag()
        .then(function () {
            addPaso('recall_inicio', 'hasta=' + (fHastaRecall || 'NULL'));
            return conn.execAsync(
                "CALL dba.Recall_Existencia_bago_ebc_rpt_materiales_Rpt(?,?,?,?)",
                [sessionId, empresa, '1901-01-01', fHastaRecall]
            );
        })
        .then(function () {
            addPaso('recall_ok');
            return Promise.all([
                getCount(
                    "SELECT COUNT(*) AS total FROM dba.tmparticulo WHERE sessionid = ? AND cod_empresa = ?",
                    [sessionId, empresa]
                ),
                getCount(
                    "SELECT COUNT(*) AS total FROM dba.TmpRecallExistenciaEBC_Materiales WHERE SessionID = ?",
                    [sessionId]
                ),
                getCount(
                    "SELECT COUNT(*) AS total FROM dba.tmp_ExistenciaEBC_Materiales WHERE SessionID = ?",
                    [sessionId]
                )
            ]);
        })
        .then(function (counts) {
            addPaso('conteos_ok', 'tmparticulo=' + counts[0] + ', recall=' + counts[1] + ', existencia=' + counts[2]);
            return [{
                sessionId: sessionId,
                empresa: empresa,
                fecha_desde: fechaDesde || null,
                fecha_hasta: fechaHasta || null,
                tmparticulo: counts[0],
                tmp_recall_materiales: counts[1],
                tmp_existencia_materiales: counts[2],
                pasos: pasos
            }];
        })
        .catch(function (err) {
            addPaso('error', err && err.message ? err.message : String(err));
            throw err;
        })
        .finally(function () {
            return Promise.all([
                conn.execAsync(
                    "DELETE FROM dba.tmparticulo WHERE sessionid = ? AND cod_empresa = ?",
                    [sessionId, empresa]
                ),
                conn.execAsync(
                    "DELETE FROM dba.TmpRecallExistenciaEBC_Materiales WHERE SessionID = ?",
                    [sessionId]
                ),
                conn.execAsync(
                    "DELETE FROM dba.tmp_ExistenciaEBC_Materiales WHERE SessionID = ?",
                    [sessionId]
                )
            ]).catch(function () {
                return null;
            });
        });
};

Stock.diagnosticoRecallEbcMaterialesSolo = function (params, query) {
    var empresa = params.empresa;
    var fechaDesde = (query.fechad || '').trim();
    var fechaHasta = (query.fechah || '').trim();
    var sessionId = buildSessionId();
    var fHastaRecall = fechaHasta || fechaDesde || null;
    var pasos = [];

    function addPaso(nombre, detalle) {
        pasos.push({
            paso: nombre,
            detalle: detalle || '',
            fecha_hora: new Date().toISOString()
        });
        logCostoArticuloFull('[EBC_MAT_DIAG_SOLO] ' + nombre + ' sessionId=' + sessionId + (detalle ? ' detalle=' + detalle : ''));
    }

    function getCount(sql, paramsList) {
        return conn.execAsync(sql, paramsList).then(function (rows) {
            if (!rows || !rows.length) return 0;
            var row = rows[0];
            var value = row.total || row.TOTAL || row.cantidad || row.CANTIDAD || 0;
            value = Number(value);
            return isNaN(value) ? 0 : value;
        });
    }

    addPaso('inicio', 'empresa=' + empresa + ', sessionId=' + sessionId + ', hasta=' + (fHastaRecall || 'NULL'));

    return Promise.resolve()
        .then(function () {
            addPaso('recall_inicio');
            return conn.execAsync(
                "CALL dba.Recall_Existencia_bago_ebc_rpt_materiales_Rpt(?,?,?,?)",
                [sessionId, empresa, '1901-01-01', fHastaRecall]
            );
        })
        .then(function () {
            addPaso('recall_ok');
            return Promise.all([
                getCount(
                    "SELECT COUNT(*) AS total FROM dba.TmpRecallExistenciaEBC_Materiales WHERE SessionID = ?",
                    [sessionId]
                ),
                getCount(
                    "SELECT COUNT(*) AS total FROM dba.tmp_ExistenciaEBC_Materiales WHERE SessionID = ?",
                    [sessionId]
                )
            ]);
        })
        .then(function (counts) {
            addPaso('conteos_ok', 'recall=' + counts[0] + ', existencia=' + counts[1]);
            return [{
                sessionId: sessionId,
                empresa: empresa,
                fecha_desde: fechaDesde || null,
                fecha_hasta: fechaHasta || null,
                tmp_recall_materiales: counts[0],
                tmp_existencia_materiales: counts[1],
                pasos: pasos
            }];
        })
        .catch(function (err) {
            addPaso('error', err && err.message ? err.message : String(err));
            throw err;
        })
        .finally(function () {
            return Promise.all([
                conn.execAsync(
                    "DELETE FROM dba.TmpRecallExistenciaEBC_Materiales WHERE SessionID = ?",
                    [sessionId]
                ),
                conn.execAsync(
                    "DELETE FROM dba.tmp_ExistenciaEBC_Materiales WHERE SessionID = ?",
                    [sessionId]
                )
            ]).catch(function () {
                return null;
            });
        });
};

module.exports = Stock;
