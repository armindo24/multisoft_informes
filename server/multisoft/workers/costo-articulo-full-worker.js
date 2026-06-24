'use strict';

var conn = require('../db_integrado');
var Stock = require('../models/stock');
var settled = false;
var CONNECTION_WAIT_MS = 30000;

function send(message, callback) {
    if (typeof process.send === 'function') {
        process.send(message, callback);
        return;
    }
    if (callback) callback();
}

function finish(message) {
    if (settled) return;
    settled = true;

    conn.disconnect(function () {
        send(message, function () {
            setTimeout(function () {
                process.exit(message.type === 'done' ? 0 : 1);
            }, 25);
        });
    });
}

function waitForConnection(callback) {
    var startedAt = Date.now();

    function check() {
        var status = conn.getStatus();
        if (status && status.enabled) {
            callback(null);
            return;
        }

        var reason = String(status && status.reason || 'No inicializado');
        if (reason !== 'No inicializado' || Date.now() - startedAt >= CONNECTION_WAIT_MS) {
            callback(new Error(reason));
            return;
        }

        setTimeout(check, 100);
    }

    check();
}

process.on('message', function (payload) {
    payload = payload || {};
    var params = payload.params || {};
    var query = Object.assign({}, payload.query || {}, {
        _progressCallback: function (update) {
            send({
                type: 'progress',
                update: update || {}
            });
        }
    });

    waitForConnection(function (connectionError) {
        if (connectionError) {
            finish({
                type: 'error',
                error: String(connectionError && (connectionError.message || connectionError) || 'No se pudo conectar a Integrado')
            });
            return;
        }

        Stock.costoArticuloFull(params, query).then(function (rows) {
            finish({
                type: 'done',
                rows: rows || []
            });
        }).catch(function (err) {
            finish({
                type: 'error',
                error: String(err && (err.message || err) || 'Error')
            });
        });
    });
});

process.on('uncaughtException', function (err) {
    finish({
        type: 'error',
        error: String(err && (err.stack || err.message || err) || 'Error no controlado')
    });
});

process.on('unhandledRejection', function (reason) {
    finish({
        type: 'error',
        error: String(reason && (reason.stack || reason.message || reason) || 'Promesa rechazada')
    });
});
