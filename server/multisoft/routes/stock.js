var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var Stock = require('../models/stock');
var Articulo = require('../models/articulo');
var asyncCostoArticuloJobs = Object.create(null);
var asyncCostoArticuloJobsByClient = Object.create(null);

function buildAsyncJobId() {
    return String(Date.now()) + '-' + Math.floor(Math.random() * 1000000);
}

function getAsyncClientKey(params, query) {
    return [
        params.empresa || '',
        String(query.client_session_id || '').trim()
    ].join('|');
}

function sanitizeAsyncJob(job) {
    if (!job) return null;
    return {
        job_id: job.id,
        status: job.status,
        progress: job.progress || 0,
        step: job.step || '',
        message: job.message || '',
        error: job.error || '',
        created_at: job.created_at,
        started_at: job.started_at,
        ended_at: job.ended_at,
        client_session_id: job.client_session_id || '',
        empresa: job.empresa || ''
    };
}

function cleanupAsyncJobIndex(job) {
    if (!job) return;
    var clientKey = job.client_key || '';
    if (clientKey && asyncCostoArticuloJobsByClient[clientKey] === job.id) {
        delete asyncCostoArticuloJobsByClient[clientKey];
    }
}

function createAsyncCostoArticuloJob(params, query) {
    var clientKey = getAsyncClientKey(params, query);
    var empresa = String(params && params.empresa || '').trim();
    if (clientKey && asyncCostoArticuloJobsByClient[clientKey]) {
        var existing = asyncCostoArticuloJobs[asyncCostoArticuloJobsByClient[clientKey]];
        if (existing && (existing.status === 'pending' || existing.status === 'running')) {
            return existing;
        }
    }

    var job = {
        id: buildAsyncJobId(),
        status: 'pending',
        progress: 0,
        step: 'En cola',
        message: 'Esperando ejecucion',
        error: '',
        result: null,
        created_at: new Date().toISOString(),
        started_at: null,
        ended_at: null,
        client_session_id: String(query.client_session_id || '').trim(),
        empresa: empresa,
        client_key: clientKey,
        _last_logged_status: '',
        _last_logged_progress: -1
    };

    asyncCostoArticuloJobs[job.id] = job;
    if (clientKey) {
        asyncCostoArticuloJobsByClient[clientKey] = job.id;
    }

    setImmediate(function () {
        job.status = 'running';
        job.progress = 2;
        job.step = 'Iniciando';
        job.message = 'Preparando informe';
        job.started_at = new Date().toISOString();

        var asyncQuery = Object.assign({}, query, {
            _progressCallback: function (update) {
                update = update || {};
                if (typeof update.progress === 'number') job.progress = update.progress;
                if (update.step) job.step = update.step;
                if (update.message) job.message = update.message;
            }
        });

        Stock.costoArticuloFull(params, asyncQuery).then(function (rows) {
            job.status = 'done';
            job.progress = 100;
            job.step = 'Finalizado';
            job.message = 'Informe generado';
            job.result = rows || [];
            job.ended_at = new Date().toISOString();
            cleanupAsyncJobIndex(job);
        }).catch(function (err) {
            job.status = 'error';
            job.progress = job.progress || 100;
            job.step = 'Error';
            job.message = 'No se pudo generar el informe';
            job.error = String(err && (err.message || err) || 'Error');
            job.ended_at = new Date().toISOString();
            cleanupAsyncJobIndex(job);
        });
    });

    return job;
}

var postProcess = function (response, result) {
    response.json({data: result});
};

function logCostoHttp(message) {
    try {
        var dir = path.join(__dirname, '..', 'logs');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.appendFileSync(
            path.join(dir, 'stock-http.log'),
            new Date().toISOString() + ' ' + message + '\n',
            { encoding: 'utf8' }
        );
    } catch (e) {
        console.error('No se pudo escribir stock-http.log:', e);
    }
}

router.get('/informes/:empresa/articulos', function (req, res, next) {
    Stock.articulos(req.params, req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (e) {
        next(e);
    });
});

router.get('/informes/:empresa/precios', function (req, res, next) {
    Stock.listaPrecios(req.params, req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (e) {
        next(e);
    });
});

router.get('/informes/:empresa/deposito', function (req, res, next) {
    Stock.existenciaDeposito(req.params, req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (e) {
        next(e);
    });
});

router.get('/informes/:empresa/valorizado', function (req, res, next) {
    Stock.valorizado(req.params, req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (e) {
        next(e);
    });
});

router.get('/informes/:empresa/costo_articulo_full', function (req, res, next) {
    var requestId = String(Date.now()) + '-' + Math.floor(Math.random() * 1000000);
    var started = Date.now();
    var doneLogged = false;

    function writeOnce(label, extra) {
        if (label === 'finish') {
            doneLogged = true;
        }
        logCostoHttp(
            '[COSTO_ARTICULO_FULL] request_id=' + requestId +
            ' evento=' + label +
            ' empresa=' + req.params.empresa +
            ' elapsed_ms=' + (Date.now() - started) +
            ' frontend_build=' + String(req.query.frontend_build || '-') +
            ' debug_recall=' + String(req.query.debug_recall || req.query.recall_dbg || 'N') +
            ' client_session_id=' + String(req.query.client_session_id || '-') +
            (extra ? ' ' + extra : '')
        );
    }

    writeOnce('start', 'url=' + req.originalUrl);

    req.on('aborted', function () {
        writeOnce('aborted');
    });
    req.on('close', function () {
        if (!doneLogged) {
            writeOnce('req_close');
        }
    });
    res.on('finish', function () {
        writeOnce('finish', 'status=' + res.statusCode);
    });
    res.on('close', function () {
        if (!doneLogged) {
            writeOnce('res_close', 'status=' + res.statusCode);
        }
    });

    Stock.costoArticuloFull(req.params, req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (e) {
        writeOnce('error', 'mensaje=' + String(e && (e.message || e)));
        next(e);
    });
});

router.get('/informes/:empresa/costo_articulo_full_async/start', function (req, res, next) {
    try {
        var job = createAsyncCostoArticuloJob(req.params, req.query);
        logCostoHttp(
            '[COSTO_ARTICULO_FULL_ASYNC] evento=start empresa=' + req.params.empresa +
            ' client_session_id=' + String(req.query.client_session_id || '-') +
            ' job_id=' + job.id
        );
        res.json({
            data: sanitizeAsyncJob(job)
        });
    } catch (e) {
        next(e);
    }
});

router.get('/informes/:empresa/costo_articulo_full_async/status', function (req, res, next) {
    try {
        var jobId = String(req.query.job_id || '').trim();
        var job = asyncCostoArticuloJobs[jobId];
        if (!job) {
            return res.status(404).json({
                error: 'No se encontro el job solicitado.'
            });
        }
        if (job._last_logged_status !== job.status || job._last_logged_progress !== (job.progress || 0)) {
            logCostoHttp(
                '[COSTO_ARTICULO_FULL_ASYNC] evento=status empresa=' + req.params.empresa +
                ' job_id=' + jobId +
                ' status=' + job.status +
                ' progress=' + String(job.progress || 0)
            );
            job._last_logged_status = job.status;
            job._last_logged_progress = job.progress || 0;
        }
        res.json({
            data: sanitizeAsyncJob(job)
        });
    } catch (e) {
        next(e);
    }
});

router.get('/informes/:empresa/costo_articulo_full_async/result', function (req, res, next) {
    try {
        var jobId = String(req.query.job_id || '').trim();
        var job = asyncCostoArticuloJobs[jobId];
        if (!job) {
            return res.status(404).json({
                error: 'No se encontro el job solicitado.'
            });
        }
        if (job.status === 'error') {
            return res.status(409).json({
                error: job.error || 'El job finalizo con error.',
                data: sanitizeAsyncJob(job)
            });
        }
        if (job.status !== 'done') {
            return res.status(409).json({
                error: 'El job aun no finalizo.',
                data: sanitizeAsyncJob(job)
            });
        }
        logCostoHttp(
            '[COSTO_ARTICULO_FULL_ASYNC] evento=result empresa=' + req.params.empresa +
            ' job_id=' + jobId +
            ' rows=' + String((job.result && job.result.length) || 0)
        );
        res.json({
            data: job.result || [],
            meta: sanitizeAsyncJob(job)
        });
    } catch (e) {
        next(e);
    }
});

router.get('/informes/:empresa/diag/ebc_materiales_recall', function (req, res, next) {
    Stock.diagnosticoEbcMateriales(req.params, req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (e) {
        next(e);
    });
});

router.get('/informes/:empresa/diag/ebc_materiales_recall_solo', function (req, res, next) {
    Stock.diagnosticoRecallEbcMaterialesSolo(req.params, req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (e) {
        next(e);
    });
});

router.get('/familias', function (req, res, next) {
    Stock.familias().then(function (result) {
        postProcess(res, result);
    }).catch(function (e) {
        next(e);
    });
});

router.get('/grupos', function (req, res, next) {
    Stock.grupos(req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (e) {
        next(e);
    });
});

router.get('/subgrupos', function (req, res, next) {
    Stock.subgrupos(req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (e) {
        next(e);
    });
});

router.get('/individuales', function (req, res, next) {
    Stock.individuales(req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (e) {
        next(e);
    });
});

router.get('/listas', function (req, res, next) {
    Stock.listas(req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (e) {
        next(e);
    });
});

router.get('/tipos/articulos', function (req, res, next) {
    Articulo.tipos().then(function (result) {
        postProcess(res, result);
    }).catch(function (e) {
        next(e);
    });
});

router.get('/:empresa/articulos', function (req, res, next) {
    Articulo.all(req.params, req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (e) {
        next(e);
    });
});

router.get('/:empresa/sucursales/:sucursal/depositos', function (req, res, next) {
    Stock.depositos(req.params, req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (e) {
        next(e);
    });
});

module.exports = router;
