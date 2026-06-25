'use strict';

var Stock = require('../models/stock');

function send(message, callback) {
    if (typeof process.send === 'function') {
        process.send(message, callback);
        return;
    }
    if (callback) callback();
}

function finish(message) {
    send(message, function () {
        setTimeout(function () {
            process.exit(message.type === 'done' ? 0 : 1);
        }, 25);
    });
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
