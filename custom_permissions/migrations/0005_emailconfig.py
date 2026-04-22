# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_permissions', '0004_auto_20250825_1258'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmailConfig',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('enabled', models.BooleanField(default=False)),
                ('host', models.CharField(blank=True, default='', max_length=255)),
                ('port', models.IntegerField(default=25)),
                ('from_name', models.CharField(blank=True, default='', max_length=255)),
                ('from_email', models.CharField(blank=True, default='', max_length=255)),
                ('reply_to_name', models.CharField(blank=True, default='', max_length=255)),
                ('reply_to_email', models.CharField(blank=True, default='', max_length=255)),
                ('envelope_from', models.CharField(blank=True, default='', max_length=255)),
                ('use_ssl', models.BooleanField(default=False)),
                ('use_tls', models.BooleanField(default=False)),
                ('use_auth', models.BooleanField(default=False)),
                ('username', models.CharField(blank=True, default='', max_length=255)),
                ('password', models.CharField(blank=True, default='', max_length=255)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'permissions': (('config_email', 'Configuracion de Email'),),
            },
        ),
    ]
