from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_permissions', '0008_dbconfig_db_engine'),
    ]

    operations = [
        migrations.AddField(
            model_name='dbconfig',
            name='engine_settings',
            field=models.JSONField(blank=True, default=dict),
        ),
    ]

