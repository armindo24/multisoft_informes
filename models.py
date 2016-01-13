# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
#
# Also note: You'll have to insert the output of 'django-admin sqlcustom [app_label]'
# into your database.
from __future__ import unicode_literals

from django.db import models


class 09062011Clientes(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    cliente_padre = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    cod_con_vta = models.CharField(max_length=2, blank=True, null=True)
    cod_zona = models.CharField(max_length=3, blank=True, null=True)
    cod_tp_cliente = models.CharField(max_length=2, blank=True, null=True)
    cod_calificacion = models.CharField(max_length=8, blank=True, null=True)
    cod_localidad = models.CharField(max_length=3)
    list_precio = models.CharField(max_length=1)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    limite_cr_gs = models.DecimalField(max_digits=19, decimal_places=4)
    limite_cr_me = models.DecimalField(max_digits=19, decimal_places=4)
    descuento = models.DecimalField(max_digits=5, decimal_places=2)
    cedula = models.CharField(max_length=15, blank=True, null=True)
    cip = models.CharField(max_length=10, blank=True, null=True)
    fecha_nac = models.DateTimeField(blank=True, null=True)
    cat_iva = models.CharField(max_length=1)
    ult_compra = models.DateTimeField(blank=True, null=True)
    ult_pago = models.DateTimeField(blank=True, null=True)
    ult_actualizacion = models.DateTimeField(blank=True, null=True)
    estado = models.CharField(max_length=1)
    cod_usuario = models.CharField(max_length=16)
    razon_social = models.CharField(max_length=100)
    ruc = models.CharField(max_length=14)
    contacto = models.CharField(max_length=35, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    direccion_part = models.CharField(max_length=80, blank=True, null=True)
    email = models.CharField(max_length=30, blank=True, null=True)
    telefono1 = models.CharField(max_length=25, blank=True, null=True)
    telefono2 = models.CharField(max_length=25, blank=True, null=True)
    fax = models.CharField(max_length=25, blank=True, null=True)
    nro_tarjeta = models.CharField(max_length=30, blank=True, null=True)
    venc_tarjeta = models.DateTimeField(blank=True, null=True)
    referencia_1 = models.CharField(max_length=40, blank=True, null=True)
    referencia_2 = models.CharField(max_length=40, blank=True, null=True)
    referencia_3 = models.CharField(max_length=40, blank=True, null=True)
    observ = models.CharField(max_length=1000, blank=True, null=True)
    cod_tarjeta = models.CharField(max_length=4, blank=True, null=True)
    celular = models.CharField(max_length=25, blank=True, null=True)
    radiomensaje = models.CharField(max_length=25, blank=True, null=True)
    codradiomens = models.CharField(max_length=25, blank=True, null=True)
    nrocliente = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True)
    saldoporcliente = models.CharField(max_length=1, blank=True, null=True)
    tipodcto = models.CharField(max_length=1, blank=True, null=True)
    transf_vtdir = models.CharField(max_length=1, blank=True, null=True)
    codplancta_me = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_me = models.CharField(max_length=11, blank=True, null=True)
    diasmora = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    moroso = models.CharField(max_length=1, blank=True, null=True)
    cod_cobrador = models.CharField(max_length=3, blank=True, null=True)
    nroservicio = models.CharField(max_length=20, blank=True, null=True)
    cod_cliente_cap = models.CharField(max_length=8, blank=True, null=True)
    bloquearlista = models.CharField(max_length=1, blank=True, null=True)
    cantfactsaldo = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    responsable = models.CharField(max_length=100, blank=True, null=True)
    plantilla = models.CharField(max_length=1, blank=True, null=True)
    cod_original = models.CharField(max_length=30, blank=True, null=True)
    codpais = models.CharField(max_length=3, blank=True, null=True)
    coddptopais = models.CharField(max_length=3, blank=True, null=True)
    codciudad = models.CharField(max_length=3, blank=True, null=True)
    codbarrio = models.CharField(max_length=3, blank=True, null=True)
    casa = models.CharField(max_length=2, blank=True, null=True)
    estadocivil = models.CharField(max_length=2, blank=True, null=True)
    codcodeudorconyug = models.CharField(max_length=8, blank=True, null=True)
    codcodeudor = models.CharField(max_length=8, blank=True, null=True)
    codconyugue = models.CharField(max_length=8, blank=True, null=True)
    ctactecatastral = models.CharField(max_length=20, blank=True, null=True)
    patente = models.CharField(max_length=12, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    cod_asociacion = models.CharField(max_length=8, blank=True, null=True)
    fechaalta = models.DateTimeField(blank=True, null=True)
    fec_ult_visita = models.DateField(blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    dna = models.CharField(max_length=20, blank=True, null=True)
    fechabaja = models.DateTimeField(blank=True, null=True)
    vctoregdist = models.DateTimeField(blank=True, null=True)
    bloqmoneda = models.CharField(max_length=1, blank=True, null=True)
    cod_cartera = models.CharField(max_length=3, blank=True, null=True)
    cod_ramo = models.CharField(max_length=3, blank=True, null=True)
    porc_inc_precios = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    red_social = models.CharField(max_length=200, blank=True, null=True)
    messenger = models.CharField(max_length=100, blank=True, null=True)
    skype = models.CharField(max_length=100, blank=True, null=True)
    cedulatmp = models.CharField(max_length=16, blank=True, null=True)
    monto_inc_precios = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '09062011_CLIENTES'
        unique_together = (('cod_empresa', 'cod_cliente'),)


class Accionvisita(models.Model):
    cod_empresa = models.ForeignKey('Empresa', db_column='cod_empresa')
    cod_accion = models.CharField(max_length=8)
    des_accion = models.CharField(max_length=60, blank=True, null=True)
    tpdef = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'accionvisita'
        unique_together = (('cod_empresa', 'cod_accion'),)


class Acumauxi(models.Model):
    cod_empresa = models.CharField(max_length=2)
    periodo = models.CharField(max_length=8)
    codplancta = models.CharField(max_length=11)
    codplanaux = models.CharField(max_length=11)
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    mes = models.DecimalField(max_digits=2, decimal_places=0)
    anhomes = models.CharField(max_length=6)
    dbant = models.DecimalField(max_digits=19, decimal_places=4)
    crant = models.DecimalField(max_digits=19, decimal_places=4)
    totaldb = models.DecimalField(max_digits=19, decimal_places=4)
    totalcr = models.DecimalField(max_digits=19, decimal_places=4)
    dbantme = models.DecimalField(max_digits=19, decimal_places=4)
    crantme = models.DecimalField(max_digits=19, decimal_places=4)
    totaldbme = models.DecimalField(max_digits=19, decimal_places=4)
    totalcrme = models.DecimalField(max_digits=19, decimal_places=4)
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'acumauxi'
        unique_together = (('cod_empresa', 'periodo', 'codplancta', 'codplanaux', 'anho', 'mes'),)


class Acumplan(models.Model):
    cod_empresa = models.CharField(max_length=2)
    periodo = models.CharField(max_length=8)
    codplancta = models.CharField(max_length=11)
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    mes = models.DecimalField(max_digits=2, decimal_places=0)
    anhomes = models.CharField(max_length=6)
    dbant = models.DecimalField(max_digits=19, decimal_places=4)
    crant = models.DecimalField(max_digits=19, decimal_places=4)
    totaldb = models.DecimalField(max_digits=19, decimal_places=4)
    totalcr = models.DecimalField(max_digits=19, decimal_places=4)
    dbantme = models.DecimalField(max_digits=19, decimal_places=4)
    crantme = models.DecimalField(max_digits=19, decimal_places=4)
    totaldbme = models.DecimalField(max_digits=19, decimal_places=4)
    totalcrme = models.DecimalField(max_digits=19, decimal_places=4)

    class Meta:
        managed = False
        db_table = 'acumplan'
        unique_together = (('cod_empresa', 'periodo', 'codplancta', 'anho', 'mes'),)


class Agendacobranzas(models.Model):
    cod_empresa = models.ForeignKey('Tpoactagendacobranzas', db_column='cod_empresa')
    cod_cliente = models.CharField(max_length=8)
    nroregistro = models.DecimalField(max_digits=9, decimal_places=0)
    cod_usuario = models.ForeignKey('Usuarios', db_column='cod_usuario')
    fechahora = models.DateTimeField()
    codtipoaccion = models.CharField(max_length=4)
    estado = models.CharField(max_length=1)
    cod_cobrador = models.ForeignKey('Cobrador', db_column='cod_cobrador', blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    observlarga = models.CharField(max_length=2500, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    fecha_ven = models.DateField(blank=True, null=True)
    atraso = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    fechahoraprg = models.DateTimeField(blank=True, null=True)
    codtipoaccionprg = models.CharField(max_length=4, blank=True, null=True)
    tramo = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'agendacobranzas'
        unique_together = (('cod_empresa', 'cod_cliente', 'nroregistro'),)


class Analistacred(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_analista = models.CharField(max_length=4)
    des_analista = models.CharField(max_length=60, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2)
    codtpcomp_solnw = models.CharField(max_length=4, blank=True, null=True)
    codtpoacc_solnw = models.CharField(max_length=4, blank=True, null=True)
    codtpcomp_solact = models.CharField(max_length=4, blank=True, null=True)
    codtpoacc_solact = models.CharField(max_length=4, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16)
    codtpoaccsol_aprob = models.CharField(max_length=4, blank=True, null=True)
    codtpoaccsol_rech = models.CharField(max_length=4, blank=True, null=True)
    codtpoaccactu_aprob = models.CharField(max_length=4, blank=True, null=True)
    codtpoaccactu_rech = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'analistacred'
        unique_together = (('cod_empresa', 'cod_analista', 'cod_sucursal', 'cod_usuario'),)


class Aranceles(models.Model):
    cod_empresa = models.CharField(max_length=2)
    codarancel = models.CharField(max_length=5)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    descrip = models.CharField(max_length=60, blank=True, null=True)
    tpdef = models.CharField(max_length=1)
    periodo = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'aranceles'
        unique_together = (('cod_empresa', 'codarancel'),)


class Artdep(models.Model):
    cod_empresa = models.ForeignKey('Articulo', db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    existencia = models.DecimalField(max_digits=13, decimal_places=2)
    fha_ult_mov = models.DateTimeField(blank=True, null=True)
    ult_inv_fisico = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    fha_ult_inv = models.DateTimeField(blank=True, null=True)
    ubicacion = models.CharField(max_length=3, blank=True, null=True)
    exist_minima = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    exist_maxima = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    fechaingreso = models.DateTimeField(blank=True, null=True)
    inventario_existencia = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)
    inventario_fecha = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'artdep'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_deposito', 'cod_articulo'),)


class ArtdepMvtos(models.Model):
    lineamov = models.DecimalField(max_digits=19, decimal_places=0)
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    fechahoraop = models.DateTimeField(blank=True, null=True)
    userid = models.CharField(max_length=16)
    origen = models.CharField(max_length=8, blank=True, null=True)
    anulado = models.CharField(max_length=1, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    linea = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    tipo_iva = models.CharField(max_length=1, blank=True, null=True)
    tp_def = models.CharField(max_length=2, blank=True, null=True)
    af_existencia = models.CharField(max_length=1, blank=True, null=True)
    af_costos = models.CharField(max_length=1, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=25, decimal_places=2, blank=True, null=True)
    pr_unit = models.DecimalField(max_digits=25, decimal_places=2, blank=True, null=True)
    existencia = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    des_sucursal = models.CharField(max_length=30, blank=True, null=True)
    des_deposito = models.CharField(max_length=30, blank=True, null=True)
    des_art = models.CharField(max_length=80, blank=True, null=True)
    des_moneda = models.CharField(max_length=20, blank=True, null=True)
    des_tp_comp = models.CharField(max_length=40, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    codartpad = models.CharField(max_length=14, blank=True, null=True)
    cod_original = models.CharField(max_length=14, blank=True, null=True)
    nroarticulo = models.DecimalField(max_digits=14, decimal_places=0, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    asentadocv = models.CharField(max_length=1, blank=True, null=True)
    tipo_mvto = models.CharField(max_length=1, blank=True, null=True)
    fechadoc = models.DateTimeField(blank=True, null=True)
    preciocostoml = models.DecimalField(max_digits=25, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'artdep_mvtos'
        unique_together = (('lineamov', 'cod_empresa', 'cod_sucursal', 'cod_deposito', 'cod_articulo'),)


class ArtdepSync(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    existencia = models.DecimalField(max_digits=13, decimal_places=2)
    fha_ult_mov = models.DateTimeField(blank=True, null=True)
    ult_inv_fisico = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    fha_ult_inv = models.DateTimeField(blank=True, null=True)
    ubicacion = models.CharField(max_length=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'artdep_sync'


class ArtdepTmp(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    existencia = models.DecimalField(max_digits=13, decimal_places=2)
    fha_ult_mov = models.DateTimeField(blank=True, null=True)
    ult_inv_fisico = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    fha_ult_inv = models.DateTimeField(blank=True, null=True)
    ubicacion = models.CharField(max_length=3, blank=True, null=True)
    exist_minima = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    exist_maxima = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    fechaingreso = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'artdep_tmp'


class ArtdepTmp1(models.Model):
    empresa = models.CharField(max_length=2, blank=True, null=True)
    sucursal = models.CharField(max_length=2, blank=True, null=True)
    deposito = models.CharField(max_length=2, blank=True, null=True)
    articulo = models.CharField(max_length=14, blank=True, null=True)
    descripcion = models.CharField(max_length=250, blank=True, null=True)
    minimo = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    maximo = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'artdep_tmp_1'


class ArtdeprpTmp(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    exist_minima = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    exist_maxima = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'artdeprp_tmp'


class Artdeptotales(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    mes = models.DecimalField(max_digits=2, decimal_places=0)
    anhomes = models.CharField(max_length=6, blank=True, null=True)
    existencia = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ventas = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    ventasnc = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montoventas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montoventasnc = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montoventas_ml = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montoventasnc_ml = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ventas_est = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    ventasnc_est = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montoventas_est = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montoventasnc_est = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    compras_loc = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    compras_nc_loc = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    compras_falt_loc = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montocompras_loc = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montocompras_nc_loc = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montocompras_falt_loc = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    compras_imp = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    compras_nc_imp = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    compras_falt_imp = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montocompras_imp = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montocompras_nc_imp = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montocompras_falt_imp = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    stock_entrada = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    stock_salida = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montostock_entrada = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montostock_salida = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalimportacion = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalgastosimp = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalimpuestos = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalimportacionme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalgastosimpme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalimpuestosme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'artdeptotales'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_deposito', 'cod_articulo', 'anho', 'mes'),)


class ArtdeptotalesTmp(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    mes = models.DecimalField(max_digits=2, decimal_places=0)
    anhomes = models.CharField(max_length=6, blank=True, null=True)
    existencia = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ventas = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    ventasnc = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montoventas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montoventasnc = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montoventas_ml = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montoventasnc_ml = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ventas_est = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    ventasnc_est = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montoventas_est = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montoventasnc_est = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    compras_loc = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    compras_nc_loc = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    compras_falt_loc = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montocompras_loc = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montocompras_nc_loc = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montocompras_falt_loc = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    compras_imp = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    compras_nc_imp = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    compras_falt_imp = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montocompras_imp = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montocompras_nc_imp = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montocompras_falt_imp = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    stock_entrada = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    stock_salida = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    montostock_entrada = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montostock_salida = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalimportacion = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalgastosimp = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalimpuestos = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalimportacionme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalgastosimpme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalimpuestosme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'artdeptotales_tmp'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_deposito', 'cod_articulo', 'anho', 'mes'),)


class Articulo(models.Model):
    cod_empresa = models.ForeignKey('Plancta', db_column='cod_empresa')
    cod_articulo = models.CharField(max_length=14)
    cod_familia = models.ForeignKey('Subgrupo', db_column='cod_familia')
    cod_grupo = models.CharField(max_length=4)
    cod_subgrupo = models.CharField(max_length=4)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_art = models.ForeignKey('Tpoart', db_column='cod_tp_art', blank=True, null=True)
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda')
    cod_original = models.CharField(max_length=14, blank=True, null=True)
    comision_vta = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    descuento = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    unidad = models.CharField(max_length=4)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    st_max = models.DecimalField(max_digits=11, decimal_places=2, blank=True, null=True)
    pto_pedido = models.DecimalField(max_digits=11, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4)
    fha_ult_mov = models.DateTimeField(blank=True, null=True)
    pr1_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr1_me = models.DecimalField(max_digits=19, decimal_places=4)
    pr2_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr2_me = models.DecimalField(max_digits=19, decimal_places=4)
    pr3_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr3_me = models.DecimalField(max_digits=19, decimal_places=4)
    pr4_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr4_me = models.DecimalField(max_digits=19, decimal_places=4)
    cod_usuario = models.CharField(max_length=16)
    cta_cont = models.CharField(max_length=11, blank=True, null=True)
    aux_cont = models.CharField(max_length=11, blank=True, null=True)
    des_art = models.CharField(max_length=150)
    codartpad = models.CharField(max_length=14, blank=True, null=True)
    referencia = models.CharField(max_length=15, blank=True, null=True)
    estado = models.CharField(max_length=1)
    nroarticulo = models.DecimalField(max_digits=14, decimal_places=0, blank=True, null=True)
    cta_costo = models.CharField(max_length=11, blank=True, null=True)
    aux_costo = models.CharField(max_length=11, blank=True, null=True)
    cta_vta = models.CharField(max_length=11, blank=True, null=True)
    aux_vta = models.CharField(max_length=11, blank=True, null=True)
    tipoembalaje = models.CharField(max_length=40, blank=True, null=True)
    cantembalaje = models.DecimalField(max_digits=8, decimal_places=2)
    variacionprecio = models.CharField(max_length=1, blank=True, null=True)
    descripcorta = models.CharField(max_length=12, blank=True, null=True)
    listaventa = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    codmodalidad = models.ForeignKey('Modimpositiva', db_column='codmodalidad')
    cta_vtactme = models.CharField(max_length=11, blank=True, null=True)
    aux_vtactme = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrgs = models.CharField(max_length=11, blank=True, null=True)
    aux_vtacrgs = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrme = models.CharField(max_length=11, blank=True, null=True)
    aux_vtacrme = models.CharField(max_length=11, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    cto_prom_ant_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_prom_ant_me = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_fob_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_fob_me = models.DecimalField(max_digits=19, decimal_places=4)
    cantmin1 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cantmin2 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cantmin3 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cantmin4 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    porccomislista1 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomislista2 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomislista3 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomislista4 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    codconcepto = models.CharField(max_length=4, blank=True, null=True)
    largo = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    ancho = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    altura = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    densidad = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    m3 = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    peso = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    fechacreacion = models.DateTimeField(blank=True, null=True)
    usrcreacion = models.CharField(max_length=16, blank=True, null=True)
    fechamodif = models.DateTimeField(blank=True, null=True)
    usrmodif = models.CharField(max_length=16, blank=True, null=True)
    standard = models.CharField(max_length=1, blank=True, null=True)
    des_art_old = models.CharField(max_length=200, blank=True, null=True)
    modpreciovta = models.CharField(max_length=1, blank=True, null=True)
    ctrlfactntcredito = models.CharField(max_length=1, blank=True, null=True)
    descriplarga = models.CharField(max_length=1000, blank=True, null=True)
    ctaimpcurso = models.CharField(max_length=11, blank=True, null=True)
    auximpcurso = models.CharField(max_length=11, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    cta_vtactgs = models.CharField(max_length=11, blank=True, null=True)
    aux_vtactgs = models.CharField(max_length=11, blank=True, null=True)
    porcgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porcpartgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    peso_max = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    ctrl_cant_minima = models.CharField(max_length=1, blank=True, null=True)
    codmarca = models.ForeignKey('Marca', db_column='codmarca', blank=True, null=True)
    codmodelo = models.ForeignKey('Modelo', db_column='codmodelo', blank=True, null=True)
    facturar_por = models.CharField(max_length=1)
    pr5_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr5_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr6_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr6_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cantmin5 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cantmin6 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    porccomislista5 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomislista6 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    ncm = models.CharField(max_length=30, blank=True, null=True)
    rent1gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent2gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent3gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent4gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent5gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent6gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent1me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent2me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent3me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent4me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent5me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent6me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    baseincprecio_1 = models.CharField(max_length=2, blank=True, null=True)
    baseincprecio_2 = models.CharField(max_length=2, blank=True, null=True)
    baseincprecio_3 = models.CharField(max_length=2, blank=True, null=True)
    baseincprecio_4 = models.CharField(max_length=2, blank=True, null=True)
    baseincprecio_5 = models.CharField(max_length=2, blank=True, null=True)
    baseincprecio_6 = models.CharField(max_length=2, blank=True, null=True)
    porcarancelario = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    foto1 = models.CharField(max_length=200, blank=True, null=True)
    codpais = models.ForeignKey('Pais', db_column='codpais', blank=True, null=True)
    lote = models.CharField(max_length=20, blank=True, null=True)
    lotevcto = models.DateField(blank=True, null=True)
    modselecarthijos = models.CharField(max_length=1, blank=True, null=True)
    plantilla = models.CharField(max_length=1, blank=True, null=True)
    fha_ult_vta = models.DateTimeField(blank=True, null=True)
    voltaje = models.CharField(max_length=20, blank=True, null=True)
    ciclaje = models.CharField(max_length=20, blank=True, null=True)
    plazogarantia = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    porc_financ = models.DecimalField(max_digits=20, decimal_places=18, blank=True, null=True)
    porc_financ_me = models.DecimalField(max_digits=20, decimal_places=18, blank=True, null=True)
    stockminimo = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    stockmaximo = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    preciominimoml = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    preciomaximoml = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    preciominimome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    preciomaximome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_cif_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_cif_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    containerhq20 = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    containerhq40 = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'articulo'
        unique_together = (('cod_empresa', 'cod_articulo'),)


class ArticuloCostos(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_art = models.CharField(max_length=3, blank=True, null=True)
    codmoneda = models.CharField(max_length=2)
    cod_original = models.CharField(max_length=14, blank=True, null=True)
    comision_vta = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    descuento = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    unidad = models.CharField(max_length=4)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    st_max = models.DecimalField(max_digits=11, decimal_places=2, blank=True, null=True)
    pto_pedido = models.DecimalField(max_digits=11, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4)
    fha_ult_mov = models.DateTimeField(blank=True, null=True)
    pr1_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr1_me = models.DecimalField(max_digits=19, decimal_places=4)
    pr2_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr2_me = models.DecimalField(max_digits=19, decimal_places=4)
    pr3_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr3_me = models.DecimalField(max_digits=19, decimal_places=4)
    pr4_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr4_me = models.DecimalField(max_digits=19, decimal_places=4)
    cod_usuario = models.CharField(max_length=16)
    cta_cont = models.CharField(max_length=11, blank=True, null=True)
    aux_cont = models.CharField(max_length=11, blank=True, null=True)
    des_art = models.CharField(max_length=80)
    codartpad = models.CharField(max_length=14, blank=True, null=True)
    referencia = models.CharField(max_length=15, blank=True, null=True)
    estado = models.CharField(max_length=1)
    nroarticulo = models.DecimalField(max_digits=14, decimal_places=0, blank=True, null=True)
    cta_costo = models.CharField(max_length=11, blank=True, null=True)
    aux_costo = models.CharField(max_length=11, blank=True, null=True)
    cta_vta = models.CharField(max_length=11, blank=True, null=True)
    aux_vta = models.CharField(max_length=11, blank=True, null=True)
    tipoembalaje = models.CharField(max_length=40, blank=True, null=True)
    cantembalaje = models.DecimalField(max_digits=8, decimal_places=2)
    variacionprecio = models.CharField(max_length=1, blank=True, null=True)
    descripcorta = models.CharField(max_length=12, blank=True, null=True)
    listaventa = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    codmodalidad = models.CharField(max_length=4, blank=True, null=True)
    cta_vtactme = models.CharField(max_length=11, blank=True, null=True)
    aux_vtactme = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrgs = models.CharField(max_length=11, blank=True, null=True)
    aux_vtacrgs = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrme = models.CharField(max_length=11, blank=True, null=True)
    aux_vtacrme = models.CharField(max_length=11, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    cto_prom_ant_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_prom_ant_me = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_fob_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_fob_me = models.DecimalField(max_digits=19, decimal_places=4)
    cantmin1 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cantmin2 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cantmin3 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cantmin4 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    porccomislista1 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomislista2 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomislista3 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomislista4 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    codconcepto = models.CharField(max_length=4, blank=True, null=True)
    largo = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    ancho = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    altura = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    densidad = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    m3 = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    peso = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    fechacreacion = models.DateTimeField(blank=True, null=True)
    usrcreacion = models.CharField(max_length=16, blank=True, null=True)
    fechamodif = models.DateTimeField(blank=True, null=True)
    usrmodif = models.CharField(max_length=16, blank=True, null=True)
    standard = models.CharField(max_length=1, blank=True, null=True)
    des_art_old = models.CharField(max_length=200, blank=True, null=True)
    modpreciovta = models.CharField(max_length=1, blank=True, null=True)
    ctrlfactntcredito = models.CharField(max_length=1, blank=True, null=True)
    descriplarga = models.CharField(max_length=1000, blank=True, null=True)
    ctaimpcurso = models.CharField(max_length=11, blank=True, null=True)
    auximpcurso = models.CharField(max_length=11, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    cta_vtactgs = models.CharField(max_length=11, blank=True, null=True)
    aux_vtactgs = models.CharField(max_length=11, blank=True, null=True)
    porcgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porcpartgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'articulo_costos'
        unique_together = (('cod_empresa', 'cod_articulo'),)


class ArticuloMvto(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=15, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fha_ultmvto = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'articulo_mvto'


class ArticuloSync(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_art = models.CharField(max_length=3, blank=True, null=True)
    codmoneda = models.CharField(max_length=2)
    cod_original = models.CharField(max_length=14, blank=True, null=True)
    comision_vta = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    descuento = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    unidad = models.CharField(max_length=4, blank=True, null=True)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    st_max = models.DecimalField(max_digits=11, decimal_places=2, blank=True, null=True)
    pto_pedido = models.DecimalField(max_digits=11, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4)
    fha_ult_mov = models.DateTimeField(blank=True, null=True)
    pr1_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr1_me = models.DecimalField(max_digits=19, decimal_places=4)
    pr2_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr2_me = models.DecimalField(max_digits=19, decimal_places=4)
    pr3_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr3_me = models.DecimalField(max_digits=19, decimal_places=4)
    pr4_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr4_me = models.DecimalField(max_digits=19, decimal_places=4)
    cod_usuario = models.CharField(max_length=16)
    cta_cont = models.CharField(max_length=11, blank=True, null=True)
    aux_cont = models.CharField(max_length=11, blank=True, null=True)
    des_art = models.CharField(max_length=40)
    codartpad = models.CharField(max_length=14, blank=True, null=True)
    referencia = models.CharField(max_length=15, blank=True, null=True)
    estado = models.CharField(max_length=1)
    nroarticulo = models.DecimalField(max_digits=14, decimal_places=0, blank=True, null=True)
    cta_costo = models.CharField(max_length=11, blank=True, null=True)
    aux_costo = models.CharField(max_length=11, blank=True, null=True)
    cta_vta = models.CharField(max_length=11, blank=True, null=True)
    aux_vta = models.CharField(max_length=11, blank=True, null=True)
    tipoembalaje = models.CharField(max_length=40, blank=True, null=True)
    cantembalaje = models.DecimalField(max_digits=8, decimal_places=2)
    variacionprecio = models.CharField(max_length=1, blank=True, null=True)
    descripcorta = models.CharField(max_length=12, blank=True, null=True)
    listaventa = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    codmodalidad = models.CharField(max_length=4, blank=True, null=True)
    cta_vtactme = models.CharField(max_length=11, blank=True, null=True)
    aux_vtactme = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrgs = models.CharField(max_length=11, blank=True, null=True)
    aux_vtacrgs = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrme = models.CharField(max_length=11, blank=True, null=True)
    aux_vtacrme = models.CharField(max_length=11, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'articulo_sync'


class ArticulosCtas(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    des_art = models.CharField(max_length=80, blank=True, null=True)
    cta_cont = models.CharField(max_length=11, blank=True, null=True)
    aux_cont = models.CharField(max_length=11, blank=True, null=True)
    cta_costo = models.CharField(max_length=11, blank=True, null=True)
    aux_costo = models.CharField(max_length=11, blank=True, null=True)
    cta_vta = models.CharField(max_length=11, blank=True, null=True)
    aux_vta = models.CharField(max_length=11, blank=True, null=True)
    cta_vtactgs = models.CharField(max_length=11, blank=True, null=True)
    aux_vtactgs = models.CharField(max_length=11, blank=True, null=True)
    cta_vtactme = models.CharField(max_length=11, blank=True, null=True)
    aux_vtactme = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrgs = models.CharField(max_length=11, blank=True, null=True)
    aux_vtacrgs = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrme = models.CharField(max_length=11, blank=True, null=True)
    aux_vtacrme = models.CharField(max_length=11, blank=True, null=True)
    ctaimpcurso = models.CharField(max_length=11, blank=True, null=True)
    auximpcurso = models.CharField(max_length=11, blank=True, null=True)
    fechacreacion = models.CharField(max_length=10, blank=True, null=True)
    usrcreacion = models.CharField(max_length=16, blank=True, null=True)
    fechamodif = models.CharField(max_length=10, blank=True, null=True)
    usrmodif = models.CharField(max_length=16, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'articulos_ctas'


class ArticulosStock(models.Model):
    idarticulo = models.FloatField(blank=True, null=True)
    codigo = models.CharField(max_length=15, blank=True, null=True)
    codigobusq = models.CharField(max_length=25, blank=True, null=True)
    descripcion = models.CharField(max_length=100, blank=True, null=True)
    descripcionlarga = models.CharField(max_length=32767, blank=True, null=True)
    idfamilia = models.FloatField(blank=True, null=True)
    idsubfamilia = models.FloatField(blank=True, null=True)
    idseccion = models.FloatField(blank=True, null=True)
    idimpuesto = models.FloatField(blank=True, null=True)
    codigobarra = models.CharField(max_length=50, blank=True, null=True)
    noparte = models.CharField(max_length=10, blank=True, null=True)
    idmarca = models.FloatField(blank=True, null=True)
    idmodelo = models.FloatField(blank=True, null=True)
    modelo = models.CharField(max_length=100, blank=True, null=True)
    vender = models.FloatField(blank=True, null=True)
    comprar = models.FloatField(blank=True, null=True)
    bajodemanda = models.FloatField(blank=True, null=True)
    manejastock = models.FloatField(blank=True, null=True)
    manejagarantia = models.FloatField(blank=True, null=True)
    manejanoserie = models.FloatField(blank=True, null=True)
    manejapackinglist = models.FloatField(blank=True, null=True)
    maxcharserie = models.FloatField(blank=True, null=True)
    stockminimo = models.FloatField(blank=True, null=True)
    stockmaximo = models.FloatField(blank=True, null=True)
    stockideal = models.FloatField(blank=True, null=True)
    foto = models.CharField(max_length=50, blank=True, null=True)
    idunidminimacompra = models.FloatField(blank=True, null=True)
    idunidminimavta = models.FloatField(blank=True, null=True)
    idproveedorsugerido = models.FloatField(blank=True, null=True)
    idproveedorultcompra = models.FloatField(blank=True, null=True)
    precioultcompra = models.FloatField(blank=True, null=True)
    fechaultcompra = models.CharField(max_length=20, blank=True, null=True)
    fechaultvta = models.CharField(max_length=20, blank=True, null=True)
    preciocosto = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    idmonedacompra = models.FloatField(blank=True, null=True)
    preciovtastandar = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    idmonedavta = models.FloatField(blank=True, null=True)
    comisiona = models.FloatField(blank=True, null=True)
    comision = models.CharField(max_length=10, blank=True, null=True)
    tipocomision = models.CharField(max_length=1, blank=True, null=True)
    idmonedacomision = models.FloatField(blank=True, null=True)
    cantstock = models.FloatField(blank=True, null=True)
    idususarioalta = models.FloatField(blank=True, null=True)
    fechaalta = models.CharField(max_length=20, blank=True, null=True)
    idusuarioultimaactmanual = models.FloatField(blank=True, null=True)
    fechaultactmanual = models.CharField(max_length=20, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    diasgarantia = models.FloatField(blank=True, null=True)
    precioultimaventa = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    preciopromedioponderado = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    idtipoart = models.FloatField(blank=True, null=True)
    criterioplan = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'articulos_stock'


class Articuloserie(models.Model):
    cod_empresa = models.ForeignKey(Articulo, db_column='cod_empresa')
    cod_articulo = models.CharField(max_length=14)
    nroserie = models.CharField(max_length=20)
    nro_motor = models.CharField(max_length=30, blank=True, null=True)
    codmarca = models.ForeignKey('Marca', db_column='codmarca', blank=True, null=True)
    codmodelo = models.ForeignKey('Modelo', db_column='codmodelo', blank=True, null=True)
    color = models.CharField(max_length=30, blank=True, null=True)
    fechahora = models.DateTimeField(blank=True, null=True)
    observ = models.CharField(max_length=40, blank=True, null=True)
    codusuario = models.CharField(max_length=16, blank=True, null=True)
    facturado = models.CharField(max_length=1, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    lote = models.CharField(max_length=20, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'articuloserie'
        unique_together = (('cod_empresa', 'cod_articulo', 'nroserie'),)


class Articulotpocbte(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    cod_tp_comp = models.CharField(max_length=4)

    class Meta:
        managed = False
        db_table = 'articulotpocbte'
        unique_together = (('cod_empresa', 'cod_articulo', 'cod_tp_comp'),)


class AsientosMigrac(models.Model):
    cantreg = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    horaactual = models.DateTimeField(blank=True, null=True)
    dif_segundos = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)
    nroorden_tmp = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    nroasto_orig = models.CharField(max_length=25, blank=True, null=True)
    observ = models.CharField(max_length=25, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'asientos_migrac'


class AsientosMigracBad(models.Model):
    nroorden_tmp = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    nroasto_orig = models.CharField(max_length=25, blank=True, null=True)
    usuario_importedebe = models.CharField(max_length=25, blank=True, null=True)
    vacio23_debeus = models.CharField(max_length=25, blank=True, null=True)
    totaldebe_importehaber = models.CharField(max_length=25, blank=True, null=True)
    vacio24_haberus = models.CharField(max_length=25, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'asientos_migrac_bad'


class AsientosTmp(models.Model):
    nroorden = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    nroasiento_vacio27 = models.CharField(max_length=25, blank=True, null=True)
    nousar_anulado = models.CharField(max_length=25, blank=True, null=True)
    comentario_ctacontable = models.CharField(max_length=100, blank=True, null=True)
    fechaasiento_moneda = models.CharField(max_length=25, blank=True, null=True)
    usuario_importedebe = models.CharField(max_length=25, blank=True, null=True)
    totaldebe_importehaber = models.CharField(max_length=25, blank=True, null=True)
    totalhaber_vacio29 = models.CharField(max_length=25, blank=True, null=True)
    vacio1_vacio30 = models.CharField(max_length=25, blank=True, null=True)
    comentario_vacio31 = models.CharField(max_length=25, blank=True, null=True)
    vacio2_vacio32 = models.CharField(max_length=25, blank=True, null=True)
    vacio3_vacio33 = models.CharField(max_length=25, blank=True, null=True)
    vacio4_descripctacont = models.CharField(max_length=150, blank=True, null=True)
    vacio5_vacio34 = models.CharField(max_length=25, blank=True, null=True)
    vacio6_vacio35 = models.CharField(max_length=25, blank=True, null=True)
    vacio7_totaldebeus = models.CharField(max_length=25, blank=True, null=True)
    vacio8_totalhaberus = models.CharField(max_length=25, blank=True, null=True)
    vacio9_vacio36 = models.CharField(max_length=25, blank=True, null=True)
    vacio10_vacio37 = models.CharField(max_length=25, blank=True, null=True)
    vacio11_vacio38 = models.CharField(max_length=25, blank=True, null=True)
    vacio12_vacio39 = models.CharField(max_length=25, blank=True, null=True)
    vacio13_vacio40 = models.CharField(max_length=25, blank=True, null=True)
    vacio14_vacio41 = models.CharField(max_length=25, blank=True, null=True)
    vacio15_vacio42 = models.CharField(max_length=25, blank=True, null=True)
    vacio16_vacio43 = models.CharField(max_length=25, blank=True, null=True)
    vacio17_vacio44 = models.CharField(max_length=25, blank=True, null=True)
    vacio18_vacio45 = models.CharField(max_length=25, blank=True, null=True)
    vacio19_vacio46 = models.CharField(max_length=25, blank=True, null=True)
    vacio20_vacio47 = models.CharField(max_length=25, blank=True, null=True)
    vacio21_vacio48 = models.CharField(max_length=25, blank=True, null=True)
    vacio22_vacio49 = models.CharField(max_length=25, blank=True, null=True)
    vacio23_debeus = models.CharField(max_length=25, blank=True, null=True)
    vacio24_haberus = models.CharField(max_length=25, blank=True, null=True)
    vacio25_tipocambio = models.CharField(max_length=25, blank=True, null=True)
    vacio26_vacio50 = models.CharField(max_length=25, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'asientos_tmp'


class Asientoscab(models.Model):
    cod_empresa = models.ForeignKey('Periodo', db_column='cod_empresa')
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0)
    periodo = models.CharField(max_length=8)
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda')
    tipoasiento = models.ForeignKey('Tipoasiento', db_column='tipoasiento')
    nrocompr = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fecha = models.DateTimeField()
    transf = models.CharField(max_length=1)
    origen = models.CharField(max_length=5)
    nroasiento = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    factcambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    autorizado = models.CharField(max_length=1)
    cargadopor = models.CharField(max_length=16, blank=True, null=True)
    fechacarga = models.DateTimeField(blank=True, null=True)
    autorizadopor = models.CharField(max_length=16, blank=True, null=True)
    fechaautoriz = models.DateTimeField(blank=True, null=True)
    nroasiento_orig = models.CharField(max_length=25, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'asientoscab'
        unique_together = (('cod_empresa', 'nrotransac'),)


class AsientoscabAudit(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    tipooper = models.CharField(max_length=1, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'asientoscab_audit'


class Asientosdet(models.Model):
    cod_empresa = models.ForeignKey('Plancta', db_column='cod_empresa')
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0)
    linea = models.DecimalField(max_digits=10, decimal_places=0)
    periodo = models.CharField(max_length=8)
    codplancta = models.CharField(max_length=11)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    dbcr = models.CharField(max_length=1)
    conciliado = models.CharField(max_length=1, blank=True, null=True)
    preconciliado = models.CharField(max_length=1, blank=True, null=True)
    nroconcil = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    importeme = models.DecimalField(max_digits=19, decimal_places=4)
    concepto = models.CharField(max_length=40, blank=True, null=True)
    debito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    credito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    debitome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    creditome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    nroorden = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    nroasiento_orig = models.CharField(max_length=25, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'asientosdet'
        unique_together = (('cod_empresa', 'nrotransac', 'linea'),)


class Asientosmgr(models.Model):
    usuario = models.CharField(max_length=25)

    class Meta:
        managed = False
        db_table = 'asientosmgr'


class AsoEmpleados(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_asociacion = models.CharField(max_length=8)
    razon_social = models.CharField(max_length=100)
    bonificacion = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    vencimiento = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    contacto = models.CharField(max_length=35, blank=True, null=True)
    responsable = models.CharField(max_length=80, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    fax = models.CharField(max_length=25, blank=True, null=True)
    email = models.CharField(max_length=30, blank=True, null=True)
    cod_aso_orig = models.CharField(max_length=8, blank=True, null=True)
    nroplanillaaso = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    abreviatura = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'aso_empleados'
        unique_together = (('cod_empresa', 'cod_asociacion'),)


class AuditArtdep(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    linea = models.DecimalField(max_digits=15, decimal_places=0)
    proc_trigger = models.CharField(max_length=80, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    exist_old = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    exist_new = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    observaciones = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'audit_artdep'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_deposito', 'cod_articulo', 'linea'),)


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=80)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup)
    permission = models.ForeignKey('AuthPermission')

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group_id', 'permission_id'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType')
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type_id', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=30)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser)
    group = models.ForeignKey(AuthGroup)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user_id', 'group_id'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser)
    permission = models.ForeignKey(AuthPermission)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user_id', 'permission_id'),)


class Bancos(models.Model):
    codbanco = models.CharField(primary_key=True, max_length=3)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    descrip = models.CharField(max_length=40)
    local = models.CharField(max_length=1, blank=True, null=True)
    tipo = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'bancos'


class Barrio(models.Model):
    codpais = models.ForeignKey('Ciudad', db_column='codpais')
    coddptopais = models.CharField(max_length=3)
    codciudad = models.CharField(max_length=3)
    codbarrio = models.CharField(max_length=3)
    descrip = models.CharField(max_length=60)
    cod_zona = models.ForeignKey('Zonavta', db_column='cod_zona', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'barrio'
        unique_together = (('codpais', 'coddptopais', 'codciudad', 'codbarrio'),)


class Benefic(models.Model):
    cod_empresa = models.CharField(max_length=2)
    codbenef = models.CharField(max_length=10)
    ruc = models.CharField(max_length=15, blank=True, null=True)
    apellido = models.CharField(max_length=40, blank=True, null=True)
    nombre = models.CharField(max_length=40, blank=True, null=True)
    nombrefantasia = models.CharField(max_length=60, blank=True, null=True)
    razonsocial = models.CharField(max_length=60, blank=True, null=True)
    cedula = models.CharField(max_length=10, blank=True, null=True)
    codpais = models.CharField(max_length=5, blank=True, null=True)
    coddpto = models.CharField(max_length=5, blank=True, null=True)
    codciudad = models.CharField(max_length=5, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    telefono = models.CharField(max_length=40, blank=True, null=True)
    fax = models.CharField(max_length=40, blank=True, null=True)
    codplancta = models.CharField(max_length=15, blank=True, null=True)
    codplanaux = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'benefic'
        unique_together = (('cod_empresa', 'codbenef'),)


class Bienactivo(models.Model):
    cod_empresa = models.ForeignKey('Ubicacion', db_column='cod_empresa')
    codactivo = models.CharField(max_length=14)
    descrip = models.CharField(max_length=40)
    codoriginal = models.CharField(max_length=20, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=7, decimal_places=0)
    cantidadorig = models.DecimalField(max_digits=7, decimal_places=0)
    estado = models.CharField(max_length=1)
    codrubro = models.CharField(max_length=11, blank=True, null=True)
    codsubrubro = models.CharField(max_length=11, blank=True, null=True)
    rubrooriginal = models.CharField(max_length=11, blank=True, null=True)
    subrubrooriginal = models.CharField(max_length=11, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    codubicacion = models.CharField(max_length=14, blank=True, null=True)
    ubicoriginal = models.CharField(max_length=14, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    coddpto = models.CharField(max_length=10, blank=True, null=True)
    codresponsable = models.CharField(max_length=4, blank=True, null=True)
    nroserie = models.CharField(max_length=20, blank=True, null=True)
    nroparte = models.CharField(max_length=20, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fechacompra = models.DateTimeField()
    fechaalta = models.DateTimeField(blank=True, null=True)
    fechainiproc = models.DateTimeField(blank=True, null=True)
    fechareval = models.DateTimeField(blank=True, null=True)
    fechafinactivo = models.DateTimeField(blank=True, null=True)
    metodocalc = models.DecimalField(max_digits=1, decimal_places=0)
    tipodeprec = models.CharField(max_length=1)
    vidautil = models.DecimalField(max_digits=10, decimal_places=4)
    vidautilrestante = models.DecimalField(max_digits=10, decimal_places=4)
    revaluable = models.CharField(max_length=1)
    depreciable = models.CharField(max_length=1)
    codmonedaext = models.ForeignKey('Moneda', db_column='codmonedaext', blank=True, null=True)
    costocompra = models.DecimalField(max_digits=19, decimal_places=4)
    costocompraorig = models.DecimalField(max_digits=19, decimal_places=4)
    valorreval = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalacum = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalacumini = models.DecimalField(max_digits=19, decimal_places=4)
    valoractual = models.DecimalField(max_digits=19, decimal_places=4)
    retasacion = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactual = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajuste = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacum = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacumini = models.DecimalField(max_digits=19, decimal_places=4)
    costocomprame = models.DecimalField(max_digits=19, decimal_places=4)
    costocomprameorig = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalme = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalacumme = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalacuminime = models.DecimalField(max_digits=19, decimal_places=4)
    valoractualme = models.DecimalField(max_digits=19, decimal_places=4)
    retasacionme = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactualme = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteme = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacumme = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacuminime = models.DecimalField(max_digits=19, decimal_places=4)
    cod_tp_compmvto = models.CharField(max_length=4, blank=True, null=True)
    nromvto = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fechaultmvto = models.DateTimeField(blank=True, null=True)
    monedaultmvto = models.CharField(max_length=2, blank=True, null=True)
    factcambultmvto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    importeultmvto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    motivoultmvto = models.CharField(max_length=60, blank=True, null=True)
    medidas = models.CharField(max_length=60, blank=True, null=True)
    cronologia = models.CharField(max_length=60, blank=True, null=True)
    tecnica = models.CharField(max_length=60, blank=True, null=True)
    autor = models.CharField(max_length=80, blank=True, null=True)
    origen = models.CharField(max_length=80, blank=True, null=True)
    firmado = models.CharField(max_length=40, blank=True, null=True)
    fechado = models.CharField(max_length=40, blank=True, null=True)
    titulo = models.CharField(max_length=250, blank=True, null=True)
    tema = models.CharField(max_length=250, blank=True, null=True)
    estadoconserv = models.CharField(max_length=250, blank=True, null=True)
    valoracion = models.DecimalField(max_digits=19, decimal_places=4)
    codmonedaval = models.ForeignKey('Moneda', db_column='codmonedaval', blank=True, null=True)
    fechavaloracion = models.DateTimeField(blank=True, null=True)
    fichaconfeccpor = models.CharField(max_length=250, blank=True, null=True)
    fechaficha = models.DateTimeField(blank=True, null=True)
    fechaalta_2 = models.DateTimeField(blank=True, null=True)
    fechainiproc_2 = models.DateTimeField(blank=True, null=True)
    vidautil_2 = models.DecimalField(max_digits=10, decimal_places=4)
    vidautilrestante_2 = models.DecimalField(max_digits=10, decimal_places=4)
    valorreval_2 = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalacum_2 = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalacumini_2 = models.DecimalField(max_digits=19, decimal_places=4)
    valoractual_2 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactual_2 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajuste_2 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacum_2 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacumini_2 = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalme_2 = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalacumme_2 = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalacuminime_2 = models.DecimalField(max_digits=19, decimal_places=4)
    valoractualme_2 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactualme_2 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteme_2 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacumme_2 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacuminime_2 = models.DecimalField(max_digits=19, decimal_places=4)
    fechaalta_3 = models.DateTimeField(blank=True, null=True)
    fechainiproc_3 = models.DateTimeField(blank=True, null=True)
    vidautilrestante_3 = models.DecimalField(max_digits=10, decimal_places=4)
    vidautil_3 = models.DecimalField(max_digits=10, decimal_places=4)
    valorreval_3 = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalacum_3 = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalacumini_3 = models.DecimalField(max_digits=19, decimal_places=4)
    valoractual_3 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactual_3 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajuste_3 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacum_3 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacumini_3 = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalme_3 = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalacumme_3 = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalacuminime_3 = models.DecimalField(max_digits=19, decimal_places=4)
    valoractualme_3 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactualme_3 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteme_3 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacumme_3 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacuminime_3 = models.DecimalField(max_digits=19, decimal_places=4)
    comentario = models.CharField(max_length=1800, blank=True, null=True)
    configuracion = models.CharField(max_length=1800, blank=True, null=True)
    valorrevalanho = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactualanho = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactualacum = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteanho = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteacum = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalanhome = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactualanhome = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactualacumme = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteanhome = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteacumme = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalanho_2 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactualanho_2 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactualacum_2 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteanho_2 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteacum_2 = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalanhome_2 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactualanhome_2 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactualacumme_2 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteanhome_2 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteacumme_2 = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalanho_3 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactualanho_3 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactualacum_3 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteanho_3 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteacum_3 = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalanhome_3 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactualanhome_3 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecactualacumme_3 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteanhome_3 = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteacumme_3 = models.DecimalField(max_digits=19, decimal_places=4)
    nropedido = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nrosolicitud = models.CharField(max_length=20, blank=True, null=True)
    nroordcomp = models.CharField(max_length=20, blank=True, null=True)
    nroop = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    importregnormal = models.CharField(max_length=1)
    importley60_90 = models.CharField(max_length=1)
    importnrodcto = models.CharField(max_length=20, blank=True, null=True)
    codestado = models.CharField(max_length=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'bienactivo'
        unique_together = (('cod_empresa', 'codactivo'),)


class BienactivoTmp(models.Model):
    codrubro = models.CharField(max_length=11, blank=True, null=True)
    descriprubro = models.CharField(max_length=40, blank=True, null=True)
    codactivo = models.CharField(max_length=14, blank=True, null=True)
    descripbien = models.CharField(max_length=60, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fechacompra = models.DateField(blank=True, null=True)
    fechainicio = models.DateField(blank=True, null=True)
    avur = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    costocompra = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorneto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'bienactivo_tmp'


class Bienactivodet(models.Model):
    cod_empresa = models.ForeignKey('Mvtobiencab', db_column='cod_empresa')
    codactivo = models.CharField(max_length=14)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    codactivodet = models.CharField(max_length=14)
    tpdef = models.CharField(max_length=1)
    cantidad = models.DecimalField(max_digits=7, decimal_places=0)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    nromvto = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fechamvto = models.DateTimeField(blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    importeme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    motivomvto = models.CharField(max_length=60, blank=True, null=True)
    cod_tp_compmvto = models.CharField(max_length=4, blank=True, null=True)
    incidencia = models.DecimalField(max_digits=15, decimal_places=10)

    class Meta:
        managed = False
        db_table = 'bienactivodet'
        unique_together = (('cod_empresa', 'codactivo', 'linea'),)


class Calcrevcab(models.Model):
    cod_empresa = models.ForeignKey('Tipocalc', db_column='cod_empresa')
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    codtipocalc = models.CharField(max_length=2)
    nrocalculo = models.DecimalField(max_digits=10, decimal_places=0)
    mescalculo = models.DecimalField(max_digits=2, decimal_places=0)
    fechacalculo = models.DateTimeField()
    autorizado = models.CharField(max_length=1)
    asentado = models.CharField(max_length=1)
    nroanterior = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    fechaanterior = models.DateTimeField(blank=True, null=True)
    oficial = models.CharField(max_length=1)
    tipocalc = models.CharField(max_length=1)
    tipo = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'calcrevcab'
        unique_together = (('cod_empresa', 'anho', 'codtipocalc', 'nrocalculo'),)


class Calcrevcabhist(models.Model):
    cod_empresa = models.ForeignKey('Tipocalc', db_column='cod_empresa')
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    codtipocalc = models.CharField(max_length=2)
    nrocalculo = models.DecimalField(max_digits=10, decimal_places=0)
    mescalculo = models.DecimalField(max_digits=2, decimal_places=0)
    fechacalculo = models.DateTimeField()
    autorizado = models.CharField(max_length=1)
    asentado = models.CharField(max_length=1)
    nroanterior = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    fechaanterior = models.DateTimeField(blank=True, null=True)
    oficial = models.CharField(max_length=1)
    tipocalc = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'calcrevcabhist'
        unique_together = (('cod_empresa', 'anho', 'codtipocalc', 'nrocalculo'),)


class Calcrevdet(models.Model):
    cod_empresa = models.ForeignKey('Subrubrosaf', db_column='cod_empresa')
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    codtipocalc = models.CharField(max_length=2)
    nrocalculo = models.DecimalField(max_digits=10, decimal_places=0)
    nroitem = models.DecimalField(max_digits=5, decimal_places=0)
    codactivo = models.CharField(max_length=14)
    fecharevalant = models.DateTimeField(blank=True, null=True)
    metodocalc = models.DecimalField(max_digits=1, decimal_places=0)
    coefrevact = models.DecimalField(max_digits=10, decimal_places=5)
    coefrevant = models.DecimalField(max_digits=10, decimal_places=5)
    vidautil = models.DecimalField(max_digits=10, decimal_places=4)
    vidautilant = models.DecimalField(max_digits=10, decimal_places=4)
    valorrevalactual = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalant = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalacum = models.DecimalField(max_digits=19, decimal_places=4)
    valoractual = models.DecimalField(max_digits=19, decimal_places=4)
    valorant = models.DecimalField(max_digits=19, decimal_places=4)
    cuotaactual = models.DecimalField(max_digits=19, decimal_places=4)
    cuotaant = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajuste = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteant = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacum = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalactualme = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalantme = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalacumme = models.DecimalField(max_digits=19, decimal_places=4)
    valoractualme = models.DecimalField(max_digits=19, decimal_places=4)
    valorantme = models.DecimalField(max_digits=19, decimal_places=4)
    cuotaactualme = models.DecimalField(max_digits=19, decimal_places=4)
    cuotaantme = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteme = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteantme = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacumme = models.DecimalField(max_digits=19, decimal_places=4)
    planctaactivo = models.CharField(max_length=11, blank=True, null=True)
    planauxactivo = models.CharField(max_length=11, blank=True, null=True)
    ctadeprejer = models.CharField(max_length=11, blank=True, null=True)
    auxdeprejer = models.CharField(max_length=11, blank=True, null=True)
    ctadepracum = models.CharField(max_length=11, blank=True, null=True)
    auxdepracum = models.CharField(max_length=11, blank=True, null=True)
    planctarev = models.CharField(max_length=11, blank=True, null=True)
    planauxrev = models.CharField(max_length=11, blank=True, null=True)
    ctadeprnoded = models.CharField(max_length=11, blank=True, null=True)
    auxdeprnoded = models.CharField(max_length=11, blank=True, null=True)
    valorrevalejer = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalejerme = models.DecimalField(max_digits=19, decimal_places=4)
    codrubro = models.CharField(max_length=11, blank=True, null=True)
    codsubrubro = models.CharField(max_length=11, blank=True, null=True)
    codubicacion = models.CharField(max_length=14, blank=True, null=True)
    costocompra = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costocomprame = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fechacompra = models.DateTimeField(blank=True, null=True)
    fechaalta = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'calcrevdet'
        unique_together = (('cod_empresa', 'anho', 'codtipocalc', 'nrocalculo', 'nroitem'),)


class Calcrevdethist(models.Model):
    cod_empresa = models.ForeignKey(Bienactivo, db_column='cod_empresa')
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    codtipocalc = models.CharField(max_length=2)
    nrocalculo = models.DecimalField(max_digits=10, decimal_places=0)
    nroitem = models.DecimalField(max_digits=5, decimal_places=0)
    codactivo = models.CharField(max_length=14)
    fecharevalant = models.DateTimeField(blank=True, null=True)
    metodocalc = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    coefrevact = models.DecimalField(max_digits=10, decimal_places=5)
    coefrevant = models.DecimalField(max_digits=10, decimal_places=5)
    vidautil = models.DecimalField(max_digits=10, decimal_places=4)
    vidautilant = models.DecimalField(max_digits=10, decimal_places=4)
    valorrevalactual = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalant = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalejer = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalacum = models.DecimalField(max_digits=19, decimal_places=4)
    valoractual = models.DecimalField(max_digits=19, decimal_places=4)
    valorant = models.DecimalField(max_digits=19, decimal_places=4)
    cuotaactual = models.DecimalField(max_digits=19, decimal_places=4)
    cuotaant = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajuste = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteant = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacum = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacumbajas = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalactualme = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalantme = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalejerme = models.DecimalField(max_digits=19, decimal_places=4)
    valorrevalacumme = models.DecimalField(max_digits=19, decimal_places=4)
    valoractualme = models.DecimalField(max_digits=19, decimal_places=4)
    valorantme = models.DecimalField(max_digits=19, decimal_places=4)
    cuotaactualme = models.DecimalField(max_digits=19, decimal_places=4)
    cuotaantme = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteme = models.DecimalField(max_digits=19, decimal_places=4)
    deprecajusteantme = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacumme = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacumbajasme = models.DecimalField(max_digits=19, decimal_places=4)
    planctaactivo = models.CharField(max_length=11, blank=True, null=True)
    planauxactivo = models.CharField(max_length=11, blank=True, null=True)
    ctadeprejer = models.CharField(max_length=11, blank=True, null=True)
    auxdeprejer = models.CharField(max_length=11, blank=True, null=True)
    ctadepracum = models.CharField(max_length=11, blank=True, null=True)
    auxdepracum = models.CharField(max_length=11, blank=True, null=True)
    planctarev = models.CharField(max_length=11, blank=True, null=True)
    planauxrev = models.CharField(max_length=11, blank=True, null=True)
    ctadeprnoded = models.CharField(max_length=11, blank=True, null=True)
    auxdeprnoded = models.CharField(max_length=11, blank=True, null=True)
    codrubro = models.CharField(max_length=11, blank=True, null=True)
    codsubrubro = models.CharField(max_length=11, blank=True, null=True)
    codubicacion = models.CharField(max_length=14, blank=True, null=True)
    costocompra = models.DecimalField(max_digits=19, decimal_places=4)
    costocomprame = models.DecimalField(max_digits=19, decimal_places=4)
    fechacompra = models.DateTimeField(blank=True, null=True)
    fechaalta = models.DateTimeField(blank=True, null=True)
    deprecacumant = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacumantsinrev = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacumantrev = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacumantme = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacumantsinrevme = models.DecimalField(max_digits=19, decimal_places=4)
    deprecacumantrevme = models.DecimalField(max_digits=19, decimal_places=4)

    class Meta:
        managed = False
        db_table = 'calcrevdethist'
        unique_together = (('cod_empresa', 'anho', 'codtipocalc', 'nrocalculo', 'nroitem'),)


class Califica(models.Model):
    cod_calificacion = models.CharField(primary_key=True, max_length=8)
    des_calificacion = models.CharField(max_length=60)
    allowventas = models.CharField(max_length=1, blank=True, null=True)
    allowcobranzas = models.CharField(max_length=1, blank=True, null=True)
    atrasodesde = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    atrasohasta = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    moroso = models.CharField(max_length=1, blank=True, null=True)
    autoproceso = models.CharField(max_length=1, blank=True, null=True)
    cod_cancelado = models.ForeignKey('self', db_column='cod_cancelado', blank=True, null=True)
    telecobranza = models.CharField(max_length=1, blank=True, null=True)
    grupo = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'califica'


class CalificaSync(models.Model):
    cod_calificacion = models.CharField(max_length=2)
    des_calificacion = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'califica_sync'


class Camion(models.Model):
    cod_empresa = models.ForeignKey('Transportista', db_column='cod_empresa')
    cod_camion = models.CharField(max_length=8)
    codmarca = models.CharField(max_length=4)
    cod_transportista = models.CharField(max_length=8)
    nro_chofer = models.DecimalField(max_digits=9, decimal_places=0)
    chapatracto = models.CharField(max_length=15, blank=True, null=True)
    chapacarreta = models.CharField(max_length=15, blank=True, null=True)
    volumen = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    clasificacion = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'camion'
        unique_together = (('cod_empresa', 'cod_camion'),)


class CamionCab(models.Model):
    nrocamion = models.DecimalField(max_digits=10, decimal_places=0)
    nro_chofer = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cod_empresa = models.ForeignKey('Vtacab', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    chapatracto = models.CharField(max_length=15, blank=True, null=True)
    chapacarreta = models.CharField(max_length=15, blank=True, null=True)
    volumen = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'camion_cab'
        unique_together = (('nrocamion', 'cod_empresa', 'cod_tp_comp', 'comp_numero'),)


class CamionDet(models.Model):
    nrocamion = models.ForeignKey(CamionCab, db_column='nrocamion')
    cod_empresa = models.ForeignKey('Vtadet', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=2, decimal_places=0)
    cantidad = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True)
    largo = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    ancho = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    alto = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    preciounitario = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    pesoneto = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    pesobruto = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    costo = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'camion_det'
        unique_together = (('nrocamion', 'cod_empresa', 'cod_tp_comp', 'comp_numero', 'linea'),)


class Caractarticulo(models.Model):
    cod_empresa = models.ForeignKey(Articulo, db_column='cod_empresa')
    cod_articulo = models.CharField(max_length=14)
    codcaract = models.ForeignKey('Caracteristicas', db_column='codcaract')
    observ = models.CharField(max_length=60, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'caractarticulo'
        unique_together = (('cod_empresa', 'cod_articulo', 'codcaract'),)


class Caracteristicas(models.Model):
    codcaract = models.CharField(primary_key=True, max_length=8)
    descrip = models.CharField(max_length=60, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'caracteristicas'


class Cargo(models.Model):
    codlugartrab = models.ForeignKey('Secclabor', db_column='codlugartrab')
    codseccion = models.CharField(max_length=3)
    codcargo = models.CharField(max_length=5)
    descrip = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cargo'
        unique_together = (('codlugartrab', 'codseccion', 'codcargo'),)


class Carpetas(models.Model):
    cod_empresa = models.ForeignKey('Empresa', db_column='cod_empresa')
    cod_carpeta = models.CharField(max_length=8)
    des_carpeta = models.CharField(max_length=60, blank=True, null=True)
    cod_vendedor = models.ForeignKey('Vendedor', db_column='cod_vendedor', blank=True, null=True)
    tipo_ruta = models.CharField(max_length=1)
    cod_camion = models.CharField(max_length=8, blank=True, null=True)
    cod_cobrador = models.ForeignKey('Cobrador', db_column='cod_cobrador', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'carpetas'
        unique_together = (('cod_empresa', 'cod_carpeta'),)


class Cartacredcab(models.Model):
    cod_empresa = models.ForeignKey('Plancta', db_column='cod_empresa')
    nrocarta = models.CharField(max_length=20)
    asentado = models.CharField(max_length=1)
    codbanco = models.ForeignKey(Bancos, db_column='codbanco')
    planctabco = models.CharField(max_length=11)
    planauxbco = models.CharField(max_length=11, blank=True, null=True)
    codprov = models.CharField(max_length=4)
    fechaemision = models.DateTimeField()
    monedagiro = models.ForeignKey('Moneda', db_column='monedagiro')
    factcambiogiro = models.DecimalField(max_digits=19, decimal_places=4)
    planctagiro = models.CharField(max_length=11)
    planauxgiro = models.CharField(max_length=11, blank=True, null=True)
    importegiro = models.DecimalField(max_digits=19, decimal_places=4)
    importegirome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda')
    factcambio = models.DecimalField(max_digits=19, decimal_places=4)
    totalimporte = models.DecimalField(max_digits=19, decimal_places=4)
    totalimporteme = models.DecimalField(max_digits=19, decimal_places=4)
    fechaexpiracion = models.DateTimeField(blank=True, null=True)
    lugarexpiracion = models.CharField(max_length=40, blank=True, null=True)
    formacarta = models.CharField(max_length=80, blank=True, null=True)
    beneficiario = models.CharField(max_length=200, blank=True, null=True)
    vctogiro = models.CharField(max_length=80, blank=True, null=True)
    giradoa = models.CharField(max_length=200, blank=True, null=True)
    disponiblecon = models.CharField(max_length=200, blank=True, null=True)
    envioparcial = models.CharField(max_length=80, blank=True, null=True)
    abordaje = models.CharField(max_length=200, blank=True, null=True)
    destino = models.CharField(max_length=200, blank=True, null=True)
    cargos = models.CharField(max_length=200, blank=True, null=True)
    instrconfirm = models.CharField(max_length=80, blank=True, null=True)
    bcoreembolso = models.CharField(max_length=200, blank=True, null=True)
    instrucpago = models.CharField(max_length=500, blank=True, null=True)
    acuserecibo = models.CharField(max_length=80, blank=True, null=True)
    descripartic = models.CharField(max_length=200)
    observ = models.CharField(max_length=500, blank=True, null=True)
    periodogiro = models.CharField(max_length=8, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cartacredcab'
        unique_together = (('cod_empresa', 'nrocarta'),)


class Cartacreddet(models.Model):
    cod_empresa = models.ForeignKey('Plancta', db_column='cod_empresa')
    nrocarta = models.CharField(max_length=20)
    nrolinea = models.DecimalField(max_digits=5, decimal_places=0)
    codplancta = models.CharField(max_length=11)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    importeme = models.DecimalField(max_digits=19, decimal_places=4)
    concepto = models.CharField(max_length=100, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cartacreddet'
        unique_together = (('cod_empresa', 'nrocarta', 'nrolinea'),)


class Carteraclientes(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cartera = models.CharField(max_length=3)
    des_cartera = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'carteraclientes'
        unique_together = (('cod_empresa', 'cod_cartera'),)


class Catauxi(models.Model):
    cod_empresa = models.ForeignKey('Periodo', db_column='cod_empresa')
    periodo = models.CharField(max_length=8)
    codplanaux = models.CharField(max_length=11)
    tpcta = models.CharField(max_length=2)
    codplanauxpad = models.CharField(max_length=11, blank=True, null=True)
    imputable = models.CharField(max_length=1)
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda')
    nivel = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    nombre = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'catauxi'
        unique_together = (('cod_empresa', 'periodo', 'codplanaux'),)


class Catgral(models.Model):
    cod_empresa = models.ForeignKey('Periodo', db_column='cod_empresa')
    periodo = models.CharField(max_length=8)
    codplancta = models.CharField(max_length=11)
    imputable = models.CharField(max_length=1)
    codplanctapad = models.CharField(max_length=11, blank=True, null=True)
    auxiliar = models.CharField(max_length=1)
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda')
    presup = models.CharField(max_length=1)
    nivel = models.DecimalField(max_digits=1, decimal_places=0)
    nombre = models.CharField(max_length=40)
    tiposaldo = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'catgral'
        unique_together = (('cod_empresa', 'periodo', 'codplancta'),)


class Catregistro(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_categoria = models.CharField(max_length=2)
    descripcion = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'catregistro'
        unique_together = (('cod_empresa', 'cod_categoria'),)


class Cbtestprecaud(models.Model):
    cod_empresa = models.ForeignKey('Tporecaudacion', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda')
    cod_tp_pago = models.CharField(max_length=2)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    activo = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cbtestprecaud'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'codmoneda', 'cod_tp_pago'),)


class CfgStrTablaAuditar(models.Model):
    audit_fechahora = models.DateTimeField()
    audit_codusuario = models.CharField(max_length=16)
    audit_tipooper = models.CharField(max_length=1)
    audit_tipovalor = models.CharField(max_length=1)
    audit_tipoenlacedb = models.CharField(max_length=64, blank=True, null=True)
    audit_nodoenlace = models.CharField(max_length=64, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cfg_str_tabla_auditar'


class Checklistclte(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    cod_check = models.CharField(max_length=8)
    presento = models.CharField(max_length=1, blank=True, null=True)
    enfecha = models.DateField(blank=True, null=True)
    fechavto = models.DateField(blank=True, null=True)
    fechanextvto = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'checklistclte'
        unique_together = (('cod_empresa', 'cod_cliente', 'cod_check'),)


class Checklistdoc(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_check = models.CharField(max_length=8)
    des_check = models.CharField(max_length=200)
    personeria = models.CharField(max_length=1, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'checklistdoc'
        unique_together = (('cod_empresa', 'cod_check'),)


class Chequeras(models.Model):
    cod_empresa = models.CharField(max_length=2)
    codplancta = models.CharField(max_length=11)
    codplanaux = models.CharField(max_length=11)
    codbanco = models.ForeignKey('Fmtcheques', db_column='codbanco')
    codmoneda = models.CharField(max_length=2)
    nroformato = models.DecimalField(max_digits=3, decimal_places=0)
    chequeranro = models.DecimalField(max_digits=2, decimal_places=0)
    estacion = models.CharField(max_length=4)
    periodo = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'chequeras'
        unique_together = (('cod_empresa', 'codplancta', 'codplanaux', 'chequeranro'),)


class Cheques(models.Model):
    codbanco = models.ForeignKey(Bancos, db_column='codbanco')
    nrocheque = models.CharField(max_length=12)
    lineacheque = models.DecimalField(max_digits=3, decimal_places=0)
    codbancoant = models.CharField(max_length=3, blank=True, null=True)
    codchequeant = models.CharField(max_length=12, blank=True, null=True)
    lineachequeant = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda')
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    estado = models.CharField(max_length=1)
    feccheque = models.DateTimeField()
    fechavto = models.DateTimeField()
    fechacobro = models.DateTimeField(blank=True, null=True)
    comentario = models.CharField(max_length=60, blank=True, null=True)
    cod_tp_pago = models.CharField(max_length=2, blank=True, null=True)
    cod_empresa = models.ForeignKey('Clientes', db_column='cod_empresa', blank=True, null=True)
    cod_cliente = models.CharField(max_length=8)
    aldia = models.CharField(max_length=1, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    emisor = models.CharField(max_length=80, blank=True, null=True)
    cod_sucursal_ubic = models.CharField(max_length=2, blank=True, null=True)
    cod_emisor = models.CharField(max_length=8, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cheques'
        unique_together = (('codbanco', 'nrocheque', 'lineacheque'),)


class ChequesAnul(models.Model):
    codbanco = models.ForeignKey(Bancos, db_column='codbanco')
    nrocheque = models.CharField(max_length=12)
    lineacheque = models.DecimalField(max_digits=3, decimal_places=0)
    codbancoant = models.CharField(max_length=3, blank=True, null=True)
    codchequeant = models.CharField(max_length=12, blank=True, null=True)
    lineachequeant = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda')
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    estado = models.CharField(max_length=1)
    feccheque = models.DateTimeField()
    fechavto = models.DateTimeField()
    fechacobro = models.DateTimeField(blank=True, null=True)
    comentario = models.CharField(max_length=60, blank=True, null=True)
    cod_tp_pago = models.CharField(max_length=2, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    aldia = models.CharField(max_length=1, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cheques_anul'
        unique_together = (('codbanco', 'nrocheque', 'lineacheque'),)


class ChequesUnif(models.Model):
    codbanco = models.CharField(max_length=3)
    nrocheque = models.CharField(max_length=12)
    lineacheque = models.DecimalField(max_digits=3, decimal_places=0)
    codbancoant = models.CharField(max_length=3, blank=True, null=True)
    codchequeant = models.CharField(max_length=12, blank=True, null=True)
    lineachequeant = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    codmoneda = models.CharField(max_length=2)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    estado = models.CharField(max_length=1)
    feccheque = models.DateTimeField()
    fechavto = models.DateTimeField()
    fechacobro = models.DateTimeField(blank=True, null=True)
    comentario = models.CharField(max_length=60, blank=True, null=True)
    cod_tp_pago = models.CharField(max_length=2, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    aldia = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cheques_unif'
        unique_together = (('codbanco', 'nrocheque', 'lineacheque'),)


class Chofer(models.Model):
    cod_empresa = models.CharField(max_length=2)
    nro_chofer = models.DecimalField(max_digits=9, decimal_places=0)
    nombre = models.CharField(max_length=30, blank=True, null=True)
    apellido = models.CharField(max_length=40, blank=True, null=True)
    direccionparticular = models.CharField(max_length=80, blank=True, null=True)
    direccionlaboral = models.CharField(max_length=80, blank=True, null=True)
    telefonoparticular = models.CharField(max_length=30, blank=True, null=True)
    telefonolaboral = models.CharField(max_length=30, blank=True, null=True)
    aniosexperiencia = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    cod_gruposanguineo = models.CharField(max_length=4, blank=True, null=True)
    nroregistro = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    cod_categoria = models.CharField(max_length=2, blank=True, null=True)
    ciudad = models.CharField(max_length=25, blank=True, null=True)
    cedula = models.CharField(max_length=15, blank=True, null=True)
    porc_comision = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porc_comision1 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    ctrl_facturas = models.CharField(max_length=1, blank=True, null=True)
    tipo = models.CharField(max_length=2, blank=True, null=True)
    clasificacion = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'chofer'
        unique_together = (('cod_empresa', 'nro_chofer'),)


class Cierreadm(models.Model):
    usuario = models.CharField(max_length=25, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cierreadm'


class Ciudad(models.Model):
    codpais = models.ForeignKey('Dptopais', db_column='codpais')
    coddptopais = models.CharField(max_length=3)
    codciudad = models.CharField(max_length=3)
    descrip = models.CharField(max_length=60)

    class Meta:
        managed = False
        db_table = 'ciudad'
        unique_together = (('codpais', 'coddptopais', 'codciudad'),)


class Clasifcobrador(models.Model):
    codclasifcobrador = models.CharField(primary_key=True, max_length=8)
    descrip = models.CharField(max_length=60, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clasifcobrador'


class Clave(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    clave = models.CharField(max_length=60, blank=True, null=True)
    nroop = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    archivo = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clave'


class Clientes(models.Model):
    cod_empresa = models.ForeignKey('Plancta', db_column='cod_empresa')
    cod_cliente = models.CharField(max_length=8)
    cliente_padre = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    cod_con_vta = models.ForeignKey('Terminos', db_column='cod_con_vta', blank=True, null=True)
    cod_zona = models.ForeignKey('Zonavta', db_column='cod_zona', blank=True, null=True)
    cod_tp_cliente = models.ForeignKey('Tpoclte', db_column='cod_tp_cliente', blank=True, null=True)
    cod_calificacion = models.ForeignKey(Califica, db_column='cod_calificacion', blank=True, null=True)
    cod_localidad = models.CharField(max_length=3)
    list_precio = models.CharField(max_length=1)
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda', blank=True, null=True)
    limite_cr_gs = models.DecimalField(max_digits=19, decimal_places=4)
    limite_cr_me = models.DecimalField(max_digits=19, decimal_places=4)
    descuento = models.DecimalField(max_digits=5, decimal_places=2)
    cedula = models.CharField(unique=True, max_length=15)
    cip = models.CharField(max_length=10, blank=True, null=True)
    fecha_nac = models.DateTimeField(blank=True, null=True)
    cat_iva = models.CharField(max_length=1)
    ult_compra = models.DateTimeField(blank=True, null=True)
    ult_pago = models.DateTimeField(blank=True, null=True)
    ult_actualizacion = models.DateTimeField(blank=True, null=True)
    estado = models.CharField(max_length=1)
    cod_usuario = models.CharField(max_length=16)
    razon_social = models.CharField(max_length=100)
    ruc = models.CharField(max_length=14)
    contacto = models.CharField(max_length=35, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    direccion_part = models.CharField(max_length=80, blank=True, null=True)
    email = models.CharField(max_length=30, blank=True, null=True)
    telefono1 = models.CharField(max_length=25, blank=True, null=True)
    telefono2 = models.CharField(max_length=25, blank=True, null=True)
    fax = models.CharField(max_length=25, blank=True, null=True)
    nro_tarjeta = models.CharField(max_length=30, blank=True, null=True)
    venc_tarjeta = models.DateTimeField(blank=True, null=True)
    referencia_1 = models.CharField(max_length=40, blank=True, null=True)
    referencia_2 = models.CharField(max_length=40, blank=True, null=True)
    referencia_3 = models.CharField(max_length=40, blank=True, null=True)
    observ = models.CharField(max_length=1000, blank=True, null=True)
    cod_tarjeta = models.ForeignKey('Tarjetas', db_column='cod_tarjeta', blank=True, null=True)
    celular = models.CharField(max_length=25, blank=True, null=True)
    radiomensaje = models.CharField(max_length=25, blank=True, null=True)
    codradiomens = models.CharField(max_length=25, blank=True, null=True)
    nrocliente = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True)
    saldoporcliente = models.CharField(max_length=1, blank=True, null=True)
    tipodcto = models.CharField(max_length=1, blank=True, null=True)
    transf_vtdir = models.CharField(max_length=1, blank=True, null=True)
    codplancta_me = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_me = models.CharField(max_length=11, blank=True, null=True)
    diasmora = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    moroso = models.CharField(max_length=1, blank=True, null=True)
    cod_cobrador = models.ForeignKey('Cobrador', db_column='cod_cobrador', blank=True, null=True)
    nroservicio = models.CharField(max_length=20, blank=True, null=True)
    cod_cliente_cap = models.CharField(max_length=8, blank=True, null=True)
    bloquearlista = models.CharField(max_length=1, blank=True, null=True)
    cantfactsaldo = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    responsable = models.CharField(max_length=100, blank=True, null=True)
    plantilla = models.CharField(max_length=1, blank=True, null=True)
    cod_original = models.CharField(max_length=30, blank=True, null=True)
    codpais = models.CharField(max_length=3, blank=True, null=True)
    coddptopais = models.CharField(max_length=3, blank=True, null=True)
    codciudad = models.CharField(max_length=3, blank=True, null=True)
    codbarrio = models.CharField(max_length=3, blank=True, null=True)
    casa = models.CharField(max_length=2, blank=True, null=True)
    estadocivil = models.CharField(max_length=2, blank=True, null=True)
    codcodeudorconyug = models.CharField(max_length=8, blank=True, null=True)
    codcodeudor = models.CharField(max_length=8, blank=True, null=True)
    codconyugue = models.CharField(max_length=8, blank=True, null=True)
    ctactecatastral = models.CharField(max_length=20, blank=True, null=True)
    patente = models.CharField(max_length=12, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    cod_asociacion = models.CharField(max_length=8, blank=True, null=True)
    fechaalta = models.DateTimeField(blank=True, null=True)
    fec_ult_visita = models.DateField(blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    dna = models.CharField(max_length=20, blank=True, null=True)
    fechabaja = models.DateTimeField(blank=True, null=True)
    vctoregdist = models.DateTimeField(blank=True, null=True)
    bloqmoneda = models.CharField(max_length=1, blank=True, null=True)
    cod_cartera = models.CharField(max_length=3, blank=True, null=True)
    cod_ramo = models.CharField(max_length=8, blank=True, null=True)
    porc_inc_precios = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    red_social = models.CharField(max_length=200, blank=True, null=True)
    messenger = models.CharField(max_length=100, blank=True, null=True)
    skype = models.CharField(max_length=100, blank=True, null=True)
    cedulatmp = models.CharField(max_length=16, blank=True, null=True)
    monto_inc_precios = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    dias_cheque = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    foto1 = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clientes'
        unique_together = (('cod_empresa', 'cod_cliente'),)


class Clientes09062011(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    cliente_padre = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    cod_con_vta = models.CharField(max_length=2, blank=True, null=True)
    cod_zona = models.CharField(max_length=3, blank=True, null=True)
    cod_tp_cliente = models.CharField(max_length=2, blank=True, null=True)
    cod_calificacion = models.CharField(max_length=8, blank=True, null=True)
    cod_localidad = models.CharField(max_length=3)
    list_precio = models.CharField(max_length=1)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    limite_cr_gs = models.DecimalField(max_digits=19, decimal_places=4)
    limite_cr_me = models.DecimalField(max_digits=19, decimal_places=4)
    descuento = models.DecimalField(max_digits=5, decimal_places=2)
    cedula = models.CharField(max_length=15, blank=True, null=True)
    cip = models.CharField(max_length=10, blank=True, null=True)
    fecha_nac = models.DateTimeField(blank=True, null=True)
    cat_iva = models.CharField(max_length=1)
    ult_compra = models.DateTimeField(blank=True, null=True)
    ult_pago = models.DateTimeField(blank=True, null=True)
    ult_actualizacion = models.DateTimeField(blank=True, null=True)
    estado = models.CharField(max_length=1)
    cod_usuario = models.CharField(max_length=16)
    razon_social = models.CharField(max_length=100)
    ruc = models.CharField(max_length=14)
    contacto = models.CharField(max_length=35, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    direccion_part = models.CharField(max_length=80, blank=True, null=True)
    email = models.CharField(max_length=30, blank=True, null=True)
    telefono1 = models.CharField(max_length=25, blank=True, null=True)
    telefono2 = models.CharField(max_length=25, blank=True, null=True)
    fax = models.CharField(max_length=25, blank=True, null=True)
    nro_tarjeta = models.CharField(max_length=30, blank=True, null=True)
    venc_tarjeta = models.DateTimeField(blank=True, null=True)
    referencia_1 = models.CharField(max_length=40, blank=True, null=True)
    referencia_2 = models.CharField(max_length=40, blank=True, null=True)
    referencia_3 = models.CharField(max_length=40, blank=True, null=True)
    observ = models.CharField(max_length=1000, blank=True, null=True)
    cod_tarjeta = models.CharField(max_length=4, blank=True, null=True)
    celular = models.CharField(max_length=25, blank=True, null=True)
    radiomensaje = models.CharField(max_length=25, blank=True, null=True)
    codradiomens = models.CharField(max_length=25, blank=True, null=True)
    nrocliente = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True)
    saldoporcliente = models.CharField(max_length=1, blank=True, null=True)
    tipodcto = models.CharField(max_length=1, blank=True, null=True)
    transf_vtdir = models.CharField(max_length=1, blank=True, null=True)
    codplancta_me = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_me = models.CharField(max_length=11, blank=True, null=True)
    diasmora = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    moroso = models.CharField(max_length=1, blank=True, null=True)
    cod_cobrador = models.CharField(max_length=3, blank=True, null=True)
    nroservicio = models.CharField(max_length=20, blank=True, null=True)
    cod_cliente_cap = models.CharField(max_length=8, blank=True, null=True)
    bloquearlista = models.CharField(max_length=1, blank=True, null=True)
    cantfactsaldo = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    responsable = models.CharField(max_length=100, blank=True, null=True)
    plantilla = models.CharField(max_length=1, blank=True, null=True)
    cod_original = models.CharField(max_length=30, blank=True, null=True)
    codpais = models.CharField(max_length=3, blank=True, null=True)
    coddptopais = models.CharField(max_length=3, blank=True, null=True)
    codciudad = models.CharField(max_length=3, blank=True, null=True)
    codbarrio = models.CharField(max_length=3, blank=True, null=True)
    casa = models.CharField(max_length=2, blank=True, null=True)
    estadocivil = models.CharField(max_length=2, blank=True, null=True)
    codcodeudorconyug = models.CharField(max_length=8, blank=True, null=True)
    codcodeudor = models.CharField(max_length=8, blank=True, null=True)
    codconyugue = models.CharField(max_length=8, blank=True, null=True)
    ctactecatastral = models.CharField(max_length=20, blank=True, null=True)
    patente = models.CharField(max_length=12, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    cod_asociacion = models.CharField(max_length=8, blank=True, null=True)
    fechaalta = models.DateTimeField(blank=True, null=True)
    fec_ult_visita = models.DateField(blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    dna = models.CharField(max_length=20, blank=True, null=True)
    fechabaja = models.DateTimeField(blank=True, null=True)
    vctoregdist = models.DateTimeField(blank=True, null=True)
    bloqmoneda = models.CharField(max_length=1, blank=True, null=True)
    cod_cartera = models.CharField(max_length=3, blank=True, null=True)
    cod_ramo = models.CharField(max_length=3, blank=True, null=True)
    porc_inc_precios = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    red_social = models.CharField(max_length=200, blank=True, null=True)
    messenger = models.CharField(max_length=100, blank=True, null=True)
    skype = models.CharField(max_length=100, blank=True, null=True)
    cedulatmp = models.CharField(max_length=16, blank=True, null=True)
    monto_inc_precios = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clientes_09062011'
        unique_together = (('cod_empresa', 'cod_cliente'),)


class ClientesContactos(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    nrocontacto = models.DecimalField(max_digits=3, decimal_places=0)
    sucursal = models.CharField(max_length=40, blank=True, null=True)
    cargo = models.CharField(max_length=40, blank=True, null=True)
    dependencia = models.CharField(max_length=40, blank=True, null=True)
    contacto = models.CharField(max_length=60, blank=True, null=True)
    telefonos = models.CharField(max_length=30, blank=True, null=True)
    email = models.CharField(max_length=40, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clientes_contactos'
        unique_together = (('cod_empresa', 'cod_cliente', 'nrocontacto'),)


class ClientesSync(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    cliente_padre = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    cod_con_vta = models.CharField(max_length=2, blank=True, null=True)
    cod_zona = models.CharField(max_length=3, blank=True, null=True)
    cod_tp_cliente = models.CharField(max_length=2, blank=True, null=True)
    cod_calificacion = models.CharField(max_length=2, blank=True, null=True)
    cod_localidad = models.CharField(max_length=3)
    list_precio = models.CharField(max_length=1)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    limite_cr_gs = models.DecimalField(max_digits=19, decimal_places=4)
    limite_cr_me = models.DecimalField(max_digits=19, decimal_places=4)
    descuento = models.DecimalField(max_digits=5, decimal_places=2)
    cedula = models.CharField(max_length=9, blank=True, null=True)
    cip = models.CharField(max_length=10, blank=True, null=True)
    fecha_nac = models.DateTimeField(blank=True, null=True)
    cat_iva = models.CharField(max_length=1)
    ult_compra = models.DateTimeField(blank=True, null=True)
    ult_pago = models.DateTimeField(blank=True, null=True)
    ult_actualizacion = models.DateTimeField(blank=True, null=True)
    estado = models.CharField(max_length=1)
    cod_usuario = models.CharField(max_length=16)
    razon_social = models.CharField(max_length=40)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    contacto = models.CharField(max_length=35, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    direccion_part = models.CharField(max_length=80, blank=True, null=True)
    email = models.CharField(max_length=30, blank=True, null=True)
    telefono1 = models.CharField(max_length=25, blank=True, null=True)
    telefono2 = models.CharField(max_length=25, blank=True, null=True)
    fax = models.CharField(max_length=25, blank=True, null=True)
    nro_tarjeta = models.CharField(max_length=30, blank=True, null=True)
    venc_tarjeta = models.DateTimeField(blank=True, null=True)
    referencia_1 = models.CharField(max_length=40, blank=True, null=True)
    referencia_2 = models.CharField(max_length=40, blank=True, null=True)
    referencia_3 = models.CharField(max_length=40, blank=True, null=True)
    observ = models.CharField(max_length=1000, blank=True, null=True)
    cod_tarjeta = models.CharField(max_length=4, blank=True, null=True)
    celular = models.CharField(max_length=25, blank=True, null=True)
    radiomensaje = models.CharField(max_length=25, blank=True, null=True)
    codradiomens = models.CharField(max_length=25, blank=True, null=True)
    nrocliente = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True)
    saldoporcliente = models.CharField(max_length=1, blank=True, null=True)
    tipodcto = models.CharField(max_length=1, blank=True, null=True)
    transf_vtdir = models.CharField(max_length=1, blank=True, null=True)
    codplancta_me = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_me = models.CharField(max_length=11, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clientes_sync'


class ClientesUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    cliente_padre = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    cod_con_vta = models.CharField(max_length=2, blank=True, null=True)
    cod_zona = models.CharField(max_length=3, blank=True, null=True)
    cod_tp_cliente = models.CharField(max_length=2, blank=True, null=True)
    cod_calificacion = models.CharField(max_length=8, blank=True, null=True)
    cod_localidad = models.CharField(max_length=3)
    list_precio = models.CharField(max_length=1)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    limite_cr_gs = models.DecimalField(max_digits=19, decimal_places=4)
    limite_cr_me = models.DecimalField(max_digits=19, decimal_places=4)
    descuento = models.DecimalField(max_digits=5, decimal_places=2)
    cedula = models.CharField(max_length=15, blank=True, null=True)
    cip = models.CharField(max_length=10, blank=True, null=True)
    fecha_nac = models.DateTimeField(blank=True, null=True)
    cat_iva = models.CharField(max_length=1)
    ult_compra = models.DateTimeField(blank=True, null=True)
    ult_pago = models.DateTimeField(blank=True, null=True)
    ult_actualizacion = models.DateTimeField(blank=True, null=True)
    estado = models.CharField(max_length=1)
    cod_usuario = models.CharField(max_length=16)
    razon_social = models.CharField(max_length=40)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    contacto = models.CharField(max_length=35, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    direccion_part = models.CharField(max_length=80, blank=True, null=True)
    email = models.CharField(max_length=30, blank=True, null=True)
    telefono1 = models.CharField(max_length=25, blank=True, null=True)
    telefono2 = models.CharField(max_length=25, blank=True, null=True)
    fax = models.CharField(max_length=25, blank=True, null=True)
    nro_tarjeta = models.CharField(max_length=30, blank=True, null=True)
    venc_tarjeta = models.DateTimeField(blank=True, null=True)
    referencia_1 = models.CharField(max_length=40, blank=True, null=True)
    referencia_2 = models.CharField(max_length=40, blank=True, null=True)
    referencia_3 = models.CharField(max_length=40, blank=True, null=True)
    observ = models.CharField(max_length=1000, blank=True, null=True)
    cod_tarjeta = models.CharField(max_length=4, blank=True, null=True)
    celular = models.CharField(max_length=25, blank=True, null=True)
    radiomensaje = models.CharField(max_length=25, blank=True, null=True)
    codradiomens = models.CharField(max_length=25, blank=True, null=True)
    nrocliente = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True)
    saldoporcliente = models.CharField(max_length=1, blank=True, null=True)
    tipodcto = models.CharField(max_length=1, blank=True, null=True)
    transf_vtdir = models.CharField(max_length=1, blank=True, null=True)
    codplancta_me = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_me = models.CharField(max_length=11, blank=True, null=True)
    diasmora = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    moroso = models.CharField(max_length=1, blank=True, null=True)
    cod_cobrador = models.CharField(max_length=3, blank=True, null=True)
    nroservicio = models.CharField(max_length=20, blank=True, null=True)
    cod_cliente_cap = models.CharField(max_length=8, blank=True, null=True)
    bloquearlista = models.CharField(max_length=1, blank=True, null=True)
    cantfactsaldo = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    responsable = models.CharField(max_length=20, blank=True, null=True)
    plantilla = models.CharField(max_length=1, blank=True, null=True)
    cod_original = models.CharField(max_length=30, blank=True, null=True)
    codpais = models.CharField(max_length=3, blank=True, null=True)
    coddptopais = models.CharField(max_length=3, blank=True, null=True)
    codciudad = models.CharField(max_length=3, blank=True, null=True)
    codbarrio = models.CharField(max_length=3, blank=True, null=True)
    casa = models.CharField(max_length=2, blank=True, null=True)
    estadocivil = models.CharField(max_length=2, blank=True, null=True)
    codcodeudorconyug = models.CharField(max_length=8, blank=True, null=True)
    codcodeudor = models.CharField(max_length=8, blank=True, null=True)
    codconyugue = models.CharField(max_length=8, blank=True, null=True)
    ctactecatastral = models.CharField(max_length=20, blank=True, null=True)
    patente = models.CharField(max_length=12, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    cod_asociacion = models.CharField(max_length=8, blank=True, null=True)
    fechaalta = models.DateTimeField(blank=True, null=True)
    fec_ult_visita = models.DateField(blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    dna = models.CharField(max_length=20, blank=True, null=True)
    fechabaja = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clientes_unif'
        unique_together = (('cod_empresa', 'cod_cliente'),)


class Clientesactiv(models.Model):
    cod_empresa = models.ForeignKey('Tipoactividad', db_column='cod_empresa')
    cod_cliente = models.CharField(max_length=8)
    nroregistro = models.DecimalField(max_digits=9, decimal_places=0)
    cod_usuario = models.ForeignKey('Usuarios', db_column='cod_usuario')
    fechahora = models.DateTimeField()
    codtipoaccion = models.CharField(max_length=4)
    estado = models.CharField(max_length=1)
    cod_vendedor = models.ForeignKey('Vendedor', db_column='cod_vendedor', blank=True, null=True)
    cod_cobrador = models.ForeignKey('Cobrador', db_column='cod_cobrador', blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    observlarga = models.CharField(max_length=2500, blank=True, null=True)
    fechahoraprog = models.DateTimeField(blank=True, null=True)
    codtipoacprog = models.CharField(max_length=4, blank=True, null=True)
    cod_usrprog = models.CharField(max_length=16, blank=True, null=True)
    allow_vendedor = models.CharField(max_length=1, blank=True, null=True)
    allow_cobrador = models.CharField(max_length=1, blank=True, null=True)
    allow_fechahoraprog = models.CharField(max_length=1, blank=True, null=True)
    allow_codtipoacprog = models.CharField(max_length=1, blank=True, null=True)
    allow_cod_usrprog = models.CharField(max_length=1, blank=True, null=True)
    cod_tp_reclamo = models.CharField(max_length=4, blank=True, null=True)
    cod_cliente_activ = models.CharField(max_length=16, blank=True, null=True)
    razon_social_ca = models.CharField(max_length=40, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    nroserie = models.CharField(max_length=20, blank=True, null=True)
    nromotor = models.CharField(max_length=30, blank=True, null=True)
    codmarca = models.CharField(max_length=4, blank=True, null=True)
    codmodelo = models.CharField(max_length=4, blank=True, null=True)
    nro_certif = models.DecimalField(max_digits=13, decimal_places=0, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clientesactiv'
        unique_together = (('cod_empresa', 'cod_cliente', 'nroregistro'),)


class Clientesactiv09062011(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    nroregistro = models.DecimalField(max_digits=9, decimal_places=0)
    cod_usuario = models.CharField(max_length=16)
    fechahora = models.DateTimeField()
    codtipoaccion = models.CharField(max_length=4)
    estado = models.CharField(max_length=1)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    cod_cobrador = models.CharField(max_length=3, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    observlarga = models.CharField(max_length=2500, blank=True, null=True)
    fechahoraprog = models.DateTimeField(blank=True, null=True)
    codtipoacprog = models.CharField(max_length=4, blank=True, null=True)
    cod_usrprog = models.CharField(max_length=16, blank=True, null=True)
    allow_vendedor = models.CharField(max_length=1, blank=True, null=True)
    allow_cobrador = models.CharField(max_length=1, blank=True, null=True)
    allow_fechahoraprog = models.CharField(max_length=1, blank=True, null=True)
    allow_codtipoacprog = models.CharField(max_length=1, blank=True, null=True)
    allow_cod_usrprog = models.CharField(max_length=1, blank=True, null=True)
    cod_tp_reclamo = models.CharField(max_length=4, blank=True, null=True)
    cod_cliente_activ = models.CharField(max_length=8, blank=True, null=True)
    razon_social_ca = models.CharField(max_length=40, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    nroserie = models.CharField(max_length=20, blank=True, null=True)
    nromotor = models.CharField(max_length=30, blank=True, null=True)
    codmarca = models.CharField(max_length=4, blank=True, null=True)
    codmodelo = models.CharField(max_length=4, blank=True, null=True)
    nro_certif = models.DecimalField(max_digits=13, decimal_places=0, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clientesactiv_09062011'
        unique_together = (('cod_empresa', 'cod_cliente', 'nroregistro'),)


class ClientesactivUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    nroregistro = models.DecimalField(max_digits=9, decimal_places=0)
    cod_usuario = models.CharField(max_length=16)
    fechahora = models.DateTimeField()
    codtipoaccion = models.CharField(max_length=4)
    estado = models.CharField(max_length=1)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    cod_cobrador = models.CharField(max_length=3, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    observlarga = models.CharField(max_length=2500, blank=True, null=True)
    fechahoraprog = models.DateTimeField(blank=True, null=True)
    codtipoacprog = models.CharField(max_length=4, blank=True, null=True)
    cod_usrprog = models.CharField(max_length=16, blank=True, null=True)
    allow_vendedor = models.CharField(max_length=1, blank=True, null=True)
    allow_cobrador = models.CharField(max_length=1, blank=True, null=True)
    allow_fechahoraprog = models.CharField(max_length=1, blank=True, null=True)
    allow_codtipoacprog = models.CharField(max_length=1, blank=True, null=True)
    allow_cod_usrprog = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clientesactiv_unif'
        unique_together = (('cod_empresa', 'cod_cliente', 'nroregistro'),)


class Clientesdiasvisita(models.Model):
    cod_empresa = models.ForeignKey(Clientes, db_column='cod_empresa')
    cod_carpeta = models.CharField(max_length=8)
    cod_dia = models.CharField(max_length=8)
    cod_cliente = models.CharField(max_length=8)
    frecuencia = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    secuencia = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    fec_ult_visita = models.DateField(blank=True, null=True)
    fec_prox_visita = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clientesdiasvisita'
        unique_together = (('cod_empresa', 'cod_carpeta', 'cod_dia', 'cod_cliente'),)


class Clienteshist(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=11)
    cod_moneda = models.CharField(max_length=2)
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    mes = models.DecimalField(max_digits=2, decimal_places=0)
    saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codcalif = models.CharField(max_length=8, blank=True, null=True)
    cantdiasatr = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    moroso = models.CharField(max_length=1, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    mvto_numero = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cuota_numero = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clienteshist'
        unique_together = (('cod_empresa', 'cod_cliente', 'cod_moneda', 'anho', 'mes'),)


class Clientesvisita(models.Model):
    cod_empresa = models.ForeignKey(Clientes, db_column='cod_empresa')
    cod_cliente = models.CharField(max_length=8)
    cod_vendedor = models.ForeignKey('Vendedor', db_column='cod_vendedor', blank=True, null=True)
    fecha = models.DateTimeField()
    secuencia = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    cod_accion = models.CharField(max_length=8, blank=True, null=True)
    observ = models.CharField(max_length=200, blank=True, null=True)
    visitaenruta = models.CharField(max_length=1, blank=True, null=True)
    tipo_ruta = models.CharField(max_length=1)
    cod_camion = models.CharField(max_length=8, blank=True, null=True)
    cod_cobrador = models.ForeignKey('Cobrador', db_column='cod_cobrador', blank=True, null=True)
    nroregistro = models.DecimalField(max_digits=9, decimal_places=0)

    class Meta:
        managed = False
        db_table = 'clientesvisita'
        unique_together = (('cod_empresa', 'cod_cliente', 'fecha', 'nroregistro'),)


class Clientetrabcred(models.Model):
    cod_empresa = models.ForeignKey('Soliccred', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    codsolicitud = models.CharField(max_length=15, blank=True, null=True)
    codlugartrab = models.ForeignKey('Secclabor', db_column='codlugartrab')
    item = models.DecimalField(max_digits=3, decimal_places=0)
    codseccion = models.CharField(max_length=3, blank=True, null=True)
    codcargo = models.CharField(max_length=5, blank=True, null=True)
    tipo = models.CharField(max_length=2)
    direccion = models.CharField(max_length=50, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    interno = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    tel_movil = models.CharField(max_length=25, blank=True, null=True)
    fechaingreso = models.DateField(blank=True, null=True)
    sueldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    condicionlaboral = models.CharField(max_length=2, blank=True, null=True)
    comision = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    otroingreso = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    desseccion = models.CharField(max_length=80, blank=True, null=True)
    descargo = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clientetrabcred'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'codlugartrab', 'item', 'tipo'),)


class ClientetrabcredUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    codsolicitud = models.CharField(max_length=15)
    codlugartrab = models.CharField(max_length=6)
    item = models.DecimalField(max_digits=3, decimal_places=0)
    codseccion = models.CharField(max_length=3, blank=True, null=True)
    codcargo = models.CharField(max_length=5, blank=True, null=True)
    tipo = models.CharField(max_length=2)
    direccion = models.CharField(max_length=50, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    interno = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    tel_movil = models.CharField(max_length=25, blank=True, null=True)
    fechaingreso = models.DateField(blank=True, null=True)
    sueldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    condicionlaboral = models.CharField(max_length=2, blank=True, null=True)
    comision = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    otroingreso = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    desseccion = models.CharField(max_length=80, blank=True, null=True)
    descargo = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clientetrabcred_unif'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'codsolicitud', 'codlugartrab', 'item'),)


class Clitrabajo(models.Model):
    cod_empresa = models.ForeignKey(Clientes, db_column='cod_empresa')
    cod_cliente = models.CharField(max_length=8)
    item = models.DecimalField(max_digits=3, decimal_places=0)
    codlugartrab = models.CharField(max_length=6)
    codseccion = models.CharField(max_length=3, blank=True, null=True)
    codcargo = models.CharField(max_length=5, blank=True, null=True)
    tipo = models.CharField(max_length=2)
    direccion = models.CharField(max_length=50, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    interno = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    tel_movil = models.CharField(max_length=25, blank=True, null=True)
    fechaingreso = models.DateField(blank=True, null=True)
    sueldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    condicionlaboral = models.CharField(max_length=2, blank=True, null=True)
    comision = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    otroingreso = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ingreso_str = models.CharField(max_length=100, blank=True, null=True)
    desseccion = models.CharField(max_length=80, blank=True, null=True)
    descargo = models.CharField(max_length=80, blank=True, null=True)
    antiguedad = models.CharField(max_length=10, blank=True, null=True)
    trabactual = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clitrabajo'
        unique_together = (('cod_empresa', 'cod_cliente', 'item', 'codlugartrab', 'tipo'),)


class ClitrabajoUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    item = models.DecimalField(max_digits=3, decimal_places=0)
    codlugartrab = models.CharField(max_length=6)
    codseccion = models.CharField(max_length=3, blank=True, null=True)
    codcargo = models.CharField(max_length=5, blank=True, null=True)
    tipo = models.CharField(max_length=2)
    direccion = models.CharField(max_length=50, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    interno = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    tel_movil = models.CharField(max_length=25, blank=True, null=True)
    fechaingreso = models.DateField(blank=True, null=True)
    sueldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    condicionlaboral = models.CharField(max_length=2, blank=True, null=True)
    comision = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    otroingreso = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ingreso_str = models.CharField(max_length=100, blank=True, null=True)
    desseccion = models.CharField(max_length=80, blank=True, null=True)
    descargo = models.CharField(max_length=80, blank=True, null=True)
    antiguedad = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clitrabajo_unif'
        unique_together = (('cod_empresa', 'cod_cliente', 'item'),)


class Cobrador(models.Model):
    cod_cobrador = models.CharField(primary_key=True, max_length=3)
    tpo_cobrador = models.CharField(max_length=10)
    comision = models.DecimalField(max_digits=4, decimal_places=2)
    des_cobrador = models.CharField(max_length=30)
    comision_venc = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    codclasifcobrador = models.CharField(max_length=8, blank=True, null=True)
    nro_cedula = models.CharField(max_length=8, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    atrasodesde = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    atrasohasta = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    tramo = models.CharField(max_length=3, blank=True, null=True)
    sucursales = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cobrador'


class CobradorTmp(models.Model):
    cod_cobrador = models.CharField(max_length=3)
    des_cobrador = models.CharField(max_length=30)
    cod_cobrador_orig = models.CharField(primary_key=True, max_length=10)

    class Meta:
        managed = False
        db_table = 'cobrador_tmp'


class ComXTpVendFamTpCliente(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    tipo_vendedor = models.CharField(max_length=2)
    cod_tp_cliente = models.CharField(max_length=2, blank=True, null=True)
    linea = models.DecimalField(max_digits=15, decimal_places=0)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    meta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    base = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    adicional_superv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    calc_com_fija = models.CharField(max_length=1, blank=True, null=True)
    rentminima = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    rentminima_com = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    rentmeta = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    rentmeta_com = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'com_x_tp_vend_fam_tp_cliente'
        unique_together = (('cod_empresa', 'tipo_vendedor', 'linea'),)


class ComXTpVendFamTpClienteHist(models.Model):
    cod_empresa = models.CharField(max_length=2)
    tipo_vendedor = models.CharField(max_length=2)
    linea = models.DecimalField(max_digits=15, decimal_places=0)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    codtpfactura = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    importe_fact = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldo_fact = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fecha_emi_cuota = models.DateTimeField(blank=True, null=True)
    fecha_ven_cuota = models.DateTimeField(blank=True, null=True)
    codtppago = models.CharField(max_length=4, blank=True, null=True)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    importe_pago = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fecha_pago = models.DateTimeField(blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_cliente = models.CharField(max_length=2, blank=True, null=True)
    linea_comis = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    tipo_comis = models.CharField(max_length=1, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    des_articulo = models.CharField(max_length=150, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    meta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    base = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    adicional_superv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    cant_boletas_meta = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    cant_boletas_vend = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    fecha_desde = models.DateField(blank=True, null=True)
    fecha_hasta = models.DateField(blank=True, null=True)
    tot_venta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot_bonificacion = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    calc_com_fija = models.CharField(max_length=1, blank=True, null=True)
    comis_fija = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    comis_variable = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    factor_correccion = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    nombre = models.CharField(max_length=80, blank=True, null=True)
    cant_boletas = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'com_x_tp_vend_fam_tp_cliente_hist'
        unique_together = (('cod_empresa', 'tipo_vendedor', 'linea'),)


class Comisagrupdcto(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    fechadesde = models.DateTimeField(blank=True, null=True)
    activo = models.CharField(max_length=1)
    dctodesde = models.DecimalField(max_digits=5, decimal_places=3)
    dctohasta = models.DecimalField(max_digits=5, decimal_places=3)
    porccomis = models.DecimalField(max_digits=5, decimal_places=3)

    class Meta:
        managed = False
        db_table = 'comisagrupdcto'


class Comiscab(models.Model):
    cod_empresa = models.ForeignKey('Empresa', db_column='cod_empresa')
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda')
    tipo_vendedor = models.ForeignKey('Tpovend', db_column='tipo_vendedor')
    numeroid = models.DecimalField(max_digits=7, decimal_places=0)
    descripcion = models.CharField(max_length=100, blank=True, null=True)
    activo = models.CharField(max_length=1, blank=True, null=True)
    tipoescala = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comiscab'
        unique_together = (('cod_empresa', 'codmoneda', 'tipo_vendedor', 'numeroid'),)


class Comisescala(models.Model):
    cod_empresa = models.ForeignKey(Comiscab, db_column='cod_empresa')
    tipo_vendedor = models.CharField(max_length=2)
    codmoneda = models.CharField(max_length=2)
    numeroid = models.DecimalField(max_digits=7, decimal_places=0)
    nroorden = models.DecimalField(max_digits=7, decimal_places=0)
    operador = models.CharField(max_length=2, blank=True, null=True)
    condicion = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    comision = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    comision_monto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comisescala'
        unique_together = (('cod_empresa', 'tipo_vendedor', 'codmoneda', 'numeroid', 'nroorden'),)


class Comisiones(models.Model):
    cod_empresa = models.CharField(max_length=2)
    tipo_vta = models.CharField(max_length=2)
    tipo_vendedor = models.CharField(max_length=2)
    codmoneda = models.CharField(max_length=2)
    lista_prec = models.CharField(max_length=1)
    nroorden = models.DecimalField(max_digits=1, decimal_places=0)
    condicion = models.DecimalField(max_digits=19, decimal_places=4)
    operador = models.CharField(max_length=2, blank=True, null=True)
    comision = models.DecimalField(max_digits=4, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'comisiones'
        unique_together = (('cod_empresa', 'tipo_vta', 'tipo_vendedor', 'codmoneda', 'lista_prec', 'nroorden'),)


class Comisliquidacion(models.Model):
    cod_empresa = models.ForeignKey('Empresa', db_column='cod_empresa')
    cod_vendedor = models.ForeignKey('Vendedor', db_column='cod_vendedor')
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    mes = models.DecimalField(max_digits=2, decimal_places=0)
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda')
    tipo_vendedor = models.CharField(max_length=2)
    numeroid = models.DecimalField(max_digits=7, decimal_places=0)
    terminos = models.CharField(max_length=500, blank=True, null=True)
    fechahoraproc = models.DateTimeField(blank=True, null=True)
    fechadesde = models.DateTimeField(blank=True, null=True)
    fechahasta = models.DateTimeField(blank=True, null=True)
    importeventa = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porccomis = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    montocomis = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    userid = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comisliquidacion'
        unique_together = (('cod_empresa', 'cod_vendedor', 'anho', 'mes', 'codmoneda', 'tipo_vendedor', 'numeroid'),)


class Comismetasagrup(models.Model):
    cod_empresa = models.ForeignKey('Empresa', db_column='cod_empresa', blank=True, null=True)
    cod_familia = models.ForeignKey('Grupo', db_column='cod_familia', blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    fechadesde = models.DateField(blank=True, null=True)
    fechahasta = models.DateField(blank=True, null=True)
    importemeta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porccomisalc = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomisnoalc = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montocomisalc = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montocomisnoalc = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    cajasmeta = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    factorpreciocaja = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comismetasagrup'


class Comismetasglobal(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_vendedor = models.CharField(max_length=4)
    fechadesde = models.DateField()
    fechahasta = models.DateField(blank=True, null=True)
    importemetamin = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porccomminalc = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomminnoalc = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montocomminalc = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montocomminnoalc = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    importemetamax = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porccommaxalc = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montocommaxalc = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montocommaxnoalc = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comismetasglobal'
        unique_together = (('cod_empresa', 'cod_vendedor', 'fechadesde'),)


class Comisterminos(models.Model):
    cod_empresa = models.ForeignKey(Comiscab, db_column='cod_empresa')
    tipo_vendedor = models.CharField(max_length=2)
    codmoneda = models.CharField(max_length=2)
    numeroid = models.DecimalField(max_digits=7, decimal_places=0)
    cod_con_vta = models.ForeignKey('Terminos', db_column='cod_con_vta')

    class Meta:
        managed = False
        db_table = 'comisterminos'
        unique_together = (('cod_empresa', 'tipo_vendedor', 'codmoneda', 'numeroid', 'cod_con_vta'),)


class Comistpovend(models.Model):
    cod_empresa = models.CharField(max_length=2)
    tipo_vendedor = models.CharField(max_length=2)
    cod_con_vta = models.CharField(max_length=2)
    porccomision = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comistpovend'
        unique_together = (('cod_empresa', 'tipo_vendedor', 'cod_con_vta'),)


class Componentes(models.Model):
    cod_empresa = models.ForeignKey(Articulo, db_column='cod_empresa')
    cod_articulo = models.CharField(max_length=14)
    cod_componente = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=10, decimal_places=4)
    incidvta = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'componentes'
        unique_together = (('cod_empresa', 'cod_articulo', 'cod_componente'),)


class Conceptocol(models.Model):
    cod_empresa = models.ForeignKey('Plancta', db_column='cod_empresa')
    codinforme = models.CharField(max_length=5)
    fila = models.CharField(max_length=5)
    columna = models.CharField(max_length=5)
    nrolinea = models.DecimalField(max_digits=5, decimal_places=0)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    signo = models.CharField(max_length=1)
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    descrip = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'conceptocol'
        unique_together = (('cod_empresa', 'codinforme', 'fila', 'columna', 'nrolinea'),)


class Conceptocriterio(models.Model):
    cod_empresa = models.ForeignKey('Conceptofila', db_column='cod_empresa')
    codinforme = models.CharField(max_length=5)
    fila = models.CharField(max_length=5)
    columna = models.CharField(max_length=5)
    nrolinea = models.DecimalField(max_digits=3, decimal_places=0)
    operador = models.CharField(max_length=5, blank=True, null=True)
    criterio = models.CharField(max_length=250)

    class Meta:
        managed = False
        db_table = 'conceptocriterio'
        unique_together = (('cod_empresa', 'codinforme', 'fila', 'columna', 'nrolinea'),)


class Conceptofila(models.Model):
    cod_empresa = models.ForeignKey('Plantillainformes', db_column='cod_empresa')
    codinforme = models.CharField(max_length=5)
    fila = models.CharField(max_length=5)
    signo = models.CharField(max_length=1)
    descrip = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'conceptofila'
        unique_together = (('cod_empresa', 'codinforme', 'fila'),)


class ConceptosXCargo(models.Model):
    cod_concepcargo = models.CharField(primary_key=True, max_length=3)
    des_concepcargo = models.CharField(max_length=80)

    class Meta:
        managed = False
        db_table = 'conceptos_x_cargo'


class Concilcab(models.Model):
    cod_empresa = models.ForeignKey('Plancta', db_column='cod_empresa')
    nroconcil = models.DecimalField(max_digits=5, decimal_places=0)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    fechadesde = models.DateTimeField(blank=True, null=True)
    fechahasta = models.DateTimeField(blank=True, null=True)
    definitivo = models.CharField(max_length=1)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    saldobanco = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldoanterior = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldocontable = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'concilcab'
        unique_together = (('cod_empresa', 'nroconcil'),)


class Concildet(models.Model):
    cod_empresa = models.ForeignKey(Concilcab, db_column='cod_empresa')
    nroconcil = models.DecimalField(max_digits=5, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    fecha = models.DateTimeField(blank=True, null=True)
    tiporegistro = models.CharField(max_length=2, blank=True, null=True)
    concepto = models.CharField(max_length=100, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'concildet'
        unique_together = (('cod_empresa', 'nroconcil', 'linea'),)


class Condadiccartacred(models.Model):
    cod_empresa = models.ForeignKey(Cartacredcab, db_column='cod_empresa')
    nrocarta = models.CharField(max_length=20)
    nrolinea = models.DecimalField(max_digits=5, decimal_places=0)
    condicion = models.CharField(max_length=1500)

    class Meta:
        managed = False
        db_table = 'condadiccartacred'
        unique_together = (('cod_empresa', 'nrocarta', 'nrolinea'),)


class Condrecepcion(models.Model):
    cod_empresa = models.ForeignKey('Empresa', db_column='cod_empresa')
    codcondrecep = models.CharField(max_length=2)
    descrip = models.CharField(max_length=60, blank=True, null=True)
    activo = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'condrecepcion'
        unique_together = (('cod_empresa', 'codcondrecep'),)


class ConfigControlOper(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    vtaimpresa = models.CharField(max_length=1, blank=True, null=True)
    rel_pg_ct = models.CharField(max_length=1, blank=True, null=True)
    rel_pg_rec = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'config_control_oper'


class Control(models.Model):
    cod_empresa = models.ForeignKey('Empresa', db_column='cod_empresa')
    ctastocont = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    ctastomes = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    ctcol1 = models.CharField(max_length=1, blank=True, null=True)
    ctcol2 = models.CharField(max_length=1, blank=True, null=True)
    ctcol3 = models.CharField(max_length=1, blank=True, null=True)
    ctcol4 = models.CharField(max_length=1, blank=True, null=True)
    ctcol5 = models.CharField(max_length=1, blank=True, null=True)
    ctcol6 = models.CharField(max_length=1, blank=True, null=True)
    ctcol7 = models.CharField(max_length=1, blank=True, null=True)
    ctcol8 = models.CharField(max_length=1, blank=True, null=True)
    ctcol9 = models.CharField(max_length=1, blank=True, null=True)
    ctcol1des = models.CharField(max_length=30, blank=True, null=True)
    ctcol2des = models.CharField(max_length=30, blank=True, null=True)
    ctcol3des = models.CharField(max_length=30, blank=True, null=True)
    ctcol4des = models.CharField(max_length=30, blank=True, null=True)
    ctcol5des = models.CharField(max_length=30, blank=True, null=True)
    ctcol6des = models.CharField(max_length=30, blank=True, null=True)
    ctcol7des = models.CharField(max_length=30, blank=True, null=True)
    ctcol8des = models.CharField(max_length=30, blank=True, null=True)
    ctcol9des = models.CharField(max_length=30, blank=True, null=True)
    ctbalgral = models.CharField(max_length=1, blank=True, null=True)
    ctestresul = models.CharField(max_length=1, blank=True, null=True)
    ctctaorden = models.CharField(max_length=1, blank=True, null=True)
    ctcantniv = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig1 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig2 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig3 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig4 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig5 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig6 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig7 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig8 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig9 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctcant2niv = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig21 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig22 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig23 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig24 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig25 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig26 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig27 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig28 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctdig29 = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctctautil = models.CharField(max_length=11, blank=True, null=True)
    ctctaperd = models.CharField(max_length=11, blank=True, null=True)
    cta_iva = models.CharField(max_length=11, blank=True, null=True)
    ctadispo = models.CharField(max_length=11, blank=True, null=True)
    ultnroop = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    codtipocbteop = models.CharField(max_length=4, blank=True, null=True)
    codtipocbtefact = models.CharField(max_length=4, blank=True, null=True)
    planctaffijo = models.CharField(max_length=11, blank=True, null=True)
    planauxffijo = models.CharField(max_length=11, blank=True, null=True)
    tipoasientoffijo = models.CharField(max_length=2, blank=True, null=True)
    cta_iva_compra = models.CharField(max_length=11, blank=True, null=True)
    tipoasientofact = models.CharField(max_length=2, blank=True, null=True)
    monedalocal = models.CharField(max_length=2, blank=True, null=True)
    tipoasientoventa = models.CharField(max_length=2, blank=True, null=True)
    ctadescuento = models.CharField(max_length=11, blank=True, null=True)
    cobradornc = models.CharField(max_length=3, blank=True, null=True)
    cod_tp_compnc = models.CharField(max_length=4, blank=True, null=True)
    tipoasientoop = models.CharField(max_length=2, blank=True, null=True)
    tipoasientoantic = models.CharField(max_length=2, blank=True, null=True)
    tipoasientoncp = models.CharField(max_length=2, blank=True, null=True)
    calcautomprecio = models.CharField(max_length=1)
    basecalcautpr = models.CharField(max_length=2)
    ctrlcuotasvenc = models.CharField(max_length=2)
    ctrlsaldolimcred = models.CharField(max_length=2)
    ctrlexistencianeg = models.CharField(max_length=2)
    cod_cliente_varios = models.CharField(max_length=8, blank=True, null=True)
    cantdecimalme = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    cantdecimalgs = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    tipoasientorec = models.CharField(max_length=2, blank=True, null=True)
    monedaextranjera = models.CharField(max_length=2, blank=True, null=True)
    ctaimpcursobc = models.CharField(max_length=11, blank=True, null=True)
    ctaimpcursoaf = models.CharField(max_length=11, blank=True, null=True)
    tipoasientoctovta = models.CharField(max_length=2, blank=True, null=True)
    planctadifcambio = models.CharField(max_length=11, blank=True, null=True)
    ctaresultejer = models.CharField(max_length=11, blank=True, null=True)
    credclientetpcbte = models.CharField(max_length=1, blank=True, null=True)
    planctadctootorgado = models.CharField(max_length=11, blank=True, null=True)
    planauxdctootorgado = models.CharField(max_length=11, blank=True, null=True)
    tipoasientostock = models.CharField(max_length=2, blank=True, null=True)
    convautmonextmonloc = models.CharField(max_length=1, blank=True, null=True)
    fechacierre = models.DateTimeField(blank=True, null=True)
    mescierre = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    tipoasientobajaaf = models.CharField(max_length=2, blank=True, null=True)
    tipoasientovtaaf = models.CharField(max_length=2, blank=True, null=True)
    tipoasientoliqtarj = models.CharField(max_length=2, blank=True, null=True)
    ctadeprec = models.CharField(max_length=11, blank=True, null=True)
    tipoasientodepr = models.CharField(max_length=2, blank=True, null=True)
    porciva = models.DecimalField(max_digits=5, decimal_places=2)
    ctarevaluo = models.CharField(max_length=11, blank=True, null=True)
    tipoasientorev = models.CharField(max_length=2, blank=True, null=True)
    ctacontrubroigual = models.CharField(max_length=1)
    ubicsubrubroigual = models.CharField(max_length=1)
    tiponrofactura = models.CharField(max_length=1, blank=True, null=True)
    fecha1ercierre = models.DateTimeField(blank=True, null=True)
    mes1ercierre = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    ctasingreso = models.CharField(max_length=20, blank=True, null=True)
    ctasegreso = models.CharField(max_length=20, blank=True, null=True)
    metodocalcdeprec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    ctadeprecajuste = models.CharField(max_length=11, blank=True, null=True)
    codtipocalc = models.CharField(max_length=2, blank=True, null=True)
    tipodeprec = models.CharField(max_length=2, blank=True, null=True)
    anhoperiodo = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    mesperiodo = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    tipoasientoaper = models.CharField(max_length=2, blank=True, null=True)
    tipoasientonc = models.CharField(max_length=2, blank=True, null=True)
    tipoasientocostonc = models.CharField(max_length=2, blank=True, null=True)
    tipoasientoop_a = models.CharField(max_length=2, blank=True, null=True)
    tipoasientoop_b = models.CharField(max_length=2, blank=True, null=True)
    aux_iva = models.CharField(max_length=11, blank=True, null=True)
    genvtasdeposito = models.CharField(max_length=1, blank=True, null=True)
    nroasiento = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    ajustecerovalorneto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    genstockasientos = models.CharField(max_length=1, blank=True, null=True)
    creditodispcta = models.CharField(max_length=11, blank=True, null=True)
    creditodipaux = models.CharField(max_length=11, blank=True, null=True)
    creditodipsaux = models.CharField(max_length=11, blank=True, null=True)
    creditodispaux = models.CharField(max_length=11, blank=True, null=True)
    tipoasientoprod = models.CharField(max_length=2, blank=True, null=True)
    ctaresultacum = models.CharField(max_length=11, blank=True, null=True)
    auxresultacum = models.CharField(max_length=11, blank=True, null=True)
    recallarticulo = models.CharField(max_length=1, blank=True, null=True)
    cuotadeprmesrest = models.CharField(max_length=1)
    pathfotoaf = models.CharField(max_length=60, blank=True, null=True)
    planauxdifcambio = models.CharField(max_length=11, blank=True, null=True)
    tipoasientoactivaf = models.CharField(max_length=2, blank=True, null=True)
    nrocopiasfact = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    tipoasientotransfaf = models.CharField(max_length=2, blank=True, null=True)
    multimonetaria = models.CharField(max_length=1, blank=True, null=True)
    menugrant = models.CharField(max_length=1, blank=True, null=True)
    textoordcompra = models.CharField(max_length=350, blank=True, null=True)
    tipofactcompra = models.CharField(max_length=1, blank=True, null=True)
    incluiriva = models.CharField(max_length=1, blank=True, null=True)
    getncfactprov = models.CharField(max_length=1, blank=True, null=True)
    aux_iva_compra = models.CharField(max_length=11, blank=True, null=True)
    ctrlimpstock = models.CharField(max_length=1, blank=True, null=True)
    ctrlfactcambio = models.CharField(max_length=1, blank=True, null=True)
    prorrateoimport = models.CharField(max_length=1, blank=True, null=True)
    limitefaltantes = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    monedalimfalt = models.CharField(max_length=2, blank=True, null=True)
    porcvariacto = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    impfleje = models.CharField(max_length=1, blank=True, null=True)
    planctacheqdif = models.CharField(max_length=11, blank=True, null=True)
    planauxcheqdif = models.CharField(max_length=11, blank=True, null=True)
    tipoasientocheqdif = models.CharField(max_length=2, blank=True, null=True)
    fechagenfactcompra = models.CharField(max_length=1, blank=True, null=True)
    fechaupdate = models.DateTimeField(blank=True, null=True)
    gencodactivo = models.CharField(max_length=1, blank=True, null=True)
    lencodactivo = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    getrevalejant = models.CharField(max_length=1, blank=True, null=True)
    getrevdeprecacum = models.CharField(max_length=1, blank=True, null=True)
    calcvidautilrest = models.CharField(max_length=1, blank=True, null=True)
    revsoloaltasmes = models.CharField(max_length=1, blank=True, null=True)
    revmonedaextranj = models.CharField(max_length=1, blank=True, null=True)
    calcvalorneto = models.CharField(max_length=1, blank=True, null=True)
    ajustarvalorneto = models.CharField(max_length=1, blank=True, null=True)
    periodo = models.CharField(max_length=8)
    cta_iva_compra_devol = models.CharField(max_length=11, blank=True, null=True)
    aux_iva_compra_devol = models.CharField(max_length=11, blank=True, null=True)
    opchequediferido = models.CharField(max_length=1, blank=True, null=True)
    limimpstock = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    gencentrocosto = models.CharField(max_length=1, blank=True, null=True)
    tipoasientodivmonto = models.CharField(max_length=2, blank=True, null=True)
    tipoasientocierre = models.CharField(max_length=2, blank=True, null=True)
    etiqrevdeprec_1 = models.CharField(max_length=100, blank=True, null=True)
    etiqrevdeprec_2 = models.CharField(max_length=100, blank=True, null=True)
    etiqrevdeprec_3 = models.CharField(max_length=100, blank=True, null=True)
    bloquearmoroso = models.CharField(max_length=1, blank=True, null=True)
    autorizarastos = models.CharField(max_length=1, blank=True, null=True)
    tipoasientocartacred = models.CharField(max_length=2, blank=True, null=True)
    pagaretexto = models.CharField(max_length=2000, blank=True, null=True)
    lista_precio_vta = models.CharField(max_length=1, blank=True, null=True)
    pagos_payment_check = models.CharField(max_length=1, blank=True, null=True)
    tiponrostock = models.CharField(max_length=1, blank=True, null=True)
    cierreaf = models.CharField(max_length=5, blank=True, null=True)
    questimpfactffijo = models.CharField(max_length=1, blank=True, null=True)
    work_with_long_descrip = models.CharField(max_length=1, blank=True, null=True)
    work_with_talleres = models.CharField(max_length=1, blank=True, null=True)
    ctrlexistencianegpresup = models.CharField(max_length=2, blank=True, null=True)
    genastoimport = models.CharField(max_length=2)
    formfactcompra = models.CharField(max_length=1, blank=True, null=True)
    facturarpresupuestos = models.CharField(max_length=1, blank=True, null=True)
    tipoimpcodbarra = models.CharField(max_length=1, blank=True, null=True)
    cod_tp_comp_ibaf = models.CharField(max_length=4, blank=True, null=True)
    intmoraanual = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    getrevalantbien = models.CharField(max_length=1, blank=True, null=True)
    revmensualdiv12 = models.CharField(max_length=1, blank=True, null=True)
    questimpfactint = models.CharField(max_length=1, blank=True, null=True)
    prefijopesables = models.CharField(max_length=2, blank=True, null=True)
    nombre_encargado_compra = models.CharField(max_length=50, blank=True, null=True)
    codemipron = models.CharField(max_length=4, blank=True, null=True)
    longcompnropron = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    longcuotanropron = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    codmonedapron = models.CharField(max_length=3, blank=True, null=True)
    longimpentpron = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    longimpdecpron = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    cod_articulo_ajuste = models.CharField(max_length=14, blank=True, null=True)
    ctrlexistencianegstock = models.CharField(max_length=2, blank=True, null=True)
    tipoasientodep = models.CharField(max_length=2, blank=True, null=True)
    getfactor_gastimp = models.CharField(max_length=1)
    codtpcomp_pronet = models.CharField(max_length=4, blank=True, null=True)
    codtppago_pronet = models.CharField(max_length=2, blank=True, null=True)
    codcobrad_pronet = models.CharField(max_length=2, blank=True, null=True)
    sectorfact_pronet = models.CharField(max_length=12, blank=True, null=True)
    nroserie_pronet = models.CharField(max_length=12, blank=True, null=True)
    origen_pronet = models.CharField(max_length=2, blank=True, null=True)
    pathtxt_pronet = models.CharField(max_length=80, blank=True, null=True)
    codprovvarios = models.CharField(max_length=4, blank=True, null=True)
    tiponroordcomp = models.CharField(max_length=1, blank=True, null=True)
    getserialnumber = models.CharField(max_length=1, blank=True, null=True)
    auxctadescuento = models.CharField(max_length=11, blank=True, null=True)
    auxctaresultejer = models.CharField(max_length=11, blank=True, null=True)
    bloq_interes = models.CharField(max_length=1, blank=True, null=True)
    fact_otro_deposito = models.CharField(max_length=1, blank=True, null=True)
    cb_long_digindic = models.CharField(max_length=1, blank=True, null=True)
    cb_cod_digindic = models.CharField(max_length=3, blank=True, null=True)
    cb_long_codbarra = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cb_cantdecimal = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cb_long_codarticulo = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cb_log_codarticulo = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    tagaretexto = models.CharField(max_length=200, blank=True, null=True)
    inc_default = models.CharField(max_length=200, blank=True, null=True)
    pasar_precio_costo = models.CharField(max_length=1, blank=True, null=True)
    cierredespacho = models.CharField(max_length=1)
    ctrl_suc_nota_cred = models.CharField(max_length=1, blank=True, null=True)
    tipocalcmaquila = models.CharField(max_length=1, blank=True, null=True)
    cod_tp_compriva = models.CharField(max_length=4, blank=True, null=True)
    porcriva = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montominriva = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_tp_comprrenta = models.CharField(max_length=4, blank=True, null=True)
    porcrrenta = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montominrrenta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tiponropagare = models.CharField(max_length=1, blank=True, null=True)
    tponroclientes = models.CharField(max_length=1, blank=True, null=True)
    cta_iva_compra_5 = models.CharField(max_length=11, blank=True, null=True)
    aux_iva_compra_5 = models.CharField(max_length=11, blank=True, null=True)
    tponrorecibos = models.CharField(max_length=1, blank=True, null=True)
    tipoasientoret = models.CharField(max_length=2, blank=True, null=True)
    apliccredclientes = models.CharField(max_length=1, blank=True, null=True)
    porcarancelario = models.CharField(max_length=1, blank=True, null=True)
    cta_transitoria_ret_iva = models.CharField(max_length=11, blank=True, null=True)
    tipoasientoexportacion = models.CharField(max_length=11, blank=True, null=True)
    cta_iva_exportacion = models.CharField(max_length=11, blank=True, null=True)
    aux_iva_exportacion = models.CharField(max_length=11, blank=True, null=True)
    tipoasientodepbancario = models.CharField(max_length=2, blank=True, null=True)
    retenible_x_suc = models.CharField(max_length=1, blank=True, null=True)
    aplicanticipos = models.CharField(max_length=1, blank=True, null=True)
    factcambioporempresa = models.CharField(max_length=1, blank=True, null=True)
    presupmultiplesaprobaciones = models.CharField(max_length=1, blank=True, null=True)
    bloquearplazo = models.CharField(max_length=1, blank=True, null=True)
    ctrlprecioenbasealcosto = models.CharField(max_length=1, blank=True, null=True)
    factcambrec = models.CharField(max_length=1, blank=True, null=True)
    cta_iva_5 = models.CharField(max_length=11, blank=True, null=True)
    aux_iva_5 = models.CharField(max_length=11, blank=True, null=True)
    autorizarndalimprimir = models.CharField(max_length=1, blank=True, null=True)
    planctaivagasto = models.CharField(max_length=11, blank=True, null=True)
    planauxivagasto = models.CharField(max_length=11, blank=True, null=True)
    auxiliar_por_sucursal = models.CharField(max_length=1, blank=True, null=True)
    servtecnicopropio = models.CharField(max_length=1, blank=True, null=True)
    cod_articulo_financ = models.CharField(max_length=14, blank=True, null=True)
    controlar_planilla_entrega = models.CharField(max_length=1, blank=True, null=True)
    devotrasuc = models.CharField(max_length=1, blank=True, null=True)
    ctrl_number = models.CharField(max_length=1, blank=True, null=True)
    codartlote = models.CharField(max_length=1, blank=True, null=True)
    cod_proveed_varios = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'control'
        unique_together = (('cod_empresa', 'periodo'),)


class CtasArticulos(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_art = models.CharField(max_length=3, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    cod_original = models.CharField(max_length=14, blank=True, null=True)
    comision_vta = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    descuento = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    unidad = models.CharField(max_length=4, blank=True, null=True)
    iva = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    st_max = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    pto_pedido = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    cto_ult_gs = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    cto_ult_me = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    fha_ult_mov = models.DateTimeField(blank=True, null=True)
    pr1_gs = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    pr1_me = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    pr2_gs = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    pr2_me = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    pr3_gs = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    pr3_me = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    pr4_gs = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    pr4_me = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    cta_cont = models.CharField(max_length=11, blank=True, null=True)
    aux_cont = models.CharField(max_length=11, blank=True, null=True)
    des_art = models.CharField(max_length=80, blank=True, null=True)
    codartpad = models.CharField(max_length=14, blank=True, null=True)
    referencia = models.CharField(max_length=15, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    nroarticulo = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    cta_costo = models.CharField(max_length=11, blank=True, null=True)
    aux_costo = models.CharField(max_length=11, blank=True, null=True)
    cta_vta = models.CharField(max_length=11, blank=True, null=True)
    aux_vta = models.CharField(max_length=11, blank=True, null=True)
    tipoembalaje = models.CharField(max_length=40, blank=True, null=True)
    cantembalaje = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    variacionprecio = models.CharField(max_length=1, blank=True, null=True)
    descripcorta = models.CharField(max_length=12, blank=True, null=True)
    listaventa = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    codmodalidad = models.CharField(max_length=4, blank=True, null=True)
    cta_vtactme = models.CharField(max_length=11, blank=True, null=True)
    aux_vtactme = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrgs = models.CharField(max_length=11, blank=True, null=True)
    aux_vtacrgs = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrme = models.CharField(max_length=11, blank=True, null=True)
    aux_vtacrme = models.CharField(max_length=11, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    cto_prom_ant_gs = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    cto_prom_ant_me = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    cto_ult_fob_gs = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    cto_ult_fob_me = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    cantmin1 = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    cantmin2 = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    cantmin3 = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    cantmin4 = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    porccomislista1 = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    porccomislista2 = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    porccomislista3 = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    porccomislista4 = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    codconcepto = models.CharField(max_length=4, blank=True, null=True)
    largo = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    ancho = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    altura = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    densidad = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    m3 = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    peso = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    fechacreacion = models.DateTimeField(blank=True, null=True)
    usrcreacion = models.CharField(max_length=16, blank=True, null=True)
    fechamodif = models.DateTimeField(blank=True, null=True)
    usrmodif = models.CharField(max_length=16, blank=True, null=True)
    standard = models.CharField(max_length=1, blank=True, null=True)
    des_art_old = models.CharField(max_length=200, blank=True, null=True)
    modpreciovta = models.CharField(max_length=1, blank=True, null=True)
    ctrlfactntcredito = models.CharField(max_length=1, blank=True, null=True)
    descriplarga = models.CharField(max_length=1000, blank=True, null=True)
    ctaimpcurso = models.CharField(max_length=11, blank=True, null=True)
    auximpcurso = models.CharField(max_length=11, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    cta_vtactgs = models.CharField(max_length=11, blank=True, null=True)
    aux_vtactgs = models.CharField(max_length=11, blank=True, null=True)
    porcgravado = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    porcpartgravado = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ctas_articulos'


class Ctrlclaves(models.Model):
    bloqintentosfallidos = models.CharField(max_length=1)
    maxcantintfallidos = models.DecimalField(max_digits=2, decimal_places=0)
    ctrllongminima = models.CharField(max_length=1)
    longminima = models.DecimalField(max_digits=2, decimal_places=0)
    ctrlhistorial = models.CharField(max_length=1)
    canthistorial = models.DecimalField(max_digits=2, decimal_places=0)
    ctrlcaducidad = models.CharField(max_length=1)
    vigenciadiasmax = models.DecimalField(max_digits=3, decimal_places=0)
    vigenciadiasmin = models.DecimalField(max_digits=3, decimal_places=0)
    ctrlcomplejidad = models.CharField(max_length=1)
    cantmincomplejidad = models.DecimalField(max_digits=3, decimal_places=0)
    caracespecialesok = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ctrlclaves'


class Ctrlclaveshist(models.Model):
    cod_usuario = models.ForeignKey('Usuarios', db_column='cod_usuario')
    nrosecuencia = models.DecimalField(max_digits=3, decimal_places=0)
    fechaseteoclave = models.DateTimeField()
    fechainivigencia = models.DateTimeField()
    fechafinvigencia = models.DateTimeField(blank=True, null=True)
    forzarcambioclave = models.CharField(max_length=1)
    usrnocambiaclave = models.CharField(max_length=1)
    clavenuncavence = models.CharField(max_length=1)
    bloqueado = models.CharField(max_length=1)
    fechabloqueo = models.DateTimeField(blank=True, null=True)
    fechadesbloqueo = models.DateTimeField(blank=True, null=True)
    usradmdesbloqueo = models.ForeignKey('Usuarios', db_column='usradmdesbloqueo', blank=True, null=True)
    clave = models.CharField(max_length=128)
    fechahoraultintfallido = models.DateTimeField(blank=True, null=True)
    cantintfallidos = models.DecimalField(max_digits=2, decimal_places=0)
    observ = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ctrlclaveshist'
        unique_together = (('cod_usuario', 'nrosecuencia'),)


class Ctrlclaveshistlog(models.Model):
    cod_usuario = models.ForeignKey(Ctrlclaveshist, db_column='cod_usuario')
    nrosecuencia = models.DecimalField(max_digits=3, decimal_places=0)
    nrolinea = models.DecimalField(max_digits=3, decimal_places=0)
    fechahoraintfallido = models.DateTimeField(blank=True, null=True)
    bloqueado = models.CharField(max_length=20, blank=True, null=True)
    fechabloqueo = models.DateTimeField(blank=True, null=True)
    fechadesbloqueo = models.DateTimeField(blank=True, null=True)
    usradmdesbloqueo = models.CharField(max_length=16, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ctrlclaveshistlog'
        unique_together = (('cod_usuario', 'nrosecuencia', 'nrolinea'),)


class Cuentabancaria(models.Model):
    cod_empresa = models.CharField(max_length=2)
    codbanco = models.ForeignKey(Bancos, db_column='codbanco')
    cuentabanco = models.CharField(max_length=20)
    nombre = models.CharField(max_length=40, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    saldominimo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    ejecutivocuenta = models.CharField(max_length=40, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cuentabancaria'
        unique_together = (('cod_empresa', 'codbanco', 'cuentabanco'),)


class CuentasServicios(models.Model):
    cuenta = models.CharField(max_length=10, blank=True, null=True)
    numero = models.CharField(max_length=10, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    nombre = models.CharField(max_length=35, blank=True, null=True)
    apellido = models.CharField(max_length=35, blank=True, null=True)
    direccion = models.CharField(max_length=107, blank=True, null=True)
    ciudad = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cuentas_servicios'


class Cuentasplazas(models.Model):
    cod_empresa = models.ForeignKey(Cuentabancaria, db_column='cod_empresa')
    codbanco = models.CharField(max_length=3)
    cuentabanco = models.CharField(max_length=20)
    codplaza = models.CharField(max_length=4)
    dias = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    descrip = models.CharField(max_length=40, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cuentasplazas'
        unique_together = (('cod_empresa', 'codbanco', 'cuentabanco', 'codplaza'),)


class Cuotas(models.Model):
    cod_empresa = models.ForeignKey('Vtacab', db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fecha_emi = models.DateTimeField()
    fecha_ven = models.DateTimeField()
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda', blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    int_mora = models.DecimalField(max_digits=19, decimal_places=4)
    saldo = models.DecimalField(max_digits=19, decimal_places=4)
    cod_usuario = models.CharField(max_length=16)
    cod_vendedor = models.ForeignKey('Vendedor', db_column='cod_vendedor', blank=True, null=True)
    ubicacion = models.CharField(max_length=2, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    autorizado = models.CharField(max_length=1, blank=True, null=True)
    nroplanillaaso = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_concepcargo = models.CharField(max_length=3, blank=True, null=True)
    observ = models.CharField(max_length=80, blank=True, null=True)
    cod_cartera = models.CharField(max_length=3, blank=True, null=True)
    fecha_cobro = models.DateTimeField(blank=True, null=True)
    cod_con_vta = models.CharField(max_length=2, blank=True, null=True)
    cod_vendedor_sup = models.CharField(max_length=4, blank=True, null=True)
    cod_televendedor = models.CharField(max_length=4, blank=True, null=True)
    cod_analista = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cuotas'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_tp_comp', 'mvto_numero', 'cuota_numero'),)


class CuotasUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fecha_emi = models.DateTimeField()
    fecha_ven = models.DateTimeField()
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    int_mora = models.DecimalField(max_digits=19, decimal_places=4)
    saldo = models.DecimalField(max_digits=19, decimal_places=4)
    cod_usuario = models.CharField(max_length=16)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    ubicacion = models.CharField(max_length=2, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    autorizado = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cuotas_unif'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_tp_comp', 'mvto_numero', 'cuota_numero'),)


class Cuotasinteres(models.Model):
    cod_empresa = models.ForeignKey(Cuotas, db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0)
    linea = models.DecimalField(max_digits=2, decimal_places=0)
    importeinteres = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_tp_venta = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    exonerado = models.CharField(max_length=1, blank=True, null=True)
    motexonerado = models.CharField(max_length=80)
    montoexonerado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    estacion = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cuotasinteres'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_tp_comp', 'mvto_numero', 'cuota_numero', 'linea'),)


class Cupones(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    fecha = models.DateField(blank=True, null=True)
    cod_cliente = models.CharField(max_length=8)
    monto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cantcupones = models.IntegerField(blank=True, null=True)
    cod_usuario = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cupones'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero'),)


class CustomPermissionsCustompermissions(models.Model):

    class Meta:
        managed = False
        db_table = 'custom_permissions_custompermissions'


class Dctoartclte(models.Model):
    cod_empresa = models.ForeignKey(Clientes, db_column='cod_empresa')
    nrolinea = models.DecimalField(max_digits=25, decimal_places=0)
    cod_familia = models.ForeignKey('Individual', db_column='cod_familia', blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cod_tp_cliente = models.ForeignKey('Tpoclte', db_column='cod_tp_cliente', blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    descuento = models.DecimalField(max_digits=5, decimal_places=2)
    observ = models.CharField(max_length=100, blank=True, null=True)
    ordeval = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    listaprecio = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cod_con_vta = models.ForeignKey('Terminos', db_column='cod_con_vta', blank=True, null=True)
    pr_unit_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr_unit_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    factcambiocli = models.DecimalField(max_digits=6, decimal_places=0, blank=True, null=True)
    facturarpor = models.CharField(max_length=1, blank=True, null=True)
    cantitemsxfact = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    tipocriterio = models.CharField(max_length=1, blank=True, null=True)
    cod_tp_art = models.CharField(max_length=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'dctoartclte'
        unique_together = (('cod_empresa', 'nrolinea'),)


class Depcuenta(models.Model):
    cod_empresa = models.ForeignKey('Sucursal', db_column='cod_empresa')
    codbanco = models.CharField(max_length=3)
    cuentabanco = models.CharField(max_length=20)
    nrodeposito = models.CharField(max_length=20)
    fecha = models.DateTimeField(blank=True, null=True)
    cod_usuario = models.ForeignKey('Usuarios', db_column='cod_usuario', blank=True, null=True)
    preparadopor = models.CharField(max_length=40, blank=True, null=True)
    fechacarga = models.DateTimeField(blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'depcuenta'
        unique_together = (('cod_empresa', 'codbanco', 'cuentabanco', 'nrodeposito'),)


class Depcuentadet(models.Model):
    cod_empresa = models.ForeignKey('Recaudcab', db_column='cod_empresa')
    codbanco = models.CharField(max_length=3)
    cuentabanco = models.CharField(max_length=20)
    nrodeposito = models.CharField(max_length=20)
    linea = models.DecimalField(max_digits=5, decimal_places=0)
    codbancocheque = models.ForeignKey(Cheques, db_column='codbancocheque', blank=True, null=True)
    codplaza = models.CharField(max_length=4, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    tot_efectivo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    nrocheque = models.CharField(max_length=12, blank=True, null=True)
    lineacheque = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    fechaacreditacion = models.DateTimeField(blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fecharechazo = models.DateField(blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'depcuentadet'
        unique_together = (('cod_empresa', 'codbanco', 'cuentabanco', 'nrodeposito', 'linea'),)


class Deposito(models.Model):
    cod_empresa = models.ForeignKey('Sucursal', db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    des_deposito = models.CharField(max_length=30, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    ventas = models.CharField(max_length=1, blank=True, null=True)
    direccion = models.CharField(max_length=60, blank=True, null=True)
    cod_localidad = models.CharField(max_length=3, blank=True, null=True)
    cod_tp_deposito = models.CharField(max_length=4, blank=True, null=True)
    responsable = models.CharField(max_length=60, blank=True, null=True)
    tpocbte_habilitados = models.CharField(max_length=300, blank=True, null=True)
    compras = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'deposito'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_deposito'),)


class DepositoTmp(models.Model):
    coddepactual = models.CharField(primary_key=True, max_length=15)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    descrip = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'deposito_tmp'


class DescargaCab(models.Model):
    nro_descarga = models.DecimalField(max_digits=10, decimal_places=0)
    cod_empresa = models.ForeignKey('Vtacab', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    fecha = models.DateTimeField(blank=True, null=True)
    cod_usuario = models.CharField(max_length=16)
    estado = models.CharField(max_length=3)

    class Meta:
        managed = False
        db_table = 'descarga_cab'
        unique_together = (('nro_descarga', 'cod_empresa'),)


class Despacho(models.Model):
    cod_empresa = models.ForeignKey('Proveed', db_column='cod_empresa')
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    coddespachante = models.CharField(max_length=4)
    nrodespacho = models.DecimalField(max_digits=7, decimal_places=0)
    fechadespacho = models.DateTimeField()
    descrip = models.CharField(max_length=40, blank=True, null=True)
    transporte = models.CharField(max_length=40, blank=True, null=True)
    valorimponible = models.DecimalField(max_digits=19, decimal_places=4)
    notadepfiscal = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fechafiniquito = models.DateTimeField(blank=True, null=True)
    aduana = models.CharField(max_length=60)
    nroentrada = models.CharField(max_length=20)
    paisorigen = models.ForeignKey('Pais', db_column='paisorigen')
    registroentnro = models.CharField(max_length=20)
    fechareg = models.DateTimeField()
    pesoneto = models.DecimalField(max_digits=10, decimal_places=2)
    pesobruto = models.DecimalField(max_digits=10, decimal_places=2)
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda')
    factcambio = models.DecimalField(max_digits=19, decimal_places=4)
    nroliquid = models.CharField(max_length=20, blank=True, null=True)
    fechaliquid = models.DateTimeField(blank=True, null=True)
    totalexento = models.DecimalField(max_digits=19, decimal_places=4)
    totalgravado = models.DecimalField(max_digits=19, decimal_places=4)
    totaliva = models.DecimalField(max_digits=19, decimal_places=4)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ley60_90 = models.CharField(max_length=1)
    nrodecreto = models.CharField(max_length=20, blank=True, null=True)
    tasacambio = models.DecimalField(max_digits=19, decimal_places=4)
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    tasavi = models.DecimalField(max_digits=5, decimal_places=2)
    valorimpdecreto = models.DecimalField(max_digits=19, decimal_places=4)
    tasavid = models.DecimalField(max_digits=5, decimal_places=2)
    regimennormal = models.CharField(max_length=1)
    nropedido = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nrosolicitud = models.CharField(max_length=20, blank=True, null=True)
    nroordcomp = models.CharField(max_length=20, blank=True, null=True)
    nroop = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    tasacambiocostome = models.DecimalField(max_digits=19, decimal_places=4)
    codmonedacostome = models.CharField(max_length=2)
    codmonedafleteseg = models.CharField(max_length=2)
    totalflete = models.DecimalField(max_digits=19, decimal_places=4)
    totalseguro = models.DecimalField(max_digits=19, decimal_places=4)
    getfactor_gastimp = models.CharField(max_length=1)
    asentadocierre = models.CharField(max_length=1)
    nrotransaccierre = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    valorimponible_otros = models.FloatField()

    class Meta:
        managed = False
        db_table = 'despacho'
        unique_together = (('cod_empresa', 'anho', 'coddespachante', 'nrodespacho'),)


class Despfact(models.Model):
    cod_empresa = models.ForeignKey('Factcab', db_column='cod_empresa')
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    coddespachante = models.CharField(max_length=4)
    nrodespacho = models.DecimalField(max_digits=7, decimal_places=0)
    codprov = models.CharField(max_length=4)
    cod_tp_comp = models.CharField(max_length=4)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0)
    af_exengrav = models.CharField(max_length=1)
    totalfact = models.DecimalField(max_digits=19, decimal_places=4)
    totalaplicado = models.DecimalField(max_digits=19, decimal_places=4)
    porcaplicado = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'despfact'
        unique_together = (('cod_empresa', 'anho', 'coddespachante', 'nrodespacho', 'codprov', 'cod_tp_comp', 'nrofact'),)


class Devolcab(models.Model):
    cod_empresa = models.ForeignKey('Factcab', db_column='cod_empresa')
    codprov = models.CharField(max_length=4)
    cod_tp_comp = models.CharField(max_length=4)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0)
    cod_empresadev = models.ForeignKey('Factcab', db_column='cod_empresadev')
    codprovdev = models.CharField(max_length=4)
    cod_tp_compdev = models.CharField(max_length=4)
    nrofactdev = models.DecimalField(max_digits=15, decimal_places=0)
    asentado = models.CharField(max_length=1)
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'devolcab'
        unique_together = (('cod_empresa', 'codprov', 'cod_tp_comp', 'nrofact', 'cod_empresadev', 'codprovdev', 'cod_tp_compdev', 'nrofactdev'),)


class Devoldet(models.Model):
    cod_empresa = models.ForeignKey('Plancta', db_column='cod_empresa')
    codprov = models.CharField(max_length=4)
    cod_tp_comp = models.CharField(max_length=4)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cod_empresadev = models.ForeignKey('Factdet', db_column='cod_empresadev')
    codprovdev = models.CharField(max_length=4)
    cod_tp_compdev = models.CharField(max_length=4, blank=True, null=True)
    nrofactdev = models.DecimalField(max_digits=15, decimal_places=0)
    lineadev = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4)
    preciocosto = models.DecimalField(max_digits=19, decimal_places=4)
    gravexen = models.CharField(max_length=1)
    total = models.DecimalField(max_digits=19, decimal_places=4)
    iva = models.DecimalField(max_digits=19, decimal_places=4)
    planctaart = models.CharField(max_length=11, blank=True, null=True)
    planauxart = models.CharField(max_length=11, blank=True, null=True)
    envactfijo = models.CharField(max_length=1)
    comentario = models.CharField(max_length=40, blank=True, null=True)
    descuentomonto = models.DecimalField(max_digits=19, decimal_places=4)
    recargomonto = models.DecimalField(max_digits=19, decimal_places=4)
    esmuestra = models.CharField(max_length=1)
    cantfaltante = models.DecimalField(max_digits=13, decimal_places=2)
    arancelcosto = models.CharField(max_length=1)
    periodo = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'devoldet'
        unique_together = (('cod_empresa', 'codprov', 'cod_tp_comp', 'nrofact', 'linea'),)


class Diascarpetas(models.Model):
    cod_empresa = models.ForeignKey(Carpetas, db_column='cod_empresa')
    cod_carpeta = models.CharField(max_length=8)
    cod_dia = models.CharField(max_length=8)
    des_dia = models.CharField(max_length=60)

    class Meta:
        managed = False
        db_table = 'diascarpetas'
        unique_together = (('cod_empresa', 'cod_carpeta', 'cod_dia'),)


class Diasvisita(models.Model):
    cod_empresa = models.ForeignKey('Empresa', db_column='cod_empresa')
    cod_dia = models.CharField(max_length=8)
    descrip = models.CharField(max_length=60, blank=True, null=True)
    tp_dias = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'diasvisita'
        unique_together = (('cod_empresa', 'cod_dia'),)


class Difasientoscab(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    nrocompr = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    origen = models.CharField(max_length=5, blank=True, null=True)
    debito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    credito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ok = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'difasientoscab'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', blank=True, null=True)
    user = models.ForeignKey(AuthUser)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Documcartacred(models.Model):
    cod_empresa = models.ForeignKey(Cartacredcab, db_column='cod_empresa')
    nrocarta = models.CharField(max_length=20)
    nrolinea = models.DecimalField(max_digits=5, decimal_places=0)
    documento = models.CharField(max_length=1500)

    class Meta:
        managed = False
        db_table = 'documcartacred'
        unique_together = (('cod_empresa', 'nrocarta', 'nrolinea'),)


class Dpto(models.Model):
    cod_empresa = models.ForeignKey('Sucursal', db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    coddpto = models.CharField(max_length=10)
    descrip = models.CharField(max_length=40)
    coddptopadre = models.CharField(max_length=10, blank=True, null=True)
    direccion = models.CharField(max_length=30, blank=True, null=True)
    categoria = models.CharField(max_length=15, blank=True, null=True)
    compras = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'dpto'
        unique_together = (('cod_empresa', 'cod_sucursal', 'coddpto'),)


class Dptopais(models.Model):
    codpais = models.ForeignKey('Pais', db_column='codpais')
    coddptopais = models.CharField(max_length=3)
    descrip = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'dptopais'
        unique_together = (('codpais', 'coddptopais'),)


class Empleados(models.Model):
    cod_empresa = models.ForeignKey('Empresa', db_column='cod_empresa')
    codempleado = models.CharField(max_length=6)
    apellidos = models.CharField(max_length=40)
    nombres = models.CharField(max_length=40)
    cedula = models.CharField(max_length=15, blank=True, null=True)
    fechanac = models.DateTimeField(blank=True, null=True)
    codprofesion = models.CharField(max_length=3, blank=True, null=True)
    sexo = models.CharField(max_length=1)
    estcivil = models.CharField(max_length=1)
    nroorden = models.DecimalField(max_digits=6, decimal_places=0)
    codpais = models.CharField(max_length=3, blank=True, null=True)
    coddptopais = models.CharField(max_length=3, blank=True, null=True)
    codciudad = models.CharField(max_length=3, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    telefono = models.CharField(max_length=40, blank=True, null=True)
    aportaips = models.CharField(max_length=1)
    nroips = models.CharField(max_length=20, blank=True, null=True)
    aportahac = models.CharField(max_length=1)
    nrohac = models.CharField(max_length=100, blank=True, null=True)
    nroctacte = models.CharField(max_length=20, blank=True, null=True)
    fechaentrada = models.DateTimeField(blank=True, null=True)
    fechaentips = models.DateTimeField(blank=True, null=True)
    fechaenthac = models.DateTimeField(blank=True, null=True)
    fechafinprueba = models.DateTimeField(blank=True, null=True)
    fechasalida = models.DateTimeField(blank=True, null=True)
    fechaultliq = models.DateTimeField(blank=True, null=True)
    fechacertif = models.DateTimeField(blank=True, null=True)
    trabajoant = models.CharField(max_length=40, blank=True, null=True)
    planctaantic = models.CharField(max_length=11, blank=True, null=True)
    planauxantic = models.CharField(max_length=11, blank=True, null=True)
    idiomas = models.CharField(max_length=40, blank=True, null=True)
    feccasamiento = models.DateTimeField(blank=True, null=True)
    nroboletasuf = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    paissufragio = models.CharField(max_length=3, blank=True, null=True)
    dptosufragio = models.CharField(max_length=3, blank=True, null=True)
    ciudadsufragio = models.CharField(max_length=3, blank=True, null=True)
    nrolibbaja = models.CharField(max_length=20, blank=True, null=True)
    clase = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    unidad = models.CharField(max_length=40, blank=True, null=True)
    motexonerac = models.CharField(max_length=50, blank=True, null=True)
    nrolibfam = models.CharField(max_length=20, blank=True, null=True)
    estudios = models.CharField(max_length=100, blank=True, null=True)
    gruposang = models.CharField(max_length=20, blank=True, null=True)
    nacionalidad = models.CharField(max_length=3, blank=True, null=True)
    jubilado = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'empleados'
        unique_together = (('cod_empresa', 'codempleado'),)


class Empresa(models.Model):
    cod_empresa = models.CharField(primary_key=True, max_length=2)
    iva = models.DecimalField(max_digits=4, decimal_places=2)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    des_empresa = models.CharField(max_length=30)
    direccion = models.CharField(max_length=30, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    monedalocal = models.ForeignKey('Moneda', db_column='monedalocal', blank=True, null=True)
    codgrupo = models.ForeignKey('self', db_column='codgrupo', blank=True, null=True)
    tipocontribuyente = models.CharField(max_length=1, blank=True, null=True)
    representantelegal = models.CharField(max_length=80, blank=True, null=True)
    rucrepresentantelegal = models.CharField(max_length=20, blank=True, null=True)
    importador = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'empresa'


class Entdoccab(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    nro_planilla = models.DecimalField(max_digits=7, decimal_places=0)
    cod_cobrador = models.ForeignKey(Cobrador, db_column='cod_cobrador')
    fecha = models.DateTimeField()
    cod_tp_pago = models.CharField(max_length=4, blank=True, null=True)
    cod_usuario = models.ForeignKey('Usuarios', db_column='cod_usuario', blank=True, null=True)
    cod_cajero = models.ForeignKey('Usuarios', db_column='cod_cajero', blank=True, null=True)
    tipo_planilla = models.CharField(max_length=1, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal_destino = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'entdoccab'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'nro_planilla'),)


class Entdocdet(models.Model):
    cod_empresa = models.ForeignKey('Pagarescab', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    nro_planilla = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    estado = models.CharField(max_length=1)
    observ = models.CharField(max_length=100)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    codtpcuota = models.CharField(max_length=4, blank=True, null=True)
    tot_efectivo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot_cheque = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot_tarjeta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    rendicionnro = models.DecimalField(max_digits=7, decimal_places=0)
    codbanco = models.ForeignKey(Cheques, db_column='codbanco', blank=True, null=True)
    nrocheque = models.CharField(max_length=12, blank=True, null=True)
    lineacheque = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cod_sucursal_destino = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp_pg = models.CharField(max_length=4, blank=True, null=True)
    mvto_numero_pg = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'entdocdet'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'nro_planilla', 'linea'),)


class Equipos(models.Model):
    timestamp = models.DateTimeField(blank=True, null=True)
    loggedonuser = models.CharField(max_length=255, blank=True, null=True)
    ipaddress = models.CharField(max_length=255, blank=True, null=True)
    domain = models.CharField(max_length=255, blank=True, null=True)
    osname = models.CharField(max_length=255, blank=True, null=True)
    osversion = models.CharField(max_length=255, blank=True, null=True)
    msofficeversion = models.CharField(max_length=255, blank=True, null=True)
    msofficefullname = models.CharField(max_length=255, blank=True, null=True)
    cpu = models.CharField(max_length=255, blank=True, null=True)
    cpudescription = models.CharField(max_length=255, blank=True, null=True)
    motherboard = models.CharField(max_length=255, blank=True, null=True)
    ram = models.CharField(max_length=255, blank=True, null=True)
    hdddiskspace = models.CharField(max_length=255, blank=True, null=True)
    hddsize = models.CharField(max_length=255, blank=True, null=True)
    windowsserialnumber = models.CharField(max_length=255, blank=True, null=True)
    windowsproductkey = models.CharField(max_length=255, blank=True, null=True)
    nroofharddrives = models.CharField(max_length=255, blank=True, null=True)
    macaddress = models.CharField(max_length=255, blank=True, null=True)
    nodename = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'equipos'


class Equivalenciacbtespalm(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_tp_comp_actual = models.CharField(max_length=4)
    cod_tp_comp_nuevo = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'equivalenciacbtespalm'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_tp_comp_actual'),)


class ErrMsg(models.Model):
    nro_err = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    table_name = models.CharField(max_length=30, blank=True, null=True)
    column_name = models.CharField(max_length=30, blank=True, null=True)
    err_msg = models.CharField(max_length=150, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'err_msg'


class Establecimiento(models.Model):
    cod_establecimiento = models.CharField(max_length=3)
    descrip = models.CharField(max_length=50, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2)

    class Meta:
        managed = False
        db_table = 'establecimiento'
        unique_together = (('cod_establecimiento', 'cod_sucursal', 'cod_empresa'),)


class Estaciones(models.Model):
    cod_empresa = models.CharField(max_length=2)
    estacion = models.CharField(max_length=80)
    descripcion = models.CharField(max_length=60, blank=True, null=True)
    area = models.CharField(max_length=60, blank=True, null=True)
    customer = models.CharField(max_length=1, blank=True, null=True)
    tara = models.CharField(max_length=1, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    show_menu_tv = models.CharField(max_length=1, blank=True, null=True)
    cerrarsistema = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'estaciones'
        unique_together = (('cod_empresa', 'estacion'),)


class Estacionescbtes(models.Model):
    cod_empresa = models.ForeignKey('Tpocbteseries', db_column='cod_empresa')
    estacion = models.CharField(max_length=80)
    cod_tp_comp = models.CharField(max_length=4)
    recibo_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    dw_name = models.CharField(max_length=40, blank=True, null=True)
    dw_name_int = models.CharField(max_length=40, blank=True, null=True)
    colaimpresion = models.CharField(max_length=250, blank=True, null=True)
    colaimpresion_int = models.CharField(max_length=250, blank=True, null=True)
    preview = models.CharField(max_length=1, blank=True, null=True)
    modcompnro = models.CharField(max_length=1, blank=True, null=True)
    nrocopiasprint = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    max_lin = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    autopago = models.CharField(max_length=1, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    autopagare = models.CharField(max_length=1, blank=True, null=True)
    diasdegracia = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    cod_establecimiento = models.CharField(max_length=3, blank=True, null=True)
    cod_ptoexpedicion = models.CharField(max_length=3, blank=True, null=True)
    modnuminterno = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'estacionescbtes'
        unique_together = (('cod_empresa', 'estacion', 'cod_tp_comp'),)


class Estacionesdepositos(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    estacion = models.CharField(max_length=80)
    origdestinotransf = models.CharField(max_length=1, blank=True, null=True)
    ventasstock = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'estacionesdepositos'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_deposito', 'estacion'),)


class Estacionestprecaudacion(models.Model):
    cod_empresa = models.CharField(max_length=2)
    estacion = models.CharField(max_length=80)
    cod_tp_pago = models.CharField(max_length=2)
    observ = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'estacionestprecaudacion'
        unique_together = (('cod_empresa', 'estacion', 'cod_tp_pago'),)


class Estacionesusuario(models.Model):
    cod_usuario = models.ForeignKey('Usuarios', db_column='cod_usuario', primary_key=True)
    cod_empresa = models.ForeignKey(Estaciones, db_column='cod_empresa', blank=True, null=True)
    estacion = models.CharField(max_length=80, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'estacionesusuario'


class Estadobienesaf(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    codestado = models.CharField(max_length=3)
    descrip = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'estadobienesaf'
        unique_together = (('cod_empresa', 'codestado'),)


class Estadorecepcion(models.Model):
    cod_empresa = models.CharField(max_length=2)
    codestadorecep = models.CharField(max_length=2)
    descrip = models.CharField(max_length=60, blank=True, null=True)
    activo = models.CharField(max_length=1, blank=True, null=True)
    cod_activ = models.CharField(max_length=4, blank=True, null=True)
    inserta_historico = models.CharField(max_length=1, blank=True, null=True)
    orden = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cod_grupo = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'estadorecepcion'
        unique_together = (('cod_empresa', 'codestadorecep'),)


class Evalcab(models.Model):
    cod_empresa = models.ForeignKey('Solcotiz', db_column='cod_empresa')
    codevaluac = models.CharField(max_length=8)
    codprov = models.CharField(max_length=4)
    codsolic = models.CharField(max_length=8)
    fechaeval = models.DateTimeField()
    totalexen = models.DecimalField(max_digits=19, decimal_places=4)
    totalgrav = models.DecimalField(max_digits=19, decimal_places=4)
    dcto = models.DecimalField(max_digits=5, decimal_places=2)
    subtotal = models.DecimalField(max_digits=19, decimal_places=4)
    iva = models.DecimalField(max_digits=19, decimal_places=4)
    porciva = models.DecimalField(max_digits=5, decimal_places=2)
    total = models.DecimalField(max_digits=19, decimal_places=4)
    contacto = models.CharField(max_length=40, blank=True, null=True)
    observ = models.CharField(max_length=40, blank=True, null=True)
    sistcontr = models.CharField(max_length=40, blank=True, null=True)
    anticipo = models.CharField(max_length=40, blank=True, null=True)
    formapago = models.CharField(max_length=40, blank=True, null=True)
    retencion = models.CharField(max_length=40, blank=True, null=True)
    fechaentrega = models.DateTimeField(blank=True, null=True)
    plazo = models.CharField(max_length=40, blank=True, null=True)
    lugarentr = models.CharField(max_length=40, blank=True, null=True)
    espectecn = models.CharField(max_length=40, blank=True, null=True)
    devolanticipo = models.CharField(max_length=40, blank=True, null=True)
    garantia = models.CharField(max_length=40, blank=True, null=True)
    factcambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    anombrede = models.CharField(max_length=40, blank=True, null=True)
    ruc = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'evalcab'
        unique_together = (('cod_empresa', 'codevaluac', 'codprov'),)


class Evaldet(models.Model):
    cod_empresa = models.ForeignKey(Evalcab, db_column='cod_empresa')
    codevaluac = models.CharField(max_length=8)
    codprov = models.CharField(max_length=4)
    nroitem = models.DecimalField(max_digits=3, decimal_places=0)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=2)
    elegir = models.CharField(max_length=1)
    marca = models.CharField(max_length=40, blank=True, null=True)
    precexen = models.DecimalField(max_digits=19, decimal_places=4)
    precgrav = models.DecimalField(max_digits=19, decimal_places=4)

    class Meta:
        managed = False
        db_table = 'evaldet'
        unique_together = (('cod_empresa', 'codevaluac', 'codprov', 'nroitem'),)


class Extcuenta(models.Model):
    cod_empresa = models.ForeignKey('Opcab', db_column='cod_empresa')
    codbanco = models.CharField(max_length=3)
    cuentabanco = models.CharField(max_length=20)
    extraccionnro = models.DecimalField(max_digits=10, decimal_places=0)
    tipoop = models.CharField(max_length=1, blank=True, null=True)
    nroop = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    nrocheque = models.CharField(max_length=12, blank=True, null=True)
    fechavtocheque = models.DateTimeField(blank=True, null=True)
    beneficiario = models.CharField(max_length=80, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    anulado = models.CharField(max_length=1, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'extcuenta'
        unique_together = (('cod_empresa', 'codbanco', 'cuentabanco', 'extraccionnro'),)


class FactInteres(models.Model):
    cod_empresa = models.ForeignKey(Articulo, db_column='cod_empresa')
    estacion = models.CharField(max_length=80)
    cod_tp_comp = models.CharField(max_length=4)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_con_vta = models.CharField(max_length=2, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    tipo_vta = models.CharField(max_length=2, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    cod_moneda = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_pago = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'fact_interes'
        unique_together = (('cod_empresa', 'estacion', 'cod_tp_comp'),)


class Factbascula(models.Model):
    cod_empresa = models.CharField(max_length=2)
    fact_fecha = models.DateTimeField()
    linea = models.DecimalField(max_digits=2, decimal_places=0)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_con_vta = models.CharField(max_length=2, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    list_precio = models.IntegerField(blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    precio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tara = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    bruto = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    neto = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    total = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'factbascula'
        unique_together = (('cod_empresa', 'fact_fecha', 'linea'),)


class Factcab(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    codprov = models.CharField(max_length=4)
    cod_tp_comp = models.CharField(max_length=4)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2)
    coddpto = models.CharField(max_length=10)
    tipocompra = models.CharField(max_length=1)
    codbanco = models.ForeignKey(Bancos, db_column='codbanco', blank=True, null=True)
    cod_con_vta = models.ForeignKey('Terminos', db_column='cod_con_vta')
    fechafact = models.DateTimeField()
    fechavto = models.DateTimeField()
    fechacarga = models.DateTimeField()
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda')
    factcambio = models.DecimalField(max_digits=19, decimal_places=4)
    multiplocosto = models.DecimalField(max_digits=19, decimal_places=4)
    totalexen = models.DecimalField(max_digits=19, decimal_places=4)
    totalgrav = models.DecimalField(max_digits=19, decimal_places=4)
    iva = models.DecimalField(max_digits=19, decimal_places=4)
    dcto = models.DecimalField(max_digits=5, decimal_places=2)
    saldo = models.DecimalField(max_digits=19, decimal_places=4)
    planctaprov = models.CharField(max_length=11, blank=True, null=True)
    planauxprov = models.CharField(max_length=11, blank=True, null=True)
    costogasto = models.CharField(max_length=1)
    asentado = models.CharField(max_length=1)
    ivaincluido = models.CharField(max_length=1)
    gravado = models.CharField(max_length=1)
    fondofijo = models.CharField(max_length=1)
    nroffijo = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    mesffijo = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    anhoffijo = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_compref = models.CharField(max_length=4, blank=True, null=True)
    nrofactref = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    nrorendicion = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    nroreferencia = models.CharField(max_length=20, blank=True, null=True)
    nrofactstr = models.CharField(max_length=20, blank=True, null=True)
    dctomontograv = models.DecimalField(max_digits=19, decimal_places=4)
    dctomontoexen = models.DecimalField(max_digits=19, decimal_places=4)
    dctomonto = models.DecimalField(max_digits=19, decimal_places=4)
    enviadoaf = models.CharField(max_length=1)
    codresponsable = models.CharField(max_length=4, blank=True, null=True)
    anho = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    nrodespacho = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    ajuste = models.DecimalField(max_digits=19, decimal_places=4)
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    nroordcomp = models.CharField(max_length=20, blank=True, null=True)
    fechaingreso = models.DateTimeField(blank=True, null=True)
    incluirextracto = models.CharField(max_length=1)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    facturado = models.CharField(max_length=1, blank=True, null=True)
    recargograv = models.DecimalField(max_digits=19, decimal_places=4)
    recargoexen = models.DecimalField(max_digits=19, decimal_places=4)
    pesoneto = models.DecimalField(max_digits=10, decimal_places=2)
    pesobruto = models.DecimalField(max_digits=10, decimal_places=2)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    tipoiva = models.CharField(max_length=1, blank=True, null=True)
    nro_ot = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    total_iva_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    dctomontoexen_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    dctomontograv_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ruc = models.CharField(max_length=15, blank=True, null=True)
    razonsocial = models.CharField(max_length=60, blank=True, null=True)
    gravado5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    gravado10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    timbrado = models.CharField(max_length=20, blank=True, null=True)
    codmonedacostome = models.CharField(max_length=2, blank=True, null=True)
    tasacambiocostome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montoretiva = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montoretrenta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_tp_compprof = models.CharField(max_length=4, blank=True, null=True)
    nrofactprof = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    origenprunit = models.CharField(max_length=1)
    anulado = models.CharField(max_length=1, blank=True, null=True)
    fecha_anulacion = models.DateTimeField(blank=True, null=True)
    usuario_anul = models.CharField(max_length=12, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'factcab'
        unique_together = (('cod_empresa', 'codprov', 'cod_tp_comp', 'nrofact'),)


class FactcabAudit(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    tipooper = models.CharField(max_length=1, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'factcab_audit'


class Factcamb(models.Model):
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda')
    fact_fecha = models.DateTimeField()
    factor = models.DecimalField(max_digits=19, decimal_places=4)
    factor_vendedor = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2)

    class Meta:
        managed = False
        db_table = 'factcamb'
        unique_together = (('codmoneda', 'fact_fecha', 'cod_empresa'),)


class Factdet(models.Model):
    cod_empresa = models.ForeignKey(Factcab, db_column='cod_empresa')
    codprov = models.CharField(max_length=4)
    cod_tp_comp = models.CharField(max_length=4)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=2)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4)
    preciocosto = models.DecimalField(max_digits=19, decimal_places=4)
    gravexen = models.CharField(max_length=1)
    total = models.DecimalField(max_digits=19, decimal_places=4)
    iva = models.DecimalField(max_digits=19, decimal_places=4)
    planctaart = models.CharField(max_length=11, blank=True, null=True)
    planauxart = models.CharField(max_length=11, blank=True, null=True)
    envactfijo = models.CharField(max_length=1)
    comentario = models.CharField(max_length=40, blank=True, null=True)
    descuentomonto = models.DecimalField(max_digits=19, decimal_places=4)
    recargomonto = models.DecimalField(max_digits=19, decimal_places=4)
    esmuestra = models.CharField(max_length=1)
    cantfaltante = models.DecimalField(max_digits=13, decimal_places=2)
    arancelcosto = models.CharField(max_length=1)
    costofob = models.DecimalField(max_digits=19, decimal_places=4)
    nro_ot = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    esgasto = models.CharField(max_length=1)
    ctaimpcurso = models.CharField(max_length=11, blank=True, null=True)
    auximpcurso = models.CharField(max_length=11, blank=True, null=True)
    porc_iva = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porcpartgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montopartgravado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    agregcostoantprorr = models.CharField(max_length=1)
    prorrateargastopor = models.CharField(max_length=1)
    m3 = models.DecimalField(max_digits=10, decimal_places=5)
    peso = models.DecimalField(max_digits=10, decimal_places=5)
    porcarancelario = models.DecimalField(max_digits=5, decimal_places=2)
    codinciso = models.ForeignKey('Rubrosiva', db_column='codinciso', blank=True, null=True)
    preciocostoml = models.DecimalField(max_digits=19, decimal_places=4)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'factdet'
        unique_together = (('cod_empresa', 'codprov', 'cod_tp_comp', 'nrofact', 'linea'),)


class Factgastosimp(models.Model):
    cod_empresa = models.ForeignKey(Factcab, db_column='cod_empresa')
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    coddespachante = models.CharField(max_length=4)
    nrodespacho = models.DecimalField(max_digits=7, decimal_places=0)
    codprov = models.CharField(max_length=4)
    cod_tp_comp = models.CharField(max_length=4)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0)
    codprovimp = models.CharField(max_length=4)
    cod_tp_compimp = models.CharField(max_length=4)
    nrofactimp = models.DecimalField(max_digits=15, decimal_places=0)

    class Meta:
        managed = False
        db_table = 'factgastosimp'
        unique_together = (('cod_empresa', 'anho', 'coddespachante', 'nrodespacho', 'codprov', 'cod_tp_comp', 'nrofact', 'codprovimp', 'cod_tp_compimp', 'nrofactimp'),)


class Factinteresparametros(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    estacion = models.CharField(max_length=80)
    cod_tp_comp = models.CharField(max_length=4)
    tpcomp_recibos = models.CharField(max_length=4)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_con_vta = models.CharField(max_length=2, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    tipo_vta = models.CharField(max_length=2, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    cod_moneda = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_pago = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    importe_minimo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'factinteresparametros'
        unique_together = (('cod_empresa', 'estacion', 'cod_tp_comp', 'tpcomp_recibos'),)


class Factmasivacab(models.Model):
    cod_empresa = models.ForeignKey('Sucursal', db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    nro_planilla = models.DecimalField(max_digits=7, decimal_places=0)
    cod_deposito = models.CharField(max_length=2)
    nombre_conductor = models.CharField(max_length=50, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    kilos_entrada = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    kilos_salida = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    docu_entrada = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    docu_salida = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    porc_entrada = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    porc_salida = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    densi_entrada = models.DecimalField(max_digits=7, decimal_places=3, blank=True, null=True)
    densi_salida = models.DecimalField(max_digits=7, decimal_places=3, blank=True, null=True)
    presion = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    temprataura = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    ctrolintplataforma = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    nro_remision = models.DecimalField(max_digits=14, decimal_places=0, blank=True, null=True)
    cod_vendedor = models.ForeignKey('Vendedor', db_column='cod_vendedor', blank=True, null=True)
    cod_cobrador = models.ForeignKey(Cobrador, db_column='cod_cobrador', blank=True, null=True)
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda', blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tipo_vta = models.ForeignKey('Tpovta', db_column='tipo_vta', blank=True, null=True)
    tipo_pago = models.CharField(max_length=1, blank=True, null=True)
    totalizador = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_con_vta = models.ForeignKey('Terminos', db_column='cod_con_vta', blank=True, null=True)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'factmasivacab'
        unique_together = (('cod_empresa', 'cod_sucursal', 'nro_planilla'),)


class Factmasivadet(models.Model):
    cod_empresa = models.ForeignKey(Factmasivacab, db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    nro_planilla = models.DecimalField(max_digits=7, decimal_places=0)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    nrotimb = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_establecimiento = models.CharField(max_length=3, blank=True, null=True)
    cod_ptoexpedicion = models.CharField(max_length=3, blank=True, null=True)
    cod_tipodoc = models.CharField(max_length=4, blank=True, null=True)
    cod_empresa_clte = models.ForeignKey('Tpocbte', db_column='cod_empresa_clte')
    cod_sucursal_clte = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    cod_con_vta = models.ForeignKey('Terminos', db_column='cod_con_vta')
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=14, decimal_places=0, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porcinicliente = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porcfincliente = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    totalcliente = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    porcinirotari = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porcfinrotari = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    totalrotariini = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    totalrotarifin = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'factmasivadet'
        unique_together = (('cod_empresa', 'cod_sucursal', 'nro_planilla', 'cod_tp_comp', 'comp_numero'),)


class Factmasivapagos(models.Model):
    cod_empresa = models.ForeignKey(Factmasivadet, db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    nro_planilla = models.DecimalField(max_digits=7, decimal_places=0)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cuota = models.DecimalField(max_digits=7, decimal_places=0)
    cod_empresa_clte = models.ForeignKey('Tporecaudacion', db_column='cod_empresa_clte')
    cod_sucursal_clte = models.CharField(max_length=2)
    cod_tp_pago = models.CharField(max_length=4)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0)
    codbanco = models.CharField(max_length=3, blank=True, null=True)
    cod_tp_recaud = models.CharField(max_length=2, blank=True, null=True)
    nrocheque = models.CharField(max_length=12, blank=True, null=True)
    fechaemi = models.DateTimeField(blank=True, null=True)
    fechavcto = models.DateTimeField(blank=True, null=True)
    aldia = models.CharField(max_length=1, blank=True, null=True)
    importecheque = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    importeefectivo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'factmasivapagos'
        unique_together = (('cod_empresa', 'cod_sucursal', 'nro_planilla', 'cod_tp_comp', 'comp_numero', 'cuota', 'cod_tp_pago', 'pago_numero'),)


class Factprovcuotas(models.Model):
    cod_empresa = models.ForeignKey(Factcab, db_column='cod_empresa')
    codprov = models.CharField(max_length=4)
    cod_tp_comp = models.CharField(max_length=4)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0)
    nrocuota = models.DecimalField(max_digits=5, decimal_places=0)
    fechavto = models.DateTimeField()
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda')
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    saldo = models.DecimalField(max_digits=19, decimal_places=4)
    observacion = models.CharField(max_length=250, blank=True, null=True)
    montoretiva = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montoretrenta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'factprovcuotas'
        unique_together = (('cod_empresa', 'codprov', 'cod_tp_comp', 'nrofact', 'nrocuota'),)


class FacturasImport(models.Model):
    cod_empresa = models.CharField(max_length=2)
    nrofiscal = models.DecimalField(max_digits=9, decimal_places=0)
    factura = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    bill_ac = models.CharField(max_length=11, blank=True, null=True)
    ac_name = models.CharField(max_length=100, blank=True, null=True)
    svc_no = models.CharField(max_length=25, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    descripcion = models.CharField(max_length=500, blank=True, null=True)
    monto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    iva = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montototal = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    factorcambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    direccion = models.CharField(max_length=200, blank=True, null=True)
    ciudad = models.CharField(max_length=200, blank=True, null=True)
    codlocalidad = models.CharField(max_length=3, blank=True, null=True)
    ruc = models.CharField(max_length=14, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'facturas_import'
        unique_together = (('cod_empresa', 'nrofiscal'),)


class Facturasclientes(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=15, blank=True, null=True)
    cantcomp = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'facturasclientes'


class Familia(models.Model):
    cod_familia = models.CharField(primary_key=True, max_length=4)
    des_familia = models.CharField(max_length=40)
    incremento1 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    incremento2 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    incremento3 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    incremento4 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    codlinea = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'familia'


class FamiliaSync(models.Model):
    cod_familia = models.CharField(max_length=4)
    des_familia = models.CharField(max_length=40)
    incremento1 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    incremento2 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    incremento3 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    incremento4 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'familia_sync'


class Flujocaja(models.Model):
    cod_empresa = models.CharField(max_length=2)
    codareafc = models.CharField(max_length=8)
    nombre = models.CharField(max_length=100)
    signo = models.CharField(max_length=1)
    calculoauxiliar = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'flujocaja'
        unique_together = (('cod_empresa', 'codareafc'),)


class Flujocajacab(models.Model):
    cod_empresa = models.CharField(max_length=2)
    nroflujo = models.CharField(max_length=8)
    baseanhodesde = models.DecimalField(max_digits=4, decimal_places=0)
    basemesdesde = models.DecimalField(max_digits=2, decimal_places=0)
    baseanhohasta = models.DecimalField(max_digits=4, decimal_places=0)
    basemeshasta = models.DecimalField(max_digits=2, decimal_places=0)
    antanhodesde = models.DecimalField(max_digits=4, decimal_places=0)
    antmesdesde = models.DecimalField(max_digits=2, decimal_places=0)
    antanhohasta = models.DecimalField(max_digits=4, decimal_places=0)
    antmeshasta = models.DecimalField(max_digits=2, decimal_places=0)
    observ = models.CharField(max_length=100, blank=True, null=True)
    periodobase = models.CharField(max_length=8)
    periodoant = models.CharField(max_length=8)

    class Meta:
        managed = False
        db_table = 'flujocajacab'
        unique_together = (('cod_empresa', 'nroflujo'),)


class Flujocajadet(models.Model):
    cod_empresa = models.CharField(max_length=2)
    nroflujo = models.CharField(max_length=8)
    codplancta = models.CharField(max_length=11)
    nombre = models.CharField(max_length=50)
    rango1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    rango2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    diferinicial = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    debito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    credito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    diferfinal = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codareafc = models.CharField(max_length=8, blank=True, null=True)
    observ = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'flujocajadet'
        unique_together = (('cod_empresa', 'nroflujo', 'codplancta'),)


class Fmtcheques(models.Model):
    codbanco = models.CharField(max_length=3)
    codmoneda = models.CharField(max_length=2)
    nroformato = models.DecimalField(max_digits=3, decimal_places=0)
    dwname = models.CharField(max_length=40, blank=True, null=True)
    descrip = models.CharField(max_length=40, blank=True, null=True)
    lenmonto = models.DecimalField(max_digits=3, decimal_places=0)
    lenleyenda1 = models.DecimalField(max_digits=3, decimal_places=0)
    lenleyenda2 = models.DecimalField(max_digits=3, decimal_places=0)
    fechavtocheque_x = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    fechavtocheque_y = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    razonsocial_x = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    razonsocial_y = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    concepto_x = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    concepto_y = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    totalimporte_x = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    totalimporte_y = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    strmonto_x = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    strmonto_y = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    dia_x = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    dia_y = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    mes_x = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    mes_y = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    anho_x = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    anho_y = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    beneficiario_x = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    beneficiario_y = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    numlet1_x = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    numlet1_y = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    numlet2_x = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    numlet2_y = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    nroop_x = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    nroop_y = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    nrocheque_x = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    nrocheque_y = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    estacion = models.CharField(max_length=4)
    fechavtocheque_v = models.CharField(max_length=1, blank=True, null=True)
    razonsocial_v = models.CharField(max_length=1, blank=True, null=True)
    concepto_v = models.CharField(max_length=1, blank=True, null=True)
    totalimporte_v = models.CharField(max_length=1, blank=True, null=True)
    strmonto_v = models.CharField(max_length=1, blank=True, null=True)
    dia_v = models.CharField(max_length=1, blank=True, null=True)
    mes_v = models.CharField(max_length=1, blank=True, null=True)
    anho_v = models.CharField(max_length=1, blank=True, null=True)
    beneficiario_v = models.CharField(max_length=1, blank=True, null=True)
    numlet1_v = models.CharField(max_length=1, blank=True, null=True)
    numlet2_v = models.CharField(max_length=1, blank=True, null=True)
    nroop_v = models.CharField(max_length=1, blank=True, null=True)
    nrocheque_v = models.CharField(max_length=1, blank=True, null=True)
    dia_emis_v = models.CharField(max_length=1, blank=True, null=True)
    mes_emis_v = models.CharField(max_length=1, blank=True, null=True)
    anho_emis_v = models.CharField(max_length=1, blank=True, null=True)
    dia_emis_x = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True)
    dia_emis_y = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True)
    mes_emis_x = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True)
    mes_emis_y = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True)
    anho_emis_x = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True)
    anho_emis_y = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True)
    colaimpresion = models.CharField(max_length=60, blank=True, null=True)
    talon = models.CharField(max_length=1, blank=True, null=True)
    fecha_x = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True)
    fecha_y = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True)
    fecha_v = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'fmtcheques'
        unique_together = (('codbanco', 'codmoneda', 'nroformato', 'estacion'),)


class Formulafila(models.Model):
    cod_empresa = models.ForeignKey(Conceptofila, db_column='cod_empresa')
    codinforme = models.CharField(max_length=5)
    fila = models.CharField(max_length=5)
    filaorigen = models.CharField(max_length=5)
    orden = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'formulafila'
        unique_together = (('cod_empresa', 'codinforme', 'fila', 'filaorigen'),)


class FuturaCobsucursal(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_cobrador = models.CharField(max_length=3)

    class Meta:
        managed = False
        db_table = 'futura_cobsucursal'


class Gestioncobro(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    cod_cobrador = models.CharField(max_length=3)
    fecha_llamada = models.DateTimeField()
    accion = models.CharField(max_length=1)
    fecha_accion = models.DateTimeField()
    observacion = models.CharField(max_length=250, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'gestioncobro'
        unique_together = (('cod_empresa', 'cod_cliente', 'cod_cobrador', 'fecha_llamada'),)


class Grupo(models.Model):
    cod_familia = models.ForeignKey(Familia, db_column='cod_familia')
    cod_grupo = models.CharField(max_length=4)
    des_grupo = models.CharField(max_length=40)
    codlinea = models.CharField(max_length=4, blank=True, null=True)
    partarancelaria = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True)
    cod_cnime = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'grupo'
        unique_together = (('cod_familia', 'cod_grupo'),)


class GrupoSync(models.Model):
    cod_familia = models.CharField(max_length=4)
    cod_grupo = models.CharField(max_length=4)
    des_grupo = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'grupo_sync'


class Grupoestadosrecep(models.Model):
    cod_grupo = models.CharField(primary_key=True, max_length=2)
    des_grupo = models.CharField(max_length=40, blank=True, null=True)
    cod_inicial = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'grupoestadosrecep'


class GruposTmp(models.Model):
    cod_familia = models.CharField(max_length=4)
    cod_grupo = models.CharField(max_length=4)
    des_grupo = models.CharField(max_length=60, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'grupos_tmp'
        unique_together = (('cod_familia', 'cod_grupo'),)


class Gruposanguineo(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_gruposanguineo = models.CharField(max_length=4)
    descripcion = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'gruposanguineo'
        unique_together = (('cod_empresa', 'cod_gruposanguineo'),)


class Histprecios(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    pr1_gsold = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr1_gsnew = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr2_gsold = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr2_gsnew = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr3_gsold = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr3_gsnew = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr4_gsold = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr4_gsnew = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_gsold = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_gsnew = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_gsold = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_gsnew = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr1_meold = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr1_menew = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr2_meold = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr2_menew = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr3_meold = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr3_menew = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr4_meold = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr4_menew = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_meold = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_menew = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_meold = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_menew = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    listaventaold = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    listaventanew = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    actcaja7453 = models.CharField(max_length=1, blank=True, null=True)
    actcaja2123 = models.CharField(max_length=1, blank=True, null=True)
    actfilizzola = models.CharField(max_length=1, blank=True, null=True)
    flejeimpreso = models.CharField(max_length=1, blank=True, null=True)
    usuario = models.CharField(max_length=16, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'histprecios'


class Incprecios(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa', blank=True, null=True)
    cod_familia = models.ForeignKey('Individual', db_column='cod_familia', blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    fechadesde = models.DateTimeField(blank=True, null=True)
    listaprecio = models.IntegerField(blank=True, null=True)
    incremento = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    basadoen = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    prevdcto = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    moneda = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'incprecios'


class Indicegral(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    tipo = models.CharField(max_length=1)
    enero = models.DecimalField(max_digits=10, decimal_places=5)
    febrero = models.DecimalField(max_digits=10, decimal_places=5)
    marzo = models.DecimalField(max_digits=10, decimal_places=5)
    abril = models.DecimalField(max_digits=10, decimal_places=5)
    mayo = models.DecimalField(max_digits=10, decimal_places=5)
    junio = models.DecimalField(max_digits=10, decimal_places=5)
    julio = models.DecimalField(max_digits=10, decimal_places=5)
    agosto = models.DecimalField(max_digits=10, decimal_places=5)
    setiembre = models.DecimalField(max_digits=10, decimal_places=5)
    octubre = models.DecimalField(max_digits=10, decimal_places=5)
    noviembre = models.DecimalField(max_digits=10, decimal_places=5)
    diciembre = models.DecimalField(max_digits=10, decimal_places=5)
    ultmesprocesado = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'indicegral'
        unique_together = (('cod_empresa', 'anho', 'tipo'),)


class Individual(models.Model):
    cod_familia = models.ForeignKey('Subgrupo', db_column='cod_familia')
    cod_grupo = models.CharField(max_length=4)
    cod_subgrupo = models.CharField(max_length=4)
    cod_individual = models.CharField(max_length=4)
    des_individual = models.CharField(max_length=40)
    codlinea = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'individual'
        unique_together = (('cod_familia', 'cod_grupo', 'cod_subgrupo', 'cod_individual'),)


class IndividualSync(models.Model):
    cod_familia = models.CharField(max_length=4)
    cod_grupo = models.CharField(max_length=4)
    cod_subgrupo = models.CharField(max_length=4)
    cod_individual = models.CharField(max_length=4)
    des_individual = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'individual_sync'


class Interconexiones(models.Model):
    sistema = models.CharField(primary_key=True, max_length=10)
    dsn = models.CharField(max_length=20, blank=True, null=True)
    usuario = models.CharField(max_length=16, blank=True, null=True)
    clave = models.CharField(max_length=16, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'interconexiones'


class Invconsigcab(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    cod_tp_cons = models.CharField(max_length=4)
    cons_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda', blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    fechainv = models.DateTimeField(blank=True, null=True)
    responsable = models.CharField(max_length=60, blank=True, null=True)
    observ = models.CharField(max_length=200, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'invconsigcab'
        unique_together = (('cod_empresa', 'cod_tp_cons', 'cons_numero'),)


class Invconsigdet(models.Model):
    cod_empresa = models.ForeignKey('Vtadet', db_column='cod_empresa')
    cod_tp_cons = models.CharField(max_length=4)
    cons_numero = models.DecimalField(max_digits=7, decimal_places=0)
    lnconsig = models.DecimalField(max_digits=3, decimal_places=0)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    linea = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    observ = models.CharField(max_length=200, blank=True, null=True)
    total = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'invconsigdet'
        unique_together = (('cod_empresa', 'cod_tp_cons', 'cons_numero', 'lnconsig'),)


class Inventarioaf(models.Model):
    cod_empresa = models.ForeignKey('Ubicacion', db_column='cod_empresa')
    codinventario = models.CharField(max_length=20)
    codinvpadre = models.CharField(max_length=20, blank=True, null=True)
    nivel = models.DecimalField(max_digits=1, decimal_places=0)
    fechacompra = models.DateTimeField(blank=True, null=True)
    codubicacion = models.CharField(max_length=14, blank=True, null=True)
    codresponsable = models.CharField(max_length=4, blank=True, null=True)
    cantestim = models.DecimalField(max_digits=7, decimal_places=0)
    cantimpreso = models.DecimalField(max_digits=7, decimal_places=0)
    cantinvent = models.DecimalField(max_digits=7, decimal_places=0)
    etiqimpresa = models.CharField(max_length=1)
    costocompra = models.DecimalField(max_digits=19, decimal_places=4)
    costocomprame = models.DecimalField(max_digits=19, decimal_places=4)
    fechaultinv = models.DateTimeField(blank=True, null=True)
    codmarca = models.CharField(max_length=4, blank=True, null=True)
    modelo = models.CharField(max_length=25, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    nroserie = models.CharField(max_length=20, blank=True, null=True)
    descrip = models.CharField(max_length=80)
    observ = models.CharField(max_length=250, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'inventarioaf'
        unique_together = (('cod_empresa', 'codinventario'),)


class Inventariobien(models.Model):
    cod_empresa = models.ForeignKey(Inventarioaf, db_column='cod_empresa')
    codinventario = models.CharField(max_length=20)
    codactivo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=7, decimal_places=0)
    costocompra = models.DecimalField(max_digits=19, decimal_places=4)
    costocomprame = models.DecimalField(max_digits=19, decimal_places=4)
    observ = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'inventariobien'
        unique_together = (('cod_empresa', 'codinventario', 'codactivo'),)


class Inventariodet(models.Model):
    cod_empresa = models.ForeignKey('Ubicacion', db_column='cod_empresa')
    codinventario = models.CharField(max_length=20)
    fechainv = models.DateTimeField()
    codresponsable = models.CharField(max_length=4, blank=True, null=True)
    nrocbtecontrol = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=7, decimal_places=0)
    observ = models.CharField(max_length=250)
    codubicacion = models.CharField(max_length=14, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'inventariodet'
        unique_together = (('cod_empresa', 'codinventario', 'fechainv'),)


class Inventhist(models.Model):
    cod_empresa = models.ForeignKey('Mvtoinvcab', db_column='cod_empresa')
    codinventario = models.CharField(max_length=20)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    codinventariodet = models.CharField(max_length=20)
    tpdef = models.CharField(max_length=1)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    nromvto = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'inventhist'
        unique_together = (('cod_empresa', 'codinventario', 'linea'),)


class Linea(models.Model):
    cod_empresa = models.CharField(max_length=2)
    codlinea = models.CharField(max_length=8)
    descrip = models.CharField(max_length=60)
    densidad = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    pr1_m3_ml = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr2_m3_ml = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr3_m3_ml = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr4_m3_ml = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr1_m3_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr2_m3_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr3_m3_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr4_m3_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    partidad_arancelaria = models.CharField(max_length=20, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_art = models.CharField(max_length=2, blank=True, null=True)
    cod_moneda = models.CharField(max_length=4, blank=True, null=True)
    unidad = models.CharField(max_length=4, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    partida_arancelaria = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'linea'
        unique_together = (('cod_empresa', 'codlinea'),)


class Liqtarjcab(models.Model):
    cod_empresa = models.ForeignKey('Plancta', db_column='cod_empresa')
    codprov = models.CharField(max_length=4)
    nroliq = models.DecimalField(max_digits=7, decimal_places=0)
    planctaprov = models.CharField(max_length=11)
    planauxprov = models.CharField(max_length=11)
    cod_tarjeta = models.ForeignKey('Tarjetas', db_column='cod_tarjeta')
    nrocbte = models.CharField(max_length=20, blank=True, null=True)
    nroextracto = models.DecimalField(max_digits=7, decimal_places=0)
    fechaliq = models.DateTimeField()
    nroorden = models.DecimalField(max_digits=7, decimal_places=0)
    codcomercio = models.CharField(max_length=20, blank=True, null=True)
    planctabanco = models.CharField(max_length=11)
    planauxbanco = models.CharField(max_length=11)
    nrocheque = models.CharField(max_length=12, blank=True, null=True)
    codmoneda = models.ForeignKey('Moneda', db_column='codmoneda')
    factcambio = models.DecimalField(max_digits=19, decimal_places=4)
    recibidopor = models.CharField(max_length=40, blank=True, null=True)
    cedula = models.CharField(max_length=20, blank=True, null=True)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    libroiva = models.CharField(max_length=1, blank=True, null=True)
    costogasto = models.CharField(max_length=1, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    timbrado = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'liqtarjcab'
        unique_together = (('cod_empresa', 'codprov', 'nroliq'),)


class Liqtarjdet(models.Model):
    cod_empresa = models.ForeignKey('Plancta', db_column='cod_empresa')
    codprov = models.CharField(max_length=4)
    nroliq = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    fechadeposito = models.DateTimeField()
    fechacredito = models.DateTimeField()
    nrocupon = models.CharField(max_length=20)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    descuento = models.DecimalField(max_digits=19, decimal_places=4)
    iva = models.DecimalField(max_digits=19, decimal_places=4)
    codplancta = models.CharField(max_length=11)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    concepto = models.CharField(max_length=40, blank=True, null=True)
    montoretencion = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ivaretencion = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'liqtarjdet'
        unique_together = (('cod_empresa', 'codprov', 'nroliq', 'linea'),)


class Liquidacion(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    coddespachante = models.CharField(max_length=4)
    nrodespacho = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    codarancel = models.CharField(max_length=5)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    fechacbte = models.DateTimeField()
    nrocbte = models.DecimalField(max_digits=15, decimal_places=0)
    af_costos = models.CharField(max_length=1)
    exento = models.DecimalField(max_digits=19, decimal_places=4)
    gravado = models.DecimalField(max_digits=19, decimal_places=4)
    iva = models.DecimalField(max_digits=19, decimal_places=4)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    concepto = models.CharField(max_length=60, blank=True, null=True)
    libroiva = models.CharField(max_length=1, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    timbrado = models.CharField(max_length=20, blank=True, null=True)
    tipo_iva = models.CharField(max_length=1)
    totalaplicado = models.DecimalField(max_digits=19, decimal_places=4)
    af_valorimponible = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'liquidacion'
        unique_together = (('cod_empresa', 'anho', 'coddespachante', 'nrodespacho', 'linea'),)


class Listaprecio(models.Model):
    list_precio = models.IntegerField()
    list_nombre = models.CharField(max_length=15)
    estado = models.CharField(max_length=1, blank=True, null=True)
    vtaminima_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    vtaminima_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porccomis = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomiscobro = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'listaprecio'


class Localida(models.Model):
    cod_localidad = models.CharField(max_length=3)
    des_localidad = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'localida'


class LocalidaSync(models.Model):
    cod_localidad = models.CharField(max_length=3)
    des_localidad = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'localida_sync'


class Logaccesos(models.Model):
    cod_usuario = models.ForeignKey('Usuarios', db_column='cod_usuario')
    nrosecuencia = models.DecimalField(max_digits=9, decimal_places=0)
    fechahoraini = models.DateTimeField()
    fechahorafin = models.DateTimeField(blank=True, null=True)
    observ = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'logaccesos'
        unique_together = (('cod_usuario', 'nrosecuencia'),)


class Lstcashflow(models.Model):
    cod_empresa = models.CharField(max_length=2)
    descrip = models.CharField(max_length=30)
    periodo = models.CharField(max_length=8)
    codplancta = models.CharField(max_length=11)
    tipocta = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'lstcashflow'
        unique_together = (('cod_empresa', 'descrip', 'periodo', 'codplancta'),)


class Lugartrab(models.Model):
    codlugartrab = models.CharField(primary_key=True, max_length=6)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    empleador = models.CharField(max_length=50, blank=True, null=True)
    descrip = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'lugartrab'


class MapeoAso20061016Tmp(models.Model):
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    cod_original = models.CharField(max_length=25, blank=True, null=True)
    cedula = models.CharField(max_length=25, blank=True, null=True)
    cliente_padre_actual = models.CharField(max_length=8, blank=True, null=True)
    cod_asociacion = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mapeo_aso_20061016_tmp'


class Marca(models.Model):
    codmarca = models.CharField(primary_key=True, max_length=4)
    descrip = models.CharField(max_length=40)
    cod_empresa = models.CharField(max_length=2)

    class Meta:
        managed = False
        db_table = 'marca'


class Medicionentregas(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_reparto = models.CharField(max_length=4)
    nro_reparto = models.DecimalField(max_digits=9, decimal_places=0)
    fecha = models.DateTimeField(blank=True, null=True)
    cod_camion = models.CharField(max_length=8, blank=True, null=True)
    nro_chofer = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cod_ayudante = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=100, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    tipo_vendedor = models.CharField(max_length=2, blank=True, null=True)
    total_venta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_tp_solcred = models.CharField(max_length=4, blank=True, null=True)
    numero_solcred = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    recepcioncliente = models.DateTimeField(blank=True, null=True)
    ingresosolicitud = models.DateTimeField(blank=True, null=True)
    aprobacionsolicitud = models.DateTimeField(blank=True, null=True)
    grabarfactura = models.DateTimeField(blank=True, null=True)
    imprimirfactura = models.DateTimeField(blank=True, null=True)
    entregacliente = models.DateTimeField(blank=True, null=True)
    pendiente_el = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'medicionentregas'
        unique_together = (('cod_empresa', 'cod_tp_reparto', 'nro_reparto', 'cod_tp_comp', 'comp_numero'),)


class Menugrant(models.Model):
    userid = models.CharField(max_length=16)
    menuid = models.CharField(max_length=64)
    descmenu = models.CharField(max_length=100, blank=True, null=True)
    sistema = models.CharField(max_length=16)

    class Meta:
        managed = False
        db_table = 'menugrant'
        unique_together = (('userid', 'menuid', 'sistema'),)


class Meses(models.Model):
    mes = models.DecimalField(primary_key=True, max_digits=2, decimal_places=0)
    descrip = models.CharField(max_length=15)

    class Meta:
        managed = False
        db_table = 'meses'


class Modelo(models.Model):
    codmodelo = models.CharField(primary_key=True, max_length=4)
    descrip = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'modelo'


class Modimpositiva(models.Model):
    codmodalidad = models.CharField(primary_key=True, max_length=4)
    fecha = models.DateTimeField(blank=True, null=True)
    descrip = models.CharField(max_length=40, blank=True, null=True)
    regturismo = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'modimpositiva'


class Moneda(models.Model):
    codmoneda = models.CharField(primary_key=True, max_length=2)
    formula = models.CharField(max_length=10, blank=True, null=True)
    simbolo = models.CharField(max_length=3)
    factcambio = models.DecimalField(max_digits=6, decimal_places=2)
    descrip = models.CharField(max_length=20)
    cantdecimal = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    subdenominacion = models.CharField(max_length=20, blank=True, null=True)
    valorminimo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valormaximo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    chequedesde = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    chequehasta = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'moneda'


class Motivosrechazo(models.Model):
    codigorechazo = models.CharField(primary_key=True, max_length=3)
    descripcion = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'motivosrechazo'


class Mvtobiencab(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    nromvto = models.DecimalField(max_digits=7, decimal_places=0)
    fechamvto = models.DateTimeField()
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda', blank=True, null=True)
    factcambio = models.DecimalField(max_digits=19, decimal_places=4)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_compfact = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    rubrodestino = models.CharField(max_length=11, blank=True, null=True)
    subrubrodestino = models.CharField(max_length=11, blank=True, null=True)
    rubroorigen = models.CharField(max_length=11, blank=True, null=True)
    subrubroorigen = models.CharField(max_length=11, blank=True, null=True)
    ubicorigen = models.CharField(max_length=14, blank=True, null=True)
    ubicdestino = models.CharField(max_length=14, blank=True, null=True)
    codresponsable = models.CharField(max_length=4, blank=True, null=True)
    enviadoa = models.CharField(max_length=60, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    remitente = models.CharField(max_length=60, blank=True, null=True)
    motivomvto = models.CharField(max_length=60, blank=True, null=True)
    talonvtadesde = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    talonvtahasta = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    recibidopor = models.CharField(max_length=60, blank=True, null=True)
    fecharecepcion = models.DateTimeField(blank=True, null=True)
    autorizado = models.CharField(max_length=1)
    asentado = models.CharField(max_length=1)
    cod_tp_comp_vta = models.CharField(max_length=4, blank=True, null=True)
    comp_numero_vta = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    observ = models.CharField(max_length=60, blank=True, null=True)
    nroorden = models.DecimalField(max_digits=5, decimal_places=0)
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mvtobiencab'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'nromvto'),)


class Mvtobiendet(models.Model):
    cod_empresa = models.ForeignKey(Mvtobiencab, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    nromvto = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=5, decimal_places=0)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    codactivo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=5, decimal_places=0)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    iva = models.DecimalField(max_digits=19, decimal_places=4)
    observ = models.CharField(max_length=60, blank=True, null=True)
    importeme = models.DecimalField(max_digits=19, decimal_places=4)
    cantidad_ant = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    estado_ant = models.CharField(max_length=1, blank=True, null=True)
    cod_articulo_ant = models.CharField(max_length=14, blank=True, null=True)
    codresponsable_ant = models.CharField(max_length=4, blank=True, null=True)
    codprov_ant = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_comp_ant = models.CharField(max_length=4, blank=True, null=True)
    nrofact_ant = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fechacompra_ant = models.DateTimeField(blank=True, null=True)
    fechaalta_ant = models.DateTimeField(blank=True, null=True)
    fechainiproc_ant = models.DateTimeField(blank=True, null=True)
    fechafinactivo_ant = models.DateTimeField(blank=True, null=True)
    revaluable_ant = models.CharField(max_length=1, blank=True, null=True)
    depreciable_ant = models.CharField(max_length=1, blank=True, null=True)
    costocompra_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorreval_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacum_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumini_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractual_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    retasacion_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactual_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumini_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costocomprame_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalme_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumme_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacuminime_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractualme_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    retasacionme_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactualme_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajusteme_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumme_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacuminime_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    vidautil_ant = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    vidautilrestante_ant = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    fechaalta_2_ant = models.DateTimeField(blank=True, null=True)
    fechainiproc_2_ant = models.DateTimeField(blank=True, null=True)
    vidautil_2_ant = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    vidautilrestante_2_ant = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    valorreval_2_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacum_2_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumini_2_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractual_2_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactual_2_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste_2_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum_2_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumini_2_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalme_2_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumme_2_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacuminime_2_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractualme_2_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactualme_2_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajusteme_2_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumme_2_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacuminime_2_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fechaalta_3_ant = models.DateTimeField(blank=True, null=True)
    fechainiproc_3_ant = models.DateTimeField(blank=True, null=True)
    vidautil_3_ant = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    vidautilrestante_3_ant = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    valorreval_3_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacum_3_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumini_3_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractual_3_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactual_3_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste_3_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum_3_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumini_3_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalme_3_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumme_3_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacuminime_3_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractualme_3_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactualme_3_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajusteme_3_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumme_3_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacuminime_3_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    incidencia = models.DecimalField(max_digits=15, decimal_places=10)

    class Meta:
        managed = False
        db_table = 'mvtobiendet'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'nromvto', 'linea'),)


class Mvtoinvcab(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    nromvto = models.DecimalField(max_digits=7, decimal_places=0)
    fechamvto = models.DateTimeField()
    codprov = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_compfact = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    ubicorigen = models.CharField(max_length=14, blank=True, null=True)
    ubicdestino = models.CharField(max_length=14, blank=True, null=True)
    codresponsable = models.CharField(max_length=4, blank=True, null=True)
    codresponsable2 = models.CharField(max_length=4, blank=True, null=True)
    codresponsable3 = models.CharField(max_length=4, blank=True, null=True)
    cargoresp = models.CharField(max_length=40, blank=True, null=True)
    cargoresp2 = models.CharField(max_length=40, blank=True, null=True)
    cargoresp3 = models.CharField(max_length=40, blank=True, null=True)
    autorizado = models.CharField(max_length=1)
    observ = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mvtoinvcab'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'nromvto'),)


class Mvtoinvdet(models.Model):
    cod_empresa = models.ForeignKey(Inventarioaf, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    nromvto = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    codinventario = models.CharField(max_length=20, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=7, decimal_places=0)
    nroserie = models.CharField(max_length=20, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    importeme = models.DecimalField(max_digits=19, decimal_places=4)
    observ = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mvtoinvdet'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'nromvto', 'linea'),)


class Nombresobjbd(models.Model):
    tipoobj = models.CharField(max_length=1)
    nombreobj = models.CharField(max_length=50)
    tipouso = models.CharField(max_length=1)
    descrip = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'nombresobjbd'
        unique_together = (('tipoobj', 'nombreobj'),)


class Notacredprov(models.Model):
    cod_empresa = models.ForeignKey(Factcab, db_column='cod_empresa')
    codprov = models.CharField(max_length=4)
    cod_tp_compnc = models.CharField(max_length=4)
    nrofactnc = models.DecimalField(max_digits=15, decimal_places=0)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    anho = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    coddespachante = models.CharField(max_length=4, blank=True, null=True)
    nrodespacho = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nrocuota = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'notacredprov'


class Notapedcab(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_sucursal2 = models.CharField(max_length=2, blank=True, null=True)
    fha_mvto = models.DateTimeField()
    cod_deposito2 = models.CharField(max_length=2, blank=True, null=True)
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda', blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    tot_importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16)
    des_movimiento = models.CharField(max_length=60, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    tipo_iva = models.CharField(max_length=1, blank=True, null=True)
    nropedido = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    impreso = models.CharField(max_length=1)
    anulado = models.CharField(max_length=1)
    cod_deposito_anul = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp_anul = models.CharField(max_length=4, blank=True, null=True)
    comp_numero_anul = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    responsable = models.CharField(max_length=8, blank=True, null=True)
    sectorfacturacion = models.CharField(max_length=12, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    cod_camion = models.CharField(max_length=8, blank=True, null=True)
    nro_chofer = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    nrotimb = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_establecimiento = models.CharField(max_length=3, blank=True, null=True)
    cod_ptoexpedicion = models.CharField(max_length=3, blank=True, null=True)
    cod_tipodoc = models.CharField(max_length=4, blank=True, null=True)
    comp_nro_timb = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    comp_numero1desde = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    comp_numero1hasta = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    comp_numero2desde = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    comp_numero2hasta = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    direccion = models.CharField(max_length=100, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'notapedcab'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero'),)


class Notapeddet(models.Model):
    cod_empresa = models.ForeignKey(Artdep, db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4)
    rf_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    concepto = models.CharField(max_length=60, blank=True, null=True)
    planctaart = models.CharField(max_length=11, blank=True, null=True)
    planauxart = models.CharField(max_length=11, blank=True, null=True)
    pr_vta = models.DecimalField(max_digits=19, decimal_places=4)
    cantcajas = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    listaventa = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    listaprec = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    tp_presup = models.CharField(max_length=4, blank=True, null=True)
    nro_presup = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    faltante = models.DecimalField(max_digits=13, decimal_places=3)
    linea_presup = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    ordenfact = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    peso_bruto = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    peso_tara = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    peso_promedio = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    cod_taras = models.CharField(max_length=24, blank=True, null=True)
    codmarca = models.CharField(max_length=4, blank=True, null=True)
    codmodelo = models.CharField(max_length=4, blank=True, null=True)
    nrochasis = models.CharField(max_length=20, blank=True, null=True)
    nromotor = models.CharField(max_length=30, blank=True, null=True)
    color = models.CharField(max_length=30, blank=True, null=True)
    anho = models.CharField(max_length=30, blank=True, null=True)
    cod_sucursal2 = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito2 = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'notapeddet'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'linea'),)


class Opcab(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    tipoop = models.CharField(max_length=1)
    nroop = models.DecimalField(max_digits=7, decimal_places=0)
    cod_tp_comp = models.CharField(max_length=4)
    fecha = models.DateTimeField()
    codprov = models.CharField(max_length=4, blank=True, null=True)
    impreso = models.CharField(max_length=1)
    anulado = models.CharField(max_length=1)
    autorizado = models.CharField(max_length=1)
    asentado = models.CharField(max_length=1)
    codbanco = models.CharField(max_length=3, blank=True, null=True)
    nrocheque = models.CharField(max_length=12, blank=True, null=True)
    cheqimp = models.CharField(max_length=1)
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda')
    factcambio = models.DecimalField(max_digits=19, decimal_places=4)
    totalanticipo = models.DecimalField(max_digits=19, decimal_places=4)
    totalimporte = models.DecimalField(max_digits=19, decimal_places=4)
    totaliva = models.DecimalField(max_digits=19, decimal_places=4)
    planctabanco = models.CharField(max_length=11, blank=True, null=True)
    planauxbanco = models.CharField(max_length=11, blank=True, null=True)
    planctaprov = models.CharField(max_length=11, blank=True, null=True)
    planauxprov = models.CharField(max_length=11, blank=True, null=True)
    concepto = models.CharField(max_length=40, blank=True, null=True)
    beneficiario = models.CharField(max_length=80, blank=True, null=True)
    nroordcomp = models.CharField(max_length=20, blank=True, null=True)
    fechaanulacion = models.DateTimeField(blank=True, null=True)
    fechavtocheque = models.DateTimeField(blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    coddpto = models.CharField(max_length=10)
    talonimpreso = models.CharField(max_length=1, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    ctabanco = models.CharField(max_length=20, blank=True, null=True)
    ubicacion = models.CharField(max_length=3)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    fechaubicop = models.DateTimeField(blank=True, null=True)
    userubicop = models.CharField(max_length=16, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codbenef = models.CharField(max_length=12, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_tp_compriva = models.CharField(max_length=4, blank=True, null=True)
    nroretiva = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    montoretiva = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montoretrenta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'opcab'
        unique_together = (('cod_empresa', 'tipoop', 'nroop'),)


class Opdespacho(models.Model):
    cod_empresa = models.ForeignKey(Opcab, db_column='cod_empresa')
    nroop = models.DecimalField(max_digits=7, decimal_places=0)
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    nrodespacho = models.DecimalField(max_digits=7, decimal_places=0)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    coddespachante = models.CharField(max_length=4, blank=True, null=True)
    tipoop = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'opdespacho'
        unique_together = (('cod_empresa', 'nroop', 'anho', 'nrodespacho'),)


class Opdet(models.Model):
    cod_empresa = models.ForeignKey(Factcab, db_column='cod_empresa')
    tipoop = models.CharField(max_length=1)
    nroop = models.DecimalField(max_digits=7, decimal_places=0)
    nrolinea = models.DecimalField(max_digits=5, decimal_places=0)
    anho = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    coddespachante = models.CharField(max_length=4, blank=True, null=True)
    nrodespacho = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    factcambio = models.DecimalField(max_digits=19, decimal_places=4)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    iva = models.DecimalField(max_digits=19, decimal_places=4)
    nroordcomp = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    concepto = models.CharField(max_length=35, blank=True, null=True)
    nrorendicion = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    nrocuota = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    montoretiva = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montoretrenta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'opdet'
        unique_together = (('cod_empresa', 'tipoop', 'nroop', 'nrolinea'),)


class OpfactExport(models.Model):
    cod_empresa = models.CharField(max_length=2)
    tipoop = models.CharField(max_length=1)
    nroop = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nroop_ms = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nrodoc = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fechaop = models.DateTimeField(blank=True, null=True)
    planctadeb = models.CharField(max_length=11, blank=True, null=True)
    planauxdeb = models.CharField(max_length=11, blank=True, null=True)
    planctabanco = models.CharField(max_length=11, blank=True, null=True)
    planauxbanco = models.CharField(max_length=11, blank=True, null=True)
    nrocheque = models.CharField(max_length=20, blank=True, null=True)
    montocheque = models.DecimalField(max_digits=19, decimal_places=4)
    codmonedaop = models.CharField(max_length=2, blank=True, null=True)
    factcambioop = models.DecimalField(max_digits=19, decimal_places=4)
    conceptoop = models.CharField(max_length=60, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'opfact_export'


class OpfactImport(models.Model):
    cod_empresa = models.CharField(max_length=2)
    nroop = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nroop_ms = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fechaop = models.DateTimeField(blank=True, null=True)
    codmonedaop = models.CharField(max_length=2, blank=True, null=True)
    factcambioop = models.DecimalField(max_digits=19, decimal_places=4)
    beneficiario = models.CharField(max_length=50, blank=True, null=True)
    conceptoop = models.CharField(max_length=60, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fechafact = models.DateTimeField(blank=True, null=True)
    fechavctofact = models.DateTimeField(blank=True, null=True)
    totalexen = models.DecimalField(max_digits=19, decimal_places=4)
    totalgrav = models.DecimalField(max_digits=19, decimal_places=4)
    totaliva = models.DecimalField(max_digits=19, decimal_places=4)
    codmonedafact = models.CharField(max_length=2, blank=True, null=True)
    factcambiofact = models.DecimalField(max_digits=19, decimal_places=4)
    conceptofact = models.CharField(max_length=60, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'opfact_import'


class OrCab(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    fha_mvto = models.DateTimeField()
    cod_sucursal2 = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito2 = models.CharField(max_length=2, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    des_movimiento = models.CharField(max_length=60, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    impreso = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'or_cab'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_deposito', 'cod_tp_comp', 'comp_numero'),)


class OrDet(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    concepto = models.CharField(max_length=60, blank=True, null=True)
    tp_vtadet = models.CharField(max_length=4, blank=True, null=True)
    nro_vtadet = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    linea_vtadet = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'or_det'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_deposito', 'cod_tp_comp', 'comp_numero', 'linea'),)


class Ordcompcab(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    nroordcomp = models.CharField(max_length=20)
    codprov = models.CharField(max_length=4)
    fechaorden = models.DateTimeField()
    fechaentrega = models.DateTimeField(blank=True, null=True)
    plazo = models.CharField(max_length=40, blank=True, null=True)
    contacto = models.CharField(max_length=40, blank=True, null=True)
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda')
    factcambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalexen = models.DecimalField(max_digits=19, decimal_places=4)
    totalgrav = models.DecimalField(max_digits=19, decimal_places=4)
    porciva = models.DecimalField(max_digits=5, decimal_places=2)
    iva = models.DecimalField(max_digits=19, decimal_places=4)
    dcto = models.DecimalField(max_digits=5, decimal_places=2)
    observ = models.CharField(max_length=500, blank=True, null=True)
    formapago = models.CharField(max_length=200, blank=True, null=True)
    anombrede = models.CharField(max_length=40, blank=True, null=True)
    lugarentr = models.CharField(max_length=40, blank=True, null=True)
    garantia = models.CharField(max_length=40, blank=True, null=True)
    medioembarque = models.CharField(max_length=1, blank=True, null=True)
    ley60_90 = models.CharField(max_length=20, blank=True, null=True)
    aprobadopor = models.CharField(max_length=40, blank=True, null=True)
    estado = models.CharField(max_length=2, blank=True, null=True)
    porccumplido = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    nrosolicitud = models.CharField(max_length=20, blank=True, null=True)
    tipo = models.CharField(max_length=2)
    cod_tp_pago = models.CharField(max_length=2, blank=True, null=True)
    cod_con_vta = models.ForeignKey('Terminos', db_column='cod_con_vta', blank=True, null=True)
    tipo_iva = models.CharField(max_length=1, blank=True, null=True)
    numeroorden = models.DecimalField(max_digits=20, decimal_places=0)
    coddpto = models.CharField(max_length=10)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    nro_pedido_material = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    medio_pedido = models.CharField(max_length=5, blank=True, null=True)
    solicitadopor = models.CharField(max_length=40, blank=True, null=True)
    responsable = models.CharField(max_length=40, blank=True, null=True)
    total_iva_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    dctomontoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    dctomontograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fechavto = models.DateTimeField(blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    cod_referencia = models.CharField(max_length=20, blank=True, null=True)
    tipoorden = models.CharField(max_length=4)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    aprobado = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ordcompcab'
        unique_together = (('cod_empresa', 'nroordcomp'),)


class Ordcompcuotas(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    nroordcomp = models.CharField(max_length=20)
    nrocuota = models.DecimalField(max_digits=5, decimal_places=0)
    fechavto = models.DateTimeField()
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda')
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    observacion = models.CharField(max_length=250, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ordcompcuotas'
        unique_together = (('cod_empresa', 'nroordcomp', 'nrocuota'),)


class Ordcompdet(models.Model):
    cod_empresa = models.ForeignKey(Ordcompcab, db_column='cod_empresa')
    nroordcomp = models.CharField(max_length=20)
    nroitem = models.DecimalField(max_digits=3, decimal_places=0)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=15, decimal_places=3)
    precexen = models.DecimalField(max_digits=19, decimal_places=4)
    precgrav = models.DecimalField(max_digits=19, decimal_places=4)
    marca = models.CharField(max_length=40, blank=True, null=True)
    porc_iva = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    descuentomonto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    iva = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porcpartgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montopartgravado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    gravexen = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ordcompdet'
        unique_together = (('cod_empresa', 'nroordcomp', 'nroitem'),)


class Ordencompraasoc(models.Model):
    cod_empresa = models.ForeignKey(AsoEmpleados, db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    cod_asociacion = models.CharField(max_length=8)
    nroordencompra = models.DecimalField(max_digits=15, decimal_places=0)
    fechaemision = models.DateTimeField(blank=True, null=True)
    fechavencimiento = models.DateTimeField(blank=True, null=True)
    fechacarga = models.DateTimeField(blank=True, null=True)
    codusuario = models.CharField(max_length=16, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8)
    totalorden = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalfactura = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    observ = models.CharField(max_length=60, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    cod_sucursal_destino = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ordencompraasoc'
        unique_together = (('cod_empresa', 'cod_asociacion', 'nroordencompra', 'cod_cliente'),)


class Ordencompraasocdet(models.Model):
    cod_empresa = models.ForeignKey('Vtacab', db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    cod_asociacion = models.CharField(max_length=8)
    nroordencompra = models.DecimalField(max_digits=15, decimal_places=0)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    total_venta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fechacarga = models.DateTimeField(blank=True, null=True)
    codusuario = models.CharField(max_length=16, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8)

    class Meta:
        managed = False
        db_table = 'ordencompraasocdet'
        unique_together = (('cod_empresa', 'cod_asociacion', 'nroordencompra', 'cod_tp_comp', 'comp_numero', 'cod_cliente'),)


class Ordenfacturacion(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=2, decimal_places=0)
    ordenfact = models.DecimalField(max_digits=7, decimal_places=0)
    fechaorden = models.DateTimeField(blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    saldoanterior = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    afacturar = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    codtpfactura = models.CharField(max_length=4, blank=True, null=True)
    compnrofactura = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    lineafactura = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    anulado = models.CharField(max_length=1, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    anulausuario = models.CharField(max_length=16, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ordenfacturacion'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'linea', 'ordenfact'),)


class Ordentramite(models.Model):
    cod_empresa = models.ForeignKey('Tipotramite', db_column='cod_empresa')
    tipoorden = models.CharField(max_length=4)
    tipotramite = models.CharField(max_length=4)
    usuarios = models.CharField(max_length=250)
    cantdias = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ordentramite'
        unique_together = (('cod_empresa', 'tipoorden', 'tipotramite'),)


class Ordprodcab(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    nroordprod = models.DecimalField(max_digits=7, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=10, decimal_places=4)
    fechaprograma = models.DateTimeField(blank=True, null=True)
    fechahoraprod = models.DateTimeField(blank=True, null=True)
    solicitadopor = models.CharField(max_length=60, blank=True, null=True)
    autorizadopor = models.CharField(max_length=60, blank=True, null=True)
    recibporprod = models.CharField(max_length=60, blank=True, null=True)
    entregpordep = models.CharField(max_length=60, blank=True, null=True)
    observ = models.CharField(max_length=60, blank=True, null=True)
    asentado = models.CharField(max_length=1)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ordprodcab'
        unique_together = (('cod_empresa', 'nroordprod'),)


class Ordproddet(models.Model):
    cod_empresa = models.ForeignKey(Ordprodcab, db_column='cod_empresa')
    nroordprod = models.DecimalField(max_digits=7, decimal_places=0)
    nroitem = models.DecimalField(max_digits=3, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    observ = models.CharField(max_length=60, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ordproddet'
        unique_together = (('cod_empresa', 'nroordprod', 'nroitem'),)


class Otroingcli(models.Model):
    cod_empresa = models.ForeignKey(Clientes, db_column='cod_empresa')
    cod_cliente = models.CharField(max_length=8)
    item = models.DecimalField(max_digits=3, decimal_places=0)
    tipo = models.CharField(max_length=2)
    descrip = models.CharField(max_length=50, blank=True, null=True)
    monto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'otroingcli'
        unique_together = (('cod_empresa', 'cod_cliente', 'item', 'tipo'),)


class Otroingcred(models.Model):
    cod_empresa = models.ForeignKey('Soliccred', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    codsolicitud = models.CharField(max_length=15, blank=True, null=True)
    item = models.DecimalField(max_digits=3, decimal_places=0)
    tipo = models.CharField(max_length=2)
    descrip = models.CharField(max_length=50, blank=True, null=True)
    monto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'otroingcred'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'item', 'tipo'),)


class Pagarescab(models.Model):
    cod_empresa = models.ForeignKey('Sucursal', db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_con_vta = models.ForeignKey('Terminos', db_column='cod_con_vta')
    fecha = models.DateTimeField()
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda')
    cod_cliente = models.CharField(max_length=8)
    totimporte = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totsaldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    generado = models.CharField(max_length=1, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    primervcto = models.DateTimeField(blank=True, null=True)
    ultvcto = models.DateTimeField(blank=True, null=True)
    codtpfactura = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cantcuotas = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagarescab'
        unique_together = (('cod_empresa', 'cod_sucursal', 'mvto_numero'),)


class PagarescabUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_con_vta = models.CharField(max_length=2)
    fecha = models.DateTimeField()
    codmoneda = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    totimporte = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totsaldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    generado = models.CharField(max_length=1, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    primervcto = models.DateTimeField(blank=True, null=True)
    ultvcto = models.DateTimeField(blank=True, null=True)
    codtpfactura = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cantcuotas = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagarescab_unif'
        unique_together = (('cod_empresa', 'cod_sucursal', 'mvto_numero'),)


class Pagaresdet(models.Model):
    cod_empresa = models.ForeignKey('Vtacab', db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0)
    ct_mvto = models.DecimalField(max_digits=7, decimal_places=0)
    ct_cuota = models.DecimalField(max_digits=3, decimal_places=0)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fecha_emi = models.DateTimeField(blank=True, null=True)
    fecha_ven = models.DateTimeField(blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    int_mora = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    cod_vendedor = models.ForeignKey('Vendedor', db_column='cod_vendedor', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagaresdet'
        unique_together = (('cod_empresa', 'cod_sucursal', 'mvto_numero', 'ct_mvto', 'ct_cuota'),)


class PagaresdetUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0)
    ct_mvto = models.DecimalField(max_digits=7, decimal_places=0)
    ct_cuota = models.DecimalField(max_digits=3, decimal_places=0)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fecha_emi = models.DateTimeField(blank=True, null=True)
    fecha_ven = models.DateTimeField(blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    int_mora = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagaresdet_unif'
        unique_together = (('cod_empresa', 'cod_sucursal', 'mvto_numero', 'ct_mvto', 'ct_cuota'),)


class Pagocheques(models.Model):
    cod_empresa = models.ForeignKey('Vtacab', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    codbanco = models.ForeignKey(Cheques, db_column='codbanco')
    nrocheque = models.CharField(max_length=12)
    lineacheque = models.DecimalField(max_digits=3, decimal_places=0)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagocheques'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'pago_numero', 'linea', 'codbanco', 'nrocheque', 'lineacheque'),)


class PagochequesAnul(models.Model):
    cod_empresa = models.ForeignKey('Vtacab', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    codbanco = models.ForeignKey(ChequesAnul, db_column='codbanco')
    nrocheque = models.CharField(max_length=12)
    lineacheque = models.DecimalField(max_digits=3, decimal_places=0)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagocheques_anul'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'pago_numero', 'linea', 'codbanco', 'nrocheque', 'lineacheque'),)


class PagochequesUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    codbanco = models.CharField(max_length=3)
    nrocheque = models.CharField(max_length=12)
    lineacheque = models.DecimalField(max_digits=3, decimal_places=0)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagocheques_unif'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'pago_numero', 'linea', 'codbanco', 'nrocheque', 'lineacheque'),)


class Pagocuotaslog(models.Model):
    cod_empresa = models.ForeignKey('Pagocuotaslogcab', db_column='cod_empresa')
    nrosecuencia = models.DecimalField(max_digits=12, decimal_places=0)
    nrolineatxt = models.DecimalField(max_digits=10, decimal_places=0)
    nrofactpronet = models.CharField(max_length=12)
    comp_nro_orig = models.CharField(max_length=12)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    fechapago = models.DateTimeField()
    fechavto = models.DateTimeField()
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    codlocalpago = models.CharField(max_length=8)
    nrolote = models.DecimalField(max_digits=6, decimal_places=0)
    nrotransacpago = models.DecimalField(max_digits=12, decimal_places=0)
    codtipopago = models.CharField(max_length=3)
    tipoingresocobro = models.CharField(max_length=1, blank=True, null=True)
    fechahoraimport = models.DateTimeField()
    importadopor = models.CharField(max_length=16)
    procesado = models.CharField(max_length=1)
    fechahoraproc = models.DateTimeField(blank=True, null=True)
    procesadopor = models.CharField(max_length=16, blank=True, null=True)
    observerror = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagocuotaslog'
        unique_together = (('cod_empresa', 'nrosecuencia', 'nrolineatxt'),)


class Pagocuotaslogcab(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    nrosecuencia = models.DecimalField(max_digits=12, decimal_places=0)
    nombrearch = models.CharField(max_length=80, blank=True, null=True)
    observ = models.CharField(max_length=80, blank=True, null=True)
    arch_morosidad = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagocuotaslogcab'
        unique_together = (('cod_empresa', 'nrosecuencia'),)


class Pagoscab(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    fecha = models.DateTimeField()
    cod_tp_pago = models.CharField(max_length=2)
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda', blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    tot_efectivo = models.DecimalField(max_digits=19, decimal_places=4)
    tot_cheque = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot_retenciones = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_cobrador = models.ForeignKey(Cobrador, db_column='cod_cobrador', blank=True, null=True)
    cod_usuario = models.ForeignKey('Usuarios', db_column='cod_usuario')
    autorizado = models.CharField(max_length=1)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    cod_cajero = models.ForeignKey('Usuarios', db_column='cod_cajero', blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    origen = models.CharField(max_length=2, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    comentario = models.CharField(max_length=80, blank=True, null=True)
    cod_calificacion = models.CharField(max_length=8, blank=True, null=True)
    sectorfacturacion = models.CharField(max_length=12, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    anulado = models.CharField(max_length=1, blank=True, null=True)
    anulado_por = models.CharField(max_length=80, blank=True, null=True)
    anulado_el = models.DateTimeField(blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    razon_social = models.CharField(max_length=80, blank=True, null=True)
    cod_tp_comp_vend_planilla = models.CharField(max_length=4, blank=True, null=True)
    comp_numero_vend_planilla = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_cliente_orig = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagoscab'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'pago_numero'),)


class PagoscabUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    fecha = models.DateTimeField()
    cod_tp_pago = models.CharField(max_length=2)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    tot_efectivo = models.DecimalField(max_digits=19, decimal_places=4)
    tot_cheque = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot_retenciones = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_cobrador = models.CharField(max_length=3, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16)
    autorizado = models.CharField(max_length=1)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    cod_cajero = models.CharField(max_length=16, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    origen = models.CharField(max_length=2, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    comentario = models.CharField(max_length=80, blank=True, null=True)
    cod_calificacion = models.CharField(max_length=8, blank=True, null=True)
    sectorfacturacion = models.CharField(max_length=12, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    anulado = models.CharField(max_length=1, blank=True, null=True)
    anulado_por = models.CharField(max_length=80, blank=True, null=True)
    anulado_el = models.DateTimeField(blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagoscab_unif'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'pago_numero'),)


class Pagosdet(models.Model):
    cod_empresa = models.ForeignKey(Clientes, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=4, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2)
    codtpcuota = models.CharField(max_length=4)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    origen = models.CharField(max_length=2, blank=True, null=True)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fechaaplicacion = models.DateTimeField(blank=True, null=True)
    nroautoriz = models.CharField(max_length=10, blank=True, null=True)
    nropaymenttrs = models.CharField(max_length=9, blank=True, null=True)
    nroservicio = models.CharField(max_length=20, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    fact_comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    sucursal_orig = models.CharField(max_length=2, blank=True, null=True)
    nroplanilla_aplicacion = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagosdet'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'pago_numero', 'linea'),)


class PagosdetAnul(models.Model):
    cod_empresa = models.ForeignKey(Pagoscab, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=4, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2)
    codtpcuota = models.CharField(max_length=4)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    origen = models.CharField(max_length=2, blank=True, null=True)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fechaaplicacion = models.DateTimeField(blank=True, null=True)
    nroautoriz = models.CharField(max_length=10, blank=True, null=True)
    nropaymenttrs = models.CharField(max_length=9, blank=True, null=True)
    nroservicio = models.CharField(max_length=20, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    fact_comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    sucursal_orig = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagosdet_anul'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'pago_numero', 'linea'),)


class PagosdetAnulUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=4, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2)
    codtpcuota = models.CharField(max_length=4)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    origen = models.CharField(max_length=2, blank=True, null=True)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fechaaplicacion = models.DateTimeField(blank=True, null=True)
    nroautoriz = models.CharField(max_length=10, blank=True, null=True)
    nropaymenttrs = models.CharField(max_length=9, blank=True, null=True)
    nroservicio = models.CharField(max_length=20, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    fact_comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagosdet_anul_unif'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'pago_numero', 'linea'),)


class PagosdetUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=4, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2)
    codtpcuota = models.CharField(max_length=4)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    origen = models.CharField(max_length=2, blank=True, null=True)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fechaaplicacion = models.DateTimeField(blank=True, null=True)
    nroautoriz = models.CharField(max_length=10, blank=True, null=True)
    nropaymenttrs = models.CharField(max_length=9, blank=True, null=True)
    nroservicio = models.CharField(max_length=20, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    fact_comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagosdet_unif'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'pago_numero', 'linea'),)


class Pagosrec(models.Model):
    cod_empresa = models.ForeignKey(Pagoscab, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=4, decimal_places=0)
    cod_tp_pago = models.CharField(max_length=2, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    origen = models.CharField(max_length=2, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagosrec'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'pago_numero', 'linea'),)


class PagosrecAnul(models.Model):
    cod_empresa = models.ForeignKey(Pagoscab, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=4, decimal_places=0)
    cod_tp_pago = models.CharField(max_length=2, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    origen = models.CharField(max_length=2, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagosrec_anul'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'pago_numero', 'linea'),)


class PagosrecAnulUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=4, decimal_places=0)
    cod_tp_pago = models.CharField(max_length=2, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    origen = models.CharField(max_length=2, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagosrec_anul_unif'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'pago_numero', 'linea'),)


class PagosrecUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=4, decimal_places=0)
    cod_tp_pago = models.CharField(max_length=2, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    origen = models.CharField(max_length=2, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagosrec_unif'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'pago_numero', 'linea'),)


class Pagosret(models.Model):
    cod_empresa = models.ForeignKey('Retenciones', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0)
    codretencion = models.CharField(max_length=5)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    comentario = models.CharField(max_length=80, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_establecimiento = models.CharField(max_length=3)
    cod_ptoexpedicion = models.CharField(max_length=3)
    comp_nro_timb = models.DecimalField(max_digits=15, decimal_places=0)
    fecha_compr = models.DateTimeField(blank=True, null=True)
    linea_pagosrec = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    linea = models.DecimalField(max_digits=3, decimal_places=0)

    class Meta:
        managed = False
        db_table = 'pagosret'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'pago_numero', 'linea'),)


class PagosretUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0)
    codretencion = models.CharField(max_length=5)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    comentario = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagosret_unif'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'pago_numero', 'codretencion'),)


class Pagowebservice(models.Model):
    nroconsulta = models.DecimalField(max_digits=25, decimal_places=0)
    secuencia = models.DecimalField(max_digits=8, decimal_places=0)
    nroopcion = models.DecimalField(max_digits=3, decimal_places=0)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    cedula = models.CharField(max_length=15, blank=True, null=True)
    razon_social = models.CharField(max_length=100, blank=True, null=True)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cuota_desde = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cuota_hasta = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    totalcuotas = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    fecha_emi = models.DateTimeField(blank=True, null=True)
    fecha_ven = models.DateTimeField(blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    desc_moneda = models.CharField(max_length=20, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    importe_total = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    int_mora = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    estado = models.CharField(max_length=1)
    terminal = models.CharField(max_length=10, blank=True, null=True)
    fecha_pago = models.CharField(max_length=8, blank=True, null=True)
    nro_lote = models.DecimalField(max_digits=6, decimal_places=0, blank=True, null=True)
    nro_transaccion = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True)
    tipo_pago = models.CharField(max_length=1, blank=True, null=True)
    anulado = models.CharField(max_length=1)
    anuladoel = models.DateTimeField(blank=True, null=True)
    cod_tp_comp_rec = models.CharField(max_length=4, blank=True, null=True)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_cobrador = models.CharField(max_length=3, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    cod_tp_pago = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp_int = models.CharField(max_length=4, blank=True, null=True)
    pago_numero_int = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_tp_pago_int = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagowebservice'
        unique_together = (('nroconsulta', 'secuencia'),)


class PagowebserviceDet(models.Model):
    nroconsulta = models.DecimalField(max_digits=25, decimal_places=0)
    secuencia = models.DecimalField(max_digits=8, decimal_places=0)
    nroopcion = models.DecimalField(max_digits=3, decimal_places=0)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0)
    int_mora = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldo_cuota = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_tp_comp_rec = models.CharField(max_length=4, blank=True, null=True)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_cobrador = models.CharField(max_length=3, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    cod_tp_pago = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp_int = models.CharField(max_length=4, blank=True, null=True)
    pago_numero_int = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_tp_pago_int = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagowebservice_det'
        unique_together = (('nroconsulta', 'secuencia', 'cuota_numero'),)


class PagowebserviceParams(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_usuario = models.CharField(max_length=16)
    cod_tp_comp = models.CharField(max_length=4)
    cod_tp_pago = models.CharField(max_length=2)
    cod_cobrador = models.CharField(max_length=3, blank=True, null=True)
    descrip = models.CharField(max_length=60, blank=True, null=True)
    cod_cliente_int = models.CharField(max_length=8, blank=True, null=True)
    cod_tp_comp_int = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_pago_int = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagowebservice_params'
        unique_together = (('cod_empresa', 'cod_usuario'),)


class Pais(models.Model):
    codpais = models.CharField(primary_key=True, max_length=3)
    descrip = models.CharField(max_length=40, blank=True, null=True)
    gentiliciom = models.CharField(max_length=20, blank=True, null=True)
    gentiliciof = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pais'


class Pbcatcol(models.Model):
    pbc_tnam = models.CharField(max_length=129)
    pbc_tid = models.IntegerField(blank=True, null=True)
    pbc_ownr = models.CharField(max_length=129)
    pbc_cnam = models.CharField(max_length=129)
    pbc_cid = models.SmallIntegerField(blank=True, null=True)
    pbc_labl = models.CharField(max_length=254, blank=True, null=True)
    pbc_lpos = models.SmallIntegerField(blank=True, null=True)
    pbc_hdr = models.CharField(max_length=254, blank=True, null=True)
    pbc_hpos = models.SmallIntegerField(blank=True, null=True)
    pbc_jtfy = models.SmallIntegerField(blank=True, null=True)
    pbc_mask = models.CharField(max_length=31, blank=True, null=True)
    pbc_case = models.SmallIntegerField(blank=True, null=True)
    pbc_hght = models.SmallIntegerField(blank=True, null=True)
    pbc_wdth = models.SmallIntegerField(blank=True, null=True)
    pbc_ptrn = models.CharField(max_length=31, blank=True, null=True)
    pbc_bmap = models.CharField(max_length=1, blank=True, null=True)
    pbc_init = models.CharField(max_length=254, blank=True, null=True)
    pbc_cmnt = models.CharField(max_length=254, blank=True, null=True)
    pbc_edit = models.CharField(max_length=31, blank=True, null=True)
    pbc_tag = models.CharField(max_length=254, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pbcatcol'
        unique_together = (('pbc_tnam', 'pbc_ownr', 'pbc_cnam'),)


class Pbcatedt(models.Model):
    pbe_name = models.CharField(max_length=30)
    pbe_edit = models.CharField(max_length=254, blank=True, null=True)
    pbe_type = models.SmallIntegerField(blank=True, null=True)
    pbe_cntr = models.IntegerField(blank=True, null=True)
    pbe_seqn = models.SmallIntegerField()
    pbe_flag = models.IntegerField(blank=True, null=True)
    pbe_work = models.CharField(max_length=32, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pbcatedt'
        unique_together = (('pbe_name', 'pbe_seqn'),)


class Pbcatfmt(models.Model):
    pbf_name = models.CharField(unique=True, max_length=30)
    pbf_frmt = models.CharField(max_length=254, blank=True, null=True)
    pbf_type = models.SmallIntegerField(blank=True, null=True)
    pbf_cntr = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pbcatfmt'


class Pbcattbl(models.Model):
    pbt_tnam = models.CharField(max_length=129)
    pbt_tid = models.IntegerField(blank=True, null=True)
    pbt_ownr = models.CharField(max_length=129)
    pbd_fhgt = models.SmallIntegerField(blank=True, null=True)
    pbd_fwgt = models.SmallIntegerField(blank=True, null=True)
    pbd_fitl = models.CharField(max_length=1, blank=True, null=True)
    pbd_funl = models.CharField(max_length=1, blank=True, null=True)
    pbd_fchr = models.SmallIntegerField(blank=True, null=True)
    pbd_fptc = models.SmallIntegerField(blank=True, null=True)
    pbd_ffce = models.CharField(max_length=18, blank=True, null=True)
    pbh_fhgt = models.SmallIntegerField(blank=True, null=True)
    pbh_fwgt = models.SmallIntegerField(blank=True, null=True)
    pbh_fitl = models.CharField(max_length=1, blank=True, null=True)
    pbh_funl = models.CharField(max_length=1, blank=True, null=True)
    pbh_fchr = models.SmallIntegerField(blank=True, null=True)
    pbh_fptc = models.SmallIntegerField(blank=True, null=True)
    pbh_ffce = models.CharField(max_length=18, blank=True, null=True)
    pbl_fhgt = models.SmallIntegerField(blank=True, null=True)
    pbl_fwgt = models.SmallIntegerField(blank=True, null=True)
    pbl_fitl = models.CharField(max_length=1, blank=True, null=True)
    pbl_funl = models.CharField(max_length=1, blank=True, null=True)
    pbl_fchr = models.SmallIntegerField(blank=True, null=True)
    pbl_fptc = models.SmallIntegerField(blank=True, null=True)
    pbl_ffce = models.CharField(max_length=18, blank=True, null=True)
    pbt_cmnt = models.CharField(max_length=254, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pbcattbl'
        unique_together = (('pbt_tnam', 'pbt_ownr'),)


class Pbcatvld(models.Model):
    pbv_name = models.CharField(unique=True, max_length=30)
    pbv_vald = models.CharField(max_length=254, blank=True, null=True)
    pbv_type = models.SmallIntegerField(blank=True, null=True)
    pbv_cntr = models.IntegerField(blank=True, null=True)
    pbv_msg = models.CharField(max_length=254, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pbcatvld'


class Pcapagos(models.Model):
    succabecera = models.CharField(max_length=2, blank=True, null=True)
    cliente = models.CharField(max_length=15, blank=True, null=True)
    razonsocial = models.CharField(max_length=200, blank=True, null=True)
    tpocbte = models.CharField(max_length=4, blank=True, null=True)
    pagonro = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    moneda = models.CharField(max_length=2, blank=True, null=True)
    factorcambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tipocbtefact = models.CharField(max_length=4, blank=True, null=True)
    nrofactura = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    nrocuota = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pcapagos'


class Pcaventas(models.Model):
    succabecera = models.CharField(max_length=2, blank=True, null=True)
    cliente = models.CharField(max_length=15, blank=True, null=True)
    razonsocial = models.CharField(max_length=200, blank=True, null=True)
    tpocbte = models.CharField(max_length=4, blank=True, null=True)
    nrofactura = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    condicionvta = models.CharField(max_length=2, blank=True, null=True)
    moneda = models.CharField(max_length=2, blank=True, null=True)
    factorcambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    preciovtaunit = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descripcion = models.CharField(max_length=500, blank=True, null=True)
    descuento = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    netoapagar = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    referencianc = models.CharField(max_length=4, blank=True, null=True)
    refnronc = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    tipopresup = models.CharField(max_length=4, blank=True, null=True)
    nrosolicitud = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    codarticulo = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pcaventas'


class Pedsumcab(models.Model):
    cod_empresa = models.ForeignKey('Tipoorden', db_column='cod_empresa')
    nropedido = models.DecimalField(max_digits=7, decimal_places=0)
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda')
    nrosolicitud = models.CharField(max_length=20)
    cod_sucursal = models.CharField(max_length=2)
    fecha = models.DateTimeField()
    ley60_90 = models.CharField(max_length=20)
    coddpto = models.CharField(max_length=2)
    solicitadopor = models.CharField(max_length=40, blank=True, null=True)
    responsable = models.CharField(max_length=40, blank=True, null=True)
    medioembarque = models.CharField(max_length=1)
    presupuestado = models.CharField(max_length=1)
    fondosasignados = models.CharField(max_length=1)
    montoasignado = models.DecimalField(max_digits=19, decimal_places=4)
    montoutilizado = models.DecimalField(max_digits=19, decimal_places=4)
    saldo = models.DecimalField(max_digits=19, decimal_places=4)
    observ = models.CharField(max_length=500, blank=True, null=True)
    rechazado = models.CharField(max_length=1, blank=True, null=True)
    codigorechazo = models.ForeignKey(Motivosrechazo, db_column='codigorechazo', blank=True, null=True)
    referencedoc = models.BinaryField(blank=True, null=True)
    justificacion = models.CharField(max_length=500, blank=True, null=True)
    paraque = models.CharField(max_length=500, blank=True, null=True)
    porque = models.CharField(max_length=500, blank=True, null=True)
    paraquien_donde = models.CharField(max_length=500, blank=True, null=True)
    cuando = models.CharField(max_length=500, blank=True, null=True)
    tipoorden = models.CharField(max_length=4, blank=True, null=True)
    medio_pedido = models.CharField(max_length=5)

    class Meta:
        managed = False
        db_table = 'pedsumcab'
        unique_together = (('cod_empresa', 'nropedido'),)


class Pedsumdet(models.Model):
    cod_empresa = models.ForeignKey(Pedsumcab, db_column='cod_empresa')
    nropedido = models.DecimalField(max_digits=7, decimal_places=0)
    nroitem = models.DecimalField(max_digits=2, decimal_places=0)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=2)
    marca = models.CharField(max_length=40, blank=True, null=True)
    cantaprobada = models.DecimalField(max_digits=13, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'pedsumdet'
        unique_together = (('cod_empresa', 'nropedido', 'nroitem'),)


class Pedsumdoc(models.Model):
    cod_empresa = models.ForeignKey(Pedsumcab, db_column='cod_empresa')
    nropedido = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    referencedoc = models.BinaryField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pedsumdoc'
        unique_together = (('cod_empresa', 'nropedido', 'linea'),)


class Periodo(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    periodo = models.CharField(max_length=8)
    fechaini = models.DateTimeField()
    fechafin = models.DateTimeField()
    descrip = models.CharField(max_length=40)
    cerrado = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'periodo'
        unique_together = (('cod_empresa', 'periodo'),)


class Planauxi(models.Model):
    cod_empresa = models.ForeignKey('Plancta', db_column='cod_empresa')
    periodo = models.CharField(max_length=8)
    codplancta = models.CharField(max_length=11)
    codplanaux = models.CharField(max_length=11)
    codplanauxpad = models.CharField(max_length=11, blank=True, null=True)
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda')
    tpcta = models.CharField(max_length=2)
    imputable = models.CharField(max_length=1)
    nivel = models.DecimalField(max_digits=1, decimal_places=0)
    nombre = models.CharField(max_length=40)
    prorrateo = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    codplanctafiscal = models.CharField(max_length=11, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'planauxi'
        unique_together = (('cod_empresa', 'periodo', 'codplancta', 'codplanaux'),)


class PlanauxiSync(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    codplanauxpad = models.CharField(max_length=11, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    tpcta = models.CharField(max_length=2, blank=True, null=True)
    imputable = models.CharField(max_length=1, blank=True, null=True)
    nivel = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    nombre = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'planauxi_sync'


class Plancta(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    periodo = models.CharField(max_length=8)
    codplancta = models.CharField(max_length=11)
    codplanctapad = models.CharField(max_length=11, blank=True, null=True)
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda')
    tpcta = models.CharField(max_length=2)
    imputable = models.CharField(max_length=1)
    auxiliar = models.CharField(max_length=1)
    presup = models.CharField(max_length=1)
    nivel = models.DecimalField(max_digits=1, decimal_places=0)
    tiposaldo = models.CharField(max_length=1)
    nombre = models.CharField(max_length=40)
    codplanctafiscal = models.CharField(max_length=11, blank=True, null=True)
    funcion = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'plancta'
        unique_together = (('cod_empresa', 'periodo', 'codplancta'),)


class PlanctaSync(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanctapad = models.CharField(max_length=11, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    imputable = models.CharField(max_length=1, blank=True, null=True)
    auxiliar = models.CharField(max_length=1, blank=True, null=True)
    presup = models.CharField(max_length=1, blank=True, null=True)
    nivel = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    nombre = models.CharField(max_length=40, blank=True, null=True)
    tiposaldo = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'plancta_sync'


class Planctafiscal(models.Model):
    cod_empresa = models.CharField(max_length=2)
    periodo = models.CharField(max_length=8)
    codplanctafiscal = models.CharField(max_length=11)
    codplanctafiscalpad = models.CharField(max_length=11, blank=True, null=True)
    nivel = models.DecimalField(max_digits=1, decimal_places=0)
    tiposaldo = models.CharField(max_length=1)
    nombre = models.CharField(max_length=80)
    imprimir = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'planctafiscal'
        unique_together = (('cod_empresa', 'periodo', 'codplanctafiscal'),)


class Planillaentregaarticulo(models.Model):
    cod_empresa = models.ForeignKey(Articulo, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_articulo = models.CharField(max_length=14)
    nroserie = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'planillaentregaarticulo'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'cod_articulo', 'nroserie'),)


class Planillaentregacab(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_camion = models.CharField(max_length=8, blank=True, null=True)
    nro_chofer = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    observacion = models.CharField(max_length=200, blank=True, null=True)
    cod_usuario = models.ForeignKey('Usuarios', db_column='cod_usuario', blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'planillaentregacab'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero'),)


class Planillaentregafact(models.Model):
    cod_empresa = models.ForeignKey('Vtacab', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    cod_tp_factura = models.CharField(max_length=4, blank=True, null=True)
    nro_factura = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nroordcomp = models.CharField(max_length=20, blank=True, null=True)
    cod_prov = models.CharField(max_length=4, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_transf = models.CharField(max_length=4, blank=True, null=True)
    nrotransf = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    tipotrans = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'planillaentregafact'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'linea'),)


class Plantillainformes(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    codinforme = models.CharField(max_length=5)
    descrip = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'plantillainformes'
        unique_together = (('cod_empresa', 'codinforme'),)


class Plazas(models.Model):
    codplaza = models.CharField(max_length=4)
    descrip = models.CharField(max_length=40, blank=True, null=True)
    dias = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    tpdef = models.CharField(max_length=2, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2)

    class Meta:
        managed = False
        db_table = 'plazas'
        unique_together = (('codplaza', 'cod_empresa'),)


class Presupaprobaciones(models.Model):
    cod_empresa = models.ForeignKey('Presupcbtereq', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_requerimiento = models.CharField(max_length=5)
    linea = models.DecimalField(max_digits=7, decimal_places=0)
    estado = models.CharField(max_length=2, blank=True, null=True)
    aprobadopor = models.CharField(max_length=50, blank=True, null=True)
    aprobadoel = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'presupaprobaciones'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'cod_requerimiento', 'linea'),)


class Presupcab(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0)
    fha_cbte = models.DateTimeField()
    fechavcto = models.DateTimeField()
    cod_con_vta = models.ForeignKey('Terminos', db_column='cod_con_vta')
    estado = models.CharField(max_length=2)
    cod_tp_pago = models.CharField(max_length=2)
    tipo_vta = models.CharField(max_length=2)
    cod_vendedor = models.ForeignKey('Vendedor', db_column='cod_vendedor', blank=True, null=True)
    com_vendedor = models.DecimalField(max_digits=4, decimal_places=2)
    comisman = models.CharField(max_length=1)
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda', blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    to_exento = models.DecimalField(max_digits=19, decimal_places=4)
    to_gravado = models.DecimalField(max_digits=19, decimal_places=4)
    total_iva = models.DecimalField(max_digits=19, decimal_places=4)
    tipo_iva = models.CharField(max_length=1)
    autorizado = models.CharField(max_length=1)
    anulado = models.CharField(max_length=1)
    cod_usuario = models.CharField(max_length=16)
    rf_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    caja = models.CharField(max_length=9, blank=True, null=True)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    asentadocv = models.CharField(max_length=1, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    cod_cajero = models.CharField(max_length=16, blank=True, null=True)
    total_diferido = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_venta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctoexen_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descuento2do = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    tot2dodctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldescuento = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    sectorfacturacion = models.CharField(max_length=12, blank=True, null=True)
    cod_tp_comp_orig = models.CharField(max_length=4)
    comp_numero_orig = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    usuario_chg_nro = models.CharField(max_length=16, blank=True, null=True)
    fecha_chg_numero = models.DateTimeField(blank=True, null=True)
    modfecha = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    modfechavcto = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    codtpfactura = models.CharField(max_length=4, blank=True, null=True)
    aprobadoel = models.DateTimeField(blank=True, null=True)
    aprobadopor = models.CharField(max_length=16, blank=True, null=True)
    to_gravado_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    to_gravado_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    cod_analista = models.CharField(max_length=4, blank=True, null=True)
    reg_turismo = models.CharField(max_length=2, blank=True, null=True)
    inc_precios = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    recalculado = models.CharField(max_length=1, blank=True, null=True)
    plazoentrega = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    destinatario = models.CharField(max_length=200, blank=True, null=True)
    cod_vendedor_sup = models.ForeignKey('Vendedor', db_column='cod_vendedor_sup', blank=True, null=True)
    cod_televendedor = models.ForeignKey('Vendedor', db_column='cod_televendedor', blank=True, null=True)
    cod_tp_comp_vend_planilla = models.CharField(max_length=4, blank=True, null=True)
    comp_numero_vend_planilla = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_tp_comp_mvto = models.CharField(max_length=4, blank=True, null=True)
    comp_numero_mvto = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    recepcionado_el = models.DateTimeField(blank=True, null=True)
    cargado_el = models.DateTimeField(blank=True, null=True)
    cargado_por = models.CharField(max_length=16, blank=True, null=True)
    pendiente_el = models.DateTimeField(blank=True, null=True)
    pendiente_por = models.CharField(max_length=16, blank=True, null=True)
    rechazado_el = models.DateTimeField(blank=True, null=True)
    rechazado_por = models.CharField(max_length=16, blank=True, null=True)
    plantilla = models.CharField(max_length=1, blank=True, null=True)
    recibido_por = models.CharField(max_length=16, blank=True, null=True)
    recibido_el = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'presupcab'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero'),)


class PresupcabUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0)
    fha_cbte = models.DateTimeField()
    fechavcto = models.DateTimeField()
    cod_con_vta = models.CharField(max_length=2)
    estado = models.CharField(max_length=2)
    cod_tp_pago = models.CharField(max_length=2)
    tipo_vta = models.CharField(max_length=2)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    com_vendedor = models.DecimalField(max_digits=4, decimal_places=2)
    comisman = models.CharField(max_length=1)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    to_exento = models.DecimalField(max_digits=19, decimal_places=4)
    to_gravado = models.DecimalField(max_digits=19, decimal_places=4)
    total_iva = models.DecimalField(max_digits=19, decimal_places=4)
    tipo_iva = models.CharField(max_length=1)
    autorizado = models.CharField(max_length=1)
    anulado = models.CharField(max_length=1)
    cod_usuario = models.CharField(max_length=16)
    rf_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    caja = models.CharField(max_length=60, blank=True, null=True)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    asentadocv = models.CharField(max_length=1, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    cod_cajero = models.CharField(max_length=16, blank=True, null=True)
    total_diferido = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_venta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctoexen_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descuento2do = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    tot2dodctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldescuento = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    sectorfacturacion = models.CharField(max_length=12, blank=True, null=True)
    cod_tp_comp_orig = models.CharField(max_length=4)
    comp_numero_orig = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    usuario_chg_nro = models.CharField(max_length=16, blank=True, null=True)
    fecha_chg_numero = models.DateTimeField(blank=True, null=True)
    modfecha = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    modfechavcto = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    codtpfactura = models.CharField(max_length=4, blank=True, null=True)
    aprobadoel = models.DateTimeField(blank=True, null=True)
    aprobadopor = models.CharField(max_length=16, blank=True, null=True)
    to_gravado_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    to_gravado_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    cod_analista = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'presupcab_unif'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero'),)


class Presupcbtereq(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    cod_requerimiento = models.CharField(max_length=5)

    class Meta:
        managed = False
        db_table = 'presupcbtereq'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'cod_requerimiento'),)


class Presupcompra(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    anho = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    presupcompra = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    presupventa = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    coeficiente_ws = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    presupflete = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    presupimpuesto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'presupcompra'


class Presupcuotas(models.Model):
    cod_empresa = models.ForeignKey(Cuotas, db_column='cod_empresa')
    tpcomppresup = models.CharField(max_length=4)
    compnropresup = models.DecimalField(max_digits=7, decimal_places=0)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8)
    fecha_emi = models.DateTimeField()
    fecha_ven = models.DateTimeField()
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    int_mora = models.DecimalField(max_digits=19, decimal_places=4)
    codmoneda = models.CharField(max_length=2)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    saldo = models.DecimalField(max_digits=19, decimal_places=4)
    cod_usuario = models.CharField(max_length=16)
    cod_vendedor = models.CharField(max_length=4)
    ubicacion = models.CharField(max_length=2, blank=True, null=True)
    cod_analista = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'presupcuotas'
        unique_together = (('cod_empresa', 'tpcomppresup', 'compnropresup', 'cuota_numero'),)


class PresupcuotasUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    tpcomppresup = models.CharField(max_length=4)
    compnropresup = models.DecimalField(max_digits=7, decimal_places=0)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8)
    fecha_emi = models.DateTimeField()
    fecha_ven = models.DateTimeField()
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    int_mora = models.DecimalField(max_digits=19, decimal_places=4)
    codmoneda = models.CharField(max_length=2)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    saldo = models.DecimalField(max_digits=19, decimal_places=4)
    cod_usuario = models.CharField(max_length=16)
    cod_vendedor = models.CharField(max_length=4)
    ubicacion = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'presupcuotas_unif'
        unique_together = (('cod_empresa', 'tpcomppresup', 'compnropresup', 'cuota_numero'),)


class Presupdet(models.Model):
    cod_empresa = models.ForeignKey(Presupcab, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=2, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4)
    total = models.DecimalField(max_digits=19, decimal_places=4)
    cod_vendedor = models.ForeignKey('Vendedor', db_column='cod_vendedor', blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descrip = models.CharField(max_length=500, blank=True, null=True)
    cantcajas = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    tp_remis = models.CharField(max_length=4, blank=True, null=True)
    nro_remis = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    manual = models.CharField(max_length=1, blank=True, null=True)
    totaldcto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    cantminima = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cod_juego = models.CharField(max_length=14, blank=True, null=True)
    cantjuego = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    total_neto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_cod_deposito = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_cod_articulo = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_cantidad = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_pr_unit = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_descuento = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_totaldcto = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_total = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    descuento_cant = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    manual_dcto = models.CharField(max_length=1, blank=True, null=True)
    cantfacturada = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    cod_con_vta = models.ForeignKey('Terminos', db_column='cod_con_vta')
    prec_base = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    prec_financiado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cant_cuotas = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    incid_entrega = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    prec_finan_entrega = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    monto_cuota = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    prec_base_unit = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porcpartgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montopartgravado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    sucursal_orig = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'presupdet'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'linea'),)


class PresupdetUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=2, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4)
    total = models.DecimalField(max_digits=19, decimal_places=4)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descrip = models.CharField(max_length=500, blank=True, null=True)
    cantcajas = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    tp_remis = models.CharField(max_length=4, blank=True, null=True)
    nro_remis = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    manual = models.CharField(max_length=1, blank=True, null=True)
    totaldcto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    cantminima = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cod_juego = models.CharField(max_length=14, blank=True, null=True)
    cantjuego = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    total_neto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_cod_deposito = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_cod_articulo = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_cantidad = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_pr_unit = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_descuento = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_totaldcto = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_total = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    descuento_cant = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    manual_dcto = models.CharField(max_length=1, blank=True, null=True)
    cantfacturada = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    cod_con_vta = models.CharField(max_length=2, blank=True, null=True)
    prec_base = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    prec_financiado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cant_cuotas = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    incid_entrega = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    prec_finan_entrega = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    monto_cuota = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    prec_base_unit = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porcpartgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montopartgravado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'presupdet_unif'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'linea'),)


class Presupmes(models.Model):
    cod_empresa = models.CharField(max_length=2)
    periodo = models.CharField(max_length=8)
    codplancta = models.CharField(max_length=11)
    codplanaux = models.CharField(max_length=11)
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    mes = models.DecimalField(max_digits=2, decimal_places=0)
    anhomes = models.CharField(max_length=6, blank=True, null=True)
    montoinicial = models.DecimalField(max_digits=19, decimal_places=4)
    modificacion = models.DecimalField(max_digits=19, decimal_places=4)

    class Meta:
        managed = False
        db_table = 'presupmes'
        unique_together = (('cod_empresa', 'periodo', 'codplancta', 'codplanaux', 'anho', 'mes'),)


class Presuprequerimientos(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    cod_requerimiento = models.CharField(max_length=5)
    des_requerimiento = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'presuprequerimientos'
        unique_together = (('cod_empresa', 'cod_requerimiento'),)


class Presuprequsuarios(models.Model):
    cod_empresa = models.ForeignKey(Presuprequerimientos, db_column='cod_empresa')
    cod_requerimiento = models.CharField(max_length=5)
    cod_usuario = models.ForeignKey('Usuarios', db_column='cod_usuario')

    class Meta:
        managed = False
        db_table = 'presuprequsuarios'
        unique_together = (('cod_empresa', 'cod_requerimiento', 'cod_usuario'),)


class Presupuesto(models.Model):
    cod_empresa = models.ForeignKey(Plancta, db_column='cod_empresa')
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    montoinicial = models.DecimalField(max_digits=19, decimal_places=4)
    modificacion = models.DecimalField(max_digits=19, decimal_places=4)

    class Meta:
        managed = False
        db_table = 'presupuesto'


class Prf(models.Model):
    msg = models.CharField(max_length=1000, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'prf'


class Prf2(models.Model):
    msg = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'prf2'


class Profesionales(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_profesional = models.CharField(max_length=8)
    des_profesional = models.CharField(max_length=200)
    cod_ramo = models.CharField(max_length=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'profesionales'
        unique_together = (('cod_empresa', 'cod_profesional'),)


class ProformaCab(models.Model):
    nro_proforma = models.DecimalField(max_digits=9, decimal_places=0)
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    cod_usuario = models.ForeignKey('Usuarios', db_column='cod_usuario', blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    estado = models.CharField(max_length=2, blank=True, null=True)
    cod_con_vta = models.CharField(max_length=2)
    cod_tp_pago = models.CharField(max_length=2)
    tipo_vta = models.CharField(max_length=2)
    com_vendedor = models.DecimalField(max_digits=4, decimal_places=2)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    codtpfactura = models.CharField(max_length=4, blank=True, null=True)
    totalfca = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    totalcpt = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    flete = models.CharField(max_length=30, blank=True, null=True)
    seguro = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'proforma_cab'
        unique_together = (('nro_proforma', 'cod_empresa', 'cod_sucursal'),)


class ProformaDet(models.Model):
    nro_proforma = models.ForeignKey(ProformaCab, db_column='nro_proforma')
    cod_sucursal = models.CharField(max_length=2)
    cod_empresa = models.ForeignKey(Articulo, db_column='cod_empresa')
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True)
    costototalarticulo = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2)
    pesoneto = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    pesobruto = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'proforma_det'
        unique_together = (('nro_proforma', 'cod_sucursal', 'cod_empresa', 'cod_articulo', 'linea'),)


class Proformacab(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    codprov = models.CharField(max_length=4)
    cod_tp_comp = models.CharField(max_length=4)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2)
    coddpto = models.CharField(max_length=10)
    tipocompra = models.CharField(max_length=1)
    codbanco = models.ForeignKey(Bancos, db_column='codbanco', blank=True, null=True)
    cod_con_vta = models.ForeignKey('Terminos', db_column='cod_con_vta')
    fechafact = models.DateTimeField()
    fechavto = models.DateTimeField()
    fechacarga = models.DateTimeField()
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda')
    factcambio = models.DecimalField(max_digits=19, decimal_places=4)
    multiplocosto = models.DecimalField(max_digits=19, decimal_places=4)
    totalexen = models.DecimalField(max_digits=19, decimal_places=4)
    totalgrav = models.DecimalField(max_digits=19, decimal_places=4)
    iva = models.DecimalField(max_digits=19, decimal_places=4)
    dcto = models.DecimalField(max_digits=5, decimal_places=2)
    saldo = models.DecimalField(max_digits=19, decimal_places=4)
    planctaprov = models.CharField(max_length=11, blank=True, null=True)
    planauxprov = models.CharField(max_length=11, blank=True, null=True)
    costogasto = models.CharField(max_length=1)
    asentado = models.CharField(max_length=1)
    ivaincluido = models.CharField(max_length=1)
    gravado = models.CharField(max_length=1)
    fondofijo = models.CharField(max_length=1)
    nroffijo = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    mesffijo = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    anhoffijo = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_compref = models.CharField(max_length=4, blank=True, null=True)
    nrofactref = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    nrorendicion = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    nroreferencia = models.CharField(max_length=20, blank=True, null=True)
    nrofactstr = models.CharField(max_length=20, blank=True, null=True)
    dctomontograv = models.DecimalField(max_digits=19, decimal_places=4)
    dctomontoexen = models.DecimalField(max_digits=19, decimal_places=4)
    dctomonto = models.DecimalField(max_digits=19, decimal_places=4)
    enviadoaf = models.CharField(max_length=1)
    codresponsable = models.CharField(max_length=4, blank=True, null=True)
    anho = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    nrodespacho = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    ajuste = models.DecimalField(max_digits=19, decimal_places=4)
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    nroordcomp = models.CharField(max_length=20, blank=True, null=True)
    fechaingreso = models.DateTimeField(blank=True, null=True)
    incluirextracto = models.CharField(max_length=1)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    facturado = models.CharField(max_length=1, blank=True, null=True)
    recargograv = models.DecimalField(max_digits=19, decimal_places=4)
    recargoexen = models.DecimalField(max_digits=19, decimal_places=4)
    pesoneto = models.DecimalField(max_digits=10, decimal_places=2)
    pesobruto = models.DecimalField(max_digits=10, decimal_places=2)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    tipoiva = models.CharField(max_length=1, blank=True, null=True)
    nro_ot = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    total_iva_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    dctomontoexen_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    dctomontograv_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ruc = models.CharField(max_length=15, blank=True, null=True)
    razonsocial = models.CharField(max_length=60, blank=True, null=True)
    gravado5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    gravado10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    timbrado = models.CharField(max_length=20, blank=True, null=True)
    codmonedacostome = models.CharField(max_length=2, blank=True, null=True)
    tasacambiocostome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montoretiva = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montoretrenta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    origenprunit = models.CharField(max_length=1)
    codprovagentelocal = models.CharField(max_length=4, blank=True, null=True)
    fechaembarque = models.DateField(blank=True, null=True)
    lineamaritima = models.CharField(max_length=40, blank=True, null=True)
    buque = models.CharField(max_length=40, blank=True, null=True)
    datosviaje = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'proformacab'
        unique_together = (('cod_empresa', 'codprov', 'cod_tp_comp', 'nrofact'),)


class Proformadet(models.Model):
    cod_empresa = models.ForeignKey(Proformacab, db_column='cod_empresa')
    codprov = models.CharField(max_length=4)
    cod_tp_comp = models.CharField(max_length=4)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=2)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4)
    preciocosto = models.DecimalField(max_digits=19, decimal_places=4)
    gravexen = models.CharField(max_length=1)
    total = models.DecimalField(max_digits=19, decimal_places=4)
    iva = models.DecimalField(max_digits=19, decimal_places=4)
    planctaart = models.CharField(max_length=11, blank=True, null=True)
    planauxart = models.CharField(max_length=11, blank=True, null=True)
    envactfijo = models.CharField(max_length=1)
    comentario = models.CharField(max_length=40, blank=True, null=True)
    descuentomonto = models.DecimalField(max_digits=19, decimal_places=4)
    recargomonto = models.DecimalField(max_digits=19, decimal_places=4)
    esmuestra = models.CharField(max_length=1)
    cantfaltante = models.DecimalField(max_digits=13, decimal_places=2)
    arancelcosto = models.CharField(max_length=1)
    costofob = models.DecimalField(max_digits=19, decimal_places=4)
    nro_ot = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    esgasto = models.CharField(max_length=1)
    ctaimpcurso = models.CharField(max_length=11, blank=True, null=True)
    auximpcurso = models.CharField(max_length=11, blank=True, null=True)
    porc_iva = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porcpartgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montopartgravado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    agregcostoantprorr = models.CharField(max_length=1)
    prorrateargastopor = models.CharField(max_length=1)
    m3 = models.DecimalField(max_digits=10, decimal_places=5)
    peso = models.DecimalField(max_digits=10, decimal_places=5)
    porcarancelario = models.DecimalField(max_digits=5, decimal_places=2)
    codinciso = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'proformadet'
        unique_together = (('cod_empresa', 'codprov', 'cod_tp_comp', 'nrofact', 'linea'),)


class PromoExterno(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    fechadesde = models.DateField()
    fechahasta = models.DateField()
    activo = models.CharField(max_length=1)
    porc_comision = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'promo_externo'
        unique_together = (('cod_empresa', 'cod_articulo', 'fechadesde', 'activo'),)


class Provartic(models.Model):
    cod_empresa = models.ForeignKey(Articulo, db_column='cod_empresa')
    codprov = models.CharField(max_length=4)
    cod_articulo = models.CharField(max_length=14)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4)
    fha_ult_mov = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'provartic'
        unique_together = (('cod_empresa', 'codprov', 'cod_articulo'),)


class Proveed(models.Model):
    cod_empresa = models.ForeignKey(Plancta, db_column='cod_empresa')
    codprov = models.CharField(max_length=4)
    tipoprov = models.CharField(max_length=2)
    ruc = models.CharField(max_length=15, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    planctaantic = models.CharField(max_length=11, blank=True, null=True)
    planauxantic = models.CharField(max_length=11, blank=True, null=True)
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda')
    bancooplocal = models.ForeignKey(Bancos, db_column='bancooplocal', blank=True, null=True)
    bancoopext = models.ForeignKey(Bancos, db_column='bancoopext', blank=True, null=True)
    codpais = models.ForeignKey(Pais, db_column='codpais', blank=True, null=True)
    cod_localidad = models.CharField(max_length=3, blank=True, null=True)
    razonsocial = models.CharField(max_length=60)
    encargado = models.CharField(max_length=40, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    fax = models.CharField(max_length=25, blank=True, null=True)
    email = models.CharField(max_length=30, blank=True, null=True)
    http = models.CharField(max_length=60, blank=True, null=True)
    observ = models.CharField(max_length=1000, blank=True, null=True)
    cod_tp_pago = models.CharField(max_length=2, blank=True, null=True)
    cod_con_vta = models.ForeignKey('Terminos', db_column='cod_con_vta', blank=True, null=True)
    diaspedido = models.CharField(max_length=7, blank=True, null=True)
    ivaincluido = models.CharField(max_length=1, blank=True, null=True)
    ctabancoloc = models.CharField(max_length=20, blank=True, null=True)
    ctabancoext = models.CharField(max_length=20, blank=True, null=True)
    fechacreacion = models.DateTimeField(blank=True, null=True)
    usrcreacion = models.CharField(max_length=16, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    fechamodif = models.DateTimeField(blank=True, null=True)
    usrmodif = models.CharField(max_length=16, blank=True, null=True)
    nroform = models.CharField(max_length=15, blank=True, null=True)
    cod_original = models.CharField(max_length=30, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    detallarcomprascoa = models.CharField(max_length=1, blank=True, null=True)
    tipocalcmaquila = models.CharField(max_length=1, blank=True, null=True)
    timbrado = models.CharField(max_length=20, blank=True, null=True)
    fechatimini = models.DateTimeField(blank=True, null=True)
    fechatimfin = models.DateTimeField(blank=True, null=True)
    retenible = models.CharField(max_length=1, blank=True, null=True)
    diastransito = models.DecimalField(max_digits=3, decimal_places=0)
    controlartimbrado = models.CharField(max_length=1, blank=True, null=True)
    cod_rubro = models.CharField(max_length=3)
    retenible_renta = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'proveed'
        unique_together = (('cod_empresa', 'codprov'),)


class ProveedAjustSaldo(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fechafact = models.DateTimeField(blank=True, null=True)
    saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldocuota = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    diferencia = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'proveed_ajust_saldo'


class Provrubro(models.Model):
    cod_empresa = models.ForeignKey(Proveed, db_column='cod_empresa')
    codprov = models.CharField(max_length=4)
    codrubro = models.ForeignKey('Rubros', db_column='codrubro')
    nroitem = models.DecimalField(max_digits=4, decimal_places=0)

    class Meta:
        managed = False
        db_table = 'provrubro'
        unique_together = (('cod_empresa', 'codprov', 'codrubro'),)


class PsMessageerrors(models.Model):
    ps_messageid = models.FloatField(blank=True, null=True)
    ps_messagetext = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ps_messageerrors'


class Ptoexpedicion(models.Model):
    cod_establecimiento = models.CharField(max_length=3)
    cod_ptoexpedicion = models.CharField(max_length=3)
    cod_tipodoc = models.CharField(max_length=4)
    descrip = models.CharField(max_length=50, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)

    class Meta:
        managed = False
        db_table = 'ptoexpedicion'
        unique_together = (('cod_establecimiento', 'cod_ptoexpedicion', 'cod_tipodoc', 'cod_empresa', 'cod_sucursal'),)


class Ramosclientes(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_ramo = models.CharField(max_length=8)
    des_ramo = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ramosclientes'
        unique_together = (('cod_empresa', 'cod_ramo'),)


class RaulUpdCartera(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    mvto_numero = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    max_cuota = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    max_cuota_cn_saldo = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'raul_upd_cartera'


class Recaudcab(models.Model):
    cod_empresa = models.ForeignKey('Sucursal', db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0)
    cod_cajero = models.ForeignKey('Usuarios', db_column='cod_cajero', blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    estado = models.CharField(max_length=2)
    preparadopor = models.CharField(max_length=50, blank=True, null=True)
    controladopor = models.CharField(max_length=50, blank=True, null=True)
    observ = models.CharField(max_length=50, blank=True, null=True)
    nrocaja = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    estacion = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recaudcab'
        unique_together = (('cod_empresa', 'cod_sucursal', 'nroplanilla'),)


class RecaudcabUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0)
    cod_cajero = models.CharField(max_length=16, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    estado = models.CharField(max_length=2)
    preparadopor = models.CharField(max_length=50, blank=True, null=True)
    controladopor = models.CharField(max_length=50, blank=True, null=True)
    observ = models.CharField(max_length=50, blank=True, null=True)
    nrocaja = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    estacion = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recaudcab_unif'
        unique_together = (('cod_empresa', 'cod_sucursal', 'nroplanilla'),)


class Recaudcheques(models.Model):
    cod_empresa = models.ForeignKey('Recauddet', db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0)
    nrooperacion = models.DecimalField(max_digits=5, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    codbanco = models.ForeignKey(Cheques, db_column='codbanco')
    nrocheque = models.CharField(max_length=12)
    lineacheque = models.DecimalField(max_digits=3, decimal_places=0)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recaudcheques'
        unique_together = (('cod_empresa', 'cod_sucursal', 'nroplanilla', 'nrooperacion', 'linea', 'codbanco', 'nrocheque', 'lineacheque'),)


class RecaudchequesUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0)
    nrooperacion = models.DecimalField(max_digits=5, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    codbanco = models.CharField(max_length=3)
    nrocheque = models.CharField(max_length=12)
    lineacheque = models.DecimalField(max_digits=3, decimal_places=0)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recaudcheques_unif'
        unique_together = (('cod_empresa', 'cod_sucursal', 'nroplanilla', 'nrooperacion', 'linea', 'codbanco', 'nrocheque', 'lineacheque'),)


class Recaudcomp(models.Model):
    cod_empresa = models.ForeignKey('Recaudop', db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0)
    nrooperacion = models.DecimalField(max_digits=5, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    aplicacion = models.CharField(max_length=1, blank=True, null=True)
    lineapagosdet = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recaudcomp'
        unique_together = (('cod_empresa', 'cod_sucursal', 'nroplanilla', 'nrooperacion', 'linea'),)


class RecaudcompUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0)
    nrooperacion = models.DecimalField(max_digits=5, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    aplicacion = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recaudcomp_unif'
        unique_together = (('cod_empresa', 'cod_sucursal', 'nroplanilla', 'nrooperacion', 'linea'),)


class Recauddet(models.Model):
    cod_empresa = models.ForeignKey('Vtacab', db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0)
    nrooperacion = models.DecimalField(max_digits=5, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    cod_tp_pago = models.CharField(max_length=2, blank=True, null=True)
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda', blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    cambioaplicado = models.DecimalField(max_digits=19, decimal_places=4)
    observ = models.CharField(max_length=50, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recauddet'
        unique_together = (('cod_empresa', 'cod_sucursal', 'nroplanilla', 'nrooperacion', 'linea'),)


class RecauddetUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0)
    nrooperacion = models.DecimalField(max_digits=5, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    cod_tp_pago = models.CharField(max_length=2, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    cambioaplicado = models.DecimalField(max_digits=19, decimal_places=4)
    observ = models.CharField(max_length=50, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recauddet_unif'
        unique_together = (('cod_empresa', 'cod_sucursal', 'nroplanilla', 'nrooperacion', 'linea'),)


class Recaudop(models.Model):
    cod_empresa = models.ForeignKey(Recaudcab, db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0)
    nrooperacion = models.DecimalField(max_digits=5, decimal_places=0)
    observ = models.CharField(max_length=60, blank=True, null=True)
    origen = models.CharField(max_length=1, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recaudop'
        unique_together = (('cod_empresa', 'cod_sucursal', 'nroplanilla', 'nrooperacion'),)


class RecaudopUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0)
    nrooperacion = models.DecimalField(max_digits=5, decimal_places=0)
    observ = models.CharField(max_length=60, blank=True, null=True)
    origen = models.CharField(max_length=1, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recaudop_unif'
        unique_together = (('cod_empresa', 'cod_sucursal', 'nroplanilla', 'nrooperacion'),)


class Recaudresumen(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp_planilla = models.CharField(max_length=4)
    comp_numero_planilla = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=9, decimal_places=0)
    cod_tp_pago = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    codmoneda = models.CharField(max_length=2)
    factcambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    nrocheque = models.CharField(max_length=12, blank=True, null=True)
    feccheque = models.DateField(blank=True, null=True)
    fechavto = models.DateField(blank=True, null=True)
    cod_establecimiento = models.CharField(max_length=3, blank=True, null=True)
    cod_ptoexpedicion = models.CharField(max_length=3, blank=True, null=True)
    comp_nro_timb = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    codretencion = models.CharField(max_length=5, blank=True, null=True)
    observ = models.CharField(max_length=50, blank=True, null=True)
    fecha = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recaudresumen'
        unique_together = (('cod_empresa', 'cod_tp_comp_planilla', 'comp_numero_planilla', 'linea'),)


class Refcomcli(models.Model):
    cod_empresa = models.ForeignKey(Clientes, db_column='cod_empresa')
    cod_cliente = models.CharField(max_length=8)
    item = models.DecimalField(max_digits=3, decimal_places=0)
    razonsocial = models.CharField(max_length=50)
    tipo = models.CharField(max_length=2)
    total_credito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cant_cuota = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    importe_cuota = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuota_pagada = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    garantia = models.CharField(max_length=2, blank=True, null=True)
    observacion = models.CharField(max_length=300, blank=True, null=True)
    cumplimiento = models.CharField(max_length=18, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'refcomcli'
        unique_together = (('cod_empresa', 'cod_cliente', 'item', 'tipo'),)


class Refcomcred(models.Model):
    cod_empresa = models.ForeignKey('Soliccred', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    codsolicitud = models.CharField(max_length=15, blank=True, null=True)
    item = models.DecimalField(max_digits=3, decimal_places=0)
    razonsocial = models.CharField(max_length=50)
    tipo = models.CharField(max_length=2)
    total_credito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cant_cuota = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    importe_cuota = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuota_pagada = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    garantia = models.CharField(max_length=2, blank=True, null=True)
    observacion = models.CharField(max_length=300, blank=True, null=True)
    cumplimiento = models.CharField(max_length=18, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'refcomcred'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'item', 'tipo'),)


class RefcomcredUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    codsolicitud = models.CharField(max_length=15)
    item = models.DecimalField(max_digits=3, decimal_places=0)
    razonsocial = models.CharField(max_length=50)
    tipo = models.CharField(max_length=2)
    total_credito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cant_cuota = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    importe_cuota = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuota_pagada = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    garantia = models.CharField(max_length=2, blank=True, null=True)
    observacion = models.CharField(max_length=300, blank=True, null=True)
    cumplimiento = models.CharField(max_length=18, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'refcomcred_unif'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'codsolicitud', 'item'),)


class Refperscli(models.Model):
    cod_empresa = models.ForeignKey(Clientes, db_column='cod_empresa')
    cod_cliente = models.CharField(max_length=8)
    item = models.DecimalField(max_digits=3, decimal_places=0)
    razonsocial = models.CharField(max_length=50)
    tipo = models.CharField(max_length=2)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    relacion = models.CharField(max_length=25, blank=True, null=True)
    trabajo = models.CharField(max_length=1, blank=True, null=True)
    direccion = models.CharField(max_length=1, blank=True, null=True)
    mensajes = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'refperscli'
        unique_together = (('cod_empresa', 'cod_cliente', 'item', 'tipo'),)


class Refperscred(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    codsolicitud = models.CharField(max_length=15, blank=True, null=True)
    item = models.DecimalField(max_digits=3, decimal_places=0)
    razonsocial = models.CharField(max_length=50)
    tipo = models.CharField(max_length=2)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    relacion = models.CharField(max_length=25, blank=True, null=True)
    trabajo = models.CharField(max_length=1, blank=True, null=True)
    direccion = models.CharField(max_length=1, blank=True, null=True)
    mensajes = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'refperscred'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'item', 'tipo'),)


class RefperscredUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    codsolicitud = models.CharField(max_length=15)
    item = models.DecimalField(max_digits=3, decimal_places=0)
    razonsocial = models.CharField(max_length=50)
    tipo = models.CharField(max_length=2)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    relacion = models.CharField(max_length=25, blank=True, null=True)
    trabajo = models.CharField(max_length=1, blank=True, null=True)
    direccion = models.CharField(max_length=1, blank=True, null=True)
    mensajes = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'refperscred_unif'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'codsolicitud', 'item'),)


class RegenOp(models.Model):
    codprov = models.CharField(max_length=4, blank=True, null=True)
    tipoop = models.CharField(max_length=1, blank=True, null=True)
    nroop = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'regen_op'


class Remiscab(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0)
    fha_cbte = models.DateTimeField()
    cod_con_vta = models.ForeignKey('Terminos', db_column='cod_con_vta')
    cod_tp_pago = models.CharField(max_length=2)
    tipo_vta = models.ForeignKey('Tpovta', db_column='tipo_vta')
    cod_vendedor = models.ForeignKey('Vendedor', db_column='cod_vendedor', blank=True, null=True)
    com_vendedor = models.DecimalField(max_digits=4, decimal_places=2)
    comisman = models.CharField(max_length=1)
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda', blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    to_exento = models.DecimalField(max_digits=19, decimal_places=4)
    to_gravado = models.DecimalField(max_digits=19, decimal_places=4)
    total_iva = models.DecimalField(max_digits=19, decimal_places=4)
    tipo_iva = models.CharField(max_length=1)
    autorizado = models.CharField(max_length=1)
    anulado = models.CharField(max_length=1)
    cod_usuario = models.CharField(max_length=16)
    rf_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    caja = models.CharField(max_length=60, blank=True, null=True)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    asentadocv = models.CharField(max_length=1, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    codplancta_dif = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_dif = models.CharField(max_length=11, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    total_diferido = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_venta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    empresacompra = models.CharField(max_length=2, blank=True, null=True)
    codprovcompra = models.CharField(max_length=4, blank=True, null=True)
    nrofactcompra = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    descuento2do = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    tot2dodctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldescuento = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctoexen_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    empresadevolucion = models.CharField(max_length=2, blank=True, null=True)
    sectorfacturacion = models.CharField(max_length=12, blank=True, null=True)
    comp_numero_orig = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    usuario_chg_nro = models.CharField(max_length=16, blank=True, null=True)
    fecha_chg_numero = models.DateTimeField(blank=True, null=True)
    fechaentreganc = models.DateTimeField(blank=True, null=True)
    nroservicio = models.CharField(max_length=20, blank=True, null=True)
    cod_tp_comp_orig = models.CharField(max_length=4, blank=True, null=True)
    montopagado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    vuelto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    nrocaja = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    modfecha = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    nro_proforma = models.ForeignKey(ProformaCab, db_column='nro_proforma', blank=True, null=True)
    to_gravado_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    to_gravado_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codtpsolcred = models.CharField(max_length=4, blank=True, null=True)
    compnrosolcred = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    cargado_el = models.DateTimeField(blank=True, null=True)
    cargado_por = models.CharField(max_length=16, blank=True, null=True)
    anulado_el = models.DateTimeField(blank=True, null=True)
    anulado_por = models.CharField(max_length=16, blank=True, null=True)
    cod_camion = models.CharField(max_length=8, blank=True, null=True)
    nro_chofer = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    nrotimb = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_establecimiento = models.CharField(max_length=3, blank=True, null=True)
    cod_ptoexpedicion = models.CharField(max_length=3, blank=True, null=True)
    cod_tipodoc = models.CharField(max_length=4, blank=True, null=True)
    comp_nro_timb = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    nrotransaccv = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    reg_turismo = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'remiscab'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'cod_sucursal'),)


class Remisdet(models.Model):
    cod_empresa = models.ForeignKey(Artdep, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4)
    total = models.DecimalField(max_digits=19, decimal_places=4)
    cod_vendedor = models.ForeignKey('Vendedor', db_column='cod_vendedor', blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tp_remis = models.CharField(max_length=4, blank=True, null=True)
    nro_remis = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    descrip = models.CharField(max_length=200, blank=True, null=True)
    manual = models.CharField(max_length=1, blank=True, null=True)
    cantcajas = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    totaldcto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    cantminima = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cod_juego = models.CharField(max_length=14, blank=True, null=True)
    cantjuego = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    total_neto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    tp_presup = models.CharField(max_length=4, blank=True, null=True)
    nro_presup = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    tp_ref_nc = models.CharField(max_length=4, blank=True, null=True)
    nro_ref_nc = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    prt_cod_deposito = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_cod_articulo = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_cantidad = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_pr_unit = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_descuento = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_totaldcto = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_total = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    descuento_cant = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    manual_dcto = models.CharField(max_length=1, blank=True, null=True)
    cod_comodato = models.CharField(max_length=14, blank=True, null=True)
    linea_presup = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    ordenfact = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    nrodescarga = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    porcpartgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montopartgravado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    linea_ref_nc = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    peso_bruto = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    peso_tara = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    peso_promedio = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    cod_taras = models.CharField(max_length=24, blank=True, null=True)
    sucursal_orig = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'remisdet'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'linea'),)


class Remisserie(models.Model):
    cod_empresa = models.ForeignKey(Articulo, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=9, decimal_places=0)
    linea = models.DecimalField(max_digits=4, decimal_places=0)
    lineaserie = models.DecimalField(max_digits=4, decimal_places=0)
    nroserie = models.CharField(max_length=20)
    observ = models.CharField(max_length=100, blank=True, null=True)
    fechagarantia = models.DateTimeField(blank=True, null=True)
    idarticulo = models.IntegerField(blank=True, null=True)
    iddeposito = models.IntegerField(blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    marca = models.CharField(max_length=30, blank=True, null=True)
    modelo = models.CharField(max_length=30, blank=True, null=True)
    nromotor = models.CharField(max_length=30, blank=True, null=True)
    color = models.CharField(max_length=30, blank=True, null=True)
    nro_certif = models.DecimalField(max_digits=13, decimal_places=0, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'remisserie'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'linea', 'lineaserie'),)


class Repartoscab(models.Model):
    cod_empresa = models.ForeignKey(Chofer, db_column='cod_empresa')
    nro_reparto = models.DecimalField(max_digits=9, decimal_places=0)
    fecha = models.DateTimeField(blank=True, null=True)
    cod_camion = models.CharField(max_length=8, blank=True, null=True)
    codmarca = models.ForeignKey(Marca, db_column='codmarca', blank=True, null=True)
    chapatracto = models.CharField(max_length=15, blank=True, null=True)
    nro_chofer = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cod_ayudante = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    cod_tp_reparto = models.CharField(max_length=4)
    nroserie = models.CharField(max_length=12)

    class Meta:
        managed = False
        db_table = 'repartoscab'
        unique_together = (('cod_empresa', 'nro_reparto', 'cod_tp_reparto'),)


class Repartosctrlkm(models.Model):
    cod_empresa = models.CharField(max_length=2)
    nro_reparto = models.DecimalField(max_digits=9, decimal_places=0)
    linea = models.DecimalField(max_digits=5, decimal_places=0)
    hora_salida = models.TimeField(blank=True, null=True)
    km_inicial = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    hora_llegada = models.TimeField(blank=True, null=True)
    km_llegada = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    total_horas = models.TimeField(blank=True, null=True)
    km_recorrido = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cod_tp_reparto = models.CharField(max_length=4)

    class Meta:
        managed = False
        db_table = 'repartosctrlkm'
        unique_together = (('cod_empresa', 'nro_reparto', 'linea', 'cod_tp_reparto'),)


class Repartosdet(models.Model):
    cod_empresa = models.ForeignKey('Vtacab', db_column='cod_empresa')
    nro_reparto = models.DecimalField(max_digits=9, decimal_places=0)
    linea = models.DecimalField(max_digits=5, decimal_places=0)
    cantidad = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=100, blank=True, null=True)
    zona = models.CharField(max_length=80, blank=True, null=True)
    envios = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cod_vendedor = models.ForeignKey('Vendedor', db_column='cod_vendedor', blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    total_venta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_tp_pago = models.CharField(max_length=4, blank=True, null=True)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    total_pago = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    nro_flete = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    importeflete = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_tp_pagare = models.CharField(max_length=4, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    total_pagare = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    sin_entrega = models.CharField(max_length=1, blank=True, null=True)
    cod_garante = models.CharField(max_length=1, blank=True, null=True)
    horario = models.DateTimeField(blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    cod_camion = models.CharField(max_length=8, blank=True, null=True)
    nro_chofer = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cod_ayudante = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cod_tp_reparto = models.CharField(max_length=4)

    class Meta:
        managed = False
        db_table = 'repartosdet'
        unique_together = (('cod_empresa', 'nro_reparto', 'linea', 'cod_tp_reparto'),)


class Repartosobserv(models.Model):
    cod_empresa = models.CharField(max_length=2)
    nro_reparto = models.DecimalField(max_digits=9, decimal_places=0)
    linea = models.DecimalField(max_digits=5, decimal_places=0)
    hora_llegada = models.TimeField(blank=True, null=True)
    kilometraje = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    hora_salida = models.TimeField(blank=True, null=True)
    entragado = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    devuelto = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    observaciones = models.CharField(max_length=200, blank=True, null=True)
    codtipoaccion = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_camion = models.CharField(max_length=8, blank=True, null=True)
    nro_chofer = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cod_ayudante = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cod_tp_reparto = models.CharField(max_length=4)

    class Meta:
        managed = False
        db_table = 'repartosobserv'
        unique_together = (('cod_empresa', 'nro_reparto', 'linea', 'cod_tp_reparto'),)


class Responsable(models.Model):
    cod_empresa = models.CharField(max_length=2)
    codresponsable = models.CharField(max_length=4)
    apellido = models.CharField(max_length=30, blank=True, null=True)
    nombre = models.CharField(max_length=30, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    coddpto = models.CharField(max_length=2, blank=True, null=True)
    cargo = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'responsable'
        unique_together = (('cod_empresa', 'codresponsable'),)


class Resvtacab(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_inicial = models.DecimalField(max_digits=9, decimal_places=0)
    comp_final = models.DecimalField(max_digits=9, decimal_places=0)
    fecha = models.DateTimeField(blank=True, null=True)
    cod_cliente = models.CharField(max_length=8)
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda')
    factcambio = models.DecimalField(max_digits=19, decimal_places=4)

    class Meta:
        managed = False
        db_table = 'resvtacab'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_tp_comp', 'comp_inicial', 'comp_final'),)


class Resvtacajas(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa', blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cod_original = models.CharField(max_length=14, blank=True, null=True)
    nroarticulo = models.DecimalField(max_digits=14, decimal_places=0, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    tipomvto = models.CharField(max_length=1, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=9, decimal_places=3, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descrip = models.CharField(max_length=40, blank=True, null=True)
    existeart = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'resvtacajas'


class Resvtadet(models.Model):
    cod_empresa = models.ForeignKey(Resvtacab, db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_inicial = models.DecimalField(max_digits=9, decimal_places=0)
    comp_final = models.DecimalField(max_digits=9, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    cod_familia = models.ForeignKey(Familia, db_column='cod_familia')
    totalgravado = models.DecimalField(max_digits=19, decimal_places=4)
    totalexento = models.DecimalField(max_digits=19, decimal_places=4)
    totaliva = models.DecimalField(max_digits=19, decimal_places=4)

    class Meta:
        managed = False
        db_table = 'resvtadet'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_tp_comp', 'comp_inicial', 'comp_final', 'linea'),)


class Retenciones(models.Model):
    cod_empresa = models.CharField(max_length=2)
    codretencion = models.CharField(max_length=5)
    descrip = models.CharField(max_length=40, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    tpdef = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'retenciones'
        unique_together = (('cod_empresa', 'codretencion'),)


class Rubros(models.Model):
    codrubro = models.CharField(primary_key=True, max_length=3)
    descrip = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'rubros'


class RubrosProveed(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    cod_rubro = models.CharField(max_length=3)
    des_rubro = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'rubros_proveed'
        unique_together = (('cod_empresa', 'cod_rubro'),)


class Rubrosaf(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    codrubro = models.CharField(max_length=11)
    descrip = models.CharField(max_length=40)
    porcdeprec = models.DecimalField(max_digits=10, decimal_places=4)
    vidautil = models.DecimalField(max_digits=2, decimal_places=0)
    revaluable = models.CharField(max_length=1)
    depreciable = models.CharField(max_length=1)
    planctaactivo = models.CharField(max_length=11, blank=True, null=True)
    planauxactivo = models.CharField(max_length=11, blank=True, null=True)
    ctadeprejer = models.CharField(max_length=11, blank=True, null=True)
    auxdeprejer = models.CharField(max_length=11, blank=True, null=True)
    ctadeprnoded = models.CharField(max_length=11, blank=True, null=True)
    auxdeprnoded = models.CharField(max_length=11, blank=True, null=True)
    ctadepracum = models.CharField(max_length=11, blank=True, null=True)
    auxdepracum = models.CharField(max_length=11, blank=True, null=True)
    planctarev = models.CharField(max_length=11, blank=True, null=True)
    planauxrev = models.CharField(max_length=11, blank=True, null=True)
    tpdef = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'rubrosaf'
        unique_together = (('cod_empresa', 'codrubro'),)


class Rubrosiva(models.Model):
    codinciso = models.CharField(primary_key=True, max_length=8)
    codincisopadre = models.ForeignKey('self', db_column='codincisopadre', blank=True, null=True)
    descripcorta = models.CharField(max_length=40)
    descrip = models.CharField(max_length=250)

    class Meta:
        managed = False
        db_table = 'rubrosiva'


class RucEquivalencia(models.Model):
    ruc = models.CharField(primary_key=True, max_length=10)
    dv = models.CharField(max_length=1, blank=True, null=True)
    rucanterior = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ruc_equivalencia'


class Saldoclientes(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=15, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    grupo = models.CharField(max_length=10, blank=True, null=True)
    cod_calificacion = models.CharField(max_length=8, blank=True, null=True)
    saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cantidadclientes = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    cod_cartera = models.CharField(max_length=3, blank=True, null=True)
    mes = models.CharField(max_length=2, blank=True, null=True)
    anho = models.CharField(max_length=4, blank=True, null=True)
    saldoal = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'saldoclientes'


class Seccion(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    coddpto = models.CharField(max_length=2)
    codseccion = models.CharField(max_length=2)
    descrip = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'seccion'
        unique_together = (('cod_empresa', 'cod_sucursal', 'coddpto', 'codseccion'),)


class Secclabor(models.Model):
    codlugartrab = models.ForeignKey(Lugartrab, db_column='codlugartrab')
    codseccion = models.CharField(max_length=3)
    descrip = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'secclabor'
        unique_together = (('codlugartrab', 'codseccion'),)


class Segtopedidos(models.Model):
    cod_empresa = models.ForeignKey('Tipotramite', db_column='cod_empresa')
    nroordcomp = models.CharField(max_length=20)
    tipotramite = models.CharField(max_length=4)
    nrolinea = models.DecimalField(max_digits=3, decimal_places=0)
    nropedido = models.DecimalField(max_digits=7, decimal_places=0)
    fechainicio = models.DateTimeField()
    fechafin = models.DateTimeField(blank=True, null=True)
    descrip = models.CharField(max_length=40)
    cod_usuario = models.CharField(max_length=16)
    fechacambio = models.DateTimeField()
    cantdias = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'segtopedidos'
        unique_together = (('cod_empresa', 'nroordcomp', 'tipotramite', 'nrolinea'),)


class Serviscab(models.Model):
    cod_empresa = models.ForeignKey('Vtacab', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0)
    fha_cbte = models.DateTimeField()
    cod_con_vta = models.ForeignKey('Terminos', db_column='cod_con_vta')
    cod_tp_pago = models.CharField(max_length=2)
    tipo_vta = models.ForeignKey('Tpovta', db_column='tipo_vta')
    cod_vendedor = models.ForeignKey('Vendedor', db_column='cod_vendedor', blank=True, null=True)
    com_vendedor = models.DecimalField(max_digits=4, decimal_places=2)
    comisman = models.CharField(max_length=1)
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda', blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    to_exento = models.DecimalField(max_digits=19, decimal_places=4)
    to_gravado = models.DecimalField(max_digits=19, decimal_places=4)
    total_iva = models.DecimalField(max_digits=19, decimal_places=4)
    tipo_iva = models.CharField(max_length=1)
    autorizado = models.CharField(max_length=1)
    anulado = models.CharField(max_length=1)
    cod_usuario = models.CharField(max_length=16)
    rf_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    caja = models.CharField(max_length=60, blank=True, null=True)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    asentadocv = models.CharField(max_length=1, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    cod_cajero = models.CharField(max_length=16, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    codplancta_dif = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_dif = models.CharField(max_length=11, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    total_diferido = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_venta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    empresacompra = models.CharField(max_length=2, blank=True, null=True)
    codprovcompra = models.CharField(max_length=4, blank=True, null=True)
    nrofactcompra = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    totaldctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctoexen_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descuento2do = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    tot2dodctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldescuento = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'serviscab'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero'),)


class Servisdet(models.Model):
    cod_empresa = models.ForeignKey(Serviscab, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=2, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4)
    total = models.DecimalField(max_digits=19, decimal_places=4)
    cod_vendedor = models.ForeignKey('Vendedor', db_column='cod_vendedor', blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descrip = models.CharField(max_length=500, blank=True, null=True)
    cantcajas = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    tp_remis = models.CharField(max_length=4, blank=True, null=True)
    nro_remis = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    manual = models.CharField(max_length=1, blank=True, null=True)
    totaldcto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    codempleado = models.CharField(max_length=6, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'servisdet'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'linea'),)


class Servtecnicocab(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    fecharecep = models.DateTimeField(blank=True, null=True)
    estado = models.CharField(max_length=2, blank=True, null=True)
    tipoopservicio = models.CharField(max_length=2, blank=True, null=True)
    codtpvta = models.CharField(max_length=4, blank=True, null=True)
    compnrovta = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fechaventa = models.DateTimeField(blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    telefonos = models.CharField(max_length=60, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    fallaaparente = models.CharField(max_length=200, blank=True, null=True)
    informetecnico = models.CharField(max_length=18, blank=True, null=True)
    observ = models.CharField(max_length=2500, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    recepcionadopor = models.CharField(max_length=60, blank=True, null=True)
    tecnico = models.CharField(max_length=60, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    notaenvioprov = models.CharField(max_length=20, blank=True, null=True)
    cod_camion = models.CharField(max_length=8, blank=True, null=True)
    nro_chofer = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    nro_planilla = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    impreso = models.CharField(max_length=1, blank=True, null=True)
    nroactiv = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'servtecnicocab'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero'),)


class Servtecnicodet(models.Model):
    cod_empresa = models.ForeignKey(Articulo, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    engarantia = models.CharField(max_length=1, blank=True, null=True)
    nroserie = models.CharField(max_length=20, blank=True, null=True)
    modelo = models.CharField(max_length=20, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    fechaenvioprov = models.DateTimeField(blank=True, null=True)
    observ = models.CharField(max_length=200, blank=True, null=True)
    estado = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'servtecnicodet'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'cod_articulo'),)


class Servtecnicoestadochg(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    estado_new = models.CharField(max_length=2)
    estado_old = models.CharField(max_length=2, blank=True, null=True)
    fechachg = models.DateTimeField(blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    cant_dias = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'servtecnicoestadochg'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'estado_new'),)


class Servtecnicorecep(models.Model):
    cod_empresa = models.ForeignKey(Servtecnicocab, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    codcondrecep = models.CharField(max_length=2)
    estadorecep = models.CharField(max_length=1, blank=True, null=True)
    observ = models.CharField(max_length=60, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'servtecnicorecep'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'codcondrecep'),)


class Socios(models.Model):
    carnet = models.CharField(max_length=7)
    nrodependiente = models.DecimalField(max_digits=2, decimal_places=0)
    codcateg = models.CharField(max_length=2, blank=True, null=True)
    nombres = models.CharField(max_length=50)
    apellidos = models.CharField(max_length=50)
    codprofesion = models.CharField(max_length=3, blank=True, null=True)
    nacionalidad = models.CharField(max_length=3, blank=True, null=True)
    fecnac = models.DateTimeField(blank=True, null=True)
    lugarnac = models.CharField(max_length=50, blank=True, null=True)
    coddptopais = models.CharField(max_length=3, blank=True, null=True)
    codpais = models.CharField(max_length=3, blank=True, null=True)
    codciudad = models.CharField(max_length=3, blank=True, null=True)
    sexo = models.CharField(max_length=1)
    cedula = models.CharField(max_length=100, blank=True, null=True)
    estcivil = models.CharField(max_length=1)
    cuotasacumuladas = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    nroactaacept = models.CharField(max_length=15, blank=True, null=True)
    fechaacept = models.DateTimeField(blank=True, null=True)
    fecvencimcarnet = models.DateTimeField(blank=True, null=True)
    fecultemplaz = models.DateTimeField(blank=True, null=True)
    porcdiferido = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    feccambiocat = models.DateTimeField(blank=True, null=True)
    fecvenccompl = models.DateTimeField(blank=True, null=True)
    fecvitalicio = models.DateTimeField(blank=True, null=True)
    nroactavitalic = models.CharField(max_length=15, blank=True, null=True)
    ultestadoadmin = models.CharField(max_length=2, blank=True, null=True)
    mesultpago = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    anhoultpago = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    fecultpago = models.DateTimeField(blank=True, null=True)
    nrosol = models.CharField(max_length=15, blank=True, null=True)
    auxcuota = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    saldocomplementaria = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    mespagoant = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    anhopagoant = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    cntcuotasapagar = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    codcentro = models.CharField(max_length=3, blank=True, null=True)
    nroregcond = models.CharField(max_length=20, blank=True, null=True)
    codregistro = models.CharField(max_length=2, blank=True, null=True)
    regpais = models.CharField(max_length=3, blank=True, null=True)
    regdpto = models.CharField(max_length=3, blank=True, null=True)
    regmunicipio = models.CharField(max_length=3, blank=True, null=True)
    codgruposang = models.CharField(max_length=2, blank=True, null=True)
    codasesor = models.CharField(max_length=3, blank=True, null=True)
    ocupacion = models.CharField(max_length=50, blank=True, null=True)
    codtipodoc = models.CharField(max_length=3, blank=True, null=True)
    beneficiario = models.CharField(max_length=50, blank=True, null=True)
    docbeneficiario = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'socios'
        unique_together = (('carnet', 'nrodependiente'),)


class Solcotiz(models.Model):
    cod_empresa = models.ForeignKey(Pedsumcab, db_column='cod_empresa')
    codsolic = models.CharField(max_length=8)
    codprov = models.CharField(max_length=4)
    codpedsum = models.CharField(max_length=8)
    contacto = models.CharField(max_length=40, blank=True, null=True)
    nropedido = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'solcotiz'
        unique_together = (('cod_empresa', 'codsolic', 'codprov'),)


class Solcotizcab(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    nropedido = models.DecimalField(max_digits=7, decimal_places=0)
    codprov = models.CharField(max_length=4)
    contacto = models.CharField(max_length=60, blank=True, null=True)
    fechasolic = models.DateTimeField()
    fechaentrega = models.DateTimeField()
    observ = models.CharField(max_length=250, blank=True, null=True)
    aceptado = models.CharField(max_length=1, blank=True, null=True)
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda', blank=True, null=True)
    tipocosto = models.CharField(max_length=3, blank=True, null=True)
    obstipocosto = models.CharField(max_length=200, blank=True, null=True)
    medioembarque = models.CharField(max_length=1, blank=True, null=True)
    seguro = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    flete = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tribaduana = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    plazo = models.CharField(max_length=40, blank=True, null=True)
    referencedoc = models.BinaryField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'solcotizcab'
        unique_together = (('cod_empresa', 'nropedido', 'codprov'),)


class Solcotizdet(models.Model):
    cod_empresa = models.ForeignKey(Articulo, db_column='cod_empresa')
    nropedido = models.DecimalField(max_digits=7, decimal_places=0)
    codprov = models.CharField(max_length=4)
    linea = models.DecimalField(max_digits=4, decimal_places=0)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    precio = models.DecimalField(max_digits=19, decimal_places=4)
    marca = models.CharField(max_length=40, blank=True, null=True)
    codiva = models.CharField(max_length=1, blank=True, null=True)
    iva = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    aprobado = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'solcotizdet'
        unique_together = (('cod_empresa', 'nropedido', 'codprov', 'linea'),)


class Soliccred(models.Model):
    cod_empresa = models.ForeignKey(Clientes, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    codsolicitud = models.CharField(max_length=15, blank=True, null=True)
    codconyugue = models.CharField(max_length=8, blank=True, null=True)
    codcodeudor = models.CharField(max_length=8, blank=True, null=True)
    codcodeudorconyug = models.CharField(max_length=8, blank=True, null=True)
    cuotainicial = models.DecimalField(max_digits=19, decimal_places=4)
    venccuotaini = models.DateField(blank=True, null=True)
    aplicarcuotainicial = models.CharField(max_length=1, blank=True, null=True)
    porc_descuento = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    tiposolcred = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'soliccred'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero'),)


class SoliccredUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    codsolicitud = models.CharField(max_length=15)
    codconyugue = models.CharField(max_length=8, blank=True, null=True)
    codcodeudor = models.CharField(max_length=8, blank=True, null=True)
    codcodeudorconyug = models.CharField(max_length=8, blank=True, null=True)
    cuotainicial = models.DecimalField(max_digits=19, decimal_places=4)
    venccuotaini = models.DateField(blank=True, null=True)
    aplicarcuotainicial = models.CharField(max_length=1, blank=True, null=True)
    porc_descuento = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    tiposolcred = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'soliccred_unif'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'codsolicitud'),)


class Stcab(models.Model):
    cod_empresa = models.ForeignKey('Tpocbte', db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    fha_mvto = models.DateTimeField()
    cod_sucursal2 = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito2 = models.CharField(max_length=2, blank=True, null=True)
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda', blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    tot_importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16)
    des_movimiento = models.CharField(max_length=60, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    tipo_iva = models.CharField(max_length=1, blank=True, null=True)
    nropedido = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    impreso = models.CharField(max_length=1)
    anulado = models.CharField(max_length=1)
    cod_deposito_anul = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp_anul = models.CharField(max_length=4, blank=True, null=True)
    comp_numero_anul = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    responsable = models.CharField(max_length=8, blank=True, null=True)
    sectorfacturacion = models.CharField(max_length=12, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    cod_camion = models.CharField(max_length=8, blank=True, null=True)
    nro_chofer = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    nrotimb = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_establecimiento = models.CharField(max_length=3, blank=True, null=True)
    cod_ptoexpedicion = models.CharField(max_length=3, blank=True, null=True)
    cod_tipodoc = models.CharField(max_length=4, blank=True, null=True)
    comp_nro_timb = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    comp_numero1desde = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    comp_numero1hasta = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    comp_numero2desde = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    comp_numero2hasta = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    direccion = models.CharField(max_length=100, blank=True, null=True)
    cod_ayudante = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cod_tp_comp_vend_planilla = models.CharField(max_length=4, blank=True, null=True)
    comp_numero_vend_planilla = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    comp_numero_planilla_vend_planilla = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stcab'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_deposito', 'cod_tp_comp', 'comp_numero'),)


class StcabSync(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fha_mvto = models.DateTimeField(blank=True, null=True)
    cod_sucursal2 = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito2 = models.CharField(max_length=2, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot_importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    des_movimiento = models.CharField(max_length=60, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    tipo_iva = models.CharField(max_length=1, blank=True, null=True)
    nropedido = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    impreso = models.CharField(max_length=1)
    anulado = models.CharField(max_length=1)
    cod_deposito_anul = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp_anul = models.CharField(max_length=4, blank=True, null=True)
    comp_numero_anul = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stcab_sync'


class StcabUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    fha_mvto = models.DateTimeField()
    cod_sucursal2 = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito2 = models.CharField(max_length=2, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    tot_importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16)
    des_movimiento = models.CharField(max_length=60, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    tipo_iva = models.CharField(max_length=1, blank=True, null=True)
    nropedido = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    impreso = models.CharField(max_length=1)
    anulado = models.CharField(max_length=1)
    cod_deposito_anul = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp_anul = models.CharField(max_length=4, blank=True, null=True)
    comp_numero_anul = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    responsable = models.CharField(max_length=8, blank=True, null=True)
    sectorfacturacion = models.CharField(max_length=12, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    cod_camion = models.CharField(max_length=8, blank=True, null=True)
    nro_chofer = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    nrotimb = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_establecimiento = models.CharField(max_length=3, blank=True, null=True)
    cod_ptoexpedicion = models.CharField(max_length=3, blank=True, null=True)
    cod_tipodoc = models.CharField(max_length=4, blank=True, null=True)
    comp_nro_timb = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    comp_numero1desde = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    comp_numero1hasta = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    comp_numero2desde = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    comp_numero2hasta = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stcab_unif'
        unique_together = (('cod_empresa', 'cod_deposito', 'cod_tp_comp', 'comp_numero'),)


class Stdet(models.Model):
    cod_empresa = models.ForeignKey(Artdep, db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=5, decimal_places=0)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4)
    rf_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    concepto = models.CharField(max_length=60, blank=True, null=True)
    planctaart = models.CharField(max_length=11, blank=True, null=True)
    planauxart = models.CharField(max_length=11, blank=True, null=True)
    pr_vta = models.DecimalField(max_digits=19, decimal_places=4)
    cantcajas = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    listaventa = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    listaprec = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    tp_presup = models.CharField(max_length=4, blank=True, null=True)
    nro_presup = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    faltante = models.DecimalField(max_digits=13, decimal_places=3)
    linea_presup = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    ordenfact = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    peso_bruto = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    peso_tara = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    peso_promedio = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    cod_taras = models.CharField(max_length=24, blank=True, null=True)
    codcol = models.CharField(max_length=5, blank=True, null=True)
    codnivel = models.CharField(max_length=5, blank=True, null=True)
    codcurso = models.CharField(max_length=3, blank=True, null=True)
    turno = models.CharField(max_length=1, blank=True, null=True)
    seccion = models.CharField(max_length=3, blank=True, null=True)
    codalumno = models.CharField(max_length=15, blank=True, null=True)
    nrocuota = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    lineaacad = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    codmarca = models.CharField(max_length=4, blank=True, null=True)
    codmodelo = models.CharField(max_length=4, blank=True, null=True)
    nrochasis = models.CharField(max_length=20, blank=True, null=True)
    nromotor = models.CharField(max_length=30, blank=True, null=True)
    color = models.CharField(max_length=30, blank=True, null=True)
    anho = models.CharField(max_length=30, blank=True, null=True)
    cod_sucursal2 = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito2 = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stdet'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_deposito', 'cod_tp_comp', 'comp_numero', 'linea'),)


class StdetSync(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4)
    rf_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    concepto = models.CharField(max_length=60, blank=True, null=True)
    planctaart = models.CharField(max_length=11, blank=True, null=True)
    planauxart = models.CharField(max_length=11, blank=True, null=True)
    pr_vta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cantcajas = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    listaventa = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    listaprec = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stdet_sync'


class StdetTi(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=6, decimal_places=0)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    rf_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    concepto = models.CharField(max_length=60, blank=True, null=True)
    planctaart = models.CharField(max_length=11, blank=True, null=True)
    planauxart = models.CharField(max_length=11, blank=True, null=True)
    pr_vta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cantcajas = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    listaventa = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    listaprec = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    tp_presup = models.CharField(max_length=4, blank=True, null=True)
    nro_presup = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    faltante = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stdet_ti'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_deposito', 'cod_tp_comp', 'comp_numero', 'linea'),)


class StdetTiSinInv(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=4, decimal_places=0)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    rf_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    concepto = models.CharField(max_length=60, blank=True, null=True)
    planctaart = models.CharField(max_length=11, blank=True, null=True)
    planauxart = models.CharField(max_length=11, blank=True, null=True)
    pr_vta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cantcajas = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    listaventa = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    listaprec = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    tp_presup = models.CharField(max_length=4, blank=True, null=True)
    nro_presup = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    faltante = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stdet_ti_sin_inv'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_deposito', 'cod_tp_comp', 'comp_numero', 'linea'),)


class StdetUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4)
    rf_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    concepto = models.CharField(max_length=60, blank=True, null=True)
    planctaart = models.CharField(max_length=11, blank=True, null=True)
    planauxart = models.CharField(max_length=11, blank=True, null=True)
    pr_vta = models.DecimalField(max_digits=19, decimal_places=4)
    cantcajas = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    listaventa = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    listaprec = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    tp_presup = models.CharField(max_length=4, blank=True, null=True)
    nro_presup = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    faltante = models.DecimalField(max_digits=13, decimal_places=3)
    linea_presup = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    ordenfact = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    peso_bruto = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    peso_tara = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    peso_promedio = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    cod_taras = models.CharField(max_length=24, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stdet_unif'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_deposito', 'cod_tp_comp', 'comp_numero', 'linea'),)


class Stdettara(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    lineastdet = models.DecimalField(max_digits=3, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    cod_tara = models.ForeignKey('Tara', db_column='cod_tara', blank=True, null=True)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    peso = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    calcula_promedio = models.CharField(max_length=1, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stdettara'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_deposito', 'cod_tp_comp', 'comp_numero', 'lineastdet', 'linea'),)


class Stserie(models.Model):
    cod_empresa = models.ForeignKey(Articulo, db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=3, decimal_places=0)
    lineaserie = models.DecimalField(max_digits=4, decimal_places=0)
    nroserie = models.CharField(max_length=20)
    observ = models.CharField(max_length=100, blank=True, null=True)
    fechagarantia = models.DateTimeField(blank=True, null=True)
    idarticulo = models.IntegerField(blank=True, null=True)
    iddeposito = models.IntegerField(blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    marca = models.CharField(max_length=30, blank=True, null=True)
    modelo = models.CharField(max_length=30, blank=True, null=True)
    nromotor = models.CharField(max_length=30, blank=True, null=True)
    color = models.CharField(max_length=30, blank=True, null=True)
    nro_certif = models.DecimalField(max_digits=13, decimal_places=0, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stserie'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_deposito', 'cod_tp_comp', 'comp_numero', 'linea', 'lineaserie'),)


class Stvtadet(models.Model):
    cod_empresa = models.ForeignKey(Artdep, db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    vt_cod_tp_comp = models.CharField(max_length=4)
    vt_comp_numero = models.DecimalField(max_digits=9, decimal_places=0)
    st_cod_tp_comp = models.CharField(max_length=4)
    st_comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3)
    anulado = models.CharField(max_length=1, blank=True, null=True)
    tipo = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stvtadet'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_deposito', 'cod_articulo', 'vt_cod_tp_comp', 'vt_comp_numero', 'st_cod_tp_comp', 'st_comp_numero'),)


class Subgrupo(models.Model):
    cod_familia = models.ForeignKey(Grupo, db_column='cod_familia')
    cod_grupo = models.CharField(max_length=4)
    cod_subgrupo = models.CharField(max_length=4)
    des_subgrupo = models.CharField(max_length=40)
    codlinea = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'subgrupo'
        unique_together = (('cod_familia', 'cod_grupo', 'cod_subgrupo'),)


class SubgrupoSync(models.Model):
    cod_familia = models.CharField(max_length=4)
    cod_grupo = models.CharField(max_length=4)
    cod_subgrupo = models.CharField(max_length=4)
    des_subgrupo = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'subgrupo_sync'


class Subrubrosaf(models.Model):
    cod_empresa = models.ForeignKey(Rubrosaf, db_column='cod_empresa')
    codrubro = models.CharField(max_length=11)
    codsubrubro = models.CharField(max_length=11)
    descrip = models.CharField(max_length=40)
    planctaactivo = models.CharField(max_length=11, blank=True, null=True)
    planauxactivo = models.CharField(max_length=11, blank=True, null=True)
    ctadeprejer = models.CharField(max_length=11, blank=True, null=True)
    auxdeprejer = models.CharField(max_length=11, blank=True, null=True)
    ctadeprnoded = models.CharField(max_length=11, blank=True, null=True)
    auxdeprnoded = models.CharField(max_length=11, blank=True, null=True)
    ctadepracum = models.CharField(max_length=11, blank=True, null=True)
    auxdepracum = models.CharField(max_length=11, blank=True, null=True)
    planctarev = models.CharField(max_length=11, blank=True, null=True)
    planauxrev = models.CharField(max_length=11, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'subrubrosaf'
        unique_together = (('cod_empresa', 'codrubro', 'codsubrubro'),)


class Sucursal(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    des_sucursal = models.CharField(max_length=30)
    direccion = models.CharField(max_length=30, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    cod_localidad = models.CharField(max_length=3, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    codtpcomp_pronet = models.CharField(max_length=4, blank=True, null=True)
    codtppago_pronet = models.CharField(max_length=2, blank=True, null=True)
    codcobrad_pronet = models.CharField(max_length=3, blank=True, null=True)
    sectorfact_pronet = models.CharField(max_length=12, blank=True, null=True)
    nroserie_pronet = models.CharField(max_length=12, blank=True, null=True)
    origen_pronet = models.CharField(max_length=2, blank=True, null=True)
    pathtxt_pronet = models.CharField(max_length=80, blank=True, null=True)
    prefijo_aso = models.CharField(max_length=4, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    nroserie_pag = models.CharField(max_length=12, blank=True, null=True)
    calc_ret_iva = models.CharField(max_length=1, blank=True, null=True)
    suc_retenible = models.CharField(max_length=1, blank=True, null=True)
    cod_gtevtas = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sucursal'
        unique_together = (('cod_empresa', 'cod_sucursal'),)


class SucursalTmp(models.Model):
    codsucactual = models.CharField(primary_key=True, max_length=5)
    cod_sucursal = models.CharField(max_length=2)
    cod_localidad = models.CharField(max_length=3)
    descrip = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'sucursal_tmp'


class Tara(models.Model):
    cod_tara = models.CharField(primary_key=True, max_length=4)
    descripcion = models.CharField(max_length=35, blank=True, null=True)
    peso = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    calcula_promedio = models.CharField(max_length=1, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tara'


class Tarjetas(models.Model):
    cod_tarjeta = models.CharField(primary_key=True, max_length=4)
    descrip = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'tarjetas'


class Terminos(models.Model):
    cod_con_vta = models.CharField(primary_key=True, max_length=2)
    cuota = models.DecimalField(max_digits=3, decimal_places=0)
    dias_credito = models.DecimalField(max_digits=4, decimal_places=0)
    des_con_vta = models.CharField(max_length=40)
    descuento = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    ctrl_limite = models.CharField(max_length=1, blank=True, null=True)
    efectivo = models.CharField(max_length=1, blank=True, null=True)
    cheque = models.CharField(max_length=1, blank=True, null=True)
    tarjeta = models.CharField(max_length=1, blank=True, null=True)
    listas = models.CharField(max_length=6, blank=True, null=True)
    porcinteres = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porcinteresentrega = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    dias_cheque = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    origencuotas = models.CharField(max_length=2, blank=True, null=True)
    compraventa = models.CharField(max_length=1, blank=True, null=True)
    termfinanciero = models.CharField(max_length=1, blank=True, null=True)
    max_desc_cab = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    max_desc_det = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    dias_cheque_apartirde = models.CharField(max_length=2, blank=True, null=True)
    dias_1_venc = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    tipo = models.CharField(max_length=7, blank=True, null=True)
    importe_min = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    importe_max = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ctrllistas = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'terminos'


class TerminosSync(models.Model):
    cod_con_vta = models.CharField(max_length=2)
    cuota = models.DecimalField(max_digits=3, decimal_places=0)
    dias_credito = models.DecimalField(max_digits=4, decimal_places=0)
    des_con_vta = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'terminos_sync'


class Timbradocab(models.Model):
    nrotimb = models.DecimalField(max_digits=15, decimal_places=0)
    fhatimb = models.DateTimeField(blank=True, null=True)
    fhavto = models.DateTimeField(blank=True, null=True)
    fhabaja = models.DateTimeField(blank=True, null=True)
    medio = models.CharField(max_length=1, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2)

    class Meta:
        managed = False
        db_table = 'timbradocab'
        unique_together = (('nrotimb', 'cod_empresa'),)


class Timbradodet(models.Model):
    nrotimb = models.DecimalField(max_digits=15, decimal_places=0)
    cod_establecimiento = models.CharField(max_length=3)
    cod_ptoexpedicion = models.CharField(max_length=3)
    cod_tipodoc = models.CharField(max_length=4)
    estado = models.CharField(max_length=1, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    nro_desde = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    nro_hasta = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    nro_utilizado = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fha_desde = models.DateTimeField(blank=True, null=True)
    fha_hasta = models.DateTimeField(blank=True, null=True)
    cod_empresa = models.CharField(max_length=2)

    class Meta:
        managed = False
        db_table = 'timbradodet'
        unique_together = (('nrotimb', 'cod_establecimiento', 'cod_ptoexpedicion', 'cod_tipodoc', 'cod_empresa'),)


class Tipoactividad(models.Model):
    cod_empresa = models.CharField(max_length=2)
    codtipoaccion = models.CharField(max_length=4)
    descrip = models.CharField(max_length=60, blank=True, null=True)
    observdef = models.CharField(max_length=250, blank=True, null=True)
    observlargadef = models.CharField(max_length=2500, blank=True, null=True)
    estadodef = models.CharField(max_length=1, blank=True, null=True)
    allow_vendedor = models.CharField(max_length=1, blank=True, null=True)
    allow_cobrador = models.CharField(max_length=1, blank=True, null=True)
    allow_fechahoraprog = models.CharField(max_length=1, blank=True, null=True)
    allow_codtipoacprog = models.CharField(max_length=1, blank=True, null=True)
    allow_cod_usrprog = models.CharField(max_length=1, blank=True, null=True)
    tpdef = models.CharField(max_length=1, blank=True, null=True)
    repartoentregado = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipoactividad'
        unique_together = (('cod_empresa', 'codtipoaccion'),)


class Tipoasiento(models.Model):
    tipoasiento = models.CharField(primary_key=True, max_length=2)
    tpdef = models.CharField(max_length=1)
    abreviatura = models.CharField(max_length=5)
    descrip = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'tipoasiento'


class Tipocalc(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    codtipocalc = models.CharField(max_length=2)
    descrip = models.CharField(max_length=40)
    tipo = models.CharField(max_length=1)
    ultimo_nro = models.DecimalField(max_digits=10, decimal_places=0)

    class Meta:
        managed = False
        db_table = 'tipocalc'
        unique_together = (('cod_empresa', 'codtipocalc'),)


class Tipodeposito(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_deposito = models.CharField(max_length=4)
    descrip = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipodeposito'
        unique_together = (('cod_empresa', 'cod_tp_deposito'),)


class Tipoorden(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    tipoorden = models.CharField(max_length=4)
    descrip = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'tipoorden'
        unique_together = (('cod_empresa', 'tipoorden'),)


class Tipoproveedor(models.Model):
    codigo = models.CharField(max_length=20, blank=True, null=True)
    razonsocial = models.CharField(max_length=100, blank=True, null=True)
    grupo = models.CharField(max_length=10, blank=True, null=True)
    ruc = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipoproveedor'


class Tiporeclamo(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_reclamo = models.CharField(max_length=4)
    descrip = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tiporeclamo'
        unique_together = (('cod_empresa', 'cod_tp_reclamo'),)


class Tipotramite(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    tipotramite = models.CharField(max_length=4)
    descrip = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'tipotramite'
        unique_together = (('cod_empresa', 'tipotramite'),)


class TmpAnaliticoVtas(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    des_art = models.CharField(max_length=80, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    des_familia = models.CharField(max_length=40, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    des_grupo = models.CharField(max_length=40, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    des_subgrupo = models.CharField(max_length=40, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    des_individual = models.CharField(max_length=40, blank=True, null=True)
    precio_vta = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    precio_costo = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=80, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    limitecredito = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    des_vendedor = models.CharField(max_length=30, blank=True, null=True)
    gruporeport = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    venta_01 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_02 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_03 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_04 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_05 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_06 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_07 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_08 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_09 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_10 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_11 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_12 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_tot = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_otr = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_01_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_02_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_03_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_04_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_05_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_06_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_07_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_08_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_09_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_10_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_11_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_12_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_tot_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    cantfc_01 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    cantfc_02 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    cantfc_03 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    cantfc_04 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    cantfc_05 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    cantfc_06 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    cantfc_07 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    cantfc_08 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    cantfc_09 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    cantfc_10 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    cantfc_11 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    cantfc_12 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    sbruto_01 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    sbruto_02 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    sbruto_03 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    sbruto_04 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    sbruto_05 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    sbruto_06 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    sbruto_07 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    sbruto_08 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    sbruto_09 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    sbruto_10 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    sbruto_11 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    sbruto_12 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_01_cl = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_02_cl = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_03_cl = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_04_cl = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_05_cl = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_06_cl = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_07_cl = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_08_cl = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_09_cl = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_10_cl = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_11_cl = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_12_cl = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_01 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_02 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_03 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_04 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_05 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_06 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_07 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_08 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_09 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_10 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_11 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    pago_12 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    existencia = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_analitico_vtas'


class TmpArtdepRp(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    existencia = models.DecimalField(max_digits=8, decimal_places=2)
    fha_ult_mov = models.DateTimeField(blank=True, null=True)
    ult_inv_fisico = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    fha_ult_inv = models.DateTimeField(blank=True, null=True)
    ubicacion = models.CharField(max_length=3, blank=True, null=True)
    exist_minima = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    exist_maxima = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    fechaingreso = models.DateTimeField(blank=True, null=True)
    ventas = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_artdep_rp'


class TmpArticulo2(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    cod_auxiliar = models.CharField(max_length=11)
    descripcion = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_articulo2'


class TmpArticulo2(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    cod_familia = models.CharField(max_length=4)
    cod_grupo = models.CharField(max_length=4)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_art = models.CharField(max_length=3, blank=True, null=True)
    codmoneda = models.CharField(max_length=2)
    cod_original = models.CharField(max_length=14, blank=True, null=True)
    comision_vta = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    descuento = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    unidad = models.CharField(max_length=4)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    st_max = models.DecimalField(max_digits=11, decimal_places=2, blank=True, null=True)
    pto_pedido = models.DecimalField(max_digits=11, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4)
    fha_ult_mov = models.DateTimeField(blank=True, null=True)
    pr1_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr1_me = models.DecimalField(max_digits=19, decimal_places=4)
    pr2_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr2_me = models.DecimalField(max_digits=19, decimal_places=4)
    pr3_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr3_me = models.DecimalField(max_digits=19, decimal_places=4)
    pr4_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr4_me = models.DecimalField(max_digits=19, decimal_places=4)
    cod_usuario = models.CharField(max_length=16)
    cta_cont = models.CharField(max_length=11, blank=True, null=True)
    aux_cont = models.CharField(max_length=11, blank=True, null=True)
    des_art = models.CharField(max_length=150)
    codartpad = models.CharField(max_length=14, blank=True, null=True)
    referencia = models.CharField(max_length=15, blank=True, null=True)
    estado = models.CharField(max_length=1)
    nroarticulo = models.DecimalField(max_digits=14, decimal_places=0, blank=True, null=True)
    cta_costo = models.CharField(max_length=11, blank=True, null=True)
    aux_costo = models.CharField(max_length=11, blank=True, null=True)
    cta_vta = models.CharField(max_length=11, blank=True, null=True)
    aux_vta = models.CharField(max_length=11, blank=True, null=True)
    tipoembalaje = models.CharField(max_length=40, blank=True, null=True)
    cantembalaje = models.DecimalField(max_digits=8, decimal_places=2)
    variacionprecio = models.CharField(max_length=1, blank=True, null=True)
    descripcorta = models.CharField(max_length=12, blank=True, null=True)
    listaventa = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    codmodalidad = models.CharField(max_length=4, blank=True, null=True)
    cta_vtactme = models.CharField(max_length=11, blank=True, null=True)
    aux_vtactme = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrgs = models.CharField(max_length=11, blank=True, null=True)
    aux_vtacrgs = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrme = models.CharField(max_length=11, blank=True, null=True)
    aux_vtacrme = models.CharField(max_length=11, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    cto_prom_ant_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_prom_ant_me = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_fob_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_fob_me = models.DecimalField(max_digits=19, decimal_places=4)
    cantmin1 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cantmin2 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cantmin3 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cantmin4 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    porccomislista1 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomislista2 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomislista3 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomislista4 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    codconcepto = models.CharField(max_length=4, blank=True, null=True)
    largo = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    ancho = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    altura = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    densidad = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    m3 = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    peso = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    fechacreacion = models.DateTimeField(blank=True, null=True)
    usrcreacion = models.CharField(max_length=16, blank=True, null=True)
    fechamodif = models.DateTimeField(blank=True, null=True)
    usrmodif = models.CharField(max_length=16, blank=True, null=True)
    standard = models.CharField(max_length=1, blank=True, null=True)
    des_art_old = models.CharField(max_length=200, blank=True, null=True)
    modpreciovta = models.CharField(max_length=1, blank=True, null=True)
    ctrlfactntcredito = models.CharField(max_length=1, blank=True, null=True)
    descriplarga = models.CharField(max_length=1000, blank=True, null=True)
    ctaimpcurso = models.CharField(max_length=11, blank=True, null=True)
    auximpcurso = models.CharField(max_length=11, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    cta_vtactgs = models.CharField(max_length=11, blank=True, null=True)
    aux_vtactgs = models.CharField(max_length=11, blank=True, null=True)
    porcgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porcpartgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    peso_max = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    ctrl_cant_minima = models.CharField(max_length=1, blank=True, null=True)
    codmarca = models.CharField(max_length=4, blank=True, null=True)
    codmodelo = models.CharField(max_length=4, blank=True, null=True)
    facturar_por = models.CharField(max_length=1)
    pr5_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr5_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr6_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr6_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cantmin5 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cantmin6 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    porccomislista5 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomislista6 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    ncm = models.CharField(max_length=30, blank=True, null=True)
    rent1gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent2gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent3gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent4gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent5gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent6gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent1me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent2me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent3me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent4me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent5me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent6me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    baseincprecio_1 = models.CharField(max_length=2, blank=True, null=True)
    baseincprecio_2 = models.CharField(max_length=2, blank=True, null=True)
    baseincprecio_3 = models.CharField(max_length=2, blank=True, null=True)
    baseincprecio_4 = models.CharField(max_length=2, blank=True, null=True)
    baseincprecio_5 = models.CharField(max_length=2, blank=True, null=True)
    baseincprecio_6 = models.CharField(max_length=2, blank=True, null=True)
    porcarancelario = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    foto1 = models.CharField(max_length=200, blank=True, null=True)
    codpais = models.CharField(max_length=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_articulo_2'


class TmpArticuloEstadisticas(models.Model):
    sid = models.CharField(max_length=20, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    des_art = models.CharField(max_length=80, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    mes1_venta = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    mes2_venta = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    mes3_venta = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    mes4_venta = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    mes5_venta = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    mes6_venta = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    mes1_ntcredito = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    mes2_ntcredito = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    mes3_ntcredito = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    mes4_ntcredito = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    mes5_ntcredito = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    mes6_ntcredito = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    existdepcentral = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    existdepcentral1 = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    existtotal = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    existdep_01 = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    existdep_02 = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    existdep_03 = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    existdep_04 = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    existdep_05 = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    existdep_06 = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_articulo_estadisticas'


class TmpArticulos(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    cod_familia = models.CharField(max_length=4)
    cod_grupo = models.CharField(max_length=4)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_art = models.CharField(max_length=3, blank=True, null=True)
    codmoneda = models.CharField(max_length=2)
    cod_original = models.CharField(max_length=14, blank=True, null=True)
    comision_vta = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    descuento = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    unidad = models.CharField(max_length=4)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    st_max = models.DecimalField(max_digits=11, decimal_places=2, blank=True, null=True)
    pto_pedido = models.DecimalField(max_digits=11, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4)
    fha_ult_mov = models.DateTimeField(blank=True, null=True)
    pr1_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr1_me = models.DecimalField(max_digits=19, decimal_places=4)
    pr2_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr2_me = models.DecimalField(max_digits=19, decimal_places=4)
    pr3_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr3_me = models.DecimalField(max_digits=19, decimal_places=4)
    pr4_gs = models.DecimalField(max_digits=19, decimal_places=4)
    pr4_me = models.DecimalField(max_digits=19, decimal_places=4)
    cod_usuario = models.CharField(max_length=16)
    cta_cont = models.CharField(max_length=11, blank=True, null=True)
    aux_cont = models.CharField(max_length=11, blank=True, null=True)
    des_art = models.CharField(max_length=150)
    codartpad = models.CharField(max_length=14, blank=True, null=True)
    referencia = models.CharField(max_length=15, blank=True, null=True)
    estado = models.CharField(max_length=1)
    nroarticulo = models.DecimalField(max_digits=14, decimal_places=0, blank=True, null=True)
    cta_costo = models.CharField(max_length=11, blank=True, null=True)
    aux_costo = models.CharField(max_length=11, blank=True, null=True)
    cta_vta = models.CharField(max_length=11, blank=True, null=True)
    aux_vta = models.CharField(max_length=11, blank=True, null=True)
    tipoembalaje = models.CharField(max_length=40, blank=True, null=True)
    cantembalaje = models.DecimalField(max_digits=8, decimal_places=2)
    variacionprecio = models.CharField(max_length=1, blank=True, null=True)
    descripcorta = models.CharField(max_length=12, blank=True, null=True)
    listaventa = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    codmodalidad = models.CharField(max_length=4, blank=True, null=True)
    cta_vtactme = models.CharField(max_length=11, blank=True, null=True)
    aux_vtactme = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrgs = models.CharField(max_length=11, blank=True, null=True)
    aux_vtacrgs = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrme = models.CharField(max_length=11, blank=True, null=True)
    aux_vtacrme = models.CharField(max_length=11, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    cto_prom_ant_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_prom_ant_me = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_fob_gs = models.DecimalField(max_digits=19, decimal_places=4)
    cto_ult_fob_me = models.DecimalField(max_digits=19, decimal_places=4)
    cantmin1 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cantmin2 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cantmin3 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cantmin4 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    porccomislista1 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomislista2 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomislista3 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomislista4 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    codconcepto = models.CharField(max_length=4, blank=True, null=True)
    largo = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    ancho = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    altura = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    densidad = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    m3 = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    peso = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    fechacreacion = models.DateTimeField(blank=True, null=True)
    usrcreacion = models.CharField(max_length=16, blank=True, null=True)
    fechamodif = models.DateTimeField(blank=True, null=True)
    usrmodif = models.CharField(max_length=16, blank=True, null=True)
    standard = models.CharField(max_length=1, blank=True, null=True)
    des_art_old = models.CharField(max_length=200, blank=True, null=True)
    modpreciovta = models.CharField(max_length=1, blank=True, null=True)
    ctrlfactntcredito = models.CharField(max_length=1, blank=True, null=True)
    descriplarga = models.CharField(max_length=1000, blank=True, null=True)
    ctaimpcurso = models.CharField(max_length=11, blank=True, null=True)
    auximpcurso = models.CharField(max_length=11, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    cta_vtactgs = models.CharField(max_length=11, blank=True, null=True)
    aux_vtactgs = models.CharField(max_length=11, blank=True, null=True)
    porcgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porcpartgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    peso_max = models.DecimalField(max_digits=9, decimal_places=4, blank=True, null=True)
    ctrl_cant_minima = models.CharField(max_length=1, blank=True, null=True)
    codmarca = models.CharField(max_length=4, blank=True, null=True)
    codmodelo = models.CharField(max_length=4, blank=True, null=True)
    facturar_por = models.CharField(max_length=1)
    pr5_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr5_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr6_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr6_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cantmin5 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cantmin6 = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    porccomislista5 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomislista6 = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    ncm = models.CharField(max_length=30, blank=True, null=True)
    rent1gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent2gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent3gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent4gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent5gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent6gs = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent1me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent2me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent3me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent4me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent5me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rent6me = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    baseincprecio_1 = models.CharField(max_length=2, blank=True, null=True)
    baseincprecio_2 = models.CharField(max_length=2, blank=True, null=True)
    baseincprecio_3 = models.CharField(max_length=2, blank=True, null=True)
    baseincprecio_4 = models.CharField(max_length=2, blank=True, null=True)
    baseincprecio_5 = models.CharField(max_length=2, blank=True, null=True)
    baseincprecio_6 = models.CharField(max_length=2, blank=True, null=True)
    porcarancelario = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    foto1 = models.CharField(max_length=200, blank=True, null=True)
    codpais = models.CharField(max_length=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_articulos'
        unique_together = (('cod_empresa', 'cod_articulo'),)


class TmpArticulosRevista(models.Model):
    pagina = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    descrip = models.CharField(max_length=150, blank=True, null=True)
    orden = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_articulos_revista'


class TmpArtvend(models.Model):
    proveedor = models.CharField(max_length=30, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    vendedor = models.CharField(max_length=4, blank=True, null=True)
    des_vendedor = models.CharField(max_length=30, blank=True, null=True)
    tipovendedor = models.CharField(max_length=2, blank=True, null=True)
    tipovta = models.CharField(max_length=3, blank=True, null=True)
    desart = models.CharField(max_length=150, blank=True, null=True)
    anho = models.CharField(max_length=4, blank=True, null=True)
    mes = models.CharField(max_length=2, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    familia = models.CharField(max_length=4, blank=True, null=True)
    grupo = models.CharField(max_length=4, blank=True, null=True)
    marca = models.CharField(max_length=4, blank=True, null=True)
    totneto = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    sucvta = models.CharField(max_length=2, blank=True, null=True)
    des_familia = models.CharField(max_length=40, blank=True, null=True)
    des_grupo = models.CharField(max_length=30, blank=True, null=True)
    desvendedor = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_artvend'


class TmpAuxart(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    aux_cont = models.CharField(max_length=14, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_auxart'


class TmpCedulas(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    cedula_orig = models.CharField(max_length=15, blank=True, null=True)
    cedula_new = models.CharField(max_length=15, blank=True, null=True)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    cod_asociacion = models.CharField(max_length=8, blank=True, null=True)
    cliente_padre = models.CharField(max_length=8, blank=True, null=True)
    saldoporcliente = models.CharField(max_length=1, blank=True, null=True)
    razon_social = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_cedulas'


class TmpCedulas2(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    cedula_orig = models.CharField(max_length=15, blank=True, null=True)
    cedula_new = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_cedulas2'


class TmpCedulasAsoc(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    cedula_orig = models.CharField(max_length=15, blank=True, null=True)
    cedula_new = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_cedulas_asoc'


class TmpCedulasVeraudit(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    cedula_orig = models.CharField(max_length=15, blank=True, null=True)
    cedula_new = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_cedulas_veraudit'


class TmpClientesfutura(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    cedula = models.CharField(max_length=15, blank=True, null=True)
    limite_cr_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    telefono1 = models.CharField(max_length=25, blank=True, null=True)
    saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_calificacion = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_clientesfutura'


class TmpClisalario(models.Model):
    fechaingreso = models.DateTimeField(blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=100, blank=True, null=True)
    cod_calificacion = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_clisalario'


class TmpCobroxdia(models.Model):
    sucursal = models.CharField(max_length=2, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    moneda = models.CharField(max_length=2, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_cobroxdia'


class TmpCompararSaldos(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    cod_moneda = models.CharField(max_length=2)
    deudas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pagos = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_comparar_saldos'
        unique_together = (('cod_empresa', 'cod_cliente', 'cod_moneda'),)


class TmpCondicionvta(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_con_vta = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_condicionvta'


class TmpConsigselect(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    sid = models.CharField(max_length=15, blank=True, null=True)
    incluir = models.CharField(max_length=1, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    des_art = models.CharField(max_length=40, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fha_cbte = models.DateTimeField(blank=True, null=True)
    linea = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    consignado = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    inventariado = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    devuelto = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    saldo = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    inventario = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    pr_consignado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    dcto = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    iva = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    total = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    des_familia = models.CharField(max_length=30, blank=True, null=True)
    des_grupo = models.CharField(max_length=30, blank=True, null=True)
    des_subgrupo = models.CharField(max_length=30, blank=True, null=True)
    des_individual = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_consigselect'


class TmpContabRp(models.Model):
    cod_empresa = models.CharField(max_length=2)
    periodo = models.CharField(max_length=8)
    fecha = models.DateTimeField(blank=True, null=True)
    codplancta = models.CharField(max_length=11)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14)
    concepto = models.CharField(max_length=50, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    debito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    credito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_contab_rp'


class TmpContador(models.Model):
    name = models.CharField(max_length=30, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_contador'


class TmpConteoreg(models.Model):
    cod_cliente = models.CharField(max_length=15, blank=True, null=True)
    codigo = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    reciboscab = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    recibosdet = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    cuotas = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    pagarescab = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    actividades = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    refcomerciales = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    refpersonales = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    laboral = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    presupuestocab = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    factura = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    saldo = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    clienteactivo = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_conteoreg'


class TmpCuotasRp(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    mvto_numero = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    cuota_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_cliente = models.CharField(max_length=15, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_cuotas_rp'


class TmpExistencia(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    ventas = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    ventasnc = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    remisiones = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    stock_entrada = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    stock_salida = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    producc_entrada = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    producc_salida = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    compras = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    compras_nc = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    transf_entrada = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    transf_salida = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    existencia_artdep = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    existencia_calc = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    compras_locales = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    compras_importacion = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    fecha_ultcompra = models.DateField(blank=True, null=True)
    monto_ultcompra = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_existencia'


class TmpFactprovcuotas(models.Model):
    codprov = models.CharField(max_length=6, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0)
    fecha = models.CharField(max_length=20, blank=True, null=True)
    nrocuota = models.CharField(max_length=10, blank=True, null=True)
    tp = models.CharField(max_length=4, blank=True, null=True)
    fechavto = models.CharField(max_length=20, blank=True, null=True)
    dias = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    interes = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    codmoneda = models.CharField(max_length=3, blank=True, null=True)
    saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codprovnvo = models.CharField(max_length=5, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_factprovcuotas'


class TmpImportaciones(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    des_art = models.CharField(max_length=80, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    des_familia = models.CharField(max_length=40, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    des_grupo = models.CharField(max_length=40, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    des_subgrupo = models.CharField(max_length=40, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    des_individual = models.CharField(max_length=40, blank=True, null=True)
    importacion_01 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    importacion_02 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    importacion_03 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    importacion_04 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    importacion_05 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    importacion_06 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    importacion_07 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    importacion_08 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    importacion_09 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    importacion_10 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    importacion_11 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    importacion_12 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    importacion_tot = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_importaciones'


class TmpInhibidosRp(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=14, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_inhibidos_rp'


class TmpInvproblemas(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_deposito = models.CharField(max_length=4, blank=True, null=True)
    cod_articulo = models.CharField(max_length=15, blank=True, null=True)
    cant_actual = models.DecimalField(max_digits=25, decimal_places=10, blank=True, null=True)
    cant_correcta = models.DecimalField(max_digits=25, decimal_places=10, blank=True, null=True)
    cant_inventario = models.DecimalField(max_digits=25, decimal_places=10, blank=True, null=True)
    cant_existencia = models.DecimalField(max_digits=25, decimal_places=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_invproblemas'


class TmpListaprecio(models.Model):
    sessionid = models.CharField(max_length=15)
    cod_empresa = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    des_art = models.CharField(max_length=80, blank=True, null=True)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    precio_lista = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    precio_financiado1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    precio_financiado2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    precio_financiado3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    precio_financiado4 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    precio_financiado5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    precio_financiado6 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    precio_financiado7 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    precio_financiado8 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    precio_financiado9 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    precio_financiado10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    titulo_familia = models.CharField(max_length=20, blank=True, null=True)
    titulo_grupo = models.CharField(max_length=20, blank=True, null=True)
    titulo_subgrupo = models.CharField(max_length=20, blank=True, null=True)
    titulo_individual = models.CharField(max_length=20, blank=True, null=True)
    titulo_precio_lista = models.CharField(max_length=20, blank=True, null=True)
    titulo_precio1 = models.CharField(max_length=20, blank=True, null=True)
    titulo_precio2 = models.CharField(max_length=20, blank=True, null=True)
    titulo_precio3 = models.CharField(max_length=20, blank=True, null=True)
    titulo_precio4 = models.CharField(max_length=20, blank=True, null=True)
    titulo_precio5 = models.CharField(max_length=20, blank=True, null=True)
    titulo_precio6 = models.CharField(max_length=20, blank=True, null=True)
    titulo_precio7 = models.CharField(max_length=20, blank=True, null=True)
    titulo_precio8 = models.CharField(max_length=20, blank=True, null=True)
    titulo_precio9 = models.CharField(max_length=20, blank=True, null=True)
    titulo_precio10 = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_listaprecio'


class TmpMapeoAsociaciones(models.Model):
    cod_asociacion = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=80, blank=True, null=True)
    cod_asociacion_ok = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_mapeo_asociaciones'


class TmpMaxmin(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    cant_min = models.CharField(max_length=4)
    cant_max = models.CharField(max_length=4)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_maxmin'


class TmpOpExport(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codigo_empresa = models.CharField(max_length=3, blank=True, null=True)
    cuenta_banco = models.CharField(max_length=12, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    ruc = models.CharField(max_length=12, blank=True, null=True)
    bancooplocal = models.CharField(max_length=3, blank=True, null=True)
    ctabancoloc = models.CharField(max_length=12, blank=True, null=True)
    tipo_debito = models.CharField(max_length=1, blank=True, null=True)
    beneficiario = models.CharField(max_length=50, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    importepago = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    nrofact = models.CharField(max_length=20, blank=True, null=True)
    fechavto = models.DateField(blank=True, null=True)
    concepto = models.CharField(max_length=50, blank=True, null=True)
    nroop = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fechaop = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_op_export'


class TmpPromediovtas(models.Model):
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cod_sucursalvta = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursaldep = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    tipo = models.CharField(max_length=3, blank=True, null=True)
    nombre = models.CharField(max_length=150, blank=True, null=True)
    anho = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    mes = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    total = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    familia = models.CharField(max_length=4, blank=True, null=True)
    grupo = models.CharField(max_length=4, blank=True, null=True)
    marca = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_promediovtas'


class TmpPromoamerica(models.Model):
    sucursal = models.CharField(max_length=2, blank=True, null=True)
    codcliente = models.CharField(max_length=15, blank=True, null=True)
    razonsocial = models.CharField(max_length=100, blank=True, null=True)
    tipocomp = models.CharField(max_length=4, blank=True, null=True)
    nrofactura = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    condicionvta = models.CharField(max_length=2, blank=True, null=True)
    descriptermino = models.CharField(max_length=50, blank=True, null=True)
    cantidadcuotas = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    cantidaddias = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    codarticulo = models.CharField(max_length=15, blank=True, null=True)
    cantidad = models.CharField(max_length=2, blank=True, null=True)
    descripart = models.CharField(max_length=100, blank=True, null=True)
    totalfactura = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    totalventafila = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    totalpagado = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)
    artfactura = models.DecimalField(max_digits=30, decimal_places=6, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_promoamerica'


class TmpPronet(models.Model):
    factura = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True)
    fecha = models.DateField(blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cliente = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_pronet'


class TmpRankingvtas(models.Model):
    sid = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    vta_total_gs = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)
    vta_total_me = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)
    nc_total_gs = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)
    nc_total_me = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_rankingvtas'


class TmpRelstock(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    des_art = models.CharField(max_length=60, blank=True, null=True)
    tipoembalaje = models.CharField(max_length=60, blank=True, null=True)
    stock_sn_asu = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    stock_sn_cde = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    stock_cc_cde = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    pedido_pend = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    stock_gral = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_stock = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    vta_01 = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    vta_02 = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    vta_03 = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    vta_04 = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    vta_05 = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    vta_06 = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    vta_07 = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    vta_08 = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    vta_09 = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    vta_10 = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    vta_11 = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    vta_12 = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    vta_tot = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    prom_asu = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    prom_cde = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)
    meses_stock = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)
    nuevo_pedido = models.DecimalField(max_digits=20, decimal_places=6, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_relstock'


class TmpRentabilidad(models.Model):
    sid = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=15, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    pr_unit_gs = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)
    pr_unit_me = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)
    cto_ult_gs = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)
    cto_ult_me = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)
    vta_total_gs = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)
    vta_total_me = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)
    utilidad_gs = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)
    utilidad_me = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_rentabilidad'


class TmpSaldosConVta(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    mvto_numero = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cuota_numero = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    importe_cuota = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)
    fecha_ven = models.DateTimeField(blank=True, null=True)
    saldo_actual = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)
    saldo_fecha = models.DecimalField(max_digits=21, decimal_places=4, blank=True, null=True)
    rango = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_saldos_con_vta'


class TmpSaldosXClienteDeudas(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    codmoneda = models.CharField(max_length=2)
    total_deudas = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_saldos_x_cliente_deudas'
        unique_together = (('cod_empresa', 'cod_cliente', 'codmoneda'),)


class TmpSaldosXClientePagos(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    codmoneda = models.CharField(max_length=2)
    origen = models.CharField(max_length=2)
    total_pagos = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_saldos_x_cliente_pagos'
        unique_together = (('cod_empresa', 'cod_cliente', 'codmoneda', 'origen'),)


class TmpStksinmov(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)

    class Meta:
        managed = False
        db_table = 'tmp_stksinmov'


class TmpSupervisor(models.Model):
    tipo_vendedor = models.CharField(max_length=2, blank=True, null=True)
    cod_supervisor = models.CharField(max_length=4, blank=True, null=True)
    des_supervisor = models.CharField(max_length=60, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_supervisor'
        unique_together = (('cod_empresa', 'cod_vendedor'),)


class TmpTpocbte(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    tp_def = models.CharField(max_length=2)
    af_existencia = models.CharField(max_length=1)
    af_costos = models.CharField(max_length=1)
    af_ult_mov = models.CharField(max_length=1)
    desde_nro = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    hasta_nro = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    debcred = models.CharField(max_length=1, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    des_tp_comp = models.CharField(max_length=40)
    leyenda = models.CharField(max_length=20, blank=True, null=True)
    codplanctame = models.CharField(max_length=11, blank=True, null=True)
    codplanauxme = models.CharField(max_length=11, blank=True, null=True)
    codplancta_dif = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_dif = models.CharField(max_length=11, blank=True, null=True)
    codplancta_difme = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_difme = models.CharField(max_length=11, blank=True, null=True)
    ctrl_cliente = models.CharField(max_length=1, blank=True, null=True)
    orden_ficha = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    orden_ficha_2 = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    geningvtas = models.CharField(max_length=1, blank=True, null=True)
    genctovtas = models.CharField(max_length=1, blank=True, null=True)
    devolucion = models.CharField(max_length=1, blank=True, null=True)
    modprunit = models.CharField(max_length=1, blank=True, null=True)
    moddescporc = models.CharField(max_length=1, blank=True, null=True)
    moddescmonto = models.CharField(max_length=1, blank=True, null=True)
    modtotal = models.CharField(max_length=1, blank=True, null=True)
    tipolibroiva = models.CharField(max_length=2, blank=True, null=True)
    modlista_prec = models.CharField(max_length=1, blank=True, null=True)
    modfecha = models.CharField(max_length=1, blank=True, null=True)
    modfechapresup = models.CharField(max_length=1, blank=True, null=True)
    diasvctopresup = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    fact_interna = models.CharField(max_length=1, blank=True, null=True)
    modvendedor = models.CharField(max_length=1, blank=True, null=True)
    ctrlartdupl = models.CharField(max_length=1, blank=True, null=True)
    cbte_estad = models.CharField(max_length=1, blank=True, null=True)
    ctrlprvtadesc = models.CharField(max_length=1, blank=True, null=True)
    ctrlarttpocbte = models.CharField(max_length=1, blank=True, null=True)
    ntcred1factura = models.CharField(max_length=1, blank=True, null=True)
    ntcreddiasmax = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    tipolibroiva_descrip = models.CharField(max_length=40, blank=True, null=True)
    permitirfacturarcero = models.CharField(max_length=1, blank=True, null=True)
    tipoiva = models.CharField(max_length=1, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    activo = models.CharField(max_length=1, blank=True, null=True)
    sumarivasiincluido = models.CharField(max_length=1, blank=True, null=True)
    cod_tipodoc = models.CharField(max_length=4, blank=True, null=True)
    prefijofact_pronet = models.CharField(max_length=3, blank=True, null=True)
    tpomvto = models.CharField(max_length=2, blank=True, null=True)
    vtacontadocredito = models.CharField(max_length=1, blank=True, null=True)
    control_inactivos = models.CharField(max_length=1, blank=True, null=True)
    nrotimbrado = models.CharField(max_length=20, blank=True, null=True)
    timbrado = models.CharField(max_length=20, blank=True, null=True)
    ctrlnrointernotimbrado = models.CharField(max_length=1, blank=True, null=True)
    upd_costos = models.CharField(max_length=1, blank=True, null=True)
    tipo = models.CharField(max_length=7, blank=True, null=True)
    ctrl_importeventa_termino = models.CharField(max_length=1, blank=True, null=True)
    updinventariado = models.CharField(max_length=1, blank=True, null=True)
    modcantidad = models.CharField(max_length=1, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    tpocbtealta = models.CharField(max_length=4, blank=True, null=True)
    tpocbtebaja = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_tpocbte'
        unique_together = (('cod_empresa', 'cod_tp_comp'),)


class TmpVtaComp(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    linea = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    fha_cbte = models.DateTimeField(blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    cod_con_vta = models.CharField(max_length=2, blank=True, null=True)
    to_exento = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    to_gravado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    des_art = models.CharField(max_length=40, blank=True, null=True)
    cod_original = models.CharField(max_length=14, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cab_descuento = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    total = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    des_tp_comp = models.CharField(max_length=40, blank=True, null=True)
    des_con_vta = models.CharField(max_length=40, blank=True, null=True)
    des_familia = models.CharField(max_length=40, blank=True, null=True)
    det_descuento = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tipo_iva = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_vta_comp'


class TmpVtaCompImpuesto(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    fha_cbte = models.DateTimeField(blank=True, null=True)
    tot_neto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot_impuesto_01 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot_impuesto_02 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot_impuesto_03 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot_impuesto_04 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot_impuesto_05 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tipo_iva = models.CharField(max_length=2, blank=True, null=True)
    anulado = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_vta_comp_impuesto'


class TmpVtadet(models.Model):
    sid = models.CharField(max_length=11, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_fact = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=17, decimal_places=0, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    linea = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    factvta_nro = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    tipo_iva = models.CharField(max_length=1, blank=True, null=True)
    iva = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_vtadet'


class TmpVtasClientesComp(models.Model):
    sid = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    linea = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    vta_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    vta_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    rango = models.CharField(max_length=1, blank=True, null=True)
    af_existencia = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_vtas_clientes_comp'


class TmpVtasClientesCompCab(models.Model):
    sid = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    vta_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    vta_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    nrocliente = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    rango = models.CharField(max_length=1, blank=True, null=True)
    af_existencia = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmp_vtas_clientes_comp_cab'


class Tmpagrupaciones(models.Model):
    sessionid = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    des_familia = models.CharField(max_length=40, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    des_grupo = models.CharField(max_length=40, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    des_subgrupo = models.CharField(max_length=40, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    des_individual = models.CharField(max_length=40, blank=True, null=True)
    des_agrupacion = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpagrupaciones'


class Tmpartcosto(models.Model):
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    totalfact = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpartcosto'


class Tmparticulo(models.Model):
    sessionid = models.CharField(max_length=15)
    cod_empresa = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    des_art = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmparticulo'
        unique_together = (('sessionid', 'cod_empresa', 'cod_articulo'),)


class TmparticuloLisprecio(models.Model):
    sessionid = models.CharField(max_length=15)
    cod_empresa = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    des_art = models.CharField(max_length=80, blank=True, null=True)
    lista_precio = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    importe_lista = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    nombre_lista = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmparticulo_lisprecio'


class TmparticulosRp(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    cod_familia = models.CharField(max_length=4)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_art = models.CharField(max_length=3)
    descriplarga = models.CharField(max_length=1000, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmparticulos_rp'


class Tmpartprod(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cod_articulopad = models.CharField(max_length=14, blank=True, null=True)
    nivel = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpartprod'


class Tmpasientos(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=11, decimal_places=0, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    linea = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    nombrecta = models.CharField(max_length=40, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    nombreaux = models.CharField(max_length=40, blank=True, null=True)
    dbcr = models.CharField(max_length=1, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    importeme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    concepto = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpasientos'


class Tmpasientoscab(models.Model):
    cod_empresa = models.CharField(max_length=2)
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0)
    periodo = models.CharField(max_length=8)
    codmoneda = models.CharField(max_length=2)
    tipoasiento = models.CharField(max_length=2)
    nrocompr = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fecha = models.DateTimeField()
    transf = models.CharField(max_length=1)
    origen = models.CharField(max_length=5)
    nroasiento = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    factcambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    autorizado = models.CharField(max_length=1)
    cargadopor = models.CharField(max_length=16, blank=True, null=True)
    fechacarga = models.DateTimeField(blank=True, null=True)
    autorizadopor = models.CharField(max_length=16, blank=True, null=True)
    fechaautoriz = models.DateTimeField(blank=True, null=True)
    nroasiento_orig = models.CharField(max_length=25, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpasientoscab'
        unique_together = (('cod_empresa', 'nrotransac'),)


class Tmpasientosdet(models.Model):
    cod_empresa = models.CharField(max_length=2)
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0)
    linea = models.DecimalField(max_digits=6, decimal_places=0)
    periodo = models.CharField(max_length=8)
    codplancta = models.CharField(max_length=11)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    dbcr = models.CharField(max_length=1)
    conciliado = models.CharField(max_length=1, blank=True, null=True)
    preconciliado = models.CharField(max_length=1, blank=True, null=True)
    nroconcil = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4)
    importeme = models.DecimalField(max_digits=19, decimal_places=4)
    concepto = models.CharField(max_length=40, blank=True, null=True)
    debito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    credito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    debitome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    creditome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    nroorden = models.DecimalField(max_digits=6, decimal_places=0, blank=True, null=True)
    nroasiento_orig = models.CharField(max_length=25, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpasientosdet'
        unique_together = (('cod_empresa', 'nrotransac', 'linea'),)


class Tmpauxiliares(models.Model):
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    nombre = models.CharField(max_length=40, blank=True, null=True)
    tipocuenta = models.CharField(max_length=2, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpauxiliares'


class Tmpauxiliares2(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    nombrecta = models.CharField(max_length=40, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    nombre = models.CharField(max_length=40, blank=True, null=True)
    nivel = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    imputable = models.CharField(max_length=1, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    tpcta = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpauxiliares2'


class Tmpbalanalitico(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    tiposaldo = models.CharField(max_length=1, blank=True, null=True)
    frontera = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    nombrecta = models.CharField(max_length=40, blank=True, null=True)
    nivel = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    imputable = models.CharField(max_length=1, blank=True, null=True)
    saldo_anho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldo_mes = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpbalanalitico'


class Tmpbalanaliticoaux(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    tiposaldo = models.CharField(max_length=1, blank=True, null=True)
    frontera = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    nombrecta = models.CharField(max_length=40, blank=True, null=True)
    nombreaux = models.CharField(max_length=40, blank=True, null=True)
    nivel = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    imputable = models.CharField(max_length=1, blank=True, null=True)
    saldo_anho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldo_mes = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldo_anhome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldo_mesme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpbalanaliticoaux'


class Tmpbalanaliticores(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    resultado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    resultadome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpbalanaliticores'


class Tmpbalanceaux(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    nombrecta = models.CharField(max_length=40, blank=True, null=True)
    nombreaux = models.CharField(max_length=40, blank=True, null=True)
    debito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    credito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    debitome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    creditome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    presup = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    modif = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpbalanceaux'


class Tmpbalanceauxres(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    resultado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    resultadome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpbalanceauxres'


class Tmpbalancecomp(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    nombrecta = models.CharField(max_length=40, blank=True, null=True)
    nombreaux = models.CharField(max_length=40, blank=True, null=True)
    rango1desc = models.CharField(max_length=20, blank=True, null=True)
    r1importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    r1importeme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    rango2desc = models.CharField(max_length=20, blank=True, null=True)
    r2importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    r2importeme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpbalancecomp'


class Tmpbalancefiscal(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    nivel = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    nombrecta = models.CharField(max_length=80, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    nombreaux = models.CharField(max_length=80, blank=True, null=True)
    periodo_1p = models.CharField(max_length=8, blank=True, null=True)
    descrip_1p = models.CharField(max_length=80, blank=True, null=True)
    saldo_1p = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    periodo_2p = models.CharField(max_length=8, blank=True, null=True)
    descrip_2p = models.CharField(max_length=80, blank=True, null=True)
    saldo_2p = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpbalancefiscal'


class Tmpbalancegral(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    nombrecta = models.CharField(max_length=40, blank=True, null=True)
    nivelcta = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    nombreaux = models.CharField(max_length=40, blank=True, null=True)
    anho = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    enero = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    febrero = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    marzo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    abril = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    mayo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    junio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    julio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    agosto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    septiembre = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    octubre = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    noviembre = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    diciembre = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    enerome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    febrerome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    marzome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    abrilme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    mayome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    juniome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    juliome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    agostome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    septiembreme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    octubreme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    noviembreme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    diciembreme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpbalancegral'


class Tmpbalancegralctas(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpbalancegralctas'


class Tmpbalctascobrar(models.Model):
    sessionid = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    nrocliente = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    saldo_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_pagos = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_cheque = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpbalctascobrar'


class Tmpbalctascobrarres(models.Model):
    sessionid = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    saldo_ant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    debitos = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    nc = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    creditos = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    chequespend = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldoavencer = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pagoposterior = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ncposterior = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpbalctascobrarres'


class Tmpbien(models.Model):
    codactivo = models.CharField(primary_key=True, max_length=14)
    valorrevalantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpbien'


class Tmpbienactivo(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    tiporegistro = models.CharField(max_length=2, blank=True, null=True)
    codrubro = models.CharField(max_length=11, blank=True, null=True)
    rubro_descrip = models.CharField(max_length=40, blank=True, null=True)
    codactivo = models.CharField(max_length=14, blank=True, null=True)
    descrip = models.CharField(max_length=40, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    articulo_descrip = models.CharField(max_length=40, blank=True, null=True)
    codsubrubro = models.CharField(max_length=11, blank=True, null=True)
    subrubro_descrip = models.CharField(max_length=40, blank=True, null=True)
    codubicacion = models.CharField(max_length=14, blank=True, null=True)
    ubicacion_descrip = models.CharField(max_length=40, blank=True, null=True)
    rubroorigen = models.CharField(max_length=11, blank=True, null=True)
    rubroorigen_descrip = models.CharField(max_length=40, blank=True, null=True)
    subrubroorigen = models.CharField(max_length=11, blank=True, null=True)
    subrubroorigen_descrip = models.CharField(max_length=40, blank=True, null=True)
    ubicorigen = models.CharField(max_length=14, blank=True, null=True)
    ubicorigen_descrip = models.CharField(max_length=40, blank=True, null=True)
    rubrodestino = models.CharField(max_length=11, blank=True, null=True)
    rubrodestino_descrip = models.CharField(max_length=40, blank=True, null=True)
    subrubrodestino = models.CharField(max_length=11, blank=True, null=True)
    subrubrodestino_descrip = models.CharField(max_length=40, blank=True, null=True)
    ubicdestino = models.CharField(max_length=14, blank=True, null=True)
    ubicdestino_descrip = models.CharField(max_length=40, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    coddpto = models.CharField(max_length=2, blank=True, null=True)
    codresponsable = models.CharField(max_length=4, blank=True, null=True)
    apellido_resp = models.CharField(max_length=30, blank=True, null=True)
    nombre_resp = models.CharField(max_length=30, blank=True, null=True)
    cod_sucursal_resp = models.CharField(max_length=2, blank=True, null=True)
    sucresp_descrip = models.CharField(max_length=40, blank=True, null=True)
    coddpto_resp = models.CharField(max_length=2, blank=True, null=True)
    dptoresp_descrip = models.CharField(max_length=40, blank=True, null=True)
    cargo_resp = models.CharField(max_length=40, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    razonsocial = models.CharField(max_length=60, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fechacompra = models.DateTimeField(blank=True, null=True)
    fechaalta = models.DateTimeField(blank=True, null=True)
    fechafinactivo = models.DateTimeField(blank=True, null=True)
    codmonedaext = models.CharField(max_length=2, blank=True, null=True)
    saldoanteriorgs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldoanteriorme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalbajasgs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalbajasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costocompra = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costocomprame = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    nromvto = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fechamvto = models.DateTimeField(blank=True, null=True)
    monedamvto = models.CharField(max_length=2, blank=True, null=True)
    factcambmvto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    importemvto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    importememvto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    motivomvto = models.CharField(max_length=60, blank=True, null=True)
    valoracion = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codmonedaval = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpbienactivo'


class TmpbienactivoCalcofic2004(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codactivo = models.CharField(max_length=14, blank=True, null=True)
    descrip = models.CharField(max_length=40, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    codrubro = models.CharField(max_length=11, blank=True, null=True)
    fechacompra = models.DateTimeField(blank=True, null=True)
    fechaalta = models.DateTimeField(blank=True, null=True)
    fechafinactivo = models.DateTimeField(blank=True, null=True)
    costocompra = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorreval = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacum = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumini = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractual = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    retasacion = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactual = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumini = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costocomprame = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacuminime = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractualme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    retasacionme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactualme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajusteme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacuminime = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorreval_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacum_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumini_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractual_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactual_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumini_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalme_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumme_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacuminime_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractualme_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactualme_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajusteme_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumme_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacuminime_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorreval_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacum_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumini_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractual_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactual_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumini_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalme_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumme_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacuminime_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractualme_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactualme_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajusteme_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumme_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacuminime_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalanho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactualanho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajusteanho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalanhome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactualanhome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajusteanhome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpbienactivo_calcofic_2004'


class Tmpbienactivobkp(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codactivo = models.CharField(max_length=14, blank=True, null=True)
    descrip = models.CharField(max_length=40, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    codrubro = models.CharField(max_length=11, blank=True, null=True)
    fechacompra = models.DateTimeField(blank=True, null=True)
    fechaalta = models.DateTimeField(blank=True, null=True)
    fechafinactivo = models.DateTimeField(blank=True, null=True)
    costocompra = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorreval = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacum = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumini = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractual = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    retasacion = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactual = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumini = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costocomprame = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacuminime = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractualme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    retasacionme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactualme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajusteme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacuminime = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorreval_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacum_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumini_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractual_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactual_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumini_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalme_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumme_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacuminime_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractualme_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactualme_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajusteme_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumme_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacuminime_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorreval_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacum_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumini_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractual_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactual_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumini_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalme_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumme_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacuminime_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoractualme_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecactualme_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajusteme_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumme_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacuminime_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpbienactivobkp'


class Tmpbienactivodet(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codactivo = models.CharField(max_length=14, blank=True, null=True)
    linea = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    codactivodet = models.CharField(max_length=14, blank=True, null=True)
    tpdef = models.CharField(max_length=1, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    nromvto = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    fechamvto = models.DateTimeField(blank=True, null=True)
    importe = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    importeme = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    motivomvto = models.CharField(max_length=60, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpbienactivodet'


class TmpbudgetVsImport(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    des_familia = models.CharField(max_length=40, blank=True, null=True)
    des_grupo = models.CharField(max_length=40, blank=True, null=True)
    des_subgrupo = models.CharField(max_length=40, blank=True, null=True)
    totalimportacion = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalgastosimp = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalimpuestos = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalimportacionme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalgastosimpme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalimpuestosme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codmonedapresup = models.CharField(max_length=2, blank=True, null=True)
    presupcompra = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    presupflete = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    presupimpuesto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpbudget_vs_import'


class Tmpcalclientes(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    cod_calificacion = models.CharField(max_length=8, blank=True, null=True)
    diasmora = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    moroso = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpcalclientes'
        unique_together = (('cod_empresa', 'cod_cliente'),)


class Tmpcancfactcab(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    tipo_mvto = models.CharField(max_length=4, blank=True, null=True)
    fact_fechafact = models.DateTimeField(blank=True, null=True)
    fact_fechacarga = models.DateTimeField(blank=True, null=True)
    fact_fechavto = models.DateTimeField(blank=True, null=True)
    canc_fechafact = models.DateTimeField(blank=True, null=True)
    canc_fechacarga = models.DateTimeField(blank=True, null=True)
    canc_fechavto = models.DateTimeField(blank=True, null=True)
    tot_factura = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    nro_cancela = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    tp_cancela = models.CharField(max_length=4, blank=True, null=True)
    tot_cancela = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tipo = models.CharField(max_length=1, blank=True, null=True)
    anho = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    fact_saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpcancfactcab'


class TmpcedulasBristol(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    cedula = models.CharField(max_length=15, blank=True, null=True)
    tipo = models.CharField(max_length=4)
    nulos = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpcedulas_bristol'


class Tmpcheques(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    cod_tp_doc = models.CharField(max_length=2, blank=True, null=True)
    doc_numero = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    ch_numero = models.CharField(max_length=20, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=2, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    pago_numero = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    codbanco = models.CharField(max_length=3, blank=True, null=True)
    ch_importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ch_fecha = models.DateTimeField(blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    tot_efectivo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpcheques'


class TmpcliRp(models.Model):
    cod_cliente = models.CharField(max_length=15)
    total = models.DecimalField(max_digits=15, decimal_places=0)

    class Meta:
        managed = False
        db_table = 'tmpcli_rp'


class Tmpclicalif(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    cod_calificacion = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpclicalif'


class Tmpclientes(models.Model):
    sessionid = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    cliente_padre = models.CharField(max_length=8, blank=True, null=True)
    saldoporcliente = models.CharField(max_length=1, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    codplancta_me = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_me = models.CharField(max_length=11, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpclientes'


class TmpclientesRp(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)

    class Meta:
        managed = False
        db_table = 'tmpclientes_rp'


class Tmpclientesagrup(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    des_familia = models.CharField(max_length=40, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    des_grupo = models.CharField(max_length=40, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    des_subgrupo = models.CharField(max_length=40, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    des_individual = models.CharField(max_length=40, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=80, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    venta_01 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_02 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_03 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_04 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_05 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_06 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_07 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_08 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_09 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_10 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_11 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_12 = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_tot = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpclientesagrup'


class TmpclientesagrupPrev(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    anho = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    mes = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    venta_ml = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_me = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpclientesagrup_prev'


class Tmpclientescalif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_cliente = models.CharField(max_length=8)
    cod_calificacion = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpclientescalif'
        unique_together = (('cod_empresa', 'cod_cliente'),)


class Tmpcoa(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fechafact = models.CharField(max_length=10, blank=True, null=True)
    razonsocial = models.CharField(max_length=100, blank=True, null=True)
    ruc = models.CharField(max_length=20, blank=True, null=True)
    gravado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    iva = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpcoa'


class Tmpcomisiones(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cod_tp_pago = models.CharField(max_length=4, blank=True, null=True)
    pago_numero = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    fha_cbte = models.DateTimeField(blank=True, null=True)
    fecha_pago = models.DateTimeField(blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    total_factura = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tipo_vta = models.CharField(max_length=2, blank=True, null=True)
    tipo_vendedor = models.CharField(max_length=2, blank=True, null=True)
    comision = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_moneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    com_vendedor = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    totalprom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalprom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalult_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalult_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porc_pago = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    prom_utilidad = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    total_pago = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_cobrador = models.CharField(max_length=3, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    importemeta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    grupo_informe = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    titulo_grupo = models.CharField(max_length=200, blank=True, null=True)
    clt_asig = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    clt_atend = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    clt_minimo = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    clt_maximo = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    meta_maxima = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    meta_minima = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpcomisiones'


class TmpcomisionesArt(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cod_tp_pago = models.CharField(max_length=4, blank=True, null=True)
    pago_numero = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    fha_cbte = models.DateTimeField(blank=True, null=True)
    fecha_pago = models.DateTimeField(blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    total_factura = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tipo_vta = models.CharField(max_length=2, blank=True, null=True)
    tipo_vendedor = models.CharField(max_length=2, blank=True, null=True)
    comision = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_moneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    com_vendedor = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    totalprom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalprom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalult_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalult_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porc_pago = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    prom_utilidad = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    total_pago = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_cobrador = models.CharField(max_length=3, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    importemeta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    grupo_informe = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    titulo_grupo = models.CharField(max_length=200, blank=True, null=True)
    clt_asig = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    clt_atend = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    clt_minimo = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    clt_maximo = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    meta_maxima = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    meta_minima = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpcomisiones_art'


class Tmpcontrolstock(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    des_art = models.CharField(max_length=150, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    ncm = models.CharField(max_length=30, blank=True, null=True)
    ncm2 = models.CharField(max_length=30, blank=True, null=True)
    exist_minima = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    exist_maxima = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    existencia = models.DecimalField(max_digits=13, decimal_places=0, blank=True, null=True)
    desviacion = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpcontrolstock'


class Tmpctrlprevio(models.Model):
    sessionid = models.CharField(max_length=11, blank=True, null=True)
    proceso = models.CharField(max_length=80, blank=True, null=True)
    desproceso = models.CharField(max_length=80, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    tp_def = models.CharField(max_length=2, blank=True, null=True)
    des_tp_comp = models.CharField(max_length=30, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    des_art = models.CharField(max_length=30, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    nombrecta = models.CharField(max_length=40, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    nombreaux = models.CharField(max_length=40, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    mensageerror = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpctrlprevio'


class Tmpcuotas(models.Model):
    id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=8, blank=True, null=True)
    fecha_emi = models.DateTimeField(blank=True, null=True)
    fecha_ven = models.DateTimeField(blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    orden = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    etiqueta = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpcuotas'


class Tmpcupones(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_cliente = models.CharField(max_length=8)

    class Meta:
        managed = False
        db_table = 'tmpcupones'


class Tmpdemandaunidades(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    des_art = models.CharField(max_length=80, blank=True, null=True)
    precio_vta = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    precio_costo = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_01_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_02_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_03_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_04_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_05_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_06_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_07_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_08_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_09_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_10_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_11_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_12_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    venta_tot_unid = models.DecimalField(max_digits=25, decimal_places=3, blank=True, null=True)
    existencia = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    sobrestock = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    stockanho = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    ssvalorizado = models.DecimalField(max_digits=25, decimal_places=2, blank=True, null=True)
    fechaultcompra = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpdemandaunidades'


class Tmpdespachos(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    razonsocial = models.CharField(max_length=60, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    coddespachante = models.CharField(max_length=4, blank=True, null=True)
    razonsocdesp = models.CharField(max_length=60, blank=True, null=True)
    nrodespacho = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fechadespacho = models.DateTimeField(blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    factcambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tipoitem = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    planctaart = models.CharField(max_length=11, blank=True, null=True)
    planauxart = models.CharField(max_length=11, blank=True, null=True)
    ctaimpcurso = models.CharField(max_length=11, blank=True, null=True)
    auximpcurso = models.CharField(max_length=11, blank=True, null=True)
    codarancel = models.CharField(max_length=5, blank=True, null=True)
    tpdefarancel = models.CharField(max_length=1, blank=True, null=True)
    descrip = models.CharField(max_length=60, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cantfaltantes = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    canttotal = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    total = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    prorrateo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    prorrateome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porcincid = models.DecimalField(max_digits=15, decimal_places=10, blank=True, null=True)
    porcincidtotal = models.DecimalField(max_digits=15, decimal_places=10, blank=True, null=True)
    ivadespacho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ivaotros = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codprovliq = models.CharField(max_length=4, blank=True, null=True)
    razonsocliq = models.CharField(max_length=60, blank=True, null=True)
    nrofactliq = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    valorimponible = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tasavi = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    valorimpdecreto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tasavid = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    valorimparticulo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ajustefaltas = models.CharField(max_length=1, blank=True, null=True)
    costototal = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costototalme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costounitario = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costounitariome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    preciounit = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    preciounitme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    des_familia = models.CharField(max_length=40, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    des_grupo = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpdespachos'


class TmpdesvstockRp(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    descripcion = models.CharField(max_length=200, blank=True, null=True)
    exist_minima = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True)
    exist_maxima = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpdesvstock_rp'


class Tmpdetallecoa(models.Model):
    id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    rucempresa = models.CharField(max_length=16, blank=True, null=True)
    fecha = models.DateField(blank=True, null=True)
    rucprov = models.CharField(max_length=16, blank=True, null=True)
    razonsocial = models.CharField(max_length=50, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpdetallecoa'


class Tmpdifasientos(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    fecha = models.DateField(blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    nrocompr = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    origen = models.CharField(max_length=5, blank=True, null=True)
    debito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    credito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpdifasientos'


class Tmpextprov(models.Model):
    id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    tiporegistro = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    razonsocial = models.CharField(max_length=60, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    opmoneda = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    anho = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    nrodespacho = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nroordcomp = models.CharField(max_length=20, blank=True, null=True)
    fechafact = models.DateTimeField(blank=True, null=True)
    fechavto = models.DateTimeField(blank=True, null=True)
    saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tp_def = models.CharField(max_length=2, blank=True, null=True)
    comentario = models.CharField(max_length=40, blank=True, null=True)
    saldoanterior = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    debito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    credito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldofacturasant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    nrocuota = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpextprov'


class Tmpextracto(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    tipo = models.CharField(max_length=1, blank=True, null=True)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fecha_emi = models.DateTimeField(blank=True, null=True)
    fecha_ven = models.DateTimeField(blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    total = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    diasmora = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpextracto'


class TmpfactPentAUnaFecha(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=60, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    desmoneda = models.CharField(max_length=40, blank=True, null=True)
    importe_orig = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)
    saldo_actual = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpfact_pent_a_una_fecha'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_tp_comp', 'mvto_numero', 'cuota_numero'),)


class Tmpfactor(models.Model):
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fecha = models.DateField(blank=True, null=True)
    compra = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    venta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpfactor'


class Tmpfactura(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    fha_cbte = models.DateTimeField(blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    cod_con_vta = models.CharField(max_length=2, blank=True, null=True)
    tipo_iva = models.CharField(max_length=1, blank=True, null=True)
    vtacab_descuento = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    to_exento = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    to_gravado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    autorizado = models.CharField(max_length=1, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    caja = models.CharField(max_length=60, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    telefono1 = models.CharField(max_length=25, blank=True, null=True)
    telefono2 = models.CharField(max_length=25, blank=True, null=True)
    cod_localidad = models.CharField(max_length=3, blank=True, null=True)
    des_art = models.CharField(max_length=100, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    referencia = models.CharField(max_length=15, blank=True, null=True)
    cod_original = models.CharField(max_length=14, blank=True, null=True)
    linea = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    descuento = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    total = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    detvisible = models.CharField(max_length=1, blank=True, null=True)
    leyenda = models.CharField(max_length=20, blank=True, null=True)
    cantdecimal = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    des_vendedor = models.CharField(max_length=30, blank=True, null=True)
    des_con_vta = models.CharField(max_length=30, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    total_neto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    lineavtadet = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpfactura'


class Tmpfacturas(models.Model):
    fechafact = models.DateField(blank=True, null=True)
    cod_articulo = models.CharField(max_length=15, blank=True, null=True)
    preciounit = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    iva = models.CharField(max_length=2, blank=True, null=True)
    fecha = models.DateField(blank=True, null=True)
    dias = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpfacturas'


class Tmpficha(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    des_art = models.CharField(max_length=80, blank=True, null=True)
    cod_original = models.CharField(max_length=14, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=25, decimal_places=2, blank=True, null=True)
    pr_unit = models.DecimalField(max_digits=25, decimal_places=2, blank=True, null=True)
    des_tp_comp = models.CharField(max_length=30, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    tipo_mvto = models.CharField(max_length=1, blank=True, null=True)
    tp_def = models.CharField(max_length=2, blank=True, null=True)
    af_existencia = models.CharField(max_length=1, blank=True, null=True)
    af_costos = models.CharField(max_length=1, blank=True, null=True)
    codartpad = models.CharField(max_length=14, blank=True, null=True)
    nroarticulo = models.DecimalField(max_digits=14, decimal_places=0, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    orden = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    des_deposito = models.CharField(max_length=30, blank=True, null=True)
    des_familia = models.CharField(max_length=30, blank=True, null=True)
    des_grupo = models.CharField(max_length=30, blank=True, null=True)
    des_subgrupo = models.CharField(max_length=30, blank=True, null=True)
    des_individual = models.CharField(max_length=30, blank=True, null=True)
    costo = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    existencia = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    valor_inv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    orden_in_dia = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cantdecimal = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    saldoantentrada = models.DecimalField(max_digits=12, decimal_places=3, blank=True, null=True)
    saldoantsalida = models.DecimalField(max_digits=12, decimal_places=3, blank=True, null=True)
    acumularentrada = models.DecimalField(max_digits=12, decimal_places=3, blank=True, null=True)
    acumularsalida = models.DecimalField(max_digits=12, decimal_places=3, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    linea = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpficha'


class Tmpfiscal(models.Model):
    codplanctafiscal = models.CharField(max_length=20, blank=True, null=True)
    nombre = models.CharField(max_length=100, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpfiscal'


class Tmpflujocaja(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codareafc = models.CharField(max_length=8, blank=True, null=True)
    nombre = models.CharField(max_length=100, blank=True, null=True)
    rango1 = models.CharField(max_length=20, blank=True, null=True)
    saldo1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    rango2 = models.CharField(max_length=20, blank=True, null=True)
    saldo2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpflujocaja'


class Tmpgendespacho(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    tipoop = models.CharField(max_length=1, blank=True, null=True)
    nroop = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    factcambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpgendespacho'


class TmpgrupoRp(models.Model):
    cod_familia = models.CharField(max_length=4)
    cod_grupo = models.CharField(max_length=4)
    des_grupo = models.CharField(max_length=40)
    codlinea = models.CharField(max_length=4, blank=True, null=True)
    partarancelaria = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True)
    cod_cnime = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpgrupo_rp'


class Tmpimpflejes(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=15, blank=True, null=True)
    cod_original = models.CharField(max_length=15, blank=True, null=True)
    desc_art = models.CharField(max_length=40, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    preciocto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    listavta = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    precioof = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    preciopu = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpimpflejes'


class Tmpinfgerenciales(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codinforme = models.CharField(max_length=5, blank=True, null=True)
    nombreinforme = models.CharField(max_length=40, blank=True, null=True)
    fila = models.CharField(max_length=5, blank=True, null=True)
    signo = models.CharField(max_length=1, blank=True, null=True)
    descfila = models.CharField(max_length=40, blank=True, null=True)
    columna = models.CharField(max_length=5, blank=True, null=True)
    desccolumna = models.CharField(max_length=40, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    saldomes = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldoanho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldomesme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldoanhome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpinfgerenciales'


class Tmpingresosegresosaux(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    nombre = models.CharField(max_length=40, blank=True, null=True)
    ingresos = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    egresos = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ingresosme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    egresosme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpingresosegresosaux'


class Tmpingresosegresosctasaux(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    tipocta = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpingresosegresosctasaux'


class Tmpinventarioaf(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codinventario = models.CharField(max_length=20, blank=True, null=True)
    codinvpadre = models.CharField(max_length=20, blank=True, null=True)
    codubicacion = models.CharField(max_length=14, blank=True, null=True)
    codresponsable = models.CharField(max_length=4, blank=True, null=True)
    cantestim = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cantimpreso = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cantinvent = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fechaultinv = models.DateTimeField(blank=True, null=True)
    codmarca = models.CharField(max_length=4, blank=True, null=True)
    modelo = models.CharField(max_length=25, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    nroserie = models.CharField(max_length=20, blank=True, null=True)
    descrip = models.CharField(max_length=80, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpinventarioaf'


class Tmpiva(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    tipomvto = models.CharField(max_length=2, blank=True, null=True)
    total = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalneto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalgrav = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaliva = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalnc = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpiva'


class Tmplistaprecmig(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    precio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmplistaprecmig'


class Tmplistaprecmigsr(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    precio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmplistaprecmigsr'


class Tmplocalidad(models.Model):
    codigo = models.CharField(max_length=3, blank=True, null=True)
    descrip = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmplocalidad'


class Tmpmaxmin(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    minimo = models.IntegerField(blank=True, null=True)
    maximo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpmaxmin'


class Tmpmayor(models.Model):
    sid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codplanctapad = models.CharField(max_length=11, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    nombreplancta = models.CharField(max_length=35, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    nombreplanctapad = models.CharField(max_length=35, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    nombreaux = models.CharField(max_length=40, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    tiporegistro = models.CharField(max_length=1, blank=True, null=True)
    tiposaldo = models.CharField(max_length=1, blank=True, null=True)
    tipoasiento = models.CharField(max_length=2, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=11, decimal_places=0, blank=True, null=True)
    autorizado = models.CharField(max_length=1, blank=True, null=True)
    linea = models.DecimalField(max_digits=6, decimal_places=0, blank=True, null=True)
    concepto = models.CharField(max_length=40, blank=True, null=True)
    dbcr = models.CharField(max_length=1, blank=True, null=True)
    origen = models.CharField(max_length=2, blank=True, null=True)
    mes = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    debito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    credito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    debitome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    creditome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    nrocompr = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpmayor'


class Tmpmayorctas(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    nombreplancta = models.CharField(max_length=35, blank=True, null=True)
    nombreaux = models.CharField(max_length=40, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpmayorctas'


class Tmpmayortipoasientos(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    tipoasiento = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpmayortipoasientos'


class Tmpmovcomb(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    des_familia = models.CharField(max_length=40, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    des_grupo = models.CharField(max_length=30, blank=True, null=True)
    sondeo_inicial = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    sondeo_final = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    des_tp_comp = models.CharField(max_length=40, blank=True, null=True)
    tp_def = models.CharField(max_length=2, blank=True, null=True)
    origen = models.CharField(max_length=4, blank=True, null=True)
    af_existencia = models.CharField(max_length=1, blank=True, null=True)
    af_costos = models.CharField(max_length=1, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    precio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    existencia = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    reg_final = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpmovcomb'


class Tmpmovimbanc(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_moneda = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    debitoanterior = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    creditoanterior = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    extraccion = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deposito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpmovimbanc'


class Tmpmvtobienreproc(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    nromvto = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpmvtobienreproc'


class Tmpnc(models.Model):
    codprov = models.CharField(max_length=4, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    totalfact = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpnc'


class Tmpnroasientovta(models.Model):
    concepto = models.CharField(max_length=200, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    fecha = models.DateField(blank=True, null=True)
    conceptoorig = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpnroasientovta'


class TmppagoPentAUnaFecha(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0)
    t_pagos = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmppago_pent_a_una_fecha'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_tp_comp', 'mvto_numero', 'cuota_numero'),)


class Tmppagopuntoventa(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    totalapagar = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montopagado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    vuelto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmppagopuntoventa'


class Tmppresup(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    nombrecta = models.CharField(max_length=40, blank=True, null=True)
    nivel = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    nombreaux = models.CharField(max_length=40, blank=True, null=True)
    presup = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    presupme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    modif = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    modifme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ejecutado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ejecutadome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmppresup'


class Tmpprf(models.Model):
    sessionid = models.CharField(max_length=11, blank=True, null=True)
    proceso = models.CharField(max_length=80, blank=True, null=True)
    desproceso = models.CharField(max_length=80, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    tp_def = models.CharField(max_length=2, blank=True, null=True)
    des_tp_comp = models.CharField(max_length=30, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    des_art = models.CharField(max_length=30, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    nombrecta = models.CharField(max_length=40, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    nombreaux = models.CharField(max_length=40, blank=True, null=True)
    mensageerror = models.CharField(max_length=200, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpprf'


class Tmpprobimpopfact(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    nroop = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nroop_ms = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fechaop = models.DateTimeField(blank=True, null=True)
    codmonedaop = models.CharField(max_length=2, blank=True, null=True)
    factcambioop = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    beneficiario = models.CharField(max_length=50, blank=True, null=True)
    conceptoop = models.CharField(max_length=60, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    fechafact = models.DateTimeField(blank=True, null=True)
    fechavctofact = models.DateTimeField(blank=True, null=True)
    totalexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalgrav = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaliva = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codmonedafact = models.CharField(max_length=2, blank=True, null=True)
    factcambiofact = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    conceptofact = models.CharField(max_length=60, blank=True, null=True)
    observerror = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpprobimpopfact'


class Tmpproblemimportaf(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    nrolinea = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    codactivo = models.CharField(max_length=14, blank=True, null=True)
    descactivo = models.CharField(max_length=40, blank=True, null=True)
    codubicacion = models.CharField(max_length=14, blank=True, null=True)
    codresponsable = models.CharField(max_length=4, blank=True, null=True)
    nroserie = models.CharField(max_length=20, blank=True, null=True)
    nroparte = models.CharField(max_length=20, blank=True, null=True)
    observerror = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpproblemimportaf'


class Tmpproductosweb(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    preciolista = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    precioweb = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    existencia = models.DecimalField(max_digits=13, decimal_places=0, blank=True, null=True)
    cod_familia = models.CharField(max_length=4)
    cod_grupo = models.CharField(max_length=4)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    descripcion = models.CharField(max_length=1000)

    class Meta:
        managed = False
        db_table = 'tmpproductosweb'


class Tmpproveedoressaldos(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    razonsocial = models.CharField(max_length=60, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpproveedoressaldos'


class Tmpprovsaldos(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    razonsocial = models.CharField(max_length=60, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fecha = models.DateField(blank=True, null=True)
    fechavto = models.DateField(blank=True, null=True)
    total = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpprovsaldos'


class Tmpranking(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    codarticulo = models.CharField(max_length=14, blank=True, null=True)
    cantidad_c = models.DecimalField(max_digits=11, decimal_places=3, blank=True, null=True)
    exentas_c = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    gravadas_c = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    cantidad_d = models.DecimalField(max_digits=11, decimal_places=3, blank=True, null=True)
    exentas_d = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    gravadas_d = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    session_id = models.CharField(max_length=16, blank=True, null=True)
    totalcompras = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpranking'


class Tmprankingventas(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    vendidos = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    devueltos = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    montoventa = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montodevuelto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costoventa = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costodevuelto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    utilidad = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    margen = models.DecimalField(max_digits=30, decimal_places=2, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    codcliente = models.CharField(max_length=8, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmprankingventas'


class Tmprecalexistencia(models.Model):
    sessionid = models.CharField(max_length=15)
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    origen = models.CharField(max_length=4)
    cantidad = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmprecalexistencia'
        unique_together = (('sessionid', 'cod_empresa', 'cod_sucursal', 'cod_deposito', 'cod_articulo', 'origen'),)


class Tmprecallexistencia(models.Model):
    sessionid = models.CharField(max_length=15)
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    origen = models.CharField(max_length=20)
    cantidad = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)
    total = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totalme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmprecallexistencia'
        unique_together = (('sessionid', 'cod_empresa', 'cod_sucursal', 'cod_deposito', 'cod_articulo', 'origen'),)


class Tmprecaudagrup(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    tiporegistro = models.CharField(max_length=1, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    agrupreport = models.CharField(max_length=60, blank=True, null=True)
    codagrupreport = models.CharField(max_length=4, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    descripagrup = models.CharField(max_length=60, blank=True, null=True)
    impagrupacion = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porcparticip = models.DecimalField(max_digits=7, decimal_places=4, blank=True, null=True)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    nrooperacion = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    linea = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cod_tp_pago = models.CharField(max_length=2, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    imprecaudacion = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    imprecaplicado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codtppago = models.CharField(max_length=4, blank=True, null=True)
    pagonumero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    imppago = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    impaplicado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porcaplicado = models.DecimalField(max_digits=7, decimal_places=4, blank=True, null=True)
    codtpvta = models.CharField(max_length=4, blank=True, null=True)
    compnumero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    porcpartpago = models.DecimalField(max_digits=7, decimal_places=4, blank=True, null=True)
    impvtacancelado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    imprecvtaprorrat = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tipolibroiva = models.CharField(max_length=2, blank=True, null=True)
    codmonedavta = models.CharField(max_length=2, blank=True, null=True)
    mvtonumero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmprecaudagrup'


class TmprecaudagrupCt(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmprecaudagrup_ct'


class TmprecibosRp(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmprecibos_rp'


class Tmprecibosdup(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    pago_numero = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    total = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmprecibosdup'


class Tmprelacstock(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    des_art = models.CharField(max_length=100)
    suc01stock = models.DecimalField(max_digits=12, decimal_places=3, blank=True, null=True)
    suc02stock = models.DecimalField(max_digits=12, decimal_places=3, blank=True, null=True)
    suc03stock = models.DecimalField(max_digits=12, decimal_places=3, blank=True, null=True)
    suc04stock = models.DecimalField(max_digits=12, decimal_places=3, blank=True, null=True)
    suc05stock = models.DecimalField(max_digits=12, decimal_places=3, blank=True, null=True)
    suc06stock = models.DecimalField(max_digits=12, decimal_places=3, blank=True, null=True)
    suc07stock = models.DecimalField(max_digits=12, decimal_places=3, blank=True, null=True)
    suc08stock = models.DecimalField(max_digits=12, decimal_places=3, blank=True, null=True)
    suc09stock = models.DecimalField(max_digits=12, decimal_places=3, blank=True, null=True)
    suc10stock = models.DecimalField(max_digits=12, decimal_places=3, blank=True, null=True)
    vtaperiodo = models.DecimalField(max_digits=12, decimal_places=3, blank=True, null=True)
    ctounitario = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    compraperiodo = models.DecimalField(max_digits=12, decimal_places=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmprelacstock'
        unique_together = (('cod_empresa', 'cod_articulo'),)


class Tmprendtransportadoras(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_camion = models.CharField(max_length=8)
    des_camion = models.CharField(max_length=100, blank=True, null=True)
    facturas_emitidas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    facturas_anuladas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    ventas_netas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    efectivo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cheque_diferido = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cheque_dia = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    notas_credito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    sin_cargo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    facturas_credito = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_rendicion = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    diferencia = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmprendtransportadoras'
        unique_together = (('cod_empresa', 'cod_camion'),)


class Tmprendtransportadorastotales(models.Model):
    tipo = models.DecimalField(max_digits=1, decimal_places=0)
    cod_camion = models.CharField(max_length=8)
    total = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmprendtransportadorastotales'
        unique_together = (('tipo', 'cod_camion'),)


class Tmpresrevdepr(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codrubro = models.CharField(max_length=11, blank=True, null=True)
    descriprubro = models.CharField(max_length=40, blank=True, null=True)
    codsubrubro = models.CharField(max_length=11, blank=True, null=True)
    descripsubrubro = models.CharField(max_length=40, blank=True, null=True)
    codubicacion = models.CharField(max_length=14, blank=True, null=True)
    descripubic = models.CharField(max_length=40, blank=True, null=True)
    codactivo = models.CharField(max_length=14, blank=True, null=True)
    estadoactivo = models.CharField(max_length=1, blank=True, null=True)
    descripactivo = models.CharField(max_length=40, blank=True, null=True)
    fechacompra = models.DateField(blank=True, null=True)
    fechaalta = models.DateField(blank=True, null=True)
    fechainiproc = models.DateField(blank=True, null=True)
    costocompra = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacum = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprecant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprecacum = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valornetoant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valornetoacum = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costocomprame = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprecantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprecacumme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valornetoantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valornetoacumme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpresrevdepr'


class Tmpresumencoa(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    periodo = models.DateField(blank=True, null=True)
    gravadas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    nodetallado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    importado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    exonerado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpresumencoa'


class Tmprevdeprec(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    anho = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    codtipocalc = models.CharField(max_length=2, blank=True, null=True)
    nrocalculo = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    fechacalculo = models.DateField(blank=True, null=True)
    codactivo = models.CharField(max_length=14, blank=True, null=True)
    descrip = models.CharField(max_length=40, blank=True, null=True)
    codrubro = models.CharField(max_length=11, blank=True, null=True)
    codsubrubro = models.CharField(max_length=11, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    codubicacion = models.CharField(max_length=14, blank=True, null=True)
    fechacompra = models.DateField(blank=True, null=True)
    fechaalta = models.DateField(blank=True, null=True)
    tipodeprec = models.CharField(max_length=1, blank=True, null=True)
    metodocalc = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    vidautil = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    vidautilrest = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    coefrev = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    porcdeprec = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    costocompra = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalejant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorreval = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalej = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacumant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprecant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajusteant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumantrev = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorbajasant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacumbajasant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumbajasant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoraltascompra = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoraltasactivac = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalaltas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalejaltas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprecaltas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajustealtas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacumaltas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumaltas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorbajasanho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacumbajasanho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumbajasanho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoraltas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorbajas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacumbajas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumbajas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprec = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacum = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valornetoant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valornetoantrev = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorneto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costocomprame = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalejantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalejme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacumantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprecantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajusteantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumantrevme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorbajasantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacumbajasantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumbajasantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoraltascomprame = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoraltasactivacme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalaltasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalejaltasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprecaltasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajustealtasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacumaltasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumaltasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorbajasanhome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacumbajasanhome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumbajasanhome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valoraltasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorbajasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacumbajasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumbajasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprecme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajusteme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valornetoantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valornetoantrevme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valornetome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmprevdeprec'


class TmprevdeprecFmt2(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    anho = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    codtipocalc = models.CharField(max_length=2, blank=True, null=True)
    nrocalculo = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    fechacalculo = models.DateField(blank=True, null=True)
    codactivo = models.CharField(max_length=14, blank=True, null=True)
    descrip = models.CharField(max_length=40, blank=True, null=True)
    codrubro = models.CharField(max_length=11, blank=True, null=True)
    codsubrubro = models.CharField(max_length=11, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    codubicacion = models.CharField(max_length=14, blank=True, null=True)
    fechacompra = models.DateField(blank=True, null=True)
    fechaalta = models.DateField(blank=True, null=True)
    fechainiproc = models.DateField(blank=True, null=True)
    tipodeprec = models.CharField(max_length=1, blank=True, null=True)
    metodocalc = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    vidautil = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    vidautilrest = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    coefrev = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)
    porcdeprec = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    costocompra = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costocompra_anhoant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalant_anhoant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalactual_anhoant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalej_anhoant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacum_anhoant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprec_anhoant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste_anhoant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumant_anhoant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumantsinrev_anhoant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumantrev_anhoant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum_anhoant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costo_bajasant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalanho_bajasant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacum_bajasant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadepanho_bajasant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadepacum_bajasant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    depajusteanho_bajasant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    depajusteacum_bajasant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum_bajasant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costo_altascompra = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costo_altasactivac = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorreval_altas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalej_altas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacum_altas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprec_altas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste_altas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum_altas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costo_bajasanho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalanho_bajasanho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacum_bajasanho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadepanho_bajasanho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadepacum_bajasanho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    depajusteanho_bajasanho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    depajusteacum_bajasanho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum_bajasanho = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costo_altastransf = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalejer_altastransf = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revacum_altastransf = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotaactual_altastransf = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste_altastransf = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    depacum_altastransf = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costo_bajastransf = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalejer_bajastransf = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revacum_bajastransf = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotaactual_bajastransf = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste_bajastransf = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    depacum_bajastransf = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costototal_altas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costototal_bajas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalanho_bajas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacum_bajas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprec_bajas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste_bajas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum_bajas = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalactual = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalej = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacum = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprec = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumsinrev = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumrev = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valornetoant = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valornetoantrev = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorneto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costocomprame = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costocompra_anhoantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalant_anhoantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalactual_anhoantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalej_anhoantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacum_anhoantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprec_anhoantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste_anhoantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumant_anhoantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumantsinrev_anhoantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumantrev_anhoantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum_anhoantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costo_bajasantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalanho_bajasantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacum_bajasantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadepanho_bajasantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadepacum_bajasantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    depajusteanho_bajasantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    depajusteacum_bajasantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum_bajasantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costo_altascomprame = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costo_altasactivacme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorreval_altasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalej_altasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacum_altasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprec_altasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste_altasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum_altasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costo_bajasanhome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalanho_bajasanhome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacum_bajasanhome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadepanho_bajasanhome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadepacum_bajasanhome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    depajusteanho_bajasanhome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    depajusteacum_bajasanhome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum_bajasanhome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costo_altastransfme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalejer_altastransfme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revacum_altastransfme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotaactual_altastransfme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste_altastransfme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    depacum_altastransfme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costo_bajastransfme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalejer_bajastransfme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revacum_bajastransfme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotaactual_bajastransfme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste_bajastransfme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    depacum_bajastransfme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costototal_altasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    costototal_bajasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalanho_bajasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    revalacum_bajasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprec_bajasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajuste_bajasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacum_bajasme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalactualme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalejme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valorrevalacumme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cuotadeprecme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecajusteme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumsinrevme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    deprecacumrevme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valornetoantme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valornetoantrevme = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    valornetome = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmprevdeprec_fmt_2'


class Tmprubrosaf(models.Model):
    session_id = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codrubro = models.CharField(max_length=11, blank=True, null=True)
    descriprubro = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmprubrosaf'


class Tmpsaldoclientesportpcte(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    saldo_anterior = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    saldo_periodo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpsaldoclientesportpcte'


class Tmpsaldos(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    mvto_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    cuota_numero = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fecha = models.DateField(blank=True, null=True)
    monto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpsaldos'


class TmpsaldosMensual(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    saldo = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fecha_01 = models.DateField(blank=True, null=True)
    monto_01 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fecha_02 = models.DateField(blank=True, null=True)
    monto_02 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fecha_03 = models.DateField(blank=True, null=True)
    monto_03 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fecha_04 = models.DateField(blank=True, null=True)
    monto_04 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fecha_05 = models.DateField(blank=True, null=True)
    monto_05 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fecha_06 = models.DateField(blank=True, null=True)
    monto_06 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fecha_07 = models.DateField(blank=True, null=True)
    monto_07 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fecha_08 = models.DateField(blank=True, null=True)
    monto_08 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fecha_09 = models.DateField(blank=True, null=True)
    monto_09 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fecha_10 = models.DateField(blank=True, null=True)
    monto_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fecha_11 = models.DateField(blank=True, null=True)
    monto_11 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fecha_12 = models.DateField(blank=True, null=True)
    monto_12 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpsaldos_mensual'


class Tmpsaldosresumen(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    vencidas30 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    vencidas60 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    vencidas90 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    vencidas120 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    vencidas150 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    vencidas180 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    vencidasmas180 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    avencer30 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    avencer60 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    avencer90 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    avencer120 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    avencer150 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    avencer180 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    avencermas180 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldodia = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pagosanteriores = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    creditosaplicables = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpsaldosresumen'


class Tmpsolcomprarep(models.Model):
    sessionid = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    nropedido = models.DecimalField(max_digits=6, decimal_places=0, blank=True, null=True)
    fechasolic = models.DateTimeField(blank=True, null=True)
    ley60_90 = models.CharField(max_length=1, blank=True, null=True)
    presupuestado = models.CharField(max_length=1, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    des_art = models.CharField(max_length=60, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    razon_social_1 = models.CharField(max_length=60, blank=True, null=True)
    fechaentrega_1 = models.DateTimeField(blank=True, null=True)
    plazo1 = models.CharField(max_length=20, blank=True, null=True)
    precio_1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_localidad_1 = models.CharField(max_length=4, blank=True, null=True)
    tipocosto_1 = models.CharField(max_length=3, blank=True, null=True)
    medioembarque_1 = models.CharField(max_length=1, blank=True, null=True)
    seguro_1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    flete_1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tribaduana_1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    aceptado_1 = models.CharField(max_length=1, blank=True, null=True)
    iva_1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_iva_1 = models.CharField(max_length=1, blank=True, null=True)
    razon_social_2 = models.CharField(max_length=60, blank=True, null=True)
    fechaentrega_2 = models.DateTimeField(blank=True, null=True)
    plazo2 = models.CharField(max_length=20, blank=True, null=True)
    precio_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_localidad_2 = models.CharField(max_length=4, blank=True, null=True)
    tipocosto_2 = models.CharField(max_length=3, blank=True, null=True)
    medioembarque_2 = models.CharField(max_length=1, blank=True, null=True)
    seguro_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    flete_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tribaduana_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    aceptado_2 = models.CharField(max_length=1, blank=True, null=True)
    iva_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_iva_2 = models.CharField(max_length=1, blank=True, null=True)
    razon_social_3 = models.CharField(max_length=60, blank=True, null=True)
    fechaentrega_3 = models.DateTimeField(blank=True, null=True)
    plazo3 = models.CharField(max_length=20, blank=True, null=True)
    precio_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_localidad_3 = models.CharField(max_length=4, blank=True, null=True)
    tipocosto_3 = models.CharField(max_length=3, blank=True, null=True)
    medioembarque_3 = models.CharField(max_length=1, blank=True, null=True)
    seguro_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    flete_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tribaduana_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    aceptado_3 = models.CharField(max_length=1, blank=True, null=True)
    iva_3 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_iva_3 = models.CharField(max_length=1, blank=True, null=True)
    obstipocosto_1 = models.CharField(max_length=250, blank=True, null=True)
    obstipocosto_2 = models.CharField(max_length=250, blank=True, null=True)
    obstipocosto_3 = models.CharField(max_length=250, blank=True, null=True)
    linea = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    justificacion = models.CharField(max_length=500, blank=True, null=True)
    paraque = models.CharField(max_length=500, blank=True, null=True)
    porque = models.CharField(max_length=500, blank=True, null=True)
    paraquien_donde = models.CharField(max_length=500, blank=True, null=True)
    paracuando = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpsolcomprarep'


class Tmpterminos(models.Model):
    sessionid = models.CharField(max_length=15, blank=True, null=True)
    cod_con_vta = models.CharField(max_length=2, blank=True, null=True)
    dias_credito = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    des_con_vta = models.CharField(max_length=40, blank=True, null=True)
    porcinteres = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpterminos'


class Tmptipoprov(models.Model):
    cod_original = models.CharField(max_length=10, blank=True, null=True)
    razonsocial = models.CharField(max_length=80, blank=True, null=True)
    tipoprov = models.CharField(max_length=10, blank=True, null=True)
    codprov = models.CharField(max_length=10, blank=True, null=True)
    tipo = models.CharField(max_length=2, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmptipoprov'


class Tmptpocbte(models.Model):
    sessionid = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    tp_def = models.CharField(max_length=2, blank=True, null=True)
    des_tp_comp = models.CharField(max_length=30, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmptpocbte'


class Tmpventasdia(models.Model):
    cod_empresa = models.CharField(max_length=2)
    mes = models.DecimalField(max_digits=2, decimal_places=0)
    dia = models.DecimalField(max_digits=5, decimal_places=0)
    suc01_anho_1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc01_anho_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc02_anho_1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc02_anho_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc03_anho_1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc03_anho_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc04_anho_1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc04_anho_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc05_anho_1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc05_anho_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc06_anho_1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc06_anho_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc07_anho_1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc07_anho_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc08_anho_1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc08_anho_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc09_anho_1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc09_anho_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc10_anho_1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    suc10_anho_2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpventasdia'
        unique_together = (('cod_empresa', 'mes', 'dia'),)


class Tmpvtacab(models.Model):
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    comp_numero = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    fha_cbte = models.DateTimeField(blank=True, null=True)
    cod_con_vta = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_pago = models.CharField(max_length=2, blank=True, null=True)
    tipo_vta = models.CharField(max_length=2, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    com_vendedor = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    comisman = models.CharField(max_length=1, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    descuento = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    to_exento = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    to_gravado = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    total_iva = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    tipo_iva = models.CharField(max_length=1, blank=True, null=True)
    autorizado = models.CharField(max_length=1, blank=True, null=True)
    anulado = models.CharField(max_length=1, blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    rf_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    caja = models.CharField(max_length=60, blank=True, null=True)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    asentadocv = models.CharField(max_length=1, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    cod_cajero = models.CharField(max_length=16, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    codplancta_dif = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_dif = models.CharField(max_length=11, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    total_diferido = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    total_venta = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    empresacompra = models.CharField(max_length=2, blank=True, null=True)
    codprovcompra = models.CharField(max_length=4, blank=True, null=True)
    nrofactcompra = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    totaldctoexen = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    totaldctograv = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    totaldctograv_d = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    totaldctoexen_d = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    descuento2do = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    tot2dodctoexen = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    tot2dodctograv = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    totaldescuento = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    montopagado = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    vuelto = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    sectorfacturacion = models.CharField(max_length=12, blank=True, null=True)
    comp_numero_orig = models.DecimalField(max_digits=16, decimal_places=0, blank=True, null=True)
    fechaentreganc = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpvtacab'


class Tmpvtasartcomp(models.Model):
    sessionid = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    des_art = models.CharField(max_length=40, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    des_familia = models.CharField(max_length=40, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    des_grupo = models.CharField(max_length=40, blank=True, null=True)
    cod_subgrupo = models.CharField(max_length=4, blank=True, null=True)
    des_subgrupo = models.CharField(max_length=40, blank=True, null=True)
    cod_individual = models.CharField(max_length=4, blank=True, null=True)
    des_individual = models.CharField(max_length=40, blank=True, null=True)
    iva = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    cantidad1 = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    total1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cantidad2 = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    total2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpvtasartcomp'


class Tmpvtascltescomp(models.Model):
    sessionid = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    nrocliente = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    total1 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total2 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpvtascltescomp'


class Tmpvtasgral(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    des_familia = models.CharField(max_length=40, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    des_grupo = models.CharField(max_length=30, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    des_art = models.CharField(max_length=30, blank=True, null=True)
    cantidad = models.DecimalField(max_digits=15, decimal_places=0)
    importetotal = models.DecimalField(max_digits=19, decimal_places=4)
    ventacredito = models.DecimalField(max_digits=19, decimal_places=4)
    ventacontado = models.DecimalField(max_digits=19, decimal_places=4)
    origen = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpvtasgral'


class Tmpvtasproyec(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    des_familia = models.CharField(max_length=40, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    des_grupo = models.CharField(max_length=30, blank=True, null=True)
    costo_unit = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    precio_unit = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    existencia = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cant_vendida = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    dias_restances = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpvtasproyec'


class Tmpvtasproyecarticulos(models.Model):
    id = models.CharField(max_length=15, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_familia = models.CharField(max_length=4, blank=True, null=True)
    des_familia = models.CharField(max_length=40, blank=True, null=True)
    cod_grupo = models.CharField(max_length=4, blank=True, null=True)
    des_grupo = models.CharField(max_length=30, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    des_articulo = models.CharField(max_length=40, blank=True, null=True)
    costo_unit = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    precio_unit = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    existencia = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cant_vendida = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    dias_restantes = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpvtasproyecarticulos'


class Tmpzonavta(models.Model):
    codigo = models.CharField(max_length=3, blank=True, null=True)
    descrip = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tmpzonavta'


class TpDef(models.Model):
    tp_def = models.CharField(primary_key=True, max_length=2)
    descrip = models.CharField(max_length=60, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tp_def'


class Tpoactagendacobranzas(models.Model):
    cod_empresa = models.CharField(max_length=2)
    codtipoaccion = models.CharField(max_length=4)
    descrip = models.CharField(max_length=60, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tpoactagendacobranzas'
        unique_together = (('cod_empresa', 'codtipoaccion'),)


class Tpoart(models.Model):
    cod_tp_art = models.CharField(primary_key=True, max_length=3)
    debcred = models.CharField(max_length=1)
    descrip = models.CharField(max_length=40)
    tpdef = models.CharField(max_length=1)
    ctrlexistencia = models.CharField(max_length=1, blank=True, null=True)
    facturar_negativo = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tpoart'


class TpoartSync(models.Model):
    cod_tp_art = models.CharField(max_length=3)
    debcred = models.CharField(max_length=1)
    descrip = models.CharField(max_length=40)
    tpdef = models.CharField(max_length=1)
    ctrlexistencia = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tpoart_sync'


class Tpocbte(models.Model):
    cod_empresa = models.ForeignKey(Plancta, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    tp_def = models.CharField(max_length=2)
    af_existencia = models.CharField(max_length=1)
    af_costos = models.CharField(max_length=1)
    af_ult_mov = models.CharField(max_length=1)
    desde_nro = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    hasta_nro = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    debcred = models.CharField(max_length=1, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    des_tp_comp = models.CharField(max_length=40)
    leyenda = models.CharField(max_length=20, blank=True, null=True)
    codplanctame = models.CharField(max_length=11, blank=True, null=True)
    codplanauxme = models.CharField(max_length=11, blank=True, null=True)
    codplancta_dif = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_dif = models.CharField(max_length=11, blank=True, null=True)
    codplancta_difme = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_difme = models.CharField(max_length=11, blank=True, null=True)
    ctrl_cliente = models.CharField(max_length=1, blank=True, null=True)
    orden_ficha = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    orden_ficha_2 = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    geningvtas = models.CharField(max_length=1, blank=True, null=True)
    genctovtas = models.CharField(max_length=1, blank=True, null=True)
    devolucion = models.CharField(max_length=1, blank=True, null=True)
    modprunit = models.CharField(max_length=1, blank=True, null=True)
    moddescporc = models.CharField(max_length=1, blank=True, null=True)
    moddescmonto = models.CharField(max_length=1, blank=True, null=True)
    modtotal = models.CharField(max_length=1, blank=True, null=True)
    tipolibroiva = models.CharField(max_length=2, blank=True, null=True)
    modlista_prec = models.CharField(max_length=1, blank=True, null=True)
    modfecha = models.CharField(max_length=1, blank=True, null=True)
    modfechapresup = models.CharField(max_length=1, blank=True, null=True)
    diasvctopresup = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    fact_interna = models.CharField(max_length=1, blank=True, null=True)
    modvendedor = models.CharField(max_length=1, blank=True, null=True)
    ctrlartdupl = models.CharField(max_length=1, blank=True, null=True)
    cbte_estad = models.CharField(max_length=1, blank=True, null=True)
    ctrlprvtadesc = models.CharField(max_length=1, blank=True, null=True)
    ctrlarttpocbte = models.CharField(max_length=1, blank=True, null=True)
    ntcred1factura = models.CharField(max_length=1, blank=True, null=True)
    ntcreddiasmax = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    tipolibroiva_descrip = models.CharField(max_length=40, blank=True, null=True)
    permitirfacturarcero = models.CharField(max_length=1, blank=True, null=True)
    tipoiva = models.CharField(max_length=1, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    activo = models.CharField(max_length=1, blank=True, null=True)
    sumarivasiincluido = models.CharField(max_length=1, blank=True, null=True)
    cod_tipodoc = models.CharField(max_length=4, blank=True, null=True)
    prefijofact_pronet = models.CharField(max_length=3, blank=True, null=True)
    tpomvto = models.CharField(max_length=2, blank=True, null=True)
    vtacontadocredito = models.CharField(max_length=1, blank=True, null=True)
    control_inactivos = models.CharField(max_length=1, blank=True, null=True)
    nrotimbrado = models.CharField(max_length=20, blank=True, null=True)
    timbrado = models.CharField(max_length=20, blank=True, null=True)
    ctrlnrointernotimbrado = models.CharField(max_length=1, blank=True, null=True)
    upd_costos = models.CharField(max_length=1, blank=True, null=True)
    tipo = models.CharField(max_length=7, blank=True, null=True)
    ctrl_importeventa_termino = models.CharField(max_length=1, blank=True, null=True)
    updinventariado = models.CharField(max_length=1, blank=True, null=True)
    modcantidad = models.CharField(max_length=1, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    tpocbtealta = models.CharField(max_length=4, blank=True, null=True)
    tpocbtebaja = models.CharField(max_length=4, blank=True, null=True)
    tpocbte_habilitados = models.CharField(max_length=300, blank=True, null=True)
    lista_base = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    modgeneracionfact = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tpocbte'
        unique_together = (('cod_empresa', 'cod_tp_comp'),)


class TpocbteCtrl(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp_pago = models.CharField(max_length=4)
    cod_tp_comp_deuda = models.CharField(max_length=4)
    observ = models.CharField(max_length=60, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tpocbte_ctrl'
        unique_together = (('cod_empresa', 'cod_tp_comp_pago', 'cod_tp_comp_deuda'),)


class Tpocbteseries(models.Model):
    cod_empresa = models.CharField(max_length=2)
    nroserie = models.CharField(max_length=12)
    observ = models.CharField(max_length=60, blank=True, null=True)
    nrodesde = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nrohasta = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nroutilizado = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    cod_usuario = models.ForeignKey('Usuarios', db_column='cod_usuario', blank=True, null=True)
    lencodigo = models.DecimalField(max_digits=6, decimal_places=0, blank=True, null=True)
    fha_desde = models.DateTimeField(blank=True, null=True)
    fha_hasta = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tpocbteseries'
        unique_together = (('cod_empresa', 'nroserie'),)


class Tpocbteterminos(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    cod_con_vta = models.CharField(max_length=2)
    oferta = models.CharField(max_length=1, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    localidad = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tpocbteterminos'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'cod_con_vta'),)


class Tpoclte(models.Model):
    cod_tp_cliente = models.CharField(primary_key=True, max_length=2)
    list_precio = models.CharField(max_length=1)
    descuento = models.DecimalField(max_digits=5, decimal_places=2)
    des_tp_cliente = models.CharField(max_length=20)
    dethechauka = models.CharField(max_length=1, blank=True, null=True)
    ctrl_cedula_duplic = models.CharField(max_length=1, blank=True, null=True)
    ctrl_ruc_duplic = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tpoclte'


class TpoclteSync(models.Model):
    cod_tp_cliente = models.CharField(max_length=2)
    list_precio = models.CharField(max_length=1)
    descuento = models.DecimalField(max_digits=5, decimal_places=2)
    des_tp_cliente = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'tpoclte_sync'


class Tporecaudacion(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_pago = models.CharField(max_length=2)
    tp_def = models.CharField(max_length=2)
    bloqmoneda = models.CharField(max_length=1)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    estado = models.CharField(max_length=1)
    operador = models.CharField(max_length=1)
    descrip = models.CharField(max_length=40, blank=True, null=True)
    abreviatura = models.CharField(max_length=15, blank=True, null=True)
    inscheque = models.CharField(max_length=1, blank=True, null=True)
    agrupacion = models.CharField(max_length=40, blank=True, null=True)
    dias = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    generar_asiento_ajuste = models.CharField(max_length=1, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    codplanctaajuste = models.CharField(max_length=11, blank=True, null=True)
    codplanauxajuste = models.CharField(max_length=11, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tporecaudacion'
        unique_together = (('cod_empresa', 'cod_tp_pago'),)


class Tpovend(models.Model):
    tipo_vendedor = models.CharField(primary_key=True, max_length=2)
    des_tipo_vendedor = models.CharField(max_length=20)
    tipocomision = models.CharField(max_length=1)
    def_tpovend = models.CharField(max_length=2)

    class Meta:
        managed = False
        db_table = 'tpovend'


class Tpovta(models.Model):
    tipo_vta = models.CharField(primary_key=True, max_length=2)
    des_tipo_vta = models.CharField(max_length=70)
    ubicacion = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tpovta'


class Transportista(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_transportista = models.CharField(max_length=8)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    contacto = models.CharField(max_length=35, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'transportista'
        unique_together = (('cod_empresa', 'cod_transportista'),)


class Ubicacion(models.Model):
    cod_empresa = models.ForeignKey(Sucursal, db_column='cod_empresa')
    codubicacion = models.CharField(max_length=14)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    coddpto = models.CharField(max_length=2, blank=True, null=True)
    codseccion = models.CharField(max_length=2, blank=True, null=True)
    descrip = models.CharField(max_length=40)
    codubicpadre = models.CharField(max_length=14, blank=True, null=True)
    nivel = models.DecimalField(max_digits=1, decimal_places=0)

    class Meta:
        managed = False
        db_table = 'ubicacion'
        unique_together = (('cod_empresa', 'codubicacion'),)


class Ubicop(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    ubicacion = models.CharField(max_length=3)
    descrip = models.CharField(max_length=40)
    cantdias = models.DecimalField(max_digits=5, decimal_places=2)
    nroorden = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ubicop'
        unique_together = (('cod_empresa', 'ubicacion'),)


class Updfact(models.Model):
    codprov = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    saldoact = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    pagado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldoreal = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'updfact'


class Usuarios(models.Model):
    cod_usuario = models.CharField(primary_key=True, max_length=16)
    nombres = models.CharField(max_length=40)
    apellidos = models.CharField(max_length=40)
    tp_def = models.CharField(max_length=1, blank=True, null=True)
    anular_servicios = models.CharField(max_length=1, blank=True, null=True)
    aprobarpresupuestos = models.CharField(max_length=1, blank=True, null=True)
    password = models.CharField(max_length=16, blank=True, null=True)
    datosadicclientes = models.CharField(max_length=1, blank=True, null=True)
    aplicantcredito = models.CharField(max_length=1, blank=True, null=True)
    genera_pagare = models.CharField(max_length=1, blank=True, null=True)
    modifica_vendedor = models.CharField(max_length=1, blank=True, null=True)
    costosarticulos = models.CharField(max_length=1, blank=True, null=True)
    inserta_detalle_nc = models.CharField(max_length=1, blank=True, null=True)
    modifica_clientes = models.CharField(max_length=1, blank=True, null=True)
    modifica_datos_camion = models.CharField(max_length=1, blank=True, null=True)
    inserta_tara = models.CharField(max_length=1, blank=True, null=True)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    cod_cobrador = models.CharField(max_length=3, blank=True, null=True)
    modif_desart = models.CharField(max_length=1, blank=True, null=True)
    chgestadoartserie = models.CharField(max_length=1, blank=True, null=True)
    inc_precios = models.CharField(max_length=1, blank=True, null=True)
    chg_sucursal = models.CharField(max_length=1, blank=True, null=True)
    ctrl_nc_obs = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    cantmaxconex = models.DecimalField(max_digits=2, decimal_places=0)
    ctrl_costo_prvta = models.CharField(max_length=1, blank=True, null=True)
    ctrl_costo_ultcompra = models.CharField(max_length=1, blank=True, null=True)
    sucursales = models.CharField(max_length=100)
    modifpagare = models.CharField(max_length=1, blank=True, null=True)
    recallcostos = models.CharField(max_length=1, blank=True, null=True)
    aplicncsucursales = models.CharField(max_length=1, blank=True, null=True)
    printreport = models.CharField(max_length=1, blank=True, null=True)
    modif_fact_asentada = models.CharField(max_length=1, blank=True, null=True)
    imprimir_cheques = models.CharField(max_length=1, blank=True, null=True)
    modiftotalizador = models.CharField(max_length=1, blank=True, null=True)
    datosadicctacte = models.CharField(max_length=1)
    vendedorxsucursal = models.CharField(max_length=1)
    modclientecbteenfact = models.CharField(max_length=1)
    moddepenfactdepresup = models.CharField(max_length=1, blank=True, null=True)
    visualizacompuestos = models.CharField(max_length=1, blank=True, null=True)
    sucursales_ctacte = models.CharField(max_length=200, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    modifrecaudacion = models.CharField(max_length=1, blank=True, null=True)
    desautorizamvto = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'usuarios'


class Vendcliente(models.Model):
    cod_empresa = models.ForeignKey(Clientes, db_column='cod_empresa')
    cod_cliente = models.CharField(max_length=8)
    cod_vendedor = models.ForeignKey('Vendedor', db_column='cod_vendedor')
    importemeta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porccomisalc = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porccomisnoalc = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montocomisalc = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montocomisnoalc = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vendcliente'
        unique_together = (('cod_empresa', 'cod_cliente', 'cod_vendedor'),)


class Vendedor(models.Model):
    cod_vendedor = models.CharField(primary_key=True, max_length=4)
    tipo_vendedor = models.ForeignKey(Tpovend, db_column='tipo_vendedor', blank=True, null=True)
    comision = models.DecimalField(max_digits=4, decimal_places=2)
    fha_ingreso = models.DateField(blank=True, null=True)
    comi_dif = models.DecimalField(max_digits=4, decimal_places=2)
    cod_superv = models.ForeignKey('self', db_column='cod_superv', blank=True, null=True)
    des_vendedor = models.CharField(max_length=30)
    atencionclientemin = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porcatminalc = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porcatminnoalc = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montoatminalc = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montoatminnoalc = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    atencionclientemax = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    porcatmaxalc = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montoatmaxalc = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    usuario_int = models.IntegerField(blank=True, null=True)
    cod_usuario = models.CharField(max_length=16, blank=True, null=True)
    cod_empresa = models.CharField(max_length=2, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    nombrepalm = models.CharField(max_length=20, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    cod_analista = models.CharField(max_length=4, blank=True, null=True)
    nro_cedula = models.CharField(max_length=8, blank=True, null=True)
    comisionvtacredito = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    meta_boletas = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    tpocbtepalm = models.CharField(max_length=80, blank=True, null=True)
    cod_supervvtas = models.CharField(max_length=4, blank=True, null=True)
    cod_gteventas = models.CharField(max_length=4, blank=True, null=True)
    salariobase = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vendedor'


class VendedorSync(models.Model):
    cod_vendedor = models.CharField(max_length=4)
    tipo_vendedor = models.CharField(max_length=2, blank=True, null=True)
    comision = models.DecimalField(max_digits=4, decimal_places=2)
    fha_ingreso = models.DateField(blank=True, null=True)
    comi_dif = models.DecimalField(max_digits=4, decimal_places=2)
    cod_superv = models.CharField(max_length=4, blank=True, null=True)
    des_vendedor = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'vendedor_sync'


class VendedorTmp(models.Model):
    codpersonal = models.CharField(max_length=15, blank=True, null=True)
    apenom = models.CharField(max_length=50, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    supervisor = models.CharField(max_length=15, blank=True, null=True)
    ubicacion = models.CharField(max_length=30, blank=True, null=True)
    objeto = models.CharField(max_length=30, blank=True, null=True)
    grupo_vent = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vendedor_tmp'


class Vendedorcomision(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_vendedor = models.CharField(max_length=4)
    anho = models.DecimalField(max_digits=4, decimal_places=0)
    mes = models.DecimalField(max_digits=4, decimal_places=0)
    salario = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    comision = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descuentos = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    neto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    observ = models.CharField(max_length=60, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vendedorcomision'
        unique_together = (('cod_empresa', 'cod_vendedor', 'anho', 'mes'),)


class VendedoresPlanilla(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero_planilla = models.DecimalField(max_digits=7, decimal_places=0)
    fecha = models.DateField()
    cod_sucursal = models.CharField(max_length=2)
    cod_vendedor = models.CharField(max_length=4)
    estado = models.CharField(max_length=1, blank=True, null=True)
    observ = models.CharField(max_length=70, blank=True, null=True)
    nrochofer = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vendedores_planilla'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero_planilla'),)


class Vendfamilia(models.Model):
    cod_empresa = models.ForeignKey(Empresa, db_column='cod_empresa')
    cod_familia = models.ForeignKey(Familia, db_column='cod_familia')
    cod_vendedor = models.ForeignKey(Vendedor, db_column='cod_vendedor')

    class Meta:
        managed = False
        db_table = 'vendfamilia'
        unique_together = (('cod_empresa', 'cod_familia', 'cod_vendedor'),)


class Visilloscab(models.Model):
    cod_empresa = models.ForeignKey(Tpocbte, db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    nroplanilla = models.DecimalField(max_digits=10, decimal_places=0)
    fecha = models.DateTimeField(blank=True, null=True)
    list_precio = models.CharField(max_length=1)
    turno = models.CharField(max_length=1, blank=True, null=True)
    observacion = models.CharField(max_length=150, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'visilloscab'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_tp_comp', 'nroplanilla'),)


class VisilloscabSync(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    nroplanilla = models.DecimalField(max_digits=10, decimal_places=0)
    fecha = models.DateTimeField(blank=True, null=True)
    list_precio = models.CharField(max_length=1)
    turno = models.CharField(max_length=1, blank=True, null=True)
    observacion = models.CharField(max_length=150, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'visilloscab_sync'


class Visillosdet(models.Model):
    cod_empresa = models.ForeignKey(Visilloscab, db_column='cod_empresa')
    cod_sucursal = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    nroplanilla = models.DecimalField(max_digits=10, decimal_places=0)
    linea = models.DecimalField(max_digits=4, decimal_places=0)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    precio = models.DecimalField(max_digits=19, decimal_places=4)
    visilloinicial = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    visillofinal = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'visillosdet'
        unique_together = (('cod_empresa', 'cod_sucursal', 'cod_tp_comp', 'nroplanilla', 'linea'),)


class VisillosdetSync(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_sucursal = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    nroplanilla = models.DecimalField(max_digits=10, decimal_places=0)
    linea = models.DecimalField(max_digits=4, decimal_places=0)
    cod_deposito = models.CharField(max_length=2, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    precio = models.DecimalField(max_digits=19, decimal_places=4)
    visilloinicial = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    visillofinal = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'visillosdet_sync'


class Vtacab(models.Model):
    cod_empresa = models.ForeignKey(Tpocbte, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0)
    fha_cbte = models.DateTimeField()
    cod_con_vta = models.ForeignKey(Terminos, db_column='cod_con_vta')
    cod_tp_pago = models.CharField(max_length=2)
    tipo_vta = models.ForeignKey(Tpovta, db_column='tipo_vta')
    cod_vendedor = models.ForeignKey(Vendedor, db_column='cod_vendedor', blank=True, null=True)
    com_vendedor = models.DecimalField(max_digits=4, decimal_places=2)
    comisman = models.CharField(max_length=1)
    codmoneda = models.ForeignKey(Moneda, db_column='codmoneda', blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    to_exento = models.DecimalField(max_digits=19, decimal_places=4)
    to_gravado = models.DecimalField(max_digits=19, decimal_places=4)
    total_iva = models.DecimalField(max_digits=19, decimal_places=4)
    tipo_iva = models.CharField(max_length=1)
    autorizado = models.CharField(max_length=1)
    anulado = models.CharField(max_length=1)
    cod_usuario = models.ForeignKey(Usuarios, db_column='cod_usuario')
    rf_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    caja = models.CharField(max_length=60, blank=True, null=True)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    asentadocv = models.CharField(max_length=1, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    cod_cajero = models.ForeignKey(Usuarios, db_column='cod_cajero', blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    codplancta_dif = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_dif = models.CharField(max_length=11, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    total_diferido = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_venta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    empresacompra = models.ForeignKey(Factcab, db_column='empresacompra', blank=True, null=True)
    codprovcompra = models.CharField(max_length=4, blank=True, null=True)
    nrofactcompra = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    totaldctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctoexen_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descuento2do = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    tot2dodctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldescuento = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montopagado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    vuelto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    sectorfacturacion = models.CharField(max_length=12, blank=True, null=True)
    comp_numero_orig = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fechaentreganc = models.DateTimeField(blank=True, null=True)
    usuario_chg_nro = models.CharField(max_length=16, blank=True, null=True)
    fecha_chg_numero = models.DateTimeField(blank=True, null=True)
    nrocaja = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    nroservicio = models.CharField(max_length=20, blank=True, null=True)
    cod_tp_comp_orig = models.CharField(max_length=4, blank=True, null=True)
    modfecha = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    rf_comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    to_gravado_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    to_gravado_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    cod_tp_compcompra = models.CharField(max_length=4, blank=True, null=True)
    empresadevolucion = models.ForeignKey(Factcab, db_column='empresadevolucion', blank=True, null=True)
    cod_tp_compdevol = models.CharField(max_length=4, blank=True, null=True)
    nro_proforma = models.ForeignKey(ProformaCab, db_column='nro_proforma', blank=True, null=True)
    codtpsolcred = models.CharField(max_length=4, blank=True, null=True)
    compnrosolcred = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    anulado_el = models.DateTimeField(blank=True, null=True)
    anulado_por = models.CharField(max_length=16, blank=True, null=True)
    cargado_el = models.DateTimeField(blank=True, null=True)
    cargado_por = models.CharField(max_length=16, blank=True, null=True)
    cod_camion = models.CharField(max_length=8, blank=True, null=True)
    nro_chofer = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True)
    nrotransaccv = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    nrotimb = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_establecimiento = models.CharField(max_length=3, blank=True, null=True)
    cod_ptoexpedicion = models.CharField(max_length=3, blank=True, null=True)
    cod_tipodoc = models.CharField(max_length=4, blank=True, null=True)
    comp_nro_timb = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    nro_oc = models.CharField(max_length=25, blank=True, null=True)
    inc_precios = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    recalculado = models.CharField(max_length=1, blank=True, null=True)
    reg_turismo = models.CharField(max_length=2, blank=True, null=True)
    cod_vendedor_sup = models.ForeignKey(Vendedor, db_column='cod_vendedor_sup', blank=True, null=True)
    cod_televendedor = models.CharField(max_length=4, blank=True, null=True)
    factcambiocli = models.DecimalField(max_digits=6, decimal_places=0, blank=True, null=True)
    densidad = models.DecimalField(max_digits=7, decimal_places=3, blank=True, null=True)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_tp_comp_vend_planilla = models.CharField(max_length=4, blank=True, null=True)
    comp_numero_vend_planilla = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    autorizado_el = models.DateTimeField(blank=True, null=True)
    autorizado_por = models.CharField(max_length=16, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vtacab'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero'),)


class VtacabCostos(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0)
    fha_cbte = models.DateTimeField()
    cod_con_vta = models.CharField(max_length=2)
    cod_tp_pago = models.CharField(max_length=2)
    tipo_vta = models.CharField(max_length=2)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    com_vendedor = models.DecimalField(max_digits=4, decimal_places=2)
    comisman = models.CharField(max_length=1)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    to_exento = models.DecimalField(max_digits=19, decimal_places=4)
    to_gravado = models.DecimalField(max_digits=19, decimal_places=4)
    total_iva = models.DecimalField(max_digits=19, decimal_places=4)
    tipo_iva = models.CharField(max_length=1)
    autorizado = models.CharField(max_length=1)
    anulado = models.CharField(max_length=1)
    cod_usuario = models.CharField(max_length=16)
    rf_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    caja = models.CharField(max_length=60, blank=True, null=True)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    asentadocv = models.CharField(max_length=1, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    cod_cajero = models.CharField(max_length=16, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    codplancta_dif = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_dif = models.CharField(max_length=11, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    total_diferido = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_venta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    empresacompra = models.CharField(max_length=2, blank=True, null=True)
    codprovcompra = models.CharField(max_length=4, blank=True, null=True)
    nrofactcompra = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    totaldctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctoexen_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descuento2do = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    tot2dodctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldescuento = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montopagado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    vuelto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    sectorfacturacion = models.CharField(max_length=12, blank=True, null=True)
    comp_numero_orig = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fechaentreganc = models.DateTimeField(blank=True, null=True)
    usuario_chg_nro = models.CharField(max_length=16, blank=True, null=True)
    fecha_chg_numero = models.DateTimeField(blank=True, null=True)
    nrocaja = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    nroservicio = models.CharField(max_length=20, blank=True, null=True)
    cod_tp_comp_orig = models.CharField(max_length=4, blank=True, null=True)
    modfecha = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    rf_comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    to_gravado_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    to_gravado_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    cod_tp_compcompra = models.CharField(max_length=4, blank=True, null=True)
    empresadevolucion = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_compdevol = models.CharField(max_length=4, blank=True, null=True)
    nro_proforma = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    codtpsolcred = models.CharField(max_length=4, blank=True, null=True)
    compnrosolcred = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    anulado_el = models.DateTimeField(blank=True, null=True)
    anulado_por = models.CharField(max_length=16, blank=True, null=True)
    cargado_el = models.DateTimeField(blank=True, null=True)
    cargado_por = models.CharField(max_length=16, blank=True, null=True)
    cod_camion = models.CharField(max_length=8, blank=True, null=True)
    nro_chofer = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True)
    nrotransaccv = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vtacab_costos'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero'),)


class VtacabExterno(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    nrofacturacliente = models.DecimalField(max_digits=15, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0)
    fha_cbte = models.DateTimeField()
    cod_con_vta = models.CharField(max_length=2)
    cod_tp_pago = models.CharField(max_length=2)
    tipo_vta = models.CharField(max_length=2)
    cod_vendedor = models.CharField(max_length=8, blank=True, null=True)
    com_vendedor = models.DecimalField(max_digits=4, decimal_places=2)
    comisman = models.CharField(max_length=1)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    to_exento = models.DecimalField(max_digits=19, decimal_places=4)
    to_gravado = models.DecimalField(max_digits=19, decimal_places=4)
    total_iva = models.DecimalField(max_digits=19, decimal_places=4)
    tipo_iva = models.CharField(max_length=1)
    autorizado = models.CharField(max_length=1)
    anulado = models.CharField(max_length=1)
    cod_usuario = models.CharField(max_length=16)
    rf_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    caja = models.CharField(max_length=60, blank=True, null=True)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    asentadocv = models.CharField(max_length=1, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    cod_cajero = models.CharField(max_length=16, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    codplancta_dif = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_dif = models.CharField(max_length=11, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    total_diferido = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_venta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    empresacompra = models.CharField(max_length=2, blank=True, null=True)
    codprovcompra = models.CharField(max_length=4, blank=True, null=True)
    nrofactcompra = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    totaldctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctoexen_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descuento2do = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    tot2dodctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldescuento = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montopagado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    vuelto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    sectorfacturacion = models.CharField(max_length=12, blank=True, null=True)
    comp_numero_orig = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fechaentreganc = models.DateTimeField(blank=True, null=True)
    usuario_chg_nro = models.CharField(max_length=16, blank=True, null=True)
    fecha_chg_numero = models.DateTimeField(blank=True, null=True)
    nrocaja = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    nroservicio = models.CharField(max_length=20, blank=True, null=True)
    cod_tp_comp_orig = models.CharField(max_length=4, blank=True, null=True)
    modfecha = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    rf_comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    to_gravado_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    to_gravado_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    cod_tp_compcompra = models.CharField(max_length=4, blank=True, null=True)
    empresadevolucion = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_compdevol = models.CharField(max_length=4, blank=True, null=True)
    nro_proforma = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    codtpsolcred = models.CharField(max_length=4, blank=True, null=True)
    compnrosolcred = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    anulado_el = models.DateTimeField(blank=True, null=True)
    anulado_por = models.CharField(max_length=16, blank=True, null=True)
    cargado_el = models.DateTimeField(blank=True, null=True)
    cargado_por = models.CharField(max_length=16, blank=True, null=True)
    cod_camion = models.CharField(max_length=8, blank=True, null=True)
    nro_chofer = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True)
    nrotransaccv = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    nrotimb = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_establecimiento = models.CharField(max_length=3, blank=True, null=True)
    cod_ptoexpedicion = models.CharField(max_length=3, blank=True, null=True)
    cod_tipodoc = models.CharField(max_length=4, blank=True, null=True)
    comp_nro_timb = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    nro_oc = models.CharField(max_length=10, blank=True, null=True)
    lista_prec_dcto = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    reg_turismo = models.CharField(max_length=2, blank=True, null=True)
    inc_precios = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    recalculado = models.CharField(max_length=1, blank=True, null=True)
    cod_vendedor_sup = models.CharField(max_length=4, blank=True, null=True)
    cod_televendedor = models.CharField(max_length=4, blank=True, null=True)
    factcambiocli = models.DecimalField(max_digits=6, decimal_places=0, blank=True, null=True)
    densidad = models.DecimalField(max_digits=7, decimal_places=3, blank=True, null=True)
    nroplanilla = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_tp_comp_vend_planilla = models.CharField(max_length=4, blank=True, null=True)
    comp_numero_vend_planilla = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    autorizado_el = models.DateTimeField(blank=True, null=True)
    autorizado_por = models.CharField(max_length=16, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vtacab_externo'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero'),)


class VtacabSync(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0)
    fha_cbte = models.DateTimeField()
    cod_con_vta = models.CharField(max_length=2)
    cod_tp_pago = models.CharField(max_length=2)
    tipo_vta = models.CharField(max_length=2)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    com_vendedor = models.DecimalField(max_digits=4, decimal_places=2)
    comisman = models.CharField(max_length=1)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    to_exento = models.DecimalField(max_digits=19, decimal_places=4)
    to_gravado = models.DecimalField(max_digits=19, decimal_places=4)
    total_iva = models.DecimalField(max_digits=19, decimal_places=4)
    tipo_iva = models.CharField(max_length=1)
    autorizado = models.CharField(max_length=1)
    anulado = models.CharField(max_length=1)
    cod_usuario = models.CharField(max_length=16)
    rf_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    caja = models.CharField(max_length=60, blank=True, null=True)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    asentadocv = models.CharField(max_length=1, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    cod_cajero = models.CharField(max_length=16, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    codplancta_dif = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_dif = models.CharField(max_length=11, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    total_diferido = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_venta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=17, decimal_places=0, blank=True, null=True)
    empresacompra = models.CharField(max_length=2, blank=True, null=True)
    codprovcompra = models.CharField(max_length=4, blank=True, null=True)
    nrofactcompra = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    totaldctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctoexen_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descuento2do = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    tot2dodctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldescuento = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vtacab_sync'


class VtacabUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)
    cod_cliente = models.CharField(max_length=8, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0)
    fha_cbte = models.DateTimeField()
    cod_con_vta = models.CharField(max_length=2)
    cod_tp_pago = models.CharField(max_length=2)
    tipo_vta = models.CharField(max_length=2)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    com_vendedor = models.DecimalField(max_digits=4, decimal_places=2)
    comisman = models.CharField(max_length=1)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    to_exento = models.DecimalField(max_digits=19, decimal_places=4)
    to_gravado = models.DecimalField(max_digits=19, decimal_places=4)
    total_iva = models.DecimalField(max_digits=19, decimal_places=4)
    tipo_iva = models.CharField(max_length=1)
    autorizado = models.CharField(max_length=1)
    anulado = models.CharField(max_length=1)
    cod_usuario = models.CharField(max_length=16)
    rf_tp_comp = models.CharField(max_length=4, blank=True, null=True)
    rf_comp_numero = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    caja = models.CharField(max_length=60, blank=True, null=True)
    asentado = models.CharField(max_length=1, blank=True, null=True)
    asentadocv = models.CharField(max_length=1, blank=True, null=True)
    razon_social = models.CharField(max_length=40, blank=True, null=True)
    direccion = models.CharField(max_length=80, blank=True, null=True)
    ruc = models.CharField(max_length=14, blank=True, null=True)
    telefono = models.CharField(max_length=25, blank=True, null=True)
    cod_cajero = models.CharField(max_length=16, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    codplancta_dif = models.CharField(max_length=11, blank=True, null=True)
    codplanaux_dif = models.CharField(max_length=11, blank=True, null=True)
    nrotransac = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    total_diferido = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_venta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codprov = models.CharField(max_length=4, blank=True, null=True)
    nrofact = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    empresacompra = models.CharField(max_length=2, blank=True, null=True)
    codprovcompra = models.CharField(max_length=4, blank=True, null=True)
    nrofactcompra = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    totaldctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctoexen_d = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descuento2do = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    tot2dodctoexen = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldescuento = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    montopagado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    vuelto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    sectorfacturacion = models.CharField(max_length=12, blank=True, null=True)
    comp_numero_orig = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    fechaentreganc = models.DateTimeField(blank=True, null=True)
    usuario_chg_nro = models.CharField(max_length=16, blank=True, null=True)
    fecha_chg_numero = models.DateTimeField(blank=True, null=True)
    nrocaja = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    nroservicio = models.CharField(max_length=20, blank=True, null=True)
    cod_tp_comp_orig = models.CharField(max_length=4, blank=True, null=True)
    modfecha = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    rf_comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    observ = models.CharField(max_length=250, blank=True, null=True)
    to_gravado_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva_5 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    to_gravado_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    totaldctograv_d_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tot2dodctograv_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_iva_10 = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    cod_tp_compcompra = models.CharField(max_length=4, blank=True, null=True)
    empresadevolucion = models.CharField(max_length=2, blank=True, null=True)
    cod_tp_compdevol = models.CharField(max_length=4, blank=True, null=True)
    nro_proforma = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    codtpsolcred = models.CharField(max_length=4, blank=True, null=True)
    compnrosolcred = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    nroserie = models.CharField(max_length=12, blank=True, null=True)
    anulado_el = models.DateTimeField(blank=True, null=True)
    anulado_por = models.CharField(max_length=16, blank=True, null=True)
    cargado_el = models.DateTimeField(blank=True, null=True)
    cargado_por = models.CharField(max_length=16, blank=True, null=True)
    cod_camion = models.CharField(max_length=8, blank=True, null=True)
    nro_chofer = models.DecimalField(max_digits=8, decimal_places=0, blank=True, null=True)
    nrotransaccv = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    nrotimb = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)
    cod_establecimiento = models.CharField(max_length=3, blank=True, null=True)
    cod_ptoexpedicion = models.CharField(max_length=3, blank=True, null=True)
    cod_tipodoc = models.CharField(max_length=4, blank=True, null=True)
    comp_nro_timb = models.DecimalField(max_digits=15, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vtacab_unif'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero'),)


class Vtacabcomision(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_venta = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    total_comision = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    saldo_comision = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porc_comision = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fechaproceso = models.DateTimeField(blank=True, null=True)
    usuarioproceso = models.CharField(max_length=16, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vtacabcomision'


class Vtacabcomisionpago(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_compvta = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_tp_comppago = models.CharField(max_length=4)
    pago_numero = models.DecimalField(max_digits=7, decimal_places=0)
    cod_tp_pago = models.CharField(max_length=2)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    importe_comision = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codmoneda = models.CharField(max_length=2, blank=True, null=True)
    fact_cambio = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    fechaproceso = models.DateTimeField(blank=True, null=True)
    usuarioproceso = models.CharField(max_length=16, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vtacabcomisionpago'
        unique_together = (('cod_empresa', 'cod_tp_compvta', 'comp_numero', 'cod_tp_comppago', 'pago_numero', 'cod_tp_pago'),)


class Vtadet(models.Model):
    cod_empresa = models.ForeignKey(Vtacab, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=2, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4)
    total = models.DecimalField(max_digits=19, decimal_places=4)
    cod_vendedor = models.ForeignKey(Vendedor, db_column='cod_vendedor', blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descrip = models.CharField(max_length=500, blank=True, null=True)
    cantcajas = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    tp_remis = models.CharField(max_length=4, blank=True, null=True)
    nro_remis = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    manual = models.CharField(max_length=1, blank=True, null=True)
    totaldcto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    cantminima = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cod_juego = models.CharField(max_length=14, blank=True, null=True)
    cantjuego = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    total_neto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tp_presup = models.CharField(max_length=4, blank=True, null=True)
    nro_presup = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    tp_ref_nc = models.CharField(max_length=4, blank=True, null=True)
    nro_ref_nc = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    prt_cod_deposito = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_cod_articulo = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_cantidad = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_pr_unit = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_descuento = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_totaldcto = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_total = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    descuento_cant = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    manual_dcto = models.CharField(max_length=1, blank=True, null=True)
    cod_comodato = models.CharField(max_length=14, blank=True, null=True)
    linea_presup = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    ordenfact = models.DecimalField(max_digits=13, decimal_places=0, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    linea_ref_nc = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    nrodescarga = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    porcpartgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montopartgravado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cta_cont = models.CharField(max_length=11, blank=True, null=True)
    cta_vta = models.CharField(max_length=11, blank=True, null=True)
    cta_vtactme = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrgs = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrme = models.CharField(max_length=11, blank=True, null=True)
    cta_costo = models.CharField(max_length=11, blank=True, null=True)
    peso_bruto = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    peso_tara = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    peso_promedio = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    cod_taras = models.CharField(max_length=24, blank=True, null=True)
    sucursal_orig = models.CharField(max_length=2, blank=True, null=True)
    agrupador = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    precio_base = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    lista_base = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    pr_unit_financ = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    porc_financ = models.DecimalField(max_digits=20, decimal_places=18, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vtadet'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'linea'),)


class VtadetCostos(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=2, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4)
    total = models.DecimalField(max_digits=19, decimal_places=4)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descrip = models.CharField(max_length=500, blank=True, null=True)
    cantcajas = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    tp_remis = models.CharField(max_length=4, blank=True, null=True)
    nro_remis = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    manual = models.CharField(max_length=1, blank=True, null=True)
    totaldcto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    cantminima = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cod_juego = models.CharField(max_length=14, blank=True, null=True)
    cantjuego = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    total_neto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tp_presup = models.CharField(max_length=4, blank=True, null=True)
    nro_presup = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    tp_ref_nc = models.CharField(max_length=4, blank=True, null=True)
    nro_ref_nc = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    prt_cod_deposito = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_cod_articulo = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_cantidad = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_pr_unit = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_descuento = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_totaldcto = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_total = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    descuento_cant = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    manual_dcto = models.CharField(max_length=1, blank=True, null=True)
    cod_comodato = models.CharField(max_length=14, blank=True, null=True)
    linea_presup = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    ordenfact = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    linea_ref_nc = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    nrodescarga = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    porcpartgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montopartgravado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vtadet_costos'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'linea'),)


class VtadetExterno(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=2, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4)
    total = models.DecimalField(max_digits=19, decimal_places=4)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descrip = models.CharField(max_length=500, blank=True, null=True)
    cantcajas = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    tp_remis = models.CharField(max_length=4, blank=True, null=True)
    nro_remis = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    manual = models.CharField(max_length=1, blank=True, null=True)
    totaldcto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    cantminima = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cod_juego = models.CharField(max_length=14, blank=True, null=True)
    cantjuego = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    total_neto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tp_presup = models.CharField(max_length=4, blank=True, null=True)
    nro_presup = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    tp_ref_nc = models.CharField(max_length=4, blank=True, null=True)
    nro_ref_nc = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    prt_cod_deposito = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_cod_articulo = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_cantidad = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_pr_unit = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_descuento = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_totaldcto = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_total = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    descuento_cant = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    manual_dcto = models.CharField(max_length=1, blank=True, null=True)
    cod_comodato = models.CharField(max_length=14, blank=True, null=True)
    linea_presup = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    ordenfact = models.DecimalField(max_digits=13, decimal_places=0, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    linea_ref_nc = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    nrodescarga = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    porcpartgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montopartgravado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cta_cont = models.CharField(max_length=11, blank=True, null=True)
    cta_vta = models.CharField(max_length=11, blank=True, null=True)
    cta_vtactme = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrgs = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrme = models.CharField(max_length=11, blank=True, null=True)
    cta_costo = models.CharField(max_length=11, blank=True, null=True)
    peso_bruto = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    peso_tara = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    peso_promedio = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    cod_taras = models.CharField(max_length=24, blank=True, null=True)
    sucursal_orig = models.CharField(max_length=2, blank=True, null=True)
    agrupador = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vtadet_externo'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'linea'),)


class VtadetSync(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=2, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4)
    total = models.DecimalField(max_digits=19, decimal_places=4)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descrip = models.CharField(max_length=500, blank=True, null=True)
    tp_remis = models.CharField(max_length=4, blank=True, null=True)
    nro_remis = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    manual = models.CharField(max_length=1, blank=True, null=True)
    cantcajas = models.DecimalField(max_digits=6, decimal_places=2)
    totaldcto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vtadet_sync'


class VtadetUnif(models.Model):
    cod_empresa = models.CharField(max_length=2)
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=2, decimal_places=0)
    cod_sucursal = models.CharField(max_length=2)
    cod_deposito = models.CharField(max_length=2)
    cod_articulo = models.CharField(max_length=14)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3)
    descuento = models.DecimalField(max_digits=4, decimal_places=2)
    pr_unit = models.DecimalField(max_digits=19, decimal_places=4)
    total = models.DecimalField(max_digits=19, decimal_places=4)
    cod_vendedor = models.CharField(max_length=4, blank=True, null=True)
    cod_iva = models.CharField(max_length=1, blank=True, null=True)
    iva = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cto_prom_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_prom_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_gs = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cto_ult_me = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    descrip = models.CharField(max_length=500, blank=True, null=True)
    cantcajas = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    tp_remis = models.CharField(max_length=4, blank=True, null=True)
    nro_remis = models.DecimalField(max_digits=9, decimal_places=0, blank=True, null=True)
    manual = models.CharField(max_length=1, blank=True, null=True)
    totaldcto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    codplancta = models.CharField(max_length=11, blank=True, null=True)
    codplanaux = models.CharField(max_length=11, blank=True, null=True)
    cantminima = models.DecimalField(max_digits=13, decimal_places=2, blank=True, null=True)
    cod_juego = models.CharField(max_length=14, blank=True, null=True)
    cantjuego = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    total_neto = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    tp_presup = models.CharField(max_length=4, blank=True, null=True)
    nro_presup = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    tp_ref_nc = models.CharField(max_length=4, blank=True, null=True)
    nro_ref_nc = models.DecimalField(max_digits=7, decimal_places=0, blank=True, null=True)
    prt_cod_deposito = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_lista_prec = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_cod_articulo = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_cantidad = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_pr_unit = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_descuento = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_totaldcto = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    prt_total = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    descuento_cant = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    manual_dcto = models.CharField(max_length=1, blank=True, null=True)
    cod_comodato = models.CharField(max_length=14, blank=True, null=True)
    linea_presup = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    ordenfact = models.DecimalField(max_digits=13, decimal_places=0, blank=True, null=True)
    comp_nro_orig = models.CharField(max_length=25, blank=True, null=True)
    periodo = models.CharField(max_length=8, blank=True, null=True)
    linea_ref_nc = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    nrodescarga = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    porcpartgravado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    montopartgravado = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cta_cont = models.CharField(max_length=11, blank=True, null=True)
    cta_vta = models.CharField(max_length=11, blank=True, null=True)
    cta_vtactme = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrgs = models.CharField(max_length=11, blank=True, null=True)
    cta_vtacrme = models.CharField(max_length=11, blank=True, null=True)
    cta_costo = models.CharField(max_length=11, blank=True, null=True)
    peso_bruto = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    peso_tara = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    peso_promedio = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    cod_taras = models.CharField(max_length=24, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vtadet_unif'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'linea'),)


class Vtadettara(models.Model):
    cod_empresa = models.ForeignKey(Vtadet, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    lineavtadet = models.DecimalField(max_digits=2, decimal_places=0)
    linea = models.DecimalField(max_digits=2, decimal_places=0)
    cod_tara = models.ForeignKey(Tara, db_column='cod_tara', blank=True, null=True)
    cantidad = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    peso = models.DecimalField(max_digits=13, decimal_places=3, blank=True, null=True)
    calcula_promedio = models.CharField(max_length=1, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vtadettara'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'lineavtadet', 'linea'),)


class Vtaserie(models.Model):
    cod_empresa = models.ForeignKey(Vtadet, db_column='cod_empresa')
    cod_tp_comp = models.CharField(max_length=4)
    comp_numero = models.DecimalField(max_digits=7, decimal_places=0)
    linea = models.DecimalField(max_digits=2, decimal_places=0)
    lineaserie = models.DecimalField(max_digits=4, decimal_places=0)
    nroserie = models.CharField(max_length=20, blank=True, null=True)
    observ = models.CharField(max_length=100, blank=True, null=True)
    fechagarantia = models.DateTimeField(blank=True, null=True)
    idarticulo = models.IntegerField(blank=True, null=True)
    iddeposito = models.IntegerField(blank=True, null=True)
    importe = models.DecimalField(max_digits=19, decimal_places=4, blank=True, null=True)
    cod_articulo = models.CharField(max_length=14, blank=True, null=True)
    marca = models.CharField(max_length=30, blank=True, null=True)
    modelo = models.CharField(max_length=30, blank=True, null=True)
    nromotor = models.CharField(max_length=30, blank=True, null=True)
    color = models.CharField(max_length=30, blank=True, null=True)
    nro_certif = models.DecimalField(max_digits=13, decimal_places=0, blank=True, null=True)
    cod_sucursal = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vtaserie'
        unique_together = (('cod_empresa', 'cod_tp_comp', 'comp_numero', 'linea', 'lineaserie'),)


class Zonavta(models.Model):
    cod_zona = models.CharField(primary_key=True, max_length=3)
    des_zona = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'zonavta'


class ZonavtaSync(models.Model):
    cod_zona = models.CharField(max_length=3)
    des_zona = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'zonavta_sync'
