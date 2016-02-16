from django.shortcuts import render, render_to_response
from django.template.context import RequestContext
from django.contrib.auth.decorators import permission_required

# Create your views here.

@permission_required('custom_permissions.informe_ordenpago')
def ordenpago(request):
    return render_to_response('finanzas/ordenpago.html', {'user':request.user.id}, context_instance=RequestContext(request))

@permission_required('custom_permissions.informe_balancegeneral')
def balancegeneral(request):
    return render_to_response('finanzas/balancegeneral.html', {'user':request.user.id}, context_instance=RequestContext(request))

@permission_required('custom_permissions.informe_balancegeneralcomprobado')
def balancegeneral_comprobado(request):
    return render_to_response('finanzas/balancegeneral_comprobado.html', {'user':request.user.id}, context_instance=RequestContext(request))

@permission_required('custom_permissions.informe_diario')
def diario_comprobado(request):
    return render_to_response('finanzas/diario_comprobado.html', {'user':request.user.id}, context_instance=RequestContext(request))

@permission_required('custom_permissions.informe_mayorcuenta')
def mayor_cuentas(request):
    return render_to_response('finanzas/mayor_cuentas.html', {'user':request.user.id}, context_instance=RequestContext(request))

@permission_required('custom_permissions.informe_mayorcuentaauxiliar')
def mayor_cuentasauxiliar(request):
    return render_to_response('finanzas/mayor_cuentas_auxiliares.html', {'user': request.user.id}, context_instance=RequestContext(request))

@permission_required('custom_permissions.informe_extractocuenta')
def extracto_cuentas_banco(request):
    return render_to_response('finanzas/extracto_cuentas_banco.html', {'user': request.user.id}, context_instance=RequestContext(request))

@permission_required('custom_permissions.informe_centrocostos')
def centro_costos(request):
    return render_to_response('finanzas/centro_costos.html', {'user':request.user.id}, context_instance=RequestContext(request))