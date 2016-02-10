# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_permissions', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='custompermissions',
            options={'permissions': (('entrar_finanzas', 'Finanzas'), ('entrar_ventas', 'Ventas'), ('entrar_admin', 'Admin'))},
        ),
        migrations.AlterModelOptions(
            name='usuarioempresa',
            options={'permissions': ('entrar_asignacion', 'Asignacion de Empresas')},
        ),
    ]
