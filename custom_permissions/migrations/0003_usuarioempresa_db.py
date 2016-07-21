# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_permissions', '0002_auto_20160519_1628'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuarioempresa',
            name='db',
            field=models.CharField(max_length=10, null=True),
        ),
    ]
