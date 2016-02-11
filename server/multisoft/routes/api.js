var express = require('express');
var router = express.Router();
var Empresa = require('../models/empresa');
var Comprobante = require('../models/comprobante');
var Proveedor = require('../models/proveedor');
var Sucursal = require('../models/sucursal');
var OrdenPago = require('../models/ordenpago');
var CuentaContable = require('../models/cuentacontable');
var Balance = require('../models/balance');
var TipoAsiento = require('../models/tipoasiento');
var Diario = require('../models/diario');
var Mayor = require('../models/mayor');
var Cliente = require('../models/cliente');
var Informe = require('../models/informe');
var Grupo = require('../models/grupo');
var ExtractoCuenta = require('../models/extractoCuenta');

var conn = require('../db');

router.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

//empresas select option
router.get('/empresa/select', function (req, res, next) {
    Empresa.all(function (result) {
        res.json({data: result});
    });
});

//empresas select option notin
router.post('/empresa/notin/select/', function (req, res, next) {
    Empresa.notin(req.body, function (result) {
        res.json({data: result});
    });
});

//empresas select option in
router.post('/empresa/inin/select/', function (req, res, next) {
    Empresa.inin(req.body, function (result) {
        res.json({data: result});
    });
});

//proveedores select option
router.get('/proveedor/select/:empresa/:tipo', function (req, res, next) {
    Proveedor.all(req.params, function (result) {
        res.json({data: result});
    });
});

//sucursales select option
router.get('/sucursal/select/:empresa', function (req, res, next) {
    Sucursal.all(req.params, function (result) {
        res.json({data: result});
    });
});

//list orden de pago
router.get('/ordenpago/list/:empresa/:sucursal/:tipoop/:comprobante/:tipoproveedor/:proveedor/:desde/:hasta', function (req, res, next) {
    OrdenPago.all(req.params, function (result) {
        res.json({data: result});
    });
});

//cuentas select option
router.get('/cuenta/select/:empresa/:periodo', function (req, res, next) {
    CuentaContable.all(req.params, function (result) {
        res.json({data: result});
    });
});

//cuentas select option
router.get('/cuentaauxi/select/:empresa/:periodo', function (req, res, next) {
    CuentaContable.aux(req.params, function (result) {
        res.json({data: result});
    });
});

//cuentas select option
router.post('/cuentaauxi/query/:periodo/:empresa/:cuentad/:cuentah', function (req, res, next) {
    CuentaContable.auxquery(req.params, req.body, function (result) {
        res.json({data: result});
    });
});

//list balance general
router.get('/balancegeneral/list/:empresa/:periodo/:cuentad/:cuentah/:mesd/:mesh/:nivel/:saldo/:moneda/:aux', function (req, res, next) {
    Balance.general(req.params, function (result) {
        res.json({data: result});
    });
});

//list balance comprobado
router.get('/balancecomprobado/list/:empresa/:periodo/:periodoant/:mes/:mesant/:nivel/:moneda', function (req, res, next) {
    Balance.comprobado(req.params, function (result) {
        res.json({data: result});
    });
});

//tipo asiento select option
router.get('/tipoasiento/select/', function (req, res, next) {
    TipoAsiento.all(function (result) {
        res.json({data: result});
    });
});

//list diario comprobado
router.get('/diariocomprobado/list/:empresa/:tipoasiento/:fechad/:fechah/:autorizado', function (req, res, next) {
    Diario.all(req.params, function (result) {
        res.json({data: result});
    });
});

//cabecera de movimientos de cuenta libro mayor
router.get('/mayorcuenta/cab/:empresa/:periodo/:fechad/:fechah/:tipoasiento/:cuentad/:cuentah/:incluir', function (req, res, next) {
    Mayor.cuentas(req.params, function (result) {
        res.json(result);
    });
});

//detalle de movimientos de cuenta libro mayor
router.get('/mayorcuenta/det/:empresa/:periodo/:fechad/:fechah/:tipoasiento/:cuenta', function (req, res, next) {
    Mayor.cuentasdetalle(req.params, function (result) {
        res.json(result);
    });
});

//cabecera de movimientos de cuenta libro mayor aux
router.get('/mayorcuentaaux/cab/:empresa/:periodo/:fechad/:fechah/:tipoasiento/:cuentad/:cuentah/:incluir/:cuentaad/:cuentaah', function (req, res, next) {
    Mayor.cuentasaux(req.params, function (result) {
        res.json(result);
    });
});

//detalle de movimientos de cuenta libro mayor aux
router.get('/mayorcuentaaux/det/:empresa/:periodo/:fechad/:fechah/:tipoasiento/:cuenta', function (req, res, next) {
    Mayor.cuentasdetalleaux(req.params, function (result) {
        res.json(result);
    });
});

router.post('/clientes/post/lista/', function (req, res, next) {
    console.log(req.body);
    res.json({data: 'funciona'});
});

router.get('/empresas/:empresa/clientes', function (req, res, next) {
    Empresa.clientes(req.params.empresa, req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/empresas/:empresa/bancos', function (req, res, next) {
    Empresa.bancos(req.params, req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/empresas/:empresa/cuentas/:banco', function (req, res, next) {
    Empresa.cuentas(req.params, req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/clientes/tipos', function (req, res, next) {
    Cliente.tipos(function (result) {
        res.json({data: result});
    });
});

router.get('/empresas/:empresa/comprobantes/tipos', function (req, res, next) {
    Comprobante.empresa(req.params, function (result) {
        res.json({data: result});
    });
});

// Informe ventas resumido por comprobante
router.get('/empresas/:empresa/informes/ventas_resumido', function (req, res, next) {
    Informe.all(req.params, req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/empresas/:empresa/informes/deposito', function (req, res, next) {
    ExtractoCuenta.depositos(req.params, req.query, function (result, aggregates) {
        res.json({data: result, aggregates: aggregates});
    });
});

router.get('/empresas/:empresa/informes/extraccion', function (req, res, next) {
    ExtractoCuenta.extracciones(req.params, req.query, function (result, aggregates) {
        res.json({data: result, aggregates: aggregates});
    });
});

router.get('/grupos', function (req, res, next) {
    Grupo.all(function (result) {
        res.json({data: result});
    });
});

module.exports = router;
