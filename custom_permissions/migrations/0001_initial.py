# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomPermissions',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
                'permissions': (('entrar_finanzas', 'Finanzas'), ('entrar_ventas', 'Ventas'), ('entrar_stock', 'Stock'), ('entrar_compras', 'Compras'), ('entrar_rrhh', 'RRHH'), ('entrar_admin', 'Admin')),
            },
        ),
        migrations.CreateModel(
            name='UsuarioEmpresa',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('empresa', models.CharField(max_length=30)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'permissions': (('entrar_asignacion', 'Asignacion de Empresas'),),
            },
        ),
    ]
