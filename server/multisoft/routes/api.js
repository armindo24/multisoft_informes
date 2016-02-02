var express = require('express');
var router = express.Router();
var Empresa = require('../models/empresa');
var Comprobante = require('../models/comprobante');
var Proveedor = require('../models/proveedor');
var Sucursal = require('../models/sucursal');
var conn = require('../db');

router.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

router.get('/empresa/select', function (req, res, next) {
   Empresa.all(function (result){
       res.json({data: result});
   });
});

//comprobantes select option
router.get('/comprobante/select/:empresa', function (req, res, next) {
    var empresa = req.params.empresa;
    Comprobante.empresa(empresa,function (result){
        res.json({data: result});
    });
});

//proveedores select option
router.get('/proveedor/select/:empresa/:tipo', function (req, res, next) {
    var empresa = req.params.empresa;
    var tipo = req.params.tipo;
    Proveedor.all(empresa,tipo,function (result){
        res.json({data: result});
    });
});

//sucursales select option
router.get('/sucursal/select/:empresa', function (req, res, next) {
    var empresa = req.params.empresa;
    Sucursal.all(empresa,function (result){
        res.json({data: result});
    });
});

//list orden de pago
router.get('/ordenpago/list/:empresa/:sucursal/:tipoop/:comprobante/:tipoproveedor/:proveedor/:desde/:hasta', function (req, res, next) {
    OrdenPago.all(req.params,function (result){
        res.json({data: result});
    });
});

//cuentas select option
router.get('/cuenta/select/:empresa/:periodo', function (req, res, next) {
    res.json({data: req.params});
});

//list balance general
router.get('/balancegeneral/list/:empresa/:periodo/:cuentad/:cuentah/:mesd/:mesh/:nivel/:saldo/:moneda/:aux', function (req, res, next) {
    res.json({data: req.params});
});

//list balance comprobado
router.get('/balancecomprobado/list/:empresa/:periodo/:periodoant/:mes/:mesant/:nivel/:moneda', function (req, res, next) {
    res.json({data: req.params});
});

//tipo asiento select option
router.get('/tipoasiento/select/', function (req, res, next) {
    res.json({data: req.params});
});

//list diario comprobado
router.get('/diariocomprobado/list/:empresa/:tipoasiento/:fechad/:fechah/:autorizado', function (req, res, next) {
    res.json({data: req.params});
});

//detalle de movimientos de cuenta libro mayor
router.get('/mayorcuenta/det/:empresa/:periodo/:fechad/:fechah/:tipoasiento/:cuenta', function (req, res, next) {
    res.json({data: req.params});
});

//cabecera de movimientos de cuenta libro mayor
router.get('/mayorcuenta/cab/:empresa/:periodo/:fechad/:fechah/:tipoasiento/:cuentad/:cuentah/:incluir', function (req, res, next) {
    res.json({data: req.params});
});

module.exports = router;
