var express = require('express');
var router = express.Router();

var Calificacion = require('../models/calificacion');
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
var Ventas = require('../models/ventas');
var Grupo = require('../models/grupo');
var CentroCostos = require('../models/centrocostos');
var ExtractoCuenta = require('../models/extractoCuenta');
var Rubro = require('../models/rubro');
var Articulo = require('../models/articulo');
var Activo = require('../models/activo');
var FlowCash = require('../models/flowcash');
var Departamento = require('../models/departamento');
var Tipooc = require('../models/tipooc');
var OrdenCompra = require('../models/ordencompra');
var Usuarios = require('../models/usuarios');
var Compras = require('../models/compras');
var Presupuesto = require('../models/presupuesto');
var Cuentas_pagar = require('../models/cuentas_pagar');
var Moneda = require('../models/moneda');
var Cobrador = require('../models/cobrador');

var conn = require('../db');

var postProcess = function (response, result) {
    response.json({data: result});
};

router.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

//empresas select option
router.get('/empresa/select', function (req, res, next) {
    Empresa.all(req.query)
        .then(function (result) {
            res.json({data: result});
        }).catch(function (error) {
            next(error);
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
router.get('/ordenpago/list/:empresa/:sucursal/:tipoop/:tipoproveedor/:proveedor/:desde/:hasta', function (req, res, next) {
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
router.get('/mayorcuentaaux/det/:empresa/:periodo/:fechad/:fechah/:tipoasiento/:cuenta/:path', function (req, res, next) {
    Mayor.cuentasdetalleaux(req.params, function (result) {
        res.json(result);
    });
});

router.post('/clientes/post/lista/', function (req, res, next) {
    console.log(req.body);
    res.json({data: 'funciona'});
});

router.get('/empresas/:empresa/clientes', function (req, res, next) {
    Empresa.clientes(req.params.empresa, req.query)
        .then(function (result) {
            res.json({data: result});
        })
        .catch(function (error) {
            next(error);
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

// Informe ventas resumido y detallado
router.get('/empresas/:empresa/informes/ventas_resumido', function (req, res, next) {
    Ventas.all(req.params, req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/empresas/:empresa/ventas/:comprobante', function (req, res, next) {
    Ventas.detalle(req.params, req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/empresas/:empresa/informes/deposito', function (req, res, next) {
    ExtractoCuenta.depositos(req.params, req.query, function (result, aggregates) {
        res.json({data: result, aggregates: aggregates});
    });
});

router.get('/empresas/:empresa/informes/extraccion', function (req, res, next) {
    ExtractoCuenta.extracciones(req.params, req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/empresas/:empresa/informes/saldo', function (req, res, next) {
    ExtractoCuenta.saldoAnterior(req.params, req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/empresas/:empresa/informes/extracto', function (req, res, next) {
    ExtractoCuenta.detallado(req.params, req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/grupos', function (req, res, next) {
    Grupo.all(function (result) {
        res.json({data: result});
    });
});

router.get('/centrocostos/list/:empresa/:periodo/:cuentad/:cuentah/:cuentaad/:cuentaah/:mesd/:mesh/:nivel', function (req, res, next) {
    CentroCostos.all(req.params, function (result) {
        res.json({data: result});
    });
});

router.get('/empresas/:empresa/rubros', function (req, res, next) {
    Rubro.list(req.params, function (result) {
        res.json({data: result});
    });
});

router.get('/empresas/:empresa/rubros/:rubro/subrubros', function (req, res, next) {
    Rubro.list(req.params, function (result) {
        res.json({data: result});
    });
});

router.get('/empresas/:empresa/articulos', function (req, res, next) {
    Articulo.list(req.params, {}, function (result) {
        res.json({data: result});
    });
});

router.get('/empresas/:empresa/proveedores', function (req, res, next) {
    Proveedor.list(req.params, req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/empresas/:empresa/informes/activo', function (req, res, next) {
    Activo.bienes(req.params, req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/flowcash/:periodo/:empresa/:mes', function (req, res, next) {
    FlowCash.all(req.params, function (result) {
        res.json({data: result});
    });
});

router.get('/empresas/:empresa/auxiliares/', function (req, res, next) {
    CuentaContable.auxiliar(req.params, req.query, function (result) {
        res.json({data: result});
    });
});

//cuentas select option
router.get('/departamento/select/:empresa/:sucursal', function (req, res, next) {
    Departamento.all(req.params, function (result) {
        res.json({data: result});
    });
});

//cuentas select option
router.get('/tipooc/select/:empresa', function (req, res, next) {
    Tipooc.all(req.params, function (result) {
        res.json({data: result});
    });
});

router.get('/ordencompra/list', function (req, res, next) {
    OrdenCompra.all(req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/compras/:empresa/comprobantes/tipos', function (req, res, next) {
    Comprobante.compras(req.params, function (result) {
        res.json({data: result});
    });
});

router.get('/compras/:empresa/usuarios', function (req, res, next) {
    Usuarios.compras(req.params, function (result) {
        res.json({data: result});
    });
});

router.get('/compras/list', function (req, res, next) {
    Compras.all(req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/compras/articulo/list', function (req, res, next) {
    Compras.articulo(req.query, function (result) {
        res.json({data: result});
    });
});


router.get('/compras/det/:empresa/:factura/:comprobante/:moneda/:proveedor', function (req, res, next) {
    Compras.detail(req.params, function (result) {
        res.json({data: result});
    });
});

router.get('/compras/:empresa/presupuesto', function (req, res, next) {
    Presupuesto.general(req.params, req.query, function (result) {
        postProcess(res, result);
    });
});

router.get('/empresas/:empresa/comprobantes/presupuesto', function (req, res, next) {
    Comprobante.presupuesto(req.params, req.query, function (result) {
        postProcess(res, result);
    });
});

router.get('/calificaciones', function (req, res, next) {
    Calificacion.all(function (result) {
        postProcess(res, result);
    });
});

router.get('/monedas', function (req, res, next) {
    Moneda.list(function (result) {
        postProcess(res, result);
    });
});

router.get('/ventas/terminos', function (req, res, next) {
    Ventas.terminos(function (result) {
        postProcess(res, result);
    });
});

router.get('/cobradores', function (req, res, next) {
    Cobrador.list(function (result) {
        postProcess(res, result);
    });
});

router.get('/empresas/:empresa/vendedores', function (req, res, next) {
    Empresa.vendedores(req.params, req.query, function (result) {
        postProcess(res, result);
    });
});

router.get('/ventas/zonas', function (req, res, next) {
    Ventas.zonas(function (result) {
        postProcess(res, result);
    });
});

router.get('/empresas/:empresa/comprobantes/cobrar', function (req, res, next) {
    Comprobante.cobrar(req.params, req.query, function (result) {
        postProcess(res, result);
    });
});

router.get('/ventas/:empresa/cuentas/cobrar', function (req, res, next) {
    Ventas.cuentas.cobrar(req.params, req.query, function (result) {
        postProcess(res, result);
    });
});

router.get('/cuentas_pagar/list', function (req, res, next) {
    Cuentas_pagar.all(req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/usuarios/cajeros', function (req, res, next) {
    Usuarios.cajeros(req.params)
        .then(function (result) {
            postProcess(res, result);
        })
        .catch(function (error) {
            next(error);
        });
});

module.exports = router;
