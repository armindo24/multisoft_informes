from django.contrib.auth.models import User
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import permission_required

@permission_required('custom_permissions.entrar_asignacion')
def asignar_empresa_usuario(request):
    users = User.objects.all()
    return render_to_response('custom_permissions/asignar_empresa_usuario.html',
                              {'usuarios':users}, context_instance=RequestContext(request))
    
    