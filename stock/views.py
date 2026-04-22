#from django.shortcuts import render, render_to_response
from django.shortcuts import render
from django.template.context import RequestContext
from django.contrib.auth.decorators import permission_required


@permission_required('custom_permissions.informe_articulos')
def articulos(request):
    return render(request,'stock/articulos.html', {'user': request.user.id})

@permission_required('custom_permissions.informe_precios')
def precios(request):
    return render(request,'stock/precios.html', {'user': request.user.id})

@permission_required('custom_permissions.informe_depositos')
def existencia_deposito(request):
    return render(request,'stock/existencia_deposito.html', {'user': request.user.id})

@permission_required('custom_permissions.informe_valorizado')
def valorizado(request):
    return render(request,'stock/valorizado.html', {'user': request.user.id})

@permission_required('custom_permissions.informe_ventascomprobante')
def ficha_productos(request):
    return render(request,'stock/ficha_productos.html', {'user': request.user.id})


@permission_required('custom_permissions.entrar_stock')
def costo_articulo_full(request):
    return render(request, 'stock/costo_articulo_full.html', {'user': request.user.id})
