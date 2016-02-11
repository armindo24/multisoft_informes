from django.conf import settings
from django.contrib.auth.management import create_permissions
from django.contrib.auth.models import User, Permission
from django.db import models

permissions_list = (("entrar_finanzas", "Finanzas"),
                   ("entrar_ventas", "Ventas"),
                   ("entrar_admin", "Admin"),
                    #---------------- ("informe_balancegeneral", "Balance General"),
                    # ("informe_balancegeneralcomprobado", "Balance General Comprobado"),
                    #--------------------------- ("informe_diario", "Libro Diario"),
                    #------------- ("informe_mayorcuenta", "Libro Mayor de Cuenta"),
                    #--------------------- ("informe_ordenpago", "Ordenes de Pago"),
                    #("informe_mayorcuentaauxiliar", "Libro Mayor de Auxiliares"),
                    #("informe_ventascomprobante", "Ventas por Comprobante"),
                   )

class CustomPermissions(models.Model):
    class Meta:
        permissions = permissions_list
    
class UsuarioEmpresa(models.Model):
    class Meta:
        permissions = (("entrar_asignacion", "Asignacion de Empresas"),)
    user = models.ForeignKey(User)
    empresa = models.CharField(max_length=30)
