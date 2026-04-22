# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_permissions', '0005_emailconfig'),
    ]

    operations = [
        migrations.CreateModel(
            name='DbConfig',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('db_type', models.CharField(choices=[('postgres', 'Postgres'), ('integrado', 'Integrado'), ('sueldo', 'Sueldo')], max_length=20, unique=True)),
                ('host', models.CharField(blank=True, default='', max_length=255)),
                ('port', models.IntegerField(default=0)),
                ('server', models.CharField(blank=True, default='', max_length=255)),
                ('database', models.CharField(blank=True, default='', max_length=255)),
                ('username', models.CharField(blank=True, default='', max_length=255)),
                ('password', models.CharField(blank=True, default='', max_length=255)),
                ('disabled', models.BooleanField(default=False)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'permissions': (('config_db', 'Configuracion de Base de Datos'),),
            },
        ),
    ]
