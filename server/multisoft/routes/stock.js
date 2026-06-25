var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var fork = require('child_process').fork;

var Stock = require('../models/stock');
var Articulo = require('../models/articulo');
var asyncCostoArticuloJobs = Object.create(null);
var asyncCostoArticuloJobsByClient = Object.create(null);
var ASYNC_COSTO_JOB_TTL_MS = 15 * 60 * 1000;
var ASYNC_COSTO_WORKER_TIMEOUT_MS = 30 * 60 * 1000;
var activeCostoWorkers = Object.create(null);

function buildAsyncJobId() {
    return String(Date.now()) + '-' + Math.floor(Math.random() * 1000000);
}

function getAsyncClientKey(params, query) {
    var normalizedQuery = {};
    Object.keys(query || {}).sort().forEach(function (key) {
        if (
            key === 'client_session_id' ||
            key === 'frontend_build' ||
            key === 'debug_recall' ||
            key === 'recall_dbg'
        ) {
            return;
        }
        normalizedQuery[key] = query[key];
    });
    return JSON.stringify({
        empresa: String(params && params.empresa || '').trim(),
        query: normalizedQuery
    });
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

function scheduleAsyncJobCleanup(job) {
    if (!job || job._cleanup_timer) return;
    job._cleanup_timer = setTimeout(function () {
        cleanupAsyncJobIndex(job);
        delete asyncCostoArticuloJobs[job.id];
    }, ASYNC_COSTO_JOB_TTL_MS);
    if (job._cleanup_timer && typeof job._cleanup_timer.unref === 'function') {
        job._cleanup_timer.unref();
    }
}

function finishAsyncJob(job, status, payload) {
    if (!job || job._settled) return;
    job._settled = true;
    if (job._worker_timeout) {
        clearTimeout(job._worker_timeout);
        job._worker_timeout = null;
    }
    if (job.worker_pid) {
        delete activeCostoWorkers[job.worker_pid];
    }
    job.status = status;
    job.progress = 100;
    job.ended_at = new Date().toISOString();

    if (status === 'done') {
        job.step = 'Finalizado';
        job.message = 'Informe generado';
        job.result = (payload && payload.rows) || [];
    } else {
        job.step = 'Error';
        job.message = 'No se pudo generar el informe';
        job.error = String((payload && payload.error) || 'Error');
    }

    if (status !== 'done') {
        cleanupAsyncJobIndex(job);
    }
    scheduleAsyncJobCleanup(job);
}

function runAsyncCostoArticuloWorker(job, params, query) {
    var workerPath = path.join(__dirname, '..', 'workers', 'costo-articulo-full-worker.js');
    var worker = fork(workerPath, [], {
        env: process.env,
        execArgv: [],
        stdio: ['ignore', 'inherit', 'inherit', 'ipc']
    });
    job.worker_pid = worker.pid;
    activeCostoWorkers[worker.pid] = worker;
    job._worker_timeout = setTimeout(function () {
        if (job._settled) return;
        try {
            worker.kill();
        } catch (e) {}
        finishAsyncJob(job, 'error', {
            error: 'El calculo supero el tiempo maximo permitido. Vuelve a procesar el informe.'
        });
    }, ASYNC_COSTO_WORKER_TIMEOUT_MS);

    worker.on('message', function (message) {
        message = message || {};
        if (message.type === 'progress') {
            var update = message.update || {};
            if (typeof update.progress === 'number') job.progress = update.progress;
            if (update.step) job.step = update.step;
            if (update.message) job.message = update.message;
            return;
        }
        if (message.type === 'done') {
            finishAsyncJob(job, 'done', message);
            return;
        }
        if (message.type === 'error') {
            finishAsyncJob(job, 'error', message);
        }
    });

    worker.on('error', function (err) {
        finishAsyncJob(job, 'error', {
            error: String(err && (err.message || err) || 'No se pudo iniciar el proceso de calculo.')
        });
    });

    worker.on('exit', function (code, signal) {
        if (!job._settled) {
            finishAsyncJob(job, 'error', {
                error: 'El proceso de calculo finalizo inesperadamente. Codigo=' +
                    String(code) + ' Senal=' + String(signal || '-')
            });
        }
    });

    worker.send({
        params: params,
        query: query
    });
}

function stopActiveCostoWorkers() {
    Object.keys(activeCostoWorkers).forEach(function (pid) {
        var worker = activeCostoWorkers[pid];
        try {
            worker.kill();
        } catch (e) {}
        delete activeCostoWorkers[pid];
    });
}

process.once('SIGINT', stopActiveCostoWorkers);
process.once('SIGTERM', stopActiveCostoWorkers);
process.once('disconnect', stopActiveCostoWorkers);

function createAsyncCostoArticuloJob(params, query) {
    var clientKey = getAsyncClientKey(params, query);
    var empresa = String(params && params.empresa || '').trim();
    if (clientKey && asyncCostoArticuloJobsByClient[clientKey]) {
        var existing = asyncCostoArticuloJobs[asyncCostoArticuloJobsByClient[clientKey]];
        if (existing && (
            existing.status === 'pending' ||
            existing.status === 'running' ||
            existing.status === 'done'
        )) {
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

    job.status = 'running';
    job.progress = 2;
    job.step = 'Iniciando';
    job.message = 'Preparando informe';
    job.started_at = new Date().toISOString();
    runAsyncCostoArticuloWorker(job, params, query);

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
