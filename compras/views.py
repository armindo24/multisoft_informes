#from django.shortcuts import render, render_to_response
from django.shortcuts import render
from django.template.context import RequestContext
from django.contrib.auth.decorators import permission_required,login_required

# Create your views here.

@login_required
@permission_required('custom_permissions.informe_ordencompra')
def ordencompra(request):
    return render(request,'compras/ordencompra.html', {'user':request.user.id})

@login_required
@permission_required('custom_permissions.informe_compras')
def compras(request):
    return render(request,'compras/compras.html', {'user':request.user.id})

@login_required
@permission_required('custom_permissions.informe_compras')
def compras_articulo(request):
    return render(request,'compras/compras_articulo.html', {'user':request.user.id})

@login_required
@permission_required('custom_permissions.informe_saldosproveedores')
def saldos_proveedores(request):
    return render(request,'compras/saldos_proveedores.html', {'user':request.user.id})

@login_required
@permission_required('custom_permissions.informe_fondofijo')
def fondo_fijo(request):
    return render(request,'compras/fondo_fijo.html', {'user':request.user.id})

@login_required
@permission_required('custom_permissions.informe_gastosrendir')
def gastos_rendir(request):
    return render(request,'compras/gastos_rendir.html', {'user':request.user.id})

@login_required
@permission_required('custom_permissions.informe_comprasestadisticos')
def compras_estadisticos(request):
    return render(request,'compras/estadisticos.html', {'user':request.user.id})
