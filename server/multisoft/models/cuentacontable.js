var conn = require('../db_integrado');

var CuentaContable = {};

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

function concatExpr(parts) {
    var op = dbIsPostgres() ? ' || ' : ' + ';
    return '(' + parts.join(op) + ')';
}

function safeCbError(cb, err, label) {
    console.error('[' + label + '] Error ejecutando consulta:', err && (err.message || err));
    cb([]);
}

function esc(v) {
    return String(v == null ? '' : v).replace(/'/g, "''");
}

function firstTableAvailable(candidates, done) {
    var idx = 0;
    function next() {
        if (idx >= candidates.length) return done(null);
        var t = candidates[idx++];
        var probe = dbIsPostgres()
            ? ("SELECT 1 FROM " + t + " LIMIT 1")
            : ("SELECT TOP 1 1 FROM " + t);
        conn.exec(probe, function (err) {
            if (!err) return done(t);
            next();
        });
    }
    next();
}

function normalizeCuentaRows(rows) {
    return (rows || []).map(function (r) {
        return {
            CodPlanCta: (typeof r.CodPlanCta !== 'undefined' && r.CodPlanCta !== null) ? r.CodPlanCta : r.codplancta,
            Nombre: (typeof r.Nombre !== 'undefined' && r.Nombre !== null) ? r.Nombre : r.nombre
        };
    });
}

CuentaContable.all = function (params, cb) {
    var nombreExpr = concatExpr(["cast(CodPlanCta as varchar)", "' - '", "Nombre"]);
    var sql = "select CodPlanCta," + nombreExpr + " as Nombre from DBA.PLANCTA where Cod_Empresa = '" + params.empresa + "' and PERIODO = '" + params.periodo + "' ORDER BY DBA.PLANCTA.CodPlanCta";
    conn.exec(sql, function (err, row) {
        if (err) return safeCbError(cb, err, 'CuentaContable.all');
        cb(normalizeCuentaRows(row));
    });
};

CuentaContable.planList = function (params, cb) {
    var sql = "SELECT dba.plancta.cod_empresa, " +
        "dba.plancta.Periodo, " +
        "dba.plancta.codplancta, " +
        "dba.plancta.nombre, " +
        "dba.plancta.imputable, " +
        "dba.plancta.auxiliar, " +
        "dba.plancta.presup, " +
        "dba.plancta.codplanctapad, " +
        "dba.plancta.codmoneda, " +
        "dba.plancta.tiposaldo, " +
        "dba.plancta.nivel, " +
        "dba.plancta.codplanctafiscal, " +
        "dba.plancta.funcion " +
        "FROM dba.plancta " +
        "WHERE dba.plancta.cod_empresa = '" + params.empresa + "' " +
        "AND dba.plancta.periodo = '" + params.periodo + "' " +
        "ORDER BY dba.plancta.codplancta";
    conn.exec(sql, function (err, row) {
        if (err) return safeCbError(cb, err, 'CuentaContable.planList');
        cb(row);
    });
};

CuentaContable.pucList = function (params, cb) {
    var candidates = dbIsPostgres()
        ? ['dba.planctaestrategico', 'dba.planctaunico']
        : ['dba.planctaunico', 'dba.planctaestrategico'];

    firstTableAvailable(candidates, function (tableName) {
        if (!tableName) {
            return safeCbError(cb, new Error('No existe tabla PUC: dba.planctaunico / dba.planctaestrategico'), 'CuentaContable.pucList');
        }
        var alias = 'p';
        var sql = "SELECT " + alias + ".cod_empresa, " +
            alias + ".periodo, " +
            alias + ".codplanctaestrategico as CodPlanCta, " +
            alias + ".nombre as Nombre, " +
            alias + ".codplanctaestrategicopad, " +
            alias + ".tiposaldo, " +
            alias + ".nivel, " +
            alias + ".imputable, " +
            alias + ".codmoneda as CodMoneda, " +
            alias + ".codplanctaestrategicopad as CuentaPadre, " +
            "padre.nombre as NombrePadre " +
            "FROM " + tableName + " " + alias + " " +
            "LEFT OUTER JOIN " + tableName + " padre " +
            "ON " + alias + ".cod_empresa = padre.cod_empresa " +
            "AND " + alias + ".periodo = padre.periodo " +
            "AND " + alias + ".codplanctaestrategicopad = padre.codplanctaestrategico " +
            "WHERE " + alias + ".cod_empresa = '" + params.empresa + "' " +
            "AND " + alias + ".periodo = '" + params.periodo + "' " +
            "ORDER BY " + alias + ".codplanctaestrategico";

        conn.exec(sql, function (err, row) {
            if (err) return safeCbError(cb, err, 'CuentaContable.pucList');
            cb(row || []);
        });
    });
};

CuentaContable.aux = function (params, cb) {
    var codExpr = concatExpr(["cast(DBA.PLANAUXI.CodPlanAux as varchar)", "'-'", "cast(DBA.PLANAUXI.CodPlanCta as varchar)"]);
    var nomExpr = concatExpr(["cast(DBA.PLANAUXI.CodPlanAux as varchar)", "'/'", "cast(DBA.PLANAUXI.CodPlanCta as varchar)", "' - '", "Nombre"]);
    var sql = "select " + codExpr + " as CodPlanAux," + nomExpr + " as Nombre from DBA.PLANAUXI where Cod_Empresa = '" + params.empresa + "' and PERIODO = '" + params.periodo + "' ORDER BY DBA.PLANAUXI.CodPlanAux";
    conn.exec(sql, function (err, row) {
        if (err) return safeCbError(cb, err, 'CuentaContable.aux');
        cb(row);
    });
};

CuentaContable.auxquery = function (params, query, cb) {
    if (query.nombre == null)
        query.nombre = ""
    if (query.codigo == null)
        query.codigo = ""
    console.log("select * from dba.PLANAUXI " +
        "where periodo = '" + params.periodo + "' " +
        "and Cod_Empresa = '" + params.empresa + "' " +
        "and Imputable = 'S' " +
        "and dba.PLANAUXI.CodPlanCta >= '" + params.cuentad + "' " +
        "and dba.PLANAUXI.CodPlanCta <= '" + params.cuentah + "' " +
        "and dba.PLANAUXI.Nombre like '%" + query.nombre + "%' " +
        "and dba.PLANAUXI.CodPlanAux like '%" + query.codigo + "%'")
    conn.exec("select * from dba.PLANAUXI " +
        "where periodo = '" + params.periodo + "' " +
        "and Cod_Empresa = '" + params.empresa + "' " +
        "and Imputable = 'S' " +
        "and dba.PLANAUXI.CodPlanCta >= '" + params.cuentad + "' " +
        "and dba.PLANAUXI.CodPlanCta <= '" + params.cuentah + "' " +
        "and dba.PLANAUXI.Nombre like '%" + query.nombre + "%' " +
        "and dba.PLANAUXI.CodPlanAux like '%" + query.codigo + "%'", function (err, row) {
        if (err) return safeCbError(cb, err, 'CuentaContable.auxquery');
        cb(row);
    });
};

CuentaContable.auxiliar = function (params, query, cb) {
    query = query || {};
    var empresa = esc(params && params.empresa);
    var periodo = esc(query.periodo || '');
    var cuentad = esc(query.cuentad || '');
    var cuentah = esc(query.cuentah || '');
    var filtro = esc(query.filter || '');

    var sql = "select p.CodPlanAux, p.Nombre, p.CodPlanCta " +
        "from dba.PLANAUXI p where p.Cod_Empresa = '" + empresa + "' " +
        "and p.Imputable = 'S' ";

    if (periodo) {
        sql += "and p.periodo = '" + periodo + "' ";
    }
    if (cuentad && cuentah) {
        sql += "and p.CodPlanCta >= '" + cuentad + "' and p.CodPlanCta <= '" + cuentah + "' ";
    }
    if (filtro) {
        sql += "and (p.Nombre like '%" + filtro + "%' or p.CodPlanAux like '%" + filtro + "%') ";
    }
    sql += "order by p.CodPlanAux";

    conn.exec(sql, function (err, row) {
        if (err) return safeCbError(cb, err, 'CuentaContable.auxiliar');
        cb(row || []);
    });
};

module.exports = CuentaContable;
