var express = require('express');
var router = express.Router();

var Ventas = require('../models/ventas');

var postProcess = function (response, result) {
    response.json({data: result});
};

router.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

router.get('/ventas/clientes', function (req, res, next) {
    Ventas.estadisticas.clientes(req.params, req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/ventas/articulos', function (req, res, next) {
    Ventas.estadisticas.articulos(req.params, req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/ventas/vendedores', function (req, res, next) {
    Ventas.estadisticas.vendedores(req.params, req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;