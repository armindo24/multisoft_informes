from django.shortcuts import render, render_to_response
from django.template.context import RequestContext
from django.contrib.auth.decorators import permission_required

# Create your views here.

@permission_required('custom_permissions.informe_ordenpago')
def ordenpago(request):
    return render_to_response('finanzas/ordenpago.html', {}, context_instance=RequestContext(request))

@permission_required('custom_permissions.informe_balancegeneral')
def balancegeneral(request):
    return render_to_response('finanzas/balancegeneral.html', {}, context_instance=RequestContext(request))

@permission_required('custom_permissions.informe_balancegeneralcomprobado')
def balancegeneral_comprobado(request):
    return render_to_response('finanzas/balancegeneral_comprobado.html', {}, context_instance=RequestContext(request))

@permission_required('custom_permissions.informe_diario')
def diario_comprobado(request):
    return render_to_response('finanzas/diario_comprobado.html', {}, context_instance=RequestContext(request))

@permission_required('custom_permissions.informe_mayorcuenta')
def mayor_cuentas(request):
    return render_to_response('finanzas/mayor_cuentas.html', {}, context_instance=RequestContext(request))

# TODO: Add permission
# @permission_required('custom_permissions.informe_mayorcuenta')
def venta_resumido(request):
    return render_to_response('finanzas/venta_resumido.html', {}, context_instance=RequestContext(request))
