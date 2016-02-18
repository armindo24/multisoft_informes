# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_permissions', '0005_auto_20160215_1209'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='custompermissions',
            options={'permissions': (('entrar_finanzas', 'Finanzas'), ('entrar_ventas', 'Ventas'), ('entrar_admin', 'Admin'), ('informe_balancegeneral', 'Balance General'), ('informe_balancegeneralcomprobado', 'Balance General Comprobado'), ('informe_diario', 'Libro Diario'), ('informe_mayorcuenta', 'Libro Mayor de Cuenta'), ('informe_ordenpago', 'Ordenes de Pago'), ('informe_mayorcuentaauxiliar', 'Libro Mayor de Auxiliares'), ('informe_ventascomprobante', 'Ventas por Comprobante'), ('informe_extractocuenta', 'Extracto de Cuenta Bancaria'))},
        ),
    ]
