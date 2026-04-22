from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_permissions', '0007_alter_custompermissions_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='dbconfig',
            name='db_engine',
            field=models.CharField(choices=[('sqlanywhere', 'Sybase SQL Anywhere'), ('postgres', 'PostgreSQL')], default='sqlanywhere', max_length=20),
        ),
    ]

