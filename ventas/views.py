from django.shortcuts import render, render_to_response
from django.template.context import RequestContext
from django.contrib.auth.decorators import permission_required

# TODO: Add permission
@permission_required('custom_permissions.informe_ventascomprobante')
def venta_resumido(request):
    return render_to_response('ventas/resumido.html', {'user': request.user.id}, context_instance=RequestContext(request))

#TODO: customperm
def presupuesto(request):
    return render_to_response('ventas/presupuesto.html', {'user':request.user.id}, context_instance=RequestContext(request))

#TODO: customperm
def cuentas_cobrar(request):
    return render_to_response('ventas/cuentas_cobrar.html', {'user':request.user.id}, context_instance=RequestContext(request))

#TODO: customperm
def recaudaciones(request):
    return render_to_response('ventas/recaudaciones.html', {'user':request.user.id}, context_instance=RequestContext(request))