from django.conf import settings
from django.contrib.auth.management import create_permissions
from django.db import models
from django.db.models.loading import  get_models, get_app
#from django.db.models.loading import get_apps, get_models



permissions_list = (("entrar_finanzas", "Finanzas"),
                   ("entrar_ventas", "Ventas"),
                   ("entrar_admin", "Admin"),
                   )

class CustomPermissions(models.Model):
    class Meta:
        permissions = permissions_list
    
    
def update_custom_permissions():
    create_permissions(get_app("custom_permissions"), get_models(), 2)