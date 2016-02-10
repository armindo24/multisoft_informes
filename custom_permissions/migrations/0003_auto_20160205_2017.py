# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_permissions', '0002_auto_20160205_1448'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='custompermissions',
            options={'permissions': (('entrar_finanzas', 'Finanzas'), ('entrar_ventas', 'Ventas'), ('entrar_admin', 'Admin'), ('informe_mayorcuentaauxiliar', 'Libro Mayor de Auxiliares'))},
        ),
        migrations.AlterModelOptions(
            name='usuarioempresa',
            options={'permissions': (('entrar_asignacion', 'Asignacion de Empresas'),)},
        ),
    ]
