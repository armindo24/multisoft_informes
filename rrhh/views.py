from django.shortcuts import render, render_to_response
from django.template.context import RequestContext

# Create your views here.
#@permission_required('custom_permissions.informe_ventascomprobante')
def legajos(request):
    return render_to_response('rrhh/legajos.html', {'user': request.user.id}, context_instance=RequestContext(request))

def sueldos_jornales(request):
    return render_to_response('rrhh/sueldos_jornales.html', {'user': request.user.id}, context_instance=RequestContext(request))

def anticipos(request):
    return render_to_response('rrhh/anticipos.html', {'user': request.user.id}, context_instance=RequestContext(request))

def aguinaldos(request):
    return render_to_response('rrhh/aguinaldos.html', {'user': request.user.id}, context_instance=RequestContext(request))

def recibos(request):
    return render_to_response('rrhh/recibos.html', {'user': request.user.id}, context_instance=RequestContext(request))
