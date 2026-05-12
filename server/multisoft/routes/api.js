var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var Calificacion = require('../models/calificacion');
var Empresa = require('../models/empresa');
var EmpresaSueldo = require('../models/empresa_sueldo');
var Comprobante = require('../models/comprobante');
var Proveedor = require('../models/proveedor');
var Sucursal = require('../models/sucursal');
var OrdenPago = require('../models/ordenpago');
var OrdenPagoFinanciero = require('../models/ordenpago_financiero');
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
var Control = require('../models/control');
var Articulo = require('../models/articulo');
var Activo = require('../models/activo');
var FlowCash = require('../models/flowcash');
var Departamento = require('../models/departamento');
var Tipooc = require('../models/tipooc');
var OrdenCompra = require('../models/ordencompra');
var Usuarios = require('../models/usuarios');
var Compras = require('../models/compras');
var Migraciones = require('../models/migraciones');
var Presupuesto = require('../models/presupuesto');
var DiferenciaCambio = require('../models/diferencia_cambio');
var Cuentas_pagar = require('../models/cuentas_pagar');
var Fondo_Fijo = require('../models/fondo_fijo');
var Gastos_Rendir = require('../models/gastos');
var Moneda = require('../models/moneda');
var Cobrador = require('../models/cobrador');
var Recaudacion = require('../models/recaudacion');
var Localidad = require('../models/localidad');
var Tp_Movimiento = require('../models/tp_movimiento_sueldo');
var Empleado = require('../models/empleado_sueldo');
var Legajos = require('../models/legajos_sueldo');
var Sueldos_Jornales = require('../models/sueldos_jornales_sueldo');
var Sucursal_Sueldo = require('../models/sucursal_sueldo');
var Departamento_Sueldo = require('../models/departamento_sueldo');
var Anticipos = require('../models/anticipos_sueldo');
var Aguinaldos = require('../models/aguinaldos_sueldo');
var Recibos = require('../models/recibos_sueldo');
var Rg90 = require('../models/rg90');
var dbSueldo = require('../db_sueldo');
var dbIntegrado = require('../db_integrado');

var postProcess = function (response, result) {
    response.json({data: result});
};

router.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Evita 304/cache entre motores distintos (SQLAnywhere/PostgreSQL).
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
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

router.get('/empresa/meta/:empresa', function (req, res, next) {
    Empresa.meta(req.params.empresa)
        .then(function (result) {
            var row = Array.isArray(result) ? (result[0] || {}) : (result || {});
            res.json({data: row});
        }).catch(function (error) {
            next(error);
        });
});

//empresas_sueldo select option
router.get('/empresa_sueldo/select', function (req, res, next) {
    EmpresaSueldo.all(req.query)
        .then(function (result) {
            res.json({data: result});
        }).catch(function (error) {
            next(error);
        });
});

//empresas select option notin
router.post('/empresa/notin/select', function (req, res, next) {
    Empresa.notin(req.body, function (result) {
        res.json({data: result});
    });
});
router.get('/empresa/notin/select', function (req, res, next) {
    Empresa.notin(req.query, function (result) {
        res.json({data: result});
    });
});
router.post('/empresa/notin/select/', function (req, res, next) {
    Empresa.notin(req.body, function (result) {
        res.json({data: result});
    });
});
router.get('/empresa/notin/select/', function (req, res, next) {
    Empresa.notin(req.query, function (result) {
        res.json({data: result});
    });
});

//empresas_sueldo select option notin
router.post('/empresa_sueldo/notin/select', function (req, res, next) {
    EmpresaSueldo.notin(req.body, function (result) {
        res.json({data: result});
    });
});
router.get('/empresa_sueldo/notin/select', function (req, res, next) {
    EmpresaSueldo.notin(req.query, function (result) {
        res.json({data: result});
    });
});
router.post('/empresa_sueldo/notin/select/', function (req, res, next) {
    EmpresaSueldo.notin(req.body, function (result) {
        res.json({data: result});
    });
});
router.get('/empresa_sueldo/notin/select/', function (req, res, next) {
    EmpresaSueldo.notin(req.query, function (result) {
        res.json({data: result});
    });
});

//empresas select option in
router.post('/empresa/inin/select', function (req, res, next) {
    Empresa.inin(req.body, function (result) {
        res.json({data: result});
    });
});
router.get('/empresa/inin/select', function (req, res, next) {
    Empresa.inin(req.query, function (result) {
        res.json({data: result});
    });
});
router.post('/empresa/inin/select/', function (req, res, next) {
    Empresa.inin(req.body, function (result) {
        res.json({data: result});
    });
});
router.get('/empresa/inin/select/', function (req, res, next) {
    Empresa.inin(req.query, function (result) {
        res.json({data: result});
    });
});

//empresas_sueldo select option in
router.post('/empresa_sueldo/inin/select', function (req, res, next) {
    EmpresaSueldo.inin(req.body, function (result) {
        res.json({data: result});
    });
});
router.get('/empresa_sueldo/inin/select', function (req, res, next) {
    EmpresaSueldo.inin(req.query, function (result) {
        res.json({data: result});
    });
});
router.post('/empresa_sueldo/inin/select/', function (req, res, next) {
    EmpresaSueldo.inin(req.body, function (result) {
        res.json({data: result});
    });
});
router.get('/empresa_sueldo/inin/select/', function (req, res, next) {
    EmpresaSueldo.inin(req.query, function (result) {
        res.json({data: result});
    });
});

// sueldo DB status
router.get('/sueldo/status', function (req, res, next) {
    if (typeof dbSueldo.getStatus === 'function') return res.json(dbSueldo.getStatus());
    res.json({ enabled: !dbSueldo._disabled, reason: dbSueldo._disabled_reason || '', engine: '', configured_engine: '' });
});

// sueldo reconnect
router.post('/sueldo/reconnect', function (req, res, next) {
    if (typeof dbSueldo.reconnect !== 'function') {
        return res.status(500).json({ ok: false, error: 'Reconnect no disponible' });
    }
    dbSueldo.reconnect(function (err) {
        if (err) {
            return res.status(400).json({ ok: false, error: err.message || String(err) });
        }
        return res.json({ ok: true });
    });
});

// update db config (persist + apply)
router.post('/db_config/update', function (req, res, next) {
    try {
        var body = req.body || {};
        var dbType = body.db_type;
        if (dbType !== 'integrado' && dbType !== 'sueldo') {
            return res.status(400).json({ ok: false, error: 'db_type inválido' });
        }
        var host = body.host || '';
        var port = body.port || 0;
        if (port && host && host.indexOf(':') === -1) {
            host = host + ':' + port;
        }
        var cfg = {
            db_engine: body.db_engine || 'sqlanywhere',
            host: host,
            Server: body.server || '',
            DatabaseName: body.database || '',
            UserID: body.username || '',
            Password: body.password || '',
            disabled: !!body.disabled
        };

        var configPath = path.join(__dirname, '..', 'config', 'local.json');
        var fileData = {};
        if (fs.existsSync(configPath)) {
            try {
                fileData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            } catch (e) {
                fileData = {};
            }
        }
        if (!fileData[dbType]) fileData[dbType] = {};
        fileData[dbType].dbConfig = cfg;
        fs.writeFileSync(configPath, JSON.stringify(fileData, null, 2), 'utf8');

        var target = dbType === 'sueldo' ? dbSueldo : dbIntegrado;
        if (typeof target.applyConfig === 'function') {
            target.applyConfig(cfg, function (err) {
                if (err) {
                    return res.status(400).json({ ok: false, error: err.message || String(err) });
                }
                return res.json({ ok: true });
            });
        } else {
            return res.json({ ok: true });
        }
    } catch (e) {
        res.status(500).json({ ok: false, error: e && e.message ? e.message : String(e) });
    }
});

// integrado/CPA Bancos DB status
router.get('/integrado/status', function (req, res, next) {
    if (typeof dbIntegrado.getStatus === 'function') return res.json(dbIntegrado.getStatus());
    res.json({ enabled: !dbIntegrado._disabled, reason: dbIntegrado._disabled_reason || '', engine: '', configured_engine: '' });
});

// quick diagnostic for current engines
router.get('/db/engines', function (req, res, next) {
    var integrado = (typeof dbIntegrado.getStatus === 'function')
        ? dbIntegrado.getStatus()
        : { enabled: !dbIntegrado._disabled, reason: dbIntegrado._disabled_reason || '', engine: '', configured_engine: '' };
    var sueldo = (typeof dbSueldo.getStatus === 'function')
        ? dbSueldo.getStatus()
        : { enabled: !dbSueldo._disabled, reason: dbSueldo._disabled_reason || '', engine: '', configured_engine: '' };
    res.json({ integrado: integrado, sueldo: sueldo });
});

// integrado/CPA Bancos reconnect
router.post('/integrado/reconnect', function (req, res, next) {
    if (typeof dbIntegrado.reconnect !== 'function') {
        return res.status(500).json({ ok: false, error: 'Reconnect no disponible' });
    }
    dbIntegrado.reconnect(function (err) {
        if (err) {
            return res.status(400).json({ ok: false, error: err.message || String(err) });
        }
        return res.json({ ok: true });
    });
});

// test db connection (sqlanywhere) via node
router.post('/db_test/sqlanywhere', function (req, res, next) {
    try {
        var sqlanywhere = require('sqlanywhere');
        var cfg = req.body || {};
        var conn = sqlanywhere.createConnection();
        conn.connect({
            host: cfg.host,
            Server: cfg.server,
            DatabaseName: cfg.database,
            UserID: cfg.username,
            Password: cfg.password
        }, function (err) {
            if (err) {
                return res.status(400).json({ ok: false, error: err.message || String(err) });
            }
            conn.disconnect(function () {
                res.json({ ok: true });
            });
        });
    } catch (e) {
        res.status(500).json({ ok: false, error: e && e.message ? e.message : String(e) });
    }
});

//proveedores select option
router.get('/proveedor/select/:empresa/:tipo', function (req, res, next) {
    Proveedor.all(req.params, function (result) {
        res.json({data: result});
    });
});

router.get('/proveedor/select/:empresa', function (req, res, next) {
    Proveedor.list(req.params, {}, function (result) {
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
router.get('/ordenpago/list/:empresa/:sucursal/:tipoop/:moneda/:desde/:hasta', function (req, res, next) {
    OrdenPago.all(req.params, function (result) {
        res.json({data: result});
    });
});

router.get('/ordenpago_financiero/list/:empresa/:tipoop/:moneda/:proveedor/:desde/:hasta', function (req, res, next) {
    OrdenPagoFinanciero.all(req.params, function (result) {
        res.json({data: result});
    });
});

//cuentas select option
router.get('/cuenta/select/:empresa/:periodo', function (req, res, next) {
    CuentaContable.all(req.params, function (result) {
        res.json({data: result});
    });
});

// lista plan de cuentas (formulario de busqueda)
router.get('/cuenta/plancta/:empresa/:periodo', function (req, res, next) {
    CuentaContable.planList(req.params, function (result) {
        res.json({data: result});
    });
});

router.get('/cuenta/puc/select/:empresa/:periodo', function (req, res, next) {
    CuentaContable.pucList(req.params, function (result) {
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
router.get('/balancegeneral/list/', function (req, res, next) {
    Balance.general(req.query, function (result) {
        if (result && result.rows) {
            return res.json({ data: result.rows, warning: result.warning || '' });
        }
        res.json({data: result});
    });
});

router.get('/balancegeneral_puc/list/', function (req, res, next) {
    Balance.generalPuc(req.query, function (result) {
        if (result && result.rows) {
            res.json({
                data: result.rows,
                resultado: result.resultado || { local: 0, extranjera: 0 },
                warning: result.warning || ''
            });
            return;
        }
        res.json({data: result});
    });
});

router.get('/balanceintegral/auxiliares', function (req, res, next) {
    Balance.integralAuxiliares(req.query, function (result) {
        res.json({
            clientes: (result && result.clientes) ? result.clientes : [],
            proveedores: (result && result.proveedores) ? result.proveedores : [],
            warning: (result && result.warning) ? result.warning : ''
        });
    });
});

//list balance comprobado
router.get('/balancecomprobado/list/:empresa/:periodo/:periodoant/:mes/:mesant/:nivel/:moneda', function (req, res, next) {
    Balance.comprobado(req.params, function (result) {
        if (result && result.rows) {
            return res.json({ data: result.rows, warning: result.warning || '' });
        }
        res.json({data: result});
    });
});

//tipo asiento select option
router.get('/tipoasiento/select/', function (req, res, next) {
    TipoAsiento.all(function (result) {
        res.json({data: result});
    });
});

router.get('/registraciones/diferencia-cambio/consultar', function (req, res, next) {
    DiferenciaCambio.consultar(req.query || {}, function (err, result) {
        if (err) return next(err);
        res.json({data: result});
    });
});

router.get('/registraciones/diferencia-cambio/init', function (req, res, next) {
    DiferenciaCambio.init(req.query || {}, function (err, result) {
        if (err) return next(err);
        res.json({data: result});
    });
});

router.get('/registraciones/diferencia-cambio/next-transac', function (req, res, next) {
    DiferenciaCambio.nextTransac(req.query || {}, function (err, result) {
        if (err) return next(err);
        res.json({data: result});
    });
});

router.get('/control/cierre/:empresa/:periodo', function (req, res, next) {
    Control.cierre(req.params, function (result) {
        res.json({data: result});
    });
});

router.post('/migraciones/asientos/import', function (req, res, next) {
    Migraciones.importAsientos(req.body || {}, function (err, result) {
        if (err) return next(err);
        if (!result || result.ok === false) {
            return res.status(400).json(result || { ok: false, error: 'No se pudo migrar.' });
        }
        res.json(result);
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

router.get('/empresas/:empresa/meta', function (req, res, next) {
    Empresa.meta(req.params.empresa)
        .then(function (result) {
            res.json({data: result || []});
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

router.get('/empresas/:empresa/comprobantes/tipos/ventas_migracion', function (req, res, next) {
    Comprobante.ventasMigracion(req.params, function (result) {
        res.json({data: result});
    });
});

router.get('/empresas/:empresa/importar_ventas', function (req, res, next) {
    Empresa.importarVentas(req.params.empresa, function (result) {
        res.json({data: result});
    });
});

router.post('/migraciones/ventas/referencias', function (req, res, next) {
    Migraciones.ventasReferencias(req.body || {}, function (err, result) {
        if (err) return next(err);
        res.json(result || { ok: false, data: {} });
    });
});

router.post('/migraciones/ventas/clientes/crear', function (req, res, next) {
    Migraciones.crearClientesVentas(req.body || {}, function (err, result) {
        if (err) return next(err);
        res.json(result || { ok: false, created: [] });
    });
});

router.post('/migraciones/ventas/import', function (req, res, next) {
    Migraciones.importVentas(req.body || {}, function (err, result) {
        if (err) return next(err);
        res.json(result || { ok: false });
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
    Articulo.list(req.params, req.query || {}, function (result) {
        res.json({data: result});
    });
});

router.get('/ventas/:empresa/articulos', function (req, res, next) {
    Ventas.articulos(req.params, req.query).then(function (result) {
        res.json({data: result});
    }).catch(function (err) {
        next(err);
    });
});

router.get('/estadisticas/ventas/clientes', function (req, res, next) {
    Ventas.estadisticas.clientes(req.params, req.query).then(function (result) {
        res.json({data: result});
    }).catch(function (err) {
        next(err);
    });
});

router.get('/estadisticas/ventas/articulos', function (req, res, next) {
    Ventas.estadisticas.articulos(req.params, req.query).then(function (result) {
        res.json({data: result});
    }).catch(function (err) {
        next(err);
    });
});

router.get('/estadisticas/ventas/vendedores', function (req, res, next) {
    Ventas.estadisticas.vendedores(req.params, req.query).then(function (result) {
        res.json({data: result});
    }).catch(function (err) {
        next(err);
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

router.get('/op/:empresa/comprobantes/tipos', function (req, res, next) {
    Comprobante.op(req.params, function (result) {
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
    Empresa.vendedores(req.params, req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (err) {
        next(err);
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

router.get('/fondo_fijo/list', function (req, res, next) {
    Fondo_Fijo.all(req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/gastos_rendir/list', function (req, res, next) {
    Gastos_Rendir.all(req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/compras_articulo/ranking', function (req, res, next) {
    Compras.ranking_aticulo(req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/compras_proveedor/ranking', function (req, res, next) {
    Compras.ranking_proveedor(req.query, function (result) {
        res.json({data: result});
    });
});

router.get('/finanzas/rg90/preview', function (req, res, next) {
    Rg90.preview(req.query || {}, function (error, result) {
        if (error) {
            return next(error);
        }
        res.json({
            data: (result && result.rows) ? result.rows : [],
            debug: result && result.debug ? result.debug : null,
            summary: result && result.summary ? result.summary : null,
            warning: result && result.warning ? result.warning : null
        });
    });
});

router.get('/finanzas/rg90/export', function (req, res, next) {
    Rg90.export(req.query || {}, function (error, result) {
        if (error) {
            return next(error);
        }
        res.json({data: result || {}});
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

router.get('/recaudaciones/:empresa/planillas', function (req, res, next) {
    Recaudacion.planillas(req.params)
        .then(function (result) {
            postProcess(res, result);
        })
        .catch(function (error) {
            next(error);
        });
});

router.get('/recaudaciones/:empresa/detallado', function (req, res, next) {
    Recaudacion.resumido(req.params, req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/recaudaciones/:empresa/ajustes', function (req, res, next) {
    Recaudacion.ajustes(req.params, req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/recaudaciones/:empresa/depositos', function (req, res, next) {
    Recaudacion.deposito(req.params, req.query).then(function (result) {
        postProcess(res, result);
    }).catch(function (e) {
        next(e);
    });
});

router.get('/recaudaciones/:empresa/consolidada', function (req, res, next) {
    Recaudacion.resumido(req.params, req.query)
        .then(function (result) {
            postProcess(res, result);
        }).catch(function (error) {
            next(error);
        });
});

router.get('/localidades', function (req, res, next) {
    Localidad.list().then(function (result) {
        postProcess(res, result);
    }).catch(function (error) {
        next(error);
    });
});

router.get('/recaudaciones/planillas', function (req, res, next) {
    Recaudacion.planillaConsolidada(req.query, function (result) {
        res.json({data: result});
    });
});

//proveedores select option
router.get('/tp_movimientos_sueldo/select/', function (req, res, next) {
    Tp_Movimiento.all(req.query, function (result) {
        res.json({data: result});
    });
});

//proveedores select option
router.get('/empleados_sueldo/select/', function (req, res, next) {
    Empleado.all(req.query, function (result) {
        res.json({data: result});
    });
});

//legajos
router.get('/legajos_sueldo/list', function (req, res, next) {
    Legajos.all(req.query, function (result) {
        res.json({data: result});
    });
});

//sueldos y jornales - Delete
router.get('/sueldos_jornales/delete', function (req, res, next) {
    Sueldos_Jornales.delete(function (result) {
        res.json({data: result});
    });
});

//sueldos y jornales - query_1
router.get('/sueldos_jornales/query_1', function (req, res, next) {
    Sueldos_Jornales.query_1(req.query, function (result) {
        res.json({data: result});
    });
});


//sueldos y jornales - procedures
router.get('/sueldos_jornales/procedures', function (req, res, next) {
    Sueldos_Jornales.procedures(req.query, function (result) {
        res.json({data: result});
    });
});


//sucursales sueldo select option
router.get('/sucursal_sueldo/select/:empresa', function (req, res, next) {
    Sucursal_Sueldo.all(req.params, function (result) {
        res.json({data: result});
    });
});

//departamentos sueldo select option
router.get('/departamento_sueldo/select', function (req, res, next) {
    Departamento_Sueldo.all(req.query, function (result) {
        res.json({data: result});
    });
});

//Anticipos - Delete
router.get('/anticipo_sueldo/delete', function (req, res, next) {
    Sueldos_Jornales.delete(function (result) {
        res.json({data: result});
    });
});

//Anticipos - query_1
router.get('/anticipo_sueldo/query_1', function (req, res, next) {
    Sueldos_Jornales.query_1(req.query, function (result) {
        res.json({data: result});
    });
});


//Anticipos - procedures
router.get('/anticipo_sueldo/procedures', function (req, res, next) {
    Anticipos.procedures(req.query, function (result) {
        res.json({data: result});
    });
});


//Aguinaldos - exite
router.get('/aguinaldo_sueldo/existe', function (req, res, next) {
    Aguinaldos.existe(req.query, function (result) {
        res.json({data: result});
    });
});

//Aguinaldos - procedures
router.get('/aguinaldo_sueldo/procedures', function (req, res, next) {
    Aguinaldos.procedures(req.query, function (result) {
        res.json({data: result});
    });
});


//Recibos - Delete
router.get('/recibo_sueldo/delete', function (req, res, next) {
    Recibos.delete(function (result) {
        res.json({data: result});
    });
});

//Recibos - query_1
router.get('/recibo_sueldo/query_1', function (req, res, next) {
    Recibos.query_1(req.query, function (result) {
        res.json({data: result});
    });
});


//Recibos - procedures
router.get('/recibo_sueldo/procedures', function (req, res, next) {
    Recibos.procedures(req.query, function (result) {
        res.json({data: result});
    });
});

module.exports = router;
