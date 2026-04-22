from django.conf import settings
from django.contrib.auth.management import create_permissions
from django.contrib.auth.models import User, Permission
from django.db import models

permissions_list = (
    ("entrar_finanzas", "Finanzas"),
    ("entrar_ventas", "Ventas"),
    ("entrar_stock", "Stock"),
    ("entrar_compras", "Compras"),
    ("entrar_rrhh", "RRHH"),
    ("entrar_admin", "Admin"),
    ("entrar_migraciones", "Migraciones"),
    ("entrar_produccion", "Produccion")
)

permissions_informes = (
    ("informe_balancegeneral", "Balance General"),
    ("informe_balancegeneralpuc", "Balance General PUC"),
    ("informe_balancegeneralcomprobado", "Balance General Comprobado"),
    ("informe_diario", "Libro Diario"),
    ("informe_mayorcuenta", "Libro Mayor de Cuenta"),
    ("informe_ordenpago", "Ordenes de Pago"),
    ("informe_mayorcuentaauxiliar", "Libro Mayor de Auxiliares"),
    ("informe_ventascomprobante", "Ventas por Comprobante"),
    ("informe_extractocuenta", "Extracto de Cuenta Bancaria"),
    ("informe_centrocostos", "Centro de Costos"),
    ("informe_bienactivo", "Bien Activo"),
    ("informe_flujofondo", "Flujo de Fondo"),
    ("informe_ordencompra", "Orden de Compra"),
    ("informe_compras", "Compras"),
    ("informe_saldosproveedores", "Saldo a Proveedores"),
    ("informe_fondofijo", "Fondo Fijo"),
    ("informe_gastosrendir", "Rendicion de Gastos"),
    ("informe_comprasestadisticos", "Estadisticos de Compras"),
    ("informe_presupuesto", "Presupuestos"),
    ("informe_cuentascobrar", "Cuentas por Cobrar"),
    ("informe_recaudaciones", "Recaudaciones"),
    ("informe_ventaestadisticos", "Estadisticos de Ventas"),
    ("informe_legajos", "Legajos"),
    ("informe_sueldosjornales", "Sueldos y Jornales"),
    ("informe_anticipos", "Anticipos"),
    ("informe_aguinaldos", "Aguinaldos"),
    ("informe_recibos", "Recibos"),
    ("informe_articulos", "General de Productos"),
    ("informe_depositos", "Existencias por Depositos"),
    ("informe_valorizado", "Existencias valorizadas"),
    ("informe_precios", "Control de Precios")
)

permissions_all = permissions_list + permissions_informes


class CustomPermissions(models.Model):
    class Meta:
        permissions = permissions_all


class UsuarioEmpresa(models.Model):
    class Meta:
        permissions = (("entrar_asignacion", "Asignacion de Empresas"),)

    #user = models.ForeignKey(User)
    from django.contrib.auth.models import User
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    empresa = models.CharField(max_length=30)
    db = models.CharField(max_length=10, null=True)


class EmailConfig(models.Model):
    class Meta:
        permissions = (("config_email", "Configuracion de Email"),)

    enabled = models.BooleanField(default=False)
    host = models.CharField(max_length=255, blank=True, default='')
    port = models.IntegerField(default=25)
    from_name = models.CharField(max_length=255, blank=True, default='')
    from_email = models.CharField(max_length=255, blank=True, default='')
    reply_to_name = models.CharField(max_length=255, blank=True, default='')
    reply_to_email = models.CharField(max_length=255, blank=True, default='')
    envelope_from = models.CharField(max_length=255, blank=True, default='')
    use_ssl = models.BooleanField(default=False)
    use_tls = models.BooleanField(default=False)
    use_auth = models.BooleanField(default=False)
    username = models.CharField(max_length=255, blank=True, default='')
    password = models.CharField(max_length=255, blank=True, default='')
    updated_at = models.DateTimeField(auto_now=True)


class DbConfig(models.Model):
    class Meta:
        permissions = (("config_db", "Configuracion de Base de Datos"),)

    DB_TYPES = (
        ('postgres', 'Postgres'),
        ('integrado', 'Integrado'),
        ('sueldo', 'Sueldo'),
    )

    db_type = models.CharField(max_length=20, choices=DB_TYPES, unique=True)
    db_engine = models.CharField(
        max_length=20,
        choices=(('sqlanywhere', 'Sybase SQL Anywhere'), ('postgres', 'PostgreSQL')),
        default='sqlanywhere'
    )
    host = models.CharField(max_length=255, blank=True, default='')
    port = models.IntegerField(default=0)
    server = models.CharField(max_length=255, blank=True, default='')
    database = models.CharField(max_length=255, blank=True, default='')
    username = models.CharField(max_length=255, blank=True, default='')
    password = models.CharField(max_length=255, blank=True, default='')
    engine_settings = models.JSONField(default=dict, blank=True)
    disabled = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
