# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_permissions', '0010_auto_20160411_1244'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='custompermissions',
            options={'permissions': (('entrar_finanzas', 'Finanzas'), ('entrar_ventas', 'Ventas'), ('entrar_compras', 'Compras'), ('entrar_rrhh', 'RRHH'), ('entrar_admin', 'Admin'), ('informe_balancegeneral', 'Balance General'), ('informe_balancegeneralcomprobado', 'Balance General Comprobado'), ('informe_diario', 'Libro Diario'), ('informe_mayorcuenta', 'Libro Mayor de Cuenta'), ('informe_ordenpago', 'Ordenes de Pago'), ('informe_mayorcuentaauxiliar', 'Libro Mayor de Auxiliares'), ('informe_ventascomprobante', 'Ventas por Comprobante'), ('informe_extractocuenta', 'Extracto de Cuenta Bancaria'), ('informe_centrocostos', 'Centro de Costos'), ('informe_bienactivo', 'Bien Activo'), ('informe_flujofondo', 'Flujo de Fondo'), ('informe_ordencompra', 'Orden de Compra'), ('informe_compras', 'Compras'), ('informe_saldosproveedores', 'Saldo a Proveedores'), ('informe_fondofijo', 'Fondo Fijo'), ('informe_gastosrendir', 'Rendicion de Gastos'), ('informe_comprasestadisticos', 'Estadisticos de Compras'), ('informe_presupuesto', 'Presupuestos'), ('informe_cuentascobrar', 'Cuentas por Cobrar'), ('informe_recaudaciones', 'Recaudaciones'), ('informe_ventaestadisticos', 'Estadisticos de Ventas'), ('informe_legajos', 'Legajos'), ('informe_sueldosjornales', 'Sueldos y Jornales'), ('informe_anticipos', 'Anticipos'), ('informe_aguinaldos', 'Aguinaldos'), ('informe_recibos', 'Recibos'))},
        ),
    ]
