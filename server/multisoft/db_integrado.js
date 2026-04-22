var Promise = require('bluebird');
var config = require('config');

var dbConfig = null;
var dbDisabled = false;
try {
    dbConfig = config.get('integrado.dbConfig');
    if (dbConfig && typeof dbConfig.disabled !== 'undefined') {
        dbDisabled = !!dbConfig.disabled;
    }
} catch (e) {
    console.warn('No DB config found for integrado:', e.message || e);
}

var activeConn = null;
var activeEngine = 'sqlanywhere';
var isReconnecting = false;
var reconnectQueue = [];

function formatSqlValue(value) {
    if (value === null || value === undefined) return 'NULL';
    if (value instanceof Date) {
        return "'" + value.toISOString().slice(0, 19).replace('T', ' ') + "'";
    }
    if (typeof value === 'number') {
        return isFinite(value) ? String(value) : 'NULL';
    }
    if (typeof value === 'boolean') {
        return value ? '1' : '0';
    }
    return "'" + String(value).replace(/'/g, "''") + "'";
}

function bindSqlParams(sql, params) {
    if (!params || !Array.isArray(params) || !params.length) return sql;
    var idx = 0;
    return String(sql).replace(/\?/g, function () {
        if (idx >= params.length) return '?';
        return formatSqlValue(params[idx++]);
    });
}

function parseHostPort(host, defaultPort) {
    var out = { host: host || '', port: defaultPort };
    if (out.host && out.host.indexOf(':') >= 0) {
        var p = out.host.split(':');
        out.host = p[0];
        out.port = parseInt(p[1], 10) || defaultPort;
    }
    return out;
}

function normalizeSqlAnywhereConfig(cfg) {
    if (!cfg) return cfg;
    var out = Object.assign({}, cfg);
    if (out.port && out.host && out.host.indexOf(':') === -1) {
        out.host = out.host + ':' + out.port;
    }
    delete out.port;
    delete out.disabled;
    delete out.db_engine;
    return out;
}

function normalizePgConfig(cfg) {
    cfg = cfg || {};
    var hp = parseHostPort(cfg.host, cfg.port || 5432);
    return {
        host: hp.host || 'localhost',
        port: hp.port || 5432,
        database: cfg.DatabaseName || cfg.database || '',
        user: cfg.UserID || cfg.username || '',
        password: cfg.Password || cfg.password || ''
    };
}

function isSqlAnywhereTerminated(err) {
    if (!err) return false;
    var code = err.code || err.Code;
    var msg = String(err.message || err.Msg || err.sqlMessage || err).toLowerCase();
    return code === -308 ||
        msg.indexOf('connection was terminated') >= 0 ||
        msg.indexOf('connection terminated') >= 0 ||
        msg.indexOf('not connected') >= 0;
}

function isPostgresTerminated(err) {
    if (!err) return false;
    var code = err.code || err.Code;
    var msg = String(err.message || err.Msg || err.sqlMessage || err).toLowerCase();
    return code === '57P01' || code === '57P02' || code === 'ECONNRESET' || code === 'EPIPE' ||
        msg.indexOf('connection terminated unexpectedly') >= 0 ||
        msg.indexOf('client has encountered a connection error') >= 0 ||
        msg.indexOf('connection error') >= 0;
}

function runReconnectQueue(err) {
    var q = reconnectQueue.slice(0);
    reconnectQueue = [];
    q.forEach(function (fn) {
        try { fn(err); } catch (e) { console.error(e); }
    });
}

function disconnectActive(cb) {
    if (!activeConn || typeof activeConn.disconnect !== 'function') {
        if (cb) cb(null);
        return;
    }
    try {
        activeConn.disconnect(function () {
            if (cb) cb(null);
        });
    } catch (e) {
        if (cb) cb(e);
    }
}

function createSqlAnywhereAdapter(cfg, cb) {
    var sa;
    try {
        sa = require('sqlanywhere');
    } catch (e) {
        return cb(e);
    }
    var raw = sa.createConnection();
    raw.connect(normalizeSqlAnywhereConfig(cfg), function (err) {
        if (err) return cb(err);
        if (typeof raw.exec !== 'function' && typeof raw.query === 'function') raw.exec = raw.query;
        if (typeof raw.query !== 'function' && typeof raw.exec === 'function') raw.query = raw.exec;
        cb(null, {
            query: function (sql, done) { raw.query(sql, done); },
            exec: function (sql, done) { raw.exec(sql, done); },
            disconnect: function (done) {
                try { raw.disconnect(function () { if (done) done(null); }); }
                catch (e) { if (done) done(e); }
            },
            engine: 'sqlanywhere'
        });
    });
}

function createPostgresAdapter(cfg, cb) {
    var pg;
    try {
        pg = require('pg');
    } catch (e) {
        return cb(e);
    }
    try {
        var pgVer = require('pg/package.json').version || '0.0.0';
        var major = parseInt(String(pgVer).split('.')[0], 10) || 0;
        if (major < 8) {
            return cb(new Error(
                "La version de 'pg' instalada (" + pgVer + ") no soporta autenticacion SCRAM de PostgreSQL. " +
                "Use usuario con md5/trust o actualice 'pg' a v8+."
            ));
        }
    } catch (e) {
        // si no podemos leer la version, seguimos con intento de conexion
    }
    var Client = pg.Client;
    var raw = new Client(normalizePgConfig(cfg));
    raw.connect(function (err) {
        if (err) return cb(err);
        cb(null, {
            query: function (sql, done) {
                raw.query(sql, function (e, res) {
                    done(e, res && res.rows ? res.rows : []);
                });
            },
            exec: function (sql, done) {
                raw.query(sql, function (e, res) {
                    done(e, res && res.rows ? res.rows : []);
                });
            },
            disconnect: function (done) {
                try { raw.end(function () { if (done) done(null); }); }
                catch (e) { if (done) done(e); }
            },
            engine: 'postgres'
        });
    });
}

function connectWithCurrentConfig(cb) {
    if (!dbConfig || dbDisabled) {
        client._disabled = true;
        client._disabled_reason = 'Integrado deshabilitado';
        client._engine = '';
        return cb(new Error(client._disabled_reason));
    }
    var engine = (dbConfig.db_engine || 'sqlanywhere').toLowerCase();
    var build = engine === 'postgres' ? createPostgresAdapter : createSqlAnywhereAdapter;
    disconnectActive(function () {
        build(dbConfig, function (err, adapter) {
            if (err) {
                client._disabled = true;
                client._disabled_reason = err.message || String(err);
                return cb(err);
            }
            activeConn = adapter;
            activeEngine = adapter.engine || engine;
            client._engine = activeEngine;
            client._disabled = false;
            client._disabled_reason = '';
            cb(null);
        });
    });
}

function reconnectSafely(cb) {
    if (isReconnecting) {
        reconnectQueue.push(cb);
        return;
    }
    isReconnecting = true;
    reconnectQueue.push(cb);
    connectWithCurrentConfig(function (err) {
        isReconnecting = false;
        runReconnectQueue(err || null);
    });
}

function runWithRetry(method, sql, cb) {
    cb = (typeof cb === 'function') ? cb : function () {};
    if (client._disabled || !activeConn) {
        var reason = client._disabled_reason || 'Base no disponible';
        if (String(reason).toLowerCase().indexOf("version de 'pg'") >= 0) {
            // Evita romper endpoints cuando el driver no soporta SCRAM.
            return cb(null, []);
        }
        return cb(new Error(reason));
    }
    var retried = false;
    function execute() {
        var fn = (method === 'exec' ? activeConn.exec : activeConn.query) || activeConn.query;
        fn(sql, function (err, rows) {
            var shouldReconnect = activeEngine === 'postgres' ? isPostgresTerminated(err) : isSqlAnywhereTerminated(err);
            if (err && shouldReconnect && !retried) {
                retried = true;
                return reconnectSafely(function (reErr) {
                    if (reErr) return cb(err);
                    execute();
                });
            }
            cb(err, rows);
        });
    }
    execute();
}

var client = {
    _disabled: true,
    _disabled_reason: 'No inicializado',
    _engine: '',
    query: function (sql, params, cb) {
        if (typeof params === 'function') {
            cb = params;
            params = null;
        }
        runWithRetry('query', bindSqlParams(sql, params), cb || function () {});
    },
    exec: function (sql, params, cb) {
        if (typeof params === 'function') {
            cb = params;
            params = null;
        }
        runWithRetry('exec', bindSqlParams(sql, params), cb || function () {});
    },
    reconnect: function (cb) {
        reconnectSafely(function (err) {
            if (cb) cb(err || null);
        });
    },
    applyConfig: function (newConfig, cb) {
        dbConfig = newConfig;
        dbDisabled = !!(dbConfig && dbConfig.disabled);
    if (!dbConfig || dbDisabled) {
        client._disabled = true;
        client._disabled_reason = 'Integrado deshabilitado';
        client._engine = '';
        if (cb) return cb(null);
        return;
    }
        reconnectSafely(function (err) {
            if (cb) cb(err || null);
        });
    },
    disconnect: function (cb) { disconnectActive(cb || function () {}); },
    discon: function () { disconnectActive(function () {}); }
};

client.getStatus = function () {
    return {
        enabled: !client._disabled,
        reason: client._disabled_reason || '',
        engine: client._engine || activeEngine || '',
        configured_engine: (dbConfig && dbConfig.db_engine) ? String(dbConfig.db_engine).toLowerCase() : 'sqlanywhere'
    };
};

if (dbConfig && !dbDisabled) {
    connectWithCurrentConfig(function (err) {
        if (err) {
            console.warn('No se pudo conectar Integrado:', err.message || err);
        } else {
            console.log('Conectado Integrado con motor:', activeEngine);
        }
    });
} else {
    client._disabled = true;
    client._disabled_reason = 'Integrado deshabilitado';
}

module.exports = Promise.promisifyAll(client);
