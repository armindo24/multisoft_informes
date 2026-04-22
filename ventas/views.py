#from django.shortcuts import render, render_to_response
from django.shortcuts import render
from django.template.context import RequestContext
from django.contrib.auth.decorators import permission_required

@permission_required('custom_permissions.informe_ventascomprobante')
def venta_resumido(request):
    return render(request,'ventas/resumido.html', {'user': request.user.id})

@permission_required('custom_permissions.informe_presupuesto')
def presupuesto(request):
    return render(request,'ventas/presupuesto.html', {'user':request.user.id})

@permission_required('custom_permissions.informe_cuentascobrar')
def cuentas_cobrar(request):
    return render(request,'ventas/cuentas_cobrar.html', {'user':request.user.id})

@permission_required('custom_permissions.informe_recaudaciones')
def recaudaciones(request):
    return render(request,'ventas/recaudaciones.html', {'user':request.user.id})

@permission_required('custom_permissions.informe_ventaestadisticos')
def estadisticas(request):
    return render(request,'ventas/estadisticas.html', {'user':request.user.id})
