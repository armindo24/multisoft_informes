# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_permissions', '0013_auto_20160511_1921'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='custompermissions',
            options={'permissions': (('entrar_finanzas', 'Finanzas'), ('entrar_ventas', 'Ventas'), ('entrar_stock', 'Stock'), ('entrar_compras', 'Compras'), ('entrar_rrhh', 'RRHH'), ('entrar_admin', 'Admin'))},
        ),
        migrations.AddField(
            model_name='usuarioempresa',
            name='db',
            field=models.CharField(max_length=10, null=True),
        ),
    ]
