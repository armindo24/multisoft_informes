from django.shortcuts import render, render_to_response
from django.template.context import RequestContext
from django.contrib.auth.decorators import permission_required

# Create your views here.

@permission_required('custom_permissions.informe_ordencompra')
def ordencompra(request):
    return render_to_response('compras/ordencompra.html', {'user':request.user.id}, context_instance=RequestContext(request))

@permission_required('custom_permissions.informe_compras')
def compras(request):
    return render_to_response('compras/compras.html', {'user':request.user.id}, context_instance=RequestContext(request))

@permission_required('custom_permissions.informe_compras')
def compras_articulo(request):
    return render_to_response('compras/compras_articulo.html', {'user':request.user.id}, context_instance=RequestContext(request))

@permission_required('custom_permissions.informe_saldosproveedores')
def saldos_proveedores(request):
    return render_to_response('compras/saldos_proveedores.html', {'user':request.user.id}, context_instance=RequestContext(request))

@permission_required('custom_permissions.informe_fondofijo')
def fondo_fijo(request):
    return render_to_response('compras/fondo_fijo.html', {'user':request.user.id}, context_instance=RequestContext(request))

@permission_required('custom_permissions.informe_gastosrendir')
def gastos_rendir(request):
    return render_to_response('compras/gastos_rendir.html', {'user':request.user.id}, context_instance=RequestContext(request))

@permission_required('custom_permissions.informe_comprasestadisticos')
def compras_estadisticos(request):
    return render_to_response('compras/estadisticos.html', {'user':request.user.id}, context_instance=RequestContext(request))