var express = require('express');
var router = express.Router();
var pg = require('../postgres');
var _ = require('lodash');
var Empresa = require('../models/empresa');
var EmpresaSueldo = require('../models/empresa_sueldo');
var empresasCache = Object.create(null);
var EMPRESAS_CACHE_TTL_MS = 60000;

function getModelStatus(model) {
    try {
        if (model && typeof model.getStatus === 'function') {
            return model.getStatus() || {};
        }
    } catch (e) {}
    return {};
}

function isDatabaseUnavailableError(err) {
    if (!err) return false;
    var code = String(err.code || err.Code || '');
    var msg = String(err.message || err.Msg || err.sqlMessage || err).toLowerCase();
    return code === '-100' ||
        msg.indexOf('database server not found') >= 0 ||
        msg.indexOf('base no disponible') >= 0 ||
        msg.indexOf('no se pudo conectar') >= 0 ||
        msg.indexOf('deshabilitado') >= 0;
}

function emptyEmpresasResponse(base, reason) {
    return {
        data: [],
        warning: reason || ('Base ' + base + ' no disponible')
    };
}

router.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

// Create a new object, that prototypally inherits from the Error constructor
function UserNotFoundError(message) {
    this.name = 'UserNotFoundError';
    this.message = message || 'User Not Found';
    this.stack = (new Error()).stack;
    this.status = 404;
}
UserNotFoundError.prototype = Object.create(Error.prototype);
UserNotFoundError.prototype.constructor = UserNotFoundError;

/* GET users listing. */
router.get('/', function (req, res, next) {
    pg.User.findAll().then(function (users) {
        res.json({data: users});
    });
});

router.get('/:user', function (req, res, next) {
    pg.User.findById(req.params.user).then(function (user) {
        if (!user) throw new UserNotFoundError();
        res.json({data: user});
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:user/empresas/:base', function (req, res, next) {
    var cacheKey = String(req.params.user) + '|' + String(req.params.base || '');
    var now = Date.now();
    var cached = empresasCache[cacheKey];
    if (cached && (now - cached.ts) < EMPRESAS_CACHE_TTL_MS) {
        return res.json({data: cached.data});
    }

    pg.User.findById(req.params.user).then(function (user) {
        if (!user) throw new UserNotFoundError();
        return user.getEmpresa({
            where: {
                db: req.params.base
            }
        });
    }).then(function (empresas) {
        var include = _.map(empresas, 'empresa');
        if (req.params.base == 'Integrado'){
            var integradoStatus = getModelStatus(Empresa);
            if (integradoStatus && integradoStatus.enabled === false) {
                return emptyEmpresasResponse(req.params.base, integradoStatus.reason || 'Integrado no disponible');
            }
            return Empresa.list(include);
        } else if (req.params.base === "Sueldo") {
            var sueldoStatus = getModelStatus(EmpresaSueldo);
            if (sueldoStatus && sueldoStatus.enabled === false) {
                return emptyEmpresasResponse(req.params.base, sueldoStatus.reason || 'Sueldo no disponible');
            }
            return EmpresaSueldo.list(include);
        } else {
            var err = new Error('Base invalida: ' + req.params.base);
            err.status = 400;
            throw err;
        }
    }).then(function (result) {
        var payload = Array.isArray(result) ? { data: result } : (result || { data: [] });
        empresasCache[cacheKey] = {
            ts: now,
            data: payload.data || []
        };
        res.json(payload);
    }).catch(function (error) {
        if (isDatabaseUnavailableError(error)) {
            return res.json(emptyEmpresasResponse(req.params.base, error.message || 'Base no disponible'));
        }
        next(error);
    });
});

router.get('/empresas', function (req, res, next) {
    pg.User.findById(req.params.user).then(function (user) {
        if (!user)throw new UserNotFoundError();
        return user.getEmpresa();
    }).then(function (empresas) {
        var include = _.map(empresas, 'empresa');
        return Empresa.list(include);
    }).then(function (result) {
        res.json({data: result});
    }).catch(function (error) {
        next(error);
    });
});

module.exports = router;
