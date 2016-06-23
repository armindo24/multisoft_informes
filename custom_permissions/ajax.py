from dajaxice.decorators import dajaxice_register
import json
from custom_permissions.models import UsuarioEmpresa
from django.core import serializers

@dajaxice_register
def get_permisos_empresa(request, usuario):
    permisos_cargados = UsuarioEmpresa.objects.filter(user_id=usuario)
    if permisos_cargados:
        datos = []
        for permiso in permisos_cargados:
            dato = {
                'empresa': permiso.empresa,
                'db': permiso.db,
            }
            datos.append(dato)
        return json.dumps(datos)
    else:
        return json.dumps('')


@dajaxice_register
def save_permisos_empresa(request, usuario, empresas):
    UsuarioEmpresa.objects.filter(user_id=usuario).delete()
    try:
        for empresa in empresas:
            new_empresa = empresa.split('-')
            usuarioempresa = UsuarioEmpresa()
            usuarioempresa.user_id = usuario
            usuarioempresa.empresa = new_empresa[0]
            usuarioempresa.db = new_empresa[1]
            usuarioempresa.save()
        return json.dumps("sucess")
    except:
        return json.dumps("fail")
