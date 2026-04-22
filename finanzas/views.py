#from django.shortcuts import render, render_to_responsea
from django.shortcuts import render
from django.template.context import RequestContext
from django.contrib.auth.decorators import permission_required, login_required

# Create your views here.

@login_required
@permission_required('custom_permissions.informe_ordenpago', raise_exception=True)
def ordenpago(request):
    return render(request,'finanzas/ordenpago.html', {'user':request.user.id})

@login_required
@permission_required('custom_permissions.informe_ordenpago', raise_exception=True)
def ordenpago_financiero(request):
    return render(request,'finanzas/ordenpago_financiero.html', {'user':request.user.id})

@login_required
@permission_required('custom_permissions.informe_balancegeneral', raise_exception=True)
def balancegeneral(request):
    return render(request,'finanzas/balancegeneral.html', {'user':request.user.id})

@login_required
@permission_required('custom_permissions.informe_balancegeneralpuc', raise_exception=True)
def balancegeneral_puc(request):
    return render(request,'finanzas/balancegeneral_puc.html', {'user':request.user.id})

@login_required
@permission_required('custom_permissions.informe_balancegeneralcomprobado', raise_exception=True)
def balancegeneral_comprobado(request):
    return render(request,'finanzas/balancegeneral_comprobado.html', {'user':request.user.id})

@login_required
@permission_required('custom_permissions.informe_diario', raise_exception=True)
def diario_comprobado(request):
    return render(request,'finanzas/diario_comprobado.html', {'user':request.user.id})

@login_required
@permission_required('custom_permissions.informe_mayorcuenta', raise_exception=True)
def mayor_cuentas(request):
    return render(request,'finanzas/mayor_cuentas.html', {'user':request.user.id})

@login_required
@permission_required('custom_permissions.informe_mayorcuentaauxiliar', raise_exception=True)
def mayor_cuentasauxiliar(request):
    return render(request,'finanzas/mayor_cuentas_auxiliares.html', {'user': request.user.id})

@login_required
@permission_required('custom_permissions.informe_extractocuenta', raise_exception=True)
def extracto_cuentas_banco(request):
    return render(request,'finanzas/extracto_cuentas_banco.html', {'user': request.user.id})

@login_required
@permission_required('custom_permissions.informe_centrocostos', raise_exception=True)
def centro_costos(request):
    return render(request,'finanzas/centro_costos.html', {'user':request.user.id})

@login_required
@permission_required('custom_permissions.informe_bienactivo', raise_exception=True)
def bienes_activo(request):
    filters = ['empresas', 'clientes']
    return render(request,'finanzas/bienes_activo.html', {'user':request.user.id, 'filters': filters})

@login_required
@permission_required('custom_permissions.informe_flujofondo', raise_exception=True)
def flujo_fondo(request):
    return render(request,'finanzas/flujodefondo.html', {'user':request.user.id})

@login_required
@permission_required('custom_permissions.informe_balancegeneral', raise_exception=True)
def dashboard_financiero(request):
    return render(request, 'finanzas/dashboard_financiero.html', {'user': request.user.id})

@login_required
@permission_required('custom_permissions.informe_balancegeneral', raise_exception=True)
def balance_integral(request):
    return render(request, 'finanzas/balance_integral.html', {'user': request.user.id})
