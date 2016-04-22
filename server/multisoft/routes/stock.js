var express = require('express');
var router = express.Router();

var Stock = require('../models/stock');
var Articulo = require('../models/articulo');

var postProcess = function (response, result) {
    response.json({data: result});
};

router.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

router.get('/informes/:empresa/articulos', function (req, res, next) {
    Stock.articulos(req.params, req.query).then(function (result) {
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

module.exports = router;