import json
from custom_permissions.models import UsuarioEmpresa
from django.core import serializers

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
        return json.dumps([])


def save_permisos_empresa(request, usuario, empresas):
    try:
        # Normalizar cuando llega un solo valor en string o un JSON stringificado
        if isinstance(empresas, str):
            try:
                parsed = json.loads(empresas)
                empresas = parsed
            except Exception:
                empresas = [empresas]
        if not empresas:
            return json.dumps("sucess")
        for empresa in empresas:
            new_empresa = empresa.split('-')
            if len(new_empresa) < 2:
                continue
            emp_val = new_empresa[0]
            db_val = new_empresa[1].strip()
            if db_val.lower() == 'integrado':
                db_val = 'Integrado'
            elif db_val.lower() == 'sueldo':
                db_val = 'Sueldo'
            if not UsuarioEmpresa.objects.filter(user_id=usuario, empresa=emp_val, db=db_val).exists():
                usuarioempresa = UsuarioEmpresa()
                usuarioempresa.user_id = usuario
                usuarioempresa.empresa = emp_val
                usuarioempresa.db = db_val
                usuarioempresa.save()
        return json.dumps("sucess")
    except:
        return json.dumps("fail")
