from django.shortcuts import render, render_to_response
from django.template.context import RequestContext
from django.contrib.auth.decorators import permission_required


# TODO: Permiso
def articulos(request):
    return render_to_response('stock/articulos.html', {'user': request.user.id},
                              context_instance=RequestContext(request))


# TODO: Permiso
def precios(request):
    return render_to_response('stock/precios.html', {'user': request.user.id},
                              context_instance=RequestContext(request))


# TODO: Permiso
def existencia_deposito(request):
    return render_to_response('stock/existencia_deposito.html', {'user': request.user.id},
                              context_instance=RequestContext(request))


# TODO: Permiso
def valorizado(request):
    return render_to_response('stock/valorizado.html', {'user': request.user.id},
                              context_instance=RequestContext(request))
# TODO: Permiso
def ficha_productos(request):
    return render_to_response('stock/ficha_productos.html', {'user': request.user.id},
                              context_instance=RequestContext(request))
