# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_permissions', '0007_merge'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='custompermissions',
            options={'permissions': (('entrar_finanzas', 'Finanzas'), ('entrar_ventas', 'Ventas'), ('entrar_compras', 'Compras'), ('entrar_admin', 'Admin'))},
        ),
    ]
